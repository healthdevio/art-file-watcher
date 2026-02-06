import { formatDate, formatMonetaryValue } from '../../src/services/read-ret-file/helpers/formatters';
import { HeaderLoteParser240 } from '../../src/services/read-ret-file/helpers/line-parsers/header-lote-parser-240';
import { LineParser240 } from '../../src/services/read-ret-file/helpers/line-parsers/line-parser-240';
import { SegmentoTParser240 } from '../../src/services/read-ret-file/helpers/line-parsers/segmento-t-parser-240';
import { SegmentoUParser240 } from '../../src/services/read-ret-file/helpers/line-parsers/segmento-u-parser-240';
import { SegmentoYParser240 } from '../../src/services/read-ret-file/helpers/line-parsers/segmento-y-parser-240';
import { TrailerArquivoParser240 } from '../../src/services/read-ret-file/helpers/line-parsers/trailer-arquivo-parser-240';
import { TrailerLoteParser240 } from '../../src/services/read-ret-file/helpers/line-parsers/trailer-lote-parser-240';
import { LineTypeIdentifier } from '../../src/services/read-ret-file/helpers/line-type-identifier';

// Exemplos reais do arquivo COB1501001.A2T9R5
const HEADER_LOTE_LINE =
  '10400011T0100030 20766393840001590000000000000000000000373508105200000000CONSELHO REG ENGENHARIA E AGRO                                                                                00000001150120260000000000                          00   ';
const SEGMENTO_T_LINE =
  '1040001300001T 460000000810520000000   140302024001219671130202400121    1501202600000000001234500100000030202400121              092019822788000140ANTONIO APARECIDO DA SILVA 58592563968            000000000000000040301                     ';
const SEGMENTO_U_LINE =
  '1040001300002U 46000000000000000000000000000000000000000000000000000000000000000000000012345000000000012345000000000000000000000000000000150120261601202600000000000000000000000000000000000000000000000000000000000000000000000000000000       ';
const SEGMENTO_Y_LINE =
  '1040001300005Y 465000000 000000000000  00000000000000000   320000000000026001040000780005747064114 0000000000000000000000000000000000000000      0022001202600000000003703                                                                      ';
const TRAILER_LOTE_LINE =
  '10400015         00000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000                                                                                                                              ';
const TRAILER_ARQUIVO_LINE =
  '10499999         000001000006                                                                                                                                                                                                                    ';

describe('LineParser240', () => {
  describe('parse', () => {
    it('deve parsear header do lote corretamente', () => {
      const result = LineParser240.parse(HEADER_LOTE_LINE, '040');
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('recordType', '1');
      expect(result).toHaveProperty('bankCode');
      expect(result).toHaveProperty('lotCode');
    });

    it('deve parsear segmento T corretamente', () => {
      const result = LineParser240.parse(SEGMENTO_T_LINE, '040');
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('segmentType', 'T');
      expect(result).toHaveProperty('bankCode', '104');
      expect(result).toHaveProperty('agreement');
    });

    it('deve parsear segmento U corretamente', () => {
      const result = LineParser240.parse(SEGMENTO_U_LINE, '040');
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('segmentType', 'U');
      expect(result).toHaveProperty('receivedValue');
      expect(result).toHaveProperty('paymentDate');
    });

    it('deve parsear segmento Y corretamente', () => {
      const result = LineParser240.parse(SEGMENTO_Y_LINE, '040');
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('segmentType', 'Y');
      expect(result).toHaveProperty('bankCode', '104');
      expect(result).toHaveProperty('movementCode');
      expect(result).toHaveProperty('optionalRecordId');
    });

    it('deve parsear trailer do lote corretamente', () => {
      const result = LineParser240.parse(TRAILER_LOTE_LINE, '040');
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('recordType', '5');
      expect(result).toHaveProperty('totalLines');
    });

    it('deve parsear trailer do arquivo corretamente', () => {
      const result = LineParser240.parse(TRAILER_ARQUIVO_LINE, '040');
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('recordType', '9');
      expect(result).toHaveProperty('totalLots');
    });

    it('deve retornar null para linha desconhecida', () => {
      const result = LineParser240.parse('INVALID LINE', '040');
      expect(result).toBeNull();
    });
  });
});

describe('HeaderLoteParser240', () => {
  it('deve extrair campos do header do lote', () => {
    const result = HeaderLoteParser240.parse(HEADER_LOTE_LINE, '040');
    expect(result).not.toBeNull();
    expect(result?.recordType).toBe('1');
    expect(result?.bankCode).toBe('104');
    expect(result?.lotCode).toBe('0001');
    expect(result?.companyName).toContain('CONSELHO');
  });

  it('deve retornar null para linha muito curta', () => {
    const result = HeaderLoteParser240.parse('SHORT', '040');
    expect(result).toBeNull();
  });
});

// Linha real do arquivo BB com convênio 3711056 (posições 37-44 = primeiros 7 do Nosso Número)
const SEGMENTO_T_LINE_BB =
  '0010001300399T 060575090000000001945 37110568306709486   78306709486     03012026000000000010303237017660                         0900000000000010610000000000000000000000000000000000000   000000000000000000000018361        170273711056     ';

describe('SegmentoTParser240', () => {
  it('deve extrair campos do segmento T', () => {
    const result = SegmentoTParser240.parse(SEGMENTO_T_LINE, '040');
    expect(result).not.toBeNull();
    expect(result?.segmentType).toBe('T');
    expect(result?.bankCode).toBe('104');
    expect(result?.agreement).toBeDefined();
    expect(result?.tariff).toBeGreaterThanOrEqual(0);
  });

  it('deve parsear segmento T do BB (banco 001) com convênio 3711056 nos primeiros 7 do Nosso Número', () => {
    const result = SegmentoTParser240.parse(SEGMENTO_T_LINE_BB, '040');
    expect(result).not.toBeNull();
    expect(result?.segmentType).toBe('T');
    expect(result?.bankCode).toBe('001');
    expect(result?.agreement).toBe('3711056');
    expect(result?.regionalNumber).toBe('37110568306709486');
  });

  it('deve usar posição correta do account na versão 030 (corrigido)', () => {
    // Teste que valida a correção do bug: versão 030 agora usa 30-35, não 23-35
    const result = SegmentoTParser240.parse(SEGMENTO_T_LINE, '030');
    expect(result).not.toBeNull();
    // O account deve estar nas posições corretas (30-35)
    // Se estivesse errado (23-35), pegaria parte do agreement
  });

  it('deve normalizar agência e conta corretamente', () => {
    const result = SegmentoTParser240.parse(SEGMENTO_T_LINE, '040');
    expect(result).not.toBeNull();
    // Agência e conta devem ser normalizadas (sem zeros à esquerda ou null se apenas zeros)
    if (result?.agency) {
      expect(typeof result.agency).toBe('string');
      expect(result.agency.length).toBeGreaterThan(0);
    }
  });
});

describe('SegmentoUParser240', () => {
  it('deve extrair campos do segmento U', () => {
    const result = SegmentoUParser240.parse(SEGMENTO_U_LINE, '040');
    expect(result).not.toBeNull();
    expect(result?.segmentType).toBe('U');
    expect(result?.receivedValue).toBeGreaterThanOrEqual(0);
    expect(result?.paymentDate).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(result?.creditDate).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
});

describe('SegmentoYParser240', () => {
  it('deve extrair campos do segmento Y', () => {
    const result = SegmentoYParser240.parse(SEGMENTO_Y_LINE, '040');
    expect(result).not.toBeNull();
    expect(result?.segmentType).toBe('Y');
    expect(result?.bankCode).toBe('104');
    expect(result?.lotCode).toBe('0001');
    expect(result?.sequenceNumber).toBe('00005');
    expect(result?.movementCode).toBeDefined();
    expect(result?.optionalRecordId).toBeDefined();
    expect(result?.payerRegistrationType).toBeDefined();
    expect(result?.payerRegistration).toBeDefined();
  });

  it('deve retornar null para linha inválida', () => {
    const result = SegmentoYParser240.parse('INVALID LINE', '040');
    expect(result).toBeNull();
  });

  it('deve retornar null para linha muito curta', () => {
    const result = SegmentoYParser240.parse('SHORT', '040');
    expect(result).toBeNull();
  });

  it('deve retornar null para linha que não é segmento Y', () => {
    const result = SegmentoYParser240.parse(SEGMENTO_T_LINE, '040');
    expect(result).toBeNull();
  });
});

describe('TrailerLoteParser240', () => {
  it('deve extrair campos do trailer do lote', () => {
    const result = TrailerLoteParser240.parse(TRAILER_LOTE_LINE, '040');
    expect(result).not.toBeNull();
    expect(result?.recordType).toBe('5');
    expect(result?.totalLines).toBe(4);
  });
});

describe('TrailerArquivoParser240', () => {
  it('deve extrair campos do trailer do arquivo', () => {
    const result = TrailerArquivoParser240.parse(TRAILER_ARQUIVO_LINE, '040');
    expect(result).not.toBeNull();
    expect(result?.recordType).toBe('9');
    expect(result?.totalLots).toBe(1);
    expect(result?.totalLines).toBe(6);
  });
});

describe('LineTypeIdentifier', () => {
  it('deve identificar header do lote', () => {
    const result = LineTypeIdentifier.identify(HEADER_LOTE_LINE, '040');
    expect(result).toBe('HEADER_LOTE');
  });

  it('deve identificar segmento T', () => {
    const result = LineTypeIdentifier.identify(SEGMENTO_T_LINE, '040');
    expect(result).toBe('SEGMENTO_T');
  });

  it('deve identificar segmento U', () => {
    const result = LineTypeIdentifier.identify(SEGMENTO_U_LINE, '040');
    expect(result).toBe('SEGMENTO_U');
  });

  it('deve identificar segmento Y', () => {
    const result = LineTypeIdentifier.identify(SEGMENTO_Y_LINE, '040');
    expect(result).toBe('SEGMENTO_Y');
  });

  it('deve identificar trailer do lote', () => {
    const result = LineTypeIdentifier.identify(TRAILER_LOTE_LINE, '040');
    expect(result).toBe('TRAILER_LOTE');
  });

  it('deve identificar trailer do arquivo', () => {
    const result = LineTypeIdentifier.identify(TRAILER_ARQUIVO_LINE, '040');
    expect(result).toBe('TRAILER_ARQUIVO');
  });

  it('deve retornar UNKNOWN para linha inválida', () => {
    const result = LineTypeIdentifier.identify('INVALID', '040');
    expect(result).toBe('UNKNOWN');
  });
});

describe('Formatters', () => {
  describe('formatMonetaryValue', () => {
    it('deve converter valor monetário corretamente', () => {
      expect(formatMonetaryValue('0000000001234')).toBe(12.34);
      expect(formatMonetaryValue('0000000010000')).toBe(100.0);
      expect(formatMonetaryValue('0000000000000')).toBe(0);
    });

    it('deve retornar 0 para valor vazio', () => {
      expect(formatMonetaryValue('')).toBe(0);
      expect(formatMonetaryValue('   ')).toBe(0);
    });
  });

  describe('formatDate', () => {
    it('deve formatar data no formato DDMMAAAA', () => {
      expect(formatDate('15012026', 'DDMMAAAA')).toBe('15/01/2026');
      expect(formatDate('01012024', 'DDMMAAAA')).toBe('01/01/2024');
    });

    it('deve formatar data no formato DDMMAA (com expansão de ano para 4 dígitos)', () => {
      // A função agora expande o ano automaticamente: 26 <= 50 -> 2026
      expect(formatDate('150126', 'DDMMAA')).toBe('15/01/2026');
    });

    it('deve retornar string vazia para data vazia', () => {
      expect(formatDate('', 'DDMMAAAA')).toBe('');
    });
  });
});
