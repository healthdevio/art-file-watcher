import { Command } from 'commander';
import { ConfigCommandOptions, writeConfig } from './commands/config';
import { handleReadCommand, ReadCommandOptions } from './commands/read';
import { APP_VERSION } from './config/version';
import { safeLogger } from './utils/logger';

const program = new Command();

program
  .name('art-file-watcher')
  .description('Monitor de arquivos com hashes SHA256')
  .version(APP_VERSION ?? '0.0.0');

program
  .command('config')
  .description('Gera ou atualiza o arquivo .env com as variáveis necessárias')
  .option('--watch-dir <path>', 'Diretório a ser monitorado')
  .option('--log-dir <path>', 'Diretório onde os logs serão gravados')
  .option('--api-endpoint <url>', 'Endpoint que receberá os hashes')
  .option('--api-key <key>', 'Chave de autenticação da API')
  .option('--extensions <list>', 'Filtro de extensões separados por vírgula (ex: .ret,.txt)')
  .option('--cache-dir <path>', 'Diretório para cache de arquivos processados')
  .option('--queue-concurrency <number>', 'Número de uploads simultâneos (padrão: 3)', '3')
  .option('--config-file <path>', 'Caminho do arquivo de configuração', '.env')
  .action((options: ConfigCommandOptions) => {
    try {
      const created = writeConfig(options);
      const logger = safeLogger();
      logger.info(`Arquivo de configuração salvo em ${created}`);
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Erro ao gerar configuração');
      process.exit(1);
    }
  });

program
  .command('start', { isDefault: true })
  .description('Inicia o monitoramento de arquivos')
  .action(async () => {
    // Importação dinâmica para evitar validação de environment antes do comando config
    const { runFileWatcher } = await import('./file-watcher');
    runFileWatcher().catch(error => {
      console.error(error instanceof Error ? error.message : 'Erro inesperado ao iniciar');
      process.exit(1);
    });
  });

/**
 * Processa um arquivo específico
 * @example `art-w process --file ./volumes/test/TEST_.RET`
 */
program
  .command('process')
  .description('Processa um arquivo específico')
  .requiredOption('--file <path>', 'Caminho do arquivo a ser processado')
  .action(async (options: { file: string }) => {
    try {
      // Importação dinâmica para evitar validação de environment antes do comando config
      const { processSingleFile } = await import('./file-watcher');
      await processSingleFile(options.file);
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : 'Erro ao processar arquivo');
      process.exit(1);
    }
  });

/**
 * Lê um arquivo de retorno bancário (CNAB)
 * @example `art-w read --file path/to/file.ret`
 * @example `art-w read --file path/to/file.ret --format json --output result.json`
 * @example `npm run dev -- read --file volumes/test/TEST_.ret --json`
 */
program
  .command('read')
  .description('Lê um arquivo de retorno bancário (CNAB)')
  .requiredOption('--file <path>', 'Caminho do arquivo de retorno a ser lido')
  .option('--format <type>', 'Formato de saída: json ou text (padrão: text)', 'text')
  .option('--json', 'Formato de saída JSON (equivalente a --format json)')
  .option('--output <path>', 'Caminho do arquivo de saída (opcional, se não fornecido exibe no console)')
  .action(async (options: ReadCommandOptions) => {
    try {
      await handleReadCommand(options);
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : 'Erro ao ler arquivo');
      process.exit(1);
    }
  });

// Sempre usa o commander para processar argumentos
// O comando 'start' é o padrão (isDefault: true), então executará automaticamente
program.parse(process.argv);
