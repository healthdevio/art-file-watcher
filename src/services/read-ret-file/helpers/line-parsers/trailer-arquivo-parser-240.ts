import { CNAB240_LINE_POSITIONS, CNAB240_MIN_LINE_LENGTHS, CNAB240_RECORD_TYPES } from '../../constants';
import { TrailerArquivoCNAB240 } from '../../interfaces/CNAB-240';
import { extractNumber, extractString } from '../utils/string-extractor';

/**
 * Parser para trailer do arquivo CNAB 240 (tipo de registro 9).
 */
export class TrailerArquivoParser240 {
  /**
   * Extrai dados do trailer do arquivo.
   *
   * @param line - Linha do arquivo
   * @param _version - Versão do CNAB 240 ('030' ou '040')
   * @returns Trailer do arquivo parseado ou null se inválido
   */
  static parse(line: string, _version: '030' | '040'): TrailerArquivoCNAB240 | null {
    // Valida tamanho mínimo
    if (line.length < CNAB240_MIN_LINE_LENGTHS.TRAILER_FILE) return null;

    // Valida tipo de registro
    const recordType = extractString(
      line,
      CNAB240_LINE_POSITIONS.COMMON.RECORD_TYPE_START,
      CNAB240_LINE_POSITIONS.COMMON.RECORD_TYPE_END,
    );
    if (recordType !== CNAB240_RECORD_TYPES.TRAILER_FILE) return null;

    const pos = CNAB240_LINE_POSITIONS.TRAILER_FILE;
    const common = CNAB240_LINE_POSITIONS.COMMON;

    return {
      recordType,
      bankCode: extractString(line, common.BANK_CODE_START, common.BANK_CODE_END),
      totalLots: extractNumber(line, pos.TOTAL_LOTS_START, pos.TOTAL_LOTS_END),
      totalLines: extractNumber(line, pos.TOTAL_LINES_START, pos.TOTAL_LINES_END),
    };
  }
}
