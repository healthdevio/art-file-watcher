export enum RetFileTypeEnum {
  CNAB_400 = 'CNAB_400',
  CNAB_240_30 = 'CNAB_240_30',
  CNAB_240_40 = 'CNAB_240_40',
}

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
