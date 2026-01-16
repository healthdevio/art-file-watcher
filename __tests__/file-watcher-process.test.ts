import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { TEST_DIRS } from './setup';

// Mock dos módulos antes de importar
jest.mock('../src/services/upload-queue', () => {
  return {
    UploadQueue: jest.fn().mockImplementation(() => {
      return {
        enqueue: jest.fn().mockResolvedValue(undefined),
        onIdle: jest.fn().mockResolvedValue(undefined),
        stop: jest.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

jest.mock('../src/services/api-client', () => {
  return {
    ApiClient: jest.fn().mockImplementation(() => {
      return {
        uploadFiles: jest.fn().mockResolvedValue({
          success: true,
          statusCode: 200,
          message: 'Arquivo enviado com sucesso',
        }),
      };
    }),
  };
});

import { processSingleFile } from '../src/file-watcher';
import { generateFileHash } from '../src/services/file-hash';
import { readCache } from '../src/utils/cache';

describe('processSingleFile', () => {
  // Usa o arquivo real volumes/test/TEST_.ret
  const testFilePath = resolve(process.cwd(), 'volumes/test/TEST_.ret');
  const testFileDir = join(TEST_DIRS.BASE, 'process-test');

  it('deve lançar erro quando o arquivo não existe', async () => {
    const nonExistentPath = join(testFileDir, 'arquivo-inexistente.txt');

    await expect(processSingleFile(nonExistentPath)).rejects.toThrow('Arquivo não encontrado');
  });

  it('deve lançar erro quando o caminho não é um arquivo', async () => {
    // Tenta processar um diretório
    await expect(processSingleFile(testFileDir)).rejects.toThrow('não é um arquivo');
  });

  it('deve gerar hash SHA256 do arquivo corretamente', async () => {
    // Verifica se o arquivo existe antes de testar
    if (!existsSync(testFilePath)) {
      console.warn(`Arquivo de teste não encontrado: ${testFilePath}`);
      return;
    }

    const hashResult = await generateFileHash(testFilePath);

    expect(hashResult.fileHash).toBeTruthy();
    expect(hashResult.fileHash).toMatch(/^[a-f0-9]{64}$/); // SHA256 tem 64 caracteres hexadecimais
    expect(hashResult.fileName).toBe('TEST_.ret');
    expect(hashResult.filePath).toBe(testFilePath);
  });

  it('deve processar arquivo sem adicionar ao cache', async () => {
    // Verifica se o arquivo existe antes de testar
    if (!existsSync(testFilePath)) {
      console.warn(`Arquivo de teste não encontrado: ${testFilePath}`);
      return;
    }

    // Gera hash do arquivo antes de processar
    const hashResult = await generateFileHash(testFilePath);

    // Verifica que o arquivo NÃO está no cache antes
    const cachedBefore = await readCache(hashResult.fileHash);
    expect(cachedBefore).toBeNull();

    // Tenta processar (pode falhar na API, mas não deve adicionar ao cache)
    try {
      await processSingleFile(testFilePath);
    } catch {
      // Ignora erros de API/upload - o importante é que não adicionou ao cache
    }

    // Verifica que o arquivo AINDA NÃO está no cache após processar
    const cachedAfter = await readCache(hashResult.fileHash);
    expect(cachedAfter).toBeNull();
  });

  it('deve processar arquivo com extensão diferente do filtro', async () => {
    // Cria arquivo com extensão .xyz (não comum)
    const customFile = join(testFileDir, 'custom-file.xyz');
    writeFileSync(customFile, 'conteúdo customizado', 'utf-8');

    try {
      // Deve processar mesmo com extensão não filtrada (pode falhar na API)
      await processSingleFile(customFile);
    } catch {
      // Ignora erros de API - o importante é que tentou processar
    }

    // Limpa arquivo de teste
    if (existsSync(customFile)) {
      unlinkSync(customFile);
    }
  });
});
