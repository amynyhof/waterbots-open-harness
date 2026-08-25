/**
 * The shared store.
 *
 * Two things outlive a single request and therefore cannot live inside the
 * function that serves it: how many messages a visitor has sent today, and the
 * list of questions Phoebe has declined. A serverless function keeps nothing
 * between calls — every request may land on a fresh copy — so both go here.
 *
 * NO NEW DEPENDENCY, ON PURPOSE. The store is a Redis database reached over
 * ordinary web requests, so this file is a few `fetch` calls and nothing else.
 * Vercel's own helper package for this has been retired once already in favour
 * of the provider's; talking to the documented web interface directly outlives
 * both, and it keeps a public repository's dependency list short.
 *
 * IT ACCEPTS EITHER SET OF SETTINGS. Depending on how the database was created,
 * the platform supplies its connection details under one of two pairs of names.
 * Both are read, so the code does not have to be edited to match whichever
 * appeared in the project's settings.
 *
 * EVERY CALL HAS A DEADLINE. This relay has hung in production twice before,
 * and both times the cause was something that waited forever rather than
 * something that failed. A store that stops answering must not become a chat
 * that stops answering, so every request here gives up after two seconds and
 * the caller decides what that means.
 */

/** Long enough for a healthy store, short enough that a sick one is not felt. */
const TIMEOUT_MS = 2000;

export interface StoreConfig {
  url: string;
  token: string;
  /** Which pair of settings was found. Logged, never shown to a visitor. */
  source: string;
}

/** Thrown when the store was asked something and did not answer properly. */
export class StoreError extends Error {}

/**
 * The store's connection details, or null if it has not been set up here.
 *
 * Null is not an error at this level. It is a fact, and what it means depends
 * on where the code is running: on a laptop it is ordinary, and in production
 * it means a public endpoint is running without the cap it is supposed to have.
 * The relay draws that distinction; this file only reports what it found.
 */
export function storeConfig(): StoreConfig | null {
  const pairs = [
    { url: 'KV_REST_API_URL', token: 'KV_REST_API_TOKEN' },
    { url: 'UPSTASH_REDIS_REST_URL', token: 'UPSTASH_REDIS_REST_TOKEN' },
  ];

  for (const pair of pairs) {
    const url = process.env[pair.url];
    const token = process.env[pair.token];
    if (url && token) {
      /* A trailing slash would produce a double slash in every path built from
         this, which some gateways answer and some refuse. */
      return { url: url.replace(/\/+$/, ''), token, source: pair.url };
    }
  }
  return null;
}

/**
 * Send one or more commands and return their results in order.
 *
 * The store answers a list of commands with a list of outcomes, each either a
 * result or an error. An error on any one of them fails the whole call: a
 * half-applied change is worse than a refused one, because the caller would
 * have no way to tell which half happened.
 */
async function run(config: StoreConfig, commands: (string | number)[][]): Promise<unknown[]> {
  let response: Response;
  try {
    response = await fetch(`${config.url}/pipeline`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${config.token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    /* A timeout arrives here as an abort. Named plainly so the server log says
       "the store did not answer in time" rather than showing a bare abort. */
    const reason =
      error instanceof DOMException && error.name === 'TimeoutError'
        ? `did not answer within ${TIMEOUT_MS}ms`
        : `could not be reached: ${error instanceof Error ? error.message : String(error)}`;
    throw new StoreError(`the store ${reason}`);
  }

  if (!response.ok) {
    throw new StoreError(`the store answered ${response.status}`);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new StoreError('the store answered something that was not readable');
  }

  if (!Array.isArray(payload) || payload.length !== commands.length) {
    throw new StoreError('the store answered a different number of results than commands sent');
  }

  return payload.map((entry, index) => {
    const item = entry as { result?: unknown; error?: unknown };
    if (item && typeof item.error === 'string') {
      throw new StoreError(`${commands[index][0]} was refused: ${item.error}`);
    }
    return item?.result;
  });
}

/**
 * Add one to this visitor's count for today, and return the new total.
 *
 * The expiry is set on every message, not only the first. That is deliberate
 * and it is safe: the moment it points at — the end of the day this key belongs
 * to — is the same every time, so repeating it cannot push the key's life
 * forward. It also means there is no need to ask the store whether an expiry is
 * already there, which would be a second round trip for nothing.
 */
export async function countMessage(
  config: StoreConfig,
  key: string,
  ttlSeconds: number
): Promise<number> {
  const [count] = await run(config, [
    ['INCR', key],
    ['EXPIRE', key, ttlSeconds],
  ]);
  if (typeof count !== 'number') {
    throw new StoreError('the store did not return a count');
  }
  return count;
}

/**
 * Take one back off this visitor's count.
 *
 * Used when a message was counted and then failed on our side. Nobody spends
 * one of their twenty on our fault.
 *
 * It can leave the count at minus one in one narrow case: if the day rolled
 * over between counting and refunding, the refund lands on a fresh key. That is
 * harmless — the key expires with the day, and a visitor is never refused for
 * having sent fewer messages than none.
 */
export async function refundMessage(config: StoreConfig, key: string): Promise<void> {
  await run(config, [['DECR', key]]);
}

/**
 * Add an entry to the front of a list and drop anything past the limit.
 *
 * The list is capped rather than allowed to grow, so the store cannot fill up
 * on its own and the oldest entries fall off the end as new ones arrive.
 */
export async function appendCapped(
  config: StoreConfig,
  key: string,
  entry: string,
  limit: number
): Promise<void> {
  await run(config, [
    ['LPUSH', key, entry],
    ['LTRIM', key, 0, limit - 1],
  ]);
}

/** Read a capped list back, newest first. */
export async function readList(
  config: StoreConfig,
  key: string,
  limit: number
): Promise<string[]> {
  const [items] = await run(config, [['LRANGE', key, 0, limit - 1]]);
  if (!Array.isArray(items)) {
    throw new StoreError('the store did not return a list');
  }
  return items.filter((item): item is string => typeof item === 'string');
}
