/**
 * Confirms the VWBA 2.0 D-3 screening pack answers the way the method says.
 *
 *   node scripts/check-vwba-d3.mjs
 *
 * WHY THIS EXISTS. This pack turns a handful of answers into a water volume,
 * and the ways it can be wrong are quiet ones. The worst of them is treating a
 * blank without-project field as zero, which would report the whole
 * with-project volume as benefit — a large, confident, wrong number, produced
 * without anything looking broken. That failure has its own check below and is
 * the reason this file exists.
 *
 * THE NUMBERS HERE ARE OBVIOUSLY FAKE AND ARE LABELLED AS EXAMPLES. A hundred
 * people, twenty litres, three hundred and sixty-five days. They are round
 * because they are arithmetic fixtures and nothing else. NONE of this is a
 * real project, none of it ships, and none of it is an answer key — no real
 * project's figures appear anywhere in this repository.
 *
 * WHY IT COMPILES FIRST. The pack is TypeScript in src/, whose imports name no
 * file extension because a bundler resolves them. Plain Node cannot, so the
 * pack is compiled to CommonJS in a temporary folder and loaded from there.
 * This tests the real module rather than a second copy of its arithmetic.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
   Compile the pack and load it.
--------------------------------------------------------------------------- */

const out = mkdtempSync(join(tmpdir(), 'wb-d3-'));

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
  console.error('\n  FAILED — the pack did not compile, so nothing below could be checked.\n');
  console.error(compile.stdout || compile.stderr);
  rmSync(out, { recursive: true, force: true });
  process.exit(1);
}

writeFileSync(join(out, 'package.json'), '{"type":"commonjs"}');
const require_ = createRequire(import.meta.url);
const { VWBA_D3, readNumber } = require_(join(out, 'vwbaD3.js'));

/* The generalised result shape (2 Sep 2026): figures with units, and a named
   headline. These read the litres back out of it so the checks below keep
   saying what they always said. */
const withLitres = (r) => r.figures?.find((f) => f.key === 'with')?.value;
const benefitLitres = (r) => r.figures?.find((f) => f.key === 'benefit-litres')?.value;

console.log('\nVWBA 2.0 · D-3 Volume Provided — screening pack\n');
console.log('  Example data only. Round, obviously fake, and not an answer key.\n');

/* ---------------------------------------------------------------------------
   Fixtures. Every one of these is made up.
--------------------------------------------------------------------------- */

/** Full access, a hundred people, the published defaults, nothing else given. */
const FULL_BASE = {
  activity_is_wash_supply: 'yes',
  quality_ok: 'yes',
  access_ok: 'yes',
  people: '100',
  access_level: 'full',
  lpcd: '',
  days: '',
  capacity_lpy: '',
  without_lpy: '',
};

const run = (extra = {}) => VWBA_D3.compute({ ...FULL_BASE, ...extra });

/* ---------------------------------------------------------------------------
   1 — the plain case, without-project left blank.
--------------------------------------------------------------------------- */

const one = run();
expect(
  '1. full access, 100 people, defaults — with-project is 730,000 L/year',
  withLitres(one) === 730000,
  `got ${withLitres(one)}`
);
expect(
  '1. with-project is 730 m³/year',
  withLitres(one) / 1000 === 730,
  `got ${withLitres(one) / 1000}`
);
expect(
  '1. a blank without-project leaves the benefit incomplete',
  one.kind === 'incomplete',
  `got ${one.kind}`
);
expect(
  '1. the incomplete answer says what is missing',
  typeof one.missing === 'string' && one.missing.toLowerCase().includes('without-project'),
  'no plain explanation of the missing figure'
);

/* ---------------------------------------------------------------------------
   2 — the same, with a without-project volume given.
--------------------------------------------------------------------------- */

const two = run({ without_lpy: '100000' });
expect('2. with a without-project volume, the answer completes', two.kind === 'complete', two.kind);
expect(
  '2. benefit is 730,000 − 100,000 = 630,000 L/year',
  benefitLitres(two) === 630000,
  `got ${benefitLitres(two)}`
);
expect(
  '2. the with-project figure is unchanged by it',
  withLitres(two) === 730000,
  `got ${withLitres(two)}`
);

/* ---------------------------------------------------------------------------
   3 — capacity caps the with-project volume.
--------------------------------------------------------------------------- */

const three = run({ capacity_lpy: '500000' });
expect(
  '3. a capacity below demand caps with-project at 500,000 L/year',
  withLitres(three) === 500000,
  `got ${withLitres(three)}`
);
expect(
  '3. with capacity given and without-project blank, it is still incomplete',
  three.kind === 'incomplete',
  `got ${three.kind}`
);

const threeHigh = run({ capacity_lpy: '900000' });
expect(
  '3. a capacity above demand does not raise the figure',
  withLitres(threeHigh) === 730000,
  `got ${withLitres(threeHigh)}`
);

/* ---------------------------------------------------------------------------
   4 — limited access.
--------------------------------------------------------------------------- */

const four = VWBA_D3.compute({
  ...FULL_BASE,
  access_level: 'limited',
  days: '200',
});
expect(
  '4. limited access, 100 people, default 2 L, 200 days — 40,000 L/year',
  withLitres(four) === 40000,
  `got ${withLitres(four)}`
);
expect('4. and the benefit is incomplete', four.kind === 'incomplete', `got ${four.kind}`);

expect(
  '4. limited access has NO default number of days',
  VWBA_D3.defaultFor('days', { access_level: 'limited' }) === null,
  'a default appeared where the method gives none'
);
expect(
  '4. full access does default to 365 days',
  VWBA_D3.defaultFor('days', { access_level: 'full' }) === '365',
  'the full-access default is missing'
);

/* ---------------------------------------------------------------------------
   5 and 6 — the gates. Pass or fail, never a multiplier.
--------------------------------------------------------------------------- */

const quality = run({ quality_ok: 'no' });
expect('5. quality = no produces no volume', quality.kind === 'blocked', `got ${quality.kind}`);
expect(
  '5. and it gives a route forward',
  typeof quality.routeForward === 'string' && quality.routeForward.length > 20,
  'a refusal with no way forward'
);
expect(
  '5. a blocked answer carries no figure at all',
  quality.figures === undefined && quality.headline === undefined,
  'a blocked project was given a number'
);

const access = run({ access_ok: 'no' });
expect('6. access = no produces no volume', access.kind === 'blocked', `got ${access.kind}`);
expect(
  '6. and it gives a route forward',
  typeof access.routeForward === 'string' && access.routeForward.length > 20,
  'a refusal with no way forward'
);

const activity = run({ activity_is_wash_supply: 'no' });
expect(
  '6b. a project that is not household or community supply is stopped',
  activity.kind === 'blocked',
  `got ${activity.kind}`
);
expect(
  '6b. and it is pointed at the method that does fit',
  /D-6|D-4|irrigation/i.test(activity.routeForward),
  'no method named for the project to go to'
);

/* ---------------------------------------------------------------------------
   7 — the one that matters most. A blank is never zero.
--------------------------------------------------------------------------- */

expect(
  '7. a blank without-project reads as null, not 0',
  readNumber({ without_lpy: '' }, 'without_lpy') === null,
  'a blank became a number'
);
expect(
  '7. an absent without-project reads as null, not 0',
  readNumber({}, 'without_lpy') === null,
  'an absent field became a number'
);
expect(
  '7. whitespace is still blank',
  readNumber({ without_lpy: '   ' }, 'without_lpy') === null,
  'whitespace became a number'
);
expect(
  '7. a blank never produces a benefit equal to the whole with-project volume',
  one.kind === 'incomplete' && benefitLitres(one) === undefined && one.headline === undefined,
  'the entire with-project volume was reported as benefit'
);
expect(
  '7. a real zero, typed on purpose, IS still zero',
  readNumber({ without_lpy: '0' }, 'without_lpy') === 0,
  'a deliberate zero was thrown away'
);

/* A typed zero is a real answer and is still honoured — it is how a project
   with genuinely no prior supply is stated. It is checked here ONLY to hold
   the blank-versus-zero distinction apart.

   IT IS NOT USED AS THE EXAMPLE THAT SHOWS A BENEFIT. Maintainer's ruling,
   1 Sep 2026: a training site that subtracts 0 teaches the wrong habit, so
   the fixture that demonstrates a benefit uses a real without-project figure
   — the 100,000 L/year in check 2 above. */
const typedZero = run({ without_lpy: '0' });
expect(
  '7. a typed zero is honoured as an answer, unlike a blank',
  typedZero.kind === 'complete' && run().kind === 'incomplete',
  `typed 0 gave ${typedZero.kind}, blank gave ${run().kind}`
);
expect(
  '7. the example that shows a benefit uses a real figure, not 0',
  benefitLitres(two) === 630000 && readNumber({ without_lpy: '100000' }, 'without_lpy') === 100000,
  'the benefit example rests on a zero'
);

/* ---------------------------------------------------------------------------
   8 — Sphere copy stays off unless the project is humanitarian.
--------------------------------------------------------------------------- */

expect(
  '8. humanitarian = no shows no Sphere note',
  VWBA_D3.conditionalHelp('lpcd', { humanitarian: 'no' }) === null,
  'Sphere copy appeared on an ordinary project'
);
expect(
  '8. an unanswered humanitarian question shows no Sphere note either',
  VWBA_D3.conditionalHelp('lpcd', {}) === null,
  'Sphere copy appeared by default'
);

const sphere = VWBA_D3.conditionalHelp('lpcd', { humanitarian: 'yes' });
expect(
  '8. humanitarian = yes shows the note',
  typeof sphere === 'string' && /sphere/i.test(sphere),
  'the note is missing where it applies'
);
expect(
  '8. and even then it changes no default',
  VWBA_D3.defaultFor('lpcd', { access_level: 'full', humanitarian: 'yes' }) === '20',
  'a default switched itself under the visitor'
);

/* ---------------------------------------------------------------------------
   The pack says what it is.
--------------------------------------------------------------------------- */

expect('the pack is screening tier', VWBA_D3.tier === 'screening', VWBA_D3.tier);
expect(
  'the citation carries all four parts and the canonical link',
  Boolean(
    VWBA_D3.citation.document &&
      VWBA_D3.citation.version &&
      VWBA_D3.citation.section &&
      VWBA_D3.citation.page
  ) && VWBA_D3.citation.href === 'https://doi.org/10.46830/wrigb.23.00112',
  'the citation is incomplete'
);
expect(
  'the without-project field is required AND may be left empty',
  VWBA_D3.fields.find((f) => f.key === 'without_lpy')?.required === true,
  'the field that must never be guessed is not marked required'
);
expect(
  'no field carries a default value typed into it',
  VWBA_D3.fields.every((f) => !('value' in f)),
  'a field ships with a figure already in it'
);

/* ---------------------------------------------------------------------------
   The worksheet draws fields from gateKeys and variableKeys, so a field in
   neither list would silently vanish from the page while still being read by
   the arithmetic — a question nobody could answer and no error to show for it.
--------------------------------------------------------------------------- */

const grouped = [...VWBA_D3.gateKeys, ...VWBA_D3.variableKeys];
const declared = VWBA_D3.fields.map((f) => f.key);

expect(
  'every field appears in the gates or the variables',
  declared.every((k) => grouped.includes(k)),
  `not shown anywhere: ${declared.filter((k) => !grouped.includes(k)).join(', ')}`
);
expect(
  'no field is listed in both groups',
  new Set(grouped).size === grouped.length,
  'a field would be drawn twice'
);
expect(
  'every grouped key is a real field',
  grouped.every((k) => declared.includes(k)),
  `named but missing: ${grouped.filter((k) => !declared.includes(k)).join(', ')}`
);
expect(
  'every hard gate is in the gate row',
  VWBA_D3.gates.every((g) => VWBA_D3.gateKeys.includes(g.fieldKey)),
  'a gate that blocks the answer is not on screen to be answered'
);

/* ---------------------------------------------------------------------------
   The formula, written out.
--------------------------------------------------------------------------- */

const blankFormula = VWBA_D3.formula({});
expect(
  'the formula shows before anything is entered',
  blankFormula.length >= 2,
  `got ${blankFormula.length} lines`
);
expect(
  'an empty formula line reads as an em dash, never as a zero',
  blankFormula.every((s) => s.value === null) && blankFormula[0].live.includes('—'),
  `got "${blankFormula[0].live}"`
);
expect(
  'no formula line shows a 0 where a figure is missing',
  !blankFormula.some((s) => /(^|[^\d])0([^\d]|$)/.test(s.live)),
  `a zero appeared: ${blankFormula.map((s) => s.live).join(' | ')}`
);

const fullFormula = VWBA_D3.formula({ ...FULL_BASE, without_lpy: '100000' });
expect(
  'live values drop into the formula line',
  fullFormula[0].live === '100 × 20 × 365',
  `got "${fullFormula[0].live}"`
);
expect(
  'the with-project line carries its answer',
  fullFormula[0].value === '730,000',
  `got ${fullFormula[0].value}`
);
expect(
  'the benefit line subtracts the without-project figure',
  fullFormula[fullFormula.length - 1].live === '730,000 − 100,000',
  `got "${fullFormula[fullFormula.length - 1].live}"`
);
expect(
  'a blank without-project shows as an em dash in the benefit line',
  VWBA_D3.formula(FULL_BASE).at(-1).live.endsWith('− —'),
  `got "${VWBA_D3.formula(FULL_BASE).at(-1).live}"`
);
expect(
  'the capacity line appears only when a capacity was given',
  VWBA_D3.formula(FULL_BASE).length === 2 &&
    VWBA_D3.formula({ ...FULL_BASE, capacity_lpy: '500000' }).length === 3,
  'the capped line is drawn when there is no capacity to cap with'
);

/* ---------------------------------------------------------------------------
   The tab strip. A planned pack is named and carries nothing that could be
   mistaken for a working tool.
--------------------------------------------------------------------------- */

const { METHOD_PACKS } = require_(join(out, 'methodPacks.js'));

expect(
  'the strip shows more than one pack, so the family is visible',
  METHOD_PACKS.length >= 2,
  `got ${METHOD_PACKS.length}`
);
expect(
  'this pack is live and first in the strip',
  METHOD_PACKS[0] === VWBA_D3 && VWBA_D3.state === 'live',
  'the water pack lost its tab'
);
expect(
  'every planned pack, if any, carries no fields, no gates and no arithmetic',
  METHOD_PACKS.filter((p) => p.state === 'planned').every(
    (p) => !('fields' in p) && !('compute' in p) && !('formula' in p)
  ),
  'a planned pack carries machinery it could be mistaken for using'
);
expect(
  'the headline is the benefit in cubic metres with the litres beside it',
  two.headline.unit === 'm³ / year' && two.headline.value === 630 && /630,000 L/.test(two.headline.secondary),
  `got ${JSON.stringify(two.headline)}`
);

/* ---------------------------------------------------------------------------
   Three questions can stop the number. The other two are helpers.
--------------------------------------------------------------------------- */

expect(
  'exactly three questions can stop the number',
  VWBA_D3.gates.length === 3,
  `got ${VWBA_D3.gates.length}`
);
expect(
  'the 1 km question cannot stop the number',
  !VWBA_D3.gates.some((g) => g.fieldKey === 'within_1km'),
  'a helper was made into a gate'
);
expect(
  'the humanitarian question cannot stop the number',
  !VWBA_D3.gates.some((g) => g.fieldKey === 'humanitarian'),
  'a helper was made into a gate'
);
expect(
  'answering No to the 1 km helper still produces a figure',
  withLitres(run({ within_1km: 'no' })) === 730000,
  'a helper changed the volume'
);
expect(
  'the 1 km helper changes no litres either way',
  withLitres(run({ within_1km: 'yes' })) === withLitres(run({ within_1km: 'no' })),
  'a helper moved the figure'
);
expect(
  'both helpers are marked optional',
  ['within_1km', 'humanitarian'].every(
    (k) => VWBA_D3.fields.find((f) => f.key === k)?.required === false
  ),
  'a helper is marked required'
);

/* ---------------------------------------------------------------------------
   The method strip says the method once, and does not paste the guidebook.
--------------------------------------------------------------------------- */

const m = VWBA_D3.method;
expect('the indicator is named', m.indicator === 'Volume provided', m.indicator);
expect('and reported in m³ per year', m.indicatorUnit === 'm³ per year', m.indicatorUnit);
expect(
  'the defining line is with-project minus without-project',
  /with the project/.test(m.definition) && /without the project/.test(m.definition),
  m.definition
);
const strip = m.lines({});
expect(
  'the option in use is written out',
  strip.some((l) => /people/.test(l) && /days/.test(l)),
  strip.join(' | ')
);
expect('the option is named', /Option 3/.test(m.optionName), m.optionName);
expect(
  'the strip is short — it is not a paste of the guidebook',
  [m.definition, ...m.lines({ capacity_lpy: '1' })].every((line) => line.length < 130),
  'a line long enough to be an excerpt'
);
expect(
  'nothing in the strip claims the figure is verified or delivered',
  !/verified|delivered|approved/i.test(
    [m.indicator, m.definition, ...m.lines({ capacity_lpy: '1' }), m.optionName].join(' ')
  ),
  'the method strip overclaims'
);

/* ---------------------------------------------------------------------------
   The primer an agent inherits names the live packs and no planned one.

   The pack list in agent-primer.md is rendered from this registry rather than
   typed. These confirm the rendering actually happened and said the right
   thing — a literal marker reaching an agent, or a planned pack named as
   though it existed, are both things that would build cleanly and be wrong.
--------------------------------------------------------------------------- */

const primerSource = readFileSync('api/_primer.generated.ts', 'utf8');
const primerText = JSON.parse(primerSource.match(/AGENT_PRIMER_MD: string = (.*);\s*$/s)[1]);

expect(
  'no unreplaced marker reaches the agent',
  !primerText.includes('{{'),
  'a literal marker is in the text an agent is given'
);
expect(
  'the primer names every live pack',
  METHOD_PACKS.filter((p) => p.state === 'live').every((p) => primerText.includes(p.name)),
  'a fitted pack is missing from the roster an agent reads'
);
expect(
  'the primer names no planned pack',
  METHOD_PACKS.filter((p) => p.state === 'planned').every((p) => !primerText.includes(p.name)),
  'an agent could name a pack that does not exist'
);
expect(
  'every live pack owes the primer a clause',
  METHOD_PACKS.filter((p) => p.state === 'live').every(
    (p) => typeof p.primerLine === 'string' && p.primerLine.length > 10
  ),
  'a pack has no clause for the roster'
);

/* ------------------------------------------------------------------------- */

rmSync(out, { recursive: true, force: true });

console.log('');
if (problems.length) {
  console.log(`FAILED — ${problems.length} of ${checks} checks did not hold.\n`);
  for (const p of problems) console.log(`  · ${p}`);
  console.log('');
  process.exit(1);
}
console.log(`PASSED — ${checks} checks. The pack answers the way the method says.\n`);
