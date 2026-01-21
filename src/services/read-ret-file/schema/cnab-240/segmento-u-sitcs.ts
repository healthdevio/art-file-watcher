import { SegmentoU } from '../../interfaces/CNAB-240';
import { LineSchema } from '../core/types';

/**
 * Schema para Segmento U CNAB 240 - Layout SITCS (com Campo 16.3U)
 * Compatível com versões 030 e 040
 * Baseado na documentação FEBRABAN - Layout completo com campos SITCS
 */
export const SEGMENTO_U_SCHEMA_SITCS: LineSchema<SegmentoU> = {
  recordType: { start: 7, end: 8, extractor: 'string' },
  bankCode: { start: 0, end: 3, extractor: 'string' },
  lotCode: { start: 3, end: 7, extractor: 'string' },
  sequenceNumber: { start: 8, end: 13, extractor: 'string' },
  segmentType: { start: 13, end: 14, extractor: 'string' },
  movementCode: { start: 15, end: 17, extractor: 'string' },

  // Campos SITCS (08.3U a 16.3U) - presentes no layout SITCS
  // Nota: Estes campos não estão mapeados na interface SegmentoU atual,
  // mas as posições são preservadas para manter compatibilidade

  // Campos monetários seguem as posições da documentação FEBRABAN
  accruedInterest: { start: 17, end: 32, extractor: 'monetary' },
  discountAmount: { start: 32, end: 47, extractor: 'monetary' },
  dischargeAmount: { start: 47, end: 62, extractor: 'monetary' },

  // Campo 17.3U: Valor Pago pelo Pagador (posições 87-101 base 1 = 86-100 base 0)
  paidAmount: { start: 86, end: 100, extractor: 'monetary' },

  // Campo 18.3U: Valor Líquido a ser Creditado (posições 102-116 base 1 = 101-115 base 0)
  receivedValue: { start: 101, end: 115, extractor: 'monetary' },

  // Campo 19.3U: Juros / Multa / Encargos (posições 117-131 base 1 = 116-130 base 0)
  otherCredits: { start: 116, end: 130, extractor: 'monetary' },

  // Campo 20.3U: Valor de Outros Créditos (posições 132-146 base 1 = 131-145 base 0)
  otherExpenses: { start: 131, end: 145, extractor: 'monetary' },

  /** Campo 21.3U: Data da Ocorrência (posições 147-154 base 1 = 146-153 base 0) */
  paymentDate: { start: 146, end: 153, extractor: 'date' },

  /** Campo 22.3U: Data da Efetivação do Crédito (posições 155-162 base 1 = 154-161 base 0) */
  creditDate: { start: 154, end: 161, extractor: 'date' },
};
