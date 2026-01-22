import { CNAB400_MIN_LINE_LENGTH, CNAB400_RECORD_TYPES } from '../../constants';
import { DetalheCNAB400 } from '../../interfaces/CNAB-400';
import { CNAB400 } from '../../schema';
import { FieldExtractors } from '../../schema/core/extractors';
import { SchemaParser } from '../../schema/core/parser';

/** Parser para linha de detalhe CNAB 400 (tipo de registro 7). */
export class DetailsParser400 {
  /**
   * Extrai dados da linha de detalhe.
   * @param line - Linha do arquivo
   * @returns Detalhe parseado ou null se inválido
   */
  static parse(line: string): DetalheCNAB400 | null {
    return SchemaParser.parse<DetalheCNAB400>(line, CNAB400.DETALHE_SCHEMA_400, {
      minLength: CNAB400_MIN_LINE_LENGTH,
      validator: l => {
        const recordType = FieldExtractors.extractString(l, 0, 1);
        return recordType === CNAB400_RECORD_TYPES.DETAIL;
      },
    });
  }
}
