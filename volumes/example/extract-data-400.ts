import { ExtractionFileData } from '../../../dtos/workers/read-ret-file.dto';
import { formatDateToBrazilian } from '../../../utils/format-date-to-brazilian';
import { formatValue } from '../../../utils/format-value';

export function extractDataCnab400(line: string): ExtractionFileData {
  const agreement = line.substring(31, 38).trim();
  const receivedValue = formatValue(line.substring(253, 266).trim());
  const tariff = formatValue(line.substring(181, 188).trim());
  const creditDate = formatDateToBrazilian(line.substring(175, 181).trim());
  const paymentDate = formatDateToBrazilian(line.substring(110, 116).trim());

  const regionalNumber = line.substring(63, 80).trim();
  const regionalNumberDigit = line.substring(80, 81).trim();

  let agency: string | null = line.substring(17, 21).trim();
  if (/^0+$/.test(agency)) agency = null;
  else agency = `${parseInt(agency)}`;

  let account: string | null = line.substring(22, 30).trim();
  if (/^0+$/.test(account)) account = null;
  else account = `${parseInt(account)}`;

  const agencyDigit = line.substring(21, 22).trim();
  const accountDigit = line.substring(30, 31).trim();
  const sequenceNumber = line.substring(394, 400).trim();

  return {
    agency,
    agencyDigit,
    account,
    accountDigit,
    agreement,
    regionalNumber,
    regionalNumberDigit,
    paymentDate,
    creditDate,
    tariff,
    receivedValue,
    sequenceNumber,
  };
}
