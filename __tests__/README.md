# Testes da Aplicação

Este diretório contém os testes unitários da aplicação utilizando Jest.

## Estrutura

Os testes estão organizados na pasta `__tests__/` na raiz do projeto (padrão do Jest), mantendo uma estrutura similar ao código fonte:

```text
__tests__/
  utils/
    number.test.ts       # Testes para normalizeNumber
    directory.test.ts    # Testes para ensureDirectory e ensureDirectories
```

## Executando os Testes

### Executar todos os testes

`npm run test`

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
import { minhaFuncao } from '../../src/utils/meu-modulo';

describe('minhaFuncao', () => {
  it('deve fazer algo esperado', () => {
    const result = minhaFuncao('input');
    expect(result).toBe('expected');
  });
});
```

## Padrões de Teste

- Use `describe` para agrupar testes relacionados
- Use `it` ou `test` para casos de teste individuais
- Use `beforeEach` e `afterEach` para setup e cleanup
- Use `beforeAll` e `afterAll` para setup/cleanup que ocorre apenas uma vez
- Limpe recursos (arquivos, diretórios temporários) após os testes

## Exemplos

Veja os arquivos de teste existentes para exemplos:

- `utils/number.test.ts` - Testes simples de funções utilitárias
- `utils/directory.test.ts` - Testes que envolvem operações de sistema de arquivos
