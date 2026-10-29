/**
 * The Agent Commons page — the shelf, and a pack opened on its holder's
 * screen. Item S18: slice 2 built the address and the shelf on 11 Sep 2026,
 * and slice 3 opened one the same day.
 *
 * AN AGENT OPENS ALONE — maintainer's ruling, 11 Sep 2026, canon: *no crew
 * rail, no other agents beside it, no next steps. It is a contained unit —
 * open, chat, leave. The only other thing on the screen is the way out: back
 * to the shelf, and "Sign up to manage a project".* So the Commons has one
 * row under the top bar and nothing beside the centre. ~~On the shelf the row
 * carries the sign-up door alone; on an open pack it carries the way back,
 * the pack's name once, and the door.~~ From 28 Oct 2026, the maintainer's
 * word, the grey bar with the sign-up door is gone: the site menu's Sign in
 * is the way to the main site. The shelf has no row of its own; an open pack
 * keeps one, with the way back and the pack's name once. ~~The crew stood in a right column~~ —
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
 * ~~NO ADDRESS PER PACK in v0. Opening is state, not a path; a reload returns
 * to the shelf, which keeps nothing anyway.~~ A MODULE HAS ITS OWN ADDRESS from
 * 28 Oct 2026, the maintainer's word: /commons/<slug>, read and written through
 * src/lib/pages.ts, with one rewrite rule in vercel.json. A reload on a
 * module's address opens that module, fresh; nothing is kept.
 */

import { useEffect, useState } from 'react';
import { SHELF, type ShelfCard } from '../lib/commonsShelf';
import { COMMONS_LABEL, COMMONS_PATH, moduleFromPath, pageFromPath, pathForModule } from '../lib/pages';
import { BridgetCommonsSeat, CalvinCommonsSeat, PhoebeCommonsSeat } from './CommonsSeats';
import { partnerMailto } from '../lib/site';
import CommonsShelf, { Method, Rating, Stage } from './CommonsShelf';

/** The holders with a seat here. Wellington has no pack and no card. */
type Holder = 'Phoebe' | 'Calvin' | 'Bridget';

export default function Commons({
  path,
  navigate,
}: {
  /** The address, held by the shell; a module's own is /commons/<slug>. */
  path: string;
  navigate: (path: string, options?: { replace?: boolean }) => void;
}) {
  /* THE OPEN MODULE IS THE ADDRESS — the maintainer's word of 28 Oct 2026.
     Opening one writes /commons/<slug>; the list, the breadcrumb and the
     menu's "Agent Commons" write /commons; the back button and a shared link
     are read the same way. Only a module that opens answers to its slug. */
  const slug = moduleFromPath(path);
  const open = slug === null ? null : (SHELF.find((c) => c.opens && c.slug === slug) ?? null);
  /* An address no open module answers to opens the list, and the address
     says so: /commons/bridget, /commons/anything/else, /commons/ all become
     /commons. */
  useEffect(() => {
    if (pageFromPath(path) === 'commons' && open === null && path !== COMMONS_PATH) {
      navigate(COMMONS_PATH, { replace: true });
    }
  }, [path, slug, open, navigate]);

  /* Which seats have ever been opened this visit, so they stay mounted, and
     the last card each was opened on, so Calvin's calculator stays on the
     pack whose card was clicked. */
  const [seats, setSeats] = useState<Partial<Record<Holder, ShelfCard>>>({});
  useEffect(() => {
    if (open) setSeats((s) => (s[open.holder.name as Holder] === open ? s : { ...s, [open.holder.name as Holder]: open }));
  }, [open]);

  const openCard = (card: ShelfCard) => navigate(pathForModule(card.slug));
  const back = () => navigate(COMMONS_PATH);

  const onShelf = open === null;
  const openHolder = open?.holder.name as Holder | undefined;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* THE ONE ROW, on an open pack only: the way back and the pack's name.
          Production's measure, as the journey bar's: 8px of vertical padding
          on the frame with a hairline beneath. */}
      {open && (
        <div className="chrome" style={{ flex: 'none', borderBottom: '1px solid var(--line)' }}>
          {/* The breadcrumb sits in the menu's own column, 1240px and 24px
              each side, so it lines up with the tabs and chat below. */}
          <div
            style={{
              maxWidth: 1240,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              minHeight: 46,
              padding: '6px 24px',
            }}
          >
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
          </div>
        </div>
      )}

      {/* THE PANES STACK; the one not in view inherits nothing and sets
          hidden, as everywhere in this shell. */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <Pane shown={onShelf}>
          <CommonsShelf onOpen={openCard} />
        </Pane>

        {/* THE MODULE PAGE — the maintainer's word of 28 Oct 2026: the tabs
            and chat in the menu's centred column, and "About this module"
            beside them; on a phone the panel moves below the chat. */}
        <div
          className="wb-module-page"
          style={{ visibility: onShelf ? 'hidden' : undefined }}
          aria-hidden={onShelf}
        >
          <div className="wb-module-page-main">
            {seats.Phoebe && (
              <Pane shown={openHolder === 'Phoebe'}>
                <PhoebeCommonsSeat onBack={back} />
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
          {open && <AboutModule card={open} />}
        </div>
      </div>
    </div>
  );
}

const ABOUT_LABEL = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10.5,
  letterSpacing: '0.13em',
  textTransform: 'uppercase',
  color: 'var(--ink-3)',
  margin: '0 0 3px',
} as const;

/* ABOUT THIS MODULE — method, owner, stage and the community rating, as the
   module's row on the list shows them; "Work with us" only where the module
   seeks a partner, opening an email with its name in the subject. */
function AboutModule({ card }: { card: ShelfCard }) {
  const seeking = card.stage === 'Seeking partners';
  const facts: { label: string; value: React.ReactNode }[] = [
    { label: 'Method', value: <Method text={card.tag} href={card.tagHref} /> },
    { label: 'Owner', value: card.owner },
    { label: 'Stage', value: <Stage stage={card.stage} beta={card.beta} /> },
    { label: 'Community rating', value: <Rating /> },
  ];
  return (
    <aside className="wb-module-about" aria-labelledby="wb-module-about-title">
      <h2 id="wb-module-about-title" style={{ fontSize: 15, margin: '0 0 12px', lineHeight: 1.3 }}>
        About this module
      </h2>
      <dl style={{ margin: 0, display: 'grid', gap: 12 }}>
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt style={ABOUT_LABEL}>{fact.label}</dt>
            <dd style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: 'var(--ink-2)' }}>{fact.value}</dd>
          </div>
        ))}
      </dl>
      {seeking && (
        <a
          className="btn"
          href={partnerMailto(card.title)}
          style={{ display: 'inline-block', marginTop: 16, textDecoration: 'none' }}
        >
          Work with us
        </a>
      )}
    </aside>
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
