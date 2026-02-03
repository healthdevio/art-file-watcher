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
 * Extrai o ano (yyyy) de uma string YYYY-MM-DD.
 */
export function getYearFromDateStr(dateStr: string): string {
  const parts = dateStr.split('-');
  return (parts[0] && parts[0].length >= 4) ? parts[0] : '';
}

/**
 * Extrai o mês (mm) de uma string YYYY-MM-DD.
 */
export function getMonthFromDateStr(dateStr: string): string {
  const parts = dateStr.split('-');
  return (parts[1] && parts[1].length >= 2) ? parts[1] : '01';
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
 * (creditDate, regional e bankCode conforme saveLogFilters).
 */
export function matchesAuditFilter(creditDate: Date | null, regional: string, bankCode?: string): boolean {
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

    let bankCodeOk = false;
    if (filter.bankCode) {
      if (bankCode === undefined || bankCode === null) {
        bankCodeOk = false;
      } else if (Array.isArray(filter.bankCode)) {
        bankCodeOk = filter.bankCode.includes(bankCode);
      } else {
        bankCodeOk = filter.bankCode === bankCode;
      }
    } else {
      bankCodeOk = true;
    }

    if (dateOk && regionalOk && bankCodeOk) return true;
  }

  return false;
}
