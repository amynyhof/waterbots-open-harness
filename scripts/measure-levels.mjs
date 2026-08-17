/**
 * MEASUREMENT ONLY — does not write anything to public/.
 *
 * Downloads HydroBASINS at the given Pfafstetter levels, runs the same
 * merge/trim pipeline as build-basins.mjs, and reports polygon counts, vertex
 * counts and output size across a sweep of simplification tolerances.
 *
 * Nothing here picks a level. It exists so the level decision is made on
 * measured numbers.
 *
 *   node scripts/measure-levels.mjs 04 05 06
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, statSync, createWriteStream, readFileSync } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const REGIONS = ['af', 'ar', 'as', 'au', 'eu', 'gr', 'na', 'sa', 'si'];
const BASE_URL = 'https://data.hydrosheds.org/file/hydrobasins/standard';
const KEEP_FIELDS = ['HYBAS_ID', 'PFAF_ID', 'SUB_AREA', 'UP_AREA'];
const PRECISION = '0.001';
const TOLERANCES = ['0.5', '1', '2', '5', '10', '20'];

/** Payload ceiling for a single shipped layer. */
const BUDGET_BYTES = 3 * 1024 * 1024;

const ROOT = path.resolve(import.meta.dirname, '..');
const ZIP_DIR = path.join(ROOT, 'data-src', 'zip');
const SHP_DIR = path.join(ROOT, 'data-src', 'shp');
const OUT_DIR = path.join(ROOT, 'data-src', 'measure');

const log = (m) => process.stdout.write(`${m}\n`);
const npx = (args) =>
  execFileSync('npx', args, { stdio: ['ignore', 'ignore', 'inherit'], shell: process.platform === 'win32' });

function countVertices(file) {
  const geo = JSON.parse(readFileSync(file, 'utf8'));
  let n = 0;
  const walk = (a) => {
    if (typeof a[0] === 'number') {
      n++;
      return;
    }
    a.forEach(walk);
  };
  for (const f of geo.features) if (f.geometry?.coordinates) walk(f.geometry.coordinates);
  return { vertices: n, features: geo.features.length };
}

async function fetchLevel(level) {
  mkdirSync(ZIP_DIR, { recursive: true });
  mkdirSync(SHP_DIR, { recursive: true });
  let downloaded = 0;
  for (const r of REGIONS) {
    const name = `hybas_${r}_lev${level}_v1c.zip`;
    const dest = path.join(ZIP_DIR, name);
    if (!existsSync(dest)) {
      const res = await fetch(`${BASE_URL}/${name}`);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${name}`);
      await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
    }
    downloaded += statSync(dest).size;
    execFileSync('unzip', ['-o', '-q', '-j', dest, '-d', SHP_DIR], { stdio: 'inherit' });
  }
  return downloaded;
}

function merge(level, outFile, simplifyPct) {
  const inputs = REGIONS.map((r) => path.join(SHP_DIR, `hybas_${r}_lev${level}_v1c.shp`));
  const args = ['mapshaper', '-i', ...inputs, 'combine-files', '-merge-layers', 'force',
    '-filter-fields', KEEP_FIELDS.join(',')];
  if (simplifyPct) {
    args.push('-simplify', 'visvalingam', 'weighted', `percentage=${simplifyPct}%`, 'keep-shapes', '-clean');
  }
  args.push('-o', outFile, 'format=geojson', `precision=${PRECISION}`);
  npx(args);
  return statSync(outFile).size;
}

const levels = process.argv.slice(2);
if (!levels.length) {
  console.error('Usage: node scripts/measure-levels.mjs 04 05 06');
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
const results = [];

for (const level of levels) {
  log(`\n=== LEVEL ${level} ===`);
  log('Downloading and extracting...');
  const downloadBytes = await fetchLevel(level);

  log('Merging and trimming (no simplification)...');
  const baseFile = path.join(OUT_DIR, `lev${level}_baseline.json`);
  const baselineBytes = merge(level, baseFile, null);
  const base = countVertices(baseFile);

  log(`  polygons ${base.features.toLocaleString()}  vertices ${base.vertices.toLocaleString()}  ${baselineBytes.toLocaleString()} bytes`);

  const sweep = [];
  for (const pct of TOLERANCES) {
    const f = path.join(OUT_DIR, `lev${level}_s${pct}.json`);
    const bytes = merge(level, f, pct);
    const c = countVertices(f);
    sweep.push({ pct, bytes, vertices: c.vertices, features: c.features });
    log(`  ${String(pct + '%').padEnd(6)} ${String(bytes.toLocaleString()).padStart(12)} bytes  ${String(c.vertices.toLocaleString()).padStart(10)} vertices  ${String(Math.round(c.vertices / c.features)).padStart(4)}/basin  ${c.features === base.features ? '' : `!! ${base.features - c.features} FEATURES LOST`}`);
  }

  results.push({ level, downloadBytes, baselineBytes, ...base, sweep });
}

// --- Summary ----------------------------------------------------------------
log('\n\n========== SUMMARY ==========\n');
log('Level  Polygons   Baseline MB   Chosen tol   Shipped bytes   Shipped MB   Vtx/basin');
for (const r of results) {
  const pick = r.sweep.filter((s) => s.bytes <= BUDGET_BYTES && s.features === r.features).sort((a, b) => b.bytes - a.bytes)[0];
  const cell = pick
    ? `${(pick.pct + '%').padEnd(10)}   ${String(pick.bytes).padStart(13)}   ${(pick.bytes / 1048576).toFixed(2).padStart(10)}   ${String(Math.round(pick.vertices / pick.features)).padStart(9)}`
    : `none under ${(BUDGET_BYTES / 1048576).toFixed(0)} MB`;
  log(`${r.level.padEnd(6)} ${String(r.features).padStart(8)}   ${(r.baselineBytes / 1048576).toFixed(1).padStart(11)}   ${cell}`);
}
log('\nChosen tolerance = the LEAST aggressive setting that fits the 3 MB budget');
log('without losing any polygon. Higher vertices/basin is better fidelity.');
