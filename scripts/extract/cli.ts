import { Command } from 'commander';
import 'dotenv/config';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEFAULT_INPUT_DIR, DEFAULT_OUTPUT_DIR } from './constants';

export type ExtractCliOptions = {
  inputDir: string;
  outputDir: string;
  useDatabase: boolean;
};

export function parseExtractCli(argv = process.argv): ExtractCliOptions {
  const program = new Command();

  program
    .name('extract')
    .description('Extrai dados de arquivos CNAB 240/400 e opcionalmente insere no PostgreSQL')
    .option('-i, --input <path>', 'Diretório de entrada (leitura recursiva)', DEFAULT_INPUT_DIR)
    .option('-o, --output <path>', 'Diretório de saída (JSON e cópias filtradas)', DEFAULT_OUTPUT_DIR)
    .option('--db', 'Inserir registros no PostgreSQL (AuditReturn)')
    .parse(argv);

  const opts = program.opts<{ input: string; output: string; db?: boolean }>();
  const inputDir = resolve(opts.input);
  const outputDir = resolve(opts.output);
  const useDatabase = Boolean(opts.db);

  if (!existsSync(inputDir)) {
    console.error(`\n✗ Erro: Diretório de entrada não encontrado: ${inputDir}`);
    process.exit(1);
  }

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  if (useDatabase && !process.env.DATABASE_URL) {
    console.error('\n✗ Erro: --db requer DATABASE_URL no arquivo .env na raiz do projeto');
    process.exit(1);
  }

  return { inputDir, outputDir, useDatabase };
}
