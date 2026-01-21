/**
 * Schemas unificados para CNAB 240
 * Compatíveis com versões 030 e 040
 * A identificação da versão é preservada no header (fileCode)
 */

export * from './header-arquivo';
export * from './header-lote';
export * from './segmento-t';
export * from './segmento-t-padrao-v033';
export * from './segmento-u';
export * from './segmento-u-padrao-v033';
export * from './segmento-u-sitcs';
export * from './segmento-y';
export * from './trailer-arquivo';
export * from './trailer-lote';
