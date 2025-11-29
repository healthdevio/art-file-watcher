export type WaitOptions = {
  onTimeout?: () => void;
  signal?: AbortSignal;
};
export const wait = (ms: number, options?: WaitOptions): Promise<any> => {
  return new Promise(resolve => {
    const timer = setTimeout(() => {
      options?.onTimeout?.();
      resolve(false);
    }, ms);

    options?.signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      resolve(true);
    });
  });
};

/**
 * Interface para controle de tarefa agendada
 */
export interface ScheduledTask {
  /**
   * Cancela a tarefa agendada
   */
  cancel: () => void;
}

/**
 * Agenda uma tarefa para execução após um delay.
 * Retorna um objeto com método cancel() para evitar vazamentos de memória.
 *
 * @param callback - Função a ser executada após o delay
 * @param delay - Tempo de espera em milissegundos
 * @returns Objeto com método cancel() para cancelar a tarefa
 *
 * @example
 * ```typescript
 * const task = schedule(() => {
 *   console.log('Executado após 1 segundo');
 * }, 1000);
 *
 * // Para cancelar antes de executar:
 * task.cancel();
 * ```
 */
export function schedule(callback: () => void, delay: number): ScheduledTask {
  const timer = setTimeout(callback, delay);

  return {
    cancel: () => {
      clearTimeout(timer);
    },
  };
}
