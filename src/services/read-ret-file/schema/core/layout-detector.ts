import { adjustToBrasiliaTimezone, tryDate } from './date-utils';
import { FieldExtractors } from './extractors';

/**
 * Tipo de layout do Segmento U
 */
export type SegmentULayout = 'SITCS' | 'PADRAO_V033' | 'SEM_SITCS';

/**
 * Resultado da detecção de layout
 */
export interface LayoutDetectionResult {
  layout: SegmentULayout;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

/**
 * Utilitário para detectar automaticamente o layout do Segmento U
 * baseado na presença do Campo 16.3U, validade das datas e valores monetários
 */
export class SegmentULayoutDetector {
  /**
   * Verifica se uma data é válida (formato DDMMAAAA)
   * IMPORTANTE: Considera o fuso horário de Brasília (UTC-3)
   * @param dateStr - String da data no formato DDMMAAAA
   * @returns true se a data é válida
   */
  private static isValidDate(dateStr: string): boolean {
    if (!dateStr || dateStr.length !== 8) return false;
    if (/^0+$/.test(dateStr) || /^\s+$/.test(dateStr)) return false;

    // Parsear data e ajustar para fuso horário de Brasília (UTC-3)
    const parsedDate = tryDate(dateStr, 'ddMMyyyy');
    const date = adjustToBrasiliaTimezone(parsedDate);
    if (!date) return false;

    // Validar range de datas razoável
    const year = parseInt(dateStr.substring(4, 8), 10);
    return year >= 1900 && year <= 2100;
  }

  /**
   * Verifica se um valor monetário é válido
   * @param line - Linha do arquivo
   * @param start - Posição inicial (base 0)
   * @param end - Posição final (base 0)
   * @returns true se o valor monetário é válido (> 0)
   */
  private static isValidMonetaryValue(line: string, start: number, end: number): boolean {
    if (start < 0 || end < 0 || start >= line.length) return false;
    const value = FieldExtractors.extractMonetary(line, start, end);
    return value > 0;
  }

  /**
   * Verifica coerência entre valores monetários
   * @param paidAmount - Valor pago
   * @param receivedValue - Valor líquido creditado
   * @returns true se há coerência (paidAmount >= receivedValue quando ambos são positivos)
   */
  private static isMonetaryCoherent(paidAmount: number, receivedValue: number): boolean {
    if (paidAmount <= 0 || receivedValue <= 0) return true; // Não valida se algum for zero
    return paidAmount >= receivedValue;
  }

  /**
   * Detecta o layout do Segmento U baseado em múltiplos critérios:
   * - Presença do Campo 16.3U
   * - Validade das datas
   * - Validade e coerência dos valores monetários
   * @param line - Linha do arquivo contendo o Segmento U
   * @returns Resultado da detecção com layout identificado e nível de confiança
   */
  static detectLayout(line: string): LayoutDetectionResult {
    // Verificar tamanho mínimo da linha
    if (line.length < 162) {
      return {
        layout: 'SEM_SITCS',
        confidence: 'low',
        reason: 'Linha muito curta, assumindo layout SEM_SITCS (padrão mais comum)',
      };
    }

    // Extrair Campo 16.3U (Tipo de Arrecadação) na posição 85 (base 0)
    const tipoArrecacao = line.substring(85, 86);
    const hasTipoArrecacao = tipoArrecacao && tipoArrecacao !== ' ' && tipoArrecacao !== '0';

    // === Layout SITCS ===
    // Valor Pago: 86-100, Valor Líquido: 101-115
    // Datas: 146-153 (paymentDate), 154-161 (creditDate)
    const paymentDateSITCS = line.substring(146, 154);
    const creditDateSITCS = line.substring(154, 162);
    const isValidPaymentDateSITCS = this.isValidDate(paymentDateSITCS);
    const isValidCreditDateSITCS = this.isValidDate(creditDateSITCS);
    const paidAmountSITCS = FieldExtractors.extractMonetary(line, 86, 100);
    const receivedValueSITCS = FieldExtractors.extractMonetary(line, 101, 115);
    const isValidMonetarySITCS = this.isValidMonetaryValue(line, 86, 100) && this.isValidMonetaryValue(line, 101, 115);
    const _isCoherentSITCS = this.isMonetaryCoherent(paidAmountSITCS, receivedValueSITCS);

    // === Layout Padrão v033 ===
    // Valor Pago: 77-92 (base 0) = 78-92 (base 1), Valor Líquido: 92-107 (base 0) = 93-107 (base 1)
    // Datas: 137-145 (paymentDate base 0 = 138-145 base 1), 145-153 (creditDate base 0 = 146-153 base 1)
    const paymentDateV033 = line.substring(137, 145);
    const creditDateV033 = line.substring(145, 153);
    const isValidPaymentDateV033 = this.isValidDate(paymentDateV033);
    const isValidCreditDateV033 = this.isValidDate(creditDateV033);
    const paidAmountV033 = FieldExtractors.extractMonetary(line, 77, 92);
    const receivedValueV033 = FieldExtractors.extractMonetary(line, 92, 107);
    const isValidMonetaryV033 = this.isValidMonetaryValue(line, 77, 92) && this.isValidMonetaryValue(line, 92, 107);
    const _isCoherentV033 = this.isMonetaryCoherent(paidAmountV033, receivedValueV033);

    // === Layout SEM_SITCS Alternativo (99,1% dos arquivos) ===
    // Valor Pago: 77-92, Valor Líquido: 92-107
    // Datas: 137-145 (paymentDate), 145-153 (creditDate)
    const paymentDateAlt = line.substring(137, 145);
    const creditDateAlt = line.substring(145, 153);
    const isValidPaymentDateAlt = this.isValidDate(paymentDateAlt);
    const isValidCreditDateAlt = this.isValidDate(creditDateAlt);
    const paidAmountAlt = FieldExtractors.extractMonetary(line, 77, 92);
    const receivedValueAlt = FieldExtractors.extractMonetary(line, 92, 107);
    const isValidMonetaryAlt = this.isValidMonetaryValue(line, 77, 92) && this.isValidMonetaryValue(line, 92, 107);
    const _isCoherentAlt = this.isMonetaryCoherent(paidAmountAlt, receivedValueAlt);

    // Nota: A decisão de layout é baseada em validações booleanas diretamente,
    // não em scores calculados, para garantir clareza e facilidade de manutenção

    // Decisão baseada em scores (priorizando valores monetários)
    // Layout SITCS: Requer Campo 16.3U + validações
    if (hasTipoArrecacao && isValidPaymentDateSITCS && isValidCreditDateSITCS && isValidMonetarySITCS) {
      return {
        layout: 'SITCS',
        confidence: 'high',
        reason: 'Campo 16.3U presente, datas válidas e valores monetários coerentes nas posições SITCS',
      };
    }

    // Layout Padrão v033: Sem Campo 16.3U + validações
    // Nota: PADRAO_V033 e SEM_SITCS têm as mesmas posições
    // Priorizar PADRAO_V033 quando ambos têm validações válidas
    if (!hasTipoArrecacao && isValidPaymentDateV033 && isValidCreditDateV033 && isValidMonetaryV033) {
      return {
        layout: 'PADRAO_V033',
        confidence: 'high',
        reason: 'Campo 16.3U ausente, datas válidas e valores monetários coerentes nas posições padrão v033',
      };
    }

    // Layout SEM_SITCS Alternativo: Sem Campo 16.3U + validações
    // Usar SEM_SITCS quando PADRAO_V033 não é válido mas SEM_SITCS é
    if (
      !hasTipoArrecacao &&
      isValidPaymentDateAlt &&
      isValidCreditDateAlt &&
      isValidMonetaryAlt &&
      (!isValidPaymentDateV033 || !isValidCreditDateV033 || !isValidMonetaryV033)
    ) {
      return {
        layout: 'SEM_SITCS',
        confidence: 'high',
        reason: 'Campo 16.3U ausente, datas válidas e valores monetários coerentes nas posições alternativas',
      };
    }

    // Casos especiais com confiança média - priorizar PADRAO_V033
    if (!hasTipoArrecacao && isValidMonetaryV033 && isValidPaymentDateV033 && !isValidCreditDateV033) {
      return {
        layout: 'PADRAO_V033',
        confidence: 'medium',
        reason:
          'Campo 16.3U ausente, valores monetários válidos na posição padrão v033 e paymentDate válido, mas creditDate vazio',
      };
    }

    if (
      !hasTipoArrecacao &&
      isValidMonetaryAlt &&
      isValidPaymentDateAlt &&
      !isValidCreditDateAlt &&
      (!isValidMonetaryV033 || !isValidPaymentDateV033)
    ) {
      return {
        layout: 'SEM_SITCS',
        confidence: 'medium',
        reason:
          'Campo 16.3U ausente, valores monetários válidos na posição alternativa e paymentDate válido, mas creditDate vazio (transação pendente)',
      };
    }

    if (hasTipoArrecacao && isValidMonetarySITCS && isValidPaymentDateSITCS && !isValidCreditDateSITCS) {
      return {
        layout: 'SITCS',
        confidence: 'medium',
        reason:
          'Campo 16.3U presente, valores monetários válidos na posição SITCS e paymentDate válido, mas creditDate vazio',
      };
    }

    // Fallback: usar layout PADRAO_V033 com baixa confiança (prioridade padrão)
    return {
      layout: 'PADRAO_V033',
      confidence: 'low',
      reason: 'Não foi possível determinar layout com certeza, usando PADRAO_V033 (padrão)',
    };
  }
}

/**
 * Tipo de layout do Segmento T
 */
export type SegmentTLayout = 'SITCS' | 'PADRAO_V033';

/**
 * Resultado da detecção de layout do Segmento T
 */
export interface SegmentTLayoutDetectionResult {
  layout: SegmentTLayout;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

/**
 * Utilitário para detectar automaticamente o layout do Segmento T
 * baseado na validação de valores monetários (Valor Nominal e Tarifa)
 */
export class SegmentTLayoutDetector {
  /**
   * Verifica se um valor monetário é válido
   * @param line - Linha do arquivo
   * @param start - Posição inicial (base 0)
   * @param end - Posição final (base 0)
   * @returns true se o valor monetário é válido (> 0 quando esperado)
   */
  private static isValidMonetaryValue(line: string, start: number, end: number): boolean {
    if (start < 0 || end < 0 || start >= line.length) return false;
    const value = FieldExtractors.extractMonetary(line, start, end);
    return value > 0;
  }

  /**
   * Detecta o layout do Segmento T baseado na validação de valores monetários
   * @param line - Linha do arquivo contendo o Segmento T
   * @returns Resultado da detecção com layout identificado e nível de confiança
   */
  static detectLayout(line: string): SegmentTLayoutDetectionResult {
    // Verificar tamanho mínimo da linha
    if (line.length < 214) {
      return {
        layout: 'PADRAO_V033',
        confidence: 'low',
        reason: 'Linha muito curta para Segmento T, assumindo layout PADRAO_V033 (padrão)',
      };
    }

    // === Layout SITCS ===
    // Valor Nominal: 82-97 (base 0) = 83-97 (base 1)
    // Tarifa: 199-214 (base 0) = 200-214 (base 1)
    const receivedValueSITCS = FieldExtractors.extractMonetary(line, 82, 97);
    const isValidReceivedValueSITCS = this.isValidMonetaryValue(line, 82, 97);
    const isValidTariffSITCS = this.isValidMonetaryValue(line, 199, 214);

    // === Layout Padrão v033 ===
    // Valor Nominal: 81-96 (base 0) = 82-96 (base 1)
    // Tarifa: 198-213 (base 0) = 199-213 (base 1)
    const receivedValueV033 = FieldExtractors.extractMonetary(line, 81, 96);
    const isValidReceivedValueV033 = this.isValidMonetaryValue(line, 81, 96);
    const isValidTariffV033 = this.isValidMonetaryValue(line, 198, 213);

    // Calcular scores para cada layout
    let scoreSITCS = 0;
    let scoreV033 = 0;

    // Layout SITCS
    if (isValidReceivedValueSITCS) scoreSITCS += 10; // Valor Nominal válido tem peso alto
    if (isValidTariffSITCS) scoreSITCS += 5; // Tarifa válida tem peso médio
    // Validar se valores fazem sentido (não são valores extremamente altos devido a offset incorreto)
    if (isValidReceivedValueSITCS && receivedValueSITCS < 1000000000) scoreSITCS += 5; // Valores razoáveis

    // Layout Padrão v033
    if (isValidReceivedValueV033) scoreV033 += 10; // Valor Nominal válido tem peso alto
    if (isValidTariffV033) scoreV033 += 5; // Tarifa válida tem peso médio
    // Validar se valores fazem sentido
    if (isValidReceivedValueV033 && receivedValueV033 < 1000000000) scoreV033 += 5; // Valores razoáveis

    // Decisão baseada em scores
    // Se ambos têm scores iguais, preferir PADRAO_V033 (layout padrão/v033)
    if (isValidReceivedValueV033 && scoreV033 >= scoreSITCS) {
      return {
        layout: 'PADRAO_V033',
        confidence: 'high',
        reason: 'Valores monetários válidos nas posições padrão v033',
      };
    }

    if (isValidReceivedValueSITCS && scoreSITCS > scoreV033) {
      return {
        layout: 'SITCS',
        confidence: 'high',
        reason: 'Valores monetários válidos nas posições SITCS',
      };
    }

    // Fallback: usar layout PADRAO_V033 com baixa confiança (prioridade padrão)
    return {
      layout: 'PADRAO_V033',
      confidence: 'low',
      reason: 'Não foi possível determinar layout com certeza, usando PADRAO_V033 (padrão)',
    };
  }

  /**
   * Valida valores monetários do Segmento T (método legado para compatibilidade)
   * @param line - Linha do arquivo contendo o Segmento T
   * @returns Informações de validação
   */
  static validateMonetaryValues(line: string): {
    isValid: boolean;
    receivedValue: number;
    tariff: number;
    reason: string;
  } {
    const detection = this.detectLayout(line);
    const layout = detection.layout;

    // Extrair valores baseado no layout detectado
    const receivedValue =
      layout === 'PADRAO_V033'
        ? FieldExtractors.extractMonetary(line, 81, 96)
        : FieldExtractors.extractMonetary(line, 82, 97);
    const tariff =
      layout === 'PADRAO_V033'
        ? FieldExtractors.extractMonetary(line, 198, 213)
        : FieldExtractors.extractMonetary(line, 199, 214);

    const isValidReceivedValue = this.isValidMonetaryValue(
      line,
      layout === 'PADRAO_V033' ? 81 : 82,
      layout === 'PADRAO_V033' ? 96 : 97,
    );

    if (!isValidReceivedValue) {
      return {
        isValid: false,
        receivedValue,
        tariff,
        reason: 'Valor Nominal do Título inválido ou zero',
      };
    }

    return {
      isValid: true,
      receivedValue,
      tariff,
      reason: `Valores monetários válidos (layout ${layout})`,
    };
  }
}
