/**
 * Approving supporters — the maintainer's one command, pasted into PowerShell in the repository
 * folder. Approved 16 Nov 2026, her word on #176 (docs/proposals/supporters-2026-11-16.md).
 *
 *   npm run supporters                     what is waiting, each with the lines to paste
 *   npm run supporters -- approve <id>     show it on the supporters page
 *   npm run supporters -- decline <id>     keep it off the page
 *   npm run supporters -- hide <id>        take a shown one off the page
 *   npm run supporters -- shown            what is on the page now, each with its hide line
 *
 * NOTHING SHOWS OR DELETES ON ITS OWN. An entry moves only by one of these commands. Declining or
 * hiding keeps it, off the page, and keeps the sign-up; only the person's own request removes them
 * (scripts/count-interest.mjs --remove). She approves an entry as written: there is no edit.
 *
 * IT NEVER PRINTS AN EMAIL. A supporter entry holds none (api/_supporters.ts). It prints the public
 * fields, which are what she is approving. The store's keys come from .env.local (scripts/_local-store.mjs).
 */

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { localStore, run } from './_local-store.mjs';

export const KEYS = { waiting: 'supporters:waiting', shown: 'supporters:shown', declined: 'supporters:declined' };
const ROLES = {
  developer: 'Developer',
  'standard-body': 'Standard body',
  consultant: 'Consultant',
  auditor: 'Auditor',
  funder: 'Funder',
  other: 'Other',
};
const ID = /^[a-z0-9]{3,12}$/;

function parse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** One entry, its public fields only, in a few plain lines. */
export function describe(e) {
  const lines = [`  ${e.name}  ·  ${ROLES[e.role] ?? e.role}`];
  const line = [e.title, e.organisation].filter(Boolean).join(' · ');
  if (line) lines.push(`  ${line}`);
  if (e.comment) lines.push(`  "${e.comment}"`);
  lines.push(`  Sent ${String(e.at ?? '').slice(0, 10)}${e.approvedAt ? `, shown since ${e.approvedAt.slice(0, 10)}` : ''}`);
  return lines.join('\n');
}

/** Where an entry is now, and its record. */
async function find(store, id) {
  const [w, s, d] = await run(store, [
    ['HGET', KEYS.waiting, id],
    ['HGET', KEYS.shown, id],
    ['HGET', KEYS.declined, id],
  ]);
  if (w) return { from: 'waiting', entry: parse(w) };
  if (s) return { from: 'shown', entry: parse(s) };
  if (d) return { from: 'declined', entry: parse(d) };
  return null;
}

/** Move an entry from one state to another, in one transaction: written to the new place, then out of the old. */
async function move(store, id, from, to, entry, stamp) {
  const next = { ...entry, ...stamp };
  await run(
    store,
    [
      ['HSET', KEYS[to], id, JSON.stringify(next)],
      ['HDEL', KEYS[from], id],
    ],
    'multi-exec'
  );
}

export async function main(argv, out = console.log, err = console.error, env = process.env) {
  const local = localStore(env);
  if (local.problem) {
    err(local.problem);
    return 1;
  }
  const store = local.store;
  const [command = 'waiting', id = ''] = argv;

  if (command === 'waiting' || command === 'shown') {
    const [values] = await run(store, [['HVALS', KEYS[command]]]);
    const entries = (Array.isArray(values) ? values : []).map(parse).filter((e) => e && e.id);
    entries.sort((a, b) => String(a.at).localeCompare(String(b.at)));
    if (entries.length === 0) {
      out(command === 'waiting' ? 'Nothing is waiting.' : 'No supporters are shown yet.');
      return 0;
    }
    out(command === 'waiting' ? `${entries.length} waiting for you:\n` : `${entries.length} on the supporters page:\n`);
    for (const e of entries) {
      out(describe(e));
      if (command === 'waiting') {
        out(`  To show it:      npm run supporters -- approve ${e.id}`);
        out(`  To keep it off:  npm run supporters -- decline ${e.id}`);
      } else {
        out(`  To take it off:  npm run supporters -- hide ${e.id}`);
      }
      out('');
    }
    return 0;
  }

  if (!['approve', 'decline', 'hide'].includes(command)) {
    err(`"${command}" is not a command here. Use approve, decline, hide or shown, or nothing to see what is waiting.`);
    return 1;
  }
  if (!ID.test(id)) {
    err(`Name the entry: npm run supporters -- ${command} <id>. The ids are printed by npm run supporters.`);
    return 1;
  }
  const found = await find(store, id);
  if (!found || !found.entry) {
    err(`No entry has the id ${id}. Nothing changed.`);
    return 1;
  }
  const now = new Date().toISOString();
  const who = found.entry.name;

  if (command === 'approve') {
    if (found.from === 'shown') {
      out(`${who} is already on the supporters page. Nothing changed.`);
      return 0;
    }
    const { declinedAt, ...entry } = found.entry;
    void declinedAt;
    await move(store, id, found.from, 'shown', entry, { approvedAt: now });
    out(`Approved: ${who} will show on the supporters page within five minutes.`);
    return 0;
  }
  if (command === 'decline') {
    if (found.from !== 'waiting') {
      out(found.from === 'shown' ? `${who} is on the page; to take it off, use hide ${id}. Nothing changed.` : `${who} is already off the page. Nothing changed.`);
      return 0;
    }
    await move(store, id, 'waiting', 'declined', found.entry, { declinedAt: now });
    out(`Declined: ${who} stays off the supporters page. The sign-up is kept.`);
    return 0;
  }
  /* hide */
  if (found.from !== 'shown') {
    out(`${who} is not on the supporters page. Nothing changed.`);
    return 0;
  }
  const { approvedAt, ...entry } = found.entry;
  void approvedAt;
  await move(store, id, 'shown', 'declined', entry, { declinedAt: now });
  out(`Hidden: ${who} comes off the supporters page within five minutes. The sign-up is kept.`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main(process.argv.slice(2))
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      console.error(`That did not finish: ${error instanceof Error ? error.message : String(error)}. Run npm run supporters to see where things stand.`);
      process.exitCode = 1;
    });
}
