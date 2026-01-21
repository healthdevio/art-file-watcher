import { CNAB240_MIN_LINE_LENGTH, CNAB240_RECORD_TYPES, CNAB240_SEGMENT_TYPES } from '../../constants';
import { SegmentoT } from '../../interfaces/CNAB-240';
import * as CNAB240 from '../../schema/cnab-240';
import { FieldExtractors } from '../../schema/core/extractors';
import { SegmentTLayoutDetector } from '../../schema/core/layout-detector';
import { SchemaParser } from '../../schema/core/parser';
import type { LineSchema } from '../../schema/core/types';

/** Parser para segmento T CNAB 240 (tipo 3, segmento T - dados do título). */
export class SegmentoTParser240 {
  /**
   * Extrai dados do segmento T com detecção automática de layout.
   * @param line - Linha do arquivo
   * @param version - Versão do CNAB 240 ('030' ou '040') - preservada para identificação, mas não afeta o schema
   * @returns Segmento T parseado ou null se inválido
   */
  static parse(line: string, _version: '030' | '040'): SegmentoT | null {
    // Validar que é realmente um Segmento T
    const recordType = FieldExtractors.extractString(line, 7, 8);
    const segmentType = FieldExtractors.extractString(line, 13, 14);
    if (recordType !== CNAB240_RECORD_TYPES.DETAIL || segmentType !== CNAB240_SEGMENT_TYPES.T) {
      return null;
    }

    // Detectar layout automaticamente
    const layoutDetection = SegmentTLayoutDetector.detectLayout(line);

    // Selecionar schema baseado no layout detectado
    const schema: LineSchema<SegmentoT> =
      layoutDetection.layout === 'PADRAO_V033'
        ? (CNAB240.SEGMENTO_T_SCHEMA_PADRAO_V033 as unknown as LineSchema<SegmentoT>)
        : (CNAB240.SEGMENTO_T_SCHEMA as unknown as LineSchema<SegmentoT>);

    return SchemaParser.parse<SegmentoT>(line, schema, {
      minLength: CNAB240_MIN_LINE_LENGTH,
      validator: () => true, // Validação já feita acima
    });
  }
}
