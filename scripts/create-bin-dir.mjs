import { mkdirSync } from 'fs';
import { resolve } from 'path';

mkdirSync(resolve('./bin'), { recursive: true });
