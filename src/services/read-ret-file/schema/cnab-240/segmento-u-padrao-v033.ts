import { SegmentoU } from '../../interfaces/CNAB-240';
import { LineSchema } from '../core/types';

/**
 * Schema para Segmento U CNAB 240 - Layout Padrão v033 (Manual novo)
 * Compatível com versões 030 e 040
 * Baseado no manual CNAB240_v033.md - Layout padrão sem campos SITCS
 */
export const SEGMENTO_U_SCHEMA_PADRAO_V033: LineSchema<SegmentoU> = {
  recordType: { start: 7, end: 8, extractor: 'string' },
  bankCode: { start: 0, end: 3, extractor: 'string' },
  lotCode: { start: 3, end: 7, extractor: 'string' },
  sequenceNumber: { start: 8, end: 13, extractor: 'string' },
  segmentType: { start: 13, end: 14, extractor: 'string' },
  movementCode: { start: 15, end: 17, extractor: 'string' },
  accruedInterest: { start: 17, end: 32, extractor: 'monetary' },
  discountAmount: { start: 32, end: 47, extractor: 'monetary' },
  dischargeAmount: { start: 47, end: 62, extractor: 'monetary' },
  // Campo 12.3U: Valor do IOF Recolhido (posições 63-77 base 1 = 62-76 base 0)
  // Nota: Campo IOF não está na interface SegmentoU atual, mas posição é reservada
  // Campo 12.3U: Valor Pago pelo Pagador (posições 78-92 base 1 = 77-91 base 0)
  // Manual v033: Campo 12.3U Valor Pago: 78-92 (base 1) = 77-91 (base 0)
  paidAmount: { start: 77, end: 92, extractor: 'monetary' },
  // Campo 13.3U: Valor Líquido a ser Creditado (posições 93-107 base 1 = 92-106 base 0)
  // Manual v033: Campo 13.3U Valor Líquido: 93-107 (base 1) = 92-106 (base 0)
  receivedValue: { start: 92, end: 107, extractor: 'monetary' },
  // Campo 14.3U: Outras Despesas (posições 108-122 base 1 = 107-121 base 0)
  // Manual v033: Campo 14.3U Outras Despesas: 108-122 (base 1) = 107-121 (base 0)
  otherExpenses: { start: 107, end: 122, extractor: 'monetary' },
  // Campo 15.3U: Outros Créditos (posições 123-137 base 1 = 122-136 base 0)
  // Manual v033: Campo 15.3U Outros Créditos: 123-137 (base 1) = 122-136 (base 0)
  otherCredits: { start: 122, end: 137, extractor: 'monetary' },
  // Campo 16.3U: Data da Ocorrência (posições 138-145 base 1 = 137-144 base 0)
  // Manual v033: Campo 16.3U Data Ocorrência: 138-145 (base 1) = 137-144 (base 0)
  paymentDate: { start: 137, end: 145, extractor: 'date' },
  // Campo 17.3U: Data da Efetivação do Crédito (posições 146-153 base 1 = 145-152 base 0)
  // Manual v033: Campo 17.3U Data Crédito: 146-153 (base 1) = 145-152 (base 0)
  creditDate: { start: 145, end: 153, extractor: 'date' },
};
