import { CNAB240_MIN_LINE_LENGTH, CNAB240_RECORD_TYPES, CNAB240_SEGMENT_TYPES } from '../../constants';
import { SegmentoY } from '../../interfaces/CNAB-240';
import * as CNAB240 from '../../schema/cnab-240';
import { FieldExtractors } from '../../schema/core/extractors';
import { SchemaParser } from '../../schema/core/parser';

/** Parser para segmento Y CNAB 240 (tipo 3, segmento Y - dados adicionais / alegações do sacado). */
export class SegmentoYParser240 {
  /**
   * Extrai dados do segmento Y.
   * @param line - Linha do arquivo
   * @param version - Versão do CNAB 240 ('030' ou '040') - preservada para identificação, mas não afeta o schema
   * @returns Segmento Y parseado ou null se inválido
   */
  static parse(line: string, _version: '030' | '040'): SegmentoY | null {
    const schema = CNAB240.SEGMENTO_Y_SCHEMA;
    return SchemaParser.parse<SegmentoY>(line, schema, {
      minLength: CNAB240_MIN_LINE_LENGTH,
      validator: l => {
        const recordType = FieldExtractors.extractString(l, 7, 8);
        const segmentType = FieldExtractors.extractString(l, 13, 14);
        return recordType === CNAB240_RECORD_TYPES.DETAIL && segmentType === CNAB240_SEGMENT_TYPES.Y;
      },
    });
  }
}
