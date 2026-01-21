import { format } from 'date-fns';
import { tryDate } from './date-utils';

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
    return line.substring(start, end);
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
   * Valida se a data é válida usando tryDate antes de formatar
   * IMPORTANTE: Não usa trim() na extração para preservar zeros à esquerda
   *
   * @param line - Linha do arquivo
   * @param start - Posição inicial (inclusive)
   * @param end - Posição final (exclusive)
   * @returns Data formatada como string no formato DD/MM/AAAA ou string vazia se inválida
   */
  static extractDate(line: string, start: number, end: number): string {
    // Extrair sem trim para preservar zeros à esquerda
    if (start < 0 || end < 0 || start > end) return '';
    if (start >= line.length) return '';
    if (end > line.length) return '';

    const value = line.substring(start, end);
    if (value.length !== 8) return '';

    // Verificar se é apenas zeros ou espaços (data inválida)
    // if (/^0+$/.test(value) || /^\s+$/.test(value)) return '';

    // Tentar parsear usando tryDate com formato ddMMyyyy
    const date = tryDate(value, 'ddMMyyyy');
    if (!date) return '';

    return format(date, 'dd/MM/yyyy');
  }

  /**
   * Formata data DDMMAA -> DD/MM/AAAA (expande ano automaticamente)
   * Expande ano: anos <= 50 são 20XX, anos > 50 são 19XX
   * Valida se a data é válida usando tryDate antes de formatar
   * IMPORTANTE: Não usa trim() na extração para preservar zeros à esquerda
   *
   * @param line - Linha do arquivo
   * @param start - Posição inicial (inclusive)
   * @param end - Posição final (exclusive)
   * @returns Data formatada como string no formato DD/MM/AAAA ou string vazia se inválida
   */
  static extractDateShort(line: string, start: number, end: number): string {
    // Extrair sem trim para preservar zeros à esquerda
    if (start < 0 || end < 0 || start > end) return '';
    if (start >= line.length) return '';
    if (end > line.length) return '';

    const value = line.substring(start, end);
    if (value.length !== 6) return '';

    // Verificar se é apenas zeros ou espaços (data inválida)
    if (/^0+$/.test(value) || /^\s+$/.test(value)) return '';

    const day = value.substring(0, 2);
    const month = value.substring(2, 4);
    const yearShort = value.substring(4, 6);

    // Tentar parsear usando tryDate com formato ddMMyy (expande ano automaticamente)
    const date = tryDate(value, 'ddMMyy');
    if (!date) return '';

    // Expande ano: anos <= 50 são 20XX, anos > 50 são 19XX
    const yearShortNum = parseInt(yearShort, 10);
    const fullYear = yearShortNum <= 50 ? `20${yearShort.padStart(2, '0')}` : `19${yearShort.padStart(2, '0')}`;

    return `${day}/${month}/${fullYear}`;
  }
}
