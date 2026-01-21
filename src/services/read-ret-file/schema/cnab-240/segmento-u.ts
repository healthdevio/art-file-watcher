import { SegmentoU } from '../../interfaces/CNAB-240';
import { LineSchema } from '../core/types';

/**
 * Schema para Segmento U CNAB 240 - Layout SEM_SITCS (sem Campo 16.3U)
 * Compatível com versões 030 e 040
 * Layout alternativo usado por 99,1% dos arquivos analisados
 * Campos estão deslocados 9 posições para a esquerda em relação à documentação FEBRABAN
 */
export const SEGMENTO_U_SCHEMA: LineSchema<SegmentoU> = {
  recordType: { start: 7, end: 8, extractor: 'string' },
  bankCode: { start: 0, end: 3, extractor: 'string' },
  lotCode: { start: 3, end: 7, extractor: 'string' },
  sequenceNumber: { start: 8, end: 13, extractor: 'string' },
  segmentType: { start: 13, end: 14, extractor: 'string' },
  movementCode: { start: 15, end: 17, extractor: 'string' },
  accruedInterest: { start: 17, end: 32, extractor: 'monetary' },
  discountAmount: { start: 32, end: 47, extractor: 'monetary' },
  dischargeAmount: { start: 47, end: 62, extractor: 'monetary' },
  paidAmount: { start: 77, end: 92, extractor: 'monetary' },
  receivedValue: { start: 92, end: 107, extractor: 'monetary' },
  otherCredits: { start: 107, end: 122, extractor: 'monetary' },
  otherExpenses: { start: 122, end: 137, extractor: 'monetary' },
  // Campo 21.3U: Data da Ocorrência - posições 138-145 (base 1) = 137-144 (base 0) no layout padrão
  paymentDate: { start: 137, end: 145, extractor: 'date' },
  // Campo 22.3U: Data da Efetivação do Crédito - posições 146-153 (base 1) = 145-152 (base 0) no layout padrão
  creditDate: { start: 145, end: 153, extractor: 'date' },
};
