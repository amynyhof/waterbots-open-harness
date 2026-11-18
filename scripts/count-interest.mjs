/**
 * Counts Register your interest sign-ups, and removes one person's on request.
 *
 *   node scripts/count-interest.mjs
 *   node scripts/count-interest.mjs --remove someone@example.org
 *
 * Run on the maintainer's machine with the store's keys in the environment —
 * KV_REST_API_URL and KV_REST_API_TOKEN (or the UPSTASH_REDIS_REST_* pair),
 * the same keys the site's daily caps use. The keys never enter the repository.
 * From 16 Nov 2026 (#176) they are read from .env.local when not already set
 * (scripts/_local-store.mjs).
 *
 * IT NEVER PRINTS A NAME OR AN EMAIL. Counting prints the number of sign-ups,
 * the number of distinct organisations, and the count for each interest and
 * each Commons module. That is all.
 *
 * REMOVAL IS THE ONLY WAY A SIGN-UP LEAVES — the maintainer's ruling of
 * 16 Nov 2026: kept until the person asks to be removed, nothing deletes on
 * its own. `--remove` takes every entry with that email address out of the
 * list and prints how many went, not whose. From 16 Nov 2026 (#176) it also
 * takes that person off the supporters page, whatever state their entry is in.
 */

import { localStore, run } from './_local-store.mjs';

const KEY = 'interest:signups';

const local = localStore();
if (local.problem) {
  console.error(local.problem);
  process.exit(1);
}
const store = local.store;
const SUPPORTERS = ['supporters:waiting', 'supporters:shown', 'supporters:declined'];

const [entries] = await run(store, [['LRANGE', KEY, 0, -1]]);
const list = Array.isArray(entries) ? entries.filter((e) => typeof e === 'string') : [];
const parsed = list.map((raw) => {
  try {
    return { raw, entry: JSON.parse(raw) };
  } catch {
    return { raw, entry: null };
  }
});

const removeAt = process.argv.indexOf('--remove');
if (removeAt !== -1) {
  const email = (process.argv[removeAt + 1] ?? '').trim().toLowerCase();
  if (!email) {
    console.error('Name the email address to remove: --remove <email>');
    process.exit(1);
  }
  const matching = parsed.filter((p) => p.entry && String(p.entry.email).toLowerCase() === email);
  let removed = 0;
  let offThePage = 0;
  for (const p of matching) {
    const [n] = await run(store, [['LREM', KEY, 0, p.raw]]);
    removed += typeof n === 'number' ? n : 0;
    /* Their supporter entry goes too, from wherever it is. */
    if (typeof p.entry.supporter === 'string' && p.entry.supporter) {
      const gone = await run(store, SUPPORTERS.map((k) => ['HDEL', k, p.entry.supporter]));
      offThePage += gone.reduce((sum, g) => sum + (typeof g === 'number' ? g : 0), 0);
    }
  }
  console.log(`Removed ${removed} sign-up${removed === 1 ? '' : 's'} for that address. ${list.length - removed} remain.`);
  if (offThePage) console.log(`Their supporter entry was removed too.`);
  process.exit(0);
}

const good = parsed.filter((p) => p.entry);
const organisations = new Set(good.map((p) => String(p.entry.organisation).trim().toLowerCase()));
const byInterest = {};
const byModule = {};
for (const { entry } of good) {
  for (const id of entry.interests ?? []) byInterest[id] = (byInterest[id] ?? 0) + 1;
  if (entry.module) byModule[entry.module] = (byModule[entry.module] ?? 0) + 1;
}

console.log(`Sign-ups: ${good.length}${parsed.length > good.length ? ` (and ${parsed.length - good.length} unreadable)` : ''}`);
console.log(`Distinct organisations: ${organisations.size}`);
/* From 18 Nov 2026 the supporters page's form saves here too, with a newsletter box. Counts only. */
console.log(`From the supporters page: ${good.filter((p) => p.entry.source === 'supporters').length}`);
console.log(`Asked for the newsletter: ${good.filter((p) => p.entry.newsletter === true).length}`);
console.log('By interest:');
for (const [id, n] of Object.entries(byInterest).sort((a, b) => b[1] - a[1])) console.log(`  ${id}: ${n}`);
if (Object.keys(byModule).length) {
  console.log('From a Commons module:');
  for (const [slug, n] of Object.entries(byModule).sort((a, b) => b[1] - a[1])) console.log(`  ${slug}: ${n}`);
}
