/**
 * Confirms the water-stress palette holds its two design properties.
 *
 * The palette is derived from BRAND.md anchors rather than published outright,
 * so the properties that make it legible are asserted here rather than
 * trusted. Reads src/lib/stressPalette.ts as the single source of truth.
 *
 *   node scripts/check-palette.mjs
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src', 'lib', 'stressPalette.ts');

/** The five ordered bands, low to high. Must descend in lightness. */
const RAMP = ['low', 'low-medium', 'medium-high', 'high', 'extremely-high'];
const OFF_SCALE = ['arid', 'nodata'];

/** Even steps: no gap may be less than half the largest. */
const MIN_STEP_RATIO = 0.5;

const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
  return ok;
};

const src = readFileSync(SRC, 'utf8');

/* Pull each entry's key, fill and fillOpacity out of the palette object. */
const entries = new Map();
const re =
  /^\s*'?([a-z-]+)'?:\s*\{[^}]*?fill:\s*'(#[0-9A-Fa-f]{6})'[^}]*?fillOpacity:\s*([0-9.]+)/gms;
let m;
while ((m = re.exec(src)) !== null) entries.set(m[1], { fill: m[2], opacity: Number(m[3]) });

const expected = [...RAMP, ...OFF_SCALE];
for (const k of expected) check(entries.has(k), `palette entry "${k}" was not found in stressPalette.ts`);

if (failures.length) {
  console.log('FAILED — could not read the palette:\n');
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}

const rgb = (hex) => hex.slice(1).match(/../g).map((h) => parseInt(h, 16));

function luminance(hex) {
  const c = rgb(hex)
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/** Saturation in the HSV sense — enough to separate chromatic from neutral. */
function chroma(hex) {
  const [r, g, b] = rgb(hex);
  const max = Math.max(r, g, b);
  return max === 0 ? 0 : (max - Math.min(r, g, b)) / max;
}

console.log('Water-stress palette — check\n');
console.log('  Ordered scale                 fill      lum     step   chroma');

let previous = null;
const steps = [];
const rampChroma = [];

for (const key of RAMP) {
  const { fill } = entries.get(key);
  const lum = luminance(fill);
  const ch = chroma(fill);
  rampChroma.push(ch);

  const step = previous === null ? null : previous - lum;
  if (step !== null) steps.push(step);

  console.log(
    `    ${key.padEnd(26)} ${fill}  ${lum.toFixed(4)}  ${step === null ? '  --  ' : step.toFixed(3).padStart(6)}  ${ch.toFixed(2).padStart(7)}`
  );

  /* Property 1: lightness must descend, so the ramp survives greyscale and
     colour-blind readers. */
  check(
    previous === null || lum < previous,
    `lightness does not descend at "${key}" — the ramp will scramble in greyscale`
  );
  previous = lum;
}

console.log('\n  Off the scale                 fill      lum            chroma  opacity');
const offChroma = [];
for (const key of OFF_SCALE) {
  const { fill, opacity } = entries.get(key);
  const ch = chroma(fill);
  offChroma.push(ch);
  console.log(
    `    ${key.padEnd(26)} ${fill}  ${luminance(fill).toFixed(4)}         ${ch.toFixed(2).padStart(7)}  ${opacity.toFixed(2).padStart(7)}`
  );

  /* Off-scale categories must also be visibly less opaque, so they read as
     unfilled rather than as a reading. */
  check(opacity < 0.7, `"${key}" is not visibly less opaque than the scale (${opacity})`);
}

/* Property 2: every ramp step carries more chroma than any off-scale fill. */
const minRamp = Math.min(...rampChroma);
const maxOff = Math.max(...offChroma);
console.log(`\n  lowest chroma on the scale    ${minRamp.toFixed(2)}`);
console.log(`  highest chroma off the scale  ${maxOff.toFixed(2)}`);
check(
  minRamp > maxOff,
  `chroma does not separate the scale from the non-scale (${minRamp.toFixed(2)} vs ${maxOff.toFixed(2)}) — Arid or No Data could read as a stress value`
);

/* Even steps: a ramp with one tiny gap reads as four bands, not five. */
const largest = Math.max(...steps);
const smallest = Math.min(...steps);
console.log(`\n  lightness steps               ${steps.map((s) => s.toFixed(3)).join(', ')}`);
console.log(`  smallest / largest            ${(smallest / largest).toFixed(2)}`);
check(
  smallest / largest >= MIN_STEP_RATIO,
  `lightness steps are uneven (smallest is ${(smallest / largest).toFixed(2)} of the largest) — two bands will look alike`
);

if (failures.length) {
  console.log(`\nFAILED — ${failures.length} problem${failures.length === 1 ? '' : 's'}:\n`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}

console.log('\nPASSED — the ramp descends evenly and chroma separates the scale from the non-scale.');
