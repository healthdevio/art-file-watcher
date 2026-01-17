import { CNAB240, LineCNAB240 } from '../interfaces/CNAB-240';
import { CNAB400, LineCNAB400 } from '../interfaces/CNAB-400';
import { CNABResult, CNABType } from '../types';
import { HeaderParser240 } from './header-parser-240';
import { HeaderParser400 } from './header-parser-400';
import { LineParser240 } from './line-parsers/line-parser-240';
import { LineParser400 } from './line-parsers/line-parser-400';

/**
 * Helper para construir estruturas CNAB a partir de linhas.
 * Desacoplado e reutilizável.
 */
export class StructureBuilder {
  /**
   * Constrói estrutura CNAB baseada no tipo detectado.
   * @param lines - Linhas do arquivo
   * @param cnabType - Tipo CNAB detectado
   * @returns Estrutura CNAB ou undefined
   */
  static build(lines: string[], cnabType: CNABType): CNABResult | undefined {
    if (cnabType === 'CNAB240_30' || cnabType === 'CNAB240_40') return this.buildCNAB240(lines);
    if (cnabType === 'CNAB400') return this.buildCNAB400(lines);
    return undefined;
  }

  /**
   * Constrói estrutura CNAB 240.
   *
   * @param lines - Linhas do arquivo
   * @returns Estrutura CNAB 240
   */
  private static buildCNAB240(lines: string[]): CNAB240 {
    const firstLine = lines[0] || '';
    const header = HeaderParser240.parse(firstLine);
    // Extrai versão do header (030 ou 040)
    const version = header.fileCode === '030' ? '030' : '040';
    // Processa todas as linhas após o header
    const lineObjects: LineCNAB240[] = lines.slice(1).map((line, index) => {
      const payload = LineParser240.parse(line, version);
      return { line, number: index + 2, payload };
    });
    return { header, lines: lineObjects };
  }

  /**
   * Constrói estrutura CNAB 400.
   * @param lines - Linhas do arquivo
   * @returns Estrutura CNAB 400
   */
  private static buildCNAB400(lines: string[]): CNAB400 {
    const firstLine = lines[0] || '';
    const header = HeaderParser400.parse(firstLine);

    // Processa todas as linhas após o header
    const lineObjects: LineCNAB400[] = lines.slice(1).map((line, index) => {
      const payload = LineParser400.parse(line);
      return { line, number: index + 2, payload };
    });

    return { header, lines: lineObjects };
  }
}
