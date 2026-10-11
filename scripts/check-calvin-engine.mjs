/**
 * Confirms Calvin's wrapper around the sealed engine does what his brief says,
 * on synthetic projects.
 *
 *   node scripts/check-calvin-engine.mjs
 *
 * WHY THIS EXISTS. The wrapper (src/lib/calvinEngine.ts) sits between the
 * sealed engine and the Quantify sheet, and the ways it can go wrong are quiet:
 * a preset fuel mix reaching the screen as though it were a country's, a slider
 * opening "assumed" when nothing was assumed, a days note firing on the wrong
 * parameter, a blank read as zero, an SDWS reference without its version, a
 * result sneaking into the list the seal carries. Calvin's brief §10 lists what
 * must hold; each check below names the line it holds.
 *
 * THE PROJECTS ARE SYNTHETIC — invented for this check, labelled here, and
 * never shown to a visitor: a community borehole in Kenya, household filters
 * in Uganda, a kiosk in Fiji. Their countries were chosen for what the
 * engine's own data files hold for them (a national fNRB; none at all), not
 * for any real project. No real project's figures appear here.
 *
 * ONE RUN ON THE ENGINE'S OWN PRESET, AND ONLY HERE. The bundle on hand
 * (v0.16.1) carries no cleared fuel data, so the wrapper never completes a
 * carbon run and its used-value list cannot be reached through it. To prove
 * that list never carries an equation result (R7), the check calls the engine
 * directly once and hands that run to `usedValues`. That run's figures are
 * never printed and never reach a screen.
 *
 * WHY IT COMPILES FIRST. The wrapper is TypeScript in src/, importing the
 * engine and its JSON data by bundler-style paths. Plain Node cannot load it,
 * so it is compiled to CommonJS in a temporary folder and loaded from there —
 * the real module, not a second copy of it. The pattern of check-vwba-d3.mjs.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const problems = [];
let checks = 0;

function expect(label, condition, detail = '') {
  checks += 1;
  if (condition) {
    console.log(`  ok    ${label}`);
  } else {
    console.log(`  FAIL  ${label}`);
    problems.push(`${label}${detail ? ` — ${detail}` : ''}`);
  }
}

/* ---------------------------------------------------------------------------
   Compile the wrapper and load it.
--------------------------------------------------------------------------- */

const out = mkdtempSync(join(tmpdir(), 'wb-calvin-engine-'));
const compile = spawnSync(
  process.execPath,
  [
    join('node_modules', 'typescript', 'bin', 'tsc'),
    join('src', 'lib', 'calvinEngine.ts'),
    join('src', 'lib', 'vwbaD3.ts'),
    '--outDir', out,
    '--rootDir', '.',
    '--module', 'commonjs',
    '--moduleResolution', 'node',
    '--target', 'es2022',
    '--resolveJsonModule',
    '--esModuleInterop',
    '--skipLibCheck',
    '--strict',
  ],
  { encoding: 'utf8' }
);
if (compile.status !== 0) {
  console.error('\n  FAILED — the wrapper did not compile, so nothing below could be checked.\n');
  console.error(compile.stdout || compile.stderr);
  rmSync(out, { recursive: true, force: true });
  process.exit(1);
}
writeFileSync(join(out, 'package.json'), '{"type":"commonjs"}');
const require_ = createRequire(import.meta.url);
const E = require_(join(out, 'src', 'lib', 'calvinEngine.js'));
const F = require_(join(out, 'src', 'lib', 'calvinFields.js'));
const { VWBA_D3 } = require_(join(out, 'src', 'lib', 'vwbaD3.js'));
const ENGINE = require_(join(out, 'engine', 'calculators', 'gs4gg-carbon', 'scenario.js'));
const PRESETS = require_(join(out, 'engine', 'calculators', 'gs4gg-carbon', 'presets.js'));

/* ---------------------------------------------------------------------------
   Synthetic projects.
--------------------------------------------------------------------------- */

const kenyaCws = { type: 'C-19', gsClass: 'CWS', served: { count: 1800, unit: 'people' }, country: 'KEN' };
const ugandaHwt = { type: 'C-19', gsClass: 'HWT', served: { count: 400, unit: 'households' }, country: 'UGA' };
const fijiCwt = { type: 'C-19', gsClass: 'CWT', served: { count: 900, unit: 'people' }, country: 'FJI' };
const answered = (value) => ({ value, from: 'typed' });

/** Every line of every derivation on a sheet. */
const linesOf = (sheet) => sheet.blocks.flatMap((b) => b.derivations.flatMap((d) => d.where));
const derivation = (sheet, key) => sheet.blocks.flatMap((b) => b.derivations).find((d) => d.key === key);
const line = (sheet, key) => linesOf(sheet).find((l) => l.key === key);

/* ---------------------------------------------------------------------------
   §5 — households and people, both ways, through derivePopulation.
--------------------------------------------------------------------------- */

console.log('\nHouseholds and people (§5)');
{
  const asHouseholds = ENGINE.derivePopulation({ countryIso: 'UGA', method: 2, populationMode: 'households', populationCount: 400 });
  const back = ENGINE.derivePopulation({ countryIso: 'UGA', method: 2, populationMode: 'people', populationCount: asHouseholds.people });
  expect('households × size = people', Math.abs(asHouseholds.people - 400 * asHouseholds.householdSize) < 1e-9);
  expect('people ÷ size = households, back again', Math.abs(back.households - 400) < 1e-9, `got ${back.households}`);
  const water = E.peopleForWater(ugandaHwt);
  expect('the water column takes the same people count the engine derives', water && Math.abs(water.people - asHouseholds.people) < 1e-9 && water.derived);
  expect('people said as people reach the water column as said', E.peopleForWater(kenyaCws).people === 1800);
}

/* ---------------------------------------------------------------------------
   §3 — which calculator, from the record.
--------------------------------------------------------------------------- */

console.log('\nWhich calculator (§3)');
{
  const c = (type, cls) => E.chooseCalculators(type, cls);
  expect('HWT runs Method 2', c('C-19', 'HWT').carbon.method === 2);
  expect('IWT runs no carbon: schools and clinics are v2 (R26)', c('C-19', 'IWT').carbon.reason === 'institution');
  expect('CWT runs Method 1', c('C-19', 'CWT').carbon.method === 1);
  expect('CWS runs Method 1', c('C-19', 'CWS').carbon.method === 1);
  expect('a drinking-water project with no class asks the class', c('C-19', '').carbon.reason === 'no-class');
  expect('C-11 runs no carbon and runs D-3', c('C-11', '').carbon.reason === 'not-named' && c('C-11', '').water === 'vwba-d3');
  expect('another type runs D-3 only through its own gate', c('C-1', '').water === 'vwba-d3-gate');
  expect('no type yet runs nothing', c('', '').carbon.reason === 'no-type' && c('', '').water === null);
  expect('the IWT headline line says schools and clinics come later', E.carbonSheet({ ...kenyaCws, gsClass: 'IWT' }).outcome.reason === 'institution');
}

/* ---------------------------------------------------------------------------
   §4 — the six sliders.
--------------------------------------------------------------------------- */

console.log('\nThe six sliders (§4, R23)');
{
  const specs = Object.values(F.SLIDERS);
  expect('there are six sliders', specs.length === 6, `found ${specs.length}`);
  for (const spec of specs) {
    expect(`${spec.key}: clamps below at ${spec.min}`, F.clampSlider(spec, spec.min - 10) === spec.min);
    expect(`${spec.key}: clamps above at ${spec.max}`, F.clampSlider(spec, spec.max + 10) === spec.max);
    expect(`${spec.key}: carries its learning line`, typeof spec.credits === 'string' && spec.credits.length > 20);
  }
  expect('the water litres slider stops at 20 L (R14)', F.WATER_LITRES_SLIDER.max === 20);
  expect('the usage rate never reaches 0', F.USAGE_SLIDER.min > 0);
  expect('the stove slider runs between the engine’s SDWS 11 defaults', F.ETA_SLIDER.min === PRESETS.DEFAULT_STOVE_ETA.paa.threeStone && F.ETA_SLIDER.max === PRESETS.DEFAULT_STOVE_ETA.paa.ics);

  const fresh = E.carbonSheet(kenyaCws);
  expect('DO_p opens at 347, default', line(fresh, 'operationalDays').value === 347 && line(fresh, 'operationalDays').tag === 'default');
  expect('water quality opens at 90%, default', line(fresh, 'waterQuality').value === 0.9 && line(fresh, 'waterQuality').tag === 'default');
  expect('η opens at 0.30, the most efficient class, default', line(fresh, 'eta').value === 0.3 && line(fresh, 'eta').tag === 'default');
  expect('community supply draws no usage slider', line(fresh, 'usageRate') === undefined);

  const hwt = E.carbonSheet(ugandaHwt);
  expect('DP_p on household treatment opens at 365, default (R24)', line(hwt, 'operationalDays').value === 365 && line(hwt, 'operationalDays').tag === 'default');
  expect('DP_p is labelled days present, never operational days', /days present/.test(line(hwt, 'operationalDays').label));
  expect('DP_p cites V2.0 SDWS 36, p. 71', line(hwt, 'operationalDays').chip === 'V2.0 SDWS 36' && /p\. 71/.test(line(hwt, 'operationalDays').note));
  expect('household treatment draws the usage slider, opening at 1, default', line(hwt, 'usageRate')?.value === 1 && line(hwt, 'usageRate').tag === 'default');

  const allFresh = [...linesOf(fresh), ...linesOf(hwt)];
  expect('no row opens assumed', allFresh.every((l) => l.tag !== 'assumed'), allFresh.filter((l) => l.tag === 'assumed').map((l) => l.key).join(', '));

  const moved = E.carbonSheet({ ...kenyaCws, operationalDays: { value: 300, how: 'moved' }, eta: { value: 0.2, how: 'moved' } });
  expect('a moved slider is assumed', line(moved, 'operationalDays').tag === 'assumed' && line(moved, 'eta').tag === 'assumed');
  const said = E.carbonSheet({ ...kenyaCws, operationalDays: { value: 300, how: 'answered' } });
  expect('an answered day count is entered', line(said, 'operationalDays').tag === 'entered');

  const at347 = E.carbonSheet({ ...kenyaCws, operationalDays: { value: 347, how: 'moved' } });
  const at348 = E.carbonSheet({ ...kenyaCws, operationalDays: { value: 348, how: 'moved' } });
  expect('the 347 note is silent at 347', !line(at347, 'operationalDays').warn);
  expect('the 347 note fires at 348 on DO_p', line(at348, 'operationalDays').warn === F.DAYS_ABOVE_THRESHOLD_LINE);
  const hwt360 = E.carbonSheet({ ...ugandaHwt, operationalDays: { value: 360, how: 'moved' } });
  expect('the 347 note never fires on DP_p', !line(hwt360, 'operationalDays').warn);

  const clamped = E.carbonSheet({ ...ugandaHwt, usageRate: { value: 0, how: 'moved' } });
  expect('a usage rate pushed to 0 is held at its floor', line(clamped, 'usageRate').value === F.USAGE_SLIDER.min);

  const carbonLitresMoved = { ...kenyaCws, litres: { value: 2, how: 'moved' } };
  expect('moving the carbon litres slider leaves the water column’s opening alone', F.waterLitresOpening('full') === 20 && E.peopleForWater(carbonLitresMoved).people === 1800);
  expect('the water litres slider opens at 20 L full, 2 L limited, nothing unanswered', F.waterLitresOpening('full') === 20 && F.waterLitresOpening('limited') === 2 && F.waterLitresOpening('') === undefined);
  expect('the two litres sliders are two specs', F.LITRES_SLIDER !== F.WATER_LITRES_SLIDER && F.LITRES_SLIDER.key !== F.WATER_LITRES_SLIDER.key);
}

/* ---------------------------------------------------------------------------
   §1.3, R12 — no cleared fuel data: a dash, never a preset.
--------------------------------------------------------------------------- */

console.log('\nNo cleared fuel data (§1.3, R12, R19)');
{
  const full = { ...kenyaCws, deviceClass: answered('new-borehole-mechanised'), deviceUnits: answered(1), energySource: answered('none') };
  const sheet = E.carbonSheet(full);
  expect('Kenya has no cleared fuel data on the bundle on hand', !E.hasClearedFuelData('KEN'));
  expect('the carbon headline is a dash with the fuel line', sheet.outcome.kind === 'dash' && sheet.outcome.line === E.BASELINE_FUEL_LINE);
  const fuelDependent = ['EF_b', 'Q_adj', 'BE_unc', 'BE_y', 'LE', 'ER'];
  expect('every fuel-dependent row is a dash', fuelDependent.every((k) => derivation(sheet, k).value === null), fuelDependent.filter((k) => derivation(sheet, k).value !== null).join(', '));
  expect('the summary shows no carbon figure', sheet.summary.efb === null && sheet.summary.erPerPerson === null && sheet.summary.total === null);
  expect('X_cleanboil is a dash, not the engine’s 0', line(sheet, 'X_cleanboil').value === null);
  expect('the stove and fuel shares are dashes', line(sheet, 'stoveShares').value === null && line(sheet, 'fuelShares').value === null);
  expect('the water volume still shows, the engine’s own', typeof sheet.summary.qy === 'number' && sheet.summary.qy > 0);
  const m49 = Object.keys(require_(join(out, 'engine', 'calculators', 'data', 'regions', 'un-m49.json')).countries);
  const anyCleared = m49.filter((iso) => E.hasClearedFuelData(iso));
  expect('no country is cleared on v0.16.1, so no headline anywhere is a number', anyCleared.length === 0, anyCleared.join(', '));
  expect('a country with no row is reported by the engine as having none', Object.keys(PRESETS.countryBaselineDefault('KEN')).length === 0);
}

/* ---------------------------------------------------------------------------
   Embodied never 0; the fNRB refusal; blank is not zero.
--------------------------------------------------------------------------- */

console.log('\nEmbodied, fNRB, blanks');
{
  const noDevice = E.carbonOutcome({ ...kenyaCws, energySource: answered('none') });
  expect('an unknown device class is asked', noDevice.needs.includes('deviceClass'));
  const sheet = E.carbonSheet(kenyaCws);
  expect('embodied emissions are never 0 for want of a class', line(sheet, 'embodiedFactor').value === null && derivation(sheet, 'LE').value === null);

  const fiji = E.carbonSheet(fijiCwt);
  const refusal = ENGINE.fnrbAvailability('FJI');
  expect('Fiji has no fNRB the engine stands behind', refusal.ok === false);
  expect('the headline prints the engine’s refusal verbatim', fiji.outcome.kind === 'dash' && fiji.outcome.line === refusal.refusal.message);
  expect('the EF_b row carries the refusal panel', derivation(fiji, 'EF_b').panel?.kind === 'refusal' && derivation(fiji, 'EF_b').panel.text === refusal.refusal.message);

  const water = VWBA_D3.compute({ activity_is_wash_supply: 'yes', quality_ok: 'yes', access_ok: 'yes', people: '1800', access_level: 'full' });
  expect('a blank without-project volume leaves the water headline a dash', water.kind === 'incomplete');
}

/* ---------------------------------------------------------------------------
   R25 — the version tabs.
--------------------------------------------------------------------------- */

console.log('\nThe version tabs (R25)');
{
  expect('a new project shows no version tabs', E.carbonSheet(ugandaHwt).transition.shown === false);
  const t = E.carbonSheet({ ...ugandaHwt, versionFlag: 'transitioning' }).transition;
  expect('a transitioning project shows them', t.shown === true);
  expect('and asks for the filed V1.0 fNRB in the engine’s words', t.refusal?.message === ENGINE.filedFnrbRefusal().message);
  expect('every total is a dash while the headline is', t.legacy === null && t.paa === null && t.delta === null);
  const given = E.carbonSheet({ ...ugandaHwt, versionFlag: 'transitioning', fnrbFiledV1: answered({ value: 0.8, source: 'synthetic' }) }).transition;
  expect('a filed value lifts the refusal', given.refusal === undefined);
}

/* ---------------------------------------------------------------------------
   R22 — every SDWS reference carries its version.
--------------------------------------------------------------------------- */

console.log('\nSDWS references carry their version (R22)');
{
  expect('a bare SDWS takes the version', E.versionedSdws('device capacity q_i (SDWS 13)') === 'device capacity q_i (V2.0 SDWS 13)');
  expect('V2 becomes V2.0', E.versionedSdws('V2 SDWS 11 (p.52)') === 'V2.0 SDWS 11 (p.52)');
  expect('V2 § becomes V2.0 §', E.versionedSdws('V2 §9.2 Table 10') === 'V2.0 §9.2 Table 10');
  expect('a versioned reference is left alone', E.versionedSdws('V2.0 SDWS 36') === 'V2.0 SDWS 36');
  expect('a V1.0 cite stays V1.0', E.versionedSdws('V1.0 methodology, SDWS 21, p.32', 'V1.0') === 'V1.0 methodology, V1.0 SDWS 21, p.32');

  const strings = [];
  const sheets = [
    E.carbonSheet(kenyaCws),
    E.carbonSheet({ ...ugandaHwt, versionFlag: 'transitioning' }),
    E.carbonSheet(fijiCwt),
    E.carbonSheet({ ...kenyaCws, operationalDays: { value: 355, how: 'moved' }, energySource: answered('diesel') }),
  ];
  for (const s of sheets) {
    if (s.outcome.line) strings.push(s.outcome.line);
    if (s.transition.refusal) strings.push(s.transition.refusal.message, s.transition.refusal.cite);
    for (const b of s.blocks) {
      for (const d of b.derivations) {
        strings.push(d.title, d.per, d.plain, d.formula, d.dashLine ?? '', d.flag ?? '', d.panel?.text ?? '', d.panel?.title ?? '');
        for (const l of d.where) strings.push(l.label, l.chip ?? '', l.note ?? '', l.warn ?? '');
      }
    }
  }
  for (const spec of Object.values(F.SLIDERS)) strings.push(spec.credits, spec.label);
  for (const f of Object.values(F.CALVIN_FIELDS)) strings.push(f.neededBy, f.whereFrom, f.label);
  const bare = strings.filter((s) => /(?<!V[12]\.0 )SDWS ?\d/.test(s));
  expect('no string the sheet draws has a bare SDWS reference', bare.length === 0, bare.slice(0, 3).join(' | '));
}

/* ---------------------------------------------------------------------------
   R7 — the used-value list carries inputs, never results.
--------------------------------------------------------------------------- */

console.log('\nUsed values: inputs, never results (R7)');
{
  /* The engine's own run, on its preset — see the header. Never printed. */
  const pop = ENGINE.derivePopulation({ countryIso: 'UGA', method: 2, populationMode: 'households', populationCount: 400 });
  const scenario = ENGINE.computeScenario({
    version: 'paa', method: 2, mode: 'ex-ante', populationMode: 'households', populationCount: 400, countryIso: 'UGA',
    volumeBasis: 'table9', litresPerPersonPerDay: 0, operationalDays: 365, premises: pop.households, M_qy: 0.9, etaOverride: 0.3, usageRate: 1,
    embodied: { unitsInYear: 400, category: 'basic-filter', route: 'amortised' },
  });
  const input = { ...ugandaHwt, deviceClass: answered('basic-filter'), deviceUnits: answered(400), energySource: answered('none') };
  const used = E.usedValues(input, scenario, { method: 2, isHwt: true, days: 365, quality: 0.9, eta: 0.3, usage: 1, litres: undefined, premises: pop.households, pop });
  const leaked = used.filter((u) => E.RESULT_KEYS.includes(u.key));
  expect('no used value is an equation result', leaked.length === 0, leaked.map((u) => u.key).join(', '));
  expect('every used value carries one of the four tags', used.every((u) => ['entered', 'default', 'derived', 'assumed'].includes(u.tag)));
  expect('C_b and U_p say they have no source yet (R16)', used.filter((u) => u.key === 'C_b' || u.key === 'U_p').every((u) => /no source yet/.test(u.source.label ?? '')));
  expect('η travels as the stove slider’s value, default', used.find((u) => u.key === 'eta')?.value === 0.3 && used.find((u) => u.key === 'eta').tag === 'default');
}

rmSync(out, { recursive: true, force: true });

console.log('');
if (problems.length > 0) {
  console.error(`  FAILED — ${problems.length} of ${checks} checks:\n`);
  for (const p of problems) console.error(`    · ${p}`);
  console.error('');
  process.exit(1);
}
console.log(`  All ${checks} checks pass.\n`);
