import { SegmentoY } from '../../interfaces/CNAB-240';
import { LineSchema } from '../core/types';

/**
 * Schema para Segmento Y CNAB 240
 * Compatível com versões 030 e 040
 * Dados adicionais / Alegações do Sacado
 */
export const SEGMENTO_Y_SCHEMA: LineSchema<SegmentoY> = {
  recordType: { start: 7, end: 8, extractor: 'string' },
  bankCode: { start: 0, end: 3, extractor: 'string' },
  lotCode: { start: 3, end: 7, extractor: 'string' },
  sequenceNumber: { start: 8, end: 13, extractor: 'string' },
  segmentType: { start: 13, end: 14, extractor: 'string' },
  movementCode: { start: 15, end: 17, extractor: 'string' },
  optionalRecordId: { start: 17, end: 19, extractor: 'string' },
  payerRegistrationType: { start: 19, end: 20, extractor: 'string' },
  payerRegistration: { start: 20, end: 35, extractor: 'string' },
  payerName: { start: 35, end: 75, extractor: 'string' },
  payerAddress: { start: 75, end: 115, extractor: 'string' },
  payerDistrict: { start: 115, end: 130, extractor: 'string' },
  payerZipCode: { start: 130, end: 135, extractor: 'string' },
  payerZipCodeSuffix: { start: 135, end: 138, extractor: 'string' },
  payerCity: { start: 138, end: 153, extractor: 'string' },
  payerState: { start: 153, end: 155, extractor: 'string' },
};
