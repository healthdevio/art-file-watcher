**INTERCÂMBIO DE INFORMAÇÕES ENTRE BANCOS E EMPRESAS**

```
TROCA ELETRÔNICA DE DADOS – CNAB
JUN/202 2
```
# Leiaute de Arquivo Eletrônico

# Padrão CNAB 240

# Contribuição Sindical Urbana - SITCS

## SISTEMAS/APLICATIVOS PRÓPRIOS


## SUMÁRIO

      -
- Alterações em relação à versão anterior...............................................................................
- 1. APRESENTAÇÃO
   - 1.1 Vantagens do Sistema de Cobrança Eletrônica
   - 1.2 Aspectos Gerais
   - 1.3 Meios de troca de arquivos
- 2. SERVIÇO/PRODUTO CONTRIBUIÇÃO SINDICAL URBANA
   - 2.1 Objetivo
   - 2.2 Participantes
   - 2.3 Fluxo de Informações
   - 2.3.1 Arquivo Remessa e Arquivo Retorno
   - 2.3.2 Transmissão de arquivos para registro de títulos via Portal da Entidade
- 3. ESTRUTURA DO ARQUIVO PADRÃO CNAB240
   - 3.1 Composição do Arquivo
   - 3.1.1 Lote de Serviço / Produto
   - 3.1.2 Eventos solicitados em cada Segmento
   - 3.2 Regras para geração do arquivo
- 4. LAYOUT DOS ARQUIVOS
- i. I – COMPOSIÇÃO DO ARQUIVO REMESSA
- ii. II – COMPOSIÇÃO DO ARQUIVO RETORNO
- 5. DESCRIÇÃO DE CAMPOS (Notas Explicativas)
   - ENTIDADE 5.1 TABELA DE CÓDIGOS DE RETORNO DE PRÉ-CRÍTICA – LOG – PORTAL DA
- 6. ANEXOS
   - Entidade 6.1 ANEXO I – Layout para UPLOAD de Banco de Contribuintes no Portal da
   - Entidade 6.2 ANEXO II – Layout para DOWNLOAD de Banco de Contribuintes do Portal da
   - Entidade 6.3 ANEXO III – Download do LOG de Upload Banco de Contribuintes do Portal da


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Alterações em relação à versão anterior
```
- Alteração do Item 5.1 - TABELA DE CÓDIGOS DE RETORNO DE PRÉ-CRÍTICA – LOG –
PORTAL DA ENTIDADE, com a inclusão da descrição do código de erro 957 retornado
no LOG (pré-crítica do arquivo remessa) disponibilizado no Portal da Entidade.
- Alteração no item 2.3.2, alínea b: disponibilização do arquivo de pré-crítica de online
para 15 minutos e alínea e: disponibilização do banco de guias de 15 minutos para
D+1 da data de upload do arquivo.
- Alteração do item 5, campo G 072, com a exclusão da informação (mesmo das
posições 63- 7 3 do Segmento P).


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### 1. APRESENTAÇÃO

```
Este manual apresenta o padrão para a troca de informações entre a CAIXA e os
clientes Beneficiários, a ser adotado na prestação do serviço Contribuição Sindical
Urbana, com registro na CAIXA.
```
```
Baseado nas informações necessárias para a implementação do serviço, o padrão
define um conjunto de registros/campos que devem compor o arquivo de troca de
informações.
```
```
A CAIXA, visando atender melhor os seus Clientes, adotou esse padrão, utilizando-o na
cobrança eletrônica de títulos relativos à Contribuição Sindical Urbana.
```
```
A troca eletrônica de dados - EDI - é uma solução para que a transmissão tenha maior
confiabilidade, agilidade e segurança, eliminando os riscos com a manipulação de
documentos.
```
```
O documento está dividido nos seguintes tópicos:
```
```
Item 2 – Serviço/Produto – Contribuição Sindical Urbana
Este documento apresenta uma visão geral do tipo de serviço/produto Contribuição
Sindical Urbana, identificando os entes de origem e destino de cada fluxo de troca de
informações.
```
```
Item 3 – Estrutura do Arquivo
Apresenta a estruturação do padrão CNAB240 para remessa e retorno, com
apresentação dos segmentos utilizados e fluxo de comunicação para geração de
informações das guias da Contribuição Sindical Urbana para a CAIXA (entrada de
títulos, alterações, pedido de baixa, etc.), bem como o retorno das solicitações
enviadas pelo cliente e eventuais movimentações nos títulos.
```
```
Define a composição do arquivo (header, lotes de serviço/produto e trailer),
conceituando cada tipo de registro existente e especificando a forma de utilização
de cada um deles, e apresenta o layout do header e do trailer de arquivo.
```
```
Item 4 - Layout dos Arquivos
Apresenta o leiaute dos registros/segmentos a serem utilizados na implementação da
comunicação entre a CAIXA e o cliente, por meio de arquivo eletrônico no padrão
CNAB240.
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Item 5 - Descrição dos Campos (Notas Explicativas)
Conceitua todos os campos componentes do layout dos registros utilizados no
serviço/produto Contribuição Sindical Urbana, através de Notas Explicativas. Para
facilitar a compreensão, os campos estão classificados em genéricos, campos
utilizados em mais de um tipo de serviço/produto, e específicos, campos utilizados no
serviço/produto Cobrança Bancária de Títulos cuja descrição é identificada através
da atribuição de um código composto da seguinte forma:
```
```
Tipo Campo Sigla Descrição da Sigla
Genérico G Genérico
Específico C Títulos em
Cobrança
```
```
Em cada layout de registro apresentado, é especificado o conteúdo esperado pela
CAIXA para os campos.
```
```
Além disso, é especificado também o código da descrição de cada campo, que
pode ser utilizado para acessar o tópico “Descrição dos Campos” e buscar a
descrição do campo, conforme definido pela Febraban. As descrições de campos
assinaladas com * antes do código, merecem uma atenção especial.
```
```
Item 6 – Anexos
Apresentam layouts de arquivos específicos para as operações com Banco de
Contribuintes no Portal da Entidade. Os layouts desses anexos não possuem relação
com o layout CNAB240 de remessa e retorno, apresentado nos itens acima, e tratam
de operações complementares disponíveis para utilização pelas Entidades por meio
do Portal da Entidade
```
```
1.1 Vantagens do Sistema de Cobrança Eletrônica
O sistema está baseado no conceito EDI - “Eletronic Data Interchange” (Troca
Eletrônica de Dados), que permite:
```
- Confiabilidade e segurança na comunicação CLIENTE/CAIXA e no
    processamento das informações;
- Redução no manuseio de informações e controles paralelos com a alimentação
    direta via transmissão de dados;
- Maior comodidade e agilidade na operacionalização da cobrança, uma vez
    que a entrega dos títulos à CAIXA e a informação da movimentação da
    cobrança são disponibilizadas através do microcomputador do Cliente;


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
1.2 Aspectos Gerais
No sistema de Cobrança Eletrônica as Entidades Sindicais fornecem os dados
necessários para registro dos títulos/guias na CAIXA. A inclusão de novos títulos, baixas
e alterações de dados são feitas através do envio de um novo arquivo à CAIXA.
```
```
O padrão do arquivo ora proposto deve ser respeitado no desenvolvimento de rotina
própria pela Entidade Sindical (beneficiário). Caso haja inconsistências, a CAIXA
rejeitará o arquivo remessa de forma parcial, disponibilizando para download os
registros com erros e o que motivou as rejeições. A Entidade Sindical efetua as
correções e providencia novo arquivo com as guias rejeitadas para nova inclusão.
```
```
Em situação normal, a Entidade Sindical deve transmitir o arquivo para a CAIXA até às
18:00 h. (Horário de Brasília). Após esse horário, o processamento do arquivo será feito
no dia seguinte.
```
```
A entidade poderá enviar quantos arquivos quiser por dia, certificando-se de que uma
remessa de número superior não seja transmitida antes da inferior. A CAIXA rejeitará o
arquivo remessa que possua o “Número de Remessa” inferior ao último efetivamente
processado.
```
```
A CAIXA processa as informações recebidas, retorna a confirmação das entradas,
baixas e alterações.
```
```
Ainda por meio do arquivo retorno, a CAIXA informa as liquidações das guias de
recolhimento da Contribuição Sindical Urbana.
```
```
1.3 Meios de troca de arquivos
A troca de arquivos é um meio moderno, rápido, seguro e automatizado de
comunicação eletrônica, via EDI ou EDI WEB.
```
```
A CAIXA oferece soluções via internet para a troca de arquivos. Para mais informações
sobre os meios de troca de arquivos, consulte o seu gerente de relacionamento.
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### 2. SERVIÇO/PRODUTO CONTRIBUIÇÃO SINDICAL URBANA

```
2.1 Objetivo
O produto Contribuição Sindical Urbana tem por objetivo fornecer aos clientes
Entidades Sindicais os meios para a arrecadação da Contribuição Sindical Urbana, em
atendimento à Consolidação das Leis do trabalho – CLT, instruções expedidas pelo
MTE e conforme a legislação vigente para o sistema financeiro.
```
```
2.2 Participantes
Participante Descrição
Beneficiário Entidade Sindical que entrega os títulos/guias ao Banco para
serem cobrados
Banco
Beneficiário
```
```
Banco que detém os títulos do Beneficiário que serão
cobrados, neste caso, a CAIXA
Pagador Pessoa física ou jurídica a que se destina a cobrança do
compromisso; é o contribuinte do Beneficiário, o devedor
Banco
Recebedor
```
```
Banco onde efetivamente é efetuado o pagamento do título.
```
```
2.3 Fluxo de Informações
```
O Beneficiário coloca o título em cobrança bancária, via arquivo eletrônico.

```
O Beneficiário pode comandar instruções e alterações em Títulos de posse do Banco
Beneficiário.
```
```
No sistema de Cobrança Eletrônica as Entidades Sindicais fornecem os dados
necessários para registro dos títulos/guias na CAIXA, impressão e postagem para
cobrança Registrada através da transmissão eletrônica. A inclusão de novos títulos,
baixas e alterações de dados são feitas através do envio de um novo arquivo à
CAIXA.
O Beneficiário pode comandar instruções e alterações em Títulos de posse do Banco
Beneficiário.
Campos alteráveis para o Código de Movimento Remessa = ‘31’ (alteração de outros
dados):
o Espécie do Título;
o Aceite;
o Data de Emissão do Título;
o Código/Prazo Devolução;
o Dados do Pagador;
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
o Mensagens;
```
```
Atenção: Quando os campos numéricos não precisarem ser alterados devem ser
preenchidos com zeros, excepcionalmente, para caracterizar a falta de informação
```
```
2.3.1 Arquivo Remessa e Arquivo Retorno
```
- **Remessa** – Arquivos enviados pela Entidade Sindical à CAIXA, neles são registradas
    as informações das transações que devem ser realizadas. Um mesmo arquivo
    remessa pode conter vários tipos de solicitações, ou seja, diversos lotes de serviço,
    mas um lote de serviço pode se referir somente a um título de cobrança.

```
A empresa poderá enviar quantos arquivos quiser por dia, certificando-se de que
uma remessa de número superior não seja transmitida antes da inferior. A CAIXA
rejeitará o arquivo remessa que possua o “Número de Remessa” inferior ao último
efetivamente processado.
```
```
Os arquivos Remessa transmitidos à CAIXA até as 18h são processados no mesmo
dia e os transmitidos após esse horário são processados no dia seguinte.
```
```
Caso seja necessário cancelar a remessa transmitida à CAIXA, o Beneficiário deve
entrar em contato com o Suporte Tecnológico, conforme telefones ao final deste
documento, no mesmo dia da transmissão, para solicitar a exclusão da remessa.
```
- **Retorno** – Consiste no envio de arquivos pela CAIXA à Entidade Sindical, referente
    ao tratamento dos arquivos remessa e outras movimentações nos títulos registrados
    no Banco.

```
As informações referentes à movimentação diária dos títulos são disponibilizadas
aos Beneficiários na mesma data do crédito, conforme float contratado, por meio
de arquivo retorno eletrônico.
```
```
O arquivo é enviado eletronicamente ao cliente, ficando disponível para captura
por 15 dias úteis no Portal da Entidade e após esse prazo somente se for solicitada
a sua redisponibilização.
```
```
A redisponibilização dos arquivos pode ser solicitada pelo cliente através dos
seguintes canais:
```
```
o Portal da Entidade;
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
o Por meio de atendimento telefônico, entrando em contato com o Suporte
Tecnológico, conforme telefones ao final deste documento;
o Diretamente na agência do convênio de contribuição sindical urbana,
excepcionalmente.
```
```
A redisponibilização do arquivo é passível de cobrança de tarifa.
```
```
Para tratamento do arquivo retorno pode ser utilizado o Portal da Entidade ou
aplicativo próprio do cliente.
```
```
O objetivo principal do retorno é disponibilizar ao cliente um controle adequado
das transações encaminhadas para processamento pela CAIXA. Ele pode se
destinar a:
```
```
o Informar que a remessa foi aceita para processamento;
o Informar a rejeição de registro e o respectivo erro;
o Informar os Pagamentos de títulos pelos pagadores;
```
```
A CAIXA realiza o retorno da crítica até o dia seguinte ao recebimento do arquivo
remessa.
```
```
É indicado o tratamento do arquivo retorno. Caso seja identificada a ausência de
algum arquivo, contatar imediatamente a CAIXA. É recomendável efetuar backup
semanal dos movimentos de “remessa” e de “retorno”.
```
```
2.3.2 Transmissão de arquivos para registro de títulos via Portal da Entidade
```
```
Caso a troca de arquivos para registro de guias ocorra via Portal da Entidade,
obedecerá ao seguinte fluxo:
a) Entidade realiza upload de arquivo remessa padrão CNAB240 no Portal.
b) Sistema realiza pré-crítica do arquivo, disponibilizando, em até 15 minutos,
arquivo LOG da pré crítica, com informação de acatamento ou rejeição do
arquivo
c) O arquivo LOG da pré crítica corresponde ao arquivo padrão CNAB240 com as
mesmas informações enviadas pela entidade (espelho do arquivo remessa –
com os segmentos P e Q enviados) acrescido do código de retorno ao final de
cada linha de registro do arquivo:
i. No caso de acatamento do registro, o sistema informa código de
retorno 000 - PROCESSAMENTO EFETUADO COM SUCESSO em cada registro.
ii. No caso de rejeição total ou parcial da remessa, o sistema informa
código de retorno diferente de 000, conforme detalhamento
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
contido na TABELA DE CÓDIGOS DE RETORNO DE PRÉ-CRÍTICA – LOG
```
- PORTAL DA ENTIDADE, item 5.1 desse documento.
d) A Entidade deve realizar o tratamento do retorno do LOG, verificando o
acatamento ou rejeição do arquivo; em caso de rejeição, regularizar as
inconsistências identificadas e efetuar novo envio do arquivo corrigido.
e) Em caso de acatamento do arquivo na pré-crítica, o sistema realizará o
processamento e, em D+1 da data de upload do arquivo, disponiblizará arquivo
retorno CNAB240 do Banco de Guias registrado, para download pela entidade.
f) As guias registradas tembem podem ser consultadas no banco de guias no
portal.


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### 3. ESTRUTURA DO ARQUIVO PADRÃO CNAB

```
3.1 Composição do Arquivo
O padrão dos arquivos de remessa e retorno segue o estabelecido pelo CNAB (Centro
Nacional de Automação Bancária), e deve ser gravado contendo um registro header
de arquivo, lotes do Serviço/Produto e um registro trailer de arquivo, conforme ilustra a
figura abaixo:
```
##### A R Q U I V O

```
Registro Header de Arquivo (Tipo = 0)^
```
##### L

##### O

##### T

##### E

##### S

```
Registro Header de Lote (Tipo = 1)^
Registros Iniciais do
lote
(opcional)
```
#### 

```
(Tipo = 2)
```
```
Registros de detalhe
```
```
Segmentos
...
```
```
...
```
```
(Tipo = 3)
```
```
Registros finais do lote
(opcional)
```
```
...
```
```
(Tipo = 4)
```
```
Registro trailer de lote (Tipo = 5)^
Registro trailer de arquivo (Tipo = 9)
```
```
3.1.1 Lote de Serviço / Produto
O lote do Serviço/Produto típico é composto de um registro header de lote (1), um ou
mais registros de detalhe (3), e um registro trailer de lote (5).
```
```
Os registros header (1) e trailer (5) de lote e os de detalhe (3) são compostos de
campos fixos, comuns ao Serviço/Produto, e campos específicos, padrões para o tipo
de Serviço/Produto.
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Um registro de detalhe é composto de um ou mais segmentos do Serviço/Produto.
```
```
Existem vários tipos de segmentos diferentes e cada um deles pode ser utilizado em um
ou mais lotes do Serviço/Produto, tanto nos fluxos de Remessa (Cliente enviando
informações para o Banco) quanto nos fluxos de Retorno (Banco enviando
informações para o Cliente), conforme discriminados a seguir:
```
```
Lote Serviço / Produto
Segmentos
```
```
Remessa Retorno
Títulos em
Cobrança
```
```
Contribuição
Sindical Urbana
```
```
P (Obrigatório)
Q (Obrigatório)
Y-53 (Opcional)
```
```
T (Obrigatório)
U (Obrigatório)
Y-53 (Opcional)
```
```
3.1.2 Eventos solicitados em cada Segmento
COBRANÇA - REMESSA Evento Segmentos Envolvidos
Entrada de Títulos
Registro de Títulos para a cobrança no Banco
Beneficiário, neste caso, a CAIXA
```
##### P, Q, Y- 53

```
Alterações
Comandos que o Beneficiário envia ao banco para
que o mesmo modifique informações de um Título
```
##### P, Q, Y- 53

```
COBRANÇA - RETORNO Evento Segmentos Envolvidos
Confirmação/Rejeição da Entrada de Títulos
Resposta (positiva ou negativa) sobre a aceitação
da entrada de um Título para a cobrança no Banco
Beneficiário, neste caso, a CAIXA.
```
##### T, U, Y- 53

```
Confirmação/Rejeição das Alterações
Resposta (positiva ou negativa) sobre a aceitação
dos comandos que o Beneficiário envia ao banco
para que modifique informações de um Título.
```
##### T, U, Y- 53

```
Ocorrências
Informação que normalmente indica uma restrição
à cobrança de um título (ex: endereço do Pagador
inexistente) que o Banco envia ao Beneficiário,
exigindo dele uma ação.
```
##### T, U, Y- 53


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
3.2 Regras para geração do arquivo
O arquivo transacionado deve ser do tipo texto, contendo um registro por linha. Não
deve ser utilizado nenhum tipo de compactador de arquivos.
```
```
O controle entre um grupo de segmentos para um mesmo título será pelos campos
‘código do movimento’ e ‘número do registro’.
```
```
Utilização dos segmentos 'P' e 'Q':
o O segmento 'P' é obrigatório;
o O segmento 'Q' é obrigatório somente para o código de movimento '01'
(Entrada de Títulos, Código de Movimento = 01);
o O segmento 'T' é obrigatório;
o O segmento ‘U' é obrigatório;
o O segmento ‘Y-53' é opcional.
```
```
Campos Numéricos (“Picture 9”):
o Alinhamento: sempre à direita, preenchido com zeros à esquerda, sem
máscara de edição;
o Não utilizados: preencher com zeros.
```
```
Campos Alfanuméricos (“Picture X”):
o Alinhamento: sempre à esquerda, preenchido com brancos à direita;
o Não utilizados: preencher com brancos;
o Caracteres: maiúsculos, sem acentuação, sem ‘ç’, sem caracteres especiais.
```
```
Campos alteráveis para o Código de Movimento Remessa = ‘31’ (alteração de outros
dados):
o Espécie do Título;
o Aceite;
o Data de Emissão do Título;
o Código/Prazo Devolução;
o Dados do Pagador;
o Mensagens;
o Atenção: Quando os campos numéricos não precisarem ser alterados
devem ser preenchidos com zeros, excepcionalmente, para caracterizar a
falta de informação.
```
```
Os campos referentes a taxas/percentuais deverão ser preenchidos com duas casas
decimais e serão impressos no boleto em valor da moeda corrente.
```
```
Rejeições de Arquivos:
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
o O arquivo será rejeitado se for encontrado algum tipo de inconsistência nos
campos do header de arquivo e de lote, bem como nos campos do trailer
de lote e de arquivo;
o Nos registros detalhe os campos que ocasionam a rejeição do arquivo são os
Campos de Controle (Banco, Lote, Registro) e os campos de serviço (número
do registro, segmento e código de movimento);
o Alguns exemplos de rejeições:
▪ Código do banco inválido
▪ Código de serviço inválido
▪ Código de convênio inválido
▪ Código da agência/conta inválida
▪ Número de remessa inválida
▪ Número sequencial do registro dentro do arquivo inválido
▪ Quantidade de registros do lote inválido ou divergente
▪ Informações obrigatórias que não foram incluídas.
```
```
Todos os dígitos verificadores são calculados através do módulo 11, conforme Notas
Explicativas G009 a G012.
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### 4. LAYOUT DOS ARQUIVOS

```
i. I – COMPOSIÇÃO DO ARQUIVO REMESSA
```
```
Registro Tipo 0: Cabeçalho com Informações do Arquivo Remessa - Header de Arquivo
(Obrigatório)
DESCRIÇÃO DE REGISTRO TIPO ‘0’:
HEADER DE ARQUIVO REMESSA
```
```
TAMANHO DO REGISTRO = 240 CARACTERES
```
```
Campo Posição Nº Nº For
mat
o
```
```
Default Des
```
```
De Até Dig De
c
```
```
crição
```
```
01.0 Control
e
```
```
Banco Código do
Banco na
Compensação
```
```
1 3 3 - Num ‘104’ G
```
```
02.0 Lote Lote de Serviço 4 7 4 - Num '0000' *G
03 .0 Registro Tipo de Registro 8 8 1 - Num '0' *G
04.0 CNAB Uso Exclusivo
FEBRABAN /
CNAB
```
```
9 17 9 - Alfa Brancos G
```
05. (^)

##### E M P R E S

```
Ins
cri-
çã
o
```
```
Tipo Tipo de Inscrição
da Empresa
```
```
18 18 1 - Num *G
```
```
06.0 Número Número de
Inscrição da
Empresa
```
```
19 32 14 - Num *G
```
```
07.0 Uso Exclusivo Uso Exclusivo
CAIXA
```
```
33 52 20 - Num ‘0’
```
##### 08.

```
Có
d.
```
##### A

```
g
ê
```
```
Códig
o
```
```
Agência
Mantenedora da
Conta
```
```
53 57 5 - Num *G
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
09.0 A Id
en
tif.
```
```
n
ci
a
```
```
DV Dígito Verificador
da Agência
```
```
58 58 1 - Alfa *G
```
```
10.0 Código
Benefici
ário
```
```
Código do
Convênio no
Banco
```
```
59 65 7 - Num *G
```
```
11.0 Uso Exclusivo Uso Exclusivo
CAIXA
```
```
66 72 7 - Num ‘0’
```
```
12.0 Uso Exclusivo Uso Exclusivo
CAIXA
```
```
73 73 1 - Num ‘0’
```
```
13 .0 Nome Nome da
Empresa
```
```
74 103 30 - Alfa G
```
```
14.0 Nome do Banco Nome do Banco 104 133 30 - Alfa G
15.0 CNAB Uso Exclusivo
FEBRABAN /
CNAB
```
```
133 143 10 - Alfa Brancos G
```
##### 16.

##### A R Q U I V O

```
Código Código Remessa 144 144 1 - Num G
17.0 Data de
Geração
```
```
Data de
Geração do
Arquivo
```
```
145 152 8 - Num G
```
```
18.0 Hora de
Geração
```
```
Hora de
Geração do
Arquivo
```
```
153 158 6 - Num G
```
```
19.0 Sequência
(NSA)
```
```
Número
Sequencial do
Arquivo
```
```
159 164 6 - Num *G
```
```
20.0 Layout do
Arquivo
```
```
No da Versão do
Layout do
Arquivo
```
```
165 167 3 - Num ' “101”' *G
```
```
21.0 Densidade Densidade de
Gravação do
Arquivo
```
```
168 172 5 - Num ‘0’ G
```
```
22.0 Tipo de Entidade
Sindical
```
```
Tipo de Entidade
Sindical
```
```
173 173 1 - Num C
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
23.0 Código Sindical Código sindical
da Entidade
Sindical
```
```
174 178 5 - Num C
```
```
24.0 Reservado Empresa Para Uso
Reservado da
Empresa
```
```
179 198 20 - Alfa G
```
```
25.0 Versão Aplicativo Versão Aplicativo
CAIXA
```
```
199 202 4 - Alfa C
```
```
26 .0 CNAB Uso Exclusivo
FEBRABAN /
CNAB
```
```
203 240 38 - Alfa Brancos G
```
```
Controle - Banco origem ou destino do arquivo (Banco Beneficiário)
Empresa - Cliente (Beneficiário) que firmou o convênio de prestação de serviços com
o Banco.
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Registro Tipo 1: Cabeçalho com Informações do Lote - Header de Lote (Obrigatório)
```
```
DESCRIÇÃO DE REGISTRO TIPO “1”:
HEADER DE LOTE DE ARQUIVO REMESSA
```
```
TAMANHO DO REGISTRO = 240 CARACTERES
```
```
Campo Posição Nº Nº For
mat
o
```
```
Default Des-
```
```
De Até Dig De
c
```
```
crição
```
```
01.1 Control
e
```
```
Banco Código do
Banco na
Compensaç
ão
```
```
1 3 3 - Nu
m
```
##### ‘104’ G

```
02.1 Lote Lote de
Serviço
```
```
4 7 4 - Nu
m
```
##### *G

```
03.1 Registro Tipo de
Registro
```
```
8 8 1 - Nu
m
```
##### '1' *G

```
04.1 Serviço Operação Tipo de
Operação
```
```
9 9 1 - Alfa *G
```
```
05.1 Serviço Tipo de
Serviço
```
```
10 11 2 - Nu
m
```
##### *G

```
06.1 CNAB Uso Exclusivo
FEBRABAN/C
NAB
```
```
12 13 2 - Nu
m
```
##### ‘00’ G

```
07.1- Layout do Lote Nº da
Versão do
Layout do
Lote
```
```
14 16 3 - Nu
m
```
##### “060” *G

```
08.1 CNAB Uso Exclusivo
FEBRABAN/C
NAB
```
```
17 17 1 - Alfa Brancos G
```
09.1 (^) E
m
Inscriçã
o
Tipo Tipo de
Inscrição da
Empresa
18 18 1 - Nu
m

##### *G


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
10.1 p
r
e
s
a
```
```
Número Nº de
Inscrição da
Empresa
```
```
19 32 14 - Nu
m
```
##### *G

```
11.1 Convênio Código do
Beneficiário
no Banco
```
```
33 39 7 - Nu
m
```
##### *G

```
11.1- Uso Exclusivo Uso Exclusivo
CAIXA
```
```
40 54 15 - Nu
m
```
##### ‘0’

##### 12.

```
Cód.
Identif
```
```
Agê
nci
a
```
```
Códig
o
```
```
Agência
Mantenedor
a da Conta
```
```
55 59 5 - Nu
m
```
##### *G

```
13.1 DV Dígito
Verificador
da Agência
```
```
60 60 1 - Nu
m
```
##### *G

14. 1 - Código
    Beneficiári
    o

```
Código do
Convênio
no Banco
```
```
61 67 7 - Nu
m
```
##### *G

```
15.1- Tipo de Entidade
Sindical
```
```
Tipo de
Entidade
Sindical
```
```
68 68 1 - Nu
m
```
##### C 105

```
16.1- Código Sindical Código
sindical da
entidade
sindical
```
```
69 73 5 - Nu
m
```
##### C

```
17.1 Uso Exclusivo Uso Exclusivo
CAIXA
```
```
74 75 2 - Nu
m
```
##### ‘0’

```
18.1 Nome Nome da
Empresa
```
```
76 105 30 - Alfa G
```
```
19.1 Informação 1 Mensagem
1
```
```
106 145 40 - Alfa C
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
20.1 Informação 2 Mensagem
2
```
##### 146 185 40

- Alfa C

```
21.1 Controle da
Cobrança
```
##### Nº

```
Rem./Ret.
```
```
Número
Remessa
```
```
186 197 12 - Nu
m
```
##### G

```
22.1 Dt.
Gravação
```
```
Data de
Gravação
Remessa
```
```
198 205 8 - Nu
m
```
##### G

```
23.1 Data do Crédito Data do
Crédito
```
```
206 213 8 - Nu
m
```
##### C

```
24 .1 CNAB Uso Exclusivo
FEBRABAN/C
NAB
```
```
214 240 27 - Alfa Brancos G
```
```
Registro Tipo 3 – Segmento P: Informações do Título (Obrigatório)
```
```
DESCRIÇÃO DE REGISTRO TIPO “3”, Segmento “P”:
DADOS DO TÍTULO
```
```
TAMANHO DO REGISTRO = 240 CARACTERES
```
```
Camp
o
```
```
Posição Nº Nº Form
ato
```
```
Default Des-
```
```
De Até Di
g
```
```
De
c
```
```
criçã
o
01.3P Control
e
```
```
Banco Código do Banco na
Compensação
```
```
1 3 3 - Num ‘104’ G
```
```
02.3P Lote Lote de Serviço 4 7 4 - Num *G
2
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
03.3P Registro Tipo de Registro 8 8 1 - Num '3' *G00
3
04.3P Serviço Nº do
Registro
```
```
Nº Sequencial do
Registro no Lote
```
```
9 13 5 - Num *G03
8
05.3P Segme
nto
```
```
Cód. Segmento do
Registro Detalhe
```
```
14 14 1 - Alfa 'P' *G03
9
06.3P CNAB Uso Exclusivo
FEBRABAN/CNAB
```
```
15 15 1 - Alfa Brancos G004
```
```
07.3P Cód.
Mov.
```
```
Código de
Movimento Remessa
```
```
16 17 2 - Num *C00
4
08.3P Código
Identif.
Benefici
ário
```
```
Ag
ên
cia
```
```
Có
dig
o
```
```
Agência
Mantenedora da
Conta
```
```
18 22 5 - Num *G00
8
```
```
09.3P DV Dígito Verificador da
Agência
```
```
23 23 1 - Alfa *G00
9
10.3P- Código
Benefici
ário
```
```
Código do Convênio
no Banco
```
```
24 30 7 - Num *G00
7
```
```
11.3P- Uso
Exclusiv
o
```
```
Uso Exclusivo da
CAIXA
```
```
31 37 7 - Num ‘0’
```
```
12.3P- Uso Exclusivo Uso Exclusivo da
CAIXA
```
```
38 40 3 - Num ‘0’
```
##### 13.3P-

```
Carteira/Nosso
Número
```
```
Modalidade da
Carteira
```
```
41 42 2 - Num *G06
9
13.3P- Identificação do Título
no Banco
```
```
43 57 15 - Num *G06
9
14.3P Caracte
```
-
rística

```
Cobran
ça
```
```
Carteira Código da Carteira 58 58 1 - Num ‘1’ *C00
6
15.3P Cadastr
amento
```
```
Forma de Cadastr. do
Título no Banco
```
```
59 59 1 - Num ‘1’ *C00
7
16.3P Docum
ento
```
```
Tipo de Documento 60 60 1 - Alfa ‘2’ C008
```
```
17.3P Emissão
Boleto
```
```
Identificação da
Emissão do Boleto
```
```
61 61 1 - Num *C00
9
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
1 8.3P Distribui
ção
Boleto
```
```
Identificação da
Entrega do Boleto
```
```
62 62 1 - Num C010
```
```
19.3P Nº do
Documento (Seu
Nº)
```
```
Número do
Documento de
Cobrança
```
```
63 73 11 - Alfa *C01
1
```
```
19.3P Uso Exclusivo Uso Exclusivo CAIXA 74 77 4 - Alfa Brancos
20.3P Vencimento Data de Vencimento
do Título
```
```
78 85 8 - Num *C01
2
21.3P Valor do Título Valor Nominal do
Título
```
```
86 100 13 2 Num *G07
0
22.3P Ag. Cobradora Agência Encarregada
da Cobrança
```
```
101 105 5 - Num ‘0’ *C01
4
23.3P DV Dígito Verificador da
Agência
```
```
106 106 1 - Alfa ‘0’ *C01
4
24.3P Espécie de Título Espécie do Título 107 108 2 - Num ‘99’ *C01
5
25.3P Aceite Identific. de Título
Aceito/Não Aceito
```
```
109 109 1 - Alfa ‘A’ C016
```
```
26.3P Data Emissão do
Título
```
```
Data da Emissão do
Título
```
```
110 117 8 - Num G071
```
```
27.3P Juros Cód.
Juros
Mora
```
```
Código do Juros de
Mora
```
```
118 118 1 - Num ‘ 3 ’ *C01
8
```
```
28.3P Data
Juros
Mora
```
```
Data do Juros de
Mora
```
```
119 126 8 - Num *C01
9
```
```
29.3P Juros
Mora
```
```
Juros de Mora por
Dia/Taxa
```
```
127 141 13 2 Num C020
```
```
30.3P Desc 1 Cód.
Desc. 1
```
```
Código do Desconto
1
```
```
142 142 1 - Num ‘0’ *C02
1
31.3P Data
Desc. 1
```
```
Data do Desconto 1 143 150 8 - Num C022
```
```
32.3P Descon
to 1
```
```
Valor/Percentual a ser
Concedido
```
```
151 165 13 2 Num ‘0’ C023
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
33.3P Vlr IOF Valor do IOF a ser
Recolhido
```
```
166 180 13 2 Num ‘0’ C024
```
```
34.3P Vlr Abatimento Valor do Abatimento 181 195 13 2 Num G045
35.3P Uso Empresa
Beneficiário
```
```
Identificação do Título
na Empresa
```
```
196 220 25 - Alfa G072
```
```
36.3P Código p/
Protesto
```
```
Código para Protesto 221 221 1 - Num ‘3’ C026
```
```
37.3P Prazo p/ Protesto Número de Dias para
Protesto
```
```
222 223 2 - Num ‘00’ C027
```
```
38.3P Código p/
Baixa/Devoluçã
o
```
```
Código para
Baixa/Devolução
```
```
224 224 1 - Num ‘1’ C028
```
```
39.3P Prazo p/
Baixa/Devoluçã
o
```
```
Número de Dias para
Baixa/Devolução
```
```
225 227 3 - Alfa ‘01’ – se
tipo Pgt =
‘2’
‘90’ – se
tipo Pgt =
‘1’
```
##### C029

```
40.3P Código da
Moeda
```
```
Código da Moeda 228 229 2 - Num ‘09’ *G06
5
41.3P- Uso Exclusivo Uso Exclusivo CAIXA 230 239 10 - Num ‘0’
42.3P Uso livre
banco/empresa
```
```
Autorização de
pagamento parcial
```
```
240 240 1 - Num ‘1’ – se
valor fixo
‘2’ –
Autoriza
Pgt
Parcial
```
##### C092

```
Registro Tipo 3 – Segmento Q: Informações do Pagador e Sacador/Avalista
(Obrigatório)
```
```
DESCRIÇÃO DE REGISTRO TIPO “3”, Segmento “Q”:
DADOS DO PAGADOR
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### TAMANHO DO REGISTRO = 240 CARACTERES

Campo Posição Nº Nº Form
ato

```
Defaul
t
```
```
Des-
```
De Até Di
g

```
Dec crição
```
01.3Q Control
e

```
Banco Código do Banco
na Compensação
```
```
1 3 3 - Num ‘104’ G001
```
02.3Q Lote Lote de Serviço 4 7 4 - Num *G002

03.3Q Registro Tipo de Registro 8 8 1 - Num ‘3’ *G003

04.3Q Serviço Nº do
Registro

```
Nº Sequencial do
Registro no Lote
```
```
9 13 5 - Num *G038
```
05.3Q Segmento Cód. Segmento
do Registro
Detalhe

```
14 14 1 - Alfa ‘Q’ *G039
```
06.3Q CNAB Uso Exclusivo
FEBRABAN/CNAB

```
15 15 1 - Alfa Branc
os
```
##### G004

07.3Q Cód. Mov. Código de
Movimento
Remessa

```
16 17 2 - Num *C004
```
08.3Q Dados

```
do
```
```
Pagad
or
```
```
Inscri
ção
```
```
Tipo Tipo de Inscrição 18 18 1 - Num ‘1’ –
CPF
‘2’ -
CNPJ
```
##### *G005

09.3Q Númer
o

```
Número de
Inscrição
```
```
19 33 15 - Num *G006
```
10.3Q Nome Nome 34 73 40 - Alfa

11.3Q Endereço Endereço 74 113 40 - Alfa G032

12.3Q Bairro Bairro 114 128 15 - Alfa G032

13.3Q CEP CEP 129 133 5 - Num G034

14.3Q Sufixo do
CEP

```
Sufixo do CEP 134 136 3 - Num G035
```
15.3Q Cidade Cidade 137 151 15 - Alfa G033


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

16.3Q UF Unidade da
Federação

```
152 153 2 - Alfa G036
```
17.3Q Capital
Social da
Empresa

```
Capital Social da
Empresa
```
```
154 166 11 2 Num C098
```
18.3Q Capital
Social do
Estabelecim
ento

```
Capital Social do
Estabelecimento
```
```
167 179 11 2 Num C099
```
19.3Q Número de
Empregados
Contribuinte
s

```
Número de
Empregados
Contribuintes
```
```
180 188 9 - Num C100
```
20.3Q Total da
Remuneraç
ão –
Contribuinte
s

```
Total da
Remuneração –
Contribuintes
```
```
189 201 11 2 Num C101
```
21.3Q Total de
Empregados
do
Estabelecim
ento

```
Total de
Empregados do
Estabelecimento
```
```
202 210 9 - Num C102
```
22.3Q Informação
de CNAE

```
Código CNAE
Contribuinte/Paga
dor
```
```
211 215 5 - Num C103
```
23 .3Q Dados
do
Benefici

- ário

```
Tipo de
entidade
```
```
Tipo de Entidade
Sindical
```
```
216 216 1 - Num C105
```
24 .3Q Código
Sindical

```
Código sindical
da Entidade
Sindical
```
```
217 221 5 - Num C106
```
25 .3Q CNAB Uso Exclusivo
FEBRABAN/C
NAB

```
Uso Exclusivo
FEBRABAN/CNAB
```
```
222 240 19 Alfa Bran
cos
```
##### G004

```
Registro Tipo 3: Segmento Y-53: Identificação de Tipo de Pagamento (Opcional)
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Em caso de permissão de pagamento divergente, o segmento “Y-53” deve ser
preenchido para informar o tipo de pagamento permitido para a GRCSU, no
momento do registro da guia, conforme abaixo:
```
```
01 = Aceita pagamento de qualquer valor
02 = Aceita pagamento de valores entre range mínimo e máximo
03 = Não aceita pagamento com o valor divergente
```
```
O registro da guia deve sempre conter valor de documento diferente de zeros e
indicar o tipo de pagamento permitido.
```
```
Em caso de pagamento de valores entre range mínimo e máximo, o valor da range
mínima deve ser sempre menor ou igual ao valor do documento registrado.
```
```
Guias emitidas pelo Portal do Contribuinte sempre serão registrada com o “Tipo 03 =
Não aceita pagamento com o valor divergente”.
Para guias que não permitem pagamento de valor divergente basta o preenchimento
do “Segmento P”, campo 42.3P com “1” – Não autoriza pagamento parcial.
```
```
DESCRIÇÃO DE REGISTRO TIPO “3”, Segmento “Y-53”:
IDENTIFICAÇÃO DE TIPO DE PAGAMENTO
```
```
TAMANHO DO REGISTRO = 240 CARACTERES
```
Campo Posição Nº Nº For
mat

```
Default Des-
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
o
```
De Até Dig

##### D

```
e
c
```
```
criçã
o
```
##### 01.3Y

```
Controle
```
```
Banco
Código do Banco
na Compensação
1 3 3 - Num ‘104’ G001
```
02.3Y Lote Lote de Serviço 4 7 4 - Num

##### *G00

##### 2

03.3Y Registro Tipo de Registro 8 8 1 - Num ‘3’

##### *G00

##### 3

##### 04.3Y

```
Serviço
```
```
Nº do
Registro
```
```
Nº Sequencial do
Registro no Lote
9 13 5 - Num
```
##### *G03

##### 8

05.3Y Segmento

```
Cód. Segmento do
Registro Detalhe
14 14 1 - Alfa ‘Y’
```
##### *G03

##### 9

##### 06.3Y CNAB

```
Uso Exclusivo
FEBRABAN/CNAB
15 15 1 - Alfa
Branco
s
```
##### G004

07.3Y Cód. Mov.

```
Código de
Movimento
Remessa
```
```
16 17 2 - Num
```
##### *C00

##### 4/20

08.3Y Cod. Reg. Opcional
Identificação
Registro Opcional
18 19 2 - Num ‘53’

##### *G06

##### 7

##### 09.3Y

```
Tipo de
pagame
nto
```
```
Identificaç
ão de Tipo
de
pagament
o
```
```
Identificação do
tipo de
pagamento
```
```
20 21 2 - Num
C093
```
##### 10.3Y

```
Quantidad
es de
Pagament
os
Possíveis
```
```
Quantidades de
Pagamentos
Possíveis
```
```
22 23 2 - Num
```
##### *

##### C094

##### 11.3Y

```
Alteraçã
o
Nominal
do Título
```
```
Tipo de
Valor
```
```
Tipo de Valor
Informado
24 24 1 - Num ‘0’ ou
‘2’
C095
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### 12.3Y

```
Valor
Máximo Valor Máximo^25 39 13 2 Num^
C096
```
13 .3Y
Tipo de
Valor

```
Tipo de Valor
Informado
40 40 1 Num
‘0’ ou
‘2’
C095
```
14 .3Y
Valor
Mínimo
Valor Mínimo 41 55 13 2 Num
C097

15 .3Y CNAB
Uso Exclusivo
FEBRABAN/CNAB
56 240 185 Alfa
Branco
s

##### G004


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Registro Tipo 5: Rodapé com Informações do Lote - Trailer de Lote (Obrigatório)
```
```
DESCRIÇÃO DE REGISTRO TIPO “5”:
TRAILER DE LOTE DE ARQUIVO REMESSA
```
```
TAMANHO DO REGISTRO = 240 CARACTERES
```
Campo Posição Nº Nº Forma
to

```
Default Des-
```
De Até Dig De
c

```
crição
```
##### 01.

##### 5

```
Contr
ole
```
```
Banco Código do Banco na
Compensação
```
```
1 3 3 - Num ‘104’ G001
```
##### 02.

##### 5

```
Lote Lote de Serviço 4 7 4 - Num *G002
```
##### 03.

##### 5

```
Registro Tipo de Registro 8 8 1 - Num ‘5’ *G 003
```
##### 04.

##### 5

```
CNAB Uso Exclusivo
FEBRABAN/CNAB
```
```
9 17 9 - Alfa Brancos G004
```
##### 05.

##### 5

```
Qtde de Registros Quantidade de Registros
no Lote
```
```
18 23 6 - Num *G057
```
##### 06.

##### 5

```
Totalização da
Cobrança Simples
```
```
Quantidade de Títulos
em Cobrança
```
```
24 29 6 - Num *C070
```
##### 07.

##### 5

```
Valor Total dos Títulos em
Carteiras
```
```
30 46 15 2 Num *C071
```
##### 08.

##### 5 -

```
Totalização da
Cobrança
Caucionada
```
```
Quantidade de Títulos
em Cobrança
```
```
47 52 6 - Num *C070
```
##### 09.

##### 5 -

```
Valor Total dos Títulos em
Carteiras
```
```
53 69 15 2 Num *C071
```
##### 10.

##### 5 -

```
Totalização da
Cobrança
Descontada
```
```
Quantidade de Títulos
em Cobrança
```
```
70 75 6 - Num *C070
```
##### 11.

##### 5 -

```
Quantidade de Títulos
em Carteiras
```
```
76 92 15 2 Num *C071
```
##### 12.

##### 5 -

```
CNAB Uso Exclusivo
FEBRABA/CNAB
```
```
93 123 31 - Alfa Brancos G004
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### 13.

##### 5

```
CNAB Uso Exclusivo
FEBRABAN/CNAB
```
```
124 240 117 - Alfa Brancos G004
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Registro Tipo 9: Rodapé com Informações do Arquivo - Trailer de Arquivo (Obrigatório)
```
```
DESCRIÇÃO DE REGISTRO TIPO “9”:
TRAILER DE ARQUIVO REMESSA
```
```
TAMANHO DO REGISTRO = 240 CARACTERES
```
```
Campo Posição Nº Nº Formato Default Des-
De Até Dig Dec crição
01.9 Controle Banco Código do Banco
na Compensação
```
```
1 3 3 - Num ‘104’ G001
```
```
02.9 Lote Lote de Serviço 4 7 4 - Num '9999' *G002
03.9 Registro Tipo de Registro 8 8 1 - Num '9' *G003
04.9 CNAB Uso Exclusivo
FEBRABAN/CNAB
```
```
9 17 9 - Alfa Brancos G004
```
##### 05.9

```
Totais
```
```
Quantidade
de Lotes
```
```
Quantidade de
Lotes do Arquivo
```
```
18 23 6 - Num G049
```
```
06.9 Quantidade
de Registros
```
```
Quantidade de
Registros do
Arquivo
```
```
24 29 6 - Num G056
```
```
07.9 CNAB Uso Exclusivo
FEBRABAN/CNAB
```
```
30 35 6 - Alfa Brancos G004
```
```
08.9 CNAB Uso Exclusivo
FEBRABAN/CNAB
```
```
36 240 205 - Alfa Brancos G004
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
ii. II – COMPOSIÇÃO DO ARQUIVO RETORNO
```
```
Registro Tipo 0: Cabeçalho com Informações do Arquivo Retorno - Header de Arquivo
```
```
DESCRIÇÃO DE REGISTRO TIPO ‘0’:
HEADER DE ARQUIVO RETORNO
```
```
TAMANHO DO REGISTRO = 240 CARACTERES
```
```
Campo Posição Nº N
º
```
```
Form
ato
```
```
Defau
lt
```
```
Des
```
```
De Até Di
g
```
##### D

```
e
c
```
```
crição
```
```
01.0 Control
e
```
```
Banco Código do Banco na
Compensação
```
```
1 3 3 - Num ‘104’ G001
```
```
02.0 Lote Lote de Serviço 4 7 4 - Num '0000' *G002
03.0 Registro Tipo de Registro 8 8 1 - Num '0' *G003
04.0 CNAB Uso Exclusivo
FEBRABAN / CNAB
```
```
9 17 9 - Alfa Branc
os
```
##### G004

##### 05.0

##### E M P R E S A

```
Insc
ri-
çã
o
```
```
Tipo Tipo de Inscrição da
Empresa
```
```
18 18 1 - Num *G005
```
```
06.0 Número Número de Inscrição
da Empresa
```
```
19 32 14 - Num *G006
```
```
07.0 Uso Exclusivo Uso Exclusivo CAIXA 33 52 20 - Num ‘0’
08.0
Có
d.
Ide
ntif.
```
```
Ag
ên
ci
a
```
```
Códi
go
```
```
Agência
Mantenedora da
Conta
```
```
53 57 5 - Num *G008
```
```
09.0 DV Dígito Verificador da
Agência
```
```
58 58 1 - Alfa *G009
```
```
10.0 Código
Beneficiá
rio
```
```
Código do Convênio
no Banco
```
```
59 65 7 - Num *G007
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
11.0 Uso Exclusivo Uso Exclusivo CAIXA 66 72 7 - Num ‘0’
12.0 Uso Exclusivo Uso Exclusivo CAIXA 73 73 1 - Num ‘0’
13.0 Nome Nome da Empresa 74 103 30 - Alfa G013
14.0 Nome do Banco Nome do Banco 104 133 30 - Alfa G014
15.0 CNAB Uso Exclusivo
FEBRABAN / CNAB
```
```
134 143 10 - Alfa Branc
os
```
##### G004

##### 16.0

##### A R Q U I V O

```
Código Código Retorno 144 144 1 - Num G015
17.0 Data de
Geração
```
```
Data de Geração do
Arquivo
```
```
145 152 8 - Num G016
```
```
18 .0 Hora de
Geração
```
```
Hora de Geração do
Arquivo
```
```
153 158 6 - Num G017
```
```
19.0 Sequência
(NSA)
```
```
Número Sequencial
do Arquivo
```
```
159 164 6 - Num *G018
```
```
20.0 Layout do
Arquivo
```
```
No da Versão do
Layout do Arquivo
```
```
165 167 3 - Num '
“101”'
```
##### *G019

```
21.0 Densidade Densidade de
Gravação do
Arquivo
```
```
168 172 5 - Num ‘0’ G020
```
```
22 .0 Reservado Banco Para Uso Reservado
do Banco
```
```
173 192 20 - Alfa G021
```
```
23.0 Reservado Empresa Para Uso Reservado
da Empresa
```
```
193 212 20 - Alfa G022
```
```
24.0 Versão Aplicativo Versão Aplicativo
CAIXA
```
```
213 216 4 - Alfa C077
```
```
25.0 CNAB Uso Exclusivo
FEBRABAN / CNAB
```
```
217 240 24 - Alfa Branc
os
```
##### G004


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Registro Tipo 1: Cabeçalho com Informações do Lote de Arquivo Retorno - Header de
Lote
```
```
DESCRIÇÃO DE REGISTRO TIPO “1”:
HEADER DE LOTE DE ARQUIVO RETORNO
```
```
TAMANHO DO REGISTRO = 240 CARACTERES
```
Campo Posição Nº Nº Formato Default Des-

De Até Dig Dec crição

01.1 Controle Banco Código do
Banco na
Compensação

```
1 3 3 - Num ‘104’ G001
```
02.1 Lote Lote de Serviço 4 7 4 - Num *G002

03.1 Registro Tipo de Registro 8 8 1 - Num '1' *G003

04.1 Serviço Operação Tipo de
Operação

```
9 9 1 - Alfa *G028
```
05.1 Serviço Tipo de Serviço 10 11 2 - Num *G025

06.1 CNAB Uso Exclusivo
FEBRABAN/CNAB

```
12 13 2 - Num ‘00’ G004
```
07.1- Layout do Lote Nº da Versão do
Layout do Lote

```
14 16 3 - Num ' “060” *G030
```
08.1 CNAB Uso Exclusivo
FEBRABAN/CNAB

```
17 17 1 - Alfa Brancos G004
```
##### 09.1

```
E m p r e s a
```
```
Inscrição Tipo Tipo de Inscrição
da Empresa
```
```
18 18 1 - Num *G005
```
10.1 Número Nº de Inscrição
da Empresa

```
19 32 14 - Num *G006
```
11.1 Convênio Código do
Beneficiário no
Banco

```
33 39 7 - Num *G007
```
11.1- Uso Exclusivo Uso Exclusivo
CAIXA

```
40 54 15 - Num ‘0’
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### 12.1

```
Cód.
Identif
Agência
```
```
Código Agência
Mantenedora
da Conta
```
```
55 59 5 - Num *G008
```
13.1 DV Dígito
Verificador da
Agência

```
60 60 1 - Alfa *G011
```
14.1- Código
Beneficiário

```
Código do
Convênio no
Banco
```
```
61 67 7 - Num *G007
```
15.1- Cód Mod Personalizado Código do
Modelo
Personalizado

```
68 74 7 - Num C078
```
16.1- Uso Exclusivo Uso Exclusivo
CAIXA

```
75 75 1 - Num ‘0’
```
17.1 Nome Nome da
Empresa

```
76 105 30 - Alfa G013
```
18.1 Informação 1 Mensagem 1 106 145 40 - Alfa C073

19.1 Informação 2 Mensagem 2 146 185 40 - Alfa C073

20.1 Controle da

```
Cobrança
```
```
Nº Rem./Ret. Número Retorno 186 197 12 - Num G079
```
21.1 Dt. Gravação Data de
Gravação
Retorno

```
198 205 8 - Num G068
```
22.1 Data do Crédito Data do Crédito 206 213 8 - Num C003

23.1 CNAB Uso Exclusivo
FEBRABAN/CNAB

```
214 240 27 - Alfa Brancos G004
```
```
Registro Tipo 3, Segmento T: Retorno da Movimentação na Carteira da Contribuição
Sindical Urbana
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
DESCRIÇÃO DE REGISTRO TIPO “3”, Segmento “T”:
MOVIMENTAÇÃO NA CARTEIRA
```
```
TAMANHO DO REGISTRO = 240 CARACTERES
```
Campo Posição Nº Nº Form
ato

```
Defaul
t
```
```
Des-
```
De Até Di
g

```
De
c
```
```
crição
```
01.3T Contr
ole

```
Banco Código do Banco na
Compensação
```
```
1 3 3 - Num ‘104’ G001
```
02.3T Lote Lote de Serviço 4 7 4 - Num *G002

03.3T Registro Tipo de Registro 8 8 1 - Num ‘3’ *G003

04.3T Serviç
o

```
Nº do
Registro
```
```
Número Sequencial
Registro no Lote
```
```
9 13 5 - Num *G038
```
05.3T Segmento Código Segmento do
Registro Detalhe

```
14 14 1 - Alfa ́T ́ *G039
```
06.3T CNAB Uso Exclusivo
FEBRABAN/CNAB

```
15 15 1 - Alfa Branc
os
```
##### G004

07.3T Cód. Mov. Código de Movimento
Retorno

```
16 17 2 - Num *C044
```
##### 08.3T

```
Códi
go
Identi
f.
```
```
Agên
cia
```
```
Códi
go
```
```
Uso Exclusivo CAIXA 18 22 5 - Num ‘0’
```
09.3T DV Uso Exclusivo CAIXA 23 23 1 - Num ‘0’

10.3T- Código
Beneficiário

```
Código do Convênio
no Banco
```
```
24 30 7 - Num *G007
```
11.3T- Uso Exclusivo Uso Exclusivo da CAIXA 31 33 3 - Num ‘0’

11.3T- Número do Banco Número do Banco de
Pagadores

```
34 36 3 - Num C079
```
12.3T- Uso Exclusivo Uso Exclusivo da CAIXA 37 40 4 - Num ‘0’

13.3T-
Nosso Número
Modalidade Nosso
Número

```
41 42 2 - Num *G069
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

13.3T- Identificação do Título
no Banco

```
43 57 15 - Num *G069
```
13.3T- Uso Exclusivo Uso Exclusivo CAIXA 58 58 1 - Num ‘0’

14.3T Carteira Código da Carteira 59 59 1 - Num C006

15.3T Número
Documento (Seu
Nº)

```
Número do Documento
de Cobrança
```
```
60 70 11 - Alfa *C011
```
15.3T Uso Exclusivo Uso Exclusivo CAIXA 71 74 4 - Alfa Branc
os

16.3T Vencimento Data de Vencimento
do Título

```
75 82 8 - Num *C012
```
17.3T Valor do Título Valor Nominal do Título 83 97 13 2 Num G070

18.3T Banco
Cobrador/Recebe
dor

```
Código do Banco 98 100 3 - Num C045
```
19.3T Agência
Cobradora/Receb
edora

```
Código da Agência
Cobr/Receb
```
```
101 105 5 - Num C086
```
20.3T DV Agência
Cobr/Receb

```
Dígito Verificador da
Agência Cobr/Rec
```
```
106 106 1 - Num G009
```
21.3T Uso da Empresa Identificação do Título
na Empresa

```
107 131 25 - Alfa C011
```
22.3T Código da Moeda Código da Moeda 132 133 2 - Num G065

23.3T Paga
dor Inscriç
ão

```
Tipo Tipo de Inscrição 134 134 1 - Num *G005
```
24.3T Núm
ero

```
Número de Inscrição 135 149 15 - Num *G006
```
25.3T Nome Nome 150 189 40 - Alfa

26.3T CNAB Uso Exclusivo
FEBRABAN/CNAB

```
190 199 10 - Alfa Branc
os
```
27.3T Valor da
Tar./Custas

```
Valor da Tarifa / Custas 200 214 13 2 Num G076
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### 28.3T

```
Motivo da
Ocorrência
```
```
Identificação para
Rejeições, Tarifas,
Custas, Liquidação e
Baixas
```
```
215 224 10 - Alfa *C047
```
29.3T CNAB Uso Exclusivo
FEBRABAN/CNAB

```
225 240 16 - Alfa Branc
os
```
##### G004


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Registro Tipo 3, Segmento U: Retorno do Título Pago - Detalhamento
```
```
DESCRIÇÃO DE REGISTRO TIPO “3”, Segmento “U”:
TÍTULOS PAGOS
```
```
TAMANHO DO REGISTRO = 240 CARACTERES
```
```
Campo Posição Nº Nº Form
ato
```
```
Defa
ult
```
```
Des-
```
```
De Até Di
g
```
```
De
c
```
```
crição
```
##### 01.3U

```
Control
e
```
```
Banco Código do Banco na
Compensação
```
```
1 3 3 - Num ‘104’ G001
```
```
02.3U Lote Lote de Serviço 4 7 4 - Num *G002
03.3U Registro Tipo de Registro 8 8 1 - Num ‘3’ *G003
04.3U
```
```
Serviço
```
```
Nº do
Registro
```
```
Nº Sequencial do
Registro no Lote
```
```
9 13 5 - Num *G038
```
```
05.3U Segmento Cód. Segmento do
Registro Detalhe
```
```
14 14 1 - Alfa ‘U’ *G039
```
```
06.3U CNAB Uso Exclusivo
FEBRABAN/CNAB
```
```
15 15 1 - Alfa Branc
os
```
##### G004

```
07.3U Cód. Mov. Código de
Movimento Retorno
```
```
16 17 2 - Num *C044
```
```
08.3U Capital
Social da
Empresa
```
```
Capital Social da
Empresa
```
```
18 30 11 2 Num C098
```
```
09.3U Capital
Social do
Estabelecim
ento
```
```
Capital Social do
Estabelecimento
```
```
31 43 11 2 Num C099
```
```
10.3U Número de
Empregados
Contribuinte
s
```
```
Número de
Empregados
Contribuintes
```
```
44 52 9 - Num C100
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
11.3U Dados
do
Pagad
or
```
```
Total da
Remuneraç
ão –
Contribuinte
s
```
```
Total da
Remuneração –
Contribuintes
```
```
53 65 11 2 Num C101
```
```
12.3U Total de
Empregados
do
Estabelecim
ento
```
```
Total de
Empregados do
Estabelecimento
```
```
66 74 9 - Num C102
```
##### 13.3U

```
Informação
de CNAE
```
```
Código CNAE
Contribuinte/Pagad
or
```
```
75 79 5 - Num C103
```
```
14.3U Dados
do
Benefici
ário
```
```
Tipo de
entidade
```
```
Tipo de Entidade
Sindical
```
```
80 80 1 - Num C105
```
##### 15.3U

```
Código
Sindical
```
```
Código sindical da
Entidade Sindical
```
```
81 85 5 - Num C106
```
```
16.3U Dados
do
Título
```
```
Tip Arrec Tipo de
Arrecadação
“D”=Direto/”I”Indiret
o
```
```
86 86 1 - Alfa
```
```
17.3U Vlr Pago Valor Pago pelo
Pagador
```
```
87 101 13 2 Num C052
```
```
18.3U Vlr Líquido Valor Líquido a ser
Creditado
```
```
102 116 13 2 Num G078
```
```
19.3U Acréscimos Juros / Multa /
Encargos
```
```
117 131 13 2 Num C048
```
```
20.3U Outros Créditos Valor de Outros
Créditos
```
```
132 146 13 2 Num C055
```
```
21.3U Data da Ocorrência Data da Ocorrência 147 154 8 - Num C056
22.3U Data do Crédito Data da Efetivação
do Crédito
```
```
155 162 8 - Num C057
```
```
23.3U Uso Exclusivo CAIXA Uso Exclusivo CAIXA 163 166 4 - Num ‘0’
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
24.3U Data do Débito da
Tarifa
```
```
Data do Débito da
Tarifa
```
```
167 174 8 - Num
```
```
25.3U Código do Pagador Código do Pagador
no Banco
```
```
175 189 15 - Num C080
```
```
26.3U Uso Exclusivo CAIXA Uso Exclusivo CAIXA 190 219 30 - Num ‘0’
27 .3U CNAB Uso Exclusivo
FEBRABAN/CNAB
```
```
220 240 21 - Alfa Branc
os
```
##### G004

```
Registro Tipo 3: Segmento Y-53: Retorno da Identificação de Tipo de Pagamento
(Obrigatório)
```
```
DESCRIÇÃO DE REGISTRO TIPO “3”, Segmento “Y-53”:
RETORNO À IDENTIFICAÇÃO DE TIPO DE PAGAMENTO
```
```
TAMANHO DO REGISTRO = 240 CARACTERES
```
Campo Posição Nº Nº

```
For
mat
o
```
```
Default Des-
```
De Até Dig

##### D

```
e
c
```
```
criçã
o
```
##### 01.3Y

```
Controle
```
```
Banco
Código do Banco
na Compensação
1 3 3 - Num ‘104’ G001
```
02.3Y Lote Lote de Serviço 4 7 4 - Num

##### *G00

##### 2

03.3Y Registro Tipo de Registro 8 8 1 - Num ‘3’

##### *G00

##### 3

##### 04.3Y

```
Serviço
```
```
Nº do
Registro
```
```
Nº Sequencial do
Registro no Lote
9 13 5 - Num
```
##### *G03

##### 8

0 5.3Y Segmento
Cód. Segmento do
Registro Detalhe
14 14 1 - Alfa ‘Y’

##### *G03

##### 9


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### 06.3Y CNAB

```
Uso Exclusivo
FEBRABAN/CNAB 15 15 1 -^ Alfa^
```
```
Branco
s G004^
```
07.3Y Cód. Mov.

```
Código de
Movimento
Remessa
```
```
16 17 2 - Num
```
##### *C00

##### 4/20

08.3Y Cod. Reg. Opcional
Identificação
Registro Opcional
18 19 2 - Num ‘53’

##### *G06

##### 7

##### 09.3Y

```
Tipo de
pagame
nto
```
```
Identificaç
ão de Tipo
de
pagament
o
```
```
Identificação do
tipo de
pagamento
```
```
20 21 2 - Num
C093
```
##### 10.3Y

```
Quantidad
es de
Pagament
os
Possíveis
```
```
Quantidades de
Pagamentos
Possíveis
```
```
22 23 2 - Num
```
##### *

##### C094

##### 11.3Y

```
Alteraçã
o
Nominal
do Título
```
```
Tipo de
Valor
```
```
Tipo de Valor
Informado
24 24 1 - Num
‘0’ ou
‘2’
C095
```
##### 12 .3Y

```
Valor
Máximo
Valor Máximo 25 39 13 2 Num
C096
```
13 .3Y
Tipo de
Valor

```
Tipo de Valor
Informado
40 40 1 Num
‘0’ ou
‘2’
C095
```
14 .3Y
Valor
Mínimo
Valor Mínimo 41 55 13 2 Num
C097

15 .3Y CNAB
Uso Exclusivo
FEBRABAN/CNAB
56 240 185 Alfa
Branco
s

##### G004


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Registro Tipo 5: Rodapé com Informações do Lote - Trailer de Lote
```
```
DESCRIÇÃO DE REGISTRO TIPO “5”:
TRAILER DE LOTE DE ARQUIVO RETORNO
```
```
TAMANHO DO REGISTRO = 240 CARACTERES
```
```
Campo Posição Nº Nº Form
ato
```
```
Defa
ult
```
```
Des-
```
```
De Até Dig De
c
```
```
criçã
o
01.
5
```
```
Contr
ole
```
```
Banco Código do Banco na
Compensação
```
```
1 3 3 - Num ‘104’ G001
```
##### 02.

##### 5

```
Lote Lote de Serviço 4 7 4 - Num *G002
```
##### 03.

##### 5

```
Registro Tipo de Registro 8 8 1 - Num ‘5’ *G003
```
##### 04.

##### 5

```
CNAB Uso Exclusivo
FEBRABAN/CNAB
```
```
9 17 9 - Alfa Bran
cos
```
##### G004

##### 05.

##### 5

```
Qtde de Registros Quantidade de
Registros no Lote
```
```
18 23 6 - Num *G057
```
##### 06.

##### 5

```
Totalização da
Cobrança Simples
```
```
Quantidade de Títulos
em Cobrança
```
```
24 29 6 - Num *C070
```
##### 07.

##### 5

```
Valor Total dos Títulos
em Carteiras
```
```
30 46 15 2 Num *C071
```
##### 08.

##### 5 -

```
Totalização da
Cobrança Caucionada
```
```
Quantidade de Títulos
em Cobrança
```
```
47 52 6 - Num *C070
```
##### 09.

##### 5 -

```
Valor Total dos Títulos
em Carteiras
```
```
53 69 15 2 Num *C071
```
##### 10.

##### 5 -

```
Totalização da
Cobrança Descontada
```
```
Quantidade de Títulos
em Cobrança
```
```
70 75 6 - Num *C070
```
##### 11.

##### 5 -

```
Quantidade de Títulos
em Carteiras
```
```
76 92 15 2 Num *C071
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### 12.

##### 5 -

```
CNAB Uso Exclusivo
FEBRABA/CNAB
```
```
93 123 31 - Alfa Bran
cos
```
##### G004

##### 13.

##### 5

```
CNAB Uso Exclusivo
FEBRABAN/CNAB
```
```
124 240 117 - Alfa Bran
cos
```
##### G004


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Registro Tipo 9: Rodapé com Informações do Arquivo - Trailer de Arquivo
```
```
DESCRIÇÃO DE REGISTRO TIPO “9”:
TRAILER DE ARQUIVO RETORNO
```
```
TAMANHO DO REGISTRO = 240 CARACTERES
```
```
Campo Posição Nº Nº Formato Default Des-
De Até Dig Dec crição
01.9 Controle Banco Código do Banco
na Compensação
```
```
1 3 3 - Num ‘104’ G001
```
```
02.9 Lote Lote de Serviço 4 7 4 - Num '9999' *G002
03.9 Registro Tipo de Registro 8 8 1 - Num '9' *G003
04.9 CNAB Uso Exclusivo
FEBRABAN/CNAB
```
```
9 17 9 - Alfa Brancos G004
```
##### 05.9

```
Totais
```
```
Quantidade
de Lotes
```
```
Quantidade de
Lotes do Arquivo
```
```
18 23 6 - Num G049
```
```
06.9 Quantidade
de Registros
```
```
Quantidade de
Registros do
Arquivo
```
```
24 29 6 - Num G056
```
```
07.9 CNAB Uso Exclusivo
FEBRABAN/CNAB
```
```
30 35 6 - Alfa Brancos G004
```
```
08.9 CNAB Uso Exclusivo
FEBRABAN/CNAB
```
```
36 240 205 - Alfa Brancos G004
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

**5. DESCRIÇÃO DE CAMPOS (Notas Explicativas)**

```
C - Títulos em Cobrança
```
C003 Data do Crédito

```
Data de efetivação do crédito referente ao pagamento do título de
cobrança. Informação enviada somente no arquivo de retorno.
Utiliza o formato DDMMAAAA, onde:
DD = dia
MM = mês
AAAA = ano
```
##### C003

##### C004

```
Código de Movimento Remessa
Código adotado pela FEBRABAN, para identificar o tipo de
movimentação enviado nos registros do arquivo de remessa.
Cada Banco definirá os campos a serem alterados para o código
de movimento 31.
Códig
o
```
```
Descrição
```
```
01 Incluir Título
02 Excluir Título
03 Consultar Título
20 2ª. Via Título
31 Alteração de Título (Outros Dados)
48 Alteração valor mínimo
49 Alteração valor máximo
```
##### C004

##### C006

```
Código da Carteira
Código adotado pela FEBRABAN, para identificar a característica
dos títulos dentro das modalidades de cobrança existentes no
banco.
‘1’ = Cobrança Simples
```
##### C006


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### C007

```
Forma de Cadastramento do Título no Banco
Código adotado pela FEBRABAN, para indicar a existência de
registro do título no banco.
‘1’ = Com Cadastramento (Cobrança Registrada)
```
##### C007

C008 Tipo de Documento

```
Código adotado pela FEBRABAN para identificar a existência
material do documento no processo. Informar fixo ‘2’
‘2’ = Escritural
```
##### C008

##### C009

```
Identificação da Emissão do Boleto
Código adotado pela FEBRABAN para identificar o responsável e a
forma de emissão do boleto.
‘1’ = Banco Emite (Impressão e postagem pela CAIXA)
‘2’ = Cliente Emite ou para Boleto Pré - Impresso Registrado (entrega
do boleto pelo Beneficiário)
```
##### C009

C010 Identificação da Entrega / Distribuição do Boleto

```
Código adotado pela FEBRABAN para identificar o responsável pela
distribuição do boleto.
Id Entrega do Boleto
‘0’ = Postagem pelo Beneficiário (entrega do boleto pelo
Beneficiário)
‘1’ = Postagem pela CAIXA (Impressão e Postagem pela CAIXA)
```
##### C010

C010A Identificação da Entrega / Distribuição do Extrato

```
Código para identificar a forma de distribuição do extrato.
Id Entrega do extrato
‘2’ = Beneficiário via Agência CAIXA
```
##### C010A

##### C011

```
Número do Documento de Cobrança (Seu Número)
Indicar a competência a que se refere a GRCSU com mês e ano da
obrigação tributária MM/AAAA – completar com zeros a esquerda
```
##### C011

##### C0 12

```
Data de Vencimento do Título
Data de vencimento do título de cobrança.
Utilizar o formato DDMMAAAA, onde:
```
##### C012


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
DD = dia
MM = mês
AAAA = ano
```
C014
Agência Encarregada da Cobrança
Preencher com zeros - o sistema atribuirá a agência encarregada
da cobrança pelo CEP do pagador.

```
Código adotado pelo Banco responsável pela cobrança, para
identificar o estabelecimento bancário responsável pela
cobrança do título.
Código e Dígito Verificador da Agência Encarregada da
Cobrança são fornecidos pela CAIXA. Para essa informação
solicitar a relação de agências cobradoras à agência CAIXA
de relacionamento.
```
##### C014

##### C015

```
Espécie do Título
Código adotado pela FEBRABAN para identificar o tipo de título de
cobrança.
Cód ID Descrição
99 OU Outros
```
##### C015

##### C0 16

```
Identificação de Título Aceito / Não Aceito
Código adotado pela FEBRABAN para identificar se o título de
cobrança foi aceito (reconhecimento da dívida pelo Pagador).
‘A’ = Aceite
‘N’ = Não Aceite
```
##### C016

##### C018

```
Código do Juros de Mora
Código adotado pela FEBRABAN para identificação do tipo de
pagamento de juros de mora.
‘3’ = Isento
```
##### C018

C019 Data do Juros de Mora C019


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

Preencher com zeros

C020 Juros de Mora por Dia / Taxa

```
Preencher com zeros
```
##### C020

##### C021

```
Código do Desconto 1 / 2 / 3
Código adotado pela FEBRABAN para identificação do tipo de
desconto que deverá ser concedido.
Ao se optar por valor, o desconto deve ser expresso em valor. Idem
ao se optar por percentual, o desconto deve ser expresso em
percentual.
‘0’ = Sem Desconto
```
##### C021

C022 Data do Desconto 1 / 2 / 3

```
Data limite do desconto do título de cobrança. Utilizar o formato
DDMMAAAA, onde:
DD = dia
MM = mês
AAAA = ano
Preencher com zeros
```
##### C022

C023 Valor / Percentual a ser Concedido

```
Valor ou percentual de desconto a ser concedido sobre o título de
cobrança. Se Código do Desconto 1 / 2 / 3 (nota C021):
= ‘1’ Informar valor
= ‘2’ Informar percentual
Preencher com zeros
```
##### C023

C024 Valor do IOF a Ser Recolhido

```
Valor original do IOF - Imposto sobre Operações Financeiras - de um
título prêmio de seguro na sua data de emissão, expresso de acordo
com o tipo de moeda.
Preencher com zeros
```
##### C024

C026 Código para Protesto

```
Código adotado pela FEBRABAN para identificar o tipo de prazo a
ser considerado para o protesto.
‘3’ = Não Protestar
```
##### C026


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

C027 Número de Dias para Protesto

```
Preencher com zeros
```
##### C027

C028 Código para Baixa / Devolução

```
Código adotado pela FEBRABAN para identificar qual o
procedimento a ser adotado com o Título.
‘1’ = Baixar / Devolver
```
##### C028

C029 Número de Dias para Baixa / Devolução

```
Número de dias corridos após a data de vencimento de um Título
não pago, que deverá ser baixado e devolvido para o Beneficiário.
Pode ser:
Se tipo de pagamento “1” ou “2” = 01, se tipo de pagamento “3” =
90
```
##### C029

##### C040

```
Tipo de Impressão
Código adotado pela FEBRABAN para identificação do tipo de
impressão da mensagem do título de cobrança.
‘1’ = Frente do Boleto
‘2’ = Verso do Boleto
‘3’ = Corpo de Instruções da Ficha de Compensação do Boleto
```
##### C040

##### C042

```
Mensagem a ser Impressa
Texto de mensagem do Beneficiário destinada ao Pagador para
impressão no título de cobrança.
Esta linha deverá ser enviada no formato imagem de impressão
(tamanho máximo de 140 posições).
```
##### C042

##### C044

```
Código de Movimento Retorno
Código adotado pela FEBRABAN, para identificar o tipo de
movimentação enviado nos registros do arquivo de retorno.
Os códigos de movimento ‘02’, ‘03’, ‘26’ e ‘30’ estão relacionados
com a descrição C047-A
O código de movimento ‘28’ está relacionado com a descrição
C047-B.
Os códigos de movimento ‘06’, ‘09’ e ‘17’ estão relacionados com a
descrição C047-C.
```
```
Códig Descrição^
```
##### C044


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
o
‘01’ Solicitação de Impressão de Títulos Confirmada
‘02’ Entrada Confirmada
‘03’ Entrada Rejeitada
‘04’ Transferência de Carteira/Entrada
‘05’ Transferência de Carteira/Baixa
‘06’ Liquidação
```
```
‘07’
Confirmação do Recebimento da Instrução de
Desconto
```
```
‘08’ Confirmação do Recebimento do Cancelamento do
Desconto
‘09’ Baixa
‘12’ Confirmação Recebimento Instrução de Abatimento
```
```
’13’
Confirmação Recebimento Instrução de
Cancelamento Abatimento
```
```
‘14’
Confirmação Recebimento Instrução Alteração de
Vencimento
‘19’ Confirmação Recebimento Instrução de Protesto
```
```
‘20’
Confirmação Recebimento Instrução de
Sustação/Cancelamento de Protesto
‘23’ Remessa a Cartório
‘24’ Retirada de Cartório
‘25’ Protestado e Baixado (Baixa por Ter Sido Protestado)
‘26’ Instrução Rejeitada
‘27’ Confirmação do Pedido de Alteração de Outros Dados
‘28’ Débito de Tarifas/Custas
‘30’ Alteração de Dados Rejeitada
‘35’ Confirmação de Inclusão Banco de Pagador
‘36’ Confirmação de Alteração Banco de Pagador
‘37’ Confirmação de Exclusão Banco de Pagador
‘38’ Emissão de Boletos de Banco de Pagador
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
‘39’ Manutenção de Pagador Rejeitada
‘40’ Entrada de Título via Banco de Pagador Rejeitada
‘41’ Manutenção de Banco de Pagador Rejeitada
‘44’ Estorno de Baixa / Liquidação
‘45’ Alteração de Dados
‘46’ Liquidação On-line
‘47’ Estorno de Liquidação On-line
‘51’ Título DDA reconhecido pelo pagador
‘52’ Título DDA não reconhecido pelo pagador
‘53’ Título DDA recusado pela CIP
‘61’ Confirmação de alteração do valor nominal do título
Obs.: Código 27: código retornado em resposta à requisição de
alteração via arquivo remessa através dos códigos de movimento
31 (Alteração de Outros Dados)
```
C045
Número do Banco Cobrador / Recebedor
Código fornecido pelo Banco Central para identificação do Banco
recebedor quando liquidação em outros bancos.
Quando a liquidação ocorrer nos canais CAIXA será informado o
código ‘104’

##### C045

##### C047

```
Motivo da Ocorrência
Código adotado pela FEBRABAN para identificar as ocorrências
(rejeições, tarifas, custas, liquidação e baixas) em registros detalhe
de títulos de cobrança. Poderão ser informados até cinco
ocorrências distintas, incidente sobre o título.
A - Códigos de rejeições de ‘01’ a ‘99’ associados aos códigos
de movimento ‘02’, ‘03’, ‘26’ e ‘30’ (Descrição C044)
AA Cód Desconto Preenchido, Obrig Data e Valor/Perc
AB Cod Desconto Obrigatório p/ Cód Mov = 7
AC Forma de Cadastramento Inválida
AD Data de Desconto deve estar em Ordem Crescente
AE Data de Desconto é Posterior a Data de Vencimento
AF Título não está com situação “Em Aberto”
```
##### C047


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
AG Título já está Vencido / Vencendo
AH Não existe desconto a ser cancelado
AI Data solicitada p/ Prot/Dev é anterior a data atual
AJ Código do Pagador Inválido
AK Número da Parcela Invalida ou Fora de Sequencia
AL Estorno de Envio Não Permitido
AM Nosso Numero Fora de Sequencia
A4 Pagador DDA
B2 Valor Nominal do Título Conflitante
VA Arq.Ret.Inexis. P/ Redisp. Nesta Dt/Nro
VB Registro Duplicado
VC Beneficiário deve ser padrão CNAB240
VD Ident. Banco Pagador Inválida
VE Num Docto Cobr Inválido
VF Vlr/Perc a ser concedido inválido
VG Data de Inscrição Inválida
VH Data Movto Inválida
VI Data Inicial Inválida
VJ Data Final Inválida
VK Banco de Pagador já cadastrado
VL Beneficiário não cadastrado
VM Número de Lote Duplicado
VN Forma de Emissão de Boleto Inválida
VO Forma Entrega Boleto Inválida p/ Emissão via Banco
VP Forma Entrega Boleto Invalida p/ Emissão via Beneficiário
VQ Opção para Endosso Inválida
VR Tipo de Juros ao Mês Inválido
VS Percentual de Juros ao Mês Inválido
VT Percentual / Valor de Desconto Inválido
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
VU Prazo de Desconto Inválido
VV Preencher Somente Percentual ou Valor
VW Prazo de Multa Invalido
VX Perc. Desconto tem que estar em ordem decrescente
VY Valor Desconto tem que estar em ordem descrescente
VZ Dias/Data desconto tem que estar em ordem decrescente
W
A
```
```
Vlr Contr p/ aquisição de Bens Inválid
```
```
WB Vlr Contr p/ Fundo de Reserva Inválid
W
C
```
```
Vlr Rend. Aplicações Financ Inválido
```
##### W

##### D

```
Valor Multa/Juros Monetarios Inválido
```
```
WE Valor Premios de Seguro Inválido
WF Valor Custas Judiciais Inválido
W
G
```
```
Valor Reembolso de Despesas Inválido
```
```
WH Valor Outros Inválido
WI Valor de Aquisição de Bens Inválido
WJ Valor Devolvido ao Consorciado Inválido
WK Vlr Desp. Registro de Contrato Inválido
WL Valor de Rendimentos Pagos Inválido
W
M
```
```
Data de Descrição Inválida
```
##### W

##### N

```
Valor do Seguro Inválido
```
##### W

##### O

```
Data de Vencimento Inválida
```
```
WP Data de Nascimento Inválida
W
Q
```
```
CPF/CNPJ do Aluno Inválido
```
```
WR Data de Avaliação Inválida
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
WS CPF/CNPJ do Locatario Inválido
WT Literal da Remessa Inválida
WU Tipo de Registro Inválido
WV Modelo Inválido
W
W
```
```
Código do Banco de Pagadores Inválido
```
```
WX Banco de Pagadores não Cadastrado
WY Qtde dias para Protesto tem que estar entre 2 e 90
WZ Não existem Pagadores para este Banco
XA Preço Unitario do Produto Inválido
XB Preço Total do Produto Inválido
XC Valor Atual do Bem Inválido
XD Quantidade de Bens Entregues Inválido
XE Quantidade de Bens Distribuidos Inválido
XF Quantidade de Bens não Distribuidos Inválido
XG Número da Próxima Assembléia Inválido
XH Horario da Próxima Assembléia Inválido
XI Data da Próxima Assembléia Inválida
XJ Número de Ativos Inválido
XK Número de Desistentes Excluidos Inválido
XL Número de Quitados Inválido
XM Número de Contemplados Inválido
XN Número de não Contemplados Inválido
XO Data da Última Assembléia Inválida
XP Quantidade de Prestações Inválida
XQ Data de Vencimento da Parcela Inválida
XR Valor da Amortização Inválida
XS Código do Personalizado Inválido
XT Valor da Contribuição Inválida
XU Percentual da Contribuição Inválido
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
XV Valor do Fundo de Reserva Inválido
XW Número Parcela Inválido ou Fora de Sequência
XX Percentual Fundo de Reserva Inválido
XY Prz Desc/Multa Preenchido, Obrigat.Perc. ou Valor
XZ Valor Taxa de Administração Inválida
YA Data de Juros Inválida ou Não Informada
YB Data Desconto Inválida ou Não Informada
YC E-mail Inválido
YD Código de Ocorrência Inválido
YE Pagador já Cadastrado (Banco de Pagadores)
YF Pagador não Cadastrado (Banco de Pagadores)
YG Remessa Sem Registro Tipo 9
YH Identificação da Solicitação Inválida
YI Quantidade Boletos Solicitada Inválida
YJ Trailler do Arquivo não Encontrado
YK Tipo Inscrição do Responsable Inválido
YL Número Inscrição do Responsable Inválido
YM Ajuste de Vencimento Inválido
YN Ajuste de Emissão Inválido
YO Código de Modelo Inválido
YP Vía de Entrega Inválido
YQ Espécie Banco de Pagador Inválido
YR Aceite Banco de Pagador Inválido
YS Pagador já Cadastrado
YT Pagador não Cadastrado
YU Número do Telefone Inválido
YV CNPJ do Condomínio Inválido
YW Indicador de Registro de Título Inválido
YX Valor da Nota Inválido
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
YY Qtde de dias para Devolução tem que estar entre 5 e 120
YZ Quantidade de Produtos Inválida
ZA Perc. Taxa de Administração Inválido
ZB Valor do Seguro Inválido
ZC Percentual do Seguro Inválido
ZD Valor da Diferença da Parcela Inválido
ZE Perc. Da Diferença da Parcela Inválido
ZF Valor Reajuste do Saldo de Caixa Inválido
ZG Perc. Reajuste do Saldo de Caixa Inválido
ZH Valor Total a Pagar Inválido
ZI Percentual ao Total a Pagar Inválido
ZJ Valor de Outros Acréscimos Inválido
ZK Perc. De Outros Acréscimos Inválido
ZL Valor de Outras Deduções Inválido
ZM Perc. De Outras Deduções Inválido
ZN Valor da Contribuição Inválida
ZO Percentual da Contribuição Inválida
ZP Valor de Juros/Multa Inválido
ZQ Percentual de Juros/Multa Inválido
ZR Valor Cobrado Inválido
ZS Percentual Cobrado Inválido
ZT Valor Disponibilizado em Caixa Inválido
ZU Valor Depósito Bancario Inválido
ZV Valor Aplicações Financieras Inválido
ZW Data/Valor Preenchidos, Obrigatório Dódigo Desconto
ZX Valor Cheques em Cobrança Inválido
ZY Desconto c/ valor Fixo, Obrigatório Valor do Título
ZZ Código Movimento Inválido p/ Segmento Y8
01 Código do Banco Inválido
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
02 Código do Registro Inválido
03 Código do Segmento Inválido
04 Código do Movimento não Permitido p/ Carteira
05 Código do Movimento Inválido
06 Tipo Número Inscrição Beneficiário Inválido
07 Agencia/Conta/DV Inválidos
08 Nosso Número Inválido
09 Nosso Número Duplicado
10 Carteira Inválida
11 Data de Geração Inválida
12 Tipo de Documento Inválido
13 Identif. Da Emissão do Boleto Inválida
14 Identif. Da Distribuição do Boleto Inválida
15 Características Cobrança Incompatíveis
16 Data de Vencimento Inválida
17 Data de Vencimento Anterior a Data de Emissão
18 Vencimento fora do prazo de operação
19 Título a Cargo de Bco Correspondentes c/ Vencto Inferior a
XX Dias
20 Valor do Título Inválido
21 Espécie do Título Inválida
22 Espécie do Título Não Permitida para a Carteira
23 Aceite Inválido
24 Data da Emissão Inválida
25 Data da Emissão Posterior a Data de Entrada
26 Código de Juros de Mora Inválido
27 Valor/Taxa de Juros de Mora Inválido
28 Código do Desconto Inválido
29 Valor do Desconto Maior ou Igual ao Valor do Título
30 Desconto a Conceder Não Confere
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
31 Concessão de Desconto - Já Existe Desconto Anterior
32 Valor do IOF Inválido
33 Valor do Abatimento Inválido
34 Valor do Abatimento Maior ou Igual ao Valor do Título
35 Valor Abatimento a Conceder Não Confere
36 Concessão de Abatimento - Já Existe Abatimento Anterior
37 Código para Protesto Inválido
38 Prazo para Protesto Inválido
39 Pedido de Protesto Não Permitido para o Título
40 Título com Ordem de Protesto Emitida
41 Pedido Cancelamento/Sustação p/ Títulos sem Instrução
Protesto
42 Código para Baixa/Devolução Inválido
43 Prazo para Baixa/Devolução Inválido
44 Código da Moeda Inválido
45 Nome do Pagador Não Informado
46 Tipo/Número de Inscrição do Pagador Inválidos
47 Endereço do Pagador Não Informado
48 CEP Inválido
49 CEP Sem Praça de Cobrança (Não Localizado)
50 CEP Referente a um Banco Correspondente
51 CEP incompatível com a Unidade da Federação
52 Unidade da Federação Inválida
53 Tipo/Número de Inscrição do Sacador/Avalista Inválidos
54 Sacador/Avalista Não Informado
55 Nosso número no Banco Correspondente Não Informado
56 Código do Banco Correspondente Não Informado
57 Código da Multa Inválido
58 Data da Multa Inválida
59 Valor/Percentual da Multa Inválido
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
60 Movimento para Título Não Cadastrado
61 Alteração da Agência Cobradora/DV Inválida
62 Tipo de Impressão Inválido
63 Entrada para Título já Cadastrado
64 Entrada Inválida para Cobrança Caucionada
65 CEP do Pagador não encontrado
66 Agencia Cobradora não encontrada
67 Agencia Beneficiário não encontrada
68 Movimentação inválida para título
69 Alteração de dados inválida
70 Apelido do cliente não cadastrado
71 Erro na composição do arquivo
72 Lote de serviço inválido
73 Código do Beneficiário inválido
74 Beneficiário não pertencente a Cobrança Eletrônica
75 Nome da Empresa inválido
76 Nome do Banco inválido
77 Código da Remessa inválido
78 Data/Hora Geração do arquivo inválida
79 Número Sequencial do arquivo inválido
80 Versão do Lay out do arquivo inválido
81 Literal REMESSA-TESTE - Válido só p/ fase testes
82 Literal REMESSA-TESTE - Obrigatório p/ fase testes
83 Tp Número Inscrição Empresa inválido
84 Tipo de Operação inválido
85 Tipo de serviço inválido
86 Forma de lançamento inválido
87 Número da remessa inválido
88 Número da remessa menor/igual remessa anterior
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
89 Lote de serviço divergente
90 Número sequencial do registro inválido
91 Erro seq de segmento do registro detalhe
92 Cod movto divergente entre grupo de segm
93 Qtde registros no lote inválido
94 Qtde registros no lote divergente
95 Qtde lotes no arquivo inválido
96 Qtde lotes no arquivo divergente
97 Qtde registros no arquivo inválido
98 Qtde registros no arquivo divergente
99 Código de DDD inválido
Transferência p/ Desconto Não Permitida p/ a Carteira do
Título
Data Juros de Mora Inválido
Data do Desconto Inválida
Título com Pagamento Vinculado
Seu Número Inválido
e-mail/SMS enviado
e-mail Lido
e-mail/SMS devolvido - end e-mail ou número celular
incorreto
e-mail devolvido - caixa postal cheia
e-mail/número do celular do pagador não informado
Pagador optante por Boleto Eletrônico - e-mail não
enviado
Código para emissão de boleto não permite envio de e-
mail
Código da Carteira inválido para envio e-mail
Contrato não permite o envio de e-mail
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
B - Códigos de tarifas / custas de ‘01’ a ‘20’ associados ao
código de movimento ‘28’ (Descrição C044)
01 Tarifa de Emissão de Extrato de Posição
02 Tarifa de Manutenção de Título Vencido
03 Tarifa de Sustação
04 Tarifa de Protesto
05 Tarifa de Outras Instruções
06 Tarifa de Outras Ocorrências
07 Tarifa de Envio de Duplicata ao Pagador
08 Custas de Protesto
09 Custas de Sustação de Protesto
10 Custas de Cartório Distribuidor
11 Custas de Edital
12 Redisponibilização de Arquivo Retorno Eletrônico
13 Tarifa Sobre Registro Cobrada na Baixa/Liquidação
14 Tarifa Sobre Reapresentação Automática
15 Banco de Pagadores
16 Tarifa Sobre Informações Via Fax
17 Entrega Aviso Disp Boleto via e-mail ao pagador (s/
emissão Boleto)
18 Emissão de Boleto Pré-impresso CAIXA matricial
19 Emissão de Boleto Pré-impresso CAIXA A4
20 Emissão de Boleto Padrão CAIXA
21 Emissão de Boleto/Carnê
31 Emissão de Aviso de Vencido
42 Alteração cadastral de dados do título - sem emissão de
aviso
45 Emissão de 2ª via de Boleto Cobrança Registrada
Tarifa Sobre Devolução de Título Vencido
Tarifa Sobre Rateio de Crédito
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Tarifa Sobre Prorrogação de Vencimento
Tarifa Sobre Alteração de Abatimento/Desconto
Tarifa Sobre Arquivo mensal (Em Ser)
Tarifa Sobre Emissão de Boleto Pré-Emitido pelo Banco
```
```
C - Códigos de liquidação / baixa de ‘01’ a ‘15’ associados aos
códigos de movimento ‘06’, ‘09’ e ‘17’ (Descrição C044)
posição 214
Liquidação
02 Casa Lotérica
03 Agências CAIXA
04 Compensação Eletrônica
05 Compensação Convencional
06 Internet Banking
07 Correspondente Bancário
08 Em Cartório
Baixa
09 Comandada Banco
10 Comandada Cliente via Arquivo
11 Comandada Cliente On-line
12 Decurso Prazo - Cliente
13 Decurso Prazo - Banco
14 Protestado
```
```
D - Para as liquidações associadas aos códigos 02, 03 e 08
(posição 216)
01 Dinheiro
02 Cheque
```
```
E - Para todos os canais de liquidação (posição 218)
Será informado em quantidade de dias o float cadastrado
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
para cada tipo de liquidação
```
C048 Valor dos Juros / Multa / Encargos

```
Valor dos acréscimos efetuados no título de cobrança, expresso em
moeda corrente.
```
##### C048

C049 Valor do Desconto Concedido

```
Valor dos descontos efetuados no título de cobrança, expresso em
moeda corrente.
```
##### C049

C050 Valor do Abatimento Concedido / Cancelado

```
Valor dos abatimentos efetuados ou cancelados no título de
cobrança, expresso em moeda corrente.
```
##### C050

C052 Valor Pago pelo Pagador

```
Valor do pagamento efetuado pelo Pagador referente ao título de
cobrança, expresso em moeda corrente.
```
##### C052

C054 Valor de Outras Despesas

```
Valor de despesas referente a Custas Cartorárias, se houver.
```
##### C054

C055 Valor de Outros Créditos

```
Valor efetivo de créditos referente ao título de cobrança, expresso
em moeda corrente.
```
##### C055

C056 Data da Ocorrência

```
Data do evento que afeta o estado do título de cobrança. Utilizar o
formato DDMMAAAA, onde:
DD = dia
MM = mês
AAAA = ano
```
##### C056

C057 Data da Efetivação do Crédito

```
Data de disponibilização do crédito referente ao título de
cobrança. Utilizar o formato DDMMAAAA, onde:
DD = dia
MM = mês
AAAA = ano
```
##### C057

##### C060

```
Nome do Sacador / Avalista
Nome que identifica a entidade, pessoa física ou jurídica,
```
##### C060


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Beneficiário original do título de cobrança.
Informação obrigatória quando se tratar de título negociado com
terceiros.
```
C061
Código de Cálculo de Rateio para Beneficiário
Código adotado pela FEBRABAN para identificar a maneira de
cálculo da divisão do valor do crédito entre os beneficiários do
Título.
‘1’ = Valor Cobrado
‘2’ = Valor Registro
‘3’ = Rateio pelo Menor Valor

##### C061

##### C062

```
Tipo de Valor Informado
Código adotado pela FEBRABAN para identificar qual o valor
informado para rateio de crédito.
‘1’ = Percentual (%)
‘2’ = Valor ou Quantidade
```
##### C062

C063 Identificador da Parcela do Rateio

```
Número seqüencial para identificação da parcela de rateio do
título de cobrança.
```
##### C063

C064 Quantidade de Dias para Crédito do Beneficiário

```
Número de dias decorrentes após a disponibilização do crédito do
título de cobrança para efetivação do crédito ao beneficiário.
```
##### C064

C065 Data do Crédito do Beneficiário

```
Data de efetivação do crédito referente ao rateio do título de
cobrança. Utilizar o formato DDMMAAAA, onde:
DD = dia
MM = mês
AAAA = ano
```
##### C065

##### C066

```
Identificação das Rejeições
Código adotado pela FEBRABAN para identificar o motivo ocorrido
para rejeição de registro de rateio de crédito.
Códig
o
```
```
Descrição
```
##### C066


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
‘01’ Conta Beneficiário Inválida
‘02’ Conta Corrente Inativa para Rateio
‘03’ Código de Cálculo do Rateio Diferente de 1, 2 ou 3
‘04’ Banco/Agência/Conta do Beneficiário Não Numérico
‘05’ Valor do Rateio Informado Não Numérico
‘06’ Percentual para Rateio Não Numérico
‘07’ Tipo de Valor Informado Diferente de 1 ou 2
‘08’ Banco Não Participante do Rateio
‘09’ Dígito Agência Beneficiário Não Confere
‘10’ Dígito Conta Beneficiário Não Confere
‘11’ Banco/Agência/Conta Beneficiário Igual a Zeros
‘12’ Nome do Beneficiário Não Informado
‘13’ Quantidade de Beneficiários Excedida
‘14’ Floating Beneficiário Inválido
‘15’ Tipo Valor Informado, Inválido para Código Cálculo
Rateio
‘16’ Beneficiário com Códigos de Cálculo de Rateio
Diferentes
‘17’ Beneficiários Informados em Percentual e Outros em
Valor
‘18’ Somatória dos Valores dos Beneficiários Excedeu Valor
do Título
‘19’ Somatório dos Percentuais dos Beneficiários Excedeu
100%
‘20’ Acerto do Rateio Efetuado
‘21’ Cliente Bloqueado para Rateio
‘22’ Título Não Registrado na Cobrança
‘23’ Título Não Cadastrado para Rateio, Efetuada a
Inclusão
‘24’ Cancelamento de Rateio Efetuado
‘25’ Rateio Cancelado, Título Baixado
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
‘26’ Rateio Efetuado, Beneficiário Aguardando Crédito
‘27’ Rateio Efetuado, Beneficiário Já Creditado
‘28’ Rateio Não Efetuado, Conta Beneficiário Encerrada
‘29’ Rateio Não Efetuado, Conta Débito Beneficiário
Bloqueada
‘30’ Rateio Não Efetuado, Código Cálculo 2 (Vlr Registro) e
Vlr Pago Menor
‘31’ Ocorrência Não Possui Rateio
‘32’ Título Já Cadastrado para Rateio
‘33’ Número do Documento Inválido (Seu Número)
‘34’ Título Já Rateado ou Baixado
```
##### C067

```
Número da Nota Fiscal
Número da nota fiscal referente a um título de cobrança, informado
pelo Beneficiário. Este número é subordinado a uma série e local.
Utilizado no caso dos modelos de boleto personalizado Nota Fiscal e
Similar a Nota Fiscal.
```
##### C067

##### C068

```
Valor da Nota Fiscal
Valor constante da nota fiscal do Beneficiário referente ao título de
cobrança. Informação para repasse ao Pagador por ocasião de
pagamento eletrônico. Utilizado no caso dos modelos de boleto
personalizado Nota Fiscal e Similar a Nota Fiscal.
```
##### C068

##### C070

```
Quantidade de Títulos em Cobrança
Somatória dos registros enviados no lote do arquivo de acordo com
o Código da Carteira. Só serão utilizados para informação do
arquivo retorno.
```
##### C070

##### C071

```
Valor Total dos Títulos em Carteiras
Somatória dos valores dos títulos de cobrança enviados no lote do
arquivo de acordo com o Código da Carteira. Só serão utilizados
para informação do arquivo retorno.
```
##### C071

##### C073

```
Mensagem 1 / 2
Texto referente a mensagens que serão impressas no campo
instruções da Ficha de Compensação e na parte Recibo do
Pagador, em todos os boletos referentes ao mesmo lote. Utilizar
```
##### C073


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
somente se o código de movimento for ‘01’ - Entrada/Solicitação de
títulos.
Estes campos não serão enviados no arquivo retorno.
```
C074
Valor / Percentual do Título ou Quantidade de Moedas
Quando moeda corrente, utiliza 2 casas decimais;
Quando moeda variável, utilizar 5 casas decimais;
Quando percentual, utilizar 2 casas decimais.
Valor ou percentual do título para Rateio de Crédito. Quando o
valor for expresso em percentual, deve ser informado com 3
decimais

##### C074

C075 Número do Registro (Posição Relativa do Registro)

```
Quando o código da notificação for 02 (nota C090) este campo
conterá a posição relativa do registro dentro do arquivo; caso
contrário este campo conterá a quantidade total de registros
processados.
```
##### C075

C076 Código do Campo

```
Este campo terá a seguinte característica: CCTS, onde:
CC = número do campo que foi rejeitado
T = tipo do registro
S = segmento (se for o caso)
Exemplo: 013P = campo 01 do registro tipo 3, segmento P
Exceções:
1) Para erros graves, este campo será preenchido com ‘0000’.
Exemplos: mensagens CNAB VC (padrão de arquivo CNAB), 74
(beneficiário não é eletrônico), 71 (erro na composição do arquivo),
02 (código do registro inválido)
2) Quando ocorrerem erros nos campos do Header de Arquivo/Lote
e Trailer de Lote/Arquivo, este campo será preenchido com CC.T
```
##### C076

##### C077

```
Número da versão do Aplicativo CAIXA
Para uso da CAIXA Econômica Federal para informação do número
da versão do aplicativo ponta instalado no cliente / beneficiário.
```
##### C077

##### C078

```
Código do Modelo Personalizado
Campo numérico com tamanho de 7 posições, para informação,
do código do modelo do boleto personalizado (Código fornecido
```
##### C078


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
pela CAIXA/Gráfica, utilizado somente quando o modelo do boleto
for personalizado).
```
C079 Número e Nome do Banco de Pagadores

```
Para informação do Número e Nome do Banco de Pagadores
movimentado. Informar somente se o código de movimento for 36,
37 ou 38 (relativos a manutenção do Banco de Pagadores)
```
##### C079

##### C080

```
Código do Pagador no Banco de Pagadores
Para informação do código associado ao pagador no Banco de
Pagadores. Informado quando Código de Movimento para retorno
for = 38 (Emissão de Boletos via Banco de Pagadores)
```
##### C080

C081 Identificação da Solicitação

```
Código adotado para identificar o serviço que está sendo
solicitado, pode ser:
02 - Redisponibilização Arquivo Retorno
03 - Emissão Boleto Pré-impresso Matricial
05 - Emissão de 2ª via de Extrato de Cobrança
06 - Emissão de Títulos para Banco de Pagadores
07 - Agendamento de Títulos via Banco de Pagadores
09 - Emissão de 2ª via de Extrato de Rateio
11 - Emissão Boleto Pré-impresso A4
```
##### C081

C082 ID Número Identificador

```
Identifica o conteúdo do campo Número Identificador e está
associado ao código da Identificação da Solicitação.
2 - Código do Beneficiário + Número do Retorno (quando serviço =
02, redisponibilização Arquivo Retorno)
3 - Código do Beneficiário + Código do Banco de Pagadores
(quando serviço = 06 e 07, emissão/agendamento de Títulos para
Banco de Pagadores)
```
##### C082

C083 Número Identificador

```
Contém o Identificador de quem está solicitando o serviço. Deve ser
preenchido conforme indicado na NOTA C082
```
##### C083

C084 Descrição da Solicitação

```
Campo para descrição do serviço solicitado. Está relacionado ao
código da Identificação da Solicitação (nota C081), deve ser
```
##### C084


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
preenchido conforme abaixo:
Se solicitação = 2 (Redisponibilização Arquivo Retorno)
1 - Número do Retorno (6 posições), ou
2 - Data do Movimento (10 posições), no formato DD.MM.AAAA
```
```
Se solicitação = 3 ou 11 (Emissão Boleto Pré-impresso
Matricial ou A4)
1 - Modelo do Boleto (2 posições), sendo “01” p/
solicitação 3 (Matricial) ou “02” p/ solicitação 11 (A4)
2 - Constante (1 posição) - Fixo = “0”
3 - Nosso Número Inicial (17 posições) (opcional)
4 - Forma de Entrega (2 posições) - vide nota C010
5 - Registro do Título (1 posição), sendo “S” p/
Cobrança Registrada ou “N” p/ Cobrança Sem
Registro
```
```
Se solicitação = 5 ou 9 (Emissão 2ª via Extrato da
Cobrança ou Rateio)
1 - Forma de Entrega / Distribuição (2 posições), vide
nota C010
2 - Data da Solicitação (10 posições), no formato
DD.MM.AAAA
3 - Data inicial do Movimento (10 posições), no formato
DD.MM.AAAA
4 - Data final do Movimento (10 posições), no formato
DD.MM.AAAA
```
```
Se solicitação = 6 ou 7 (Emissão e Agendamento de
Títulos p/ Banco de Pagadores)
1 - Número do Banco de Pagadores (3 posições)
2 - Registro do Título (1 posição), sendo ‘S’ p/
Cobrança Registrada ou ‘N’ p/ Cobrança Sem
Registro
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
3 - Valor dos Títulos (14 posições + 2 decimais)
preenchimento opcional
4 - Data do Vencimento (10 posições), no formato
DD.MM.AAAA
5 - Dia do Vencimento (2 posições)
6 - Ajuste de Vencimento (1 posição), vide nota C087
7 - Dia de Emissão do Boleto (2 posições)
8 - Forma de Emissão do Boleto (1 posição), vide nota
C009
9 - Espécie do Documento (2 posições), vide nota C015
10 - Tipo de Aceite (1 posição), sendo ‘A’ para título
Com Aceite ou ‘N’ para título Sem Aceite
11 - Forma de Entrega / Distribuição (2 posições), vide
nota C010
12 - Endosso (1 posição), sendo ‘S’ para Sim ou ‘N’
para Não
13 - Indicador de Protesto (1 posição), sendo ‘S’ para
Sim ou ‘N’ para Não
14 - Prazo de Protesto / Devolução (4 posições)
15 - Tipo de Juros Dia (1 posição), vide nota C018
16 - Percentual Juros Dia (3 posições + 2 decimais)
17 - Percentual Desconto 1 (3 posições + 2 decimais)
18 - Valor Desconto 1 (13 posições + 2 decimais)
19 - Prazo Desconto 1 (3 posições)
20 - Percentual Desconto 2 (3 posições + 2 decimais)
21 - Valor Desconto 2 (13 posições + 2 decimais)
22 - Prazo Desconto 2 (3 posições)
23 - Percentual Desconto 3 (3 posições + 2 decimais)
24 - Valor Desconto 3 (13 posições + 2 decimais)
25 - Prazo Desconto 3 (3 posições)
26 - Percentual Multa (3 posições + 2 decimais)
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
27 - Valor Multa (13 posições + 2 decimais)
28 - Prazo Multa (3 posições)
```
C085 Quantidade Solicitada

```
Para informação da quantidade de boletos na solicitação. Somente
para ID solicitação igual a 03 ou 11 (Emissão Boleto Pré-impresso
Matricial ou A4), nota C081.
```
##### C085

C086 Agência Cobradora / Recebedora

```
Código da agência recebedora do título.
```
##### C086

C087 Id Ajuste Vencimento/ Id Ajuste Emissão

```
Para informação de ajuste no cálculo da data de Vencimento e de
Emissão de títulos para Banco de Pagadores. Indica a data quando
ocorrer em dia não útil (final de semana ou feriado). Pode ser:
A - Antecipa
P - Posterga
M - Mantém
```
##### C087

C089 Código Padrão

```
Identifica o formato do campo "complemento de ocorrência":
01 - Formato Livre
02 - Formato Ocorrência (Nota 67)
```
##### C089

C090 Complemento de Ocorrência

```
P/ código Padrão = 01 - Formato Livre
P/ código Padrão = 02 - Mesmo Formato campo "Ocorrência" do
Segmento U:
Data Ocorrência: 8 posições (DDMMAAAA)
Valor Ocorrência: 13 inteiras e 2 decimais
Complemento: 30 posições.
```
##### C090

C091 Identificação da Manutenção (ID manutenção)

```
Código para identificar se a manutenção solicitada é no Banco de
Pagadores ou em Pagadores do Banco. Pode ser:
1 - Banco de Pagadores
2 - Pagador
```
##### C091

C092 Uso livre banco/empresa C092


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Uso livre Banco/Empresa ou Autorização de Pagamento Parcial
```
```
1 – Não autoriza pagamento parcial
2 – Autoriza pagamentos parciais
```
C093 Identificação do Tipo de Pagamento

- Registro Opcional para Identificação do Tipo de Pagamento
01 = Aceita pagamento de qualquer valor
02 = Aceita pagamento de valores entre range mínimo e máximo
03 = Não aceita pagamento com o valor divergente

##### C093

C094 Quantidade de Pagamento Possíveis

- Identificar a Quantidade de Pagamentos possíveis: 01

##### C094

C095 Tipo de Valor Informado

- Identificar o Tipo do Valor Informado:

```
0 = caso informado no campo 09.3Y (Nota Explicativa C093) o Tipo
de Pagamento “01 = Aceita pagamento de qualquer valor” ou “ 03
= Não aceita pagamento com o valor divergente”.
```
```
2 = Valor *
*(utilizar somente em caso de Tipo de Pagamento – 09.3Y – com
Range entre mínimo e máximo – “02 = Aceita pagamento de
valores entre range mínimo e máximo” da Nota Explicativa C093)
```
##### C095

C096 Valor Máximo

- Identificar o Valor Máximo

##### C096

C097 Valor Mínimo

- Identificar o Valor Mínimo

##### C097

C098 Capital Social da Empresa

```
Informação relativa ao Capital Social da empresa contribuinte,
informação obrigatória quando arquivo remessa encaminhado pelo
```
##### C098


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Portal do Contribuinte para a categoria patronal
```
C099 Capital Social do Estabelecimento

```
Informação relativa ao Capital Social do estabelecimento
contribuinte, podendo ser igual ao da empresa, informação
obrigatória quando arquivo remessa encaminhado pelo Portal do
Contribuinte para a categoria patronal
```
##### C099

C100 Número de Empregados Contribuintes

```
Informação obrigatória para a categoria
Empregados/Trabalhadores quando arquivo remessa encaminhado
pelo Portal do Contribuinte
```
##### C100

C101 Total da Remuneração – Contribuintes

```
Informação obrigatória para a categoria
Empregados/Trabalhadores quando arquivo remessa encaminhado
pelo Portal do Contribuinte
```
##### C101

C102 Total de Empregados do Estabelecimento

```
Informação obrigatória para a categoria
Empregados/Trabalhadores quando arquivo remessa encaminhado
pelo Portal do Contribuinte
```
##### C102

C103 Código CNAE Contribuinte/Pagador

```
Informação obrigatória. Preencher com o grupo do CNAE e com
zeros à esquerda para completar as 5 posições. Ex: Grupo 011 –
Produção de Lavouras Temporárias, preencher com 00011.
```
##### C103

C104 Código CEI Contribuinte/Pagador

```
Informação Opcional, sendo que quando informada tem seu DV
validado
```
##### C104

C105 Tipo de Entidade Sindical

```
1=Sindicato; 2=Federação; 3=Confederação; 4=M.T.E; 5=Central
Sindical
```
##### C105

C106 Código sindical da Entidade Sindical

```
Código sindical da entidade sindical beneficiária dos créditos da
Arrecadação Direta, sendo que para Federações, Confederações
ou CEES que somente possuem 3 dígitos, o campo deve ser
complementado com zeros à esquerda.
```
##### C106


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
G - Campos Genéricos
```
##### G001

```
Código do Banco na Compensação
Código fornecido pelo Banco Central para identificação
do Banco que está recebendo ou enviando o arquivo,
com o qual se firmou o contrato de prestação de serviços.
Se CAIXA ECONÔMICA FEDERAL = ‘104’
```
##### G001

##### G002

```
Lote de Serviço
Número seqüencial para identificar um lote de serviço.
Preencher com ‘0001’ para o primeiro lote do arquivo.
Para os demais: número do lote anterior acrescido de 1. O
número não poderá ser repetido dentro do arquivo.
Se registro for Header do Arquivo = ‘0000’
Se registro for Trailer do Arquivo = ‘9999’
```
##### G002

##### G003

```
Tipo de Registro
Código adotado pela FEBRABAN para identificar o tipo de
registro:
‘0’ = Header de Arquivo
‘1’ = Header de Lote
‘3’ = Detalhe
‘5’ = Trailer de Lote
‘9’ = Trailer de Arquivo
```
##### G003

```
G004 Uso Exclusivo FEBRABAN / CNAB
Texto de observações destinado para uso exclusivo da
FEBRABAN.
Preencher com Brancos.
```
##### G004

##### G005

```
Tipo de Inscrição da Empresa ou Pessoa Física
Código que identifica o tipo de inscrição da Empresa ou
Pessoa Física perante uma Instituição governamental:
‘1’ = CPF
‘2’ = CGC / CNPJ
```
##### G005

```
G006 Número de Inscrição da Empresa ou Pessoa Física G006
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Número de inscrição da Empresa (CNPJ) ou Pessoa Física
(CPF).
Obs: A identificação da empresa, no registro Header de
arquivo, pode ser da empresa "mãe" do grupo ou da
Matriz. A identificação da empresa no registro Header de
lote pode ser empresa coligada ou por filial. A
identificação pode se repetir quando for única.
G007
Código do Convênio no Banco (Código do Beneficiário)
Código fornecido pela CAIXA, através da agência de
relacionamento do cliente.
Deve ser preenchido com o código do Beneficiário (6
posições).
```
##### G007

##### G008

```
Agência Mantenedora da Conta
Código adotado pelo Banco responsável pela conta,
para identificar a qual unidade está vinculada a conta
corrente.
Tamanho 5 posições. Preencher com zero a esquerda.
```
##### G008

##### G009

```
Dígito Verificador da Agência
Código adotado pelo Banco responsável pela conta
corrente, para verificação da autenticidade do Código
da Agência. Fornecido pela CAIXA. (Calculado pelo
módulo 11)
```
##### G009

##### G010

```
Número da Conta Corrente
Número adotado pelo Banco, para identificar o número
da conta corrente utilizada pelo Cliente.
Tamanho 12. Preencher com zeros à esquerda.
```
##### G010

##### G011

```
Dígito Verificador da Conta
Código adotado pelo Banco, para verificação da
autenticidade do Número da Conta Corrente.
Deverá ser Calculado através do módulo 11.
Exemplo de como calcular o DV da Conta Corrente:
Conta Corrente:: 000000109990
0 0 0 0 0 0 1 0 9 9 9 0
5 4 3 2 9 8 7 6 5 4 3 2
```
##### G011


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### 0 0 0 0 0 0 7 0 4

##### 5

##### 3

##### 6

##### 2

##### 7

##### 0

```
1ª linha – Conta Corrente (12 posições – preencher com
zeros à esquerda)
2ª linha – Índice Multiplicação (preencher
seqüencialmente de 2 a 9 da direita p/a esquerda)
3ª linha – Multiplicação Coluna por Coluna
Soma-se os valores da 3ª linha:
0+0+0+0+0+0+7+0+45+36+27+0 = 115
Dividir o resultado da soma por onze: 115/11 = 10 (RESTO 5)
Subtrair onze pelo resto da divisão: 11 – 5 = 6
O dígito calculado é 6
Obs.: Se o resultado da subtração for maior que 9 (nove) o
dígito será 0 (zero)
G012
Dígito Verificador da Agência / Conta Corrente
Código adotado pelo Banco, para verificação da
autenticidade do par Código da Agência / Nº Cta
Corrente.
Deverá ser calculado através do módulo 11.
Exemplo de como calcular o DV da Agência/Conta
Corrente:
Agência/Conta Corrente: 0161.000000109990
Agência (sem DV) 0161 / Conta Corrente (sem
operação e sem DV): 000000109990
0 1 6 1 0 0 0 0 0 0 1 0 9 9 9 0
9 8 7 6 5 4 3 2 9 8 7 6 5 4 3 2
0 8 4
2
```
##### 6 0 0 0 0 0 0 7 0 4

##### 5

##### 3

##### 6

##### 2

##### 7

##### 0

```
1ª linha – Agência/Conta Corrente
2ª linha – Índice Multiplicação (preencher
seqüencialmente de 2 a 9 da direita p/a esquerda)
3ª linha – Multiplicação Coluna por Coluna
Soma-se os valores da 3ª linha:
```
##### G012


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### 0+8+42+6+0+0+0+0+0+0+7+0+45+36+27+0 = 171

```
Dividir o resultado da soma por onze: 171/11 = 15 (RESTO 6)
Subtrair onze pelo resto da divisão: 11 – 6 = 5
O dígito calculado é 5
Obs.: Se o resultado da subtração for maior que 9 (nove) o
dígito será 0 (zero)
G 013 Nome da Empresa (cliente)
Nome que identifica a pessoa, física ou jurídica, a qual se
quer fazer referência.
```
##### G013

```
G014 Nome do Banco
Nome que identifica o Banco que está recebendo ou
enviando o arquivo.
Na remessa, informar: CAIXA ECONOMICA FEDERAL
No retorno, é devolvido: C ECON FEDERAL
```
##### G014

```
G015 Código Remessa / Retorno
Código adotado pela FEBRABAN para qualificar o envio
ou devolução de arquivo entre a Empresa Cliente e o
Banco prestador dos Serviços. Informar:
‘1’ = Remessa (Cliente → Banco)
‘2’ = Retorno (Banco → Cliente)
‘3’ = Remessa Processada (Banco → Cliente - Pré-crítica)
‘4’ = Remessa Processada Parcial (Banco → Cliente - Pré-
crítica)
‘5’ = Remessa Rejeitada (Banco → Cliente - Pré-crítica)
```
##### G015

```
G016 Data de Geração do Arquivo
Data da criação do arquivo. Utilizar o formato
DDMMAAAA, onde :
DD = dia
MM = mês
AAAA = ano
```
##### G016

```
G017 Hora de Geração do Arquivo
Hora da criação do arquivo. Utilizar o formato HHMMSS,
```
##### G017


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
onde:
HH = hora
MM = minuto
SS = segundo
G018
Número Seqüencial do Arquivo
Número seqüencial adotado e controlado pelo
responsável pela geração do arquivo para ordenar a
disposição dos arquivos encaminhados.
Evoluir um número seqüencial a cada header de arquivo.
```
##### G018

##### G019

```
Número da Versão do Layout do Arquivo
Código adotado pela FEBRABAN para identificar qual a
versão de layout do arquivo encaminhado. O código é
composto de:
Versão = 2 dígitos
Release = 1 dígito
```
##### G019

```
G020 Densidade de Gravação do Arquivo
Densidade de gravação (BPI), do arquivo encaminhado.
Não utilizado na cobrança eletrônica, informar fixo ‘0’.
```
##### G020

```
G021 Para Uso Reservado do Banco
Texto de observações destinado para uso exclusivo da
CAIXA ECONÔMICA FEDERAL, para informar o status do
beneficiário no arquivo retorno:
Durante a fase de testes (simulado) conterá a literal
‘RETORNO-TESTE’
Estando em produção conterá a literal ‘RETORNO-
PRODUÇÃO’
Para arquivo Retorno Pré-Crítica conterá:
```
- Durante a fase de testes (simulado): brancos
- Remessa em Produção Processada Total: literal
‘REMESSA PROCESSADA‘
- Remessa em Produção Processada Parcial: literal
‘REMESSA PROCESSADA P’
- Remessa em Produção Rejeitada: literal ‘REMESSA

##### G021


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### REJEITADA’

```
Obs.: após a alteração da situação do beneficiário de
TESTE para PRODUÇÃO não haverá a possibilidade de
retorno ao status de simulação.
G022 Para Uso Reservado da Empresa
Campo a ser utilizado pelo cliente/beneficiário, para
informação da situação da remessa que está sendo
enviada à CAIXA:
Na fase de testes (simulado), conterá a literal ‘REMESSA-
TESTE’
Estando em produção conterá a literal ‘REMESSA-
PRODUÇÃO’
Obs.: após a alteração da situação do beneficiário de
TESTE para PRODUÇÃO não haverá a possibilidade de
retorno ao status de simulação.
```
##### G022

##### G025

```
Tipo de Serviço
Código adotado pela FEBRABAN para indicar o tipo de
serviço / produto (processo) contido no arquivo / lote.
Domínio:
‘01’ = Cobrança Registrada
‘03’ = Desconto de Títulos
‘04’ = Caução de Títulos
```
##### G025

##### G028

```
Tipo de Operação
Código adotado pela FEBRABAN para identificar a
transação que será realizada com os registros detalhe do
lote. Domínio:
‘R’ = Arquivo Remessa
‘T’ = Arquivo Retorno
```
##### G028

##### G030

```
Número da Versão do Layout do Lote
Identifica qual a versão de layout do lote de arquivo
encaminhado. O código é composto de:
Versão = 2 dígitos
Release = 1 dígito
```
##### G030

```
G032 Endereço G032
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Texto referente a localização da rua / avenida, número,
complemento e bairro utilizado para entrega de
correspondência.
Utilizado também para endereço de e-mail para entrega
eletrônica da informação e para número de celular para
envio de mensagem SMS.
Utilizar também quando o código de movimento for igual
a 35, 36, 37 ou 38 (Banco de Pagadores)
G033 Cidade
Texto referente ao nome do município componente do
endereço utilizado para entrega de correspondência.
```
##### G033

##### G034 CEP

```
Código adotado pelos CORREIOS para identificação de
logradouros.
```
##### G034

```
G035 Sufixo do CEP
Código adotado pelos CORREIOS para complementação
do código de CEP.
```
##### G035

```
G036 Estado / Unidade da Federação
Código do estado, unidade da federação componente
do endereço utilizado para entrega de correspondência.
```
##### G036

##### G038

```
Número Seqüencial do Registro no Lote
Número para identificar a seqüência de registros
encaminhados no lote.
Deve ser inicializado sempre em ‘1’, em cada novo lote.
```
##### G038

```
G039 Código de Segmento do Registro Detalhe
Código adotado pela FEBRABAN para identificar o
segmento do registro. Informar de acordo com que solicita
a coluna default de cada segmento.
```
##### G039

```
G045 Valor do Abatimento
Valor do abatimento (redução do valor do documento,
devido a algum problema), expresso em moeda corrente.
```
##### G045

```
G049 Quantidade de Lotes do Arquivo
Número obtido pela contagem dos lotes enviados no
arquivo.
```
##### G049


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Somatória dos registros de tipo 1, incluindo header e trailer.
G056 Quantidade de Registros do Arquivo
Número obtido pela contagem dos registros enviados no
arquivo.
Somatória dos registros de tipo 0, 1, 3, 5 e 9.
```
##### G056

##### G057

```
Quantidade de Registros do Lote
Número obtido pela contagem dos registros enviados no
lote do arquivo.
Somatória dos registros de tipo 1, 3, e 5.
```
##### G057

##### G065

```
Código da Moeda
Código adotado pela FEBRABAN para identificar a moeda
referenciada no Título.
Informar fixo: ‘09’ = REAL
```
##### G065

```
G067 Identificação de Registro Opcional
Código adotado pela FEBRABAN para identificação de
registros opcionais.
‘01’ = Informação de dados do Sacador/Avalista
‘03’ = Informação de dados do Pagador
‘08’ = Serviços
‘50’ = Informação de Dados para Rateio de Crédito
‘53’ = identificação de Tipo de Pagamento
```
##### G067

##### G067A

```
Identificação de Registro Opcional (Código do Boleto
Personalizado)
Id Modelo do Boleto
Código de Modelo do Boleto Tipo de Registro
02 - Modelo Padrão CAIXA
10 - Genérico Modelo 01 1
11 - Genérico Modelo 02 1
12 - Condomínios 1,
13 - Nota Fiscal 1, 2(*)
14 - Consórcios 1, 2, 3, 4, 5
```
##### G067A


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
18 - Similar a Nota Fiscal 1, 2(*)
19 - Seguradoras 1, 2(*), 3(*)
21 - Escolas 1
22 - Imobiliárias 1
30 - Carnê 1
(*) Indica que o registro pode ocorrer N vezes
G068 Data de Gravação Remessa / Retorno
Data da gravação do arquivo de remessa ou retorno.
Utilizar o formato DDMMAAAA, onde:
DD = dia
MM = mês
AAAA = ano
```
##### G068

##### G069

```
Identificação do Título no Banco
Número adotado pelo Banco Beneficiário para identificar
o Título (Nosso Número).
1) Preencher sempre com zeros (‘0’) no arquivo
remessa.
2) O sistema da CAIXA é responsável pelo controle do
Nosso Número, assim, quando do registro da guia, o
sistema informará o Nosso Número do boleto no
arquivo retorno.
```
##### G069

##### G070

```
Valor Nominal do Título
Valor original do Título.
Quando o valor for expresso em moeda corrente, utilizar 2
casas decimais.
Quando o valor for expresso em moeda variável, utilizar 5
decimais.
```
##### G070

```
G071 Data da Emissão do Título
Data de emissão do Título. Utilizar o formato DDMMAAAA,
onde:
DD = dia
```
##### G071


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
MM = mês
AAAA = ano
G072 Identificação do Título na Empresa
Campo destinado para uso da Empresa Beneficiário para
identificação do Título.
Informar o Número do Documento - Seu Número
```
##### G072

```
G073 Código da Multa
Código adotado pela FEBRABAN para identificação do
critério de pagamento de pena pecuniária, a ser
aplicada pelo atraso do pagamento do Título. Pode ser:
‘0’ = Sem Multa
'1' = Valor Fixo
'2' = Percentual
```
##### G073

```
G074 Data da Multa
Data a partir da qual a multa deverá ser cobrada. Na
ausência, será considerada a data de vencimento. Utilizar
o formato DDMMAAAA, onde:
DD = dia
MM = mês
AAAA = ano
```
##### G074

```
G075 Valor / Percentual a Ser Aplicado
Valor ou percentual de multa a ser aplicado sobre o valor
do Título, por atraso no pagamento. Se Código da Multa
(Nota G073):
= ‘1’ Informar valor
= ‘2’ Informar percentual
```
##### G075

```
G076 Valor da Tarifa / Custas
Valor da tarifa cobrada pelo serviço prestado pelo Banco
Beneficiário referentes ao Título, expresso em moeda
corrente.
```
##### G076

```
G077 Valor do IOF Recolhido
Valor do IOF - Imposto sobre Operações Financeiras -
recolhido sobre o Título, expresso em moeda corrente.
```
##### G077


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
G078 Valor Líquido a ser Creditado
Valor efetivo a ser creditado referente ao Título, expresso
em moeda corrente.
```
##### G078

```
G079 Número Remessa / Retorno
Número adotado e controlado pela CAIXA responsável
pela geração magnética dos dados contidos no arquivo
para identificar a sequência de envio ou devolução do
arquivo entre o Beneficiário e o Banco Beneficiário.
Obs.: o número informado deve ser sequencial crescente
(anterior + 1) por dia. Tendo a seguinte formatação:
AA – Ano Geração
DDD – Dia Juliano Geração
SSSSSSS – Sequencial Geração. Iniciando-se por 1 todos os
dias.
```
##### G079


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### 5

##### 5.1 TABELA DE CÓDIGOS DE RETORNO DE PRÉ-CRÍTICA – LOG – PORTAL DA ENTIDADE

##### SITCS – TABELA DE CÓDIGOS DE RETORNO DE PRÉ-CRÍTICA – LOG – PORTAL DA

##### ENTIDADE

##### COD-

##### ERRO

##### CMP-

##### ERRO

##### CNAB24

##### 0

##### DESCRIÇÃO-MSG-ERRO

```
000 CAIXA PROCESSAMENTO EFETUADO COM SUCESSO
011 CAIXA‘EDB2’^
```
```
ERRO DE ACESSO A TABELA DB2
*Obs. Sistema Indisponível.
```
- Comunicar a Área de Suporte da CAIXA.

```
020 CNAB240‘C105’
```
```
TIPO DE ENTIDADE NAO CADASTRADA
*Obs. Identificador do Tipo de Entidade Sindical, Não Cadastrada na
CAIXA.
1=Sindicato;2=Federação;3=Confederação;4=M.T.E;5=Central Sindical
025 CNAB240‘G006’ CNPJ INVALIDO*Obs. Código de Pessoa^ Jurídica, Não Numérico, Zerado ou Inválido.
```
```
037 CNAB240‘C105’
```
```
TIPO DE ENTIDADE INVALIDO
*Obs. Identificador do Tipo de Entidade Sindical, Não Numérica, Zerada,
Inválida ou Não Compatível para Emissão de Guias.
1=Sindicato;2=Federação;3=Confederação;4=M.T.E;5=Central Sindical
076 CNAB240‘C106’
```
```
ENTIDADE SINDICAL NAO CADASTRADA
*Obs. Código de Entidade Sindical, Não Cadastrada na CAIXA
ECONÔMICA FEDERAL.
108 CNAB240‘C106’
```
```
CODIGO DA ENTIDADE SINDICAL INVALIDO
*Obs. Identificador do Código de Entidade Sindical, Não Numérica, Zerada,
Inválida ou Não Compatível para o Tipo de Entidade.
136 CNAB240‘C106’
```
```
ENTIDADE SINDICAL EM PROCESSO DE MIGRACAO
*Obs. Código de Entidade Sindical, Não Está Ativa, é Migrada do SICAS, e
Está em Processo de Migração.
140 CAIXA‘RC22’^
```
```
ERRO NO ACESSO A ROTINA RUCBB022
*Obs. Sistema Indisponível.
```
- Comunicar a Área de Suporte da CAIXA.
172 CNAB240‘G071’

```
DATA DE EMISSAO INVALIDA
*Data de Emissão, Inválida; Não Numérica; Zerada ou não Confere com a
Data de Movimento;
196 CAIXA‘AR71’^ ERRO NA VALIDACAO DO CPF*Cpf do Usuário Responsável, Inválido; ou seja, CPF invalido;^
```
```
199 CAIXA‘AR71’^
```
```
CPF INVALIDO
*Cpf do Usuário Responsável, Inválido; Não Numérico; Zerado ou não
Informado;
```
```
207 CNAB240‘G005’
```
```
TIPO DO CONTRIBUINTE INVALIDO
*Obs. Tipo de Inscrição da Empresa ou Pessoa Física, Não Numérica,
Zerada, Inválida ou Não Compatível.
1=CPF;2=CNPJ;
208 CNAB240‘G006’
```
```
NUMERO DO CONTRIBUINTE INVALIDO
*Obs. Número de Inscrição da Empresa ou Pessoa Física, Não Numérica,
Zerada, Inválida ou Dígito Verificador Não Confere;
209 CAIXA‘AR71’^
```
```
DIGITO VERIFICADOR DO CPF INVALIDO
*Cpf do Usuário Responsável, Inválido; ou seja, Dígito Verificador não
Confere;
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
210 CNAB240‘C106’
```
```
ENTIDADE SINDICAL NAO ESTA ATIVA
*Obs. Código de Entidade Sindical, Não Está Ativa na CAIXA.
```
```
218 CNAB240‘G070’
```
```
VALOR ORIGINAL INVALIDO
*Obs. Valor Nominal do Título, Não Válido, Não Numérico; Zerado;
```
- Emissão WebService, Portal do Contribuinte, a CAIXA só Aceita Valor
Fixo.

```
256 CNAB240‘G017’
```
```
HORA DA RECEPCAO INVALIDA
*Obs. Hora de Geração, Não Válida; Não Numérica; Zerada.
```
```
257 CNAB240‘G067’
```
```
TIPO DE REGISTRO INVALIDO
*Obs. Identificação de Registro Opcional; Inválido; Não Numérico; Zerado;
ou Não Confere;
‘01’ = Informação de dados do Sacador/Avalista
‘03’ = Informação de dados do Pagador
‘08’ = Serviços
‘50’ = Informação de Dados para Rateio de Crédito
‘53’ = identificação de Tipo de Pagamento
```
```
259 CNAB240‘G005’
```
```
TIPO DE PESSOA INVALIDO
*Obs. Tipo de Pessoa Jurídica, Não Numérico, Zerado ou Inválido, Não
Confere.
2=CNPJ
265 CNAB240‘G008’
```
```
CODIGO DA AGENCIA INVALIDO
*Código do Banco, Inválido; Não Numérico; Zerado ou não Confere com
Código do BANCO CAIXA.
298 CNAB240‘G016’
```
```
DATA DO MOVIMENTO INVALIDA
*Data de Geração, Inválida; Não Numérica; Zerada ou não Confere com a
Data Corrente;
366 CNAB240‘G036’ SIGLA DA UF NAO INFORMADA*Obs. Estado/Unidade Federativa Obrigatório;^
370 CNAB240‘C105’ TIPO CENTRAL SINDICAL INVALIDO*Obs. Central Sindical não Possui Autorização para Emissão de Guias.^
401 CNAB240‘C106’ CATEGORIA DE ENTIDADE SINDICAL INVALIDA*Obs. Categoria Sindical, Inválida;
```
```
404 CNAB240‘G009’
```
```
ERRO DE ACESSO A RUCBBDIG(DIGITO VERIFICADOR INVALIDO)
*Obs. Sistema Indisponível.
```
- Comunicar a Área de Suporte da CAIXA.
464 CNAB240‘G006’ NOME DO CONTRIBUINTE DEVE SER PREENCHIDO*Obs. Nome da Empresa/Fantasia ou Pessoa Física é Ob^ rigatório.
469 CNAB240‘G034’ CEP NAO LOCALIZADO*Obs. CEP, Não Válido; Não Consta nas Bases da CAIXA/CO^ RREIOS;

```
470 CNAB240‘C103’
```
```
CNAE INEXISTENTE
*Obs. Código CNAE Contribuinte Pagador, Não Válido; Não Numérico;
Consta nas Bases da CAIXA;
471 CNAB240‘C103’
```
```
CNAE INATIVO
*Obs. Código CNAE Contribuinte Pagador, Não Válido; Não Está
Ativo/Apto;
488 CNAB24‘G036’ 0 SIGLA DE UF INVALIDA*Obs. Estado/Unidade Federativa não Confere com CEP Informado;^
521 CNAB240‘C012’ DATA DE VENCIMENTO *Obs. Data de Vencimento do Título, Inválida; Não Numérica; Zerada;INVALIDA^
551 CNAB240‘G032’ ENDERECO NAO FOI LOCALIZADO*Obs.Endereço Obrigatório;
563 CNAB240‘G001’ BANCO DIFERENTE DE 104*Código do Banco, Inválido; Não Numérico; Zerado ou não Confe^ re com
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Código do BANCO CAIXA.
564 CNAB240‘G065’
```
```
MOEDA DIFERENTE DE 9
*Obs. Moeda, Não Válido; Não Numérico; Zerado ou não Confere com
9=REAL;
```
```
567 CNAB240‘C012’
```
```
FATOR DE VENCIMENTO INVALIDO
*Fator de Vencimento Calculado com Base na Data de Vencimento do
Documento está Inválido, Houve Falha no Processamento da CAIXA.
```
- Comunicar a Área de Suporte da CAIXA.
579 CNAB240‘G007’

```
CODIGO DO CONVENIO NAO NUMERICO OU ZEROS
*Código do Convênio, Inválido; Não Numérico; Zerado ou não Confere com
Código do BANCO CAIXA.
637 CNAB240‘G006’ CNPJ NAO ENCONTRADO*Obs. Código de Pessoa Jurídica, Não Cadastrado na CAIXA.^
654 CNAB240‘G032’ B*Obs.Bairro Obrigatório;AIRRO DEVE SER PREENCHIDO
```
```
656 CNAB240‘G034’
```
```
CEP INVALIDO
*Obs. CEP, Não Válido; Não Numérico; Zerado; ou não Consta nas Bases
da CAIXA/CORREIOS;
657 CNAB240‘G035’
```
```
COMPLEMENTO DO CEP INVALIDO
*Obs. CEP, Não Válido; Não Numérico; ou não Consta nas Bases da
CAIXA/CORREIOS;
658 CAIXA‘AR56’^ CODIGO DDD INFORMADO INVALIDO*Obs.DDD não numérico;
659 CAIXA‘AR57’^ NUMERO DO TELEFONE INVALIDO*Obs.Telefone não numérico;
660 CNAB240‘C098’ VALOR CAPITAL SOCIAL DA EMPRESA INVALIDO*Obs. Capital Social da Empresa, Inválido; Não Numérico;^
661 CNAB240‘C099’ VALOR CAPITAL SOCIAL DO *Obs. Capital Social do Estabelecimento, Inválido; Não Numérico;ESTABELECIMENTO INVALIDO^
662 CNAB240‘C102’ QUANTIDADE DE EMPREGADOS DO ESTABELECIMENTO INVALI*Obs.Total de Empregados do Estabelecimento, Inválido; Não Numérico;DO
```
```
684 CNAB240‘C106’
```
##### ENTIDADE SINDICAL COM SITUACAO PENDENTE. DADOS

```
INCOMPLETOS.
*Obs. Código de Entidade Sindical, Não Está com Seu Cadastro Sindical
Completo/Finalizado.
685 CAIXA‘AR41’^
```
```
TIPO DE ORIGEM NAO CADASTRADO
*Obs. Origem de Processamento do Título, Não Válido; Não Numérico;
Zerado, Não Cadastrado, ou não Confere com “3”=WebService;
713 CNAB240‘C103’ CNAE INVALIDO*Obs. Código CNAE Contribuinte/Pagador; Inválido; Não Numéric^ o;
```
```
720 CNAB240‘C106’
```
```
INSTRUCAO DE PAGAMENTO INVALIDA
*Obs. Sistema Gera Instrução de Guia.
```
- Sistema Indisponível.
- Comunicar a Área de Suporte da CAIXA.
759 CNAB240‘G006’

##### CNPJ DO CONTRIBUINTE NAO PODE SER IGUAL AO CNPJ DA ENTID

```
ADE SINDICAL. DIGITE O CNPJ DO CONTRIBUINTE.
*Obs. Código de Pessoa Jurídica, Divergente; Incompatível;
760 CNAB240‘C106’ CATEGORIA SINDICAL NAO CADASTRADA*Obs. Categoria Sindical Não Cadastrada.
834 CNAB240‘C106’ ENTIDADE SINDICAL INATIVA*Obs. Código de Entidade Sindical^ , Está Inativa/Desativada.
```
```
837 CNAB240‘C097’
```
```
VALOR MINIMO INVALIDO
*Obs. Valor Mínimo, Não Válido; Não Numérico; Maior que o Máximo; ou
incompatível com o Tipo Mínimo; ou Incompatível para Pagamento Parcial;
838 CNAB240‘C097’
```
```
VALOR MINIMO ZERADO
*Obs. Valor Mínimo, Não Válido; Zerado;
```
- Obrigatório Quando Tipo Mínimo igual 2.


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
842 CNAB240‘G070’
```
```
VALOR FIXO INVALIDO
*Obs. Valor Fixo Informado Erroneamente com Base no Parâmetro de
Valor Único/Fixo ;
848 CNAB240‘G070’
```
```
VALOR DA GUIA INFERIOR AO VALOR MINIMO
*Obs. Valor Nominal do Título, Menor que o Valor Mínimo
Permitido/Parametrizado;
860 CNAB240‘C023’
```
```
VALOR DESCONTO INVALIDO
*Obs. Informar Zeros; Valor do Desconto, Não Válido; Não Numérico;
Diferente de “ZEROS”.
871 CNAB240‘C008’
```
```
TIPO DOCUMENTO BARRAS
*Obs. Tipo de Documento, Não Válido; Não Numérico; Zerado ou não
Confere com “2”=Escritural;
872 CNAB240‘C020’
```
```
VALOR JUROS INVALIDO
*Obs. Informar Zeros; Valor do Juros, Não Válido; Não Numérico; Diferente
de “ZEROS”.
877 CNAB240‘C096’
```
```
VALOR MAXIMO INVALIDO
*Obs. Valor Máximo, Não Válido; Não Numérico; Menor que o Mínimo; ou
incompatível com o Tipo Máximo; ou incompatível para Pagamento Parcial;
878 CNAB240‘C096’
```
```
VALOR MAXIMO ZERADO
*Obs. Valor Máximo, Não Válido; Zerado;
```
- Obrigatório Quando Tipo Máximo igual 2.
882 CNAB240‘G007’

```
CONVENIO NAO CADASTRADO
*Código do Convênio, Inválido; Não Confere com Convênio Cadastrado na
CAIXA para a Entidade Sindical Informada.
883 CNAB240‘G007’
```
```
CONVENIO NAO CONFERE
*Código do Convênio, Inválido; Não Cadastrado; Inexistente; ou não
Vigente na CAIXA.
```
```
884 CNAB240‘G069’
```
```
CARTEIRA NAO VALIDO
*Identificação do Título no Banco Não Numérico;
Diferente de ‘00’ - Para Código de Movimento (01=Incluir Título);
Diferente de ‘14’ - Para Código de Movimento (02=Excluir Título;
03=Consultar Título; 20=2ª.Via Título; 31=Alterar Título; 48=Alterar Valor
Mínimo; 49=Alterar Valor Máximo).
```
```
885 CNAB240‘G069’
```
```
NOSSO NUMERO NAO VALIDO
*Identificação do Título no Banco Não Numérico;
Diferente de “ZEROS” - Para Código de Movimento (01=Incluir Título);
Igual a “ZEROS” - Para Código de Movimento (02=Excluir Título;
03=Consultar Título; 20=2ª.Via Título; 31=Alterar Título; 48=Alterar Valor
Mínimo; 49=Alterar Valor Máximo).
```
```
886 CNAB240‘C007’
```
```
FORMA CADASTRAMENTO NAO VALIDO
*Obs. Forma de Cadastramento do Título no Banco, Não Válido; Não
Numérico; Zerado ou não Confere com “1”=Com Cadastramento (Cobrança
Registrada);
887 CNAB240‘C009’
```
```
EMISSAO BOLETO NAO VALIDO
*Obs. Identificação da Emissão do Boleto, Não Válido; Não Numérico;
Zerado ou não Confere com “2”=Cliente Emite;
```
```
888 CNAB240‘C011’
```
```
DOCUMENTO DE COBRANCA NAO VALIDO
*Obs. Número do Documento de Cobrança (Seu Número) Não Válido; Não
Numérico; Zerado ou não Confere com a Competência a que se Refere à
GRCSU com Mês e Ano da Obrigação Tributária MM/AAAA – Completar
com zeros a esquerda; Atenção ao Formato: “0000MM/AAAA”.
```
```
889 CNAB240‘C011’
```
```
ANO DA OBRIGACAO TRIBUTARIA NAO VALIDO
*Obs. Número do Documento de Cobrança (Seu Número) Não Válido; Não
Numérico; Zerado ou não Confere com a Competência a que se Refere à
GRCSU com Mês e Ano da Obrigação Tributária MM/AAAA – Completar
com zeros a esquerda; Atenção ao Formato: “0000MM/AAAA”.
889 CNAB240 ANO DA OBRIGACAO TRIBUTARIA NAO VALIDO
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
‘C012’ *Obs. Ano de Vencimento do Título não Confere com o Ano Indicado na
Competência da Guia.
```
```
890 CNAB240‘C011’
```
```
MES DA OBRIGACAO TRIBUTARIA NAO VALIDO
*Obs. Número do Documento de Cobrança (Seu Número) Não Válido; Não
Numérico; Zerado ou não Confere com a Competência a que se Refere à
GRCSU com Mês e Ano da Obrigação Tributária MM/AAAA – Completar
com zeros a esquerda; Atenção ao Formato: “0000MM/AAAA”.
890 CNAB240‘C012’
```
```
MES DA OBRIGACAO TRIBUTARIA NAO VALIDO
*Obs. Mês de Vencimento do Título não Confere com o Mês Indicado na
Competência da Guia.
```
```
891 CNAB‘C015’^240
```
```
ESPECIE DO TITULO NAO VALIDO
*Obs. Espécie do Título, Não Válido; Não Numérico; Zerado ou não
Confere com “99”=Outros;
```
```
892 CNAB240‘C016’
```
```
IDENTIFICACAO DE TITULO NAO VALIDO
*Obs. Identificação de Título, Não Confere com “A”=Aceite;
```
```
892 CNAB2‘G072’^40
```
```
IDENTIFICACAO DE TITULO NAO VALIDO
*Obs. Identificação do Título na Empresa; Obrigatório; ou Não Confere com
o Número do Documento de Cobrança (“C011”Seu Número)
893 CNAB240‘C018’
```
```
CODIGO DO JUROS NAO VALIDO
*Obs. Código do Juros, Inválido; Não Numérico; Zerado; ou Não Confere.
3=Isento;
894 CNAB240‘C019’
```
```
DATA DO JUROS NAO VALIDO
*Obs. Informar ZEROS; Data do Juros, Inválida; Não Numérica; ou Não
Confere com “ZEROS”.
```
```
895 CNAB240‘C021’
```
```
CODIGO DESCONTO NAO VALIDO
*Obs. Informar Zeros. Código do Desconto, Inválido; Não Numérico; ou
Não Confere.
0=Sem Desconto;
896 CNAB240‘C022’
```
```
DATA DESCONTO NAO VALIDO
*Obs. Informar Zeros. Data do Desconto, Inválido; Não Numérico; ou Não
Confere com “ZEROS”.
897 CNAB240‘C024’
```
```
VALOR IOF NAO VALIDO
*Obs. Informar Zeros. Valor do IOF a Ser Recolhido, Inválido; Não
Numérico; ou Não Confere com “ZEROS”.
898 CNAB240‘G045’
```
```
VALOR ABATIMENTO NAO VALIDO
*Obs. Informar Zeros. Valor do Abatimento, Inválido; Não Numérico; ou
Não Confere com “ZEROS”.
899 CNAB240‘C026’
```
```
CODIGO PARA PROTESTO NAO VALIDO
*Obs. Informar 3. Código para Protesto, Inválido; Não Numérico; Zerado;
ou Não Confere com 3=Não Protestar.
901 CNAB240‘C027’
```
```
NUMERO DIAS PARA PROTESTO NAO VALIDO
*Obs. Informar Zeros. Número de Dias para Protesto, Inválido; Não
Numérico; ou Não Confere com “ZEROS”.
902 CNAB240‘C028’
```
```
CODIGO PARA BAIXA NAO VALIDO
*Obs. Informar 1. Código para Baixa/Devolução, Inválido; Não Numérico;
ou Não Confere com 1=Baixar/Devolver.
```
```
903 CNAB240‘C029’
```
```
NUMERO DIAS PARA BAIXA NAO VALIDO
*Obs. Número de Dias para Baixa/Devolução, Inválido; Não Numérico; ou
Não Confere com 01=Para Valor Parcial; ou 90=Para Valor Fixo.
```
- Atentar para os Parâmetros Pagamento Parcial; Origem de
Processamento, e Tipo de Pagamento;
904 CNA‘C092’B240

```
PAGAMENTO PARCIAL NAO VALIDO
*Obs. Identificação de Pagamento Parcial, Não Válido; Não Numérico;
Zerado ou não Confere com “1”=Não Autoriza Pagamento Parcial;
905 CNAB240 CODIGO DE MOVIMENTO NAO VALIDO
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
‘C004’ *Obs. Solicitação de Manutenção de Título Diferente das Disponibilizadas
pela CAIXA.(01=Incluir Título; 02=Excluir Título; 03=Consultar Título;
20=2ª.Via Título; 31=Alterar Título; 48=Alterar Valor Mínimo; 49=Alterar
Valor Máximo).
906 CNAB240‘G033’ CIDADE NAO INFORMADA*Obs. Cidade, Obrigatória;
```
```
907 CNAB24‘C101’ 0
```
```
VALOR REMUNERACAO NAO VALIDO
*Obs. Valor Total da Remuneração – Contribuintes, Inválida; Não
Numérico;
```
```
908 CNAB240‘C093’
```
```
TIPO DE PAGAMENTO NAO VALIDO
*Obs. Identificação do Tipo de Pagamento, Não Válido; Não Numérico;
Zerado; Diferente dos Domínios Disponibilizados; Divergente da Origem de
Processamento; Divergente do Pagamento Parcial;
01 = Aceita pagamento de qualquer valor
02 = Aceita pagamento de valores entre range mínimo e máximo
03 = Não aceita pagamento com o valor divergente
909 CNAB240‘C094’
```
```
QUANTIDADE DE PAGAMENTO NAO VALIDO
*Obs. Informar 1. Quantidade de Pagamentos Possíveis, Não Válido; Não
Numérico; Zerado; ou Não Confere com 1.
911 CNAB240‘C100’ QUANTIDADE DE EMPREGADOS CONTRIBUINTES NAO *Obs. Número de Empregados Contribuintes, Inválido; Não Numérico;VALIDO^
```
```
912 CNAB240‘G070’
```
```
VALOR ORIGINAL DO TITULO DIVERGE DO VALOR UNICO FIXO
*Obs. Existe Parâmetro de Valor Único Ativo na CAIXA, o Valor Original
deve ser Exatamente o Pametrizado.
913 CNAB240‘G070’
```
```
VALOR DA GUIA SUPERIOR AO VALOR MAXIMO
*Obs. Valor Nominal do Título Superior ao Valor Máximo
Permitido/Parametrizado.
915 CNAB240‘G006’ DIGITO VERIFICADOR DO CNPJ INVALIDO*Obs. Código de Pessoa Jurídica, Não Possui Dígito^ Verificador Válido.
```
```
916 CNAB240‘G006’
```
```
CNPJ DIVERGENTE
*Obs. Código de Pessoa Jurídica, Está divergente em Comparação ao
CNPJ da Entidade Sindical Responsável pela Emissão de Guias.
917 CNAB240‘G009’ DIGITO VERIFICADOR INVALIDO*Obs. Dígito Verificador da Agência Inválido/Não Confere.^
```
```
918 CNAB240‘C006’
```
```
CODIGO DA CARTEIRA NAO VALIDO
*Código da Carteira, Não Válido; Não Numérico; Zerado ou não Confere
com “1”=Cobrança Simples;
919 CNAB240‘G010’
```
```
IDENTIFICACAO DA ENTREGA NAO VALIDO
*Obs. Identificação da Entrega/Distribuição do Boleto, Não Válido; Não
Numérico; Zerado ou não Confere com “0”=Postagem pelo Beneficiário;
```
```
920 CNAB240‘C095’
```
```
TIPO MINIMO NAO VALIDO
*Obs. Tipo de Valor Informado, Não Válido; Não Numérico; ou não Confere;
Não Compatível com Pagamento Parcial.
“0”=Valor Mínimo Não Informado.
“2”=Valor Mínimo Informado.
```
```
921 CNAB240‘C095’
```
```
TIPO MÁXIMO NAO VALIDO
*Obs. Tipo de Valor Informado, Não Válido; Não Numérico; ou não Confere.
Não Compatível com Pagamento Parcial.
“0”=Valor Máximo Não Informado.
“2”=Valor Máximo Informado.
923 CNAB240‘G020’ D*Obs. Densidade de GravaçãoENSIDADE NAO VALIDO^ , Não Numérico, ou Não Válido.
925 CNAB240‘G013’ NOME DA EMPRESA NAO VALIDO*Obs. Nome da Empresa Cliente (Obrigatório).^
```
```
926 CNAB240‘G014’
```
```
NOME DO BANCO NAO VALIDO
*Obs. Nome do Banco (Obrigatório).
Informar: CAIXA ECONOMICA FEDERAL
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
954 CNAB240‘C012’
```
```
DATA VENCIMENTO NAO PODE SER INFERIOR A DATA DO DIA
*Obs. Data de Vencimento da Guia não pode ser Inferior a Data Corrente
do Sistema/Data Atual.
```
```
955 CNAB240‘C012’
```
```
INCLUIR DATA ATUAL PARA EMISSAO DE GUIA
VENCIDA
*Obs. Data de Vencimento da Guia, deve ser obrigatoriamente Igual a Data
Corrente do Sistema/Data Atual.
956 CNAB240‘C093’
```
```
TIPO DE PAGAMENTO NAO PERMITIDO. GUIA VENCIDA
*Obs. O tipo de Pagamento Informado não é Permitido para Guia Vencida.
```
```
957 CNAB240'C093'
```
```
DATA DE VENCIMENTO DEVE SER IGUAL AO MES DA COMPETENCIA
INFORMADA
*Obs. A data de vencimento da GRCSU deve compreender o mês da
competência.
995 CAIXA‘B059’
```
```
PROBLEMAS NO ACESSO A SUBROTINA
*Obs. Sistema Indisponível.
```
- Comunicar a Área de Suporte da CAIXA.

(^998) ‘ABCO’CAIXA^
PROBLEMAS DE COMUNICACAO NO CICS ABCODE
*Obs. Sistema Indisponível.

- Comunicar a Área de Suporte da CAIXA.
999 CAIXA‘EIBR’

```
PROBLEMAS DE COMUNICACAO NO CICS EIBRESP
*Obs. Sistema Indisponível.
```
- Comunicar a Área de Suporte da CAIXA.


**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

##### 6. ANEXOS

```
Os anexos subsequentes apresentam o layout de arquivos específicos para as
operações abaixo relacionadas, realizadas por meio do portal da Entidade:
```
```
o ANEXO I – Layout para UPLOAD de Banco de Contribuintes no Portal da
Entidade
o ANEXO II – Layout para DOWNLOAD de Banco de Contribuintes do Portal da
Entidade
o ANEXO III – Download do LOG de Upload Banco de Contribuintes do Portal
da Entidade
```
```
Os layouts desses anexos não possuem relação com o layout CNAB240 de remessa
e retorno, apresentado nos itens acima, e tratam de operações complementares
disponíveis para utilização pelas Entidades por meio do Portal da Entidade.
```
```
6.1 ANEXO I – Layout para UPLOAD de Banco de Contribuintes no Portal da Entidade
```
```
SITCS – UPLOAD Banco de Contribuintes
SITE Contribuinte | SITE Entidade | Conexão Direta
Aplicativo – TCSPB0TN – Layout/Interface – TCSFD0TN ( 500 Posições)
HEADER – SIMPLES
Posição
Inicial Tam. Formato Nome Campo Conteúdo Código
01 - 01 01 Numérico HS-TIP-REGISTRO 0 AR0 1
02 - 81 80 Alfanumérico
HS-NOM-ARQUIVO
```
```
Nome do
Arquivo
```
```
AR02
82 - 89 08 Alfanumérico HS-ORIGEM-UPLOAD Origem Upload AR03
90 - 90 01 Numérico HS-TIP-ENTIDADE Tipo Entidade AR04
91 - 95 05 Numérico
HS-COD-ENTIDADE
```
```
Código
Entidade
```
```
AR05
96 - 109 14 Numérico HS-CNPJ-ENTIDADE CNPJ AR06
110 - 110 01 Numérico HS-COD-ENVIO 1 AR07
111 - 112 02 Numérico HS-TIP-INFORMACAO 19 AR08
113 - 500 388 Alfanumérico FILLER Espaço AR09
AR0 1
Identificador do Registro
Identifica qual o tipo de registro conforme a denominação:
0 – Registro Header Simples
```
```
AR0 1
```
```
AR02
Nome do Arquivo Remessa: UPLOAD do Banco de Contribuinte
```
```
AR02
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
T10 1 DDMMAAHHMMSS.01
Onde:
```
- T10 1 , informação fixa identificando o tipo de arquivo.
- DD, dia da geração do arquivo
- MM, mês da geração do arquivo
- AA, ano da geração do arquivo
- HH, hora da geração do arquivo
- MM, minuto da geração do arquivo
- SS, segundo da geração do arquivo
- 01, Fixo
AR03
Origem do Upload:
Site Contribuinte
“SITECONT”
Site Entidade
“SITENTID”
Conexão Direta
“CONEXAOD”

```
AR03
```
```
AR04
Tipo da Entidade
Tipo da entidade proprietária das informações do arquivo podendo
assumir os seguintes valores:
1 - Sindicato;
2 - Federação;
3 - Confederação;
4 - M.T.E. Ministério do Trabalho e Emprego.
```
```
AR04
```
```
AR05
Código da entidade proprietária das informações do arquivo.
```
```
AR05
```
```
AR06
CNPJ da entidade proprietária das informações do arquivo.
Devendo as informações de CNPJ, Código e Tipo da Entidade ser
obrigatoriamente da mesma entidade.
```
```
AR06
```
```
AR07
Código de Envio
1 - Remessa
Informando que o arquivo está sendo enviado de Cliente Externo
para processamento na CAIXA.
```
```
AR07
```
```
AR08
Tipo de Informação
Deverá conter obrigatoriamente o número:
19 - Remessa de Contribuintes;
Identifica qual o tipo de informação está sendo submetido (UPLOAD)
para processamento na CAIXA.
```
```
AR08
```
```
AR15 AR09
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Área Livre
Deverá ser preenchido com espaços e é utilizado para completar o
registro até o tamanho definido.
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
SITCS – UPLOAD Banco de Contribuintes
SITE Contribuinte | SITE Entidade | Conexão Direta
Aplicativo – TCSPB0TN – Layout/Interface – TCSFD0TN ( 50 0 Posições)
DETALHE
Posição
Inicial Tam. Formato Nome Campo Conteúdo Código
01 - 01 01 Numérico D-TIP-REGISTRO 1 AR10
02 - 10 09 Numérico
D-SEQ-CONTRIBUINTE
```
```
Número
Sequencial
Contribuinte
```
```
AR11
```
```
11 - 11 01 Numérico D-TIP-ENTIDADE Tipo da Entidade AR12
12 - 16 05 Numérico
D-COD-ENTIDADE
```
```
Código da
Entidade
```
```
AR13
17 - 17 01 Numérico
D-TIP-CONTRIBUINTE
```
```
Tipo do
Contribuinte
```
```
AR14
18 - 32 15 Numérico D-COD-CONTRIBUINTE
Código do
Contribuinte
```
```
AR15
33 - 72 40 Alfanuméric
o
```
```
D-NOM-CONTRIBUINTE
Nome do
Contribuinte
```
```
AR16
73 - 112 40 Alfanuméric
o D-NOM-LOGRADOURO
```
```
Nome do
Logradouro AR19
113 -
127
```
```
15 Alfanuméric
o D-NOM-MUNICIPIO
```
```
Nome do
Município AR22
128 -
142
```
```
15 Alfanuméric
o D-BAIRRO
```
```
Nome do Bairro
AR23
143 -
147
```
```
05 Numérico
D-CEP
```
```
Número do CEP
AR24
148 -
150
```
```
03 Numérico
D-CEP-SUF
```
```
Complemento
Número do CEP AR25
151 -
152
```
```
02 Alfanuméric
o D-UF
```
```
Código do UF
AR26
153 -
202
```
```
50 Alfanuméric
o D-EMAIL
```
```
Descrição do E-
mail AR27
203 -
205
```
```
03 Numérico
D-NUM-DDD
```
```
Número do DDD
AR28
206 -
214
```
```
09 Numérico
D-NUM-TELEFONE
```
```
Número do
Telefone AR29
215 -
231
```
```
17 Numérico
D-VLR-CAP-SOCIAL-EMPSA
```
```
Valor do Capital
Social da
Empresa
```
```
AR30
232 -
248
```
```
17 Numérico D-VLR-CAP-SOCIAL-ESBTO
Valor do Capital
Social do
Estabelecimento
```
```
AR31
```
```
249 -
255
```
```
07 Numérico
D-QTD-EMPREGADOS
Quantidade de
Empregados
```
```
AR32
256 -
272
```
```
17 Numérico D-VLR-REMUNERACAO
Valor da
Remuneração
```
```
AR33
273 -
279
```
```
07 Numérico D-QTD-EMPREGADOS-
ESBTO
```
```
Quantidade de
Empregados do
Estabelecimento
```
```
AR34
```
```
280 -
291
```
```
12 Alfanuméric
o D-COD-GRUPO Código do Grupo AR35
292 -
341
```
```
50 Alfanuméric
o D-NOM-GRUPO Nome do Grupo AR36
342 -
342
```
```
01 Numérico
D-COD-ORIGEM
```
```
Código de
Origem AR37
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
343 -
372
```
```
30 Alfanuméric
o D-TIP-ORIGEM Tipo de Origem AR38
373 -
375
```
```
03 Numérico
D-CNAE Código do CNAE AR39
376 -
500
```
```
125 Alfanuméric
o FILLER Espaço AR40
AR10
Identificador do Registro
```
```
Identifica qual o tipo de registro conforme a denominação:
```
```
1 – Registro Detalhe
```
```
AR10
```
```
AR11
Número Sequencial Contribuinte
Número Sequencial do Contribuinte o qual começará pelo número 1 em
ordem crescente.
```
```
AR11
```
```
AR12
Tipo da entidade proprietária das informações do arquivo podendo
assumir os seguintes valores:
1 - Sindicato;
2 - Federação;
3 - Confederação;
4 - M.T.E. Ministério do Trabalho e Emprego;
```
```
AR12
```
```
AR13
Código da entidade proprietária das informações do arquivo.
```
```
AR13
```
```
AR14
Tipo de Contribuinte utilizado no cadastro do contribuinte que poderá
assumir os seguintes valores:
1 - CPF
2 - CNPJ
3 - CEI
```
```
AR14
```
```
AR15
Código do Contribuinte cadastrado.
```
```
AR15
```
```
AR16
Nome do Contribuinte
Nome completo do contribuinte.
```
```
AR16
```
```
AR17
Tipo do logradouro da entidade no formato abreviado e padrão dos
Correios.
```
```
AR17
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
AR18
Número do logradouro da entidade que deverá estar equivalente ao
CEP informado e padrão dos Correios.
```
```
AR18
```
```
AR19
Nome do logradouro da entidade que deverá estar equivalente ao CEP
informado e padrão dos Correios.
```
```
AR19
```
```
AR20
Informações complementares que identificam o endereço da entidade.
```
```
AR20
```
```
AR21
Código do município do endereço do contribuinte no padrão IBGE.
```
```
AR21
```
```
AR22
Nome do município conforme código IBGE informado.
```
```
AR22
```
```
AR23
Nome do bairro referente ao endereço do contribuinte.
```
```
AR23
```
```
AR24
Número do CEP do endereço do contribuinte.
```
```
AR24
```
```
AR25
Complemento do Número do CEP
```
```
AR25
```
```
AR26
Sigla da unidade federativa do endereço do contribuinte.
```
```
AR26
```
```
AR27
Endereço de Correio Eletrônico (e-mail)
Endereço de correio eletrônico do contribuinte.
```
```
AR27
```
```
AR28
Número DDD
Número do prefixo DDD do telefone do contribuinte.
```
```
AR28
```
```
AR29
Número de Telefone
Número do telefone do contribuinte.
```
```
AR29
```
```
AR30
Valor Capital da Empresa
Valor do capital social da empresa.
```
```
AR30
```
```
AR31
Valor Capital do Estabelecimento
Valor do capital social do estabelecimento.
```
```
AR31
```
```
AR32
Quantidade de Empregados Contribuintes
```
```
AR32
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Quantidade de empregados de um estabelecimento que estão
contribuindo para uma determinada Entidade Sindical.
AR33
Valor da Remuneração dos Contribuintes
Valor da remuneração de todos os contribuintes de um determinado
estabelecimento.
```
```
AR33
```
```
AR34
Quantidade de Empregados do Estabelecimento
Quantidade total de empregados de um estabelecimento contribuintes
ou não.
```
```
AR34
```
```
AR35
Código do Grupo
Código do grupo no qual o contribuinte está vinculado.
Caso o código não exista no banco de dados da CAIXA, o grupo será
cadastrado e o contribuinte vinculado ao mesmo.
```
```
AR35
```
```
AR36
Nome do Grupo
Nome do grupo associado ao código do grupo informado.
Este campo é de preenchimento obrigatório caso seja informado o
código do grupo.
```
```
AR36
```
```
AR37
Código de origem
Identifica como este contribuinte foi cadastrado por meio dos seguintes
códigos:
1 - Site Contribuinte;
2 - Site Entidade;
```
```
AR37
```
```
AR38
Tipo da origem
Descrição do código da origem conforme destacado no item anterior.
```
```
AR38
```
```
AR39
Código CNAE
Código nacional de atividade econômica do contribuinte.
```
```
AR39
```
```
AR40
Área Livre
Deverá ser preenchido com espaços e é utilizado para completar o
registro até o tamanho definido.
```
```
AR40
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
SITCS – UPLOAD Banco de Contribuintes
SITE Contribuinte |SITE Entidade | Conexão Direta
Aplicativo – TCSPB0TN – Layout/Interface – TCSFD0TN ( 500 Posições)
TRAILLER - SIMPLES
Posição
Inicial Tam. Formato Nome Campo Conteúdo Código
01 - 01 01 Numérico TS-TIP-REGISTRO 9 AR41
02 - 16 15 Numérico^ TS - QTD-TOTAL-REG^ Quantidade Total dos Registros AR42^
17 - 500 484 Alfanumérico FILLER Espaço AR43^
AR41
Identificador do Registro
Identifica qual o tipo de registro conforme a denominação:
9 – Registro Trailler.
```
```
AR41
```
```
AR42
Quantidade Total dos registros
Total de registros do arquivo, sendo totalizado também o registro trailler.
```
```
AR42
```
```
AR43
FILLER
Deverá ser preenchido com espaços e é utilizado para completar o
registro até o tamanho definido.
```
```
AR43
```
```
6.2 ANEXO II – Layout para DOWNLOAD de Banco de Contribuintes do Portal da
Entidade
```
```
SITCS – Download do Banco de Contribuintes
SITE Contribuinte | SITE Entidade | Conexão Direta
Aplicativo – TCSPB0SQ – Layout/Interface – TCSFD0SQ ( 500 Posições)
HEADER – SIMPLES
Posição
Inicial Tam. Formato Nome Campo Conteúdo Código
01 - 01 01 Numérico HS-TIP-REGISTRO 0 AR01
02 - 09 08 Alfanumérico WNAI-DAT-GER
Data Geração do
Arquivo
Formato:
(DDMMAAAA)
```
```
AR02
```
```
10 - 21 12 Numérico WNAI-HMS-GER
Hora Geração do
Arquivo
Formato:
(HHMMSSLLLLLL)
```
```
AR03
```
```
22 - 35 14 Numérico WNAI-CNPJ-ENT CNPJ da Entidade AR04
36 - 36 01 Alfanumérico WNAI-FIXO-PTO
Informação FIXA “.” AR05
37 - 39 03 Numérico WNAI-COD-FUNC Código de AR06
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Funcionalidade.
40 - 40 01 Alfanumérico WNAI-FIXO-T
Informação FIXA “T” AR07
41 - 43 03 Numérico WNAI-NU-NSA
Número Sequencial do
Arquivo. Fixo Zeros.
```
```
AR 08
```
```
44 - 44 01 Numérico WNAI-TIP-ENT Tipo da Entidade AR09
45 - 49 05 Numérico WNAI-COD-ENT
Código da Entidade AR10
50 - 57 08 Numérico WNAI-DAT-LCTO
Data de Lançamento
Formato:
(DDMMAAAA)
```
```
AR11
```
```
58 - 65 08 Numérico WNAI-DAT-PROC
Data Processamento
Formato:
(DDMMSSAA).
```
```
AR12
```
```
66 - 81 16 Alfanumérico WNAI-DES-FUNC
Descrição da
Funcionalidade
```
```
AR13
82 - 89 08 Alfanumérico HS-ORIGEM-DOWNLOAD Origem Download AR14
90 - 90 01 Numérico HS-TIP-ENTIDADE Tipo Entidade AR15
91 - 95 05 Numérico HS-COD-ENTIDADE Código Entidade AR16
96 - 109 14 Numérico HS-CNPJ-ENTIDADE CNPJ da Entidade AR17
110 - 110 01 Numérico HS-COD-ENVIO 2 AR18
111 - 112 02 Numérico HS-TIP-INFORMACAO 01 AR19
113 - 500 388 Alfanumérico FILLER Espaço AR20
AR01
Tipo do Registro
Identifica qual o tipo de registro conforme a denominação:
0 – Registro Header Simples
```
```
AR01
```
```
AR02
Data de geração do arquivo.
Formato (DDMMAAAA)
```
```
AR02
```
```
AR03
Hora de geração do arquivo.
Formato (HHMMSS)
```
```
AR03
```
```
AR04
CNPJ da entidade proprietária das informações do arquivo.
Devendo as informações de CNPJ, Código e Tipo da Entidade ser obrigatoriamente
da mesma entidade.
```
```
AR04
```
```
AR05
Informação FIXA “.”
```
```
AR05
```
```
AR06
Código de Funcionalidade atrelada ao serviço prestado pela caixa.
001 - Download do Banco de Contribuintes.
```
```
AR06
```
```
AR07
Informação FIXA “T”
```
```
AR07
```
```
AR08
Número Sequencial do Arquivo.
Fixo Zeros.
```
```
AR08
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
AR09
Tipo da entidade proprietária das informações do arquivo podendo assumir os
seguintes valores:
1 - Sindicato;
2 - Federação;
3 - Confederação;
4 - M.T.E. Ministério do Trabalho e Emprego.
```
```
AR09
```
```
AR10
Código da entidade proprietária das informações do arquivo.
```
```
AR10
```
```
AR11
Data de Crédito/Débito do Lançamento.
Formato (DDMMAAAA).
```
```
AR11
```
```
AR12
Data atual do Processamento do Arquivo.
Formato (DDMMSSAA).
```
```
AR12
```
```
AR13
Descrição da Funcionalidade atrelada ao serviço prestado pela CAIXA.
```
```
AR13
```
```
AR14
Origem do Download:
Site Contribuinte
“SITECONT”
Site Entidade
“SITENTID”
Conexão Direta
“CONEXAOD”
```
```
AR14
```
```
AR15
Tipo da entidade proprietária das informações do arquivo podendo assumir os
seguintes valores:
1 - Sindicato;
2 - Federação;
3 - Confederação;
4 - M.T.E. Ministério do Trabalho e Emprego.
```
```
AR15
```
```
AR16
Código da entidade proprietária das informações do arquivo.
```
```
AR16
```
```
AR17
CNPJ da entidade proprietária das informações do arquivo.
Devendo as informações de CNPJ, Código e Tipo da Entidade ser obrigatoriamente
da mesma entidade.
```
```
AR17
```
```
AR18
Código de Envio
2 - Retorno: Informa que o arquivo está sendo enviado da CAIXA para a Entidade
Sindical.
```
```
AR18
```
```
AR19
Tipo de Informação
```
```
AR19
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
01 - Download do Banco de Contribuintes.
Identifica qual o tipo de informação (Download) está Retornado pelo
processamento da CAIXA.
AR20
Área Livre
Deverá ser preenchido com espaços e é utilizado para completar o registro até o
tamanho definido.
```
```
AR20
```
```
SITCS – Download do Banco de Contribuintes
SITE Contribuinte | SITE Entidade | Conexão Direta
Aplicativo – TCSPB0SQ – Layout/Interface – TCSFD0SQ ( 500 Posições)
DETALHE
Posição
Inicial Tam. Formato Nome Campo Conteúdo Código
01 - 01 01 Numérico D-TIP-REGISTRO 1 AR21
02 - 10 09 Numérico D-SEQ-CONTRIBUINTE
Número Sequencial
Contribuinte
```
```
AR22
11 - 11 01 Numérico D-TIP-ENTIDADE Tipo da Entidade AR23
12 - 16 05 Numérico D-COD-ENTIDADE Código da Entidade AR24
17 - 17 01 Numérico
D-TIP-CONTRIBUINTE
```
```
Tipo do
Contribuinte
```
```
AR25
18 - 32 15 Numérico D-COD-CONTRIBUINTE
Código do
Contribuinte
```
```
AR26
33 - 72 40 Alfanumérico D-NOM-CONTRIBUINTE
Nome do
Contribuinte
```
```
AR27
73 - 87 15 Alfanumérico
D-NOM-LOGRADOURO
```
```
Nome do
Logradouro
```
```
AR28
88 - 102 15 Alfanumérico D-BAIRRO Nome do Bairro AR29
103 - 137 35 Alfanumérico D-NOM-MUNICIPIO Nome do Município AR30
138 - 142 05 Numérico D-CEP Número do CEP AR31
143 - 145 03 Numérico
D-CEP-SUF
```
```
Complemento
Número do CEP AR32
146 - 147 02 Alfanumérico D-UF Código do UF AR33
148 - 197 50 Alfanumérico
D-EMAIL
```
```
Descrição do E-
mail AR34
198 - 200 03 Numérico D-NUMERO-DDD Número do DDD AR35
201 - 209 09 Numérico
D-NUMERO-TEL
```
```
Número do
Telefone AR36
210 - 226 17 Numérico D-VLR-CAP-EMPRESA
Valor do Capital
Social da Empresa
```
```
AR37
227 - 243 17 Numérico D-VLR-CAP-ESTABELEC
Valor do Capital
Social do
Estabelecimento
```
```
AR38
```
```
244 - 252 09 Numérico D-QTD-EMPREG-CONTRB
Quantidade de
Empregados
```
```
AR39
253 - 269 17 Numérico D-VLR-REMUN-CONTRIB
Valor da
Remuneração
```
```
AR40
270 - 278 09 Numérico D-QTD-EMPREG-ESTABE
Quantidade de
Empregados do
Estabelecimento
```
```
AR41
```
```
279 - 288 10 Alfanumérico D-COD-GRUPO Código do Grupo AR42
289 - 338 50 Alfanumérico D-NOM-GRUPO Nome do Grupo AR43
339 - 339 01 Numérico D-COD-ORIGEM Código de Origem AR44
340 - 369 30 Alfanumérico D-TIP-ORIGEM Tipo de Origem AR45
370 - 374 05 Numérico D-COD-CNAE Código do CNAE AR46
375 - 500 126 Alfanumérico FILLER Espaço AR47
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
AR21
Identificador do Registro
Identifica qual o tipo de registro conforme a denominação:
1 – Registro Detalhe
```
```
AR 21
```
```
AR22
Número Sequencial Contribuinte
Número Sequencial do Contribuinte o qual começará pelo número 1 em ordem
crescente
```
```
AR22
```
```
AR23
Tipo da entidade proprietária das informações do arquivo podendo assumir os
seguintes valores:
1 - Sindicato;
2 - Federação;
3 - Confederação;
4: M.T.E. Ministério do Trabalho e Emprego;
```
```
AR23
```
```
AR24
Código da entidade proprietária das informações do arquivo.
```
```
AR24
```
```
AR25
Tipo de Contribuinte utilizado no cadastro do contribuinte que poderá assumir
os seguintes valores:
1 - CPF
2 - CNPJ
3 - CEI
```
```
AR25
```
```
AR26
Código do Contribuinte cadastrado.
```
```
AR26
```
```
AR27
Nome completo do contribuinte.
```
```
AR27
```
```
AR28
Nome do logradouro da entidade que deverá estar equivalente ao CEP
informado e padrão dos Correios.
```
```
AR28
```
```
AR29
Nome do bairro referente ao endereço do contribuinte.
```
```
AR29
```
```
AR30
Nome do município conforme código IBGE informado.
```
```
AR30
```
```
AR31
Número do CEP do endereço do contribuinte.
```
```
AR31
```
```
AR32
Sufixo do CEP do endereço do contribuinte.
```
```
AR32
```
```
AR33
Sigla da unidade federativa do endereço do contribuinte.
```
```
AR33
```
```
AR34
Endereço de Correio Eletrônico (e-mail)
Endereço de correio eletrônico do contribuinte.
```
```
AR34
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
AR35
Número DDD
Número do prefixo DDD do telefone do contribuinte.
```
```
AR35
```
```
AR36
Número de Telefone
Número do telefone do contribuinte.
```
```
AR36
```
```
AR37
Valor Capital da Empresa
Valor do capital social da empresa.
```
```
AR37
```
```
AR38
Valor Capital do Estabelecimento
Valor do capital social do estabelecimento.
```
```
AR38
```
```
AR39
Quantidade de Empregados Contribuintes
Quantidade de empregados de um estabelecimento que estão contribuindo
para uma determinada Entidade Sindical.
```
```
AR39
```
```
AR40
Valor da Remuneração dos Contribuintes
Valor da remuneração de todos os contribuintes de um determinado
estabelecimento.
```
```
AR40
```
```
AR41
Quantidade de Empregados do Estabelecimento
Quantidade total de empregados de um estabelecimento contribuintes ou não.
```
```
AR41
```
```
AR42
Código do grupo no qual o contribuinte está vinculado.
Caso o código não exista no banco de dados da CAIXA, o grupo será
cadastrado e o contribuinte vinculado ao mesmo.
```
```
AR42
```
```
AR43
Nome do Grupo
Nome do grupo associado ao código do grupo informado.
Este campo é de preenchimento obrigatório caso seja informado o código do
grupo.
```
```
AR43
```
```
AR44
Código de origem
Identifica como este contribuinte foi cadastrado por meio dos seguintes
códigos:
1 - SITE Contribuinte;
2 - SITE Entidade;
```
```
AR44
```
```
AR45
Tipo da origem
```
```
AR45
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Descrição do código da origem conforme destacado no item anterior.
```
```
AR46
Código CNAE
Código nacional de atividade econômica do contribuinte.
```
```
AR46
```
```
AR47
Área Livre
Deverá ser preenchido com espaços e é utilizado para completar o registro até
o tamanho definido.
```
```
AR47
```
```
SITCS – Download do Banco de Contribuintes
SITE Contribuinte |SITE Entidade | Conexão Direta
Aplicativo – TCSPB0SQ – Layout/Interface – TCSFD0SQ ( 500 Posições)
TRAILLER - SIMPLES
Posição
Inicial Tam.^ Formato^ Nome Campo^ Conteúdo^ Código^
01 - 01 01 Numérico TS-TIP-REGISTRO 9 AR48
02 - 16
```
```
15
Numérico TS-SUB-TOTAL-REGS
Quantidade de
Registros
```
```
AR49
```
```
17 - 500 484
```
```
Alfanuméric
o FILLER Espaço
```
```
AR50
AR48
Identificador do Registro
Identifica qual o tipo de registro conforme a denominação:
9 – Registro Trailler.
```
```
AR48
```
```
AR49
Quantidade Total dos registros
Total de registros do arquivo, sendo totalizado também o registro Trailler.
```
```
AR49
```
```
AR50
Área Livre
Deverá ser preenchido com espaços e é utilizado para completar o registro
até o tamanho definido.
```
```
AR50
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
6.3 ANEXO III – Download do LOG de Upload Banco de Contribuintes do Portal da
Entidade
```
```
SITCS – Download do LOG Upload Banco de Contribuintes
SITE Contribuinte | SITE Entidade | Conexão Direta
Aplicativo – TCSPB0TN – Layout/Interface – TCSFDLG 2 (400 Posições)
HEADER – SIMPLES
Posição
Inicial Tam. Formato Nome Campo Conteúdo Código
01 - 01 01 Numérico LG2-HS-TIP-REGISTRO 0 AR01
02 - 09 08 Alfanuméric
o
```
```
WNAI-DAT-GER
Data Geração
do Arquivo
Formato:
(DDMMAAAA)
```
```
AR02
```
```
10 - 21 12 Numérico
WNAI-HMS-GER
```
```
Hora Geração
do Arquivo
Formato:
(HHMMSSLLLLLL
)
```
```
AR03
```
```
22 - 35 14 Numérico
WNAI-CNPJ-ENT
```
```
CNPJ da
Entidade
```
```
AR04
36 - 36 01 Alfanuméric
o
```
```
WNAI-FIXO-PTO
Informação
FIXA “.”
```
```
AR05
37 - 39 03 Numérico
WNAI-COD-FUNC
```
```
Código de
Funcionalidad
e.
```
```
AR06
```
```
40 - 40 01 Alfanuméric
o
```
```
WNAI-FIXO-T
Informação
FIXA “T”
```
```
AR07
41 - 43 03 Numérico WNAI-NU-NSA
Número
Sequencial do
Arquivo. Fixo
Zeros.
```
```
AR08
```
```
44 - 44 01 Numérico
WNAI-TIP-ENT
```
```
Tipo da
Entidade
```
```
AR09
45 - 49 05 Numérico WNAI-COD-ENT
Código da
Entidade
```
```
AR 10
50 - 57 08 Numérico WNAI-DAT-LCTO
Data de
Lançamento
Formato:
(DDMMAAAA)
```
```
AR 11
```
```
58 - 65 08 Numérico
WNAI-DAT-PROC
```
```
Data
Processament
o
Formato:
(DDMMSSAA).
```
```
AR 12
```
```
66 - 81 16 Alfanuméric
o WNAI-DES-FUNC
```
```
Descrição da
Funcionalidad
e
```
```
AR 13
```
```
162 - 169 08 Alfanuméric
o LG2-HS-ORIGEM-UPLOAD
```
```
Origem
Upload
```
```
AR14
170 - 170 01 Numérico LG2-HS-TIP-ENTIDADE Tipo Entidade AR15
171 - 175 05 Numérico
LG2-HS-COD-ENTIDADE
```
```
Código
Entidade
```
```
AR16
176 - 189 14 Numérico LG2-HS-CNPJ-ENTIDADE CNPJ da AR17
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Entidade
190 - 190 01 Numérico
LG2-HS-COD-ENVIO
```
```
2 AR18
192 - 192 02 Numérico LG2-HS-TIP-INFORMACAO 31 AR19
193 - 204 12 Numérico
LG2-HS-NUM-REMESSA
```
```
Número da
Remessa
```
```
AR20
205 - 400 276 Alfanuméric
o FILLER
```
```
Espaço AR21
AR01
Tipo do Registro
Identifica qual o tipo de registro conforme a denominação:
0 – Registro Header Simples
```
```
AR01
```
```
AR02
Data de geração do arquivo.
Formato (DDMMAAAA)
```
```
AR02
```
```
AR03
Hora de geração do arquivo.
Formato (HHMMSS)
```
```
AR03
```
```
AR04
CNPJ da entidade proprietária das informações do arquivo.
Devendo as informações de CNPJ, Código e Tipo da Entidade ser obrigatoriamente
da mesma entidade.
```
```
AR04
```
```
AR05
Informação FIXA “.”
```
```
AR05
```
```
AR0 6
Código de Funcionalidade atrelada ao serviço prestado pela caixa.
031 - Download do Log do Upload do Banco de Contribuintes.
```
```
AR06
```
```
AR07
Informação FIXA “T”
```
```
AR07
```
```
AR08
Número Sequencial do Arquivo.
Fixo Zeros.
```
```
AR08
```
```
AR09
Tipo da entidade proprietária das informações do arquivo podendo assumir os
seguintes valores:
1 - Sindicato;
2 - Federação;
3 - Confederação;
4 - M.T.E. Ministério do Trabalho e Emprego.
```
```
AR09
```
```
AR 10
Código da entidade proprietária das informações do arquivo.
```
```
AR 10
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
AR 11
Data de Crédito/Débito do Lançamento.
Formato (DDMMAAAA).
```
```
AR 11
```
```
AR 12
Data atual do Processamento do Arquivo.
Formato (DDMMSSAA).
```
```
AR 12
```
```
AR 13
Descrição da Funcionalidade atrelada ao serviço prestado pela CAIXA.
```
```
AR 13
```
```
AR14
Origem do Upload:
Site Contribuinte
“SITECONT”
Site Entidade
“SITENTID”
Conexão Direta
“CONEXAOD”
```
```
AR14
```
```
AR15
Tipo da entidade proprietária das informações do arquivo podendo
assumir os seguintes valores:
1 - Sindicato;
2 - Federação;
3 - Confederação;
4 - M.T.E. Ministério do Trabalho e Emprego.
```
```
AR15
```
```
AR16
Código da entidade proprietária das informações do arquivo.
```
```
AR16
```
```
AR17
CNPJ da entidade proprietária das informações do arquivo.
Devendo as informações de CNPJ, Código e Tipo da Entidade ser
obrigatoriamente da mesma entidade.
```
```
AR17
```
```
AR18
Código de Envio
2 - Retorno: Informa que o arquivo está sendo enviado da CAIXA para
a Entidade Sindical.
```
```
AR18
```
```
AR19
Tipo de Informação
31 - Log de Contribuintes;
Identifica qual o tipo de informação (Download) está Retornado pelo
processamento da CAIXA.
```
```
AR19
```
```
AR20
Número de Remessa
```
```
AR20
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
Identifica qual o número da remessa gerenciado pela CAIXA.
AR21
Área Livre
Deverá ser preenchido com espaços e é utilizado para completar o
registro até o tamanho definido.
```
```
AR21
```
```
SITCS – Download do LOG Upload Banco de Contribuintes
SITE Contribuinte |SITE Entidade | Conexão Direta
Aplicativo – TCSPB0TN – Layout/Interface – TCSFDLG 2 (400 Posições)
DETALHE
Posição
Inicial
```
```
Ta
m. Formato Nome Campo Conteúdo Código
01 - 01 01 Numérico LG2-D-TIP-REGISTRO 1 AR21
02 - 10 09 Numérico
LG2-D-SEQ-CONTRIBUINTE
```
```
Número
Sequencial do
Contribuinte
```
```
AR22
```
```
11 - 11 01 Numérico
LG2-D-TIP-CONTRIBUINTE
```
```
Tipo do
Contribuinte
```
```
AR23
12 - 26 15 Numérico
LG2-D-COD-CONTRIBUINTE
```
```
Código do
Contribuinte
```
```
AR24
27 - 27 01 Alfanuméric
o LG2-D-SIT-CONTRIBUINTE
```
```
Situação do
Contribuinte
```
```
AR25
28 - 35 08 Alfanuméric
o LG2-D-COD-RESPONSAVEL
```
```
Código do
Responsável
```
```
AR26
36 - 45 10 Alfanuméric
o LG2-D-DAT-OCORRENCIA
```
```
Data da
Ocorrência
```
```
AR27
46 - 53 08 Alfanuméric
o LG2-D-HOR-OCORRENCIA
```
```
Hora da
Ocorrência
```
```
AR28
54 - 57 04 Numérico LG2-D-PTE-OCORRENCIA Ponto com Erro AR29
58 - 61 04 Numérico
LG2-D-COD-OCORRENCIA
```
```
Código da
Ocorrência
```
```
AR 30
62 - 161 100 Alfanuméric
o LG2-D-MSG-OCORRENCIA
```
```
Mensagem da
Ocorrência
```
```
AR 31
162 - 400 239 Alfanuméric
o FILLER
```
```
Espaço AR 32
AR21
Identificador do Registro
Identifica qual o tipo de registro conforme a denominação:
1 – Registro Detalhe.
```
```
AR21
```
```
AR22
Número Sequencial do Contribuinte
Número Sequencial do Contribuinte o qual começará pelo número 1 em
ordem crescente.
```
```
AR22
```
```
AR23
Tipo de Contribuinte
```
```
AR23
```
```
AR24
Código do Contribuinte
```
```
AR24
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
AR25
Situação do Contribuinte
```
```
AR25
```
```
AR26
Responsável Pelas Informações da Ocorrência.
```
```
AR26
```
```
AR27
Data da Ocorrência
Data em que houve a ocorrência.
Formato: DD.MM.AAAA
```
```
AR27
```
```
AR28
Hora da Ocorrência
Horário em que houve a ocorrência.
Formato: HH:MM:SS
```
```
AR28
```
```
AR29
Ponto com erro referente à Ocorrência.
```
```
AR29
```
```
AR 30
Código da Ocorrência.
```
```
AR 30
```
```
AR 31
Mensagem da Ocorrência
Mensagem descritiva da ocorrência.
```
```
AR 31
```
```
AR 32
Área Livre
Deverá ser preenchido com espaços e é utilizado para completar o
registro até o tamanho definido.
```
```
AR 32
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
SITCS – Download do LOG Upload Banco de Contribuintes
SITE Contribuinte | SITE Entidade | Conexão Direta
Aplicativo – TCSPB0TN – Layout/Interface – TCSFDLG 2 (400 Posições)
TRAILLER SIMPLES
Posição
Inicial
```
```
Tam
```
**. Formato Nome Campo Conteúdo Código**
01 - 01 01 Numérico LG2-TS-TIP-REGISTRO 9 AR33
02 - 17 16 Numérico LG2-TS-NUMERO-LOTE Número do Lote AR34
18 - 32 15 Numérico
LG2-TS-QTD-REG-LID

```
Quantidade de Registros
Lidos
```
```
AR35
33 - 47 15 Numérico
LG2-TS-QTD-REG-ACA
```
```
Quantidade de Registros
Acatados
```
```
AR36
48 - 62 15 Numérico LG2-TS-QTD-REG-REJ
Quantidade de Registros
Rejeitados
```
```
AR37
63 - 400 338 Alfanuméri
co FILLER
```
```
Espaço AR38
AR33
Tipo do Registro
9 – Registro Trailler Simples
```
```
AR33
```
```
AR34
Número do Lote
Identificador do Lote
```
```
AR34
```
```
AR35
Total de Registros de Contribuintes Lidos e Processados
```
- Detalhes do Upload

```
AR35
```
```
AR36
Total de Registros de Contribuintes Acatados
```
- Detalhes do Upload

```
AR36
```
```
AR37
Total de Registros de Contribuintes Rejeitados
```
- Detalhes do Upload

```
AR37
```
```
AR38
Área Livre
Deverá ser preenchido com espaços e é utilizado para completar o registro até o
tamanho definido.
```
```
AR38
```

**CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

```
SUPORTE TECNOLÓGICO A CLIENTES: 4 004 1104 (para capitais e regiões metropolitanas)
0800 104 0104 (demais regiões)
```
```
SAC CAIXA: 0800 726 0101 (INFORMAÇÕES, RECLAMAÇÕES, SUGESTÕES E ELOGIOS)
```
```
PARA PESSOAS COM DEFICIÊNCIA AUDITIVA OU DE FALA: 0800 726 2492
```
```
OUVIDORIA: 0800 725 7474
```

```
MO 38363 002
```
Vigência 17 / 06 /202 2 114

**LEIAUTE DE ARQUIVO ELETRÔNICO PADRÃO CNAB 240 – CONTRIBUIÇÃO SINDICAL URBANA - SITCS**

^1 **OBJETIVO**^
**1.1** Disponibilizar às Entidades Sindicais o leiaute CNAB 240 no SITCS, para viabilizar a troca eletrônica de
dados entre a Entidade e a CAIXA.

^2 **NORMA**^
**2.1**^ **GESTOR**^
**2.1.1**^ GESAT –^ GN Captação e Serviços de Atacado.^
**2.2**^ **VINCULAÇÃO**^
**2.2.1**^ Manuais Normativos: CO042.^
**2.3**^ **DISPONIBILIZAÇÃO DO MODELO**^
**2.3.1** - por meio de “download" clicando no “link”: MO38363002

-^ por meio de “download” na página [http://www.caixa.gov.br](http://www.caixa.gov.br)^.^
**2.4**^ **QUANTIDADE E DESTINAÇÃO DE VIAS**^
**2.4.1**^ O modelo é impresso em 1 via para entrega ao Cliente Beneficiário.^
**2.5**^ **UNIDADES QUE UTILIZARÃO O MODELO**^
**2.5.1**^ Agência e/ou PA.^
**2.6**^ **MODELO A SER SUBSTITUÍDO**^
**2.6.1**^ MO38363^ v^001.^
**2.7**^ **PRAZO DE ARQUIVAMENTO**^
**2.7.1**^ Não se aplica.^
**2.8**^ **GRAU DE SIGILO**^
**2.8.1**^ #PÚBLICO^
**2.9**^ **ALTERAÇÕES EM RELAÇÃO À VERSÃO**^ **ANTERIOR**^
    **2.9.1** Alterada a unidade gestora para GESAT

(^)
**2.10 ROTEIRO PADRÃO
2.10.1**^ Não se aplica.^
**2.11**^ **ESPECIFICAÇÃO TÉCNICA**^
**2.11.1**^ Tipo de modelo: formulário eletrônico.^
**2.11.2**^ Impressão/Tipo de papel: papel A4 -^ Mod. 71.139.^
**2.11.3**^ Formato do modelo: 210 mm (largura) x 297 mm (altura).^
**3
PROCEDIMENTOS**^
**3.1**^ **INSTRUÇÕES DE PREENCHIMENTO**^
**3.1.1** O modelo não se destina ao preenchimento.


