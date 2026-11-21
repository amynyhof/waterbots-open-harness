/**
 * GET /api/supporters — the supporters page's list. Approved 16 Nov 2026, the maintainer's word on
 * #176 (docs/proposals/supporters-2026-11-16.md).
 *
 * THE SHOWN LIST ONLY. Waiting and declined entries are never read here, and no email is ever in a
 * supporter entry (api/_supporters.ts). Each entry goes out as its public fields and the month it
 * went on the page. ~~Cached at the edge for five minutes, so an approval shows within five minutes.~~
 * Cached at the edge for thirty seconds from 18 Nov 2026, when the page's own form began to show an
 * entry at once (her word on #176): the sender sees their card straight away, everyone else within
 * thirty seconds, and a hide comes off as fast.
 *
 * Honest states: no store on a test copy says so; a store that fails says it is a problem on our
 * side. An empty list is an empty list, and the page says no supporters are shown yet.
 */

import { StoreError, hashValues, storeConfig } from './_store.js';
import { SUPPORTER_KEYS, shownForPage } from './_supporters.js';

export async function GET(): Promise<Response> {
  const store = storeConfig();
  if (!store) {
    if (process.env.VERCEL === '1') {
      console.error('supporters: the shared store is not configured, so the list cannot be read');
      return problem(503, 'The supporters list cannot be read right now. This is a problem on our side.');
    }
    return problem(503, 'The supporters list only loads on the live site, not on this test copy.');
  }
  try {
    const values = await hashValues(store, SUPPORTER_KEYS.shown);
    return new Response(JSON.stringify({ supporters: shownForPage(values) }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=0, s-maxage=30' },
    });
  } catch (error) {
    console.error(`supporters: the list could not be read — ${error instanceof StoreError ? error.message : String(error)}`);
    return problem(503, 'The supporters list could not be read just now. Trying again usually works.');
  }
}

export async function POST(): Promise<Response> {
  return problem(405, 'This address takes GET requests only.');
}

function problem(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
