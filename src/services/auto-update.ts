import { execSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, renameSync, unlinkSync } from 'node:fs';
import os from 'node:os';
import { basename, dirname, join } from 'node:path';
import { getLogger } from '../utils/logger';
import { schedule, type ScheduledTask } from '../utils/promises';

const FIRST_CHECK_DELAY = 5 * 60 * 1000; // 5 minutos
const headerInit: HeadersInit = {
  'User-Agent': 'art-file-watcher-auto-update',
};

/** Informações sobre uma release do GitHub */
interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
    size: number;
  }>;
}

/** Configuração do AutoUpdate */
export interface AutoUpdateConfig {
  enabled: boolean;
  checkIntervalHours: number;
  repository: string; // formato: owner/repo (ex: healthdevio/art-file-watcher)
  currentVersion: string;
  serviceName?: string; // Nome do serviço systemd/Windows Service (opcional)
}

/**
 * Serviço de auto-update que verifica e atualiza a aplicação automaticamente
 */
export class AutoUpdate {
  private readonly logger = getLogger();
  private readonly config: AutoUpdateConfig;
  private checkTask: ScheduledTask | null = null;
  private isUpdating = false;
  private readonly executablePath: string;
  private readonly executableName: string;
  private readonly isLinux: boolean;
  private readonly isWindows: boolean;

  constructor(config: AutoUpdateConfig) {
    this.config = config;
    this.executablePath = process.execPath; // Caminho do executável atual
    this.executableName = basename(this.executablePath);
    this.isLinux = os.platform() === 'linux';
    this.isWindows = os.platform() === 'win32';

    if (config.enabled) {
      this.logger.info(`Auto-update habilitado. Verificando a cada ${config.checkIntervalHours}h por novas versões`);
      this.start();
    } else {
      this.logger.debug('Auto-update desabilitado');
    }
  }

  /** Inicia o serviço de auto-update */
  start(): void {
    if (!this.config.enabled || this.checkTask) return;
    schedule(() => this.checkAndScheduleNext(), FIRST_CHECK_DELAY);
  }

  /** Verifica atualizações e agenda a próxima verificação */
  private checkAndScheduleNext(): void {
    if (!this.config.enabled || this.isUpdating) return;
    if (this.checkTask) this.checkTask.cancel();

    // Executa a verificação
    this.checkForUpdates()
      .then(() => this.scheduleNextCheck())
      .catch(error => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger.error(`Erro na verificação de atualizações: ${errorMessage}`);
        this.scheduleNextCheck();
      });
  }

  /**
   * Agenda a próxima verificação
   */
  private scheduleNextCheck(): void {
    if (!this.config.enabled || this.isUpdating) return;
    const intervalMs = this.config.checkIntervalHours * 60 * 60 * 1000;
    this.checkTask = schedule(() => this.checkAndScheduleNext(), intervalMs);
  }

  /**
   * Para o serviço de auto-update
   */
  stop(): void {
    if (this.checkTask) {
      this.checkTask.cancel();
      this.checkTask = null;
    }
  }

  /**
   * Verifica se há uma nova versão disponível
   */
  private async checkForUpdates(): Promise<void> {
    if (this.isUpdating) {
      this.logger.debug('Atualização já em andamento, ignorando verificação');
      return;
    }

    try {
      this.logger.debug('Verificando por novas versões...');

      const latestRelease = await this.fetchLatestRelease();
      if (!latestRelease) {
        this.logger.debug('Não foi possível obter informações da última release');
        return;
      }

      const latestVersion = this.extractVersion(latestRelease.tag_name);
      const currentVersion = this.extractVersion(this.config.currentVersion);

      this.logger.debug(`Versão atual: ${currentVersion}, Versão mais recente: ${latestVersion}`);

      if (this.isNewerVersion(latestVersion, currentVersion)) {
        this.logger.info(`Nova versão disponível: ${latestVersion} (atual: ${currentVersion})`);
        await this.performUpdate(latestRelease);
      } else {
        this.logger.debug('Aplicação está atualizada');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erro ao verificar atualizações: ${errorMessage}`);
    }
  }

  /**
   * Busca a última release do GitHub
   */
  private async fetchLatestRelease(): Promise<GitHubRelease | null> {
    try {
      const apiUrl = `https://api.github.com/repos/${this.config.repository}/releases/latest`;
      const response = await fetch(apiUrl, {
        headers: { ...headerInit, Accept: 'application/vnd.github.v3+json' },
      });

      if (!response?.ok) {
        if (response?.status === 404) {
          this.logger.debug('Nenhuma release encontrada no repositório');
          return null;
        }
        throw new Error(`GitHub API retornou status ${response?.status}`);
      }

      const release = (await response?.json()) as GitHubRelease;
      return release;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Falha ao buscar release: ${errorMessage}`);
    }
  }

  /**
   * Extrai o número da versão de uma tag (ex: "v1.0.3" -> "1.0.3")
   */
  private extractVersion(tag: string): string {
    return tag.replace(/^v/, '');
  }

  /** Compara se uma versão é mais nova que outra */
  private isNewerVersion(newVersion: string, currentVersion: string): boolean {
    const newParts = newVersion.split('.').map(Number);
    const currentParts = currentVersion.split('.').map(Number);

    // Garante que ambos têm 3 partes (major.minor.patch)
    while (newParts.length < 3) newParts.push(0);
    while (currentParts.length < 3) currentParts.push(0);

    for (let i = 0; i < 3; i++) {
      const newPart = newParts[i] ?? 0;
      const currentPart = currentParts[i] ?? 0;
      if (newPart > currentPart) return true;
      if (newPart < currentPart) return false;
    }

    return false; // Versões são iguais
  }

  /** Executa a atualização */
  private async performUpdate(release: GitHubRelease): Promise<void> {
    if (this.isUpdating) {
      return;
    }

    this.isUpdating = true;
    this.logger.info(`Iniciando atualização para versão ${release.tag_name}...`);

    try {
      // 1. Encontrar o asset correto para a plataforma
      const asset = this.findAssetForPlatform(release.assets);
      if (!asset) throw new Error('Binário não encontrado para esta plataforma');

      this.logger.info(`Baixando binário: ${asset.name} (${(asset.size / 1024 / 1024).toFixed(2)} MB)`);

      // 2. Baixar o novo binário
      const tempBinaryPath = await this.downloadBinary(asset.browser_download_url);

      // 3. Validar o binário baixado
      if (!existsSync(tempBinaryPath)) throw new Error('Falha ao baixar binário');

      this.logger.info('Binário baixado com sucesso');

      // 4. Substituir o binário atual
      await this.replaceBinary(tempBinaryPath);

      // 5. Reiniciar o serviço/aplicação
      await this.restartApplication();

      this.logger.info(`Atualização concluída com sucesso para versão ${release.tag_name}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erro durante a atualização: ${errorMessage}`);
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Encontra o asset correto para a plataforma atual
   */
  private findAssetForPlatform(assets: GitHubRelease['assets']): GitHubRelease['assets'][0] | null {
    const platformAssetName = this.isWindows ? 'art-w.exe' : 'art-w';

    for (const asset of assets) {
      if (asset.name === platformAssetName) return asset;
    }

    return null;
  }

  /**
   * Baixa o binário da URL fornecida
   */
  private async downloadBinary(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: { ...headerInit },
      });

      if (!response.ok) {
        throw new Error(`Falha ao baixar binário: HTTP ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Salva em um arquivo temporário no mesmo diretório do executável
      const execDir = dirname(this.executablePath);
      const tempName = this.isWindows ? 'art-w.new.exe' : 'art-w.new';
      const tempPath = join(execDir, tempName);

      // Escreve o arquivo
      const { writeFileSync } = await import('node:fs');
      writeFileSync(tempPath, buffer, { mode: 0o755 });

      // Define permissões de execução no Linux
      if (this.isLinux) {
        try {
          chmodSync(tempPath, 0o755);
        } catch {
          // Ignora erro de permissão se não for possível
        }
      }

      return tempPath;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Erro ao baixar binário: ${errorMessage}`);
    }
  }

  /**
   * Substitui o binário atual pelo novo
   */
  private async replaceBinary(newBinaryPath: string): Promise<void> {
    try {
      const execDir = dirname(this.executablePath);
      const backupName = this.isWindows ? 'art-w.backup.exe' : 'art-w.backup';
      const backupPath = join(execDir, backupName);

      this.logger.info('Fazendo backup do binário atual...');

      // Faz backup do binário atual
      if (existsSync(this.executablePath)) {
        copyFileSync(this.executablePath, backupPath);
      }

      // No Windows, precisamos usar rename em duas etapas
      if (this.isWindows) {
        // Tenta deletar o arquivo atual (pode falhar se estiver em uso)
        try {
          unlinkSync(this.executablePath);
        } catch {
          // Se falhar, renomeia para .old
          const oldPath = join(execDir, 'art-w.old.exe');
          if (existsSync(oldPath)) {
            unlinkSync(oldPath);
          }
          renameSync(this.executablePath, oldPath);
        }
      }

      // Move o novo binário para o local correto
      renameSync(newBinaryPath, this.executablePath);

      // Define permissões de execução no Linux
      if (this.isLinux) {
        try {
          chmodSync(this.executablePath, 0o755);
        } catch {
          // Ignora erro de permissão
        }
      }

      this.logger.info('Binário substituído com sucesso');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Erro ao substituir binário: ${errorMessage}`);
    }
  }

  /**
   * Reinicia a aplicação (funciona mesmo como serviço)
   */
  private async restartApplication(): Promise<void> {
    this.logger.info('Reiniciando aplicação...');

    try {
      // Se está rodando como serviço, usa systemctl ou sc
      if (this.config.serviceName) {
        if (this.isLinux) {
          // Linux systemd
          try {
            execSync(`systemctl restart ${this.config.serviceName}`, {
              stdio: 'ignore',
              timeout: 10000,
            });
            this.logger.info(`Serviço ${this.config.serviceName} reiniciado via systemctl`);
            return;
          } catch {
            // Se falhar, tenta como usuário comum ou continua para método alternativo
          }
        } else if (this.isWindows) {
          // Windows Service
          try {
            execSync(`sc stop ${this.config.serviceName}`, {
              stdio: 'ignore',
              timeout: 10000,
              shell: 'cmd.exe',
            });
            // Aguarda um pouco antes de iniciar
            await new Promise(resolve => setTimeout(resolve, 2000));
            execSync(`sc start ${this.config.serviceName}`, {
              stdio: 'ignore',
              timeout: 10000,
              shell: 'cmd.exe',
            });
            this.logger.info(`Serviço ${this.config.serviceName} reiniciado via sc`);
            return;
          } catch {
            // Se falhar, continua para método alternativo
          }
        }
      }

      // Método alternativo: usa um script de reinicialização
      // No Linux, pode usar um script wrapper
      // No Windows, pode usar um script batch
      this.logger.info('Reiniciando aplicação usando método alternativo...');

      // Para método alternativo, precisamos sair e deixar um supervisor reiniciar
      // Ou usar um script auxiliar de reinicialização
      this.logger.warn('Reinicialização automática pode não funcionar. Por favor, reinicie manualmente o serviço.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Erro ao reiniciar aplicação: ${errorMessage}`);
      this.logger.warn(
        'A atualização foi concluída, mas é necessário reiniciar manualmente o serviço para aplicar as mudanças.',
      );
    }
  }
}
