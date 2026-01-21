/**
 * Exporta todos os schemas organizados por tipo
 * Schemas CNAB 240 são unificados (compatíveis com versões 030 e 040)
 * A identificação da versão é preservada no header (fileCode)
 */

// Schema de identificação de linha
export * from './line-identifier';

// Schemas CNAB 240 (unificados - compatíveis com versões 030 e 040)
export * as CNAB240 from './cnab-240';

// Schemas CNAB 400
export * as CNAB400 from './cnab-400';

