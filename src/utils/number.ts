export function normalizeNumber(value: unknown, defaultValue: number = 3): number {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  if (typeof value === 'number') return value;

  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) return parsed;
  }

  return defaultValue;
}
