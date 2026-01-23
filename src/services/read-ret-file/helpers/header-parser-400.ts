import { CNAB400_MIN_LINE_LENGTH, CNAB400_RECORD_TYPES } from '../constants';
import { HeaderCNAB400 } from '../interfaces/CNAB-400';
import { HEADER_ARQUIVO_SCHEMA_400 } from '../schema/cnab-400/header-arquivo';
import { SchemaParser } from '../schema/core/parser';

/**
 * Parser para extrair campos do header de arquivo CNAB 400
 * Baseado na especificação FEBRABAN - Layout de Arquivo Retorno
 * Usa SchemaParser com HEADER_ARQUIVO_SCHEMA_400
 */
export class HeaderParser400 {
  /**
   * Extrai campos do header da primeira linha do arquivo CNAB 400
   * @param firstLine - Primeira linha do arquivo (header)
   * @returns HeaderCNAB400 com todos os campos extraídos
   */
  static parse(firstLine: string): HeaderCNAB400 | null {
    const parsed = SchemaParser.parse<HeaderCNAB400>(firstLine, HEADER_ARQUIVO_SCHEMA_400, {
      minLength: CNAB400_MIN_LINE_LENGTH,
      validator: line => {
        const recordType = line.substring(0, 2);
        return recordType === CNAB400_RECORD_TYPES.HEADER_FILE;
      },
    });

    if (!parsed) return null;

    // Preenche fileType fixo e aplica trim nos campos de texto
    return {
      ...parsed,
      fileType: 'CNAB400',
      bankName: parsed.bankName?.trim() || '',
      companyName: parsed.companyName?.trim() || '',
    };
  }
}
