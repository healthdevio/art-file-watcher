import { normalizeAccount, normalizeAgency } from '../helpers/formatters';
import {
  HeaderLoteCNAB240,
  SegmentoT,
  SegmentoU,
  TrailerArquivoCNAB240,
  TrailerLoteCNAB240,
} from '../interfaces/CNAB-240';
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

/** Schemas comuns para campos de convênio - CNAB 240 */
export const COMMON_AGREEMENT_FIELDS_SCHEMA_240: PartialSchema<CommonAgreementFields> = {
  agreement: { start: 23, end: 29, extractor: 'string' },
};
/** Schemas comuns para campos de nosso número - CNAB 240 */
export const COMMON_REGIONAL_NUMBER_FIELDS_SCHEMA_240: PartialSchema<CommonRegionalNumberFields> = {
  regionalNumber: { start: 37, end: 56, extractor: 'string' },
  regionalNumberDigit: { start: 56, end: 57, extractor: 'string' },
};
/** Schemas comuns para campos de datas de pagamento - CNAB 240 */
export const COMMON_PAYMENT_DATE_FIELDS_SCHEMA_240: PartialSchema<CommonPaymentDateFields> = {
  paymentDate: { start: 137, end: 145, extractor: 'date' },
  creditDate: { start: 145, end: 153, extractor: 'date' },
};
/** Schemas comuns para campos monetários - CNAB 240 */
export const COMMON_MONETARY_FIELDS_SCHEMA_240: PartialSchema<CommonMonetaryFields> = {
  tariff: { start: 198, end: 213, extractor: 'monetary' },
  receivedValue: { start: 77, end: 92, extractor: 'monetary' },
};
/** Schemas comuns para campos de registro - CNAB 240 */
export const COMMON_RECORD_FIELDS_SCHEMA_240: PartialSchema<CommonRecordFields> = {
  recordType: { start: 7, end: 8, extractor: 'string' },
};

/** Schemas comuns para campos de conta bancária - CNAB 240 */
export const COMMON_ACCOUNT_FIELDS_SCHEMA_240: PartialSchema<CommonAccountFields> = {
  agency: { start: 17, end: 22, extractor: 'string', formatter: normalizeAgency },
  agencyDigit: { start: 22, end: 23, extractor: 'string' },
  account: { start: 30, end: 35, extractor: 'string', formatter: normalizeAccount },
  accountDigit: { start: 35, end: 36, extractor: 'string' },
};

/** Schema para Segmento T CNAB 240 - Versão 030 */
export const SEGMENTO_T_SCHEMA_030: LineSchema<SegmentoT> = combineSchemas<SegmentoT>(
  COMMON_RECORD_FIELDS_SCHEMA_240,
  {
    bankCode: { start: 0, end: 3, extractor: 'string' },
    lotCode: { start: 3, end: 7, extractor: 'string' },
    sequenceNumber: { start: 8, end: 13, extractor: 'string' },
    segmentType: { start: 13, end: 14, extractor: 'string' },
    movementCode: { start: 15, end: 17, extractor: 'string' },
  },
  COMMON_ACCOUNT_FIELDS_SCHEMA_240,
  COMMON_AGREEMENT_FIELDS_SCHEMA_240,
  { account: { start: 30, end: 35, extractor: 'string', formatter: normalizeAccount } },
  COMMON_REGIONAL_NUMBER_FIELDS_SCHEMA_240,
  {
    titleNumber: { start: 57, end: 73, extractor: 'string' },
    titlePortfolio: { start: 73, end: 76, extractor: 'string' },
    titleType: { start: 76, end: 77, extractor: 'string' },
    interestCode: { start: 77, end: 78, extractor: 'string' },
  },
  COMMON_MONETARY_FIELDS_SCHEMA_240,
);

/**
 * Schema para Segmento T CNAB 240 - Versão 040
 */
export const SEGMENTO_T_SCHEMA_040: LineSchema<SegmentoT> = combineSchemas<SegmentoT>(
  COMMON_RECORD_FIELDS_SCHEMA_240,
  {
    bankCode: { start: 0, end: 3, extractor: 'string' },
    lotCode: { start: 3, end: 7, extractor: 'string' },
    sequenceNumber: { start: 8, end: 13, extractor: 'string' },
    segmentType: { start: 13, end: 14, extractor: 'string' },
    movementCode: { start: 15, end: 17, extractor: 'string' },
  },
  COMMON_ACCOUNT_FIELDS_SCHEMA_240,
  COMMON_AGREEMENT_FIELDS_SCHEMA_240,
  { account: { start: 30, end: 35, extractor: 'string', formatter: normalizeAccount } },
  COMMON_REGIONAL_NUMBER_FIELDS_SCHEMA_240,
  {
    titleNumber: { start: 57, end: 73, extractor: 'string' },
    titlePortfolio: { start: 73, end: 76, extractor: 'string' },
    titleType: { start: 76, end: 77, extractor: 'string' },
    interestCode: { start: 77, end: 78, extractor: 'string' },
  },
  COMMON_MONETARY_FIELDS_SCHEMA_240,
);

/** Schema para Segmento U CNAB 240 */
export const SEGMENTO_U_SCHEMA: LineSchema<SegmentoU> = combineSchemas<SegmentoU>(COMMON_RECORD_FIELDS_SCHEMA_240, {
  bankCode: { start: 0, end: 3, extractor: 'string' },
  lotCode: { start: 3, end: 7, extractor: 'string' },
  sequenceNumber: { start: 8, end: 13, extractor: 'string' },
  segmentType: { start: 13, end: 14, extractor: 'string' },
  accruedInterest: { start: 17, end: 32, extractor: 'monetary' },
  discountAmount: { start: 32, end: 47, extractor: 'monetary' },
  dischargeAmount: { start: 47, end: 62, extractor: 'monetary' },
  receivedValue: { start: 77, end: 92, extractor: 'monetary' },
  paidAmount: { start: 92, end: 107, extractor: 'monetary' },
  otherExpenses: { start: 107, end: 122, extractor: 'monetary' },
  otherCredits: { start: 122, end: 137, extractor: 'monetary' },
  paymentDate: { start: 137, end: 145, extractor: 'date' },
  creditDate: { start: 145, end: 153, extractor: 'date' },
  occurrenceCode: { start: 153, end: 158, extractor: 'string' },
});

/** Schema para Header do Lote CNAB 240 */
export const HEADER_LOTE_SCHEMA: LineSchema<HeaderLoteCNAB240> = combineSchemas<HeaderLoteCNAB240>(
  COMMON_RECORD_FIELDS_SCHEMA_240,
  {
    bankCode: { start: 0, end: 3, extractor: 'string' },
    lotCode: { start: 3, end: 7, extractor: 'string' },
    operationType: { start: 8, end: 9, extractor: 'string' },
    serviceType: { start: 9, end: 11, extractor: 'string' },
    entryForm: { start: 11, end: 13, extractor: 'string' },
    layoutVersion: { start: 13, end: 16, extractor: 'string' },
    companyRegistrationType: { start: 17, end: 18, extractor: 'string' },
    companyRegistration: { start: 18, end: 32, extractor: 'string' },
    companyName: { start: 72, end: 102, extractor: 'string' },
    companyMessage: { start: 102, end: 142, extractor: 'string' },
    bankName: { start: 142, end: 172, extractor: 'string' },
    generationDate: { start: 143, end: 151, extractor: 'date' },
    generationTime: { start: 151, end: 157, extractor: 'string' },
  },
);

/** Schema para Trailer do Lote CNAB 240 */
export const TRAILER_LOTE_SCHEMA: LineSchema<TrailerLoteCNAB240> = combineSchemas<TrailerLoteCNAB240>(
  COMMON_RECORD_FIELDS_SCHEMA_240,
  {
    bankCode: { start: 0, end: 3, extractor: 'string' },
    lotCode: { start: 3, end: 7, extractor: 'string' },
    sequenceNumber: { start: 8, end: 13, extractor: 'string' },
    totalLines: { start: 17, end: 23, extractor: 'number' },
    totalTitles: { start: 23, end: 29, extractor: 'number' },
    totalValue: { start: 29, end: 47, extractor: 'monetary' },
  },
);

/** Schema para Trailer do Arquivo CNAB 240 */
export const TRAILER_ARQUIVO_SCHEMA_240: LineSchema<TrailerArquivoCNAB240> = combineSchemas<TrailerArquivoCNAB240>(
  COMMON_RECORD_FIELDS_SCHEMA_240,
  {
    bankCode: { start: 0, end: 3, extractor: 'string' },
    totalLots: { start: 17, end: 23, extractor: 'number' },
    totalLines: { start: 23, end: 29, extractor: 'number' },
  },
);
