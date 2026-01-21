import { readFileSync } from 'fs';
import { Readable } from 'node:stream';

/**
 * Helper para leitura de arquivos de diferentes fontes.
 * Desacoplado e reutilizável.
 */
export class FileReader {
  /**
   * Remove BOM UTF-8 do início de uma string se presente.
   * BOM UTF-8: EF BB BF (0xEF 0xBB 0xBF)
   *
   * @param content - Conteúdo do arquivo
   * @returns Conteúdo sem BOM
   */
  private static removeBOM(content: string): string {
    if (content.charCodeAt(0) === 0xfeff) {
      return content.slice(1);
    }
    return content;
  }

  /**
   * Lê conteúdo de string, Buffer ou Stream e retorna como string.
   * Preserva todos os caracteres originais, incluindo espaços em branco.
   *
   * @param source - Fonte do arquivo (string path, Buffer ou Stream)
   * @returns Conteúdo do arquivo como string (sem BOM se presente)
   */
  static async read(source: string | Buffer | Readable): Promise<string> {
    let content: string;

    if (typeof source === 'string') {
      // Lê arquivo como buffer primeiro para detectar BOM corretamente
      const buffer = readFileSync(source);
      content = buffer.toString('utf-8');
    } else if (Buffer.isBuffer(source)) {
      content = source.toString('utf-8');
    } else {
      content = await this.readStream(source);
    }

    // Remove BOM UTF-8 se presente (pode aparecer como caractere especial ou bytes)
    return this.removeBOM(content);
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
