/**
 * Confirms the water-stress lookup before anything renders it.
 *
 * Reads the built artifacts only — it does not consult the Aqueduct source,
 * so it re-derives coverage independently of the script that produced the
 * file rather than trusting the builder's own report.
 *
 * This is a build gate, not a test suite. It exits non-zero on any failure.
 *
 *   node scripts/check-stress.mjs
 */

import { readFileSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const STRESS = path.join(ROOT, 'public', 'water_stress.json');
const BASINS = path.join(ROOT, 'public', 'hydrobasins_lev06.json');

/** Every basin must resolve to one of these. An unknown key is a failure. */
const EXPECTED_CATEGORIES = [
  'low',
  'low-medium',
  'medium-high',
  'high',
  'extremely-high',
  'arid',
  'nodata',
];

/**
 * PFAF_ID is unique only within a regional tile. One Arctic/Siberia overlap
 * puts two Level 6 polygons on code 353020, so they necessarily share a
 * stress value. Recorded rather than silently absorbed.
 */
const KNOWN_SHARED_KEYS = ['353020'];

const failures = [];
const notes = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
  return ok;
};

for (const [what, f] of [
  ['water_stress.json', STRESS],
  ['hydrobasins_lev06.json', BASINS],
]) {
  if (!existsSync(f)) {
    console.error(`Missing ${what}. Run the build scripts first.`);
    process.exit(1);
  }
}

const doc = JSON.parse(readFileSync(STRESS, 'utf8'));
const geo = JSON.parse(readFileSync(BASINS, 'utf8'));
const bytes = statSync(STRESS).size;

console.log('Water stress — build check\n');
console.log(`  file                     public/water_stress.json`);
console.log(`  size                     ${bytes.toLocaleString()} bytes (${(bytes / 1024).toFixed(0)} KB)`);
console.log(`  dataset                  ${doc.source?.dataset ?? 'MISSING'}`);
console.log(`  licence                  ${doc.source?.licence ?? 'MISSING'}`);

/* The licence and citation travel with the data. If they are ever dropped the
   product cannot meet its attribution obligation. */
check(!!doc.source?.dataset, 'source.dataset is missing');
check(doc.source?.licence === 'CC-BY 4.0', 'source.licence is not CC-BY 4.0');
check(!!doc.source?.citation && doc.source.citation.includes('Kuzma'), 'source.citation is missing the Kuzma et al. 2023 reference');
check(!!doc.source?.derivation, 'source.derivation is missing — how the values were produced must travel with them');

// --- Categories -------------------------------------------------------------
const declared = Object.keys(doc.categories ?? {});
console.log(`  declared categories      ${declared.length}`);
for (const k of EXPECTED_CATEGORIES) {
  check(declared.includes(k), `category "${k}" is not declared`);
}
check(
  declared.every((k) => EXPECTED_CATEGORIES.includes(k)),
  `unexpected category declared: ${declared.filter((k) => !EXPECTED_CATEGORIES.includes(k)).join(', ')}`
);

// --- Coverage, re-derived from the basin layer ------------------------------
const stress = doc.stress ?? {};
const counts = Object.fromEntries(EXPECTED_CATEGORIES.map((k) => [k, 0]));

const keys = new Map();
let withValue = 0;
let without = 0;
const missing = [];

for (const f of geo.features) {
  const pfaf = String(f.properties.PFAF_ID);
  if (!keys.has(pfaf)) keys.set(pfaf, []);
  keys.get(pfaf).push(f.properties.HYBAS_ID);
}

for (const [pfaf, hybas] of keys) {
  const value = stress[pfaf];
  if (value === undefined) {
    without++;
    if (missing.length < 8) missing.push(`${pfaf} (HYBAS_ID ${hybas.join(', ')})`);
    continue;
  }
  if (!EXPECTED_CATEGORIES.includes(value)) {
    failures.push(`PFAF_ID ${pfaf} has unknown category "${value}"`);
    continue;
  }
  withValue++;
  counts[value]++;
}

const polygons = geo.features.length;
const coverage = (100 * withValue) / keys.size;

console.log('\n  Coverage');
console.log(`    polygons in layer      ${polygons.toLocaleString()}`);
console.log(`    distinct PFAF_ID keys  ${keys.size.toLocaleString()}`);
console.log(`    keys with a value      ${withValue.toLocaleString()}`);
console.log(`    keys without a value   ${without.toLocaleString()}`);
console.log(`    coverage               ${coverage.toFixed(2)}%`);
if (missing.length) for (const m of missing) console.log(`      missing: ${m}`);

check(without === 0, `${without} basins have no stress value`);

/* Stress entries that name no basin would mean the two files disagree. */
const orphans = Object.keys(stress).filter((k) => !keys.has(k));
console.log(`    stress keys w/o basin  ${orphans.length.toLocaleString()}`);
check(orphans.length === 0, `${orphans.length} stress entries do not correspond to any basin`);

// --- Shared keys ------------------------------------------------------------
const shared = [...keys.entries()].filter(([, v]) => v.length > 1);
if (shared.length) {
  console.log('\n  PFAF_ID shared by more than one polygon');
  for (const [code, list] of shared) {
    console.log(`    ${code} -> ${list.length} polygons (HYBAS_ID ${list.join(', ')}) -> "${stress[code]}"`);
  }
  notes.push(
    'Polygons sharing a PFAF_ID necessarily share a stress value. WRI publishes one figure for that code and the two cannot be told apart from the data.'
  );
}
const unexpectedShared = shared.map(([c]) => c).filter((c) => !KNOWN_SHARED_KEYS.includes(c));
check(unexpectedShared.length === 0, `unexpected shared PFAF_ID: ${unexpectedShared.join(', ')}`);

// --- Distribution -----------------------------------------------------------
console.log('\n  Basins by category');
for (const k of EXPECTED_CATEGORIES) {
  const n = counts[k];
  const pct = ((100 * n) / withValue).toFixed(2);
  console.log(`    ${String(doc.categories[k] ?? k).padEnd(24)} ${String(n).padStart(6)}  ${pct.padStart(6)}%`);
}

/* Arid and No Data are not stress levels. Rendering them on the stress ramp
   would assert something the data does not say. */
const nonStress = counts.arid + counts.nodata;
console.log(
  `\n    not a stress level       ${nonStress.toLocaleString()} (${((100 * nonStress) / withValue).toFixed(2)}%) — arid + no data`
);
notes.push(
  'Arid and Low Water Use and No Data must render outside the stress ramp — neither is a low-stress reading.'
);

if (notes.length) {
  console.log('\n  Notes');
  for (const n of notes) console.log(`    - ${n}`);
}

if (failures.length) {
  console.log(`\nFAILED — ${failures.length} problem${failures.length === 1 ? '' : 's'}:\n`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}

console.log('\nPASSED — all checks confirm the output.');
