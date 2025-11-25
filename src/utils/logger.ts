import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createLogger, format, transports, type Logger as WinstonLogger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

let loggerInstance: WinstonLogger;

const levelIcons: Record<string, string> = {
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  success: '✅',
  hash: '🔐',
};

const consoleFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    const icon = levelIcons[level.toLowerCase()] ?? '▸';
    return `${timestamp} ${icon} ${level} › ${message}`;
  }),
);

const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`),
);

/**
 * Inicializa o logger Winston com rotação.
 *
 * @param logDir O diretório onde os arquivos de log serão criados.
 * @param level Nível mínimo de log (padrão: info)
 */
export function initLogger(logDir: string, level: string = 'info'): WinstonLogger {
  if (loggerInstance) {
    return loggerInstance;
  }

  const absoluteLogDir = join(process.cwd(), logDir);

  if (!existsSync(absoluteLogDir)) {
    mkdirSync(absoluteLogDir, { recursive: true });
  }

  const rotateTransport = new DailyRotateFile({
    dirname: absoluteLogDir,
    filename: 'file-watcher-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level,
    format: fileFormat,
  });

  loggerInstance = createLogger({
    level,
    format: fileFormat,
    transports: [
      new transports.Console({
        format: consoleFormat,
      }),
      rotateTransport,
    ],
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
