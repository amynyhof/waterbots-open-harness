/**
 * A measured walk of Wellington and Phoebe, through the local relay, with
 * real model calls. NOT A GATE — it spends money on every run, so it is run by
 * hand before an eyeball and its counts are reported, never assumed.
 *
 *   npx vite                                 (with ANTHROPIC_API_KEY in the environment)
 *   node scripts/measure-wellington.mjs [runs=3]
 *
 * WHAT IT ASKS. Four things of Wellington, each `runs` times: a quantification
 * figure (he must route to the worksheet and quote no number), an eligibility
 * judgment (he must route to Phoebe and judge nothing), a map question (he
 * must route to the map), and a question outside every lane (he must abstain).
 * Then a first-turn project description, to see the welcome, the plain
 * question, and what he learned. Then Phoebe's three standing questions once
 * each, to see that her behaviour is unchanged.
 *
 * From 16 Nov 2026 it also asks his opening turn on the desk (W29) and grades
 * every reply of his for reading level, failing on her bars (V1).
 *
 * WHAT IT RECORDS. Status, elapsed time, route, abstained, what was learned,
 * reply length, and whether the reply carries a digit-heavy figure. It prints
 * the replies for the first run of each, so the maintainer reads his words.
 */

/* The relay's own reading-grade counter (V1, 16 Nov 2026), so the walk and the log count alike: core's from 26 Nov 2026. */
const { READING_GRADE, readingGrade, walkGrades } = await import('@waterbots/core/reply');

const BASE = process.env.WB_BASE ?? 'http://localhost:5173';
const RUNS = Number(process.argv[2] ?? 3);

const WELLINGTON_QUESTIONS = [
  { key: 'figure', text: 'How many tonnes of CO2 would my borehole project earn a year?', want: 'quantification' },
  { key: 'eligibility', text: 'Is a wetland restoration upstream of our bottling plant eligible for a water benefit?', want: 'eligibility' },
  { key: 'map', text: 'Which basin is Turkana in, and how stressed is it?', want: 'map' },
  { key: 'outside', text: 'What is the current price of a carbon credit on the voluntary market?', want: 'abstain' },
  { key: 'first-turn', text: 'We run a solar borehole for about 800 households near Lodwar in Turkana, Kenya. People boil river water today. We call it the Lodwar supply project.', want: 'learn' },
];

const PHOEBE_QUESTIONS = [
  'We are planning to restore 40 hectares of wetland upstream of our bottling plant in a water-stressed basin. Would that be eligible to generate a countable benefit?',
  'What does the community consultation criterion require?',
  'How much does it cost to drill a borehole in Kenya?',
];

async function ask(agent, text) {
  const started = Date.now();
  let res;
  try {
    res = await fetch(`${BASE}/api/${agent}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      /* No text is his opening turn on the desk (W29): no visitor bubble, `at: open`. */
      body: JSON.stringify(
        text === null ? { messages: [], returned: true, at: 'open' } : { messages: [{ role: 'user', content: text }] }
      ),
    });
  } catch (e) {
    return { status: 0, ms: Date.now() - started, error: String(e) };
  }
  const ms = Date.now() - started;
  let body = {};
  try { body = await res.json(); } catch { body = {}; }
  return { status: res.status, ms, ...body };
}

const digits = (s) => (s.match(/\d[\d,.]*\s?(tCO|t\b|tonnes|m³|L\b|litres)/gi) ?? []).length;

console.log(`\nMeasured walk — ${RUNS} run(s) each, against ${BASE}\n`);

/* Every Wellington reply's reading grade (V1); the walk fails on her bars. */
const grades = [];

/* W29, 16 Nov 2026: he speaks first on the desk. Asked `runs` times. */
for (let i = 0; i < RUNS; i += 1) {
  const r = await ask('wellington', null);
  const grade = r.status === 200 ? readingGrade(r.reply) : null;
  if (grade !== null) grades.push({ key: 'opening', grade });
  console.log(`--- Wellington · opening · ${r.status} · ${(r.ms / 1000).toFixed(1)}s · route=${r.route} · grade ${grade ?? '-'}`);
  console.log(`    A: ${r.reply ?? r.error}\n`);
}

const tally = {};
for (const q of WELLINGTON_QUESTIONS) {
  tally[q.key] = { asked: 0, ok: 0, routedRight: 0, abstained: 0, figures: 0, learned: 0, ms: [] };
  for (let i = 0; i < RUNS; i += 1) {
    const r = await ask('wellington', q.text);
    const t = tally[q.key];
    t.asked += 1;
    t.ms.push(r.ms);
    if (r.status === 200) {
      t.ok += 1;
      if (q.want === 'abstain' ? r.abstained === true : q.want === 'learn' ? true : r.route === q.want) t.routedRight += 1;
      if (r.abstained) t.abstained += 1;
      if (digits(r.reply ?? '') > 0) t.figures += 1;
      if (r.context && Object.keys(r.context).length) t.learned += 1;
      grades.push({ key: q.key, grade: readingGrade(r.reply) });
    }
    if (i === 0) {
      console.log(`--- Wellington · ${q.key} · ${r.status} · ${(r.ms / 1000).toFixed(1)}s · route=${r.route} abstained=${r.abstained} context=${JSON.stringify(r.context ?? {})}`);
      console.log(`    Q: ${q.text}`);
      console.log(`    A: ${r.reply ?? r.error}\n`);
    }
  }
}

console.log('| question | asked | 200 | as wanted | abstained | replies with a figure | learned | median s |');
console.log('|---|---|---|---|---|---|---|---|');
for (const [key, t] of Object.entries(tally)) {
  const med = [...t.ms].sort((a, b) => a - b)[Math.floor(t.ms.length / 2)] / 1000;
  console.log(`| ${key} | ${t.asked} | ${t.ok} | ${t.routedRight} | ${t.abstained} | ${t.figures} | ${t.learned} | ${med.toFixed(1)} |`);
}

const walk = walkGrades(grades.map((g) => g.grade));
console.log(
  `\nReading grade: average ${walk.average} (bar ${READING_GRADE.average}), hardest ${walk.hardest} (bar ${READING_GRADE.reply}), over ${grades.length} replies.`
);
if (walk.average > READING_GRADE.average) console.log(`  FAIL  his replies average grade ${walk.average}`);
for (const g of grades) if (g.grade > READING_GRADE.reply) console.log(`  FAIL  ${g.key}: grade ${g.grade}`);

console.log('\n--- Phoebe, unchanged?\n');
for (const text of PHOEBE_QUESTIONS) {
  const r = await ask('phoebe', text);
  console.log(`Phoebe · ${r.status} · ${(r.ms / 1000).toFixed(1)}s · abstained=${r.abstained} cards=${(r.citedCards ?? []).length} updates=${(r.criteriaUpdates ?? []).length}`);
  console.log(`    Q: ${text}`);
  console.log(`    A: ${(r.reply ?? r.error ?? '').slice(0, 400)}\n`);
}

if (!walk.passes) process.exit(1);
