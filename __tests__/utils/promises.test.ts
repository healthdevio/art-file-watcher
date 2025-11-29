import { schedule, wait, type ScheduledTask } from '../../src/utils/promises';

describe('Promises Utils', () => {
  describe('wait', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('deve aguardar o tempo especificado', async () => {
      const promise = wait(1000);
      let resolved = false;

      promise.then(() => {
        resolved = true;
      });

      // Avança 500ms
      jest.advanceTimersByTime(500);
      await Promise.resolve(); // Permite que promises resolvam
      expect(resolved).toBe(false);

      // Avança mais 500ms (total 1000ms)
      jest.advanceTimersByTime(500);
      await Promise.resolve();
      expect(resolved).toBe(true);
    });

    it('deve retornar false após o timeout', async () => {
      const promise = wait(1000);
      jest.advanceTimersByTime(1000);
      const result = await promise;
      expect(result).toBe(false);
    });

    it('deve chamar onTimeout quando fornecido', async () => {
      const onTimeout = jest.fn();
      const promise = wait(1000, { onTimeout });

      jest.advanceTimersByTime(1000);
      await promise;

      expect(onTimeout).toHaveBeenCalledTimes(1);
    });

    it('deve cancelar o timeout quando o signal for abortado', async () => {
      const abortController = new AbortController();
      const onTimeout = jest.fn();
      const promise = wait(1000, {
        onTimeout,
        signal: abortController.signal,
      });

      // Aborta antes do timeout
      abortController.abort();
      await Promise.resolve(); // Permite que promises resolvam

      // Avança o tempo, mas o timeout não deve ser executado
      jest.advanceTimersByTime(1000);
      await Promise.resolve();

      const result = await promise;
      expect(result).toBe(true); // Retorna true quando cancelado
      expect(onTimeout).not.toHaveBeenCalled();
    });

    it('deve limpar o timeout quando abortado', async () => {
      const abortController = new AbortController();
      const promise = wait(1000, {
        signal: abortController.signal,
      });

      abortController.abort();
      const result = await promise;

      expect(result).toBe(true);
    });

    it('deve funcionar com delay zero', async () => {
      const promise = wait(0);
      jest.advanceTimersByTime(0);
      const result = await promise;
      expect(result).toBe(false);
    });
  });

  describe('schedule', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('deve agendar uma tarefa para execução após o delay', () => {
      const callback = jest.fn();
      schedule(callback, 1000);

      // Verifica que o callback não foi chamado ainda
      expect(callback).not.toHaveBeenCalled();

      // Avança o tempo
      jest.advanceTimersByTime(1000);

      // Verifica que o callback foi chamado
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('deve retornar um objeto com método cancel', () => {
      const callback = jest.fn();
      const task = schedule(callback, 1000);

      expect(task).toHaveProperty('cancel');
      expect(typeof task.cancel).toBe('function');
    });

    it('deve cancelar a tarefa quando cancel() for chamado', () => {
      const callback = jest.fn();
      const task = schedule(callback, 1000);

      // Cancela a tarefa
      task.cancel();

      // Avança o tempo
      jest.advanceTimersByTime(1000);

      // Verifica que o callback NÃO foi chamado
      expect(callback).not.toHaveBeenCalled();
    });

    it('deve permitir cancelar múltiplas tarefas independentemente', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const task1 = schedule(callback1, 1000);
      const task2 = schedule(callback2, 2000);

      // Cancela apenas a primeira tarefa
      task1.cancel();

      // Avança o tempo
      jest.advanceTimersByTime(2000);

      // Verifica que apenas a segunda foi executada
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('deve funcionar com delay zero', () => {
      const callback = jest.fn();
      schedule(callback, 0);

      jest.advanceTimersByTime(0);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('deve poder cancelar após a execução sem erro', () => {
      const callback = jest.fn();
      const task = schedule(callback, 1000);

      // Avança o tempo para executar
      jest.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      // Cancela após execução (não deve causar erro)
      expect(() => task.cancel()).not.toThrow();
    });

    it('deve permitir múltiplas chamadas de cancel sem erro', () => {
      const callback = jest.fn();
      const task = schedule(callback, 1000);

      // Cancela múltiplas vezes
      task.cancel();
      task.cancel();
      task.cancel();

      jest.advanceTimersByTime(1000);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('ScheduledTask interface', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('deve ter a interface correta', () => {
      const callback = jest.fn();
      const task: ScheduledTask = schedule(callback, 1000);

      expect(task).toHaveProperty('cancel');
      expect(typeof task.cancel).toBe('function');
    });

    it('deve poder ser cancelado através da interface', () => {
      const callback = jest.fn();
      const task: ScheduledTask = schedule(callback, 1000);

      task.cancel();

      jest.advanceTimersByTime(1000);
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
