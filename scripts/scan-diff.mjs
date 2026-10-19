/**
 * Reads a pull request's diff on stdin and looks only at the lines it adds.
 *
 *   node scripts/scan-diff.mjs --secrets < pr.diff
 *   node scripts/scan-diff.mjs --numbers < pr.diff
 *
 * --secrets  fails if an added line looks like a key, a token or a private key.
 *            It looks for a name followed by a long value, never for the name alone.
 * --numbers  the number gate. It fails if an added line matches any pattern in
 *            .github/number-gate-terms.txt, one regular expression a line, the
 *            maintainer's list of project figures and identifying words.
 *
 * Exit 0: nothing found. Exit 1: found. Exit 2: the gate has no patterns, so it
 * cannot say anything is clean; the merge lanes treat that as not clean.
 *
 * Output names the kind and the line's place in the diff. It never prints the
 * line, because the line is what must not leak.
 */

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const TERMS_FILE = path.resolve(import.meta.dirname, '..', '.github', 'number-gate-terms.txt');

export const SECRET_PATTERNS = [
  ['an Anthropic key', /sk-ant-[A-Za-z0-9_-]{20,}/],
  ['a Resend key', /\bre_[A-Za-z0-9]{20,}/],
  ['a GitHub token', /\bgh[pousr]_[A-Za-z0-9]{30,}/],
  ['an AWS key id', /\bAKIA[0-9A-Z]{16}\b/],
  ['a private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['a database address with a password', /\brediss?:\/\/[^\s:/@]*:[^\s@]{6,}@/],
  ['a named secret with a value', /\b[A-Z][A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)\b\s*[=:]\s*["']?[A-Za-z0-9_\-./+]{20,}/],
];

/** The added lines of a unified diff. */
export function addedLines(diff) {
  const out = [];
  diff.split('\n').forEach((line, i) => {
    if (line.startsWith('+') && !line.startsWith('+++')) out.push({ n: i + 1, text: line.slice(1) });
  });
  return out;
}

export function scanSecrets(diff) {
  const hits = [];
  for (const { n, text } of addedLines(diff)) {
    for (const [kind, re] of SECRET_PATTERNS) if (re.test(text)) hits.push({ n, kind });
  }
  return hits;
}

export function loadTerms(file = TERMS_FILE) {
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => new RegExp(l, 'i'));
}

export function scanNumbers(diff, terms) {
  const hits = [];
  for (const { n, text } of addedLines(diff)) {
    terms.forEach((re, k) => {
      if (re.test(text)) hits.push({ n, kind: `number-gate pattern ${k + 1}` });
    });
  }
  return hits;
}

if (process.argv[1] === import.meta.filename) {
  const mode = process.argv[2];
  const diff = readFileSync(0, 'utf8');
  if (mode === '--secrets') {
    const hits = scanSecrets(diff);
    for (const h of hits) console.log(`Secrets scan: ${h.kind} on diff line ${h.n}`);
    console.log(hits.length ? 'FAILED — something looks like a secret.' : 'Secrets scan: nothing found in the added lines.');
    process.exit(hits.length ? 1 : 0);
  } else if (mode === '--numbers') {
    const terms = loadTerms();
    if (!terms.length) {
      console.log('Number gate: INACTIVE — .github/number-gate-terms.txt has no patterns, so it cannot say a diff is clean.');
      process.exit(2);
    }
    const hits = scanNumbers(diff, terms);
    for (const h of hits) console.log(`Number gate: ${h.kind} on diff line ${h.n}`);
    console.log(hits.length ? 'FAILED — an added line matches the number gate.' : `Number gate: ${terms.length} patterns, nothing found.`);
    process.exit(hits.length ? 1 : 0);
  } else {
    console.log('Usage: node scripts/scan-diff.mjs --secrets | --numbers  (diff on stdin)');
    process.exit(64);
  }
}
