/**
 * Módulo de auditoria: move arquivos filtrados para estrutura
 * <AUDIT_DIR>/<dd>/<regional>/*
 */

import { mkdir, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

export interface MoveToAuditFolderOpts {
  sourceFilePath: string;
  jsonPath: string;
  /** Dia em 2 dígitos (dd) do creditDate */
  day: string;
  /** Código da regional (PR, BA, etc.) */
  regional: string;
  auditDir: string;
}

/**
 * Sanitiza a regional para uso em path (evita / ou \ e trata vazios).
 */
function normalizeRegionalForPath(regional: string): string {
  if (!regional || regional === '--') return 'OUTROS';
  return regional.replace(/[/\\]/g, '_');
}

/**
 * Garante que o dia está em 2 dígitos.
 */
function normalizeDay(day: string): string {
  const n = parseInt(day, 10);
  if (isNaN(n) || n < 1 || n > 31) return '01';
  return String(n).padStart(2, '0');
}

/**
 * Move o arquivo CNAB e seu JSON para <AUDIT_DIR>/<dd>/<regional>/*
 * Cria o diretório de destino se não existir.
 * Se o arquivo já estiver nesse diretório, não faz nada.
 */
export async function moveFileToAuditFolder(opts: MoveToAuditFolderOpts): Promise<void> {
  const { sourceFilePath, jsonPath, day, regional, auditDir } = opts;
  const safeRegional = normalizeRegionalForPath(regional);
  const dd = normalizeDay(day);
  const destDir = join(auditDir, dd, safeRegional);

  const srcDir = resolve(dirname(sourceFilePath));
  const destDirResolved = resolve(destDir);
  if (srcDir === destDirResolved) {
    return; // já está no destino
  }

  try {
    await mkdir(destDir, { recursive: true });
    const destPath = join(destDir, basename(sourceFilePath));
    const destJsonPath = join(destDir, basename(jsonPath));

    await rename(sourceFilePath, destPath);
    if (existsSync(jsonPath)) {
      await rename(jsonPath, destJsonPath);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ Erro ao mover arquivo para auditoria (${basename(sourceFilePath)}): ${msg}`);
    // não propaga: o processamento continua; o arquivo permanece no lugar original
  }
}
