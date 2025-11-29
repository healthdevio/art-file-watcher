import { Command } from 'commander';
import { ConfigCommandOptions, writeConfig } from './commands/config';
import { runFileWatcher } from './file-watcher';
import { safeLogger } from './utils/logger';

const program = new Command();

program.name('file-watcher').description('Monitor de arquivos com hashes SHA256').version('1.0.0');

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
  .action(() => {
    runFileWatcher().catch(error => {
      console.error(error instanceof Error ? error.message : 'Erro inesperado ao iniciar');
      process.exit(1);
    });
  });

// Sempre usa o commander para processar argumentos
// O comando 'start' é o padrão (isDefault: true), então executará automaticamente
program.parse(process.argv);
