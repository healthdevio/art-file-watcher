import { IDENTIFICATION_POSITIONS, IDENTIFICATION_VALUES, MIN_LINE_LENGTHS } from './constants';
import { CNABType } from './types';

/**
 * Identificador desacoplado de arquivos CNAB.
 * Esta classe é totalmente independente e pode ser copiada para outros projetos.
 */
export class FileIdentifier {
  /**
   * Identifica o tipo de arquivo CNAB baseado nas primeiras duas linhas.
   * @param firstLine - Primeira linha do arquivo
   * @param secondLine - Segunda linha do arquivo
   * @returns Tipo CNAB detectado
   */
  static identify(firstLine: string, secondLine: string): CNABType {
    // Valida tamanho mínimo das linhas
    if (firstLine.length < MIN_LINE_LENGTHS.FIRST_LINE || secondLine.length < MIN_LINE_LENGTHS.SECOND_LINE) {
      return 'UNKNOWN';
    }

    // Tenta identificar CNAB 400 primeiro
    const cnab400 = this.identifyCNAB400(firstLine, secondLine);
    if (cnab400 !== 'UNKNOWN') return cnab400;

    // Tenta identificar CNAB 240
    const cnab240 = this.identifyCNAB240(firstLine, secondLine);
    if (cnab240 !== 'UNKNOWN') return cnab240;

    return 'UNKNOWN';
  }

  /**
   * Identifica se o arquivo é CNAB 400.
   *
   * @param firstLine - Primeira linha do arquivo
   * @param secondLine - Segunda linha do arquivo
   * @returns 'CNAB400' se identificado, 'UNKNOWN' caso contrário
   */
  private static identifyCNAB400(firstLine: string, secondLine: string): CNABType {
    const { FIRST_LINE, SECOND_LINE } = IDENTIFICATION_POSITIONS;
    const { CNAB_400 } = IDENTIFICATION_VALUES;

    // Extrai valores das posições específicas
    const recordType = firstLine.substring(FIRST_LINE.RECORD_TYPE_START, FIRST_LINE.RECORD_TYPE_END);
    const fileType = firstLine.substring(FIRST_LINE.FILE_TYPE_START, FIRST_LINE.FILE_TYPE_END);
    const registerId = secondLine.substring(SECOND_LINE.REGISTER_ID_START, SECOND_LINE.REGISTER_ID_END);

    // Verifica condições para CNAB 400
    if (recordType === CNAB_400.RECORD_TYPE && fileType === CNAB_400.FILE_TYPE && registerId === CNAB_400.REGISTER_ID) {
      return 'CNAB400';
    }

    return 'UNKNOWN';
  }

  /**
   * Identifica se o arquivo é CNAB 240 e qual versão (030 ou 040).
   * @param firstLine - Primeira linha do arquivo
   * @param secondLine - Segunda linha do arquivo
   * @returns 'CNAB240_30', 'CNAB240_40' se identificado, 'UNKNOWN' caso contrário
   */
  private static identifyCNAB240(firstLine: string, secondLine: string): CNABType {
    const { FIRST_LINE, SECOND_LINE } = IDENTIFICATION_POSITIONS;
    const { CNAB_240 } = IDENTIFICATION_VALUES;

    // Extrai valores das posições específicas
    const fileType = firstLine.substring(FIRST_LINE.FILE_TYPE_START, FIRST_LINE.FILE_TYPE_END);
    const registerType = secondLine.substring(SECOND_LINE.REGISTER_TYPE_START, SECOND_LINE.REGISTER_TYPE_END);
    const fileCode = firstLine.substring(FIRST_LINE.FILE_CODE_START, FIRST_LINE.FILE_CODE_END);

    // Verifica condições para CNAB 240
    // Linha 1 não deve conter "RETORNO" e linha 2 deve ter "T" na posição 8-9
    if (fileType !== CNAB_240.FILE_TYPE_NOT && registerType === CNAB_240.REGISTER_TYPE) {
      // Verifica o código do arquivo para determinar a versão
      if (fileCode === CNAB_240.FILE_CODE_030) return 'CNAB240_30';
      if (fileCode === CNAB_240.FILE_CODE_040) return 'CNAB240_40';
    }

    return 'UNKNOWN';
  }
}
