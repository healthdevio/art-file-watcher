import { CNAB240 } from './interfaces/CNAB-240';
import { CNAB400 } from './interfaces/CNAB-400';

/**
 * Tipo union para resultados CNAB
 */
export type CNABResult = CNAB240 | CNAB400;

/**
 * Tipo detectado do arquivo CNAB
 */
export type CNABType = 'CNAB240_30' | 'CNAB240_40' | 'CNAB400' | 'UNKNOWN';

/**
 * Resultado da leitura de um arquivo de retorno
 */
export interface ReadResult {
  success: boolean;
  filePath: string;
  cnabType: CNABType;
  data?: CNABResult;
  error?: string;
  metadata?: {
    lineCount?: number;
    fileSize?: number;
  };
}
