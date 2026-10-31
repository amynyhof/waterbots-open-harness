/**
 * The name scan. Checks every tracked file's name and text, or the lines a pull request adds, against a
 * private list of names. Shaped on the open core's scripts/check-names.mjs.
 *
 *   node scripts/check-names.mjs                    every tracked file and file name
 *   node scripts/check-names.mjs <file-or-folder>   everything under the files and folders named
 *   node scripts/check-names.mjs --added <base>     the lines and file names `git diff <base>...HEAD` adds
 *
 * WHERE THE LIST IS. The WB_NAMES_LIST setting holds the list's full path. There is no default path in the
 * code, and the list is read in place: never copied, never printed, never logged. It cannot run in GitHub's
 * checks, because the list is private; every pull request runs it here before pushing (PROCESS_RULES_for_ShellB.md,
 * *The name scan runs before every push*).
 *
 * THE LIST. One entry per line. `#` starts a comment; blank lines are skipped. An entry may end in
 * `| allowed on copyright and licence lines only`: it is then let through on lines that say copyright, licence
 * or SPDX, and nowhere else.
 *
 * MATCHING. Whole words only, upper or lower case. A space, dot, dash or underscore inside an entry matches any
 * of those, or nothing, so `Ada Lovelace` also finds `ada_lovelace` and `AdaLovelace`.
 *
 * FAILS CLOSED. An unset or empty setting, or a list that is missing, unreadable or empty, stops the run with
 * exit code 2 and no result. So does a file or folder to scan that does not exist, or a diff git cannot give.
 *
 * OUTPUT. File, line and kind only, then a count per kind. A path that itself holds a name is shown as
 * "(path hidden)". Exit codes: 0 nothing found, 1 something found, 2 the scan could not run.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist']);
const COPYRIGHT_LINE = /copyright|licen[cs]e|©|\(c\)|SPDX/i;
const ALLOW_MARK = /\|\s*allowed on copyright and licence lines only\s*$/i;
const HIDDEN = '(path hidden)';

export const KINDS = {
  text: 'name in text',
  fileName: 'name in file name',
  addedLine: 'name in an added line',
  addedFileName: 'name in an added file name',
};

export class ListError extends Error {}

/** Turns the text of the list into entries. Throws ListError when nothing usable is in it. */
export function parseNames(text) {
  const entries = [];
  for (const raw of text.replace(/^﻿/, '').split(/\r?\n/)) {
    const line = raw.trim();
    if (line === '' || line.startsWith('#')) continue;
    const copyrightOnly = ALLOW_MARK.test(line);
    const name = line.replace(ALLOW_MARK, '').trim();
    const parts = name.split(/[\s_.\-]+/).filter(Boolean).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (parts.length === 0) continue;
    const pattern = new RegExp(`(?<![A-Za-z0-9])${parts.join('[\\s_.\\-]*')}(?![A-Za-z0-9])`, 'i');
    entries.push({ pattern, copyrightOnly });
  }
  if (entries.length === 0) throw new ListError('the names list holds no entries');
  return entries;
}

/** Reads the list in place. Fails closed: any problem is a ListError. */
export function loadNames(path) {
  if (!path || !existsSync(path)) throw new ListError('the names list is missing');
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    throw new ListError('the names list cannot be read');
  }
  return parseNames(text);
}

/** The list's path, from the WB_NAMES_LIST setting only. Unset or empty is a ListError: there is no default. */
export function listPathFromEnv(env = process.env) {
  const path = (env.WB_NAMES_LIST ?? '').trim();
  if (path === '') throw new ListError('WB_NAMES_LIST is not set');
  return path;
}

/** Whether one line holds a listed name, minding the copyright allowance. */
function lineHasName(line, entries) {
  const isCopyrightLine = COPYRIGHT_LINE.test(line);
  return entries.some((e) => e.pattern.test(line) && !(e.copyrightOnly && isCopyrightLine));
}

/** Lines of `text` that hold a listed name. Returns line numbers only. */
export function scanText(text, entries) {
  const hits = [];
  text.split(/\r?\n/).forEach((line, i) => {
    if (lineHasName(line, entries)) hits.push(i + 1);
  });
  return hits;
}

/** True when the path itself holds a listed name. */
export function pathHasName(path, entries) {
  return entries.some((e) => e.pattern.test(path.split(sep).join('/')));
}

function isBinary(buf) {
  return buf.subarray(0, 8000).includes(0);
}

/** Scans files under `root`. `files` are paths relative to `root`. Returns findings and counts, never text. */
export function scanFiles(root, files, entries) {
  const findings = [];
  let textFiles = 0;
  let skipped = 0;
  for (const f of files) {
    const hidden = pathHasName(f, entries);
    const shown = hidden ? HIDDEN : f.split(sep).join('/');
    if (hidden) findings.push({ file: shown, line: 0, kind: KINDS.fileName });
    const buf = readFileSync(join(root, f));
    if (isBinary(buf)) {
      skipped++;
      continue;
    }
    textFiles++;
    for (const line of scanText(buf.toString('utf8'), entries)) findings.push({ file: shown, line, kind: KINDS.text });
  }
  return { findings, files: files.length, textFiles, skipped };
}

/**
 * Scans the lines a unified diff adds, and the names of the files it adds or renames. Line numbers are the
 * added line's place in the new file, read from the hunk headers. Lines the diff removes are not looked at.
 */
export function scanDiff(diff, entries) {
  const findings = [];
  let file = null;
  let shown = null;
  let line = 0;
  let files = 0;
  let header = false;
  let nameReported = false;
  const reportName = (target) => {
    if (nameReported || !pathHasName(target, entries)) return;
    nameReported = true;
    findings.push({ file: HIDDEN, line: 0, kind: KINDS.addedFileName });
  };
  for (const raw of diff.split(/\r?\n/)) {
    if (raw.startsWith('diff --git ')) {
      file = null;
      header = true;
      nameReported = false;
      continue;
    }
    /* A rename or copy with no change of content has no "+++" line; its new name is still checked. */
    if (header && /^(rename|copy) to /.test(raw)) {
      reportName(raw.replace(/^(rename|copy) to /, '').replace(/^"(.*)"$/, '$1'));
      continue;
    }
    /* Only a file's header names it; inside a hunk, "+++" is an added line that starts with "++". */
    if (header && raw.startsWith('+++ ')) {
      const target = raw.slice(4).replace(/\t.*$/, '').replace(/^"(.*)"$/, '$1').replace(/^b\//, '');
      file = target === '/dev/null' ? null : target;
      if (file) {
        files++;
        reportName(file);
        shown = pathHasName(file, entries) ? HIDDEN : file;
      }
      continue;
    }
    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(raw);
    if (hunk) {
      header = false;
      line = Number(hunk[1]);
      continue;
    }
    if (!file) continue;
    if (raw.startsWith('+')) {
      if (lineHasName(raw.slice(1), entries)) findings.push({ file: shown, line, kind: KINDS.addedLine });
      line++;
    } else if (raw.startsWith(' ')) {
      line++;
    }
  }
  return { findings, files };
}

function walk(dir, base = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (SKIP_DIRS.has(e.name)) return [];
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p, base) : [relative(base, p)];
  });
}

/** The files to scan: tracked files by default, or everything under the folders and files named. */
export function listFiles(targets, cwd) {
  if (targets.length === 0) {
    const out = execFileSync('git', ['ls-files', '-z'], { cwd, encoding: 'utf8' });
    return [{ root: cwd, files: out.split('\0').filter(Boolean) }];
  }
  return targets.map((t) => {
    const abs = resolve(cwd, t);
    if (!existsSync(abs)) throw new ListError('a folder or file to scan does not exist');
    return statSync(abs).isDirectory()
      ? { root: abs, files: walk(abs) }
      : { root: resolve(abs, '..'), files: [relative(resolve(abs, '..'), abs)] };
  });
}

/** The diff a pull request adds against `base`. Fails closed when git cannot give it. */
export function diffAgainst(base, cwd) {
  if (!base || base.startsWith('-')) throw new ListError('--added needs the branch to compare with, e.g. origin/main');
  try {
    return execFileSync('git', ['-c', 'core.quotepath=off', 'diff', '--no-color', '--no-ext-diff', '-M', `${base}...HEAD`], {
      cwd,
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    throw new ListError('git could not give the diff against that branch');
  }
}

export function main(argv, env = process.env, cwd = process.cwd(), out = console.log, err = console.error) {
  let entries;
  let findings = [];
  let summary;
  try {
    entries = loadNames(listPathFromEnv(env));
    if (argv[0] === '--added') {
      const r = scanDiff(diffAgainst(argv[1], cwd), entries);
      findings = r.findings;
      summary = `${r.files} file(s) with added lines`;
    } else {
      let files = 0;
      let textFiles = 0;
      for (const { root, files: list } of listFiles(argv, cwd)) {
        const r = scanFiles(root, list, entries);
        files += r.files;
        textFiles += r.textFiles;
        findings.push(...r.findings);
      }
      summary = `${files} file(s), ${textFiles} read as text`;
    }
  } catch (e) {
    if (!(e instanceof ListError)) throw e;
    err(`name scan: cannot run (${e.message}). No result.`);
    return 2;
  }
  for (const f of findings) out(`${f.file}${f.line ? `:${f.line}` : ''}: ${f.kind}`);
  const byKind = Object.values(KINDS)
    .map((k) => [k, findings.filter((f) => f.kind === k).length])
    .filter(([, n]) => n > 0)
    .map(([k, n]) => `${n} ${k}`);
  out(
    `name scan: ${summary}, ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} (never printed): ` +
      `${findings.length} finding(s)${byKind.length ? ` (${byKind.join(', ')})` : ''}`,
  );
  return findings.length === 0 ? 0 : 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  process.exitCode = main(process.argv.slice(2));
}
