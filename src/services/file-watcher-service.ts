import chokidar, { FSWatcher } from 'chokidar';
import { readdir, stat } from 'fs/promises';
import { extname, join } from 'path';
import { readCache, writeCache } from '../utils/cache';
import { getLogger } from '../utils/logger';
import { ApiClient } from './api-client';
import { generateFileHash } from './file-hash';
import { UploadQueue } from './upload-queue';

/**
 * Configuração do File Watcher
 */
export interface FileWatcherConfig {
  watchDir: string;
  apiClient: ApiClient;
  uploadQueue: UploadQueue;
  extensionFilter?: string;
  usePolling?: boolean;
  pollingIntervalMs?: number;
}

/**
 * Serviço para monitoramento de arquivos usando chokidar
 */
export class FileWatcherService {
  private readonly watcher: FSWatcher;
  private readonly uploadQueue: UploadQueue;
  private readonly logger = getLogger();
  private readonly extensionFilters: string[];
  private readonly watchDir: string;

  constructor(config: FileWatcherConfig) {
    this.uploadQueue = config.uploadQueue;
    this.extensionFilters = this.normalizeExtensions(config.extensionFilter);
    const extensionLabel = this.extensionFilters.join(', ') || 'nenhum (todos)';
    this.logger.debug(`Filtro de extensões: ${extensionLabel}`);
    this.watchDir = config.watchDir;

    // Configuração base do chokidar
    const chokidarOptions: chokidar.WatchOptions = {
      ignored: /(^|[\\/])\../, // Ignora arquivos ocultos (que começam com .)
      persistent: true,
      ignoreInitial: true, // Não processa arquivos que já existem ao iniciar
      awaitWriteFinish: {
        stabilityThreshold: 2000, // Aguarda 2 segundos de estabilidade
        pollInterval: 300, // Verifica a cada 300ms
      },
    };

    // Adiciona configurações de polling se habilitado
    if (config.usePolling) {
      const interval = config.pollingIntervalMs ?? 2000;
      chokidarOptions.usePolling = true;
      chokidarOptions.interval = interval;
      chokidarOptions.binaryInterval = interval; // Para comportamento consistente
      this.logger.debug(`Polling configurado com intervalo de ${interval}ms`);
    }

    this.watcher = chokidar.watch(config.watchDir, chokidarOptions);

    this.setupEventHandlers();
  }

  /**
   * Configura os handlers de eventos do watcher
   */
  private setupEventHandlers(): void {
    // Quando um novo arquivo é adicionado
    const processFile = async (filePath: string) => {
      await this.handleFileAdded(filePath);
    };

    this.watcher.on('add', processFile);
    this.watcher.on('change', processFile);

    // Quando ocorre um erro no watcher
    this.watcher.on('error', (error: Error) => {
      this.logger.error(`Erro no watcher: ${error.message}`);
    });

    this.watcher.on('ready', () => {
      this.logger.info('Monitoramento iniciado');
    });
  }

  async seedExistingFiles(): Promise<void> {
    await this.walkDirectory(this.watchDir);
  }

  private async walkDirectory(directory: string): Promise<void> {
    try {
      const entries = await readdir(directory, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(directory, entry.name);
        if (entry.isDirectory()) {
          await this.walkDirectory(fullPath);
          continue;
        }
        await this.handleFileAdded(fullPath);
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Processa um arquivo recém-adicionado
   *
   * @param filePath - Caminho do arquivo adicionado
   */
  private async handleFileAdded(filePath: string): Promise<void> {
    try {
      const stats = await stat(filePath);

      if (!this.shouldProcessFile(filePath)) {
        this.logger.debug(`Arquivo ignorado pelo filtro: ${filePath}`);
        return;
      }

      this.logger.debug(`Processando: ${filePath}`);

      const hashResult = await generateFileHash(filePath);

      const cached = await readCache(hashResult.fileHash);

      if (cached && cached.size === stats.size && cached.modifiedAt === stats.mtimeMs) {
        this.logger.debug(`Já processado (${hashResult.fileHash}) - ignorando.`);
        return;
      }

      // Enfileira o arquivo para upload com callback para escrever no cache após sucesso
      await this.uploadQueue.enqueue({
        filePath,
        hashResult,
        onSuccess: async (processedFilePath: string, processedHash: string) => {
          await writeCache({
            hash: processedHash,
            filePath: processedFilePath,
            processedAt: new Date().toISOString(),
            size: stats.size,
            modifiedAt: stats.mtimeMs,
          });
        },
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      if (errorMessage.includes('não encontrado ou removido')) {
        this.logger.warn(`[WARN] ${errorMessage}`);
        return;
      }

      this.logger.error(`[ERROR] Erro ao processar arquivo ${filePath}: ${errorMessage}`);
    }
  }

  /** Inicia o monitoramento de arquivos */
  start(): void {
    // O watcher já foi iniciado no construtor, mas podemos adicionar lógica adicional aqui se necessário
    // Serviço já iniciado no construtor
  }

  /** Para o monitoramento e fecha o watcher */
  async stop(): Promise<void> {
    this.logger.info('Encerrando monitoramento...');
    await this.watcher.close();
    await this.uploadQueue.stop();
    this.logger.info('Monitoramento encerrado');
  }

  private shouldProcessFile(filePath: string): boolean {
    if (!this.extensionFilters.length) return true;
    const extension = extname(filePath).toLowerCase();
    return this.extensionFilters.includes(extension);
  }

  private normalizeExtensions(raw?: string): string[] {
    if (!raw) return [];
    return raw
      .split(',')
      .map(value => value.trim())
      .filter(Boolean)
      .map(value => (value.startsWith('.') ? value.toLowerCase() : `.${value.toLowerCase()}`));
  }
}
