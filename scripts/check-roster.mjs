/**
 * Confirms this site agrees with the one roster, without a model call.
 *
 *   node scripts/check-roster.mjs        # also: npm run roster:check
 *
 * THE ROSTER IS THE MAINTAINER'S. knowledge-packs/product-shared/roster.yaml
 * is carried from production by her hand and committed byte for byte. This
 * site never edits it. Item A13, 18 Sep 2026.
 *
 * WHAT IT PROVES. That every seat on this site's screens — the crew rail
 * (src/lib/crew.ts) and the Agent Commons shelf (src/lib/commonsShelf.ts) — is
 * a seat on the roster, wears the roster's seat label, opens the phase the
 * roster gives it, and is allowed at that door. That the primer's crew facts
 * (both regions of knowledge-packs/product-shared/agent-primer.md) name every
 * seat built here, count them right, and say whether each chat is live in a
 * way the roster's `built` word allows. That Wellington's prompt names the
 * same people. That no retired or reserved name is used as a seat. And that
 * the roster itself keeps its own shape.
 *
 * WHAT IT ALLOWS. A roster seat absent from this site (not built here), and a
 * face absent from this site (Ally). Each absence is printed, never silent.
 * And `built: "unconfirmed"` passes either way, always — until the maintainer
 * confirms a door at the source and carries the file again.
 *
 * IT RUNS IN FRONT OF EVERY BUILD (`npm run build`), so a disagreement fails
 * the deploy and names the file and line. Maintainer's ruling, 18 Sep 2026.
 *
 * The crew file and the shelf are read with the TypeScript compiler, walking
 * the source, so a failure can name the exact line. The primer and the prompt
 * are read as text.
 */

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { LineCounter, parseDocument, isMap, isSeq, isScalar } from 'yaml';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const ROSTER = 'knowledge-packs/product-shared/roster.yaml';
const CREW = 'src/lib/crew.ts';
const SHELF = 'src/lib/commonsShelf.ts';
const PRIMER = 'knowledge-packs/product-shared/agent-primer.md';
const PROMPT = 'api/_wellingtonPrompt.ts';

/* ---------------------------------------------------------------------------
   The words the roster may use for `built`, and what each one lets the
   primer say about a chat. A NEW WORD IS ONE ROW HERE. `chatLive` true means
   the primer must say the chat is live; false, that it is not; null, either.
   The maintainer said on 18 Sep 2026 she may add "partly" at the source for
   a seat whose tool is open and whose chat is not — that would be one row.
--------------------------------------------------------------------------- */
const BUILT_WORDS = {
  yes: { chatLive: true },
  no: { chatLive: false },
  unconfirmed: { chatLive: null },
};

/** This site's screens, by the roster's phase word. Wellington's is `all`. */
const SURFACE_PHASE = {
  desk: 'all',
  eligibility: 'Eligibility',
  map: 'Partners',
  quantification: 'Quantify',
};

/** The desk's word on the journey bar, which is what the primer says for `all`. */
const DESK_LABEL = 'Dispatches';

const COUNT_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

const problems = [];
let checks = 0;

function expect(label, condition, where, quiet = false) {
  checks += 1;
  if (condition) {
    if (!quiet) console.log(`  ok    ${label}`);
  } else {
    console.log(`  FAIL  ${label}`);
    problems.push(`${where} — ${label}`);
  }
}

function note(line) {
  console.log(`  note  ${line}`);
}

console.log('\nThe roster — this site against the one crew list\n');

/* ---------------------------------------------------------------------------
   The roster, and its own shape.
--------------------------------------------------------------------------- */

const rosterText = readFileSync(ROSTER, 'utf8').replace(/\r\n/g, '\n');
const lines = new LineCounter();
const doc = parseDocument(rosterText, { lineCounter: lines, keepSourceTokens: true });
const at = (node) => `${ROSTER}:${node?.range ? lines.linePos(node.range[0]).line : '?'}`;

console.log(`  ${ROSTER}\n`);

if (doc.errors.length) {
  for (const e of doc.errors) console.log(`  FAIL  ${e.message}`);
  problems.push(`${ROSTER} — does not parse`);
  finish();
}

const top = doc.contents;
expect('the file is a map with version, levels, doors, confirmed and seats', isMap(top) && ['version', 'levels', 'doors', 'confirmed', 'seats'].every((k) => top.has(k)), `${ROSTER}:1`);

const levelWords = isMap(top) && isMap(top.get('levels', true)) ? top.get('levels', true).items.map((p) => String(p.key.value)) : [];
const doorWords = isMap(top) && isMap(top.get('doors', true)) ? top.get('doors', true).items.map((p) => String(p.key.value)) : [];
expect(`levels are defined — ${levelWords.join(', ')}`, levelWords.length > 0 && levelWords.includes('none'), at(top?.get('levels', true)));
expect(`doors are defined — ${doorWords.join(', ')}`, doorWords.includes('free') && doorWords.includes('commons') && doorWords.includes('paid'), at(top?.get('doors', true)));

const retired = (top?.get('retired')?.toJSON() ?? []).map((r) => r.name);
const reserved = (top?.get('reserved')?.toJSON() ?? []).map((r) => r.name);
const forbidden = [...retired, ...reserved];

const seatsNode = top?.get('seats', true);
expect('seats is a list', isSeq(seatsNode), at(seatsNode ?? top));

const REQUIRED = ['id', 'name', 'faces', 'seat', 'job', 'helps_with', 'phase', 'doors'];

/** Each seat as plain data, with the line of its `id` for naming. */
const seats = [];
const seenIds = new Map();
const seenFaces = new Map();

for (const node of isSeq(seatsNode) ? seatsNode.items : []) {
  const where = at(node);
  if (!isMap(node)) {
    expect('a seat is a map', false, where);
    continue;
  }
  const data = node.toJSON();
  const label = data.id ?? data.name ?? '(unnamed)';
  const missing = REQUIRED.filter((k) => !node.has(k));
  expect(`seat ${label} has every field`, missing.length === 0, `${where} — missing ${missing.join(', ')}`, true);
  if (missing.length) continue;

  expect(`seat ${label}: id is unique`, !seenIds.has(data.id), `${at(node.get('id', true))} — also at ${seenIds.get(data.id)}`, true);
  seenIds.set(data.id, at(node.get('id', true)));

  const facesNode = node.get('faces', true);
  expect(`seat ${label}: faces is a non-empty list`, isSeq(facesNode) && facesNode.items.length > 0, at(facesNode), true);
  for (const f of isSeq(facesNode) ? facesNode.items : []) {
    const face = String(f.value);
    expect(`seat ${label}: face ${face} is not retired or reserved`, !forbidden.includes(face), at(f), true);
    expect(`seat ${label}: face ${face} is used once`, !seenFaces.has(face), `${at(f)} — also at ${seenFaces.get(face)}`, true);
    seenFaces.set(face, at(f));
  }
  expect(`seat ${label}: id ${data.id} is not retired or reserved`, !forbidden.map((n) => n.toLowerCase()).includes(String(data.id).toLowerCase()), at(node.get('id', true)), true);

  const doorsNode = node.get('doors', true);
  expect(`seat ${label}: doors names every door`, isMap(doorsNode) && doorWords.every((d) => doorsNode.has(d)), at(doorsNode), true);
  if (isMap(doorsNode)) {
    for (const pair of doorsNode.items) {
      const door = String(pair.key.value);
      const d = pair.value;
      const dWhere = at(d);
      expect(`seat ${label}: door ${door} is a known door`, doorWords.includes(door), at(pair.key), true);
      const ok = isMap(d) && d.has('level') && d.has('built');
      expect(`seat ${label}: door ${door} has level and built`, ok, dWhere, true);
      if (!ok) continue;
      const level = String(d.get('level'));
      const built = d.get('built', true);
      expect(`seat ${label}: door ${door} level "${level}" is a defined level`, levelWords.includes(level), at(d.get('level', true)), true);
      expect(`seat ${label}: door ${door} built "${built.value}" is an allowed word, in quotes`, isScalar(built) && typeof built.value === 'string' && Object.hasOwn(BUILT_WORDS, built.value) && built.type !== 'PLAIN', at(built), true);
    }
  }

  seats.push({ ...data, where, node });
  console.log(`  ok    seat ${label} keeps the shape — ${data.faces.length} face(s), ${doorWords.length} doors`);
}

const seatOfFace = (face) => seats.find((s) => (s.faces ?? []).includes(face));
const seatDoor = (seat, door) => seat.doors?.[door] ?? {};

/* ---------------------------------------------------------------------------
   The crew file, walked with the compiler.
--------------------------------------------------------------------------- */

function walkArray(file, variableName, onObject) {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const lineOf = (node) => source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
  let found = false;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === variableName && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      found = true;
      for (const element of node.initializer.elements) {
        if (!ts.isObjectLiteralExpression(element)) continue;
        const fields = {};
        for (const prop of element.properties) {
          if (ts.isPropertyAssignment(prop) && ts.isStringLiteral(prop.initializer)) {
            fields[prop.name.getText(source)] = { value: prop.initializer.text, line: lineOf(prop) };
          }
        }
        onObject(fields, lineOf(element));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return { found, source, lineOf };
}

console.log(`\n  ${CREW}\n`);

const crew = [];
const crewWalk = walkArray(CREW, 'CREW', (fields, line) => {
  crew.push({ name: fields.name?.value, role: fields.role?.value, surface: fields.surface?.value, line, fields });
});
expect('the CREW array is found', crewWalk.found && crew.length > 0, `${CREW}:1`);

for (const m of crew) {
  const where = `${CREW}:${m.fields.name?.line ?? m.line}`;
  const seat = seatOfFace(m.name);
  expect(`${m.name} is a face of one roster seat`, seat !== undefined, where);
  expect(`${m.name} is not a retired or reserved name`, !forbidden.includes(m.name), where);
  if (!seat) continue;
  expect(`${m.name}'s role "${m.role}" is the roster's seat label "${seat.seat}"`, m.role === seat.seat, `${CREW}:${m.fields.role?.line ?? m.line} against ${at(seat.node.get('seat', true))}`);
  const phase = SURFACE_PHASE[m.surface];
  expect(`${m.name}'s screen "${m.surface}" opens the roster's phase "${seat.phase}"`, phase === seat.phase, `${CREW}:${m.fields.surface?.line ?? m.line} against ${at(seat.node.get('phase', true))}`);
  const free = seatDoor(seat, 'free');
  expect(`${m.name} may appear at the free door (level ${free.level})`, free.level !== 'none', `${where} against ${at(seat.node.get('doors', true))}`);
}

/* ---------------------------------------------------------------------------
   The Commons shelf — every holder is allowed at that door.
--------------------------------------------------------------------------- */

console.log(`\n  ${SHELF}\n`);

{
  const source = ts.createSourceFile(SHELF, readFileSync(SHELF, 'utf8'), ts.ScriptTarget.Latest, true);
  const holders = [];
  const visit = (node) => {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'crewMember' && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
      holders.push({ name: node.arguments[0].text, line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1 });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  expect('the shelf names its holders through crewMember()', holders.length > 0, `${SHELF}:1`);
  for (const h of holders) {
    const where = `${SHELF}:${h.line}`;
    const seat = seatOfFace(h.name);
    expect(`shelf holder ${h.name} is a face of one roster seat`, seat !== undefined, where);
    if (!seat) continue;
    expect(`shelf holder ${h.name} is on the crew`, crew.some((m) => m.name === h.name), where);
    const commons = seatDoor(seat, 'commons');
    expect(`shelf holder ${h.name} may appear on the Commons (level ${commons.level})`, commons.level !== 'none', `${where} against ${at(seat.node.get('doors', true))}`);
  }
  for (const s of seats) {
    if (seatDoor(s, 'commons').level === 'none') {
      expect(`${s.name} has no card on the shelf (Commons level none)`, !holders.some((h) => s.faces.includes(h.name)), `${SHELF} against ${at(s.node.get('doors', true))}`);
    }
  }
}

/* ---------------------------------------------------------------------------
   The primer's crew facts — both regions, struck lines removed.
--------------------------------------------------------------------------- */

console.log(`\n  ${PRIMER}\n`);

const primerRaw = readFileSync(PRIMER, 'utf8').replace(/\r\n/g, '\n');
const primerLines = primerRaw.split('\n');

/** A region of the primer, with `~~struck~~` spans blanked so their words do not count, line numbers kept. */
function region(name) {
  const begin = primerLines.findIndex((l) => l.includes(`<!-- ${name}: BEGIN -->`));
  const end = primerLines.findIndex((l) => l.includes(`<!-- ${name}: END -->`));
  expect(`the ${name} region exists`, begin >= 0 && end > begin, `${PRIMER}:1`);
  const text = primerLines.slice(begin + 1, end).join('\n').replace(/~~[\s\S]*?~~/g, (m) => m.replace(/[^\n]/g, ' '));
  return { start: begin + 2, lines: text.split('\n') };
}

const lineNo = (reg, index) => `${PRIMER}:${reg.start + index}`;

function chatState(text) {
  const live = /chat is live/.test(text);
  const notLive = /chat is not live|cannot answer/.test(text);
  if (live && !notLive) return 'live';
  if (notLive && !live) return 'not live';
  return null;
}

/** What the roster's built word lets the primer say. */
function builtAllows(seat, door, state) {
  const built = seatDoor(seat, door).built;
  const rule = BUILT_WORDS[built];
  if (!rule || rule.chatLive === null) return true;
  return rule.chatLive ? state === 'live' : state === 'not live';
}

const roster = region('AGENT-FACING');

{
  const countIndex = roster.lines.findIndex((l) => /\*\*\w+ agents,/.test(l));
  const word = countIndex >= 0 ? roster.lines[countIndex].match(/\*\*(\w+) agents,/)[1].toLowerCase() : null;
  expect(`the roster region counts ${COUNT_WORDS[crew.length]} agents, the crew's count`, word === COUNT_WORDS[crew.length], countIndex >= 0 ? lineNo(roster, countIndex) : `${PRIMER} — no count sentence`);
}

for (const m of crew) {
  const seat = seatOfFace(m.name);
  if (!seat) continue;
  const headingIndex = roster.lines.findIndex((l) => l.startsWith(`### ${m.name} —`));
  expect(`the roster region has a heading for ${m.name}`, headingIndex >= 0, `${PRIMER} — no "### ${m.name} —" heading`);
  if (headingIndex < 0) continue;
  let endIndex = roster.lines.findIndex((l, i) => i > headingIndex && (l.startsWith('### ') || l.startsWith('---')));
  if (endIndex < 0) endIndex = roster.lines.length;
  const section = roster.lines.slice(headingIndex, endIndex).join('\n');
  const where = lineNo(roster, headingIndex);

  const phaseWord = seat.phase === 'all' ? DESK_LABEL : seat.phase;
  expect(`${m.name}'s entry names the phase "${phaseWord}"`, section.includes(phaseWord), where);

  const state = chatState(section);
  expect(`${m.name}'s entry says whether the chat is live`, state !== null, where);
  const built = seatDoor(seat, 'free').built;
  expect(`${m.name}'s entry says "${state}" and the roster's free door says built "${built}"`, builtAllows(seat, 'free', state), `${where} against ${at(seat.node.get('doors', true))}`);
}

for (const name of forbidden) {
  const hit = roster.lines.findIndex((l) => new RegExp(`\\b${name}\\b`).test(l));
  expect(`the roster region does not name ${name} (retired or reserved)`, hit < 0, hit >= 0 ? lineNo(roster, hit) : '');
}

const his = region('WELLINGTON-FACING');

/** His bullets, each with its run-on lines joined, so a name on a second line still counts. */
const hisBullets = [];
his.lines.forEach((l, i) => {
  if (l.startsWith('- ')) hisBullets.push({ index: i, text: l });
  else if (hisBullets.length && /^\s+\S/.test(l)) hisBullets[hisBullets.length - 1].text += '\n' + l;
});

for (const m of crew) {
  if (m.name === 'Wellington') continue;
  const seat = seatOfFace(m.name);
  if (!seat) continue;
  const bullet = hisBullets.find((b) => new RegExp(`\\b${m.name}\\b`).test(b.text));
  expect(`Wellington's facts name ${m.name}`, bullet !== undefined, `${PRIMER} — no crew fact for ${m.name} in his region`);
  if (!bullet) continue;
  const index = bullet.index;
  const fact = bullet.text;
  const state = chatState(fact);
  expect(`Wellington's fact on ${m.name} says whether the chat is live`, state !== null, lineNo(his, index));
  const built = seatDoor(seat, 'free').built;
  expect(`Wellington's fact on ${m.name} says "${state}" and the roster's free door says built "${built}"`, builtAllows(seat, 'free', state), `${lineNo(his, index)} against ${at(seat.node.get('doors', true))}`);
}

for (const name of forbidden) {
  const hit = his.lines.findIndex((l) => new RegExp(`\\b${name}\\b`).test(l));
  expect(`Wellington's region does not name ${name} (retired or reserved)`, hit < 0, hit >= 0 ? lineNo(his, hit) : '');
}

/* ---------------------------------------------------------------------------
   Wellington's prompt — the people sentence, checked and never rendered.
   Maintainer's ruling, 18 Sep 2026: the wording is hers.
--------------------------------------------------------------------------- */

console.log(`\n  ${PROMPT}\n`);

{
  const promptLines = readFileSync(PROMPT, 'utf8').replace(/\r\n/g, '\n').split('\n');
  const index = promptLines.findIndex((l) => /The \w+ people on this site are you, /.test(l));
  expect('the prompt has its people sentence', index >= 0, `${PROMPT} — no "The … people on this site are you, …" sentence`);
  if (index >= 0) {
    const [, word, rest] = promptLines[index].match(/The (\w+) people on this site are you, ([^.]+)\./);
    const named = rest.split(/,\s*|\s+and\s+/).map((s) => s.trim()).filter(Boolean);
    const others = crew.filter((m) => m.name !== 'Wellington').map((m) => m.name);
    const where = `${PROMPT}:${index + 1}`;
    expect(`the prompt counts ${COUNT_WORDS[crew.length]} people`, word.toLowerCase() === COUNT_WORDS[crew.length], where);
    expect(`the prompt names the crew — ${others.join(', ')}`, named.length === others.length && others.every((n) => named.includes(n)), `${where} — names ${named.join(', ')}`);
    expect('the prompt is spoken by Wellington', crew.some((m) => m.name === 'Wellington'), where);
  }
}

/* ---------------------------------------------------------------------------
   What is allowed to be absent — printed, never silent.
--------------------------------------------------------------------------- */

console.log('\n  Absent from this site, allowed\n');

for (const s of seats) {
  const onCrew = s.faces.filter((f) => crew.some((m) => m.name === f));
  const free = seatDoor(s, 'free');
  if (onCrew.length === 0) {
    note(`${s.name} (${s.seat}) is on the roster at the free door as "${free.level}", built "${free.built}", and not built here.`);
    continue;
  }
  for (const f of s.faces) {
    if (!onCrew.includes(f)) note(`${f}, a face of the ${s.seat} seat, is on the roster and nowhere on this site.`);
  }
}
for (const door of ['free', 'commons']) {
  const unconfirmed = seats.filter((s) => seatDoor(s, door).built === 'unconfirmed').length;
  if (unconfirmed) note(`${unconfirmed} seat(s) are "unconfirmed" at the ${door} door; the check allows either state until the maintainer carries a confirmed file.`);
}

finish();

function finish() {
  console.log(`\n  ${checks} checks, ${problems.length} problem(s).\n`);
  if (problems.length) {
    console.log('  The build stops here. This site never edits roster.yaml; fix the file named, or ask the maintainer to carry a new roster.\n');
    for (const p of problems) console.log(`  - ${p}`);
    console.log('');
    process.exit(1);
  }
  process.exit(0);
}
