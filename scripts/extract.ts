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
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import PQueue from 'p-queue';
import { generateFileHash } from '../src/services/file-hash';
import type { CNAB240, SegmentoT, SegmentoU } from '../src/services/read-ret-file/interfaces/CNAB-240';
import type { CNAB400, DetalheCNAB400 } from '../src/services/read-ret-file/interfaces/CNAB-400';
import { ReadRetFileService } from '../src/services/read-ret-file/read-ret-file.service';
import { adjustToBrasiliaTimezone, tryDate } from '../src/services/read-ret-file/schema/core/date-utils';

// Configurações hardcoded conforme especificado
const AUDIT_DIR = resolve(__dirname, '../volumes/audit/2026-01-22');
const LOG_DIR = resolve(__dirname, '../volumes/audit/logs');
const LOG_FILE = join(LOG_DIR, `errors_${new Date().toISOString().split('T')[0]}.log`);

// Limpar arquivo de log no início de cada execução para evitar duplicação entre execuções
if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}
if (existsSync(LOG_FILE)) {
  writeFileSync(LOG_FILE, '', 'utf-8');
}

// Inicializar arquivo de log (limpar se existir para evitar duplicação entre execuções)
if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}
// Limpar arquivo de log no início de cada execução
if (existsSync(LOG_FILE)) {
  writeFileSync(LOG_FILE, '', 'utf-8');
}

// Extensões de arquivos CNAB conhecidas
const CNAB_EXTENSIONS = ['.RET', '.A2T9R5', '.A2U7F4', '.A2U1W8', '.ret', '.a2t9r5', '.a2u7f4', '.a2u1w8'];

// Filtro de tipo de arquivo para processar
// Valores possíveis: 'CNAB400' | 'CNAB240' | 'ALL'
// Altere apenas esta linha para mudar o filtro
const FILE_TYPE_FILTER: 'CNAB400' | 'CNAB240' | 'ALL' = 'ALL';

const agreementToRegional = [
  { agreement: '73356', regional: 'MS' },
  { agreement: '234757', regional: 'BA' },
  { agreement: '81294', regional: 'PR' },
  { agreement: '52996', regional: 'ES' },
  { agreement: '2835965', regional: 'AC' },
  { agreement: '2835375', regional: 'AL' },
{ agreement: '2909128', regional: 'AM' },
{ agreement: '2828039', regional: 'AP' },
{ agreement: '2848659', regional: 'DF' },
{ agreement: '3726559', regional: 'CE' },
{ agreement: '3632840', regional: 'ES' },
{ agreement: '2832069', regional: 'GO' },
{ agreement: '3711056', regional: 'MA' },
{ agreement: '2832133', regional: 'MG' },
{ agreement: '3704138', regional: 'MT' },
{ agreement: '3643071', regional: 'RN' },
{ agreement: '3402948', regional: 'PB' },
{ agreement: '2810159', regional: 'PE' },
{ agreement: '2810627', regional: 'PI' },
{ agreement: '3650623', regional: 'PR' },
{ agreement: '2807857', regional: 'RJ' },
{ agreement: '3618432', regional: 'RO' },
{ agreement: '3556968', regional: 'RR' },
{ agreement: '3398378', regional: 'TO' },
{ agreement: '054743', regional: 'CE' },
{ agreement: '052261', regional: 'MA' },
{ agreement: '220180', regional: 'RN' },
{ agreement: '051316', regional: 'SE' },
{ agreement: '081298', regional: '' },
{ agreement: '082036', regional: ''},
{ agreement: '051159', regional: ''},
{ agreement: '054067', regional: ''},
{ agreement: '051367', regional: ''},
{ agreement: '076882', regional: ''},
{ agreement: '2803079', regional: ''},
{ agreement: '220172', regional: ''},
{ agreement: '3751520', regional: ''},
{ agreement: '3751521', regional: ''},
{ agreement: '3751530', regional: ''},
{ agreement: '3751535', regional: ''},
{ agreement: '3751542', regional: ''},
{ agreement: '3751538', regional: ''},
{ agreement: '3751544', regional: ''},
{ agreement: '3751546', regional: ''},
{ agreement: '3751547', regional: ''},
{ agreement: '3751550', regional: ''},
{ agreement: '3751549', regional: ''},
{ agreement: '3751551', regional: ''},
{ agreement: '3751552', regional: ''},
{ agreement: '3751554', regional: ''},
{ agreement: '3751557', regional: ''},
{ agreement: '3751558', regional: ''},
{ agreement: '3751563', regional: ''},
{ agreement: '3751562', regional: ''},
{ agreement: '2808666', regional: ''},
{ agreement: '2811856', regional: ''},
{ agreement: '2812778', regional: ''},
{ agreement: '2812861', regional: ''},
{ agreement: '2814902', regional: ''},
{ agreement: '2820878', regional: ''},
{ agreement: '2822201', regional: ''},
{ agreement: '2826443', regional: ''},
{ agreement: '2891862', regional: '' },
{ agreement: '052358', regional: '' },
{ agreement: '051317', regional: '' },
{ agreement: '3085950', regional: '' },
{ agreement: '054074', regional: '' },
{ agreement: '219695', regional: '' },
{ agreement: '081052', regional: '' },
{ agreement: '052360', regional: '' },
]

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

// Cache de hashes de arquivos para evitar recalcular
const fileHashCache = new Map<string, string>();

// Fila para limitar concorrência de upserts (evitar esgotar pool de conexões)
const UPSERT_CONCURRENCY = 8; // Limitar a 10 upserts simultâneos

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
 * Escreve um erro no arquivo de log e no console
 * Evita duplicação verificando se a mensagem já foi logada nesta execução
 * Também verifica se já existe no arquivo para evitar duplicação entre execuções
 */
function logError(fileName: string, error: string): void {
  // Criar chave única para evitar duplicação dentro da mesma execução
  const messageKey = `${fileName}|${error}`;
  
  // Se já foi logado nesta execução, não logar novamente
  if (loggedMessages.has(messageKey)) {
    return;
  }
  
  // Verificar se já existe no arquivo (para evitar duplicação entre execuções)
  try {
    if (existsSync(LOG_FILE)) {
      const fileContent = readFileSync(LOG_FILE, 'utf-8');
      const searchPattern = `${fileName} | ${error}`;
      if (fileContent.includes(searchPattern)) {
        // Já existe no arquivo, apenas marcar como logado e não escrever novamente
        loggedMessages.add(messageKey);
        console.error(`  ✗ ${fileName}: ${error}`);
        return;
      }
    }
  } catch {
    // Se falhar ao ler arquivo, continuar normalmente
  }
  
  // Marcar como logado ANTES de escrever para evitar race conditions
  loggedMessages.add(messageKey);
  
  try {
    // Garantir que o diretório existe
    if (!existsSync(LOG_DIR)) {
      mkdirSync(LOG_DIR, { recursive: true });
    }
    
    // Escrever no arquivo apenas uma vez
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${fileName} | ${error}\n`;
    
    appendFileSync(LOG_FILE, logLine, 'utf-8');
    
    // Exibir no console apenas após escrever no arquivo com sucesso
    console.error(`  ✗ ${fileName}: ${error}`);
  } catch (logErr) {
    // Se falhar ao escrever log, apenas imprime no console (sem duplicar)
    const errorKey = `LOG_WRITE_ERROR|${fileName}|${error}`;
    if (!loggedMessages.has(errorKey)) {
      loggedMessages.add(errorKey);
      console.error(`  ✗ ${fileName}: ${error}`);
      console.error('Erro ao escrever log:', logErr);
    }
  }
}

/**
 * Verifica se um arquivo é um arquivo CNAB válido
 */
function isCnabFile(filePath: string): boolean {
  const ext = filePath.substring(filePath.lastIndexOf('.')).toUpperCase();
  return CNAB_EXTENSIONS.some(e => e.toUpperCase() === ext);
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
          logError(fileName, `Segmento U sem T correspondente na linha ${line.number}`);
        }
      } else {
        logError(fileName, `Segmento U sem T correspondente na linha ${line.number}`);
      }
      currentSegmentT = null;
    } else if (currentSegmentT) {
      // Se encontrou outro tipo de segmento após T, descartar o T
      logError(fileName, `Segmento T sem U correspondente na linha ${line.number}`);
      currentSegmentT = null;
    }
  }
  
  if (tuPairs.length === 0) {
    logError(fileName, 'Nenhum par T/U encontrado, pulando salvamento...');
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
  await insertCNAB240RecordsToDatabase(fileName, result.cnabType, cnabData.header.generationDate, tuPairs, fileHash);
  
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
    logError(fileName, 'Nenhum detalhe encontrado, pulando salvamento...');
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
  await insertCNAB400RecordsToDatabase(fileName, result.cnabType, cnabData.header, detalhes, fileHash);
  
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
      logError(fileName, 'Tipo de arquivo desconhecido, pulando...');
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
    logError(fileName, errorMessage);
  }
}

/**
 * Insere registros CNAB 240 no banco de dados
 */
async function insertCNAB240RecordsToDatabase(
  fileName: string,
  cnabType: string,
  fileGenerationDate: string | undefined,
  tuPairs: Array<{ segmentT: SegmentoT; segmentU: SegmentoU; lineNumber: number }>,
  fileHash: string
): Promise<void> {
  const records = tuPairs.map(pair => {
    const { segmentT, segmentU, lineNumber } = pair;
    const recordHash = generateRecordHash(fileHash, lineNumber);
    const agreement = segmentT.agreement;
    
    return {
      recordHash,
      regional: getRegionalByAgreement(agreement),
      fileName,
      cnabType,
      lineNumber,
      
      // Banco e Convênio
      bankCode: segmentT.bankCode,
      agreement,
      lotCode: segmentT.lotCode,
      
      // Título
      regionalNumber: segmentT.regionalNumber,
      regionalNumberDigit: segmentT.regionalNumberDigit,
      titleNumber: segmentT.titleNumber || null,
      titlePortfolio: segmentT.titlePortfolio || null,
      titleType: segmentT.titleType || null,
      
      // Conta bancária
      agency: segmentT.agency || null,
      agencyDigit: segmentT.agencyDigit || null,
      account: segmentT.account || null,
      accountDigit: segmentT.accountDigit || null,
      
      // Pagador
      payerName: segmentT.payerName || null,
      payerRegistration: segmentT.payerRegistration || null,
      payerRegistrationType: segmentT.payerRegistrationType || null,
      
      // Movimentação
      movementCode: segmentT.movementCode,
      occurrenceCode: null, // occurrenceCode não está disponível no SegmentoU
      
      // Valores do Segmento T - confiando totalmente no serviço read-ret-file
      receivedValue: segmentT.receivedValue ?? null,
      tariff: segmentT.tariff ?? null,
      
      // Valores do Segmento U - confiando totalmente no serviço read-ret-file
      accruedInterest: segmentU.accruedInterest ?? null,
      discountAmount: segmentU.discountAmount ?? null,
      dischargeAmount: segmentU.dischargeAmount ?? null,
      paidAmount: segmentU.paidAmount ?? null,
      otherExpenses: segmentU.otherExpenses ?? null,
      otherCredits: segmentU.otherCredits ?? null,
      netCreditValue: segmentU.receivedValue ?? null, // Valor líquido creditado
      
      // Datas
      paymentDate: parseCnabDate(segmentU.paymentDate),
      creditDate: parseCnabDate(segmentU.creditDate),
      
      // Metadados
      fileGenerationDate: fileGenerationDate || null,
    };
  });
  
  // Inserir/atualizar usando upsert com concorrência limitada (evita esgotar pool de conexões)
  const queue = new PQueue({ concurrency: UPSERT_CONCURRENCY });
  let upserted = 0;
  let errors = 0;
  
  // Adicionar todos os upserts na fila com concorrência limitada
  const upsertPromises = records.map((record) =>
    queue.add(async () => {
      try {
        await prisma.auditReturn.upsert({
          where: { recordHash: record.recordHash },
          update: record, // Atualiza se já existir
          create: record, // Cria se não existir
        });
        upserted++;
        return { success: true };
      } catch (err) {
        errors++;
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(fileName, `Erro ao fazer upsert registro linha ${record.lineNumber}: ${errorMsg}`);
        return { success: false };
      }
    })
  );
  
  // Aguardar todos os upserts completarem
  await Promise.all(upsertPromises);
  
  stats.insertedRecords += upserted;
  console.log(`  ✓ ${upserted}/${records.length} registros processados${errors > 0 ? ` (${errors} erros)` : ''}`);
}

/**
 * Insere registros CNAB 400 no banco de dados
 */
async function insertCNAB400RecordsToDatabase(
  fileName: string,
  cnabType: string,
  header: CNAB400['header'],
  detalhes: Array<{ detalhe: DetalheCNAB400; lineNumber: number }>,
  fileHash: string
): Promise<void> {
  const records = detalhes.map(({ detalhe, lineNumber }) => {
    const recordHash = generateRecordHash(fileHash, lineNumber);
    const agreement = detalhe.agreement;
    
    // CNAB 400 não tem alguns campos do CNAB 240, então usamos null
    return {
      recordHash,
      regional: getRegionalByAgreement(agreement),
      fileName,
      cnabType,
      lineNumber,
      
      // Banco e Convênio
      bankCode: header.bankCode || '',
      agreement,
      lotCode: '', // CNAB 400 não tem lote
      
      // Título
      regionalNumber: detalhe.regionalNumber,
      regionalNumberDigit: detalhe.regionalNumberDigit,
      titleNumber: null, // CNAB 400 não tem este campo separado
      titlePortfolio: null,
      titleType: null,
      
      // Conta bancária
      agency: detalhe.agency || null,
      agencyDigit: detalhe.agencyDigit || null,
      account: detalhe.account || null,
      accountDigit: detalhe.accountDigit || null,
      
      // Pagador - CNAB 400 não tem estes campos
      payerName: null,
      payerRegistration: null,
      payerRegistrationType: null,
      
      // Movimentação
      movementCode: detalhe.movementCode || '',
      occurrenceCode: null,
      
      // Valores do Segmento T (CNAB 400 tem apenas receivedValue e tariff)
      receivedValue: detalhe.receivedValue || null,
      tariff: detalhe.tariff || null,
      
      // Valores do Segmento U - CNAB 400 não tem estes campos detalhados
      accruedInterest: null,
      discountAmount: null,
      dischargeAmount: null,
      paidAmount: null, // CNAB 400 não diferencia valor pago do creditado
      otherExpenses: null,
      otherCredits: null,
      netCreditValue: detalhe.receivedValue || null, // No CNAB 400, receivedValue é o valor creditado
      
      // Datas - expandir ano de 2 para 4 dígitos se necessário
      paymentDate: parseCnabDate(detalhe.paymentDate ? expandYear(detalhe.paymentDate) : null),
      creditDate: parseCnabDate(detalhe.creditDate ? expandYear(detalhe.creditDate) : null),
      
      // Metadados
      fileGenerationDate: header.generationDate ? expandYear(header.generationDate) : null,
    };
  });
  
  // Inserir/atualizar usando upsert com concorrência limitada (evita esgotar pool de conexões)
  const queue = new PQueue({ concurrency: UPSERT_CONCURRENCY });
  let upserted = 0;
  let errors = 0;
  
  // Adicionar todos os upserts na fila com concorrência limitada
  const upsertPromises = records.map((record) =>
    queue.add(async () => {
      try {
        await prisma.auditReturn.upsert({
          where: { recordHash: record.recordHash },
          update: record, // Atualiza se já existir
          create: record, // Cria se não existir
        });
        upserted++;
        return { success: true };
      } catch (err) {
        errors++;
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(fileName, `Erro ao fazer upsert registro linha ${record.lineNumber}: ${errorMsg}`);
        return { success: false };
      }
    })
  );
  
  // Aguardar todos os upserts completarem
  await Promise.all(upsertPromises);
  
  stats.insertedRecords += upserted;
  console.log(`  ✓ ${upserted}/${records.length} registros processados${errors > 0 ? ` (${errors} erros)` : ''}`);
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
  
  // Desconectar Prisma
  await prisma.$disconnect();
}

// Executar
main().catch(error => {
  const errorMsg = error instanceof Error ? error.message : String(error);
  console.error('\n✗ Erro fatal:');
  logError('SCRIPT_FATAL', errorMsg);
  process.exit(1);
});
