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
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import type { CNAB240, SegmentoT, SegmentoU } from '../src/services/read-ret-file/interfaces/CNAB-240';
import type { CNAB400, DetalheCNAB400 } from '../src/services/read-ret-file/interfaces/CNAB-400';
import { ReadRetFileService } from '../src/services/read-ret-file/read-ret-file.service';

// Configurações hardcoded conforme especificado
const AUDIT_DIR = resolve(__dirname, '../volumes/audit/2025-12');
const OUTPUT_DIR_SUFFIX = 'output'; // Não usado - salvamos no mesmo diretório
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
 */
function parseCnabDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || dateStr.trim() === '' || dateStr === '00000000' || dateStr === '        ') {
    return null;
  }
  
  // Formato esperado: DD/MM/YYYY (já vem formatado do parser)
  // Ou DDMMAAAA (formato raw)
  let day: string, month: string, year: string;
  
  const trimmed = dateStr.trim();
  
  if (trimmed.includes('/')) {
    // Formato DD/MM/YYYY
    const parts = trimmed.split('/');
    if (parts.length !== 3) return null;
    day = parts[0].padStart(2, '0');
    month = parts[1].padStart(2, '0');
    year = parts[2];
  } else {
    // Formato DDMMAAAA
    if (trimmed.length !== 8) return null;
    day = trimmed.substring(0, 2);
    month = trimmed.substring(2, 4);
    year = trimmed.substring(4, 8);
  }
  
  // Validar valores
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
    return null;
  }
  
  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900) {
    return null;
  }
  
  const date = new Date(`${year}-${month}-${day}`);
  if (isNaN(date.getTime())) return null;
  
  return date;
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
  
  // Inserir registros no banco
  await insertCNAB240RecordsToDatabase(filePath, fileName, result.cnabType, cnabData.header.generationDate, tuPairs);
  
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
  
  // Inserir registros no banco
  await insertCNAB400RecordsToDatabase(filePath, fileName, result.cnabType, cnabData.header, detalhes);
  
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
    
    // Processar CNAB 240
    if (result.cnabType === 'CNAB240_30' || result.cnabType === 'CNAB240_40') {
      await processCNAB240File(filePath, fileName, result, result.data as CNAB240);
      return;
    }
    
    // Processar CNAB 400
    if (result.cnabType === 'CNAB400') {
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
  filePath: string,
  fileName: string,
  cnabType: string,
  fileGenerationDate: string | undefined,
  tuPairs: Array<{ segmentT: SegmentoT; segmentU: SegmentoU; lineNumber: number }>
): Promise<void> {
  const records = tuPairs.map(pair => {
    const { segmentT, segmentU, lineNumber } = pair;
    
    return {
      filePath,
      fileName,
      cnabType,
      lineNumber,
      
      // Banco e Convênio
      bankCode: segmentT.bankCode,
      agreement: segmentT.agreement,
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
      occurrenceCode: segmentU.occurrenceCode || null,
      
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
  
  // Inserir em lote
  try {
    await prisma.auditReturn.createMany({
      data: records,
      skipDuplicates: true, // Evitar duplicatas baseado em índices únicos se houver
    });
    
    stats.insertedRecords += records.length;
    console.log(`  ✓ ${records.length} registros inseridos no banco`);
  } catch (error) {
    // Se falhar inserção em lote, tentar individualmente
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`  ⚠️  Erro em inserção em lote, tentando individualmente...`);
    logError(fileName, `Erro em inserção em lote: ${errorMsg}`);
    let inserted = 0;
    
    for (const record of records) {
      try {
        await prisma.auditReturn.create({ data: record });
        inserted++;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(fileName, `Erro ao inserir registro linha ${record.lineNumber}: ${errorMsg}`);
      }
    }
    
    stats.insertedRecords += inserted;
    console.log(`  ✓ ${inserted}/${records.length} registros inseridos`);
  }
}

/**
 * Insere registros CNAB 400 no banco de dados
 */
async function insertCNAB400RecordsToDatabase(
  filePath: string,
  fileName: string,
  cnabType: string,
  header: CNAB400['header'],
  detalhes: Array<{ detalhe: DetalheCNAB400; lineNumber: number }>
): Promise<void> {
  const records = detalhes.map(({ detalhe, lineNumber }) => {
    // CNAB 400 não tem alguns campos do CNAB 240, então usamos null
    return {
      filePath,
      fileName,
      cnabType,
      lineNumber,
      
      // Banco e Convênio
      bankCode: header.bankCode || '',
      agreement: detalhe.agreement,
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
      
      // Movimentação - CNAB 400 não tem código de movimento separado
      movementCode: '', // Vazio para CNAB 400
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
  
  // Inserir em lote
  try {
    await prisma.auditReturn.createMany({
      data: records,
      skipDuplicates: true,
    });
    
    stats.insertedRecords += records.length;
    console.log(`  ✓ ${records.length} registros inseridos no banco`);
  } catch (error) {
    // Se falhar inserção em lote, tentar individualmente
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`  ⚠️  Erro em inserção em lote, tentando individualmente...`);
    logError(fileName, `Erro em inserção em lote: ${errorMsg}`);
    let inserted = 0;
    
    for (const record of records) {
      try {
        await prisma.auditReturn.create({ data: record });
        inserted++;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(fileName, `Erro ao inserir registro linha ${record.lineNumber}: ${errorMsg}`);
      }
    }
    
    stats.insertedRecords += inserted;
    console.log(`  ✓ ${inserted}/${records.length} registros inseridos`);
  }
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
