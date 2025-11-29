import PQueue from 'p-queue';
import { getLogger } from '../utils/logger';
import { schedule, type ScheduledTask } from '../utils/promises';
import { ApiClient } from './api-client';
import { HashResult } from './file-hash';

export interface QueueItem {
  filePath: string;
  hashResult: HashResult;
  priority?: number;
  retryCount?: number;
  onSuccess?: (filePath: string, hash: string) => Promise<void> | void;
}

export interface UploadQueueConfig {
  concurrency: number;
  apiClient: ApiClient;
}

/**
 * Serviço de fila para uploads de arquivos com retry automático
 */
export class UploadQueue {
  private readonly queue: PQueue;
  private readonly apiClient: ApiClient;
  private readonly logger = getLogger();
  private readonly maxRetries = 3;
  private readonly scheduledRetries: Set<ScheduledTask> = new Set();

  constructor(config: UploadQueueConfig) {
    this.apiClient = config.apiClient;
    const timeout = 60000; // 60 segundos de timeout por item
    this.queue = new PQueue({ concurrency: config.concurrency, timeout });

    // Log de estatísticas da fila
    this.queue.on('active', () => {
      this.logger.debug(
        `[QUEUE] Processando. Tamanho: ${this.queue.size}, Pendente: ${this.queue.pending}, Concorrência: ${config.concurrency}`,
      );
    });

    this.queue.on('idle', () => {
      this.logger.debug('[QUEUE] Fila vazia, todos os uploads concluídos');
    });

    this.logger.debug(`Fila inicializada (concorrência: ${config.concurrency})`);
  }

  /**
   * Adiciona um arquivo à fila para upload
   *
   * @param item - Item com informações do arquivo a ser enviado
   * @param isRetry - Se true, usa prioridade baixa para retry
   * @returns Promise que resolve quando o upload for concluído
   */
  async enqueue(item: QueueItem, isRetry = false): Promise<void> {
    const priority = isRetry ? 0 : 1; // Prioridade alta (1) para novos, baixa (0) para retry
    const retryCount = item.retryCount ?? 0;
    await this.queue.add(() => this.processUpload(item, retryCount, isRetry), { priority });
  }

  private async processUpload(item: QueueItem, currentRetry: number, isRetry: boolean): Promise<void> {
    try {
      if (isRetry || currentRetry > 0) {
        this.logger.info(
          `[QUEUE] Tentativa ${currentRetry + 1}/${this.maxRetries + 1} para ${item.hashResult.fileName}`,
        );
      }

      const apiResponse = await this.apiClient.uploadFiles([item]);

      if (apiResponse.success) {
        this.logger.debug(`Upload OK: ${item.hashResult.fileName}`);

        // Chama callback de sucesso se fornecido (ex: escrever no cache)
        if (item.onSuccess) {
          try {
            await item.onSuccess(item.filePath, item.hashResult.fileHash);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            this.logger.error(`[QUEUE] Erro ao executar callback de sucesso: ${errorMessage}`);
          }
        }

        return;
      }

      // Verifica se deve fazer retry
      if (this.shouldRetry(apiResponse.statusCode, currentRetry)) {
        // Agenda o retry sem bloquear a tarefa atual
        this.scheduleRetry(item, currentRetry);
        return;
      } else {
        this.logger.error(
          `[QUEUE] Upload falhou permanentemente após ${currentRetry + 1} tentativas: ${item.hashResult.fileName}. ${apiResponse.message}`,
        );
        return;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      // Erros de rede sempre tentam retry
      if (currentRetry < this.maxRetries) {
        this.logger.warn(`[QUEUE] Erro no upload (rede): ${errorMessage}. Tentando novamente...`);
        // Agenda o retry sem bloquear a tarefa atual
        this.scheduleRetry(item, currentRetry);
        return;
      } else {
        this.logger.error(
          `[QUEUE] Upload falhou após ${this.maxRetries + 1} tentativas: ${item.hashResult.fileName}. Erro: ${errorMessage}`,
        );
        return;
      }
    }
  }

  private calculateRetryDelay(currentRetry: number): number {
    const delays = [10000, 30000, 60000]; // 10s, 30s, 60s
    const index = Math.min(currentRetry, delays.length - 1);
    return delays[index];
  }

  private scheduleRetry(item: QueueItem, currentRetry: number): void {
    const delay = this.calculateRetryDelay(currentRetry);
    const delaySeconds = delay / 1000;
    this.logger.warn(`Retry em ${delaySeconds}s: ${item.hashResult.fileName}`);

    const task = schedule(() => {
      this.scheduledRetries.delete(task);
      this.enqueue({ ...item, retryCount: currentRetry + 1 }, true).catch(error => {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        this.logger.error(`[QUEUE] Erro ao enfileirar retry: ${errorMessage}`);
      });
    }, delay);

    this.scheduledRetries.add(task);
  }

  private shouldRetry(statusCode: number | undefined, currentRetry: number): boolean {
    if (currentRetry >= this.maxRetries) {
      return false;
    }

    // Erros 4xx (client errors) não devem fazer retry
    if (statusCode && statusCode >= 400 && statusCode < 500) {
      return false;
    }

    // Erros 5xx (server errors) devem fazer retry
    if (statusCode && statusCode >= 500) {
      return true;
    }

    // Outros erros (rede, timeout) devem fazer retry
    return true;
  }

  getSize(): number {
    return this.queue.size;
  }

  getPending(): number {
    return this.queue.pending;
  }

  async onIdle(): Promise<void> {
    return this.queue.onIdle();
  }

  clear(): void {
    this.queue.clear();
    this.cancelAllScheduledRetries();
    this.logger.debug('Fila limpa');
  }

  private cancelAllScheduledRetries(): void {
    const count = this.scheduledRetries.size;
    if (count > 0) {
      this.logger.debug(`[QUEUE] Cancelando ${count} retries agendados`);
      for (const task of this.scheduledRetries) task.cancel();
      this.scheduledRetries.clear();
    }
  }

  async stop(): Promise<void> {
    this.cancelAllScheduledRetries();
    this.logger.debug('Aguardando fila terminar...');
    await this.queue.onIdle();
    this.logger.debug('Fila parada');
  }
}
