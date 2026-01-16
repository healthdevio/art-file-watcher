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

/**
 * Constantes para parsing de linhas CNAB 240
 * Baseado na especificação FEBRABAN - Layout de Arquivo Retorno
 */

// Tipos de registro válidos no CNAB 240
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

// Tamanhos mínimos de linha por tipo de registro
export const CNAB240_MIN_LINE_LENGTHS = {
  HEADER_FILE: 240,
  HEADER_LOTE: 240,
  DETAIL: 240,
  TRAILER_LOTE: 240,
  TRAILER_FILE: 240,
} as const;

/**
 * Posições dos campos nas linhas CNAB 240
 * Diferenças entre versões 030 e 040 são mapeadas quando necessário
 */
export const CNAB240_LINE_POSITIONS = {
  // Posições comuns a todos os tipos de registro
  COMMON: {
    BANK_CODE_START: 0,
    BANK_CODE_END: 3,
    LOT_CODE_START: 3,
    LOT_CODE_END: 7,
    RECORD_TYPE_START: 7,
    RECORD_TYPE_END: 8,
    SERVICE_TYPE_START: 8,
    SERVICE_TYPE_END: 9,
  },

  // Header do Lote (tipo de registro 1)
  HEADER_LOTE: {
    OPERATION_TYPE_START: 8,
    OPERATION_TYPE_END: 9,
    SERVICE_TYPE_START: 9,
    SERVICE_TYPE_END: 11,
    ENTRY_FORM_START: 11,
    ENTRY_FORM_END: 13,
    LAYOUT_VERSION_START: 13,
    LAYOUT_VERSION_END: 16,
    COMPANY_REGISTRATION_TYPE_START: 17,
    COMPANY_REGISTRATION_TYPE_END: 18,
    COMPANY_REGISTRATION_START: 18,
    COMPANY_REGISTRATION_END: 32,
    COMPANY_NAME_START: 72,
    COMPANY_NAME_END: 102,
    COMPANY_MESSAGE_START: 102,
    COMPANY_MESSAGE_END: 142,
    BANK_NAME_START: 142,
    BANK_NAME_END: 172,
    DATE_GENERATION_START: 143,
    DATE_GENERATION_END: 151,
    TIME_GENERATION_START: 151,
    TIME_GENERATION_END: 157,
  },

  // Segmento T (tipo 3, segmento T)
  SEGMENTO_T: {
    SEGMENT_TYPE_START: 13,
    SEGMENT_TYPE_END: 14,
    MOVEMENT_CODE_START: 15,
    MOVEMENT_CODE_END: 17,
    AGENCY_START: 17,
    AGENCY_END: 22,
    AGENCY_DIGIT_START: 22,
    AGENCY_DIGIT_END: 23,
    AGREEMENT_START: 23,
    AGREEMENT_END: 29,
    ACCOUNT_START_030: 30, // Versão 030 - corrigido (era 23)
    ACCOUNT_END_030: 35,
    ACCOUNT_START_040: 30, // Versão 040
    ACCOUNT_END_040: 35,
    ACCOUNT_DIGIT_START: 35,
    ACCOUNT_DIGIT_END: 36,
    REGIONAL_NUMBER_START: 37,
    REGIONAL_NUMBER_END: 56,
    REGIONAL_NUMBER_DIGIT_START: 56,
    REGIONAL_NUMBER_DIGIT_END: 57,
    TITLE_NUMBER_START: 57,
    TITLE_NUMBER_END: 73,
    TITLE_PORTFOLIO_START: 73,
    TITLE_PORTFOLIO_END: 76,
    TITLE_TYPE_START: 76,
    TITLE_TYPE_END: 77,
    INTEREST_CODE_START: 77,
    INTEREST_CODE_END: 78,
    TARIFF_START: 198,
    TARIFF_END: 213,
  },

  // Segmento U (tipo 3, segmento U)
  SEGMENTO_U: {
    SEGMENT_TYPE_START: 13,
    SEGMENT_TYPE_END: 14,
    ACCRUED_INTEREST_START: 17,
    ACCRUED_INTEREST_END: 32,
    DISCOUNT_AMOUNT_START: 32,
    DISCOUNT_AMOUNT_END: 47,
    DISCHARGE_AMOUNT_START: 47,
    DISCHARGE_AMOUNT_END: 62,
    RECEIVED_VALUE_START: 77,
    RECEIVED_VALUE_END: 92,
    PAID_AMOUNT_START: 92,
    PAID_AMOUNT_END: 107,
    OTHER_EXPENSES_START: 107,
    OTHER_EXPENSES_END: 122,
    OTHER_CREDITS_START: 122,
    OTHER_CREDITS_END: 137,
    PAYMENT_DATE_START: 137,
    PAYMENT_DATE_END: 145,
    CREDIT_DATE_START: 145,
    CREDIT_DATE_END: 153,
    OCCURRENCE_CODE_START: 153,
    OCCURRENCE_CODE_END: 158,
  },

  // Trailer do Lote (tipo 5)
  TRAILER_LOTE: {
    LOT_CONTROL_NUMBER_START: 23,
    LOT_CONTROL_NUMBER_END: 29,
    TOTAL_LINES_START: 17,
    TOTAL_LINES_END: 23,
    TOTAL_TITLES_START: 23,
    TOTAL_TITLES_END: 29,
    TOTAL_VALUE_START: 29,
    TOTAL_VALUE_END: 47,
  },

  // Trailer do Arquivo (tipo 9)
  TRAILER_FILE: {
    TOTAL_LOTS_START: 17,
    TOTAL_LOTS_END: 23,
    TOTAL_LINES_START: 23,
    TOTAL_LINES_END: 29,
  },
} as const;

/**
 * Constantes para parsing de linhas CNAB 400
 * Baseado na especificação FEBRABAN - Layout de Arquivo Retorno
 */

// Tipos de registro válidos no CNAB 400
export const CNAB400_RECORD_TYPES = {
  HEADER_FILE: '02',
  DETAIL: '7',
  TRAILER_FILE: '9',
} as const;

// Tamanhos mínimos de linha por tipo de registro
export const CNAB400_MIN_LINE_LENGTHS = {
  HEADER_FILE: 400,
  DETAIL: 400,
  TRAILER_FILE: 400,
} as const;

/**
 * Posições dos campos nas linhas CNAB 400
 */
export const CNAB400_LINE_POSITIONS = {
  // Posições comuns
  COMMON: {
    RECORD_TYPE_START: 0,
    RECORD_TYPE_END: 1,
  },

  // Linha de detalhe (tipo 7)
  DETAIL: {
    AGENCY_START: 17,
    AGENCY_END: 21,
    AGENCY_DIGIT_START: 21,
    AGENCY_DIGIT_END: 22,
    ACCOUNT_START: 22,
    ACCOUNT_END: 30,
    ACCOUNT_DIGIT_START: 30,
    ACCOUNT_DIGIT_END: 31,
    AGREEMENT_START: 31,
    AGREEMENT_END: 38,
    REGIONAL_NUMBER_START: 63,
    REGIONAL_NUMBER_END: 80,
    REGIONAL_NUMBER_DIGIT_START: 80,
    REGIONAL_NUMBER_DIGIT_END: 81,
    PAYMENT_DATE_START: 110,
    PAYMENT_DATE_END: 116,
    CREDIT_DATE_START: 175,
    CREDIT_DATE_END: 181,
    TARIFF_START: 181,
    TARIFF_END: 188,
    RECEIVED_VALUE_START: 253,
    RECEIVED_VALUE_END: 266,
    SEQUENCE_NUMBER_START: 394,
    SEQUENCE_NUMBER_END: 400,
  },

  // Trailer do arquivo (tipo 9)
  TRAILER_FILE: {
    TOTAL_RECORDS_START: 394,
    TOTAL_RECORDS_END: 400,
  },
} as const;
