import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { safeLogger } from './logger';

/**
 * Resultado da verificação de um diretório
 */
export interface DirectoryCheckResult {
  success: boolean;
  path: string;
  message: string;
}

/**
 * Verifica se um diretório existe e, se não existir, tenta criá-lo.
 * Retorna o caminho absoluto resolvido do diretório.
 *
 * @param dirPath - Caminho do diretório (pode ser relativo ou absoluto)
 * @param createIfNotExists - Se true, cria o diretório se não existir
 * @returns Resultado da verificação com caminho absoluto
 */
export function ensureDirectory(dirPath: string, createIfNotExists: boolean = true): DirectoryCheckResult {
  try {
    // Resolve o caminho para absoluto
    const absolutePath = resolve(dirPath);

    // Verifica se o diretório existe
    if (existsSync(absolutePath)) {
      return {
        success: true,
        path: absolutePath,
        message: `Diretório existe: ${absolutePath}`,
      };
    }

    // Se não existe e não deve criar, retorna erro
    if (!createIfNotExists) {
      return {
        success: false,
        path: absolutePath,
        message: `Diretório não encontrado: ${absolutePath}`,
      };
    }

    // Tenta criar o diretório recursivamente
    mkdirSync(absolutePath, { recursive: true });

    return {
      success: true,
      path: absolutePath,
      message: `Diretório criado com sucesso: ${absolutePath}`,
    };
  } catch (error) {
    const absolutePath = resolve(dirPath);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    return {
      success: false,
      path: absolutePath,
      message: `Erro ao verificar/criar diretório ${absolutePath}: ${errorMessage}`,
    };
  }
}

/**
 * Verifica múltiplos diretórios de uma vez.
 * Útil para verificar todos os diretórios necessários antes de iniciar a aplicação.
 *
 * @param directories - Array de objetos com caminho e se deve criar se não existir
 * @returns Array com os resultados de cada verificação
 */
export function ensureDirectories(
  directories: Array<{ path: string; createIfNotExists?: boolean }>,
): DirectoryCheckResult[] {
  return directories.map(dir => ensureDirectory(dir.path, dir.createIfNotExists ?? true));
}

/**
 * Valida todos os diretórios necessários para a aplicação.
 * Retorna false se algum diretório crítico falhar.
 *
 * @param watchDir - Diretório a ser monitorado (deve existir)
 * @param logDir - Diretório de logs (pode ser criado se não existir)
 * @returns true se todos os diretórios estão prontos
 */
export function validateApplicationDirectories(watchDir: string, logDir: string): boolean {
  const logger = safeLogger();
  const results = ensureDirectories([
    { path: watchDir, createIfNotExists: false }, // Diretório de watch deve existir
    { path: logDir, createIfNotExists: true }, // Diretório de logs pode ser criado
  ]);

  let allValid = true;

  for (const result of results) {
    if (result.success) {
      logger.info(`[✓] ${result.message}`);
    } else {
      logger.error(`[✗] ${result.message}`);
      allValid = false;
    }
  }

  return allValid;
}
