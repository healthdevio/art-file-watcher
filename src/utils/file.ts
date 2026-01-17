import { existsSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { parse } from 'node:path';

export function fileExists(filePath: string) {
  try {
    return !!existsSync(filePath);
  } catch (_err) {
    return false;
  }
}

export function deleteFile(filePath: string) {
  try {
    if (fileExists(filePath)) {
      unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (_err) {
    return false;
  }
}

export function renameFile(oldPath: string, newPath: string, force?: boolean) {
  try {
    if (force && fileExists(newPath)) {
      unlinkSync(newPath);
    }
    renameSync(oldPath, newPath);
    return true;
  } catch {
    return false;
  }
}

export function fileParse(filePath: string) {
  return parse(filePath);
}

export function saveFile(path: string, data: string, encoding?: BufferEncoding | null): boolean {
  try {
    writeFileSync(path, data, { encoding: encoding ?? 'utf-8' });
    return true;
  } catch {
    return false;
  }
}
