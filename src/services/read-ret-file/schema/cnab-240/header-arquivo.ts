import { normalizeRegistration } from '../../helpers/formatters';
import { HeaderCNAB240 } from '../../interfaces/CNAB-240';
import { LineSchema } from '../core/types';

/**
 * Schema para Header do Arquivo CNAB 240
 * Compatível com versões 030 e 040 - Posições baseadas na documentação FEBRABAN
 */
export const HEADER_ARQUIVO_SCHEMA: LineSchema<HeaderCNAB240> = {
  recordType: { start: 7, end: 8, extractor: 'string' },
  bankCode: { start: 0, end: 3, extractor: 'string' },
  lotCode: { start: 3, end: 7, extractor: 'string' },
  operationType: { start: 8, end: 9, extractor: 'string' },
  serviceType: { start: 9, end: 11, extractor: 'string' },
  entryForm: { start: 11, end: 13, extractor: 'string' },
  layoutVersion: { start: 13, end: 16, extractor: 'string' },
  companyRegistrationType: { start: 17, end: 18, extractor: 'string' },
  companyRegistration: { start: 18, end: 32, extractor: 'string', formatter: normalizeRegistration },
  companyName: { start: 72, end: 102, extractor: 'string' },
  bankName: { start: 102, end: 132, extractor: 'string' },
  generationDate: { start: 143, end: 151, extractor: 'date' },
  generationTime: { start: 151, end: 157, extractor: 'string' },
  fileSequence: { start: 157, end: 163, extractor: 'string' },
  recordDensity: { start: 166, end: 171, extractor: 'string' },
  fileCode: { start: 163, end: 166, extractor: 'string' },
  fileType: { start: 0, end: 0, extractor: 'string' }, // Campo fixo 'CNAB240', será preenchido pelo parser
};
