import { CNAB240_MIN_LINE_LENGTH, CNAB240_RECORD_TYPES, CNAB240_SEGMENT_TYPES } from '../../constants';
import { SegmentoU } from '../../interfaces/CNAB-240';
import { SEGMENTO_U_SCHEMA } from '../../schema/cnab-240-schemas';
import { FieldExtractors } from '../../schema/core/extractors';
import { SchemaParser } from '../../schema/core/parser';

/** Parser para segmento U CNAB 240 (tipo 3, segmento U - dados do pagamento). */
export class SegmentoUParser240 {
  /**
   * Extrai dados do segmento U.
   * @param line - Linha do arquivo
   * @param _version - Versão do CNAB 240 ('030' ou '040') - não usado, mas mantido para compatibilidade
   * @returns Segmento U parseado ou null se inválido
   */
  static parse(line: string, _version: '030' | '040'): SegmentoU | null {
    return SchemaParser.parse<SegmentoU>(line, SEGMENTO_U_SCHEMA, {
      minLength: CNAB240_MIN_LINE_LENGTH,
      validator: l => {
        const recordType = FieldExtractors.extractString(l, 7, 8);
        const segmentType = FieldExtractors.extractString(l, 13, 14);
        return recordType === CNAB240_RECORD_TYPES.DETAIL && segmentType === CNAB240_SEGMENT_TYPES.U;
      },
    });
  }
}
