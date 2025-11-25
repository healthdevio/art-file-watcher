import { parse } from 'dotenv';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { ensureDirectory } from '../utils/directory';

export interface ConfigCommandOptions {
  watchDir?: string;
  logDir?: string;
  apiEndpoint?: string;
  apiKey?: string;
  configFilePath?: string;
}

const envKeys = ['WATCH_DIR', 'API_ENDPOINT', 'API_KEY', 'LOG_DIR'] as const;

function loadExistingConfig(configFile: string): Record<string, string> {
  if (!existsSync(configFile)) {
    return {};
  }

  const raw = readFileSync(configFile, { encoding: 'utf-8' });
  return parse(raw);
}

export function writeConfig(options: ConfigCommandOptions): string {
  const configFile = resolve(options.configFilePath ?? '.env');
  const existingConfig = loadExistingConfig(configFile);

  const mergedConfig: Record<string, string | undefined> = { ...existingConfig };

  if (options.watchDir) mergedConfig.WATCH_DIR = options.watchDir;
  if (options.logDir) mergedConfig.LOG_DIR = options.logDir;
  if (options.apiEndpoint) mergedConfig.API_ENDPOINT = options.apiEndpoint;
  if (options.apiKey) mergedConfig.API_KEY = options.apiKey;

  const missingKeys = envKeys.filter(key => !mergedConfig[key]);
  if (!existsSync(configFile) && missingKeys.length > 0) {
    throw new Error(`Faltam as variáveis ${missingKeys.join(', ')}. Forneça-as agora (ex: --watch-dir /path).`);
  }

  ensureDirectory(mergedConfig.WATCH_DIR ?? '');
  ensureDirectory(mergedConfig.LOG_DIR ?? '');

  const content = envKeys
    .map(key => `${key}=${mergedConfig[key] ?? ''}`)
    .join('\n')
    .concat('\n');

  writeFileSync(configFile, content, { encoding: 'utf-8' });
  return configFile;
}
