/**
 * Utilitários para extração segura de substrings de linhas CNAB.
 * Trata índices fora do range e fornece funções especializadas.
 */

/**
 * Extrai substring de uma linha, tratando índices fora do range.
 *
 * @param line - Linha do arquivo
 * @param start - Posição inicial (inclusive)
 * @param end - Posição final (exclusive)
 * @returns Substring extraída ou string vazia se fora do range
 */
export function extractString(line: string, start: number, end: number): string {
  if (start < 0 || end < 0 || start > end) return '';
  if (start >= line.length) return '';
  if (end > line.length) return line.substring(start);
  return line.substring(start, end);
}

/**
 * Extrai substring e converte para número inteiro.
 *
 * @param line - Linha do arquivo
 * @param start - Posição inicial (inclusive)
 * @param end - Posição final (exclusive)
 * @returns Número extraído ou 0 se inválido
 */
export function extractNumber(line: string, start: number, end: number): number {
  const value = extractString(line, start, end).trim();
  if (value.length === 0) return 0;

  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Extrai valor monetário formatado.
 * Assume que o valor está no formato CNAB (inteiros com centavos como parte dos últimos dígitos).
 * @param line - Linha do arquivo
 * @param start - Posição inicial (inclusive)
 * @param end - Posição final (exclusive)
 * @returns Valor monetário como número (em reais)
 */
export function extractMonetaryValue(line: string, start: number, end: number): number {
  const value = extractString(line, start, end).trim();
  if (value.length === 0) return 0;

  // Valores monetários CNAB são sempre inteiros onde os últimos 2 dígitos são centavos
  const integerValue = parseInt(value, 10);
  if (isNaN(integerValue)) return 0;

  return integerValue / 100;
}
