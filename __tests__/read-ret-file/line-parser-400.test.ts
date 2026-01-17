import { DetalheParser400 } from '../../src/services/read-ret-file/helpers/line-parsers/detalhe-parser-400';
import { LineParser400 } from '../../src/services/read-ret-file/helpers/line-parsers/line-parser-400';
import { TrailerArquivoParser400 } from '../../src/services/read-ret-file/helpers/line-parsers/trailer-arquivo-parser-400';
import { LineTypeIdentifier400 } from '../../src/services/read-ret-file/helpers/line-type-identifier-400';
import { CNAB400_SECOND_LINE } from './test-fixtures';

// Exemplo real de linha de detalhe CNAB 400 (tipo 7) - usando fixture existente
const DETALHE_LINE = CNAB400_SECOND_LINE.padEnd(400, ' ').substring(0, 400);

// Exemplo de trailer (tipo 9) - última linha do arquivo
const TRAILER_LINE = ('9' + ' '.repeat(393) + '000975').padEnd(400, ' ');

describe('LineParser400', () => {
  describe('parse', () => {
    it('deve parsear linha de detalhe corretamente', () => {
      const result = LineParser400.parse(DETALHE_LINE);
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('recordType', '7');
      expect(result).toHaveProperty('agreement');
      expect(result).toHaveProperty('receivedValue');
    });

    it('deve parsear trailer do arquivo corretamente', () => {
      const result = LineParser400.parse(TRAILER_LINE);
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('recordType', '9');
      expect(result).toHaveProperty('totalRecords');
    });

    it('deve retornar null para linha desconhecida', () => {
      const result = LineParser400.parse('INVALID LINE');
      expect(result).toBeNull();
    });
  });
});

describe('DetalheParser400', () => {
  it('deve extrair campos da linha de detalhe', () => {
    const result = DetalheParser400.parse(DETALHE_LINE);
    expect(result).not.toBeNull();
    expect(result?.recordType).toBe('7');
    expect(result?.agreement).toBeDefined();
    expect(result?.receivedValue).toBeGreaterThanOrEqual(0);
    expect(result?.paymentDate).toMatch(/^\d{2}\/\d{2}\/\d{2}$/);
    expect(result?.creditDate).toMatch(/^\d{2}\/\d{2}\/\d{2}$/);
    expect(result?.tariff).toBeGreaterThanOrEqual(0);
  });

  it('deve normalizar agência e conta corretamente', () => {
    const result = DetalheParser400.parse(DETALHE_LINE);
    expect(result).not.toBeNull();
    // Agência e conta devem ser normalizadas (sem zeros à esquerda ou null se apenas zeros)
    if (result?.agency) {
      expect(typeof result.agency).toBe('string');
      expect(result.agency.length).toBeGreaterThan(0);
    }
  });

  it('deve retornar null para linha muito curta', () => {
    const result = DetalheParser400.parse('SHORT');
    expect(result).toBeNull();
  });

  it('deve retornar null para tipo de registro inválido', () => {
    const invalidLine = '8' + DETALHE_LINE.substring(1);
    const result = DetalheParser400.parse(invalidLine);
    expect(result).toBeNull();
  });
});

describe('TrailerArquivoParser400', () => {
  it('deve extrair campos do trailer do arquivo', () => {
    const result = TrailerArquivoParser400.parse(TRAILER_LINE);
    expect(result).not.toBeNull();
    expect(result?.recordType).toBe('9');
    expect(result?.totalRecords).toBe(975);
  });

  it('deve retornar null para linha muito curta', () => {
    const result = TrailerArquivoParser400.parse('SHORT');
    expect(result).toBeNull();
  });

  it('deve retornar null para tipo de registro inválido', () => {
    const invalidLine = '8' + TRAILER_LINE.substring(1);
    const result = TrailerArquivoParser400.parse(invalidLine);
    expect(result).toBeNull();
  });
});

describe('LineTypeIdentifier400', () => {
  it('deve identificar linha de detalhe', () => {
    const result = LineTypeIdentifier400.identify(DETALHE_LINE);
    expect(result).toBe('DETALHE');
  });

  it('deve identificar trailer do arquivo', () => {
    const result = LineTypeIdentifier400.identify(TRAILER_LINE);
    expect(result).toBe('TRAILER_ARQUIVO');
  });

  it('deve retornar UNKNOWN para linha inválida', () => {
    const result = LineTypeIdentifier400.identify('INVALID');
    expect(result).toBe('UNKNOWN');
  });

  it('deve retornar UNKNOWN para linha muito curta', () => {
    const result = LineTypeIdentifier400.identify('SHORT');
    expect(result).toBe('UNKNOWN');
  });
});
