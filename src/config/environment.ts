// validação das variáveis de ambiente
import { z } from 'zod';
import { normalizeNumber } from '../utils/number';

const environmentSchema = z.object({
  WATCH_DIR: z.string().min(1, 'WATCH_DIR não pode estar vazio'),
  API_ENDPOINT: z.url('API_ENDPOINT deve ser uma URL válida'),
  API_KEY: z.string().min(1, 'API_KEY não pode estar vazio'),
  LOG_DIR: z.string().min(1, 'LOG_DIR não pode estar vazio'),
  CACHE_DIR: z.string().optional(),
  FILE_EXTENSION_FILTER: z.string().optional(),
  QUEUE_CONCURRENCY: z
    .string()
    .optional()
    .transform(val => normalizeNumber(val, 3))
    .pipe(z.number().int().min(1).max(20)),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional().default('info'),
  // Auto-update configurações
  AUTO_UPDATE_ENABLED: z
    .string()
    .optional()
    .default('false')
    .transform(val => val === 'true' || val === '1' || val === 'yes'),
  AUTO_UPDATE_CHECK_INTERVAL_HOURS: z
    .string()
    .optional()
    .transform(val => normalizeNumber(val, 24))
    .pipe(z.number().int().min(1).max(168)), // Máximo 1 semana
  AUTO_UPDATE_REPOSITORY: z.string().optional().default('healthdevio/art-file-watcher'),
  AUTO_UPDATE_SERVICE_NAME: z.string().optional().default('art-file-watcher'), // Nome do serviço systemd/Windows Service
});

export type Environment = z.infer<typeof environmentSchema>;

/**
 * Valida e retorna as variáveis de ambiente.
 * Lança um erro com mensagem detalhada se a validação falhar.
 *
 * @returns Objeto com as variáveis de ambiente validadas
 * @throws Error se a validação falhar
 */
function validateEnvironment(): Environment {
  try {
    return environmentSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(issue => {
        const path = issue.path.join('.');
        return `  - ${path}: ${issue.message}`;
      });

      const errorMessage = `
[ERROR] Variáveis de ambiente inválidas ou ausentes:

${missingVars.join('\n')}

Por favor, verifique o arquivo .env na raiz do projeto e configure:
  WATCH_DIR=<diretório a ser monitorado>
  API_ENDPOINT=<URL do endpoint da API>
  API_KEY=<chave de autenticação da API>
  LOG_DIR=<diretório para armazenar logs>
  FILE_EXTENSION_FILTER=<extensões separadas por vírgula, ex: .txt,.log> (opcional)
  CACHE_DIR=<diretório para armazenar o cache> (opcional)
  QUEUE_CONCURRENCY=<número de uploads simultâneos, padrão: 3> (opcional)
  LOG_LEVEL=<nível de log: debug|info|warn|error, padrão: info> (opcional)
  AUTO_UPDATE_ENABLED=<habilitar auto-update: true|false, padrão: false> (opcional)
  AUTO_UPDATE_CHECK_INTERVAL_HOURS=<intervalo de verificação em horas, padrão: 24> (opcional)
  AUTO_UPDATE_REPOSITORY=<repositório GitHub owner/repo, padrão: healthdevio/art-file-watcher> (opcional)
  AUTO_UPDATE_SERVICE_NAME=<nome do serviço systemd/Windows Service> (opcional)
      `.trim();

      console.error(errorMessage);
      throw new Error('Falha na validação das variáveis de ambiente');
    }

    throw error;
  }
}

const environment = validateEnvironment();

export { environment };
