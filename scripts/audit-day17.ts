import { createReadStream, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';

const INPUT = 'C:\\Users\\dell\\projects\\s4s\\mutua\\modulo-prestacao-de-art-backend\\volumes\\download\\RetornoParticao\\MARÇO';
const PE = '2810159';
const TO = '3398378';
const TARGET = '2026-03-17';
const ACCEPTED = new Set(['05', '5', '06', '6']);

function parseCreditDate(raw: string): string {
  const t = raw.trim();
  if (!t || t.length !== 6) return '';
  const y = parseInt(t.slice(4, 6), 10) > 50 ? `19${t.slice(4, 6)}` : `20${t.slice(4, 6)}`;
  return `${y}-${t.slice(2, 4)}-${t.slice(0, 2)}`;
}

function isAgreement(line: string, code: string): boolean {
  return line.substring(31, 38).includes(code) || line.substring(63, 80).includes(code);
}

function listFiles(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(p));
    else if (e.isFile() && !/\.(json|log|txt)$/i.test(e.name)) out.push(p);
  }
  return out;
}

async function analyze(agreement: string) {
  let gross = 0n;
  let credit20line = 0n;
  let count = 0;
  const codes = new Map<string, { n: number; c: bigint }>();

  for (const file of listFiles(INPUT)) {
    const rl = createInterface({ input: createReadStream(file, { encoding: 'latin1' }), crlfDelay: Infinity });
    for await (const line of rl) {
      if (line.substring(0, 1) !== '7' || !isAgreement(line, agreement)) continue;
      const d = parseCreditDate(line.substring(175, 181));
      if (d !== TARGET) continue;
      const mov = line.substring(108, 110).trim() || '(vazio)';
      const cents = BigInt(parseInt(line.substring(253, 266).trim(), 10) || 0);
      const cur = codes.get(mov) ?? { n: 0, c: 0n };
      cur.n++;
      cur.c += cents;
      codes.set(mov, cur);
      if (!ACCEPTED.has(mov)) continue;
      count++;
      gross += cents;
      credit20line += (cents * 20n) / 100n; // SQL Server truncates same as integer? actually *0.2 cast bigint
    }
  }

  // SQL Server: CAST(total_value * 0.2 AS BIGINT) - multiply as numeric then truncate
  let credit20sql = 0n;
  for (const file of listFiles(INPUT)) {
    const rl = createInterface({ input: createReadStream(file, { encoding: 'latin1' }), crlfDelay: Infinity });
    for await (const line of rl) {
      if (line.substring(0, 1) !== '7' || !isAgreement(line, agreement)) continue;
      if (parseCreditDate(line.substring(175, 181)) !== TARGET) continue;
      const mov = line.substring(108, 110).trim();
      if (!ACCEPTED.has(mov)) continue;
      const cents = BigInt(parseInt(line.substring(253, 266).trim(), 10) || 0);
      credit20sql += BigInt(Math.trunc(Number(cents) * 0.2));
    }
  }

  const fmt = (c: bigint) => (Number(c) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const agg20 = BigInt(Math.trunc(Number(gross) * 0.2));
  console.log(`\n=== ${agreement} ${TARGET} ===`);
  console.log(`Linhas aceitas: ${count}`);
  console.log(`Bruto 100%: R$ ${fmt(gross)}`);
  console.log(`20% SQL (trunc linha): R$ ${fmt(credit20sql)}`);
  console.log(`20% agregado (trunc): R$ ${fmt(agg20)}`);
  for (const [k, v] of [...codes.entries()].sort()) console.log(`  código ${k}: ${v.n} linhas, R$ ${fmt(v.c)}`);
}

async function main() {
  await analyze(PE);
  await analyze(TO);
  console.log('\n--- Referência print banco PE ---');
  console.log('Banco col1: R$ 15.761,90 | Sistema col6: R$ 15.740,23 | Δ: R$ 21,67');
  console.log('Base 100% banco: R$ 78.723,59 | 20% teórico: R$ 15.744,72');
}

main();
