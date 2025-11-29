# Testes da Aplicação

Este diretório contém os testes unitários da aplicação utilizando Jest.

## Estrutura

Os testes estão organizados na pasta `__tests__/` na raiz do projeto (padrão do Jest), mantendo uma estrutura similar ao código fonte:

```text
__tests__/
  setup.ts               # Configuração centralizada para todos os testes
  utils/
    number.test.ts       # Testes para normalizeNumber
    directory.test.ts    # Testes para ensureDirectory e ensureDirectories
    cache.test.ts        # Testes para readCache e writeCache
    logger.test.ts       # Testes para initLogger, getLogger e safeLogger
    promises.test.ts     # Testes para wait e schedule
    system.test.ts       # Testes para makeUserAgent
```

## Configuração Centralizada

Os testes utilizam uma configuração centralizada em `__tests__/setup.ts` que:

- **Configura automaticamente** todas as variáveis de ambiente necessárias
- **Cria os diretórios** de teste em `volumes/.test-temp/`
- **Garante compatibilidade** com CI/CD no GitHub Actions

### Variáveis de Ambiente Configuradas

Todas as variáveis de ambiente necessárias são definidas automaticamente:

- `WATCH_DIR` → `volumes/.test-temp/watch`
- `API_ENDPOINT` → `http://localhost:3000/api`
- `API_KEY` → `test-api-key-for-jest`
- `LOG_DIR` → `volumes/.test-temp/logs`
- `CACHE_DIR` → `volumes/.test-temp/cache`
- `QUEUE_CONCURRENCY` → `3`
- `LOG_LEVEL` → `error` (apenas erros nos logs durante testes)

### Características da Configuração

- ✅ **Caminhos relativos**: Todos os caminhos são relativos ao `process.cwd()` para compatibilidade com CI/CD
- ✅ **Não interfere**: O setup apenas cria diretórios se não existirem, nunca remove
- ✅ **Isolamento**: Cada teste é responsável por limpar seus próprios arquivos temporários
- ✅ **GitHub Actions**: Totalmente compatível com ambientes de CI/CD

## Executando os Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes em modo watch (re-executa ao salvar arquivos)

```bash
npm run test:watch
```

### Executar testes com cobertura de código

```bash
npm run test:coverage
```

## Escrevendo Novos Testes

1. Crie um arquivo de teste na pasta `__tests__/` mantendo a estrutura do código fonte:
   - Exemplo: `__tests__/utils/meu-modulo.test.ts` para testar `src/utils/meu-modulo.ts`
   - Exemplo: `__tests__/services/api-client.test.ts` para testar `src/services/api-client.ts`

2. Nomeie os arquivos com sufixo `.test.ts` ou `.spec.ts`

3. Estrutura básica de um teste:

```typescript
import { TEST_DIRS } from '../setup';
import { minhaFuncao } from '../../src/utils/meu-modulo';

describe('minhaFuncao', () => {
  beforeEach(() => {
    // Limpeza necessária antes de cada teste
    // IMPORTANTE: Cada teste deve ser autônomo e limpar seus próprios arquivos
  });

  it('deve fazer algo esperado', () => {
    const result = minhaFuncao('input');
    expect(result).toBe('expected');
  });
});
```

## Padrões de Teste

- ✅ **Testes autônomos**: Cada teste deve funcionar independentemente
- ✅ **Limpeza manual**: Cada teste limpa seus próprios arquivos temporários
- ✅ **Isolamento**: Use `jest.resetModules()` se necessário para isolamento de módulos
- ✅ **Fake timers**: Configure `jest.useFakeTimers()` em `beforeEach` quando testar funções assíncronas com timers
- ✅ **Diretórios de teste**: Use `TEST_DIRS` do setup para caminhos consistentes

## Compatibilidade com GitHub Actions

Os testes foram projetados para funcionar perfeitamente no GitHub Actions:

- ✅ Usa caminhos relativos compatíveis com qualquer sistema operacional
- ✅ Não depende de permissões especiais do sistema
- ✅ Não interfere com outros processos ou arquivos
- ✅ Configuração automática de variáveis de ambiente

Para configurar no GitHub Actions, basta adicionar:

```yaml
- name: Executar testes
  run: npm test
```

Os testes configuram tudo automaticamente!

## Exemplos

Veja os arquivos de teste existentes para exemplos:

- `utils/number.test.ts` - Testes simples de funções utilitárias
- `utils/directory.test.ts` - Testes que envolvem operações de sistema de arquivos
- `utils/cache.test.ts` - Testes com arquivos e diretórios dinâmicos
- `utils/logger.test.ts` - Testes com módulos singleton e isolamento
- `utils/promises.test.ts` - Testes com fake timers e funções assíncronas
