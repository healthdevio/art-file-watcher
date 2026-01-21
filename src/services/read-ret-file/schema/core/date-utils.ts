/**
 * Utilitários de data para read-ret-file
 * Versão do tryDate usando date-fns, mantendo desacoplamento de outros módulos do projeto
 */

import { isValid, parse, parseJSON } from 'date-fns';

type Func = typeof parseJSON;

/**
 * Helper para converter valor em array
 */
function makeArray<T = unknown>(value?: T | T[]): T[] {
  if (!value) return [] as T[];
  return !Array.isArray(value) ? [value] : value;
}

/**
 * Tenta parsear uma string de data em vários formatos
 * Versão do tryDate original adaptada para read-ret-file
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
