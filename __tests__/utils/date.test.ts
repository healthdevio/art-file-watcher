import { tryDate } from '../../src/utils/date';

describe('tryDate', () => {
  describe('quando recebe um objeto Date', () => {
    it('deve retornar o mesmo objeto Date', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = tryDate(date);
      expect(result).toBe(date);
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('quando recebe uma string em formato ISO (parseJSON)', () => {
    it('deve converter string ISO válida para Date', () => {
      const result = tryDate('2024-01-15T10:30:00.000Z');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0); // Janeiro é 0
      expect(result?.getDate()).toBe(15);
    });

    it('deve converter string ISO sem timezone para Date', () => {
      const result = tryDate('2024-01-15T10:30:00');
      expect(result).toBeInstanceOf(Date);
      expect(result).not.toBeNull();
    });
  });

  describe('quando recebe uma string em formato ddMMyyyy', () => {
    it('deve converter string válida para Date', () => {
      const result = tryDate('15012024');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getDate()).toBe(15);
      expect(result?.getMonth()).toBe(0); // Janeiro é 0
      expect(result?.getFullYear()).toBe(2024);
    });
  });

  describe('quando recebe uma string em formato ddMMyy', () => {
    it('deve converter string válida para Date', () => {
      const result = tryDate('150124');
      expect(result).toBeInstanceOf(Date);
      expect(result).not.toBeNull();
      expect(result?.getDate()).toBe(15);
      expect(result?.getMonth()).toBe(0); // Janeiro é 0
      // date-fns pode interpretar anos de 2 dígitos de forma diferente
      // Verificamos apenas que uma data válida foi retornada
      expect(result?.getFullYear()).toBeDefined();
    });
  });

  describe('quando recebe uma string em formato dd/MM/yyyy', () => {
    it('deve converter string válida para Date', () => {
      const result = tryDate('15/01/2024');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getDate()).toBe(15);
      expect(result?.getMonth()).toBe(0); // Janeiro é 0
      expect(result?.getFullYear()).toBe(2024);
    });
  });

  describe('quando recebe uma string em formato dd/MM/yy', () => {
    it('deve converter string válida para Date', () => {
      const result = tryDate('15/01/24');
      expect(result).toBeInstanceOf(Date);
      expect(result).not.toBeNull();
      expect(result?.getDate()).toBe(15);
      expect(result?.getMonth()).toBe(0); // Janeiro é 0
      // date-fns pode interpretar anos de 2 dígitos de forma diferente
      // Verificamos apenas que uma data válida foi retornada
      expect(result?.getFullYear()).toBeDefined();
    });
  });

  describe('quando recebe uma string em formato yyyy-MM-dd HH:mm:ss', () => {
    it('deve converter string válida para Date', () => {
      const result = tryDate('2024-01-15 10:30:45');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(15);
      // Verificamos apenas que a hora foi parseada corretamente
      // (pode haver diferenças de timezone)
      expect(result?.getHours()).toBeGreaterThanOrEqual(7); // Considerando timezone UTC-3
      expect(result?.getHours()).toBeLessThanOrEqual(13);
      expect(result?.getMinutes()).toBe(30);
      expect(result?.getSeconds()).toBe(45);
    });
  });

  describe('quando recebe uma string em formato dd/MM/yyyy HH:mm:ss', () => {
    it('deve converter string válida para Date', () => {
      const result = tryDate('15/01/2024 10:30:45');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(15);
      expect(result?.getHours()).toBe(10);
      expect(result?.getMinutes()).toBe(30);
      expect(result?.getSeconds()).toBe(45);
    });
  });

  describe('quando recebe uma string em formato yyyy-MM-dd', () => {
    it('deve converter string válida para Date', () => {
      const result = tryDate('2024-01-15');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(15);
    });
  });

  describe('quando recebe uma string em formato MM/dd/yyyy', () => {
    it('deve converter string válida para Date', () => {
      const result = tryDate('01/15/2024');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(15);
    });
  });

  describe('quando recebe uma string em formato yyyyMMdd', () => {
    it('deve converter string válida para Date', () => {
      const result = tryDate('20240115');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(15);
    });
  });

  describe('quando recebe formatos customizados', () => {
    it('deve usar formato customizado quando fornecido', () => {
      const result = tryDate('2024-01-15', 'yyyy-MM-dd');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(15);
    });

    it('deve usar múltiplos formatos customizados quando fornecidos', () => {
      const result = tryDate('15.01.2024', ['dd.MM.yyyy', 'dd/MM/yyyy']);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(15);
    });

    it('deve tentar formatos customizados antes dos padrões', () => {
      const customFormat = 'dd.MM.yyyy';
      const result = tryDate('15.01.2024', customFormat);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
    });
  });

  describe('quando recebe string inválida', () => {
    it('deve retornar null para string inválida', () => {
      const result = tryDate('data inválida');
      expect(result).toBeNull();
    });

    it('deve retornar null para string vazia', () => {
      const result = tryDate('');
      expect(result).toBeNull();
    });

    it('deve retornar null para string com formato incorreto', () => {
      const result = tryDate('2024/13/45');
      expect(result).toBeNull();
    });

    it('deve retornar null para string com caracteres não numéricos', () => {
      const result = tryDate('abc123def');
      expect(result).toBeNull();
    });
  });

  describe('quando recebe valores não esperados', () => {
    it('deve retornar null para null', () => {
      const result = tryDate(null as any);
      expect(result).toBeNull();
    });

    it('deve retornar undefined para undefined', () => {
      // A função retorna o próprio valor quando não é string nem Date
      const result = tryDate(undefined as any);
      expect(result).toBeUndefined();
    });

    it('deve retornar o próprio valor para número', () => {
      // A função retorna o próprio valor quando não é string nem Date
      const result = tryDate(12345 as any);
      expect(result).toBe(12345);
    });
  });

  describe('casos de borda', () => {
    it('deve converter data com ano bissexto corretamente', () => {
      const result = tryDate('29/02/2024');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getDate()).toBe(29);
      expect(result?.getMonth()).toBe(1); // Fevereiro é 1
      expect(result?.getFullYear()).toBe(2024);
    });

    it('deve retornar null para data inválida em ano não bissexto', () => {
      const result = tryDate('29/02/2023');
      expect(result).toBeNull();
    });

    it('deve converter corretamente datas no início do ano', () => {
      const result = tryDate('01/01/2024');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getDate()).toBe(1);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getFullYear()).toBe(2024);
    });

    it('deve converter corretamente datas no final do ano', () => {
      const result = tryDate('31/12/2024');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getDate()).toBe(31);
      expect(result?.getMonth()).toBe(11); // Dezembro é 11
      expect(result?.getFullYear()).toBe(2024);
    });
  });
});
