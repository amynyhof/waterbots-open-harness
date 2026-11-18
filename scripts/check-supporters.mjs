/**
 * Confirms the supporters page — approved 16 Nov 2026, the maintainer's word on #176
 * (docs/proposals/supporters-2026-11-16.md): every public entry waits for her approval before it
 * shows, nothing shows or deletes on its own, and the email never reaches the page.
 *
 *   node scripts/check-supporters.mjs
 *
 * Compiles api/ as the platform does and runs the real endpoints against a store in memory, served
 * over HTTP on this machine, so the approval command and the removal script run as she runs them, in
 * their own processes. What is checked:
 *   - the form's public fields: only with the box ticked, a role from the list, no links, the limits;
 *   - a waiting entry is never in the public list, and no entry anywhere holds the email;
 *   - only approve puts an entry on the page; decline and hide keep it off and keep the sign-up;
 *   - a person's removal takes their entry off the page too;
 *   - the command reads the store keys from .env.local, with nothing to type first;
 *   - the page's words and roles are the server's, word for word, and the page is reachable.
 */

import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
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

const out = mkdtempSync(join(tmpdir(), 'wb-supporters-'));
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
const sup = await import(pathToFileURL(join(out, '_supporters.js')).href);
const { POST } = await import(pathToFileURL(join(out, 'interest.js')).href);
const { GET } = await import(pathToFileURL(join(out, 'supporters.js')).href);

/* THE STORE, IN MEMORY, OVER HTTP — answering /pipeline and /multi-exec the way the real one does. */
const lists = new Map();
const hashes = new Map();
const counters = new Map();
const TOKEN = 'test-token';
const hash = (key) => hashes.get(key) ?? hashes.set(key, new Map()).get(key);
function apply([cmd, key, ...args]) {
  switch (cmd) {
    case 'LPUSH': {
      const l = lists.get(key) ?? [];
      l.unshift(args[0]);
      lists.set(key, l);
      return { result: l.length };
    }
    case 'LRANGE':
      return { result: [...(lists.get(key) ?? [])] };
    case 'LREM': {
      const l = lists.get(key) ?? [];
      const kept = l.filter((x) => x !== args[1]);
      lists.set(key, kept);
      return { result: l.length - kept.length };
    }
    case 'HSET':
      hash(key).set(args[0], args[1]);
      return { result: 1 };
    case 'HGET':
      return { result: hash(key).get(args[0]) ?? null };
    case 'HDEL':
      return { result: hash(key).delete(args[0]) ? 1 : 0 };
    case 'HVALS':
      return { result: [...hash(key).values()] };
    case 'INCR':
    case 'DECR': {
      const n = (counters.get(key) ?? 0) + (cmd === 'INCR' ? 1 : -1);
      counters.set(key, n);
      return { result: n };
    }
    case 'EXPIRE':
      return { result: 1 };
    default:
      return { error: `unexpected ${cmd}` };
  }
}
const server = createServer((req, res) => {
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', () => {
    if (req.headers.authorization !== `Bearer ${TOKEN}` || !['/pipeline', '/multi-exec'].includes(req.url)) {
      res.writeHead(401).end('[]');
      return;
    }
    res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(JSON.parse(raw).map(apply)));
  });
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const STORE_URL = `http://127.0.0.1:${server.address().port}`;

/* Mail goes nowhere; everything else is real. */
const realFetch = globalThis.fetch;
const mailed = [];
globalThis.fetch = async (url, init) => {
  if (String(url).startsWith('https://api.resend.com')) {
    mailed.push(JSON.parse(init.body));
    return new Response('{}', { status: 200 });
  }
  return realFetch(url, init);
};
process.env.KV_REST_API_URL = STORE_URL;
process.env.KV_REST_API_TOKEN = TOKEN;
process.env.RESEND_API_KEY = 'test-key';
process.env.PHOEBE_VISITOR_SALT = 'test-salt';
process.env.VERCEL = '1';

/* Made-up people only. */
const base = {
  name: 'Made-up Supporter',
  organisation: 'Example Water Trust',
  email: 'Supporter@Example.org',
  interests: ['commons'],
  consent: true,
};
let ip = 1;
const post = (body) =>
  POST(new Request('https://open.test/api/interest', { method: 'POST', headers: { 'x-forwarded-for': `198.51.100.${ip++}` }, body: JSON.stringify(body) }));
const shownList = async () => (await (await GET()).json()).supporters;
const everything = () => JSON.stringify([...hashes.entries()].map(([k, h]) => [k, [...h.values()]]));
const waiting = () => [...hash(sup.SUPPORTER_KEYS.waiting).values()].map((v) => JSON.parse(v));

/** Run a script as she runs it, in its own process, against the store. Async, so the store here can answer it. */
function script(file, args, { cwd = process.cwd(), env = {} } = {}) {
  return new Promise((done) => {
    const child = spawn(process.execPath, [resolve(file), ...args], {
      cwd,
      env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, ...env },
    });
    let text = '';
    child.stdout.on('data', (c) => (text += c));
    child.stderr.on('data', (c) => (text += c));
    child.on('close', (code) => done({ code, text }));
  });
}
const storeEnv = { KV_REST_API_URL: STORE_URL, KV_REST_API_TOKEN: TOKEN };

console.log('Supporters (16 Nov 2026, #176)\n');
console.log('  The form');
let res = await post(base);
let body = await res.json();
expect('a sign-up without the box sends nothing public', res.status === 200 && !body.waiting && waiting().length === 0, JSON.stringify(body));

res = await post({ ...base, public: true, role: 'funder', title: 'Made-up title', comment: 'A made-up comment for the check.' });
body = await res.json();
const [w] = waiting();
expect('with the box ticked and a role, the entry waits and the visitor is told so', res.status === 200 && body.waiting === true && w?.role === 'funder', JSON.stringify(body));
expect(
  'the waiting entry holds the name as typed, the organisation, role, title and comment, and the box\'s words',
  w?.name === 'Made-up Supporter' && w?.organisation === 'Example Water Trust' && w?.title === 'Made-up title' &&
    w?.comment === 'A made-up comment for the check.' && w?.agreed === sup.PUBLIC_WORDS && /^[a-z0-9]{5}$/.test(w?.id ?? ''),
  JSON.stringify(w)
);
const signups = (lists.get('interest:signups') ?? []).map((x) => JSON.parse(x));
expect('the sign-up keeps the supporter\'s id, so a removal finds both', signups[0]?.supporter === w?.id && signups[0]?.email === 'supporter@example.org', JSON.stringify(signups[0]));
expect('no supporter entry holds the email, in any state', !/example\.org/i.test(everything()), everything());
expect('the copy to hello@ says something is waiting and how to see it', /waiting for your approval/.test(mailed.at(-1)?.text ?? '') && /npm run supporters/.test(mailed.at(-1)?.text ?? ''), mailed.at(-1)?.text);
expect('waiting is never on the page', (await shownList()).length === 0, JSON.stringify(await shownList()));

for (const [label, change] of [
  ['a role without the box ticked', { role: 'funder' }],
  ['a comment without the box ticked', { comment: 'hello' }],
  ['the box ticked with no role', { public: true }],
  ['a role off the list', { public: true, role: 'investor' }],
  ['a comment with a link', { public: true, role: 'other', comment: 'see https://example.org' }],
  ['a comment with a bare domain', { public: true, role: 'other', comment: 'see example.com for more' }],
  ['a comment past 280 characters', { public: true, role: 'other', comment: 'x'.repeat(281) }],
  ['a title past 80 characters', { public: true, role: 'other', title: 'x'.repeat(81) }],
]) {
  const before = waiting().length;
  res = await post({ ...base, ...change });
  body = await res.json();
  expect(`${label} is refused, named, and nothing kept`, res.status === 400 && /not kept/.test(body.error) && waiting().length === before, `${res.status} ${body.error}`);
}

console.log('\n  Her approval: nothing shows on its own');
const id = w.id;
let run = await script('scripts/supporters.mjs', [], { env: storeEnv });
expect(
  'the command lists what is waiting, with the exact line to paste, and never an email',
  run.code === 0 && run.text.includes(`npm run supporters -- approve ${id}`) && run.text.includes(`npm run supporters -- decline ${id}`) &&
    run.text.includes('Made-up Supporter') && !/@/.test(run.text),
  run.text
);
run = await script('scripts/supporters.mjs', ['approve', id], { env: storeEnv });
let shown = await shownList();
expect('approve puts it on the page, and says so in one line', run.code === 0 && /^Approved: /.test(run.text) && shown.length === 1, run.text);
expect(
  'the page gets the public fields and the month approved, nothing more',
  JSON.stringify(Object.keys(shown[0] ?? {}).sort()) === JSON.stringify(['comment', 'joined', 'name', 'organisation', 'role', 'title']) &&
    /^\d{4}-\d{2}$/.test(shown[0]?.joined ?? ''),
  JSON.stringify(shown[0])
);
run = await script('scripts/supporters.mjs', ['hide', id], { env: storeEnv });
expect('hide takes it off the page and keeps the sign-up', run.code === 0 && /^Hidden: /.test(run.text) && (await shownList()).length === 0 && (lists.get('interest:signups') ?? []).length === 2, run.text);
run = await script('scripts/supporters.mjs', ['approve', 'zzzzz'], { env: storeEnv });
expect('an id that is not there changes nothing and says so', run.code === 1 && /Nothing changed/.test(run.text), run.text);

await post({ ...base, name: 'Second Made-up', email: 'second@example.org', public: true, role: 'auditor' });
const second = waiting().find((e) => e.name === 'Second Made-up');
run = await script('scripts/supporters.mjs', ['decline', second.id], { env: storeEnv });
expect('decline keeps it off the page and keeps the sign-up', run.code === 0 && /^Declined: /.test(run.text) && (await shownList()).length === 0 && hash(sup.SUPPORTER_KEYS.declined).has(second.id), run.text);

{
  /* .env.local, with nothing set first: her one paste. A folder of its own holds a made-up .env.local. */
  const folder = mkdtempSync(join(tmpdir(), 'wb-envlocal-'));
  writeFileSync(join(folder, '.env.local'), `# made up\nKV_REST_API_URL="${STORE_URL}"\nKV_REST_API_TOKEN=${TOKEN}\nOTHER=ignored\n`);
  run = await script('scripts/supporters.mjs', ['approve', second.id], { cwd: folder });
  expect('the command reads the store keys from .env.local, with nothing to type first', run.code === 0 && /^Approved: /.test(run.text) && (await shownList()).length === 1, run.text);
  rmSync(join(folder, '.env.local'));
  run = await script('scripts/supporters.mjs', [], { cwd: folder });
  expect('with no .env.local and no keys it says so plainly and changes nothing', run.code === 1 && /no \.env\.local/i.test(run.text), run.text);
  rmSync(folder, { recursive: true, force: true });
}

console.log('\n  Removal: only the person\'s own request');
run = await script('scripts/count-interest.mjs', ['--remove', 'second@example.org'], { env: storeEnv });
expect(
  'removing a person\'s sign-up takes them off the page too, and prints no name or email',
  run.code === 0 && (await shownList()).length === 0 && !hash(sup.SUPPORTER_KEYS.shown).has(second.id) && !/Second|example\.org/.test(run.text),
  run.text
);
expect('nothing in the store is given an expiry for supporters', !/EXPIRE[^\n]*supporters|supporters[^\n]*EXPIRE/.test(readFileSync(join('api', 'interest.ts'), 'utf8')), 'an expiry on supporters');

console.log('\n  The page\'s own form (18 Nov 2026)');
{
  /* Her word of 18 Nov 2026 on #176: the form on /supporters, saving where Register your interest saves. */
  const pageForm = { source: 'supporters', name: 'Page Made-up', email: 'Page@Example.org' };
  const count = () => (lists.get('interest:signups') ?? []).length;
  let before = count();
  res = await post(pageForm);
  body = await res.json();
  let kept = JSON.parse((lists.get('interest:signups') ?? [])[0] ?? '{}');
  expect(
    'a name and an email are enough: no organisation, no interests, no box, and it lands in the same list as Register your interest',
    res.status === 200 && count() === before + 1 && kept.source === 'supporters' && kept.email === 'page@example.org' && kept.organisation === '' &&
      kept.interests.length === 0 && kept.newsletter === false && !kept.supporter,
    `${res.status} ${JSON.stringify(body)} ${JSON.stringify(kept)}`
  );
  before = waiting().length;
  res = await post({ ...pageForm, organisation: 'Example Org', comment: 'A made-up comment kept private.', newsletter: true });
  kept = JSON.parse((lists.get('interest:signups') ?? [])[0] ?? '{}');
  expect(
    'the comment, the organisation and the newsletter box are kept with the sign-up, and nothing waits to show unless the box is ticked',
    res.status === 200 && kept.comment === 'A made-up comment kept private.' && kept.organisation === 'Example Org' && kept.newsletter === true &&
      waiting().length === before && /Send me the WaterBots newsletter/.test(kept.consent),
    JSON.stringify(kept)
  );
  res = await post({ ...pageForm, name: 'Shown Made-up', organisation: 'Hidden Org', comment: 'Made-up words to show.', public: true });
  body = await res.json();
  const entry = waiting().find((e) => e.name === 'Shown Made-up');
  expect(
    'ticked "Show my name and comment on this page", the name and comment wait for her approval, and nothing else does',
    res.status === 200 && body.waiting === true && entry?.comment === 'Made-up words to show.' && entry?.organisation === '' &&
      entry?.role === '' && entry?.title === '' && entry?.agreed === sup.SHOW_WORDS && (await shownList()).every((s) => s.name !== 'Shown Made-up'),
    JSON.stringify(entry)
  );
  expect('still no email in any supporter entry', !/example\.org/i.test(everything()), everything());
  run = await script('scripts/supporters.mjs', ['approve', entry.id], { env: storeEnv });
  const shownNow = (await shownList()).find((s) => s.name === 'Shown Made-up');
  expect(
    'approved, it shows the name and the comment, with no role or organisation',
    run.code === 0 && shownNow?.comment === 'Made-up words to show.' && shownNow?.role === '' && shownNow?.organisation === '',
    `${run.text} ${JSON.stringify(shownNow)}`
  );
  expect('the copy to hello@ says it came from the supporters page, with the newsletter answer', /supporters page/.test(mailed.at(-1)?.text ?? '') && /Newsletter: no/.test(mailed.at(-1)?.text ?? ''), mailed.at(-1)?.text);
  for (const [label, change] of [
    ['no email', { email: '' }],
    ['no name', { name: ' ' }],
    ['a role, which this form does not ask', { role: 'funder' }],
    ['interests, which this form does not ask', { interests: ['carbon'] }],
    ['a consent box, which this form does not have', { consent: true }],
    ['a newsletter box that is not a yes or a no', { newsletter: 'yes' }],
    ['a comment with a link', { comment: 'see www.example.org' }],
    ['a form name that is not one of the site\'s', { source: 'other' }],
  ]) {
    before = count();
    res = await post({ ...pageForm, ...change });
    body = await res.json();
    expect(`${label} is refused, named, and nothing kept`, res.status === 400 && /not kept/.test(body.error) && count() === before, `${res.status} ${body.error}`);
  }
  before = count();
  res = await post({ name: 'Old Form', email: 'old@example.org', interests: ['carbon'], consent: true, organisation: 'Org', newsletter: true });
  expect('Register your interest still asks its own questions, and no newsletter', res.status === 400 && count() === before, String(res.status));
}

globalThis.fetch = realFetch;
server.close();
rmSync(out, { recursive: true, force: true });

console.log('\n  The page says what the server keeps');
const pick = (src, name) => (src.match(new RegExp(`export const ${name} =([\\s\\S]*?);\\n`)) ?? [])[1]?.replace(/\s+/g, ' ').trim();
const client = readFileSync(join('src', 'lib', 'supporters.ts'), 'utf8');
const serverSide = readFileSync(join('api', '_supporters.ts'), 'utf8');
for (const name of ['ROLES', 'SUPPORT_LIMITS', 'PUBLIC_WORDS']) {
  expect(`${name} is the same on the page and the server`, pick(client, name) && pick(client, name) === pick(serverSide, name), `${pick(client, name)} | ${pick(serverSide, name)}`);
}
expect('the roles are her six, in her order', /Developer[\s\S]*Standard body[\s\S]*Consultant[\s\S]*Auditor[\s\S]*Funder[\s\S]*Other/.test(pick(client, 'ROLES') ?? ''), pick(client, 'ROLES'));
expect('the intro line is hers, word for word', /SUPPORTERS_INTRO = 'People who want water impact to be faster and fairer to prove\.'/.test(client), 'intro changed');
const form = readFileSync(join('src', 'components', 'InterestPage.tsx'), 'utf8');
expect('the public box starts unticked', /public: false/.test(form), 'the form does not start with public false');
const page = readFileSync(join('src', 'components', 'SupportersPage.tsx'), 'utf8');
expect('no sample cards or placeholder names on the page', !/sample|placeholder name|Lorem/i.test(page.replace(/\/\*[\s\S]*?\*\//g, '')), 'a sample on the page');
{
  /* The agents as the first entries, her word of 18 Nov 2026 on #176. */
  const crew = readFileSync(join('src', 'lib', 'crew.ts'), 'utf8');
  const agents = [...client.matchAll(/\{ name: '([A-Za-z]+)', comment: '([^']+)' \}/g)].map((m) => ({ name: m[1], comment: m[2] }));
  expect(
    'the board opens with the four agents, each one of the crew, each with one short line',
    agents.map((a) => a.name).join() === 'Wellington,Phoebe,Bridget,Calvin' &&
      agents.every((a) => new RegExp(`name: '${a.name}'`).test(crew) && a.comment.length <= 100 && (a.comment.match(/[.!?]/g) ?? []).length === 1),
    JSON.stringify(agents)
  );
  expect(
    'each agent wears the crew\'s own icon and the "WaterBots agent" tag, so no one takes it for a person',
    /AGENT_TAG = 'WaterBots agent'/.test(client) && /crewMember\(name\)/.test(page) && /agent\.portrait/.test(page) && /\{AGENT_TAG\}/.test(page),
    'the icon or the tag is missing'
  );
  expect('the reclining Wellington from her concept note is on the page', /<WellingtonLeaning/.test(page), 'no Wellington');
}
expect('a list that cannot be read is said, never shown as empty', /reading\.kind === 'failed'/.test(page), 'no failed state');
{
  /* Her word of 18 Nov 2026 on #176: three lines off the page, the form on it, the thank-you. */
  const app = readFileSync(join('src', 'App.tsx'), 'utf8');
  /* What a visitor can read: the files without their comments, which name the removed lines on purpose. */
  const bare = (src) => src.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  expect(
    'the three lines are gone from the page',
    !/Each person's entry is shown with their permission|No people are shown yet|No supporters are shown yet|To be taken off this page/.test(bare(page) + bare(client)),
    'a removed line is still there'
  );
  expect('the Register your interest box is gone from the page, and the form is in its place', !/wb-interest-cta|Register your interest/.test(bare(page)) && /<SupportForm \/>/.test(page), 'the box is still there');
  expect(
    'the form asks name, email (required), organization (optional), a short comment and two unticked boxes',
    /label="Name"/.test(page) && /label="Email"[\s\S]{0,200}required/.test(page) && /label="Organization \(optional\)"/.test(page) &&
      /A short comment/.test(page) && /show: false, newsletter: false/.test(page) &&
      /SHOW_WORDS = 'Show my name and comment on this page'/.test(client) && /NEWSLETTER_WORDS = 'Send me the WaterBots newsletter'/.test(client),
    'a field or a box is missing'
  );
  expect('the boxes say what the server keeps, word for word', pick(client, 'SHOW_WORDS') === pick(serverSide, 'SHOW_WORDS') && pick(client, 'NEWSLETTER_WORDS') === pick(serverSide, 'NEWSLETTER_WORDS'), 'the words differ');
  expect('it saves where Register your interest saves', /fetch\('\/api\/interest'/.test(client) && /source: 'supporters'/.test(client), 'another address');
  expect(
    'after sending, the thank-you says to write to hello@waterbots.ai to change or remove the entry',
    /THANKS_LINE = 'Thank you\. To change or remove your entry, write to hello@waterbots\.ai\.'/.test(client) && /\{THANKS_LINE\}/.test(page),
    'the thank-you is missing'
  );
  expect('the form\'s Send is the page\'s one blue button, and the menu\'s Sign up goes quiet', /btn-primary wb-form-send/.test(page) && /form: onInterest \|\| onSupporters/.test(app), 'the blue rule is not kept');
}
expect('/supporters is served by the page', /"source": "\/supporters"/.test(readFileSync('vercel.json', 'utf8')), 'no rewrite');
expect(
  'the ways in: one quiet line on the Commons and on the form',
  /SUPPORTERS_LINK/.test(readFileSync(join('src', 'components', 'CommonsShelf.tsx'), 'utf8')) && /<SupportersLink/.test(form),
  'a way in is missing'
);
expect('approving is one npm command', JSON.parse(readFileSync('package.json', 'utf8')).scripts?.supporters === 'node scripts/supporters.mjs', 'no npm script');

if (problems.length) {
  console.error(`\nFAILED — ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`\nPASSED — ${checks} checks on the supporters page.`);
