import { CNAB400_LINE_POSITIONS, CNAB400_RECORD_TYPES } from '../../constants';
import { DetalheCNAB400 } from '../../interfaces/CNAB-400';
import { formatDate, normalizeAccount, normalizeAgency } from '../formatters';
import { extractMonetaryValue, extractString } from '../utils/string-extractor';

/**
 * Parser para linha de detalhe CNAB 400 (tipo de registro 7).
 */
export class DetalheParser400 {
  /**
   * Extrai dados da linha de detalhe.
   * @param line - Linha do arquivo
   * @returns Detalhe parseado ou null se inválido
   */
  static parse(line: string): DetalheCNAB400 | null {
    // Valida tamanho mínimo (400 caracteres para CNAB 400)
    const MIN_LINE_LENGTH = 400;
    if (line.length < MIN_LINE_LENGTH) return null;

    // Valida tipo de registro
    const recordType = extractString(
      line,
      CNAB400_LINE_POSITIONS.COMMON.RECORD_TYPE_START,
      CNAB400_LINE_POSITIONS.COMMON.RECORD_TYPE_END,
    );
    if (recordType !== CNAB400_RECORD_TYPES.DETAIL) return null;

    const pos = CNAB400_LINE_POSITIONS.DETAIL;

    return {
      recordType,
      agency: normalizeAgency(extractString(line, pos.AGENCY_START, pos.AGENCY_END)),
      agencyDigit: extractString(line, pos.AGENCY_DIGIT_START, pos.AGENCY_DIGIT_END).trim(),
      account: normalizeAccount(extractString(line, pos.ACCOUNT_START, pos.ACCOUNT_END)),
      accountDigit: extractString(line, pos.ACCOUNT_DIGIT_START, pos.ACCOUNT_DIGIT_END).trim(),
      agreement: extractString(line, pos.AGREEMENT_START, pos.AGREEMENT_END).trim(),
      regionalNumber: extractString(line, pos.REGIONAL_NUMBER_START, pos.REGIONAL_NUMBER_END).trim(),
      regionalNumberDigit: extractString(line, pos.REGIONAL_NUMBER_DIGIT_START, pos.REGIONAL_NUMBER_DIGIT_END).trim(),
      paymentDate: formatDate(extractString(line, pos.PAYMENT_DATE_START, pos.PAYMENT_DATE_END), 'DDMMAA'),
      creditDate: formatDate(extractString(line, pos.CREDIT_DATE_START, pos.CREDIT_DATE_END), 'DDMMAA'),
      tariff: extractMonetaryValue(line, pos.TARIFF_START, pos.TARIFF_END),
      receivedValue: extractMonetaryValue(line, pos.RECEIVED_VALUE_START, pos.RECEIVED_VALUE_END),
      sequenceNumber: extractString(line, pos.SEQUENCE_NUMBER_START, pos.SEQUENCE_NUMBER_END).trim(),
    };
  }
}
