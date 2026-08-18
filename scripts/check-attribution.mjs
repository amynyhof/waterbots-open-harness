/**
 * Confirms the required attributions survive into the SHIPPED bundle.
 *
 * The licence texts are an obligation, not copy. A refactor, a "tidy up" or a
 * dead-code eliminator that drops them would put the product in breach
 * silently — the map would still look correct. This gate checks the built
 * output, not the source, because what ships is what matters.
 *
 *   npm run build && node scripts/check-attribution.mjs
 *
 * Fails if any required phrase is missing, and fails if the Exhibit B
 * placeholders were left unfilled.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const README = path.join(ROOT, 'README.md');

/**
 * Phrases that must appear in the built bundle. Deliberately fragments of the
 * verbatim statements rather than the whole thing, so ordinary formatting does
 * not cause a false failure while any real deletion still does.
 */
const REQUIRED_IN_BUNDLE = [
  // HydroSHEDS Exhibit B — the required copyright statement.
  ['HydroSHEDS Exhibit B opener', 'incorporates data from the HydroSHEDS version 1 database'],
  ['HydroSHEDS copyright holder', 'World Wildlife Fund, Inc. (2006-2022)'],
  ['HydroSHEDS warranty disclaimer', 'gives no warranty regarding its accuracy'],
  ['HydroSHEDS third-party rights', 'Her Royal Majesty and the British Crown'],
  ['HydroSHEDS product name filled in', 'This product WaterBots Open Harness'],

  // WRI Aqueduct 4.0 — CC-BY 4.0 requires attribution and the citation.
  ['Aqueduct licence', 'Creative Commons Attribution 4.0 International License'],
  ['Aqueduct citation', 'Kuzma, S., M.F.P. Bierkens'],

  // Scientific citations.
  ['HydroBASINS citation', 'Lehner, B., Grill G. (2013)'],
  ['HydroSHEDS citation', 'Lehner, B., Verdin, K., Jarvis, A. (2008)'],

  // Basemap.
  ['OpenStreetMap credit', 'OpenStreetMap'],
  ['CARTO credit', 'CARTO'],

  // The derivation disclosure — a reader must be able to tell whose numbers
  // they are looking at.
  ['Level 4 derivation disclosure', 'Derived, not published by WRI'],
];

/** The same statements must also be in the repository README. */
const REQUIRED_IN_README = [
  ['HydroSHEDS Exhibit B', 'incorporates data from the HydroSHEDS version 1 database'],
  ['Aqueduct licence', 'Creative Commons Attribution 4.0 International License'],
  ['Aqueduct citation', 'Kuzma, S., M.F.P. Bierkens'],
  ['HydroBASINS citation', 'Lehner, B., Grill G. (2013)'],
];

/**
 * Things that must NOT appear. Exhibit B ships with placeholders that are easy
 * to leave in, and section 8.1 of the licence prohibits use of WWF's marks.
 */
const FORBIDDEN = [
  ['unfilled Exhibit B placeholder', 'insert Licensee Derivative Product name'],
  ['WWF logo reference', 'wwf-logo'],
];

const failures = [];

if (!existsSync(DIST)) {
  console.error('No dist/ directory. Run `npm run build` first.');
  process.exit(1);
}

/** Read every JS, CSS and HTML asset in the built output. */
function collect(dir) {
  let text = '';
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      text += collect(full);
    } else if (/\.(js|css|html)$/.test(entry)) {
      text += readFileSync(full, 'utf8');
    }
  }
  return text;
}

const bundle = collect(DIST);
const readme = existsSync(README) ? readFileSync(README, 'utf8') : '';

console.log('Attribution — build check\n');
console.log(`  bundle scanned           ${(bundle.length / 1024).toFixed(0)} KB of dist/`);
console.log(`  README                   ${readme ? 'present' : 'MISSING'}\n`);

if (!readme) failures.push('README.md is missing — the licence statements must also live there');

console.log('  Required in the shipped bundle');
for (const [name, phrase] of REQUIRED_IN_BUNDLE) {
  const ok = bundle.includes(phrase);
  console.log(`   ${ok ? ' ' : '!'} ${name.padEnd(34)} ${ok ? 'present' : 'MISSING'}`);
  if (!ok) failures.push(`${name} is missing from the built bundle ("${phrase}")`);
}

console.log('\n  Required in the README');
for (const [name, phrase] of REQUIRED_IN_README) {
  const ok = readme.includes(phrase);
  console.log(`   ${ok ? ' ' : '!'} ${name.padEnd(34)} ${ok ? 'present' : 'MISSING'}`);
  if (!ok) failures.push(`${name} is missing from README.md ("${phrase}")`);
}

console.log('\n  Must not appear');
for (const [name, phrase] of FORBIDDEN) {
  const inBundle = bundle.includes(phrase);
  console.log(`   ${inBundle ? '!' : ' '} ${name.padEnd(34)} ${inBundle ? 'FOUND' : 'absent'}`);
  if (inBundle) failures.push(`${name} appears in the built bundle ("${phrase}")`);
}

if (failures.length) {
  console.log(`\nFAILED — ${failures.length} problem${failures.length === 1 ? '' : 's'}:\n`);
  for (const f of failures) console.log(`  - ${f}`);
  console.log('\nThese are licence obligations. Do not suppress this check.');
  process.exit(1);
}

console.log('\nPASSED — every required attribution is present in the shipped bundle and the README.');
