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
   * Extrai linhas do conteúdo, removendo linhas vazias.
   * @param content - Conteúdo do arquivo
   * @returns Array de linhas
   */
  private static extractLines(content: string): string[] {
    return content.split(/\r?\n/).filter(line => line.trim().length > 0);
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
