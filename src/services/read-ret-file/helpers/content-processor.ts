import { FileIdentifier } from '../file-identifier';
import type { CNABType } from '../types';

/** Helper para processar conteúdo de arquivo. (Desacoplado e reutilizável) */
export class ContentProcessor {
  /**
   * Processa conteúdo de arquivo e identifica tipo CNAB.
   * @param content - Conteúdo do arquivo como string
   * @returns Tipo CNAB detectado e linhas processadas
   */
  static process(content: string): { cnabType: CNABType; lines: string[] } {
    const lines = this.extractLines(content);
    const cnabType = this.identifyType(lines);
    return { cnabType, lines };
  }

  /**
   * Extrai linhas do conteúdo, removendo apenas linhas completamente vazias.
   * Preserva todos os caracteres originais, incluindo espaços em branco nas extremidades.
   * IMPORTANTE: Não aplica trim() nas linhas para preservar posições fixas do CNAB.
   *
   * @param content - Conteúdo do arquivo
   * @returns Array de linhas (preservando caracteres originais)
   */
  private static extractLines(content: string): string[] {
    // Remove BOM UTF-8 se ainda presente (caractere especial 0xFEFF)
    const cleanContent = content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;

    // Divide por CRLF (\r\n) ou LF (\n), preservando caracteres originais
    // Usa regex não-global para garantir que cada quebra de linha seja processada corretamente
    const lines = cleanContent.split(/\r?\n/);

    // Filtra apenas linhas completamente vazias (sem caracteres)
    // Usa length === 0 ao invés de trim() para preservar espaços em branco
    // IMPORTANTE: Linhas com apenas espaços são preservadas (podem ser válidas em CNAB)
    const filteredLines = lines.filter(line => line.length > 0);

    // Validação: garante que nenhuma linha foi modificada durante o processo
    // Verifica se o conteúdo total (sem quebras de linha) foi preservado
    const originalLength = cleanContent.replace(/\r?\n/g, '').length;
    const filteredLength = filteredLines.join('').length;
    if (originalLength !== filteredLength) {
      // Log apenas em caso de divergência (não deve acontecer)
      console.warn(
        `[ContentProcessor] Aviso: Comprimento total divergente após extração de linhas. Original: ${originalLength}, Filtrado: ${filteredLength}`,
      );
    }

    return filteredLines;
  }

  /**
   * Identifica o tipo CNAB baseado nas primeiras duas linhas.
   * @param lines - Linhas do arquivo
   * @returns Tipo CNAB detectado
   */
  private static identifyType(lines: string[]): CNABType {
    if (lines?.length < 2) return 'UNKNOWN';
    return FileIdentifier.identify(lines[0], lines[1]);
  }
}
