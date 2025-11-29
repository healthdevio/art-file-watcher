# art-file-watcher

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

### Regras de comportamento

- Fila de uploads: [docs/QUEUE.md](./docs/QUEUE.md)

## Instalação

A aplicação funciona no modo standalone, ou seja, não precisa ser instalado como um serviço. Porém para garantir que a aplicação rode de forma contínua, com alta disponibilidade e que inicie automaticamente após qualquer reinicialização do servidor Linux, é **recomendado instalar** como um serviço.

- Instalação no Windows: [Guia de Teste no Windows](./docs/WINDOWS.md)
- Instalação no Linux: [Guia de Instalação no Linux](./docs/LINUX.md)

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
