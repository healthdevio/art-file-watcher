# Opções de Fila para File Watcher

## 📋 Contexto Atual

O projeto atualmente processa arquivos de forma síncrona quando detectados pelo watcher:
- Cada arquivo é processado imediatamente ao ser detectado
- Upload é feito diretamente via `ApiClient.uploadFiles()`
- Não há controle de concorrência ou retry automático

## 🎯 Requisitos Identificados

1. **Controle de concorrência** - Limitar uploads simultâneos para não sobrecarregar a API
2. **Retry automático** - Reenviar arquivos que falharam
3. **Priorização** - Processar arquivos novos antes de reprocessar falhas
4. **Simplicidade** - Não adicionar dependências externas pesadas (como Redis) se não for necessário
5. **Persistência** - Opcional: manter fila entre reinicializações

---

## 📦 Opções de Bibliotecas

### 1. **p-queue** ⭐ (Recomendado para o caso)

**Descrição**: Fila em memória com controle de concorrência, retry e priorização.

**Características**:
- ✅ **Leve** (~15KB)
- ✅ **Sem dependências externas** (Redis, etc)
- ✅ **TypeScript nativo**
- ✅ **Controle de concorrência configurável**
- ✅ **Suporte a retry com backoff**
- ✅ **Priorização de tarefas**
- ✅ **Eventos de progresso**
- ✅ **Compatível com CommonJS**

**Prós**:
- Perfeito para filas simples em um único processo
- Muito simples de integrar
- Boa performance
- Ativamente mantido

**Contras**:
- ❌ **Não persistente** - Fila perde-se se a aplicação cair
- ❌ **Não distribuída** - Não funciona em múltiplas instâncias

**Quando usar**: Para controle de concorrência e retry simples, sem necessidade de persistência.

**Exemplo de uso**:
```typescript
import PQueue from 'p-queue';

const queue = new PQueue({ 
  concurrency: 3,
  interval: 1000,
  intervalCap: 5 
});

await queue.add(() => uploadFile(filePath));
```

**Tamanho**: ~15KB
**Downloads/semana**: ~2.5M
**GitHub Stars**: ~2.5k

---

### 2. **BullMQ** (Para casos mais robustos)

**Descrição**: Sistema de fila distribuída baseado em Redis.

**Características**:
- ✅ **Persistente** - Sobrevive a reinicializações
- ✅ **Distribuída** - Múltiplas instâncias podem compartilhar a fila
- ✅ **Retry avançado** com diferentes estratégias
- ✅ **Priorização e delay**
- ✅ **Monitoramento** via Bull Board
- ✅ **Rate limiting**
- ✅ **TypeScript nativo**

**Prós**:
- Muito robusto e escalável
- Ideal para produção com múltiplas instâncias
- Boa documentação

**Contras**:
- ❌ **Depende de Redis** - Precisa instalar e configurar Redis
- ❌ **Mais complexo** - Overhead para casos simples
- ❌ **Mais pesado** - ~500KB+ com dependências

**Quando usar**: Quando precisa de persistência, múltiplas instâncias ou escalabilidade.

**Tamanho**: ~500KB+ (com Redis)
**Downloads/semana**: ~700k
**GitHub Stars**: ~17k

---

### 3. **bottleneck** (Para rate limiting)

**Descrição**: Rate limiter com fila integrada.

**Características**:
- ✅ **Rate limiting avançado** (requisições por minuto/hora)
- ✅ **Cluster mode** (distribuído)
- ✅ **Priorização**
- ✅ **Retry automático**

**Prós**:
- Excelente para limitar requisições por tempo
- Suporta múltiplas estratégias de rate limiting

**Contras**:
- ❌ **Focado em rate limiting** - Não é uma fila "pura"
- ❌ **Menos recursos** que p-queue para controle simples

**Quando usar**: Quando precisa limitar requisições por período (ex: "máximo 10 uploads/minuto").

**Tamanho**: ~50KB
**Downloads/semana**: ~800k
**GitHub Stars**: ~7k

---

### 4. **fastq** (Mais leve possível)

**Descrição**: Fila assíncrona mínima e rápida.

**Características**:
- ✅ **Muito leve** (~5KB)
- ✅ **Máxima performance**
- ✅ **Sem dependências**
- ✅ **Zero configuração**

**Prós**:
- Mais leve de todas
- Performance excepcional

**Contras**:
- ❌ **Sem retry automático** - Precisa implementar manualmente
- ❌ **Sem priorização nativa**
- ❌ **Muito básico** - Apenas controle de concorrência

**Quando usar**: Quando precisa apenas de controle de concorrência básico.

**Tamanho**: ~5KB
**Downloads/semana**: ~1.5M
**GitHub Stars**: ~1k

---

### 5. **async.queue** (Já no ecossistema Node.js)

**Descrição**: Parte da biblioteca `async` (comum no Node.js).

**Características**:
- ✅ **Familiar** - Muitos já conhecem
- ✅ **Básico** - Controle de concorrência simples

**Prós**:
- Se já usa `async`, não adiciona dependência

**Contras**:
- ❌ **Sem retry automático**
- ❌ **Sem priorização**
- ❌ **API menos moderna**

**Quando usar**: Se já usar `async` no projeto.

**Tamanho**: Parte do `async` (~100KB)
**Downloads/semana**: ~50M (async)
**GitHub Stars**: ~12k (async)

---

## 🏆 Recomendação para o Projeto

### **Opção 1: p-queue** (Recomendado)

**Por quê?**
1. ✅ **Sem overhead** - Não precisa de Redis ou dependências externas
2. ✅ **Retry automático** - Pode reenviar arquivos que falharam
3. ✅ **Controle de concorrência** - Limitar uploads simultâneos (ex: 3-5 por vez)
4. ✅ **Priorização** - Processar arquivos novos antes de retry de falhas
5. ✅ **Simples de integrar** - API limpa e TypeScript-friendly
6. ✅ **Leve** - Não adiciona peso significativo ao binário

**Implementação sugerida**:
- Concorrência: 3-5 uploads simultâneos
- Retry: 3 tentativas com backoff exponencial
- Prioridade: Alta para arquivos novos, baixa para retry

**Limitação conhecida**: Se a aplicação cair, a fila em memória é perdida. Porém, como você já tem:
- ✅ Cache de arquivos processados
- ✅ Varredura inicial ao reiniciar
- ✅ Processamento de arquivos novos automaticamente

A fila em memória é suficiente, pois arquivos não processados serão detectados na varredura inicial.

---

### **Opção 2: BullMQ** (Se precisar de persistência)

**Use apenas se**:
- Precisar processar arquivos mesmo após queda da aplicação
- Tiver múltiplas instâncias do watcher rodando
- Quiser monitorar a fila via interface web

**Trade-off**: Adiciona Redis como dependência externa.

---

## 📐 Arquitetura Proposta com p-queue

```
┌─────────────────┐
│  File Watcher   │
│    (Chokidar)   │
└────────┬────────┘
         │ Detecta arquivo
         ▼
┌─────────────────┐
│  File Processor │
│  - Gera Hash    │
│  - Verifica Cache│
└────────┬────────┘
         │ Se não processado
         ▼
┌─────────────────┐
│  Upload Queue   │  ◄── p-queue
│  (p-queue)      │     - Concurrency: 3-5
│                 │     - Retry: 3x
└────────┬────────┘     - Priority: new > retry
         │
         ▼
┌─────────────────┐
│   ApiClient     │
│  - uploadFiles  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Cache       │
│  - writeCache   │
└─────────────────┘
```

---

## 🔧 Melhores Práticas

### 1. **Controle de Concorrência**
- Limitar a 3-5 uploads simultâneos para não sobrecarregar API
- Considerar rate limiting se a API tiver limites

### 2. **Retry Strategy**
- Máximo 3 tentativas
- Backoff exponencial (1s, 2s, 4s)
- Diferentes prioridades para retry vs novos arquivos

### 3. **Tratamento de Erros**
- Erros de rede: retry automático
- Erros 4xx (bad request): não retry, apenas log
- Erros 5xx (server error): retry

### 4. **Monitoramento**
- Log de itens na fila
- Log de taxa de sucesso/falha
- Alertas para fila crescendo muito

### 5. **Graceful Shutdown**
- Aguardar fila terminar antes de encerrar
- Salvar estado pendente (se usar fila persistente)

---

## 📊 Comparação Rápida

| Biblioteca  | Tamanho | Redis? | Retry? | Prioridade? | Complexidade |
|------------|---------|--------|--------|-------------|--------------|
| **p-queue** | 15KB    | ❌     | ✅     | ✅          | ⭐⭐         |
| **BullMQ**  | 500KB+  | ✅     | ✅     | ✅          | ⭐⭐⭐⭐      |
| **bottleneck** | 50KB  | ❌*    | ✅     | ✅          | ⭐⭐⭐        |
| **fastq**   | 5KB     | ❌     | ❌     | ❌          | ⭐           |
| **async.queue** | -    | ❌     | ❌     | ❌          | ⭐           |

*Cluster mode requer Redis, modo standalone não

---

## 🎯 Decisão Final Sugerida

**Usar `p-queue`** porque:
1. ✅ Atende todos os requisitos (concorrência, retry, priorização)
2. ✅ Não adiciona dependências externas pesadas
3. ✅ Compatível com arquitetura atual
4. ✅ Fácil de testar e manter
5. ✅ Cache + varredura inicial compensam a falta de persistência

**Instalação**:
```bash
npm install p-queue
npm install --save-dev @types/p-queue
```

Quer que eu implemente a fila usando `p-queue`?

