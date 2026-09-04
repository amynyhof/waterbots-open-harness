/**
 * Who a visitor is, for counting purposes and nothing else.
 *
 * WE DO NOT STORE ANYONE'S ADDRESS. The only thing a web request tells us about
 * the person sending it is the network address it arrived from. That address is
 * run through a one-way scrambler together with a secret word the server holds,
 * and only the scrambled result is written down. There is no way back from the
 * result to the address.
 *
 * THE SECRET WORD IS LOAD-BEARING. Scrambling an address on its own is not
 * privacy: there are only about four billion of them, and anyone holding the
 * list could scramble every one until the results matched. Mixing in a secret
 * only the server knows removes that. PHOEBE_VISITOR_SALT is that secret. It is
 * set once and never changed — changing it makes every visitor look new, which
 * resets everyone's daily count to zero.
 *
 * NOTHING ELSE ABOUT THE PERSON IS READ. Not the browser, not the country
 * header the platform offers, not the page they came from. The count is the
 * whole purpose and the address is the whole input.
 */

import { createHash } from 'node:crypto';

/**
 * Where the visitor's address comes from, in order of how much we trust it.
 *
 * `x-vercel-forwarded-for` is written by the platform itself and cannot be set
 * by the caller, so it is asked first. `x-forwarded-for` is also written by the
 * platform on Vercel, but it is the header a caller would try to forge if the
 * request ever arrived by some other route, so it is second. `x-real-ip` is the
 * last resort.
 *
 * IF THIS EVER RUNS BEHIND SOMETHING OTHER THAN VERCEL, revisit this list.
 * A forgeable address header means a visitor can hand themselves a fresh
 * identity on every message, and the cap stops meaning anything.
 */
const ADDRESS_HEADERS = ['x-vercel-forwarded-for', 'x-forwarded-for', 'x-real-ip'] as const;

/**
 * The address this request arrived from, or null if there is none to be had.
 *
 * A forwarded-for header can carry a chain of addresses — the visitor first,
 * then each hop that passed it along. The first entry is the visitor.
 *
 * Null is a real answer, not a failure: on a laptop there is no such header at
 * all. The caller decides what that means, and it means different things in
 * development and in production.
 */
export function clientAddress(headers: Headers): string | null {
  for (const name of ADDRESS_HEADERS) {
    const raw = headers.get(name);
    if (!raw) continue;
    const first = raw.split(',')[0]?.trim();
    if (first) return first;
  }
  return null;
}

/**
 * The scrambled identity we actually store.
 *
 * SHA-256 over the secret and the address together, cut to the first 32
 * characters. That is 128 bits, which is far more than enough to keep two
 * visitors apart — there is no realistic chance of two addresses landing on the
 * same one — and it keeps the stored keys short.
 *
 * The separator between the secret and the address matters: without it, a
 * secret ending in "1" followed by address "2.3.4.5" would scramble to the same
 * thing as a secret ending in "12" followed by ".3.4.5".
 */
export function visitorId(address: string, salt: string): string {
  return createHash('sha256').update(`${salt}\n${address}`).digest('hex').slice(0, 32);
}

/**
 * Which day it is, in UTC.
 *
 * The cap is twenty messages per calendar day, and the day is measured in UTC
 * rather than anywhere local. A fixed line is simpler than a rolling
 * twenty-four hours, and it lets the refusal message name the exact moment the
 * count comes back rather than saying "later".
 */
export function utcDayStamp(now: Date): string {
  return now.toISOString().slice(0, 10);
}

/**
 * Where one visitor's count for one day lives, for one agent.
 *
 * EACH AGENT COUNTS SEPARATELY, under its own name — Phoebe's twenty and
 * Wellington's thirty are two counters, not a pool. The agent's name is the
 * first segment so the store can be read by agent. Generalised 3 Sep 2026;
 * until then the key was Phoebe's by name, because she was the only agent
 * who answered.
 */
export function counterKey(agent: string, visitor: string, day: string): string {
  return `${agent}:count:${day}:${visitor}`;
}

/**
 * A small margin on top of the countdown to midnight.
 *
 * The counter is told to expire when its day ends. Without a margin, a key
 * written in the last second of the day could be swept away while that second
 * is still running. An hour is generous and costs nothing — the key is a single
 * number.
 */
const EXPIRY_MARGIN_SECONDS = 60 * 60;

/**
 * How long until the count comes back, in seconds.
 *
 * This is the true answer to "when do I get more messages", and it is what the
 * refusal message is worded from. Kept separate from the expiry below, which
 * carries a margin: telling a visitor their count returns an hour after it
 * actually does would be a small lie for the sake of a tidier sum.
 */
export function secondsUntilMidnight(now: Date): number {
  const nextMidnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0,
    0,
    0,
    0
  );
  return Math.ceil((nextMidnight - now.getTime()) / 1000);
}

/**
 * How long this day's counter should live, in seconds.
 *
 * Handed to the store on every message rather than only on the first. Setting
 * it repeatedly is harmless because it always points at the same moment — the
 * end of the day the key belongs to — so there is no drift and no need to ask
 * the store whether an expiry is already set.
 */
export function secondsUntilReset(now: Date): number {
  return secondsUntilMidnight(now) + EXPIRY_MARGIN_SECONDS;
}
