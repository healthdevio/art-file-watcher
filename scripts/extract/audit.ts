/**
 * Módulo de auditoria: move arquivos filtrados para estrutura
 * <out_dir>/<year>/<month>/<day>/<regional>/<bankCode>/*
 */

import { existsSync } from 'node:fs';
import { mkdir, rename } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';

export interface MoveToAuditFolderOpts {
  sourceFilePath: string;
  jsonPath: string;
  /** Ano em 4 dígitos (yyyy) do creditDate */
  year: string;
  /** Mês em 2 dígitos (mm) do creditDate */
  month: string;
  /** Dia em 2 dígitos (dd) do creditDate */
  day: string;
  /** Código da regional (PR, BA, etc.) */
  regional: string;
  /** Código do banco (001, 341, etc.) */
  bankCode: string;
  /** Diretório raiz de saída (out_dir) */
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
 * Sanitiza o código do banco para uso em path (evita / ou \ e trata vazios).
 */
function normalizeBankCodeForPath(bankCode: string): string {
  if (!bankCode || bankCode.trim() === '') return 'N/A';
  return bankCode.replace(/[/\\]/g, '_').trim();
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
 * Garante que o mês está em 2 dígitos.
 */
function normalizeMonth(month: string): string {
  const n = parseInt(month, 10);
  if (isNaN(n) || n < 1 || n > 12) return '01';
  return String(n).padStart(2, '0');
}

/**
 * Retorna o diretório de destino para a estrutura
 * <out_dir>/<year>/<month>/<day>/<regional>/<bankCode>
 */
export function getAuditDestDir(opts: Omit<MoveToAuditFolderOpts, 'sourceFilePath' | 'jsonPath'>): string {
  const { year, month, day, regional, bankCode, auditDir } = opts;
  const safeRegional = normalizeRegionalForPath(regional);
  const safeBankCode = normalizeBankCodeForPath(bankCode);
  const dd = normalizeDay(day);
  const mm = normalizeMonth(month);
  const yyyy = year && year.length >= 4 ? year : new Date().getFullYear().toString();
  return join(auditDir, yyyy, mm, dd, safeRegional, safeBankCode);
}

/**
 * Move o arquivo CNAB e seu JSON para <out_dir>/<year>/<month>/<day>/<regional>/<bankCode>/*
 * Cria o diretório de destino se não existir.
 * Se o arquivo já estiver nesse diretório, não faz movimentação (apenas reprocessa JSON no fluxo do caller).
 * Se o arquivo já existir no destino, ignora a movimentação.
 */
export async function moveFileToAuditFolder(opts: MoveToAuditFolderOpts): Promise<void> {
  const { sourceFilePath, jsonPath, auditDir } = opts;
  const destDir = getAuditDestDir(opts);

  const srcDir = resolve(dirname(sourceFilePath));
  const destDirResolved = resolve(destDir);
  if (srcDir === destDirResolved) {
    return; // já está na pasta de saída: caller já gravou o JSON no lugar certo; ignora movimentação
  }

  try {
    await mkdir(destDir, { recursive: true });
    const destPath = join(destDir, basename(sourceFilePath));
    const destJsonPath = join(destDir, basename(jsonPath));

    if (existsSync(destPath)) {
      return; // arquivo já existe no destino, ignora movimentação
    }

    await rename(sourceFilePath, destPath);
    if (existsSync(jsonPath)) {
      if (!existsSync(destJsonPath)) {
        await rename(jsonPath, destJsonPath);
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ Erro ao mover arquivo para auditoria (${basename(sourceFilePath)}): ${msg}`);
  }
}
