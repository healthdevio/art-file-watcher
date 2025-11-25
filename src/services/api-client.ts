import { HashResult } from "./file-hash";

/**
 * Configuração do cliente de API
 */
export interface ApiClientConfig {
  endpoint: string;
  apiKey: string;
}

/**
 * Payload enviado para a API
 */
export interface HashPayload {
  fileName: string;
  fileHash: string;
  timestamp: string;
}

/**
 * Resultado do envio para a API
 */
export interface ApiResponse {
  success: boolean;
  statusCode?: number;
  message: string;
}

/**
 * Cliente para comunicação com a API de envio de hashes
 */
export class ApiClient {
  private readonly endpoint: string;
  private readonly apiKey: string;

  constructor(config: ApiClientConfig) {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
  }

  /**
   * Envia um hash de arquivo para o endpoint configurado
   *
   * @param hashResult - Resultado da geração de hash
   * @returns Promise com o resultado do envio
   */
  async sendHash(hashResult: HashResult): Promise<ApiResponse> {
    const payload: HashPayload = {
      fileName: hashResult.fileName,
      fileHash: hashResult.fileHash,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return {
          success: true,
          statusCode: response.status,
          message: `Hash enviado com sucesso para ${this.endpoint}`,
        };
      }

      // Tenta ler a resposta de erro
      let errorMessage = `Falha ao enviar hash. Status: ${response.status}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage += `. Resposta: ${errorText}`;
        }
      } catch {
        // Ignora erros ao ler a resposta
      }

      return {
        success: false,
        statusCode: response.status,
        message: errorMessage,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido na requisição";

      return {
        success: false,
        message: `Erro na requisição de rede para ${this.endpoint}: ${errorMessage}`,
      };
    }
  }
}

