/**
 * Auditoria BB CNAB400: códigos de liquidação e divergência de split.
 * Uso: npx tsx scripts/audit-bb-codes-split.ts [--date=2026-03-13] [--month=2026-03]
 */
import { createReadStream, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { createInterface } from 'node:readline';

const INPUT = 'C:\\Users\\dell\\projects\\s4s\\mutua\\modulo-prestacao-de-art-backend\\volumes\\download\\RetornoParticao\\MARÇO';
const PE = '2810159';
const TO = '3398378';
const ACCEPTED = new Set(['05', '5', '06', '6']);
const WATCH_CODES = new Set(['07', '08', '15']);

const dateArg = process.argv.find((a) => a.startsWith('--date='))?.slice(7);
const monthArg = process.argv.find((a) => a.startsWith('--month='))?.slice(8) ?? '2026-03';

function calcPercent(value: bigint, percentage: number): bigint {
  return (value * BigInt(percentage) + 50n) / 100n;
}

function calcSplit(totalValue: bigint) {
  const valueTwentyPercent = calcPercent(totalValue, 20);
  const valueThirtyPercentOfTwentyPercent = calcPercent(valueTwentyPercent, 30);
  const valueSeventyPercentOfTwentyPercent = calcPercent(valueTwentyPercent, 70);
  return { valueTwentyPercent, valueThirtyPercentOfTwentyPercent, valueSeventyPercentOfTwentyPercent };
}

function parseCreditDate(raw: string): string {
  const t = raw.trim();
  if (!t || t.length !== 6 || !/^\d+$/.test(t)) return '';
  const y = parseInt(t.slice(4, 6), 10) > 50 ? `19${t.slice(4, 6)}` : `20${t.slice(4, 6)}`;
  return `${y}-${t.slice(2, 4)}-${t.slice(0, 2)}`;
}

function parseCents(raw: string): bigint {
  const n = parseInt(raw.trim(), 10);
  return Number.isNaN(n) ? 0n : BigInt(n);
}

function isPeTo(line: string): boolean {
  const af = line.substring(31, 38);
  const rf = line.substring(63, 80);
  return af.includes(PE) || af.includes(TO) || rf.includes(PE) || rf.includes(TO);
}

function listFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(p));
    else if (entry.isFile() && !/\.(json|log|txt)$/i.test(entry.name)) out.push(p);
  }
  return out;
}

type CodeStat = { count: number; cents: bigint; tariff: bigint };
type ScopeStats = {
  byCode: Map<string, CodeStat>;
  accepted: { count: number; cents: bigint; tariff: bigint };
  splitLine: { twenty: bigint; thirty: bigint; seventy: bigint; fareTwenty: bigint; fareThirty: bigint; fareSeventy: bigint };
};

function newScope(): ScopeStats {
  return {
    byCode: new Map(),
    accepted: { count: 0, cents: 0n, tariff: 0n },
    splitLine: { twenty: 0n, thirty: 0n, seventy: 0n, fareTwenty: 0n, fareThirty: 0n, fareSeventy: 0n },
  };
}

function addCode(map: Map<string, CodeStat>, code: string, cents: bigint, tariff: bigint) {
  const cur = map.get(code) ?? { count: 0, cents: 0n, tariff: 0n };
  cur.count++;
  cur.cents += cents;
  cur.tariff += tariff;
  map.set(code, cur);
}

function dateOk(creditDate: string): boolean {
  if (!creditDate.startsWith(monthArg)) return false;
  if (dateArg && creditDate !== dateArg) return false;
  return true;
}

async function processFile(filePath: string, allBb: ScopeStats, peTo: ScopeStats) {
  const isCbr = basename(filePath).toUpperCase().startsWith('CBR');
  const rl = createInterface({ input: createReadStream(filePath, { encoding: 'latin1' }), crlfDelay: Infinity });
  let lineNo = 0;

  for await (const line of rl) {
    if (lineNo === 0) {
      lineNo++;
      continue;
    }
    if (line.substring(0, 1) !== '7') {
      lineNo++;
      continue;
    }
    if (!isCbr) {
      lineNo++;
      continue;
    }

    const movement = line.substring(108, 110).trim() || '(vazio)';
    const creditDate = parseCreditDate(line.substring(175, 181));
    const cents = parseCents(line.substring(253, 266));
    const tariff = parseCents(line.substring(181, 188));

    if (dateOk(creditDate)) {
      addCode(allBb.byCode, movement, cents, tariff);
      if (ACCEPTED.has(movement)) {
        allBb.accepted.count++;
        allBb.accepted.cents += cents;
        allBb.accepted.tariff += tariff;
        const s = calcSplit(cents);
        const f = calcSplit(tariff);
        allBb.splitLine.twenty += s.valueTwentyPercent;
        allBb.splitLine.thirty += s.valueThirtyPercentOfTwentyPercent;
        allBb.splitLine.seventy += s.valueSeventyPercentOfTwentyPercent;
        allBb.splitLine.fareTwenty += f.valueTwentyPercent;
        allBb.splitLine.fareThirty += f.valueThirtyPercentOfTwentyPercent;
        allBb.splitLine.fareSeventy += f.valueSeventyPercentOfTwentyPercent;
      }
    }

    if (isPeTo(line) && dateOk(creditDate)) {
      addCode(peTo.byCode, movement, cents, tariff);
      if (ACCEPTED.has(movement)) {
        peTo.accepted.count++;
        peTo.accepted.cents += cents;
        peTo.accepted.tariff += tariff;
        const s = calcSplit(cents);
        const f = calcSplit(tariff);
        peTo.splitLine.twenty += s.valueTwentyPercent;
        peTo.splitLine.thirty += s.valueThirtyPercentOfTwentyPercent;
        peTo.splitLine.seventy += s.valueSeventyPercentOfTwentyPercent;
        peTo.splitLine.fareTwenty += f.valueTwentyPercent;
        peTo.splitLine.fareThirty += f.valueThirtyPercentOfTwentyPercent;
        peTo.splitLine.fareSeventy += f.valueSeventyPercentOfTwentyPercent;
      }
    }
    lineNo++;
  }
}

function fmt(c: bigint): string {
  return (Number(c) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function printCodeTable(title: string, stats: ScopeStats) {
  console.log(`\n=== ${title} ===`);
  const rows = [...stats.byCode.entries()].sort((a, b) => Number(b[1].cents - a[1].cents));
  for (const [code, v] of rows) {
    const mark = WATCH_CODES.has(code) ? ' <<<' : ACCEPTED.has(code) ? '' : ' (não aceito pelo parser)';
    console.log(`  código ${code}: ${v.count} linhas | crédito R$ ${fmt(v.cents)} | tarifa R$ ${fmt(v.tariff)}${mark}`);
  }
}

function printSplit(title: string, stats: ScopeStats) {
  const agg = stats.accepted;
  const splitAgg = calcSplit(agg.cents);
  const fareAgg = calcSplit(agg.tariff);
  const sl = stats.splitLine;

  const dTwenty = sl.twenty - splitAgg.valueTwentyPercent;
  const dThirty = sl.thirty - splitAgg.valueThirtyPercentOfTwentyPercent;
  const dSeventy = sl.seventy - splitAgg.valueSeventyPercentOfTwentyPercent;
  const dFareTwenty = sl.fareTwenty - fareAgg.valueTwentyPercent;
  const dNetTwenty = (sl.twenty - sl.fareTwenty) - (splitAgg.valueTwentyPercent - fareAgg.valueTwentyPercent);

  console.log(`\n=== Split ${title} ===`);
  console.log(`Linhas aceitas: ${agg.count} | crédito R$ ${fmt(agg.cents)} | tarifa R$ ${fmt(agg.tariff)}`);
  console.log('Crédito — soma linha a linha vs 20/6/14% sobre total agregado:');
  console.log(`  20% sede:  linha R$ ${fmt(sl.twenty)} | agregado R$ ${fmt(splitAgg.valueTwentyPercent)} | Δ R$ ${fmt(dTwenty)}`);
  console.log(`  6%  sede:  linha R$ ${fmt(sl.thirty)} | agregado R$ ${fmt(splitAgg.valueThirtyPercentOfTwentyPercent)} | Δ R$ ${fmt(dThirty)}`);
  console.log(`  14% reg:   linha R$ ${fmt(sl.seventy)} | agregado R$ ${fmt(splitAgg.valueSeventyPercentOfTwentyPercent)} | Δ R$ ${fmt(dSeventy)}`);
  console.log('Tarifa — soma linha a linha vs agregado:');
  console.log(`  20% tarifa: linha R$ ${fmt(sl.fareTwenty)} | agregado R$ ${fmt(fareAgg.valueTwentyPercent)} | Δ R$ ${fmt(dFareTwenty)}`);
  console.log(`  Líquido 20% (crédito-tarifa) linha vs agregado: Δ R$ ${fmt(dNetTwenty)}`);
}

async function main() {
  const files = listFiles(INPUT);
  const allBb = newScope();
  const peTo = newScope();

  console.log(`Pasta: ${INPUT}`);
  console.log(`Arquivos: ${files.length} | Filtro mês: ${monthArg}${dateArg ? ` | dia: ${dateArg}` : ''}`);

  for (const f of files) {
    await processFile(f, allBb, peTo);
  }

  printCodeTable('Todos convênios BB (CBR*) — códigos de liquidação', allBb);
  printCodeTable('Convênios PE+TO apenas', peTo);

  const watch = ['07', '08', '15'];
  console.log('\n=== Códigos 07, 08, 15 (todos BB) ===');
  for (const c of watch) {
    const v = allBb.byCode.get(c);
    console.log(`  ${c}: ${v ? `${v.count} linhas, R$ ${fmt(v.cents)}` : 'não encontrado'}`);
  }
  console.log('=== Códigos 07, 08, 15 (PE+TO) ===');
  for (const c of watch) {
    const v = peTo.byCode.get(c);
    console.log(`  ${c}: ${v ? `${v.count} linhas, R$ ${fmt(v.cents)}` : 'não encontrado'}`);
  }

  printSplit('todos BB aceitos', allBb);
  printSplit('PE+TO aceitos', peTo);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
