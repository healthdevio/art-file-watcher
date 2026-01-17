import {
  CommonAccountFields,
  CommonAgreementFields,
  CommonBankFields,
  CommonCompanyFields,
  CommonGenerationFields,
  CommonHeader,
  CommonLine,
  CommonMonetaryFields,
  CommonOperationFields,
  CommonPaymentDateFields,
  CommonRecordFields,
  CommonRegionalNumberFields,
  CommonSequenceFields,
  CommonTariffFields,
} from './common';

/**
 * Header do lote CNAB 240 (tipo de registro 1)
 */
export type HeaderLoteCNAB240 = CommonRecordFields &
  CommonBankFields &
  CommonOperationFields &
  CommonCompanyFields &
  CommonGenerationFields & {
    /** Código do lote */
    lotCode: string;
    /** Forma de lançamento */
    entryForm: string;
    /** Versão do layout */
    layoutVersion: string;
    /** Tipo de inscrição da empresa */
    companyRegistrationType: string;
    /** Inscrição da empresa */
    companyRegistration: string;
    /** Mensagem da empresa */
    companyMessage: string;
    /** Nome do banco */
    bankName: string;
    /** Hora de geração (HHMMSS) */
    generationTime: string;
  };

/**
 * Segmento T - Dados do título (tipo 3, segmento T)
 */
export type SegmentoT = CommonRecordFields &
  CommonBankFields &
  CommonSequenceFields &
  CommonAccountFields &
  CommonAgreementFields &
  CommonRegionalNumberFields &
  CommonTariffFields & {
    /** Tipo de segmento (T) */
    segmentType: string;
    /** Código do lote */
    lotCode: string;
    /** Código de movimento */
    movementCode: string;
    /** Número do título */
    titleNumber: string;
    /** Carteira/Portfólio */
    titlePortfolio: string;
    /** Tipo de título */
    titleType: string;
    /** Código de juros */
    interestCode: string;
  };

/**
 * Segmento U - Dados do pagamento (tipo 3, segmento U)
 */
export type SegmentoU = CommonRecordFields &
  CommonBankFields &
  CommonSequenceFields &
  CommonPaymentDateFields &
  Pick<CommonMonetaryFields, 'receivedValue'> & {
    /** Tipo de segmento (U) */
    segmentType: string;
    /** Código do lote */
    lotCode: string;
    /** Juros/multa/encargos recebidos */
    accruedInterest: number;
    /** Valor do desconto concedido */
    discountAmount: number;
    /** Valor do abatimento concedido */
    dischargeAmount: number;
    /** Valor do título (valor líquido creditado) */
    paidAmount: number;
    /** Outras despesas */
    otherExpenses: number;
    /** Outros créditos */
    otherCredits: number;
    /** Código da ocorrência */
    occurrenceCode: string;
  };

/**
 * Segmento Y - Dados adicionais / Alegações do Sacado (tipo 3, segmento Y - opcional)
 */
export type SegmentoY = CommonRecordFields &
  CommonBankFields &
  CommonSequenceFields & {
    /** Tipo de segmento (Y) */
    segmentType: string;
    /** Código do lote */
    lotCode: string;
    /** Código de movimento */
    movementCode: string;
    /** Identificação do registro opcional (ex: 01, 02, 03, etc.) */
    optionalRecordId: string;
    /** Tipo de inscrição do sacado (1 = CPF, 2 = CNPJ) */
    payerRegistrationType: string;
    /** Número de inscrição do sacado (CPF ou CNPJ) */
    payerRegistration: string;
    /** Nome do sacado */
    payerName: string;
    /** Endereço do sacado */
    payerAddress: string;
    /** Bairro do sacado */
    payerDistrict: string;
    /** CEP do sacado (5 dígitos) */
    payerZipCode: string;
    /** Sufixo do CEP (3 dígitos) */
    payerZipCodeSuffix: string;
    /** Cidade do sacado */
    payerCity: string;
    /** Unidade da Federação (UF) do sacado */
    payerState: string;
  };

/**
 * Trailer do lote CNAB 240 (tipo de registro 5)
 */
export type TrailerLoteCNAB240 = CommonRecordFields &
  CommonBankFields &
  CommonSequenceFields & {
    /** Código do lote */
    lotCode: string;
    /** Quantidade de registros no lote */
    totalLines: number;
    /** Quantidade de títulos em cobrança */
    totalTitles: number;
    /** Valor total dos títulos em cobrança */
    totalValue: number;
  };

/**
 * Trailer do arquivo CNAB 240 (tipo de registro 9)
 */
export type TrailerArquivoCNAB240 = CommonRecordFields &
  CommonBankFields & {
    /** Quantidade de lotes no arquivo */
    totalLots: number;
    /** Quantidade de registros no arquivo */
    totalLines: number;
  };

/**
 * Union type de todos os payloads possíveis para linhas CNAB 240
 */
export type LineCNAB240Payload =
  | HeaderLoteCNAB240
  | SegmentoT
  | SegmentoU
  | SegmentoY
  | TrailerLoteCNAB240
  | TrailerArquivoCNAB240;

export type LineCNAB240 = CommonLine<LineCNAB240Payload>;

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
