---
title: 'Análise técnica — divergência de repasse BB × Sistema 360'
subtitle: 'CREA-PE (17/04/2026) e CREA-TO (10/03/2026)'
date: '2026'
---

# Análise técnica — divergência de repasse BB × Sistema 360

**Destinatário:** Banco do Brasil  
**Assunto:** Diferença de R$ 21,67 — convênios CREA-PE e CREA-TO (CNAB 400)  
**Referência:** E-mail recebido sobre crédito de 17/04/2026 (CREA-PE)

---

Prezados,

Segue nossa análise técnica sobre a diferença de **R$ 21,67** apontada no convênio **CREA-PE (`2810159`)**, crédito **17/04/2026**, e o pedido de esclarecimento no **CREA-TO (`3398378`)**, crédito **10/03/2026**, **antes de qualquer ajuste** na nossa regra de leitura dos retornos CNAB 400.

---

## 1. CREA-PE — 17/04/2026

### 1.1 Conciliação (valores do e-mail)

| Métrica       | Valor informado pelo BB |  Sistema 360 |
| ------------- | ----------------------: | -----------: |
| Base 100%     |            R$ 78.723,59 | R$ 78.723,59 |
| Repasse 20%   |            R$ 15.761,90 | R$ 15.740,23 |
| **Diferença** |                         | **R$ 21,67** |

A diferença de **R$ 21,67** corresponde exatamente a **20% de R$ 108,39**:

```
CAST(10839 × 0,2) = R$ 21,67
```

### 1.2 Evidência no arquivo de retorno

| Campo        | Valor                         |
| ------------ | ----------------------------- |
| **Arquivo**  | `CBR64357991704202615758.ret` |
| **Convênio** | `2810159` (CREA-PE)           |
| **Layout**   | CNAB 400 — detalhe tipo `7`   |

Identificamos **duas linhas de detalhe** referentes ao **mesmo título** (mesmo nosso número / nº regional):

| Linha | Ocorr. | Nº regional         | Pagamento  | Crédito        |     Valor |  Tarifa |   Seq. |
| ----: | :----: | ------------------- | ---------- | -------------- | --------: | ------: | -----: |
|  3260 | **06** | 28101598308709825-7 | 17/04/2026 | **20/04/2026** | R$ 108,39 | R$ 2,31 | 003260 |
|  3262 | **05** | 28101598308709825-7 | 17/04/2026 | **17/04/2026** | R$ 108,39 | R$ 2,29 | 003262 |

**Observações:**

- Trata-se do **mesmo pagamento** (mesmo valor e mesma data de pagamento), com **duas ocorrências** no retorno (`05` e `06`).
- No dia **17/04**, o repasse de **R$ 21,67** coincide com a linha de ocorrência **`05`** (crédito 17/04).
- A linha **`06`** do mesmo título consta com **data de crédito 20/04/2026**.

### 1.3 Composição do dia (2º lote)

Arquivo: `CBR64357991704202615758.ret`

| Origem                         |   Bruto 100% |  Repasse 20% |
| ------------------------------ | -----------: | -----------: |
| Sistema 360 (ocorrências `06`) | R$ 41.426,74 |  R$ 8.283,06 |
| BB (conforme e-mail)           |            — |  R$ 8.304,73 |
| **Diferença**                  |            — | **R$ 21,67** |

**Arquivo complementar do mesmo dia:** `CBR64357961604202615750.ret` (pag. 16/04, créd. 17/04) — repasse **R$ 7.457,17**; sem divergência identificada nesse lote.

### 1.4 Perguntas ao BB (PE)

Para o título **28101598308709825-7**, quando há ocorrências **`05` e `06`** no mesmo retorno:

1. O repasse da Mútua (20%) deve ser contabilizado **uma ou duas vezes**?
2. Qual ocorrência e qual **data de crédito** prevalecem para o repasse — **17/04** na `05` ou **20/04** na `06`?
3. O valor de **R$ 21,67** creditado a mais em relação ao 360 decorre da inclusão do repasse da linha **`05`**?

Na conta operacional, o valor creditado está **R$ 21,67 acima** do calculado pelo sistema 360 para essa data — alinhado à hipótese de inclusão do evento **`05`**.

---

## 2. CREA-TO — 10/03/2026 (análise preliminar)

Conforme solicitado no e-mail, aplicamos o mesmo critério ao **CREA-TO (`3398378`)**, crédito **10/03/2026**.

| Campo        | Valor                        |
| ------------ | ---------------------------- |
| **Arquivo**  | `CBR6435715903202630827.ret` |
| **Convênio** | `3398378` (CREA-TO)          |

| Linha | Ocorr. | Nº regional       | Pagamento  | Crédito    |     Valor |  Tarifa |   Seq. |
| ----: | :----: | ----------------- | ---------- | ---------- | --------: | ------: | -----: |
|   436 | **06** | 33983789981712260 | 09/03/2026 | 10/03/2026 | R$ 108,39 | R$ 1,30 | 000436 |
|   439 | **05** | 33983789981712260 | 09/03/2026 | 10/03/2026 | R$ 108,39 | R$ 1,00 | 000439 |

**Mesma situação:** um pagamento, duas ocorrências (`06` e `05`) no retorno. A diferença de repasse, quando ocorre, segue o mesmo padrão de **R$ 21,67** (20% de R$ 108,39).

**Sistema 360 no dia:** 287 linhas (`06`), bruto **R$ 41.349,75**, repasse **R$ 8.267,81**.

---

## 3. Contexto do nosso lado (sem alteração de regra por enquanto)

No processamento atual do CNAB 400:

- Ocorrências **`05` e `06`** são **lidas** no parser.
- Na gravação, linhas com o **mesmo nº regional** e **mesmo convênio** são tratadas como **duplicata**.
- Se a tarifa da segunda linha **não for maior**, a linha é **ignorada** — o que, nos casos acima, resulta na exclusão da ocorrência **`05`** quando a **`06`** já foi processada.

**Antes de alterarmos essa regra**, precisamos da confirmação de vocês sobre:

- qual evento (`05` ou `06`) deve compor o repasse; e
- se um **único pagamento** pode gerar **mais de um repasse** de 20%.

---

## 4. Solicitação

Pedimos, por favor:

1. **Confirmação da regra de repasse** quando o mesmo título aparece com ocorrências **`05` e `06`** no mesmo arquivo.
2. **Indicação da ocorrência e da data de crédito** que devem prevalecer para fins de repasse à Mútua.
3. **Validação** se o **R$ 21,67** (PE, 17/04) decorre da contabilização do evento **`05`** (linha **3262** do arquivo `CBR64357991704202615758.ret`).
4. **Mesmo esclarecimento** para o **CREA-TO em 10/03/2026** (linhas **436** e **439** do arquivo `CBR6435715903202630827.ret`).

Com essa definição, ajustamos nossa conciliação ao critério oficial do BB e fechamos a diferença.

---

Permanecemos à disposição para enviar extratos das linhas ou amostra do arquivo, se necessário.

<br><br>

Atenciosamente,

**Leandro Sbrissa**

Lider Técnico
S4S/Mútua — Tecnologia
