/**
 * Gate: the daily cap counts, refuses and refunds, and the abstention log keeps
 * what it should and nothing else.
 *
 * WHY THIS EXISTS. Confirming a cap of twenty by hand means sending twenty-one
 * messages to a deployed site and watching the twenty-first be refused — every
 * time anyone touches this code. That is slow, it costs money, and nobody will
 * do it on the fourth occasion. This does it in a couple of seconds.
 *
 * IT RUNS THE REAL CODE AGAINST A STAND-IN STORE. The counting, the refusal
 * boundary, the refund and the log are the same files that deploy. Only the
 * database is stood in for — a small program on this machine that answers the
 * same commands the real one does.
 *
 * THAT STAND-IN IS NOT FABRICATED DATA, and the distinction is the maintainer's
 * ruling of 25 Aug 2026: the no-fabricated-data rule protects what a visitor is
 * shown, and a test stand-in that never reaches a person is a different thing.
 * It is written into PROCESS_RULES_for_ShellB.md so it is not re-argued.
 *
 * WHAT IT CANNOT CHECK. That the real store behaves like the stand-in. Nothing
 * local can check that, which is item S6 — the dev relay was kinder than
 * production three times running, and each time local checks all passed. The
 * only proof of the real thing is a deployed address and a browser.
 *
 * WHY IT COMPILES FIRST. The api folder imports with .js extensions, which is
 * what the platform requires and what Node's own type-stripping cannot follow.
 * So the folder is compiled to a temporary directory and the compiled code is
 * what gets exercised — one step closer to what deploys, not further away.
 */

import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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

/* ---------------------------------------------------------------------------
   Compile the api folder as the platform would see it.
--------------------------------------------------------------------------- */

const out = mkdtempSync(join(tmpdir(), 'wb-api-'));

const compile = spawnSync(
  process.execPath,
  [
    join('node_modules', 'typescript', 'bin', 'tsc'),
    '-p',
    'tsconfig.api.json',
    '--noEmit',
    'false',
    '--outDir',
    out,
    '--composite',
    'false',
    '--declaration',
    'false',
  ],
  { encoding: 'utf8' }
);

if (compile.status !== 0) {
  console.error('\n  FAILED — api/ did not compile, so nothing below could be checked.\n');
  console.error(compile.stdout || compile.stderr);
  rmSync(out, { recursive: true, force: true });
  process.exit(1);
}

writeFileSync(join(out, 'package.json'), '{"type":"module"}');
const load = (name) => import(pathToFileURL(join(out, name)).href);

/* ---------------------------------------------------------------------------
   The stand-in store. Speaks the handful of commands the real one is asked.
--------------------------------------------------------------------------- */

const numbers = new Map();
const lists = new Map();
const expiries = new Map();

const server = createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    let commands;
    try {
      commands = JSON.parse(body);
    } catch {
      res.statusCode = 400;
      res.end('[]');
      return;
    }
    const results = commands.map(([verb, key, ...args]) => {
      switch (verb) {
        case 'INCR':
          numbers.set(key, (numbers.get(key) ?? 0) + 1);
          return { result: numbers.get(key) };
        case 'DECR':
          numbers.set(key, (numbers.get(key) ?? 0) - 1);
          return { result: numbers.get(key) };
        case 'EXPIRE':
          expiries.set(key, Number(args[0]));
          return { result: 1 };
        case 'LPUSH': {
          const list = lists.get(key) ?? [];
          list.unshift(args[0]);
          lists.set(key, list);
          return { result: list.length };
        }
        case 'LTRIM': {
          const list = lists.get(key) ?? [];
          lists.set(key, list.slice(Number(args[0]), Number(args[1]) + 1));
          return { result: 'OK' };
        }
        case 'LRANGE': {
          const list = lists.get(key) ?? [];
          return { result: list.slice(Number(args[0]), Number(args[1]) + 1) };
        }
        default:
          return { error: `the stand-in store was asked for ${verb}, which it does not know` };
      }
    });
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(results));
  });
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;

const LOG_KEY = 'a-test-log-key-that-is-not-the-real-one';

process.env.KV_REST_API_URL = `http://127.0.0.1:${port}`;
process.env.KV_REST_API_TOKEN = 'stand-in';
process.env.PHOEBE_VISITOR_SALT = 'a-test-secret-that-is-not-the-real-one';
process.env.PHOEBE_LOG_KEY = LOG_KEY;
delete process.env.PHOEBE_TEST_CAP;
delete process.env.VERCEL;

const { countOneMessage, DAILY_CAP, timeUntilReset } = await load('_cap.js');
const { recordAbstention, readAbstentions, KEPT } = await load('_abstentions.js');
const { storeConfig } = await load('_store.js');
const abstentionsRoute = await load('abstentions.js');

const NOW = new Date('2026-08-25T17:00:00.000Z');
const ask = (address) =>
  new Request('https://example.invalid/api/phoebe', {
    method: 'POST',
    headers: { 'x-vercel-forwarded-for': address },
  });

/* ---------------------------------------------------------------------------
   The cap.
--------------------------------------------------------------------------- */

console.log('\n  Twenty messages a day\n');

const decisions = [];
for (let i = 0; i < DAILY_CAP + 2; i += 1) {
  decisions.push(await countOneMessage(ask('203.0.113.7'), NOW));
}

expect(
  `the first ${DAILY_CAP} messages are allowed`,
  decisions.slice(0, DAILY_CAP).every((d) => d.kind === 'allowed'),
  `got ${[...new Set(decisions.slice(0, DAILY_CAP).map((d) => d.kind))].join(', ')}`
);

expect(
  `message ${DAILY_CAP + 1} is refused, and so is the one after it`,
  decisions.slice(DAILY_CAP).every((d) => d.kind === 'refused'),
  `got ${decisions.slice(DAILY_CAP).map((d) => d.kind).join(', ')}`
);

expect(
  'a refusal carries the cap and a countdown, so the message can tell the truth',
  decisions[DAILY_CAP].cap === DAILY_CAP && decisions[DAILY_CAP].secondsToReset === 7 * 60 * 60,
  `got cap ${decisions[DAILY_CAP].cap}, ${decisions[DAILY_CAP].secondsToReset} seconds`
);

expect(
  'that countdown reads as seven hours to a person',
  timeUntilReset(decisions[DAILY_CAP].secondsToReset) === 'in about 7 hours',
  `got "${timeUntilReset(decisions[DAILY_CAP].secondsToReset)}"`
);

const capKey = [...numbers.keys()][0];
expect(
  'the stored count stops at the cap rather than climbing while someone retries',
  numbers.get(capKey) === DAILY_CAP,
  `the count reads ${numbers.get(capKey)}`
);

expect(
  'the stored key carries a day and a scramble, and no address',
  /^phoebe:count:2026-08-25:[0-9a-f]{32}$/.test(capKey) && !capKey.includes('203.0.113.7'),
  `the key is "${capKey}"`
);

expect(
  'the counter is told to outlive the day, with an hour to spare',
  expiries.get(capKey) === 8 * 60 * 60,
  `got ${expiries.get(capKey)} seconds`
);

/* One person hitting the cap must never refuse a stranger. */
expect(
  'a different visitor is unaffected by the first one being capped',
  (await countOneMessage(ask('198.51.100.4'), NOW)).kind === 'allowed',
  'a stranger was refused because someone else had used up their day'
);

/* The refund. */
const keysBefore = new Set(numbers.keys());
const spent = await countOneMessage(ask('192.0.2.55'), NOW);
const refundKey = [...numbers.keys()].find((key) => !keysBefore.has(key));
const afterCounting = numbers.get(refundKey);
await spent.refund();

expect(
  'a message that fails on our side is given back',
  afterCounting === 1 && numbers.get(refundKey) === 0,
  `counted to ${afterCounting}, then read ${numbers.get(refundKey)} after the refund`
);

/* ---------------------------------------------------------------------------
   When the store is missing, and where that matters.
--------------------------------------------------------------------------- */

console.log('\n  When the store is missing\n');

const storeUrl = process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_URL;

const onLaptop = await countOneMessage(ask('203.0.113.9'), NOW);
process.env.VERCEL = '1';
const onPlatform = await countOneMessage(ask('203.0.113.9'), NOW);
delete process.env.VERCEL;
process.env.KV_REST_API_URL = storeUrl;

expect(
  'on a laptop, a missing store lets the message through and says so',
  onLaptop.kind === 'uncounted' && onLaptop.why.includes('development only'),
  `got ${onLaptop.kind}`
);

expect(
  'on the platform, a missing store stops Phoebe answering at all',
  onPlatform.kind === 'misconfigured',
  `got ${onPlatform.kind} — a public address would be running with no cap`
);

/* ---------------------------------------------------------------------------
   The abstention log.
--------------------------------------------------------------------------- */

console.log('\n  Every abstention written down\n');

await recordAbstention('How do I work out runoff for a 40 ha catchment?', 'curve number method', NOW);
await recordAbstention('Does this earn carbon credits too?', 'carbon co-benefits', NOW);

const report = await readAbstentions(storeConfig());

expect(
  'both abstentions came back, newest first',
  report.returned === 2 && report.abstentions[0].topic === 'carbon co-benefits',
  `got ${report.returned} entries, newest topic "${report.abstentions[0]?.topic}"`
);

expect(
  'a record keeps when it happened, what it was about, and the question as typed',
  report.abstentions[1].at === NOW.toISOString() &&
    report.abstentions[1].topic === 'curve number method' &&
    report.abstentions[1].question === 'How do I work out runoff for a 40 ha catchment?',
  `got ${JSON.stringify(report.abstentions[1])}`
);

/* The rule that matters most here: a question can never be traced to a person. */
const storedText = JSON.stringify(report.abstentions);
const visitorScrambles = [...numbers.keys()].map((key) => key.split(':').pop());
expect(
  'no record holds any trace of who asked',
  !visitorScrambles.some((id) => storedText.includes(id)) &&
    !/\b\d{1,3}(\.\d{1,3}){3}\b/.test(storedText) &&
    report.abstentions.every((entry) => Object.keys(entry).every((field) =>
      ['at', 'topic', 'question', 'truncated'].includes(field)
    )),
  'a record carried a field beyond when, what about, and the question'
);

/* A long question is cut, and says it was. */
const long = 'x'.repeat(900);
await recordAbstention(long, 'a very long question', NOW);
const withLong = (await readAbstentions(storeConfig())).abstentions[0];
expect(
  'a question longer than the limit is cut short and says plainly that it was',
  withLong.question.length === 500 && withLong.truncated === true,
  `kept ${withLong.question.length} characters, truncated flag ${withLong.truncated}`
);

/* The list is capped rather than growing forever. */
for (let i = 0; i < KEPT + 20; i += 1) {
  await recordAbstention(`question number ${i}`, `topic ${i}`, NOW);
}
const full = await readAbstentions(storeConfig());
expect(
  `the list holds at most ${KEPT} and the oldest fall off the end`,
  full.returned === KEPT && full.abstentions[0].topic === `topic ${KEPT + 19}`,
  `got ${full.returned} entries, newest "${full.abstentions[0]?.topic}"`
);

/* ---------------------------------------------------------------------------
   Reading the log.
--------------------------------------------------------------------------- */

console.log('\n  Reading the log\n');

const read = (query) =>
  abstentionsRoute.GET(new Request(`https://example.invalid/api/abstentions${query}`));

expect(
  'no key is refused',
  (await read('')).status === 401,
  'the log was handed over without a key'
);

expect(
  'a wrong key of exactly the right length is refused',
  (await read(`?key=${'b'.repeat(LOG_KEY.length)}`)).status === 401,
  'a wrong key was accepted'
);

const allowed = await read(`?key=${encodeURIComponent(LOG_KEY)}`);
expect(
  'the right key returns the list',
  allowed.status === 200 && (await allowed.clone().json()).returned === KEPT,
  `got status ${allowed.status}`
);

expect(
  'the log is told not to turn up in a search result',
  (allowed.headers.get('x-robots-tag') ?? '').includes('noindex'),
  `got "${allowed.headers.get('x-robots-tag')}"`
);

/* ---------------------------------------------------------------------------
   The shortcut, while it exists.
--------------------------------------------------------------------------- */

console.log('\n  The testing shortcut\n');

process.env.PHOEBE_TEST_CAP = '3';
const lowered = [];
for (let i = 0; i < 4; i += 1) lowered.push(await countOneMessage(ask('203.0.113.200'), NOW));
/* An attempt to raise it has to be disproved with a full day's worth of
   messages, not one. A single allowed message proves nothing. */
process.env.PHOEBE_TEST_CAP = String(DAILY_CAP + 500);
const raised = [];
for (let i = 0; i < DAILY_CAP + 1; i += 1) raised.push(await countOneMessage(ask('203.0.113.201'), NOW));
delete process.env.PHOEBE_TEST_CAP;

expect(
  'PHOEBE_TEST_CAP can lower the cap, so it can be proved in four messages',
  lowered.slice(0, 3).every((d) => d.kind === 'allowed') && lowered[3].kind === 'refused',
  `got ${lowered.map((d) => d.kind).join(', ')}`
);

expect(
  `PHOEBE_TEST_CAP can never raise the cap — message ${DAILY_CAP + 1} is still refused`,
  raised.slice(0, DAILY_CAP).every((d) => d.kind === 'allowed') &&
    raised[DAILY_CAP].kind === 'refused',
  `a setting lifted the real cap: message ${DAILY_CAP + 1} came back ${raised[DAILY_CAP].kind}`
);

/* ------------------------------------------------------------------------ */

server.close();
rmSync(out, { recursive: true, force: true });

console.log('');

if (problems.length > 0) {
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(`\nFAILED — ${problems.length} of ${checks} checks did not hold.\n`);
  process.exit(1);
}

console.log(`PASSED — ${checks} checks on the daily cap and the abstention log.\n`);
