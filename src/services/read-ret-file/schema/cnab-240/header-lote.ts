import { normalizeRegistration } from '../../helpers/formatters';
import { HeaderLoteCNAB240 } from '../../interfaces/CNAB-240';
import { LineSchema } from '../core/types';

/**
 * Schema para Header do Lote CNAB 240
 * Compatível com versões 030 e 040 - Baseado na documentação oficial: Layout CNAB_240_v_1_8
 * Posições corrigidas conforme especificação FEBRABAN
 */
export const HEADER_LOTE_SCHEMA: LineSchema<HeaderLoteCNAB240> = {
  recordType: { start: 7, end: 8, extractor: 'string' },
  bankCode: { start: 0, end: 3, extractor: 'string' },
  lotCode: { start: 3, end: 7, extractor: 'string' },
  operationType: { start: 8, end: 9, extractor: 'string' },
  serviceType: { start: 9, end: 11, extractor: 'string' },
  entryForm: { start: 11, end: 13, extractor: 'string' },
  layoutVersion: { start: 13, end: 16, extractor: 'string' },
  companyRegistrationType: { start: 17, end: 18, extractor: 'string' },
  companyRegistration: { start: 18, end: 32, extractor: 'string', formatter: normalizeRegistration },
  companyName: { start: 73, end: 103, extractor: 'string' },
  companyMessage: { start: 106, end: 145, extractor: 'string' },
  bankName: { start: 146, end: 185, extractor: 'string' },
  generationDate: { start: 191, end: 199, extractor: 'date' },
  generationTime: { start: 240, end: 240, extractor: 'string' }, // Campo não existe no Header do Lote de Retorno, retorna vazio
};
