/**
 * Confirms the built basin layers before anything renders them.
 *
 * This is a build gate, not a test suite. It exits non-zero on any failure so
 * a half-built layer cannot quietly reach the map. Every check reports the
 * number it measured, not just a pass mark.
 *
 *   node scripts/check-basins.mjs
 */

import { readFileSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

/**
 * Per-level expectations, measured from the source shapefiles.
 *
 * `knownCollisions` — PFAF_ID is unique only WITHIN a regional tile, not
 * globally. One real-world Arctic/Siberia tile overlap produces exactly one
 * collision at every level, propagating down the Pfafstetter hierarchy:
 * 353 -> 3530 -> 353020. It is present in the untouched source shapefiles and
 * is not introduced by the build. Any OTHER collision is a failure.
 */
const LAYERS = [
  {
    level: '04',
    file: 'public/hydrobasins_lev04.json',
    role: 'world view',
    total: 1342,
    maxBytes: 3 * 1024 * 1024,
    knownCollisions: ['3530'],
    byRegion: {
      1: ['Africa', 251],
      2: ['Europe', 240],
      3: ['Siberia', 72],
      4: ['Asia', 199],
      5: ['Australia', 143],
      6: ['South America', 147],
      7: ['North America', 185],
      8: ['Arctic', 68],
      9: ['Greenland', 37],
    },
  },
  {
    level: '06',
    file: 'public/hydrobasins_lev06.json',
    role: 'detail view, from zoom 5',
    total: 16397,
    maxBytes: 10 * 1024 * 1024,
    knownCollisions: ['353020'],
    byRegion: {
      1: ['Africa', 3597],
      2: ['Europe', 2240],
      3: ['Siberia', 1506],
      4: ['Asia', 2489],
      5: ['Australia', 1425],
      6: ['South America', 1946],
      7: ['North America', 2043],
      8: ['Arctic', 849],
      9: ['Greenland', 302],
    },
  },
];

const REQUIRED_FIELDS = ['HYBAS_ID', 'PFAF_ID', 'SUB_AREA', 'UP_AREA'];

const failures = [];
const notes = [];

function check(ok, message) {
  if (!ok) failures.push(message);
  return ok;
}

function checkLayer(spec) {
  const file = path.join(ROOT, spec.file);
  console.log(`\n=== Level ${spec.level} — ${spec.role} ===\n`);

  if (!existsSync(file)) {
    failures.push(`${spec.file} does not exist. Run: node scripts/build-basins.mjs`);
    console.log(`  MISSING — ${spec.file}`);
    return;
  }

  const bytes = statSync(file).size;
  const geo = JSON.parse(readFileSync(file, 'utf8'));
  const features = geo.features ?? [];
  const digits = String(spec.level === '04' ? 4 : 6);

  console.log(`  file            ${spec.file}`);
  console.log(`  size            ${bytes.toLocaleString()} bytes (${(bytes / 1048576).toFixed(2)} MB)`);
  console.log(`  features        ${features.length.toLocaleString()}`);

  check(geo.type === 'FeatureCollection', `Level ${spec.level}: expected a FeatureCollection, got ${geo.type}`);
  check(features.length === spec.total, `Level ${spec.level}: expected ${spec.total} polygons, found ${features.length}`);
  check(
    bytes <= spec.maxBytes,
    `Level ${spec.level}: ${(bytes / 1048576).toFixed(2)} MB exceeds the ${(spec.maxBytes / 1048576).toFixed(0)} MB budget`
  );

  // --- Fields present on every feature --------------------------------------
  for (const field of REQUIRED_FIELDS) {
    const missing = features.filter(
      (f) => f.properties?.[field] === undefined || f.properties[field] === null
    ).length;
    console.log(`  ${field.padEnd(15)} present on ${(features.length - missing).toLocaleString()} / ${features.length}`);
    check(missing === 0, `Level ${spec.level}: ${field} missing on ${missing} features`);
  }

  // --- Identifiers ----------------------------------------------------------
  const hybasIds = new Set(features.map((f) => f.properties.HYBAS_ID));
  console.log(`  unique HYBAS_ID ${hybasIds.size.toLocaleString()}`);
  check(
    hybasIds.size === features.length,
    `Level ${spec.level}: HYBAS_ID is not unique (${hybasIds.size} of ${features.length})`
  );

  const badPfaf = features.filter((f) => !new RegExp(`^\\d{${digits}}$`).test(String(f.properties.PFAF_ID)));
  check(
    badPfaf.length === 0,
    `Level ${spec.level}: ${badPfaf.length} features have a PFAF_ID that is not ${digits} digits`
  );

  const groups = new Map();
  for (const f of features) {
    const key = String(f.properties.PFAF_ID);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(f.properties);
  }
  const duplicates = [...groups.entries()].filter(([, v]) => v.length > 1);
  console.log(`  unique PFAF_ID  ${groups.size.toLocaleString()}`);

  if (duplicates.length) {
    console.log('\n  PFAF_ID collisions (source-data condition, not a build error)');
    for (const [code, rows] of duplicates) {
      console.log(`    PFAF_ID ${code} — ${rows.length} basins:`);
      for (const r of rows) {
        console.log(
          `      HYBAS_ID ${r.HYBAS_ID}  region ${String(r.HYBAS_ID)[0]}  ${r.SUB_AREA.toLocaleString()} km²`
        );
      }
    }
  }

  const unexpected = duplicates.map(([c]) => c).filter((c) => !spec.knownCollisions.includes(c));
  check(
    unexpected.length === 0,
    `Level ${spec.level}: unexpected PFAF_ID collision(s): ${unexpected.join(', ')}`
  );

  // --- Regions --------------------------------------------------------------
  const byRegion = new Map();
  for (const f of features) {
    const d = Number(String(f.properties.HYBAS_ID)[0]);
    byRegion.set(d, (byRegion.get(d) ?? 0) + 1);
  }
  console.log('\n  Polygons by region');
  for (const [digit, [name, expected]] of Object.entries(spec.byRegion)) {
    const found = byRegion.get(Number(digit)) ?? 0;
    console.log(`   ${found === expected ? ' ' : '!'} ${digit}  ${name.padEnd(15)} ${String(found).padStart(6)}  (expected ${expected})`);
    check(found === expected, `Level ${spec.level} ${name}: expected ${expected}, found ${found}`);
  }

  // --- Geometry -------------------------------------------------------------
  let vertices = 0;
  let rings = 0;
  let emptyGeom = 0;
  let lon = [Infinity, -Infinity];
  let lat = [Infinity, -Infinity];

  const walk = (a) => {
    if (typeof a[0] === 'number') {
      vertices++;
      lon = [Math.min(lon[0], a[0]), Math.max(lon[1], a[0])];
      lat = [Math.min(lat[0], a[1]), Math.max(lat[1], a[1])];
      return;
    }
    if (typeof a[0][0] === 'number') rings++;
    a.forEach(walk);
  };

  for (const f of features) {
    if (!f.geometry?.coordinates?.length) {
      emptyGeom++;
      continue;
    }
    walk(f.geometry.coordinates);
  }

  console.log('\n  Geometry');
  console.log(`    vertices      ${vertices.toLocaleString()} (~${Math.round(vertices / features.length)} per basin)`);
  console.log(`    rings         ${rings.toLocaleString()}`);
  console.log(`    empty         ${emptyGeom}`);
  console.log(`    longitude     ${lon[0].toFixed(3)} to ${lon[1].toFixed(3)}`);
  console.log(`    latitude      ${lat[0].toFixed(3)} to ${lat[1].toFixed(3)}`);

  check(emptyGeom === 0, `Level ${spec.level}: ${emptyGeom} features have empty geometry`);
  check(lon[0] >= -180.5 && lon[1] <= 180.5, `Level ${spec.level}: longitude out of range`);
  check(lat[0] >= -90.5 && lat[1] <= 90.5, `Level ${spec.level}: latitude out of range`);

  return { level: spec.level, features: features.length, groups };
}

console.log('Basin layers — build check');
const built = LAYERS.map(checkLayer).filter(Boolean);

/**
 * The two layers must nest: every Level 6 code truncated to four digits must
 * name a Level 4 polygon. This is what lets a basin selected at detail zoom be
 * traced to its world-view parent, and what the Aqueduct join relies on.
 */
if (built.length === 2) {
  const [l4, l6] = built;
  const parents = new Set(l4.groups.keys());
  const orphans = [...l6.groups.keys()].filter((code) => !parents.has(code.slice(0, 4)));
  console.log('\n=== Nesting: Level 6 -> Level 4 ===\n');
  console.log(`  Level 6 codes with no Level 4 parent   ${orphans.length}`);
  if (orphans.length) console.log(`    e.g. ${orphans.slice(0, 8).join(', ')}`);
  check(orphans.length === 0, `${orphans.length} Level 6 codes have no Level 4 parent`);
  notes.push('Level 6 is the only level that joins WRI Aqueduct 4.0 directly, with no aggregation.');
}

notes.push('HydroBASINS excludes Antarctica — a southern limit near -56 is expected.');

if (notes.length) {
  console.log('\nNotes');
  for (const n of notes) console.log(`  - ${n}`);
}

if (failures.length) {
  console.log(`\nFAILED — ${failures.length} problem${failures.length === 1 ? '' : 's'}:\n`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}

console.log('\nPASSED — all checks confirm the outputs.');
