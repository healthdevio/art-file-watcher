/**
 * Módulo de logs: erro e auditoria.
 */

import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';

export interface LogErrorOpts {
  logFilePath: string;
  logDir: string;
  loggedMessages: Set<string>;
}

/**
 * Escreve um erro no arquivo de log e no console.
 * Evita duplicação verificando se a mensagem já foi logada nesta execução
 * e se já existe no arquivo (entre execuções).
 */
export function logError(fileName: string, error: string, opts: LogErrorOpts): void {
  const { logFilePath, logDir, loggedMessages } = opts;
  const messageKey = `${fileName}|${error}`;

  if (loggedMessages.has(messageKey)) return;

  try {
    if (existsSync(logFilePath)) {
      const content = readFileSync(logFilePath, 'utf-8');
      if (content.includes(`${fileName} | ${error}`)) {
        loggedMessages.add(messageKey);
        console.error(`  ✗ ${fileName}: ${error}`);
        return;
      }
    }
  } catch {
    /* ignora */
  }

  loggedMessages.add(messageKey);

  try {
    if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true });
    const line = `[${new Date().toISOString()}] ${fileName} | ${error}\n`;
    appendFileSync(logFilePath, line, 'utf-8');
    console.error(`  ✗ ${fileName}: ${error}`);
  } catch (logErr) {
    const errorKey = `LOG_WRITE_ERROR|${fileName}|${error}`;
    if (!loggedMessages.has(errorKey)) {
      loggedMessages.add(errorKey);
      console.error(`  ✗ ${fileName}: ${error}`);
      console.error('Erro ao escrever log:', logErr);
    }
  }
}

export interface LogAuditFileOpts {
  auditLogFilePath: string;
  logDir: string;
  loggedAuditFiles: Set<string>;
  loggedMessages: Set<string>;
}

/**
 * Escreve o nome de um arquivo no log de auditoria.
 * Evita duplicação.
 */
export function logAuditFile(fileName: string, reason: string, opts: LogAuditFileOpts): void {
  const { auditLogFilePath, logDir, loggedAuditFiles, loggedMessages } = opts;

  if (loggedAuditFiles.has(fileName)) return;

  try {
    if (existsSync(auditLogFilePath)) {
      const content = readFileSync(auditLogFilePath, 'utf-8');
      if (content.includes(fileName)) {
        loggedAuditFiles.add(fileName);
        return;
      }
    }
  } catch {
    /* ignora */
  }

  loggedAuditFiles.add(fileName);

  try {
    if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true });
    const line = `${fileName} | ${reason}\n`;
    appendFileSync(auditLogFilePath, line, 'utf-8');
  } catch (logErr) {
    const errorKey = `AUDIT_LOG_WRITE_ERROR|${fileName}`;
    if (!loggedMessages.has(errorKey)) {
      loggedMessages.add(errorKey);
      console.error(`Erro ao escrever log de auditoria para ${fileName}:`, logErr);
    }
  }
}
