/**
 * Helpers de formatação para valores CNAB.
 * Funções reutilizáveis para converter e formatar dados extraídos de arquivos CNAB.
 */

/**
 * Converte valor monetário do formato CNAB para número.
 * Formato CNAB: valores inteiros onde os últimos 2 dígitos são centavos.
 * Exemplo: "0000000001234" -> 12.34
 *
 * @param value - Valor em formato string do CNAB
 * @returns Valor monetário como número (em reais)
 */
export function formatMonetaryValue(value: string): number {
  if (!value || value.trim().length === 0) return 0;

  const numericValue = value.trim();
  if (numericValue.length < 2) return 0;
  // Converte para número e divide por 100 para obter o valor em reais
  const integerValue = parseInt(numericValue, 10);
  if (isNaN(integerValue)) return 0;
  return integerValue / 100;
}

/**
 * Formata data do formato CNAB para formato brasileiro.
 * Suporta formatos DDMMAAAA (8 dígitos) e DDMMAA (6 dígitos).
 *
 * @param value - Data em formato CNAB (DDMMAAAA ou DDMMAA)
 * @param format - Formato esperado da data ('DDMMAAAA' ou 'DDMMAA')
 * @returns Data formatada como string no formato DD/MM/AAAA ou DD/MM/AA
 */
export function formatDate(value: string, format: 'DDMMAAAA' | 'DDMMAA' = 'DDMMAAAA'): string {
  if (!value || value.trim().length === 0) return '';

  const dateValue = value.trim();

  if (format === 'DDMMAAAA') {
    // Formato completo: DDMMAAAA (8 dígitos)
    if (dateValue.length !== 8) return dateValue;
    const day = dateValue.substring(0, 2);
    const month = dateValue.substring(2, 4);
    const year = dateValue.substring(4, 8);
    return `${day}/${month}/${year}`;
  } else {
    // Formato curto: DDMMAA (6 dígitos)
    if (dateValue.length !== 6) return dateValue;
    const day = dateValue.substring(0, 2);
    const month = dateValue.substring(2, 4);
    const year = dateValue.substring(4, 6);
    return `${day}/${month}/${year}`;
  }
}

/**
 * Normaliza número de agência.
 * Remove zeros à esquerda e retorna string normalizada ou null se vazio.
 *
 * @param agency - Número da agência como string
 * @returns Agência normalizada ou null se vazio ou apenas zeros
 */
export function normalizeAgency(agency: string): string | null {
  if (!agency || agency.trim().length === 0) return null;

  const trimmed = agency.trim();

  // Se contém apenas zeros, retorna null
  if (/^0+$/.test(trimmed)) return null;

  // Remove zeros à esquerda convertendo para número e depois para string
  const numericValue = parseInt(trimmed, 10);
  if (isNaN(numericValue)) return trimmed;

  return numericValue.toString();
}

/**
 * Normaliza número de conta.
 * Remove zeros à esquerda e retorna string normalizada ou null se vazio.
 * @param account - Número da conta como string
 * @returns Conta normalizada ou null se vazio ou apenas zeros
 */
export function normalizeAccount(account: string): string | null {
  if (!account || account.trim().length === 0) return null;

  const trimmed = account.trim();

  // Se contém apenas zeros, retorna null
  if (/^0+$/.test(trimmed)) return null;

  // Remove zeros à esquerda convertendo para número e depois para string
  const numericValue = parseInt(trimmed, 10);
  if (isNaN(numericValue)) return trimmed;

  return numericValue.toString();
}
