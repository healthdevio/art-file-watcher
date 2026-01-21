import { TrailerLoteCNAB240 } from '../../interfaces/CNAB-240';
import { LineSchema } from '../core/types';

/**
 * Schema para Trailer do Lote CNAB 240
 * Compatível com versões 030 e 040
 */
export const TRAILER_LOTE_SCHEMA: LineSchema<TrailerLoteCNAB240> = {
  recordType: { start: 7, end: 8, extractor: 'string' },
  bankCode: { start: 0, end: 3, extractor: 'string' },
  lotCode: { start: 3, end: 7, extractor: 'string' },
  sequenceNumber: { start: 8, end: 13, extractor: 'string' },
  totalLines: { start: 17, end: 23, extractor: 'number' },
  totalTitles: { start: 23, end: 29, extractor: 'number' },
  totalValue: { start: 29, end: 47, extractor: 'monetary' },
};
