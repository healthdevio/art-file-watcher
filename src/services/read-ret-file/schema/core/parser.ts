import { FieldExtractors } from './extractors';
import { FieldSchema, LineSchema, SchemaValidation } from './types';

/**
 * Parser genérico baseado em schema para parsing de linhas fixas
 * Totalmente desacoplado e reutilizável em qualquer projeto
 *
 * @example
 * ```typescript
 * const schema: LineSchema<MyType> = {
 *   name: { start: 0, end: 10, extractor: 'string' },
 *   value: { start: 10, end: 20, extractor: 'number' },
 * };
 *
 * const result = SchemaParser.parse(line, schema, { minLength: 20 });
 * ```
 */
export class SchemaParser {
  /**
   * Parseia uma linha usando um schema tipado
   *
   * @param line - Linha do arquivo a ser parseada
   * @param schema - Schema que define propriedades e posições
   * @param validation - Regras de validação (minLength, validator)
   * @returns Objeto tipado ou null se inválido
   */
  static parse<T extends Record<string, unknown>>(
    line: string,
    schema: LineSchema<T>,
    validation: SchemaValidation,
  ): T | null {
    // Valida tamanho mínimo
    if (line.length < validation.minLength) return null;

    // Valida usando função customizada (se fornecida)
    if (validation.validator && !validation.validator(line)) return null;

    // Extrai todos os campos do schema
    const result = {} as T;
    for (const [key, field] of Object.entries(schema)) {
      const value = this.extractField(line, field);
      (result as Record<string, unknown>)[key] = value;
    }

    return result;
  }

  /**
   * Extrai um campo individual da linha usando o schema do campo
   *
   * @param line - Linha do arquivo
   * @param field - Schema do campo a ser extraído
   * @returns Valor extraído (string, number ou null)
   */
  private static extractField(line: string, field: FieldSchema): string | number | null {
    // Extrai valor baseado no tipo de extractor
    let rawValue: string | number;
    switch (field.extractor) {
      case 'string':
        rawValue = FieldExtractors.extractString(line, field.start, field.end);
        break;
      case 'number':
        rawValue = FieldExtractors.extractNumber(line, field.start, field.end);
        break;
      case 'monetary':
        rawValue = FieldExtractors.extractMonetary(line, field.start, field.end);
        break;
      case 'date':
        rawValue = FieldExtractors.extractDate(line, field.start, field.end);
        break;
      case 'date_short':
        rawValue = FieldExtractors.extractDateShort(line, field.start, field.end);
        break;
      default:
        rawValue = FieldExtractors.extractString(line, field.start, field.end);
    }

    // Aplica formatter customizado se fornecido
    if (field.formatter) {
      const formatted = field.formatter(typeof rawValue === 'string' ? rawValue : rawValue.toString());
      return formatted;
    }

    return rawValue;
  }
}
