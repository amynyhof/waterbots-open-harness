/**
 * Confirms engine/ is the sealed bundle, byte for byte, without a model call.
 *
 *   node scripts/check-engine.mjs        # also: npm run engine:check
 *
 * THE ENGINE IS THE PAID SITE'S. engine/ is a copy of the bundle the maintainer
 * carries by hand into carried/; this site never edits a file in it. Calvin's
 * brief (PROPOSAL_calvin-brief.md §1.2), rulings 1 and R2, 1 Oct 2026.
 *
 * WHAT IT PROVES. That every file named in engine/carry-hashes.sha256 is on
 * disk and hashes to the listed SHA-256, and that no other file sits under
 * engine/ apart from the three the bundle carries about itself (the manifest,
 * the hash list and the builder's record). A changed, missing or extra file
 * fails the check and is named.
 *
 * IT RUNS IN FRONT OF EVERY BUILD (`npm run build`), so a forked engine fails
 * the deploy. When a new sealed engine arrives, engine/ is replaced whole and
 * its own hash list comes with it; this check follows without being edited.
 */

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = 'engine';
const LIST = 'carry-hashes.sha256';
/** Files the bundle carries about itself; they are not on its own hash list. */
const ABOUT_THE_BUNDLE = new Set([LIST, 'MANIFEST.md', '_build-report.json']);

const failures = [];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(path));
    else out.push(relative(ROOT, path).split(sep).join('/'));
  }
  return out;
}

let listText;
try {
  listText = readFileSync(join(ROOT, LIST), 'utf8');
} catch {
  console.error(`check-engine: FAIL — ${ROOT}/${LIST} is missing. The engine has no hash list to be held to.`);
  process.exit(1);
}

const listed = new Map();
listText.split('\n').forEach((line, i) => {
  if (line.trim() === '') return;
  const m = /^([0-9a-f]{64}) {2}(\S.*)$/.exec(line.replace(/\r$/, ''));
  if (!m) {
    failures.push(`${ROOT}/${LIST} line ${i + 1} is not "<sha256>  <path>"`);
    return;
  }
  listed.set(m[2], m[1]);
});

const onDisk = new Set(walk(ROOT));

for (const [path, want] of listed) {
  if (!onDisk.has(path)) {
    failures.push(`${ROOT}/${path} is on the hash list but not on disk`);
    continue;
  }
  const got = createHash('sha256').update(readFileSync(join(ROOT, path))).digest('hex');
  if (got !== want) failures.push(`${ROOT}/${path} does not match its hash — the engine has been edited here`);
}

for (const path of onDisk) {
  if (!listed.has(path) && !ABOUT_THE_BUNDLE.has(path)) {
    failures.push(`${ROOT}/${path} is not on the hash list — nothing is added to the engine here`);
  }
}

if (failures.length > 0) {
  console.error(`check-engine: FAIL — ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(`check-engine: ok — ${listed.size} files match ${ROOT}/${LIST}; nothing extra under ${ROOT}/.`);
