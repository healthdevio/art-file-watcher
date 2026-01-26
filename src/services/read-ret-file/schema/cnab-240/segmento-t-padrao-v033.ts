import { normalizeAccount, normalizeAgency, normalizeTrim } from '../../helpers/formatters';
import { SegmentoT } from '../../interfaces/CNAB-240';
import { LineSchema } from '../core/types';

/**
 * Schema para Segmento T CNAB 240 - Layout Padrão v033 (Manual novo)
 * Compatível com versões 030 e 040
 * Baseado no manual CNAB240_v033.md
 *
 * Diferenças em relação ao layout SITCS:
 * - Valor Nominal: 82-96 (base 1) = 81-96 (base 0) vs 83-97 (base 1) = 82-97 (base 0) no SITCS
 * - Tarifa: 199-213 (base 1) = 198-213 (base 0) vs 200-214 (base 1) = 199-214 (base 0) no SITCS
 */
export const SEGMENTO_T_SCHEMA_PADRAO_V033: LineSchema<SegmentoT> = {
  recordType: { start: 7, end: 8, extractor: 'string' },
  bankCode: { start: 0, end: 3, extractor: 'string' },
  lotCode: { start: 3, end: 7, extractor: 'string' },
  sequenceNumber: { start: 8, end: 13, extractor: 'string' },
  segmentType: { start: 13, end: 14, extractor: 'string' },
  movementCode: { start: 15, end: 17, extractor: 'string' },
  agency: { start: 17, end: 22, extractor: 'string', formatter: normalizeAgency },
  agencyDigit: { start: 22, end: 23, extractor: 'string' },
  agreement: { start: 23, end: 29, extractor: 'string' },
  account: { start: 30, end: 35, extractor: 'string', formatter: normalizeAccount },
  accountDigit: { start: 35, end: 36, extractor: 'string' },
  regionalNumber: { start: 38, end: 56, extractor: 'string', formatter: normalizeTrim },
  regionalNumberDigit: { start: 56, end: 57, extractor: 'string' },
  titleNumber: { start: 56, end: 73, extractor: 'string', formatter: normalizeTrim },
  docNumber: { start: 58, end: 69, extractor: 'string', formatter: normalizeTrim },
  overdueDate: { start: 73, end: 81, extractor: 'date' },
  titlePortfolio: { start: 73, end: 76, extractor: 'string' },
  titleType: { start: 76, end: 77, extractor: 'string' },
  interestCode: { start: 77, end: 78, extractor: 'string' },
  // Campo 17.3T: Valor Nominal do Título - posições 82-96 (base 1) = 81-95 (base 0), mas end exclusivo = 81-96 (base 0)
  receivedValue: { start: 81, end: 96, extractor: 'monetary' },
  titleCompanyNumber: { start: 105, end: 130, extractor: 'string', formatter: normalizeTrim },
  payerRegistrationType: { start: 132, end: 133, extractor: 'string' },
  payerRegistration: { start: 133, end: 148, extractor: 'string', formatter: normalizeTrim },
  payerName: { start: 148, end: 188, extractor: 'string', formatter: normalizeTrim },
  // Campo 27.3T: Valor da Tarifa / Custas - posições 199-213 (base 1) = 198-212 (base 0), mas end exclusivo = 198-213 (base 0)
  tariff: { start: 198, end: 213, extractor: 'monetary' },
  occurrenceReason: { start: 213, end: 223, extractor: 'string', formatter: normalizeTrim },
};
