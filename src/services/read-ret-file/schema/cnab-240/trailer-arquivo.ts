import { TrailerArquivoCNAB240 } from '../../interfaces/CNAB-240';
import { LineSchema } from '../core/types';

/**
 * Schema para Trailer do Arquivo CNAB 240
 * Compatível com versões 030 e 040
 */
export const TRAILER_ARQUIVO_SCHEMA: LineSchema<TrailerArquivoCNAB240> = {
  recordType: { start: 7, end: 8, extractor: 'string' },
  bankCode: { start: 0, end: 3, extractor: 'string' },
  totalLots: { start: 17, end: 23, extractor: 'number' },
  totalLines: { start: 23, end: 29, extractor: 'number' },
};
