import { normalizeAccount, normalizeAgency } from '../../helpers/formatters';
import { DetalheCNAB400 } from '../../interfaces/CNAB-400';
import { LineSchema } from '../core/types';

/**
 * Schema para Detalhe CNAB 400
 * Registro de detalhe único (não tem segmentos T/U como CNAB 240)
 */
export const DETALHE_SCHEMA_400: LineSchema<DetalheCNAB400> = {
  recordType: { start: 0, end: 1, extractor: 'string' },
  agency: { start: 17, end: 21, extractor: 'string', formatter: normalizeAgency },
  agencyDigit: { start: 21, end: 22, extractor: 'string' },
  account: { start: 22, end: 30, extractor: 'string', formatter: normalizeAccount },
  accountDigit: { start: 30, end: 31, extractor: 'string' },
  agreement: { start: 31, end: 38, extractor: 'string' },
  regionalNumber: { start: 63, end: 80, extractor: 'string' },
  regionalNumberDigit: { start: 80, end: 81, extractor: 'string' },
  paymentDate: { start: 110, end: 116, extractor: 'date_short' },
  creditDate: { start: 175, end: 181, extractor: 'date_short' },
  tariff: { start: 181, end: 188, extractor: 'monetary' },
  receivedValue: { start: 253, end: 266, extractor: 'monetary' },
  sequenceNumber: { start: 394, end: 400, extractor: 'string' },
};
