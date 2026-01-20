# Análise Técnica e Mapeamento de Dados dos Segmentos T e U para Parsing de Arquivo Retorno CNAB 240 (SITCS)

## Introdução

Este documento serve como um guia técnico detalhado para desenvolvedores encarregados de implementar um algoritmo de parsing para o Arquivo Retorno do padrão CNAB 240, com foco específico na Contribuição Sindical Urbana (SITCS). O objetivo central é fornecer um mapeamento de dados canônico para os Segmentos T e U, detalhando a extração de seus campos e a subsequente conversão para um formato JSON estruturado. A compreensão da estrutura, função e sinergia entre esses dois segmentos é fundamental para garantir a correta e íntegra interpretação das movimentações de títulos.

--------------------------------------------------------------------------------

## 1. Contexto Estrutural do Arquivo Retorno CNAB 240

Antes de abordar o parsing dos segmentos de detalhe, é estrategicamente imperativo compreender a arquitetura hierárquica do arquivo CNAB 240. Para que um algoritmo possa extrair e processar os Segmentos T e U de forma eficiente, ele deve ser capaz de, primeiramente, identificar e isolar os registros de detalhe (Tipo 3) dentro da estrutura completa do arquivo, ignorando os registros de cabeçalho e rodapé que servem a propósitos de controle e totalização.

### 1.1. Hierarquia dos Registros

O arquivo CNAB 240 é organizado em uma estrutura hierárquica bem definida, na qual cada tipo de registro desempenha uma função específica, garantindo a integridade e o processamento sequencial dos dados em lote.

* Registro Tipo 0 (Header de Arquivo): Primeira linha do arquivo, responsável pela abertura da comunicação e identificação global do arquivo, contendo dados da empresa, do banco e data/hora de geração.
* Registro Tipo 1 (Header de Lote): Marca o início de um lote de serviço, especificando o tipo de operação (neste caso, Retorno) e o serviço processado (Cobrança Registrada).
* Registro Tipo 3 (Detalhe): Núcleo informacional do arquivo, contendo os dados transacionais. Este registro é subdividido em segmentos que detalham cada movimentação. Conforme a finalidade do arquivo, os segmentos variam: um arquivo de remessa utiliza os segmentos P e Q, enquanto o arquivo de retorno, foco deste guia, utiliza obrigatoriamente os segmentos T e U para reportar o processamento dos títulos SITCS.
* Registro Tipo 5 (Trailer de Lote): Finaliza um lote de serviço, contendo totalizadores de controle, como a quantidade de registros e a somatória de valores, para validação da integridade do lote.
* Registro Tipo 9 (Trailer de Arquivo): Última linha do arquivo, encerrando a comunicação e apresentando os totais consolidados de todo o arquivo, como a quantidade total de lotes e registros.

### 1.2. Identificação Técnica dos Segmentos T e U

Um algoritmo de parsing deve ler o arquivo linha por linha, aplicando uma lógica de identificação precisa para isolar os Segmentos T e U. Essa identificação é realizada por meio de códigos fixos em posições específicas da linha de 240 caracteres.

1. Identificar o Registro de Detalhe: Verificar o caractere na posição 8 da linha. Se o valor for '3', a linha corresponde a um registro de detalhe.
2. Diferenciar o Segmento: Uma vez que a linha é identificada como detalhe, verificar o caractere na posição 14. Se o valor for 'T' ou 'U', a linha corresponde a um dos segmentos de interesse.

Esta lógica de identificação constitui o ponto de entrada essencial para o fluxo de processamento, permitindo que o parser se concentre exclusivamente na extração dos dados contidos nos segmentos de detalhe relevantes.

--------------------------------------------------------------------------------

## 2. Análise Funcional e Sinergia dos Segmentos T e U

Além da extração posicional, a compreensão funcional dos segmentos T e U é crucial para o desenvolvedor. Entender o "o quê" e o "porquê" de cada campo e segmento habilita a construção de um modelo de dados JSON mais lógico e coeso, tratando a movimentação de um título como uma entidade transacional única e completa, o que agrega valor aos sistemas consumidores dessa informação.

### 2.1. Função do Segmento T: Movimentação na Carteira

O Segmento T é o registro inicial do detalhe de retorno. Sua função primária é relatar o estado da transação, identificando o título, o pagador e a ocorrência principal, seja ela uma confirmação, rejeição ou liquidação.

* Identificação do Título: Contém os identificadores únicos da transação, como o "Nosso Número" (gerado pela CAIXA) e o "Seu Número" (número do documento definido pela empresa).
* Dados Financeiros Nominais: Apresenta as informações originais do título, como sua data de vencimento e o valor original.
* Dados do Pagador: Inclui informações de identificação do contribuinte, como nome e CPF/CNPJ.
* Motivo da Ocorrência: Campo-chave que utiliza códigos para detalhar o status da movimentação. Estes códigos são essenciais para que a lógica da aplicação possa tratar programaticamente as rejeições, liquidações e outros status, conforme a tabela de códigos da nota *C047 do manual.
* Tarifas: Informa o valor de custas ou tarifas de serviço cobradas pela CAIXA na operação.

### 2.2. Função do Segmento U: Detalhamento de Títulos Pagos

O Segmento U atua como um complemento obrigatório ao Segmento T, fornecendo os detalhes financeiros da liquidação e dados específicos da arrecadação SITCS. Seu foco reside nos valores efetivamente arrecadados e creditados.

* Valores do Pagamento: Detalha os valores da transação, incluindo o valor total pago, acréscimos (juros/multa) e o valor líquido a ser efetivamente creditado na conta da entidade.
* Datas de Controle: Fornece as datas cruciais do fluxo financeiro: a data da ocorrência (quando o pagamento foi efetuado) e a data do crédito (quando o valor foi disponibilizado em conta).
* Dados Específicos SITCS: Contém informações exclusivas da Contribuição Sindical Urbana, como o Capital Social, o Número de Empregados e a Remuneração Total da empresa contribuinte.
* Dados da Entidade: Apresenta o código sindical vinculado ao crédito, garantindo a correta atribuição dos valores arrecadados.

2.3. Vínculo e Obrigatoriedade

Os segmentos T e U são funcionalmente inseparáveis. Para cada título movimentado no arquivo de retorno, a CAIXA gera um par de registros (T e U) que, juntos, compõem a visão completa da transação. Eles são intrinsecamente vinculados pelo "código de movimento" e pelo "número sequencial do registro" dentro do lote.

Ao projetar o objeto JSON de saída, é fundamental que o parser trate as informações de um par T e U como uma única entidade transacional. O algoritmo deve ler um Segmento T e, em seguida, o Segmento U subsequente para consolidar todas as informações, garantindo a integridade e a completude dos dados.

--------------------------------------------------------------------------------

## 3. Mapeamento Detalhado de Campos: Segmento T

As tabelas a seguir representam o mapeamento canônico entre o layout de retorno da CAIXA e a implementação do parser. A inclusão deliberada das colunas de índice base 0 visa eliminar erros comuns de off-by-one, traduzindo as posições do manual (base 1) para a indexação utilizada pela maioria das linguagens de programação, o que constitui uma ponte crucial entre a especificação formal e a codificação prática.

| Campo | Descrição Resumida | Pos. (De-Até) | Tam. | Formato | Índice Inicial | Índice Final | Código Nota |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **01.3T** | Código do Banco na Compensação | 1-3 | 3 | Num | 0 | 2 | G001 |
| **02.3T** | Lote de Serviço | 4-7 | 4 | Num | 3 | 6 | *G002 |
| **03.3T** | Tipo de Registro | 8-8 | 1 | Num | 7 | 7 | *G003 |
| **04.3T** | Número Sequencial Registro no Lote | 9-13 | 5 | Num | 8 | 12 | *G038 |
| **05.3T** | Código Segmento do Registro Detalhe | 14-14 | 1 | Alfa | 13 | 13 | *G039 |
| **06.3T** | Uso Exclusivo FEBRABAN/CNAB | 15-15 | 1 | Alfa | 14 | 14 | G004 |
| **07.3T** | Código de Movimento Retorno | 16-17 | 2 | Num | 15 | 16 | *C044 |
| **08.3T** | Uso Exclusivo CAIXA | 18-22 | 5 | Num | 17 | 21 | - |
| **09.3T** | Uso Exclusivo CAIXA | 23-23 | 1 | Num | 22 | 22 | - |
| **10.3T** | Código do Convênio no Banco | 24-30 | 7 | Num | 23 | 29 | *G007 |
| **11.3T** | Uso Exclusivo da CAIXA | 31-33 | 3 | Num | 30 | 32 | - |
| **12.3T** | Número do Banco de Pagadores | 34-36 | 3 | Num | 33 | 35 | C079 |
| **13.3T** | Uso Exclusivo da CAIXA | 37-40 | 4 | Num | 36 | 39 | - |
| **14.3T** | Modalidade Nosso Número | 41-42 | 2 | Num | 40 | 41 | *G069 |
| **15.3T** | Identificação do Título no Banco | 43-57 | 15 | Num | 42 | 56 | *G069 |
| **16.3T** | Uso Exclusivo CAIXA | 58-58 | 1 | Num | 57 | 57 | - |
| **17.3T** | Código da Carteira | 59-59 | 1 | Num | 58 | 58 | C006 |
| **18.3T** | Número do Documento de Cobrança | 60-70 | 11 | Alfa | 59 | 69 | *C011 |
| **19.3T** | Uso Exclusivo CAIXA | 71-74 | 4 | Alfa | 70 | 73 | - |
| **20.3T** | Data de Vencimento do Título | 75-82 | 8 | Num | 74 | 81 | *C012 |
| **21.3T** | Valor Nominal do Título | 83-97 | 15 | 13,2 Num | 82 | 96 | G070 |
| **22.3T** | Código do Banco Cobrador/Recebedor | 98-100 | 3 | Num | 97 | 99 | C045 |
| **23.3T** | Código da Agência Cobr/Receb | 101-105 | 5 | Num | 100 | 104 | C086 |
| **24.3T** | Dígito Verificador da Agência Cobr/Rec | 106-106 | 1 | Num | 105 | 105 | G009 |
| **25.3T** | Identificação do Título na Empresa | 107-131 | 25 | Alfa | 106 | 130 | C011 |
| **26.3T** | Código da Moeda | 132-133 | 2 | Num | 131 | 132 | G065 |
| **27.3T** | Tipo de Inscrição | 134-134 | 1 | Num | 133 | 133 | *G005 |
| **28.3T** | Número de Inscrição | 135-149 | 15 | Num | 134 | 148 | *G006 |
| **29.3T** | Nome | 150-189 | 40 | Alfa | 149 | 188 | - |
| **30.3T** | Uso Exclusivo FEBRABAN/CNAB | 190-199 | 10 | Alfa | 189 | 198 | - |
| **31.3T** | Valor da Tarifa / Custas | 200-214 | 15 | 13,2 Num | 199 | 213 | G076 |
| **32.3T** | Motivo da Ocorrência | 215-224 | 10 | Alfa | 214 | 223 | *C047 |
| **33.3T** | Uso Exclusivo FEBRABAN/CNAB | 225-240 | 16 | Alfa | 224 | 239 | G004 |

A seguir, será apresentado o mapeamento equivalente para o Segmento U, que complementa estas informações com os detalhes financeiros da liquidação.

--------------------------------------------------------------------------------

## 4. Mapeamento Detalhado de Campos: Segmento U

Esta tabela detalha o layout do Segmento U, que complementa o Segmento T com informações financeiras efetivas da liquidação e dados específicos da arrecadação SITCS. A utilização dos índices de base 0 é igualmente fundamental para a correta implementação do parser deste segmento.

| Campo | Descrição Resumida | Pos. (De-Até) | Tam. | Formato | Índice Inicial | Índice Final | Código Nota |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **01.3U** | Código do Banco na Compensação | 1-3 | 3 | Num | 0 | 2 | G001 |
| **02.3U** | Lote de Serviço | 4-7 | 4 | Num | 3 | 6 | *G002 |
| **03.3U** | Tipo de Registro | 8-8 | 1 | Num | 7 | 7 | *G003 |
| **04.3U** | Nº Sequencial do Registro no Lote | 9-13 | 5 | Num | 8 | 12 | *G038 |
| **05.3U** | Cód. Segmento do Registro Detalhe | 14-14 | 1 | Alfa | 13 | 13 | *G039 |
| **06.3U** | Uso Exclusivo FEBRABAN/CNAB | 15-15 | 1 | Alfa | 14 | 14 | G004 |
| **07.3U** | Código de Movimento Retorno | 16-17 | 2 | Num | 15 | 16 | *C044 |
| **08.3U** | Capital Social da Empresa | 18-30 | 13 | 11,2 Num | 17 | 29 | C098 |
| **09.3U** | Capital Social do Estabelecimento | 31-43 | 13 | 11,2 Num | 30 | 42 | C099 |
| **10.3U** | Número de Empregados Contribuintes | 44-52 | 9 | Num | 43 | 51 | C100 |
| **11.3U** | Total da Remuneração – Contribuintes | 53-65 | 13 | 11,2 Num | 52 | 64 | C101 |
| **12.3U** | Total de Empregados do Estabelecimento | 66-74 | 9 | Num | 65 | 73 | C102 |
| **13.3U** | Código CNAE Contribuinte/Pagador | 75-79 | 5 | Num | 74 | 78 | C103 |
| **14.3U** | Tipo de Entidade Sindical | 80-80 | 1 | Num | 79 | 79 | C105 |
| **15.3U** | Código sindical da Entidade Sindical | 81-85 | 5 | Num | 80 | 84 | C106 |
| **16.3U** | Tipo de Arrecadação | 86-86 | 1 | Alfa | 85 | 85 | - |
| **17.3U** | Valor Pago pelo Pagador | 87-101 | 15 | 13,2 Num | 86 | 100 | C052 |
| **18.3U** | Valor Líquido a ser Creditado | 102-116 | 15 | 13,2 Num | 101 | 115 | G078 |
| **19.3U** | Juros / Multa / Encargos | 117-131 | 15 | 13,2 Num | 116 | 130 | C048 |
| **20.3U** | Valor de Outros Créditos | 132-146 | 15 | 13,2 Num | 131 | 145 | C055 |
| **21.3U** | Data da Ocorrência | 147-154 | 8 | Num | 146 | 153 | C056 |
| **22.3U** | Data da Efetivação do Crédito | 155-162 | 8 | Num | 154 | 161 | C057 |
| **23.3U** | Uso Exclusivo CAIXA | 163-166 | 4 | Num | 162 | 165 | - |
| **24.3U** | Data do Débito da Tarifa | 167-174 | 8 | Num | 166 | 173 | - |
| **25.3U** | Código do Pagador no Banco | 175-189 | 15 | Num | 174 | 188 | C080 |
| **26.3U** | Uso Exclusivo CAIXA | 190-219 | 30 | Num | 189 | 218 | - |
| **27.3U** | Uso Exclusivo FEBRABAN/CNAB | 220-240 | 21 | Alfa | 219 | 239 | G004 |

Com os dados de ambos os segmentos devidamente mapeados, a seção final fornecerá diretrizes práticas para a conversão dessas informações em um formato estruturado e útil.


--------------------------------------------------------------------------------


## 5. Diretrizes de Implementação para Conversão em JSON

O objetivo final do processo de parsing é traduzir os dados extraídos das linhas de texto em um objeto JSON estruturado, coeso e significativo. Esta seção oferece um modelo conceitual para a estrutura desse objeto e aborda considerações práticas essenciais para uma implementação robusta e livre de erros.

### 5.1. Modelo Conceitual da Estrutura JSON

Recomenda-se uma estrutura JSON que combine os dados do par de segmentos T e U em um único objeto por transação. Agrupar campos relacionados sob chaves descritivas (em camelCase) melhora a legibilidade e a usabilidade dos dados pelo sistema final.

* Objeto Raiz: Um único objeto deve representar a totalidade de uma transação, consolidando as informações dos segmentos T e U.
* Chaves Sugeridas:
  * identificacaoTitulo: Agrupar campos como nossoNumero, seuNumero, dataVencimento e valorNominal. (Dados primariamente do Segmento T).
  * dadosPagador: Agrupar informações do contribuinte, como nome, tipoInscricao e numeroInscricao. (Dados do Segmento T).
  * dadosPagamento: Consolidar os detalhes financeiros da liquidação, como valorPago, valorLiquidoCreditado, dataOcorrencia, dataCredito e acrescimos. (Dados primariamente do Segmento U).
  * dadosArrecadacaoSITCS: Agrupar os campos específicos da Contribuição Sindical, como capitalSocialEmpresa, numeroEmpregados e remuneracaoTotal. (Dados do Segmento U).
  * ocorrenciaRetorno: Agrupar os códigos que descrevem a movimentação, como codigoMovimentoRetorno e motivoOcorrencia. (Dados do Segmento T).

### 5.2. Considerações Práticas

Durante a implementação do parser, o desenvolvedor deve atentar-se aos seguintes pontos cruciais para garantir a precisão dos dados:

* Indexação Base 0: É fundamental utilizar as colunas Índice Inicial (Base 0) e Índice Final (Base 0) das tabelas de mapeamento para extrair os substrings corretamente de cada linha. A maioria das linguagens de programação utiliza indexação base 0, e seguir este padrão evitará erros de deslocamento (off-by-one).
* Tratamento de Tipos de Dados: Os dados extraídos do arquivo são, por natureza, strings e devem ser convertidos para os tipos apropriados:
  * Campos numéricos (Num) com casas decimais implícitas (ex: Valor Pago pelo Pagador, campo 17.3U, posições 87-101) devem ser convertidos de string para um tipo numérico (float/decimal), dividindo o valor inteiro por 100.
  * Campos de data no formato DDMMAAAA devem ser parseados e convertidos para um formato de data padrão, como ISO 8601 (YYYY-MM-DD), para facilitar a manipulação e a ordenação.
  * Campos alfanuméricos (Alfa) frequentemente contêm espaços em branco à direita (padding). É uma boa prática remover esses espaços utilizando uma função trim() para higienizar os dados.
* Vinculação de Segmentos: O algoritmo deve ser projetado para ler sequencialmente. Ao encontrar um Segmento T, ele deve armazenar seus dados e processar a linha subsequente, que obrigatoriamente será o Segmento U correspondente. Para uma validação robusta, o vínculo deve ser confirmado utilizando ambos o código de movimento (posições 16-17) e o número sequencial do registro (posições 9-13), garantindo que os dois segmentos pertencem à mesma transação antes de compor o objeto JSON final.

Seguindo este guia, o desenvolvedor terá todas as informações necessárias para implementar um parser robusto e preciso, capaz de transformar os dados do arquivo de retorno CNAB 240 em um formato JSON estruturado, confiável e de fácil utilização pelos sistemas de destino.
