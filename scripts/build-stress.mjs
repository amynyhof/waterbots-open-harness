/**
 * Build the water-stress lookup from WRI Aqueduct 4.0.
 *
 * Aqueduct 4.0 publishes baseline water stress (bws) for HydroSHEDS Level 6
 * basins, which is the level this map renders at detail zoom. That means NO
 * AGGREGATION: the value shown is WRI's published figure for that exact basin,
 * not a derived roll-up.
 *
 * Aqueduct's rows are basin x subnational admin — 68,510 rows for 16,397
 * basins, averaging 4.18 rows each. bws is a basin-level indicator, so the
 * admin split repeats the same value. This script confirms that holds for
 * every basin and FAILS if it does not, rather than silently averaging.
 *
 *   node scripts/build-stress.mjs
 *
 * SOURCE IS NOT IN THIS REPOSITORY. The Aqueduct download is held locally
 * under legacy/ and is gitignored — it is 737 MB. Only the small derived
 * lookup in public/ is committed. Set AQUEDUCT_CSV to override the path.
 *
 * Licence: WRI Aqueduct 4.0 is CC-BY 4.0. See README for the required
 * attribution and the Kuzma et al. 2023 citation.
 */

import { createReadStream, existsSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { createInterface } from 'node:readline';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

const AQUEDUCT =
  process.env.AQUEDUCT_CSV ??
  path.join(
    ROOT,
    'legacy',
    'aqueduct-4-0-water-risk-data',
    'Aqueduct40_waterrisk_download_Y2023M07D05',
    'CVS',
    'Aqueduct40_baseline_annual_y2023m07d05.csv'
  );

const BASINS = path.join(ROOT, 'public', 'hydrobasins_lev06.json');
const OUT = path.join(ROOT, 'public', 'water_stress.json');

/**
 * WRI's own bws_cat codes, mapped to readable keys. The labels are WRI's
 * exact published strings and are reproduced verbatim — they are what the
 * legend must say.
 *
 * `arid` and `nodata` are NOT stress levels and must never be folded into
 * one. Arid and Low Water Use means the water-use denominator is too small
 * for a stress ratio to be meaningful, which is a different statement from
 * low stress.
 */
const CATEGORIES = {
  '0': { key: 'low', label: 'Low (<10%)' },
  '1': { key: 'low-medium', label: 'Low - Medium (10-20%)' },
  '2': { key: 'medium-high', label: 'Medium - High (20-40%)' },
  '3': { key: 'high', label: 'High (40-80%)' },
  '4': { key: 'extremely-high', label: 'Extremely High (>80%)' },
  '-1': { key: 'arid', label: 'Arid and Low Water Use' },
  '-9999': { key: 'nodata', label: 'No Data' },
};

/** Aqueduct quotes fields containing commas, so a naive split is unsafe. */
function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else cur += c;
  }
  out.push(cur);
  return out;
}

const log = (m) => process.stdout.write(`${m}\n`);

for (const [what, file] of [
  ['Aqueduct CSV', AQUEDUCT],
  ['Level 6 basins', BASINS],
]) {
  if (!existsSync(file)) {
    console.error(`Missing ${what}: ${file}`);
    if (file === AQUEDUCT) {
      console.error('The Aqueduct source is not committed. Download it from');
      console.error('https://www.wri.org/data/aqueduct-global-maps-40-data');
      console.error('or set AQUEDUCT_CSV to its location.');
    } else {
      console.error('Run: node scripts/build-basins.mjs');
    }
    process.exit(1);
  }
}

// --- Read Aqueduct ----------------------------------------------------------
log('Reading WRI Aqueduct 4.0 baseline annual...');

const byPfaf = new Map(); // pfaf_id -> { cat, labels:Set }
let rows = 0;
let header = null;
let iPfaf = -1;
let iCat = -1;
let iLabel = -1;

const rl = createInterface({ input: createReadStream(AQUEDUCT), crlfDelay: Infinity });
for await (const line of rl) {
  if (!line.trim()) continue;
  if (!header) {
    header = parseCsvLine(line).map((s) => s.trim());
    iPfaf = header.indexOf('pfaf_id');
    iCat = header.indexOf('bws_cat');
    iLabel = header.indexOf('bws_label');
    if (iPfaf < 0 || iCat < 0 || iLabel < 0) {
      console.error('Could not find pfaf_id / bws_cat / bws_label columns.');
      process.exit(1);
    }
    continue;
  }

  const parts = parseCsvLine(line);
  const pfaf = (parts[iPfaf] ?? '').trim();
  if (!pfaf) continue;
  rows++;

  /* bws_cat arrives as a float string ("0.0", "-9999.0"). */
  const cat = String(Math.trunc(Number(parts[iCat])));
  const label = (parts[iLabel] ?? '').trim();

  if (!byPfaf.has(pfaf)) byPfaf.set(pfaf, { cat, labels: new Set() });
  byPfaf.get(pfaf).labels.add(label);
}

log(`  ${rows.toLocaleString()} rows, ${byPfaf.size.toLocaleString()} distinct pfaf_id`);

/* The no-aggregation claim rests on this. If a basin ever carried more than
   one stress value across its admin rows, deduplicating would be wrong and an
   area-weighted mean would be required. Fail loudly instead of guessing. */
const varying = [...byPfaf.entries()].filter(([, v]) => v.labels.size > 1);
if (varying.length) {
  console.error(`\n${varying.length} basins carry more than one bws value across their admin rows.`);
  console.error('Deduplication is not valid for this data. Aggregation would be required.');
  for (const [p, v] of varying.slice(0, 5)) console.error(`  ${p}: ${[...v.labels].join(' | ')}`);
  process.exit(1);
}
log('  confirmed: every basin carries exactly one stress value — deduplicate, do not aggregate');

// --- Join to the Level 6 basins --------------------------------------------
log('\nJoining to HydroSHEDS Level 6...');

const geo = JSON.parse(readFileSync(BASINS, 'utf8'));
const stress = {};
const counts = Object.fromEntries(Object.values(CATEGORIES).map((c) => [c.key, 0]));

let matched = 0;
const unmatched = [];
const seenPfaf = new Map(); // PFAF_ID -> [HYBAS_ID...]

for (const f of geo.features) {
  const pfaf = String(f.properties.PFAF_ID);
  const hybas = f.properties.HYBAS_ID;

  if (!seenPfaf.has(pfaf)) seenPfaf.set(pfaf, []);
  seenPfaf.get(pfaf).push(hybas);

  const hit = byPfaf.get(pfaf);
  if (!hit) {
    unmatched.push({ pfaf, hybas });
    continue;
  }

  const category = CATEGORIES[hit.cat];
  if (!category) {
    console.error(`Unrecognised bws_cat "${hit.cat}" for basin ${pfaf}.`);
    process.exit(1);
  }

  if (stress[pfaf] === undefined) {
    matched++;
    counts[category.key]++;
  }
  stress[pfaf] = category.key;
}

const collisions = [...seenPfaf.entries()].filter(([, v]) => v.length > 1);

const out = {
  source: {
    dataset: 'WRI Aqueduct 4.0 — baseline annual water stress (bws)',
    licence: 'CC-BY 4.0',
    citation:
      'Kuzma, S., M.F.P. Bierkens, S. Lakshman, T. Luo, L. Saccoccia, E. H. Sutanudjaja, and R. Van Beek. 2023. "Aqueduct 4.0: Updated decision-relevant global water risk indicators." Technical Note. Washington, DC: World Resources Institute.',
    derivation:
      'Values are WRI\'s published Level 6 figures, deduplicated across the basin x subnational-admin rows. No aggregation and no interpolation was applied.',
    basins: 'HydroSHEDS HydroBASINS Level 6, keyed by PFAF_ID',
  },
  categories: Object.fromEntries(Object.values(CATEGORIES).map((c) => [c.key, c.label])),
  stress,
};

writeFileSync(OUT, JSON.stringify(out));

// --- Report -----------------------------------------------------------------
const total = geo.features.length;
log(`  basins in layer          ${total.toLocaleString()}`);
log(`  distinct PFAF_ID keys    ${seenPfaf.size.toLocaleString()}`);
log(`  keys with a stress value ${matched.toLocaleString()}`);
log(`  keys unmatched           ${unmatched.length.toLocaleString()}`);
if (unmatched.length) {
  for (const u of unmatched.slice(0, 8)) log(`    PFAF_ID ${u.pfaf} (HYBAS_ID ${u.hybas})`);
}

if (collisions.length) {
  log('\n  PFAF_ID shared by more than one polygon (source condition):');
  for (const [code, list] of collisions) {
    log(`    ${code} -> HYBAS_ID ${list.join(', ')} — both resolve to "${stress[code]}"`);
  }
}

log('\n  Basins by category');
for (const c of Object.values(CATEGORIES)) {
  const n = counts[c.key];
  log(`    ${c.label.padEnd(24)} ${String(n).padStart(6)}  ${((100 * n) / matched).toFixed(2)}%`);
}

log(`\nWrote ${path.relative(ROOT, OUT)} — ${statSync(OUT).size.toLocaleString()} bytes`);
log('Run `node scripts/check-stress.mjs` to confirm the output.');
