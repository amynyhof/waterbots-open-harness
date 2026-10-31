/**
 * Tests for the name scan, scripts/check-names.mjs. Every name here is made up.
 *
 *   node --test scripts/check-names.test.mjs
 *
 * They need no private list, so GitHub's checks run them. The real scan cannot run there.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  parseNames,
  loadNames,
  listPathFromEnv,
  scanText,
  pathHasName,
  scanFiles,
  scanDiff,
  KINDS,
  ListError,
} from './check-names.mjs';

const script = fileURLToPath(new URL('./check-names.mjs', import.meta.url));
const tmp = () => mkdtempSync(join(tmpdir(), 'name-scan-'));
const LIST = [
  '# comments and blank lines are skipped',
  '',
  'Zelda Quimby',
  'plinth-orrery',
  '40417',
  'Harbour Voss | allowed on copyright and licence lines only',
  '',
].join('\n');
const MADE_UP = ['zelda', 'quimby', 'plinth', 'orrery', '40417', 'harbour', 'voss'];

test('the list is parsed: comments and blanks skipped, the allowance suffix recognised', () => {
  const entries = parseNames(LIST);
  assert.equal(entries.length, 4);
  assert.deepEqual(entries.map((e) => e.copyrightOnly), [false, false, false, true]);
});

test('a list with no entries is refused', () => {
  assert.throws(() => parseNames('# only a comment\n\n'), ListError);
});

test('matches whole words in any case', () => {
  const entries = parseNames(LIST);
  assert.deepEqual(scanText('one\nZELDA QUIMBY was here\nthree', entries), [2]);
  assert.deepEqual(scanText('a zelda quimby', entries), [1]);
});

test('a space, dot, dash or underscore inside an entry matches any of them, or nothing', () => {
  const entries = parseNames(LIST);
  for (const s of ['zelda_quimby', 'zelda-quimby', 'zelda.quimby', 'ZeldaQuimby', 'zelda   quimby']) {
    assert.deepEqual(scanText(s, entries), [1], s);
  }
  assert.deepEqual(scanText('plinth orrery', entries), [1]);
});

test('does not match inside a longer word or number', () => {
  const entries = parseNames(LIST);
  assert.deepEqual(scanText('zeldaquimbys\nxplinth-orrery\n404170\n140417', entries), []);
  assert.deepEqual(scanText('id 40417.', entries), [1]);
});

test('an entry with the allowance is let through on copyright and licence lines only', () => {
  const entries = parseNames(LIST);
  assert.deepEqual(scanText('Copyright 2026 Harbour Voss', entries), []);
  assert.deepEqual(scanText('# Licence: Harbour Voss', entries), []);
  assert.deepEqual(scanText('written by Harbour Voss', entries), [1]);
  assert.deepEqual(scanText('Copyright 2026 Zelda Quimby', entries), [1], 'the allowance is for its own entry only');
});

test('a file name that holds a name is a hit', () => {
  const entries = parseNames(LIST);
  assert.equal(pathHasName('docs/zelda-quimby/notes.md', entries), true);
  assert.equal(pathHasName('docs/notes.md', entries), false);
});

test('scanFiles reports file and line only, hides a path that holds a name, and skips binary files', () => {
  const dir = tmp();
  mkdirSync(join(dir, 'sub'));
  writeFileSync(join(dir, 'clean.txt'), 'nothing here\n');
  writeFileSync(join(dir, 'sub', 'a.txt'), 'ok\nplinth-orrery\n');
  writeFileSync(join(dir, 'zelda_quimby.txt'), 'fine\n');
  writeFileSync(join(dir, 'blob.bin'), Buffer.from([0, 1, 2, 0x7a, 0x65, 0x6c, 0x64, 0x61]));
  const r = scanFiles(dir, ['clean.txt', 'sub/a.txt', 'zelda_quimby.txt', 'blob.bin'], parseNames(LIST));
  assert.deepEqual(r.findings, [
    { file: 'sub/a.txt', line: 2, kind: KINDS.text },
    { file: '(path hidden)', line: 0, kind: KINDS.fileName },
  ]);
  assert.equal(r.textFiles, 3);
  assert.equal(r.skipped, 1);
});

test('scanDiff reads only added lines, numbers them in the new file, and checks added and renamed file names', () => {
  const diff = [
    'diff --git a/notes.md b/notes.md',
    'index 1111111..2222222 100644',
    '--- a/notes.md',
    '+++ b/notes.md',
    '@@ -1,3 +1,4 @@',
    ' first line',
    '-Zelda Quimby was removed, so this is not a hit',
    '+a clean added line',
    '+plinth-orrery is added here',
    ' last line',
    '@@ -20,2 +21,2 @@',
    ' context',
    '+++ an added line that starts with two plus signs and names 40417',
    'diff --git a/old.txt b/zelda_quimby.txt',
    'similarity index 100%',
    'rename from old.txt',
    'rename to zelda_quimby.txt',
    'diff --git a/gone.txt b/gone.txt',
    'deleted file mode 100644',
    '--- a/gone.txt',
    '+++ /dev/null',
    '@@ -1 +0,0 @@',
    '-Harbour Voss',
  ].join('\n');
  const r = scanDiff(diff, parseNames(LIST));
  assert.deepEqual(r.findings, [
    { file: 'notes.md', line: 3, kind: KINDS.addedLine },
    { file: 'notes.md', line: 22, kind: KINDS.addedLine },
    { file: '(path hidden)', line: 0, kind: KINDS.addedFileName },
  ]);
});

test('scanDiff reports a renamed-and-edited file name once, and hides its path on its lines', () => {
  const diff = [
    'diff --git a/old.txt b/plinth-orrery.txt',
    'similarity index 90%',
    'rename from old.txt',
    'rename to plinth-orrery.txt',
    '--- a/old.txt',
    '+++ b/plinth-orrery.txt',
    '@@ -1 +1,2 @@',
    ' kept',
    '+Zelda Quimby',
  ].join('\n');
  assert.deepEqual(scanDiff(diff, parseNames(LIST)).findings, [
    { file: '(path hidden)', line: 0, kind: KINDS.addedFileName },
    { file: '(path hidden)', line: 2, kind: KINDS.addedLine },
  ]);
});

test('loadNames fails closed when the list is missing or empty', () => {
  const dir = tmp();
  assert.throws(() => loadNames(join(dir, 'nope.txt')), ListError);
  assert.throws(() => loadNames(undefined), ListError);
  writeFileSync(join(dir, 'empty.txt'), '');
  assert.throws(() => loadNames(join(dir, 'empty.txt')), ListError);
  assert.throws(() => loadNames(dir), ListError, 'a folder is not a list');
});

test("the list's path comes from WB_NAMES_LIST only; unset or empty is a ListError", () => {
  assert.equal(listPathFromEnv({ WB_NAMES_LIST: '/some/where/list.txt' }), '/some/where/list.txt');
  assert.throws(() => listPathFromEnv({}), ListError);
  assert.throws(() => listPathFromEnv({ WB_NAMES_LIST: '' }), ListError);
  assert.throws(() => listPathFromEnv({ WB_NAMES_LIST: '   ' }), ListError);
  assert.throws(() => listPathFromEnv({ NAMES_FILE: '/some/where/list.txt' }), ListError, 'no other setting counts');
});

/* `listPath` null leaves WB_NAMES_LIST unset. The caller's own value is always removed first, so a real list on
   the machine running the tests can never reach them. */
function run(args, listPath, { cwd = tmp(), extraEnv = {} } = {}) {
  const env = { ...process.env, ...extraEnv };
  delete env.WB_NAMES_LIST;
  if (listPath !== null) env.WB_NAMES_LIST = listPath;
  return spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', env, cwd });
}

function assertNoNamePrinted(results) {
  for (const r of results) {
    const all = (r.stdout + r.stderr).toLowerCase();
    for (const secret of MADE_UP) assert.equal(all.includes(secret), false, `output must not contain "${secret}"`);
  }
}

test('command line: exit 0 when clean, 1 when found, 2 when the list is missing; no name is ever printed', () => {
  const dir = tmp();
  const list = join(dir, 'list.txt');
  writeFileSync(list, LIST);
  const clean = join(dir, 'clean');
  const dirty = join(dir, 'dirty');
  mkdirSync(clean);
  mkdirSync(dirty);
  writeFileSync(join(clean, 'a.txt'), 'hello\n');
  writeFileSync(join(dirty, 'a.txt'), 'hello\nZelda Quimby\n');
  writeFileSync(join(dirty, 'plinth-orrery.txt'), 'x\n');

  const ok = run([clean], list);
  assert.equal(ok.status, 0);

  const bad = run([dirty], list);
  assert.equal(bad.status, 1);
  assert.match(bad.stdout, /a\.txt:2: name in text/);
  assert.match(bad.stdout, /\(path hidden\): name in file name/);
  assert.match(bad.stdout, /1 name in text, 1 name in file name/);

  const missing = run([clean], join(dir, 'gone.txt'));
  assert.equal(missing.status, 2);

  const unset = run([clean], null);
  assert.equal(unset.status, 2);
  assert.match(unset.stderr, /WB_NAMES_LIST is not set/);

  assertNoNamePrinted([ok, bad, missing, unset]);
});

test('command line: with no folder named, it scans the tracked files and their names only', () => {
  const dir = tmp();
  const list = join(dir, 'list.txt');
  writeFileSync(list, LIST);
  const repo = join(dir, 'repo');
  mkdirSync(repo);
  const git = (...a) => execFileSync('git', a, { cwd: repo, stdio: 'ignore' });
  git('init', '-q');
  writeFileSync(join(repo, 'tracked.txt'), 'line one\nwritten by Harbour Voss\n');
  writeFileSync(join(repo, 'zelda-quimby.md'), 'clean\n');
  git('add', 'tracked.txt', 'zelda-quimby.md');
  writeFileSync(join(repo, 'untracked.txt'), 'plinth-orrery\n');

  const r = run([], list, { cwd: repo });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /tracked\.txt:2: name in text/);
  assert.match(r.stdout, /\(path hidden\): name in file name/);
  assert.doesNotMatch(r.stdout, /untracked/);
  assertNoNamePrinted([r]);
});

test('command line: --added scans what a branch adds, and fails closed without a base', () => {
  const dir = tmp();
  const list = join(dir, 'list.txt');
  writeFileSync(list, LIST);
  const repo = join(dir, 'repo');
  mkdirSync(repo);
  const git = (...a) => execFileSync('git', a, { cwd: repo, stdio: 'ignore' });
  git('init', '-q', '-b', 'base');
  git('config', 'user.email', 'test@example.invalid');
  git('config', 'user.name', 'Test');
  writeFileSync(join(repo, 'old.txt'), 'Zelda Quimby was here before the branch\n');
  git('add', '.');
  git('commit', '-q', '-m', 'base');
  git('switch', '-q', '-c', 'work');
  writeFileSync(join(repo, 'new.txt'), 'clean\nplinth-orrery\n');
  git('add', '.');
  git('commit', '-q', '-m', 'work');

  const r = run(['--added', 'base'], list, { cwd: repo });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /new\.txt:2: name in an added line/);
  assert.doesNotMatch(r.stdout, /old\.txt/, 'a name already on the base branch is not an added line');

  const noBase = run(['--added'], list, { cwd: repo });
  assert.equal(noBase.status, 2);
  const badBase = run(['--added', 'no-such-branch'], list, { cwd: repo });
  assert.equal(badBase.status, 2);
  assertNoNamePrinted([r, noBase, badBase]);
});

test('command line: the list is never looked for in the home folder', () => {
  const dir = tmp();
  const clean = join(dir, 'clean');
  mkdirSync(clean);
  writeFileSync(join(clean, 'a.txt'), 'hello\n');
  const home = join(dir, 'home');
  mkdirSync(home);
  writeFileSync(join(home, 'list.txt'), LIST);
  const r = run([clean], null, { extraEnv: { HOME: home, USERPROFILE: home } });
  assert.equal(r.status, 2, 'a list sitting in the home folder is not found');
});

test('command line: a missing folder to scan is a failed run, not a pass', () => {
  const dir = tmp();
  const list = join(dir, 'list.txt');
  writeFileSync(list, LIST);
  assert.equal(run([join(dir, 'no-such-folder')], list).status, 2);
});
