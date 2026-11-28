/**
 * Calvin from the open core — proof P1 of the open-core proposal on #156, built
 * 14 Nov 2026 when the site installed @waterbots/calvin 0.2.0 from the release calvin-v0.2.0, and moved
 * to calvin-v0.3.0 (@waterbots/calvin 0.3.0, @waterbots/core 0.1.1) on 16 Nov 2026, and to calvin-v0.4.0
 * (@waterbots/calvin 0.4.0, the same core 0.1.1) on 21 Nov 2026, her word, and to calvin-v0.4.1
 * (@waterbots/calvin 0.4.1, the same core 0.1.1) the same day, her word, and to calvin-violet-v0.5.0
 * (@waterbots/calvin 0.5.0, @waterbots/violet 0.5.0, the same core 0.1.1) on 22 Nov 2026, her word on #189:
 * Violet's D-3 screen is the water calculator from then, and this site's own D-3 code is gone; and to
 * calvin-violet-v0.5.1 (@waterbots/calvin 0.5.1, @waterbots/violet 0.5.1, @waterbots/core 0.1.2) the same day, her
 * word ("carry 0.5.1 to both sites"): no sum changed, and core ships the agent rules every agent here reads; and to
 * three releases with a tag each on 23 Nov 2026 ("carry the release to both sites"): calvin-v0.6.0, violet-v0.6.0 and
 * core-v0.2.0. No sum changed. On 25 Nov 2026, her word ("carry the release to both sites"): calvin-v0.7.0,
 * violet-v0.7.0 and core-v0.3.0, with both agents' chats. No sum changed. On 26 Nov 2026, her word ("The carry is named"):
 * the six releases of that day in one step, so the site has one copy of core — core-v0.4.0, calvin-v0.8.0, violet-v0.8.0,
 * phoebe-v0.1.0, wellington-v0.1.0 and bridget-v0.1.0. No sum changed; all five agents come from their packages. Later on 26 Nov
 * 2026, her word ("The fix is released"): core-v0.5.0, calvin-v0.9.0, violet-v0.9.0, phoebe-v0.2.0, wellington-v0.2.0 and
 * bridget-v0.2.0 in one step: an agent fills a fact only when the visitor gave it. No sum changed. On 27 Nov 2026, family 4
 * ("Core has released"): core-v0.6.0, calvin-v0.10.0, violet-v0.10.0, phoebe-v0.3.0, wellington-v0.3.0 and bridget-v0.3.0 in one
 * step: the console's shared parts, and every calculator export printing in full.
 *   6. The project the site hands Calvin sets `creditedUnderV1` from the shared record and never otherwise (item A29,
 *      J4, 23 Nov 2026): Phoebe's question settles it. Until then it was left unset (her word of 16 Nov 2026).
 *
 * WHAT IT HOLDS.
 *   1. The six release files in vendor/waterbots/ are the releases', byte for byte: their
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

const RELEASE = 'calvin-v0.10.0';
const VIOLET_RELEASE = 'violet-v0.10.0';
const FILES = {
  '@waterbots/calvin': {
    file: 'vendor/waterbots/waterbots-calvin-0.10.0.tgz',
    version: '0.10.0',
    sha256: '2b4445acdfd0cbba47442a1f9477c4f1b3280a6a6cd76fcff42931ca3acbb370',
    integrity: 'sha512-Cm+CkKc30r2EU8k3zMbXaD70XBfT27parnJNsn1X4A65w9joLH3etUnQabmLvzzoetT+MGR5Li+HCwY0KKzgng==',
  },
  '@waterbots/violet': {
    file: 'vendor/waterbots/waterbots-violet-0.10.0.tgz',
    version: '0.10.0',
    sha256: '423e4e1274c9728bba3da56a07e354636be3eafa2321a0f32ff5713e2d7c4256',
    integrity: 'sha512-SkqGJw47fg1Cxb63Er71bULVVYI5xFQiaUraWDGtmBOyNHOp1VJgP+V6cbIaT7YpyGeKwbVTLBuLK2Q9jhuLHg==',
  },
  '@waterbots/core': {
    file: 'vendor/waterbots/waterbots-core-0.6.0.tgz',
    version: '0.6.0',
    sha256: 'de20024230937f5885504fb8f471f1d86fd4ca7143cf7b8088268625f4fc5ece',
    integrity: 'sha512-+nThlid15K/NoXEXlU2btBj3oTpPVYSuAJvu7Gzua2umoI0rUpgEIcHGSR1dB5QgS9Ekb22g7XqQY0d1UubMAQ==',
  },
  '@waterbots/phoebe': {
    file: 'vendor/waterbots/waterbots-phoebe-0.3.0.tgz',
    version: '0.3.0',
    sha256: '93e665db471782c910d94879710497a279437356330e385669f6c2456a062b37',
    integrity: 'sha512-dSNmWoJu/Fmj1nkKh88cDh5BWlUPuqrltpSL6JiLhIoKD1rXYTT/d6FruZBMlLYkMUZ7JpM3Vf0trJqzDhoKcA==',
  },
  '@waterbots/wellington': {
    file: 'vendor/waterbots/waterbots-wellington-0.3.0.tgz',
    version: '0.3.0',
    sha256: '087b57bfbee3c2f35852d12716f62af45323bbd1107231753735742129043190',
    integrity: 'sha512-CMAZHaNHZwxneKyoyXKja+wzjDT/CYfpNe3Mxk6sQazCBMZWdN+uwOWpukSlvPamCa4+/+3lLYBmL4OeRvMVDQ==',
  },
  '@waterbots/bridget': {
    file: 'vendor/waterbots/waterbots-bridget-0.3.0.tgz',
    version: '0.3.0',
    sha256: 'd8123a937d74c60fe813ed0b0085ef8b7db64fa9bea408db9fa7c2b227f2bf7a',
    integrity: 'sha512-FNq8KrURDinzumJTnVt90g7gDI2sMnVaG+6bmfobxK0BBY7SBQef0sAPUb6jrsz1vcvT6GUiZU5F2ot2MATZuw==',
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

console.log(`\nCalvin and Violet from the open core — ${RELEASE}, ${VIOLET_RELEASE}\n`);

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
const violetRelease = readFileSync(join('src', 'lib', 'calvinProject.ts'), 'utf8').match(/VIOLET_RELEASE = '([^']+)'/)?.[1];
expect('the site names the releases it installed from', release === RELEASE && violetRelease === VIOLET_RELEASE, `${release} and ${violetRelease}`);

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

/* 11. Both chats run on what the packages ship (25 Nov 2026): the instructions are theirs, whole, after core's agent rules;
       the settings the code carries are the ones in config.yaml; the answer's shape is the package's own, within the model
       service's limits and back whole for its reader; and thirty messages a day each, as for the other agents. */
{
  const { spawnSync } = await import('node:child_process');
  const { mkdtempSync, rmSync, symlinkSync, unlinkSync, writeFileSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { pathToFileURL } = await import('node:url');
  const out = mkdtempSync(join(tmpdir(), 'wb-chat-api-'));
  const built = spawnSync(process.execPath, [join('node_modules', 'typescript', 'bin', 'tsc'), '-p', 'tsconfig.api.json', '--noEmit', 'false', '--outDir', out, '--composite', 'false', '--declaration', 'false'], { encoding: 'utf8' });
  expect('api/ compiles', built.status === 0, built.stdout);
  writeFileSync(join(out, 'package.json'), '{"type":"module"}');
  symlinkSync(join(process.cwd(), 'node_modules'), join(out, 'node_modules'), 'junction');
  const load = (name) => import(pathToFileURL(join(out, name)).href);
  const { toWire, fromWire, shapeCost, SHAPE_LIMITS } = await load('_answerShape.js');
  const { CALVIN_SYSTEM_PROMPT, calvinBlock } = await load('_calvinTurn.js');
  const { VIOLET_SYSTEM_PROMPT, violetBlock } = await load('_violetTurn.js');
  const { CALVIN, VIOLET, PHOEBE } = await load('_cap.js');
  const agent = await import('@waterbots/calvin/agent');
  const violet = await import('@waterbots/violet');
  const ship = (pkg, file) => readFileSync(join('node_modules', '@waterbots', pkg, 'dist', file), 'utf8').replace(/\r\n/g, '\n').trim();
  const rules = ship('core', 'agent-rules.md').split('## How an agent talks')[1].trim();
  for (const [name, system, pkg, chat] of [['Calvin', CALVIN_SYSTEM_PROMPT, 'calvin', agent.CALVIN_CHAT], ['Violet', VIOLET_SYSTEM_PROMPT, 'violet', violet.VIOLET_CHAT]]) {
    const sheet = readFileSync(join('knowledge-packs', 'product-shared', 'BUILD_STATUS_SHEET.md'), 'utf8').replace(/\r\n/g, '\n').trim();
    const parts = [rules, ship(pkg, 'prompt.md'), ship(pkg, 'knowledge.md'), sheet];
    const left = parts.reduce((text, part) => text.split(part).join(''), system).replace('## How an agent talks', '').trim();
    expect(`${name}'s instructions are the agent rules, the package's two files and the status sheet, and nothing of this site's`, parts.every((part) => system.includes(part)) && left === '', left.slice(0, 120));
    const config = ship(pkg, 'config.yaml');
    expect(`${name}'s settings are config.yaml's`, config.includes(`model: ${chat.model}`) && config.includes(`effort: ${chat.effort}`) && config.includes(`max_output_tokens: ${chat.maxOutputTokens}`) && config.includes(`sentences: ${chat.reply.sentences}, characters: ${chat.reply.chars}`), JSON.stringify(chat));
  }
  for (const [name, schema] of [['Calvin', agent.CALVIN_ANSWER_SCHEMA], ['Violet', violet.VIOLET_ANSWER_SCHEMA]]) {
    const cost = shapeCost(toWire(schema));
    expect(`${name}'s answer goes to the model within its limits`, cost.optional <= SHAPE_LIMITS.optional && cost.unions <= SHAPE_LIMITS.unions, JSON.stringify(cost));
  }
  const back = agent.readCalvinAnswer(fromWire({ reply: 'A made-up reply.', handBack: 'none', values: { numbers: agent.CALVIN_ANSWER_VALUES.map((name, i) => ({ name, value: i === 0 ? null : i })) } }));
  expect('every number in his answer comes back in its own field, a cleared one too', back !== null && agent.CALVIN_ANSWER_VALUES.every((name, i) => back.values[name] === (i === 0 ? null : i)), JSON.stringify(back));
  const parts = { opened: false, introduce: false, leftForNow: [], refused: [] };
  expect('a screen that is not one is refused, and no line of it can stand as a heading', calvinBlock({ state: { x: 'a\n# b' }, screen: 'x' }, parts, {}) === null && violetBlock({ input: { option: 'none' } }, parts, {}) === null && !/^# [^T]/m.test(violetBlock({ input: { option: 'beneficiaries' }, projectName: 'a\n# b' }, parts, {}) ?? '# x'), 'a made-up heading came through');
  expect('thirty messages a day each, the same as the other agents', CALVIN.cap === PHOEBE.cap && VIOLET.cap === PHOEBE.cap && CALVIN.cap === 30 && CALVIN.name !== VIOLET.name, JSON.stringify([CALVIN, VIOLET]));
  /* SWITCHED OFF, 26 NOV 2026, the maintainer's paste of that day (the sixth of the removals listed on 25 Nov 2026): these
     were the cases for this site's own guards on both chats (api/_chatGuards.ts) and for filing a kind of project from a
     chat. Both are gone: the guards on the numbers are each agent's package's (`guardCalvinReply`, `guardVioletReply`),
     with their own tests there, and nobody files a kind (core 0.4.0). Commented out where they stood, not deleted. */
//   /* 12. The guards on both chats (25 Nov 2026, the maintainer's word), with made-up words. A number nobody gave is never
//          filled in; a treatment project is never a supply, and core alone says which kind gives a figure; a number out of range
//          shows its message whether or not the agent sends it. */
//   {
//     const { checkAnswer, gave, kindSaid, bearsOut, nowDenied, refusedIn, siteNote, sentBackNote } = await load('_chatGuards.js');
//     const { calvinGuard } = await load('_calvinTurn.js');
//     const { violetGuard } = await load('_violetTurn.js');
//     const { PROJECT_TYPES } = await load('_projectTypes.generated.js');
//     const { renderToString } = await import('react-dom/server');
//     const { createElement } = await import('react');
//     const { useCalculatorState } = await import('@waterbots/calvin/screen');
//     let state;
//     const Probe = ({ project }) => { state = useCalculatorState(project, { exAnteOnly: true, place: 'free-site' }).state; return null; };
//     const probe = (project) => { renderToString(createElement(Probe, { project })); return JSON.parse(JSON.stringify(state)); };
//     const lines = { does: 'A made-up borehole for a village', kind: 'Community water supply technologies', filedInChat: false };
//     const supply = probe({ name: 'Made-up probe', standards: ['carbon'], technology: 'CWS', country: 'KEN', population: { mode: 'people', served: 1600 }, pumpPower: 'solar' });
//     const c = calvinGuard({ state: supply }, [], lines);
//     const water = { view: 'ex-ante', option: 'beneficiaries', accessLevel: 'full', population: { mode: 'people', served: 1600 } };
//     const v = violetGuard({ input: water, chosen: true, facts: { technology: 'Community water supply technologies', code: 'CWS', type: 'C-19', technologyClass: 'CWS' } }, [], lines);
//     const sends = (guard, words, part) => checkAnswer({ reply: 'x', handBack: 'none', ...part }, words, guard);
//     const days = supply.operationalDays;
//
//     console.log('\n  The guards on both chats, with made-up words\n');
//     const lost = sends(c, ['It runs 400 days a year.'], { values: { operationalDays: 346 } });
//     expect('a number nobody gave is not filled in: 346 where the visitor said 400', !('operationalDays' in lost.answer.values) && lost.numbers.length === 1 && lost.numbers[0].value === 346, JSON.stringify(lost));
//     const dflt = sends(c, ['Yes, use that.'], { values: { operationalDays: days, waterQualityFactor: 0.9, fnrbOverride: 0.5 } });
//     expect('a default or an assumed value is not filled in on a yes, and a value the screen holds already is no fault', Object.keys(dflt.answer.values).length === 0 && dflt.numbers.every((n) => n.field !== 'operationalDays') && dflt.numbers.length === (supply.waterQualityFactor === 0.9 ? 1 : 2), JSON.stringify(dflt));
//     expect('asked for by number, it is', sends(c, ['Use 200 days.'], { values: { operationalDays: 200 } }).answer.values.operationalDays === 200, 'left out');
//     const ways = [['1,600 people', 1600], ['1 600', 1600], ['1.6 thousand', 1600], ['sixteen hundred', 1600], ['one thousand six hundred', 1600], ['30 million litres', 3e7], ['half a million', 5e5], ['3 lakh', 3e5], ['12k', 12000], ['it is 0,8', 0.8], ['80%', 0.8], ['eighty per cent', 0.8], ['about 4.6 each', 4.6], ['a hundred and five', 105], ['minus 5', -5], ['-5 people', -5]];
//     expect('one amount is the same however it is written', ways.every(([text, n]) => gave([text], n)), ways.filter(([text, n]) => !gave([text], n)).join('; '));
//     const never = [['3 million litres', 3], ['400 days', 347], ['5 cubic metres an hour', 43800], ['30 cubic metres a day', 10950000], ['8', 0.8], ['10-20', -20], ['no idea', 0], ['four people', 40]];
//     expect('a number worked out from theirs, or part of one, is not one they gave', never.every(([text, n]) => !gave([text], n)), never.filter(([text, n]) => gave([text], n)).join('; '));
//     const counts = sends(c, ['We serve 1,600 people, five to a home.'], { facts: { population: { served: 1600, householdSize: 4.4, mode: 'people' }, pumpPower: 'solar' } });
//     expect('the facts are held to the same rule as the screen, and what is not a number stays', JSON.stringify(counts.answer.facts) === '{"population":{"mode":"people"},"pumpPower":"solar"}' && counts.numbers.length === 1 && counts.numbers[0].value === 4.4, JSON.stringify(counts));
//     expect('a brand-new supply is 0 as the answer to that question, and no 0 comes from any other words', sends(v, ['It is brand-new.'], { values: { withoutProjectM3PerYear: 0 } }).answer.values.withoutProjectM3PerYear === 0 && sends(v, ['I do not know.'], { values: { withoutProjectM3PerYear: 0 } }).numbers.length === 1 && sends(v, ['The pump is brand-new.'], { values: { flowM3PerHour: 0 } }).numbers.length === 1, 'a blank was read as zero');
//     const litres = sends(v, ['Full access.'], { values: { accessLevel: 'full', litresPerPersonPerDay: { value: 50, source: 'made up' } } });
//     expect('a value with a source goes whole when its number is not theirs', JSON.stringify(litres.answer.values) === '{"accessLevel":"full"}' && litres.numbers.length === 1, JSON.stringify(litres));
//     const held = { ...c, held: () => 12 };
//     expect('a value is cleared only when they ask', sends(held, ['Thank you.'], { values: { activityEmissions: null } }).numbers.length === 1 && sends(held, ['Please remove the pump emissions.'], { values: { activityEmissions: null } }).answer.values.activityEmissions === null, 'cleared unasked');
//     expect('what is sent back names each number and the kind, and says nothing is filled in', /operationalDays: 346/.test(sentBackNote(lost)) && /filled in none of it/.test(sentBackNote(lost)) && /the kind of project: A made-up kind/.test(sentBackNote({ numbers: [], kind: 'A made-up kind' })), sentBackNote(lost));
//
//     const label = (id) => PROJECT_TYPES.find((t) => t.id === id).name;
//     const unsaid = { ...c, kind: '', does: '' };
//     const files = (words, id, does = '') => sends({ ...unsaid, does }, words, { facts: { technology: { label: id === 'C-11' ? 'New or alternative water supply' : label(id) } } }).kind === null;
//     const plants = ['A central treatment plant that pipes safe water to homes.', 'We clean the river water at one point and sell it at a kiosk.', 'It is a purification plant for the town.', 'A plant with filters and chlorine, then a pipe to the village.', 'Not a supply but a treatment plant.', 'It is not only treatment, it is a whole plant.'];
//     expect('a treatment project is never filed as a supply, whatever the agent files', plants.every((text) => !files([text], 'CWS') && !files([text], 'C-11')), plants.filter((text) => files([text], 'CWS') || files([text], 'C-11')).join('; '));
//     expect('nor by a later word, nor when Wellington heard it', !files([plants[0], 'Well, call it a community water supply.'], 'CWS') && !files(['A community water supply.'], 'CWS', 'A central water treatment plant'), 'filed');
//     expect('nor as household treatment', !files([plants[0]], 'HWT'), 'filed');
//     expect('a kind nobody has said is not filed', ['CWS', 'HWT', 'IWT', 'CWT', 'C-11'].every((id) => !files(['It serves 400 people.'], id) && !files(['Yes.'], id)), 'filed');
//     expect('a kind their words bear out is filed', files(['A new borehole with a hand pump.'], 'CWS') && files(['Yes, that is right.'], 'CWS', 'A new borehole') && files(['A protected spring, with no treatment.'], 'CWS') && files(['Ceramic filters for families.'], 'HWT') && files(['Chlorine at four schools.'], 'IWT') && files([plants[0]], 'CWT') && files(['Rainwater tanks.'], 'C-11'), 'not filed');
//     expect('treatment with a new or restored source files nothing new, and the agent is told a person should look', ['HWT', 'IWT', 'CWT', 'CWS', 'C-11'].every((id) => !files(['A central treatment plant.', 'It also has a new borehole.'], id)) && /a person on the WaterBots team should look at it, and file no kind/.test(siteNote([], false)), 'filed');
//     expect('a kind already on the record is never changed from a chat, and the same one said again is no fault', sends({ ...c, kind: label('CWT') }, ['We have a new borehole.'], { facts: { technology: { label: label('CWS') } } }).kind === label('CWS') && sends({ ...c, kind: label('CWS') }, ['We have a new borehole.'], { facts: { technology: { label: label('CWS') } } }).kind === null, 'changed');
//     expect('one filed in a chat comes off when what they say next does not fit it', nowDenied(kindSaid(['A new borehole.', 'It is a treatment plant, really.']), label('CWS')) && !nowDenied(kindSaid(['A new borehole.', 'It is deep.']), label('CWS')) && nowDenied(kindSaid(['Filters for homes.', 'From a central plant.']), label('HWT')), 'stands');
//     const kinds = PROJECT_TYPES.filter((t) => t.axis === 'carbon');
//     expect('each agent is told the four kinds, one plain line each, from this site\'s own list', kinds.map((k) => k.id).sort().join() === 'CWS,CWT,HWT,IWT' && kinds.every((k) => siteNote(kinds, false).split('\n').filter((l) => l === `- ${k.id}, ${k.name}: ${k.plain}`).length === 1), siteNote(kinds, false));
//     expect('words for a kind are read, never a list of what is covered', !/covered/i.test(readFileSync(join('api', '_chatGuards.ts'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')), 'a list in the guards');
//
//     const daysMessage = 'Days of operation must be between 0 and 365.';
//     expect('400 days shows its message though the agent sent nothing', refusedIn('It runs 400 days a year.', c).join() === daysMessage, refusedIn('It runs 400 days a year.', c).join());
//     expect('so does a count of people below one, and the days of access', refusedIn('0 people', calvinGuard({ state: { ...supply, populationCount: null } }, [], lines)).join() === 'People served must be a whole number, 1 or more.' && refusedIn('about 400 days', v).join() === 'Days of access must be between 0 and 365.', refusedIn('about 400 days', v).join());
//     expect('and the answer to the question just asked, in any writing', refusedIn('minus ten', v).join() === 'Water before the project must be 0 or more.' && refusedIn('-3 million', c).join() === 'Water produced in a year must be 0 or more.', refusedIn('minus ten', v).join() + refusedIn('-3 million', c).join());
//     const filing = calvinGuard({ state: supply, transition: true }, [], lines);
//     expect('a share in percent is read as its share', refusedIn('140%', filing).join() === 'fNRB must be between 0 and 1.' && refusedIn('80%', filing).length === 0, refusedIn('140%', filing).join());
//     const fine = [['It runs 300 days a year.', c], ['0.8, from our 2019 filing', filing], ['We filed it in 2019 for 1,600 people.', filing], ['It failed 400 days ago.', c], ['5 million litres', c], ['1.600', c], ['It is brand-new.', v], ['leave it for now', v]];
//     expect('a number in range, or one that counts something else, shows nothing', fine.every(([text, guard]) => refusedIn(text, guard).length === 0), fine.map(([text, guard]) => [text, refusedIn(text, guard).join()]).filter(([, m]) => m).join('; '));
//
//     /* The record: core's own answer says which kind gives a figure, so the guard lifts the day core's list changes. */
//     const { createServer } = await import('vite');
//     const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error', optimizeDeps: { noDiscovery: true } });
//     try {
//       const { projectRecord, kindGivesFigure, kindOnRecord } = await vite.ssrLoadModule('/src/lib/projectRecord.ts');
//       const { toldVisit, kindNow } = await vite.ssrLoadModule('/src/lib/told.ts');
//       const { EMPTY_VISIT } = await vite.ssrLoadModule('/src/lib/visit.ts');
//       const { EMPTY_SHEET } = await vite.ssrLoadModule('/src/lib/worksheetState.ts');
//       const { TECHNOLOGY_LABELS } = await import('@waterbots/core/technologyLabels');
//       const visit = (type, gsClass, more = {}) => ({ ...EMPTY_VISIT, context: { ...EMPTY_VISIT.context, type, gsClass, ...more } });
//       const record = (at, sheet = EMPTY_SHEET, carbon = null) => projectRecord({ visit: at, sheet, carbon });
//       const gives = (type, gsClass, more) => ['calvin', 'violet'].map((agent) => kindGivesFigure(record(visit(type, gsClass, more)), agent)).join();
//       const want = [['', '', 'false,false'], ['C-19', '', 'false,false'], ['C-19', 'CWT', 'false,false'], ['C-19', 'IWT', 'false,false'], ['C-19', 'HWT', 'true,false'], ['C-19', 'CWS', 'true,true'], ['C-11', '', 'false,false'], ['C-3', '', 'false,false']];
//       expect('a kind not covered yet, or not said, gives no figure', want.every(([type, cls, w]) => gives(type, cls) === w) && gives('C-11', '', { homeUse: 'yes' }) === 'false,true', JSON.stringify(want.map(([type, cls]) => [type, cls, gives(type, cls)])));
//       const figure = { er: 1, version: 'paa' };
//       expect('and a figure handed over for one is not written to the record', record(visit('C-19', 'CWT'), EMPTY_SHEET, figure).agents.calvin?.estimate === undefined && record(visit('C-19', ''), EMPTY_SHEET, figure).agents.calvin?.estimate === undefined && record(visit('C-19', 'CWS'), EMPTY_SHEET, figure).agents.calvin?.estimate?.figure === 1, 'written');
//       const cwt = TECHNOLOGY_LABELS.find((t) => t.classId === 'CWT');
//       const before = { ...cwt };
//       Object.assign(cwt, { code: 'CWS', water: 'covered' });
//       const lifted = gives('C-19', 'CWT');
//       Object.assign(cwt, before);
//       delete cwt.code;
//       expect('the day core\'s list covers a class, its figure shows with no change here', lifted === 'true,true' && gives('C-19', 'CWT') === 'false,false', lifted);
//
//       const tell = (at, agent, given, unfile) => toldVisit(at, agent, given, record(at), unfile).visit;
//       const file = { technology: { label: label('CWS'), code: 'CWS' } };
//       const filed = tell(visit('C-19', ''), 'calvin', file);
//       const now = kindNow(filed, record(filed));
//       expect('a kind filed from a chat is kept as filed there, and goes when their words no longer fit it', filed.context.gsClass === 'CWS' && now.filedInChat && now.kind === label('CWS') && kindOnRecord(record(tell(filed, 'violet', {}, true))) === '' && gives('C-19', tell(filed, 'violet', {}, true).context.gsClass) === 'false,false', JSON.stringify(now));
//       expect('one anyone else gave is never changed or taken off', ['CWT', 'IWT', 'HWT'].every((cls) => tell(visit('C-19', cls), 'calvin', file).context.gsClass === cls && tell(visit('C-19', cls), 'calvin', {}, true).context.gsClass === cls) && tell(visit('C-3', ''), 'violet', file).context.type === 'C-3', 'changed');
//     } finally {
//       await vite.close();
//     }
//   }
  /* The link first, so nothing behind it is touched. */
  unlinkSync(join(out, 'node_modules'));
  rmSync(out, { recursive: true, force: true });
}
/* 5. The old sealed copy is gone. */
expect('carried/ is gone (V1, the maintainer\'s word of 14 Nov 2026)', !existsSync('carried'), 'carried/ still exists');
/* 6. creditedUnderV1 comes from the shared record alone (A29, J4, 23 Nov 2026). */
{
  const adapter = readFileSync(join('src', 'lib', 'calvinProject.ts'), 'utf8');
  const code = adapter.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  /* RETIRED 23 Nov 2026: A29 is built, so the field is set. Switched off, not deleted.
  expect(
    'the site leaves creditedUnderV1 unset, so every project gets the V2.0-only view until A29',
    !/creditedUnderV1/.test(code),
    'src/lib/calvinProject.ts sets creditedUnderV1'
  ); */
  /* SWITCHED OFF, 26 Nov 2026: the site builds his project with his package's own adapter (`calvinProjectFromRecord`, calvin
     0.8.0), which sets creditedUnderV1 from the shared record; this site's adapter only calls it. Not deleted.
  expect(
    'the site sets creditedUnderV1 only where the shared record says the project is transitioning (A29)',
    (code.match(/creditedUnderV1/g) ?? []).length === 2 && /facts\.creditedUnderV1\?\.value === true \? \{ creditedUnderV1: true \} : \{\}/.test(code),
    'src/lib/calvinProject.ts sets creditedUnderV1 some other way'
  ); */
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
    /useCalculatorState\(project, \{ exAnteOnly: true, unpinFigureBlock: true, hideExportButton: screening, place \}\)/.test(holder) && !/\.sticky\s*\{/.test(css),
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
    /* From core 0.6.0 (family 4): core's print part copies the whole screening report, his working inside it, into its
       own print area, so his working prints with it in the flow of the page; his time stamp is set before the copy. */
    'the working prints with the screening report, through core\'s print part, with his time stamp set first',
    (() => {
      const exporter = readFileSync(join('src', 'lib', 'exportReport.ts'), 'utf8');
      return /import \{ openReportInTab, printReport, type ExportOutcome \} from '@waterbots\/core\/print';/.test(exporter) &&
        /window\.dispatchEvent\(new Event\(REPORT_STAMP_EVENT\)\);\s*if \(opensInTab\(\)\) return openReportInTab\(report\) \? 'tab-chosen' : 'failed';\s*return printReport\(report\);/.test(exporter) &&
        /\.wb-print-root \.wb-screening-report,\s*body\.wb-report-tab \.wb-screening-report \{\s*display: block;/.test(base) &&
        /addEventListener\(REPORT_STAMP_EVENT, before\)/.test(holder) && /reportStamp\(\)/.test(holder);
    })(),
    'the screening report does not go through core\'s print part, or his time stamp is not set before the copy'
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

/* Family 4, rule 7 (core 0.6.0): one colour per agent, from core's colour list. Calvin is Reef and Violet is Orchid;
   this site's tokens for them must be the list's own values. The other three are not ruled yet (null in the list). */
{
  const { AGENT_COLOURS } = await import('@waterbots/core/agentColours');
  const tokens = readFileSync(join('src', 'styles', 'tokens.css'), 'utf8');
  const token = (name) => new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(tokens)?.[1]?.toLowerCase();
  expect(
    "Calvin's Reef and Violet's Orchid here are core's colour list's own values",
    AGENT_COLOURS.calvin?.hex.toLowerCase() === token('reef') && AGENT_COLOURS.violet?.hex.toLowerCase() === token('orchid') &&
      /--bot-calvin:\s*var\(--reef\)/.test(tokens) && /--bot-violet:\s*var\(--orchid\)/.test(tokens),
    `core ${AGENT_COLOURS.calvin?.hex} and ${AGENT_COLOURS.violet?.hex}, this site ${token('reef')} and ${token('orchid')}`
  );
}

console.log(failures ? `\nFAILED — ${failures} of ${passes + failures} checks did not hold.\n` : `\nPASSED — ${passes} checks: the release, the lockfile and the package's own cases.\n`);
process.exit(failures ? 1 : 0);
