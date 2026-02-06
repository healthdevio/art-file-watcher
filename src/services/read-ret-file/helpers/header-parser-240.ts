import { HeaderCNAB240 } from '../interfaces/CNAB-240';
import { formatDate } from './formatters';

/**
 * Parser para extrair campos do header de arquivo CNAB 240
 * Baseado na especificação FEBRABAN - Layout de Arquivo Retorno
 */
export class HeaderParser240 {
  /**
   * Extrai campos do header da primeira linha do arquivo CNAB 240
   *
   * @param firstLine - Primeira linha do arquivo (header)
   * @returns HeaderCNAB240 com todos os campos extraídos
   */
  static parse(firstLine: string): HeaderCNAB240 {
    // Garante que a linha tenha tamanho mínimo
    const line = firstLine.padEnd(240, ' ');

    return {
      fileType: 'CNAB240',
      bankCode: this.substring(line, 0, 3), // Código do banco
      lotCode: this.substring(line, 3, 7), // Lote de serviço
      recordType: this.substring(line, 7, 8), // Tipo de registro
      operationType: this.substring(line, 8, 9), // Tipo de operação
      serviceType: this.substring(line, 9, 11), // Tipo de serviço
      entryForm: this.substring(line, 11, 13), // Forma de lançamento
      layoutVersion: this.substring(line, 13, 16), // Versão do layout
      companyRegistrationType: this.substring(line, 17, 18), // Tipo de inscrição
      companyRegistration: this.substring(line, 18, 32), // Inscrição da empresa
      companyName: this.substring(line, 72, 102).trim(), // Nome da empresa
      bankName: this.substring(line, 102, 132).trim(), // Nome do banco
      generationDate: formatDate(this.substring(line, 143, 151), 'DDMMAAAA'), // Data de geração (DDMMAAAA -> DD/MM/AAAA)
      generationTime: this.substring(line, 151, 157), // Hora de geração (HHMMSS)
      fileSequence: this.substring(line, 157, 163), // Número sequencial do arquivo
      recordDensity: this.substring(line, 164, 167), // Densidade de gravação
      fileCode: this.substring(line, 163, 166), // Código do arquivo (030 ou 040)
    };
  }

  /**
   * Extrai substring de uma linha, tratando índices fora do range
   *
   * @param line - Linha do arquivo
   * @param start - Posição inicial (inclusive)
   * @param end - Posição final (exclusive)
   * @returns Substring extraída
   */
  private static substring(line: string, start: number, end: number): string {
    if (start >= line.length) return '';
    if (end > line.length) return line.substring(start);
    return line.substring(start, end);
  }
}
