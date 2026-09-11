/**
 * The agent screen — built once, used everywhere. Item S16.
 *
 * ONE SCREEN PER AGENT: the agent's chat in the middle, and tabs above it —
 * Chat, always; Tool, only when the agent has one (Phoebe's criteria,
 * Bridget's map, Calvin's calculator); Knowledge pack, the cards, versions
 * and sources it works from; Credentials, its exam and scores and nothing
 * else. Maintainer's brief of 8 Sep 2026, amended the same day to four tabs.
 * Memory is never a tab — it stays in the record on the left rail.
 *
 * THREE CONSUMERS, ONE SCREEN. The Agent Commons, this open site and
 * production differ only in memory and in how deep the tool goes; nothing in
 * here knows which one is hosting it. What differs arrives through the props:
 * the tabs' bodies and the next step. This site passes no memory and one
 * visit's record, elsewhere.
 *
 * THE TABS WEAR THE AGENT'S COLOUR — maintainer's ruling 3 of 9 Sep 2026: the
 * row sits on a light tint of the agent's accent, the active tab is a step
 * darker, bold, and underlined in that accent, and the active crew card on
 * the right takes the same underline. That is how a visitor sees the tabs
 * belong to that agent. The accent is read from the host's token, never
 * re-typed (BRAND.md §6), and it is an identity here — a tint and a keyline,
 * never a status dot (§2.6).
 *
 * "NEXT PHASE" ON EVERY STEP, at the right end of the tab row, the four calls
 * of slice 1 approved on 9 Sep 2026. The screen does not know the journey; the
 * consumer hands it the label and the move, or null on the last step, where
 * the save button is the way on.
 *
 * WHERE THE CHAT IS NOT LIVE, the Tool tab opens first (`opensOn`), and the
 * one plain line saying the agent is not answering yet belongs on the Chat
 * tab, not on Tool — ruling 1 of 9 Sep 2026. Tool is just the tool.
 *
 * EVERY PANEL STAYS MOUNTED. A tab you are not on is display:none, not
 * unmounted, for the same reason the desk and the map stay mounted in the
 * shell: the map must not be rebuilt on a tab switch and a transcript's
 * scroll must not be lost. The conversation itself is the shell's, never the
 * screen's — one conversation per agent, held above this component.
 */

import { useState, type CSSProperties, type ReactNode } from 'react';
import type { AgentHost } from '../chat/evidence';

export type ScreenTab = 'chat' | 'tool' | 'pack' | 'credentials';

/** What each tab shows. `tool` is left out when the agent has no tool. */
export interface ScreenTabs {
  chat: ReactNode;
  tool?: ReactNode;
  pack: ReactNode;
  credentials: ReactNode;
}

/** The step after this one, in the journey's own words; null on the last. */
export interface NextPhase {
  label: string;
  go: () => void;
}

const LABELS: Record<ScreenTab, string> = {
  chat: 'Chat',
  tool: 'Tool',
  pack: 'Knowledge pack',
  credentials: 'Credentials',
};

export default function AgentScreen({
  host,
  tabs,
  opensOn = 'chat',
  idSlug,
  next,
}: {
  host: AgentHost;
  tabs: ScreenTabs;
  /** The tab shown first. Chat, unless the chat is not live. */
  opensOn?: ScreenTab;
  next: NextPhase | null;
  /**
   * What the tab and panel ids are built from. Defaults to the host's name;
   * a second consumer of the same agent on one page — the Agent Commons
   * beside the console, from 11 Sep 2026 — passes its own, because two
   * mounted screens sharing ids broke the tabs' labelling. Found in slice
   * 3's browser walk.
   */
  idSlug?: string;
}) {
  const [active, setActive] = useState<ScreenTab>(opensOn);
  const order: ScreenTab[] =
    tabs.tool !== undefined ? ['chat', 'tool', 'pack', 'credentials'] : ['chat', 'pack', 'credentials'];
  const slug = idSlug ?? host.name.toLowerCase();

  /* The accent reaches the stylesheet as one custom property, set here from
     the host's token. The tab row, the active tab and the underline all read
     it; nothing below this line names a colour. */
  const accent = { '--screen-accent': `var(${host.colourToken})` } as CSSProperties;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div role="tablist" aria-label={`${host.name}'s screen`} className="wb-tabs" style={accent}>
        {order.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            id={`wb-tab-${slug}-${tab}`}
            aria-selected={tab === active}
            aria-controls={`wb-panel-${slug}-${tab}`}
            className={tab === active ? 'wb-tab is-active' : 'wb-tab'}
            onClick={() => setActive(tab)}
          >
            {LABELS[tab]}
          </button>
        ))}

        {next && (
          <button type="button" className="wb-next-phase" onClick={next.go}>
            Next phase: {next.label}
          </button>
        )}
      </div>

      {/* THE PANELS STACK, and the one you are not on is hidden, not
          unmounted and not display:none — slice 4, 9 Sep 2026, when the map
          became a Tool tab. A map inside display:none has no size, and
          Leaflet draws nothing until told to measure again; kept at full size
          under visibility:hidden it stays drawn and its tiles stay loaded. The
          same treatment the shell gives its surfaces, for the same reason.
          visibility:hidden also takes a hidden panel out of the tab order, so
          nobody can type into a composer they cannot see. */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {order.map((tab) => (
          <div
            key={tab}
            role="tabpanel"
            id={`wb-panel-${slug}-${tab}`}
            aria-labelledby={`wb-tab-${slug}-${tab}`}
            aria-hidden={tab !== active}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              /* The active panel INHERITS visibility rather than setting it:
                 an explicit "visible" would override the shell's "hidden" on
                 the screen's own wrapper, and a hidden screen's map would show
                 through another screen. Found in the first capture of slice 4. */
              visibility: tab === active ? undefined : 'hidden',
            }}
          >
            {tabs[tab]}
          </div>
        ))}
      </div>
    </div>
  );
}
