/**
 * The free desk — Wellington's dispatch desk on the open site.
 *
 * THE DESK IS THE FIRST AGENT SCREEN — item S16, slice 2, 9 Sep 2026. The
 * screen (src/screen/AgentScreen.tsx) is built once and the desk is its first
 * consumer: Wellington's chat in bubbles on the Chat tab, his Knowledge pack
 * and Credentials tabs beside it, and "Next phase: Eligibility" at the right
 * end of the row. He has no tool, so there is no Tool tab. The look follows
 * the pictures of 8 Sep 2026 (#61), approved on pixels with three rulings.
 *
 * THE CENTRE IS THE CONVERSATION AND NOTHING ELSE — maintainer's ruling 3 of
 * 4 Sep 2026, from the reference she brought in by hand: chat dominates the
 * page, no other noise. The host's header, his turns, the one composer. The
 * project context left the centre for the rail, where it is the record his
 * interview populates; the dispatch rows left for the crew column, where each
 * seat holds its own. Item S11's second pass. ~~The desk divider~~ went with
 * the tab row, which now says whose screen this is.
 *
 * WELLINGTON IS LIVE HERE — a real agent on real machinery, on Phoebe's
 * proven pattern. The composer is the one composer per screen (BRAND.md §6),
 * and it is the same machine the docks use (src/chat/useConversation.ts) in a
 * different frame. There are NO scripted messages and no fake typing. The
 * reference's auto-typed script and its fake indicator were its own, and none
 * of it is here.
 *
 * HE ASKS THE PROJECT QUESTIONS HIMSELF, in the order the seats need them:
 * what it does, where, what it is called, what kind. His answers come back as
 * a field and write into the visit under one rule — a typed entry is never
 * overwritten, and the rail says where each field came from.
 *
 * THE LOOK is the production desk's, from the saved page the maintainer
 * brought in on 2 Sep 2026 — its header and its composer — and the brand book
 * governs every pixel.
 *
 * THE COMPOSER IS PRODUCTION'S TO THE PIXEL — maintainer's eyeball ruling 2a,
 * 7 Sep 2026: one line tall, 13px on 1.5, 8px by 12px inside, on the card
 * plane with the hairline and the medium radius; the Send button 13px medium
 * on Tide, faded to 45% while it cannot send; the pair 816px wide, which is
 * production's desk column, so the transcript box above takes the same width.
 * Read from the saved markup, not guessed.
 *
 * THE TWO QUIET TABS SAY WHAT IS TRUE. Wellington carries no Knowledge Pack —
 * he works from the crew's roster and this visit's record — and he has sat no
 * exam. Each tab says so in a sentence rather than showing an empty frame or
 * inventing a card. No mock data, ever.
 */

import { useEffect, useRef, type ReactNode } from 'react';
import wellingtonPortrait from '../../brand/assets/bots/wellington.svg';
import Transcript from '../chat/Transcript';
import type { AgentHost } from '../chat/evidence';
import type { Conversation } from '../chat/useConversation';
import { nextPhaseAfter } from '../lib/journey';
import type { Surface } from '../lib/surfaces';
import { WELLINGTON } from '../lib/wellington';
import AgentScreen from '../screen/AgentScreen';

/** Production's desk column, read from the saved page: 816px. */
const DESK_COLUMN = 816;

export default function Desk({
  chat,
  onNavigate,
}: {
  chat: Conversation;
  onNavigate: (surface: Surface) => void;
}) {
  const next = nextPhaseAfter('desk');
  const nextSurface = next?.surface ?? null;

  return (
    <AgentScreen
      host={WELLINGTON}
      next={next && nextSurface ? { label: next.label, go: () => onNavigate(nextSurface) } : null}
      tabs={{
        chat: <DeskChat chat={chat} />,
        pack: (
          <QuietTab heading={`${WELLINGTON.name}'s Knowledge Pack`}>
            {WELLINGTON.name} carries no Knowledge Pack. He works from what the crew can do and
            from what you tell him in this visit, and he points you to the right step. Phoebe's
            pack, the eligibility and feasibility cards, is on the Eligibility step.
          </QuietTab>
        ),
        credentials: (
          <QuietTab heading={`${WELLINGTON.name}'s credentials`} chip="no exam sat yet">
            {WELLINGTON.name} has not sat an exam. A score shows here only after one has been
            graded, and until then this page says so rather than guess.
          </QuietTab>
        ),
      }}
    />
  );
}

/* --------------------------------------------------------------------------
   The Chat tab — the host's header, his turns in bubbles, the one composer.
   -------------------------------------------------------------------------- */

function DeskChat({ chat }: { chat: Conversation }) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chat.turns.length > 0 || chat.pending || chat.error) {
      scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chat.turns, chat.pending, chat.error]);

  return (
    <>
      <div ref={scroller} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {/* PRODUCTION'S DESK COLUMN — 816px, the composer's width, so the
            transcript and the composer share one edge. The worksheets keep
            their 880. */}
        <div style={{ maxWidth: DESK_COLUMN, margin: '0 auto', padding: '22px var(--gutter) 24px' }}>
          <HostHeader host={WELLINGTON} />
          <Transcript
            host={WELLINGTON}
            turns={chat.turns}
            pending={chat.pending}
            error={chat.error}
            look="bubbles"
          />
        </div>
      </div>

      {/* The one composer, at the bottom of the centre. Live. Production's
          measure: a hairline above, 12px by 16px around, the textarea and the
          button on one baseline. The label is for screen readers; production
          carries none on the page. The note beneath states the settings —
          every setting is stated, Phoebe's pattern — at caption size. */}
      <div
        className="chrome"
        style={{
          flex: 'none',
          borderTop: '1px solid var(--line)',
          borderBottom: 0,
          padding: '12px 0',
        }}
      >
        <div style={{ maxWidth: DESK_COLUMN, margin: '0 auto', padding: '0 var(--gutter)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              id="wb-desk-composer"
              className="wb-composer wb-composer-desk"
              rows={1}
              value={chat.draft}
              disabled={chat.pending}
              onChange={(e) => chat.setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void chat.send();
                }
              }}
              placeholder={WELLINGTON.composerPlaceholder}
              aria-label={`Message ${WELLINGTON.name}`}
              aria-describedby="wb-desk-composer-note"
              style={{ flex: 1, minWidth: 0 }}
            />
            <button
              type="button"
              className="wb-send-desk"
              onClick={() => void chat.send()}
              disabled={chat.pending || chat.draft.trim() === ''}
            >
              {chat.pending ? 'Sending…' : 'Send'}
            </button>
          </div>
          <p id="wb-desk-composer-note" className="t-caption" style={{ margin: '6px 0 0', fontSize: 11 }}>
            {WELLINGTON.composerNote}
          </p>
        </div>
      </div>
    </>
  );
}

function HostHeader({ host }: { host: AgentHost }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
      <span
        aria-hidden
        style={{
          width: 48,
          height: 48,
          borderRadius: 'var(--r-md)',
          flex: 'none',
          display: 'grid',
          placeItems: 'center',
          background: `color-mix(in oklab, var(${host.colourToken}) 12%, var(--card))`,
          border: `1px solid color-mix(in oklab, var(${host.colourToken}) 30%, transparent)`,
          overflow: 'hidden',
        }}
      >
        <img src={wellingtonPortrait} alt="" width={35} height={35} style={{ display: 'block' }} />
      </span>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ fontSize: 22, margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 }}>
          {host.name}
        </h1>
        <div
          className="t-mono"
          style={{
            fontSize: 10.5,
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
            color: 'var(--ink-3)',
            marginTop: 3,
          }}
        >
          {host.role}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   A quiet tab — a heading, an optional state chip, and a sentence or two that
   say what is true. The honest empty state, in the desk column's measure.
   -------------------------------------------------------------------------- */

function QuietTab({
  heading,
  chip,
  children,
}: {
  heading: string;
  chip?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: DESK_COLUMN, margin: '0 auto', padding: '22px var(--gutter) 24px' }}>
        <h2 style={{ fontSize: 20, margin: '0 0 8px', letterSpacing: '-0.015em', lineHeight: 1.25 }}>
          {heading}
        </h2>
        {chip && (
          <div style={{ marginBottom: 10 }}>
            {/* A state, so a chip: outlined at 40% of the pending colour, no
                fill, the text in ink — amber may not carry type (§2.5). */}
            <span
              className="chip"
              style={{
                borderColor: 'color-mix(in oklab, var(--state-pending) 40%, transparent)',
                color: 'var(--ink-2)',
              }}
            >
              {chip}
            </span>
          </div>
        )}
        <p className="t-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
          {children}
        </p>
      </div>
    </div>
  );
}
