/**
 * THE DESK'S TABS, INSIDE THE ONE MENU UNDER 1280 PIXELS (the shared console page, rule 26, 28 Nov 2026).
 *
 * Below 1280 pixels the desk's own row of tabs is not drawn (base.css), so the chat and the tool get the screen. This
 * part of the menu lists the tabs of the desk in view, read from that desk's own tab buttons when the menu opens, and
 * a tap here presses that desk's own button: each desk keeps its own tab, as it always has, and nothing here holds a
 * copy of it.
 */

import { useEffect, useState } from 'react';

interface DeskTab {
  label: string;
  selected: boolean;
  press: () => void;
}

/** The desk in view's tabs: the tab list whose desk is not hidden. */
function deskTabs(): DeskTab[] {
  const lists = [...document.querySelectorAll<HTMLElement>('.wb-page-console [role="tablist"]')].filter(
    (list) => list.parentElement !== null && getComputedStyle(list.parentElement).visibility === 'visible'
  );
  const list = lists[0];
  if (!list) return [];
  return [...list.querySelectorAll<HTMLButtonElement>('[role="tab"]')].map((tab) => ({
    label: tab.textContent?.trim() ?? '',
    selected: tab.getAttribute('aria-selected') === 'true',
    press: () => tab.click(),
  }));
}

export default function MenuTabs({ onPick }: { onPick: () => void }) {
  const [tabs, setTabs] = useState<DeskTab[]>([]);
  useEffect(() => setTabs(deskTabs()), []);
  if (tabs.length < 2) return null;
  return (
    <section className="wb-console-menu-part" aria-label="This desk">
      <div className="eyebrow">This desk</div>
      <div className="wb-menu-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={tab.selected ? 'wb-menu-tab is-selected' : 'wb-menu-tab'}
            aria-pressed={tab.selected}
            onClick={() => {
              tab.press();
              onPick();
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </section>
  );
}
