import { normalizeAccount, normalizeAgency } from '../helpers';
import { DetalheCNAB400, TrailerArquivoCNAB400 } from '../interfaces/CNAB-400';
import {
  CommonAccountFields,
  CommonAgreementFields,
  CommonMonetaryFields,
  CommonPaymentDateFields,
  CommonRecordFields,
  CommonRegionalNumberFields,
} from '../interfaces/common';
import { combineSchemas } from './core';
import { LineSchema, PartialSchema } from './core/types';

/** Schemas comuns para campos de conta bancária - CNAB 400 */
export const COMMON_ACCOUNT_FIELDS_SCHEMA_400: PartialSchema<CommonAccountFields> = {
  agency: { start: 17, end: 21, extractor: 'string', formatter: normalizeAgency },
  agencyDigit: { start: 21, end: 22, extractor: 'string' },
  account: { start: 22, end: 30, extractor: 'string', formatter: normalizeAccount },
  accountDigit: { start: 30, end: 31, extractor: 'string' },
};

/** Schemas comuns para campos de convênio - CNAB 400 */
export const COMMON_AGREEMENT_FIELDS_SCHEMA_400: PartialSchema<CommonAgreementFields> = {
  agreement: { start: 31, end: 38, extractor: 'string' },
};

/** Schemas comuns para campos de nosso número - CNAB 400 */
export const COMMON_REGIONAL_NUMBER_FIELDS_SCHEMA_400: PartialSchema<CommonRegionalNumberFields> = {
  regionalNumber: { start: 63, end: 80, extractor: 'string' },
  regionalNumberDigit: { start: 80, end: 81, extractor: 'string' },
};

/** Schemas comuns para campos de datas de pagamento - CNAB 400 */
export const COMMON_PAYMENT_DATE_FIELDS_SCHEMA_400: PartialSchema<CommonPaymentDateFields> = {
  paymentDate: { start: 110, end: 116, extractor: 'date_short' },
  creditDate: { start: 175, end: 181, extractor: 'date_short' },
};

/** Schemas comuns para campos monetários - CNAB 400 */
export const COMMON_MONETARY_FIELDS_SCHEMA_400: PartialSchema<CommonMonetaryFields> = {
  tariff: { start: 181, end: 188, extractor: 'monetary' },
  receivedValue: { start: 253, end: 266, extractor: 'monetary' },
};

/** Schemas comuns para campos de registro - CNAB 400 */
export const COMMON_RECORD_FIELDS_SCHEMA_400: PartialSchema<CommonRecordFields> = {
  recordType: { start: 0, end: 1, extractor: 'string' },
};

/** Schema para Detalhe CNAB 400 */
export const DETALHE_SCHEMA_400: LineSchema<DetalheCNAB400> = combineSchemas<DetalheCNAB400>(
  COMMON_RECORD_FIELDS_SCHEMA_400,
  COMMON_ACCOUNT_FIELDS_SCHEMA_400,
  COMMON_AGREEMENT_FIELDS_SCHEMA_400,
  COMMON_REGIONAL_NUMBER_FIELDS_SCHEMA_400,
  COMMON_PAYMENT_DATE_FIELDS_SCHEMA_400,
  COMMON_MONETARY_FIELDS_SCHEMA_400,
  { sequenceNumber: { start: 394, end: 400, extractor: 'string' } },
);

/** Schema para Trailer do Arquivo CNAB 400 */
export const TRAILER_ARQUIVO_SCHEMA_400: LineSchema<TrailerArquivoCNAB400> = combineSchemas<TrailerArquivoCNAB400>(
  COMMON_RECORD_FIELDS_SCHEMA_400,
  { totalRecords: { start: 394, end: 400, extractor: 'number' } },
);
