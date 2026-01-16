import { existsSync, readFileSync, statSync } from 'fs';
import { Readable } from 'node:stream';
import { CNAB240, HeaderCNAB240, LineCNAB240 } from './interfaces/CNAB-240';
import { CNAB400, HeaderCNAB400, LineCNAB400 } from './interfaces/CNAB-400';
import { CNABResult, CNABType, ReadResult } from './types';

/**
 * Serviço desacoplado para leitura de arquivos de retorno bancários (CNAB).
 * Esta classe é totalmente independente e pode ser copiada para outros projetos.
 */
export class ReadRetFileService {
  constructor() {}

  /**
   * Lê um arquivo de retorno e retorna o resultado estruturado.
   * Por enquanto, apenas lê o arquivo e identifica o tipo (stub).
   *
   * @param filePath - Caminho do arquivo a ser lido
   * @returns Resultado da leitura com dados estruturados
   */
  async read(filePath: string): Promise<ReadResult> {
    try {
      // Valida se o arquivo existe
      if (!existsSync(filePath)) {
        return {
          success: false,
          filePath,
          cnabType: 'UNKNOWN',
          error: `Arquivo não encontrado: ${filePath}`,
        };
      }

      // Obtém informações do arquivo
      const stats = statSync(filePath);
      if (!stats.isFile()) {
        return {
          success: false,
          filePath,
          cnabType: 'UNKNOWN',
          error: `O caminho não é um arquivo: ${filePath}`,
        };
      }

      // Identifica o tipo de arquivo CNAB
      const cnabType = await this.identifyFile(filePath);

      // Lê o arquivo como string
      const fileContent = await this.readFileString(filePath);
      const lines = fileContent.split(/\r?\n/).filter(line => line.trim().length > 0);

      // Cria estrutura básica baseada no tipo detectado
      let data: CNABResult | undefined;

      if (cnabType === 'CNAB240') {
        data = this.createCNAB240Structure(lines);
      } else if (cnabType === 'CNAB400') {
        data = this.createCNAB400Structure(lines);
      }

      return {
        success: true,
        filePath,
        cnabType,
        data,
        metadata: {
          lineCount: lines.length,
          fileSize: stats.size,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao ler arquivo';
      return {
        success: false,
        filePath,
        cnabType: 'UNKNOWN',
        error: errorMessage,
      };
    }
  }

  /**
   * Identifica o tipo de arquivo CNAB (240 ou 400).
   * Por enquanto, retorna UNKNOWN (stub para implementação futura).
   *
   * @param _filePath - Caminho do arquivo
   * @returns Tipo CNAB detectado
   */
  async identifyFile(_filePath: string): Promise<CNABType> {
    // TODO: Implementar lógica de detecção baseada na documentação CNAB
    // Por enquanto, retorna UNKNOWN
    // A detecção pode ser feita analisando:
    // - Tamanho da primeira linha (header)
    // - Caracteres específicos nas posições conhecidas
    // - Estrutura do arquivo
    return 'UNKNOWN';
  }

  /**
   * Lê um arquivo de diferentes fontes (string path, Buffer ou Stream).
   * Por enquanto, apenas suporta string path.
   *
   * @param file - Arquivo a ser lido (string path, Buffer ou Stream)
   * @returns Dados do arquivo
   */
  async readFile(file: string | Buffer | Readable): Promise<string> {
    if (typeof file === 'string') {
      return await this.readFileString(file);
    } else if (Buffer.isBuffer(file)) {
      return await this.readFileBuffer(file);
    } else {
      return await this.readFileStream(file);
    }
  }

  /**
   * Lê um arquivo a partir de um caminho (string).
   *
   * @param filePath - Caminho do arquivo
   * @returns Conteúdo do arquivo como string
   */
  private async readFileString(filePath: string): Promise<string> {
    return readFileSync(filePath, { encoding: 'utf-8' });
  }

  /**
   * Lê um arquivo a partir de um Buffer.
   *
   * @param fileBuffer - Buffer com o conteúdo do arquivo
   * @returns Conteúdo do arquivo como string
   */
  private async readFileBuffer(fileBuffer: Buffer): Promise<string> {
    return fileBuffer.toString('utf-8');
  }

  /**
   * Lê um arquivo a partir de um Stream.
   *
   * @param fileStream - Stream do arquivo
   * @returns Conteúdo do arquivo como string
   */
  private async readFileStream(fileStream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      fileStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      fileStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer.toString('utf-8'));
      });

      fileStream.on('error', (error: Error) => {
        reject(error);
      });
    });
  }

  /**
   * Cria estrutura CNAB240 básica a partir das linhas do arquivo.
   *
   * @param lines - Linhas do arquivo
   * @returns Estrutura CNAB240
   */
  private createCNAB240Structure(lines: string[]): CNAB240 {
    const header: HeaderCNAB240 = {
      file: lines[0] || '',
    };

    const lineObjects: LineCNAB240[] = lines.slice(1).map(line => ({
      line,
    }));

    return {
      header,
      lines: lineObjects,
    };
  }

  /**
   * Cria estrutura CNAB400 básica a partir das linhas do arquivo.
   *
   * @param lines - Linhas do arquivo
   * @returns Estrutura CNAB400
   */
  private createCNAB400Structure(lines: string[]): CNAB400 {
    const header: HeaderCNAB400 = {
      file: lines[0] || '',
    };

    const lineObjects: LineCNAB400[] = lines.slice(1).map(line => ({
      line,
    }));

    return {
      header,
      lines: lineObjects,
    };
  }
}
