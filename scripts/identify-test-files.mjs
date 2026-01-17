import { readFileSync, readdirSync, renameSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Importa o FileIdentifier (precisa compilar primeiro)
const distPath = join(rootDir, 'dist/services/read-ret-file/file-identifier.js');
const fileUrl = `file:///${distPath.replace(/\\/g, '/')}`;
const { FileIdentifier } = await import(fileUrl);

const testDir = join(rootDir, 'volumes/test');

// Lê todos os arquivos que não começam com TEST_
const files = readdirSync(testDir)
  .filter(f => !f.startsWith('TEST_') && f !== 'TEST_.ret')
  .map(f => ({
    name: f,
    path: join(testDir, f),
    size: statSync(join(testDir, f)).size,
  }))
  .filter(f => f.size > 0 && statSync(f.path).isFile())
  .sort((a, b) => a.size - b.size); // Ordena por tamanho (menores primeiro)

console.log(`Encontrados ${files.length} arquivos para processar\n`);

const identified = {
  CNAB240_30: [],
  CNAB240_40: [],
  CNAB400: [],
  UNKNOWN: [],
};

// Identifica cada arquivo
for (const file of files) {
  try {
    const content = readFileSync(file.path, 'utf-8');
    const lines = content.split(/\r?\n/).filter(l => l.trim());
    
    if (lines.length < 2) {
      console.log(`⚠️  ${file.name}: Muito pequeno (menos de 2 linhas)`);
      identified.UNKNOWN.push(file);
      continue;
    }

    const type = FileIdentifier.identify(lines[0], lines[1]);
    identified[type] = identified[type] || [];
    identified[type].push({ ...file, type });
    
    console.log(`✓ ${file.name}: ${type} (${(file.size / 1024).toFixed(2)} KB)`);
  } catch (error) {
    console.error(`✗ ${file.name}: Erro ao processar - ${error.message}`);
    identified.UNKNOWN.push(file);
  }
}

console.log('\n=== Resumo ===');
console.log(`CNAB 240 v030: ${identified.CNAB240_30.length}`);
console.log(`CNAB 240 v040: ${identified.CNAB240_40.length}`);
console.log(`CNAB 400: ${identified.CNAB400.length}`);
console.log(`Desconhecidos: ${identified.UNKNOWN.length}`);

// Seleciona os menores de cada tipo para renomear (máximo 2 por tipo, priorizando os menores)
const toRename = {
  CNAB240_30: identified.CNAB240_30.slice(0, 2),
  CNAB240_40: identified.CNAB240_40.slice(0, 2),
  CNAB400: identified.CNAB400.slice(0, 2),
};

// Se não encontrou CNAB 400, procura manualmente
if (identified.CNAB400.length === 0) {
  console.log('\n⚠️  Nenhum arquivo CNAB 400 encontrado. Procurando manualmente...');
  for (const file of files.slice(0, 50)) { // Verifica os 50 menores
    try {
      const content = readFileSync(file.path, 'utf-8');
      const lines = content.split(/\r?\n/).filter(l => l.trim());
      if (lines.length >= 2 && lines[0].startsWith('02RETORNO')) {
        identified.CNAB400.push({ ...file, type: 'CNAB400' });
        toRename.CNAB400.push({ ...file, type: 'CNAB400' });
        console.log(`  ✓ Encontrado: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
        if (toRename.CNAB400.length >= 2) break;
      }
    } catch (error) {
      // Ignora erros
    }
  }
}

console.log('\n=== Arquivos selecionados para renomear ===');
for (const [type, files] of Object.entries(toRename)) {
  for (const file of files) {
    const newName = `TEST_${type}_${file.name}`;
    const newPath = join(testDir, newName);
    console.log(`  ${file.name} -> ${newName}`);
    try {
      renameSync(file.path, newPath);
      console.log(`  ✓ Renomeado com sucesso`);
    } catch (error) {
      console.error(`  ✗ Erro ao renomear: ${error.message}`);
    }
  }
}

console.log('\n✅ Processo concluído!');
