/* eslint-disable @typescript-eslint/no-floating-promises */
import 'dotenv/config';
import { environment } from './config/environment';
import { APP_VERSION } from './config/version';
import { ApiClient } from './services/api-client';
import { FileWatcherService } from './services/file-watcher-service';
import { UploadQueue } from './services/upload-queue';
import { validateApplicationDirectories } from './utils/directory';
import { initLogger, safeLogger } from './utils/logger';

/** Inicia a aplicação */
export async function runFileWatcher(): Promise<void> {
  try {
    const { WATCH_DIR, API_ENDPOINT, API_KEY, LOG_DIR, FILE_EXTENSION_FILTER, CACHE_DIR, QUEUE_CONCURRENCY } =
      environment;
    const logger = initLogger(LOG_DIR);

    logger.info(`=== File Watcher Service v${APP_VERSION} ===`);
    logger.info('Variáveis de ambiente validadas');
    logger.info(`Diretório de monitoramento: ${WATCH_DIR}`);
    logger.info(`Endpoint da API: ${API_ENDPOINT}`);
    logger.info(`Diretório de logs: ${LOG_DIR}`);
    logger.info(`Diretório de cache: ${CACHE_DIR || 'não configurado (usando padrão: ./cache)'}`);
    logger.info(`Concorrência da fila: ${QUEUE_CONCURRENCY}`);
    logger.info('Verificando diretórios...');

    const filterValue = FILE_EXTENSION_FILTER?.trim();
    const extensionLabel = filterValue || 'nenhum (todos os arquivos)';
    logger.info(`Filtro de extensões configurado: ${extensionLabel}`);

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
    });

    await fileWatcherService.seedExistingFiles();
    fileWatcherService.start();
    setupGracefulShutdown(fileWatcherService);
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
 */
function setupGracefulShutdown(fileWatcherService: FileWatcherService): void {
  const logger = safeLogger();

  const shutdown = async (signal: string) => {
    logger.info(`Recebido sinal ${signal}. Encerrando graciosamente...`);
    try {
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

// Inicia a aplicação
if (require.main === module) {
  runFileWatcher().catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const logger = safeLogger();
    logger.error(`[FATAL ERROR] Erro fatal: ${errorMessage}`);
    process.exit(1);
  });
}
