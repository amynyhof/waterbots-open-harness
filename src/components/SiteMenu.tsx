/**
 * The site menu — the main site's menu, on every page of this site.
 * Maintainer's ruling, 28 Oct 2026: the same words, order and look as the
 * live waterbots.ai menu, read from the live page only, so the two sites feel
 * like one. The links live once, in src/lib/site.ts.
 *
 * THE LOOK IS THE LIVE PAGE'S, measured on 28 Oct 2026: one hairline row, a
 * centred band 1240px wide with 12px by 24px of padding, the wordmark as type
 * at 18px, then the links at 13px, weight 500, 20px apart, in ink, and Sign in
 * at the right in the second ink. No arrows and no new tabs.
 *
 * THE WORDMARK GOES TO waterbots.ai, as the main site's does. It no longer
 * starts a fresh visit here; Open Source is this site's landing.
 *
 * THIS SITE'S OWN TWO PAGES OPEN IN PLACE. Open Source and Agent Commons carry
 * their full addresses, so a copied link or a new tab is right, but a plain
 * click moves between the pages without a reload, so a visit in progress is
 * kept — the reason the console is hidden under the Commons, not unmounted.
 *
 * The map's one plain line rides at the right, before Sign in, on the map
 * only; it is the map's readout, not a menu item.
 *
 * ON A PHONE, TWO ROWS — the maintainer's word of 21 Nov 2026. The top row is
 * the wordmark with Sign in, Sign up and, once something is on the record,
 * "Save and sign up", never wrapped onto a second line; the three links take
 * the row under it. At 900px and narrower (the site's phone width,
 * src/lib/phone.ts), in base.css. Until that day a phone had the live page's
 * three rows, as read on 29 Oct 2026, and Save was a bar above the chat box.
 * Its height is told to the page as --menu-h, so a phone's screening fills the
 * screen below it.
 *
 * NO BUILD BANNER UNDER IT FROM 21 NOV 2026 — the maintainer's word. Its one
 * line (W28) is gone; a small "beta" sits beside
 * waterbots.ai at the foot of the left rail instead (NavRail.tsx).
 *
 * THE READOUT — the map's one line — rides at the left of Sign in on a laptop,
 * and on its own line under the links on a phone (base.css), so the top row
 * keeps its words and place on every page.
 */

import { useLayoutEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import type { Page } from '../lib/pages';
import { MENU_HOME, MENU_LINKS, MENU_SIGN_IN, MENU_SIGN_UP, type MenuLink } from '../lib/site';

export default function SiteMenu({
  page,
  onPage,
  readout,
  signupBlue = true,
  save,
  saveFailed,
}: {
  page: Page;
  onPage: (page: Page) => void;
  readout?: ReactNode;
  /** One blue button at a time (src/lib/blue.ts): quiet when another is the next step. */
  signupBlue?: boolean;
  /** On a phone, the one "Save and sign up", after Sign up in the top row (21 Nov 2026). */
  save?: ReactNode;
  /** What went wrong if saving failed, on its own line under the top row. */
  saveFailed?: ReactNode;
}) {
  const open = (link: MenuLink) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (!link.page) return;
    /* A modified or middle click keeps the browser's own behaviour. */
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onPage(link.page);
  };

  const header = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = header.current;
    if (!el) return;
    const tell = () => document.documentElement.style.setProperty('--menu-h', `${el.offsetHeight}px`);
    tell();
    const ro = new ResizeObserver(tell);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <header ref={header} className="chrome wb-site-menu">
      <div className="wb-site-menu-band">
        <a className="wordmark wb-site-menu-wordmark" href={MENU_HOME.href} title="WaterBots.AI — home">
          WaterBots<span className="dot-ai">.AI</span>
        </a>
        <nav className="wb-site-menu-links" aria-label="WaterBots">
          {MENU_LINKS.map((link) => (
            <a
              key={link.label}
              className="wb-site-menu-link"
              href={link.href}
              onClick={open(link)}
              aria-current={link.page === page ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        {readout && <span className="wb-site-menu-readout">{readout}</span>}
        <div className="wb-site-menu-end">
          <a className="wb-site-menu-link wb-site-menu-quiet" href={MENU_SIGN_IN.href}>
            {MENU_SIGN_IN.label}
          </a>
          <a
            className={`wb-site-menu-link wb-site-menu-signup${signupBlue ? '' : ' is-quiet'}`}
            href={MENU_SIGN_UP.href}
          >
            {MENU_SIGN_UP.label}
          </a>
          {save}
        </div>
        {saveFailed}
      </div>
    </header>
  );
}
