export type CommonLine = {
  number: number;
  line: string;
};

/**
 * Header comum entre layouts CNAB 240 e CNAB 400
 * Contém propriedades presentes em ambos os layouts
 */
export type CommonHeader = {
  // Tipo do arquivo (CNAB240 ou CNAB400)
  fileType: string;
  // Tipo de registro (posição 0-1 CNAB400, 7-7 CNAB240)
  recordType: string;
  // Tipo de operação (posição 2-2 CNAB400, 8-8 CNAB240)
  operationType: string;
  // Tipo de serviço (RETORNO, etc.)
  serviceType: string;
  // Código do banco
  bankCode: string;
  // Nome do banco
  bankName: string;
  // Nome da empresa
  companyName: string;
  // Data de geração do arquivo
  generationDate: string;
  // Número sequencial do arquivo
  fileSequence: string;
  // Campo reservado
  reserved: string;
};
