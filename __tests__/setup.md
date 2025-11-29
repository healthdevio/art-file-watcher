# Configuração Centralizada de Testes

Este arquivo documenta a configuração centralizada para todos os testes da aplicação.

## Arquivo de Setup

O arquivo `__tests__/setup.ts` é executado automaticamente antes de cada suite de testes (via `setupFilesAfterEnv` no `jest.config.js`).

## Funcionalidades

### 1. Configuração de Variáveis de Ambiente

Todas as variáveis de ambiente necessárias são configuradas automaticamente:

```typescript
process.env.WATCH_DIR = TEST_DIRS.WATCH;
process.env.API_ENDPOINT = 'http://localhost:3000/api';
process.env.API_KEY = 'test-api-key-for-jest';
process.env.LOG_DIR = TEST_DIRS.LOGS;
process.env.CACHE_DIR = TEST_DIRS.CACHE;
process.env.QUEUE_CONCURRENCY = '3';
process.env.LOG_LEVEL = 'error';
```

### 2. Criação de Diretórios

Os seguintes diretórios são criados automaticamente em `volumes/.test-temp/`:

- `cache/` - Para testes de cache
- `logs/` - Para testes de logger
- `watch/` - Para testes de file watcher

### 3. Exportações Úteis

#### `TEST_DIRS`

Objeto com os caminhos absolutos dos diretórios de teste:

```typescript
import { TEST_DIRS } from '../setup';

TEST_DIRS.BASE; // volumes/.test-temp/
TEST_DIRS.CACHE; // volumes/.test-temp/cache
TEST_DIRS.LOGS; // volumes/.test-temp/logs
TEST_DIRS.WATCH; // volumes/.test-temp/watch
```

#### `resetTestDirectories()`

Função para limpar e recriar os diretórios de teste:

```typescript
import { resetTestDirectories } from '../setup';

beforeEach(() => {
  resetTestDirectories(); // Limpa e recria os diretórios
});
```

## Compatibilidade com CI/CD

Esta configuração garante que os testes funcionem corretamente em:

- ✅ Ambiente local de desenvolvimento
- ✅ GitHub Actions (CI/CD)
- ✅ Qualquer ambiente que execute os testes

Os diretórios são criados relativos ao diretório do projeto, garantindo portabilidade.

## Notas Importantes

1. **Isolamento**: Cada teste suite deve limpar seus próprios arquivos temporários quando necessário
2. **Diretório Base**: Todos os arquivos temporários são criados em `volumes/.test-temp/`
3. **Gitignore**: O diretório `volumes/.test-temp/` já está configurado para ser ignorado pelo Git
4. **Variáveis de Ambiente**: Não é necessário configurar variáveis de ambiente manualmente - o setup.ts faz isso automaticamente
