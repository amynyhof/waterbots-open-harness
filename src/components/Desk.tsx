/**
 * The free desk — Wellington's dispatch desk on the open site.
 *
 * THE CENTRE IS THE CONVERSATION AND NOTHING ELSE — maintainer's ruling 3 of
 * 4 Sep 2026, from the reference she brought in by hand: chat dominates the
 * page, no other noise. The host's header, the desk divider, his turns, the
 * one composer. The project context left the centre for the rail, where it is
 * the record his interview populates; the dispatch rows left for the crew
 * column, where each seat holds its own. Item S11's second pass.
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
 * brought in on 2 Sep 2026 — its header, its divider, its composer — and the
 * brand book governs every pixel.
 *
 * THE COMPOSER IS PRODUCTION'S TO THE PIXEL — maintainer's eyeball ruling 2a,
 * 7 Sep 2026: one line tall, 13px on 1.5, 8px by 12px inside, on the card
 * plane with the hairline and the medium radius; the Send button 13px medium
 * on Tide, faded to 45% while it cannot send; the pair 816px wide, which is
 * production's desk column, so the transcript box above takes the same width.
 * Read from the saved markup, not guessed.
 */

import { useEffect, useRef } from 'react';
import wellingtonPortrait from '../../brand/assets/bots/wellington.svg';
import Transcript from '../chat/Transcript';
import type { AgentHost } from '../chat/evidence';
import type { Conversation } from '../chat/useConversation';
import { WELLINGTON } from '../lib/wellington';

/** Production's desk column, read from the saved page: 816px. */
const DESK_COLUMN = 816;

export default function Desk({ chat }: { chat: Conversation }) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chat.turns.length > 0 || chat.pending || chat.error) {
      scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chat.turns, chat.pending, chat.error]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div ref={scroller} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {/* PRODUCTION'S DESK COLUMN — 816px, the composer's width, so the
            transcript and the composer share one edge. The worksheets keep
            their 880. */}
        <div style={{ maxWidth: DESK_COLUMN, margin: '0 auto', padding: '26px var(--gutter) 24px' }}>
          <HostHeader />
          <DeskChat host={WELLINGTON} turns={chat.turns} pending={chat.pending} error={chat.error} />
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
    </div>
  );
}

/* --------------------------------------------------------------------------
   The host's header — the production desk's.
   -------------------------------------------------------------------------- */

function HostHeader() {
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
          background: 'color-mix(in oklab, var(--bot-wellington) 12%, var(--card))',
          border: '1px solid color-mix(in oklab, var(--bot-wellington) 30%, transparent)',
          overflow: 'hidden',
        }}
      >
        <img src={wellingtonPortrait} alt="" width={35} height={35} style={{ display: 'block' }} />
      </span>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ fontSize: 22, margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 }}>
          {WELLINGTON.name}
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
          {WELLINGTON.role}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   The desk chat — production's divider, then the transcript.

   Before the first turn it says, in one sentence, what the conversation is
   for. An honest empty state, not a scripted opener.
   -------------------------------------------------------------------------- */

function DeskChat({
  host,
  turns,
  pending,
  error,
}: {
  host: AgentHost;
  turns: Conversation['turns'];
  pending: boolean;
  error: string | null;
}) {
  const empty = turns.length === 0 && !pending && !error;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          className="t-mono"
          style={{
            fontSize: 9.5,
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
            color: 'var(--ink-4)',
            flex: 'none',
          }}
        >
          Desk chat · {host.name} only
        </span>
        <span aria-hidden style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>
      {empty ? (
        <p style={{ margin: '8px 0 14px', fontSize: 12, lineHeight: 1.55, color: 'var(--ink-4)' }}>
          Tell Wellington what your project does and where it is. He asks the rest, what he learns
          fills the project record on the left, and each person on the right picks up their part as
          he learns it. Nothing is kept between visits.
        </p>
      ) : (
        <div style={{ height: 14 }} />
      )}
      <Transcript host={host} turns={turns} pending={pending} error={error} />
    </div>
  );
}
