import { promises as fs } from 'fs';
import { dirname, join } from 'path';

export interface CacheEntry {
  hash: string;
  filePath: string;
  processedAt: string;
  size: number;
  modifiedAt: number;
}

const CACHE_BASE = join(process.cwd(), 'cache');

function getCacheFilePath(hash: string): string {
  const bucket = hash.slice(0, 2) || 'xx';
  return join(CACHE_BASE, bucket, `${hash}.json`);
}

export async function readCache(hash: string): Promise<CacheEntry | null> {
  try {
    const filePath = getCacheFilePath(hash);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as CacheEntry;
  } catch {
    return null;
  }
}

export async function writeCache(entry: CacheEntry): Promise<void> {
  const filePath = getCacheFilePath(entry.hash);
  await fs.mkdir(dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(entry), 'utf-8');
}
