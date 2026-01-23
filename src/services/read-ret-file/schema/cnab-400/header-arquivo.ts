import { HeaderCNAB400 } from '../../interfaces/CNAB-400';
import { LineSchema } from '../core/types';

/**
 * Schema para Header do Arquivo CNAB 400
 * Baseado na especificação FEBRABAN - Layout de Arquivo Retorno
 */
export const HEADER_ARQUIVO_SCHEMA_400: LineSchema<HeaderCNAB400> = {
  recordType: { start: 0, end: 2, extractor: 'string' }, // Tipo de registro (02)
  operationType: { start: 2, end: 3, extractor: 'string' },
  serviceType: { start: 2, end: 9, extractor: 'string' },
  serviceId: { start: 9, end: 11, extractor: 'string' },
  companyCode: { start: 26, end: 46, extractor: 'string' },
  companyName: { start: 46, end: 76, extractor: 'string' },
  bankCode: { start: 76, end: 79, extractor: 'string' },
  bankName: { start: 79, end: 94, extractor: 'string' },
  generationDate: { start: 94, end: 100, extractor: 'date_short' },
  sequencial: { start: 100, end: 107, extractor: 'string' },
  fileSequence: { start: 394, end: 400, extractor: 'string' },
  fileType: { start: 0, end: 0, extractor: 'string' }, // Campo fixo 'CNAB400', será preenchido pelo parser
};
