/**
 * Calvin from the open core — proof P1 of docs/proposals/calvin-from-open-core.md, built
 * 14 Nov 2026 when the site installed @waterbots/calvin 0.2.0 from the release calvin-v0.2.0, and moved
 * to calvin-v0.3.0 (@waterbots/calvin 0.3.0, @waterbots/core 0.1.1) on 16 Nov 2026, her word.
 *   6. The project the site hands Calvin leaves `creditedUnderV1` unset until item A29 sets it
 *      from Phoebe's question, so every project gets 0.3.0's V2.0-only view, with no V1.0 figure,
 *      no transition and no ask for a V1.0 filing (her word of 16 Nov 2026).
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

const RELEASE = 'calvin-v0.3.0';
const FILES = {
  '@waterbots/calvin': {
    file: 'vendor/waterbots/waterbots-calvin-0.3.0.tgz',
    version: '0.3.0',
    sha256: '74a8b0d2ec88a0ea977fa8d73cbbbf90194b9177b241d799a8c651042cf6c9c1',
    integrity: 'sha512-Sf5Bfy3QdlCNVLRjETDt730afJw6a/wS6cu+GnAds2ALkwptzHDIQrbkPSyG6cQ+oodCVXzCsxZCkJE59fEpCQ==',
  },
  '@waterbots/core': {
    file: 'vendor/waterbots/waterbots-core-0.1.1.tgz',
    version: '0.1.1',
    sha256: '4e9be07073bd55c765611a459fa15d41fec5482bbf8665cb56c4f80a446f6b5a',
    integrity: 'sha512-wP8ZFabCBzxAh4nvRVIuG0qrwfmxQx9u0wSHbbnjTfhv6QRmjOVrXZkXmE5tHwpkb//hcteYDOSfsEGOLlK3jg==',
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
/* 6. creditedUnderV1 stays unset until A29 (her word of 16 Nov 2026). */
{
  const adapter = readFileSync(join('src', 'lib', 'calvinProject.ts'), 'utf8');
  const code = adapter.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  expect(
    'the site leaves creditedUnderV1 unset, so every project gets the V2.0-only view until A29',
    !/creditedUnderV1/.test(code),
    'src/lib/calvinProject.ts sets creditedUnderV1'
  );
  /* The installed hook itself, rendered once on the server with a made-up project: without
     the field it is the V2.0-only view with a figure; with it, the transition and the ask. */
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { useCalculatorState } = await import('@waterbots/calvin/screen');
  const seen = [];
  const Probe = ({ project }) => {
    const c = useCalculatorState(project, { exAnteOnly: true });
    seen.push({ transition: c.transition, version: c.result?.version, er: c.result?.result?.ER, legacy: c.legacyResult, filed: c.filedFnrbRefusal });
    return null;
  };
  const madeUp = { name: 'Made-up probe', standards: ['carbon'], technology: 'CWS', country: 'KEN', population: { mode: 'people', served: 1600 } };
  renderToString(createElement(Probe, { project: madeUp }));
  renderToString(createElement(Probe, { project: { ...madeUp, creditedUnderV1: true } }));
  const [fresh, credited] = seen;
  expect(
    'without it, 0.3.0 gives the V2.0-only view: a V2.0 figure, no V1.0 figure, no ask for a V1.0 filing',
    fresh?.transition === false && fresh.version === 'paa' && Number.isFinite(fresh.er) && fresh.legacy === null && fresh.filed === null,
    JSON.stringify(fresh)
  );
  expect(
    'with it set true, 0.3.0 asks for the filed V1.0 fNRB before the transition (what A29 will turn on)',
    credited?.transition === true && credited.filed !== null,
    JSON.stringify(credited)
  );
}
/* 7. The calculator opens again once the technology is known, so its starting values are the
      package's own (found on the 0.3.0 walk, 16 Nov 2026: days stayed at 365 under a slider
      that said "starts at 347 d"). Only CalvinCarbon holds the state, keyed by the technology. */
{
  const holder = readFileSync(join('src', 'components', 'CalvinCalculator.tsx'), 'utf8');
  const callers = ['src/App.tsx', 'src/components/CommonsSeats.tsx', 'src/components/CalvinScreen.tsx'].filter((f) =>
    /useCalculatorState\(/.test(readFileSync(f, 'utf8'))
  );
  expect(
    'the calculator state lives in CalvinCarbon alone, keyed by the technology, so it opens again with the facts',
    /<CalvinCarbonState key=\{project\.technology \?\? 'none'\}/.test(holder) && (holder.match(/useCalculatorState\(/g) ?? []).length === 1 && callers.length === 0,
    callers.length ? `also called in ${callers.join(', ')}` : 'the key is missing'
  );
  /* And the reason, measured: opened with the facts, a made-up community project's days start at
     the slider's own starting value, not the seed's 365. */
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { useCalculatorState } = await import('@waterbots/calvin/screen');
  const days = [];
  const DaysProbe = () => {
    days.push(useCalculatorState({ name: 'Made-up probe', standards: ['carbon'], technology: 'CWS', country: 'KEN', population: { mode: 'people', served: 1600 } }, { exAnteOnly: true }).state.operationalDays);
    return null;
  };
  renderToString(createElement(DaysProbe));
  expect('opened with the facts, a community system starts below 365 days, at its slider start', days[0] < 365, `days ${days[0]}`);
}
/* 8. The layout from her tablet walk of 16 Nov 2026: one column, the lens above, one scroll, and the
      core's summary block does not stick over the rows. */
{
  const holder = readFileSync(join('src', 'components', 'CalvinCalculator.tsx'), 'utf8');
  const css = readFileSync(join('src', 'styles', 'calvin.css'), 'utf8');
  expect(
    'the calculator is one column: the lens above, the work full width below, in one scroll',
    /className="wb-calvin wb-calvin-stack"/.test(holder) && !/width: 320/.test(holder) && /className="wb-calvin-lens"/.test(holder),
    'the side column is back'
  );
  expect('the core\'s summary block scrolls with the rows here', /\.wb-calvin \.sticky \{\s*position: static;/.test(css), 'no override');
}
expect('.gitattributes keeps no carried/ rule', !/^carried\//m.test(readFileSync('.gitattributes', 'utf8')), 'a carried/ line is left');

console.log(failures ? `\nFAILED — ${failures} of ${passes + failures} checks did not hold.\n` : `\nPASSED — ${passes} checks: the release, the lockfile and the package's own cases.\n`);
process.exit(failures ? 1 : 0);
