/**
 * Fixtures de teste para identificação de arquivos CNAB
 * Contém exemplos de linhas de arquivos CNAB 240 e CNAB 400 para testes
 */

/**
 * Exemplo de primeira linha de arquivo CNAB 400
 * Características:
 * - Posição 0-2: "02"
 * - Posição 2-9: "RETORNO"
 */
export const CNAB400_FIRST_LINE =
  '02RETORNO01COBRANCA       33820000052841000000MUTUA DE ASSISTENCIA DOS PROFI001BANCO DO BRASIL1501260004170                      000005610303877689  2832092                                                                                                                                                                                                                                              000001';

/**
 * Exemplo de segunda linha de arquivo CNAB 400
 * Características:
 * - Posição 0-1: "7"
 */
export const CNAB400_SECOND_LINE =
  '700000000000000000071X0003029532835965                         2835965820857833670000001AI 02700000000000 17061501268208578336                    150126000000002100023736860011901260000355000000000000000000000000000000000000000000000000000000000000000000000000021000000000000000000000000000000000000000000000000002064520000000000000          0000000000000000000000000000000000000000000000001010000002';

/**
 * Exemplo de primeira linha de arquivo CNAB 240 (base)
 * Características:
 * - Posição 2-9: não contém "RETORNO"
 * - Posição 163-166: será ajustada nos testes para "030" ou "040"
 */
export const CNAB240_FIRST_LINE_BASE =
  '10400000         2766393840001590000000000000000000000373508105200000000CONSELHO REG ENGENHARIA E AGROC ECON FEDERAL                          71501202608052500000104000000                    RET ONLINE-PRODUCAO               ';

/**
 * Exemplo de segunda linha de arquivo CNAB 240
 * Características:
 * - Posição 8-9: "T"
 */
export const CNAB240_SECOND_LINE =
  '10400011T0100030 20766393840001590000000000000000000000373508105200000000CONSELHO REG ENGENHARIA E AGRO                                                                                00000001150120260000000000                          00   ';

/**
 * Helper para criar primeira linha CNAB 240 com código específico
 * @param fileCode - Código do arquivo ("030" ou "040")
 * @returns Primeira linha completa com código na posição correta
 */
export function createCNAB240FirstLine(fileCode: string): string {
  return CNAB240_FIRST_LINE_BASE.padEnd(166, ' ').substring(0, 163) + fileCode;
}

/**
 * Primeira linha CNAB 400 com record type diferente (para testes negativos)
 */
export const CNAB400_INVALID_FIRST_LINE =
  '01RETORNO01COBRANCA       33820000052841000000MUTUA DE ASSISTENCIA DOS PROFI001BANCO DO BRASIL1501260004170                      000005610303877689  2832092                                                                                                                                                                                                                                              000001';

/**
 * Segunda linha CNAB 400 com register ID diferente (para testes negativos)
 */
export const CNAB400_INVALID_SECOND_LINE =
  '800000000000000000071X0003029532835965                         2835965820857833670000001AI 02700000000000 17061501268208578336                    150126000000002100023736860011901260000355000000000000000000000000000000000000000000000000000000000000000000000000021000000000000000000000000000000000000000000000000002064520000000000000          0000000000000000000000000000000000000000000000001010000002';

/**
 * Segunda linha CNAB 240 sem "T" na posição 8-9 (para testes negativos)
 */
export const CNAB240_INVALID_SECOND_LINE =
  '10400011X0100030 20766393840001590000000000000000000000373508105200000000CONSELHO REG ENGENHARIA E AGRO                                                                                00000001150120260000000000                          00   ';
