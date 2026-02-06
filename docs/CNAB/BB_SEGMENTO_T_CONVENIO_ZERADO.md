# Banco do Brasil (BB) - Convênio Zerado no Segmento T

## Contexto

Em arquivos de **retorno** CNAB 240 do **Banco do Brasil (código 001)**, o campo **convênio** (código do beneficiário) **não** está nas posições padrão definidas pela FEBRABAN/CAIXA. As posições 23-30 (base 1) ou 23-29 (base 0) vêm preenchidas com zeros.

O convênio real está **nos primeiros 7 dígitos do Nosso Número**.

---

## Quando aplicar

| Critério        | Valor                                                          |
| --------------- | -------------------------------------------------------------- |
| Tipo de arquivo | Retorno CNAB 240                                               |
| Banco           | 001 (Banco do Brasil)                                          |
| Segmento        | T (dados do título)                                            |
| Sintoma         | `agreement`/`convênio` extraído como `"000000"` ou `"0000000"` |

**Arquivos típicos:** IEDCBR (Identificação Eletrônica de Dados – Cobrança Bancária de Retorno).

---

## Layout padrão vs BB

### Padrão FEBRABAN/CAIXA (posições base 0)

- **Convênio (agreement):** posições 23-29 ou 23-30 (7 dígitos)
- **Nosso Número (regionalNumber):** posições 38-56 ou 37-56

### Banco do Brasil (001)

- **Posições 23-29:** sempre zeros
- **Convênio:** primeiros 7 dígitos do Nosso Número
- **Nosso Número:** posições **37-54** (17 dígitos)
- **Convênio:** posições **37-44** (7 dígitos)

---

## Posições exatas (base 0, end exclusive)

```
Posição  Descrição                    Padrão CAIXA    BB (001)
-------- ---------------------------- --------------- ---------------
0-3      Código do banco              -                001
7-8      Tipo de registro             3                3
13-14    Tipo de segmento             T                T
17-22    Agência                      5 dígitos        5 dígitos
22-23    DV agência                   1 dígito         1 dígito
23-30    Convênio                     ✓ 7 dígitos      ✗ zeros
30-36    Conta + DV                   -                -
37-44    -                            -                ✓ Convênio (7 díg)
37-54    Nosso Número                 início em 38     ✓ 17 dígitos (37-54)
```

**Exemplo de linha BB (Segmento T):**

```
0010001300399T 060575090000000001945 37110568306709486   78306709486...
               ^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^
               zeros nas pos 23-35  Nosso Número (37-54)
                                   ^^^^^^^^
                                   Convênio = 3711056
```

---

## Implementação mínima

### Opção A: Lógica condicional no parser existente

Antes de extrair o convênio, verificar o banco:

```javascript
// Pseudocódigo – adaptar ao parser do seu projeto
function parseSegmentoT(line) {
  const bankCode = line.substring(0, 3);

  if (bankCode === '001') {
    // BB: convênio = primeiros 7 dígitos do Nosso Número
    const nossoNumero = line.substring(37, 54); // 17 dígitos
    const convenio = nossoNumero.substring(0, 7); // primeiros 7

    return {
      agreement: convenio,
      regionalNumber: nossoNumero.trim(),
      // ... demais campos com posições padrão
    };
  }

  // Padrão: convênio em 23-30
  return {
    agreement: line.substring(23, 30).trim(),
    // ...
  };
}
```

### Opção B: Override de posições no schema

Se o projeto usa schema/mapeamento de posições:

```javascript
// Mapeamento de posições – BB
const SEGMENTO_T_BB = {
  agreement: { start: 37, end: 44 }, // primeiros 7 do Nosso Número
  regionalNumber: { start: 37, end: 54 }, // Nosso Número completo (17 díg)
  // Demais campos: usar posições do layout padrão v033
};

// No parser:
const schema = line.substring(0, 3) === '001' ? SEGMENTO_T_BB : SEGMENTO_T_PADRAO;
```

### Opção C: Pós-processamento

Se não quiser alterar o parser:

```javascript
// Após parsear Segmento T
if (segmento.bankCode === '001' && (segmento.agreement === '000000' || segmento.agreement === '0000000')) {
  const regionalNumber = line.substring(37, 54).trim();
  segmento.agreement = regionalNumber.substring(0, 7);
  segmento.regionalNumber = regionalNumber;
}
```

---

## Checklist de implementação

1. [ ] Identificar onde o Segmento T é parseado no fluxo de retorno.
2. [ ] Verificar se `bankCode` vem de posições 0-3 da linha.
3. [ ] Para `bankCode === '001'`, usar:
   - `agreement` = `line.substring(37, 44)` ou `nossoNumero.substring(0, 7)`
   - `regionalNumber` = `line.substring(37, 54).trim()`
4. [ ] Garantir que Nosso Número comece na posição **37** (não 38).
5. [ ] Manter posições de Valor Nominal (81-96), Tarifa (198-213) e demais campos conforme padrão.

---

## Validação

**Linha de teste (BB, convênio 3711056):**

```
0010001300399T 060575090000000001945 37110568306709486   78306709486     03012026...
```

- Posição 37-44: `3711056` → convênio correto
- Posição 37-54: `37110568306709486` → Nosso Número completo

**Convênios zerados no padrão:** posições 23-29 = `000000`.

---

## Referências

- Layout padrão CNAB 240: convênio em 24-30 (base 1)
- Banco do Brasil: layout próprio com convênio embutido no Nosso Número
- Arquivos IEDCBR do BB utilizam esse formato
