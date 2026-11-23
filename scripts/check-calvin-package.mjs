/**
 * Calvin from the open core — proof P1 of the open-core proposal on #156, built
 * 14 Nov 2026 when the site installed @waterbots/calvin 0.2.0 from the release calvin-v0.2.0, and moved
 * to calvin-v0.3.0 (@waterbots/calvin 0.3.0, @waterbots/core 0.1.1) on 16 Nov 2026, and to calvin-v0.4.0
 * (@waterbots/calvin 0.4.0, the same core 0.1.1) on 21 Nov 2026, her word, and to calvin-v0.4.1
 * (@waterbots/calvin 0.4.1, the same core 0.1.1) the same day, her word, and to calvin-violet-v0.5.0
 * (@waterbots/calvin 0.5.0, @waterbots/violet 0.5.0, the same core 0.1.1) on 22 Nov 2026, her word on #189:
 * Violet's D-3 screen is the water calculator from then, and this site's own D-3 code is gone; and to
 * calvin-violet-v0.5.1 (@waterbots/calvin 0.5.1, @waterbots/violet 0.5.1, @waterbots/core 0.1.2) the same day, her
 * word ("carry 0.5.1 to both sites"): no sum changed, and core ships the agent rules every agent here reads.
 *   6. The project the site hands Calvin leaves `creditedUnderV1` unset until item A29 sets it
 *      from Phoebe's question, so every project gets the V2.0-only view, with no V1.0 figure,
 *      no transition and no ask for a V1.0 filing (her word of 16 Nov 2026).
 *
 * WHAT IT HOLDS.
 *   1. The three release files in vendor/waterbots/ are the release's, byte for byte: their
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

const RELEASE = 'calvin-violet-v0.5.1';
const FILES = {
  '@waterbots/calvin': {
    file: 'vendor/waterbots/waterbots-calvin-0.5.1.tgz',
    version: '0.5.1',
    sha256: '8cbd1506244591614f9ac0908970df3ba9683d8ba67e747b17b0b3f52bd5eef1',
    integrity: 'sha512-PsU+dQmf/AGkmoGw/NRWvAkCmsRrRxzIKE0bb6A3l0MVXSQU1mIZ8F/OREnIOEgL8N0QRvlt+yVkmY7MbKfjrQ==',
  },
  '@waterbots/violet': {
    file: 'vendor/waterbots/waterbots-violet-0.5.1.tgz',
    version: '0.5.1',
    sha256: 'faa230e07a581cc5cda41a3a1ce9add778305f1d99d416efab2aa1ffffb5b8d6',
    integrity: 'sha512-WPD7qdfqKk02IO06PRIBZbvdot5DcFNbrfOY6/qUzbhmzyobswN1Z3tnv9BFNKe3YIa17k7lpq/3VkIKl6/yog==',
  },
  '@waterbots/core': {
    file: 'vendor/waterbots/waterbots-core-0.1.2.tgz',
    version: '0.1.2',
    sha256: '51534f84aabd7f51bb36d9eefb2e76e78770ed9d096fef825a40a4cf9256efe7',
    integrity: 'sha512-8BQ4ouYORLJPLeEB+XRMzU7JHjXyQa0sLL5YD9VylEmSmTl+KKN6Jg3LfLSl5XMwAVxy5Ym+PglrxshD9JaStA==',
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
const violetConstant = readFileSync(join('src', 'lib', 'calvinProject.ts'), 'utf8').match(/VIOLET_PACKAGE_VERSION = '([^']+)'/)?.[1];
expect('the site names the Violet version it installed', violetConstant === FILES['@waterbots/violet'].version, violetConstant);
const release = readFileSync(join('src', 'lib', 'calvinProject.ts'), 'utf8').match(/CALVIN_RELEASE = '([^']+)'/)?.[1];
expect('the site names the release it installed from', release === RELEASE, release);

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
    'without it, the package gives the V2.0-only view: a V2.0 figure, no V1.0 figure, no ask for a V1.0 filing',
    fresh?.transition === false && fresh.version === 'paa' && Number.isFinite(fresh.er) && fresh.legacy === null && fresh.filed === null,
    JSON.stringify(fresh)
  );
  expect(
    'with it set true, the package asks for the filed V1.0 fNRB before the transition (what A29 will turn on)',
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
    /["']wb-calvin wb-calvin-stack/.test(holder) && !/width: 320/.test(holder) && /className="wb-calvin-lens"/.test(holder),
    'the side column is back'
  );
  /* From 0.4.0 the package's own switch, unpinFigureBlock, does it (her word of 21 Nov 2026); the CSS override is gone. */
  expect(
    'the core\'s summary block scrolls with the rows here, by the package\'s own switch, and no CSS override is left',
    /useCalculatorState\(project, \{ exAnteOnly: true, unpinFigureBlock: true, hideExportButton: screening \}\)/.test(holder) && !/\.sticky\s*\{/.test(css),
    'the switch is not passed, or the old override is back'
  );
}
/* 9. One export during a screening, her word of 16 Nov 2026 on #174: on Quantify Calvin's own
      "Export report (PDF)" is hidden and the left rail's screening report carries his figure and his
      full working; the Commons keeps his export. From 0.4.0 by the package's switch, hideExportButton,
      passed only where `screening` is set (her word of 21 Nov 2026). */
{
  const holder = readFileSync(join('src', 'components', 'CalvinCalculator.tsx'), 'utf8');
  const screen = readFileSync(join('src', 'components', 'CalvinScreen.tsx'), 'utf8');
  const commons = readFileSync(join('src', 'components', 'CommonsSeats.tsx'), 'utf8');
  const report = readFileSync(join('src', 'components', 'ScreeningReport.tsx'), 'utf8');
  const css = readFileSync(join('src', 'styles', 'calvin.css'), 'utf8');
  const base = readFileSync(join('src', 'styles', 'base.css'), 'utf8');
  expect(
    'on Quantify, and only there, Calvin\'s own export is hidden, by the package\'s switch, with no CSS hiding it by its title',
    /hideExportButton: screening/.test(holder) && !/Export the report/.test(css) &&
      /<CalvinTool[\s\S]*?onSummary=\{onSummary\}\s*screening\s/.test(screen) &&
      !/screening/.test(commons.match(/<CalvinTool[\s\S]*?\/>/)?.[0] ?? 'screening'),
    'the switch is missing, or the Commons has it too'
  );
  expect(
    'the screening report holds a place for his working, beside the figure, and his own report is drawn into it',
    /id=\{SCREENING_WORKING_SLOT\}/.test(report) && /createPortal\(\s*<ReportView/.test(holder) && /screening && shown && <WorkingInReport/.test(holder),
    'no working in the screening report'
  );
  expect(
    'the working prints with the screening report, in the flow of the page',
    /body\.wb-print-screening \.wb-report \.print-report \{\s*display: block !important;\s*position: static !important;/.test(base),
    'the print rule is missing'
  );
}
/* 10. The two switches of 0.4.0, rendered once on the server with a made-up project: with them the
       figure block is not pinned and no export button is drawn; without them (the Commons) the
       export button is drawn. */
{
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { useCalculatorState, CalculatorLens, CalculatorWork } = await import('@waterbots/calvin/screen');
  const madeUp = { name: 'Made-up probe', standards: ['carbon'], technology: 'CWS', country: 'KEN', population: { mode: 'people', served: 1600 } };
  const Seat = ({ hide }) => {
    const calc = useCalculatorState(madeUp, { exAnteOnly: true, unpinFigureBlock: true, hideExportButton: hide });
    return createElement('div', null, createElement(CalculatorLens, { calc }), createElement(CalculatorWork, { calc, project: madeUp, appVersion: 'probe', tab: 'calculator' }));
  };
  const quantify = renderToString(createElement(Seat, { hide: true }));
  const commons = renderToString(createElement(Seat, { hide: false }));
  expect(
    'on Quantify the figure block scrolls with the page and neither export button is drawn',
    /data-figure-block="scrolls"/.test(quantify) && !/data-figure-block="pinned"/.test(quantify) && !/Export report \(PDF\)|Export \(PDF\)/.test(quantify),
    'pinned, or an export button drawn'
  );
  expect('on the Commons his export button is still drawn', /Export report \(PDF\)/.test(commons) && /data-figure-block="scrolls"/.test(commons), 'no export button');
}
/* 7. Violet's D-3 is the one water calculator (her word on #189, 22 Nov 2026). Her hand-worked cases
   are not in the package yet; Session C ships them in a later release (ruling C), so step 5 stays open on
   that line alone. Until then: the installed engine is hers, and her screen takes people served from the
   record and labels every result a draft. */
{
  const violet = await import('@waterbots/violet/engine');
  const { recordPopulation, missingPopulationFacts } = await import('@waterbots/violet/screen');
  expect('Violet\'s engine is installed and says D-3 is a draft', violet.D3_STATUS === 'Draft — pending expert review', violet.D3_STATUS);
  expect(
    'her screen takes people served from the record, and only a count above zero',
    recordPopulation({ population: { mode: 'people', served: 100 } })?.served === 100 && recordPopulation({ population: { mode: 'people', served: -5 } })?.served === undefined,
    JSON.stringify(recordPopulation({ population: { mode: 'people', served: -5 } }))
  );
  expect('with no count on the record she names people served as missing', missingPopulationFacts({ view: 'ex-ante', option: 'beneficiaries' }).includes('people served'), 'nothing named');
  /* The one way this calculation can be large, confident and wrong: a blank without-project volume
     read as zero. Her engine must leave the benefit unset and name the value it waits for (CLAUDE.md, Scope). */
  {
    const made = { view: 'ex-ante', option: 'beneficiaries', accessLevel: 'full', population: { mode: 'people', served: 100 } };
    const blank = violet.computeD3(made);
    const zero = violet.computeD3({ ...made, withoutProjectM3PerYear: 0 });
    expect(
      'a blank without-project volume is never read as zero: no benefit until it is given',
      blank.vwbM3PerYear === null && blank.awaiting.length > 0 && zero.vwbM3PerYear !== null,
      JSON.stringify({ blank: blank.vwbM3PerYear, awaiting: blank.awaiting, zero: zero.vwbM3PerYear })
    );
  }
  expect('this site\'s own D-3 code is gone', !existsSync(join('src', 'lib', 'vwbaD3.ts')) && !existsSync(join('src', 'components', 'QuantificationWorksheet.tsx')), 'vwbaD3.ts or QuantificationWorksheet.tsx is still here');
}
/* 8. The agent rules come from core (calvin-violet-v0.5.1, the maintainer's word of 22 Nov 2026). Every agent
   here reads rules 1 to 21 from @waterbots/core's agent-rules.md; AGENT_RULES.md stays the exact master copy.
   "Match" is rules 1 to 21 the same word for word (her ruling of that day): core ships only the part an agent
   reads, with Windows line endings, and leaves out the master's opening lines and its notes for builders. */
{
  const rulesPart = (text, stop) => {
    const lf = text.replace(/\r\n/g, '\n');
    const from = lf.indexOf('## How an agent talks');
    const to = stop ? lf.indexOf(stop) : lf.length;
    return from === -1 || to === -1 ? '' : lf.slice(from, to).trim();
  };
  const coreRules = rulesPart(readFileSync(join('node_modules', '@waterbots', 'core', 'dist', 'agent-rules.md'), 'utf8'));
  const masterRules = rulesPart(readFileSync('AGENT_RULES.md', 'utf8'), '## Notes for builders');
  expect(
    "core's agent rules, rules 1 to 21, are AGENT_RULES.md's word for word",
    coreRules !== '' && coreRules === masterRules,
    `core ${coreRules.length} characters, the master's rules part ${masterRules.length}`
  );
}
expect('.gitattributes keeps no carried/ rule', !/^carried\//m.test(readFileSync('.gitattributes', 'utf8')), 'a carried/ line is left');

console.log(failures ? `\nFAILED — ${failures} of ${passes + failures} checks did not hold.\n` : `\nPASSED — ${passes} checks: the release, the lockfile and the package's own cases.\n`);
process.exit(failures ? 1 : 0);
