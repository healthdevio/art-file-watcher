import { CNAB240_MIN_LINE_LENGTH, CNAB240_RECORD_TYPES, CNAB240_SEGMENT_TYPES } from '../../constants';
import { SegmentoT } from '../../interfaces/CNAB-240';
import { SEGMENTO_T_SCHEMA_030, SEGMENTO_T_SCHEMA_040 } from '../../schema/cnab-240-schemas';
import { FieldExtractors } from '../../schema/core/extractors';
import { SchemaParser } from '../../schema/core/parser';

/** Parser para segmento T CNAB 240 (tipo 3, segmento T - dados do título). */
export class SegmentoTParser240 {
  /**
   * Extrai dados do segmento T.
   * @param line - Linha do arquivo
   * @param version - Versão do CNAB 240 ('030' ou '040')
   * @returns Segmento T parseado ou null se inválido
   */
  static parse(line: string, version: '030' | '040'): SegmentoT | null {
    const schema = version === '030' ? SEGMENTO_T_SCHEMA_030 : SEGMENTO_T_SCHEMA_040;
    return SchemaParser.parse<SegmentoT>(line, schema, {
      minLength: CNAB240_MIN_LINE_LENGTH,
      validator: l => {
        const recordType = FieldExtractors.extractString(l, 7, 8);
        const segmentType = FieldExtractors.extractString(l, 13, 14);
        return recordType === CNAB240_RECORD_TYPES.DETAIL && segmentType === CNAB240_SEGMENT_TYPES.T;
      },
    });
  }
}
