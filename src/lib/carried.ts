/**
 * A question carried in from the production landing — the receiver's half of
 * item S13, built 9 Sep 2026 by the maintainer's word. Optional does, name
 * and place joined it on 15 Sep 2026: the same arrival, written into the
 * visit as chat provenance, never into the address as a source tag.
 *
 * THE SHAPE. A visitor who types a question into the box on waterbots.ai is
 * sent to this site with the question in the address, the save door in
 * reverse. This site reads it, opens Dispatches, and hands it to Wellington as
 * the visitor's first turn, so his answer is the first thing they see. Optional
 * does, name and place ride beside it; they fill the visit card, and from
 * 16 Sep 2026 they reach Wellington on the first ask, so nobody is asked for
 * a field that already has a value. Nothing is retyped and nothing
 * is kept: the address is cleaned the moment the parameters are read, so a
 * reload or a shared link does not send them again.
 *
 * THE CONTRACT, in one line, for production's sender (same as Shell A):
 *
 *   https://map.waterbots.ai/?question=<≤500>[&does=<≤300>][&name=<≤80>][&place=<≤80>]
 *
 * Percent-encoded as UTF-8 the way encodeURIComponent does it. Caps are
 * counted after decoding. Omit empty keys. No kind. No provenance in the
 * URL — this site stamps chat. Caps are the sender's job; this site ignores
 * broken, over-long, or empty fields, never cuts them, and never shows an
 * error. Only the first of each key is read. Unknown keys are left in the
 * address.
 *
 * BAD OR EMPTY INPUT IS IGNORED, NO ERROR. A missing parameter, a blank, a
 * field over its cap, or one that did not decode cleanly is dropped and says
 * nothing about it. One bad field does not drop the others. A question a
 * visitor did not type here is never invented from a broken address; and a
 * page that scolds someone for a link they did not write helps nobody.
 * Maintainer's word, 9 Sep 2026; facts, 15 Sep 2026.
 *
 * THIS FILE HAS NO IMPORTS on purpose, so the gate can compile it on its own
 * the way it compiles src/lib/visit.ts.
 */

/** The parameter name production's sender writes for the first turn. */
export const CARRIED_PARAM = 'question';

/**
 * The most a carried question may hold, counted after decoding. A landing box
 * takes a sentence or two; Wellington's own ceiling is 4,000, and an address
 * that long is a link nobody can share. Five hundred leaves room for a real
 * question and refuses an essay.
 */
export const CARRIED_MAX_CHARS = 500;

/** Caps for the optional fact keys, counted after decoding. Sender-side. */
export const CARRIED_DOES_MAX_CHARS = 300;
export const CARRIED_NAME_MAX_CHARS = 80;
export const CARRIED_PLACE_MAX_CHARS = 80;

const CARRIED_FACT_MAX = {
  does: CARRIED_DOES_MAX_CHARS,
  name: CARRIED_NAME_MAX_CHARS,
  place: CARRIED_PLACE_MAX_CHARS,
} as const;

const CARRIED_KEYS = ['question', 'does', 'name', 'place'] as const;

/** Optional facts that fill the visit card. Never includes kind. */
export interface CarriedFacts {
  does?: string;
  name?: string;
  place?: string;
}

function parseSearch(search: string): URLSearchParams | null {
  try {
    const query = search.includes('?') ? search.slice(search.indexOf('?') + 1) : search;
    return new URLSearchParams(query.replace(/#.*$/, ''));
  } catch {
    return null;
  }
}

/**
 * One key, or nothing. A sequence that did not decode as UTF-8 comes back as
 * U+FFFD — that is a broken link, not a value, and it is ignored whole rather
 * than shown with holes in it. Over-long is ignored whole, never cut.
 */
function readCappedField(params: URLSearchParams, name: string, max: number): string | null {
  const raw = params.get(name);
  if (raw === null) return null;
  if (raw.includes('�')) return null;
  const value = raw.replace(/\s+/g, ' ').trim();
  if (value === '' || value.length > max) return null;
  return value;
}

/**
 * Read the carried question out of an address's query string, or say there is
 * none. Given `window.location.search`, or a whole address — both work.
 */
export function readCarriedQuestion(search: string): string | null {
  const params = parseSearch(search);
  if (!params) return null;
  return readCappedField(params, CARRIED_PARAM, CARRIED_MAX_CHARS);
}

/**
 * Read optional does, name and place. Missing, blank, over-long or unreadable
 * keys are omitted; a bad field does not drop the others. Kind is never read.
 */
export function readCarriedFacts(search: string): CarriedFacts {
  const params = parseSearch(search);
  if (!params) return {};
  const facts: CarriedFacts = {};
  const does = readCappedField(params, 'does', CARRIED_FACT_MAX.does);
  const name = readCappedField(params, 'name', CARRIED_FACT_MAX.name);
  const place = readCappedField(params, 'place', CARRIED_FACT_MAX.place);
  if (does) facts.does = does;
  if (name) facts.name = name;
  if (place) facts.place = place;
  return facts;
}

/**
 * The same address with the carried question and fact keys taken out of it —
 * what the browser's address bar is set to once they have been read, so
 * nothing of them stays in the address. Other parameters and the fragment
 * are kept, including kind if someone sent it.
 */
export function withoutCarried(href: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  let touched = false;
  for (const key of CARRIED_KEYS) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      touched = true;
    }
  }
  if (!touched) return href;
  return url.toString();
}
