/**
 * Utilitários de data para read-ret-file
 * Versão do tryDate usando date-fns, mantendo desacoplamento de outros módulos do projeto
 *
 * IMPORTANTE: Todas as datas e horas dos arquivos CNAB estão no fuso horário de Brasília (UTC-3)
 */

import { getDate, getHours, getMinutes, getMonth, getSeconds, getYear, isValid, parse, parseJSON } from 'date-fns';

type Func = typeof parseJSON;

/**
 * Helper para converter valor em array
 */
function makeArray<T = unknown>(value?: T | T[]): T[] {
  if (!value) return [] as T[];
  return !Array.isArray(value) ? [value] : value;
}

/**
 * Ajusta uma data para representar corretamente o fuso horário de Brasília (UTC-3)
 *
 * Os arquivos CNAB contêm datas e horas no fuso de Brasília, mas quando parseamos
 * strings para Date em JavaScript, elas são interpretadas como UTC ou local timezone,
 * causando diferenças de 3 horas.
 *
 * Esta função extrai os componentes da data (usando date-fns) e cria uma nova Date
 * que representa esses mesmos componentes no fuso horário de Brasília (UTC-3).
 *
 * @param date - Date object que representa uma data/hora no fuso de Brasília
 * @returns Date object ajustada para representar corretamente o horário de Brasília, ou null se inválida
 *
 * @example
 * const parsedDate = tryDate('15012024', 'ddMMyyyy');
 * const brasiliaDate = adjustToBrasiliaTimezone(parsedDate);
 */
export function adjustToBrasiliaTimezone(date: Date | null): Date | null {
  if (!date || !isValid(date)) return null;

  // Extrair componentes da data usando date-fns
  const year = getYear(date);
  const month = getMonth(date);
  const day = getDate(date);
  const hours = getHours(date);
  const minutes = getMinutes(date);
  const seconds = getSeconds(date);

  // Criar data em UTC assumindo que os componentes são no fuso de Brasília (UTC-3)
  // Se o arquivo diz "14:30 em Brasília", em UTC seria "17:30" (14:30 + 3 horas)
  const utcMs = Date.UTC(year, month, day, hours, minutes, seconds);
  const brasiliaOffsetMs = 3 * 60 * 60 * 1000; // +3 horas para compensar UTC-3

  return new Date(utcMs + brasiliaOffsetMs);
}

/**
 * Tenta parsear uma string de data em vários formatos
 * Versão do tryDate original adaptada para read-ret-file
 *
 * ATENÇÃO: Para datas de arquivos CNAB, após usar tryDate(), chame adjustToBrasiliaTimezone()
 * para corrigir o fuso horário, pois os arquivos CNAB estão no fuso de Brasília (UTC-3)
 *
 * @param str - String de data ou Date object
 * @param formats - Formatos adicionais a tentar (opcional)
 * @returns Date válida ou null se inválida
 */
export function tryDate(str: Date | string, formats: string | string[] = []): Date | null {
  if (str instanceof Date) return str;
  const supportedList = [
    parseJSON,
    ...makeArray(formats).filter(f => !!f),
    'ddMMyyyy',
    'ddMMyy',
    'dd/MM/yyyy',
    'dd/MM/yy',
    'yyyy-MM-dd HH:mm:ss',
    'dd/MM/yyyy HH:mm:ss',
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'yyyyMMdd',
  ];

  const parsing = (supported: string | Func, value: string) => {
    const v = typeof supported === 'function' ? supported(value) : parse(value, supported, new Date());
    return isValid(v) ? v : null;
  };

  const trying = (v: string) =>
    supportedList.reduce(
      (acc, supported) => {
        if (!acc) acc = parsing(supported, v) as Date;
        return acc;
      },
      null as unknown as Date,
    );
  return typeof str === 'string' ? trying(str) : (str as Date | null);
}
