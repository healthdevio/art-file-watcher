# Leitor de Arquivos de Retorno CNAB

Este módulo é responsável por ler e processar arquivos de retorno nos formatos CNAB 240 e CNAB 400.

## Estrutura do Módulo

```text
read-ret-file/
├── constants.ts              # Constantes de identificação (tipos de registro, segmentos)
├── interfaces/               # Interfaces TypeScript para os dados parseados
│   ├── CNAB-240.ts          # Tipos para CNAB 240
│   ├── CNAB-400.ts          # Tipos para CNAB 400
│   └── common.ts            # Tipos comuns entre layouts
├── schema/                   # Schemas de mapeamento posição → campo
│   ├── cnab-240-schemas.ts  # Schemas CNAB 240
│   ├── cnab-400-schemas.ts  # Schemas CNAB 400
│   └── core/                # Utilitários de parsing
├── helpers/                  # Parsers e utilitários
│   ├── line-parsers/        # Parsers específicos por tipo de linha
│   ├── line-type-identifier.ts  # Identificador de tipo de linha
│   └── ...
└── README.md                # Este arquivo
```

## Como Adicionar Suporte a Novas Leituras

### 1. Adicionar Suporte a Novo Segmento/Tipo de Linha

Para adicionar suporte a um novo segmento (ex: Segmento Y, Segmento J) ou tipo de linha:

#### Passo 1: Definir a Interface TypeScript

Edite `interfaces/CNAB-240.ts` (ou `CNAB-400.ts` para CNAB 400) e adicione o novo tipo:

```typescript
/**
 * Segmento X - Descrição do segmento (tipo 3, segmento X)
 */
export type SegmentoX = CommonRecordFields &
  CommonBankFields &
  CommonSequenceFields & {
    /** Tipo de segmento (X) */
    segmentType: string;
    /** Código do lote */
    lotCode: string;
    // ... outros campos específicos
  };
```

**Importante:** Se usar campos comuns (conta, agência, etc.), use os tipos `Common*` de `common.ts`.

#### Passo 2: Atualizar o Union Type

Adicione o novo tipo ao `LineCNAB240Payload` (ou equivalente):

```typescript
export type LineCNAB240Payload =
  | HeaderLoteCNAB240
  | SegmentoT
  | SegmentoU
  | SegmentoX  // ← Novo tipo
  | TrailerLoteCNAB240
  | TrailerArquivoCNAB240;
```

#### Passo 3: Adicionar Constante

Em `constants.ts`, adicione a constante do novo segmento:

```typescript
export const CNAB240_SEGMENT_TYPES = {
  T: 'T',
  U: 'U',
  X: 'X', // ← Novo segmento
  Y: 'Y',
  // ...
} as const;
```

#### Passo 4: Criar o Schema de Mapeamento

Em `schema/cnab-240-schemas.ts`, defina o schema com as posições exatas dos campos:

```typescript
/** Schema para Segmento X CNAB 240 */
export const SEGMENTO_X_SCHEMA: LineSchema<SegmentoX> = combineSchemas<SegmentoX>(
  COMMON_RECORD_FIELDS_SCHEMA_240,
  {
    bankCode: { start: 0, end: 3, extractor: 'string' },
    lotCode: { start: 3, end: 7, extractor: 'string' },
    sequenceNumber: { start: 8, end: 13, extractor: 'string' },
    segmentType: { start: 13, end: 14, extractor: 'string' },
    // ... mapear outros campos com suas posições exatas
  }
);
```

**Nota sobre posições:** As posições são **zero-indexed** (começam em 0). Para encontrar as posições corretas:

- Consulte a documentação oficial do layout CNAB (PDFs em `docs/CNAB/`)
- Ou analise um arquivo de exemplo: `substring(start, end)` em JavaScript

#### Passo 5: Criar o Parser

Crie um novo arquivo em `helpers/line-parsers/segmento-x-parser-240.ts`:

```typescript
import { CNAB240_MIN_LINE_LENGTH, CNAB240_RECORD_TYPES, CNAB240_SEGMENT_TYPES } from '../../constants';
import { SegmentoX } from '../../interfaces/CNAB-240';
import { SEGMENTO_X_SCHEMA } from '../../schema/cnab-240-schemas';
import { FieldExtractors } from '../../schema/core/extractors';
import { SchemaParser } from '../../schema/core/parser';

/** Parser para segmento X CNAB 240 */
export class SegmentoXParser240 {
  static parse(line: string, _version: '030' | '040'): SegmentoX | null {
    return SchemaParser.parse<SegmentoX>(line, SEGMENTO_X_SCHEMA, {
      minLength: CNAB240_MIN_LINE_LENGTH,
      validator: l => {
        const recordType = FieldExtractors.extractString(l, 7, 8);
        const segmentType = FieldExtractors.extractString(l, 13, 14);
        return recordType === CNAB240_RECORD_TYPES.DETAIL && segmentType === CNAB240_SEGMENT_TYPES.X;
      },
    });
  }
}
```

#### Passo 6: Registrar no LineParser

Em `helpers/line-parsers/line-parser-240.ts`:

1. Importe o novo parser:
   `import { SegmentoXParser240 } from './segmento-x-parser-240';`

2. Adicione ao objeto `parsers`:
   ```typescript
     const parsers = {
     // ...
     SEGMENTO_X: () => SegmentoXParser240.parse(line, version),
     // ...
    };
   ```

#### Passo 7: Atualizar o Identificador de Tipo

Em `helpers/line-type-identifier.ts`:

1. Adicione ao tipo `CNAB240LineType`:
```typescript
export type CNAB240LineType =
  | 'HEADER_LOTE'
  | 'SEGMENTO_T'
  | 'SEGMENTO_X'  // ← Novo tipo
  // ...
  | 'UNKNOWN';
```

2. Adicione o case no `identifySegmentType`:
```typescript
switch (segmentType) {
  // ...
  case CNAB240_SEGMENT_TYPES.X:
    return 'SEGMENTO_X';
  // ...
}
```

---

### 2. Modificar Layout Existente (Alteração de Banco)

Quando um banco modifica o layout padrão (novas versões, campos diferentes):

#### Passo 1: Verificar a Documentação

- Consulte o manual específico do banco
- Identifique as diferenças em relação ao layout padrão
- Determine se é uma variação que requer tratamento especial

#### Passo 2: Criar Schema Alternativo (se necessário)

Se as mudanças forem significativas, crie um schema separado:

```typescript
/** Schema para Segmento T CNAB 240 - Versão Especial Banco X */
export const SEGMENTO_T_SCHEMA_BANCO_X: LineSchema<SegmentoT> = combineSchemas<SegmentoT>(
  // ... campos específicos do banco
);
```

#### Passo 3: Adicionar Lógica Condicional no Parser

No parser correspondente, adicione lógica para escolher o schema correto:

```typescript
static parse(line: string, version: '030' | '040', bankCode?: string): SegmentoT | null {
  // Escolher schema baseado no banco ou versão
  const schema = bankCode === 'XXX' 
    ? SEGMENTO_T_SCHEMA_BANCO_X 
    : version === '030' 
      ? SEGMENTO_T_SCHEMA_030 
      : SEGMENTO_T_SCHEMA_040;
  
  return SchemaParser.parse<SegmentoT>(line, schema, { /* ... */ });
}
```

**Nota:** Se possível, evite variações por banco. Use a documentação FEBRABAN oficial como referência primária.

---

### 3. Adicionar Suporte a Novo Layout CNAB

Para adicionar suporte a um layout completamente novo (ex: CNAB 500, se existir):

#### Passo 1: Criar Estrutura Base

1. Crie `interfaces/CNAB-500.ts` (ou nome apropriado)
2. Crie `schema/cnab-500-schemas.ts`
3. Crie `helpers/line-parsers/line-parser-500.ts`
4. Adicione constantes em `constants.ts`

#### Passo 2: Seguir o Padrão Existente

- Use os arquivos de CNAB 240 ou 400 como template
- Mantenha a mesma estrutura de pastas e nomenclatura
- Siga o mesmo padrão de interfaces e schemas

#### Passo 3: Integrar no Serviço Principal

Atualize `read-ret-file.service.ts` para detectar e processar o novo layout.

---

## Dicas e Boas Práticas

### Encontrar Posições de Campos

Para identificar as posições corretas de campos em uma linha:

```bash
# Usando Node.js
node -e "const line = 'sua linha aqui'; console.log('Campo (start-end):', line.substring(start, end));"
```

Ou analise o arquivo com um editor de texto que mostra posições de coluna.

### Testes

Sempre crie testes para novos segmentos/parsers:

1. Crie um arquivo de teste em `__tests__/read-ret-file/`
2. Use arquivos reais ou fixtures de exemplo
3. Teste casos válidos e inválidos
4. Verifique que campos numéricos são parseados corretamente

### Documentação

- Mantenha comentários JSDoc nos tipos e funções
- Documente campos não óbvios
- Referencie a documentação oficial quando relevante

### Validação

- Use o validador no schema para garantir que apenas linhas válidas sejam parseadas
- Valide tipo de registro + tipo de segmento
- Considere validar tamanho mínimo da linha

---

## Referências

- **Documentação CNAB:** `docs/CNAB/`
  - `Layout CNAB_240_v_1_8.pdf` - Especificação CNAB 240
  - `Layout CNAB_400_v_06_2024.pdf` - Especificação CNAB 400
- **FEBRABAN:** Especificações oficiais do layout CNAB
- **Arquivos de Exemplo:** `volumes/test/` - Arquivos `.RET` e `.A2T9R5` para teste

---

## Exemplo Completo: Segmento Y

Como referência, veja a implementação completa do Segmento Y:

- Interface: `interfaces/CNAB-240.ts` → `SegmentoY`
- Schema: `schema/cnab-240-schemas.ts` → `SEGMENTO_Y_SCHEMA`
- Parser: `helpers/line-parsers/segmento-y-parser-240.ts`
- Registro: `helpers/line-parsers/line-parser-240.ts`
- Identificação: `helpers/line-type-identifier.ts`

Este exemplo segue exatamente o padrão descrito acima e serve como template para novos segmentos.
