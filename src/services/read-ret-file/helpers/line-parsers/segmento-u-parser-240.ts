import {
  CNAB240_LINE_POSITIONS,
  CNAB240_MIN_LINE_LENGTHS,
  CNAB240_RECORD_TYPES,
  CNAB240_SEGMENT_TYPES,
} from '../../constants';
import { SegmentoU } from '../../interfaces/CNAB-240';
import { formatDate } from '../formatters';
import { extractMonetaryValue, extractString } from '../utils/string-extractor';

/**
 * Parser para segmento U CNAB 240 (tipo 3, segmento U - dados do pagamento).
 */
export class SegmentoUParser240 {
  /**
   * Extrai dados do segmento U.
   *
   * @param line - Linha do arquivo
   * @param version - Versão do CNAB 240 ('030' ou '040')
   * @returns Segmento U parseado ou null se inválido
   */
  static parse(line: string, version: '030' | '040'): SegmentoU | null {
    // Valida tamanho mínimo
    if (line.length < CNAB240_MIN_LINE_LENGTHS.DETAIL) return null;

    // Valida tipo de registro
    const recordType = extractString(
      line,
      CNAB240_LINE_POSITIONS.COMMON.RECORD_TYPE_START,
      CNAB240_LINE_POSITIONS.COMMON.RECORD_TYPE_END,
    );
    if (recordType !== CNAB240_RECORD_TYPES.DETAIL) return null;

    // Valida tipo de segmento
    const segmentType = extractString(
      line,
      CNAB240_LINE_POSITIONS.SEGMENTO_U.SEGMENT_TYPE_START,
      CNAB240_LINE_POSITIONS.SEGMENTO_U.SEGMENT_TYPE_END,
    );
    if (segmentType !== CNAB240_SEGMENT_TYPES.U) return null;

    const pos = CNAB240_LINE_POSITIONS.SEGMENTO_U;
    const common = CNAB240_LINE_POSITIONS.COMMON;

    return {
      recordType,
      segmentType,
      bankCode: extractString(line, common.BANK_CODE_START, common.BANK_CODE_END),
      lotCode: extractString(line, common.LOT_CODE_START, common.LOT_CODE_END),
      sequenceNumber: extractString(line, 8, 13).trim(),
      accruedInterest: extractMonetaryValue(line, pos.ACCRUED_INTEREST_START, pos.ACCRUED_INTEREST_END),
      discountAmount: extractMonetaryValue(line, pos.DISCOUNT_AMOUNT_START, pos.DISCOUNT_AMOUNT_END),
      dischargeAmount: extractMonetaryValue(line, pos.DISCHARGE_AMOUNT_START, pos.DISCHARGE_AMOUNT_END),
      receivedValue: extractMonetaryValue(line, pos.RECEIVED_VALUE_START, pos.RECEIVED_VALUE_END),
      paidAmount: extractMonetaryValue(line, pos.PAID_AMOUNT_START, pos.PAID_AMOUNT_END),
      otherExpenses: extractMonetaryValue(line, pos.OTHER_EXPENSES_START, pos.OTHER_EXPENSES_END),
      otherCredits: extractMonetaryValue(line, pos.OTHER_CREDITS_START, pos.OTHER_CREDITS_END),
      paymentDate: formatDate(extractString(line, pos.PAYMENT_DATE_START, pos.PAYMENT_DATE_END), 'DDMMAAAA'),
      creditDate: formatDate(extractString(line, pos.CREDIT_DATE_START, pos.CREDIT_DATE_END), 'DDMMAAAA'),
      occurrenceCode: extractString(line, pos.OCCURRENCE_CODE_START, pos.OCCURRENCE_CODE_END).trim(),
    };
  }
}
