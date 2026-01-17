import { CNAB240_MIN_LINE_LENGTH, CNAB240_RECORD_TYPES } from '../../constants';
import { TrailerArquivoCNAB240 } from '../../interfaces/CNAB-240';
import { TRAILER_ARQUIVO_SCHEMA_240 } from '../../schema/cnab-240-schemas';
import { FieldExtractors } from '../../schema/core/extractors';
import { SchemaParser } from '../../schema/core/parser';

/** Parser para trailer do arquivo CNAB 240 (tipo de registro 9). */
export class TrailerArquivoParser240 {
  /**
   * Extrai dados do trailer do arquivo.
   * @param line - Linha do arquivo
   * @param _version - Versão do CNAB 240 ('030' ou '040') - não usado, mas mantido para compatibilidade
   * @returns Trailer do arquivo parseado ou null se inválido
   */
  static parse(line: string, _version: '030' | '040'): TrailerArquivoCNAB240 | null {
    return SchemaParser.parse<TrailerArquivoCNAB240>(line, TRAILER_ARQUIVO_SCHEMA_240, {
      minLength: CNAB240_MIN_LINE_LENGTH,
      validator: l => {
        const recordType = FieldExtractors.extractString(l, 7, 8);
        return recordType === CNAB240_RECORD_TYPES.TRAILER_FILE;
      },
    });
  }
}
