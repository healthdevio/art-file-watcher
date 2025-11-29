import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { ensureDirectories, ensureDirectory, validateApplicationDirectories } from '../../src/utils/directory';
import { TEST_DIRS } from '../setup';

// Usa subdiretório específico para este teste
const TEST_DIR = join(TEST_DIRS.BASE, 'directory-test');

describe('ensureDirectory', () => {
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
    expect(result.path).not.toContain('..');
    // No Windows, caminho absoluto começa com letra (C:\), no Linux com /
    expect(result.path).toMatch(/^([A-Z]:|\/)/);
  });

  it('deve tratar erros ao criar diretório e retornar resultado de erro', () => {
    // Mock mkdirSync para simular um erro
    const originalMkdirSync = require('fs').mkdirSync;
    const fs = require('fs');

    jest.spyOn(fs, 'mkdirSync').mockImplementationOnce(() => {
      throw new Error('Permission denied');
    });

    const dirPath = join(TEST_DIR, 'error-dir');
    const result = ensureDirectory(dirPath, true);

    expect(result.success).toBe(false);
    expect(result.path).toBeTruthy();
    expect(result.message).toContain('Erro ao verificar/criar diretório');
    expect(result.message).toContain('Permission denied');

    jest.restoreAllMocks();
  });

  it('deve incluir o caminho no resultado mesmo em caso de erro', () => {
    const dirPath = join(TEST_DIR, 'error-test');
    const result = ensureDirectory(dirPath, false);

    expect(result.path).toBeTruthy();
    expect(result.success).toBe(false);
  });

  it('deve tratar erros não-Error e retornar mensagem genérica', () => {
    // Mock mkdirSync para simular um erro que não é uma instância de Error
    const fs = require('fs');

    jest.spyOn(fs, 'mkdirSync').mockImplementationOnce(() => {
      throw 'String error'; // Erro que não é uma instância de Error
    });

    const dirPath = join(TEST_DIR, 'non-error-throw');
    const result = ensureDirectory(dirPath, true);

    expect(result.success).toBe(false);
    expect(result.path).toBeTruthy();
    expect(result.message).toContain('Erro desconhecido');

    jest.restoreAllMocks();
  });
});

describe('ensureDirectories', () => {
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
    const existingDir = join(TEST_DIR, 'existing');
    mkdirSync(existingDir, { recursive: true });

    const dirs = [
      { path: existingDir, createIfNotExists: false },
      { path: join(TEST_DIR, 'new'), createIfNotExists: true },
    ];

    const results = ensureDirectories(dirs);

    expect(results[0].success).toBe(true);
    expect(results[1].success).toBe(true);
  });

  it('deve usar true como padrão para createIfNotExists', () => {
    const dirPath = join(TEST_DIR, 'default-create');
    const dirs = [{ path: dirPath }];

    const results = ensureDirectories(dirs);

    expect(results[0].success).toBe(true);
    expect(existsSync(dirPath)).toBe(true);
  });
});

describe('validateApplicationDirectories', () => {
  beforeEach(() => {
    // Limpa diretórios de teste antes de cada teste
    const watchDir = join(TEST_DIR, 'watch');
    const logDir = join(TEST_DIR, 'logs');
    const cacheDir = join(TEST_DIR, 'cache');

    [watchDir, logDir, cacheDir].forEach(dir => {
      if (existsSync(dir)) {
        rmSync(dir, { recursive: true, force: true });
      }
    });
  });

  it('deve retornar true quando todos os diretórios estão válidos', () => {
    const watchDir = join(TEST_DIR, 'watch');
    const logDir = join(TEST_DIR, 'logs');

    // Cria o diretório watch (deve existir)
    mkdirSync(watchDir, { recursive: true });

    const result = validateApplicationDirectories(watchDir, logDir);

    expect(result).toBe(true);
    expect(existsSync(logDir)).toBe(true); // Log dir deve ser criado
  });

  it('deve retornar false quando o diretório watch não existe', () => {
    const watchDir = join(TEST_DIR, 'non-existent-watch');
    const logDir = join(TEST_DIR, 'logs');

    const result = validateApplicationDirectories(watchDir, logDir);

    expect(result).toBe(false);
  });

  it('deve criar o diretório de cache quando fornecido', () => {
    const watchDir = join(TEST_DIR, 'watch');
    const logDir = join(TEST_DIR, 'logs');
    const cacheDir = join(TEST_DIR, 'cache');

    // Cria o diretório watch (deve existir)
    mkdirSync(watchDir, { recursive: true });

    const result = validateApplicationDirectories(watchDir, logDir, cacheDir);

    expect(result).toBe(true);
    expect(existsSync(cacheDir)).toBe(true);
  });

  it('deve validar todos os diretórios incluindo cache', () => {
    const watchDir = join(TEST_DIR, 'watch-with-cache');
    const logDir = join(TEST_DIR, 'logs-with-cache');
    const cacheDir = join(TEST_DIR, 'cache-validated');

    mkdirSync(watchDir, { recursive: true });

    const result = validateApplicationDirectories(watchDir, logDir, cacheDir);

    expect(result).toBe(true);
    expect(existsSync(logDir)).toBe(true);
    expect(existsSync(cacheDir)).toBe(true);
  });

  it('deve funcionar sem diretório de cache', () => {
    const watchDir = join(TEST_DIR, 'watch-no-cache');
    const logDir = join(TEST_DIR, 'logs-no-cache');

    mkdirSync(watchDir, { recursive: true });

    const result = validateApplicationDirectories(watchDir, logDir);

    expect(result).toBe(true);
    expect(existsSync(logDir)).toBe(true);
  });
});
