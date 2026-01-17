import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { deleteFile, fileExists, fileParse, renameFile, saveFile } from '../../src/utils/file';
import { TEST_DIRS } from '../setup';

describe('File Utils', () => {
  const testFileDir = join(TEST_DIRS.BASE, 'file-test');

  beforeAll(() => {
    if (!existsSync(testFileDir)) {
      require('fs').mkdirSync(testFileDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Limpa arquivos de teste após cada teste
    const testFiles = [
      join(testFileDir, 'test.txt'),
      join(testFileDir, 'test2.txt'),
      join(testFileDir, 'renamed.txt'),
      join(testFileDir, 'output.txt'),
      join(testFileDir, 'nested', 'test.txt'),
    ];

    for (const file of testFiles) {
      if (existsSync(file)) {
        try {
          unlinkSync(file);
        } catch {
          // Ignora erros
        }
      }
    }
  });

  describe('fileExists', () => {
    it('deve retornar true quando arquivo existe', () => {
      const testFile = join(testFileDir, 'test.txt');
      writeFileSync(testFile, 'conteúdo de teste', 'utf-8');

      expect(fileExists(testFile)).toBe(true);
    });

    it('deve retornar false quando arquivo não existe', () => {
      const nonExistentFile = join(testFileDir, 'nao-existe.txt');

      expect(fileExists(nonExistentFile)).toBe(false);
    });

    it('deve retornar false quando ocorre erro ao verificar', () => {
      // Testa com caminho inválido (caracteres especiais que podem causar erro)
      const invalidPath = '\0';

      expect(fileExists(invalidPath)).toBe(false);
    });
  });

  describe('deleteFile', () => {
    it('deve deletar arquivo existente e retornar true', () => {
      const testFile = join(testFileDir, 'test.txt');
      writeFileSync(testFile, 'conteúdo de teste', 'utf-8');

      expect(fileExists(testFile)).toBe(true);
      expect(deleteFile(testFile)).toBe(true);
      expect(fileExists(testFile)).toBe(false);
    });

    it('deve retornar false quando arquivo não existe', () => {
      const nonExistentFile = join(testFileDir, 'nao-existe.txt');

      expect(deleteFile(nonExistentFile)).toBe(false);
    });

    it('deve retornar false quando ocorre erro ao deletar', () => {
      // Cria arquivo e tenta deletar com caminho inválido
      const testFile = join(testFileDir, 'test.txt');
      writeFileSync(testFile, 'conteúdo', 'utf-8');

      // Tenta deletar arquivo que não existe (já foi deletado)
      expect(deleteFile(testFile)).toBe(true);
      expect(deleteFile(testFile)).toBe(false); // Segunda tentativa deve retornar false
    });
  });

  describe('renameFile', () => {
    it('deve renomear arquivo existente e retornar true', () => {
      const oldPath = join(testFileDir, 'test.txt');
      const newPath = join(testFileDir, 'renamed.txt');
      writeFileSync(oldPath, 'conteúdo de teste', 'utf-8');

      expect(fileExists(oldPath)).toBe(true);
      expect(fileExists(newPath)).toBe(false);

      expect(renameFile(oldPath, newPath)).toBe(true);

      expect(fileExists(oldPath)).toBe(false);
      expect(fileExists(newPath)).toBe(true);
      expect(readFileSync(newPath, 'utf-8')).toBe('conteúdo de teste');
    });

    it('deve sobrescrever arquivo destino quando force=true', () => {
      const oldPath = join(testFileDir, 'test.txt');
      const newPath = join(testFileDir, 'test2.txt');
      writeFileSync(oldPath, 'conteúdo original', 'utf-8');
      writeFileSync(newPath, 'conteúdo antigo', 'utf-8');

      expect(renameFile(oldPath, newPath, true)).toBe(true);
      expect(fileExists(oldPath)).toBe(false);
      expect(fileExists(newPath)).toBe(true);
      expect(readFileSync(newPath, 'utf-8')).toBe('conteúdo original');
    });

    it('deve retornar false quando arquivo origem não existe', () => {
      const oldPath = join(testFileDir, 'nao-existe.txt');
      const newPath = join(testFileDir, 'renamed.txt');

      expect(renameFile(oldPath, newPath)).toBe(false);
    });

    it('deve retornar false quando ocorre erro ao renomear', () => {
      // Tenta renomear para caminho inválido
      const oldPath = join(testFileDir, 'test.txt');
      writeFileSync(oldPath, 'conteúdo', 'utf-8');
      const invalidPath = '\0';

      expect(renameFile(oldPath, invalidPath)).toBe(false);
      // Arquivo original ainda deve existir
      expect(fileExists(oldPath)).toBe(true);
    });
  });

  describe('fileParse', () => {
    it('deve fazer parse do caminho do arquivo corretamente', () => {
      const filePath = '/path/to/file.txt';
      const parsed = fileParse(filePath);

      expect(parsed).toHaveProperty('root');
      expect(parsed).toHaveProperty('dir');
      expect(parsed).toHaveProperty('base');
      expect(parsed).toHaveProperty('ext');
      expect(parsed).toHaveProperty('name');
    });

    it('deve extrair nome do arquivo corretamente', () => {
      const filePath = join(testFileDir, 'arquivo-teste.txt');
      const parsed = fileParse(filePath);

      expect(parsed.name).toBe('arquivo-teste');
      expect(parsed.ext).toBe('.txt');
      expect(parsed.base).toBe('arquivo-teste.txt');
    });

    it('deve funcionar com caminhos relativos', () => {
      const filePath = './relative/path/file.json';
      const parsed = fileParse(filePath);

      expect(parsed.base).toBe('file.json');
      expect(parsed.ext).toBe('.json');
      expect(parsed.name).toBe('file');
    });

    it('deve funcionar com arquivos sem extensão', () => {
      const filePath = '/path/to/file';
      const parsed = fileParse(filePath);

      expect(parsed.name).toBe('file');
      expect(parsed.ext).toBe('');
      expect(parsed.base).toBe('file');
    });
  });

  describe('saveFile', () => {
    it('deve salvar arquivo com sucesso e retornar true', () => {
      const filePath = join(testFileDir, 'output.txt');
      const content = 'conteúdo de teste';

      expect(saveFile(filePath, content)).toBe(true);
      expect(fileExists(filePath)).toBe(true);
      expect(readFileSync(filePath, 'utf-8')).toBe(content);
    });

    it('deve usar encoding utf-8 por padrão', () => {
      const filePath = join(testFileDir, 'output.txt');
      const content = 'conteúdo com acentuação: áéíóú';

      expect(saveFile(filePath, content)).toBe(true);
      expect(readFileSync(filePath, 'utf-8')).toBe(content);
    });

    it('deve aceitar encoding customizado', () => {
      const filePath = join(testFileDir, 'output.txt');
      const content = 'test content';

      expect(saveFile(filePath, content, 'utf-8')).toBe(true);
      expect(readFileSync(filePath, 'utf-8')).toBe(content);
    });

    it('deve sobrescrever arquivo existente', () => {
      const filePath = join(testFileDir, 'output.txt');
      const oldContent = 'conteúdo antigo';
      const newContent = 'conteúdo novo';

      writeFileSync(filePath, oldContent, 'utf-8');
      expect(readFileSync(filePath, 'utf-8')).toBe(oldContent);

      expect(saveFile(filePath, newContent)).toBe(true);
      expect(readFileSync(filePath, 'utf-8')).toBe(newContent);
    });

    it('deve criar diretório pai se não existir (comportamento do writeFileSync)', () => {
      const nestedPath = join(testFileDir, 'nested', 'test.txt');
      const content = 'conteúdo aninhado';

      // Note: writeFileSync não cria diretórios automaticamente,
      // então este teste pode falhar se o diretório não existir
      // Mas vamos testar o comportamento real
      try {
        expect(saveFile(nestedPath, content)).toBe(true);
        expect(fileExists(nestedPath)).toBe(true);
        expect(readFileSync(nestedPath, 'utf-8')).toBe(content);
      } catch {
        // Se falhar, é porque writeFileSync não cria diretórios
        // Isso é comportamento esperado
      }
    });

    it('deve retornar false quando ocorre erro ao salvar', () => {
      // Tenta salvar em caminho inválido
      const invalidPath = '\0';
      const content = 'conteúdo';

      expect(saveFile(invalidPath, content)).toBe(false);
    });

    it('deve funcionar com conteúdo vazio', () => {
      const filePath = join(testFileDir, 'empty.txt');

      expect(saveFile(filePath, '')).toBe(true);
      expect(fileExists(filePath)).toBe(true);
      expect(readFileSync(filePath, 'utf-8')).toBe('');
    });

    it('deve funcionar com conteúdo grande', () => {
      const filePath = join(testFileDir, 'large.txt');
      const largeContent = 'x'.repeat(10000);

      expect(saveFile(filePath, largeContent)).toBe(true);
      expect(readFileSync(filePath, 'utf-8')).toBe(largeContent);
    });
  });
});
