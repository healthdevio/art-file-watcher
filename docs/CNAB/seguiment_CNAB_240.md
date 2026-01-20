# Entendendo os Segmentos T e U no Arquivo de Retorno CNAB 240

Introdução: As Duas Metades de uma Confirmação

Para entender o arquivo de retorno bancário, imagine um recibo que vem em duas partes. A primeira parte identifica o produto comprado e o cliente (como o Segmento T), enquanto a segunda detalha o pagamento final, incluindo taxas, juros e o valor líquido (como o Segmento U). Sozinhas, cada parte conta apenas metade da história. Juntas, elas fornecem uma confirmação completa e precisa.

Entender como essa dupla de segmentos funciona em conjunto é fundamental para interpretar corretamente os arquivos de retorno bancários no padrão CNAB 240, pois eles formam o núcleo da comunicação do banco sobre o que aconteceu com cada transação.

--------------------------------------------------------------------------------

1. O Panorama Geral: Onde os Segmentos T e U se Encaixam

Antes de mergulhar nos detalhes de cada segmento, é importante saber onde eles estão localizados na estrutura do arquivo.

* Primeiro, o Arquivo Retorno é a principal forma de comunicação do banco com a empresa. Ele serve para confirmar o status de todas as transações enviadas anteriormente, como o registro de um boleto, a confirmação de um pagamento ou a notificação de uma rejeição.
* Dentro deste arquivo, os Segmentos T e U são classificados como Registro de Detalhe de Tipo 3. Estes são os registros que carregam as informações específicas de cada transação individual. Para fornecer um contexto mais completo, esses registros de detalhe estão sempre contidos dentro de um Lote de Serviço, que por sua vez é enquadrado por um Header de Lote (Tipo 1) e um Trailer de Lote (Tipo 5).

Esses segmentos, portanto, não são apenas informativos; eles são o coração do arquivo de retorno, detalhando o resultado de cada título processado.

--------------------------------------------------------------------------------

2. A Dupla Dinâmica: Por que T e U são Inseparáveis

Os Segmentos T e U não são opcionais nem independentes; eles formam uma parceria obrigatória e fundamental para a clareza do arquivo de retorno.

Para cada movimentação de um título informada pelo banco (como um pagamento, uma confirmação de entrada ou uma rejeição), ele deve gerar um Segmento T, seguido imediatamente pelo seu correspondente Segmento U. Para garantir a integridade dos dados, o padrão não apenas associa conceitualmente esses segmentos; ele os vincula tecnicamente usando campos de controle como o código de movimento e o número sequencial do registro no lote.

Suas funções principais podem ser divididas de forma clara, distinguindo o "O Quê/Quem" do "Como/Quando":

* **Segmento T**: Responde a perguntas de identificação.
  * Qual título estamos discutindo?
  * Quem era o pagador?
  * Qual foi o resultado geral (ex: liquidado, entrada confirmada, rejeitado)?
* **Segmento U**: Responde a perguntas sobre os detalhes financeiros.
  * Quanto foi efetivamente pago pelo pagador?
  * Quanto será creditado na sua conta?
  * Quando o pagamento foi realizado e quando o valor estará disponível?

Essa separação de responsabilidades torna o arquivo mais fácil de processar e entender. O Segmento T serve como uma âncora para identificar a transação, enquanto o Segmento U fornece o detalhamento financeiro completo associado a ela.


--------------------------------------------------------------------------------


3. Um Olhar Detalhado no Segmento T: O Identificador da Transação

A principal função do Segmento T é identificar o título e relatar seu status geral ou a movimentação ocorrida. Ele garante que a empresa possa conciliar facilmente as informações do banco com seus próprios registros internos.

As informações mais importantes contidas no Segmento T são:

* Identificadores do Título: Inclui campos cruciais como o Nosso Número (o identificador único gerado pelo banco) e o Seu Número (o identificador definido pela empresa).
  * Benefício: Permitem que a empresa localize e atualize de forma inequívoca o status do título em seu sistema de gestão (ERP).
* Dados Nominais e do Pagador: Contém o nome ou CPF/CNPJ do pagador, além do Valor Nominal original e a data de vencimento do título.
  * Benefício: Confirma os dados originais da transação, servindo como uma referência do que era esperado antes de qualquer pagamento ou alteração.
* Código de Ocorrência (Motivo da Ocorrência): Este é um campo crítico que utiliza um código numérico para resumir o resultado da transação. Por exemplo, um código como 06 sinaliza uma Liquidação (pagamento) bem-sucedida, enquanto um código como 03 indica Entrada Rejeitada, com outros campos fornecendo o motivo específico do erro.
  * Benefício: Fornece um código inequívoco e legível por máquina que permite a sistemas automatizados (como um ERP) categorizar instantaneamente o resultado — encaminhando um pagamento bem-sucedido para conciliação, sinalizando uma rejeição para revisão manual ou confirmando que um título foi registrado corretamente.
* Tarifas: Informa o valor de tarifas ou custas cobradas pelo serviço bancário associado à movimentação.
  * Benefício: Essencial para a conciliação financeira, pois permite que a empresa compreenda quaisquer deduções ou cobranças de serviço aplicadas pelo banco.

Com base no Segmento T, a empresa já sabe de qual título se trata e o que, em linhas gerais, aconteceu com ele.


--------------------------------------------------------------------------------


4. Um Olhar Detalhado no Segmento U: Os Detalhes Financeiros

Enquanto o Segmento T identifica a transação, a função primária do Segmento U é fornecer um detalhamento financeiro completo do evento que o Segmento T relatou.

As informações financeiras mais significativas do Segmento U são:

* Detalhamento dos Valores do Pagamento: Este segmento esclarece o fluxo financeiro exato. Ele informa o Valor Pago pelo Pagador (valor bruto pago), os Acréscimos (juros e multas) e, o mais importante, o Valor Líquido que será creditado na conta da empresa.
  * Benefício: É essencial para a conciliação financeira, explicando a diferença entre o valor original do título e o valor que efetivamente entrará no caixa.
* Datas Críticas: O segmento distingue duas datas fundamentais: a Data da Ocorrência (o dia em que o cliente realizou o pagamento) e a Data do Crédito (o dia em que os fundos estarão efetivamente disponíveis na conta da empresa). Por exemplo, um cliente pode pagar um boleto na sexta-feira (Data da Ocorrência), mas devido ao tempo de processamento bancário, os fundos são liquidados e ficam disponíveis na conta da empresa apenas na segunda-feira seguinte (Data do Crédito).
  * Benefício: Essa distinção é crucial para a previsão precisa do fluxo de caixa. Ela evita um erro financeiro comum: alocar fundos que foram pagos por um cliente, mas que ainda não estão disponíveis para a empresa, evitando assim potenciais déficits de liquidez.
* Dados Especializados (Exemplo SITCS): O Segmento U também demonstra flexibilidade ao carregar dados específicos do tipo de cobrança. No caso da Contribuição Sindical (SITCS), ele pode incluir informações como Capital Social e Número de Empregados da empresa pagadora.
  * Benefício: Mostra que o segmento não é apenas financeiro, mas pode ser adaptado para retornar dados de negócio importantes para a empresa beneficiária.

O Segmento U, portanto, completa a história com todos os detalhes monetários e de tempo necessários para um controle financeiro rigoroso.


--------------------------------------------------------------------------------


5. Resumo: Segmento T vs. Segmento U em um Relance

A tabela abaixo sintetiza as funções e características de cada segmento, facilitando a consulta rápida.

Característica	Segmento T (O Identificador)	Segmento U (O Detalhe Financeiro)
Função Principal	Identificar o título e reportar seu status geral.	Fornecer o detalhamento financeiro específico do pagamento.
Pergunta-Chave Respondida	"De qual transação estamos falando e o que aconteceu com ela?"	"Quanto dinheiro foi movimentado e quando estará disponível?"
Dados Mais Importantes	Identificadores do Título (Nosso Número), Dados Nominais (valor/vencimento), Código de Ocorrência.	Valor Líquido a ser Creditado (Valor Líquido), Data da Ocorrência e Data do Crédito.


--------------------------------------------------------------------------------


Conclusão: Uma História Completa

Em resumo, os Segmentos T e U são uma dupla obrigatória que trabalha em perfeita sincronia para contar a história completa de uma transação no arquivo de retorno CNAB 240. Ao separar a identificação da transação (Segmento T) de seus detalhes financeiros (Segmento U), o padrão oferece uma confirmação clara e abrangente para cada título processado. Essa estrutura robusta garante que as empresas tenham todas as informações necessárias para uma reconciliação automatizada sem falhas, uma gestão de caixa precisa e um tratamento de erros eficiente.
