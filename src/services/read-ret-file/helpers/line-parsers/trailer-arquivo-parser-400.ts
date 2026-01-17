import { CNAB400_MIN_LINE_LENGTH, CNAB400_RECORD_TYPES } from '../../constants';
import { TrailerArquivoCNAB400 } from '../../interfaces/CNAB-400';
import { TRAILER_ARQUIVO_SCHEMA_400 } from '../../schema/cnab-400-schemas';
import { FieldExtractors } from '../../schema/core/extractors';
import { SchemaParser } from '../../schema/core/parser';

/** Parser para trailer do arquivo CNAB 400 (tipo de registro 9). */
export class TrailerArquivoParser400 {
  /**
   * Extrai dados do trailer do arquivo.
   * @param line - Linha do arquivo
   * @returns Trailer do arquivo parseado ou null se inválido
   */
  static parse(line: string): TrailerArquivoCNAB400 | null {
    return SchemaParser.parse<TrailerArquivoCNAB400>(line, TRAILER_ARQUIVO_SCHEMA_400, {
      minLength: CNAB400_MIN_LINE_LENGTH,
      validator: l => {
        const recordType = FieldExtractors.extractString(l, 0, 1);
        return recordType === CNAB400_RECORD_TYPES.TRAILER_FILE;
      },
    });
  }
}
