import { CNAB240_MIN_LINE_LENGTH, CNAB240_RECORD_TYPES } from '../../constants';
import { TrailerLoteCNAB240 } from '../../interfaces/CNAB-240';
import { TRAILER_LOTE_SCHEMA } from '../../schema/cnab-240-schemas';
import { FieldExtractors } from '../../schema/core/extractors';
import { SchemaParser } from '../../schema/core/parser';

/** Parser para trailer do lote CNAB 240 (tipo de registro 5). */
export class TrailerLoteParser240 {
  /**
   * Extrai dados do trailer do lote.
   * @param line - Linha do arquivo
   * @param _version - Versão do CNAB 240 ('030' ou '040') - não usado, mas mantido para compatibilidade
   * @returns Trailer do lote parseado ou null se inválido
   */
  static parse(line: string, _version: '030' | '040'): TrailerLoteCNAB240 | null {
    return SchemaParser.parse<TrailerLoteCNAB240>(line, TRAILER_LOTE_SCHEMA, {
      minLength: CNAB240_MIN_LINE_LENGTH,
      validator: l => {
        const recordType = FieldExtractors.extractString(l, 7, 8);
        return recordType === CNAB240_RECORD_TYPES.TRAILER_LOTE;
      },
    });
  }
}
