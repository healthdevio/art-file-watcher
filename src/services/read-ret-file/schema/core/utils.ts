import { LineSchema, PartialSchema } from './types';

/**
 * Combina múltiplos schemas parciais em um schema completo
 * Útil para reutilizar schemas comuns entre layouts
 * Schemas posteriores sobrescrevem propriedades de schemas anteriores
 *
 * @example
 * ```typescript
 * const commonSchema: PartialSchema<MyType> = { id: {...}, name: {...} };
 * const specificSchema: PartialSchema<MyType> = { value: {...} };
 * const fullSchema = combineSchemas(commonSchema, specificSchema);
 * ```
 */
export function combineSchemas<T extends Record<string, unknown>>(...schemas: Array<PartialSchema<T>>): LineSchema<T> {
  const result = {} as LineSchema<T>;
  for (const schema of schemas) {
    Object.assign(result, schema);
  }
  return result;
}

// Re-export date utilities
export * from './date-utils';
