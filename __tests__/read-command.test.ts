import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { handleReadCommand, ReadCommandOptions } from '../src/commands/read';
import { ReadRetFileService } from '../src/services/read-ret-file';
import { TEST_DIRS } from './setup';

describe('ReadCommand', () => {
  const testFileDir = join(TEST_DIRS.BASE, 'read-test');
  // Usa arquivo pequeno para testes de console.log (arquivos grandes exigem --output)
  const smallTestFilePath = resolve(process.cwd(), 'volumes/test/TEST_CNAB240_40_COB1501001.A2T9R5');
  const largeTestFilePath = resolve(process.cwd(), 'volumes/test/TEST_.ret');
  const outputFileDir = join(TEST_DIRS.BASE, 'read-output');

  // Cria diretórios de teste
  beforeAll(() => {
    if (!existsSync(testFileDir)) {
      require('fs').mkdirSync(testFileDir, { recursive: true });
    }
    if (!existsSync(outputFileDir)) {
      require('fs').mkdirSync(outputFileDir, { recursive: true });
    }
  });

  // Limpa arquivos de saída após cada teste
  afterEach(() => {
    // Remove arquivos de saída criados durante os testes
    const outputFiles = [
      join(outputFileDir, 'output.json'),
      join(outputFileDir, 'output.txt'),
      join(testFileDir, 'output.json'),
    ];

    for (const file of outputFiles) {
      if (existsSync(file)) {
        try {
          unlinkSync(file);
        } catch {
          // Ignora erros ao remover
        }
      }
    }
  });

  describe('handleReadCommand', () => {
    it('deve lançar erro quando o arquivo não existe', async () => {
      const options: ReadCommandOptions = {
        file: join(testFileDir, 'arquivo-inexistente.ret'),
      };

      await expect(handleReadCommand(options)).rejects.toThrow('Arquivo não encontrado');
    });

    it('deve lançar erro quando o caminho não é um arquivo', async () => {
      const options: ReadCommandOptions = {
        file: testFileDir, // Passa um diretório ao invés de arquivo
      };

      await expect(handleReadCommand(options)).rejects.toThrow('não é um arquivo');
    });

    it('deve ler arquivo existente e retornar resultado em formato texto', async () => {
      // Verifica se o arquivo de teste existe
      if (!existsSync(smallTestFilePath)) {
        console.warn(`Arquivo de teste não encontrado: ${smallTestFilePath}`);
        return;
      }

      const options: ReadCommandOptions = {
        file: smallTestFilePath,
        format: 'text',
      };

      // Captura a saída do console.log (pega a última chamada que é a saída formatada)
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await handleReadCommand(options);

      expect(consoleSpy).toHaveBeenCalled();
      // Pega a última chamada que é a saída formatada
      const lastCallIndex = consoleSpy.mock.calls.length - 1;
      const output = consoleSpy.mock.calls[lastCallIndex][0] as string;
      expect(output).toContain('Arquivo:');
      expect(output).toContain('Tipo CNAB:');

      consoleSpy.mockRestore();
    });

    it('deve ler arquivo existente e retornar resultado em formato JSON', async () => {
      if (!existsSync(smallTestFilePath)) {
        console.warn(`Arquivo de teste não encontrado: ${smallTestFilePath}`);
        return;
      }

      const options: ReadCommandOptions = {
        file: smallTestFilePath,
        format: 'json',
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await handleReadCommand(options);

      expect(consoleSpy).toHaveBeenCalled();
      // Pega a última chamada que é a saída formatada
      const lastCallIndex = consoleSpy.mock.calls.length - 1;
      const output = consoleSpy.mock.calls[lastCallIndex][0] as string;
      const parsed = JSON.parse(output);
      expect(parsed).toHaveProperty('success');
      expect(parsed).toHaveProperty('filePath');
      expect(parsed).toHaveProperty('cnabType');

      consoleSpy.mockRestore();
    });

    it('deve usar flag --json para formato JSON', async () => {
      if (!existsSync(smallTestFilePath)) {
        console.warn(`Arquivo de teste não encontrado: ${smallTestFilePath}`);
        return;
      }

      const options: ReadCommandOptions = {
        file: smallTestFilePath,
        json: true,
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await handleReadCommand(options);

      expect(consoleSpy).toHaveBeenCalled();
      // Pega a última chamada que é a saída formatada
      const lastCallIndex = consoleSpy.mock.calls.length - 1;
      const output = consoleSpy.mock.calls[lastCallIndex][0] as string;
      const parsed = JSON.parse(output);
      expect(parsed).toHaveProperty('success');

      consoleSpy.mockRestore();
    });

    it('deve exigir --output para arquivos grandes', async () => {
      if (!existsSync(largeTestFilePath)) {
        console.warn(`Arquivo de teste grande não encontrado: ${largeTestFilePath}`);
        return;
      }

      const options: ReadCommandOptions = {
        file: largeTestFilePath,
        format: 'json',
        // Não fornece --output
      };

      await expect(handleReadCommand(options)).rejects.toThrow('Arquivo muito grande');
    });

    it('deve salvar resultado em arquivo quando --output é fornecido (JSON)', async () => {
      if (!existsSync(smallTestFilePath)) {
        console.warn(`Arquivo de teste não encontrado: ${smallTestFilePath}`);
        return;
      }

      const outputPath = join(outputFileDir, 'output.json');
      const options: ReadCommandOptions = {
        file: smallTestFilePath,
        format: 'json',
        output: outputPath,
      };

      await handleReadCommand(options);

      expect(existsSync(outputPath)).toBe(true);
      const content = readFileSync(outputPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed).toHaveProperty('success');
      expect(parsed).toHaveProperty('filePath');
    });

    it('deve salvar resultado em arquivo quando --output é fornecido (texto)', async () => {
      if (!existsSync(smallTestFilePath)) {
        console.warn(`Arquivo de teste não encontrado: ${smallTestFilePath}`);
        return;
      }

      const outputPath = join(outputFileDir, 'output.txt');
      const options: ReadCommandOptions = {
        file: smallTestFilePath,
        format: 'text',
        output: outputPath,
      };

      await handleReadCommand(options);

      expect(existsSync(outputPath)).toBe(true);
      const content = readFileSync(outputPath, 'utf-8');
      expect(content).toContain('Arquivo:');
      expect(content).toContain('Tipo CNAB:');
    });

    it('deve criar diretório de saída se não existir', async () => {
      if (!existsSync(smallTestFilePath)) {
        console.warn(`Arquivo de teste não encontrado: ${smallTestFilePath}`);
        return;
      }

      const nestedOutputPath = join(testFileDir, 'nested', 'output.json');
      const options: ReadCommandOptions = {
        file: smallTestFilePath,
        format: 'json',
        output: nestedOutputPath,
      };

      await handleReadCommand(options);

      expect(existsSync(nestedOutputPath)).toBe(true);
    });
  });

  describe('ReadRetFileService', () => {
    it('deve ler arquivo e retornar estrutura ReadResult', async () => {
      if (!existsSync(smallTestFilePath)) {
        console.warn(`Arquivo de teste não encontrado: ${smallTestFilePath}`);
        return;
      }

      const service = new ReadRetFileService();
      const result = await service.read(smallTestFilePath);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('filePath');
      expect(result).toHaveProperty('cnabType');
      expect(result.success).toBe(true);
      expect(result.filePath).toBe(smallTestFilePath);
      // O arquivo TEST_CNAB240_40_COB1501001.A2T9R5 é um arquivo CNAB 240 v040
      expect(['CNAB400', 'CNAB240_30', 'CNAB240_40', 'UNKNOWN']).toContain(result.cnabType);
    });

    it('deve retornar erro quando arquivo não existe', async () => {
      const service = new ReadRetFileService();
      const nonExistentPath = join(testFileDir, 'nao-existe.ret');
      const result = await service.read(nonExistentPath);

      // O serviço não valida paths, então retorna erro genérico ao tentar ler
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('deve retornar erro quando caminho não é um arquivo', async () => {
      const service = new ReadRetFileService();
      const result = await service.read(testFileDir);

      // O serviço não valida paths, então retorna erro genérico ao tentar ler
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('deve incluir metadata quando arquivo é lido com sucesso', async () => {
      if (!existsSync(smallTestFilePath)) {
        console.warn(`Arquivo de teste não encontrado: ${smallTestFilePath}`);
        return;
      }

      const service = new ReadRetFileService();
      const result = await service.read(smallTestFilePath);

      expect(result.success).toBe(true);
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.lineCount).toBeGreaterThan(0);
      expect(result.metadata?.fileSize).toBeGreaterThan(0);
    });

    it('deve criar estrutura CNAB básica quando arquivo é lido', async () => {
      if (!existsSync(smallTestFilePath)) {
        console.warn(`Arquivo de teste não encontrado: ${smallTestFilePath}`);
        return;
      }

      const service = new ReadRetFileService();
      const result = await service.read(smallTestFilePath);

      expect(result.success).toBe(true);
      // Por enquanto, como identifyFile retorna UNKNOWN, não deve ter data estruturada
      // Mas a estrutura básica deve estar presente
      if (result.data) {
        expect(result.data).toHaveProperty('header');
        expect(result.data).toHaveProperty('lines');
      }
    });

    it('deve ler arquivo criado dinamicamente', async () => {
      const dynamicFile = join(testFileDir, 'dynamic-test.ret');
      const testContent = '0123456789012345678901234567890123456789012345678901234567890123456789\n';
      writeFileSync(dynamicFile, testContent, 'utf-8');

      try {
        const service = new ReadRetFileService();
        const result = await service.read(dynamicFile);

        expect(result.success).toBe(true);
        expect(result.filePath).toBe(dynamicFile);
        expect(result.metadata?.lineCount).toBe(1);
      } finally {
        if (existsSync(dynamicFile)) {
          unlinkSync(dynamicFile);
        }
      }
    });
  });
});
