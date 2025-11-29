import { readFileSync } from 'node:fs';
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
 * Usa fetch nativo do Node.js 18+ (sem dependências externas)
 */
export class ApiClient {
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly userAgent: string;

  constructor(config: ApiClientConfig) {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.userAgent = makeUserAgent();
  }

  /**
   * Headers padrão para todas as requisições
   */
  private getDefaultHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'User-Agent': this.userAgent,
    };
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
        method: 'POST',
        headers: {
          ...this.getDefaultHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const statusCode = response.status;
      let responseData: unknown;

      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
      } catch {
        // Se não conseguir ler o corpo, continua
        responseData = null;
      }

      if (statusCode >= 200 && statusCode < 300) {
        return {
          success: true,
          statusCode,
          message: `Hash enviado com sucesso para ${this.endpoint}`,
        };
      }

      const errorMessage = responseData
        ? `Falha ao enviar hash. Status: ${statusCode}. Resposta: ${JSON.stringify(responseData)}`
        : `Falha ao enviar hash. Status: ${statusCode}`;

      return {
        success: false,
        statusCode,
        message: errorMessage,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido na requisição';

      return {
        success: false,
        message: `Erro na requisição de rede para ${this.endpoint}: ${errorMessage}`,
      };
    }
  }

  /**
   * Envia arquivos usando multipart/form-data
   *
   * @param files - Array de arquivos com seus hashes
   * @returns Promise com o resultado do envio
   */
  async uploadFiles(files: Array<{ filePath: string; hashResult: HashResult }>): Promise<ApiResponse> {
    const metadata = files.map(file => ({
      fileName: file.hashResult.fileName,
      fileHash: file.hashResult.fileHash,
      timestamp: new Date().toISOString(),
    }));

    try {
      // Usa FormData nativo do Node.js 18+
      const formData = new FormData();

      // Adiciona os arquivos
      for (const { filePath, hashResult } of files) {
        const fileBuffer = readFileSync(filePath);
        const blob = new Blob([fileBuffer]);
        formData.append('files', blob, hashResult.fileName);
      }

      // Adiciona metadata
      formData.append('metadata', JSON.stringify(metadata));

      const uploadUrl = `${this.endpoint}/watcher-extraction/upload`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          ...this.getDefaultHeaders(),
          // Não definir Content-Type - fetch define automaticamente com boundary
        },
        body: formData,
      });

      const statusCode = response.status;
      let responseData: unknown;

      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
      } catch {
        responseData = null;
      }

      if (statusCode >= 200 && statusCode < 300) {
        return {
          success: true,
          statusCode,
          message: `Arquivo enviado com sucesso para ${uploadUrl}`,
        };
      }

      const responseMessage = responseData
        ? `Envio falhou. Status: ${statusCode}. Resposta: ${JSON.stringify(responseData)}`
        : `Envio falhou. Status: ${statusCode}`;

      return {
        success: false,
        statusCode,
        message: responseMessage,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no upload';

      return {
        success: false,
        message: `Erro no upload para ${this.endpoint}: ${errorMessage}`,
      };
    }
  }
}
