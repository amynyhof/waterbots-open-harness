/**
 * MEASUREMENT ONLY — writes nothing to public/.
 *
 * Answers one question with numbers: can WRI Aqueduct 4.0 water stress join
 * directly onto HydroBASINS Level 6, with no aggregation and no key collision?
 *
 * Checks, in order:
 *   1. Is PFAF_ID globally unique at Level 6? (Level 3 has a known collision.)
 *   2. How many distinct pfaf_id values does Aqueduct carry?
 *   3. Do the two key sets match, and how many basins would go unjoined?
 *   4. Aqueduct rows are basin x subnational admin. Is bws constant within a
 *      pfaf_id? If it is, the admin split is a duplicate and deduplication is
 *      enough — no aggregation. If it is not, area weighting is required.
 *
 *   node scripts/measure-join.mjs
 */

import { createReadStream, existsSync, readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const LEV6_ATTRS = path.join(ROOT, 'data-src', 'measure', 'lev06_attrs.csv');
const AQUEDUCT = path.join(
  ROOT,
  'legacy',
  'aqueduct-4-0-water-risk-data',
  'Aqueduct40_waterrisk_download_Y2023M07D05',
  'CVS',
  'Aqueduct40_baseline_annual_y2023m07d05.csv'
);

for (const f of [LEV6_ATTRS, AQUEDUCT]) {
  if (!existsSync(f)) {
    console.error(`Missing input: ${f}`);
    process.exit(1);
  }
}

// --- 1. HydroBASINS Level 6 keys -------------------------------------------
const lines = readFileSync(LEV6_ATTRS, 'utf8').trim().split('\n');
const header = lines[0].split(',').map((s) => s.trim());
const hIdx = header.indexOf('HYBAS_ID');
const pIdx = header.indexOf('PFAF_ID');

const pfafCounts = new Map();
const hybasSet = new Set();
for (const line of lines.slice(1)) {
  const parts = line.split(',');
  const pfaf = parts[pIdx].trim();
  hybasSet.add(parts[hIdx].trim());
  pfafCounts.set(pfaf, (pfafCounts.get(pfaf) ?? 0) + 1);
}
const basinPfaf = new Set(pfafCounts.keys());
const collisions = [...pfafCounts.entries()].filter(([, n]) => n > 1);

console.log('HydroBASINS Level 6');
console.log(`  polygons                 ${(lines.length - 1).toLocaleString()}`);
console.log(`  unique HYBAS_ID          ${hybasSet.size.toLocaleString()}`);
console.log(`  unique PFAF_ID           ${basinPfaf.size.toLocaleString()}`);
console.log(`  PFAF_ID collisions       ${collisions.length}`);
if (collisions.length) {
  for (const [code, n] of collisions.slice(0, 10)) console.log(`    ${code} appears ${n}x`);
}
const pfafLens = new Set([...basinPfaf].map((p) => p.length));
console.log(`  PFAF_ID digit lengths    ${[...pfafLens].sort().join(', ')}`);

// --- 2 & 4. Stream Aqueduct -------------------------------------------------
const aqPfaf = new Set();
const bwsByPfaf = new Map(); // pfaf_id -> Set of distinct bws_label
let rows = 0;

const rl = createInterface({ input: createReadStream(AQUEDUCT), crlfDelay: Infinity });
let aqHeader = null;
let aqPfafIdx = -1;
let aqBwsIdx = -1;

/** Aqueduct quotes fields containing commas, so a naive split is unsafe. */
function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQ = !inQ;
    } else if (c === ',' && !inQ) {
      out.push(cur);
      cur = '';
    } else cur += c;
  }
  out.push(cur);
  return out;
}

for await (const line of rl) {
  if (!line.trim()) continue;
  if (!aqHeader) {
    aqHeader = parseCsvLine(line).map((s) => s.trim());
    aqPfafIdx = aqHeader.indexOf('pfaf_id');
    aqBwsIdx = aqHeader.indexOf('bws_label');
    if (aqPfafIdx < 0 || aqBwsIdx < 0) {
      console.error('Could not find pfaf_id / bws_label columns.');
      process.exit(1);
    }
    continue;
  }
  const parts = parseCsvLine(line);
  const pfaf = (parts[aqPfafIdx] ?? '').trim();
  if (!pfaf) continue;
  rows++;
  aqPfaf.add(pfaf);
  const label = (parts[aqBwsIdx] ?? '').trim();
  if (!bwsByPfaf.has(pfaf)) bwsByPfaf.set(pfaf, new Set());
  bwsByPfaf.get(pfaf).add(label);
}

console.log('\nWRI Aqueduct 4.0 (baseline annual)');
console.log(`  data rows                ${rows.toLocaleString()}`);
console.log(`  unique pfaf_id           ${aqPfaf.size.toLocaleString()}`);
const aqLens = new Set([...aqPfaf].map((p) => p.length));
console.log(`  pfaf_id digit lengths    ${[...aqLens].sort().join(', ')}`);

// --- 3. Key set overlap -----------------------------------------------------
let matched = 0;
const unmatchedBasins = [];
for (const p of basinPfaf) {
  if (aqPfaf.has(p)) matched++;
  else unmatchedBasins.push(p);
}
const aqOrphans = [...aqPfaf].filter((p) => !basinPfaf.has(p));

console.log('\nJoin — HydroBASINS Level 6 PFAF_ID <-> Aqueduct pfaf_id');
console.log(`  basins WITH stress       ${matched.toLocaleString()} of ${basinPfaf.size.toLocaleString()}  (${((100 * matched) / basinPfaf.size).toFixed(2)}%)`);
console.log(`  basins WITHOUT stress    ${unmatchedBasins.length.toLocaleString()}`);
console.log(`  Aqueduct codes w/o basin ${aqOrphans.length.toLocaleString()}`);
if (unmatchedBasins.length) console.log(`    e.g. ${unmatchedBasins.slice(0, 8).join(', ')}`);

// --- 4. Is bws constant within a basin? ------------------------------------
let constant = 0;
let varying = 0;
const varyingExamples = [];
for (const [pfaf, labels] of bwsByPfaf) {
  if (labels.size <= 1) constant++;
  else {
    varying++;
    if (varyingExamples.length < 5) varyingExamples.push([pfaf, [...labels]]);
  }
}

console.log('\nIs bws_label constant within a pfaf_id?');
console.log(`  rows per basin (avg)     ${(rows / aqPfaf.size).toFixed(2)}`);
console.log(`  basins w/ ONE value      ${constant.toLocaleString()}`);
console.log(`  basins w/ MANY values    ${varying.toLocaleString()}`);
for (const [p, l] of varyingExamples) console.log(`    ${p}: ${l.join(' | ')}`);

console.log('\nVerdict inputs');
console.log(`  key collision at L6      ${collisions.length === 0 ? 'NO' : 'YES (' + collisions.length + ')'}`);
console.log(`  aggregation needed       ${varying === 0 ? 'NO — deduplicate only' : 'YES — ' + varying + ' basins vary by admin area'}`);
console.log(`  coverage                 ${((100 * matched) / basinPfaf.size).toFixed(2)}% of basins`);
