# Análise de Divergência - Segmento U CNAB 240

## Problema Identificado

O arquivo `[20251231]R219695CEF3003.RET` apresenta divergências entre as posições documentadas e as posições reais dos campos no Segmento U.

## Dados do Arquivo Real

- **Tamanho da linha**: 233 caracteres (documentação espera 240)
- **Banco**: 104 (Caixa Econômica Federal)
- **Layout Version**: 040

## Comparação: Documentação vs Arquivo Real

### Campos Monetários (conferem com documentação)

| Campo | Documentação (base 0) | Arquivo Real | Status |
|-------|---------------------|--------------|--------|
| Juros/Multa/Encargos | 17-32 | 17-32 | ✅ OK |
| Desconto | 32-47 | 32-47 | ✅ OK |
| Abatimento | 47-62 | 47-62 | ✅ OK |
| Valor Pago | 86-101 | 86-101 | ✅ OK |
| Valor Líquido | 101-116 | 101-116 | ✅ OK |
| Outros Créditos | 116-131 | 116-131 | ✅ OK |
| Outras Despesas | 131-146 | 131-146 | ✅ OK |

### Campos de Data (DIVERGENTES)

| Campo | Documentação (base 0) | Arquivo Real | Diferença |
|-------|---------------------|--------------|-----------|
| Data da Ocorrência | 146-153 | **137-145** | **-9 posições** |
| Data da Efetivação do Crédito | 154-161 | **145-153** | **-9 posições** |

## Análise Detalhada

### Posições Reais no Arquivo

```
Posição 130-150 do arquivo:
130: 0
131: 0  ← Campo 20.3U (Outras Despesas) termina aqui
132: 0
133: 0
134: 0
135: 0
136: 0
137: 3  ← Data Ocorrência COMEÇA AQUI (não em 146!)
138: 0
139: 1
140: 2
141: 2
142: 0
143: 2
144: 5
145: 0  ← Data Ocorrência termina aqui, Data Crédito COMEÇA AQUI
146: 2
147: 0
148: 1
149: 2
150: 0
```

### Valores Extraídos

- **Data Ocorrência (137-145)**: `30122025` → `30/12/2025` ✅
- **Data Crédito (145-153)**: `02012026` → `02/01/2026` ✅

### Valores que a Documentação Esperaria

- **Data Ocorrência (146-154)**: `20120260` → **INVÁLIDO** ❌
- **Data Crédito (154-162)**: `00000000` → **VAZIO** ❌

## Possíveis Causas

1. **Layout Específico do Banco**: A Caixa pode usar um layout ligeiramente diferente
2. **Campos Faltando**: Pode haver campos entre 62-86 que não estão presentes neste arquivo
3. **Versão Específica**: Pode ser uma variação do layout 040 específica para este tipo de arquivo
4. **Truncamento**: A linha pode estar truncada ou ter campos opcionais ausentes

## Recomendações

1. **Verificar outros arquivos** do mesmo banco para confirmar se o padrão se repete
2. **Consultar documentação específica** da Caixa para CNAB 240 versão 040
3. **Criar schema específico** para este banco se o padrão for consistente
4. **Validar tamanho da linha** antes de aplicar o schema

## Próximos Passos

- [ ] Verificar outros arquivos CNAB 240 do banco 104
- [ ] Consultar documentação oficial da Caixa
- [ ] Implementar detecção automática de layout baseado no tamanho da linha
- [ ] Criar schemas específicos por banco se necessário
