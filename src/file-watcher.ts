/* eslint-disable @typescript-eslint/no-floating-promises */
import 'dotenv/config';
import { environment } from './config/environment';
import { ApiClient } from './services/api-client';
import { FileWatcherService } from './services/file-watcher-service';
import { validateApplicationDirectories } from './utils/directory';
import { initLogger, safeLogger } from './utils/logger';

/**
 * Inicializa e inicia a aplicação File Watcher
 */
export async function runFileWatcher(): Promise<void> {
  try {
    const { WATCH_DIR, API_ENDPOINT, API_KEY, LOG_DIR, FILE_EXTENSION_FILTER } = environment;
    const logger = initLogger(LOG_DIR);

    logger.info('=== File Watcher Service ===');
    logger.info('Variáveis de ambiente validadas');
    logger.info(`Diretório de monitoramento: ${WATCH_DIR}`);
    logger.info(`Endpoint da API: ${API_ENDPOINT}`);
    logger.info(`Diretório de logs: ${LOG_DIR}`);
    logger.info('Verificando diretórios...');

    const filterValue = FILE_EXTENSION_FILTER?.trim();
    const extensionLabel = filterValue || 'nenhum (todos os arquivos)';
    logger.info(`Filtro de extensões configurado: ${extensionLabel}`);

    const directoriesValid = validateApplicationDirectories(WATCH_DIR, LOG_DIR);

    if (!directoriesValid) {
      logger.error('Falha na validação dos diretórios. Encerrando aplicação.');
      process.exit(1);
    }

    const apiClient = new ApiClient({
      endpoint: API_ENDPOINT,
      apiKey: API_KEY,
    });

    const fileWatcherService = new FileWatcherService({
      watchDir: WATCH_DIR,
      apiClient,
      extensionFilter: FILE_EXTENSION_FILTER,
    });

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
