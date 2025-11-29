# Comportamento da fila de uploads

## 📋 Contexto Atual

O projeto atualmente processa arquivos de forma assíncrona quando detectados pelo watcher, utilizando uma fila de uploads para controlar a concorrência e o retry automático.

A fila de uploads é implementada utilizando a biblioteca `p-queue`, que é uma fila em memória com controle de concorrência, retry e priorização.

As retentativas são feitas com backoff exponencial, com um máximo de 3 tentativas.

A priorização é feita para processar arquivos novos antes de reprocessar falhas.

## 🎯 Requisitos da fila de uploads

1. **Controle de concorrência** - Limitar uploads simultâneos para não sobrecarregar a API
2. **Retry automático** - Reenviar arquivos que falharam
3. **Priorização** - Processar arquivos novos antes de reprocessar falhas

Os arquivos são processados em ordem de chegada, ou seja, o primeiro arquivo a chegar é o primeiro a ser processado.

O arquivo é processado imediatamente após ser adicionado à fila.

Em caso de falha no upload, o arquivo é reenviado após um delay de 10 segundos, 30 segundos e 60 segundos, com um máximo de 3 tentativas. Erros 4xx (bad request) não são reenviados.

---

## 📐 Arquitetura

```text/plain
┌─────────────────┐
│  File Watcher   │
│    (Chokidar)   │
└────────┬────────┘
         │ Detecta arquivo
         ▼
┌─────────────────┐
│  File Processor │
│  - Gera Hash    │
│  - Check Cache  │
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
