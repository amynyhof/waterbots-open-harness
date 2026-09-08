/**
 * Gate: the bridge seals what was ruled and nothing else, keeps it for an
 * hour, counts to ten, and fails closed where it must.
 *
 * WHY THIS EXISTS. The bridge (item S7) is the one place a visitor's work
 * leaves this site, and the contract says exactly what may cross: the four
 * record fields with their source tags, the pin as ids, the worksheet's
 * states and ways forward, each pack's answers with the pack's own word for
 * where it stands, and a timestamp. Never a computed number, never the
 * conversation. That line is enforced in api/_handoff.ts, and a line in code
 * is a claim until something checks it. This checks it, in a couple of
 * seconds, with the same files that deploy.
 *
 * IT RUNS THE REAL CODE AGAINST A STAND-IN STORE, the way check-cap.mjs does.
 * The stand-in answers the store commands the bridge uses — SET with an
 * expiry and no-overwrite, GETDEL, and the counter's INCR/DECR/EXPIRE — and
 * nothing it holds ever reaches a visitor. The sample seal below is a test
 * stand-in under the maintainer's ruling of 25 Aug 2026, not data shown to
 * anyone.
 *
 * WHAT IT CANNOT CHECK. That the real store answers SET ... NX and GETDEL the
 * way the stand-in does. The only proof of that is the deployed address.
 */

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
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
   The stand-in store.
--------------------------------------------------------------------------- */

const numbers = new Map();
const values = new Map();
const expiries = new Map();
let refuseNextSet = false;

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
        case 'SET': {
          if (refuseNextSet) {
            refuseNextSet = false;
            return { error: 'the stand-in store refused this write on purpose' };
          }
          const [value, ...options] = args;
          const nx = options.includes('NX');
          const ex = options.indexOf('EX');
          if (nx && values.has(key)) return { result: null };
          values.set(key, value);
          if (ex >= 0) expiries.set(key, Number(options[ex + 1]));
          return { result: 'OK' };
        }
        case 'GETDEL': {
          const value = values.get(key) ?? null;
          values.delete(key);
          return { result: value };
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

process.env.KV_REST_API_URL = `http://127.0.0.1:${port}`;
process.env.KV_REST_API_TOKEN = 'stand-in';
process.env.PHOEBE_VISITOR_SALT = 'a-test-secret-that-is-not-the-real-one';
delete process.env.VERCEL;

const sealRoute = await load('handoff/index.js');
const { SEAL_SHAPE, TICKET_PATTERN, TICKET_TTL_SECONDS, MAX_SEAL_BYTES, readSeal, sealKey } =
  await load('_handoff.js');
const { HANDOFF_DAILY_CAP } = await load('_cap.js');

/* ---------------------------------------------------------------------------
   A sample seal — a test stand-in, never shown to anyone.
--------------------------------------------------------------------------- */

const sample = () => ({
  record: {
    does: { value: 'Protects a spring and pipes it to a village', source: 'chat' },
    kind: { value: 'water', source: 'chat' },
    place: { value: 'HYBAS 1040021560 · Level 6 · High (40-80%)', source: 'pin' },
    name: { value: 'Test spring', source: 'typed' },
  },
  pin: {
    hybasId: 1040021560,
    pfafId: 142534,
    level: 6,
    stressLabel: 'High (40-80%)',
    subAreaKm2: 812.4,
    stressDerived: false,
  },
  worksheet: [
    { number: 1, state: 'met' },
    { number: 2, state: 'not-yet', routeForward: 'Show the basin has a published stress reading.' },
    { number: 3, state: 'unchecked' },
  ],
  packs: [
    {
      key: 'vwba-d3',
      name: 'VWBA 2.0 · D-3 Volume Provided',
      status: 'incomplete',
      workedExample: false,
      answers: { households: '120', litresPerDay: '40' },
    },
  ],
});

const post = (body, address = '203.0.113.7') =>
  sealRoute.POST(
    new Request('https://example.invalid/api/handoff', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-vercel-forwarded-for': address },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
  );

/* ---------------------------------------------------------------------------
   A good seal goes in.
--------------------------------------------------------------------------- */

console.log('\n  A good seal goes in\n');

const first = await post(sample());
const firstBody = await first.json();

expect('a good seal is accepted', first.status === 200, `got ${first.status}: ${JSON.stringify(firstBody)}`);
expect(
  'the ticket is 32 characters in the URL-safe alphabet, inside the 16 to 128 production accepts',
  typeof firstBody.ticketId === 'string' && firstBody.ticketId.length === 32 && TICKET_PATTERN.test(firstBody.ticketId),
  `got "${firstBody.ticketId}"`
);
expect(
  'the answer says when the seal expires, an hour from now',
  firstBody.expiresInSeconds === TICKET_TTL_SECONDS && typeof firstBody.expiresAt === 'string',
  `got ${JSON.stringify(firstBody)}`
);
expect('the answer is not cached anywhere on the way', first.headers.get('cache-control') === 'no-store', `got ${first.headers.get('cache-control')}`);

const storedKey = sealKey(firstBody.ticketId);
const stored = values.get(storedKey);
expect('the seal is stored under its ticket', typeof stored === 'string', `nothing under ${storedKey}`);
expect('the store is told to forget it after an hour', expiries.get(storedKey) === TICKET_TTL_SECONDS, `got ${expiries.get(storedKey)}`);

const parsed = stored ? JSON.parse(stored) : {};
expect(
  'what is stored names its shape and carries a sealed-at timestamp written by the server',
  parsed.shape === SEAL_SHAPE && typeof parsed.sealedAt === 'string' && !Number.isNaN(Date.parse(parsed.sealedAt)),
  `got shape ${parsed.shape}, sealedAt ${parsed.sealedAt}`
);
expect(
  'what is stored is the visit as sent — the record with its source tags, the pin, the worksheet, the packs',
  JSON.stringify({ record: parsed.record, pin: parsed.pin, worksheet: parsed.worksheet, packs: parsed.packs }) ===
    JSON.stringify(sample()),
  'the stored seal differs from what was sent'
);
expect(
  'what is stored holds only the five ruled parts and the shape name',
  Object.keys(parsed).sort().join(',') === 'packs,pin,record,sealedAt,shape,worksheet',
  `got ${Object.keys(parsed).join(', ')}`
);

/* ---------------------------------------------------------------------------
   Anything beyond the contract is refused whole.
--------------------------------------------------------------------------- */

console.log('\n  Anything beyond the contract is refused whole\n');

const before = values.size;
const countersBefore = numbers.size;

const refused = async (label, body, expectedStatus, mention) => {
  const response = await post(body, '198.51.100.20');
  const payload = await response.json();
  expect(
    label,
    response.status === expectedStatus && String(payload.error).includes(mention),
    `got ${response.status}: ${payload.error}`
  );
};

await refused('a seal carrying the conversation is turned away', { ...sample(), messages: [{ role: 'user', content: 'hi' }] }, 400, '"messages"');
await refused(
  'a seal carrying a computed figure inside a pack is turned away',
  (() => {
    const s = sample();
    s.packs[0].figures = [{ value: 1234 }];
    return s;
  })(),
  400,
  '"figures"'
);
await refused(
  'a seal carrying a headline number is turned away',
  (() => {
    const s = sample();
    s.packs[0].headline = 1234;
    return s;
  })(),
  400,
  '"headline"'
);
await refused(
  'a pack answer that is a number, not the visitor’s text, is turned away',
  (() => {
    const s = sample();
    s.packs[0].answers.households = 120;
    return s;
  })(),
  400,
  'answers.households'
);
await refused(
  'a pack status outside the pack’s four words is turned away',
  (() => {
    const s = sample();
    s.packs[0].status = 'verified';
    return s;
  })(),
  400,
  'status'
);
await refused(
  'a kind outside the closed set is turned away',
  (() => {
    const s = sample();
    s.record.kind.value = 'other';
    return s;
  })(),
  400,
  'record.kind.value'
);
await refused(
  'a source tag outside typed, chat, pin is turned away',
  (() => {
    const s = sample();
    s.record.name.source = 'guessed';
    return s;
  })(),
  400,
  'record.name.source'
);
await refused(
  'a Level 4 pin that does not say its label is derived is turned away',
  (() => {
    const s = sample();
    s.pin.level = 4;
    return s;
  })(),
  400,
  'stressDerived'
);
await refused(
  'a criterion state outside the three is turned away',
  (() => {
    const s = sample();
    s.worksheet[0].state = 'partly';
    return s;
  })(),
  400,
  'worksheet[0].state'
);
await refused(
  '"what it does" over the desk’s cap is refused, not cut',
  (() => {
    const s = sample();
    s.record.does.value = 'x'.repeat(281);
    return s;
  })(),
  400,
  'record.does.value'
);
await refused('a seal missing a part is turned away', { record: sample().record }, 400, 'missing');
await refused('a body that is not a seal at all is turned away', '"just a string"', 400, 'not an object');
await refused('an unreadable body is turned away', '{not json', 400, 'could not be read');
await refused('a body heavier than a seal can be is turned away', 'x'.repeat(MAX_SEAL_BYTES + 1), 413, 'more than');

expect('none of those refusals stored anything', values.size === before, `the store grew from ${before} to ${values.size}`);
expect(
  'none of those refusals counted against anyone — shape is checked before the cap is charged',
  numbers.size === countersBefore,
  `the counters grew from ${countersBefore} to ${numbers.size}`
);

/* The reader on its own, so the client's check can lean on it too. */
expect('readSeal accepts the sample', 'seal' in readSeal(sample()), JSON.stringify(readSeal(sample())));
expect('a null pin is a real answer', 'seal' in readSeal({ ...sample(), pin: null }), JSON.stringify(readSeal({ ...sample(), pin: null })));

/* ---------------------------------------------------------------------------
   Ten a day, under the bridge's own counter.
--------------------------------------------------------------------------- */

console.log(`\n  ${HANDOFF_DAILY_CAP} seals a day\n`);

const statuses = [];
for (let i = 0; i < HANDOFF_DAILY_CAP + 1; i += 1) {
  statuses.push((await post(sample(), '192.0.2.44')).status);
}
expect(
  `the first ${HANDOFF_DAILY_CAP} seals from one visitor are accepted`,
  statuses.slice(0, HANDOFF_DAILY_CAP).every((s) => s === 200),
  `got ${statuses.slice(0, HANDOFF_DAILY_CAP).join(', ')}`
);
expect(`seal ${HANDOFF_DAILY_CAP + 1} is refused`, statuses[HANDOFF_DAILY_CAP] === 429, `got ${statuses[HANDOFF_DAILY_CAP]}`);

const capKey = [...numbers.keys()].find((k) => k.startsWith('handoff:count:') && numbers.get(k) === HANDOFF_DAILY_CAP);
expect(
  'the counter lives under "handoff", with a day and a scramble and no address',
  /^handoff:count:\d{4}-\d{2}-\d{2}:[0-9a-f]{32}$/.test(capKey ?? '') && !String(capKey).includes('192.0.2.44'),
  `the key is "${capKey}"`
);
expect(
  'a stranger is unaffected by that visitor being capped',
  (await post(sample(), '192.0.2.45')).status === 200,
  'a stranger was refused because someone else had used up their day'
);
expect(
  "the chat counters are untouched — sealing is not a message to Phoebe or Wellington",
  ![...numbers.keys()].some((k) => k.startsWith('phoebe:') || k.startsWith('wellington:')),
  `found ${[...numbers.keys()].filter((k) => !k.startsWith('handoff:')).join(', ')}`
);

/* A write that fails on our side is given back. */
refuseNextSet = true;
const failed = await post(sample(), '192.0.2.46');
expect(
  'a seal the store refuses to write answers 503, keeps nothing, and gives the count back',
  failed.status === 503 && (await failed.json()).error.includes('Nothing was kept'),
  `got ${failed.status}`
);
expect(
  'that visitor’s count reads zero after the refund',
  [...numbers.entries()].some(([k, n]) => k.startsWith('handoff:count:') && n === 0),
  `counts read ${[...numbers.entries()].filter(([k]) => k.startsWith('handoff:count:')).map(([, n]) => n).join(', ')}`
);

/* ---------------------------------------------------------------------------
   Where there is no store.
--------------------------------------------------------------------------- */

console.log('\n  Where there is no store\n');

const storeUrl = process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_URL;

const onLaptop = await post(sample(), '203.0.113.9');
const onLaptopBody = await onLaptop.json();
process.env.VERCEL = '1';
const onPlatform = await post(sample(), '203.0.113.9');
const onPlatformBody = await onPlatform.json();
delete process.env.VERCEL;
process.env.KV_REST_API_URL = storeUrl;

expect(
  'on a laptop the row says saving only works on the live site',
  onLaptop.status === 503 && onLaptopBody.error.includes('live site'),
  `got ${onLaptop.status}: ${onLaptopBody.error}`
);
expect(
  'on the platform a missing store is a configuration fault, said plainly',
  onPlatform.status === 503 && onPlatformBody.error.includes('problem on our side'),
  `got ${onPlatform.status}: ${onPlatformBody.error}`
);

/* Opening the address in a browser. */
const opened = await sealRoute.GET();
expect('a GET on the seal address is a plain 405, pointing at the claim', opened.status === 405, `got ${opened.status}`);

/* ---------------------------------------------------------------------------
   The client half: the seal the desk builds is one the server accepts, and
   it carries no figure.

   src/lib/handoff.ts is the one place the visit becomes a seal. It is
   compiled here with the real pack registry, a visit is built the way the
   desk builds one — a typed name, a heard place, a pin, two criteria moved,
   a pack's worked example — and what comes out is handed to the server's
   reader. If the two halves ever disagree about the shape, this is where it
   shows, not on the live site.
--------------------------------------------------------------------------- */

console.log('\n  The seal the desk builds\n');

const libOut = mkdtempSync(join(tmpdir(), 'wb-handoff-lib-'));
const compileLib = spawnSync(
  process.execPath,
  [
    join('node_modules', 'typescript', 'bin', 'tsc'),
    join('src', 'lib', 'handoff.ts'),
    join('src', 'lib', 'methodPacks.ts'),
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
  console.error('\n  FAILED — src/lib/handoff.ts did not compile.\n');
  console.error(compileLib.stdout || compileLib.stderr);
  server.close();
  rmSync(out, { recursive: true, force: true });
  rmSync(libOut, { recursive: true, force: true });
  process.exit(1);
}
writeFileSync(join(libOut, 'package.json'), '{"type":"commonjs"}');
const requireLib = createRequire(import.meta.url);
const { buildSeal, handoffAddress } = requireLib(join(libOut, 'handoff.js'));
const { livePacks } = requireLib(join(libOut, 'methodPacks.js'));
const { EMPTY_VISIT, typedContext, learnedContext, pinnedContext } = requireLib(join(libOut, 'visit.js'));

const packs = livePacks();
const examplePack = packs.find((p) => p.example !== undefined);
const pin = { hybasId: 1040041430, pfafId: 1, level: 4, stressLabel: 'Arid and Low Water Use', subAreaKm2: 87466 };
let context = typedContext(EMPTY_VISIT.context, 'name', 'Test spring');
context = learnedContext(context, { does: 'Protects a spring and pipes it to a village', kind: 'water' });
context = pinnedContext(context, pin);
const visit = {
  context,
  pin,
  packValues: examplePack ? { [examplePack.key]: { ...examplePack.example.values } } : {},
};
const sheet = [
  { state: 'met' },
  { state: 'not-yet', routeForward: 'Show the basin has a published stress reading.' },
  { state: 'unchecked' },
  { state: 'unchecked' },
  { state: 'unchecked' },
  { state: 'unchecked' },
];
const built = buildSeal(visit, sheet, [1, 2, 3, 4, 5, 6], packs);
const reading = readSeal(built);

expect('the seal the desk builds is one the server accepts', 'seal' in reading, JSON.stringify(reading));
expect(
  'the record carries its source tags — typed, chat, pin',
  built.record.name.source === 'typed' && built.record.does.source === 'chat' && built.record.place.source === 'pin',
  JSON.stringify(built.record)
);
expect('a Level 4 pin says its label is derived', built.pin.level === 4 && built.pin.stressDerived === true, JSON.stringify(built.pin));
expect(
  'the worksheet says each criterion by the manual’s number, with the way forward where there is one',
  built.worksheet[1].number === 2 && built.worksheet[1].routeForward.startsWith('Show') && built.worksheet[0].routeForward === undefined,
  JSON.stringify(built.worksheet)
);
expect(
  'a pack filled with its worked example is flagged worked-example, with the pack’s own word beside it',
  examplePack !== undefined && built.packs.length === 1 && built.packs[0].workedExample === true &&
    ['complete', 'incomplete', 'pending', 'blocked'].includes(built.packs[0].status),
  JSON.stringify(built.packs)
);
const builtText = JSON.stringify(built);
expect(
  'the seal carries no figure, no headline and no conversation',
  !/"figures"|"headline"|"messages"|"value":\s*\d/.test(builtText),
  'a computed number or the conversation was found in the seal'
);
expect(
  'every pack answer is the visitor’s text as typed',
  built.packs.every((p) => Object.values(p.answers).every((v) => typeof v === 'string')),
  JSON.stringify(built.packs)
);
const untouched = buildSeal(EMPTY_VISIT, sheet.map(() => ({ state: 'unchecked' })), [1, 2, 3, 4, 5, 6], packs);
expect(
  'an empty visit seals as empty fields, a null pin, six unchecked criteria and no packs — never invented',
  'seal' in readSeal(untouched) && untouched.pin === null && untouched.packs.length === 0 &&
    untouched.worksheet.every((c) => c.state === 'unchecked') && untouched.record.name.value === '',
  JSON.stringify(untouched)
);
expect(
  'the address carries only the ticket, on production’s welcome page',
  handoffAddress('abc_DEF-123456789012') === 'https://www.waterbots.ai/welcome?handoff=abc_DEF-123456789012',
  handoffAddress('abc_DEF-123456789012')
);

/* And the whole way through: the desk's seal into the route. */
const throughRoute = await post(built, '192.0.2.99');
expect('the desk’s seal goes through the route and comes back with a ticket', throughRoute.status === 200, `got ${throughRoute.status}: ${JSON.stringify(await throughRoute.clone().json())}`);

/* ---------------------------------------------------------------------------
   Done.
--------------------------------------------------------------------------- */

server.close();
rmSync(out, { recursive: true, force: true });
rmSync(libOut, { recursive: true, force: true });

console.log('');
if (problems.length > 0) {
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(`\nFAILED — ${problems.length} of ${checks} checks did not pass.\n`);
  process.exit(1);
}
console.log(`PASSED — ${checks} checks: the bridge seals what was ruled, keeps it an hour, counts to ${HANDOFF_DAILY_CAP}, and fails closed.\n`);
