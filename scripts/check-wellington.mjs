/**
 * Confirms Wellington's machinery holds its rules without a model call.
 *
 *   node scripts/check-wellington.mjs
 *
 * WHAT IT PROVES. That his relay checks the model's output rather than
 * trusting it — an unknown route becomes "none", an unknown type, class or stage is dropped,
 * an essay is not a project name, an empty reply is refused. That his region
 * of the primer reaches him and only him, and the roster names him for
 * Phoebe. That the visit's one-source-of-truth rule holds: a typed entry is
 * never overwritten by what he heard, a blank one takes the visitor's words,
 * and provenance says which. That his cap is thirty, under his own name.
 *
 * WHAT IT DOES NOT PROVE. How he actually answers. That is a measured walk with
 * real calls — scripts/measure-wellington.mjs — reported with counts, because
 * a check that spends money on every run is a check nobody runs.
 *
 * The api folder is compiled the way the platform compiles it, and the visit
 * module the way the pack checks compile theirs.
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

console.log('\nWellington — the machinery, without a model call\n');

/* ---------------------------------------------------------------------------
   Compile api/ as the platform would see it.
--------------------------------------------------------------------------- */

const apiOut = mkdtempSync(join(tmpdir(), 'wb-wellington-api-'));
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

const { validate } = await loadApi('_wellingtonAnswer.js');
const { WELLINGTON, WELLINGTON_DAILY_CAP, PHOEBE } = await loadApi('_cap.js');
const { WELLINGTON_SYSTEM_PROMPT, WELLINGTON_RESPONSE_SCHEMA } = await loadApi('_wellingtonPrompt.js');
const { AGENT_PRIMER_MD } = await loadApi('_primer.generated.js');
const { WELLINGTON_PRIMER_MD } = await loadApi('_wellingtonPrimer.generated.js');
const { PROJECT_TYPES_MD, PROJECT_TYPES, PROJECT_TYPE_IDS, GS_CLASS_IDS, PROJECT_STAGE_IDS, DRINKING_WATER_TYPE } = await loadApi('_projectTypes.generated.js');
const { WELLINGTON_BUILD_UPDATE_MD } = await loadApi('_buildUpdate.generated.js');
const { SYSTEM_PROMPT: PHOEBE_PROMPT } = await loadApi('_systemPrompt.js');

/* ---------------------------------------------------------------------------
   The output is checked, not trusted.
--------------------------------------------------------------------------- */

console.log('  His output is checked, not trusted\n');

const ok = validate({ reply: 'Phoebe covers that. You will find her on the Eligibility tab.', route: 'eligibility', abstained: false });
expect('a well-formed answer passes with its route', ok !== null && ok.route === 'eligibility', JSON.stringify(ok));

const unknownRoute = validate({ reply: 'Try the archive tab for that.', route: 'archive', abstained: false });
expect('an unknown route becomes "none", never an invented destination', unknownRoute?.route === 'none', `got ${unknownRoute?.route}`);

expect('an empty reply is refused', validate({ reply: '   ', route: 'none', abstained: false }) === null, 'an empty reply passed');
expect('a missing reply is refused', validate({ route: 'none', abstained: false }) === null, 'a missing reply passed');

const ctx = validate({
  reply: 'Thanks — a borehole in Turkana. Phoebe can say whether it counts.',
  route: 'eligibility',
  abstained: false,
  context: { name: 'Turkana borehole', place: 'Turkana, Kenya', type: 'C-19', gsClass: 'CWS', stage: 'paper' },
});
expect(
  'stated context comes through — name, place, type, class, stage',
  ctx?.context?.name === 'Turkana borehole' && ctx?.context?.place === 'Turkana, Kenya' && ctx?.context?.type === 'C-19' && ctx?.context?.gsClass === 'CWS' && ctx?.context?.stage === 'paper',
  JSON.stringify(ctx?.context)
);
const badType = validate({ reply: 'Noted, that sounds like a biodiversity project.', route: 'none', abstained: false, context: { type: 'biodiversity', gsClass: 'solar', stage: 'soon' } });
expect('an unknown type, class or stage is dropped, never recorded', badType?.context === undefined, JSON.stringify(badType?.context));
expect('a class is never a type', validate({ reply: 'Noted.', route: 'none', abstained: false, context: { type: 'CWS' } })?.context === undefined, 'a class landed as a type');
expect('a class without a drinking-water type is dropped', validate({ reply: 'Noted.', route: 'none', abstained: false, context: { type: 'C-11', gsClass: 'HWT' } })?.context?.gsClass === undefined, 'a class rode beside C-11');
expect('a class beside a drinking-water type already on the visit is kept', validate({ reply: 'Noted.', route: 'none', abstained: false, context: { gsClass: 'HWT' } }, { type: 'C-19' })?.context?.gsClass === 'HWT', 'the class was dropped although the visit holds C-19');
expect('"none of these" is a first-class type', validate({ reply: 'None of these fits, and that is fine. Phoebe can sort it.', route: 'eligibility', abstained: false, context: { type: 'NONE' } })?.context?.type === 'NONE', 'NONE was dropped');
const essay = validate({ reply: 'Noted.', route: 'none', abstained: false, context: { name: 'x'.repeat(400) } });
expect('an essay is not a project name', essay?.context === undefined, 'a 400-character name was kept');
const blanks = validate({ reply: 'Tell me a little more about where it is.', route: 'none', abstained: false, context: { name: '  ', place: '' } });
expect('blank context fields are omitted, not stored as blanks', blanks?.context === undefined, JSON.stringify(blanks?.context));

const abst = validate({ reply: 'That is not something this console holds.', route: 'none', abstained: true, abstentionTopic: 'carbon price' });
expect('an abstention keeps its topic', abst?.abstained === true && abst?.abstentionTopic === 'carbon price', JSON.stringify(abst));
const notAbst = validate({ reply: 'Phoebe covers that.', route: 'eligibility', abstained: false, abstentionTopic: 'stray' });
expect('a topic without an abstention is dropped', notAbst?.abstentionTopic === undefined, 'a stray topic was kept');

expect(
  'the schema closes the route list',
  JSON.stringify(WELLINGTON_RESPONSE_SCHEMA.properties.route.enum) === JSON.stringify(['none', 'eligibility', 'quantification', 'map', 'paid']),
  JSON.stringify(WELLINGTON_RESPONSE_SCHEMA.properties.route.enum)
);
expect(
  'the schema closes the type, class and stage lists to the file\'s',
  JSON.stringify(WELLINGTON_RESPONSE_SCHEMA.properties.context.properties.type.enum) === JSON.stringify(PROJECT_TYPE_IDS) &&
    JSON.stringify(WELLINGTON_RESPONSE_SCHEMA.properties.context.properties.gsClass.enum) === JSON.stringify(GS_CLASS_IDS) &&
    JSON.stringify(WELLINGTON_RESPONSE_SCHEMA.properties.context.properties.stage.enum) === JSON.stringify(PROJECT_STAGE_IDS) &&
    !('kind' in WELLINGTON_RESPONSE_SCHEMA.properties.context.properties),
  'a list is open, or kind survived'
);
expect('the type list is the file\'s: twenty water types and NONE, four classes, C-19 the one that takes a class', PROJECT_TYPE_IDS.length === 21 && PROJECT_TYPE_IDS[0] === 'C-1' && PROJECT_TYPE_IDS[19] === 'C-20' && PROJECT_TYPE_IDS[20] === 'NONE' && JSON.stringify(GS_CLASS_IDS) === JSON.stringify(['HWT', 'IWT', 'CWT', 'CWS']) && DRINKING_WATER_TYPE === 'C-19' && PROJECT_TYPES.length === 25, `${PROJECT_TYPE_IDS.length} types, ${GS_CLASS_IDS.length} classes`);
expect('the short form carries every id and no page cite', PROJECT_TYPES.every((t) => PROJECT_TYPES_MD.includes(`- ${t.id} — ${t.name}: `)) && !/\(Table|\(Appendix|pp?\. \d/.test(PROJECT_TYPES_MD), 'an id is missing from the short form, or a cite got in');
expect('his prompt carries the short form and the confirm-then-log rule, and never "what kind"', WELLINGTON_SYSTEM_PROMPT.includes(PROJECT_TYPES_MD) && /Return type only after the visitor says yes/.test(WELLINGTON_SYSTEM_PROMPT) && /return stage only on the visitor's yes/.test(WELLINGTON_SYSTEM_PROMPT) && /Never say the id/.test(WELLINGTON_SYSTEM_PROMPT) && !/what kind/i.test(WELLINGTON_SYSTEM_PROMPT), 'the list, the rule or the retirement is missing');
expect("Phoebe's prompt does not carry the type list", !PHOEBE_PROMPT.includes(PROJECT_TYPES_MD), 'the type list leaked into her prompt');

/* ---------------------------------------------------------------------------
   His region reaches him and only him.
--------------------------------------------------------------------------- */

console.log('\n  His region reaches him, and only him\n');

/* The primer lives in the shared pack from 17 Sep 2026. */
const primerSource = readFileSync('knowledge-packs/product-shared/agent-primer.md', 'utf8');
const rosterBegin = primerSource.indexOf('<!-- AGENT-FACING: BEGIN -->');
const rosterEnd = primerSource.indexOf('<!-- AGENT-FACING: END -->');
const hisBegin = primerSource.indexOf('<!-- WELLINGTON-FACING: BEGIN -->');
const hisEnd = primerSource.indexOf('<!-- WELLINGTON-FACING: END -->');
expect('both regions exist and are disjoint', rosterBegin >= 0 && rosterEnd > rosterBegin && hisBegin > rosterEnd && hisEnd > hisBegin, `positions ${rosterBegin} ${rosterEnd} ${hisBegin} ${hisEnd}`);

expect('his region carries facts and rules, and no scripted line', /The facts about the crew/.test(WELLINGTON_PRIMER_MD) && /The rules you keep/.test(WELLINGTON_PRIMER_MD) && !/^> "/m.test(WELLINGTON_PRIMER_MD) && !/word for word/.test(WELLINGTON_PRIMER_MD), 'a scripted line is in his region');
expect('the roster names him for his colleagues', /Wellington — the desk/.test(AGENT_PRIMER_MD) && /Team Lead/.test(AGENT_PRIMER_MD), 'the roster has no Wellington');
expect("Phoebe's prompt carries the roster but not his region", PHOEBE_PROMPT.includes('Wellington — the desk') && !PHOEBE_PROMPT.includes('The rules you keep'), 'his region leaked into her prompt, or the roster left it');
expect('his prompt carries the roster and his region, and none of her cards', WELLINGTON_SYSTEM_PROMPT.includes(AGENT_PRIMER_MD.trim().slice(0, 200)) && WELLINGTON_SYSTEM_PROMPT.includes('The rules you keep') && !/Criterion 1/.test(WELLINGTON_SYSTEM_PROMPT), 'his prompt is mis-assembled');
expect('no prompt tells any agent to say anything word for word — ruling 1, 3 Sep 2026', !/word for word/.test(WELLINGTON_SYSTEM_PROMPT) && !/word for word/.test(PHOEBE_PROMPT), 'a word-for-word rule survived');
expect('his prompt carries the dated build update as facts he phrases, and the region is dated', WELLINGTON_SYSTEM_PROMPT.includes('# The build update, when asked') && WELLINGTON_SYSTEM_PROMPT.includes(WELLINGTON_BUILD_UPDATE_MD.trim().slice(0, 120)) && /^# The build, as of \d{1,2} \w+ \d{4}/m.test(WELLINGTON_BUILD_UPDATE_MD) && /Not live/.test(WELLINGTON_BUILD_UPDATE_MD) && !/^> "/m.test(WELLINGTON_BUILD_UPDATE_MD), 'the build update is missing, undated, or scripted');
expect('the roster gives facts, not quoted lines, for every colleague', !/^> "/m.test(AGENT_PRIMER_MD), 'a quoted colleague sentence is still live in the roster');
expect('both prompts carry the voice rule — plain sentences a twelve-year-old could read', /twelve-year-old/.test(WELLINGTON_SYSTEM_PROMPT), 'the voice rule is missing from his prompt');
expect('his prompt states the five things he never does', /quote no figure/.test(WELLINGTON_SYSTEM_PROMPT) && /never invent/i.test(WELLINGTON_SYSTEM_PROMPT) && /abstain and route/i.test(WELLINGTON_SYSTEM_PROMPT) && /Screening language only/.test(WELLINGTON_SYSTEM_PROMPT) && /never press a visitor to sign up/i.test(WELLINGTON_SYSTEM_PROMPT), 'a rule is missing');
/* The ceiling was 20,000 until 7 Sep 2026. Three rules the maintainer added
   that week — phase names, no tabs, plain words — each cost about a hundred
   characters, and trimming rules to fit a round number had started working
   against the rules. 24,000 was the engineer's raise, said so after, and the
   maintainer's ruling that gates change on her word came from it.

   26,197 FROM 24 SEP 2026, THE MAINTAINER'S RULING, by the measured amount:
   the trim of the same day (#118) took his prompt to 19,811; the type-and-
   stage build then added the twenty-five-line short form of the project-type
   list (4,034) and the confirm-then-log and stage rules, and it measured
   25,697. Her word: raise by the measured amount to leave 500 characters of
   room, and record the number with the reason. 25,697 + 500 = 26,197. It
   still keeps any card set out: Phoebe's, the smallest of hers, is over
   40,000. */
expect('his prompt is small — no card sets', WELLINGTON_SYSTEM_PROMPT.length < 26197 && PHOEBE_PROMPT.length > 40000, `his ${WELLINGTON_SYSTEM_PROMPT.length} chars, hers ${PHOEBE_PROMPT.length}`);

/* ---------------------------------------------------------------------------
   The record the desk carries to Phoebe — slice 3, 7 Sep 2026.
--------------------------------------------------------------------------- */

console.log('\n  The record carried to Phoebe\n');
const { readRecord, recordBlock, visitBlock, phoebeNotesBlock, RECORD_HEADING, VISIT_HEADING } = await loadApi('_record.js');
expect('a junk record is nothing, never a block', readRecord('x') === null && readRecord({}) === null && readRecord({ does: '   ' }) === null && readRecord(null) === null, 'junk passed');
expect('type, class and stage come only from the closed lists', readRecord({ type: 'gold', stage: 'soon' }) === null && readRecord({ type: 'C-11' })?.type === 'C-11' && readRecord({ stage: 'running' })?.stage === 'running', 'an unknown type or stage leaked');
expect('a class rides only beside a drinking-water type', readRecord({ type: 'C-11', gsClass: 'HWT' })?.gsClass === '' && readRecord({ type: 'C-19', gsClass: 'HWT' })?.gsClass === 'HWT' && readRecord({ gsClass: 'HWT' }) === null, 'a class rode alone or beside C-11');
expect('an over-long field is dropped whole, never cut', readRecord({ does: 'x'.repeat(281) }) === null && readRecord({ does: 'x'.repeat(280) })?.does.length === 280, 'length handling');
const block = recordBlock(readRecord({ does: 'Boreholes for households', place: 'Kampala, Uganda' }));
expect('the block carries only what was said, and says it is never a verdict', block.includes('Boreholes for households') && block.includes('Kampala, Uganda') && !block.includes('What type') && !block.includes('Stage') && !block.includes('What it is called') && /never a verdict/.test(block), block);
const typedBlock = recordBlock(readRecord({ does: 'A borehole', type: 'C-19', gsClass: 'CWS', stage: 'paper' }));
expect("the block names the type, its class and the stage in the standard's words, never by id alone", /- What type: Access to potable water supply — Giving households/.test(typedBlock) && /- Which class of drinking-water project: Community water supply technologies — /.test(typedBlock) && /- Stage: on paper — still a plan/.test(typedBlock) && !/C-19/.test(typedBlock), typedBlock);
expect("Phoebe's prompt names the block and keeps the cards as the only judge", PHOEBE_PROMPT.includes(RECORD_HEADING) && /only the cards decide that/.test(PHOEBE_PROMPT), 'her prompt does not know the block');

/* Contract lines 2, 7, 8 and 10 — item A15, 21 Sep 2026. Her tool comes from
   her pack's tool README, generated; it must name the four record fields as
   the block prints them, the six rows, and the record block's own heading,
   so what she is told about her inputs cannot drift from what she is sent. */
const RECORD_FIELDS = ['What it does', 'What type', 'Stage', 'Where it is', 'What it is called'];
expect(
  "Phoebe's prompt carries her tool from her pack — the six rows, the four record fields as the block names them, and the block's heading",
  /# Your tool/.test(PHOEBE_PROMPT) &&
    /one tool: the eligibility worksheet/.test(PHOEBE_PROMPT) &&
    /Six rows/.test(PHOEBE_PROMPT) &&
    RECORD_FIELDS.every((f) => PHOEBE_PROMPT.includes(`**${f}**`)) &&
    PHOEBE_PROMPT.includes(`"${RECORD_HEADING}"`),
  'her tool section is missing, or names a field the block does not print'
);
expect(
  "Phoebe's tool section says where a row's value comes from and what a row takes, and never a number",
  /Where a row's value comes from/.test(PHOEBE_PROMPT) && /never takes\s+a number/.test(PHOEBE_PROMPT) && /ask for everything you need/.test(PHOEBE_PROMPT),
  'line 10 is not in her tool section'
);
expect(
  "Phoebe's prompt says her level and who leads",
  /you work at the \w+ level/.test(PHOEBE_PROMPT) && /Wellington is the Team Lead, and he leads the visit/.test(PHOEBE_PROMPT),
  'her level sentence or her lead sentence is missing'
);

/* ---------------------------------------------------------------------------
   The same record reaches Wellington — 16 Sep 2026. With facts on the visit,
   his next turn is told not to ask for those same facts; with an empty visit
   there is no block, so he may still ask. No model call.
--------------------------------------------------------------------------- */

console.log('\n  The visit record Wellington reads\n');
const shared = readRecord({ does: 'Boreholes for households', place: 'Kampala, Uganda' });
expect(
  'both blocks share the field lines',
  recordBlock(shared).includes('- What it does: Boreholes for households') &&
    visitBlock(shared).includes('- What it does: Boreholes for households') &&
    recordBlock(shared).includes('- Where it is: Kampala, Uganda') &&
    visitBlock(shared).includes('- Where it is: Kampala, Uganda'),
  'field lines drifted'
);
const hisBlock = visitBlock(
  readRecord({ does: 'Boreholes for households', name: 'Walk Borehole', place: 'Turkana, Kenya', type: 'C-19', gsClass: 'CWS', stage: 'building' })
);
expect(
  'with facts on the visit, the block lists them — including type, class and stage — and tells him not to re-ask',
  hisBlock.includes(VISIT_HEADING) &&
    hisBlock.includes('Boreholes for households') &&
    hisBlock.includes('Walk Borehole') &&
    hisBlock.includes('Turkana, Kenya') &&
    /What type: Access to potable water supply/.test(hisBlock) &&
    /Which class of drinking-water project: Community water supply technologies/.test(hisBlock) &&
    /Stage: being built/.test(hisBlock) &&
    /Do not ask for them again as if they were blank/.test(hisBlock) &&
    !/never a verdict/.test(hisBlock) &&
    !/only the cards decide/.test(hisBlock),
  hisBlock
);
expect(
  'a missing field is omitted, so he may still ask for it',
  visitBlock(readRecord({ does: 'wells', name: 'Walk' })).includes('wells') &&
    visitBlock(readRecord({ does: 'wells', name: 'Walk' })).includes('Walk') &&
    !visitBlock(readRecord({ does: 'wells', name: 'Walk' })).includes('Where it is') &&
    !visitBlock(readRecord({ does: 'wells', name: 'Walk' })).includes('What type') &&
    !visitBlock(readRecord({ does: 'wells', name: 'Walk' })).includes('Stage'),
  visitBlock(readRecord({ does: 'wells', name: 'Walk' }))
);
expect('with an empty visit there is no block, so he may still ask', readRecord({}) === null && readRecord(null) === null, 'empty produced a record');
expect(
  'his prompt names the visit block and tells him not to re-ask what it holds',
  WELLINGTON_SYSTEM_PROMPT.includes(VISIT_HEADING) &&
    /do not ask for them again as if they were blank/.test(WELLINGTON_SYSTEM_PROMPT) &&
    /Type, class and stage are never in a carried link/.test(WELLINGTON_SYSTEM_PROMPT),
  'the visit block is missing from his prompt'
);
expect("Phoebe's prompt still does not carry his visit heading", !PHOEBE_PROMPT.includes(VISIT_HEADING), 'his heading leaked into her prompt');
expect(
  "Phoebe's record block is unchanged when there are no extra notes",
  /never a verdict/.test(recordBlock(readRecord({ does: 'wells' }))) && phoebeNotesBlock({}) === null,
  'her block grew extra notes by default'
);
expect(
  'a first-open note tells her to greet at screening and not invent a method',
  /just opened Eligibility/.test(phoebeNotesBlock({ opened: true })) && /Do not invent a method/.test(phoebeNotesBlock({ opened: true })),
  phoebeNotesBlock({ opened: true })
);
expect(
  'a done note sends them back to Wellington on Dispatches',
  /Send them back to Wellington on Dispatches/.test(phoebeNotesBlock({ eligibilityDone: true })),
  phoebeNotesBlock({ eligibilityDone: true })
);
/* The worksheet as it stands — contract line 3, item A15, step 3, 21 Sep 2026.
   The rows are checked, not trusted: a number outside the manual's six, an
   unknown state, a route on a Met row, an over-long route, a duplicate row —
   each is dropped whole. An empty or junk list sends no block. */
const { readWorksheet, worksheetBlock, WORKSHEET_HEADING } = await loadApi('_record.js');
expect('a junk worksheet is nothing, never a block', readWorksheet('x') === null && readWorksheet([]) === null && readWorksheet([{ number: 9, state: 'met' }]) === null && readWorksheet([{ number: 1, state: 'partly' }]) === null, 'junk rows passed');
expect(
  'a route forward is kept only on a Not yet row, and never over-long',
  readWorksheet([{ number: 2, state: 'met', routeForward: 'x' }])?.[0].routeForward === undefined &&
    readWorksheet([{ number: 2, state: 'not-yet', routeForward: 'A written record of the consultation.' }])?.[0].routeForward === 'A written record of the consultation.' &&
    readWorksheet([{ number: 2, state: 'not-yet', routeForward: 'x'.repeat(501) }]) === null,
  'route handling'
);
expect('rows come back in the manual\'s order, one per number', JSON.stringify(readWorksheet([{ number: 3, state: 'unchecked' }, { number: 1, state: 'met' }, { number: 1, state: 'not-yet', routeForward: 'again' }]).map((r) => r.number)) === '[1,3]', 'order or dedupe');
const sheet = worksheetBlock(readWorksheet([{ number: 1, state: 'met' }, { number: 2, state: 'not-yet', routeForward: 'A written record.' }, { number: 3, state: 'unchecked' }]));
expect(
  'the block names each row\'s state, where a verdict came from, and the one rule',
  sheet.startsWith(`# ${WORKSHEET_HEADING}`) && /Row 1: Met — from your own earlier turn/.test(sheet) && /Row 2: Not yet — what would change it: A written record\./.test(sheet) && /Row 3: Not yet checked\./.test(sheet) && /Start from the first row not yet checked/.test(sheet),
  sheet
);
expect("Phoebe's prompt names the worksheet block and reads her state from it", PHOEBE_PROMPT.includes(`"${WORKSHEET_HEADING}"`) && /rather than from memory/.test(PHOEBE_PROMPT), 'her prompt does not know the worksheet block');
expect("Wellington's prompt does not carry the worksheet block", !WELLINGTON_SYSTEM_PROMPT.includes(WORKSHEET_HEADING), 'the worksheet heading leaked into his prompt');
const phoebeRelaySource = readFileSync('api/phoebe.ts', 'utf8');
expect(
  "Phoebe's relay attaches the worksheet block after the cache breakpoint, only when rows came",
  /readWorksheet\(body\.worksheet\)/.test(phoebeRelaySource) &&
    /worksheetText/.test(phoebeRelaySource) &&
    phoebeRelaySource.indexOf('text: worksheetText') > phoebeRelaySource.indexOf("cache_control: { type: 'ephemeral' }"),
  'the worksheet block is missing, or sits above the cache breakpoint'
);

/* The hand-back — contract line 8, item A15, step 4, 21 Sep 2026. A field
   the console acts on, never a sentence it reads: checked against a closed
   list of two by the relay and again by the client, an unknown value "none",
   never a destination. Her prompt says when to set it, and the done note
   says so too; her schema requires it so a turn cannot leave it out. */
console.log('\n  The hand-back — contract line 8\n');
const { readHandBack, HAND_BACKS } = await loadApi('_handBack.js');
expect('the closed list is none and wellington, and nothing else', JSON.stringify(HAND_BACKS) === '["none","wellington"]', JSON.stringify(HAND_BACKS));
expect('an unknown, missing or invented hand-back is "none", never a destination', readHandBack(undefined) === 'none' && readHandBack('shelf') === 'none' && readHandBack('Wellington') === 'none' && readHandBack(1) === 'none' && readHandBack({}) === 'none', 'an unknown value leaked');
expect('"wellington" passes as itself', readHandBack('wellington') === 'wellington' && readHandBack('none') === 'none', 'the known values did not pass');
const { RESPONSE_SCHEMA: PHOEBE_SCHEMA } = await loadApi('_systemPrompt.js');
expect(
  'her schema requires the field and closes its list',
  PHOEBE_SCHEMA.required.includes('handBack') && JSON.stringify(PHOEBE_SCHEMA.properties.handBack?.enum) === JSON.stringify(HAND_BACKS),
  JSON.stringify({ required: PHOEBE_SCHEMA.required, enum: PHOEBE_SCHEMA.properties.handBack?.enum })
);
expect(
  'her prompt says when to set it: her part done, or out of her lane, and rung 2 still speaks',
  /Set handBack to "wellington"/.test(PHOEBE_PROMPT) && /every row on the worksheet has a verdict/.test(PHOEBE_PROMPT) && /out of your lane/.test(PHOEBE_PROMPT) && /still say the colleague's facts in your own plain words/.test(PHOEBE_PROMPT) && /back to the shelf/.test(PHOEBE_PROMPT),
  'the hand-back rule is missing or reworded past its parts'
);
expect('the done note sets the field as well as saying so', /set handBack to "wellington"/.test(phoebeNotesBlock({ eligibilityDone: true }) ?? ''), phoebeNotesBlock({ eligibilityDone: true }));
expect('the relay reads the field through the closed list and returns it', /readHandBack\(v\.handBack\)/.test(phoebeRelaySource) && /handBack: HandBack;/.test(phoebeRelaySource), 'the relay does not read the hand-back through _handBack');
const phoebeClientSource = readFileSync(join('src', 'lib', 'phoebeClient.ts'), 'utf8');
expect('the client checks it again against the same two words', /HAND_BACKS: readonly HandBack\[\] = \['none', 'wellington'\]/.test(phoebeClientSource) && /HAND_BACKS\.find\(\(h\) => h === data\.handBack\) \?\? 'none'/.test(phoebeClientSource), 'the client trusts the field or lists a third word');
const phoebeScreenSource = readFileSync(join('src', 'components', 'PhoebeScreen.tsx'), 'utf8');
const commonsSeatSource = readFileSync(join('src', 'components', 'CommonsSeats.tsx'), 'utf8');
expect(
  'the console draws the way back from the field alone — Dispatches on the console, the shelf on the Commons — and never reads her prose',
  /answer\.handBack === 'wellington'/.test(phoebeScreenSource) && /onNavigate\('desk'\)/.test(phoebeScreenSource) && /answer\.handBack === 'wellington'/.test(commonsSeatSource) && /Back to the shelf/.test(commonsSeatSource) && !/answer\.reply\.(includes|match|search)/.test(phoebeScreenSource + commonsSeatSource),
  'a consumer does not act on the field, or reads the prose'
);

const relaySource = readFileSync('api/wellington.ts', 'utf8');
expect(
  'the relay attaches the visit block after the cache breakpoint, only when a record or stage is present',
  /readRecord\(body\.record\)/.test(relaySource) &&
    /readStage\(body\.stage\)/.test(relaySource) &&
    /visitText/.test(relaySource) &&
    relaySource.indexOf("cache_control: { type: 'ephemeral' }") >= 0 &&
    relaySource.indexOf('text: visitText') > relaySource.indexOf("cache_control: { type: 'ephemeral' }"),
  'the visit block is missing, or sits above the cache breakpoint'
);

/* ---------------------------------------------------------------------------
   His cap.
--------------------------------------------------------------------------- */

console.log('\n  His cap\n');
expect('thirty a day, under his own name', WELLINGTON.cap === 30 && WELLINGTON_DAILY_CAP === 30 && WELLINGTON.name === 'wellington', JSON.stringify(WELLINGTON));
expect("Phoebe's is thirty from 23 Sep 2026, her ruling on the phase-tags proposal", PHOEBE.cap === 30, `got ${PHOEBE.cap}`);

/* ---------------------------------------------------------------------------
   The visit: one source of truth, two writers, one rule.
--------------------------------------------------------------------------- */

console.log('\n  The visit: typed entries are never overwritten\n');

const libOut = mkdtempSync(join(tmpdir(), 'wb-wellington-lib-'));
const compileLib = spawnSync(
  process.execPath,
  [
    join('node_modules', 'typescript', 'bin', 'tsc'),
    join('src', 'lib', 'visit.ts'),
    join('src', 'lib', 'carried.ts'),
    join('src', 'lib', 'journey.ts'),
    join('src', 'lib', 'criteriaState.ts'),
    '--outDir', libOut,
    '--module', 'commonjs',
    '--moduleResolution', 'node',
    '--target', 'es2022',
    '--skipLibCheck',
    '--esModuleInterop',
  ],
  { encoding: 'utf8' }
);
if (compileLib.status !== 0) {
  console.error('\n  FAILED — src/lib/visit.ts did not compile.\n');
  console.error(compileLib.stdout || compileLib.stderr);
  rmSync(apiOut, { recursive: true, force: true });
  rmSync(libOut, { recursive: true, force: true });
  process.exit(1);
}
writeFileSync(join(libOut, 'package.json'), '{"type":"commonjs"}');
const {
  EMPTY_CONTEXT,
  EMPTY_VISIT,
  typedContext,
  learnedContext,
  pinnedContext,
  applyWellingtonRoute,
  applyEligibilityProgress,
  openedEligibility,
  currentInvite,
  nextStepRows,
  deskRows,
  eligibilityDone,
  inviteSurface,
} = createRequire(import.meta.url)(join(libOut, 'visit.js'));
const { nextPhaseCompetes } = createRequire(import.meta.url)(join(libOut, 'journey.js'));

const typed = typedContext(EMPTY_CONTEXT, 'name', 'Walk Borehole');
expect('a typed name carries typed provenance', typed.name === 'Walk Borehole' && typed.provenance.name === 'typed', JSON.stringify(typed));
const heard = learnedContext(typed, { name: 'The borehole project', place: 'Turkana', type: 'C-11', stage: 'paper' });
expect('a typed name is never overwritten by what he heard', heard.name === 'Walk Borehole' && heard.provenance.name === 'typed', JSON.stringify(heard));
expect('a blank place takes his hearing, marked as from the conversation', heard.place === 'Turkana' && heard.provenance.place === 'chat', JSON.stringify(heard));
expect('the type and the stage land with their provenance', heard.type === 'C-11' && heard.provenance.type === 'chat' && heard.stage === 'paper' && heard.provenance.stage === 'chat', JSON.stringify(heard));
expect('a class lands only beside a drinking-water type, and a change of type clears it', learnedContext(EMPTY_CONTEXT, { type: 'C-11', gsClass: 'HWT' }).gsClass === '' && learnedContext(EMPTY_CONTEXT, { type: 'C-19', gsClass: 'HWT' }).gsClass === 'HWT' && learnedContext(learnedContext(EMPTY_CONTEXT, { type: 'C-19', gsClass: 'HWT' }), { type: 'C-11' }).gsClass === '', 'the class rode where it should not');
const retyped = typedContext(heard, 'place', 'Turkana County, Kenya');
expect('the visitor can still overtype a heard place, and it becomes typed', retyped.place === 'Turkana County, Kenya' && retyped.provenance.place === 'typed', JSON.stringify(retyped));
const heardAgain = learnedContext(retyped, { place: 'somewhere else' });
expect('and once typed, his later hearing does not move it', heardAgain.place === 'Turkana County, Kenya', JSON.stringify(heardAgain));
const cleared = typedContext(retyped, 'place', '');
expect('clearing a field clears its provenance', cleared.place === '' && cleared.provenance.place === '', JSON.stringify(cleared));

const pin = { hybasId: 1040041430, pfafId: 1, level: 4, stressLabel: 'Arid and Low Water Use', subAreaKm2: 87466 };
const pinned = pinnedContext(EMPTY_CONTEXT, pin);
expect('a pin fills a blank place, marked as from the pin', /HYBAS 1040041430/.test(pinned.place) && pinned.provenance.place === 'pin', JSON.stringify(pinned));
expect('a pin never overwrites a typed place', pinnedContext(typedContext(EMPTY_CONTEXT, 'place', 'Nairobi'), pin).place === 'Nairobi', 'the pin overwrote a typed place');
expect('a pin never overwrites a place told to Wellington', pinnedContext(learnedContext(EMPTY_CONTEXT, { place: 'Turkana' }), pin).place === 'Turkana', 'the pin overwrote a heard place');
expect("the visitor's words to Wellington replace a pin-filled place", learnedContext(pinned, { place: 'Turkana' }).place === 'Turkana', 'the pin outranked the visitor');
expect('unpinning clears only a place the pin wrote', pinnedContext(pinned, null).place === '' && pinnedContext(learnedContext(EMPTY_CONTEXT, { place: 'Turkana' }), null).place === 'Turkana', 'unpinning touched the wrong place');
expect('"none of these" is a type the visit keeps', learnedContext(EMPTY_CONTEXT, { type: 'NONE' }).type === 'NONE', 'NONE was dropped');
expect('the empty context has no kind field — retired 24 Sep 2026', !('kind' in EMPTY_CONTEXT) && !('kind' in EMPTY_CONTEXT.provenance), 'kind survived');
expect('the empty context has no standard-of-interest field', !('standard' in EMPTY_CONTEXT), 'the chips concept survived');

console.log('\n  The screening loop — invite first, place does not skip\n');
expect('a new visit starts at learn', EMPTY_VISIT.stage === 'learn' && EMPTY_VISIT.eligibilityInvite === '', JSON.stringify(EMPTY_VISIT.stage));
const placed = { ...EMPTY_VISIT, context: learnedContext(EMPTY_CONTEXT, { place: 'Turkana, Kenya', does: 'wells' }) };
expect(
  'a filled place does not move the stage to Partners',
  placed.stage === 'learn' && currentInvite(placed) === null,
  JSON.stringify(placed.stage)
);
const derivedWhileLearning = deskRows(placed, [], []);
expect(
  'deskRows would still make a map row from place, which is why Next Steps must not use them raw',
  derivedWhileLearning.some((r) => r.from === 'bridget'),
  JSON.stringify(derivedWhileLearning)
);
expect(
  'nextStepRows hides the map row during learn, so place cannot force Map first',
  nextStepRows(placed, [], []).every((r) => r.from !== 'bridget') && nextStepRows(placed, [], []).length === 0,
  JSON.stringify(nextStepRows(placed, [], []))
);
const invited = applyWellingtonRoute(placed, 'eligibility', 'Phoebe can take this on the Eligibility step.');
expect(
  'his Eligibility route starts that stage and stores the real invite',
  invited.stage === 'eligibility' &&
    invited.eligibilityInvite === 'Phoebe can take this on the Eligibility step.' &&
    currentInvite(invited)?.action.surface === 'eligibility' &&
    currentInvite(invited)?.primary === true &&
    nextStepRows(invited, [], [])[0]?.key === 'invite-eligibility' &&
    nextStepRows(invited, [], []).every((r) => r.from !== 'bridget'),
  JSON.stringify(nextStepRows(invited, [], []))
);
expect(
  'the desk Next phase competes with an Eligibility invite, so the top chip must quiet',
  nextPhaseCompetes('desk', inviteSurface(invited)) === true && nextPhaseCompetes('desk', null) === false,
  'Next phase would still stand beside the rail primary'
);
expect(
  'Phoebe\'s Next phase is Partners, so an Eligibility invite does not hide it as the same move',
  nextPhaseCompetes('eligibility', inviteSurface(invited)) === false,
  'Phoebe\'s chip was treated as the Eligibility primary'
);
expect('a map route during Eligibility does not skip to Partners', applyWellingtonRoute(invited, 'map', 'Open the map.').stage === 'eligibility', 'the map route skipped Eligibility');
const opened = openedEligibility(EMPTY_VISIT);
expect('opening Eligibility during learn starts that stage', opened.stage === 'eligibility', opened.stage);
const doneSheet = [
  { state: 'met' },
  { state: 'not-yet', routeForward: 'consult the community' },
];
expect('eligibility is done when every criterion has a verdict', eligibilityDone(doneSheet) === true && eligibilityDone([{ state: 'unchecked' }]) === false, 'the done test failed');
const handed = applyEligibilityProgress(invited, doneSheet);
expect(
  'finishing Eligibility hands back to Wellington, not to the map yet',
  handed.stage === 'partners' &&
    handed.invitedPartners === false &&
    currentInvite(handed)?.action.surface === 'desk' &&
    nextStepRows(handed, doneSheet, [])[0]?.key === 'invite-desk',
  JSON.stringify(currentInvite(handed))
);
const mapped = applyWellingtonRoute(handed, 'map', 'Pin the basin on the Partners step.');
expect(
  'after he invites Partners, Next Steps names the map and says Bridget is not live',
  mapped.invitedPartners === true &&
    currentInvite(mapped)?.action.surface === 'map' &&
    /not answering yet/.test(currentInvite(mapped).sentence),
  JSON.stringify(currentInvite(mapped))
);
const quantified = applyWellingtonRoute(mapped, 'quantification', 'Open Quantify.');
expect(
  'Quantify invite names the calculator and says Calvin is not live',
  quantified.stage === 'quantify' &&
    currentInvite(quantified)?.action.surface === 'quantification' &&
    /not answering yet/.test(currentInvite(quantified).sentence),
  JSON.stringify(currentInvite(quantified))
);
const navSource = readFileSync('src/components/NavRail.tsx', 'utf8');
expect('empty record fields do not say Wellington asks this', !/Wellington asks this/.test(navSource), 'the caption is still there');
const phoebeSource = readFileSync('src/components/PhoebeScreen.tsx', 'utf8');
expect(
  "Phoebe's first open copies his real invite, then asks without a visitor bubble",
  /speaker: WELLINGTON/.test(phoebeSource) && /askOpened/.test(phoebeSource) && /eligibilityInvite/.test(phoebeSource),
  'the copy or the first-open ask is missing'
);
const screenSource = readFileSync('src/screen/AgentScreen.tsx', 'utf8');
const railSource = readFileSync('src/components/CrewRail.tsx', 'utf8');
const deskSourceForInvite = readFileSync('src/components/Desk.tsx', 'utf8');
expect(
  'the top Next phase chip hides when it is the same move as the rail invite',
  /next && !nextQuiet/.test(screenSource) && /nextPhaseCompetes\('desk', inviteSurface\)/.test(deskSourceForInvite),
  'the top chip still stands beside the rail primary'
);
expect(
  'the rail invite is the filled primary, and derived rows stay quiet links',
  /row\.primary \? 'wb-invite-action' : 'wb-row-action'/.test(railSource) &&
    /wb-invite-action/.test(readFileSync('src/styles/base.css', 'utf8')),
  'the rail invite is not the one filled primary'
);
expect(
  'his prompt names the screening loop and forbids a fake live chat',
  /Eligibility with Phoebe/.test(WELLINGTON_SYSTEM_PROMPT) && /Do not invent a live chat/.test(WELLINGTON_SYSTEM_PROMPT),
  'the loop rule is missing from his prompt'
);

/* ---------------------------------------------------------------------------
   One conversation, held by the shell. The desk is a frame around it and
   starts none of its own; any second frame shares the same machine.
--------------------------------------------------------------------------- */

console.log('\n  One conversation\n');

const appSource = readFileSync('src/App.tsx', 'utf8');
const deskSource = readFileSync('src/components/Desk.tsx', 'utf8');
expect('the shell holds the one conversation', /useConversation\(/.test(appSource), 'the conversation is not in the shell');
expect('the desk does not start a conversation of its own', !/useConversation\(/.test(deskSource) && !/askWellington/.test(deskSource), 'the desk has its own machine');

/* ---------------------------------------------------------------------------
   A question carried in from the production landing — the receiver, item
   S13, 9 Sep 2026. Optional does, name and place joined it on 15 Sep 2026.
   The contract is `?question=<≤500>[&does=<≤300>][&name=<≤80>][&place=<≤80>]`,
   percent-encoded UTF-8. Omit empty keys. No type, class or stage. No provenance in the URL.
   Bad or empty input is ignored with no error: the page opens honestly empty
   and never invents a question or a fact.
--------------------------------------------------------------------------- */

console.log('\n  A carried question\n');

const {
  CARRIED_PARAM,
  CARRIED_MAX_CHARS,
  CARRIED_DOES_MAX_CHARS,
  CARRIED_NAME_MAX_CHARS,
  CARRIED_PLACE_MAX_CHARS,
  readCarriedQuestion,
  readCarriedFacts,
  withoutCarried,
} = createRequire(import.meta.url)(join(libOut, 'carried.js'));
expect('the parameter is "question" and the cap is 500 decoded characters', CARRIED_PARAM === 'question' && CARRIED_MAX_CHARS === 500, `got ${CARRIED_PARAM}, ${CARRIED_MAX_CHARS}`);
expect('a real question comes through, decoded and trimmed', readCarriedQuestion('?question=%20We%20want%20a%20borehole%20in%20Turkana.%20Where%20do%20we%20start%3F%20') === 'We want a borehole in Turkana. Where do we start?', `got "${readCarriedQuestion('?question=%20We%20want%20a%20borehole%20in%20Turkana.%20Where%20do%20we%20start%3F%20')}"`);
expect('a whole address works as well as a query string', readCarriedQuestion('https://map.waterbots.ai/?question=hello%20there#x') === 'hello there', 'a whole address was not read');
expect('non-ASCII comes through as typed — UTF-8, the way encodeURIComponent writes it', readCarriedQuestion('?question=' + encodeURIComponent('¿Un pozo en Oaxaca — por dónde empezamos?')) === '¿Un pozo en Oaxaca — por dónde empezamos?', 'UTF-8 was mangled');
expect('a missing parameter is nothing', readCarriedQuestion('') === null && readCarriedQuestion('?handoff=abc') === null, 'something was read from nothing');
expect('a blank question is nothing, never an empty bubble', readCarriedQuestion('?question=') === null && readCarriedQuestion('?question=%20%20%09') === null, 'a blank was kept');
expect(`a question over ${CARRIED_MAX_CHARS} characters is ignored whole, never cut`, readCarriedQuestion('?question=' + 'x'.repeat(CARRIED_MAX_CHARS + 1)) === null && readCarriedQuestion('?question=' + 'x'.repeat(CARRIED_MAX_CHARS)) !== null, 'the cap did not hold');
expect('a sequence that does not decode is a broken link, ignored whole', readCarriedQuestion('?question=hello%E0%A4%A') === null && readCarriedQuestion('?question=%FF%FE') === null, 'a broken encoding was shown with holes');
expect('runs of whitespace and newlines fold to one space', readCarriedQuestion('?question=a%0A%0Ab%20%20c') === 'a b c', `got "${readCarriedQuestion('?question=a%0A%0Ab%20%20c')}"`);
expect('only the first question= is read', readCarriedQuestion('?question=first&question=second') === 'first', 'the second one won');
expect('the address is cleaned of the question and keeps everything else', withoutCarried('https://map.waterbots.ai/?a=1&question=hi%20there&b=2#frag') === 'https://map.waterbots.ai/?a=1&b=2#frag', `got ${withoutCarried('https://map.waterbots.ai/?a=1&question=hi%20there&b=2#frag')}`);
expect('an address with no carried keys is returned untouched', withoutCarried('https://map.waterbots.ai/?handoff=t1') === 'https://map.waterbots.ai/?handoff=t1', 'a clean address was rewritten');

expect('the shell reads the address once, cleans it, and hands the question to the one conversation', /readCarriedQuestion\(window\.location\.search\)/.test(appSource) && /history\.replaceState/.test(appSource) && /sendCarried\(question, \{ carried: true \}\)/.test(appSource) && /setSurface\('desk'\)/.test(appSource), 'the receiver is not in the shell, or does not clean the address');
const clientSource = readFileSync('src/lib/wellingtonClient.ts', 'utf8');
expect(
  'the flag reaches the relay only as true, and a typed turn sends no flag',
  /if \(carried\) body\.carried = true/.test(clientSource) && !/carried: false/.test(clientSource) && !/carried: carried/.test(clientSource),
  'the client sends the flag loosely'
);
expect(
  'the client sends the visit record only when it is filled',
  /if \(record\) body\.record = record/.test(clientSource),
  'the record is not on the request, or is sent when empty'
);
const adapterSource = readFileSync('src/lib/wellington.ts', 'utf8');
expect(
  'the adapter reads the visit at send time and omits a blank record',
  /recordFrom\(visit\)/.test(adapterSource) &&
    /return record\.does \|\| record\.type \|\| record\.stage \|\| record\.place \|\| record\.name \? record : null/.test(adapterSource),
  'a blank visit would still be posted'
);
expect(
  'the first carried send reads the visit from a ref written before the send, not the last paint',
  /visitRef\.current/.test(appSource) &&
    /learnedContext\(visitRef\.current\.context, learned\)/.test(appSource) &&
    /wellingtonAsk\(onLearned, \(\) => visitRef\.current, onRouted\)/.test(appSource) &&
    /void sendCarried\(question, \{ carried: true \}\)/.test(appSource),
  'the first ask can still see a blank visit'
);

console.log('\n  Carried facts — does, name, place\n');

expect(
  'the fact caps are 300, 80 and 80',
  CARRIED_DOES_MAX_CHARS === 300 && CARRIED_NAME_MAX_CHARS === 80 && CARRIED_PLACE_MAX_CHARS === 80,
  `got ${CARRIED_DOES_MAX_CHARS}, ${CARRIED_NAME_MAX_CHARS}, ${CARRIED_PLACE_MAX_CHARS}`
);
const fullFacts = readCarriedFacts(
  '?question=hello&does=' +
    encodeURIComponent('  Boreholes for households  ') +
    '&name=' +
    encodeURIComponent(' Walk Borehole ') +
    '&place=' +
    encodeURIComponent('Turkana, Kenya')
);
expect(
  'good facts come through trimmed, and question is not among them',
  fullFacts.does === 'Boreholes for households' &&
    fullFacts.name === 'Walk Borehole' &&
    fullFacts.place === 'Turkana, Kenya' &&
    !('question' in fullFacts) &&
    !('kind' in fullFacts),
  JSON.stringify(fullFacts)
);
expect('a whole address works for facts as well as a query string', readCarriedFacts('https://map.waterbots.ai/?name=Walk#x').name === 'Walk', JSON.stringify(readCarriedFacts('https://map.waterbots.ai/?name=Walk#x')));
expect(
  'non-ASCII facts come through as typed',
  readCarriedFacts('?place=' + encodeURIComponent('Oaxaca — el valle')).place === 'Oaxaca — el valle',
  JSON.stringify(readCarriedFacts('?place=' + encodeURIComponent('Oaxaca — el valle')))
);
expect('missing facts are an empty object, never invented', Object.keys(readCarriedFacts('')).length === 0 && Object.keys(readCarriedFacts('?question=hello')).length === 0, JSON.stringify(readCarriedFacts('?question=hello')));
expect(
  'blank and whitespace-only facts are omitted',
  Object.keys(readCarriedFacts('?does=&name=%20%20&place=%09')).length === 0,
  JSON.stringify(readCarriedFacts('?does=&name=%20%20&place=%09'))
);
expect(
  'an over-long fact is ignored whole, never cut, and does not drop a good sibling',
  readCarriedFacts('?does=' + 'x'.repeat(CARRIED_DOES_MAX_CHARS + 1) + '&name=Walk').name === 'Walk' &&
    readCarriedFacts('?does=' + 'x'.repeat(CARRIED_DOES_MAX_CHARS + 1) + '&name=Walk').does === undefined &&
    readCarriedFacts('?does=' + 'x'.repeat(CARRIED_DOES_MAX_CHARS)).does?.length === CARRIED_DOES_MAX_CHARS &&
    readCarriedFacts('?name=' + 'x'.repeat(CARRIED_NAME_MAX_CHARS + 1)).name === undefined &&
    readCarriedFacts('?place=' + 'x'.repeat(CARRIED_PLACE_MAX_CHARS + 1)).place === undefined,
  JSON.stringify(readCarriedFacts('?does=' + 'x'.repeat(CARRIED_DOES_MAX_CHARS + 1) + '&name=Walk'))
);
expect(
  'a broken encoding on one fact is ignored, and a good sibling is kept',
  readCarriedFacts('?does=hello%E0%A4%A&name=Walk').name === 'Walk' &&
    readCarriedFacts('?does=hello%E0%A4%A&name=Walk').does === undefined &&
    readCarriedFacts('?place=%FF%FE').place === undefined,
  JSON.stringify(readCarriedFacts('?does=hello%E0%A4%A&name=Walk'))
);
expect('runs of whitespace in a fact fold to one space', readCarriedFacts('?does=a%0A%0Ab%20%20c').does === 'a b c', JSON.stringify(readCarriedFacts('?does=a%0A%0Ab%20%20c')));
expect('only the first of each fact key is read', readCarriedFacts('?name=first&name=second').name === 'first', JSON.stringify(readCarriedFacts('?name=first&name=second')));
expect('a type, class or stage in the address is never read', readCarriedFacts('?type=C-19&gsClass=CWS&stage=paper&does=wells').type === undefined && readCarriedFacts('?type=C-19&stage=paper&does=wells').stage === undefined && readCarriedFacts('?type=C-19&does=wells').does === 'wells', JSON.stringify(readCarriedFacts('?type=C-19&does=wells')));
expect(
  'the address is cleaned of question and facts, and keeps unknown keys and the fragment',
  withoutCarried('https://map.waterbots.ai/?a=1&does=wells&question=hi&name=Walk&place=Turkana&kind=water#frag') ===
    'https://map.waterbots.ai/?a=1&kind=water#frag',
  withoutCarried('https://map.waterbots.ai/?a=1&does=wells&question=hi&name=Walk&place=Turkana&kind=water#frag')
);
expect(
  'facts without a question are still stripped',
  withoutCarried('https://map.waterbots.ai/?does=wells&name=Walk') === 'https://map.waterbots.ai/',
  withoutCarried('https://map.waterbots.ai/?does=wells&name=Walk')
);

const stamped = learnedContext(EMPTY_CONTEXT, readCarriedFacts('?does=wells&name=Walk&place=Turkana'));
expect(
  'carried facts stamp chat provenance on the visit',
  stamped.does === 'wells' &&
    stamped.provenance.does === 'chat' &&
    stamped.name === 'Walk' &&
    stamped.provenance.name === 'chat' &&
    stamped.place === 'Turkana' &&
    stamped.provenance.place === 'chat' &&
    stamped.type === '' &&
    stamped.provenance.type === '' &&
    stamped.stage === '' &&
    stamped.provenance.stage === '',
  JSON.stringify(stamped)
);
expect(
  'the shell writes carried facts into the visit through learnedContext',
  /readCarriedFacts\(window\.location\.search\)/.test(appSource) &&
    /carriedFacts\.current/.test(appSource) &&
    /learnedContext\(v\.context, learned\)/.test(appSource),
  'facts are not written through learnedContext'
);
expect('the shell does not toast a bad carry', !/toast/i.test(appSource), 'a toast was added for a bad carry');
expect('the contract comment names the four keys and forbids type, class and stage', /question=<≤500>\[&does=<≤300>\]\[&name=<≤80>\]\[&place=<≤80>\]/.test(readFileSync('src/lib/carried.ts', 'utf8')) && /No type, class or stage/.test(readFileSync('src/lib/carried.ts', 'utf8')), 'the contract comment does not match Shell A');

/* ---------------------------------------------------------------------------
   The walk in order and the shown line — contract lines 4 and 5, item A15,
   step 5, 21 Sep 2026. The prompt carries the order rule; the caption is
   drawn from her verdicts and the class the citation line wears, never from
   prose; both seats attach it only under a turn that moved a row. How she
   actually walks is measured with real calls — scripts/measure-phoebe-walk.mjs.
--------------------------------------------------------------------------- */

console.log('\n  The walk in order, and the shown line — contract lines 4 and 5\n');
expect(
  'her prompt walks the rows in order, one row, one question, from the first unchecked',
  /Walk the rows in the manual's order — one row, one question/.test(PHOEBE_PROMPT) && /Never ask about two rows in one turn/.test(PHOEBE_PROMPT) && /the question you ask is always about the first row still unchecked/.test(PHOEBE_PROMPT),
  'the order rule is missing or reworded past its parts'
);
const { worksheetCaption, initialStatuses } = createRequire(import.meta.url)(join(libOut, 'criteriaState.js'));
expect('the shown line counts Met and Not yet on the whole worksheet, and not the unchecked', worksheetCaption([{ state: 'met' }, { state: 'not-yet', routeForward: 'x' }, { state: 'met' }, { state: 'unchecked' }, { state: 'unchecked' }, { state: 'unchecked' }]) === 'Worksheet: 2 Met · 1 Not yet', worksheetCaption([{ state: 'met' }]));
expect('an untouched worksheet reads as zeros, never as six failures', worksheetCaption(initialStatuses(6)) === 'Worksheet: 0 Met · 0 Not yet', worksheetCaption(initialStatuses(6)));
const transcriptSource = readFileSync(join('src', 'chat', 'Transcript.tsx'), 'utf8');
expect("the layer draws the caption in the citation line's own class, no new colour", /turn\.caption && <div className="wb-cite-line"/.test(transcriptSource), 'the caption is drawn in a class of its own, or not at all');
expect(
  'both seats draw it from her verdicts only under a turn that moved a row, never from prose',
  /answer\.updates\.length\s*\?\s*\{ caption: worksheetCaption\(applyCriterionUpdates\(statuses, answer\.updates\)\) \}/.test(phoebeScreenSource) && /answer\.updates\.length\s*\?\s*\{ caption: worksheetCaption\(applyCriterionUpdates\(statuses, answer\.updates\)\) \}/.test(commonsSeatSource) && !/caption: [^w]/.test(phoebeScreenSource + commonsSeatSource),
  'a seat draws the caption from something other than the moved rows'
);

/* ---------------------------------------------------------------------------
   HER SCOPE, AND THE INSTRUMENT THAT LEFT — the maintainer's rulings of
   21 Sep 2026 at eyeball stop 4.

   Her scope reaches her as facts she phrases herself (ruling of 3 Sep 2026,
   item A9), so what is checked is that the facts are there and that no
   sentence is handed to her to repeat. What she actually says is a measured
   run, not a check.

   The A6 instrument is gone from both relays. A switch that comes back by
   habit is exactly what a check is for.
--------------------------------------------------------------------------- */

console.log('\n  Her scope today, and the instrument that left\n');
expect(
  'her prompt carries the scope as facts: VWBA 2.0 eligibility today, carbon coming and not live',
  PHOEBE_PROMPT.includes('# What you check today, and what is coming') &&
    PHOEBE_PROMPT.includes('Today you check one pathway: eligibility under VWBA 2.0') &&
    PHOEBE_PROMPT.includes('Carbon eligibility is a second pathway, and it is coming') &&
    PHOEBE_PROMPT.includes('you have no carbon cards'),
  'the scope facts are missing or reworded past their parts'
);
expect(
  'the scope is given to her as facts to phrase, never as a sentence to repeat',
  PHOEBE_PROMPT.includes('Say them in your own plain words'),
  'the phrasing rule left the scope section'
);
for (const relay of ['phoebe', 'wellington']) {
  const source = readFileSync(join('api', relay + '.ts'), 'utf8');
  expect(
    'the A6 instrument is out of ' + relay + "'s relay — no PHOEBE_DIAGNOSE, no diag()",
    !source.includes('PHOEBE_DIAGNOSE') && !source.includes('diag('),
    'the diagnosis switch or one of its calls came back'
  );
}

/* ------------------------------------------------------------------------- */

rmSync(apiOut, { recursive: true, force: true });
rmSync(libOut, { recursive: true, force: true });

console.log('');
if (problems.length) {
  console.log(`FAILED — ${problems.length} of ${checks} checks did not hold.\n`);
  for (const p of problems) console.log(`  · ${p}`);
  console.log('');
  process.exit(1);
}
console.log(`PASSED — ${checks} checks on Wellington's machinery.\n`);
