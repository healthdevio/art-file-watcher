# Relatório de Divergência: Layout Segmento U CNAB 240

**Data:** 20 de Janeiro de 2026  
**Versão:** 1.0  
**Preparado para:** Reunião com Time de Tecnologia

---

## 1. Resumo Executivo

Foi identificada uma **divergência crítica** entre a documentação oficial FEBRABAN e os arquivos reais de retorno CNAB 240 processados pelo sistema. A divergência ocorre especificamente no **Segmento U** (tipo de registro 3, segmento U), onde os campos monetários e de data estão posicionados **9 posições antes** do especificado na documentação oficial.

### Impacto

- **5.200 arquivos** (99,1% dos arquivos analisados) apresentam esta divergência
- Afeta principalmente arquivos do **Banco 104 (Caixa Econômica Federal)**
- Inclui arquivos com múltiplas extensões: `.ret`, `.A2T9R5`, `.A2U7F4`, `.A2U1W8`, `.A2U5M7`
- Causa extração incorreta de dados quando o schema segue estritamente a documentação FEBRABAN
- Pode resultar em valores monetários e datas incorretos sendo salvos no banco de dados

---

## 2. Problema Identificado

### 2.1 Descrição do Problema

A documentação oficial FEBRABAN define dois layouts possíveis para o Segmento U:

1. **Layout SITCS (Contribuição Sindical)** - com campos específicos entre posições 18-86
2. **Layout Padrão** - sem campos SITCS

O problema é que **os arquivos reais do Banco 104 não seguem nenhum dos dois layouts documentados**, apresentando um layout intermediário onde:

- **NÃO há** campos SITCS (08.3U a 16.3U)
- **NÃO há** Campo 16.3U (Tipo de Arrecadação) na posição 86
- Os campos seguintes estão **deslocados 9 posições para a esquerda**

### 2.2 Campos Afetados

| Campo | Documentação FEBRABAN (base 0) | Arquivo Real (base 0) | Diferença |
|-------|-------------------------------|---------------------|-----------|
| **17.3U** - Valor Pago pelo Pagador | 86-100 | **77-92** | **-9 posições** |
| **18.3U** - Valor Líquido a ser Creditado | 101-115 | **92-107** | **-9 posições** |
| **19.3U** - Juros/Multa/Encargos | 116-130 | **107-122** | **-9 posições** |
| **20.3U** - Outros Créditos | 131-145 | **122-137** | **-9 posições** |
| **21.3U** - Data da Ocorrência | 146-153 | **137-145** | **-9 posições** |
| **22.3U** - Data da Efetivação do Crédito | 154-161 | **145-153** | **-9 posições** |

---

## 3. Análise dos Arquivos

### 3.1 Metodologia

Foram analisados **5.313 arquivos** CNAB 240 das pastas:
- `volumes/audit/2025-12/**/*` (todas as extensões)
- `volumes/test/**/*` (todas as extensões)

**Extensões analisadas:**
- `.ret` / `.RET` - 2.297 arquivos
- `.A2T9R5` - 364 arquivos
- `.A2U7F4` - 1.353 arquivos
- `.A2U1W8` - 1.225 arquivos
- `.A2U5M7` - 74 arquivos

**Total de arquivos com Segmento U identificado:** 5.246 arquivos

Para cada arquivo, foi verificado:
- Tamanho da linha do Segmento U
- Posições das datas (paymentDate e creditDate)
- Presença do Campo 16.3U (Tipo de Arrecadação) na posição 85
- Validação de datas nas posições documentadas vs posições alternativas

### 3.2 Resultados da Análise

| Layout Identificado | Quantidade | Percentual |
|---------------------|------------|------------|
| **SEM_SITCS** (Layout alternativo sem Campo 16.3U) | 5.200 | **99,1%** |
| **UNKNOWN** (Não identificado - ver explicação abaixo) | **43** | **0,8%** |
| **ALTERNATIVO_SEM_CAMPO_16** | 3 | 0,06% |
| **Total analisado** | **5.246** | **98,7%** |

### 3.2.2 Arquivos com Layout UNKNOWN

**Total:** 43 arquivos (0,8% do total analisado)

#### Por que são classificados como UNKNOWN?

Os 43 arquivos classificados como UNKNOWN apresentam um padrão específico que não se encaixa em nenhum dos layouts conhecidos:

**Características comuns:**
- ✅ Possuem `paymentDate` **válido** na posição alternativa (137-145)
- ❌ Não possuem `creditDate` válido em nenhuma das posições (145-153 ou 154-161)
- ❌ O campo `creditDate` está sempre vazio (`00000000`)
- ❌ Não possuem Campo 16.3U (Tipo de Arrecadação) na posição 85
- ❌ Layout da documentação não é válido (datas inválidas nas posições 146-154 e 154-162)
- ❌ Layout alternativo não está completo (faltando `creditDate` válido)

**Critérios de classificação:**
- Layout SITCS: Requer `hasTipoArrecacao` + `isDocLayout` (ambas as datas válidas nas posições da documentação)
- Layout SEM_SITCS: Requer `!hasTipoArrecacao` + `isAltLayout` (ambas as datas válidas nas posições alternativas)
- **UNKNOWN**: Não atende nenhum dos critérios acima

**Conclusão:** Esses arquivos seguem o layout SEM_SITCS para `paymentDate` (posição 137-145), mas não possuem `creditDate` preenchido (sempre `00000000`), indicando possivelmente transações onde o crédito ainda não foi efetivado ou onde o campo não é obrigatório. Como o algoritmo de detecção requer **ambas as datas válidas** para classificar como SEM_SITCS, esses arquivos são classificados como UNKNOWN.

**Exemplo prático - Arquivo:** `[20251201]R054074CEF2900.RET`
- `paymentDate` (137-145): `28112025` → **28/11/2025** ✅ (válida)
- `creditDate` (145-153): `00000000` → **Inválida** ❌ (vazia)
- `paymentDate` (146-154): `00000000` → **Inválida** ❌ (documentação)
- `creditDate` (154-162): `00028112` → **Inválida** ❌ (documentação)

**Resultado:** Como apenas `paymentDate` está válido na posição alternativa, mas `creditDate` está vazio, o arquivo não atende aos critérios completos de nenhum layout conhecido.

**Lista completa dos arquivos com layout UNKNOWN:**

1. `volumes/audit/2025-12/01/[20251201]R054074CEF2900.RET` (Linha 4)
2. `volumes/audit/2025-12/02/[20251202]CREA-ES_2025.12.02_94475.RET` (Linha 4)
3. `volumes/audit/2025-12/02/[20251202]CREA-ES_2025.12.02_94476.RET` (Linha 4)
4. `volumes/audit/2025-12/03/[20251203]CEF_COB0312000.A2U5M7` (Linha 4)
5. `volumes/audit/2025-12/03/[20251203]CREA-ES_2025.12.03_94478.RET` (Linha 4)
6. `volumes/audit/2025-12/03/[20251203]R054074CEF0300.RET` (Linha 4)
7. `volumes/audit/2025-12/04/[20251204]R051367CEF0400.RET` (Linha 4)
8. `volumes/audit/2025-12/04/[20251204]R052360CEF041200.RET` (Linha 4)
9. `volumes/audit/2025-12/05/[20251205]CREA-ES_2025.12.05_94480.RET` (Linha 4)
10. `volumes/audit/2025-12/05/[20251205]CREA-ES_2025.12.05_94481.RET` (Linha 4)
11. `volumes/audit/2025-12/05/[20251205]CREA-ES_2025.12.05_94482.RET` (Linha 4)
12. `volumes/audit/2025-12/05/[20251205]CREA-MS_2025.12.05_70962.RET` (Linha 4)
13. `volumes/audit/2025-12/05/[20251205]R051317CEF0500.RET` (Linha 4)
14. `volumes/audit/2025-12/05/[20251205]R051367CEF0500.RET` (Linha 4)
15. `volumes/audit/2025-12/08/[20251208]CREA-ES_2025.12.08_94484.RET` (Linha 4)
16. `volumes/audit/2025-12/08/[20251208]R052360CEF061200.RET` (Linha 4)
17. `volumes/audit/2025-12/10/[20251210]CREA-ES_2025.12.10_94487.RET` (Linha 4)
18. `volumes/audit/2025-12/10/[20251210]R054074CEF1000.RET` (Linha 4)
19. `volumes/audit/2025-12/10/[20251210]R220172CEF1000.RET` (Linha 4)
20. `volumes/audit/2025-12/11/[20251211]CREA-ES_2025.12.11_94488.RET` (Linha 4)
21. `volumes/audit/2025-12/11/[20251211]CREA-ES_2025.12.11_94489.RET` (Linha 4)
22. `volumes/audit/2025-12/11/[20251211]R051317CEF1100.RET` (Linha 4)
23. `volumes/audit/2025-12/11/[20251211]R054074CEF1100.RET` (Linha 4)
24. `volumes/audit/2025-12/12/[20251212]CREA-ES_2025.12.12_94491.RET` (Linha 4)
25. `volumes/audit/2025-12/12/[20251212]R051317CEF1200.RET` (Linha 4)
26. `volumes/audit/2025-12/15/[20251215]CEF_COB1312000.A2U5M7` (Linha 4)
27. `volumes/audit/2025-12/15/[20251215]R051317CEF1300.RET` (Linha 4)
28. `volumes/audit/2025-12/15/[20251215]R054074CEF1300.RET` (Linha 4)
29. `volumes/audit/2025-12/15/[20251215]R220172CEF1300.RET` (Linha 4)
30. `volumes/audit/2025-12/16/[20251216]R220172CEF1600.RET` (Linha 4)
31. `volumes/audit/2025-12/17/[20251217]R051317CEF1700.RET` (Linha 4)
32. `volumes/audit/2025-12/18/[20251218]CEF_COB1812000.A2U5M7` (Linha 4)
33. `volumes/audit/2025-12/18/[20251218]CREA-ES_2025.12.18_94493.RET` (Linha 4)
34. `volumes/audit/2025-12/18/[20251218]CREA-ES_2025.12.18_94494.RET` (Linha 4)
35. `volumes/audit/2025-12/18/[20251218]R054074CEF1800.RET` (Linha 4)
36. `volumes/audit/2025-12/19/[20251219]R051317CEF1900.RET` (Linha 4)
37. `volumes/audit/2025-12/23/[20251223]CREA-ES_2025.12.23_94496.RET` (Linha 4)
38. `volumes/audit/2025-12/23/[20251223]R051317CEF2000.RET` (Linha 4)
39. `volumes/audit/2025-12/23/[20251223]R220172CEF2000.RET` (Linha 4)
40. `volumes/audit/2025-12/24/[20251224]R051317CEF2300.RET` (Linha 4)
41. `volumes/audit/2025-12/26/[20251226]R054074CEF2400.RET` (Linha 4)
42. `volumes/audit/2025-12/26/[20251226]R220172CEF2500.RET` (Linha 4)
43. `volumes/audit/2025-12/30/[20251230]R219695CEF3000.RET` (Linha 4)

**Observação:** Todos os arquivos UNKNOWN possuem `paymentDate` válido na posição alternativa (137-145), mas `creditDate` está sempre vazio. Isso pode indicar que esses arquivos representam transações onde o crédito ainda não foi efetivado, ou que o campo `creditDate` não é obrigatório para esses casos específicos.

### 3.2.1 Distribuição por Extensão

| Extensão | Total Arquivos | Layout SEM_SITCS | Layout UNKNOWN | Layout ALTERNATIVO |
|----------|----------------|------------------|----------------|-------------------|
| `.ret` / `.RET` | 2.230 | 2.189 (98,2%) | 40 (1,8%) | 1 (0,04%) |
| `.A2T9R5` | 364 | 364 (100%) | 0 | 0 |
| `.A2U7F4` | 1.353 | 1.353 (100%) | 0 | 0 |
| `.A2U1W8` | 1.225 | 1.223 (99,8%) | 0 | 2 (0,2%) |
| `.A2U5M7` | 74 | 71 (95,9%) | 3 (4,1%) | 0 |

### 3.3 Distribuição por Banco

| Banco | Total Arquivos | Layout SEM_SITCS | Layout UNKNOWN | Layout ALTERNATIVO |
|-------|----------------|------------------|----------------|-------------------|
| **104** (Caixa) | ~5.200+ | ~5.157 (99,2%) | 43 (0,8%) | 3 (0,06%) |
| **001** (Banco do Brasil) | ~22 | 22 (100%) | 0 | 0 |

**Conclusão:** A divergência afeta principalmente o Banco 104, mas também ocorre no Banco do Brasil. **Todas as extensões de arquivo** (`.ret`, `.A2T9R5`, `.A2U7F4`, `.A2U1W8`, `.A2U5M7`) apresentam o mesmo padrão de layout SEM_SITCS.

---

## 4. Exemplos Específicos com Prova

### 4.1 Exemplo 1: Arquivo Banco 104 - Layout SEM_SITCS

**Arquivo:** `volumes/audit/2025-12/31/[20251231]R219695CEF3003.RET`  
**Linha:** 4 (Segmento U)  
**Banco:** 104 (Caixa Econômica Federal)  
**Versão:** 040  
**Tamanho da linha:** 240 caracteres

#### Análise da Linha 4:

```
Posições 0-240 da linha completa:
1040001300002U 46000000000000000000000000000000000000000000000000000000000000000000000016674000000000016674000000000000000000000000000000301220250201202600000000000000000000000000000000000000000000000000000000000000000000000000000000       
```

#### Comparação: Documentação vs Arquivo Real

**Conforme DOCUMENTAÇÃO FEBRABAN (Layout SITCS):**

| Campo | Posições (base 0) | Valor Extraído | Status |
|-------|-------------------|----------------|--------|
| Campo 16.3U (Tipo Arrecadação) | 85-85 | `0` | ❌ Não é campo válido |
| Campo 17.3U (Valor Pago) | 86-100 | `01667400000000` | ⚠️ Valor parcial |
| Campo 18.3U (Valor Líquido) | 101-115 | `01667400000000` | ⚠️ Valor parcial |
| Campo 19.3U (Juros/Multa) | 116-130 | `00000000000000` | ⚠️ Valor parcial |
| Campo 20.3U (Outros Créditos) | 131-145 | `00000030122025` | ❌ Contém parte da data |
| Campo 21.3U (Data Ocorrência) | 146-153 | `2012026` | ❌ Data inválida/incompleta |
| Campo 22.3U (Data Crédito) | 154-161 | `0000000` | ❌ Data vazia/inválida |

**Conforme ARQUIVO REAL (Layout SEM_SITCS):**

| Campo | Posições (base 0) | Valor Extraído | Status |
|-------|-------------------|----------------|--------|
| Campo 17.3U (Valor Pago) | **77-92** | `000000000016674` | ✅ Valor correto: R$ 166,74 |
| Campo 18.3U (Valor Líquido) | **92-107** | `000000000016674` | ✅ Valor correto: R$ 166,74 |
| Campo 19.3U (Outros Créditos) | **107-122** | `000000000000000` | ✅ Valor correto: R$ 0,00 |
| Campo 20.3U (Outras Despesas) | **122-137** | `000000000000000` | ✅ Valor correto: R$ 0,00 |
| Campo 21.3U (Data Ocorrência) | **137-145** | `30122025` | ✅ Data válida: 30/12/2025 |
| Campo 22.3U (Data Crédito) | **145-153** | `02012026` | ✅ Data válida: 02/01/2026 |

#### Prova Visual da Divergência

```
Posição:  77    86    92   101   107   116   122   131   137   145   146   153   154   161
          |     |     |     |     |     |     |     |     |     |     |     |     |     |
          v     v     v     v     v     v     v     v     v     v     v     v     v     v
Linha:    ...00000000001667400000000001667400000000000000000000000000000000000000301220250201202600000000...
          ^^^^^^^^^^^^^^^^^^     ^^^^^^^^^^^^^^^^^^     ^^^^^^^^^^^^^^^^^^     ^^^^^^^^^^^^^^^^^^
          Valor Pago (REAL)     Valor Líquido (REAL)   Outras Despesas (REAL)  Datas (REAL)
          
          DOCUMENTAÇÃO ESPERARIA:
          ^^^^^^^^^^^^^^^^^^     ^^^^^^^^^^^^^^^^^^     ^^^^^^^^^^^^^^^^^^     ^^^^^^^^^^^^^^^^^^
          Valor Pago (DOC)       Valor Líquido (DOC)    Outros Créditos (DOC)   Datas (DOC)
```

### 4.2 Exemplo 2: Arquivo Banco 104 - Layout SEM_SITCS

**Arquivo:** `volumes/audit/2025-12/01/COB011225000A3Y8U4.RET`  
**Linha:** 4 (Segmento U)  
**Banco:** 104 (Caixa Econômica Federal)  
**Versão:** 040  
**Tamanho da linha:** 240 caracteres

#### Valores Extraídos:

- **paymentDate (137-145):** `01122025` → 01/12/2025 ✅
- **creditDate (145-153):** `03122025` → 03/12/2025 ✅
- **paidAmount (77-92):** `000000000010303` → R$ 103,03 ✅

**Se seguíssemos a documentação:**
- **paymentDate (146-154):** `31220250` → Data inválida ❌
- **creditDate (154-162):** `00000000` → Data vazia ❌

### 4.3 Exemplo 3: Arquivo Banco 001 - Layout SEM_SITCS

**Arquivo:** `volumes/test/TEST_CNAB240_30_IEDCBR23581501202620802.ret`  
**Linha:** 4 (Segmento U)  
**Banco:** 001 (Banco do Brasil)  
**Versão:** 030  
**Tamanho da linha:** 240 caracteres

**Observação:** O Banco do Brasil também apresenta o mesmo layout SEM_SITCS, confirmando que a divergência não é exclusiva do Banco 104.

---

## 5. Comparação com Documentação FEBRABAN

### 5.1 Documentação Oficial

Conforme `docs/CNAB/parse_CNAB_240.md` e `docs/CNAB/Layout CNAB_240_v_1_8.md`, a documentação FEBRABAN define:

#### Layout SITCS (Contribuição Sindical):

| Campo | Descrição | Posições (base 1) | Posições (base 0) |
|-------|-----------|-------------------|-------------------|
| 08.3U | Capital Social da Empresa | 18-30 | 17-29 |
| 09.3U | Capital Social do Estabelecimento | 31-43 | 30-42 |
| 10.3U | Número de Empregados Contribuintes | 44-52 | 43-51 |
| 11.3U | Total da Remuneração – Contribuintes | 53-65 | 52-64 |
| 12.3U | Total de Empregados do Estabelecimento | 66-74 | 65-73 |
| 13.3U | Código CNAE Contribuinte/Pagador | 75-79 | 74-78 |
| 14.3U | Tipo de Entidade Sindical | 80-80 | 79-79 |
| 15.3U | Código sindical da Entidade Sindical | 81-85 | 80-84 |
| **16.3U** | **Tipo de Arrecadação** | **86-86** | **85-85** |
| 17.3U | Valor Pago pelo Pagador | 87-101 | 86-100 |
| 18.3U | Valor Líquido a ser Creditado | 102-116 | 101-115 |
| 19.3U | Juros / Multa / Encargos | 117-131 | 116-130 |
| 20.3U | Valor de Outros Créditos | 132-146 | 131-145 |
| **21.3U** | **Data da Ocorrência** | **147-154** | **146-153** |
| **22.3U** | **Data da Efetivação do Crédito** | **155-162** | **154-161** |

### 5.2 Layout Real Encontrado nos Arquivos

Os arquivos analisados **NÃO possuem** os campos SITCS (08.3U a 16.3U), resultando em:

| Campo | Posições Documentação (base 0) | Posições Arquivo Real (base 0) | Diferença |
|-------|--------------------------------|--------------------------------|-----------|
| 17.3U | 86-100 | **77-92** | **-9 posições** |
| 18.3U | 101-115 | **92-107** | **-9 posições** |
| 19.3U | 116-130 | **107-122** | **-9 posições** |
| 20.3U | 131-145 | **122-137** | **-9 posições** |
| **21.3U** | **146-153** | **137-145** | **-9 posições** |
| **22.3U** | **154-161** | **145-153** | **-9 posições** |

### 5.3 Causa Raiz da Divergência

A diferença de **9 posições** sugere que:

1. Os campos SITCS (08.3U a 15.3U) ocupam **68 posições** (17-84, base 0)
2. O Campo 16.3U ocupa **1 posição** (85, base 0)
3. Total: **69 posições** que não estão presentes nos arquivos reais

No entanto, a diferença observada é de apenas **9 posições**, indicando que:
- Os campos entre 62-77 podem estar presentes mas vazios (ex: IOF)
- O Campo 16.3U definitivamente **não está presente**
- Os campos seguintes começam imediatamente após o Campo 15.3U (ou equivalente)

---

## 6. Impacto no Sistema

### 6.1 Impacto Atual

Com o schema atual ajustado para o layout SEM_SITCS:

✅ **Funciona corretamente para:**
- 5.200 arquivos (99,1% dos arquivos analisados)
- Arquivos do Banco 104 (Caixa)
- Arquivos do Banco 001 (Banco do Brasil)
- **Todas as extensões** de arquivo (`.ret`, `.A2T9R5`, `.A2U7F4`, `.A2U1W8`, `.A2U5M7`)

❌ **Pode falhar para:**
- Arquivos que seguem estritamente a documentação FEBRABAN com campos SITCS
- Arquivos de outros bancos que usam o layout padrão documentado

### 6.2 Impacto se Seguíssemos a Documentação

Se o schema seguisse estritamente a documentação FEBRABAN:

❌ **Falharia para:**
- 5.200 arquivos (99,1% dos arquivos analisados)
- Todos os arquivos do Banco 104
- Todos os arquivos do Banco 001
- **Todas as extensões** de arquivo analisadas

✅ **Funcionaria apenas para:**
- Arquivos hipotéticos que seguem o layout SITCS completo
- Arquivos que possuem o Campo 16.3U na posição 85

### 6.3 Dados Incorretos que Seriam Extraídos

Se seguíssemos a documentação para o arquivo `[20251231]R219695CEF3003.RET`:

| Campo | Valor Correto (Layout Real) | Valor Incorreto (Documentação) | Diferença |
|-------|----------------------------|--------------------------------|-----------|
| Valor Pago | R$ 166,74 | R$ 1.667.400,00 | **10.000x maior** |
| Valor Líquido | R$ 166,74 | R$ 1.667.400,00 | **10.000x maior** |
| Data Ocorrência | 30/12/2025 | 20/12/2060 (inválida) | **Data inválida** |
| Data Crédito | 02/01/2026 | 00/00/0000 (vazia) | **Data ausente** |

---

## 7. Recomendações

### 7.1 Solução Imediata (Atual)

**Status:** ✅ **IMPLEMENTADA**

O schema atual está configurado para o layout SEM_SITCS, funcionando corretamente para **99,1% dos arquivos analisados**, incluindo todas as extensões de arquivo encontradas.

**Arquivos afetados:**
- `src/services/read-ret-file/schema/cnab-240-30/segmento-u.ts`
- `src/services/read-ret-file/schema/cnab-240-40/segmento-u.ts`

**Campos configurados:**
- `paidAmount`: 77-92 (ao invés de 86-100)
- `receivedValue`: 92-107 (ao invés de 101-115)
- `otherCredits`: 107-122 (ao invés de 116-130)
- `otherExpenses`: 122-137 (ao invés de 131-145)
- `paymentDate`: 137-145 (ao invés de 146-153)
- `creditDate`: 145-153 (ao invés de 154-161)

### 7.2 Solução Recomendada (Futuro)

Implementar **detecção automática de layout** baseada em:

1. **Presença do Campo 16.3U** na posição 85
   - Se presente → usar layout SITCS (documentação)
   - Se ausente → usar layout SEM_SITCS (atual)

2. **Validação de datas**
   - Tentar extrair data nas posições da documentação
   - Se inválida, tentar nas posições alternativas
   - Escolher a posição que retorna data válida

3. **Tamanho da linha**
   - Linhas com 240 caracteres podem ter ambos os layouts
   - Validar campos específicos para determinar qual usar

---

## 8. Conclusão

A divergência identificada é **crítica** e afeta **99,1% dos arquivos processados** (5.200 de 5.246 arquivos analisados). O schema atual está **corretamente configurado** para o layout real encontrado nos arquivos, mas **divergente da documentação oficial FEBRABAN**.

**Importante:** A análise incluiu **todas as extensões de arquivo** encontradas (`.ret`, `.A2T9R5`, `.A2U7F4`, `.A2U1W8`, `.A2U5M7`), totalizando **5.313 arquivos** analisados, dos quais **5.246 contêm Segmento U** e foram incluídos na análise de layout.

**Recomendação:** Manter o schema atual funcionando enquanto se implementa uma solução de detecção automática de layout para garantir compatibilidade com ambos os formatos.

---

## 9. Anexos

### 9.1 Arquivos Analisados

- **Total de arquivos encontrados:** 5.313 arquivos
- **Arquivos com Segmento U identificado:** 5.246 arquivos
- **Extensões analisadas:**
  - `.ret` / `.RET`: 2.297 arquivos (2.230 com Segmento U)
  - `.A2T9R5`: 364 arquivos (364 com Segmento U)
  - `.A2U7F4`: 1.353 arquivos (1.353 com Segmento U)
  - `.A2U1W8`: 1.225 arquivos (1.225 com Segmento U)
  - `.A2U5M7`: 74 arquivos (74 com Segmento U)

**Observação importante:** A análise inicial incluía apenas arquivos `.ret`, mas após verificação completa, foram identificados e analisados arquivos com **5 extensões diferentes**, todas apresentando o mesmo padrão de layout SEM_SITCS.

### 9.2 Referências

- Documentação FEBRABAN: `docs/CNAB/parse_CNAB_240.md`
- Layout CNAB 240: `docs/CNAB/Layout CNAB_240_v_1_8.md`
- Documentação de divergência anterior: `docs/CNAB/SEGMENTO_U_DIVERGENCIA.md`

---
