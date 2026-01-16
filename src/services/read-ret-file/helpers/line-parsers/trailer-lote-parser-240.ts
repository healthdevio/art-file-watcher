import { CNAB240_LINE_POSITIONS, CNAB240_MIN_LINE_LENGTHS, CNAB240_RECORD_TYPES } from '../../constants';
import { TrailerLoteCNAB240 } from '../../interfaces/CNAB-240';
import { extractMonetaryValue, extractNumber, extractString } from '../utils/string-extractor';

/**
 * Parser para trailer do lote CNAB 240 (tipo de registro 5).
 */
export class TrailerLoteParser240 {
  /**
   * Extrai dados do trailer do lote.
   *
   * @param line - Linha do arquivo
   * @param version - Versão do CNAB 240 ('030' ou '040')
   * @returns Trailer do lote parseado ou null se inválido
   */
  static parse(line: string, _version: '030' | '040'): TrailerLoteCNAB240 | null {
    // Valida tamanho mínimo
    if (line.length < CNAB240_MIN_LINE_LENGTHS.TRAILER_LOTE) return null;

    // Valida tipo de registro
    const recordType = extractString(
      line,
      CNAB240_LINE_POSITIONS.COMMON.RECORD_TYPE_START,
      CNAB240_LINE_POSITIONS.COMMON.RECORD_TYPE_END,
    );
    if (recordType !== CNAB240_RECORD_TYPES.TRAILER_LOTE) return null;

    const pos = CNAB240_LINE_POSITIONS.TRAILER_LOTE;
    const common = CNAB240_LINE_POSITIONS.COMMON;

    return {
      recordType,
      bankCode: extractString(line, common.BANK_CODE_START, common.BANK_CODE_END),
      lotCode: extractString(line, common.LOT_CODE_START, common.LOT_CODE_END),
      sequenceNumber: extractString(line, 8, 13).trim(),
      totalLines: extractNumber(line, pos.TOTAL_LINES_START, pos.TOTAL_LINES_END),
      totalTitles: extractNumber(line, pos.TOTAL_TITLES_START, pos.TOTAL_TITLES_END),
      totalValue: extractMonetaryValue(line, pos.TOTAL_VALUE_START, pos.TOTAL_VALUE_END),
    };
  }
}
