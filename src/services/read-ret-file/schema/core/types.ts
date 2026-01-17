/**
 * Tipos de extractor disponíveis para campos do schema
 * Todos os extractors são built-in e não dependem de bibliotecas externas
 */
export type FieldExtractorType =
  | 'string' // Extração simples de string (trim)
  | 'number' // Extração e conversão para number
  | 'monetary' // Extração de valor monetário (÷ 100)
  | 'date' // Formatação de data DDMMAAAA -> DD/MM/AAAA
  | 'date_short'; // Formatação de data DDMMAA -> DD/MM/AA

/**
 * Formatter customizado para transformar valores extraídos
 * Função genérica que pode ser passada para campos específicos
 * Permite desacoplamento: formatters externos são injetados, não importados
 */
export type FieldFormatter<TValue = string | number | null> = (value: string) => TValue;

/**
 * Definição de um campo no schema
 * Totalmente genérico - não depende do domínio CNAB
 * A propriedade é inferida pela chave do schema, eliminando redundância
 */
export type FieldSchema = {
  /** Posição inicial (inclusive) */
  start: number;
  /** Posição final (exclusive) */
  end: number;
  /** Tipo de extractor a ser usado (built-in) */
  extractor: FieldExtractorType;
  /** Formatter customizado opcional (injetado externamente) */
  formatter?: FieldFormatter;
};

/**
 * Schema de uma linha completa
 * Mapeia chaves do tipo T para FieldSchema
 * Type-safe: TypeScript garante que todas as propriedades estão mapeadas
 */
export type LineSchema<T extends Record<string, unknown>> = {
  [K in keyof Required<T>]: FieldSchema;
};

/**
 * Schema parcial/comum que pode ser reutilizado entre layouts
 * Mapeia um subconjunto de propriedades para FieldSchema
 * Permite composição de schemas comuns em schemas completos
 */
export type PartialSchema<T extends Record<string, unknown>> = {
  [K in keyof T]?: FieldSchema;
};

/**
 * Configuração de validação do schema
 * Genérico - não depende do domínio CNAB
 */
export type SchemaValidation = {
  /** Tamanho mínimo da linha */
  minLength: number;
  /** Função para validar se a linha é do tipo esperado (opcional) */
  validator?: (line: string) => boolean;
};
