/**
 * Product-level copy and links.
 *
 * Kept apart from lib/licences.ts, which holds licence obligations that must
 * be reproduced verbatim. These are ours to word.
 */

/**
 * The roadmap statement, worded to match the README so the two cannot drift.
 *
 * A plain statement of intent with NO affordance attached — no button, no
 * form, no "notify me", no placeholder pin on the map. It says what is coming
 * and who will do it, and stops there.
 *
 * Nothing is placed on the map until it can be verified against its source
 * registry. An empty map is honest; an invented one is not.
 */
export const PROJECT_MAPPING_NOTE =
  'Coming: project mapping and impact quantification. Developers will place verified project ' +
  'locations and boundaries on this map, alongside estimated and verified impact figures logged ' +
  'per project — groundwork for consortium building and large-volume impact partnerships.';

/**
 * The production site this map is linked from.
 *
 * The reverse link — waterbots.ai pointing here — belongs to the marketing
 * site and is not this repository's to make. Logged, not built.
 */
export const SITE_URL = 'https://waterbots.ai';
export const SITE_LABEL = 'waterbots.ai';

/**
 * This site's own address, from 28 Oct 2026: open.waterbots.ai, the
 * maintainer's word. The old map.waterbots.ai forwards here; the forward is
 * set in Vercel by her hand, never from this repository.
 */
export const OPEN_SITE_URL = 'https://open.waterbots.ai';

/**
 * THE ONE MENU, the same as the main site's — maintainer's ruling, 28 Oct
 * 2026. Words and order are the live waterbots.ai menu's, read from the live
 * page only: the wordmark, Consulting, Open Source, Agent Commons, and Sign in
 * at the right. The main site's "Sign up" is a button with no address of its
 * own and is not in her list, so it is not drawn here. Links open in the same
 * tab with no arrows, so the two sites read as one.
 *
 * `page` marks the two links that are this site's own pages: the shell opens
 * them in place, so a visit is not lost, and the address stays the full one
 * for a copied link or a new tab.
 */
export interface MenuLink {
  label: string;
  href: string;
  page?: 'console' | 'commons';
}

export const MENU_HOME: MenuLink = { label: 'WaterBots.AI', href: SITE_URL };

export const MENU_LINKS: MenuLink[] = [
  { label: 'Consulting', href: 'https://www.waterbots.ai/services' },
  { label: 'Open Source', href: OPEN_SITE_URL, page: 'console' },
  { label: 'Agent Commons', href: `${OPEN_SITE_URL}/commons`, page: 'commons' },
];

export const MENU_SIGN_IN: MenuLink = { label: 'Sign in', href: 'https://www.waterbots.ai/login' };

/** Where "Build a module with us" on the Commons goes: the main site's Consulting page. */
export const CONSULTING_URL = MENU_LINKS[0].href;

/**
 * Where the bridge sends a visitor after sealing (item S7). Production's
 * address, carried by the maintainer's hand on 8 Sep 2026: the visitor goes
 * through sign-in first, and the ticket in the address survives it.
 */
export const HANDOFF_LANDING = 'https://www.waterbots.ai/welcome';
