/**
 * Constantes para identificação de arquivos CNAB
 * Baseado nas especificações dos layouts CNAB 240 e CNAB 400
 */

// Posições na primeira linha
export const IDENTIFICATION_POSITIONS = {
  FIRST_LINE: {
    RECORD_TYPE_START: 0,
    RECORD_TYPE_END: 2,
    FILE_TYPE_START: 2,
    FILE_TYPE_END: 9,
    FILE_CODE_START: 163,
    FILE_CODE_END: 166,
  },
  SECOND_LINE: {
    REGISTER_ID_START: 0,
    REGISTER_ID_END: 1,
    REGISTER_TYPE_START: 8,
    REGISTER_TYPE_END: 9,
  },
} as const;

// Valores esperados para identificação
export const IDENTIFICATION_VALUES = {
  CNAB_400: {
    RECORD_TYPE: '02',
    FILE_TYPE: 'RETORNO',
    REGISTER_ID: '7',
  },
  CNAB_240: {
    FILE_TYPE_NOT: 'RETORNO', // Linha 1 não deve conter "RETORNO"
    REGISTER_TYPE: 'T',
    FILE_CODE_030: '030',
    FILE_CODE_040: '040',
  },
} as const;

// Tamanhos mínimos necessários para identificação
export const MIN_LINE_LENGTHS = {
  FIRST_LINE: 166, // Precisa chegar até a posição 166 para ler o código do arquivo
  SECOND_LINE: 9, // Precisa chegar até a posição 9 para ler o tipo de registro
} as const;

/**  Tipos de registro válidos no `CNAB 240` */
export const CNAB240_RECORD_TYPES = {
  HEADER_FILE: '0',
  HEADER_LOTE: '1',
  DETAIL: '3',
  TRAILER_LOTE: '5',
  TRAILER_FILE: '9',
} as const;

// Tipos de segmento válidos no CNAB 240
export const CNAB240_SEGMENT_TYPES = {
  T: 'T', // Segmento T - Dados do título
  U: 'U', // Segmento U - Dados do pagamento
  J: 'J', // Segmento J - Informações de pagamento
  W: 'W', // Segmento W - Informações de pagamento (opcional)
  Y: 'Y', // Segmento Y - Dados adicionais (opcional)
} as const;

// Tamanho mínimo de linha CNAB 240 (todas as linhas têm 240 caracteres)
export const CNAB240_MIN_LINE_LENGTH = 240;

// Tipos de registro válidos no CNAB 400
export const CNAB400_RECORD_TYPES = {
  HEADER_FILE: '02',
  DETAIL: '7',
  TRAILER_FILE: '9',
} as const;

// Tamanho mínimo de linha CNAB 400 (todas as linhas têm 400 caracteres)
export const CNAB400_MIN_LINE_LENGTH = 400;
