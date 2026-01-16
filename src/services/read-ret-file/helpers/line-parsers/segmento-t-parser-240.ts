import {
  CNAB240_LINE_POSITIONS,
  CNAB240_MIN_LINE_LENGTHS,
  CNAB240_RECORD_TYPES,
  CNAB240_SEGMENT_TYPES,
} from '../../constants';
import { SegmentoT } from '../../interfaces/CNAB-240';
import { normalizeAccount, normalizeAgency } from '../formatters';
import { extractMonetaryValue, extractString } from '../utils/string-extractor';

/**
 * Parser para segmento T CNAB 240 (tipo 3, segmento T - dados do título).
 */
export class SegmentoTParser240 {
  /**
   * Extrai dados do segmento T.
   * CORREÇÃO: Na versão 030, a posição do account foi corrigida de 23-35 para 30-35.
   *
   * @param line - Linha do arquivo
   * @param version - Versão do CNAB 240 ('030' ou '040')
   * @returns Segmento T parseado ou null se inválido
   */
  static parse(line: string, version: '030' | '040'): SegmentoT | null {
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
      CNAB240_LINE_POSITIONS.SEGMENTO_T.SEGMENT_TYPE_START,
      CNAB240_LINE_POSITIONS.SEGMENTO_T.SEGMENT_TYPE_END,
    );
    if (segmentType !== CNAB240_SEGMENT_TYPES.T) return null;

    const pos = CNAB240_LINE_POSITIONS.SEGMENTO_T;
    const common = CNAB240_LINE_POSITIONS.COMMON;

    // Determina posição do account baseado na versão
    // CORREÇÃO: Versão 030 agora usa 30-35 (igual à 040), não mais 23-35
    const accountStart = version === '030' ? pos.ACCOUNT_START_030 : pos.ACCOUNT_START_040;
    const accountEnd = version === '030' ? pos.ACCOUNT_END_030 : pos.ACCOUNT_END_040;

    return {
      recordType,
      segmentType,
      bankCode: extractString(line, common.BANK_CODE_START, common.BANK_CODE_END),
      lotCode: extractString(line, common.LOT_CODE_START, common.LOT_CODE_END),
      sequenceNumber: extractString(line, 8, 13).trim(),
      movementCode: extractString(line, pos.MOVEMENT_CODE_START, pos.MOVEMENT_CODE_END).trim(),
      agency: normalizeAgency(extractString(line, pos.AGENCY_START, pos.AGENCY_END)),
      agencyDigit: extractString(line, pos.AGENCY_DIGIT_START, pos.AGENCY_DIGIT_END).trim(),
      agreement: extractString(line, pos.AGREEMENT_START, pos.AGREEMENT_END).trim(),
      account: normalizeAccount(extractString(line, accountStart, accountEnd)),
      accountDigit: extractString(line, pos.ACCOUNT_DIGIT_START, pos.ACCOUNT_DIGIT_END).trim(),
      regionalNumber: extractString(line, pos.REGIONAL_NUMBER_START, pos.REGIONAL_NUMBER_END).trim(),
      regionalNumberDigit: extractString(line, pos.REGIONAL_NUMBER_DIGIT_START, pos.REGIONAL_NUMBER_DIGIT_END).trim(),
      titleNumber: extractString(line, pos.TITLE_NUMBER_START, pos.TITLE_NUMBER_END).trim(),
      titlePortfolio: extractString(line, pos.TITLE_PORTFOLIO_START, pos.TITLE_PORTFOLIO_END).trim(),
      titleType: extractString(line, pos.TITLE_TYPE_START, pos.TITLE_TYPE_END).trim(),
      interestCode: extractString(line, pos.INTEREST_CODE_START, pos.INTEREST_CODE_END).trim(),
      tariff: extractMonetaryValue(line, pos.TARIFF_START, pos.TARIFF_END),
    };
  }
}
