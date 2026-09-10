/**
 * The site's two pages, and the address each one answers to.
 *
 * THE CONSOLE AT "/", THE AGENT COMMONS AT "/commons". Item S18, slice 2,
 * approved 9 Sep 2026: the Commons lives at its own address, opened by one
 * word at the right of the top bar and never on the journey bar, which stays
 * the journey. This module is the one home for that address; the shell reads
 * it on arrival and writes it when the visitor moves, and vercel.json's one
 * rewrite rule sends the address to the same page the console loads from.
 *
 * NOTHING HERE IS A ROUTER. Two pages, one path each, read once on arrival
 * and kept in step with the browser's back button by the shell. A path that
 * is neither is the console, because a wrong address should open the site,
 * not a blank page.
 *
 * A PAGE IS NOT A SURFACE. The console's four surfaces (src/lib/surfaces.ts)
 * live inside the console page and are chosen by the journey bar; the Commons
 * has no journey bar and no surfaces. Stepping to the Commons hides the
 * console rather than unmounting it, for the same reason the surfaces hide
 * one another — a conversation, a drawn map and a chosen tab all survive the
 * step away and back.
 */

export type Page = 'console' | 'commons';

/** The Commons' address, without a host. */
export const COMMONS_PATH = '/commons';

/** The one word that opens the Commons, at the right of the top bar. */
export const COMMONS_LABEL = 'Agent Commons';

/**
 * Which page a path opens. A trailing slash is tolerated because a typed
 * address often carries one; anything else is the console.
 */
export function pageFromPath(pathname: string): Page {
  return pathname === COMMONS_PATH || pathname === `${COMMONS_PATH}/` ? 'commons' : 'console';
}

/** The path the shell writes into the address when a visitor moves. */
export function pathForPage(page: Page): string {
  return page === 'commons' ? COMMONS_PATH : '/';
}
