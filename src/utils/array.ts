export function makeArray<T = unknown>(value?: T | T[]): T[] {
  if (!value) return [] as T[];
  return !Array.isArray(value) ? [value] : value;
}
