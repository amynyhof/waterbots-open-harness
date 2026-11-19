/**
 * Confirms the supporters page — approved 16 Nov 2026, the maintainer's word on #176
 * (docs/proposals/supporters-2026-11-16.md), as changed by her word on 18 and 19 Nov 2026: the
 * supporters page is the one place to post; a name, an email and a comment, then Post in the pop-up,
 * put the post on the board at once, past the filter; the poster edits and deletes it with its own
 * private key; she takes one off with hide; and the email never reaches the page.
 *
 *   node scripts/check-supporters.mjs
 *
 * Compiles api/ as the platform does and runs the real endpoints against a store in memory, served
 * over HTTP on this machine, so the approval command and the removal script run as she runs them, in
 * their own processes. What is checked:
 *   - Register your interest posts nothing, and says where to post;
 *   - a post: its rules, the filter, the card and the key in the answer, the key's hash alone kept,
 *     the email to the poster with the private link, and no email in any supporter entry;
 *   - edit and delete with the post's own key, through the same rules; another key changes nothing;
 *   - hide keeps a post off and keeps the sign-up; a person's removal takes their post off too;
 *   - the command reads the store keys from .env.local, with nothing to type first;
 *   - the page's words are the server's and hers, word for word, and the page is as she said.
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
const { BLOCKED_LINE: BLOCKED } = await import(pathToFileURL(join(out, '_postFilter.js')).href);

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

console.log('Supporters (16 Nov 2026, #176; posting from 19 Nov 2026)\n');
const { POST: CHANGE } = await import(pathToFileURL(join(out, 'supporter-post.js')).href);
const change = (body) => CHANGE(new Request('https://open.test/api/supporter-post', { method: 'POST', body: JSON.stringify(body) }));
const shownHash = () => hash(sup.SUPPORTER_KEYS.shown);
const signupsNow = () => (lists.get('interest:signups') ?? []).map((x) => JSON.parse(x));
const count = () => (lists.get('interest:signups') ?? []).length;

console.log('  Register your interest posts nothing');
let res = await post(base);
let body = await res.json();
expect('a sign-up is kept, and nothing goes to the board', res.status === 200 && !body.shown && !body.edit && shownHash().size === 0 && waiting().length === 0, JSON.stringify(body));
for (const [label, extra] of [
  ['the old public box', { public: true, role: 'funder' }],
  ['a role', { role: 'funder' }],
  ['a title', { title: 'Made-up title' }],
  ['a comment', { comment: 'hello' }],
]) {
  const before = count();
  res = await post({ ...base, ...extra });
  body = await res.json();
  expect(`${label} on Register your interest is refused, pointing to the supporters page, and nothing kept`, res.status === 400 && /supporters page/.test(body.error) && count() === before, `${res.status} ${body.error}`);
}

console.log('\n  Posting on the supporters page');
const pageForm = { source: 'supporters', name: 'Page Made-up', email: 'Page@Example.org', comment: 'Made-up words to show.' };
const mailsBefore = mailed.length;
res = await post({ ...pageForm, organisation: 'Hidden Org', newsletter: true });
body = await res.json();
const posted = body;
const entry = JSON.parse(shownHash().get(posted.edit?.id) ?? '{}');
expect(
  'a name, an email and a comment post: on the page at once, with no box and no approval',
  res.status === 200 && posted.shown?.name === 'Page Made-up' && posted.shown?.comment === 'Made-up words to show.' &&
    (await shownList()).some((s) => s.id === posted.edit?.id && s.comment === 'Made-up words to show.') && waiting().length === 0,
  JSON.stringify(body)
);
expect(
  'the answer carries the card (public fields and id only) and the private key, once',
  JSON.stringify(Object.keys(posted.shown ?? {}).sort()) === JSON.stringify(['comment', 'id', 'joined', 'name', 'organisation', 'role', 'title']) &&
    posted.shown.organisation === '' && /^[A-Za-z0-9_-]{43}$/.test(posted.edit?.token ?? '') && posted.edit?.id === posted.shown.id,
  JSON.stringify(body)
);
expect(
  'the store keeps the key\'s SHA-256 only, never the key, and the pop-up\'s words',
  entry.editKey === (await sup.editKeyOf(posted.edit.token)) && !everything().includes(posted.edit.token) && entry.agreed === sup.CONFIRM_WORDS,
  JSON.stringify(entry)
);
expect('the page\'s list never carries the key or its hash', !JSON.stringify(await shownList()).includes(entry.editKey) && !JSON.stringify(await shownList()).includes(posted.edit.token), 'a key on the page');
expect('no email in any supporter entry, nor on the card', !/example\.org/i.test(everything()) && !/example\.org/i.test(JSON.stringify(posted.shown)), everything());
const kept = signupsNow()[0];
expect(
  'the sign-up lands in the same list as Register your interest, with the supporter id, the newsletter answer and the pop-up\'s words',
  kept.source === 'supporters' && kept.supporter === posted.edit.id && kept.email === 'page@example.org' && kept.newsletter === true &&
    kept.consent.includes(sup.CONFIRM_WORDS) && kept.consent.includes('Send me the WaterBots newsletter'),
  JSON.stringify(kept)
);
const newMail = mailed.slice(mailsBefore);
const toPoster = newMail.find((m) => m.to?.[0] === 'page@example.org');
const toTeam = newMail.find((m) => m.to?.[0] === 'hello@waterbots.ai');
expect(
  'the poster gets an email with the private link, the key after the #, and is told to keep it to themselves',
  posted.posterMailed === true && toPoster?.text?.includes(`https://open.waterbots.ai/supporters#edit=${posted.edit.id}.${posted.edit.token}`) &&
    /Keep this link to yourself/.test(toPoster?.text ?? '') && /hello@waterbots\.ai/.test(toPoster?.text ?? ''),
  toPoster?.text
);
expect(
  'the copy to hello@ says it is on the page and gives the line to take it off, and never carries the key',
  /on the supporters page now/.test(toTeam?.text ?? '') && (toTeam?.text ?? '').includes(`npm run supporters -- hide ${posted.edit.id}`) && !(toTeam?.text ?? '').includes(posted.edit.token),
  toTeam?.text
);
expect(
  'the private link points at this site or its preview, never at an address a request made up',
  sup.editLink('https://waterbots-open-harness-git-x-water-bots-ai.vercel.app/api/interest', 'abcde', 'k').startsWith('https://waterbots-open-harness-git-x-water-bots-ai.vercel.app/supporters#edit=') &&
    sup.editLink('https://evil.example/api/interest', 'abcde', 'k').startsWith('https://open.waterbots.ai/supporters#edit=') &&
    sup.editLink('https://open.waterbots.ai/api/interest', 'abcde', 'k') === 'https://open.waterbots.ai/supporters#edit=abcde.k',
  'a link to somewhere else'
);
for (const [label, extra] of [
  ['no comment', { comment: '' }],
  ['no email', { email: '' }],
  ['no name', { name: ' ' }],
  ['a role, which this form does not ask', { role: 'funder' }],
  ['interests, which this form does not ask', { interests: ['carbon'] }],
  ['a consent box, which this form does not have', { consent: true }],
  ['a newsletter box that is not a yes or a no', { newsletter: 'yes' }],
  ['a comment with a link', { comment: 'see www.example.org' }],
  ['a name with a link', { name: 'Made-up www.example.com' }],
  ['a comment past 280 characters', { comment: 'x'.repeat(281) }],
  ['a form name that is not one of the site\'s', { source: 'other' }],
]) {
  const before = count();
  res = await post({ ...pageForm, ...extra });
  body = await res.json();
  expect(`${label} is refused, named, and nothing kept`, res.status === 400 && /not kept/.test(body.error) && count() === before, `${res.status} ${body.error}`);
}
{
  const before = shownHash().size;
  res = await post({ ...pageForm, name: 'Old Page Made-up', public: false });
  expect('a page left open from before, with the old box unticked, is kept and posts nothing', res.status === 200 && shownHash().size === before, String(res.status));
}

/* The filter, her word of 18 Nov 2026: rude, sexual and spam posts are blocked with a plain line. */
for (const [label, extra] of [
  ['a rude word, letters swapped', { comment: 'This is sh1t work' }],
  ['a sexually explicit word', { comment: 'hot porn here' }],
  ['a rude word spelled out', { comment: 'f u c k it' }],
  ['spam words', { comment: 'Click here to buy now' }],
  ['a phone number', { comment: 'Call +254 712 345 678 today' }],
  ['an email address', { comment: 'write to deals@mailbox.xyz' }],
  ['a rude name', { name: 'Shit Head' }],
]) {
  const before = count();
  const shownBefore = shownHash().size;
  res = await post({ ...pageForm, ...extra });
  body = await res.json();
  expect(`${label} is blocked with the plain line, and nothing kept`, res.status === 422 && body.error === BLOCKED && count() === before && shownHash().size === shownBefore, `${res.status} ${body.error}`);
}
for (const ok of ['Our stopcock fix brought 1 000 000 litres to Scunthorpe.', 'Sanitation and women\'s safety at the water point matter.']) {
  res = await post({ ...pageForm, comment: ok });
  expect(`ordinary water words pass the filter: "${ok}"`, res.status === 200, String(res.status));
}

console.log('\n  The poster edits and deletes their own post');
const own = { id: posted.edit.id, key: posted.edit.token };
res = await change({ action: 'edit', ...own, name: 'Page Made-up, edited', comment: 'Edited made-up words.' });
body = await res.json();
expect(
  'with the post\'s own key, an edit changes the name and comment on the page at once',
  res.status === 200 && body.shown?.comment === 'Edited made-up words.' && (await shownList()).some((s) => s.id === own.id && s.name === 'Page Made-up, edited') &&
    typeof JSON.parse(shownHash().get(own.id)).editedAt === 'string' && JSON.parse(shownHash().get(own.id)).editKey === entry.editKey,
  JSON.stringify(body)
);
const otherKey = 'A'.repeat(43);
res = await change({ action: 'edit', id: own.id, key: otherKey, name: 'Taken', comment: 'Taken over.' });
body = await res.json();
expect('another key changes nothing, and says so', res.status === 403 && /does not match/.test(body.error) && JSON.parse(shownHash().get(own.id)).comment === 'Edited made-up words.', `${res.status} ${body.error}`);
for (const [label, extra, status] of [
  ['a rude edit', { comment: 'what the f*ck' }, 422],
  ['an edit with a link', { comment: 'see https://example.org' }, 400],
  ['an edit with no comment', { comment: ' ' }, 400],
  ['an edit past 280 characters', { comment: 'x'.repeat(281) }, 400],
]) {
  res = await change({ action: 'edit', ...own, name: 'Page Made-up', ...extra });
  body = await res.json();
  expect(`${label} is refused through the same rules, and the post is unchanged`, res.status === status && /not changed|Nothing changed/i.test(body.error) && JSON.parse(shownHash().get(own.id)).comment === 'Edited made-up words.', `${res.status} ${body.error}`);
}
res = await change({ action: 'edit', id: own.id, key: 'short', name: 'x', comment: 'y' });
expect('a link cut short is refused plainly', res.status === 400 && /not complete/.test((await res.json()).error), String(res.status));
res = await change({ action: 'delete', id: 'zzzzz', key: otherKey });
expect('a post that is not there says so', res.status === 404 && /no longer on the page/.test((await res.json()).error), String(res.status));
res = await change({ action: 'delete', ...own, comment: 'x' });
expect('a delete carries nothing else', res.status === 400, String(res.status));
res = await change({ action: 'delete', id: own.id, key: otherKey });
expect('another key cannot delete it', res.status === 403 && shownHash().has(own.id), String(res.status));

let run = await script('scripts/supporters.mjs', [], { env: storeEnv });
expect(
  'npm run supporters lists what is on the page first, each with its line to take it off, and never an email',
  run.code === 0 && run.text.includes(`npm run supporters -- hide ${own.id}`) && run.text.includes('on the supporters page') && !/@/.test(run.text),
  run.text
);
run = await script('scripts/supporters.mjs', ['hide', own.id], { env: storeEnv });
expect('she can take one off: hide, and the sign-up is kept', run.code === 0 && /^Hidden: /.test(run.text) && !shownHash().has(own.id) && hash(sup.SUPPORTER_KEYS.declined).has(own.id), run.text);
res = await change({ action: 'edit', ...own, name: 'Back', comment: 'Back on.' });
expect('a post she took off cannot be edited back on', res.status === 409 && !shownHash().has(own.id), String(res.status));
res = await change({ action: 'delete', ...own });
expect('its poster can still delete it', res.status === 200 && !hash(sup.SUPPORTER_KEYS.declined).has(own.id) && !shownHash().has(own.id), String(res.status));
{
  res = await post({ ...pageForm, name: 'Delete Made-up', email: 'delete@example.org', comment: 'Made-up words to delete.' });
  const d = await res.json();
  const signupsBefore = count();
  res = await change({ action: 'delete', id: d.edit.id, key: d.edit.token });
  expect(
    'deleting one\'s own post takes it off the page at once, and keeps the sign-up',
    res.status === 200 && !(await shownList()).some((s) => s.id === d.edit.id) && count() === signupsBefore,
    String(res.status)
  );
}

console.log('\n  The commands and the removal');
run = await script('scripts/supporters.mjs', ['approve', 'zzzzz'], { env: storeEnv });
expect('an id that is not there changes nothing and says so', run.code === 1 && /Nothing changed/.test(run.text), run.text);
{
  /* An entry from before 19 Nov 2026, still waiting: approve and decline still work for it. Made up. */
  const old = { id: 'old23', at: '2026-11-17T10:00:00.000Z', name: 'Old Made-up', organisation: 'Org', role: 'funder', title: '', comment: 'Old words.', agreed: 'old box' };
  shownHash();
  hash(sup.SUPPORTER_KEYS.waiting).set(old.id, JSON.stringify(old));
  run = await script('scripts/supporters.mjs', ['approve', old.id], { env: storeEnv });
  expect('an entry waiting from before is approved with the old command', run.code === 0 && /^Approved: /.test(run.text) && (await shownList()).some((s) => s.id === old.id && s.role === 'funder'), run.text);
}
{
  /* .env.local, with nothing set first: her one paste. A folder of its own holds a made-up .env.local. */
  const folder = mkdtempSync(join(tmpdir(), 'wb-envlocal-'));
  writeFileSync(join(folder, '.env.local'), `# made up\nKV_REST_API_URL="${STORE_URL}"\nKV_REST_API_TOKEN=${TOKEN}\nOTHER=ignored\n`);
  run = await script('scripts/supporters.mjs', ['shown'], { cwd: folder });
  expect('the command reads the store keys from .env.local, with nothing to type first', run.code === 0 && /on the supporters page/.test(run.text), run.text);
  rmSync(join(folder, '.env.local'));
  run = await script('scripts/supporters.mjs', [], { cwd: folder });
  expect('with no .env.local and no keys it says so plainly and changes nothing', run.code === 1 && /no \.env\.local/i.test(run.text), run.text);
  rmSync(folder, { recursive: true, force: true });
}
{
  res = await post({ ...pageForm, name: 'Second Made-up', email: 'second@example.org', comment: 'Made-up second words.' });
  const second = (await res.json()).edit.id;
  run = await script('scripts/count-interest.mjs', ['--remove', 'second@example.org'], { env: storeEnv });
  expect(
    'removing a person\'s sign-up takes their post off the page too, and prints no name or email',
    run.code === 0 && !shownHash().has(second) && !/Second|example\.org/.test(run.text),
    run.text
  );
}
expect('nothing in the store is given an expiry for supporters', !/EXPIRE[^\n]*supporters|supporters[^\n]*EXPIRE/.test(readFileSync(join('api', 'interest.ts'), 'utf8') + readFileSync(join('api', 'supporter-post.ts'), 'utf8')), 'an expiry on supporters');

globalThis.fetch = realFetch;
server.close();
rmSync(out, { recursive: true, force: true });

console.log('\n  The page says what the server keeps');
const pick = (src, name) => (src.match(new RegExp(`export const ${name} =([\\s\\S]*?);\\n`)) ?? [])[1]?.replace(/\s+/g, ' ').trim();
const client = readFileSync(join('src', 'lib', 'supporters.ts'), 'utf8');
const serverSide = readFileSync(join('api', '_supporters.ts'), 'utf8');
for (const name of ['ROLES', 'SUPPORT_LIMITS', 'CONFIRM_WORDS', 'NEWSLETTER_WORDS']) {
  expect(`${name} is the same on the page and the server`, pick(client, name) && pick(client, name) === pick(serverSide, name), `${pick(client, name)} | ${pick(serverSide, name)}`);
}
expect('the pop-up\'s words are hers, word for word', pick(client, 'CONFIRM_WORDS') === "'Your name and comment will show on this page. Your email stays private.'", pick(client, 'CONFIRM_WORDS'));
expect('the intro line is hers, word for word', /SUPPORTERS_INTRO = 'People who want water impact to be faster and fairer to prove\.'/.test(client), 'intro changed');
/* What a visitor can read: the files without their comments, which name removed things on purpose. */
const bare = (src) => src.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
const form = readFileSync(join('src', 'components', 'InterestPage.tsx'), 'utf8');
const interestLib = readFileSync(join('src', 'lib', 'interest.ts'), 'utf8');
expect(
  'Register your interest has no public box, no role, title or comment: the supporters page is the one place to post',
  !/Show my support publicly|PUBLIC_WORDS|wb-support-role|form\.public|form\.role|form\.comment/.test(bare(form)) && !/public|role:|title:|comment/.test(bare(interestLib).replace(/export const [A-Z_]+ =[\s\S]*?;\n/g, '')),
  'a public field is still on Register your interest'
);
const page = readFileSync(join('src', 'components', 'SupportersPage.tsx'), 'utf8');
expect('no sample cards or placeholder names on the page', !/sample|placeholder name|Lorem/i.test(bare(page)), 'a sample on the page');
{
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
  const app = readFileSync(join('src', 'App.tsx'), 'utf8');
  expect(
    'the removed lines are gone from the page, and so is the box to show a name',
    !/Each person's entry is shown with their permission|No people are shown yet|No supporters are shown yet|To be taken off this page|Show my name and comment on this page|SHOW_WORDS/.test(bare(page) + bare(client)),
    'a removed line is still there'
  );
  expect('the Register your interest box is gone from the page, and the form is in its place', !/wb-interest-cta|Register your interest/.test(bare(page)) && /<SupportForm /.test(page), 'the box is still there');
  expect(
    'the form sits with the heading, before the cards, so it is seen without scrolling',
    /className="wb-supporters-top"[\s\S]*?<h1[\s\S]*?<SupportForm [\s\S]*?className="wb-supporter-grid"/.test(bare(page)),
    'the form is not beside the heading'
  );
  const css = readFileSync(join('src', 'styles', 'base.css'), 'utf8');
  expect(
    'on a laptop the heading and the form are side by side; on a phone the form is right under the heading',
    /\.wb-supporters-top \{[^}]*grid-template-columns: minmax\(0, 1fr\) minmax\(0, 470px\)/.test(css) &&
      /@media \(max-width: 760px\) \{\s*\.wb-supporters-top \{[^}]*grid-template-columns: minmax\(0, 1fr\);/.test(css),
    'the layout rule is missing'
  );
  expect(
    'the form asks name and email (required), organization (optional), a comment (needed to post), and one newsletter box, unticked',
    /label="Name"[\s\S]{0,260}required/.test(page) && /label="Email"[\s\S]{0,260}required/.test(page) && /label="Organization \(optional\)"/.test(page) &&
      /A short comment/.test(page) && /newsletter: false/.test(page) && /form\.comment\.trim\(\) !== ''/.test(page) && (page.match(/type="checkbox"/g) ?? []).length === 1,
    'a field or the box is wrong'
  );
  expect('it saves where Register your interest saves', /fetch\('\/api\/interest'/.test(client) && /source: 'supporters'/.test(client), 'another address');
  expect('the button says "Post"', />\s*Post\s*<\/button>/.test(page) && !/'Send'|>\s*Send\s*</.test(bare(page)), 'the button is not Post');
  expect(
    'Post opens a pop-up with Wellington\'s icon, her words, and "Post" and "Go back"; only the pop-up\'s Post sends',
    /role="dialog"/.test(page) && /aria-modal="true"/.test(page) && /crewMember\('Wellington'\)/.test(page) && /words=\{CONFIRM_WORDS\}/.test(page) &&
      /yes="Post"/.test(page) && />\s*Go back\s*</.test(page) && /setState\(\{ kind: 'confirm' \}\)/.test(page) && /onYes=\{\(\) => void post\(\)\}/.test(page),
    'the pop-up is not as she said'
  );
  expect(
    'the poster\'s browser remembers the post and shows Edit and Delete on their card only',
    /localStorage/.test(client) && /rememberPost\(/.test(page) && /\{own && \(/.test(page) && />\s*Edit\s*</.test(page) && />\s*Delete\s*</.test(page),
    'Edit and Delete are not tied to the poster'
  );
  expect(
    'the email link opens the post: its key is read after the #, kept in the browser, and taken out of the address',
    /ownPostFromHash\(window\.location\.hash\)/.test(page) && /replaceState/.test(page) && /#edit=/.test(client),
    'the link is not read'
  );
  expect('edits and deletes go to their own address, served in development too', /'\/api\/supporter-post'/.test(client) && /flat\('supporter-post'\)/.test(readFileSync('vite.config.ts', 'utf8')), 'no address');
  expect(
    'the thank-you says the post is on the page and how to edit or delete it, and says so when the email did not go',
    /THANKS_HEAD = 'Thank you\. Your post is on this page\.'/.test(client) && /\{THANKS_HEAD\}/.test(page) && /THANKS_EDIT_LINE/.test(page) && /THANKS_NO_MAIL_LINE/.test(page),
    'the thank-you is missing'
  );
  expect(
    'the thank-you is seen: it takes the form\'s place, is brought into view and given focus, and the card joins the board at once',
    /role="status" tabIndex=\{-1\}/.test(page) && /scrollIntoView/.test(page) && /\.focus\(/.test(page) && /setAdded/.test(page),
    'the thank-you or the card is not shown'
  );
  expect(
    '"Questions? hello@waterbots.ai" is at the foot of the page',
    /QUESTIONS_WORDS = 'Questions\?'/.test(client) && /QUESTIONS_ADDRESS = 'hello@waterbots\.ai'/.test(client) && /mailto:\$\{QUESTIONS_ADDRESS\}/.test(page) &&
      page.lastIndexOf('wb-supporters-foot') > page.lastIndexOf('wb-supporter-grid'),
    'the line is missing'
  );
  expect('the list is cached for thirty seconds, so others see a new card soon', /s-maxage=30'/.test(readFileSync(join('api', 'supporters.ts'), 'utf8')), 'the cache is longer');
  expect('the form\'s Post is the page\'s one blue button, and the menu\'s Sign up goes quiet', /btn-primary wb-form-send/.test(page) && /form: onInterest \|\| onSupporters/.test(app), 'the blue rule is not kept');
}
expect('/supporters is served by the page', /"source": "\/supporters"/.test(readFileSync('vercel.json', 'utf8')), 'no rewrite');
expect(
  'the ways in: one quiet line on the Commons and on the interest form',
  /SUPPORTERS_LINK/.test(readFileSync(join('src', 'components', 'CommonsShelf.tsx'), 'utf8')) && /<SupportersLink/.test(form),
  'a way in is missing'
);
expect('her command is one npm script', JSON.parse(readFileSync('package.json', 'utf8')).scripts?.supporters === 'node scripts/supporters.mjs', 'no npm script');

if (problems.length) {
  console.error(`\nFAILED — ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`\nPASSED — ${checks} checks on the supporters page.`);
