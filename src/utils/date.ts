/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { isValid, parse, parseJSON } from 'date-fns';
import { makeArray } from './array';

type Func = typeof parseJSON;
export function tryDate(str: Date | string, formats: string | string[] = []): Date | null {
  if (str instanceof Date) return str;
  const supportedList = [
    parseJSON,
    ...makeArray(formats).filter(f => !!f),
    'yyyy-MM-dd HH:mm:ss',
    'dd/MM/yyyy HH:mm:ss',
    'yyyy-MM-dd',
    'dd/MM/yyyy',
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
