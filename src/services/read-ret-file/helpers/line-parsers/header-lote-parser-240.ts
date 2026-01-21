import { CNAB240_MIN_LINE_LENGTH, CNAB240_RECORD_TYPES } from '../../constants';
import { HeaderLoteCNAB240 } from '../../interfaces/CNAB-240';
import * as CNAB240 from '../../schema/cnab-240';
import { FieldExtractors } from '../../schema/core/extractors';
import { SchemaParser } from '../../schema/core/parser';

/** Parser para header do lote CNAB 240 (tipo de registro 1). */
export class HeaderLoteParser240 {
  /**
   * Extrai dados do header do lote.
   * @param line - Linha do arquivo
   * @param version - Versão do CNAB 240 ('030' ou '040') - preservada para identificação, mas não afeta o schema
   * @returns Header do lote parseado ou null se inválido
   */
  static parse(line: string, _version: '030' | '040'): HeaderLoteCNAB240 | null {
    const schema = CNAB240.HEADER_LOTE_SCHEMA;
    return SchemaParser.parse<HeaderLoteCNAB240>(line, schema, {
      minLength: CNAB240_MIN_LINE_LENGTH,
      validator: l => {
        const recordType = FieldExtractors.extractString(l, 7, 8);
        return recordType === CNAB240_RECORD_TYPES.HEADER_LOTE;
      },
    });
  }
}
