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
 * THE WORDMARK GOES TO waterbots.ai, the WaterBots home page, as the main
 * site's does. Open Source is this site's landing.
 *
 * DURING A SCREENING THE LINKS FOLD INTO ONE SMALL MENU BUTTON — the
 * maintainer's word of 21 Nov 2026. While the screening is in view (the
 * console), Consulting, Open Source and Agent Commons are not a row: one
 * "Menu" button beside the wordmark opens them in a small list. On the
 * Commons and the site's other pages the row is as before.
 *
 * SIGN IN AND ONE BUTTON — the same day. The button says "Sign up" until
 * something is on the record, then it is "Save and sign up"
 * (src/components/SaveDoor.tsx), on a laptop and on a phone. Under the top row,
 * when a path is ruled out, sits the box that sends the project to the team,
 * because it goes with Save.
 *
 * THIS SITE'S OWN TWO PAGES OPEN IN PLACE. Open Source and Agent Commons carry
 * their full addresses, so a copied link or a new tab is right, but a plain
 * click moves between the pages without a reload, so a visit in progress is
 * kept — the reason the console is hidden under the Commons, not unmounted.
 *
 * ON A PHONE the top row is the wordmark, the menu button during a screening,
 * Sign in and the one button, never wrapped onto a second line (base.css, at
 * the site's phone width, 900px); the links, off a screening, take the row
 * under it. Its height is told to the page as --menu-h, so a phone's screening
 * fills the screen below it.
 *
 * THE READOUT — the map's one line — rides at the left of Sign in on a laptop,
 * and on its own line under the top row on a phone, so the top row keeps its
 * words and place on every page.
 */

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import type { Page } from '../lib/pages';
import { MENU_HOME, MENU_LINKS, MENU_SIGN_IN, MENU_SIGN_UP, type MenuLink } from '../lib/site';
import { MenuSave, MenuSaveUnder, type SaveDoor } from './SaveDoor';

export default function SiteMenu({
  page,
  onPage,
  readout,
  buttonBlue = true,
  save,
  folded = false,
}: {
  page: Page;
  onPage: (page: Page) => void;
  readout?: ReactNode;
  /** One blue button at a time (src/lib/blue.ts): quiet when another is the next step. */
  buttonBlue?: boolean;
  /** The save door, on the console only. Once something is on the record the one button is Save. */
  save?: SaveDoor;
  /** During a screening: the links fold into one menu button. */
  folded?: boolean;
}) {
  const [listOpen, setListOpen] = useState(false);
  const open = (link: MenuLink) => (e: MouseEvent<HTMLAnchorElement>) => {
    setListOpen(false);
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

  /* The small list closes on a click anywhere else, on Escape, and when the links unfold. */
  const fold = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!listOpen) return;
    const away = (e: Event) => {
      if (fold.current && !fold.current.contains(e.target as Node)) setListOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setListOpen(false);
    };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('pointerdown', away);
      document.removeEventListener('keydown', key);
    };
  }, [listOpen]);
  useEffect(() => {
    if (!folded) setListOpen(false);
  }, [folded]);

  const links = MENU_LINKS.map((link) => (
    <a
      key={link.label}
      className="wb-site-menu-link"
      href={link.href}
      onClick={open(link)}
      aria-current={link.page === page ? 'page' : undefined}
    >
      {link.label}
    </a>
  ));

  const saving = save !== undefined && save.show;

  return (
    <header ref={header} className="chrome wb-site-menu">
      <div className="wb-site-menu-band">
        <a className="wordmark wb-site-menu-wordmark" href={MENU_HOME.href} title="WaterBots.AI — home">
          WaterBots<span className="dot-ai">.AI</span>
        </a>
        {folded ? (
          <div ref={fold} className="wb-site-menu-fold">
            <button
              type="button"
              className="wb-site-menu-fold-button"
              aria-expanded={listOpen}
              aria-controls="wb-site-menu-list"
              aria-label="Menu"
              onClick={() => setListOpen((v) => !v)}
            >
              <MenuIcon />
              {/* On the smallest phones the icon alone, so the top row fits (base.css). */}
              <span className="wb-site-menu-fold-word">Menu</span>
            </button>
            {listOpen && (
              <nav id="wb-site-menu-list" className="wb-site-menu-list" aria-label="WaterBots">
                {links}
              </nav>
            )}
          </div>
        ) : (
          <nav className="wb-site-menu-links" aria-label="WaterBots">
            {links}
          </nav>
        )}
        {readout && <span className="wb-site-menu-readout">{readout}</span>}
        <div className="wb-site-menu-end">
          <a className="wb-site-menu-link wb-site-menu-quiet" href={MENU_SIGN_IN.href}>
            {MENU_SIGN_IN.label}
          </a>
          {saving ? (
            <MenuSave save={save} blue={buttonBlue} />
          ) : (
            <a
              className={`wb-site-menu-link wb-site-menu-signup${buttonBlue ? '' : ' is-quiet'}`}
              href={MENU_SIGN_UP.href}
            >
              {MENU_SIGN_UP.label}
            </a>
          )}
        </div>
        {saving && <MenuSaveUnder save={save} />}
      </div>
    </header>
  );
}

/** Three short lines, the usual sign for a menu. Drawn in the text's own colour. */
function MenuIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden focusable="false">
      <path d="M2 3.5h10M2 7h10M2 10.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
