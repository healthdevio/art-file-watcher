import { LineCNAB400Payload } from '../../interfaces/CNAB-400';
import { LineTypeIdentifier400 } from '../line-type-identifier-400';
import { DetailsParser400 } from './details-parser-400';
import { TrailerArquivoParser400 } from './trailer-arquivo-parser-400';

/**
 * Parser principal para linhas CNAB 400.
 * Coordena a identificação do tipo de linha e delega para o parser específico.
 */
export class LineParser400 {
  /**
   * Faz o parse de uma linha CNAB 400.
   * @param line - Linha do arquivo
   * @returns Payload tipado ou null se a linha não for reconhecida/inválida
   */
  static parse(line: string): LineCNAB400Payload | null {
    const lineType = LineTypeIdentifier400.identify(line);
    const parsers = {
      DETALHE: () => DetailsParser400.parse(line),
      TRAILER_ARQUIVO: () => TrailerArquivoParser400.parse(line),
    };

    const parser = parsers?.[lineType as keyof typeof parsers] ?? null;
    if (parser) return parser() as LineCNAB400Payload;
    return null;
  }
}
