/**
 * A measured walk of Phoebe through the rows she asks, through the local relay,
 * with real model calls. NOT A GATE — it spends money on every run, so it is
 * run by hand after a change to her prompt and its counts are reported, never
 * assumed.
 *
 *   npx vite                                 (with ANTHROPIC_API_KEY in the environment)
 *   node scripts/measure-phoebe-walk.mjs [water|carbon|both] [runs=1] [budget=10]
 *
 * CONTRACT LINES 4 AND 5 — item A15, step 5, 21 Sep 2026. Line 4 says she
 * walks the visitor through the tool by talking, one question at a time; line
 * 5 says she fills the tool from the answers and shows what she filled. The
 * check scripts prove the prompt carries the rule and the console draws the
 * line; only real calls can say whether she keeps to it. This is that
 * measurement, on measure-wellington's pattern.
 *
 * REWRITTEN 25 SEP 2026 for build-order step 3. What changed:
 *
 *   the rows are per pack and carry five states, and the applies tests come
 *     first, so the walk is the tests then the Eligibility rows the tool file
 *     names — three on the water pathway, not six;
 *   the readiness read is reported per pathway, from the rows the relay
 *     returns, so a walk says what the screen would say;
 *   THE SHEET SIZE IS REPORTED AT EACH STAGE (the maintainer's ruling R6):
 *     the relay returns which card sets it loaded, and the input-token count
 *     beside it is what that stage cost;
 *   A PATHWAY IS CHOSEN — water, carbon or both, from 25 Sep 2026 — because a
 *     visitor on one pathway and a visitor on both are different walks, and the
 *     scripted project has to be the kind of project that pathway is for.
 *
 * THE SCRIPTED VISITOR. A test stand-in, never shown to anyone — the
 * maintainer's ruling of 25 Aug 2026 on stand-ins for a check. It opens with
 * one sentence about a planned project, then answers whatever Phoebe asks with
 * the fact for the first row still unchecked on the sheet it tracks, exactly as
 * the console tracks it. If she walks in the tool file's order her question and
 * the visitor's answer line up; if she skips ahead, they do not, and the counts
 * say so.
 *
 * WHAT IT COUNTS, per run: turns to a verdict on every asked row (or where it
 * stopped); questions per reply, by question marks; turns whose moved rows
 * include the first unchecked row, which is the order rule kept; turns that
 * moved a row at all, which is where the shown line would draw; empty, refused
 * or failed turns; cards cited; the routes she named. A budget caps the total
 * requests across all runs, so a short run costs what it says.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = process.env.WB_BASE ?? 'http://localhost:5173';
const WHICH = ['water', 'carbon', 'both'].includes(process.argv[2]) ? process.argv[2] : 'water';
const RUNS = Number(process.argv[3] ?? 1);
const BUDGET = Number(process.argv[4] ?? 10);
const MAX_TURNS = 14;
const PACKS = WHICH === 'water' ? ['vwba-2.0'] : WHICH === 'carbon' ? ['gs-paa-v2.0'] : ['vwba-2.0', 'gs-paa-v2.0'];

/* The rows and the reads come from the tool file, through the generated model,
   so this instrument cannot drift from what she is actually asked to walk. */
const out = mkdtempSync(join(tmpdir(), 'wb-walk-'));
const compile = spawnSync(
  process.execPath,
  [
    join('node_modules', 'typescript', 'bin', 'tsc'),
    join('src', 'lib', 'worksheet.generated.ts'),
    '--outDir', out,
    '--module', 'commonjs',
    '--moduleResolution', 'node',
    '--target', 'es2022',
    '--skipLibCheck',
  ],
  { encoding: 'utf8' }
);
if (compile.status !== 0) {
  console.error(compile.stdout || compile.stderr);
  process.exit(1);
}
writeFileSync(join(out, 'package.json'), '{"type":"commonjs"}');
const { askedRows, readinessOf, pathwayStateOf, section, READINESS_LABEL, ROW_STATE_LABEL, PATHWAY_STATE_LABEL } =
  createRequire(import.meta.url)(join(out, 'worksheet.generated.js'));
rmSync(out, { recursive: true, force: true });

/* Every row she asks, pack by pack, in the tool files' order. The scripted
   visitor answers whichever is first still unchecked, so a walk that skips
   ahead shows up as an answer that does not match the question. */
const asked = (sorted) =>
  PACKS.flatMap((pack) =>
    askedRows(pack, context(pack, sorted)).map((row) => ({ pack, id: row.id }))
  );

/** What her own tests have settled about which rows this project has. */
function context(pack, sorted) {
  const part = section(pack);
  const words = sorted[pack] ?? [];
  const gsClass = words.find((w) => part.appliesTo.some((x) => x.id === w));
  const versionFlag = words.find((w) => part.versionFlags.some((x) => x.id === w));
  return { ...(gsClass ? { gsClass } : {}), ...(versionFlag ? { versionFlag } : {}) };
}

/* A SCRIPTED VISITOR PER PATHWAY. The same project would not do: the carbon
   pathway is for a safe-drinking-water technology whose users boil today, and
   the water pathway is for any activity with a volume behind it. Both walks use
   one real kind of project, described the way a planner would describe it. */
const OPENINGS = {
  water:
    'We are planning a solar-powered borehole and piped supply for about 800 households near Lodwar in Turkana, Kenya. Nothing is built yet.',
  carbon:
    'We are planning to give about 2,000 households in rural Malawi ceramic water filters for their homes. Nothing is built yet, and the households boil river water over firewood today.',
  both:
    'We are planning a solar-powered borehole and piped supply for about 800 households near Lodwar in Turkana, Kenya, and the households boil the river water they collect over firewood today. Nothing is built yet.',
};

/** One fact per row she asks, by the row's own id, per pack. */
const FACTS = {
  'vwba-2.0': {
    W1: 'The aim is to replace river collection with a reliable piped supply, and we would state the benefit as the volume supplied to households against what they collect today.',
    W2: 'We would count it as water supplied to households, using the guidebook method for volume provided.',
    1: 'We will meter the supply, so the volume is measured, and we would compare it to the river water the households collect now.',
    2: 'The county water plan lists the area as chronically short of safe water, and the households collect from the river now, so the shortage is real in that place.',
    4: 'No law requires us to do this; we are not under a compliance order, and the county has no funded plan to serve these households.',
  },
  /* The both-pathways project is one project, so its carbon answers have to
     describe the same thing the water answers do: a community supply that
     treats the water it gives out, not a household filter. Measured 25 Sep
     2026 — with the household facts, she re-sorted the class mid-walk and was
     right to, because the scripted visitor had contradicted itself. */
  'gs-paa-v2.0-both': {
    T1: 'It supplies safe drinking water: the borehole is solar-powered and the water is chlorinated at the tank before it goes into the pipes, and none of that burns fuel.',
    T2: 'Today those households collect from the river and boil it over firewood, and some drink it untreated when firewood is short.',
    T3: 'The water is treated at one central point, at the tank, and piped to the households from there.',
    T4: 'The project is not registered with Gold Standard yet; this would be a new one.',
    M1: 'It is a chlorinated piped supply from a solar borehole — treatment at a community point.',
    M2: 'The pump is solar, with no engine of its own; there is no diesel or petrol anywhere in it.',
    M4: 'We would test the water at the tap before the first credits and keep testing it.',
    M5: 'Yes — the households boil river water over firewood today, which is what we would displace.',
    M6: 'About 800 households, so a small-scale project.',
    M8: 'Every household is within about two hundred metres of a tap stand.',
    M9: 'Nothing is being restored; the borehole and the pipes are new.',
    M13: 'The households could not pay the full cost, and no piped supply is sold there today.',
    M16: 'A hydrogeologist assessed the aquifer and the county would permit the abstraction.',
    P1: 'We would use the current Paris-aligned version of the method, since we are not registered yet.',
    P2: 'It is a community-services project: safe drinking water for households.',
    G12: 'Nothing has started, so there is no start date behind us.',
  },
  'gs-paa-v2.0': {
    T1: 'It supplies safe drinking water: the filters treat the water in each home, and nothing about them burns fuel.',
    T2: 'Today those households boil the river water over firewood, and some drink it untreated when firewood is short.',
    T3: 'The treatment happens in each home, at the point where the water is drunk — a ceramic filter per household.',
    T4: 'The project is not registered with Gold Standard yet; this would be a new one.',
    M1: 'They are ceramic pot filters, the ordinary household kind.',
    M2: 'There is no pump at all; households collect the water and filter it at home.',
    M5: 'Yes — the households boil over firewood today, which is what we would displace.',
    M6: 'About 2,000 households, so a small-scale project.',
    M9: 'Nothing is being restored; these are new filters going into homes that have none.',
    M13: 'The households could not pay the full cost of a filter, and nobody is selling them there at all today.',
    P1: 'We would use the current Paris-aligned version of the method, since we are not registered yet.',
    P2: 'It is a community-services project: safe drinking water for households.',
    G12: 'Nothing has started, so there is no start date behind us.',
  },
};

const OPENING = OPENINGS[WHICH];

/** The scripted visitor's answers for one pack, in the walk being run. */
const factsFor = (pack) => FACTS[`${pack}-${WHICH}`] ?? FACTS[pack] ?? {};

const EMPTY = /empty answer|almost nothing in it/;

/**
 * The console's move, in the script's own hands. Held per pack, as the shell
 * holds it.
 *
 * THE VERSION ROW IS ANSWERED BY A SORTING WORD, NOT BY A STATE. Measured 25 Sep 2026:
 * without this the script never marked that row answered, fed its fact again on
 * every turn, and reported an order failure that was the instrument's, not
 * hers. She said so herself, which is how it was found.
 */
function apply(held, rows, pathways, sorts, sorted) {
  const next = { ...held };
  for (const u of [...(rows ?? []), ...(pathways ?? [])]) {
    if (!PACKS.includes(u.pack)) continue;
    next[u.pack] = { ...(next[u.pack] ?? {}), [u.id]: { state: u.state, because: u.because, routes: u.routes } };
  }
  for (const f of sorts ?? []) {
    if (!PACKS.includes(f.pack)) continue;
    const part = section(f.pack);
    const isVersion = part.versionFlags.some((word) => word.id === f.value);
    /* The version test is a row of its own and is answered by this field, not
       by a state; the class is not a row at all, it is what sorts them. */
    const row = isVersion ? part.rows.find((r) => r.takes.of === 'version-flag') : null;
    if (row) next[f.pack] = { ...(next[f.pack] ?? {}), [row.id]: { state: f.value, because: 'the version this project is judged on' } };
    sorted[f.pack] = [...(sorted[f.pack] ?? []).filter((w) => part.versionFlags.some((x) => x.id === w) !== isVersion), f.value];
  }
  return next;
}

/** The first row she asks that nobody has answered, in the tool files' order. */
const firstUnchecked = (held, sorted) => asked(sorted).find((row) => !held[row.pack]?.[row.id]) ?? null;

/** A pathway she has said does not apply is finished: its rows are not asked. */
const firstLive = (held, sorted) =>
  asked(sorted)
    .filter((row) => pathwayStateOf(row.pack, states(held, row.pack), context(row.pack, sorted)) !== 'does-not-apply')
    .find((row) => !held[row.pack]?.[row.id]) ?? null;

const carried = (held, sorted) =>
  PACKS.map((pack) => ({
    pack,
    ...(sorted[pack]?.length ? { sorts: sorted[pack] } : {}),
    rows: Object.entries(held[pack] ?? {}).map(([id, row]) => ({
      id,
      state: row.state,
      ...(row.because ? { because: row.because } : {}),
      ...(row.routes?.length ? { routes: row.routes } : {}),
    })),
  }));

const states = (held, pack) =>
  Object.fromEntries(Object.entries(held[pack] ?? {}).map(([id, row]) => [id, row.state]));

async function ask(messages, sheet, loaded) {
  const started = Date.now();
  let res;
  try {
    res = await fetch(`${BASE}/api/phoebe`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages, sheet, loaded }),
    });
  } catch (e) {
    return { status: 0, ms: Date.now() - started, error: String(e) };
  }
  const ms = Date.now() - started;
  let body = {};
  try {
    body = await res.json();
  } catch {
    body = {};
  }
  return { status: res.status, ms, ...body };
}

console.log(`\nPhoebe — measured walk of the ${WHICH} pathway, up to ${RUNS} run(s), ${BUDGET} requests in all, against ${BASE}`);
for (const pack of PACKS) {
  console.log(`  ${section(pack).sectionName}: ${askedRows(pack).map((r) => r.id).join(', ')} (before a class narrows them)`);
}
console.log('');

let calls = 0;
let input = 0;
let output = 0;
const runs = [];
const stages = [];

for (let r = 0; r < RUNS && calls < BUDGET; r += 1) {
  const messages = [];
  let held = {};
  let sorted = {};
  let loaded = [];
  const run = { turns: 0, moved: 0, inOrder: 0, questions: [], empty: 0, other: 0, cards: 0, routes: 0, done: null };
  let next = OPENING;
  console.log(`--- run ${r + 1}`);
  while (calls < BUDGET && run.turns < MAX_TURNS) {
    messages.push({ role: 'user', content: next });
    const target = firstLive(held, sorted);
    const res = await ask(messages, carried(held, sorted), loaded);
    calls += 1;
    run.turns += 1;
    if (res.status !== 200) {
      if (res.status === 502 && EMPTY.test(res.error ?? '')) run.empty += 1;
      else run.other += 1;
      console.log(`  turn ${run.turns}  ${res.status}  ${(res.ms / 1000).toFixed(1)}s  FAIL  ${(res.error ?? '').slice(0, 140)}`);
      messages.pop();
      if (run.other + run.empty >= 2) break;
      continue;
    }
    input += (res.usage?.input ?? 0) + (res.usage?.cacheRead ?? 0) + (res.usage?.cacheWrite ?? 0);
    output += res.usage?.output ?? 0;
    if (Array.isArray(res.loaded)) {
      loaded = res.loaded;
      stages.push({
        turn: `${r + 1}.${run.turns}`,
        sets: res.loaded.join(' + '),
        input: res.usage?.input ?? 0,
        cacheRead: res.usage?.cacheRead ?? 0,
        cacheWrite: res.usage?.cacheWrite ?? 0,
        calls: res.usage?.calls ?? 1,
      });
    }
    const rows = Array.isArray(res.rows) ? res.rows : [];
    const pathways = Array.isArray(res.pathways) ? res.pathways : [];
    const movedIds = [...rows, ...pathways].filter((u) => PACKS.includes(u.pack)).map((u) => `${u.id}`);
    if (Array.isArray(res.sorts)) for (const f of res.sorts) if (PACKS.includes(f.pack)) movedIds.push(`sort=${f.value}`);
    const questionMarks = (res.reply.match(/\?/g) ?? []).length;
    run.questions.push(questionMarks);
    run.cards += Array.isArray(res.cited) ? res.cited.length : 0;
    run.routes += rows.reduce((n, u) => n + (u.routes?.length ?? 0), 0);
    if (movedIds.length) {
      run.moved += 1;
      if (target && movedIds.includes(target.id)) run.inOrder += 1;
    }
    const sortWords = Array.isArray(res.sorts) ? res.sorts : [];
    held = apply(held, rows, pathways, sortWords, sorted);
    const reads = PACKS.map(
      (pack) =>
        `${section(pack).sectionName}: ${PATHWAY_STATE_LABEL[pathwayStateOf(pack, states(held, pack))]}, ${READINESS_LABEL[readinessOf(pack, states(held, pack))]}`
    ).join(' | ');
    console.log(
      `  turn ${run.turns}  200  ${(res.ms / 1000).toFixed(1)}s  asked ${target ? `${target.id}` : '-'}  moved [${movedIds.join(',')}]  ?=${questionMarks}  cards=${(res.cited ?? []).length}  handBack=${res.handBack}`
    );
    console.log(`      → ${reads}`);
    for (const u of rows) {
      console.log(`      ${u.id}: ${ROW_STATE_LABEL[u.state]}${u.routes?.length ? ` [${u.routes.join(',')}]` : ''} — ${(u.because ?? '').slice(0, 120)}`);
    }
    if (r === 0) console.log(`      A: ${res.reply.replace(/\s+/g, ' ').slice(0, 400)}`);
    messages.push({ role: 'assistant', content: res.reply });
    const ahead = firstLive(held, sorted);
    if (!ahead) {
      run.done = run.turns;
      break;
    }
    next = factsFor(ahead.pack)[ahead.id] ?? 'I am not sure about that one.';
  }
  runs.push(run);
}

console.log('\n| run | turns | every asked row by turn | turns that moved a row | of those, first unchecked moved | questions per reply | empty | other failures | cards cited | routes named |');
console.log('|---|---|---|---|---|---|---|---|---|---|');
for (const [i, run] of runs.entries()) {
  console.log(
    `| ${i + 1} | ${run.turns} | ${run.done ?? 'not reached'} | ${run.moved} | ${run.inOrder} | ${run.questions.join(' ')} | ${run.empty} | ${run.other} | ${run.cards} | ${run.routes} |`
  );
}

if (stages.length) {
  console.log('\nThe sheet at each stage — ruling R6, staged loading\n');
  console.log('| turn | card sets loaded | input tokens | cache read | cache write | model calls |');
  console.log('|---|---|---|---|---|---|');
  for (const stage of stages) {
    console.log(
      `| ${stage.turn} | ${stage.sets} | ${stage.input.toLocaleString('en-GB')} | ${stage.cacheRead.toLocaleString('en-GB')} | ${stage.cacheWrite.toLocaleString('en-GB')} | ${stage.calls} |`
    );
  }
}

const empty = runs.reduce((n, r) => n + r.empty, 0);
const other = runs.reduce((n, r) => n + r.other, 0);
const moved = runs.reduce((n, r) => n + r.moved, 0);
const inOrder = runs.reduce((n, r) => n + r.inOrder, 0);
const replies = runs.flatMap((r) => r.questions);
const oneQuestion = replies.filter((q) => q <= 1).length;
console.log(`\nEmpty answers: ${empty} in ${calls}. Other failures: ${other}.`);
console.log(`Order kept: ${inOrder} of ${moved} moving turns moved the first unchecked row. One question or none: ${oneQuestion} of ${replies.length} replies.`);
console.log(`Cost: ${calls} API calls; ${input.toLocaleString('en-GB')} input tokens (cache reads included) and ${output.toLocaleString('en-GB')} output tokens as the relay reported them.\n`);
