import { FileIdentifier } from '../../src/services/read-ret-file/file-identifier';
import { CNABType } from '../../src/services/read-ret-file/types';
import {
  CNAB240_INVALID_SECOND_LINE,
  CNAB240_SECOND_LINE,
  CNAB400_FIRST_LINE,
  CNAB400_INVALID_FIRST_LINE,
  CNAB400_INVALID_SECOND_LINE,
  CNAB400_SECOND_LINE,
  createCNAB240FirstLine,
} from './test-fixtures';

describe('FileIdentifier', () => {
  describe('identify', () => {
    it('deve identificar arquivo CNAB 400 corretamente', () => {
      const result = FileIdentifier.identify(CNAB400_FIRST_LINE, CNAB400_SECOND_LINE);
      expect(result).toBe<CNABType>('CNAB400');
    });

    it('deve identificar arquivo CNAB 240 versão 030 corretamente', () => {
      const firstLine = createCNAB240FirstLine('030');
      const result = FileIdentifier.identify(firstLine, CNAB240_SECOND_LINE);
      expect(result).toBe<CNABType>('CNAB240_30');
    });

    it('deve identificar arquivo CNAB 240 versão 040 corretamente', () => {
      const firstLine = createCNAB240FirstLine('040');
      const result = FileIdentifier.identify(firstLine, CNAB240_SECOND_LINE);
      expect(result).toBe<CNABType>('CNAB240_40');
    });

    it('deve retornar UNKNOWN quando primeira linha é muito curta', () => {
      const firstLine = '02RETORNO'; // Muito curta (precisa de pelo menos 166 caracteres)
      const secondLine = '700000000000000000071X0003029532835965';
      const result = FileIdentifier.identify(firstLine, secondLine);
      expect(result).toBe<CNABType>('UNKNOWN');
    });

    it('deve retornar UNKNOWN quando segunda linha é muito curta', () => {
      const secondLine = '7'; // Muito curta (precisa de pelo menos 9 caracteres)
      const result = FileIdentifier.identify(CNAB400_FIRST_LINE, secondLine);
      expect(result).toBe<CNABType>('UNKNOWN');
    });

    it('deve retornar UNKNOWN quando não corresponde a nenhum padrão CNAB 400', () => {
      // Primeira linha não começa com "02RETORNO"
      const result = FileIdentifier.identify(CNAB400_INVALID_FIRST_LINE, CNAB400_SECOND_LINE);
      expect(result).toBe<CNABType>('UNKNOWN');
    });

    it('deve retornar UNKNOWN quando segunda linha não começa com "7" para CNAB 400', () => {
      const result = FileIdentifier.identify(CNAB400_FIRST_LINE, CNAB400_INVALID_SECOND_LINE);
      expect(result).toBe<CNABType>('UNKNOWN');
    });

    it('deve retornar UNKNOWN quando primeira linha contém "RETORNO" para CNAB 240', () => {
      // CNAB 240 não deve ter "RETORNO" na posição 2-9
      const result = FileIdentifier.identify(CNAB400_FIRST_LINE, CNAB240_SECOND_LINE);
      expect(result).toBe<CNABType>('UNKNOWN');
    });

    it('deve retornar UNKNOWN quando segunda linha não tem "T" na posição 8-9 para CNAB 240', () => {
      const firstLine = createCNAB240FirstLine('030');
      const result = FileIdentifier.identify(firstLine, CNAB240_INVALID_SECOND_LINE);
      expect(result).toBe<CNABType>('UNKNOWN');
    });

    it('deve retornar UNKNOWN quando código do arquivo não é 030 ou 040 para CNAB 240', () => {
      // Primeira linha com código "050" na posição 163-166 (inválido)
      const firstLine = createCNAB240FirstLine('050');
      const result = FileIdentifier.identify(firstLine, CNAB240_SECOND_LINE);
      expect(result).toBe<CNABType>('UNKNOWN');
    });

    it('deve priorizar identificação CNAB 400 sobre CNAB 240', () => {
      // Linha que poderia ser CNAB 240 mas é CNAB 400
      const result = FileIdentifier.identify(CNAB400_FIRST_LINE, CNAB400_SECOND_LINE);
      expect(result).toBe<CNABType>('CNAB400');
    });
  });
});
