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
expect('his prompt is small — no card sets', WELLINGTON_SYSTEM_PROMPT.length < 20000 && PHOEBE_PROMPT.length > 40000, `his ${WELLINGTON_SYSTEM_PROMPT.length} chars, hers ${PHOEBE_PROMPT.length}`);

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
