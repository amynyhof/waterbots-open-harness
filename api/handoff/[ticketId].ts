/**
 * The claim — the bridge's hand-over-once endpoint.
 *
 * A Vercel serverless function answering GET /api/handoff/<ticketId>, called
 * once by production's server, never by a browser. It hands the seal over
 * and deletes it in the same breath, so a ticket is good for exactly one
 * claim. The contract is item S7, ruled 7 Sep 2026; the three facts that
 * shape this file — the address, the answers, the key's name — came from
 * production by the maintainer's hand on 8 Sep 2026.
 *
 * THE ANSWERS, AS RULED:
 *
 *   200  the sealed JSON body, once. Then it is gone.
 *   404  unknown, expired, or already claimed. The store cannot tell these
 *        apart and neither can production, which is the point: a claimed
 *        ticket is indistinguishable from one that never existed.
 *   401  the key is wrong or missing.
 *
 * BEHIND A SHARED KEY, BRIDGE_KEY, held in the project's settings and never
 * in code — the same way the model key and the store's settings are. The
 * request carries it as `Authorization: Bearer <key>`. The comparison is in
 * constant time, over hashes of the two values, so neither the key's length
 * nor how many leading characters matched can be read off the clock.
 *
 * NOTHING IS LOGGED BUT THE OUTCOME. The seal is a visitor's project and it
 * leaves here once; it is not written to a log on its way out. A wrong key
 * is logged as a wrong key, without the key.
 */

import { createHash, timingSafeEqual } from 'node:crypto';
import { isTicketId, sealKey } from '../_handoff.js';
import { StoreError, storeConfig, takeOnce } from '../_store.js';

/** The setting production's key lives under. Its name came from production. */
export const KEY_SETTING = 'BRIDGE_KEY';

export async function GET(req: Request): Promise<Response> {
  /* The key first. A caller without it learns nothing else — not whether a
     ticket exists, not whether the store is up. */
  const expected = process.env[KEY_SETTING];
  if (!expected) {
    console.error(`handoff claim: ${KEY_SETTING} is not set in this environment, so no claim can be answered`);
    return problem(503, `The bridge is not configured on this side: ${KEY_SETTING} is not set.`);
  }
  if (!keyMatches(req.headers.get('authorization'), expected)) {
    console.error('handoff claim: refused, the key was wrong or missing');
    return problem(401, 'The key is wrong or missing.', { 'www-authenticate': 'Bearer' });
  }

  /* The ticket is the last segment of the path. A ticket that is not shaped
     like one is simply unknown, as ruled: 404, not 400. */
  const ticketId = lastSegment(req.url);
  if (!isTicketId(ticketId)) {
    return problem(404, 'Unknown, expired or already claimed.');
  }

  const store = storeConfig();
  if (!store) {
    console.error('handoff claim: the shared store is not configured, so no claim can be answered');
    return problem(503, 'The bridge is not configured on this side: the store is not set up.');
  }

  let seal: string | null;
  try {
    seal = await takeOnce(store, sealKey(ticketId));
  } catch (error) {
    const why = error instanceof StoreError ? error.message : String(error);
    console.error(`handoff claim: the store did not answer — ${why}`);
    return problem(503, 'The store did not answer. The ticket is untouched; try again.');
  }

  if (seal === null) {
    return problem(404, 'Unknown, expired or already claimed.');
  }

  /* The seal is stored as the JSON it will be handed over as, so it goes out
     byte for byte: no re-parsing, no chance of reshaping it on the way. */
  return new Response(seal, {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

/** Anything but a GET is a plain 405. The claim is a read. */
export async function POST(): Promise<Response> {
  return problem(405, 'The claim is a GET.');
}

/* -------------------------------------------------------------------------
   Helpers.
------------------------------------------------------------------------- */

/**
 * Does the Authorization header carry the expected key?
 *
 * Both values are hashed before comparison so the buffers are always the
 * same length and `timingSafeEqual` can do its job; comparing the raw
 * strings would leak the length, and a plain `===` would leak how far the
 * match got.
 */
function keyMatches(header: string | null, expected: string): boolean {
  if (!header) return false;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  if (!match) return false;
  const given = createHash('sha256').update(match[1]).digest();
  const wanted = createHash('sha256').update(expected).digest();
  return timingSafeEqual(given, wanted);
}

function lastSegment(url: string): string {
  let pathname: string;
  try {
    pathname = new URL(url).pathname;
  } catch {
    return '';
  }
  const parts = pathname.split('/').filter((p) => p !== '');
  return decodeURIComponent(parts[parts.length - 1] ?? '');
}

function problem(status: number, message: string, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  });
}
