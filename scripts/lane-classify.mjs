/**
 * Decides a pull request's merge lane from the files it changes. Nothing else
 * decides it: not the session, not the description, not a label a person adds.
 *
 *   node scripts/lane-classify.mjs < files.ndjson     (prints 1, 2 or 3)
 *
 * Input is one JSON object per line, { "path": "...", "previous": "..." | null },
 * which is what the GitHub files list gives. A renamed file counts under both
 * its old and its new path, so a file cannot be moved out of lane 3 to hide it.
 *
 * Rules, in order: a path on the lane 3 list is lane 3; else on the lane 2 list
 * is lane 2; else on the lane 1 list is lane 1; a path on no list is lane 3. The
 * pull request takes the highest lane of any file. No files is lane 3.
 *
 * The path lists are .github/lanes.json, which is itself on the lane 3 list.
 * scripts/check-lanes.mjs holds the cases that prove all of this.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

const LISTS_FILE = path.resolve(import.meta.dirname, '..', '.github', 'lanes.json');

/** A glob to a regular expression: ** crosses folders, * stays inside one, matched without regard to case. */
export function globToRegExp(glob) {
  let out = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*' && glob[i + 1] === '*') {
      if (glob[i + 2] === '/') {
        out += '(?:.*/)?';
        i += 2;
      } else {
        out += '.*';
        i += 1;
      }
    } else if (c === '*') out += '[^/]*';
    else out += c.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${out}$`, 'i');
}

export function loadLists(file = LISTS_FILE) {
  const j = JSON.parse(readFileSync(file, 'utf8'));
  const compile = (list) => list.map(globToRegExp);
  return { 1: compile(j.lane1), 2: compile(j.lane2), 3: compile(j.lane3) };
}

/** The lane of one path. */
export function laneOfPath(p, lists) {
  const norm = p.replace(/\\/g, '/').replace(/^\.\//, '');
  for (const lane of [3, 2, 1]) {
    if (lists[lane].some((re) => re.test(norm))) return lane;
  }
  return 3;
}

/** The lane of a whole pull request: files is [{ path, previous }]. */
export function laneOfPullRequest(files, lists) {
  if (!files.length) return 3;
  let lane = 1;
  for (const f of files) {
    for (const p of [f.path, f.previous]) {
      if (p) lane = Math.max(lane, laneOfPath(p, lists));
    }
  }
  return lane;
}

if (process.argv[1] === import.meta.filename) {
  const input = readFileSync(0, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l));
  console.log(String(laneOfPullRequest(input, loadLists())));
}
