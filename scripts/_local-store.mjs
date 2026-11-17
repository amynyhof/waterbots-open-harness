/**
 * The site store, from the maintainer's machine — shared by scripts/supporters.mjs and
 * scripts/count-interest.mjs.
 *
 * THE KEYS. KV_REST_API_URL and KV_REST_API_TOKEN (or the UPSTASH_REDIS_REST_* pair), the same keys
 * the site's daily caps use. When they are not already set, they are read from `.env.local` in the
 * repository folder, which is gitignored and lives on her machine only, so there is nothing to type
 * before a command (her word of 16 Nov 2026 on #176). Only those four names are read from the file;
 * nothing in it is printed, ever.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const PAIRS = [
  ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
  ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
];
const NAMES = PAIRS.flat();

/** The four key names from `.env.local`, if the file is there. Values are never printed. */
export function readEnvLocal(dir = process.cwd()) {
  const file = join(dir, '.env.local');
  if (!existsSync(file)) return { found: false, values: {} };
  const values = {};
  for (const raw of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(raw);
    if (!m || !NAMES.includes(m[1])) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (v) values[m[1]] = v;
  }
  return { found: true, values };
}

/**
 * The store's address and token, from the environment first and `.env.local` second. Returns
 * { store } or { problem } with a plain line saying what is missing.
 */
export function localStore(env = process.env, dir = process.cwd()) {
  const local = readEnvLocal(dir);
  const get = (name) => env[name] || local.values[name];
  for (const [u, t] of PAIRS) {
    if (get(u) && get(t)) return { store: { url: get(u).replace(/\/+$/, ''), token: get(t) } };
  }
  return {
    problem: local.found
      ? 'The store keys are not in .env.local: it needs KV_REST_API_URL and KV_REST_API_TOKEN. Add them, then run this again.'
      : 'There is no .env.local in this folder, and no store keys are set. Run this in the repository folder, where .env.local holds KV_REST_API_URL and KV_REST_API_TOKEN.',
  };
}

/** Send commands to the store and return their results. `multi-exec` runs them as one transaction. */
export async function run(store, commands, endpoint = 'pipeline') {
  const response = await fetch(`${store.url}/${endpoint}`, {
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
