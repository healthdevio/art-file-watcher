/**
 * Extractors built-in para parsing de campos
 * Totalmente desacoplados - zero dependências externas
 */
export class FieldExtractors {
  /**
   * Extrai substring de uma linha de forma segura
   * Retorna string vazia se índices fora do range
   *
   * @param line - Linha do arquivo
   * @param start - Posição inicial (inclusive)
   * @param end - Posição final (exclusive)
   * @returns Substring extraída ou string vazia
   */
  static extractString(line: string, start: number, end: number): string {
    if (start < 0 || end < 0 || start > end) return '';
    if (start >= line.length) return '';
    if (end > line.length) return line.substring(start);
    return line.substring(start, end).trim();
  }

  /**
   * Extrai e converte para número inteiro
   *
   * @param line - Linha do arquivo
   * @param start - Posição inicial (inclusive)
   * @param end - Posição final (exclusive)
   * @returns Número extraído ou 0 se inválido
   */
  static extractNumber(line: string, start: number, end: number): number {
    const value = this.extractString(line, start, end);
    if (value.length === 0) return 0;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Extrai valor monetário (formato CNAB: inteiro onde últimos 2 dígitos = centavos)
   *
   * @param line - Linha do arquivo
   * @param start - Posição inicial (inclusive)
   * @param end - Posição final (exclusive)
   * @returns Valor monetário como número (em reais)
   */
  static extractMonetary(line: string, start: number, end: number): number {
    const value = this.extractString(line, start, end);
    if (value.length === 0) return 0;
    const integerValue = parseInt(value, 10);
    if (isNaN(integerValue)) return 0;
    return integerValue / 100;
  }

  /**
   * Formata data DDMMAAAA -> DD/MM/AAAA
   *
   * @param line - Linha do arquivo
   * @param start - Posição inicial (inclusive)
   * @param end - Posição final (exclusive)
   * @returns Data formatada como string no formato DD/MM/AAAA
   */
  static extractDate(line: string, start: number, end: number): string {
    const value = this.extractString(line, start, end);
    if (value.length !== 8) return value;
    const day = value.substring(0, 2);
    const month = value.substring(2, 4);
    const year = value.substring(4, 8);
    return `${day}/${month}/${year}`;
  }

  /**
   * Formata data DDMMAA -> DD/MM/AA
   * @param line - Linha do arquivo
   * @param start - Posição inicial (inclusive)
   * @param end - Posição final (exclusive)
   * @returns Data formatada como string no formato DD/MM/AA
   */
  static extractDateShort(line: string, start: number, end: number): string {
    const value = this.extractString(line, start, end);
    if (value.length !== 6) return value;
    const day = value.substring(0, 2);
    const month = value.substring(2, 4);
    const year = value.substring(4, 6);
    return `${day}/${month}/${year}`;
  }
}
