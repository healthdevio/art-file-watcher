import { normalizeNumber } from '../../src/utils/number';

describe('normalizeNumber', () => {
  it('deve retornar o valor padrão quando o valor é undefined', () => {
    const result = normalizeNumber(undefined, 10);
    expect(result).toBe(10);
  });

  it('deve retornar o valor padrão quando o valor é null', () => {
    const result = normalizeNumber(null, 10);
    expect(result).toBe(10);
  });

  it('deve retornar o valor padrão quando o valor é string vazia', () => {
    const result = normalizeNumber('', 10);
    expect(result).toBe(10);
  });

  it('deve retornar o número quando o valor já é um número', () => {
    const result = normalizeNumber(42, 10);
    expect(result).toBe(42);
  });

  it('deve converter string numérica para número', () => {
    const result = normalizeNumber('42', 10);
    expect(result).toBe(42);
  });

  it('deve retornar o valor padrão quando a string não é numérica', () => {
    const result = normalizeNumber('abc', 10);
    expect(result).toBe(10);
  });

  it('deve usar 3 como padrão quando não especificado', () => {
    const result = normalizeNumber(undefined);
    expect(result).toBe(3);
  });

  it('deve converter string "0" para número 0', () => {
    const result = normalizeNumber('0', 10);
    expect(result).toBe(0);
  });

  it('deve converter string negativa para número negativo', () => {
    const result = normalizeNumber('-5', 10);
    expect(result).toBe(-5);
  });
});

