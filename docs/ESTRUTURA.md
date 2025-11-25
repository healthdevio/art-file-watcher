# Estrutura do Projeto File Watcher

## Visão Geral

O projeto foi refatorado seguindo os princípios de **Separação de Responsabilidades (SRP)** e **Melhores Práticas** de desenvolvimento. Cada módulo tem uma responsabilidade única e bem definida.

## Estrutura de Diretórios

```text/plain
src/
├── config/
│   └── environment.ts          # Validação de variáveis de ambiente
├── services/
│   ├── api-client.ts           # Cliente HTTP para comunicação com a API
│   ├── file-hash.ts            # Geração de hash SHA256 de arquivos
│   └── file-watcher-service.ts # Serviço de monitoramento de arquivos
├── utils/
│   ├── directory.ts            # Verificação e criação de diretórios
│   └── logger.ts               # Utilitário de logging (preparado para uso futuro)
└── file-watcher.ts             # Arquivo principal - orquestração da aplicação
```

## Responsabilidades de Cada Módulo

### 📁 `config/environment.ts`

**Responsabilidade:** Validação e exportação das variáveis de ambiente

- Valida todas as variáveis de ambiente necessárias usando Zod
- Fornece mensagens de erro detalhadas e claras
- Exporta o tipo `Environment` para tipagem forte
- Lança erro imediatamente se variáveis estiverem inválidas/ausentes

### 📁 `utils/directory.ts`

**Responsabilidade:** Verificação e criação de diretórios

- `ensureDirectory()`: Verifica se um diretório existe e cria se necessário
- `ensureDirectories()`: Verifica múltiplos diretórios de uma vez
- `validateApplicationDirectories()`: Valida os diretórios necessários para a aplicação
- Resolve caminhos relativos para absolutos
- Retorna resultados estruturados com mensagens claras

### 📁 `services/file-hash.ts`

**Responsabilidade:** Geração de hash SHA256 de arquivos

- `generateFileHash()`: Gera hash usando streams para eficiência de memória
- Extrai o nome do arquivo automaticamente
- Tratamento robusto de erros (arquivo não encontrado, permissões, etc.)
- Retorna Promise com resultado tipado (`HashResult`)

### 📁 `services/api-client.ts`

**Responsabilidade:** Comunicação com a API externa

- `ApiClient`: Classe para envio de hashes para o endpoint configurado
- Envia payload JSON com nome do arquivo, hash e timestamp
- Tratamento completo de erros de rede e HTTP
- Retorna resultados estruturados (`ApiResponse`)

### 📁 `services/file-watcher-service.ts`

**Responsabilidade:** Monitoramento de arquivos usando Chokidar

- `FileWatcherService`: Classe que gerencia o monitoramento
- Configuração otimizada do Chokidar (ignora arquivos ocultos, aguarda estabilidade)
- Processa arquivos adicionados automaticamente
- Integra hash generation e API client
- Métodos `start()` e `stop()` para controle do serviço

### 📁 `file-watcher.ts`

**Responsabilidade:** Orquestração e inicialização da aplicação

- Função `main()`: Ponto de entrada da aplicação
- Fluxo de inicialização bem definido:
  1. Validação de variáveis de ambiente
  2. Verificação/criação de diretórios
  3. Configuração do cliente de API
  4. Inicialização do File Watcher Service
  5. Configuração de encerramento gracioso
- Handlers para SIGINT, SIGTERM, uncaughtException e unhandledRejection

## Fluxo de Execução

```text/plain
1. Importação de variáveis de ambiente
   └── Validação automática (se falhar, aplicação não inicia)

2. Verificação de diretórios
   ├── WATCH_DIR: Deve existir (erro se não existir)
   └── LOG_DIR: Pode ser criado automaticamente

3. Inicialização de serviços
   ├── ApiClient (configurado com endpoint e API key)
   └── FileWatcherService (configurado com diretório e API client)

4. Início do monitoramento
   └── Aguarda arquivos no diretório configurado

5. Processamento de arquivos
   ├── Arquivo detectado → Gera hash
   └── Hash gerado → Envia para API
```

## Melhores Práticas Aplicadas

### ✅ Separação de Responsabilidades (SRP)

Cada módulo tem uma única responsabilidade bem definida.

### ✅ Tratamento de Erros Robusto

- Validação de entrada em todas as camadas
- Mensagens de erro claras e informativas
- Handlers para todos os tipos de erro (rede, arquivo, sistema)

### ✅ Tipagem Forte com TypeScript

- Interfaces bem definidas para todos os dados
- Tipos exportados para reutilização
- Validação em tempo de compilação

### ✅ Código Modular e Testável

- Funções puras onde possível
- Dependências injetadas (não hardcoded)
- Facilita testes unitários e de integração

### ✅ Verificação Prévia

- Validação de ambiente antes de iniciar
- Verificação de diretórios antes de monitorar
- Mensagens claras se algo estiver faltando

### ✅ Encerramento Gracioso

- Handlers para sinais do sistema (SIGINT, SIGTERM)
- Limpeza de recursos antes de encerrar
- Logs informativos durante o encerramento

### ✅ Eficiência de Memória

- Uso de streams para arquivos grandes
- Processamento assíncrono não-bloqueante

## Como Usar

### Desenvolvimento

```bash
npm run start:dev
```

### Build

```bash
npm run build
```

### Gerar Binário

```bash
npm run pkg:windows  # Windows
npm run pkg:linux    # Linux
```

## Variáveis de Ambiente Necessárias

```env
WATCH_DIR=./volumes/input      # Diretório a ser monitorado (deve existir)
API_ENDPOINT=https://api...    # URL do endpoint da API
API_KEY=sua-chave              # Chave de autenticação
LOG_DIR=./volumes/logs         # Diretório de logs (pode ser criado)
```

## Benefícios da Refatoração

1. **Manutenibilidade**: Código organizado e fácil de entender
2. **Testabilidade**: Cada módulo pode ser testado isoladamente
3. **Reutilização**: Módulos podem ser reutilizados em outros projetos
4. **Debugging**: Erros são mais fáceis de rastrear
5. **Extensibilidade**: Fácil adicionar novos recursos sem quebrar código existente
6. **Confiabilidade**: Validações e verificações previnem erros em runtime
