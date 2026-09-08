/**
 * The seal — the bridge's sending half.
 *
 * A Vercel serverless function answering POST /api/handoff. The desk sends
 * the visit as a seal, checked in _handoff.ts; a good one is stored under a
 * random ticket for one hour and the ticket goes back, so the page can send
 * the visitor to production's sign-up with only that ticket in the address.
 * The claim — production reading the seal once, behind a shared key — is the
 * route beside this one, [ticketId].ts.
 *
 * THIS SITE KEEPS NO COPY. The seal lives in the short-lived store and
 * nowhere else, the store forgets it after an hour on its own, and the claim
 * deletes it sooner. Nothing is written to a log. Item S7's ruling of
 * 26 Aug 2026 — the handoff does not change the no-memory rule — holds.
 *
 * TEN A DAY, per visitor, under the bridge's own counter (maintainer's ruling
 * of 8 Sep 2026), counted the way a chat message is: at the last moment
 * before the write, refunded if the write fails on our side.
 *
 * EVERY FAILURE SAYS WHAT HAPPENED, in words the desk can show. The one that
 * matters most is the honest local one: a laptop has no store, so the save
 * door on a laptop cannot seal, and it says so rather than pretending.
 */

import { HANDOFF, countOneMessage, timeUntilReset } from '../_cap.js';
import {
  MAX_SEAL_BYTES,
  TICKET_TTL_SECONDS,
  newTicketId,
  readSeal,
  sealKey,
  sealed,
} from '../_handoff.js';
import { StoreError, putOnce, storeConfig } from '../_store.js';

/** Someone opening the URL in a browser gets a straight answer, not a 404. */
export async function GET(): Promise<Response> {
  return problem(405, 'This address takes POST requests only.');
}

export async function POST(req: Request): Promise<Response> {
  /* Weight first. A body that is not a seal is refused before it is parsed. */
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return problem(400, 'That request could not be read.');
  }
  if (raw.length > MAX_SEAL_BYTES) {
    return problem(413, 'That is more than can be saved at once. Nothing was kept.');
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return problem(400, 'That request could not be read.');
  }

  /* Shape. The seal is exactly what was ruled or it is refused, and the
     refusal names the field. */
  const reading = readSeal(body);
  if ('problem' in reading) {
    return problem(400, `That could not be saved: ${reading.problem}. Nothing was kept.`);
  }

  /* The store. On a laptop there is none, and the honest answer is that the
     door does not work here. On the platform its absence is a fault. */
  const store = storeConfig();
  if (!store) {
    if (process.env.VERCEL === '1') {
      console.error('handoff: the shared store is not configured, so nothing can be sealed');
      return problem(
        503,
        'Saving is not working right now. This is a problem on our side, not something you did. Nothing was kept.'
      );
    }
    return problem(
      503,
      'Saving only works on the live site, not on this test copy. Nothing was kept.'
    );
  }

  /* The cap, at the last moment before the write. */
  const decision = await countOneMessage(req, new Date(), HANDOFF);

  if (decision.kind === 'misconfigured') {
    console.error(`handoff: ${decision.missing} is not configured, so the daily cap cannot be enforced. Refusing to seal without it.`);
    return problem(
      503,
      'Saving is not working right now. The daily limit that keeps this site open to everyone is not running, and nothing is saved without it. This is a problem on our side, not something you did.'
    );
  }

  if (decision.kind === 'refused') {
    return problem(
      429,
      `You have reached today's limit of ${decision.cap} saves from this site. Your count resets at midnight UTC, ${timeUntilReset(decision.secondsToReset)}. Nothing you entered here is kept between visits in any case.`,
      { 'retry-after': String(decision.secondsToReset) }
    );
  }

  if (decision.kind === 'uncounted') {
    console.error(`handoff: this seal was not counted against any cap — ${decision.why}`);
  }

  const undelivered = async (response: Response): Promise<Response> => {
    if (decision.kind === 'allowed') await decision.refund();
    return response;
  };

  const now = new Date();
  const seal = JSON.stringify(sealed(reading.seal, now));

  /* Two tries at a fresh ticket. The second only ever runs if 192 random bits
     repeated, which they do not; it is here so the answer to "what if" is a
     line of code rather than a shrug. */
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const ticketId = newTicketId();
    let landed: boolean;
    try {
      landed = await putOnce(store, sealKey(ticketId), seal, TICKET_TTL_SECONDS);
    } catch (error) {
      const why = error instanceof StoreError ? error.message : String(error);
      console.error(`handoff: the seal could not be written — ${why}`);
      return undelivered(
        problem(503, 'Saving did not work just now. Nothing was kept. Trying again usually works.')
      );
    }
    if (landed) {
      return json(200, {
        ticketId,
        expiresAt: new Date(now.getTime() + TICKET_TTL_SECONDS * 1000).toISOString(),
        expiresInSeconds: TICKET_TTL_SECONDS,
      });
    }
  }

  console.error('handoff: two fresh tickets were both already taken, which should not be possible');
  return undelivered(problem(503, 'Saving did not work just now. Nothing was kept. Trying again usually works.'));
}

/* -------------------------------------------------------------------------
   Responses. Every failure says what happened, in words a visitor can read.
------------------------------------------------------------------------- */

function json(status: number, payload: unknown, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  });
}

function problem(status: number, message: string, headers?: Record<string, string>): Response {
  return json(status, { error: message }, headers);
}
