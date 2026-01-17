/* eslint-disable @typescript-eslint/no-floating-promises */
import 'dotenv/config';
import { existsSync } from 'fs';
import { stat } from 'fs/promises';
import { resolve } from 'path';
import { environment } from './config/environment';
import { APP_VERSION } from './config/version';
import { ApiClient } from './services/api-client';
import { AutoUpdate } from './services/auto-update';
import { generateFileHash } from './services/file-hash';
import { FileWatcherService } from './services/file-watcher-service';
import { UploadQueue } from './services/upload-queue';
import { validateApplicationDirectories } from './utils/directory';
import { initLogger, safeLogger } from './utils/logger';

/** Inicia a aplicação */
export async function runFileWatcher(): Promise<void> {
  let autoUpdate: AutoUpdate | null = null;

  try {
    const {
      WATCH_DIR,
      API_ENDPOINT,
      API_KEY,
      LOG_DIR,
      FILE_EXTENSION_FILTER,
      CACHE_DIR,
      QUEUE_CONCURRENCY,
      LOG_LEVEL,
      WATCH_POLLING_ENABLED,
      WATCH_POLLING_INTERVAL_MS,
      AUTO_UPDATE_ENABLED,
      AUTO_UPDATE_CHECK_INTERVAL_HOURS,
      AUTO_UPDATE_REPOSITORY,
      AUTO_UPDATE_SERVICE_NAME,
    } = environment;
    const logger = initLogger(LOG_DIR, LOG_LEVEL);

    logger.info(`File Watcher v${APP_VERSION} iniciado`);
    logger.debug(`Monitorando: ${WATCH_DIR}`);
    logger.debug(`API: ${API_ENDPOINT}`);
    logger.debug(`Logs: ${LOG_DIR}`);
    if (CACHE_DIR) logger.debug(`Cache: ${CACHE_DIR}`);
    logger.debug(`Concorrência: ${QUEUE_CONCURRENCY}`);

    const filterValue = FILE_EXTENSION_FILTER?.trim();
    if (filterValue) logger.debug(`Extensões: ${filterValue}`);

    if (WATCH_POLLING_ENABLED) {
      logger.info(`Modo polling habilitado (intervalo: ${WATCH_POLLING_INTERVAL_MS}ms)`);
      logger.warn(
        'ATENÇÃO: O modo polling pode ter impacto significativo em performance em diretórios com milhares de arquivos. Use apenas quando necessário (ex: compartilhamentos de rede/Samba).',
      );
    } else {
      logger.debug('Modo polling desabilitado (usando eventos do sistema de arquivos)');
    }

    const directoriesValid = validateApplicationDirectories(WATCH_DIR, LOG_DIR, CACHE_DIR);

    if (!directoriesValid) {
      logger.error('Falha na validação dos diretórios. Encerrando aplicação.');
      process.exit(1);
    }

    const apiClient = new ApiClient({ endpoint: API_ENDPOINT, apiKey: API_KEY });
    const uploadQueue = new UploadQueue({ concurrency: QUEUE_CONCURRENCY, apiClient });

    const fileWatcherService = new FileWatcherService({
      watchDir: WATCH_DIR,
      apiClient,
      uploadQueue,
      extensionFilter: FILE_EXTENSION_FILTER,
      usePolling: WATCH_POLLING_ENABLED,
      pollingIntervalMs: WATCH_POLLING_INTERVAL_MS,
    });

    await fileWatcherService.seedExistingFiles();
    fileWatcherService.start();

    // Inicializa auto-update se habilitado
    if (AUTO_UPDATE_ENABLED) {
      autoUpdate = new AutoUpdate({
        enabled: true,
        checkIntervalHours: AUTO_UPDATE_CHECK_INTERVAL_HOURS,
        repository: AUTO_UPDATE_REPOSITORY,
        currentVersion: APP_VERSION,
        serviceName: AUTO_UPDATE_SERVICE_NAME,
      });
    }

    setupGracefulShutdown(fileWatcherService, autoUpdate);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const logger = safeLogger();
    logger.error(`Falha ao iniciar a aplicação: ${errorMessage}`);
    process.exit(1);
  }
}

/**
 * Configura o encerramento gracioso da aplicação
 *
 * @param fileWatcherService - Instância do serviço de file watcher
 * @param autoUpdate - Instância do serviço de auto-update (opcional)
 */
function setupGracefulShutdown(fileWatcherService: FileWatcherService, autoUpdate: AutoUpdate | null = null): void {
  const logger = safeLogger();

  const shutdown = async (signal: string) => {
    logger.info(`Recebido sinal ${signal}. Encerrando graciosamente...`);
    try {
      // Para o auto-update se estiver ativo
      if (autoUpdate) {
        autoUpdate.stop();
      }

      await fileWatcherService.stop();
      logger.info('Aplicação encerrada com sucesso.');
      process.exit(0);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      logger.error(`Erro ao encerrar aplicação: ${errorMessage}`);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('uncaughtException', (error: Error) => {
    logger.error(`Exceção não capturada: ${error.message}`);
    void shutdown('uncaughtException');
  });
  process.on('unhandledRejection', (reason: unknown) => {
    const message = reason instanceof Error ? reason.message : String(reason);

    logger.error(`Promessa rejeitada não tratada: ${message}`);
    shutdown('unhandledRejection');
  });
}

/**
 * Processa um arquivo específico sem adicionar ao cache
 * Loga todas as informações do arquivo incluindo o hash
 *
 * @param filePath - Caminho do arquivo a ser processado
 */
export async function processSingleFile(filePath: string): Promise<void> {
  try {
    const { API_ENDPOINT, API_KEY, LOG_DIR, QUEUE_CONCURRENCY, LOG_LEVEL } = environment;
    const logger = initLogger(LOG_DIR, LOG_LEVEL);

    logger.info(`Processando arquivo específico: ${filePath}`);

    // Resolve o caminho absoluto
    const resolvedPath = resolve(filePath);

    // Valida se o arquivo existe
    if (!existsSync(resolvedPath)) {
      const errorMessage = `Arquivo não encontrado: ${resolvedPath}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    // Obtém informações do arquivo
    const stats = await stat(resolvedPath);
    if (!stats.isFile()) {
      const errorMessage = `O caminho não é um arquivo: ${resolvedPath}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    // Gera o hash do arquivo
    logger.debug(`Gerando hash SHA256 para: ${resolvedPath}`);
    const hashResult = await generateFileHash(resolvedPath);

    // Loga todas as informações do arquivo
    logger.info('=== Informações do Arquivo ===');
    logger.info(`Nome: ${hashResult.fileName}`);
    logger.info(`Caminho: ${hashResult.filePath}`);
    logger.info(`Tamanho: ${stats.size} bytes`);
    logger.info(`Data de Modificação: ${new Date(stats.mtimeMs).toISOString()}`);
    logger.info(`Hash SHA256: ${hashResult.fileHash}`);
    logger.info('================================');

    // Envia para API usando UploadQueue
    const apiClient = new ApiClient({ endpoint: API_ENDPOINT, apiKey: API_KEY });
    const uploadQueue = new UploadQueue({ concurrency: QUEUE_CONCURRENCY, apiClient });

    logger.debug(`Enviando arquivo para API: ${API_ENDPOINT}`);

    // Enfileira o arquivo para upload (sem callback de cache)
    await uploadQueue.enqueue({
      filePath: resolvedPath,
      hashResult,
      // Não fornece onSuccess para não atualizar cache
    });

    // Aguarda a fila terminar
    await uploadQueue.onIdle();
    await uploadQueue.stop();

    logger.info(`Arquivo processado com sucesso: ${hashResult.fileName}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const logger = safeLogger();
    logger.error(`Erro ao processar arquivo ${filePath}: ${errorMessage}`);
    throw error;
  }
}
