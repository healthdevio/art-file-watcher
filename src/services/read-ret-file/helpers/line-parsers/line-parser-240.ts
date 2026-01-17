import { LineCNAB240Payload } from '../../interfaces/CNAB-240';
import { LineTypeIdentifier } from '../line-type-identifier';
import { HeaderLoteParser240 } from './header-lote-parser-240';
import { SegmentoTParser240 } from './segmento-t-parser-240';
import { SegmentoUParser240 } from './segmento-u-parser-240';
import { SegmentoYParser240 } from './segmento-y-parser-240';
import { TrailerArquivoParser240 } from './trailer-arquivo-parser-240';
import { TrailerLoteParser240 } from './trailer-lote-parser-240';

/**
 * Parser principal para linhas CNAB 240.
 * Coordena a identificação do tipo de linha e delega para o parser específico.
 */
export class LineParser240 {
  /**
   * Faz o parse de uma linha CNAB 240.
   * @param line - Linha do arquivo
   * @param version - Versão do CNAB 240 ('030' ou '040')
   * @returns Payload tipado ou null se a linha não for reconhecida/inválida
   */
  static parse(line: string, version: '030' | '040'): LineCNAB240Payload | null {
    const lineType = LineTypeIdentifier.identify(line, version);
    const parsers = {
      HEADER_LOTE: () => HeaderLoteParser240.parse(line, version),
      SEGMENTO_T: () => SegmentoTParser240.parse(line, version),
      SEGMENTO_U: () => SegmentoUParser240.parse(line, version),
      SEGMENTO_Y: () => SegmentoYParser240.parse(line, version),
      TRAILER_LOTE: () => TrailerLoteParser240.parse(line, version),
      TRAILER_ARQUIVO: () => TrailerArquivoParser240.parse(line, version),
    };

    const parser = parsers?.[lineType as keyof typeof parsers] ?? null;
    if (parser) return parser() as LineCNAB240Payload;
    return null;
  }
}
