# Script de Auditoria CNAB 240 - Dezembro 2025

Este script temporário processa todos os arquivos de retorno CNAB do mês de dezembro de 2025, extrai dados dos segmentos T e U, salva em JSON e insere no banco PostgreSQL para auditoria de divergências de valores creditados.

## Pré-requisitos

1. **PostgreSQL rodando via Docker** (localhost)
2. **Node.js** e **npm** instalados
3. **Dependências do projeto** instaladas

## Configuração

### 1. Instalar dependências temporárias

```bash
npm install --save-dev prisma
npm install @prisma/client
```

### 2. Configurar banco de dados

Crie um arquivo `.env` na raiz do projeto com a string de conexão PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"
```

Exemplo para Docker PostgreSQL padrão:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/audit_cnab?schema=public"
```

### 3. Criar banco de dados (se necessário)

```bash
# Conectar ao PostgreSQL e criar o banco
createdb audit_cnab

# Ou via Docker
docker exec -it <container_name> psql -U postgres -c "CREATE DATABASE audit_cnab;"
```

### 4. Gerar Prisma Client e aplicar migrations

```bash
# Gerar Prisma Client
npx prisma generate

# Criar e aplicar migrations
npx prisma migrate dev --name init_audit_return

# Ou apenas criar o schema sem migrations (desenvolvimento)
npx prisma db push
```

## Execução

```bash
npx tsx scripts/extract.ts
```

## O que o script faz

1. **Lista arquivos recursivamente** de `volumes/audit/2025-12`
2. **Processa cada arquivo CNAB** usando `ReadRetFileService`
3. **Extrai segmentos T e U** de cada arquivo
4. **Salva JSON** no mesmo diretório de cada arquivo processado (`{arquivo}.json`)
5. **Insere dados no PostgreSQL** na tabela `AuditReturn`

## Estrutura dos Dados

### Arquivo JSON

Cada arquivo processado gera um JSON com:
- Metadados do arquivo (caminho, nome, tipo CNAB)
- Header do arquivo
- Array de pares T/U encontrados
- Metadados de processamento

### Tabela AuditReturn

A tabela contém todos os campos dos segmentos T e U:
- Identificação: arquivo, linha, tipo CNAB
- Banco/Convênio: código do banco, convênio, lote
- Título: nosso número, número do título, carteira
- Pagador: nome, CPF/CNPJ
- Movimentação: código de movimento, código de ocorrência
- Valores: valores do título, tarifas, valores pagos, valores creditados
- Datas: data de pagamento, data de crédito

## Filtros e Foco

O script processa **todos** os códigos de movimento, mas o foco da auditoria está em:
- **'06'** - Liquidação
- **'46'** - Liquidação On-Line

Porém, todos os códigos são capturados para análise completa.

## Logs e Estatísticas

O script exibe:
- Progresso de processamento (arquivo X de Y)
- Quantidade de pares T/U encontrados por arquivo
- Erros encontrados (sem interromper o processamento)
- Resumo final com estatísticas completas

## Tratamento de Erros

- Arquivos inválidos são logados mas não interrompem o processamento
- Erros de inserção no banco são tratados individualmente
- Duplicatas são ignoradas (skipDuplicates)

## Limpeza (Após Auditoria)

Após concluir a auditoria, você pode remover as dependências temporárias:

```bash
npm uninstall prisma @prisma/client
rm -rf prisma node_modules/.prisma
```

## Consultas Úteis

Após executar o script, você pode consultar os dados:

```sql
-- Total de registros por código de movimento
SELECT movementCode, COUNT(*) as total
FROM "AuditReturn"
GROUP BY movementCode
ORDER BY total DESC;

-- Valores creditados por código de movimento
SELECT movementCode, 
       COUNT(*) as total,
       SUM("netCreditValue") as total_creditado
FROM "AuditReturn"
WHERE "netCreditValue" IS NOT NULL
GROUP BY movementCode
ORDER BY total DESC;

-- Divergências (valores diferentes entre pago e creditado)
SELECT *
FROM "AuditReturn"
WHERE "paidAmount" != "netCreditValue"
  AND "paidAmount" IS NOT NULL
  AND "netCreditValue" IS NOT NULL;
```
