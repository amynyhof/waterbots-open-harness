/**
 * A measured walk of Phoebe through her six rows, through the local relay,
 * with real model calls. NOT A GATE — it spends money on every run, so it is
 * run by hand after a change to her prompt and its counts are reported, never
 * assumed.
 *
 *   npx vite                                 (with ANTHROPIC_API_KEY in the environment)
 *   node scripts/measure-phoebe-walk.mjs [runs=3] [budget=20]
 *
 * CONTRACT LINES 4 AND 5 — item A15, step 5, 21 Sep 2026. Line 4 says she
 * walks the visitor through the tool by talking, one question at a time; line
 * 5 says she fills the tool from the answers and shows what she filled. The
 * check scripts prove the prompt carries the rule and the console draws the
 * line; only real calls can say whether she keeps to it. This is that
 * measurement, on measure-wellington's pattern.
 *
 * THE SCRIPTED VISITOR. A test stand-in, never shown to anyone — the
 * maintainer's ruling of 25 Aug 2026 on stand-ins for a check. It opens with
 * one sentence about a planned project, then answers each of her questions
 * with the fact for the FIRST ROW STILL UNCHECKED on the worksheet it tracks,
 * exactly as the console tracks it: her verdicts are applied in order and the
 * six rows go back with every ask. If she walks in the manual's order her
 * question and the visitor's answer line up; if she skips ahead, they do not,
 * and the counts say so.
 *
 * WHAT IT COUNTS, per run: turns to six verdicts (or where it stopped);
 * questions per reply, by question marks; turns whose moved rows include the
 * first unchecked row, which is the order rule kept; turns that moved a row
 * at all, which is where the shown line would draw; empty, refused or failed
 * turns; cards cited. A budget caps the total requests across all runs, so a
 * short run costs what it says. The cost line at the end is calls and tokens.
 */

const BASE = process.env.WB_BASE ?? 'http://localhost:5173';
const RUNS = Number(process.argv[2] ?? 3);
const BUDGET = Number(process.argv[3] ?? 20);
const MAX_TURNS = 8;

const OPENING =
  'We are planning a solar-powered borehole and piped supply for about 800 households near Lodwar in Turkana, Kenya. Nothing is built yet.';

/** One fact per criterion, in the manual's order — the answer for that row. */
const FACTS = [
  'The aim is to replace river collection with a reliable supply, and we would count the volume supplied to households against the without-project case using a VWBA method.',
  'The county water plan lists Lodwar as chronically short of safe water, and the households collect from the Turkwel river now, so the shortage is real in that place.',
  'Our board has approved the budget, and the Lodwar community water committee and the county water office both wrote letters of support after two consultation meetings.',
  'No law requires us to do this; we are not under a compliance order, and the county has no funded plan to serve these households.',
  'The implementer will meter the boreholes and report volumes to us every quarter, and that plan is written into the contract with money and a named person behind it.',
  'A hydrogeologist checked the aquifer and the design caps abstraction below recharge; we also looked at whether the pipes would cut across grazing routes and moved them.',
];

const EMPTY = /empty answer|almost nothing in it/;

/** The console's move, in the script's own hands. */
function apply(statuses, updates) {
  const next = statuses.map((s) => ({ ...s }));
  for (const u of updates ?? []) {
    if (!Number.isInteger(u.number) || u.number < 1 || u.number > 6) continue;
    next[u.number - 1] = u.state === 'not-yet' ? { state: 'not-yet', routeForward: u.routeForward } : { state: 'met' };
  }
  return next;
}
const firstUnchecked = (statuses) => statuses.findIndex((s) => s.state === 'unchecked') + 1;
const rows = (statuses) => statuses.map((s, i) => ({ number: i + 1, state: s.state, ...(s.routeForward ? { routeForward: s.routeForward } : {}) }));

async function ask(messages, worksheet) {
  const started = Date.now();
  let res;
  try {
    res = await fetch(`${BASE}/api/phoebe`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages, worksheet }),
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

console.log(`\nPhoebe — measured walk, up to ${RUNS} run(s), ${BUDGET} requests in all, against ${BASE}\n`);

let calls = 0;
let input = 0;
let output = 0;
const runs = [];

for (let r = 0; r < RUNS && calls < BUDGET; r += 1) {
  const messages = [];
  let statuses = Array.from({ length: 6 }, () => ({ state: 'unchecked' }));
  const run = { turns: 0, moved: 0, inOrder: 0, questions: [], empty: 0, other: 0, cards: 0, done: null, log: [] };
  let next = OPENING;
  console.log(`--- run ${r + 1}`);
  while (calls < BUDGET && run.turns < MAX_TURNS) {
    messages.push({ role: 'user', content: next });
    const target = firstUnchecked(statuses);
    const res = await ask(messages, rows(statuses));
    calls += 1;
    run.turns += 1;
    if (res.status !== 200) {
      if (res.status === 502 && EMPTY.test(res.error ?? '')) run.empty += 1;
      else run.other += 1;
      console.log(`  turn ${run.turns}  ${res.status}  ${(res.ms / 1000).toFixed(1)}s  FAIL  ${(res.error ?? '').slice(0, 120)}`);
      messages.pop();
      if (run.other + run.empty >= 2) break;
      continue;
    }
    input += (res.usage?.input ?? 0) + (res.usage?.cacheRead ?? 0) + (res.usage?.cacheWrite ?? 0);
    output += res.usage?.output ?? 0;
    const updates = Array.isArray(res.criteriaUpdates) ? res.criteriaUpdates : [];
    const movedRows = updates.map((u) => u.number);
    const questionMarks = (res.reply.match(/\?/g) ?? []).length;
    run.questions.push(questionMarks);
    run.cards += Array.isArray(res.citedCards) ? res.citedCards.length : 0;
    if (movedRows.length) {
      run.moved += 1;
      if (target > 0 && movedRows.includes(target)) run.inOrder += 1;
    }
    statuses = apply(statuses, updates);
    const met = statuses.filter((s) => s.state === 'met').length;
    const notYet = statuses.filter((s) => s.state === 'not-yet').length;
    console.log(
      `  turn ${run.turns}  200  ${(res.ms / 1000).toFixed(1)}s  asked row ${target || '-'}  moved [${movedRows.join(',')}]  ?=${questionMarks}  cards=${(res.citedCards ?? []).length}  handBack=${res.handBack}  → Worksheet: ${met} Met · ${notYet} Not yet`
    );
    if (r === 0) console.log(`      A: ${res.reply.replace(/\s+/g, ' ').slice(0, 360)}`);
    messages.push({ role: 'assistant', content: res.reply });
    if (firstUnchecked(statuses) === 0) {
      run.done = run.turns;
      break;
    }
    next = FACTS[firstUnchecked(statuses) - 1];
  }
  runs.push(run);
}

console.log('\n| run | turns | six verdicts by turn | turns that moved a row | of those, first unchecked row moved | questions per reply | empty | other failures | cards cited |');
console.log('|---|---|---|---|---|---|---|---|---|');
for (const [i, run] of runs.entries()) {
  console.log(
    `| ${i + 1} | ${run.turns} | ${run.done ?? 'not reached'} | ${run.moved} | ${run.inOrder} | ${run.questions.join(' ')} | ${run.empty} | ${run.other} | ${run.cards} |`
  );
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
