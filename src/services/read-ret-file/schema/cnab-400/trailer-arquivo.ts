import { TrailerArquivoCNAB400 } from '../../interfaces/CNAB-400';
import { LineSchema } from '../core/types';

/**
 * Schema para Trailer do Arquivo CNAB 400
 */
export const TRAILER_ARQUIVO_SCHEMA_400: LineSchema<TrailerArquivoCNAB400> = {
  recordType: { start: 0, end: 1, extractor: 'string' },
  totalRecords: { start: 394, end: 400, extractor: 'number' },
};
