import { CNAB240_MIN_LINE_LENGTH, CNAB240_RECORD_TYPES, CNAB240_SEGMENT_TYPES } from '../../constants';
import { SegmentoU } from '../../interfaces/CNAB-240';
import * as CNAB240 from '../../schema/cnab-240';
import { FieldExtractors } from '../../schema/core/extractors';
import { SegmentULayoutDetector } from '../../schema/core/layout-detector';
import { SchemaParser } from '../../schema/core/parser';
import type { LineSchema } from '../../schema/core/types';

/** Parser para segmento U CNAB 240 (tipo 3, segmento U - dados do pagamento). */
export class SegmentoUParser240 {
  /**
   * Extrai dados do segmento U com detecção automática de layout.
   * @param line - Linha do arquivo
   * @param version - Versão do CNAB 240 ('030' ou '040') - preservada para identificação, mas não afeta o schema
   * @returns Segmento U parseado ou null se inválido
   */
  static parse(line: string, _version: '030' | '040'): SegmentoU | null {
    // Validar que é realmente um Segmento U
    const recordType = FieldExtractors.extractString(line, 7, 8);
    const segmentType = FieldExtractors.extractString(line, 13, 14);
    if (recordType !== CNAB240_RECORD_TYPES.DETAIL || segmentType !== CNAB240_SEGMENT_TYPES.U) {
      return null;
    }

    // Detectar layout automaticamente
    const layoutDetection = SegmentULayoutDetector.detectLayout(line);

    // Selecionar schema baseado no layout detectado
    let schema: LineSchema<SegmentoU>;
    switch (layoutDetection.layout) {
      case 'SITCS':
        schema = CNAB240.SEGMENTO_U_SCHEMA_SITCS as unknown as LineSchema<SegmentoU>;
        break;
      case 'PADRAO_V033':
        schema = CNAB240.SEGMENTO_U_SCHEMA_PADRAO_V033 as unknown as LineSchema<SegmentoU>;
        break;
      case 'SEM_SITCS':
      default:
        schema = CNAB240.SEGMENTO_U_SCHEMA as unknown as LineSchema<SegmentoU>;
        break;
    }

    // Parsear usando o schema selecionado
    const result = SchemaParser.parse<SegmentoU>(line, schema, {
      minLength: CNAB240_MIN_LINE_LENGTH,
      validator: () => true, // Validação já feita acima
    });

    // Adicionar metadados de detecção ao resultado (opcional, para debug)
    if (result && layoutDetection.confidence !== 'high') {
      // Em produção, pode-se logar warnings para layouts detectados com baixa confiança
      // console.warn(`Segmento U detectado com confiança ${layoutDetection.confidence}: ${layoutDetection.reason}`);
    }

    return result;
  }
}
