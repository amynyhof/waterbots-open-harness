/**
 * Reads a pull request's diff on stdin and looks only at the lines it adds.
 *
 *   node scripts/scan-diff.mjs --secrets < pr.diff
 *
 * --secrets  fails if an added line looks like a key, a token or a private key.
 *            It looks for a name followed by a long value, never for the name alone.
 *
 * THE NUMBER GATE IS RETIRED, 21 Nov 2026, the maintainer's ruling: the `--numbers` mode and its
 * terms file are gone. The name scan (scripts/check-names.mjs), reading her private list of names
 * and project IDs, is the one check for public material; no calculation figure is blocked.
 *
 * Exit 0: nothing found. Exit 1: found.
 *
 * Output names the kind and the line's place in the diff. It never prints the
 * line, because the line is what must not leak.
 */

import { readFileSync } from 'node:fs';

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

if (process.argv[1] === import.meta.filename) {
  const mode = process.argv[2];
  const diff = readFileSync(0, 'utf8');
  if (mode === '--secrets') {
    const hits = scanSecrets(diff);
    for (const h of hits) console.log(`Secrets scan: ${h.kind} on diff line ${h.n}`);
    console.log(hits.length ? 'FAILED — something looks like a secret.' : 'Secrets scan: nothing found in the added lines.');
    process.exit(hits.length ? 1 : 0);
  } else {
    console.log('Usage: node scripts/scan-diff.mjs --secrets  (diff on stdin). The number gate is retired.');
    process.exit(64);
  }
}
