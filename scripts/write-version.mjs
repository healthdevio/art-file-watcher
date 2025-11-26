import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const pkgPath = join(__dirname, '..', 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
const version = pkg.version ?? '0.0.0';

const outputPath = join(__dirname, '..', 'src', 'config', 'version.ts');
const content = `// Este arquivo é gerado automaticamente durante o build.
export const APP_VERSION = '${version}';
`;

writeFileSync(outputPath, content, 'utf-8');
