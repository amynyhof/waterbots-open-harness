/**
 * Calvin from the open core — proof P1 of docs/proposals/calvin-from-open-core.md, built
 * 14 Nov 2026 when the site installed @waterbots/calvin 0.2.0 from the release calvin-v0.2.0.
 *
 * WHAT IT HOLDS.
 *   1. The two release files in vendor/waterbots/ are the release's, byte for byte: their
 *      SHA-256 is the one the release publishes, written below and never read from the
 *      folder itself.
 *   2. package.json names exactly those files, and package-lock.json carries the release's
 *      own SHA-512 integrity lines, so `npm ci` refuses any other bytes.
 *   3. What is installed is that version, and the site's own constant says the same.
 *   4. The engine is gs4gg-carbon 0.19.0, and every made-up case the package ships in
 *      expected-outputs.json (45 cases and 2 fNRB cases) gives exactly the recorded answer
 *      when run through the installed package — the package is the seal.
 *   5. carried/, the old sealed engine copy, is gone, and nothing reads it.
 *
 * A NEW VERSION COMES IN ONLY ON THE MAINTAINER'S WORD (proposal section 6): change the files,
 * the numbers below and the lockfile together, in a lane 3 pull request.
 *
 *   node scripts/check-calvin-package.mjs
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const RELEASE = 'calvin-v0.2.0';
const FILES = {
  '@waterbots/calvin': {
    file: 'vendor/waterbots/waterbots-calvin-0.2.0.tgz',
    version: '0.2.0',
    sha256: '622f3bf0aba50d628cc8010258ee845b68652db85434481da6778043b6f7b7f2',
    integrity: 'sha512-OqyknqB8anuqDUrC1qOwo0Xx5OditXIF0C2UP/OIZbdqLSMRnS0mUW3uPJBBk44zFKNyHR5gYH5qloSr1tDnrA==',
  },
  '@waterbots/core': {
    file: 'vendor/waterbots/waterbots-core-0.1.0.tgz',
    version: '0.1.0',
    sha256: 'beff9f45cc2aae2b705fe399ff62c55a3b150e582016d8773948295b9672aa1b',
    integrity: 'sha512-u8KwjPhVNPkEKHyIpZxHjIYXQ7qa97lJaka2VUiCcoGqDa6o8xFGH6MJx6hhCQ4x67NDdc+pFB2ZfrGSIDQoeg==',
  },
};
const ENGINE_VERSION = '0.19.0';

let failures = 0;
let passes = 0;
function expect(label, condition, detail) {
  if (condition) {
    passes += 1;
    console.log(`  ok    ${label}`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log(`\nCalvin from the open core — ${RELEASE}\n`);

/* 1–3. The files, the manifest, the lockfile and what is installed. */
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
for (const [name, want] of Object.entries(FILES)) {
  const bytes = existsSync(want.file) ? readFileSync(want.file) : null;
  const sha256 = bytes ? createHash('sha256').update(bytes).digest('hex') : '';
  const sha512 = bytes ? `sha512-${createHash('sha512').update(bytes).digest('base64')}` : '';
  expect(`${name}: the vendored file has the release's SHA-256`, sha256 === want.sha256, sha256 || 'missing');
  expect(`${name}: the vendored file has the release's SHA-512`, sha512 === want.integrity, sha512 || 'missing');
  expect(`${name}: package.json names exactly that file`, pkg.dependencies?.[name] === `file:${want.file}`, pkg.dependencies?.[name]);
  const locked = lock.packages?.[`node_modules/${name}`];
  expect(
    `${name}: the lockfile pins it by the release's integrity line`,
    locked?.integrity === want.integrity && locked?.version === want.version && locked?.resolved === `file:${want.file}`,
    JSON.stringify(locked)
  );
  const installed = JSON.parse(readFileSync(join('node_modules', ...name.split('/'), 'package.json'), 'utf8'));
  expect(`${name}: ${want.version} is what is installed`, installed.version === want.version, installed.version);
}
const constant = readFileSync(join('src', 'lib', 'calvinProject.ts'), 'utf8').match(/CALVIN_PACKAGE_VERSION = '([^']+)'/)?.[1];
expect('the site names the same version it installed', constant === FILES['@waterbots/calvin'].version, constant);

/* 4. The engine, and every case the package ships. */
const engine = await import('@waterbots/calvin/engine');
const expected = JSON.parse(readFileSync(join('node_modules', '@waterbots', 'calvin', 'dist', 'expected-outputs.json'), 'utf8'));
expect(`the engine is gs4gg-carbon ${ENGINE_VERSION}`, engine.GS4GG_CALCULATOR_VERSION === ENGINE_VERSION && expected.engineVersion === ENGINE_VERSION, engine.GS4GG_CALCULATOR_VERSION);
expect('the package ships 45 cases and 2 fNRB cases', expected.cases.length === 45 && expected.fnrbCases.length === 2, `${expected.cases.length} and ${expected.fnrbCases.length}`);

/* Each case runs as the file says it runs (expected-outputs.json, howEachCaseRuns). Every
   recorded output must come back exactly; only finite numbers were recorded. */
let caseFailures = [];
for (const c of expected.cases) {
  const inputs = { ...c.inputs };
  const got = {};
  if (c.baselineEdit) {
    const resolved = engine.resolveBaselineEdit(c.baselineEdit, c.calc);
    if (resolved.stoveStrata) inputs.stoveStrata = resolved.stoveStrata;
    if (resolved.fuelMix) inputs.fuelMix = resolved.fuelMix;
  }
  if (c.quantityInputs) {
    const q = engine.computeQuantity(c.quantityInputs);
    inputs.Q_pop = q.Q_pop;
    inputs.Q_m = q.Q_m;
    Object.assign(got, q);
  }
  Object.assign(got, c.calc === 'paa' ? engine.computePaaEr(inputs) : engine.computeLegacyEr(inputs));
  /* A true or false is recorded as 1 or 0 (only numbers were recorded). */
  const as = (v) => (typeof v === 'boolean' ? Number(v) : v);
  const wrong = Object.entries(c.outputs).filter(([key, value]) => as(got[key]) !== value);
  if (wrong.length) caseFailures.push(`${c.id}: ${wrong.map(([k, v]) => `${k} ${got[k]} ≠ ${v}`).join(', ')}`);
}
expect(`all ${expected.cases.length} cases give exactly the recorded answers`, caseFailures.length === 0, caseFailures.slice(0, 3).join('; '));

caseFailures = [];
for (const c of expected.fnrbCases) {
  let got;
  try {
    const r = engine.computeScenario(c.scenarioInput);
    got = { fNRB: r.fNRB, ...(r.fnrbMultiNational?.region ? { region: r.fnrbMultiNational.region } : {}) };
  } catch (error) {
    /* Only the engine's own refusal counts; anything else is a fault. */
    got = error instanceof engine.FnrbUnavailableError ? { refused: true, message: error.message } : { fault: String(error) };
  }
  const wrong = Object.entries(c.outputs).filter(([key, value]) => got[key] !== value);
  if (wrong.length) caseFailures.push(`${c.id}: ${JSON.stringify(got)}`);
}
expect(`both fNRB cases give exactly the recorded answers`, caseFailures.length === 0, caseFailures.join('; '));

/* 5. The old sealed copy is gone. */
expect('carried/ is gone (V1, the maintainer\'s word of 14 Nov 2026)', !existsSync('carried'), 'carried/ still exists');
expect('.gitattributes keeps no carried/ rule', !/^carried\//m.test(readFileSync('.gitattributes', 'utf8')), 'a carried/ line is left');

console.log(failures ? `\nFAILED — ${failures} of ${passes + failures} checks did not hold.\n` : `\nPASSED — ${passes} checks: the release, the lockfile and the package's own cases.\n`);
process.exit(failures ? 1 : 0);
