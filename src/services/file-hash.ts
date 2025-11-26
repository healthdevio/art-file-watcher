import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { basename } from 'path';

/**
 * Resultado da geração de hash de um arquivo
 */
export interface HashResult {
  fileName: string;
  fileHash: string;
  filePath: string;
}

/**
 * Extrai o nome do arquivo de um caminho completo
 *
 * @param filePath - Caminho completo do arquivo
 * @returns Nome do arquivo ou 'unknown_file' se não puder ser extraído
 */
function extractFileName(filePath: string): string {
  try {
    return basename(filePath) || 'unknown_file';
  } catch {
    return 'unknown_file';
  }
}

/**
 * Gera o hash SHA256 de um arquivo usando streams para eficiência de memória.
 * Esta função é assíncrona e usa callbacks, então retorna uma Promise.
 *
 * @param filePath - Caminho completo para o arquivo
 * @returns Promise com o resultado contendo nome do arquivo, hash e caminho
 */
export function generateFileHash(filePath: string): Promise<HashResult> {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const stream = createReadStream(filePath);
    const fileName = extractFileName(filePath);

    stream.on('data', (data: Buffer | string) => {
      hash.update(data);
    });

    stream.on('end', () => {
      const fileHash = hash.digest('hex');
      resolve({
        fileName,
        fileHash,
        filePath,
      });
    });

    stream.on('error', (err: NodeJS.ErrnoException) => {
      // Erros comuns que podem ser ignorados
      if (err.code === 'ENOENT') {
        reject(new Error(`Arquivo não encontrado ou removido antes de ser processado: ${filePath}`));
        return;
      }

      reject(new Error(`Erro ao ler arquivo ${filePath}: ${err.message}`));
    });
  });
}
