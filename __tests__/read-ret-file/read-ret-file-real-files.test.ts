import { readFileSync } from 'fs';
import { join } from 'path';
import { ReadRetFileService } from '../../src/services/read-ret-file';
import { CNABType } from '../../src/services/read-ret-file/types';

describe('ReadRetFileService - Arquivos Reais', () => {
  const testDir = join(__dirname, '../../volumes/test');
  const readService = new ReadRetFileService();

  describe('CNAB 240 v030', () => {
    const testFiles = [
      'TEST_CNAB240_30_IEDCBR23581501202620802.ret',
      'TEST_CNAB240_30_IEDCBR56111501202620802.ret',
    ];

    testFiles.forEach(fileName => {
      it(`deve ler arquivo ${fileName} corretamente`, async () => {
        const filePath = join(testDir, fileName);
        const result = await readService.read(filePath);

        expect(result.success).toBe(true);
        expect(result.cnabType).toBe<CNABType>('CNAB240_30');
        expect(result.data).toBeDefined();
        expect(result.data?.header).toBeDefined();
        expect(result.data?.lines).toBeDefined();
        expect(Array.isArray(result.data?.lines)).toBe(true);
        expect(result.metadata?.lineCount).toBeGreaterThan(0);
        expect(result.metadata?.fileSize).toBeGreaterThan(0);
      });

      it(`deve ter header válido em ${fileName}`, async () => {
        const filePath = join(testDir, fileName);
        const result = await readService.read(filePath);

        expect(result.success).toBe(true);
        if (result.data && 'header' in result.data) {
          const header = result.data.header;
          expect(header.bankCode).toBeDefined();
          if ('fileCode' in header) {
            expect(header.fileCode).toBe('030');
          }
          expect(header.generationDate).toBeDefined();
        }
      });

      it(`deve parsear linhas corretamente em ${fileName}`, async () => {
        const filePath = join(testDir, fileName);
        const result = await readService.read(filePath);

        expect(result.success).toBe(true);
        if (result.data && 'lines' in result.data) {
          const lines = result.data.lines;
          expect(lines.length).toBeGreaterThan(0);
          
          // Verifica que pelo menos algumas linhas têm payload
          const linesWithPayload = lines.filter(l => l.payload !== null);
          expect(linesWithPayload.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('CNAB 240 v040', () => {
    const testFiles = [
      'TEST_CNAB240_40_COB1501001.A2T9R5',
      'TEST_CNAB240_40_COB1501004.A2T9R5',
      'TEST_CNAB240_40_COB1501005.A2T9R5',
      'TEST_CNAB240_40_COB1501006.A2T9R5',
      'TEST_CNAB240_40_COB1501008.A2T9R5',
      'TEST_CNAB240_40_COB1501009.A2T9R5',
      'TEST_CNAB240_40_COB160126003A3Y8U4.ret', // Arquivo que contém segmento Y
    ];

    testFiles.forEach(fileName => {
      it(`deve ler arquivo ${fileName} corretamente`, async () => {
        const filePath = join(testDir, fileName);
        const result = await readService.read(filePath);

        expect(result.success).toBe(true);
        expect(result.cnabType).toBe<CNABType>('CNAB240_40');
        expect(result.data).toBeDefined();
        expect(result.data?.header).toBeDefined();
        expect(result.data?.lines).toBeDefined();
        expect(Array.isArray(result.data?.lines)).toBe(true);
        expect(result.metadata?.lineCount).toBeGreaterThan(0);
        expect(result.metadata?.fileSize).toBeGreaterThan(0);
      });

      it(`deve ter header válido em ${fileName}`, async () => {
        const filePath = join(testDir, fileName);
        const result = await readService.read(filePath);

        expect(result.success).toBe(true);
        if (result.data && 'header' in result.data) {
          const header = result.data.header;
          expect(header.bankCode).toBeDefined();
          if ('fileCode' in header) {
            expect(header.fileCode).toBe('040');
          }
          expect(header.generationDate).toBeDefined();
        }
      });

      it(`deve parsear linhas corretamente em ${fileName}`, async () => {
        const filePath = join(testDir, fileName);
        const result = await readService.read(filePath);

        expect(result.success).toBe(true);
        if (result.data && 'lines' in result.data) {
          const lines = result.data.lines;
          expect(lines.length).toBeGreaterThan(0);
          
          // Verifica que pelo menos algumas linhas têm payload
          const linesWithPayload = lines.filter(l => l.payload !== null);
          expect(linesWithPayload.length).toBeGreaterThan(0);
        }
      });

      // Teste específico para arquivo com segmento Y
      if (fileName === 'TEST_CNAB240_40_COB160126003A3Y8U4.ret') {
        it(`deve parsear segmentos Y em ${fileName}`, async () => {
          const filePath = join(testDir, fileName);
          const result = await readService.read(filePath);

          expect(result.success).toBe(true);
          if (result.data && 'lines' in result.data) {
            const lines = result.data.lines;
            // Verifica que há pelo menos uma linha do tipo segmento Y
            const segmentoYLines = lines.filter(
              l => l.payload && 'segmentType' in l.payload && l.payload.segmentType === 'Y'
            );
            expect(segmentoYLines.length).toBeGreaterThan(0);
            
            // Verifica que os campos do segmento Y estão presentes
            const firstSegmentoY = segmentoYLines[0]?.payload;
            if (firstSegmentoY && 'segmentType' in firstSegmentoY) {
              expect(firstSegmentoY).toHaveProperty('segmentType', 'Y');
              expect(firstSegmentoY).toHaveProperty('bankCode');
              expect(firstSegmentoY).toHaveProperty('movementCode');
              expect(firstSegmentoY).toHaveProperty('optionalRecordId');
            }
          }
        });
      }
    });
  });

  describe('CNAB 400', () => {
    const testFiles = ['TEST_CNAB400_CBR64356101501202620011.ret'].filter(f => {
      try {
        const filePath = join(testDir, f);
        readFileSync(filePath);
        return true;
      } catch {
        return false;
      }
    });

    if (testFiles.length === 0) {
      it.skip('nenhum arquivo CNAB 400 de teste disponível', () => {});
      return;
    }

    testFiles.forEach(fileName => {
      it(`deve ler arquivo ${fileName} corretamente`, async () => {
        const filePath = join(testDir, fileName);
        const result = await readService.read(filePath);

        expect(result.success).toBe(true);
        expect(result.cnabType).toBe<CNABType>('CNAB400');
        expect(result.data).toBeDefined();
        expect(result.data?.header).toBeDefined();
        expect(result.data?.lines).toBeDefined();
        expect(Array.isArray(result.data?.lines)).toBe(true);
        expect(result.metadata?.lineCount).toBeGreaterThan(0);
        expect(result.metadata?.fileSize).toBeGreaterThan(0);
      });

      it(`deve ter header válido em ${fileName}`, async () => {
        const filePath = join(testDir, fileName);
        const result = await readService.read(filePath);

        expect(result.success).toBe(true);
        if (result.data && 'header' in result.data) {
          const header = result.data.header;
          expect(header.bankCode).toBeDefined();
          expect(header.bankName).toBeDefined();
          expect(header.generationDate).toBeDefined();
        }
      });

      it(`deve parsear linhas corretamente em ${fileName}`, async () => {
        const filePath = join(testDir, fileName);
        const result = await readService.read(filePath);

        expect(result.success).toBe(true);
        if (result.data && 'lines' in result.data) {
          const lines = result.data.lines;
          expect(lines.length).toBeGreaterThan(0);
          
          // Verifica que pelo menos algumas linhas têm payload
          const linesWithPayload = lines.filter(l => l.payload !== null);
          expect(linesWithPayload.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Leitura de Buffer e Stream', () => {
    it('deve ler arquivo a partir de Buffer', async () => {
      const filePath = join(testDir, 'TEST_CNAB240_40_COB1501001.A2T9R5');
      const buffer = readFileSync(filePath);
      const result = await readService.read(buffer);

      expect(result.success).toBe(true);
      expect(result.cnabType).toBe<CNABType>('CNAB240_40');
      expect(result.data).toBeDefined();
    });

    it('deve ler arquivo a partir de Stream', async () => {
      const { createReadStream } = await import('fs');
      const filePath = join(testDir, 'TEST_CNAB240_40_COB1501001.A2T9R5');
      const stream = createReadStream(filePath);
      const result = await readService.read(stream);

      expect(result.success).toBe(true);
      expect(result.cnabType).toBe<CNABType>('CNAB240_40');
      expect(result.data).toBeDefined();
    });
  });

  describe('Tratamento de erros', () => {
    it('deve retornar erro para arquivo inexistente', async () => {
      const result = await readService.read('arquivo-inexistente.ret');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.cnabType).toBe('UNKNOWN');
    });

    it('deve retornar UNKNOWN para arquivo inválido', async () => {
      // Cria um arquivo temporário com conteúdo inválido
      const { writeFileSync, unlinkSync } = await import('fs');
      const { join } = await import('path');
      const tempFile = join(__dirname, '../../volumes/.test-temp/invalid.ret');
      writeFileSync(tempFile, 'conteudo invalido\nlinha 2', { flag: 'w' });

      try {
        const result = await readService.read(tempFile);
        // ReadRetFileService retorna success=true mesmo para arquivos inválidos,
        // mas com cnabType='UNKNOWN' e sem data
        expect(result.success).toBe(true);
        expect(result.cnabType).toBe('UNKNOWN');
        expect(result.data).toBeUndefined();
      } finally {
        unlinkSync(tempFile);
      }
    });
  });
});
