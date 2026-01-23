/**
 * Filtros de auditoria (saveLogFilters) e helpers de data.
 */

import { saveLogFilters } from './constants';

/**
 * Converte uma Date para string no formato YYYY-MM-DD.
 */
export function formatDateForFilter(date: Date | null): string | null {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Extrai o dia (dd) de uma string YYYY-MM-DD.
 */
export function getDayFromDateStr(dateStr: string): string {
  const parts = dateStr.split('-');
  return (parts[2] && parts[2].length >= 2) ? parts[2] : '01';
}

/**
 * Verifica se um registro atende aos filtros de auditoria
 * (creditDate e regional conforme saveLogFilters).
 */
export function matchesAuditFilter(creditDate: Date | null, regional: string): boolean {
  if (!creditDate) return false;

  const dateStr = formatDateForFilter(creditDate);
  if (!dateStr) return false;

  for (const filter of saveLogFilters) {
    let dateOk = false;
    if (filter.creditDate) {
      if (Array.isArray(filter.creditDate)) {
        dateOk = filter.creditDate.includes(dateStr);
      } else {
        dateOk = filter.creditDate === dateStr;
      }
    } else {
      dateOk = true;
    }

    let regionalOk = false;
    if (filter.regional) {
      if (Array.isArray(filter.regional)) {
        regionalOk = filter.regional.includes(regional);
      } else {
        regionalOk = filter.regional === regional;
      }
    } else {
      regionalOk = true;
    }

    if (dateOk && regionalOk) return true;
  }

  return false;
}
