import { parse } from 'dotenv';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { ensureDirectory } from '../utils/directory';

export interface ConfigCommandOptions {
  watchDir?: string;
  logDir?: string;
  apiEndpoint?: string;
  apiKey?: string;
  extensions?: string;
  cacheDir?: string;
  configFilePath?: string;
}

const requiredKeys = ['WATCH_DIR', 'API_ENDPOINT', 'API_KEY', 'LOG_DIR'] as const;
const envKeys = [...requiredKeys, 'FILE_EXTENSION_FILTER', 'CACHE_DIR'] as const;

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
  if (options.cacheDir !== undefined) mergedConfig.CACHE_DIR = options.cacheDir;

  if (options.extensions !== undefined) {
    mergedConfig.FILE_EXTENSION_FILTER = options.extensions
      .split(',')
      .map(ext => ext.trim())
      .filter(Boolean)
      .join(',');
  }

  const missingKeys = requiredKeys.filter(key => !mergedConfig[key]);
  if (!existsSync(configFile) && missingKeys.length > 0) {
    throw new Error(`Faltam as variáveis ${missingKeys.join(', ')}. Forneça-as agora (ex: --watch-dir /path).`);
  }

  if (mergedConfig.WATCH_DIR) {
    ensureDirectory(mergedConfig.WATCH_DIR);
  }
  if (mergedConfig.LOG_DIR) {
    ensureDirectory(mergedConfig.LOG_DIR);
  }
  if (mergedConfig.CACHE_DIR) {
    ensureDirectory(mergedConfig.CACHE_DIR);
  }

  const content = envKeys
    .map(key => `${key}=${mergedConfig[key] ?? ''}`)
    .join('\n')
    .concat('\n');

  writeFileSync(configFile, content, { encoding: 'utf-8' });
  return configFile;
}
