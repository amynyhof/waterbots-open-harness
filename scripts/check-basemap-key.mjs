/**
 * Confirms the SHIPPED bundle asks CARTO for tiles with a key.
 *
 * CARTO ended keyless access to their basemaps. A keyless request still
 * returns HTTP 200 — the tile simply comes back stamped "API KEY REQUIRED"
 * across the image. Nothing errors, nothing logs, and the map looks healthy
 * until a person looks at it. That is how it reached production unnoticed and
 * sat there behind warm caches: a status check said the tiles served, and the
 * tiles did serve.
 *
 *   npm run build && node scripts/check-basemap-key.mjs
 *
 * This reads the BUILT bundle rather than the source, for the same reason
 * check-attribution does: the key is a build-time value baked in by Vite, so
 * the source cannot tell you whether the build had it. A missing VITE_CARTO_KEY
 * produces a perfectly valid bundle that is watermarked everywhere.
 *
 * Fails if the CARTO tile URL ships without a key, and fails if the key looks
 * like an unfilled placeholder. It never prints the key.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');

if (!existsSync(DIST)) {
  console.log('FAILED — dist/ does not exist. Run `npm run build` first.');
  process.exit(1);
}

/** Every text file under dist/, the same walk check-attribution uses. */
function files(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...files(full));
    else if (/\.(js|css|html)$/.test(name)) out.push(full);
  }
  return out;
}

const bundle = files(DIST)
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');

console.log('Basemap key — build check\n');

const failures = [];

/* The tile URL must be in the bundle at all. If this fails, the basemap was
   removed or renamed and the rest of this check is meaningless. */
const TILE_HOST = 'basemaps.cartocdn.com';
if (!bundle.includes(TILE_HOST)) {
  failures.push(`no CARTO tile URL found in the bundle — expected a ${TILE_HOST} address`);
  console.log(`  CARTO tile URL                     MISSING`);
} else {
  console.log(`  CARTO tile URL                     present`);

  /* Pull each CARTO tile URL out of the bundle and look at what follows it.
     Bundlers may split the string, so the key is looked for in the same
     neighbourhood rather than by exact URL reconstruction. */
  const urls = [...bundle.matchAll(/basemaps\.cartocdn\.com[^"'`\s]{0,200}/g)].map((m) => m[0]);
  const keyed = urls.filter((u) => /[?&]key=/.test(u));

  console.log(`  tile URLs found                    ${urls.length}`);
  console.log(`  carrying a key                     ${keyed.length}`);

  if (keyed.length === 0) {
    /* The URL is built by concatenation, so the key may sit in a neighbouring
       string. Widen once before failing, rather than failing on a bundler
       detail. */
    const near = /basemaps\.cartocdn\.com[\s\S]{0,400}?[?&]key=/.test(bundle);
    if (near) {
      console.log(`  key found adjacent to the URL      yes`);
    } else {
      failures.push(
        'the CARTO tile URL ships with no key — VITE_CARTO_KEY was not set when this bundle was built, and every tile will be watermarked'
      );
    }
  }

  /* An unfilled placeholder is worse than nothing: it looks set. */
  const placeholder = /[?&]key=(YOUR_KEY|your_key|CHANGEME|changeme|TODO|xxx+)\b/.test(bundle);
  if (placeholder) failures.push('the tile URL carries a placeholder where the key should be');
  console.log(`  placeholder key                    ${placeholder ? 'PRESENT' : 'absent'}`);
}

if (failures.length) {
  console.log(`\nFAILED — ${failures.length} problem${failures.length === 1 ? '' : 's'}:\n`);
  for (const f of failures) console.log(`  - ${f}`);
  console.log(
    '\nSet VITE_CARTO_KEY before building — in .env.local locally, or in the\n' +
      'deployment platform settings. It is baked in at build time, so a settings\n' +
      'change only reaches a deployment that starts after it.'
  );
  process.exit(1);
}

console.log('\nPASSED — the basemap ships with a key, so tiles are not watermarked.');
