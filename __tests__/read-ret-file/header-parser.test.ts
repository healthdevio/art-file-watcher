import { HeaderParser240 } from '../../src/services/read-ret-file/helpers/header-parser-240';
import { HeaderParser400 } from '../../src/services/read-ret-file/helpers/header-parser-400';
import { CNAB400_FIRST_LINE, createCNAB240FirstLine } from './test-fixtures';

describe('HeaderParser240', () => {
  describe('parse', () => {
    it('deve extrair todos os campos do header CNAB 240 corretamente', () => {
      const firstLine = createCNAB240FirstLine('030');
      const header = HeaderParser240.parse(firstLine);

      expect(header).toHaveProperty('bankCode');
      expect(header).toHaveProperty('lotCode');
      expect(header).toHaveProperty('recordType');
      expect(header).toHaveProperty('operationType');
      expect(header).toHaveProperty('serviceType');
      expect(header).toHaveProperty('entryForm');
      expect(header).toHaveProperty('layoutVersion');
      expect(header).toHaveProperty('companyRegistrationType');
      expect(header).toHaveProperty('companyRegistration');
      expect(header).toHaveProperty('companyName');
      expect(header).toHaveProperty('bankName');
      expect(header).toHaveProperty('generationDate');
      expect(header).toHaveProperty('generationTime');
      expect(header).toHaveProperty('fileSequence');
      expect(header).toHaveProperty('recordDensity');
      expect(header).toHaveProperty('reserved');
      expect(header).toHaveProperty('fileCode');
      expect(header.fileType).toBe('CNAB240');
    });

    it('deve extrair código do banco corretamente', () => {
      const firstLine = createCNAB240FirstLine('030');
      const header = HeaderParser240.parse(firstLine);
      expect(header.bankCode).toBe('104');
    });

    it('deve extrair código do arquivo corretamente (030)', () => {
      const firstLine = createCNAB240FirstLine('030');
      const header = HeaderParser240.parse(firstLine);
      expect(header.fileCode).toBe('030');
    });

    it('deve extrair código do arquivo corretamente (040)', () => {
      const firstLine = createCNAB240FirstLine('040');
      const header = HeaderParser240.parse(firstLine);
      expect(header.fileCode).toBe('040');
    });

    it('deve extrair nome da empresa corretamente', () => {
      const firstLine = createCNAB240FirstLine('030');
      const header = HeaderParser240.parse(firstLine);
      expect(header.companyName).toContain('CONSELHO');
    });

    it('deve lidar com linhas menores que o tamanho esperado', () => {
      const shortLine = '10400000';
      const header = HeaderParser240.parse(shortLine);
      expect(header).toBeDefined();
      expect(header.bankCode).toBe('104');
    });

    it('deve formatar generationDate corretamente (DD/MM/AAAA)', () => {
      const firstLine = createCNAB240FirstLine('030');
      const header = HeaderParser240.parse(firstLine);
      // A data na linha de teste é "15012026" (posição 143-151)
      // Deve ser formatada como "15/01/2026"
      expect(header.generationDate).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      expect(header.generationDate).toBe('15/01/2026');
    });
  });
});

describe('HeaderParser400', () => {
  describe('parse', () => {
    it('deve extrair todos os campos do header CNAB 400 corretamente', () => {
      const header = HeaderParser400.parse(CNAB400_FIRST_LINE);

      expect(header).toHaveProperty('recordType');
      expect(header).toHaveProperty('operationType');
      expect(header).toHaveProperty('serviceType');
      expect(header).toHaveProperty('serviceId');
      expect(header).toHaveProperty('bankCode');
      expect(header).toHaveProperty('bankName');
      expect(header).toHaveProperty('companyName');
      expect(header).toHaveProperty('companyCode');
      expect(header).toHaveProperty('generationDate');
      expect(header).toHaveProperty('reserved');
      expect(header).toHaveProperty('fileSequence');
      expect(header.fileType).toBe('CNAB400');
    });

    it('deve extrair tipo de registro corretamente', () => {
      const header = HeaderParser400.parse(CNAB400_FIRST_LINE);
      expect(header.recordType).toBe('02');
    });

    it('deve extrair tipo de serviço corretamente', () => {
      const header = HeaderParser400.parse(CNAB400_FIRST_LINE);
      expect(header.serviceType).toBe('RETORNO');
    });

    it('deve extrair código do banco corretamente', () => {
      const header = HeaderParser400.parse(CNAB400_FIRST_LINE);
      expect(header.bankCode).toBe('001');
    });

    it('deve extrair nome do banco corretamente', () => {
      const header = HeaderParser400.parse(CNAB400_FIRST_LINE);
      expect(header.bankName).toContain('BANCO DO BRASIL');
    });

    it('deve extrair nome da empresa corretamente', () => {
      const header = HeaderParser400.parse(CNAB400_FIRST_LINE);
      expect(header.companyName).toContain('MUTUA');
    });

    it('deve extrair número sequencial do arquivo corretamente', () => {
      const header = HeaderParser400.parse(CNAB400_FIRST_LINE);
      expect(header.fileSequence).toBe('000001');
    });

    it('deve lidar com linhas menores que o tamanho esperado', () => {
      const shortLine = '02RETORNO';
      const header = HeaderParser400.parse(shortLine);
      expect(header).toBeDefined();
      expect(header.recordType).toBe('02');
      expect(header.serviceType).toBe('RETORNO');
    });

    it('deve formatar generationDate corretamente (DD/MM/AAAA com ano expandido)', () => {
      const header = HeaderParser400.parse(CNAB400_FIRST_LINE);
      // A data na linha de teste é "150126" (posição 94-100)
      // Deve ser formatada como "15/01/2026" (ano expandido: 26 <= 50 -> 2026)
      expect(header.generationDate).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      expect(header.generationDate).toBe('15/01/2026');
    });
  });
});
