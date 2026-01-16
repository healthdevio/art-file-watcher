import { CNAB240_LINE_POSITIONS, CNAB240_MIN_LINE_LENGTHS, CNAB240_RECORD_TYPES } from '../../constants';
import { HeaderLoteCNAB240 } from '../../interfaces/CNAB-240';
import { formatDate } from '../formatters';
import { extractString } from '../utils/string-extractor';

/**
 * Parser para header do lote CNAB 240 (tipo de registro 1).
 */
export class HeaderLoteParser240 {
  /**
   * Extrai dados do header do lote.
   *
   * @param line - Linha do arquivo
   * @param version - Versão do CNAB 240 ('030' ou '040')
   * @returns Header do lote parseado ou null se inválido
   */
  static parse(line: string, _version: '030' | '040'): HeaderLoteCNAB240 | null {
    if (line.length < CNAB240_MIN_LINE_LENGTHS.HEADER_LOTE) return null;

    // Valida tipo de registro
    const recordType = extractString(
      line,
      CNAB240_LINE_POSITIONS.COMMON.RECORD_TYPE_START,
      CNAB240_LINE_POSITIONS.COMMON.RECORD_TYPE_END,
    );
    if (recordType !== CNAB240_RECORD_TYPES.HEADER_LOTE) return null;

    const pos = CNAB240_LINE_POSITIONS.HEADER_LOTE;

    return {
      recordType,
      bankCode: extractString(
        line,
        CNAB240_LINE_POSITIONS.COMMON.BANK_CODE_START,
        CNAB240_LINE_POSITIONS.COMMON.BANK_CODE_END,
      ),
      lotCode: extractString(
        line,
        CNAB240_LINE_POSITIONS.COMMON.LOT_CODE_START,
        CNAB240_LINE_POSITIONS.COMMON.LOT_CODE_END,
      ),
      operationType: extractString(line, pos.OPERATION_TYPE_START, pos.OPERATION_TYPE_END),
      serviceType: extractString(line, pos.SERVICE_TYPE_START, pos.SERVICE_TYPE_END),
      entryForm: extractString(line, pos.ENTRY_FORM_START, pos.ENTRY_FORM_END),
      layoutVersion: extractString(line, pos.LAYOUT_VERSION_START, pos.LAYOUT_VERSION_END),
      companyRegistrationType: extractString(
        line,
        pos.COMPANY_REGISTRATION_TYPE_START,
        pos.COMPANY_REGISTRATION_TYPE_END,
      ),
      companyRegistration: extractString(line, pos.COMPANY_REGISTRATION_START, pos.COMPANY_REGISTRATION_END).trim(),
      companyName: extractString(line, pos.COMPANY_NAME_START, pos.COMPANY_NAME_END).trim(),
      companyMessage: extractString(line, pos.COMPANY_MESSAGE_START, pos.COMPANY_MESSAGE_END).trim(),
      bankName: extractString(line, pos.BANK_NAME_START, pos.BANK_NAME_END).trim(),
      generationDate: formatDate(extractString(line, pos.DATE_GENERATION_START, pos.DATE_GENERATION_END), 'DDMMAAAA'),
      generationTime: extractString(line, pos.TIME_GENERATION_START, pos.TIME_GENERATION_END),
    };
  }
}
