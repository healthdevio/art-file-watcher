import { normalizeAccount, normalizeAgency, normalizeTrim } from '../../helpers/formatters';
import { SegmentoT } from '../../interfaces/CNAB-240';
import { LineSchema } from '../core/types';

/**
 * Schema para Segmento T CNAB 240 - Layout SITCS (Manual antigo)
 * Compatível com versões 030 e 040
 * Baseado no manual Layout CNAB_240_v_1_8.md (SITCS)
 *
 * Valor Nominal do Título: posições 83-97 (base 1) = 82-96 (base 0), mas end exclusivo = 82-97 (base 0)
 * Tarifa: posições 200-214 (base 1) = 199-213 (base 0), mas end exclusivo = 199-214 (base 0)
 *
 * Nota: Este é o schema padrão (SITCS). Para layout padrão v033, usar SEGMENTO_T_SCHEMA_PADRAO_V033
 */
export const SEGMENTO_T_SCHEMA: LineSchema<SegmentoT> = {
  recordType: { start: 7, end: 8, extractor: 'string' },
  bankCode: { start: 0, end: 3, extractor: 'string' },
  lotCode: { start: 3, end: 7, extractor: 'string' },
  sequenceNumber: { start: 8, end: 13, extractor: 'string' },
  segmentType: { start: 13, end: 14, extractor: 'string' },
  movementCode: { start: 15, end: 17, extractor: 'string' },
  agency: { start: 17, end: 22, extractor: 'string', formatter: normalizeAgency },
  agencyDigit: { start: 22, end: 23, extractor: 'string' },
  account: { start: 30, end: 35, extractor: 'string', formatter: normalizeAccount },
  accountDigit: { start: 35, end: 36, extractor: 'string' },
  agreement: { start: 23, end: 29, extractor: 'string' },
  regionalNumber: { start: 37, end: 56, extractor: 'string' },
  regionalNumberDigit: { start: 56, end: 57, extractor: 'string' },
  titleNumber: { start: 57, end: 73, extractor: 'string' },
  titlePortfolio: { start: 73, end: 76, extractor: 'string' },
  titleType: { start: 76, end: 77, extractor: 'string' },
  interestCode: { start: 77, end: 78, extractor: 'string' },
  payerRegistrationType: { start: 133, end: 134, extractor: 'string' },
  payerRegistration: { start: 134, end: 148, extractor: 'string' },
  payerName: { start: 148, end: 188, extractor: 'string' },
  // Campo 17.3T: Valor Nominal do Título - posições 83-97 (base 1) = 82-96 (base 0), mas end exclusivo = 82-97 (base 0)
  receivedValue: { start: 82, end: 97, extractor: 'monetary' },
  // Campo 27.3T: Valor da Tarifa / Custas - posições 200-214 (base 1) = 199-213 (base 0), mas end exclusivo = 199-214 (base 0)
  tariff: { start: 199, end: 214, extractor: 'monetary' },

  // não testados
  occurrenceReason: { start: 213, end: 223, extractor: 'string', formatter: normalizeTrim },
  titleCompanyNumber: { start: 105, end: 130, extractor: 'string', formatter: normalizeTrim },
  docNumber: { start: 58, end: 69, extractor: 'string', formatter: normalizeTrim },
  overdueDate: { start: 73, end: 81, extractor: 'date' },
};
