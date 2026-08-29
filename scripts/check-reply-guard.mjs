/**
 * Confirms the relay refuses a reply too short to be an answer.
 *
 * WHY THIS EXISTS. Phoebe sometimes finishes normally and produces nothing.
 * The guard written for that in item A4 tests for an *empty* reply, and on
 * 28 Aug 2026 four replies of one to three characters got past it and reached
 * callers, because three characters is not empty.
 *
 * WHY IT IS CHECKED THIS WAY. The fault appears in about two requests in a
 * hundred, so waiting for one is not a test. This exercises the guard directly
 * against the real compiled module, using the actual reply lengths measured in
 * the diagnosis — including the two that sit closest to the line.
 *
 *   node scripts/check-reply-guard.mjs
 *
 * The api folder is compiled the way the platform compiles it, the same way
 * check-cap.mjs does, so this tests what deploys rather than the source.
 */

import { spawnSync } from 'node:child_process';
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

/* Compile api/ as the platform would see it. */
const out = mkdtempSync(join(tmpdir(), 'wb-reply-'));
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
const { MIN_REPLY_CHARS, isDegenerateReply } = await import(
  pathToFileURL(join(out, '_reply.js')).href
);

console.log('Reply guard — what counts as an answer\n');
console.log(`  the floor is ${MIN_REPLY_CHARS} characters\n`);

/* ---------------------------------------------------------------------------
   The replies actually measured on 28 Aug 2026. The degenerate ones were
   delivered to callers; the real ones must never be refused.
--------------------------------------------------------------------------- */

console.log('  Replies that were delivered and should not have been');
for (const [label, reply] of [
  ['a single character', '.'],
  ['a single space', ' '],
  ['three characters', '...'],
  ['an empty string', ''],
  ['whitespace only', '   \n  '],
]) {
  expect(`${label} is refused`, isDegenerateReply(reply), `"${reply}" passed the guard`);
}

console.log('\n  Real answers, which must still get through');
/* 221 was the shortest reply with real content in 256 measured answers. */
const shortestReal =
  'I do not have a card that covers this. My knowledge is limited to the eligibility criteria ' +
  'and feasibility considerations for water stewardship projects, and that question falls ' +
  'outside them entirely.';
expect(
  `the shortest real answer measured (${shortestReal.length} characters) is not refused`,
  !isDegenerateReply(shortestReal),
  'a real answer was refused'
);

const typicalAbstention = 'That falls outside my cards, so I cannot answer it.';
expect(
  `a short abstention (${typicalAbstention.length} characters) is not refused`,
  !isDegenerateReply(typicalAbstention),
  'a real abstention was refused'
);

console.log('\n  The boundary, stated rather than assumed');
expect(
  `exactly ${MIN_REPLY_CHARS} characters is allowed`,
  !isDegenerateReply('x'.repeat(MIN_REPLY_CHARS)),
  'the floor is off by one'
);
expect(
  `one character below the floor is refused`,
  isDegenerateReply('x'.repeat(MIN_REPLY_CHARS - 1)),
  'the floor is off by one'
);
expect(
  'surrounding whitespace does not buy a pass',
  isDegenerateReply(`   ${'x'.repeat(MIN_REPLY_CHARS - 1)}   `),
  'padding a short reply with spaces got it through'
);

console.log('\n  The floor is where the evidence put it');
expect(
  'the floor sits above every degenerate reply measured (longest was 3)',
  MIN_REPLY_CHARS > 3,
  `${MIN_REPLY_CHARS} does not clear the measured degenerate replies`
);
expect(
  'the floor sits below the shortest real answer measured (221)',
  MIN_REPLY_CHARS < 221,
  `${MIN_REPLY_CHARS} would refuse the shortest real answer measured`
);

rmSync(out, { recursive: true, force: true });

if (problems.length) {
  console.log(`\nFAILED — ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}

console.log(`\nPASSED — ${checks} checks on the reply guard.`);
