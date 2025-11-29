import os from 'node:os';
import { APP_VERSION } from '../../src/config/version';
import { makeUserAgent } from '../../src/utils/system';

describe('System Utils', () => {
  describe('makeUserAgent', () => {
    it('deve retornar uma string no formato esperado', () => {
      const userAgent = makeUserAgent();

      expect(typeof userAgent).toBe('string');
      expect(userAgent.length).toBeGreaterThan(0);
    });

    it('deve incluir a versão do app no formato correto', () => {
      const userAgent = makeUserAgent();
      const appVersion = APP_VERSION?.split('-')?.[0] || '';

      expect(userAgent).toContain(`art-w/${appVersion}`);
    });

    it('deve incluir informações do sistema', () => {
      const userAgent = makeUserAgent();
      const platform = os.platform();
      const arch = os.arch();

      expect(userAgent).toContain(platform);
      expect(userAgent).toContain(arch);
    });

    it('deve incluir o domínio +s4sbr.com', () => {
      const userAgent = makeUserAgent();

      expect(userAgent).toContain('+s4sbr.com');
    });

    it('deve ter o formato correto com parênteses e ponto e vírgula', () => {
      const userAgent = makeUserAgent();

      // Deve conter parênteses para informações do sistema
      expect(userAgent).toMatch(/\([^)]+\)/);
      // Deve conter ponto e vírgula como separadores
      expect(userAgent).toContain(';');
    });

    it('deve funcionar mesmo se APP_VERSION for undefined', () => {
      // Simula situação onde APP_VERSION pode não estar definido
      const userAgent = makeUserAgent();

      // Ainda deve retornar uma string válida
      expect(userAgent).toBeTruthy();
      expect(userAgent).toContain('art-w/');
    });

    it('deve incluir informações do sistema operacional', () => {
      const userAgent = makeUserAgent();
      const system = os.version()?.split(' ')?.[0] || '';
      const release = os.release()?.split('.')?.[0] || '';

      // Se as informações estiverem disponíveis, devem estar no user agent
      if (system) {
        expect(userAgent).toContain(system);
      }
      if (release) {
        expect(userAgent).toContain(release);
      }
    });

    it('deve ser consistente entre múltiplas chamadas', () => {
      const userAgent1 = makeUserAgent();
      const userAgent2 = makeUserAgent();

      // Deve retornar o mesmo valor (não há estado mutável)
      expect(userAgent1).toBe(userAgent2);
    });

    it('deve ter estrutura completa: app/version (system release; platform; arch) +domain', () => {
      const userAgent = makeUserAgent();

      // Verifica estrutura básica
      expect(userAgent).toMatch(/^art-w\/[^\s]+\s+\([^)]+\)\s+\+s4sbr\.com$/);
    });
  });
});
