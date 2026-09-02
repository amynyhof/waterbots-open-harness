/**
 * Confirms the two Gold Standard safe-drinking-water carbon packs answer the
 * way the methodology says, and reproduce every recorded reference figure to
 * four decimal places.
 *
 *   node scripts/check-gs-sdws.mjs
 *
 * WHY THIS EXISTS. A carbon screening turns a handful of answers into tonnes
 * of CO₂-equivalent, and the ways it can be wrong are quiet ones: a blank read
 * as zero, a share applied to the wrong tab, a cap that never binds, a
 * spreadsheet cell copied rather than the equation. The reference figures here
 * were produced by running scenarios through the standard's own calculation
 * tools under a stated standard profile, and this script proves the packs
 * land on the same numbers.
 *
 * THE FIXTURES ARE SYNTHETIC. Round household counts, a stated profile, and
 * six countries' recorded shares. None of it is a real project, none of it
 * ships, and no real project's figures appear anywhere in this repository.
 * The country shares are MoFuSS Table 5 figures and are cited by the pack.
 *
 * TWO REFERENCE ROWS ARE DELIBERATELY NOT HERE. A school-mix row whose inputs
 * were not recorded, and which the reference tool computed with a defective
 * half-day cell — the packs build from the methodology's own sum, and that
 * deviation is documented in src/lib/gsSdws.ts. And a generator row's own
 * emissions are a typed input, so it is reproduced with the figure typed.
 *
 * WHY IT COMPILES FIRST. The packs are TypeScript in src/, whose imports name
 * no file extension because a bundler resolves them. Plain Node cannot, so the
 * module is compiled to CommonJS in a temporary folder and loaded from there.
 * This tests the real module rather than a second copy of its arithmetic.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const problems = [];
let checks = 0;

function expect(label, condition, detail) {
  checks += 1;
  if (condition) {
    console.log(`  ok    ${label}`);
  } else {
    console.log(`  FAIL  ${label}`);
    problems.push(`${label} — ${detail}`);
  }
}

/* ---------------------------------------------------------------------------
   Compile the packs and load them.
--------------------------------------------------------------------------- */

const out = mkdtempSync(join(tmpdir(), 'wb-sdws-'));

const compile = spawnSync(
  process.execPath,
  [
    join('node_modules', 'typescript', 'bin', 'tsc'),
    join('src', 'lib', 'methodPacks.ts'),
    '--outDir',
    out,
    '--module',
    'commonjs',
    '--moduleResolution',
    'node',
    '--target',
    'es2022',
    '--skipLibCheck',
    '--esModuleInterop',
  ],
  { encoding: 'utf8' }
);

if (compile.status !== 0) {
  console.error('\n  FAILED — the packs did not compile, so nothing below could be checked.\n');
  console.error(compile.stdout || compile.stderr);
  rmSync(out, { recursive: true, force: true });
  process.exit(1);
}

writeFileSync(join(out, 'package.json'), '{"type":"commonjs"}');
const require_ = createRequire(import.meta.url);
const {
  GS_SDWS_LEGACY_V1: LEGACY,
  GS_SDWS_PAA_V2: PAA,
  COUNTRIES,
  EF_A,
  EF_B,
  emissionFactor,
  CITE_MOFUSS,
} = require_(join(out, 'gsSdws.js'));
const { METHOD_PACKS, PACK_COMPARISONS } = require_(join(out, 'methodPacks.js'));

console.log('\nGold Standard · Emission Reductions from Safe Drinking Water Supply — two screening packs\n');
console.log('  Synthetic fixtures only. Not a real project, and not an answer key.\n');

const r4 = (x) => Math.round(x * 1e4) / 1e4;
const headline = (r) => (r.kind === 'complete' ? r.headline.value : null);

/* ---------------------------------------------------------------------------
   The emission factor is a straight line in the non-renewable share under
   the standard profile, and it lands on every recorded factor.
--------------------------------------------------------------------------- */

const RECORDED_FACTORS = [
  [0.06, 8.6211812912e-5],
  [0.3, 0.00019242053576],
  [0.35, 0.00021454735302],
  [0.49, 0.000276502441348],
  [0.51, 0.000285353168252],
  [0.6, 0.00032518143932],
  [0.82, 0.000422539435264],
];

for (const [fnrb, ef] of RECORDED_FACTORS) {
  const got = emissionFactor(fnrb);
  expect(
    `factor at a non-renewable share of ${fnrb} is ${ef}`,
    Math.abs(got - ef) / ef < 1e-9,
    `got ${got}`
  );
}
expect('the two line constants are positive', EF_A > 0 && EF_B > 0, `${EF_A}, ${EF_B}`);

/* ---------------------------------------------------------------------------
   Fixtures.
--------------------------------------------------------------------------- */

const GATES = { boils_today: 'yes', safe_at_use: 'yes', low_emission_tech: 'yes' };

const cws = (country, households, extra = {}) => ({
  ...GATES,
  method: 'cws',
  country,
  fnrb: '',
  clean_share: '0.05',
  households: String(households),
  people_per_premises: '5',
  litres_per_person: '4',
  days_operational: '330',
  capacity_litres: '',
  half_premises: '',
  half_people: '',
  half_litres: '',
  project_emissions: '',
  leakage_mode: 'none',
  leakage_tco2e: '',
  ...extra,
});

const hwt = (country, units, usage) => ({
  ...GATES,
  method: 'hwt',
  country,
  fnrb: '',
  clean_share: '0.05',
  units: String(units),
  usage_rate: String(usage),
  flow_lph: '1.7',
  hours_per_day: '15',
  units_per_premises: '1',
  days_present: '330',
  people_per_premises: '5',
  litres_per_person: '4',
  project_emissions: '',
  leakage_mode: 'none',
  leakage_tco2e: '',
});

/* Method 1 — community supply, hi and lo, six countries, PAA shares. ER = BE. */
const CWS_ROWS = [
  ['cws-ind-hi', 'IND', 10000, 5405.4807],
  ['cws-ind-lo', 'IND', 2000, 1081.0961],
  ['cws-ken-hi', 'KEN', 10000, 12064.7676],
  ['cws-ken-lo', 'KEN', 2000, 2412.9535],
  ['cws-uga-hi', 'UGA', 10000, 13452.119],
  ['cws-uga-lo', 'UGA', 2000, 2690.4238],
  ['cws-mwi-hi', 'MWI', 10000, 17336.7031],
  ['cws-mwi-lo', 'MWI', 2000, 3467.3406],
  ['cws-tza-hi', 'TZA', 10000, 17891.6436],
  ['cws-tza-lo', 'TZA', 2000, 3578.3287],
  ['cws-ner-hi', 'NER', 10000, 20388.8762],
  ['cws-ner-lo', 'NER', 2000, 4077.7752],
];

for (const [id, country, hh, er] of CWS_ROWS) {
  const r = PAA.compute(cws(country, hh));
  expect(`${id}: PAA v2.0 reproduces ${er} tCO₂e`, r.kind === 'complete' && r4(headline(r)) === er, `got ${r.kind} ${headline(r)}`);
  const litres = r.kind === 'complete' ? r.figures.find((f) => f.key === 'litres').value : null;
  expect(`${id}: litres supplied are ${hh * 5 * 4 * 330}`, litres === hh * 5 * 4 * 330, `got ${litres}`);
}

/* Method 2 — treatment in the home, hi and lo, six countries. The cap binds. */
const HWT_ROWS = [
  ['hwt-ind-hi', 'IND', 10000, 0.9, 4864.9326],
  ['hwt-ind-lo', 'IND', 2000, 0.5, 540.5481],
  ['hwt-ken-hi', 'KEN', 10000, 0.9, 10858.2908],
  ['hwt-ken-lo', 'KEN', 2000, 0.5, 1206.4768],
  ['hwt-uga-hi', 'UGA', 10000, 0.9, 12106.9071],
  ['hwt-uga-lo', 'UGA', 2000, 0.5, 1345.2119],
  ['hwt-mwi-hi', 'MWI', 10000, 0.9, 15603.0328],
  ['hwt-mwi-lo', 'MWI', 2000, 0.5, 1733.6703],
  ['hwt-tza-hi', 'TZA', 10000, 0.9, 16102.4793],
  ['hwt-tza-lo', 'TZA', 2000, 0.5, 1789.1644],
  ['hwt-ner-hi', 'NER', 10000, 0.9, 18349.9886],
  ['hwt-ner-lo', 'NER', 2000, 0.5, 2038.8876],
];

for (const [id, country, n, u, er] of HWT_ROWS) {
  const r = PAA.compute(hwt(country, n, u));
  expect(`${id}: PAA v2.0 reproduces ${er} tCO₂e`, r.kind === 'complete' && r4(headline(r)) === er, `got ${r.kind} ${headline(r)}`);
}
expect(
  'hwt: the per-premises cap binds — 20 L a day, not the 25.5 the unit could make',
  PAA.compute(hwt('IND', 10000, 0.9)).figures.find((f) => f.key === 'litres').value === 59400000,
  'the cap did not bind'
);

/* The transition — Uganda under the legacy share. */
const transition = LEGACY.compute(cws('UGA', 10000));
expect(
  'cws-uga-transition: Legacy V1 with the recorded 0.82 share reproduces 26493.2226 tCO₂e',
  transition.kind === 'complete' && r4(headline(transition)) === 26493.2226,
  `got ${transition.kind} ${headline(transition)}`
);
expect(
  'the legacy tab defaults Uganda’s share to 0.82',
  LEGACY.defaultFor('fnrb', { country: 'UGA' }) === '0.82',
  `got ${LEGACY.defaultFor('fnrb', { country: 'UGA' })}`
);
/* The CDM's expired defaults carry Kenya and Malawi as well as Uganda. */
expect('the legacy tab defaults Kenya’s share to 0.92', LEGACY.defaultFor('fnrb', { country: 'KEN' }) === '0.92', 'Kenya’s legacy share is missing');
expect('the legacy tab defaults Malawi’s share to 0.81', LEGACY.defaultFor('fnrb', { country: 'MWI' }) === '0.81', 'Malawi’s legacy share is missing');
for (const c of COUNTRIES.filter((x) => x.legacy === null)) {
  expect(
    `the legacy tab guesses no share for ${c.name}`,
    LEGACY.defaultFor('fnrb', { country: c.code }) === null,
    'a legacy share was invented'
  );
  const r = LEGACY.compute(cws(c.code, 10000));
  expect(
    `legacy ${c.name} without a typed share stays incomplete rather than answering`,
    r.kind === 'incomplete' && /non-renewable/.test(r.missing),
    `got ${r.kind}`
  );
}
expect(
  'the legacy tab cites the CDM list for its shares',
  LEGACY.alsoCites?.[0]?.href === 'https://cdm.unfccc.int/DNA/fNRB/index.html',
  'the legacy shares are uncited'
);
expect(
  'the v2.0 citation carries the cover date',
  /9 July 2026/.test(PAA.citation.version),
  PAA.citation.version
);
expect(
  'a typed share on the legacy tab is honoured over the default',
  r4(headline(LEGACY.compute(cws('KEN', 10000, { fnrb: '0.30' })))) === 12064.7676,
  'a typed share was ignored'
);
expect(
  'the tiles carry the per-person figure, the factor, the volume in ML and the five-year total',
  (() => {
    const r = PAA.compute(cws('UGA', 10000));
    const t = PAA.tiles(cws('UGA', 10000), r);
    const er = headline(r);
    return (
      t.length === 4 &&
      Math.abs(t[0].value - er / 50000) < 1e-9 &&
      r4(t[2].value) === 66 &&
      Math.abs(t[3].value - er * 5) < 1e-6
    );
  })(),
  'a tile is wrong'
);

/* The generator row — project emissions typed. */
const generator = PAA.compute(cws('KEN', 10000, { project_emissions: '40.56975' }));
expect(
  'cws-ken-generator: typed project emissions of 40.56975 give 12024.1978 tCO₂e',
  r4(headline(generator)) === 12024.1978,
  `got ${headline(generator)}`
);

/* The flat-5% leakage variant on the legacy tab. */
const flat5 = LEGACY.compute(cws('TZA', 10000, { fnrb: '0.51', leakage_mode: 'flat5' }));
expect(
  'cws-tza-hi-flat5: the legacy 5% leakage route gives 16997.0615 tCO₂e',
  r4(headline(flat5)) === 16997.0615,
  `got ${headline(flat5)}`
);
expect(
  'and its leakage line is 894.5822',
  r4(flat5.figures.find((f) => f.key === 'le').value) === 894.5822,
  `got ${flat5.figures.find((f) => f.key === 'le')?.value}`
);

/* The PAA default 2% market leakage, Option 1. */
const two = PAA.compute(cws('UGA', 10000, { leakage_mode: 'default2' }));
const twoBe = two.figures.find((f) => f.key === 'be').value;
expect(
  'paa: the default 2% leakage takes 2% of baseline minus activity emissions',
  r4(headline(two)) === r4(twoBe * 0.98) && r4(twoBe) === 13452.119,
  `got ${headline(two)} against a baseline of ${twoBe}`
);

/* The demo delta — Uganda, legacy against PAA. */
const legacyUga = headline(LEGACY.compute(cws('UGA', 10000)));
const paaUga = headline(PAA.compute(cws('UGA', 10000)));
expect(
  'the Uganda example: PAA minus Legacy is −13041.1036 tCO₂e',
  r4(paaUga - legacyUga) === -13041.1036,
  `got ${paaUga - legacyUga}`
);
expect(
  'and that is −49.2% of the legacy figure',
  Math.round(((paaUga - legacyUga) / legacyUga) * 1000) / 10 === -49.2,
  `got ${((paaUga - legacyUga) / legacyUga) * 100}`
);
expect(
  'the registry pairs the two carbon packs, PAA minus Legacy',
  PACK_COMPARISONS.some((c) => c.minuendKey === PAA.key && c.subtrahendKey === LEGACY.key),
  'no comparison is registered'
);
expect(
  'both packs offer the same worked example, so the delta can be shown',
  LEGACY.example && PAA.example && JSON.stringify(LEGACY.example.values) === JSON.stringify(PAA.example.values),
  'the examples differ'
);
expect(
  'the example is labelled as made up',
  /made up/i.test(PAA.example.label) && /not a real project/i.test(PAA.example.note),
  'the example is not labelled'
);
expect(
  'the example reproduces the demo figures on both tabs',
  r4(headline(PAA.compute(PAA.example.values))) === 13452.119 &&
    r4(headline(LEGACY.compute(LEGACY.example.values))) === 26493.2226,
  `got ${headline(PAA.compute(PAA.example.values))} and ${headline(LEGACY.compute(LEGACY.example.values))}`
);

/* ---------------------------------------------------------------------------
   Blank is never zero.
--------------------------------------------------------------------------- */

const noShare = PAA.compute(cws('other', 10000));
expect('a country with no recorded share leaves the result incomplete', noShare.kind === 'incomplete', noShare.kind);
expect(
  'and no default share appears for it',
  PAA.defaultFor('fnrb', { country: 'other' }) === null,
  'a share was invented'
);

const noClean = PAA.compute(cws('UGA', 10000, { clean_share: '' }));
expect(
  'a blank share-already-on-safe-water is incomplete, not treated as zero',
  noClean.kind === 'incomplete' && /already had safe water/.test(noClean.missing),
  `got ${noClean.kind}`
);
const zeroClean = PAA.compute(cws('UGA', 10000, { clean_share: '0' }));
expect(
  'a typed zero share IS honoured',
  zeroClean.kind === 'complete' && r4(headline(zeroClean)) === r4(13452.119 / 0.95),
  `got ${zeroClean.kind} ${headline(zeroClean)}`
);

const noGate = PAA.compute(cws('UGA', 10000, { low_emission_tech: '' }));
expect(
  'with the technology gate unanswered, project emissions have no default and the result waits',
  noGate.kind === 'incomplete' && /own emissions/.test(noGate.missing),
  `got ${noGate.kind}`
);
expect(
  'project emissions default to zero only once the technology gate is Yes',
  PAA.defaultFor('project_emissions', { low_emission_tech: 'yes' }) === '0' &&
    PAA.defaultFor('project_emissions', {}) === null,
  'the zero appeared without the gate'
);

const noLeak = PAA.compute(cws('UGA', 10000, { leakage_mode: '' }));
expect('an unchosen leakage route leaves the result incomplete', noLeak.kind === 'incomplete', noLeak.kind);
const typedLeakBlank = PAA.compute(cws('UGA', 10000, { leakage_mode: 'typed', leakage_tco2e: '' }));
expect(
  'a typed leakage route with no figure is incomplete, not zero',
  typedLeakBlank.kind === 'incomplete',
  typedLeakBlank.kind
);

const noDays = PAA.compute(cws('UGA', 10000, { days_operational: '' }));
expect('blank operating days give no litres and no figure', noDays.kind === 'pending', noDays.kind);
const noMethod = PAA.compute({ ...cws('UGA', 10000), method: '' });
expect('no method chosen gives no figure', noMethod.kind === 'pending', noMethod.kind);

const blankFormula = PAA.formula({});
expect(
  'an empty formula reads as em dashes, never as zeros',
  blankFormula.every((s) => s.value === null) &&
    !blankFormula.some((s) => /(^|[^\d.e])0([^\d.]|$)/.test(s.live.replace(/e[-+]\d+/g, ''))),
  `a zero appeared: ${blankFormula.map((s) => s.live).join(' | ')}`
);

/* ---------------------------------------------------------------------------
   Capacity and the half-day premises — the methodology's sum, not the tool's cell.
--------------------------------------------------------------------------- */

const capped = PAA.compute(cws('UGA', 10000, { capacity_litres: '33000000' }));
expect(
  'a capacity below demand caps the litres',
  capped.figures.find((f) => f.key === 'litres').value === 33000000,
  'the cap did not bind'
);
expect(
  'a blank capacity means no cap, not zero',
  PAA.compute(cws('UGA', 10000)).figures.find((f) => f.key === 'litres').value === 66000000,
  'a blank capacity zeroed the litres'
);

const schoolMix = PAA.compute(
  cws('TZA', 10000, { half_premises: '10', half_people: '60', half_litres: '2' })
);
expect(
  'half-day premises add premises × people × litres × days into the same sum',
  schoolMix.figures.find((f) => f.key === 'litres').value === (10000 * 5 * 4 + 10 * 60 * 2) * 330,
  `got ${schoolMix.figures.find((f) => f.key === 'litres')?.value}`
);
expect(
  'half-day premises without their people are incomplete, not zero',
  PAA.compute(cws('TZA', 10000, { half_premises: '10', half_people: '' })).kind === 'pending',
  'a missing half-day figure was read as zero'
);

/* ---------------------------------------------------------------------------
   Gates.
--------------------------------------------------------------------------- */

for (const key of ['boils_today', 'safe_at_use', 'low_emission_tech']) {
  const r = PAA.compute(cws('UGA', 10000, { [key]: 'no' }));
  expect(`${key} = no produces no figure and a route forward`, r.kind === 'blocked' && r.routeForward.length > 20, r.kind);
}
expect('exactly three questions can stop the number', PAA.gates.length === 3, `got ${PAA.gates.length}`);

/* ---------------------------------------------------------------------------
   The packs say what they are.
--------------------------------------------------------------------------- */

for (const p of [LEGACY, PAA]) {
  expect(`${p.name} is screening tier`, p.tier === 'screening', p.tier);
  expect(
    `${p.name} carries a four-part citation and the publisher’s page`,
    Boolean(p.citation.document && p.citation.version && p.citation.section && p.citation.page) &&
      p.citation.href.startsWith('https://globalgoals.goldstandard.org/'),
    'the citation is incomplete'
  );
  const grouped = [...p.gateKeys, ...p.variableKeys];
  const declared = p.fields.map((f) => f.key);
  expect(`${p.name}: every field appears in the gates or the variables`, declared.every((k) => grouped.includes(k)), `missing: ${declared.filter((k) => !grouped.includes(k))}`);
  expect(`${p.name}: no field is listed twice`, new Set(grouped).size === grouped.length, 'a field would be drawn twice');
  expect(`${p.name}: every grouped key is a real field`, grouped.every((k) => declared.includes(k)), `named but missing: ${grouped.filter((k) => !declared.includes(k))}`);
  expect(`${p.name}: no field ships with a value typed into it`, p.fields.every((f) => !('value' in f)), 'a field carries a figure');
  expect(
    `${p.name}: nothing in the method strip claims the figure is verified`,
    !/verified|certified|approved/i.test([p.method.definition, ...p.method.lines({})].join(' ').replace(/not verified/gi, '')),
    'the strip overclaims'
  );
  expect(`${p.name}: the emission factor is labelled derived`, p.method.lines({}).some((l) => /derived/.test(l)), 'the derived factor is not labelled');
}
expect('the PAA tab cites the MoFuSS shares by name and vintage', PAA.alsoCites?.[0] === CITE_MOFUSS && /2024/.test(CITE_MOFUSS.version), 'MoFuSS is not cited');
expect('the PAA tab says which v2.0 adjustments it does not apply', PAA.method.lines({}).some((l) => /Not applied/.test(l)), 'the simplification is unstated');
expect('three packs are live', METHOD_PACKS.filter((p) => p.state === 'live').length === 3, `got ${METHOD_PACKS.filter((p) => p.state === 'live').length}`);
expect('no planned placeholder remains', !METHOD_PACKS.some((p) => p.state === 'planned'), 'a planned pack is still registered');
expect('the MoFuSS shares in the pack match Table 5', COUNTRIES.every((c) => [0.06, 0.3, 0.35, 0.49, 0.51, 0.6].includes(c.mofuss)), 'a share drifted');

/* ------------------------------------------------------------------------- */

rmSync(out, { recursive: true, force: true });

console.log('');
if (problems.length) {
  console.log(`FAILED — ${problems.length} of ${checks} checks did not hold.\n`);
  for (const p of problems) console.log(`  · ${p}`);
  console.log('');
  process.exit(1);
}
console.log(`PASSED — ${checks} checks. Both carbon packs answer the way the methodology says.\n`);
