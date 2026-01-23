export type CommonLine<TPayload = Record<string, unknown>> = {
  number: number;
  line: string;
  payload: TPayload | null;
};

/**
 * Header comum entre layouts CNAB 240 e CNAB 400.
 * Contém propriedades presentes em ambos os layouts.
 */
export type CommonHeader = {
  /** Tipo do arquivo (CNAB240 ou CNAB400) */
  fileType: string;
  /** Tipo de registro (posição 0-1 CNAB400, 7-7 CNAB240) */
  recordType: string;
  /** Tipo de operação (posição 2-2 CNAB400, 8-8 CNAB240) */
  operationType: string;
  /** Tipo de serviço (RETORNO, etc.) */
  serviceType: string;
  /** Código do banco */
  bankCode: string;
  /** Nome do banco */
  bankName: string;
  /** Nome da empresa */
  companyName: string;
  /** Data de geração do arquivo */
  generationDate: string;
  /** Número sequencial do arquivo */
  fileSequence: string;
};

/**
 * Campos comuns de identificação de conta bancária
 * Presente em linhas de detalhe de ambos os layouts
 */
export type CommonAccountFields = {
  /** Agência */
  agency: string | null;
  /** Dígito da agência */
  agencyDigit: string;
  /** Conta */
  account: string | null;
  /** Dígito da conta */
  accountDigit: string;
};

/**
 * Campos comuns de identificação de título (nosso número)
 * Presente em linhas de detalhe de ambos os layouts
 */
export type CommonRegionalNumberFields = {
  /** Nosso número */
  regionalNumber: string;
  /** Dígito do nosso número */
  regionalNumberDigit: string;
};

/**
 * Campos comuns de convênio
 * Presente em linhas de detalhe de ambos os layouts
 */
export type CommonAgreementFields = {
  /** Código do convênio */
  agreement: string;
};

/**
 * Campos comuns de datas de pagamento e crédito
 * Presente em linhas de detalhe de ambos os layouts
 */
export type CommonPaymentDateFields = {
  /** Data do pagamento */
  paymentDate: string;
  /** Data do crédito */
  creditDate: string;
};

/**
 * Campos comuns de tarifa
 * Presente em algumas linhas de detalhe
 */
export type CommonTariffFields = {
  /** Tarifa */
  tariff: number;
};

/**
 * Campos comuns de valores monetários
 * Presente em linhas de detalhe de ambos os layouts
 */
export type CommonMonetaryFields = CommonTariffFields & {
  /** Valor recebido/pago */
  receivedValue: number;
};

/**
 * Campos comuns de sequência/controle
 * Presente em várias linhas de ambos os layouts
 */
export type CommonSequenceFields = {
  /** Número sequencial do registro */
  sequenceNumber: string;
};

/**
 * Campos comuns de identificação básica de registro
 * Presente em todas as linhas de ambos os layouts
 */
export type CommonRecordFields = {
  /** Tipo de registro */
  recordType: string;
};

/**
 * Campos comuns de identificação de banco
 * Presente em várias linhas de ambos os layouts
 */
export type CommonBankFields = {
  /** Código do banco */
  bankCode: string;
};

/**
 * Campos comuns de identificação de empresa
 * Presente em headers de ambos os layouts
 */
export type CommonCompanyFields = {
  /** Nome da empresa */
  companyName: string;
};

/**
 * Campos comuns de operação/serviço
 * Presente em headers de ambos os layouts
 */
export type CommonOperationFields = {
  /** Tipo de operação */
  operationType: string;
  /** Tipo de serviço */
  serviceType: string;
};

/**
 * Campos comuns de data/hora de geração
 * Presente em headers de ambos os layouts
 */
export type CommonGenerationFields = {
  /** Data de geração do arquivo */
  generationDate: string;
};
