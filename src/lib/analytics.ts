/**
 * Vercel Web Analytics — the maintainer's word of 21 Nov 2026. Cookie-free page views only: no
 * cookies, nothing kept in the browser, no custom events, and no other tracking on this site.
 *
 * ONLY THE PAGE'S PATH IS SENT. Two of this site's addresses carry a visitor's own words or a secret:
 * the handoff receiver's `?question=` (with `does`, `name` and `place`), and a supporter's private
 * edit link, `#edit=<id>.<key>`. So every page view is cut to the site and the path before it goes,
 * and the query and the part after the # never leave the page.
 */

import type { BeforeSendEvent } from '@vercel/analytics/react';

/** The address with its query and its # part removed: the site and the path alone. */
export function pageOnly(url: string): string {
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname}`;
  } catch {
    /* Not an address we can read: send no more than what comes before any ? or #. */
    return url.split(/[?#]/)[0];
  }
}

/** Every event the analytics sends passes here first. */
export function beforeSend(event: BeforeSendEvent): BeforeSendEvent {
  return { ...event, url: pageOnly(event.url) };
}
