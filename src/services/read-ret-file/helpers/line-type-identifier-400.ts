import { CNAB400_RECORD_TYPES } from '../constants';

/** Tipo de linha identificado no CNAB 400 */
export type CNAB400LineType = 'DETALHE' | 'TRAILER_ARQUIVO' | 'UNKNOWN';

/**
 * Identificador de tipo de linha CNAB 400.
 * Identifica o tipo de registro baseado nas posições padronizadas.
 */
export class LineTypeIdentifier400 {
  /**
   * Identifica o tipo de linha CNAB 400.
   * @param line - Linha do arquivo
   * @returns Tipo de linha identificado
   */
  static identify(line: string): CNAB400LineType {
    // Valida tamanho mínimo
    const MIN_LINE_LENGTH = 400;
    if (line.length < MIN_LINE_LENGTH) return 'UNKNOWN';

    // Extrai tipo de registro (posição 0)
    const recordType = line.substring(0, 1);

    // Identifica tipo de registro
    switch (recordType) {
      case CNAB400_RECORD_TYPES.DETAIL:
        return 'DETALHE';
      case CNAB400_RECORD_TYPES.TRAILER_FILE:
        return 'TRAILER_ARQUIVO';
      default:
        return 'UNKNOWN';
    }
  }
}
