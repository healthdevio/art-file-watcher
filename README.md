# art-file-watcher

[![Tests](https://github.com/healthdevio/art-file-watcher/actions/workflows/test.yml/badge.svg)](https://github.com/healthdevio/art-file-watcher/actions/workflows/test.yml)
[![Build and Release Binaries](https://github.com/healthdevio/art-file-watcher/actions/workflows/release.yml/badge.svg)](https://github.com/healthdevio/art-file-watcher/actions/workflows/release.yml)

Monitor de arquivos de retorno de convênios ART.
O Objetivo dessa aplicação é monitorar o diretório de entrada de arquivos de retorno de convênios ART e enviar os arquivos para o endpoint da API.

## Como funciona?

A Aplicação monitora um diretório de entrada que deve ser configurado em uma variável de ambiente `WATCH_DIR`.
A cada arquivo adiciona ou alterado no diretório de entrada, a aplicação gera um hash do arquivo e envia para o endpoint da API. O Endpoint da API deve ser configurado em uma variável de ambiente `API_ENDPOINT`.
Após o envio com sucesso do arquivo, a aplicação salva o hash do arquivo em um diretório de cache, que também pode ser configurado em uma variável de ambiente `CACHE_DIR`.

Para forçar o reenvio dos arquivos, basta deletar os arquivos do diretório de cache.

O Endpoint que recebe o arquivo é do projeto backend `modulo-prestacao-de-art-backend`, que por sua vez começa a processar o arquivo imediatamente.

No momento atual o endpoint que recebe o arquivo de retorno é:

**HMG:**

- POST: `https://gestao-art-hmg-back.mutua.com.br/watcher-extraction/upload`

**PROD**:

- POST: `https://gestao-art-back.mutua.com.br/watcher-extraction/upload`

### Variáveis de Ambiente Necessárias

- `WATCH_DIR`: Diretório a ser monitorado.
- `API_ENDPOINT`: Endpoint da API.
- `API_KEY`: Chave de autenticação da API.
- `LOG_DIR`: Diretório de logs.
- `CACHE_DIR`: Diretório de cache (opcional).
- `QUEUE_CONCURRENCY`: Número de uploads simultâneos (opcional, padrão: 3).
- `LOG_LEVEL`: Nível de log para console - `debug`, `info`, `warn` ou `error` (opcional, padrão: `info`).
- `WATCH_POLLING_ENABLED`: Habilita modo polling para monitoramento de arquivos (opcional, padrão: `false`). Veja [Configuração de Polling](#configuração-de-polling) abaixo.
- `WATCH_POLLING_INTERVAL_MS`: Intervalo de polling em milissegundos (opcional, padrão: `2000`, mínimo: `500`, máximo: `60000`). Apenas usado quando `WATCH_POLLING_ENABLED=true`.
- `AUTO_UPDATE_ENABLED`: Habilita auto-update automático (opcional, padrão: `false`). Ver [documentação completa](./docs/AUTO_UPDATE.md).

### Configuração de Polling

Por padrão, a aplicação usa eventos do sistema de arquivos (inotify no Linux, FSEvents no macOS, ReadDirectoryChangesW no Windows) para monitorar mudanças, oferecendo melhor performance e menor uso de recursos.

O modo polling pode ser habilitado quando:

- O sistema de arquivos não suporta eventos nativos adequadamente
- Monitoramento de compartilhamentos de rede (Samba, NFS, etc.)
- Sistemas de arquivos remotos ou virtuais

**⚠️ Atenção:** O modo polling verifica periodicamente o diretório, o que pode ter impacto significativo em performance em diretórios com milhares de arquivos. Use apenas quando necessário.

**Configuração recomendada para diretórios grandes:**

- Mantenha `WATCH_POLLING_INTERVAL_MS` ≥ 2000ms (padrão) para reduzir carga de CPU/IO
- Valores menores (500-1000ms) podem ser usados em diretórios pequenos, mas aumentam o uso de recursos

**Exemplo de configuração:**

```env
WATCH_POLLING_ENABLED=true
WATCH_POLLING_INTERVAL_MS=2000
```

### Regras de comportamento

- Fila de uploads: [docs/QUEUE.md](./docs/QUEUE.md)

## Instalação

A aplicação funciona no modo standalone, ou seja, não precisa ser instalado como um serviço. Porém para garantir que a aplicação rode de forma contínua, com alta disponibilidade e que inicie automaticamente após qualquer reinicialização do servidor Linux, é **recomendado instalar** como um serviço.

- Instalação no Windows: [Guia de Teste no Windows](./docs/WINDOWS.md)
- Instalação no Linux: [Guia de Instalação no Linux](./docs/LINUX.md)

### Auto-Update

A aplicação possui um sistema de auto-update que verifica e instala automaticamente novas versões do GitHub Releases. Para mais informações, consulte a [documentação completa do Auto-Update](./docs/AUTO_UPDATE.md).

**Configuração rápida:**

```env
AUTO_UPDATE_ENABLED=true
AUTO_UPDATE_SERVICE_NAME=art-file-watcher  # Nome do serviço (opcional)
```

---

## Para Desenvolvedores

**Stack utilizada:**

- Node.js 20.x
- TypeScript
- Chokidar
- Commander
- P-queue
- pkg

O projeto gera um binário executável para Windows e Linux, utilizando o `pkg`.

**scripts:**

- `npm run pkg:windows`: Gera o binário executável para Windows.
- `npm run pkg:linux`: Gera o binário executável para Linux.
- `npm run dev`: Inicia o servidor em modo de desenvolvimento.

### Release

**Workflows:**

- `release.yml`: Realiza o build e cria uma release com os binários.
- `test.yml`: Executa os testes e cobertura de código.

Para realizar o release, basta criar uma tag no formato `v<major>.<minor>.<patch>`.

1. Crie um novo release `npm run release`
2. Submeta o release para o GitHub `git push --tags`

As actions do GitHub irão buildar o projeto e criar uma release com os binários.

---

### Comandos para configuração

Utilize as flags de configuração para gerar o arquivo .env com as variáveis de ambiente necessárias.

Comando de configuração: `npm run config <flags>`

| Flag                  | Descrição                                                 |
| --------------------- | --------------------------------------------------------- |
| `--watch-dir`         | Diretório a ser monitorado                                |
| `--log-dir`           | Diretório onde os logs serão gravados                     |
| `--api-endpoint`      | Endpoint da API                                           |
| `--api-key`           | Chave de autenticação da API                              |
| `--extensions`        | Filtro de extensões separados por vírgula (ex: .ret,.txt) |
| `--cache-dir`         | Diretório para cache de arquivos processados              |
| `--queue-concurrency` | Número de uploads simultâneos (padrão: 3)                 |

Exemplo de uso em modo de desenvolvimento: `npm run dev -- config --watch-dir ./volumes/input --log-dir ./volumes/logs --api-endpoint https://api.example.com --api-key 1234567890 --extensions .ret,.txt --cache-dir ./volumes/cache --queue-concurrency 3`

Exemplo de uso em produção (binário): `./art-w config --watch-dir ./volumes/input --log-dir ./volumes/logs --api-endpoint https://api.example.com --api-key 1234567890 --extensions .ret,.txt --cache-dir ./volumes/cache --queue-concurrency 3`

### Comando para processar arquivo específico

O comando `process` permite processar um arquivo específico sem iniciar o monitoramento de diretório. Útil para processar arquivos individuais sob demanda ou para testes.

**Características:**

- Processa um único arquivo e encerra após conclusão
- Gera hash SHA256 do arquivo
- Loga informações completas do arquivo (nome, caminho, tamanho, data de modificação, hash)
- Envia o arquivo para a API configurada
- **Não adiciona ao cache** (diferente do comportamento do monitoramento contínuo)
- Processa qualquer arquivo, independente do filtro de extensões configurado

**Sintaxe:**

```bash
art-w process --file <caminho-do-arquivo>
```

**Exemplos:**

Modo de desenvolvimento:

```bash
npm run dev -- process --file ./volumes/test/TEST_.ret
```

Modo de produção (binário):

```bash
./art-w process --file ./volumes/test/TEST_.ret
```

**Saída esperada:**

```text
Processando arquivo específico: ./volumes/test/TEST_.ret
=== Informações do Arquivo ===
Nome: TEST_.ret
Caminho: /caminho/completo/para/TEST_.ret
Tamanho: 3920304 bytes
Data de Modificação: 2026-01-16T16:05:27.703Z
Hash SHA256: 0d00777455155a6ce109e21ce0e7c42d2ded5a3ec0b911a09e9e388cf375f330
================================
Enviando arquivo para API: https://api.example.com
Arquivo processado com sucesso: TEST_.ret
```

**Observações:**

- O arquivo deve existir e ser acessível
- As variáveis de ambiente (`API_ENDPOINT`, `API_KEY`, `LOG_DIR`, etc.) devem estar configuradas
- O arquivo não será adicionado ao cache, permitindo reprocessamento sem necessidade de limpar o cache

**Estrutura de diretórios:**

```text/plain
src/
├── commands/
├── config/
├── services/
├── utils/
├── file-watcher.ts
├── index.ts
├── package.json
├── package-lock.json

```
