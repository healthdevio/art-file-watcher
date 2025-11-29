import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { ensureDirectories, ensureDirectory } from '../../src/utils/directory';

// Diretório temporário para testes
const TEST_DIR = join(__dirname, '../../.test-temp');

describe('ensureDirectory', () => {
  beforeEach(() => {
    // Limpa o diretório de teste antes de cada teste
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  afterAll(() => {
    // Limpa o diretório de teste após todos os testes
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  it('deve criar um diretório se ele não existir e createIfNotExists for true', () => {
    const dirPath = join(TEST_DIR, 'new-dir');
    const result = ensureDirectory(dirPath, true);

    expect(result.success).toBe(true);
    expect(existsSync(dirPath)).toBe(true);
    expect(result.path).toContain('new-dir');
  });

  it('deve retornar sucesso se o diretório já existir', () => {
    const dirPath = join(TEST_DIR, 'existing-dir');
    mkdirSync(dirPath, { recursive: true });

    const result = ensureDirectory(dirPath, true);

    expect(result.success).toBe(true);
    expect(result.message).toContain('existe');
  });

  it('deve retornar erro se o diretório não existir e createIfNotExists for false', () => {
    const dirPath = join(TEST_DIR, 'non-existent');
    const result = ensureDirectory(dirPath, false);

    expect(result.success).toBe(false);
    expect(result.message).toContain('não encontrado');
  });

  it('deve criar diretórios aninhados recursivamente', () => {
    const dirPath = join(TEST_DIR, 'nested', 'deep', 'directory');
    const result = ensureDirectory(dirPath, true);

    expect(result.success).toBe(true);
    expect(existsSync(dirPath)).toBe(true);
  });

  it('deve retornar caminho absoluto no resultado', () => {
    const dirPath = join(TEST_DIR, 'absolute-path');
    const result = ensureDirectory(dirPath, true);

    expect(result.path).toBeTruthy();
    expect(result.path).not.toContain('..'); // Não deve conter caminhos relativos
    // No Windows, caminho absoluto começa com letra (C:\), no Linux com /
    expect(result.path).toMatch(/^([A-Z]:|\/)/); // Verifica se é absoluto
  });
});

describe('ensureDirectories', () => {
  beforeEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  afterAll(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  it('deve criar múltiplos diretórios', () => {
    const dirs = [
      { path: join(TEST_DIR, 'dir1'), createIfNotExists: true },
      { path: join(TEST_DIR, 'dir2'), createIfNotExists: true },
      { path: join(TEST_DIR, 'dir3'), createIfNotExists: true },
    ];

    const results = ensureDirectories(dirs);

    expect(results).toHaveLength(3);
    results.forEach(result => {
      expect(result.success).toBe(true);
    });
    dirs.forEach(dir => {
      expect(existsSync(dir.path)).toBe(true);
    });
  });

  it('deve processar diretórios com configurações diferentes', () => {
    mkdirSync(join(TEST_DIR, 'existing'), { recursive: true });

    const dirs = [
      { path: join(TEST_DIR, 'existing'), createIfNotExists: false },
      { path: join(TEST_DIR, 'new'), createIfNotExists: true },
    ];

    const results = ensureDirectories(dirs);

    expect(results[0].success).toBe(true); // Existente
    expect(results[1].success).toBe(true); // Criado
  });

  it('deve usar true como padrão para createIfNotExists', () => {
    const dirPath = join(TEST_DIR, 'default-create');
    const dirs = [{ path: dirPath }]; // Sem createIfNotExists especificado

    const results = ensureDirectories(dirs);

    expect(results[0].success).toBe(true);
    expect(existsSync(dirPath)).toBe(true);
  });
});
