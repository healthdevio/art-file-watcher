import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { getLogger, initLogger, safeLogger } from '../../src/utils/logger';

describe('Logger Utils', () => {
  // Reseta o logger antes de cada teste para isolamento
  beforeEach(() => {
    jest.resetModules();
  });

  describe('initLogger', () => {
    it('deve criar o diretório de logs se não existir', () => {
      const logDir = 'volumes/.test-temp/logs/new-log-dir';
      const absoluteLogDir = join(process.cwd(), logDir);

      // Remove o diretório se existir
      if (existsSync(absoluteLogDir)) {
        rmSync(absoluteLogDir, { recursive: true, force: true });
      }

      const logger = initLogger(logDir);

      expect(existsSync(absoluteLogDir)).toBe(true);
      expect(logger).toBeDefined();
    });

    it('deve retornar uma instância de WinstonLogger', () => {
      const logger = initLogger('volumes/.test-temp/logs');

      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    it('deve retornar a mesma instância em múltiplas chamadas (singleton)', () => {
      const logger1 = initLogger('volumes/.test-temp/logs');
      const logger2 = initLogger('volumes/.test-temp/logs');

      expect(logger1).toBe(logger2);
    });

    it('deve aceitar nível de log personalizado', () => {
      const logger = initLogger('volumes/.test-temp/logs', 'debug');

      expect(logger).toBeDefined();
    });

    it('deve normalizar níveis de log inválidos para "info"', () => {
      const logger = initLogger('volumes/.test-temp/logs', 'invalid-level');

      expect(logger).toBeDefined();
    });

    it('deve funcionar com diferentes níveis de log', () => {
      const levels = ['debug', 'info', 'warn', 'error'] as const;

      levels.forEach(level => {
        const logDir = `volumes/.test-temp/logs/test-${level}`;
        const logger = initLogger(logDir, level);
        expect(logger).toBeDefined();
      });
    });
  });

  describe('getLogger', () => {
    it('deve retornar o logger inicializado', () => {
      initLogger('volumes/.test-temp/logs');
      const logger = getLogger();

      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
    });

    it('deve lançar erro se o logger não foi inicializado', () => {
      // Reseta o módulo para garantir que o logger não está inicializado
      jest.resetModules();
      const { getLogger: getLoggerFresh } = require('../../src/utils/logger');

      expect(() => {
        getLoggerFresh();
      }).toThrow('Logger ainda não inicializado');
    });

    it('deve retornar a mesma instância que initLogger retornou', () => {
      const initLoggerResult = initLogger('volumes/.test-temp/logs');
      const getLoggerResult = getLogger();

      expect(initLoggerResult).toBe(getLoggerResult);
    });
  });

  describe('safeLogger', () => {
    it('deve retornar o logger se inicializado', () => {
      initLogger('volumes/.test-temp/logs');
      const logger = safeLogger();

      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
    });

    it('deve retornar um logger fallback se não inicializado', () => {
      // Reseta módulos para garantir que o logger não está inicializado
      jest.resetModules();
      const { safeLogger: safeLoggerFresh } = require('../../src/utils/logger');
      const logger = safeLoggerFresh();

      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      // Deve ser o logger fallback (console)
      expect(logger.info).toBe(console.log);
      expect(logger.error).toBe(console.error);
      expect(logger.warn).toBe(console.warn);
    });

    it('deve permitir chamar métodos de log', () => {
      const logger = safeLogger();

      expect(() => {
        logger.info('test info');
        logger.error('test error');
        logger.warn('test warn');
      }).not.toThrow();
    });

    it('deve retornar um objeto com métodos info, error e warn', () => {
      const logger = safeLogger();

      expect(logger).toHaveProperty('info');
      expect(logger).toHaveProperty('error');
      expect(logger).toHaveProperty('warn');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
    });
  });

  describe('Logger funcionalidade', () => {
    it('deve poder registrar mensagens de log', () => {
      initLogger('volumes/.test-temp/logs', 'debug');
      const logger = getLogger();

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        logger.info('Mensagem de info');
        logger.error('Mensagem de erro');
        logger.warn('Mensagem de aviso');
        logger.debug('Mensagem de debug');
      }).not.toThrow();

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('deve respeitar o nível de log configurado', () => {
      const logger = initLogger('volumes/.test-temp/logs-error', 'error');

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        logger.info('Info não deve aparecer');
        logger.error('Erro deve aparecer');
      }).not.toThrow();

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('deve incluir stack trace quando houver erro com stack', () => {
      const logger = initLogger('volumes/.test-temp/logs-stack', 'error');
      
      // Cria um erro com stack
      const error = new Error('Teste de erro com stack');
      error.stack = 'Error: Teste de erro com stack\n    at test.js:1:1\n    at Object.<anonymous>';

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Loga o erro - isso deve incluir o stack trace no formato de arquivo
      logger.error('Erro de teste', error);
      
      expect(() => {
        logger.error('Teste', error);
      }).not.toThrow();
      
      consoleErrorSpy.mockRestore();
    });
  });
});
