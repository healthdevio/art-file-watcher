import { existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

/**
 * Configuração centralizada e simplificada para todos os testes
 * Compatível com GitHub Actions e ambientes locais
 */

// Usa caminho relativo para compatibilidade máxima
const TEST_BASE_DIR = resolve(join(process.cwd(), 'volumes', '.test-temp'));

// Exporta diretórios de teste (caminhos absolutos)
export const TEST_DIRS = {
  BASE: TEST_BASE_DIR,
  CACHE: join(TEST_BASE_DIR, 'cache'),
  LOGS: join(TEST_BASE_DIR, 'logs'),
  WATCH: join(TEST_BASE_DIR, 'watch'),
} as const;

/**
 * Configura todas as variáveis de ambiente necessárias
 * Usa caminhos relativos para compatibilidade com CI/CD
 */
function setupEnvironment(): void {
  // Configura variáveis obrigatórias (caminhos relativos)
  process.env.WATCH_DIR = 'volumes/.test-temp/watch';
  process.env.API_ENDPOINT = 'http://localhost:3000/api';
  process.env.API_KEY = 'test-api-key-for-jest';
  process.env.LOG_DIR = 'volumes/.test-temp/logs';

  // Variáveis opcionais
  process.env.CACHE_DIR = 'volumes/.test-temp/cache';
  process.env.QUEUE_CONCURRENCY = '3';
  process.env.LOG_LEVEL = 'error'; // Reduz verbosidade durante testes
}

/**
 * Cria diretórios de teste se não existirem
 * Não remove diretórios existentes - apenas cria se necessário
 */
function ensureTestDirectories(): void {
  const dirs = [TEST_DIRS.BASE, TEST_DIRS.CACHE, TEST_DIRS.LOGS, TEST_DIRS.WATCH];

  for (const dir of dirs) {
    if (!existsSync(dir)) {
      try {
        mkdirSync(dir, { recursive: true });
      } catch (error) {
        // Ignora erros de criação - podem já existir
      }
    }
  }
}

// Executa setup imediatamente quando o módulo é carregado
setupEnvironment();
ensureTestDirectories();

/**
 * Função helper para resetar diretórios específicos
 * Útil para testes que precisam de estado limpo
 */
export function cleanTestDirectory(dirPath: string): void {
  // Não faz nada - os testes devem limpar seus próprios arquivos se necessário
  // Esta função existe para compatibilidade, mas preferimos não limpar automaticamente
  // para evitar problemas com arquivos em uso
}
