/**
 * Counts Register your interest sign-ups, and removes one person's on request.
 *
 *   node scripts/count-interest.mjs
 *   node scripts/count-interest.mjs --remove someone@example.org
 *
 * Run on the maintainer's machine with the store's keys in the environment —
 * KV_REST_API_URL and KV_REST_API_TOKEN (or the UPSTASH_REDIS_REST_* pair),
 * the same keys the site's daily caps use. The keys never enter the repository.
 *
 * IT NEVER PRINTS A NAME OR AN EMAIL. Counting prints the number of sign-ups,
 * the number of distinct organisations, and the count for each interest and
 * each Commons module. That is all.
 *
 * REMOVAL IS THE ONLY WAY A SIGN-UP LEAVES — the maintainer's ruling of
 * 16 Nov 2026: kept until the person asks to be removed, nothing deletes on
 * its own. `--remove` takes every entry with that email address out of the
 * list and prints how many went, not whose.
 */

const KEY = 'interest:signups';

function config() {
  for (const [u, t] of [
    ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
    ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
  ]) {
    if (process.env[u] && process.env[t]) return { url: process.env[u].replace(/\/+$/, ''), token: process.env[t] };
  }
  return null;
}

async function run(store, commands) {
  const response = await fetch(`${store.url}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${store.token}`, 'content-type': 'application/json' },
    body: JSON.stringify(commands),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`the store answered ${response.status}`);
  const results = await response.json();
  return results.map((r, i) => {
    if (r && typeof r.error === 'string') throw new Error(`${commands[i][0]} was refused: ${r.error}`);
    return r?.result;
  });
}

const store = config();
if (!store) {
  console.error('No store keys in the environment: set KV_REST_API_URL and KV_REST_API_TOKEN, then run this again.');
  process.exit(1);
}

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
  for (const p of matching) {
    const [n] = await run(store, [['LREM', KEY, 0, p.raw]]);
    removed += typeof n === 'number' ? n : 0;
  }
  console.log(`Removed ${removed} sign-up${removed === 1 ? '' : 's'} for that address. ${list.length - removed} remain.`);
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
console.log('By interest:');
for (const [id, n] of Object.entries(byInterest).sort((a, b) => b[1] - a[1])) console.log(`  ${id}: ${n}`);
if (Object.keys(byModule).length) {
  console.log('From a Commons module:');
  for (const [slug, n] of Object.entries(byModule).sort((a, b) => b[1] - a[1])) console.log(`  ${slug}: ${n}`);
}
