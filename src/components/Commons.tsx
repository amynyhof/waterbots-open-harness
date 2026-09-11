/**
 * The Agent Commons page — the shelf, and a pack opened on its holder's
 * screen. Item S18: slice 2 built the address and the shelf on 11 Sep 2026,
 * and slice 3 opened one the same day.
 *
 * AN AGENT OPENS ALONE — maintainer's ruling, 11 Sep 2026, canon: *no crew
 * rail, no other agents beside it, no next steps. It is a contained unit —
 * open, chat, leave. The only other thing on the screen is the way out: back
 * to the shelf, and "Sign up to manage a project".* So the Commons has one
 * row under the top bar and nothing beside the centre. On the shelf the row
 * carries the sign-up door alone; on an open pack it carries the way back,
 * the pack's name once, and the door. ~~The crew stood in a right column~~ —
 * gone the same day: the shelf is the crew.
 *
 * THE SCREEN IS THE THIRD CONSUMER of the one agent screen (item S16), and
 * it differs from the console's only in memory and tool depth: no record is
 * carried, no "Next phase" is drawn, and the tool is the agent's own where it
 * stands alone — Phoebe's worksheet with rows of the Commons' own, Calvin's
 * calculator with answers of its own, and no map for Bridget, whose map is
 * the console's. Each seat holds its own conversation, its own rows, its own
 * answers, and nothing of the console's visit; the chats run on the same
 * relays under the same daily caps.
 *
 * A SEAT STAYS MOUNTED ONCE OPENED, hidden under `visibility` when the
 * visitor goes back to the shelf or opens another, for the reason every
 * screen in this shell stays mounted: stepping away and back must not empty
 * a conversation. Nothing is kept past the page.
 *
 * NO ADDRESS PER PACK in v0. Opening is state, not a path; a reload returns
 * to the shelf, which keeps nothing anyway. A path per pack is one line in
 * src/lib/pages.ts and one rewrite rule if the maintainer wants links to
 * packs.
 */

import { useState } from 'react';
import type { ShelfCard } from '../lib/commonsShelf';
import { COMMONS_LABEL } from '../lib/pages';
import { SITE_URL } from '../lib/site';
import { BridgetCommonsSeat, CalvinCommonsSeat, PhoebeCommonsSeat } from './CommonsSeats';
import CommonsShelf from './CommonsShelf';

/** The holders with a seat here. Wellington has no pack and no card. */
type Holder = 'Phoebe' | 'Calvin' | 'Bridget';

export default function Commons() {
  const [open, setOpen] = useState<ShelfCard | null>(null);
  /* Which seats have ever been opened this visit, so they stay mounted, and
     the last card each was opened on, so Calvin's calculator stays on the
     pack whose card was clicked. */
  const [seats, setSeats] = useState<Partial<Record<Holder, ShelfCard>>>({});

  const openCard = (card: ShelfCard) => {
    setOpen(card);
    setSeats((s) => ({ ...s, [card.holder.name as Holder]: card }));
  };
  const back = () => setOpen(null);

  const onShelf = open === null;
  const openHolder = open?.holder.name as Holder | undefined;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* THE ONE ROW: the way back and the pack's name when one is open, and
          the sign-up door always. Production's measure, as the journey bar's:
          8px of vertical padding on the frame with a hairline beneath. The
          door is the book's §7 primary, the one primary action on the page. */}
      <div
        className="chrome"
        style={{
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minHeight: 46,
          padding: '6px var(--gutter)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        {open && (
          <>
            <button type="button" className="wb-row-action" onClick={back} style={{ fontSize: 13 }}>
              <span aria-hidden>‹ </span>
              {COMMONS_LABEL}
            </button>
            <span aria-hidden style={{ color: 'var(--ink-4)', fontSize: 13 }}>
              /
            </span>
            <span style={{ fontSize: 13, color: 'var(--ink-2)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {open.holder.name}&rsquo;s knowledge pack · {open.title}
            </span>
          </>
        )}
        <a
          className="wb-save-button"
          href={SITE_URL}
          style={{ marginLeft: 'auto', textDecoration: 'none', flex: 'none' }}
        >
          Sign up to manage a project
        </a>
      </div>

      {/* THE PANES STACK; the one not in view inherits nothing and sets
          hidden, as everywhere in this shell. */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <Pane shown={onShelf}>
          <CommonsShelf onOpen={openCard} />
        </Pane>

        {seats.Phoebe && (
          <Pane shown={openHolder === 'Phoebe'}>
            <PhoebeCommonsSeat />
          </Pane>
        )}
        {seats.Calvin && (
          <Pane shown={openHolder === 'Calvin'}>
            <CalvinCommonsSeat packKey={seats.Calvin.packKey ?? null} />
          </Pane>
        )}
        {seats.Bridget && (
          <Pane shown={openHolder === 'Bridget'}>
            <BridgetCommonsSeat />
          </Pane>
        )}
      </div>
    </div>
  );
}

function Pane({ shown, children }: { shown: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        /* The shown pane INHERITS visibility; an explicit "visible" would
           override the shell's "hidden" on the Commons page itself. */
        visibility: shown ? undefined : 'hidden',
      }}
      aria-hidden={!shown}
    >
      {children}
    </div>
  );
}
