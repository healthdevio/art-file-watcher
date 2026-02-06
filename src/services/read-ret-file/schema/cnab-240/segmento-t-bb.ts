import { normalizeAccount, normalizeAgency, normalizeTrim } from '../../helpers/formatters';
import { SegmentoT } from '../../interfaces/CNAB-240';
import { LineSchema } from '../core/types';

/**
 * Schema para Segmento T CNAB 240 - Layout Banco do Brasil (BB)
 * Banco código 001
 *
 * No BB, o convênio NÃO está nas posições 23-29 (que vêm zeradas).
 * O convênio é os primeiros 7 dígitos do Nosso Número (posições 37-44).
 * O Nosso Número completo (17 dígitos) está nas posições 37-54.
 *
 * Demais campos seguem o layout padrão v033.
 */
export const SEGMENTO_T_SCHEMA_BB: LineSchema<SegmentoT> = {
  recordType: { start: 7, end: 8, extractor: 'string' },
  bankCode: { start: 0, end: 3, extractor: 'string' },
  lotCode: { start: 3, end: 7, extractor: 'string' },
  sequenceNumber: { start: 8, end: 13, extractor: 'string' },
  segmentType: { start: 13, end: 14, extractor: 'string' },
  movementCode: { start: 15, end: 17, extractor: 'string' },
  agency: { start: 17, end: 22, extractor: 'string', formatter: normalizeAgency },
  agencyDigit: { start: 22, end: 23, extractor: 'string' },
  // BB: convênio = primeiros 7 dígitos do Nosso Número (posições 37-44)
  agreement: { start: 37, end: 44, extractor: 'string' },
  account: { start: 30, end: 35, extractor: 'string', formatter: normalizeAccount },
  accountDigit: { start: 35, end: 36, extractor: 'string' },
  // BB: Nosso Número completo (17 dígitos) nas posições 37-54
  regionalNumber: { start: 37, end: 54, extractor: 'string', formatter: normalizeTrim },
  regionalNumberDigit: { start: 54, end: 55, extractor: 'string' },
  titleNumber: { start: 56, end: 73, extractor: 'string', formatter: normalizeTrim },
  docNumber: { start: 58, end: 69, extractor: 'string', formatter: normalizeTrim },
  overdueDate: { start: 73, end: 81, extractor: 'date' },
  titlePortfolio: { start: 73, end: 76, extractor: 'string' },
  titleType: { start: 76, end: 77, extractor: 'string' },
  interestCode: { start: 77, end: 78, extractor: 'string' },
  receivedValue: { start: 81, end: 96, extractor: 'monetary' },
  titleCompanyNumber: { start: 105, end: 130, extractor: 'string', formatter: normalizeTrim },
  payerRegistrationType: { start: 132, end: 133, extractor: 'string' },
  payerRegistration: { start: 133, end: 148, extractor: 'string', formatter: normalizeTrim },
  payerName: { start: 148, end: 188, extractor: 'string', formatter: normalizeTrim },
  tariff: { start: 198, end: 213, extractor: 'monetary' },
  occurrenceReason: { start: 213, end: 223, extractor: 'string', formatter: normalizeTrim },
};
