import chokidar, { FSWatcher } from 'chokidar';
import { getLogger } from '../utils/logger';
import { ApiClient } from './api-client';
import { generateFileHash } from './file-hash';

/**
 * Configuração do File Watcher
 */
export interface FileWatcherConfig {
  watchDir: string;
  apiClient: ApiClient;
}

/**
 * Serviço para monitoramento de arquivos usando chokidar
 */
export class FileWatcherService {
  private readonly watcher: FSWatcher;
  private readonly apiClient: ApiClient;
  private readonly logger = getLogger();

  constructor(config: FileWatcherConfig) {
    this.apiClient = config.apiClient;

    // Configuração do chokidar
    this.watcher = chokidar.watch(config.watchDir, {
      ignored: /(^|[\/\\])\../, // Ignora arquivos ocultos (que começam com .)
      persistent: true,
      ignoreInitial: true, // Não processa arquivos que já existem ao iniciar
      awaitWriteFinish: {
        stabilityThreshold: 2000, // Aguarda 2 segundos de estabilidade
        pollInterval: 100, // Verifica a cada 100ms
      },
    });

    this.setupEventHandlers();
  }

  /**
   * Configura os handlers de eventos do watcher
   */
  private setupEventHandlers(): void {
    // Quando um novo arquivo é adicionado
    this.watcher.on('add', async (filePath: string) => {
      await this.handleFileAdded(filePath);
    });

    // Quando ocorre um erro no watcher
    this.watcher.on('error', (error: Error) => {
      this.logger.error(`Erro no watcher: ${error.message}`);
    });

    this.watcher.on('ready', () => {
      this.logger.info('Monitoramento iniciado com sucesso. Aguardando novos arquivos...');
    });
  }

  /**
   * Processa um arquivo recém-adicionado
   *
   * @param filePath - Caminho do arquivo adicionado
   */
  private async handleFileAdded(filePath: string): Promise<void> {
    try {
      this.logger.info(`[HASH] Arquivo detectado: ${filePath}`);

      // Gera o hash do arquivo
      const hashResult = await generateFileHash(filePath);

      this.logger.info(`[HASH] Hash Gerado (SHA256): ${hashResult.fileHash}`);

      // Envia o hash para a API
      const apiResponse = await this.apiClient.sendHash(hashResult);

      if (apiResponse.success) {
        this.logger.info(`[SUCCESS] ${apiResponse.message}. Status: ${apiResponse.statusCode}`);
      } else {
        this.logger.error(`[ERROR] ${apiResponse.message}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      // Trata erros específicos
      if (errorMessage.includes('não encontrado ou removido')) {
        this.logger.warn(`[WARN] ${errorMessage}`);
        return;
      }

      this.logger.error(`[ERROR] Erro ao processar arquivo ${filePath}: ${errorMessage}`);
    }
  }

  /**
   * Inicia o monitoramento de arquivos
   */
  start(): void {
    // O watcher já foi iniciado no construtor, mas podemos adicionar lógica adicional aqui se necessário
    this.logger.info('File Watcher Service iniciado');
  }

  /**
   * Para o monitoramento e fecha o watcher
   */
  async stop(): Promise<void> {
    this.logger.info('[INFO] Encerrando o monitoramento...');
    await this.watcher.close();
    this.logger.info('[INFO] Monitoramento encerrado');
  }
}
