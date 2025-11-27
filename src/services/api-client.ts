import axios, { AxiosError, AxiosInstance } from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'node:fs';
import { makeUserAgent } from '../utils/system';
import { HashResult } from './file-hash';

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
  private readonly api: AxiosInstance;
  private readonly endpoint: string;
  private readonly apiKey: string;

  constructor(config: ApiClientConfig) {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;

    this.api = axios.create({
      baseURL: this.endpoint,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'User-Agent': makeUserAgent(),
      },
    });
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
      const response = await this.api.post(this.endpoint, payload, {
        validateStatus: () => true,
      });

      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          statusCode: response.status,
          message: `Hash enviado com sucesso para ${this.endpoint}`,
        };
      }

      const errorMessage = response.data
        ? `Falha ao enviar hash. Status: ${response.status}. Resposta: ${JSON.stringify(response.data)}`
        : `Falha ao enviar hash. Status: ${response.status}`;

      return {
        success: false,
        statusCode: response.status,
        message: errorMessage,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        axiosError instanceof Error && axiosError.message ? axiosError.message : 'Erro desconhecido na requisição';

      return {
        success: false,
        message: `Erro na requisição de rede para ${this.endpoint}: ${errorMessage}`,
      };
    }
  }

  async uploadFiles(files: Array<{ filePath: string; hashResult: HashResult }>): Promise<ApiResponse> {
    const metadata = files.map(file => ({
      fileName: file.hashResult.fileName,
      fileHash: file.hashResult.fileHash,
      timestamp: new Date().toISOString(),
    }));
    const formData = new FormData();
    files.forEach(({ filePath, hashResult }) => {
      formData.append('files', createReadStream(filePath), {
        filename: hashResult.fileName,
      });
    });
    formData.append('metadata', JSON.stringify(metadata));

    const response = await this.api.post('watcher-extraction/upload', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      validateStatus: () => true,
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        statusCode: response.status,
        message: `Arquivo enviado com sucesso para ${this.endpoint}/watcher-extraction/upload`,
      };
    }

    const responseMessage = response.data
      ? `Envio falhou. Status: ${response.status}. Resposta: ${JSON.stringify(response.data)}`
      : `Envio falhou. Status: ${response.status}`;

    return {
      success: false,
      statusCode: response.status,
      message: responseMessage,
    };
  }
}
