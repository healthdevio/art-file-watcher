import { LineSchema } from './core/types';

/**
 * Interface para identificação de linha
 * Contém informações básicas para identificar o tipo de registro
 */
export interface LineIdentifier extends Record<string, unknown> {
  /** Tipo de registro (0=Header Arquivo, 1=Header Lote, 3=Detalhe, 5=Trailer Lote, 9=Trailer Arquivo) */
  recordType: string;
  /** Tipo de segmento (T, U, Y, etc) - apenas para registros de detalhe */
  segmentType?: string;
  /** Versão do layout (030, 040, etc) */
  layoutVersion?: string;
}

/**
 * Schema para identificar o tipo de linha
 * Usado antes de aplicar o schema específico do segmento
 */
export const LINE_IDENTIFIER_SCHEMA: LineSchema<LineIdentifier> = {
  recordType: { start: 7, end: 8, extractor: 'string' },
  segmentType: { start: 13, end: 14, extractor: 'string' },
  layoutVersion: { start: 13, end: 16, extractor: 'string' },
};

/**
 * Schema para identificar linha CNAB 400
 */
export const LINE_IDENTIFIER_SCHEMA_400: LineSchema<Pick<LineIdentifier, 'recordType'>> = {
  recordType: { start: 0, end: 1, extractor: 'string' },
};
