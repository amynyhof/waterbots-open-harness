/**
 * Gate: the scrambled visitor identity behaves the way the cap depends on.
 *
 * WHY THIS EXISTS. A daily cap rests on one thing being true — that the same
 * person comes back as the same identity all day, and that two people never
 * arrive as one. Neither can be seen by reading the code, and neither can be
 * confirmed against the live store without sending real traffic. Both can be
 * confirmed here, in about a second, before anything deploys.
 *
 * IT RE-DERIVES RATHER THAN AGREES WITH ITSELF. The recipe is worked out here a
 * second time, by a different route — the browser-standard crypto interface
 * rather than Node's — and the two answers are compared. A check that called
 * the same function and compared it to itself would pass no matter what the
 * recipe was.
 *
 * WHAT IT CANNOT CHECK. Whether the store actually counts. That needs the
 * store, and the store is a live account setting rather than a repository file.
 * The only proof of the cap itself is hitting it in a browser.
 */

import {
  clientAddress,
  counterKey,
  secondsUntilReset,
  utcDayStamp,
  visitorId,
} from '../api/_visitor.ts';

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

/* An address that is written down here and nowhere else. Nothing about it is
   real and nothing reaches a network. */
const SALT = 'a-test-secret-that-is-not-the-real-one';
const OTHER_SALT = 'a-different-test-secret';
const ADDRESS = '203.0.113.7';

console.log('\n  Scrambled identity\n');

/* 1. The same visitor is the same identity every time. Without this the cap
      resets itself on every message and counts to twenty forever. */
expect(
  'the same address and secret always give the same identity',
  visitorId(ADDRESS, SALT) === visitorId(ADDRESS, SALT),
  'the identity changed between two calls with identical input'
);

/* 2. Two visitors are never one. Without this, one person hitting the cap
      would refuse a stranger. */
const sample = [];
for (let a = 0; a < 8; a += 1) {
  for (let b = 0; b < 32; b += 1) {
    sample.push(`198.51.100.${a * 32 + b}`, `2001:db8::${a}:${b}`);
  }
}
/* The sample has to be genuinely distinct or the check confirms nothing. */
if (new Set(sample).size !== sample.length) {
  console.error('\n  FAILED — the check built a sample with repeats in it.\n');
  process.exit(1);
}
const identities = new Set(sample.map((address) => visitorId(address, SALT)));
expect(
  `${sample.length} different addresses give ${sample.length} different identities`,
  identities.size === sample.length,
  `${sample.length - identities.size} pair(s) landed on the same identity`
);

/* 3. The secret is really mixed in. If it were ignored, the whole list could be
      unscrambled by anyone willing to try every address on the internet. */
expect(
  'changing the secret changes the identity',
  visitorId(ADDRESS, SALT) !== visitorId(ADDRESS, OTHER_SALT),
  'the identity was the same under two different secrets, so the secret is not being used'
);

/* 4. The recipe is the documented one, worked out a second way. */
const bytes = new TextEncoder().encode(`${SALT}\n${ADDRESS}`);
const digest = await crypto.subtle.digest('SHA-256', bytes);
const independent = [...new Uint8Array(digest)]
  .map((byte) => byte.toString(16).padStart(2, '0'))
  .join('')
  .slice(0, 32);
expect(
  'the identity matches an independent SHA-256 of secret and address',
  visitorId(ADDRESS, SALT) === independent,
  `expected ${independent}, got ${visitorId(ADDRESS, SALT)}`
);

/* 5. Shape. A stored key holds hexadecimal and nothing that came from the
      person — no fragment of an address survives into it. */
const id = visitorId(ADDRESS, SALT);
expect(
  'the identity is 32 hexadecimal characters and holds no part of the address',
  /^[0-9a-f]{32}$/.test(id) && !id.includes(ADDRESS),
  `got "${id}"`
);

console.log('\n  Which day it is\n');

const lateOnTheDay = new Date('2026-08-25T23:59:59.000Z');
const justAfterMidnight = new Date('2026-08-26T00:00:00.000Z');
const earlyOnTheDay = new Date('2026-08-25T00:00:00.000Z');

expect(
  'one second before midnight and the start of that day are the same day',
  utcDayStamp(lateOnTheDay) === utcDayStamp(earlyOnTheDay),
  `${utcDayStamp(earlyOnTheDay)} and ${utcDayStamp(lateOnTheDay)} should match`
);

expect(
  'the day rolls over at midnight UTC',
  utcDayStamp(lateOnTheDay) !== utcDayStamp(justAfterMidnight),
  'the stamp did not change across midnight, so the count would never reset'
);

expect(
  'the counter key carries the day and the identity, and nothing else',
  counterKey('phoebe', id, utcDayStamp(lateOnTheDay)) === `phoebe:count:2026-08-25:${id}`,
  `got "${counterKey('phoebe', id, utcDayStamp(lateOnTheDay))}"`
);

console.log('\n  When the count comes back\n');

/* The counter must outlive the day it belongs to. If it expired early, a
   visitor would quietly get a fresh twenty before midnight. */
const outlivesTheDay = [earlyOnTheDay, lateOnTheDay, new Date('2026-12-31T23:59:59.500Z')].every(
  (moment) => {
    const expiresAt = moment.getTime() + secondsUntilReset(moment) * 1000;
    const nextMidnight = Date.UTC(
      moment.getUTCFullYear(),
      moment.getUTCMonth(),
      moment.getUTCDate() + 1
    );
    return expiresAt > nextMidnight;
  }
);
expect(
  'the counter always outlives the day it belongs to',
  outlivesTheDay,
  'a counter would expire before its day ended, handing someone a fresh twenty early'
);

expect(
  'the counter never lives more than a day and an hour',
  secondsUntilReset(earlyOnTheDay) <= 25 * 60 * 60,
  `got ${secondsUntilReset(earlyOnTheDay)} seconds`
);

console.log('\n  Reading the address off a request\n');

const headers = (entries) => new Headers(entries);

expect(
  "the platform's own header is trusted ahead of the forgeable one",
  clientAddress(
    headers({ 'x-vercel-forwarded-for': '203.0.113.7', 'x-forwarded-for': '198.51.100.1' })
  ) === '203.0.113.7',
  'a caller-supplied header won, which would let anyone hand themselves a fresh identity'
);

expect(
  'the visitor is the first entry in a chain, not the last hop',
  clientAddress(headers({ 'x-forwarded-for': '203.0.113.7, 198.51.100.1, 192.0.2.9' })) ===
    '203.0.113.7',
  'the wrong end of the chain was taken, so every visitor behind one gateway would count as one'
);

expect(
  'no address header at all is an honest null rather than a guess',
  clientAddress(headers({})) === null,
  'something was returned when there was no address to return'
);

console.log('');

if (problems.length > 0) {
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(`\nFAILED — ${problems.length} of ${checks} checks did not hold.\n`);
  process.exit(1);
}

console.log(`PASSED — ${checks} checks on the visitor identity and the day boundary.\n`);
