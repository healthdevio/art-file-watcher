#!/usr/bin/env node

/**
 * Script para criar bundle único com esbuild
 * Inclui todas as dependências para uso com pkg
 */

import { build } from 'esbuild';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔨 Criando bundle com esbuild...');

try {
  await build({
    entryPoints: [join(projectRoot, 'src', 'index.ts')],
    bundle: true, // Inclui todas as dependências
    outfile: join(projectRoot, 'dist', 'bundle.js'),
    platform: 'node',
    target: 'node18',
    format: 'cjs', // CommonJS para compatibilidade com pkg
    minify: false, // Não minificar para melhor debugging
    sourcemap: false, // Sem sourcemap para produção
    packages: 'bundle', // Força bundlear todos os pacotes npm
    external: [
      // Apenas módulos nativos do Node.js - não bundlear
      'fs',
      'path',
      'crypto',
      'os',
      'url',
      'stream',
      'util',
      'events',
      'http',
      'https',
      'child_process',
      'net',
      'tls',
      'dns',
      'zlib',
      // Chokidar será incluído no bundle (tem dependências nativas que o pkg precisa)
    ],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
    logLevel: 'info',
  });

  console.log('✅ Bundle criado com sucesso: dist/bundle.js');
} catch (error) {
  console.error('❌ Erro ao criar bundle:', error);
  process.exit(1);
}
