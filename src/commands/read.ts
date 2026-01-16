import { existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { ReadResult, ReadRetFileService } from '../services/read-ret-file';
import { ensureDirectory } from '../utils/directory';
import { saveFile } from '../utils/file';
import { safeLogger } from '../utils/logger';

export interface ReadCommandOptions {
  file: string;
  format?: 'json' | 'text';
  json?: boolean;
  output?: string;
}

/**
 * Formata o resultado da leitura para saída JSON
 */
function formatAsJson(result: ReadResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Formata o resultado da leitura para saída de texto legível
 */
function formatAsText(result: ReadResult): string {
  if (!result?.success) {
    return `❌ Erro ao ler arquivo: ${result?.error || 'Erro desconhecido'}`;
  }

  let output = `\n📄 Arquivo: ${result.filePath}\n`;
  output += `📋 Tipo CNAB: ${result.cnabType}\n`;

  if (result.metadata) {
    if (result.metadata.lineCount !== undefined) {
      output += `📊 Linhas: ${result.metadata.lineCount}\n`;
    }
    if (result.metadata.fileSize !== undefined) {
      output += `💾 Tamanho: ${result.metadata.fileSize} bytes\n`;
    }
  }

  if (result.data) {
    output += `\n📦 Dados do arquivo:\n`;
    if ('header' in result.data) {
      output += `  Header: ${JSON.stringify(result.data.header, null, 2)}\n`;
    }
    if ('lines' in result.data && Array.isArray(result.data.lines)) {
      output += `  Total de linhas: ${result.data.lines.length}\n`;
    }
  }

  output += '\n';

  return output;
}

function writeOutput(content: string, outputPath: string): void {
  const absoluteOutputPath = resolve(outputPath);
  const outputDir = dirname(absoluteOutputPath);
  const dirResult = ensureDirectory(outputDir, true);
  if (!dirResult?.success) throw new Error(`Erro ao criar diretório: ${dirResult?.message}`);
  saveFile(absoluteOutputPath, content);
}

/**
 * Handler do comando read
 */
export async function handleReadCommand(options: ReadCommandOptions): Promise<void> {
  const logger = safeLogger();

  try {
    // Resolve o caminho absoluto do arquivo de entrada
    const absoluteFilePath = resolve(options.file);

    // Valida se o arquivo existe
    if (!existsSync(absoluteFilePath)) {
      const errorMessage = `Arquivo não encontrado: ${absoluteFilePath}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    // Valida se é um arquivo (não diretório)
    const stats = statSync(absoluteFilePath);
    if (!stats?.isFile()) {
      const errorMessage = `O caminho não é um arquivo: ${absoluteFilePath}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    logger.info(`Lendo arquivo: ${absoluteFilePath}`);

    // Cria instância do serviço e lê o arquivo
    // O serviço aceita string (path), Buffer ou Stream
    const readService = new ReadRetFileService();
    const result = await readService.read(absoluteFilePath);

    // Determina o formato de saída
    const outputFormat = options.json || options.format === 'json' ? 'json' : 'text';

    // Formata o resultado
    const formattedOutput = outputFormat === 'json' ? formatAsJson(result) : formatAsText(result);

    // Se --output foi fornecido, salva em arquivo
    if (options?.output) {
      const absoluteOutputPath = resolve(options.output);
      writeOutput(formattedOutput, absoluteOutputPath);
      logger.info(`✅ Resultado salvo em: ${absoluteOutputPath}`);
    } else {
      // Caso contrário, exibe no console
      // Limita o tamanho apenas para formato texto (não para JSON)
      const outputToDisplay = outputFormat === 'json' ? formattedOutput : formattedOutput.slice(0, 2048);
      console.log(outputToDisplay);
      // console.log(outputToDisplay?.slice(0, 2048));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    logger.error(`Erro ao processar comando read: ${errorMessage}`);
    throw error;
  }
}
