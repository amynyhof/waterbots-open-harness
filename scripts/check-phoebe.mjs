/**
 * Phoebe — her machinery, without a model call.
 *
 * HER OWN GATE FROM 25 SEP 2026. Her assertions lived in
 * scripts/check-wellington.mjs, which had grown to hold both agents; his stayed
 * there and hers are here. Build-order step 3, pull request A.
 *
 * What it holds:
 *
 *   the tool files reach the runtime — the generated model and her prompt's
 *     tool section are current, and the rows, states and seats in them are the
 *     files' own;
 *   the five row states, and what the relay refuses — a Blocked verdict on a
 *     row whose card says a miss can be fixed, a Fixable row with no route from
 *     its own list, a state that carries a sentence and has none;
 *   the readiness read, computed from the rows by one function that the relay,
 *     the console and the desk row all call;
 *   staged loading — which card sets a turn is given at each stage, that a pack
 *     whose pathway does not apply is never loaded, and that a set already used
 *     stays loaded;
 *   her prompt's rules: guide not gate, ask the Eligibility rows only, show the
 *     rest once, the tools line, cite by token;
 *   her prompt's size, against a ceiling measured on the largest case;
 *   the hand-back, her cap, and the record and worksheet blocks she reads.
 *
 * NO MODEL CALL, NO MONEY. What only real calls can say — whether she keeps to
 * the rules — is measured by hand with scripts/measure-phoebe.mjs and
 * scripts/measure-phoebe-walk.mjs, and reported.
 *
 *   node scripts/check-phoebe.mjs
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

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

console.log('\nPhoebe — her machinery, without a model call\n');

/* ---------------------------------------------------------------------------
   The generated modules are current. A stale one would mean the relay and the
   console holding rows the maintainer never approved.
--------------------------------------------------------------------------- */

console.log('  The tool files reach the runtime\n');

for (const script of ['build-worksheet-module.mjs', 'build-prompt-modules.mjs']) {
  const run = spawnSync(process.execPath, [join('scripts', script), '--check'], { encoding: 'utf8' });
  expect(
    `${script} reports every generated module current`,
    run.status === 0,
    (run.stdout || '') + (run.stderr || '')
  );
}

/* ---------------------------------------------------------------------------
   Compile api/ as the platform sees it, and the browser lib beside it.
--------------------------------------------------------------------------- */

const apiOut = mkdtempSync(join(tmpdir(), 'wb-phoebe-api-'));
const compileApi = spawnSync(
  process.execPath,
  [
    join('node_modules', 'typescript', 'bin', 'tsc'),
    '-p', 'tsconfig.api.json',
    '--noEmit', 'false',
    '--outDir', apiOut,
    '--composite', 'false',
    '--declaration', 'false',
  ],
  { encoding: 'utf8' }
);
if (compileApi.status !== 0) {
  console.error('\n  FAILED — api/ did not compile.\n');
  console.error(compileApi.stdout || compileApi.stderr);
  rmSync(apiOut, { recursive: true, force: true });
  process.exit(1);
}
writeFileSync(join(apiOut, 'package.json'), '{"type":"module"}');
const loadApi = (name) => import(pathToFileURL(join(apiOut, name)).href);

const { SYSTEM_PROMPT, RESPONSE_SCHEMA, cardsBlock, setsFor, CARD_SETS, ON_REQUEST } = await loadApi('_systemPrompt.js');
const { PHOEBE_TOOL_MD } = await loadApi('_tool.generated.js');
const {
  TOOL_SECTIONS,
  ROW_STATES,
  PATHWAY_STATES,
  READINESS_READS,
  PHASE_SEATS,
  HER_PACKS,
  askedRows,
  canBlock,
  pathwayStateOf,
  readinessOf,
  rowsFor,
  section,
  shownGroups,
  verdictRows,
} = await loadApi('_worksheet.generated.js');
const { readSheet, worksheetBlock, readRecord, recordBlock, phoebeNotesBlock, RECORD_HEADING, WORKSHEET_HEADING } =
  await loadApi('_record.js');
const { readHandBack, HAND_BACKS } = await loadApi('_handBack.js');
const { PHOEBE } = await loadApi('_cap.js');

const relaySource = readFileSync(join('api', 'phoebe.ts'), 'utf8');
const clientSource = readFileSync(join('src', 'lib', 'phoebeClient.ts'), 'utf8');
const worksheetSource = readFileSync(join('src', 'components', 'EligibilityWorksheet.tsx'), 'utf8');

/* ---------------------------------------------------------------------------
   The model is the tool files', not the code's.
--------------------------------------------------------------------------- */

const water = section('vwba-2.0');
const carbon = section('gs-paa-v2.0');
const pathwayRowsOf = (pack) =>
  section(pack)
    .rows.filter((row) => row.takes.of === 'pathway-state')
    .map((row) => row.id);

expect(
  'both packs are in the model, each with its own section and version',
  water?.sectionId === 'water' && carbon?.sectionId === 'carbon' && /\d+\.\d+\.\d+/.test(water.version),
  JSON.stringify(TOOL_SECTIONS.map((s) => [s.pack, s.version]))
);
expect(
  'the water rows are the tool file’s, in the file’s own order',
  JSON.stringify(water.rows.map((r) => r.id)) === JSON.stringify(['W1', 'W2', '1', '2', '3', '4', '5', '6']),
  JSON.stringify(water.rows.map((r) => r.id))
);
expect(
  'the rows asked on this site are the Eligibility-phase rows and no others',
  JSON.stringify(askedRows('vwba-2.0').map((r) => r.id)) === JSON.stringify(['W1', 'W2', '1', '2', '4']) &&
    JSON.stringify(verdictRows('vwba-2.0').map((r) => r.id)) === JSON.stringify(['1', '2', '4']),
  JSON.stringify(askedRows('vwba-2.0').map((r) => r.id))
);
expect(
  'the eight carbon rows asked are the tool file’s Eligibility rows, P2 among them',
  JSON.stringify(verdictRows('gs-paa-v2.0').map((r) => r.id)) ===
    JSON.stringify(['M1', 'M2', 'M5', 'M6', 'M9', 'M13', 'P1', 'P2', 'G12']),
  JSON.stringify(verdictRows('gs-paa-v2.0').map((r) => r.id))
);
expect(
  'the five row states and their colours come from the tool file',
  JSON.stringify(ROW_STATES.map((s) => s.id)) === JSON.stringify(['unchecked', 'met', 'fixable', 'unknown', 'blocked']) &&
    ROW_STATES.find((s) => s.id === 'unchecked').colour === '--state-locked' &&
    ROW_STATES.find((s) => s.id === 'met').colour === '--state-approved',
  JSON.stringify(ROW_STATES.map((s) => [s.id, s.colour]))
);
expect(
  'the three pathway states and the three reads are the tool file’s words',
  JSON.stringify(PATHWAY_STATES.map((s) => s.id)) === JSON.stringify(['unchecked', 'applies', 'does-not-apply']) &&
    JSON.stringify(READINESS_READS.map((r) => r.id)) ===
      JSON.stringify(['likely-eligible', 'likely-not', 'not-enough-known']),
  JSON.stringify(READINESS_READS.map((r) => r.id))
);
expect(
  'every phase on the navigation has a seat, read from the roster',
  PHASE_SEATS.length === 6 && PHASE_SEATS.every((g) => g.seats.length > 0) &&
    PHASE_SEATS.find((g) => g.phase === 'partners').seats[0].names.join(' and ') === 'Bridget and Ally',
  JSON.stringify(PHASE_SEATS.map((g) => [g.phase, g.seats.map((s) => s.names).flat()]))
);
expect(
  'the shown groups run in the navigation’s order and Communicate is honestly empty',
  JSON.stringify(shownGroups('vwba-2.0').map((g) => g.phase)) ===
    JSON.stringify(['partners', 'quantify', 'plan', 'monitor', 'communicate']) &&
    shownGroups('vwba-2.0').find((g) => g.phase === 'communicate').rows.length === 0 &&
    shownGroups('vwba-2.0').find((g) => g.phase === 'partners').rows.map((r) => r.id).join(',') === '3,6',
  JSON.stringify(shownGroups('vwba-2.0').map((g) => [g.phase, g.rows.map((r) => r.id)]))
);
expect(
  'a class sorts the carbon rows, and no class hides none of them',
  rowsFor('gs-paa-v2.0', { gsClass: 'hwt' }).every((r) => !r.applies || r.applies.includes('hwt')) &&
    rowsFor('gs-paa-v2.0', { gsClass: 'hwt' }).length < rowsFor('gs-paa-v2.0').length &&
    rowsFor('gs-paa-v2.0').length === carbon.rows.length,
  `${rowsFor('gs-paa-v2.0', { gsClass: 'hwt' }).length} of ${carbon.rows.length}`
);
expect(
  'the carbon rows sorted by class are the tool file’s, and a class it does not name is not hidden',
  rowsFor('gs-paa-v2.0', { gsClass: 'hwt' }).some((r) => r.id === 'M3') &&
    !rowsFor('gs-paa-v2.0', { gsClass: 'hwt' }).some((r) => r.id === 'M2') &&
    rowsFor('gs-paa-v2.0', { gsClass: 'cws' }).some((r) => r.id === 'M2'),
  JSON.stringify(rowsFor('gs-paa-v2.0', { gsClass: 'hwt' }).map((r) => r.id))
);
expect(
  'the carbon pathway’s four tests are its own, and one of them is the version',
  JSON.stringify(pathwayRowsOf('gs-paa-v2.0')) === JSON.stringify(['T1', 'T2', 'T3']) &&
    carbon.rows.find((r) => r.id === 'T4')?.takes.of === 'version-flag',
  JSON.stringify(pathwayRowsOf('gs-paa-v2.0'))
);
expect(
  'only a row whose card allows it can ever be Blocked',
  canBlock('vwba-2.0', '4') === true && canBlock('vwba-2.0', '1') === false && canBlock('vwba-2.0', '2') === false,
  'the fixability line is not being read'
);

/* ---------------------------------------------------------------------------
   The reads, from the rows and from nothing else.
--------------------------------------------------------------------------- */

console.log('\n  The readiness read\n');

const met = { 1: 'met', 2: 'met', 4: 'met' };
expect(
  'every row met reads likely eligible',
  readinessOf('vwba-2.0', met) === 'likely-eligible',
  readinessOf('vwba-2.0', met)
);
expect(
  'one blocked row reads likely not, whatever else is met',
  readinessOf('vwba-2.0', { ...met, 4: 'blocked' }) === 'likely-not',
  readinessOf('vwba-2.0', { ...met, 4: 'blocked' })
);
expect(
  'a fixable or unknown row reads not enough known yet, and so does an untouched sheet',
  readinessOf('vwba-2.0', { ...met, 2: 'fixable' }) === 'not-enough-known' &&
    readinessOf('vwba-2.0', { ...met, 2: 'unknown' }) === 'not-enough-known' &&
    readinessOf('vwba-2.0', {}) === 'not-enough-known',
  'a read came back wrong'
);
expect(
  'the pathway applies only when every test says so, and one no settles it',
  pathwayStateOf('vwba-2.0', { W1: 'applies', W2: 'applies' }) === 'applies' &&
    pathwayStateOf('vwba-2.0', { W1: 'applies' }) === 'unchecked' &&
    pathwayStateOf('vwba-2.0', { W1: 'does-not-apply', W2: 'applies' }) === 'does-not-apply' &&
    pathwayStateOf('vwba-2.0', {}) === 'unchecked',
  'a pathway state came back wrong'
);

/* ---------------------------------------------------------------------------
   Staged loading — the maintainer's ruling R6, 25 Sep 2026.
--------------------------------------------------------------------------- */

console.log('\n  Staged loading\n');

const both = (state) => [
  { pack: 'vwba-2.0', state },
  { pack: 'gs-paa-v2.0', state },
];
const stage1 = setsFor({ pathways: both('unchecked') });
const stage2 = setsFor({
  pathways: [
    { pack: 'vwba-2.0', state: 'applies' },
    { pack: 'gs-paa-v2.0', state: 'unchecked' },
  ],
});
const bothApply = setsFor({ pathways: both('applies') });
const dropped = setsFor({
  pathways: [
    { pack: 'vwba-2.0', state: 'applies' },
    { pack: 'gs-paa-v2.0', state: 'does-not-apply' },
  ],
});

expect(
  'stage 1 is both packs’ applies cards and nothing else',
  JSON.stringify(stage1) === JSON.stringify(['water:applies', 'carbon:applies']),
  JSON.stringify(stage1)
);
expect(
  'a pathway that applies opens its own pack in full, and only its own',
  JSON.stringify(stage2) === JSON.stringify(['water:applies', 'water:eligibility', 'water:routes', 'carbon:applies']),
  JSON.stringify(stage2)
);
expect(
  'both pathways applying opens both packs, without the considerations',
  JSON.stringify(bothApply) ===
    JSON.stringify([
      'water:applies',
      'water:eligibility',
      'water:routes',
      'carbon:applies',
      'carbon:eligibility',
      'carbon:routes',
    ]),
  JSON.stringify(bothApply)
);
expect(
  'a pathway that does not apply is never loaded again, while the other one is',
  !dropped.some((set) => set.startsWith('carbon:')) && dropped.includes('water:eligibility'),
  JSON.stringify(dropped)
);
expect(
  'any set this turn does not carry can be asked for, not the considerations alone',
  JSON.stringify([...ON_REQUEST]) === JSON.stringify([...CARD_SETS]) &&
    JSON.stringify(RESPONSE_SCHEMA.properties.needCards.enum) === JSON.stringify(['none', ...CARD_SETS]),
  JSON.stringify(RESPONSE_SCHEMA.properties.needCards.enum)
);
expect(
  'the considerations arrive when every row is met, or when she has asked for them',
  setsFor({ pathways: [{ pack: 'vwba-2.0', state: 'applies' }], allMet: true }).includes('water:feasibility') &&
    setsFor({ pathways: [{ pack: 'vwba-2.0', state: 'unchecked' }], loaded: ['water:feasibility'] }).includes(
      'water:feasibility'
    ),
  'the feasibility door is shut'
);
expect(
  'a set already used stays loaded, so she cannot lose a card mid-conversation',
  setsFor({ pathways: [{ pack: 'vwba-2.0', state: 'unchecked' }], loaded: ['water:eligibility'] }).includes(
    'water:eligibility'
  ),
  'a loaded set was dropped'
);
expect(
  'the block says which sets are here and which are not, and never pretends a set is missing knowledge',
  cardsBlock(stage1).includes('Not on this turn') &&
    /never tell the visitor you have no card for it/.test(cardsBlock(stage1)) &&
    cardsBlock(CARD_SETS).includes('You have:') &&
    !cardsBlock(CARD_SETS).includes('Not on this turn'),
  'the staged block does not say what it holds'
);
expect(
  'stage 1 is far smaller than the whole of her cards',
  cardsBlock(stage1).length * 3 < cardsBlock(CARD_SETS).length,
  `${cardsBlock(stage1).length} against ${cardsBlock(CARD_SETS).length}`
);
expect(
  'the relay puts both cache breakpoints above the visitor’s own blocks',
  /text: SYSTEM_PROMPT, cache_control/.test(relaySource) &&
    /text: cardsBlock\(withSets\), cache_control/.test(relaySource) &&
    relaySource.indexOf('text: sheetText') > relaySource.lastIndexOf("cache_control: { type: 'ephemeral' }"),
  'a block is above a breakpoint, or a breakpoint is missing'
);
expect(
  'the one extra call happens only for a set she has not been given, and only once',
  /answer\.needCards !== 'none' && !usedSets\.includes\(answer\.needCards\)/.test(relaySource) &&
    /calls = 2/.test(relaySource),
  'the second pass is missing or unguarded'
);

/* ---------------------------------------------------------------------------
   Her prompt's size.

   THE CEILING IS MEASURED ON THE LARGEST CASE — both pathways in full, with the
   considerations — plus 500, the maintainer's ruling R6 of 25 Sep 2026, on the
   pattern of Wellington's gate. It moves on her word and on a measurement,
   never to make a build pass: the rule is report the trip, propose the number.

   203,787 FROM 25 SEP 2026, measured once the step was finished. With both
   packs switched on: the static half 43,854 characters, every card set
   159,433, so 203,287 in all, plus 500 of room. A visitor is almost never read that much — stage 1 is about 65,000
   and one pathway in full about 98,000 — but the ceiling guards the case that
   can actually happen, which is a project on both pathways that asks about the
   considerations too.

   IT WAS WRITTEN TWICE BEFORE THIS, EARLIER THE SAME DAY — 202,390, then
   203,174 — and neither was a bar moved to make a build pass. The number never
   left this pull request: it was first written when the carbon rules went in,
   and twice after that the measured runs found a real gap that a sentence in
   the prompt closed. She named the technology class in her reply without
   recording it, so she is now told to record it; then the words to record were
   not in front of her, so her tool text now lists them. The ceiling is defined
   as the largest case plus 500, so a prompt that legitimately grew has a
   legitimately larger ceiling, and every number it has held is written here.
   The maintainer owns the one that stands: if she would rather the prompt came
   back under an earlier number, the sentences come out.
--------------------------------------------------------------------------- */

console.log('\n  Her prompt’s size\n');

const LARGEST = 203_787;
const largest = SYSTEM_PROMPT.length + cardsBlock(CARD_SETS).length;
expect(
  'the largest case is under the measured ceiling',
  largest < LARGEST,
  `${largest} characters against ${LARGEST} — report the trip and propose the number; do not raise it to pass`
);
console.log(
  `        static ${SYSTEM_PROMPT.length}; stage 1 +${cardsBlock(stage1).length}; stage 2 +${cardsBlock(stage2).length}; every set +${cardsBlock(CARD_SETS).length}`
);

/* ---------------------------------------------------------------------------
   Her prompt's rules.
--------------------------------------------------------------------------- */

console.log('\n  Her rules\n');

expect(
  'her tool section is generated from the tool files and names the rows and the states',
  SYSTEM_PROMPT.includes(PHOEBE_TOOL_MD) &&
    /one tool: the eligibility worksheet/.test(PHOEBE_TOOL_MD) &&
    PHOEBE_TOOL_MD.includes('W1 — A water stewardship activity with a volume behind it') &&
    ROW_STATES.every((state) => PHOEBE_TOOL_MD.includes(state.label)),
  'her tool section is missing a row or a state'
);
expect(
  'the record fields in her tool section are named as the record block names them',
  ['What it does', 'What type', 'Stage', 'Where it is', 'What it is called'].every((label) =>
    PHOEBE_TOOL_MD.includes(`**${label}**`)
  ),
  'a field is named differently in the two places she reads'
);
expect(
  'she is a guide, not a gate, and the five states are rules with what each carries',
  /guide, not a gate/.test(SYSTEM_PROMPT) &&
    /Fixable is the ordinary "no"/.test(SYSTEM_PROMPT) &&
    /Unknown is not a fail/.test(SYSTEM_PROMPT) &&
    /Blocked is rare and it is the card's decision, not yours/.test(SYSTEM_PROMPT),
  'a state rule is missing from her prompt'
);
expect(
  'the tools line is a fact she phrases, said only where a Fixable or Unknown row shows',
  /WaterBots is building tools and resources on the paid site/.test(SYSTEM_PROMPT) &&
    /said where such a row shows and nowhere else/.test(SYSTEM_PROMPT) &&
    /Never press anyone to sign up/.test(SYSTEM_PROMPT),
  'the tools line is missing, or is not bounded'
);
expect(
  'she asks the Eligibility rows only, one a turn, and shows the rest once',
  /Ask the Eligibility-phase rows, in the order your tool lists them, one row and one question a turn/.test(
    SYSTEM_PROMPT
  ) &&
    /Never ask about two rows in one turn/.test(SYSTEM_PROMPT) &&
    /One answer may settle every row it genuinely settles/.test(SYSTEM_PROMPT) &&
    /The other rows are shown once and never asked/.test(SYSTEM_PROMPT),
  'the asked-and-shown rule is missing a part'
);
expect(
  'she says the phase names as written and points at a step, never a tab',
  /Eligibility, Partners, Quantify, Plan, Monitor, Communicate/.test(SYSTEM_PROMPT) &&
    /point at the step, never at a tab/.test(SYSTEM_PROMPT) &&
    /never at a "seat", a "console", a "dispatch" or a "surface"/.test(SYSTEM_PROMPT),
  'the phase-naming rule is missing'
);
expect(
  'the read is three words, one line per pathway, never merged',
  READINESS_READS.every((read) => SYSTEM_PROMPT.includes(read.label)) &&
    /never merged into one verdict for the project/.test(SYSTEM_PROMPT) &&
    /never a score, a percentage or a fraction/.test(SYSTEM_PROMPT),
  'the read rule is missing a part'
);
expect(
  'the applies tests run first, from the record, and the type is never a pathway verdict',
  /Run the applies tests first/.test(SYSTEM_PROMPT) &&
    /The type is a fact about the activity, never a pathway verdict/.test(SYSTEM_PROMPT),
  'the applies rule or the type rule is missing'
);
expect(
  'the stage changes what she says, not what she checks',
  /On paper or being built/.test(SYSTEM_PROMPT) && /Already running\*\* does not shut the water pathway/.test(SYSTEM_PROMPT),
  'the stage framing is missing'
);
expect(
  'both packs are hers, and which pathway a project fits is hers to find',
  /You read two packs, one per pathway/.test(SYSTEM_PROMPT) &&
    /A project may fit one, both or neither/.test(SYSTEM_PROMPT) &&
    /Which pathway a project fits is yours to find/.test(SYSTEM_PROMPT) &&
    JSON.stringify([...HER_PACKS]) === JSON.stringify(['vwba-2.0', 'gs-paa-v2.0']),
  'her scope and the packs she reads disagree'
);
expect(
  'the tests run on both pathways, one question covering both where one answer can',
  /Run the applies tests first, on both pathways/.test(SYSTEM_PROMPT) &&
    /Write a question to cover both pathways whenever one answer can/.test(SYSTEM_PROMPT) &&
    /A pathway that does not apply is said once, with its reason, and dropped/.test(SYSTEM_PROMPT),
  'a both-pathways rule is missing'
);
expect(
  'the class and the version sort the carbon rows, and a transitioning project hears its fact once',
  /technology class and the version sort the carbon rows/.test(SYSTEM_PROMPT) &&
    /never hears about boreholes/.test(SYSTEM_PROMPT) &&
    /transition-assistance module, overseen by trusted consultants/.test(SYSTEM_PROMPT) &&
    /goes into the sorts field on that same turn/.test(SYSTEM_PROMPT) &&
    /Saying it in your reply is not recording it/.test(SYSTEM_PROMPT),
  'the sorting rule, the field rule or the transition fact is missing'
);
expect(
  'a running project hears the carbon standard’s own rule before the walk, not after it',
  /Already running is hard on the carbon pathway, and you say so before the walk/.test(SYSTEM_PROMPT) &&
    /retroactive project/.test(SYSTEM_PROMPT) &&
    /the water pathway is separate/.test(SYSTEM_PROMPT),
  'the retroactive framing is missing'
);
expect(
  'the Monitor group opens with the reporting fact, and never marks a planned project down',
  /routine reporting is the critical part of impact funding/.test(SYSTEM_PROMPT) &&
    /never as a mark against a project that has not started/.test(SYSTEM_PROMPT),
  'the Monitor block’s fact is missing'
);
expect(
  'she cites by token and never writes a citation',
  /section:set\/id/.test(SYSTEM_PROMPT) &&
    /water:eligibility\/4/.test(SYSTEM_PROMPT) &&
    /You are placing a pointer, not writing a citation/.test(SYSTEM_PROMPT),
  'the citation rule is missing'
);
/* THE TOKEN IS THE CARD'S OWN ID. Measured 25 Sep 2026: told to cite
   "water:feasibility/7" she cited "water:feasibility/B-1", because B-1 is what
   the card is headed in its file — and a token the console cannot resolve is a
   citation the reader never sees. Her prompt now names the file's own form, and
   this holds the two together. */
const feasibilityHead = readFileSync(
  join('knowledge-packs', 'phoebe-eligibility', 'vwba-2.0', 'cards', 'feasibility-cards-vwba.md'),
  'utf8'
).match(/^## Card ([A-Za-z0-9-]+) —/m);
expect(
  'the example token she is given is the id the card file heads its cards with',
  feasibilityHead !== null &&
    SYSTEM_PROMPT.includes(`water:feasibility/${feasibilityHead[1].replace(/\d+$/, '')}`) &&
    /the id the card itself carries at its head/.test(SYSTEM_PROMPT),
  `the cards are headed ${feasibilityHead?.[1]} and her prompt shows a different shape`
);
const cardsModule = readFileSync(join('src', 'lib', 'phoebeCards.ts'), 'utf8');
expect(
  'the lookup takes the card file’s id and the bare number, so neither form is dropped',
  /id\.replace\(\/\^\[A-Za-z\]\+-\//.test(cardsModule),
  'a token in the cards’ own form would resolve to nothing'
);
expect(
  'nothing in her prompt tells her to say anything word for word',
  !/word for word/.test(SYSTEM_PROMPT),
  'a word-for-word rule appeared'
);
expect(
  'her prompt names both blocks she is sent, and keeps the cards as the only judge',
  SYSTEM_PROMPT.includes(RECORD_HEADING) &&
    SYSTEM_PROMPT.includes(`"${WORKSHEET_HEADING}"`) &&
    /only the cards decide that/.test(SYSTEM_PROMPT) &&
    /rather than from memory/.test(SYSTEM_PROMPT),
  'a block is unnamed in her prompt'
);
expect(
  'her prompt says her level and who leads',
  /you work at the \w+ level/.test(SYSTEM_PROMPT) &&
    /Wellington is the Team Lead, and he leads the visit/.test(SYSTEM_PROMPT),
  'her level sentence or her lead sentence is missing'
);

/* ---------------------------------------------------------------------------
   Her answer is checked, not trusted.
--------------------------------------------------------------------------- */

console.log('\n  What the relay refuses\n');

expect(
  'her schema closes every list it can, and requires the reply, the cites and the hand-back',
  JSON.stringify(RESPONSE_SCHEMA.properties.rows.items.properties.state.enum) ===
    JSON.stringify(['met', 'fixable', 'unknown', 'blocked']) &&
    JSON.stringify(RESPONSE_SCHEMA.properties.pathways.items.properties.state.enum) ===
      JSON.stringify(['applies', 'does-not-apply']) &&
    JSON.stringify(RESPONSE_SCHEMA.properties.needCards.enum) === JSON.stringify(['none', ...CARD_SETS]) &&
    JSON.stringify(RESPONSE_SCHEMA.properties.handBack.enum) === JSON.stringify(HAND_BACKS) &&
    RESPONSE_SCHEMA.required.includes('handBack'),
  JSON.stringify(RESPONSE_SCHEMA.required)
);
expect(
  'the relay refuses a Blocked verdict on a row whose card says the miss can be fixed',
  /state === 'blocked' && row\.fixable === 'yes'/.test(relaySource),
  'a blocked verdict could land on any row'
);
expect(
  'the relay refuses a Fixable row with no route from that row’s own list',
  /row\.routes\.includes\(r\)/.test(relaySource) && /state === 'fixable' && routes\.length === 0/.test(relaySource),
  'a fixable row could carry an invented route, or none'
);
expect(
  'the relay refuses a state that carries a sentence and has none',
  /CARRIES_A_SENTENCE\.includes\(state\) && because === ''/.test(relaySource),
  'a Met, Unknown or Blocked row could arrive with nothing said about it'
);
/* THE MARKER AND ITS EVIDENCE ARE THE SAME STRING. Measured in the browser on
   25 Sep 2026: an evidence id built from the pack while the marker carried the
   section put "[[water:applies/W1]]" in front of a reader as brackets. The id is
   the token now, and the pattern takes the capitals a card id carries. */
const markerSource = readFileSync(join('src', 'chat', 'evidence.ts'), 'utf8');
expect(
  'the marker pattern takes the capitals a card id carries',
  /A-Za-z0-9/.test(markerSource.slice(markerSource.indexOf('const MARKER'), markerSource.indexOf('const MARKER') + 120)),
  'a token like water:applies/W1 would reach the reader as brackets'
);
expect(
  'the evidence id is the token she wrote, and it is read from the field she fills',
  /resolveEvidence\(data\.cited\)/.test(clientSource) && /id: token,/.test(clientSource),
  'the marker and its evidence are built two different ways'
);
expect(
  'the client checks the same things again before anything is drawn',
  /row\.routes\.includes\(r\)/.test(clientSource) && /ROW_STATE_IDS\.find/.test(clientSource),
  'the client trusts the relay'
);
expect(
  'the hand-back is checked against its closed list on both sides',
  readHandBack('shelf') === 'none' && readHandBack('wellington') === 'wellington' &&
    /HAND_BACKS\.find\(\(h\) => h === data\.handBack\) \?\? 'none'/.test(clientSource),
  'an unknown hand-back could reach a caller'
);

/* ---------------------------------------------------------------------------
   The blocks she is sent.
--------------------------------------------------------------------------- */

console.log('\n  The worksheet block\n');

expect(
  'a junk sheet is nothing, never a block',
  readSheet('x') === null && readSheet([]) === null && readSheet([{ pack: 'nope', rows: [] }]) === null,
  'junk passed'
);
const sheet = readSheet([
  {
    pack: 'vwba-2.0',
    rows: [
      { id: '1', state: 'met', because: 'the volume is counted against the without-project case' },
      { id: '2', state: 'fixable', routes: ['R-2'] },
      { id: '9', state: 'met', because: 'a row that does not exist' },
      { id: '4', state: 'partly', because: 'a state that does not exist' },
    ],
  },
]);
expect(
  'a row or a state the tool file does not know is dropped whole',
  sheet.length === 1 && sheet[0].rows.map((r) => r.id).join(',') === '1,2',
  JSON.stringify(sheet)
);
const record = readRecord({ does: 'A borehole and piped supply', type: 'C-19', gsClass: 'CWS', stage: 'paper' });
const block = worksheetBlock(sheet, record);
expect(
  'the block names each pathway, its state, its rows and the read those rows give',
  block.startsWith(`# ${WORKSHEET_HEADING}`) &&
    /## The water pathway — Not yet checked/.test(block) &&
    /- 1: Met — the volume is counted/.test(block) &&
    /- 2: Fixable — route R-2/.test(block) &&
    /- 4: Not yet checked\./.test(block) &&
    /The read from these rows: \*\*Not enough known yet\*\*/.test(block),
  block
);
expect(
  'the block tells her to say the read the screen is showing, not a different one',
  /it is what the screen shows/.test(block),
  block
);
expect(
  'the record block carries only what was said and is never a verdict',
  recordBlock(record).includes('A borehole and piped supply') && /never a verdict on any row/.test(recordBlock(record)),
  recordBlock(record)
);
expect(
  'the done note asks for the read, the shown rows and the way back',
  /Give the read for each pathway/.test(phoebeNotesBlock({ eligibilityDone: true }) ?? '') &&
    /set handBack to "wellington"/.test(phoebeNotesBlock({ eligibilityDone: true }) ?? ''),
  phoebeNotesBlock({ eligibilityDone: true })
);

/* ---------------------------------------------------------------------------
   Her cap, and the number a visitor reads.
--------------------------------------------------------------------------- */

console.log('\n  Her cap\n');

expect('thirty a day, under her own name', PHOEBE.cap === 30 && PHOEBE.name === 'phoebe', JSON.stringify(PHOEBE));
const screenSource = readFileSync(join('src', 'components', 'PhoebeScreen.tsx'), 'utf8');
const primer = readFileSync(join('knowledge-packs', 'product-shared', 'agent-primer.md'), 'utf8');
expect(
  'the number a visitor reads, and the number an agent reads, are the cap itself',
  /Thirty messages a day/.test(screenSource) &&
    !/Twenty messages a day/.test(screenSource) &&
    /may send thirty messages a day/.test(primer.slice(primer.indexOf('### Phoebe'))),
  'a visitor or an agent is being told a number the code does not hold'
);

/* ---------------------------------------------------------------------------
   The worksheet on screen reads the same model.
--------------------------------------------------------------------------- */

console.log('\n  The worksheet on screen\n');

expect(
  'the screen draws its rows, its states and its seats from the generated model',
  /from '\.\.\/lib\/worksheet\.generated'/.test(worksheetSource) &&
    /askedRows\(/.test(worksheetSource) &&
    /shownGroups\(/.test(worksheetSource) &&
    /readiness\(/.test(worksheetSource),
  'the screen holds its own copy of the rows'
);
expect(
  'the screen says "likely" and never certifies',
  /Likely, not settled/.test(worksheetSource) && /reads likely eligible/.test(worksheetSource),
  'the banner overclaims'
);
expect(
  'the screen draws a route from its card, with the card’s citation',
  /routeFor\(/.test(worksheetSource) && /route!\.notPromise/.test(worksheetSource),
  'a route could be drawn without its citation or its limit'
);

/* ------------------------------------------------------------------------- */

rmSync(apiOut, { recursive: true, force: true });

console.log('');
if (problems.length) {
  console.log(`FAILED — ${problems.length} of ${checks} checks did not hold.\n`);
  for (const p of problems) console.log(`  · ${p}`);
  console.log('');
  process.exit(1);
}
console.log(`PASSED — ${checks} checks on Phoebe's machinery.\n`);
