import { HeaderCNAB400 } from '../interfaces/CNAB-400';
import { formatDate } from './formatters';

/**
 * Parser para extrair campos do header de arquivo CNAB 400
 * Baseado na especificação FEBRABAN - Layout de Arquivo Retorno
 */
export class HeaderParser400 {
  /**
   * Extrai campos do header da primeira linha do arquivo CNAB 400
   * @param firstLine - Primeira linha do arquivo (header)
   * @returns HeaderCNAB400 com todos os campos extraídos
   */
  static parse(firstLine: string): HeaderCNAB400 {
    // Garante que a linha tenha tamanho mínimo
    const line = firstLine.padEnd(400, ' ');

    return {
      fileType: 'CNAB400',
      recordType: this.substring(line, 0, 2), // Tipo de registro (02)
      operationType: this.substring(line, 2, 3), // Tipo de operação
      serviceType: this.substring(line, 2, 9), // Tipo de serviço (RETORNO)
      serviceId: this.substring(line, 9, 11), // Identificação do tipo de serviço
      bankCode: this.substring(line, 76, 79), // Código do banco (posição 76-78)
      bankName: this.substring(line, 79, 94).trim(), // Nome do banco (posição 79-93)
      companyName: this.substring(line, 46, 76).trim(), // Nome da empresa (posição 46-75)
      companyCode: this.substring(line, 26, 46), // Código da empresa (posição 26-45)
      generationDate: formatDate(this.substring(line, 94, 100), 'DDMMAA'), // Data de geração (DDMMAA -> DD/MM/AA) (posição 94-99)
      reserved: this.substring(line, 100, 394), // Reservado
      fileSequence: this.substring(line, 394, 400), // Número sequencial do arquivo (posição 394-399)
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
