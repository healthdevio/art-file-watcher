import { CommonHeader, CommonLine } from './common';

export type LineCNAB400 = CommonLine & {
  payload: Record<string, unknown> | null; // falta tipagem
};

/**
 * Header do arquivo CNAB 400
 * Baseado na especificação FEBRABAN - Layout de Arquivo Retorno
 */
export type HeaderCNAB400 = CommonHeader & {
  // Identificação do tipo de serviço (posição 9-10)
  serviceId: string;
  // Código da empresa (posição 76-94)
  companyCode: string;
};

export type CNAB400 = {
  header: HeaderCNAB400;
  lines: LineCNAB400[];
};
