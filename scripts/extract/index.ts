/**
 * Script temporário de auditoria de arquivos CNAB 240 e CNAB 400 - Dezembro 2025
 * 
 * Este script processa todos os arquivos de retorno do mês de dezembro de 2025,
 * extrai dados dos segmentos T e U (CNAB 240) ou detalhes (CNAB 400),
 * salva em JSON e insere no banco PostgreSQL.
 * 
 * Execução:
 *   npx tsx scripts/extract.ts
 */

import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import PQueue from 'p-queue';
import { generateFileHash } from '../../src/services/file-hash';
import type { CNAB240, SegmentoT, SegmentoU } from '../../src/services/read-ret-file/interfaces/CNAB-240';
import type { CNAB400, DetalheCNAB400 } from '../../src/services/read-ret-file/interfaces/CNAB-400';
import { ReadRetFileService } from '../../src/services/read-ret-file/read-ret-file.service';
import { adjustToBrasiliaTimezone, tryDate } from '../../src/services/read-ret-file/schema/core/date-utils';
import { moveFileToAuditFolder } from './audit';
import { agreementToRegional, CNAB_BLACKLIST_EXTENSIONS, FILE_TYPE_FILTER } from './constants';
import { formatDateForFilter, getDayFromDateStr, matchesAuditFilter } from './filters';
import { logAuditFile, logError, type LogErrorOpts } from './logs';

// Configurações hardcoded conforme especificado
const AUDIT_DIR = resolve(__dirname, '../../volumes/audit/2026-01');
// const AUDIT_DIR = resolve(__dirname, '../../volumes/audit/2026-01-22');
// const AUDIT_DIR = resolve(__dirname, '../../volumes/audit/2025-12');
const LOG_DIR = resolve(__dirname, '../../volumes/audit/logs');
const LOG_FILE = join(LOG_DIR, `errors_${new Date().toISOString().split('T')[0]}.log`);
const AUDIT_LOG_FILE = join(LOG_DIR, `audit_files_${new Date().toISOString().split('T')[0]}.log`);

// Limpar arquivos de log no início de cada execução para evitar duplicação entre execuções
if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}
if (existsSync(LOG_FILE)) {
  writeFileSync(LOG_FILE, '', 'utf-8');
}
if (existsSync(AUDIT_LOG_FILE)) {
  writeFileSync(AUDIT_LOG_FILE, '', 'utf-8');
}







/**
 * Busca a regional baseada no código do convênio
 * @param agreement - Código do convênio
 * @returns Código da regional ou string vazia se não encontrado
 */
function getRegionalByAgreement(agreement: string | null | undefined): string {
  if (!agreement) return '';

  const mapping = agreementToRegional.find(m => m.agreement === agreement);
  return mapping?.regional || '--';
}

// Inicializar Prisma Client
const prisma = new PrismaClient();

// Estatísticas de processamento
interface ProcessingStats {
  totalFiles: number;
  processedFiles: number;
  failedFiles: number;
  totalRecords: number;
  insertedRecords: number;
  errors: Array<{ file: string; error: string }>;
}

const stats: ProcessingStats = {
  totalFiles: 0,
  processedFiles: 0,
  failedFiles: 0,
  totalRecords: 0,
  insertedRecords: 0,
  errors: [],
};

// Set para rastrear mensagens já logadas e evitar duplicação
const loggedMessages = new Set<string>();

// Set para rastrear arquivos já logados para auditoria (evitar duplicação)
const loggedAuditFiles = new Set<string>();

const logErrorOpts = { logFilePath: LOG_FILE, logDir: LOG_DIR, loggedMessages };
const logAuditFileOpts = { auditLogFilePath: AUDIT_LOG_FILE, logDir: LOG_DIR, loggedAuditFiles, loggedMessages };

// Cache de hashes de arquivos para evitar recalcular
const fileHashCache = new Map<string, string>();

// Fila para limitar concorrência de upserts (evitar esgotar pool de conexões)
const UPSERT_CONCURRENCY = 8;

/** Tipo do registro para create/update em AuditReturn (campos que preenchemos). */
type AuditReturnRecord = {
  recordHash: string;
  regional: string;
  fileName: string;
  cnabType: string;
  lineNumber: number;
  bankCode: string;
  agreement: string;
  lotCode: string;
  regionalNumber: string;
  regionalNumberDigit: string;
  titleNumber: string | null;
  titleType: string | null;
  agency: string | null;
  agencyDigit: string | null;
  account: string | null;
  accountDigit: string | null;
  payerName: string | null;
  payerRegistration: string | null;
  payerRegistrationType: string | null;
  movementCode: string;
  occurrenceCode: string | null;
  receivedValue: number | null;
  tariff: number | null;
  accruedInterest: number | null;
  discountAmount: number | null;
  dischargeAmount: number | null;
  paidAmount: number | null;
  otherExpenses: number | null;
  otherCredits: number | null;
  netCreditValue: number | null;
  paymentDate: Date | null;
  creditDate: Date | null;
  fileGenerationDate: string | null;
  fileSequence: string | null;
};

/**
 * Faz upsert dos registros na AuditReturn, calcula auditInfo e atualiza stats.
 * Função unificada para CNAB 240 e CNAB 400.
 */
async function upsertAuditRecords(opts: {
  fileName: string;
  records: AuditReturnRecord[];
  logErrorOpts: LogErrorOpts;
}): Promise<{ auditInfo: { regional: string; day: string; reason: string } | null }> {
  const { fileName, records, logErrorOpts } = opts;

  let auditInfo: { regional: string; day: string; reason: string } | null = null;
  for (const r of records) {
    if (r.creditDate && matchesAuditFilter(r.creditDate, r.regional, r.bankCode)) {
      const dateStr = formatDateForFilter(r.creditDate)!;
      auditInfo = {
        regional: r.regional,
        day: getDayFromDateStr(dateStr),
        reason: `${r.cnabType}, ${r.bankCode || 'N/A'}, ${dateStr}, ${r.regional}`,
      };
      break;
    }
  }

  const queue = new PQueue({ concurrency: UPSERT_CONCURRENCY });
  let upserted = 0;
  let errors = 0;

  const upsertPromises = records.map((record) =>
    queue.add(async () => {
      try {
        await prisma.auditReturn.upsert({
          where: { recordHash: record.recordHash },
          update: record,
          create: record,
        });
        upserted++;
        return { success: true };
      } catch (err) {
        errors++;
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(fileName, `Erro ao fazer upsert registro linha ${record.lineNumber}: ${errorMsg}`, logErrorOpts);
        return { success: false };
      }
    })
  );

  await Promise.all(upsertPromises);
  stats.insertedRecords += upserted;
  console.log(`  ✓ ${upserted}/${records.length} registros processados${errors > 0 ? ` (${errors} erros)` : ''}`);
  return { auditInfo };
}

/**
 * Gera hash único para um registro baseado no hash do arquivo + número da linha
 * 
 * @param fileHash - Hash SHA256 do arquivo
 * @param lineNumber - Número da linha no arquivo
 * @returns Hash único do registro (SHA256)
 */
function generateRecordHash(fileHash: string, lineNumber: number): string {
  const hash = createHash('sha256');
  hash.update(fileHash);
  hash.update(String(lineNumber));
  return hash.digest('hex');
}

/**
 * Obtém o hash do arquivo (usando cache para evitar recalcular)
 * 
 * @param filePath - Caminho do arquivo
 * @returns Hash SHA256 do arquivo
 */
async function getFileHash(filePath: string): Promise<string> {
  if (fileHashCache.has(filePath)) {
    return fileHashCache.get(filePath)!;
  }

  const hashResult = await generateFileHash(filePath);
  fileHashCache.set(filePath, hashResult.fileHash);
  return hashResult.fileHash;
}

/**
 * Verifica se um arquivo é um arquivo CNAB válido
 * Usa blacklist: retorna true se a extensão NÃO estiver na lista de extensões ignoradas
 * Comparação case-insensitive (funciona com maiúsculas e minúsculas)
 */
function isCnabFile(filePath: string): boolean {
  // Extrair extensão do arquivo
  const lastDotIndex = filePath.lastIndexOf('.');
  if (lastDotIndex === -1) {
    // Arquivo sem extensão, aceitar
    return true;
  }

  // Normalizar extensão para maiúsculas (case-insensitive)
  const ext = filePath.substring(lastDotIndex).toUpperCase();

  // Se extensão vazia ou apenas ponto, aceitar
  if (!ext || ext === '.') return true;

  // Verificar se a extensão está na blacklist (comparação case-insensitive)
  // Normalizar cada item da blacklist para maiúsculas antes de comparar
  const isBlacklisted = CNAB_BLACKLIST_EXTENSIONS.some(
    blacklistedExt => blacklistedExt.toUpperCase() === ext
  );

  // Retornar true se NÃO estiver na blacklist
  return !isBlacklisted;
}

/**
 * Lista todos os arquivos CNAB recursivamente
 */
function listCnabFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursão em subdiretórios
        files.push(...listCnabFiles(fullPath));
      } else if (entry.isFile() && isCnabFile(fullPath)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Erro ao listar arquivos em ${dir}:`, error);
  }

  return files;
}

/**
 * Expande ano de 2 dígitos para 4 dígitos
 * Assume que anos <= 50 são 20XX e anos > 50 são 19XX
 */
function expandYear(dateStr: string): string {
  if (!dateStr || !dateStr.includes('/')) return dateStr;

  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;

  const [day, month, year] = parts;

  // Se o ano já tem 4 dígitos, retorna como está
  if (year.length === 4) return dateStr;

  // Se o ano tem 2 dígitos, expande
  if (year.length === 2) {
    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum)) return dateStr;

    // Anos <= 50 são 20XX, anos > 50 são 19XX
    const fullYear = yearNum <= 50 ? `20${year.padStart(2, '0')}` : `19${year.padStart(2, '0')}`;
    return `${day}/${month}/${fullYear}`;
  }

  return dateStr;
}

/**
 * Converte data do formato CNAB para Date
 * Aceita formatos: DD/MM/YYYY ou DDMMAAAA
 * Ajusta automaticamente para o fuso horário de Brasília (UTC-3)
 */
function parseCnabDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || dateStr.trim() === '' || dateStr === '00000000' || dateStr === '        ') {
    return null;
  }

  const trimmed = dateStr.trim();

  // Tentar parsear com tryDate (suporta dd/MM/yyyy e ddMMyyyy)
  const parsedDate = trimmed.includes('/')
    ? tryDate(trimmed, 'dd/MM/yyyy')
    : tryDate(trimmed, 'ddMMyyyy');

  // Ajustar para fuso horário de Brasília (UTC-3)
  return adjustToBrasiliaTimezone(parsedDate);
}

/**
 * Verifica se um payload é Segmento T
 */
function isSegmentoT(payload: unknown): payload is SegmentoT {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'segmentType' in payload &&
    payload.segmentType === 'T'
  );
}

/**
 * Verifica se um payload é Segmento U
 */
function isSegmentoU(payload: unknown): payload is SegmentoU {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'segmentType' in payload &&
    payload.segmentType === 'U'
  );
}

/**
 * Verifica se um payload é Detalhe CNAB 400
 */
function isDetalheCNAB400(payload: unknown): payload is DetalheCNAB400 {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'recordType' in payload &&
    payload.recordType === '7' &&
    'agreement' in payload &&
    'regionalNumber' in payload
  );
}

/**
 * Processa um arquivo CNAB 240 e extrai segmentos T e U
 */
async function processCNAB240File(
  filePath: string,
  fileName: string,
  result: { cnabType: string; metadata?: { lineCount?: number; fileSize?: number } },
  cnabData: CNAB240
): Promise<void> {
  const fileDir = dirname(filePath);

  // Extrair pares T/U
  // Os segmentos T e U devem estar consecutivos e vinculados pelo mesmo código de movimento e lote
  const tuPairs: Array<{ segmentT: SegmentoT; segmentU: SegmentoU; lineNumber: number }> = [];
  let currentSegmentT: SegmentoT | null = null;

  for (const line of cnabData.lines) {
    if (!line.payload) continue;

    if (isSegmentoT(line.payload)) {
      // Se já havia um T sem U correspondente, descartar
      currentSegmentT = line.payload;
    } else if (isSegmentoU(line.payload)) {
      if (currentSegmentT) {
        // Verificar se os segmentos estão vinculados
        // Devem ter mesmo código de movimento, lote e sequência consecutiva
        const tSeqNum = parseInt(currentSegmentT.sequenceNumber, 10);
        const uSeqNum = parseInt(line.payload.sequenceNumber, 10);

        if (
          currentSegmentT.movementCode === line.payload.movementCode &&
          currentSegmentT.lotCode === line.payload.lotCode &&
          uSeqNum === tSeqNum + 1 // U deve vir logo após T
        ) {
          tuPairs.push({
            segmentT: currentSegmentT,
            segmentU: line.payload,
            lineNumber: line.number,
          });
        } else {
          logError(fileName, `Segmento U sem T correspondente na linha ${line.number}`, logErrorOpts);
        }
      } else {
        logError(fileName, `Segmento U sem T correspondente na linha ${line.number}`, logErrorOpts);
      }
      currentSegmentT = null;
    } else if (currentSegmentT) {
      // Se encontrou outro tipo de segmento após T, descartar o T
      logError(fileName, `Segmento T sem U correspondente na linha ${line.number}`, logErrorOpts);
      currentSegmentT = null;
    }
  }

  if (tuPairs.length === 0) {
    logError(fileName, 'Nenhum par T/U encontrado, pulando salvamento...', logErrorOpts);
    return;
  }

  // Salvar JSON no mesmo diretório
  const jsonPath = join(fileDir, `${fileName}.json`);
  const jsonData = {
    filePath,
    fileName,
    cnabType: result.cnabType,
    header: cnabData.header,
    tuPairs: tuPairs.map(pair => ({
      lineNumber: pair.lineNumber,
      segmentT: pair.segmentT,
      segmentU: pair.segmentU,
    })),
    metadata: result.metadata,
  };

  writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');

  // Obter hash do arquivo
  const fileHash = await getFileHash(filePath);

  // Inserir registros no banco
  const { auditInfo } = await insertCNAB240RecordsToDatabase(fileName, result.cnabType, cnabData.header, tuPairs, fileHash, logErrorOpts);

  // Se atende aos filtros de auditoria: mover para <AUDIT_DIR>/<dd>/<regional>/ e registrar no log
  if (auditInfo) {
    await moveFileToAuditFolder({ sourceFilePath: filePath, jsonPath, day: auditInfo.day, regional: auditInfo.regional, auditDir: AUDIT_DIR });
    logAuditFile(fileName, auditInfo.reason, logAuditFileOpts);
  }

  stats.processedFiles++;
  stats.totalRecords += tuPairs.length;
}

/**
 * Processa um arquivo CNAB 400 e extrai detalhes
 */
async function processCNAB400File(
  filePath: string,
  fileName: string,
  result: { cnabType: string; metadata?: { lineCount?: number; fileSize?: number } },
  cnabData: CNAB400
): Promise<void> {
  const fileDir = dirname(filePath);

  // Extrair detalhes (tipo de registro 7)
  const detalhes: Array<{ detalhe: DetalheCNAB400; lineNumber: number }> = [];

  for (const line of cnabData.lines) {
    if (!line.payload) continue;

    if (isDetalheCNAB400(line.payload)) {
      detalhes.push({
        detalhe: line.payload,
        lineNumber: line.number,
      });
    }
  }

  if (detalhes.length === 0) {
    logError(fileName, 'Nenhum detalhe encontrado, pulando salvamento...', logErrorOpts);
    return;
  }

  // Salvar JSON no mesmo diretório
  const jsonPath = join(fileDir, `${fileName}.json`);
  const jsonData = {
    filePath,
    fileName,
    cnabType: result.cnabType,
    header: cnabData.header,
    detalhes: detalhes.map(d => ({
      lineNumber: d.lineNumber,
      detalhe: d.detalhe,
    })),
    metadata: result.metadata,
  };

  writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');

  // Obter hash do arquivo
  const fileHash = await getFileHash(filePath);

  // Inserir registros no banco
  const { auditInfo } = await insertCNAB400RecordsToDatabase(fileName, result.cnabType, cnabData.header, detalhes, fileHash, logErrorOpts);

  // Se atende aos filtros de auditoria: mover para <AUDIT_DIR>/<dd>/<regional>/ e registrar no log
  if (auditInfo) {
    await moveFileToAuditFolder({ sourceFilePath: filePath, jsonPath, day: auditInfo.day, regional: auditInfo.regional, auditDir: AUDIT_DIR });
    logAuditFile(fileName, auditInfo.reason, logAuditFileOpts);
  }

  stats.processedFiles++;
  stats.totalRecords += detalhes.length;
}

/**
 * Processa um arquivo CNAB e extrai segmentos T e U
 */
async function processFile(filePath: string): Promise<void> {
  const fileName = basename(filePath);

  console.log(`\n[${stats.processedFiles + 1}/${stats.totalFiles}] Processando: ${fileName}`);

  try {
    // Ler arquivo usando ReadRetFileService
    const readService = new ReadRetFileService();
    const result = await readService.read(filePath);

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Falha ao ler arquivo');
    }

    // Processar apenas arquivos CNAB 240 ou CNAB 400
    if (result.cnabType === 'UNKNOWN') {
      logError(fileName, 'Tipo de arquivo desconhecido, pulando...', logErrorOpts);
      return;
    }

    // Aplicar filtro de tipo de arquivo
    const isCNAB240 = result.cnabType === 'CNAB240_30' || result.cnabType === 'CNAB240_40';
    const isCNAB400 = result.cnabType === 'CNAB400';

    if (FILE_TYPE_FILTER === 'CNAB400' && !isCNAB400) {
      // console.log(`  ⊘ ${fileName}: Pulando (filtro: apenas CNAB 400)`);
      return;
    }

    if (FILE_TYPE_FILTER === 'CNAB240' && !isCNAB240) {
      // console.log(`  ⊘ ${fileName}: Pulando (filtro: apenas CNAB 240)`);
      return;
    }

    // Processar CNAB 240
    if (isCNAB240) {
      await processCNAB240File(filePath, fileName, result, result.data as CNAB240);
      return;
    }

    // Processar CNAB 400
    if (isCNAB400) {
      await processCNAB400File(filePath, fileName, result, result.data as CNAB400);
      return;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    stats.failedFiles++;
    stats.errors.push({ file: filePath, error: errorMessage });
    logError(fileName, errorMessage, logErrorOpts);
  }
}

/**
 * Mapeia pares T/U (CNAB 240) para AuditReturnRecord e chama upsertAuditRecords.
 */
async function insertCNAB240RecordsToDatabase(
  fileName: string,
  cnabType: string,
  header: CNAB240['header'],
  tuPairs: Array<{ segmentT: SegmentoT; segmentU: SegmentoU; lineNumber: number }>,
  fileHash: string,
  logErrorOpts: LogErrorOpts
): Promise<{ auditInfo: { regional: string; day: string; reason: string } | null }> {
  const records: AuditReturnRecord[] = tuPairs.map((pair) => {
    const { segmentT, segmentU, lineNumber } = pair;
    const recordHash = generateRecordHash(fileHash, lineNumber);
    const agreement = segmentT.agreement;
    return {
      recordHash,
      regional: getRegionalByAgreement(agreement),
      fileName,
      cnabType,
      lineNumber,
      bankCode: segmentT.bankCode,
      agreement,
      lotCode: segmentT.lotCode,
      regionalNumber: segmentT.regionalNumber,
      regionalNumberDigit: segmentT.regionalNumberDigit,
      titleNumber: segmentT.titleNumber || null,
      titleType: segmentT.titleType || null,
      agency: segmentT.agency || null,
      agencyDigit: segmentT.agencyDigit || null,
      account: segmentT.account || null,
      accountDigit: segmentT.accountDigit || null,
      payerName: segmentT.payerName || null,
      payerRegistration: segmentT.payerRegistration || null,
      payerRegistrationType: segmentT.payerRegistrationType || null,
      movementCode: segmentT.movementCode,
      occurrenceCode: null,
      receivedValue: segmentT.receivedValue ?? null,
      tariff: segmentT.tariff ?? null,
      accruedInterest: segmentU.accruedInterest ?? null,
      discountAmount: segmentU.discountAmount ?? null,
      dischargeAmount: segmentU.dischargeAmount ?? null,
      paidAmount: segmentU.paidAmount ?? null,
      otherExpenses: segmentU.otherExpenses ?? null,
      otherCredits: segmentU.otherCredits ?? null,
      netCreditValue: segmentU.receivedValue ?? null,
      paymentDate: parseCnabDate(segmentU.paymentDate),
      creditDate: parseCnabDate(segmentU.creditDate),
      fileGenerationDate: header.generationDate || null,
      fileSequence: header.fileSequence || null,
    };
  });
  return upsertAuditRecords({ fileName, records, logErrorOpts });
}

/**
 * Mapeia detalhes (CNAB 400) para AuditReturnRecord e chama upsertAuditRecords.
 */
async function insertCNAB400RecordsToDatabase(
  fileName: string,
  cnabType: string,
  header: CNAB400['header'],
  detalhes: Array<{ detalhe: DetalheCNAB400; lineNumber: number }>,
  fileHash: string,
  logErrorOpts: LogErrorOpts
): Promise<{ auditInfo: { regional: string; day: string; reason: string } | null }> {
  const records: AuditReturnRecord[] = detalhes.map(({ detalhe, lineNumber }) => {
    const recordHash = generateRecordHash(fileHash, lineNumber);
    const agreement = detalhe.agreement;
    return {
      recordHash,
      regional: getRegionalByAgreement(agreement),
      fileName,
      cnabType,
      lineNumber,
      bankCode: header.bankCode || '',
      agreement,
      lotCode: '',
      regionalNumber: detalhe.regionalNumber,
      regionalNumberDigit: detalhe.regionalNumberDigit,
      titleNumber: null,
      titleType: null,
      agency: detalhe.agency || null,
      agencyDigit: detalhe.agencyDigit || null,
      account: detalhe.account || null,
      accountDigit: detalhe.accountDigit || null,
      payerName: null,
      payerRegistration: null,
      payerRegistrationType: null,
      movementCode: detalhe.movementCode || '',
      occurrenceCode: null,
      receivedValue: detalhe.receivedValue || null,
      tariff: detalhe.tariff || null,
      accruedInterest: null,
      discountAmount: null,
      dischargeAmount: null,
      paidAmount: null,
      otherExpenses: null,
      otherCredits: null,
      netCreditValue: detalhe.receivedValue || null,
      paymentDate: parseCnabDate(detalhe.paymentDate ? expandYear(detalhe.paymentDate) : null),
      creditDate: parseCnabDate(detalhe.creditDate ? expandYear(detalhe.creditDate) : null),
      fileGenerationDate: header.generationDate ? expandYear(header.generationDate) : null,
      fileSequence: header.fileSequence || null,
    };
  });
  return upsertAuditRecords({ fileName, records, logErrorOpts });
}

/**
 * Função principal
 */
async function main(): Promise<void> {
  console.log('='.repeat(80));
  console.log('Script de Auditoria CNAB 240 - Dezembro 2025');
  console.log('='.repeat(80));
  console.log(`\nDiretório de auditoria: ${AUDIT_DIR}`);

  // Verificar se o diretório existe
  if (!existsSync(AUDIT_DIR)) {
    console.error(`\n✗ Erro: Diretório não encontrado: ${AUDIT_DIR}`);
    process.exit(1);
  }

  // Listar arquivos
  console.log('\nListando arquivos CNAB...');
  const files = listCnabFiles(AUDIT_DIR);
  stats.totalFiles = files.length;

  console.log(`\n✓ Encontrados ${files.length} arquivos CNAB`);

  if (files.length === 0) {
    console.log('\nNenhum arquivo para processar. Encerrando...');
    await prisma.$disconnect();
    return;
  }

  // Processar cada arquivo
  console.log('\nIniciando processamento...\n');

  for (const file of files) {
    await processFile(file);
  }

  // Resumo final
  console.log('\n' + '='.repeat(80));
  console.log('Resumo do Processamento');
  console.log('='.repeat(80));
  console.log(`Total de arquivos: ${stats.totalFiles}`);
  console.log(`Arquivos processados com sucesso: ${stats.processedFiles}`);
  console.log(`Arquivos com erro: ${stats.failedFiles}`);
  console.log(`Total de registros encontrados: ${stats.totalRecords}`);
  console.log(`Registros inseridos no banco: ${stats.insertedRecords}`);

  if (stats.errors.length > 0) {
    console.log(`\nErros encontrados (${stats.errors.length}):`);
    stats.errors.slice(0, 10).forEach((err, idx) => {
      console.log(`  ${idx + 1}. ${basename(err.file)}: ${err.error}`);
    });
    if (stats.errors.length > 10) {
      console.log(`  ... e mais ${stats.errors.length - 10} erros`);
    }
  }

  console.log('\n✓ Processamento concluído!');

  if (stats.errors.length > 0) {
    console.log(`\n📝 Log de erros salvo em: ${LOG_FILE}`);
  }

  if (loggedAuditFiles.size > 0) {
    console.log(`\n📋 Log de arquivos para auditoria salvo em: ${AUDIT_LOG_FILE}`);
    console.log(`   Total de arquivos marcados para auditoria: ${loggedAuditFiles.size}`);
  }

  // Desconectar Prisma
  await prisma.$disconnect();
}

// Executar
main().catch(error => {
  const errorMsg = error instanceof Error ? error.message : String(error);
  console.error('\n✗ Erro fatal:');
  logError('SCRIPT_FATAL', errorMsg, logErrorOpts);
  process.exit(1);
});
