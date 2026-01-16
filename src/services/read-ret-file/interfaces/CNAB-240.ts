import { CommonHeader, CommonLine } from './common';

export type LineCNAB240 = CommonLine & {
  payload: Record<string, unknown> | null; // falta tipagem
};

/**
 * Header do arquivo CNAB 240
 * Baseado na especificação FEBRABAN - Layout de Arquivo Retorno
 */
export type HeaderCNAB240 = CommonHeader & {
  // Lote de serviço (posição 3-6)
  lotCode: string;
  // Forma de lançamento (posição 11-12)
  entryForm: string;
  // Versão do layout (posição 13-15)
  layoutVersion: string;
  // Empresa - Inscrição (posição 18-32)
  companyRegistration: string;
  // Empresa - Tipo de inscrição (posição 17-17)
  companyRegistrationType: string;
  // Hora de geração (posição 151-156) - formato HHMMSS
  generationTime: string;
  // Densidade de gravação (posição 164-166)
  recordDensity: string;
  // Código do arquivo (posição 163-166) - 030 ou 040
  fileCode: string;
};

export type CNAB240 = {
  header: HeaderCNAB240;
  lines: LineCNAB240[];
};
