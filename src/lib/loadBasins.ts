/**
 * Basin layer loading, with a module-level cache.
 *
 * WHY THIS IS NOT A ref FLAG IN THE COMPONENT.
 *
 * The previous version guarded "have I started a fetch?" with a useRef
 * boolean. React StrictMode mounts every effect twice in development — run,
 * clean up, run again — so the sequence was:
 *
 *   1st run   flag false -> set true, start fetch
 *   cleanup   cancelled = true
 *   2nd run   flag true  -> early return, no refetch
 *   fetch resolves -> cancelled, so the result was DISCARDED
 *
 * The layer loaded successfully and the state stayed 'loading' forever: a
 * silent failure, which is exactly what the honest-states rule forbids.
 *
 * Keying on "have I loaded THIS URL" instead of "did an effect ever start"
 * fixes it. A remount finds either the cached result or the in-flight promise
 * and attaches to it, so the result always lands — while the network request
 * still happens only once per URL, which is what the lazy detail layer needs.
 */

import type { BasinCollection } from './basins';

/**
 * A whole-operation timeout. Its job is to turn a request that never settles
 * into an honest error rather than an indefinite loading state.
 *
 * 60s is deliberately generous: the detail layer is 8.44 MB (1.84 MB gzipped),
 * and a slow connection should not be cut off mid-download. A connection that
 * has genuinely hung will still report rather than hang the page forever.
 */
export const LOAD_TIMEOUT_MS = 60_000;

const cache = new Map<string, BasinCollection>();
const inFlight = new Map<string, Promise<BasinCollection>>();

export function cached(url: string): BasinCollection | undefined {
  return cache.get(url);
}

async function fetchLayer(url: string, timeoutMs: number): Promise<BasinCollection> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`the server responded ${res.status}`);

    const data = (await res.json()) as BasinCollection;
    if (!data?.features?.length) throw new Error('the file contains no basins');
    return data;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(`it did not respond within ${Math.round(timeoutMs / 1000)} seconds`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Loads a layer once. Concurrent callers share one request; later callers get
 * the cached result. A failure is not cached, so a retry can genuinely retry.
 */
export function loadBasins(url: string, timeoutMs = LOAD_TIMEOUT_MS): Promise<BasinCollection> {
  const hit = cache.get(url);
  if (hit) return Promise.resolve(hit);

  const pending = inFlight.get(url);
  if (pending) return pending;

  const promise = fetchLayer(url, timeoutMs)
    .then((data) => {
      cache.set(url, data);
      inFlight.delete(url);
      return data;
    })
    .catch((err) => {
      inFlight.delete(url);
      throw err;
    });

  inFlight.set(url, promise);
  return promise;
}
