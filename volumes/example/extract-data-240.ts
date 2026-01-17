import { ExtractionPaymentData240, ExtractionTitleData240 } from '../../../dtos/workers/read-ret-file.dto';
import { formatDateToBrazilian } from '../../../utils/format-date-to-brazilian';
import { formatValue } from '../../../utils/format-value';

export function extractTitleDataCnab24040(line: string, details: ExtractionTitleData240[]) {
  const agreement = line.substring(23, 29).trim();
  const regionalNumber = line.substring(37, 56).trim();
  const regionalNumberDigit = line.substring(56, 57).trim();
  const tariff = formatValue(line.substring(198, 213).trim());
  let agency: string | null = line.substring(17, 22).trim();
  if (/^0+$/.test(agency)) agency = null;
  else agency = `${parseInt(agency)}`;

  let account: string | null = line.substring(30, 35).trim();
  if (/^0+$/.test(account)) account = null;
  else account = `${parseInt(account)}`;

  const agencyDigit = line.substring(22, 23).trim();
  const accountDigit = line.substring(35, 36).trim();

  const sequenceNumber = line.substring(8, 13).trim();

  details.push({
    sequenceNumber,
    agreement,
    regionalNumber,
    regionalNumberDigit,
    tariff,
    agency,
    agencyDigit,
    account,
    accountDigit,
  });
}

export function extractPaymentDataCnab24040(line: string, details: ExtractionPaymentData240[]) {
  const receivedValue = formatValue(line.substring(77, 92).trim());
  const paymentDate = formatDateToBrazilian(line.substring(137, 145).trim());
  const creditDate = formatDateToBrazilian(line.substring(145, 153).trim());

  details.push({
    paymentDate,
    creditDate,
    receivedValue,
  });
}

export function extractTitleDataCnab24030(line: string, details: ExtractionTitleData240[] = []) {
  const agreement = line.substring(23, 29).trim();
  const regionalNumber = line.substring(37, 56).trim();
  const regionalNumberDigit = line.substring(56, 57).trim();
  const tariff = formatValue(line.substring(198, 213).trim());

  let agency: string | null = line.substring(17, 22).trim();
  if (!agency || /^0+$/.test(agency)) agency = null;
  else agency = `${parseInt(agency)}`;

  let account: string | null = line.substring(23, 35).trim();
  if (!account || /^0+$/.test(account)) account = null;
  else account = `${parseInt(account)}`;

  const agencyDigit = line.substring(22, 23).trim();
  const accountDigit = line.substring(35, 36).trim();

  const sequenceNumber = line.substring(8, 13).trim();

  details.push({
    sequenceNumber,
    agreement,
    regionalNumber,
    regionalNumberDigit,
    tariff,
    agency,
    agencyDigit,
    account,
    accountDigit,
  });

  return {
    sequenceNumber,
    agreement,
    regionalNumber,
    regionalNumberDigit,
    tariff,
    agency,
    agencyDigit,
    account,
    accountDigit,
  };
}

export function extractPaymentDataCnab24030(line: string, details: ExtractionPaymentData240[] = []) {
  const receivedValue = formatValue(line.substring(77, 92).trim());
  const paymentDate = formatDateToBrazilian(line.substring(137, 145).trim());
  const creditDate = formatDateToBrazilian(line.substring(145, 153).trim());

  details.push({
    paymentDate,
    creditDate,
    receivedValue,
  });

  return {
    paymentDate,
    creditDate,
    receivedValue,
  };
}
