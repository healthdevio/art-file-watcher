import { Readable } from 'node:stream';
import { ContentProcessor } from './helpers/content-processor';
import { FileReader } from './helpers/file-reader';
import { StructureBuilder } from './helpers/structure-builder';
import { ReadResult } from './types';

/**
 * Serviço desacoplado para leitura de arquivos de retorno bancários (CNAB).
 * Esta classe é totalmente independente e pode ser copiada para outros projetos.
 */
export class ReadRetFileService {
  /**
   * Lê um arquivo de retorno e retorna o resultado estruturado.
   * Aceita string (caminho), Buffer ou Stream.
   *
   * @param source - Fonte do arquivo (string path, Buffer ou Stream)
   * @returns Resultado da leitura com dados estruturados
   */
  async read(source: string | Buffer | Readable): Promise<ReadResult> {
    try {
      const content = await FileReader.read(source);
      const { cnabType, lines } = ContentProcessor.process(content);
      const data = StructureBuilder.build(lines, cnabType);

      return {
        success: true,
        filePath: typeof source === 'string' ? source : '',
        cnabType,
        data,
        metadata: {
          lineCount: lines.length,
          fileSize: Buffer.byteLength(content, 'utf-8'),
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao ler arquivo';
      return {
        success: false,
        filePath: typeof source === 'string' ? source : '',
        cnabType: 'UNKNOWN',
        error: errorMessage,
      };
    }
  }
}
