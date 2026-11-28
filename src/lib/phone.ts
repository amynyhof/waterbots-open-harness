/**
 * The phone layout's three facts — the maintainer's word of 29 Oct 2026, from
 * the mobile check of the same day. From family 4 (27 Nov 2026) the phone
 * layout is under 600px; from 600 to 1279 the crew is a drawer.
 *
 * 1. WHETHER THIS IS A PHONE. One media query, read by the shell to turn the left rail and the
 *    crew into panels that slide over the page.
 * 2. THE SCREEN'S REAL HEIGHT, as --app-h. The visual viewport is what is
 *    left above an open keyboard; a chat sized to it keeps its box in view.
 *    The stylesheet falls back to 100dvh where the browser has none.
 * 3. WHETHER A BOX IS BEING TYPED IN, as the class wb-typing on <html>. On a
 *    phone the menu steps aside while it is, so the chat has the room.
 *
 * The stylesheet reads 2 and 3 only inside its phone rules (base.css, "The
 * phone layout").
 */

import { useEffect, useState } from 'react';

/* FAMILY 4, RULE 19 (the walk of 27 Nov 2026): the phone layout is under 600 pixels (it was 900). From 600 to 1279 the
   crew is a drawer and the left rail a slim strip (NARROW_QUERY); from 1280, three columns. */
export const PHONE_QUERY = '(max-width: 599px)';
export const NARROW_QUERY = '(max-width: 1279px)';

/** Under 1280 pixels: the crew is a drawer (rule 19). True on a phone too. */
export function useNarrow(): boolean {
  return useQuery(NARROW_QUERY);
}

export function usePhone(): boolean {
  return useQuery(PHONE_QUERY);
}

function useQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    onChange();
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** A field that raises the keyboard: a text box, never a checkbox or a button. */
function typesText(el: EventTarget | null): boolean {
  if (el instanceof HTMLTextAreaElement) return true;
  if (!(el instanceof HTMLInputElement)) return false;
  return !['checkbox', 'radio', 'button', 'submit', 'reset', 'range', 'color', 'file'].includes(el.type);
}

/** Called once, at start-up. */
export function watchViewport(): void {
  const root = document.documentElement;
  const view = window.visualViewport;
  const setHeight = () => root.style.setProperty('--app-h', `${Math.round(view?.height ?? window.innerHeight)}px`);
  setHeight();
  (view ?? window).addEventListener('resize', setHeight);

  document.addEventListener('focusin', (e) => {
    if (typesText(e.target)) root.classList.add('wb-typing');
  });
  document.addEventListener('focusout', (e) => {
    if (typesText(e.target) && !typesText(e.relatedTarget)) root.classList.remove('wb-typing');
  });
}
