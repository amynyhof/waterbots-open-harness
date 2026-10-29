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
 * ON A PHONE, THE LIVE PAGE'S THREE ROWS — the maintainer's word of 29 Oct
 * 2026, read from waterbots.ai at 375px and 414px that day: it has no
 * collapsed menu; the wordmark, then the three links, then Sign in at the
 * right, each on its own row. At 430px and narrower this menu takes the same
 * three rows (base.css). Its height is told to the page as --menu-h, so a
 * phone's screening fills the screen below it (src/lib/phone.ts).
 */

import { useLayoutEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import type { Page } from '../lib/pages';
import { MENU_HOME, MENU_LINKS, MENU_SIGN_IN, type MenuLink } from '../lib/site';

export default function SiteMenu({
  page,
  onPage,
  readout,
}: {
  page: Page;
  onPage: (page: Page) => void;
  readout?: ReactNode;
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
        <div className="wb-site-menu-end">
          {readout}
          <a className="wb-site-menu-link wb-site-menu-quiet" href={MENU_SIGN_IN.href}>
            {MENU_SIGN_IN.label}
          </a>
        </div>
      </div>
    </header>
  );
}
