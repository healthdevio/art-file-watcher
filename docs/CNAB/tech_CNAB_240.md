# Technical Report: Processing Flow of CNAB 240 Files for the SITCS Service

## 1.0 Introduction to the SITCS CNAB 240 Framework

This technical report provides a detailed analysis of the structure and processing flow of CNAB 240 standard files, specifically as implemented by CAIXA for the Contribuição Sindical Urbana (SITCS) service. The document outlines the hierarchical architecture of the files, the core communication model involving remittance and return files, and the specific data segments used to manage the collection process.

The fundamental objective of the SITCS service is to provide syndical entities with a standardized and efficient mechanism for collecting the Urban Union Contribution. This process is conducted in full compliance with the Consolidação das Leis do Trabalho (CLT) and the prevailing regulations of the national financial system.

To facilitate this information exchange, the service leverages an Electronic Data Interchange (EDI) system. The strategic advantages of this approach are significant, ensuring a robust communication channel between the client (Beneficiary) and the bank (CAIXA). Key benefits include:

* Reliability and Security: EDI mitigates data integrity and confidentiality risks by replacing manual processes with an encrypted, automated data channel.
* Agility: The electronic process streamlines the submission of contribution titles and the reporting of transaction outcomes, reducing operational turnaround times.
* Enhanced Operational Convenience: Direct data transmission enhances efficiency by reducing manual data handling and the need for parallel controls.

The information flow involves several key participants, each with a distinct role in the collection and payment cycle.

Participant	Description
Beneficiário	The Syndical Entity that submits the contribution titles to the bank for collection.
Banco Beneficiário	The bank holding the beneficiary's contribution titles, which in this context is CAIXA.
Pagador	The individual or legal entity responsible for paying the contribution (the contributor or debtor).
Banco Recebedor	The bank where the payment of the contribution title is actually made.

Understanding these roles is foundational to appreciating the file architecture itself, which is designed to manage complex data exchanges in a structured and predictable manner.

## 2.0 The Hierarchical Architecture of a CNAB 240 File

The strategic importance of the CNAB 240 standard lies in its hierarchical file structure. This layered organization is crucial for ensuring systematic and error-free processing, allowing a single physical file to contain multiple, distinct service batches (lotes), each representing a specific set of operations.

A standard CNAB 240 file is composed of a Header record, which opens and identifies the file; one or more Service Batches (Lotes de Serviço), which contain the transactional data; and a Trailer record, which formally closes the file and provides consolidated control totals.

The file's structure is defined by a series of specific record types, each identified by a numeric code. The primary record types and their functions are as follows:

* Registro Tipo 0 (Header de Arquivo): The opening record that provides general identification details for the entire file.
* Registro Tipo 1 (Header de Lote): Marks the beginning of a specific service batch and defines the type of operation (e.g., Remittance or Return).
* Registro Tipo 3 (Detalhe): Contains the primary transactional data, subdivided into specific Segments (such as P, Q, T, and U).
* Registro Tipo 5 (Trailer de Lote): Formally closes a service batch and provides critical control totals for that batch, including the total number of records and the sum of monetary values.
* Registro Tipo 9 (Trailer de Arquivo): The final record, serving to close the entire transmission with consolidated totals for the file, such as the total number of batches and records.

For completeness, the standard also defines optional records such as Registro Tipo 2 (Initial Batch Records) and Registro Tipo 4 (Final Batch Records) that can appear within a service batch. The control totals in Registro Tipo 5 and Registro Tipo 9 are not merely summaries; they are critical for file validation, allowing the receiving system to programmatically verify that the file has not been corrupted or truncated during transmission, thus ensuring the integrity of the entire data exchange.

Technically, the record type is identified by the single numeric digit located in position 8 of each line. Critically, for Registro Tipo 3, the specific segment is identified by the letter-coded character (e.g., 'P', 'Q', 'T', or 'U') located in position 14. This modularity, where core data is held in letter-coded segments within Type 3 records, forms the basis of the request-response protocol, which is physically realized through Remittance and Return files.

## 3.0 Core Information Flow: Remittance and Return Files

The entire communication process for the SITCS service operates on a request-response model facilitated by two distinct file types. This cyclical exchange ensures that every instruction sent by the syndical entity receives a corresponding confirmation or status update from the bank.

* Arquivo Remessa (Remittance File): This is the file generated and sent by the Syndical Entity to CAIXA. Its purpose is to register transaction requests, which can include the inclusion of new collection contribution titles, instructions to cancel existing contribution titles, or requests to alter data on a previously registered contribution title.
* Arquivo Retorno (Return File): This is the response file sent by CAIXA back to the Syndical Entity. It serves two main purposes: to report the results of processing the remittance file (confirming accepted instructions or detailing rejections) and to inform the entity of other contribution title movements, such as liquidations (payments) made by contributors.

The processing of these files adheres to strict operational rules. Remittance files must be transmitted to CAIXA by 18:00h (Brasília time) for same-day processing; files sent after this cut-off are processed on the following business day. Furthermore, each Arquivo Remessa must have a sequential number greater than the last one successfully processed to prevent duplicate or out-of-order submissions.

This structured flow provides the framework for a detailed examination of the specific data segments that constitute each of these file types.

## 4.0 Analysis of the Remittance File (Arquivo Remessa) Segments

The Arquivo Remessa is constructed using specific, mandatory segments designed to convey all necessary information for registering and managing contribution titles. For the SITCS service, the file's instructional power is derived from the combination of Segment P and Segment Q, which together form a complete request for a single contribution title.

### 4.1 Segment P: Core Title Definition and Financial Terms (Mandatory)

Segment P functions as the primary record for defining a contribution title's core financial and operational data, solving the problem of how to specify the terms of a collection. It is mandatory for registering a new contribution title or requesting modifications. The essential information it carries includes:

* Title Identification: Contains key identifiers such as the Número do Documento de Cobrança (the entity's own reference number).
* Financial Terms: Specifies the Data de Vencimento (due date) and the Valor Nominal do Título (nominal value).
* Payment Instructions: Includes codes and values for interest, discounts, and other payment terms.
* Processing Rules: Defines the Código para Protesto and Código para Baixa/Devolução, dictating how the bank should handle non-payment.

### 4.2 Segment Q: Payer Identification and Regulatory Data (Mandatory)

Segment Q is mandatorily paired with each Segment P to provide comprehensive details about the payer (the contributor). This segment ensures the bank has all necessary information to identify the debtor. Its key data points include:

* Payer Identification: The contributor's name and identification number (CPF for individuals, CNPJ for companies).
* Address Information: The payer's full address, including street, city, and CEP (postal code).
* SITCS-Specific Economic Data: Contains crucial data for union contribution calculations, such as the Capital Social da Empresa, Número de Empregados Contribuintes, and Total da Remuneração – Contribuintes.

The collection of this SITCS-specific data is not merely informational; it is required for regulatory compliance and calculation, fulfilling the service's core objective as defined by the CLT.

### 4.3 Segment Y-53: Payment Type Identification (Optional)

The optional Segment Y-53 is used to provide granular control over payment acceptance. Its purpose is to specify whether the bank should accept payments that diverge from the contribution title's nominal value. The options include:

* Acceptance of any payment value.
* Acceptance of values only within a specified minimum/maximum range.
* Strict acceptance of the exact contribution title value only.

Together, the mandatory Segment P and Segment Q form a complete and actionable instruction for the bank. Once processed, the bank responds with a Return file, detailing the outcome of these instructions.

## 5.0 Analysis of the Return File (Arquivo Retorno) Segments

The Arquivo Retorno provides the official feedback and status updates from the bank regarding the contribution titles managed on behalf of the syndical entity. For every movement reported—be it a confirmation, a rejection, or a liquidation—a mandatory pair of segments, T and U, is generated. This pair provides a comprehensive and unambiguous status report for each transaction.

### 5.1 Segment T: Transaction Identification and Status Reporting (Mandatory)

Segment T serves as the primary event notification record, solving the core problem of unambiguously identifying which contribution title is being reported and what event occurred. It acts as the anchor for the status update, containing the following critical data fields:

* Title Identification: Includes both the bank-generated Nosso Número and the entity's Seu Número, ensuring a clear link back to the initial request.
* Financial Data: Reports the original nominal value and due date of the contribution title for reconciliation.
* Payer Identification: Provides the name and CPF/CNPJ of the payer associated with the contribution title.
* Occurrence Motive: The crucial Motivo da Ocorrência field uses standardized codes (like those in note C047) to specify the exact reason for a rejection, confirm a liquidation, or report other status changes.
* Bank Fees: Details the value of any tariffs or fees (Valor da Tar./Custas) charged by the bank.

### 5.2 Segment U: Financial Settlement and Value Reconciliation (Mandatory)

Segment U serves as the mandatory financial complement to Segment T, providing a detailed breakdown of the values involved in a processed payment. It is generated for every liquidation event and contains the following information:

* Payment Values: Includes the total amount paid, any accrued interest/fines (Acréscimos), and the Valor Líquido a ser Creditado (net amount to be credited).
* Control Dates: Specifies the Data da Ocorrência (the date the payment was made) and the Data do Crédito (the date the funds will be available).
* SITCS Specific Data: Uniquely for the SITCS service, this segment returns key economic data originally sent in the remittance file, such as Capital Social da Empresa, Número de Empregados, and Remuneração Total.
* Entity Data: Confirms the syndical code and entity type associated with the credit.

The return of SITCS-specific data is significant as it closes the data loop, allowing the Syndical Entity to reconcile the payment received against the specific contributor data originally sent in Segment Q, thereby ensuring end-to-end data integrity.

### 5.3 Synergy and Control of Segments T and U

Segments T and U are operationally inseparable within the Arquivo Retorno. They are obligatorily used together for each reported event, creating a complete record of both the status and the financial outcome of a transaction. The link between the two segments for a single event is maintained by the shared código de movimento and the sequential record number within the service batch.

This T/U pairing provides a complete and auditable picture of each transaction's outcome, leading into the final synthesis of the overall process.

## 6.0 Conclusion: Synthesizing the SITCS CNAB 240 Flow

The CNAB 240 framework for the SITCS service provides a highly structured and reliable system for managing the collection of union contributions. The success of this system is rooted in its clear, hierarchical architecture and its robust request-response communication model.

The hierarchical structure—progressing from the overall File down to specific Batches and finally to detailed Segments—forms the foundation for organized and scalable data processing. This allows for complex operations to be managed within a single, coherent transmission.

The distinct roles of the two core file types are central to the workflow. The Arquivo Remessa, built with mandatory P/Q segment pairs, serves as the official instruction manual from the syndical entity to the bank. In response, the Arquivo Retorno, utilizing mandatory T/U segment pairs, provides the bank's official feedback, reporting on the status and financial outcome of every transaction.

Ultimately, the rigorous P/Q and T/U segment pairings, validated by a hierarchical structure of control totals, create a highly auditable and resilient information exchange. A command of this framework is therefore a prerequisite for developing robust, compliant, and efficient financial systems for Urban Union Contribution management in the Brazilian banking ecosystem.
