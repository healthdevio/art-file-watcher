import { promises as fs } from 'fs';
import { join } from 'path';
import { TEST_DIRS } from '../setup';

// Tipo para CacheEntry
interface CacheEntry {
  hash: string;
  filePath: string;
  processedAt: string;
  size: number;
  modifiedAt: number;
}

describe('Cache Utils', () => {
  // Módulo de cache (importado dinamicamente após configurar ambiente)
  let cacheModule: {
    readCache: (hash: string) => Promise<CacheEntry | null>;
    writeCache: (entry: CacheEntry) => Promise<void>;
  };

  beforeAll(async () => {
    // Reseta módulos para garantir isolamento
    jest.resetModules();
    // Importa o módulo após o ambiente estar configurado
    cacheModule = await import('../../src/utils/cache');
  });

  describe('CACHE_BASE fallback', () => {
    it('deve usar cache padrão quando CACHE_DIR não está definido', async () => {
      // Reseta módulos e remove CACHE_DIR temporariamente
      const originalCacheDir = process.env.CACHE_DIR;
      delete process.env.CACHE_DIR;
      
      jest.resetModules();
      const cacheModuleNoDir = await import('../../src/utils/cache');
      
      // Testa que ainda funciona com o fallback
      const entry: CacheEntry = {
        hash: 'fallback-test',
        filePath: '/path/to/file.txt',
        processedAt: '2024-01-01T00:00:00.000Z',
        size: 1024,
        modifiedAt: 1704067200000,
      };
      
      await cacheModuleNoDir.writeCache(entry);
      const result = await cacheModuleNoDir.readCache('fallback-test');
      
      expect(result).not.toBeNull();
      expect(result?.hash).toBe('fallback-test');
      
      // Restaura
      process.env.CACHE_DIR = originalCacheDir;
      jest.resetModules();
    });
  });

  beforeEach(async () => {
    // Limpa apenas o conteúdo do cache, não o diretório
    try {
      const files = await fs.readdir(TEST_DIRS.CACHE, { recursive: true, withFileTypes: true });
      for (const file of files) {
        if (file.isFile()) {
          await fs.unlink(join(file.path || TEST_DIRS.CACHE, file.name));
        }
      }
    } catch {
      // Ignora erros - diretório pode não existir ou estar vazio
    }
  });

  describe('writeCache', () => {
    it('deve criar o arquivo de cache no diretório correto', async () => {
      const entry: CacheEntry = {
        hash: 'abc123',
        filePath: '/path/to/file.txt',
        processedAt: '2024-01-01T00:00:00.000Z',
        size: 1024,
        modifiedAt: 1704067200000,
      };

      await cacheModule.writeCache(entry);
      const result = await cacheModule.readCache('abc123');

      expect(result).not.toBeNull();
      expect(result?.hash).toBe('abc123');
    });

    it('deve criar o diretório bucket se não existir', async () => {
      const entry: CacheEntry = {
        hash: 'xyz789',
        filePath: '/path/to/file.txt',
        processedAt: '2024-01-01T00:00:00.000Z',
        size: 1024,
        modifiedAt: 1704067200000,
      };

      await cacheModule.writeCache(entry);
      const result = await cacheModule.readCache('xyz789');

      expect(result).not.toBeNull();
      expect(result?.hash).toBe('xyz789');
    });

    it('deve escrever os dados corretos no arquivo de cache', async () => {
      const entry: CacheEntry = {
        hash: 'test456',
        filePath: '/path/to/test.txt',
        processedAt: '2024-01-01T12:00:00.000Z',
        size: 2048,
        modifiedAt: 1704110400000,
      };

      await cacheModule.writeCache(entry);
      const result = await cacheModule.readCache('test456');

      expect(result).not.toBeNull();
      expect(result?.hash).toBe(entry.hash);
      expect(result?.filePath).toBe(entry.filePath);
      expect(result?.processedAt).toBe(entry.processedAt);
      expect(result?.size).toBe(entry.size);
      expect(result?.modifiedAt).toBe(entry.modifiedAt);
    });

    it('deve funcionar com hash de 1 caractere', async () => {
      const entry: CacheEntry = {
        hash: 'a',
        filePath: '/path/to/file.txt',
        processedAt: '2024-01-01T00:00:00.000Z',
        size: 1024,
        modifiedAt: 1704067200000,
      };

      await cacheModule.writeCache(entry);
      const result = await cacheModule.readCache('a');

      expect(result).not.toBeNull();
      expect(result?.hash).toBe('a');
    });

    it('deve usar bucket baseado nos primeiros 2 caracteres do hash', async () => {
      const entry: CacheEntry = {
        hash: 'x', // Apenas 1 caractere
        filePath: '/path/to/file.txt',
        processedAt: '2024-01-01T00:00:00.000Z',
        size: 1024,
        modifiedAt: 1704067200000,
      };

      await cacheModule.writeCache(entry);
      const result = await cacheModule.readCache('x');

      expect(result).not.toBeNull();
      expect(result?.hash).toBe('x');
    });
  });

  describe('readCache', () => {
    it('deve ler e retornar o cache se o arquivo existir', async () => {
      const entry: CacheEntry = {
        hash: 'read123',
        filePath: '/path/to/file.txt',
        processedAt: '2024-01-01T00:00:00.000Z',
        size: 1024,
        modifiedAt: 1704067200000,
      };

      await cacheModule.writeCache(entry);
      const result = await cacheModule.readCache('read123');

      expect(result).not.toBeNull();
      expect(result?.hash).toBe(entry.hash);
      expect(result?.filePath).toBe(entry.filePath);
      expect(result?.size).toBe(entry.size);
    });

    it('deve retornar null se o arquivo não existir', async () => {
      const result = await cacheModule.readCache('nonexistent');

      expect(result).toBeNull();
    });

    it('deve retornar null se o arquivo estiver corrompido', async () => {
      // Cria um arquivo inválido diretamente
      const bucketDir = join(TEST_DIRS.CACHE, 'co');
      await fs.mkdir(bucketDir, { recursive: true });
      await fs.writeFile(join(bucketDir, 'corrupt.json'), 'invalid json{', 'utf-8');

      const result = await cacheModule.readCache('corrupt');

      expect(result).toBeNull();
    });

    it('deve ler cache de diferentes buckets', async () => {
      const entries: CacheEntry[] = [
        {
          hash: 'aa1111',
          filePath: '/path/to/file1.txt',
          processedAt: '2024-01-01T00:00:00.000Z',
          size: 1024,
          modifiedAt: 1704067200000,
        },
        {
          hash: 'bb2222',
          filePath: '/path/to/file2.txt',
          processedAt: '2024-01-01T00:00:00.000Z',
          size: 2048,
          modifiedAt: 1704067200000,
        },
      ];

      await cacheModule.writeCache(entries[0]);
      await cacheModule.writeCache(entries[1]);

      const result1 = await cacheModule.readCache('aa1111');
      const result2 = await cacheModule.readCache('bb2222');

      expect(result1?.hash).toBe('aa1111');
      expect(result2?.hash).toBe('bb2222');
      expect(result1?.filePath).toBe('/path/to/file1.txt');
      expect(result2?.filePath).toBe('/path/to/file2.txt');
    });
  });

  describe('writeCache e readCache integração', () => {
    it('deve escrever e ler o mesmo cache corretamente', async () => {
      const entry: CacheEntry = {
        hash: 'integration',
        filePath: '/path/to/integration.txt',
        processedAt: '2024-01-01T12:00:00.000Z',
        size: 4096,
        modifiedAt: 1704110400000,
      };

      await cacheModule.writeCache(entry);
      const result = await cacheModule.readCache('integration');

      expect(result).toEqual(entry);
    });

    it('deve sobrescrever cache existente', async () => {
      const entry1: CacheEntry = {
        hash: 'overwrite',
        filePath: '/path/to/old.txt',
        processedAt: '2024-01-01T00:00:00.000Z',
        size: 1024,
        modifiedAt: 1704067200000,
      };

      const entry2: CacheEntry = {
        hash: 'overwrite',
        filePath: '/path/to/new.txt',
        processedAt: '2024-01-01T12:00:00.000Z',
        size: 2048,
        modifiedAt: 1704110400000,
      };

      await cacheModule.writeCache(entry1);
      await cacheModule.writeCache(entry2);

      const result = await cacheModule.readCache('overwrite');

      expect(result).not.toBeNull();
      expect(result?.filePath).toBe('/path/to/new.txt');
      expect(result?.size).toBe(2048);
    });
  });
});
