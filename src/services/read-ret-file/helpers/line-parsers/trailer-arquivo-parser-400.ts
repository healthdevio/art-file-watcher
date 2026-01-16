import { CNAB400_LINE_POSITIONS, CNAB400_RECORD_TYPES } from '../../constants';
import { TrailerArquivoCNAB400 } from '../../interfaces/CNAB-400';
import { extractNumber, extractString } from '../utils/string-extractor';

/**
 * Parser para trailer do arquivo CNAB 400 (tipo de registro 9).
 */
export class TrailerArquivoParser400 {
  /**
   * Extrai dados do trailer do arquivo.
   *
   * @param line - Linha do arquivo
   * @returns Trailer do arquivo parseado ou null se inválido
   */
  static parse(line: string): TrailerArquivoCNAB400 | null {
    // Valida tamanho mínimo (400 caracteres para CNAB 400)
    const MIN_LINE_LENGTH = 400;
    if (line.length < MIN_LINE_LENGTH) return null;

    // Valida tipo de registro
    const recordType = extractString(
      line,
      CNAB400_LINE_POSITIONS.COMMON.RECORD_TYPE_START,
      CNAB400_LINE_POSITIONS.COMMON.RECORD_TYPE_END,
    );
    if (recordType !== CNAB400_RECORD_TYPES.TRAILER_ARQUIVO) return null;

    const pos = CNAB400_LINE_POSITIONS.TRAILER_ARQUIVO;

    return {
      recordType,
      totalRecords: extractNumber(line, pos.TOTAL_RECORDS_START, pos.TOTAL_RECORDS_END),
    };
  }
}
