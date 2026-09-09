/**
 * A question carried in from the production landing — the receiver's half of
 * item S13, built 9 Sep 2026 by the maintainer's word.
 *
 * THE SHAPE. A visitor who types a question into the box on waterbots.ai is
 * sent to this site with the question in the address, the save door in
 * reverse. This site reads it, opens Dispatches, and hands it to Wellington as
 * the visitor's first turn, so his answer is the first thing they see. Nothing
 * is retyped and nothing is kept: the address is cleaned the moment the
 * question is read, so a reload or a shared link does not send it again.
 *
 * THE CONTRACT, in one line, for production's sender:
 *
 *   https://map.waterbots.ai/?question=<the question, percent-encoded as
 *   UTF-8 the way encodeURIComponent does it, at most 500 characters once
 *   decoded>
 *
 * Only the first question= in the address is read. Anything else in the
 * address is left alone.
 *
 * BAD OR EMPTY INPUT IS IGNORED, NO ERROR. A missing parameter, a blank, a
 * question over the cap, or one that did not decode cleanly opens the page as
 * it always opens — honestly empty, with the composer waiting — and says
 * nothing about it. A question a visitor did not type here is never invented
 * from a broken address; and a page that scolds someone for a link they did
 * not write helps nobody. Maintainer's word, 9 Sep 2026.
 *
 * THIS FILE HAS NO IMPORTS on purpose, so the gate can compile it on its own
 * the way it compiles src/lib/visit.ts.
 */

/** The parameter name production's sender writes. */
export const CARRIED_PARAM = 'question';

/**
 * The most a carried question may hold, counted after decoding. A landing box
 * takes a sentence or two; Wellington's own ceiling is 4,000, and an address
 * that long is a link nobody can share. Five hundred leaves room for a real
 * question and refuses an essay.
 */
export const CARRIED_MAX_CHARS = 500;

/**
 * Read the carried question out of an address's query string, or say there is
 * none. Given `window.location.search`, or a whole address — both work.
 */
export function readCarriedQuestion(search: string): string | null {
  let params: URLSearchParams;
  try {
    const query = search.includes('?') ? search.slice(search.indexOf('?') + 1) : search;
    params = new URLSearchParams(query.replace(/#.*$/, ''));
  } catch {
    return null;
  }
  const raw = params.get(CARRIED_PARAM);
  if (raw === null) return null;

  /* A sequence that did not decode as UTF-8 comes back as U+FFFD. That is a
     broken link, not a question, and it is ignored whole rather than shown
     with holes in it. */
  if (raw.includes('�')) return null;

  const question = raw.replace(/\s+/g, ' ').trim();
  if (question === '' || question.length > CARRIED_MAX_CHARS) return null;
  return question;
}

/**
 * The same address with the carried question taken out of it — what the
 * browser's address bar is set to once the question has been read, so nothing
 * of it stays in the address. Other parameters and the fragment are kept.
 */
export function withoutCarried(href: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (!url.searchParams.has(CARRIED_PARAM)) return href;
  url.searchParams.delete(CARRIED_PARAM);
  return url.toString();
}
