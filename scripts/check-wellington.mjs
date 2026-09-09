/**
 * Confirms Wellington's machinery holds its rules without a model call.
 *
 *   node scripts/check-wellington.mjs
 *
 * WHAT IT PROVES. That his relay checks the model's output rather than
 * trusting it — an unknown route becomes "none", an unknown kind is dropped,
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
  context: { name: 'Turkana borehole', place: 'Turkana, Kenya', kind: 'water' },
});
expect(
  'stated context comes through — name, place, kind',
  ctx?.context?.name === 'Turkana borehole' && ctx?.context?.place === 'Turkana, Kenya' && ctx?.context?.kind === 'water',
  JSON.stringify(ctx?.context)
);
const badKind = validate({ reply: 'Noted, that sounds like a biodiversity project.', route: 'none', abstained: false, context: { kind: 'biodiversity' } });
expect('an unknown kind is dropped, never recorded', badKind?.context === undefined, JSON.stringify(badKind?.context));
expect('"unsure" is a first-class kind', validate({ reply: 'Not sure is a fine answer. Phoebe can settle it.', route: 'eligibility', abstained: false, context: { kind: 'unsure' } })?.context?.kind === 'unsure', 'unsure was dropped');
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
  'the schema closes the kind list',
  JSON.stringify(WELLINGTON_RESPONSE_SCHEMA.properties.context.properties.kind.enum) === JSON.stringify(['water', 'carbon', 'unsure']),
  'the kinds are open'
);

/* ---------------------------------------------------------------------------
   His region reaches him and only him.
--------------------------------------------------------------------------- */

console.log('\n  His region reaches him, and only him\n');

const primerSource = readFileSync('agent-primer.md', 'utf8');
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
expect('the roster gives facts, not quoted lines, for every colleague', !/^> "/m.test(AGENT_PRIMER_MD), 'a quoted colleague sentence is still live in the roster');
expect('both prompts carry the voice rule — plain sentences a twelve-year-old could read', /twelve-year-old/.test(WELLINGTON_SYSTEM_PROMPT), 'the voice rule is missing from his prompt');
expect('his prompt states the five things he never does', /quote no figure/.test(WELLINGTON_SYSTEM_PROMPT) && /never invent/i.test(WELLINGTON_SYSTEM_PROMPT) && /abstain and route/i.test(WELLINGTON_SYSTEM_PROMPT) && /Screening language only/.test(WELLINGTON_SYSTEM_PROMPT) && /never press a visitor to sign up/i.test(WELLINGTON_SYSTEM_PROMPT), 'a rule is missing');
/* The ceiling was 20,000 until 7 Sep 2026. Three rules the maintainer added
   that week — phase names, no tabs, plain words — each cost about a hundred
   characters, and trimming rules to fit a round number had started working
   against the rules. 24,000 still keeps any card set out: Phoebe's, the
   smallest of hers, is over 40,000. Raised by the engineer, and said so. */
expect('his prompt is small — no card sets', WELLINGTON_SYSTEM_PROMPT.length < 24000 && PHOEBE_PROMPT.length > 40000, `his ${WELLINGTON_SYSTEM_PROMPT.length} chars, hers ${PHOEBE_PROMPT.length}`);

/* ---------------------------------------------------------------------------
   The record the desk carries to Phoebe — slice 3, 7 Sep 2026.
--------------------------------------------------------------------------- */

console.log('\n  The record carried to Phoebe\n');
const { readRecord, recordBlock, RECORD_HEADING } = await loadApi('_record.js');
expect('a junk record is nothing, never a block', readRecord('x') === null && readRecord({}) === null && readRecord({ does: '   ' }) === null && readRecord(null) === null, 'junk passed');
expect('kind comes only from the closed set', readRecord({ kind: 'gold' }) === null && readRecord({ kind: 'water' })?.kind === 'water', 'an unknown kind leaked');
expect('an over-long field is dropped whole, never cut', readRecord({ does: 'x'.repeat(281) }) === null && readRecord({ does: 'x'.repeat(280) })?.does.length === 280, 'length handling');
const block = recordBlock(readRecord({ does: 'Boreholes for households', place: 'Kampala, Uganda' }));
expect('the block carries only what was said, and says it is never a verdict', block.includes('Boreholes for households') && block.includes('Kampala, Uganda') && !block.includes('What kind') && !block.includes('What it is called') && /never a verdict/.test(block), block);
expect("Phoebe's prompt names the block and keeps the cards as the only judge", PHOEBE_PROMPT.includes(RECORD_HEADING) && /only the cards decide that/.test(PHOEBE_PROMPT), 'her prompt does not know the block');

/* ---------------------------------------------------------------------------
   His cap.
--------------------------------------------------------------------------- */

console.log('\n  His cap\n');
expect('thirty a day, under his own name', WELLINGTON.cap === 30 && WELLINGTON_DAILY_CAP === 30 && WELLINGTON.name === 'wellington', JSON.stringify(WELLINGTON));
expect("Phoebe's stays twenty", PHOEBE.cap === 20, `got ${PHOEBE.cap}`);

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
const { EMPTY_CONTEXT, typedContext, learnedContext, pinnedContext } = createRequire(import.meta.url)(join(libOut, 'visit.js'));

const typed = typedContext(EMPTY_CONTEXT, 'name', 'Walk Borehole');
expect('a typed name carries typed provenance', typed.name === 'Walk Borehole' && typed.provenance.name === 'typed', JSON.stringify(typed));
const heard = learnedContext(typed, { name: 'The borehole project', place: 'Turkana', kind: 'water' });
expect('a typed name is never overwritten by what he heard', heard.name === 'Walk Borehole' && heard.provenance.name === 'typed', JSON.stringify(heard));
expect('a blank place takes his hearing, marked as from the conversation', heard.place === 'Turkana' && heard.provenance.place === 'chat', JSON.stringify(heard));
expect('the kind lands with its provenance', heard.kind === 'water' && heard.provenance.kind === 'chat', JSON.stringify(heard));
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
expect('"unsure" is a kind the visit keeps', learnedContext(EMPTY_CONTEXT, { kind: 'unsure' }).kind === 'unsure', 'unsure was dropped');
expect('the empty context has no standard-of-interest field', !('standard' in EMPTY_CONTEXT), 'the chips concept survived');

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
   S13, 9 Sep 2026. The contract is one parameter, `question`, percent-encoded
   UTF-8, at most 500 characters decoded. Bad or empty input is ignored with
   no error: the page opens honestly empty and never invents a question.
--------------------------------------------------------------------------- */

console.log('\n  A carried question\n');

const { CARRIED_PARAM, CARRIED_MAX_CHARS, readCarriedQuestion, withoutCarried } = createRequire(import.meta.url)(join(libOut, 'carried.js'));
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
expect('an address with no question is returned untouched', withoutCarried('https://map.waterbots.ai/?handoff=t1') === 'https://map.waterbots.ai/?handoff=t1', 'a clean address was rewritten');

expect('the shell reads the address once, cleans it, and hands the question to the one conversation', /readCarriedQuestion\(window\.location\.search\)/.test(appSource) && /history\.replaceState/.test(appSource) && /sendCarried\(question, \{ carried: true \}\)/.test(appSource) && /setSurface\('desk'\)/.test(appSource), 'the receiver is not in the shell, or does not clean the address');
const clientSource = readFileSync('src/lib/wellingtonClient.ts', 'utf8');
expect('the flag reaches the relay only as true, and a typed turn sends no flag', /carried \? \{ messages: history, carried: true \} : \{ messages: history \}/.test(clientSource), 'the client sends the flag loosely');

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
