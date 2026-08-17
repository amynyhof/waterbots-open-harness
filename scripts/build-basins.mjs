/**
 * Build the web-ready basin layers from HydroSHEDS HydroBASINS.
 *
 * The map uses two layers with a zoom swap:
 *   Level 4 — the world view. 1,342 basins, ~12px median at world zoom.
 *   Level 6 — the detail view, from zoom 5. 16,397 basins, and the ONLY level
 *             that joins WRI Aqueduct 4.0 directly with no aggregation.
 *
 * Raw downloads land in data-src/ and are gitignored. Only the simplified
 * outputs in public/ are committed.
 *
 *   node scripts/build-basins.mjs
 *   node scripts/build-basins.mjs --clean   (also removes data-src/)
 *
 * Source: HydroBASINS v1.c, standard format (without lakes).
 * Licence: see README. The HydroSHEDS Exhibit B attribution is required
 * wherever this data is displayed.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, statSync, createWriteStream } from 'node:fs';
import { rm } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

/** The nine HydroBASINS regional extents. */
const REGIONS = ['af', 'ar', 'as', 'au', 'eu', 'gr', 'na', 'sa', 'si'];

const BASE_URL = 'https://data.hydrosheds.org/file/hydrobasins/standard';

/** Fields the map actually uses. Everything else is dropped before output. */
const KEEP_FIELDS = ['HYBAS_ID', 'PFAF_ID', 'SUB_AREA', 'UP_AREA'];

/** ~111 m at the equator. Ample at the zooms these layers are viewed at. */
const PRECISION = '0.001';

/**
 * Tolerances were chosen by measurement, then confirmed by eye.
 *
 * Level 3 polygons are MERGED rather than smoothed, so every level carries the
 * full 15-arc-second coastline detail of everything inside it. Unsimplified,
 * Level 6 is 196.8 MB across 12,350,450 vertices.
 *
 *   Level 4 @2% -> 2.13 MB raw, 0.59 MB gzip,  2,119 rings,  91 vertices/basin
 *   Level 6 @2% -> 8.44 MB raw, 1.84 MB gzip, 17,042 rings,  23 vertices/basin
 *
 * `keep-shapes` stops small basins collapsing to nothing at low retention.
 */
const LAYERS = [
  { level: '04', simplify: '2%', out: 'hydrobasins_lev04.json' },
  { level: '06', simplify: '2%', out: 'hydrobasins_lev06.json' },
];

const ROOT = path.resolve(import.meta.dirname, '..');
const ZIP_DIR = path.join(ROOT, 'data-src', 'zip');
const SHP_DIR = path.join(ROOT, 'data-src', 'shp');
const PUBLIC_DIR = path.join(ROOT, 'public');

const log = (msg) => process.stdout.write(`${msg}\n`);

async function download(level) {
  mkdirSync(ZIP_DIR, { recursive: true });
  for (const region of REGIONS) {
    const name = `hybas_${region}_lev${level}_v1c.zip`;
    const dest = path.join(ZIP_DIR, name);
    if (existsSync(dest)) {
      log(`  ${name} — already present, skipping`);
      continue;
    }
    const res = await fetch(`${BASE_URL}/${name}`);
    if (!res.ok) throw new Error(`Download failed for ${name}: HTTP ${res.status}`);
    await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
    log(`  ${name} — ${statSync(dest).size.toLocaleString()} bytes`);
  }
}

function extract(level) {
  mkdirSync(SHP_DIR, { recursive: true });
  for (const region of REGIONS) {
    const zip = path.join(ZIP_DIR, `hybas_${region}_lev${level}_v1c.zip`);
    execFileSync('unzip', ['-o', '-q', '-j', zip, '-d', SHP_DIR], { stdio: 'inherit' });
  }
  log(`  extracted ${REGIONS.length} shapefiles`);
}

function convert({ level, simplify, out }) {
  const inputs = REGIONS.map((r) => path.join(SHP_DIR, `hybas_${r}_lev${level}_v1c.shp`));
  for (const f of inputs) {
    if (!existsSync(f)) throw new Error(`Missing shapefile: ${f}`);
  }

  mkdirSync(PUBLIC_DIR, { recursive: true });
  const outFile = path.join(PUBLIC_DIR, out);

  execFileSync(
    'npx',
    [
      'mapshaper',
      '-i',
      ...inputs,
      'combine-files',
      '-merge-layers',
      'force',
      '-filter-fields',
      KEEP_FIELDS.join(','),
      '-simplify',
      'visvalingam',
      'weighted',
      `percentage=${simplify}`,
      'keep-shapes',
      '-clean',
      '-o',
      outFile,
      'format=geojson',
      `precision=${PRECISION}`,
    ],
    { stdio: 'inherit', shell: process.platform === 'win32' }
  );

  log(`  wrote ${out} — ${statSync(outFile).size.toLocaleString()} bytes`);
}

const args = process.argv.slice(2);

for (const layer of LAYERS) {
  log(`\n=== Level ${layer.level} ===`);
  log('Downloading...');
  await download(layer.level);
  log('Extracting...');
  extract(layer.level);
  log(`Merging, trimming fields, simplifying to ${layer.simplify}...`);
  convert(layer);
}

if (args.includes('--clean')) {
  log('\nRemoving raw source data...');
  await rm(path.join(ROOT, 'data-src'), { recursive: true, force: true });
}

log('\nDone. Run `node scripts/check-basins.mjs` to confirm the outputs.');
