import { CNAB240_MIN_LINE_LENGTH, CNAB240_RECORD_TYPES, CNAB240_SEGMENT_TYPES } from '../constants';

/** Tipo de linha identificado */
export type CNAB240LineType =
  | 'HEADER_LOTE'
  | 'SEGMENTO_T'
  | 'SEGMENTO_U'
  | 'SEGMENTO_Y'
  | 'TRAILER_LOTE'
  | 'TRAILER_ARQUIVO'
  | 'UNKNOWN';

/**
 * Identificador de tipo de linha CNAB 240.
 * Identifica o tipo de registro e segmento baseado nas posições padronizadas.
 */
export class LineTypeIdentifier {
  /**
   * Identifica o tipo de linha CNAB 240.
   * @param line - Linha do arquivo
   * @param version - Versão do CNAB 240 ('030' ou '040')
   * @returns Tipo de linha identificado
   */
  static identify(line: string, _version: '030' | '040'): CNAB240LineType {
    // Valida tamanho mínimo
    if (line.length < CNAB240_MIN_LINE_LENGTH) return 'UNKNOWN';

    // Extrai tipo de registro (posição 7)
    const recordType = line.substring(7, 8);

    // Identifica tipo de registro
    switch (recordType) {
      case CNAB240_RECORD_TYPES.HEADER_LOTE:
        return 'HEADER_LOTE';

      case CNAB240_RECORD_TYPES.DETAIL:
        return this.identifySegmentType(line);

      case CNAB240_RECORD_TYPES.TRAILER_LOTE:
        return 'TRAILER_LOTE';

      case CNAB240_RECORD_TYPES.TRAILER_FILE:
        return 'TRAILER_ARQUIVO';

      default:
        return 'UNKNOWN';
    }
  }

  /**
   * Identifica o tipo de segmento para linhas de detalhe (tipo 3).
   * @param line - Linha do arquivo
   * @returns Tipo de segmento identificado
   */
  private static identifySegmentType(line: string): CNAB240LineType {
    // Tipo de segmento está na posição 13
    if (line.length < 14) return 'UNKNOWN';
    const segmentType = line.substring(13, 14);

    switch (segmentType) {
      case CNAB240_SEGMENT_TYPES.T:
        return 'SEGMENTO_T';

      case CNAB240_SEGMENT_TYPES.U:
        return 'SEGMENTO_U';

      case CNAB240_SEGMENT_TYPES.Y:
        return 'SEGMENTO_Y';

      // Outros segmentos podem ser adicionados no futuro
      // case CNAB240_SEGMENT_TYPES.J:
      //   return 'SEGMENTO_J';

      default:
        return 'UNKNOWN';
    }
  }
}
