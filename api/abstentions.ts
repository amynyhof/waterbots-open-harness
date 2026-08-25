/**
 * Reading the abstention log.
 *
 * Item A1 in OPEN_ITEMS.md describes grading as something the maintainer does
 * again and again: read what Phoebe declined, decide whether each gap is a
 * legitimate limit or a card that should be written. A routine built on an
 * awkward tool is a routine that stops happening, so this is one address that
 * returns the list.
 *
 * IT IS GUARDED BY A SECRET, NOT BY BEING OBSCURE. The address is in a public
 * repository and always will be. What keeps it closed is PHOEBE_LOG_KEY, set in
 * the project's settings and supplied on the address:
 *
 *     https://map.waterbots.ai/api/abstentions?key=THE-SECRET
 *
 * The comparison is done in a way that takes the same time whether the first
 * character is wrong or the last one is, so the secret cannot be worked out a
 * character at a time by watching how long the answer takes.
 *
 * IT RETURNS DATA, NOT A PAGE, AND THAT IS DELIBERATE. Every question in this
 * list was typed by a member of the public. Rendering that as a web page would
 * mean rendering whatever they typed, which is a hole this repository does not
 * need. JSON has no such hole.
 */

import { timingSafeEqual } from 'node:crypto';
import { readAbstentions } from './_abstentions.js';
import { storeConfig } from './_store.js';

export async function GET(req: Request): Promise<Response> {
  const expected = process.env.PHOEBE_LOG_KEY;
  if (!expected) {
    console.error('phoebe: PHOEBE_LOG_KEY is not set, so the abstention log cannot be read');
    return problem(
      503,
      'The abstention log is not readable in this environment. PHOEBE_LOG_KEY has not been set.'
    );
  }

  const supplied = new URL(req.url).searchParams.get('key') ?? '';
  if (!matches(supplied, expected)) {
    return problem(401, 'That key is not right.');
  }

  const store = storeConfig();
  if (!store) {
    console.error('phoebe: the shared store is not set here, so there is no abstention log');
    return problem(503, 'The shared store is not configured in this environment.');
  }

  let report;
  try {
    report = await readAbstentions(store);
  } catch (error) {
    console.error(
      'phoebe: the abstention log could not be read —',
      error instanceof Error ? error.message : error
    );
    return problem(502, 'The abstention log could not be read from the store.');
  }

  return json(200, report);
}

/**
 * Compare two secrets without leaking where they first differ.
 *
 * A plain === returns the moment two characters disagree, so a wrong key that
 * shares its first ten characters is answered measurably later than one that
 * shares none. That is enough to work a secret out one character at a time.
 * Lengths are compared first because the constant-time comparison needs two
 * buffers of the same size, and length is not a secret worth protecting here.
 */
function matches(supplied: string, expected: string): boolean {
  const a = Buffer.from(supplied, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function json(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
      /* Nothing here should ever turn up in a search result. */
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

function problem(status: number, message: string): Response {
  return json(status, { error: message });
}
