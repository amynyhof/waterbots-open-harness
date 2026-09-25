/**
 * A measured run of Phoebe, through the local relay, with real model calls.
 * NOT A GATE — it spends money on every run, so it is run by hand after a
 * change to her prompt and its counts are reported, never assumed.
 *
 *   npx vite                                 (with ANTHROPIC_API_KEY in the environment)
 *   node scripts/measure-phoebe.mjs [runs=20]
 *
 * THE INSTRUMENT ITEM A6 SETTLED ON, 28 Aug 2026. Three standing questions —
 * one hard, six criteria; one simple, one card; one the other card set — each
 * asked `runs` times, sixty requests by default, because a thirty-request
 * sample swung from 23% to 10% on identical settings and cannot carry a
 * decision. The number reported is the empty-answer rate: the relay refuses
 * an empty or near-empty answer with a 502 that says so, and this counts
 * those refusals, so what a visitor would have met is what is counted.
 *
 * THE BAR IS THE MAINTAINER'S. Her ruling R4 of 20 Sep 2026 (item A15): no
 * worse than 1 in 60 empty answers over sixty requests, the shipped baseline
 * on Opus at medium. A run worse than that stops the batch and is reported
 * to her before anything else is built. This script prints the count; it does
 * not decide.
 *
 * WHAT IT RECORDS, per request: status, elapsed time, reply length, cards
 * cited, abstained, worksheet updates, and the relay's token usage. The cost
 * line at the end is calls and tokens, so the For Amy block can say what the
 * run cost. It never prints a visitor's question because there is none: the
 * three questions are this file's own.
 *
 * Each request is one message with no history and no record, the way A6
 * measured, so runs before and after a change compare like with like.
 */

const BASE = process.env.WB_BASE ?? 'http://localhost:5173';
const RUNS = Number(process.argv[2] ?? 20);

const QUESTIONS = [
  {
    key: 'hard',
    text: 'We are planning to restore 40 hectares of wetland upstream of our bottling plant in a water-stressed basin. Would that be eligible to generate a countable benefit?',
  },
  { key: 'simple', text: 'What does the community consultation criterion require?' },
  { key: 'feasibility', text: 'What does the manual say about the implementer being ready and able to deliver a project?' },
];

/** The relay's own words for an answer with nothing in it, matched loosely. */
const EMPTY = /empty answer|almost nothing in it/;

async function ask(text) {
  const started = Date.now();
  let res;
  try {
    res = await fetch(`${BASE}/api/phoebe`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: text }] }),
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

console.log(`\nPhoebe — measured run, ${RUNS} of each of ${QUESTIONS.length} questions, against ${BASE}\n`);

const rows = [];
for (const q of QUESTIONS) {
  for (let i = 0; i < RUNS; i += 1) {
    const r = await ask(q.text);
    const empty = r.status === 502 && EMPTY.test(r.error ?? '');
    rows.push({
      key: q.key,
      status: r.status,
      ms: r.ms,
      empty,
      chars: typeof r.reply === 'string' ? r.reply.length : 0,
      /* `cited` from 25 Sep 2026: she returns card tokens, not the old
         set-and-number pairs, and counting the field that no longer exists
         reported every answer as uncited. */
      cards: Array.isArray(r.cited) ? r.cited.length : 0,
      abstained: r.abstained === true,
      updates: Array.isArray(r.criteriaUpdates) ? r.criteriaUpdates.length : 0,
      /* Contract line 8, step 4: the hand-back as the relay returned it. */
      handBack: typeof r.handBack === 'string' ? r.handBack : '',
      usage: r.usage ?? null,
      error: r.status === 200 ? '' : (r.error ?? '').slice(0, 120),
    });
    const last = rows[rows.length - 1];
    console.log(
      `  ${q.key.padEnd(11)} #${String(i + 1).padStart(2)}  ${last.status}  ${(last.ms / 1000).toFixed(1).padStart(5)}s  ` +
        (last.status === 200
          ? `${String(last.chars).padStart(5)} chars  ${last.cards} cards  abstained=${last.abstained}  updates=${last.updates}  handBack=${last.handBack}`
          : `${last.empty ? 'EMPTY' : 'FAIL '}  ${last.error}`)
    );
  }
}

const by = (key) => rows.filter((r) => r.key === key);
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
};

console.log('\n| question | asked | 200 | empty | other failures | median s | median chars | median cards | abstained | hand-backs |');
console.log('|---|---|---|---|---|---|---|---|---|---|');
for (const q of QUESTIONS) {
  const r = by(q.key);
  const ok = r.filter((x) => x.status === 200);
  console.log(
    `| ${q.key} | ${r.length} | ${ok.length} | ${r.filter((x) => x.empty).length} | ${r.filter((x) => x.status !== 200 && !x.empty).length} | ${(median(r.map((x) => x.ms)) / 1000).toFixed(1)} | ${median(ok.map((x) => x.chars))} | ${median(ok.map((x) => x.cards))} | ${ok.filter((x) => x.abstained).length} | ${ok.filter((x) => x.handBack === 'wellington').length} |`
  );
}

const empty = rows.filter((r) => r.empty).length;
const other = rows.filter((r) => r.status !== 200 && !r.empty).length;
const input = rows.reduce((n, r) => n + (r.usage?.input ?? 0) + (r.usage?.cacheRead ?? 0) + (r.usage?.cacheWrite ?? 0), 0);
const output = rows.reduce((n, r) => n + (r.usage?.output ?? 0), 0);

console.log(`\nEmpty answers: ${empty} in ${rows.length}. Other failures: ${other}.`);
console.log(`Cost: ${rows.length} API calls; ${input.toLocaleString('en-GB')} input tokens (cache reads included) and ${output.toLocaleString('en-GB')} output tokens as the relay reported them.`);
console.log(`Bar (maintainer's ruling R4, 20 Sep 2026): no worse than 1 in 60. ${empty <= Math.floor(rows.length / 60) ? 'Within the bar.' : 'WORSE THAN THE BAR — stop and tell the maintainer.'}\n`);
