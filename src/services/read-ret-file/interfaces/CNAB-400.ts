import {
  CommonAccountFields,
  CommonAgreementFields,
  CommonHeader,
  CommonLine,
  CommonMonetaryFields,
  CommonPaymentDateFields,
  CommonRecordFields,
  CommonRegionalNumberFields,
  CommonSequenceFields,
} from './common';

/**
 * Linha de detalhe CNAB 400 (tipo de registro 7)
 */
export type DetalheCNAB400 = CommonRecordFields &
  CommonAccountFields &
  CommonAgreementFields &
  CommonRegionalNumberFields &
  CommonPaymentDateFields &
  CommonMonetaryFields &
  CommonSequenceFields & {
    /** Código de movimentação (posição 108-110) */
    movementCode: string;
  };

/**
 * Trailer do arquivo CNAB 400 (tipo de registro 9)
 */
export type TrailerArquivoCNAB400 = CommonRecordFields & {
  /** Total de registros no arquivo */
  totalRecords: number;
};

/**
 * Union type de todos os payloads possíveis para linhas CNAB 400
 */
export type LineCNAB400Payload = DetalheCNAB400 | TrailerArquivoCNAB400;

export type LineCNAB400 = CommonLine<LineCNAB400Payload>;

/**
 * Header do arquivo CNAB 400
 * Baseado na especificação FEBRABAN - Layout de Arquivo Retorno
 */
export type HeaderCNAB400 = CommonHeader & {
  // Identificação do tipo de serviço (posição 9-10)
  serviceId: string;
  // Código da empresa (posição 76-94)
  companyCode: string;
  sequencial: string;
};

export type CNAB400 = {
  header: HeaderCNAB400;
  lines: LineCNAB400[];
};
