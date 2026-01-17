import { readFileSync } from 'fs';
import { Readable } from 'node:stream';

/**
 * Helper para leitura de arquivos de diferentes fontes.
 * Desacoplado e reutilizável.
 */
export class FileReader {
  /**
   * Lê conteúdo de string, Buffer ou Stream e retorna como string.
   *
   * @param source - Fonte do arquivo (string path, Buffer ou Stream)
   * @returns Conteúdo do arquivo como string
   */
  static async read(source: string | Buffer | Readable): Promise<string> {
    if (typeof source === 'string') {
      return readFileSync(source, { encoding: 'utf-8' });
    }

    if (Buffer.isBuffer(source)) {
      return source.toString('utf-8');
    }

    return this.readStream(source);
  }

  /**
   * Lê conteúdo de um Stream.
   *
   * @param stream - Stream do arquivo
   * @returns Conteúdo do arquivo como string
   */
  private static readStream(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      stream.on('error', reject);
    });
  }
}
