/**
 * Confirms Register your interest — approved 16 Nov 2026
 * (docs/proposals/queued-round-2026-11-16.md, item 5), with her ruling on
 * keeping: no time limit, kept until the person asks to be removed, the form
 * says how to ask, and nothing deletes on its own.
 *
 *   node scripts/check-interest.mjs
 *
 * Compiles api/ as the platform does and runs the real endpoint against a
 * store that is a list in memory, so what is checked is what deploys: the
 * fields, the robot field, the box, the cap of three, what is kept and that
 * nothing is given an expiry or trimmed. Then it holds the page's words to
 * the server's, word for word, and reads the counting script to see that it
 * never prints a name or an email.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const problems = [];
let checks = 0;
function expect(label, condition, detail) {
  checks += 1;
  if (condition) console.log(`  ok    ${label}`);
  else {
    console.log(`  FAIL  ${label}`);
    problems.push(`${label} — ${detail}`);
  }
}

const out = mkdtempSync(join(tmpdir(), 'wb-interest-'));
const compile = spawnSync(
  process.execPath,
  [join('node_modules', 'typescript', 'bin', 'tsc'), '-p', 'tsconfig.api.json', '--noEmit', 'false', '--outDir', out, '--composite', 'false', '--declaration', 'false'],
  { encoding: 'utf8' }
);
if (compile.status !== 0) {
  console.error(compile.stdout || compile.stderr);
  process.exit(1);
}
writeFileSync(join(out, 'package.json'), '{"type":"module"}');
const api = await import(pathToFileURL(join(out, '_interest.js')).href);
const { POST } = await import(pathToFileURL(join(out, 'interest.js')).href);
const { INTEREST } = await import(pathToFileURL(join(out, '_cap.js')).href);

console.log('Register your interest (16 Nov 2026)\n');

/* A store in memory, answering the pipeline the way the real one does. */
const lists = new Map();
const counters = new Map();
const commandsSeen = [];
const realFetch = globalThis.fetch;
const mailed = [];
globalThis.fetch = async (url, init) => {
  if (String(url).startsWith('https://store.test')) {
    const commands = JSON.parse(init.body);
    const results = commands.map(([cmd, key, ...args]) => {
      commandsSeen.push(cmd);
      if (cmd === 'LPUSH') {
        const l = lists.get(key) ?? [];
        l.unshift(args[0]);
        lists.set(key, l);
        return { result: l.length };
      }
      if (cmd === 'INCR') {
        const n = (counters.get(key) ?? 0) + 1;
        counters.set(key, n);
        return { result: n };
      }
      if (cmd === 'DECR') {
        const n = (counters.get(key) ?? 0) - 1;
        counters.set(key, n);
        return { result: n };
      }
      if (cmd === 'EXPIRE') return { result: 1 };
      return { error: `unexpected ${cmd}` };
    });
    return new Response(JSON.stringify(results), { status: 200 });
  }
  if (String(url).startsWith('https://api.resend.com')) {
    mailed.push(JSON.parse(init.body));
    return new Response('{}', { status: 200 });
  }
  return realFetch(url, init);
};
process.env.KV_REST_API_URL = 'https://store.test';
process.env.KV_REST_API_TOKEN = 'test-token';
process.env.RESEND_API_KEY = 'test-key';
process.env.PHOEBE_VISITOR_SALT = 'test-salt';
process.env.VERCEL = '1';

const good = {
  name: 'A. Tester',
  organisation: 'Example Water Trust',
  email: 'Tester@Example.org',
  interests: ['carbon', 'commons'],
  module: 'bridget',
  consent: true,
};
let ip = 1;
const post = (body, from = `198.51.100.${ip++}`) =>
  POST(new Request('https://open.test/api/interest', { method: 'POST', headers: { 'x-forwarded-for': from }, body: JSON.stringify(body) }));

console.log('  What a sign-up is');
let res = await post(good);
let body = await res.json();
const kept = lists.get(api.INTEREST_KEY) ?? [];
expect('a good sign-up is kept and says so', res.status === 200 && body.kept === true && kept.length === 1, `${res.status} ${JSON.stringify(body)}`);
const entry = JSON.parse(kept[0] ?? '{}');
expect(
  'what is kept is the fields, the date and the consent words, the email in lower case',
  entry.name === 'A. Tester' && entry.organisation === 'Example Water Trust' && entry.email === 'tester@example.org' &&
    entry.interests.join() === 'carbon,commons' && entry.module === 'bridget' && entry.consent === api.CONSENT_WORDS && /^\d{4}-/.test(entry.at),
  JSON.stringify(entry)
);
expect('a copy goes to hello@waterbots.ai', mailed.length === 1 && mailed[0].to[0] === 'hello@waterbots.ai', JSON.stringify(mailed));
expect(
  'nothing is given an expiry or trimmed — kept until the person asks (her ruling)',
  !commandsSeen.includes('LTRIM') && /\['LPUSH', key, entry\]\]/.test(readFileSync(join('api', '_store.ts'), 'utf8')),
  `commands seen: ${[...new Set(commandsSeen)].join(', ')}`
);

for (const [label, change] of [
  ['an unticked box', { consent: false }],
  ['a box that is only truthy', { consent: 'yes' }],
  ['no interest', { interests: [] }],
  ['an interest off the list', { interests: ['crypto'] }],
  ['a missing name', { name: '  ' }],
  ['an email that is not one', { email: 'not-an-email' }],
  ['a name past 80 characters', { name: 'x'.repeat(81) }],
  ['a field that is not on the form', { phone: '123' }],
  ['a module that is not a slug', { module: '../etc' }],
]) {
  const before = (lists.get(api.INTEREST_KEY) ?? []).length;
  res = await post({ ...good, ...change });
  body = await res.json();
  expect(`${label} is refused, named, and nothing kept`, res.status === 400 && /not kept/.test(body.error) && (lists.get(api.INTEREST_KEY) ?? []).length === before, `${res.status} ${body.error}`);
}

console.log('\n  The robot field and the cap');
let before = (lists.get(api.INTEREST_KEY) ?? []).length;
res = await post({ ...good, website: 'http://spam.example' });
body = await res.json();
expect('a filled hidden field is dropped without a word: nothing kept, no mail', res.status === 200 && (lists.get(api.INTEREST_KEY) ?? []).length === before && mailed.length === 1, `${res.status}`);
expect('the cap is three a day per visitor (her plan)', INTEREST.cap === 3 && INTEREST.name === 'interest', JSON.stringify(INTEREST));
const statuses = [];
for (let i = 0; i < 4; i += 1) statuses.push((await post(good, '203.0.113.9')).status);
expect('a fourth sign-up from one visitor in a day is refused', statuses.join() === '200,200,200,429', statuses.join());

console.log('\n  Where there is no store');
delete process.env.KV_REST_API_URL;
delete process.env.VERCEL;
res = await post(good);
body = await res.json();
expect('on a test copy it says the form works only on the live site, and nothing was kept', res.status === 503 && /test copy/.test(body.error) && /Nothing was kept/.test(body.error), body.error);
globalThis.fetch = realFetch;
rmSync(out, { recursive: true, force: true });

console.log('\n  The page says what the server keeps');
const page = readFileSync(join('src', 'lib', 'interest.ts'), 'utf8');
const pick = (src, name) => (src.match(new RegExp(`export const ${name} =([\\s\\S]*?);\\n`)) ?? [])[1]?.replace(/\s+/g, ' ').trim();
const server = readFileSync(join('api', '_interest.ts'), 'utf8');
for (const name of ['INTERESTS', 'INTEREST_LIMITS', 'CONSENT_WORDS']) {
  expect(`${name} is the same on the page and the server`, pick(page, name) && pick(page, name) === pick(server, name), `${pick(page, name)} | ${pick(server, name)}`);
}
expect(
  'the form says how long details are kept and how to be removed',
  /until you ask us to remove them/.test(page) && /Nothing is deleted on its own/.test(page) && /write to hello@waterbots\.ai/.test(page),
  'the keeping line is missing or changed'
);
const form = readFileSync(join('src', 'components', 'InterestPage.tsx'), 'utf8');
expect('the box starts unticked', /consent: false/.test(form), 'the form does not start with consent false');
expect('the form shows the keeping line', /\{KEEPING_LINE\}/.test(form), 'KEEPING_LINE is not drawn');

console.log('\n  The ways in, and the counting');
const rail = readFileSync(join('src', 'components', 'NavRail.tsx'), 'utf8');
const shelf = readFileSync(join('src', 'components', 'CommonsShelf.tsx'), 'utf8');
expect('the left rail has the quiet link', /Register your interest/.test(rail) && /wb-quiet-link/.test(rail), 'no link in the rail');
expect('a Commons "Coming soon" row opens the form with its module', /Coming soon ·/.test(shelf) && /pathForInterest\(card\.slug\)/.test(shelf), 'no link on the Commons');
expect('/interest is served by the page', /"source": "\/interest"/.test(readFileSync('vercel.json', 'utf8')), 'no rewrite for /interest');
const counter = readFileSync(join('scripts', 'count-interest.mjs'), 'utf8');
const printed = [...counter.matchAll(/console\.(log|error)\(([^;]*)\);/g)].map((m) => m[2]).join('\n');
expect(
  'the counting script never prints a name or an email',
  !/entry\.(name|email)|\bemail\b\s*\}|\$\{email\}|p\.raw|\$\{entry\b/.test(printed),
  printed
);

if (problems.length) {
  console.error(`\nFAILED — ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`\nPASSED — ${checks} checks on Register your interest.`);
