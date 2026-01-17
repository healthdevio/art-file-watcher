import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createLogger, format, transports, type Logger as WinstonLogger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

let loggerInstance: WinstonLogger;

const levelIcons: Record<string, string> = {
  debug: '🔍',
  info: '¡',
  warn: '⚠',
  error: '✖',
};

/**
 * Formato simplificado para console - apenas mensagens essenciais
 */
const consoleFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp({ format: 'HH:mm:ss' }), // Apenas hora:minuto:segundo
  format.printf(({ timestamp, level, message }) => {
    const icon = levelIcons[level.toLowerCase()] ?? '•';
    const msg = message ? `${message}` : '';
    const cleanMessage = msg.replace(/\[(INFO|ERROR|WARN|QUEUE)\]/g, '').trim();
    return `${timestamp} ${icon} ${cleanMessage}`;
  }),
);

/**
 * Formato completo para arquivo - apenas erros
 */
const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }), // Inclui stack trace para erros
  format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      return `${timestamp} [${level.toUpperCase()}] ${message}\n${stack}`;
    }
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
  }),
);

/**
 * Inicializa o logger Winston com níveis diferentes para console e arquivo.
 * - Console: nível configurável via LOG_LEVEL (padrão: info)
 * - Arquivo: apenas errors (para reduzir volume de logs)
 *
 * @param logDir O diretório onde os arquivos de log serão criados.
 * @param consoleLevel Nível de log para o console (padrão: info, pode ser 'debug', 'info', 'warn', 'error')
 */
export function initLogger(logDir: string, consoleLevel: string = 'info'): WinstonLogger {
  if (loggerInstance) {
    return loggerInstance;
  }

  const absoluteLogDir = logDir ? resolve(logDir) : join(process.cwd(), 'logs'); //join(process.cwd(), logDir);

  if (!existsSync(absoluteLogDir)) {
    mkdirSync(absoluteLogDir, { recursive: true });
  }

  // Valida e normaliza o nível de log
  const validLevels = ['debug', 'info', 'warn', 'error'];
  const normalizedLevel = validLevels.includes(consoleLevel.toLowerCase()) ? consoleLevel.toLowerCase() : 'info';

  // Arquivo de log: APENAS erros
  const fileTransport = new DailyRotateFile({
    dirname: absoluteLogDir,
    filename: 'file-watcher-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d', // Mantém 30 dias de logs de erro
    level: 'error', // Apenas erros no arquivo
    format: fileFormat,
  });

  // Console: nível configurável (permite debug quando necessário)
  const consoleTransport = new transports.Console({
    level: normalizedLevel,
    format: consoleFormat,
  });

  loggerInstance = createLogger({
    level: normalizedLevel, // Nível mínimo geral
    format: format.simple(),
    transports: [consoleTransport, fileTransport],
    exitOnError: false,
  });

  return loggerInstance;
}

/**
 * Retorna o logger Winston inicializado.
 */
export function getLogger(): WinstonLogger {
  if (!loggerInstance) {
    throw new Error('Logger ainda não inicializado. Chame initLogger() primeiro.');
  }
  return loggerInstance;
}

export function safeLogger() {
  try {
    return getLogger();
  } catch {
    return {
      // eslint-disable-next-line no-console
      info: console.log,
      error: console.error,
      warn: console.warn,
    };
  }
}
