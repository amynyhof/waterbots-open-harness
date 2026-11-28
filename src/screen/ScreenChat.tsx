/**
 * The Chat tab of an agent screen — the host's header, the turns in bubbles,
 * the one composer. Item S16, slice 3, 9 Sep 2026.
 *
 * MOVED OUT OF Desk.tsx, where slice 2 built it for Wellington, so Phoebe's
 * screen and every screen after hers draw the conversation with one
 * component. Built twice, two chats diverge; the desk is now this file's
 * first consumer and Phoebe's screen its second.
 *
 * IT HOLDS NO CONVERSATION. The Conversation arrives from whoever owns it —
 * the shell for Wellington, Phoebe's own seat for Phoebe — and this draws it.
 * One conversation per agent, one composer per screen (BRAND.md §6). No
 * scripted messages, no fake typing, no memory: a reload empties it and the
 * composer's note says so.
 *
 * SHARED CHAT LANGUAGE — carried by the maintainer on 13 Sep 2026 from paid
 * docs/chat/SHARED_CHAT.md (this repository does not read the paid tree).
 * Column 816px; padding 16 sides / 24 top-bottom; composer strip 16/12;
 * outlined composer + Send; header 48 tile / 35 face / 10 corner, still.
 * Chat surface radii 10 / 14. No leftover 22 / 24 / 34.
 *
 * NO BETA TAG beside the name from 21 Nov 2026 — the maintainer's word. The
 * site says it is early once, beside waterbots.ai in the left rail.
 */

import { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import AgentFace from '../components/AgentFace';
import Transcript from '../chat/Transcript';
import type { AgentHost } from '../chat/evidence';
import type { Conversation } from '../chat/useConversation';
import { ScreenMore } from './AgentScreen';
import { BETA_NOTE } from '@waterbots/core/consoleWords';

/** The beta note's first sentence, for one short line under 1280 pixels (rule 26). */
const BETA_SHORT = BETA_NOTE.slice(0, BETA_NOTE.indexOf('. ') + 1);

/** Shared chat column: 816px. */
export const SCREEN_COLUMN = 816;

export default function ScreenChat({
  host,
  chat,
  composerId,
  waitingFor,
}: {
  host: AgentHost;
  chat: Conversation;
  /** Unique per mounted chat, so two screens on one page keep valid label ids. */
  composerId: string;
  /** Who is about to speak here first: Wellington, writing his hand-off line (24 Nov 2026). The box waits for him. */
  waitingFor?: AgentHost;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);
  /* THE BOX GROWS AS THE VISITOR TYPES, up to three lines, then scrolls. It is
     measured, not guessed: one row's height is reset first so a shorter draft
     (or a sent one, which empties it) shrinks the box back. */
  useLayoutEffect(() => {
    const box = composer.current;
    if (!box) return;
    const style = window.getComputedStyle(box);
    const line = parseFloat(style.lineHeight) || 19.5;
    const extra =
      parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) +
      parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    box.style.height = 'auto';
    const most = line * 3 + extra;
    box.style.height = `${Math.min(box.scrollHeight + (style.boxSizing === 'border-box' ? parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth) : 0), most)}px`;
    box.style.overflowY = box.scrollHeight > most ? 'auto' : 'hidden';
  }, [chat.draft]);
  useEffect(() => {
    if (chat.turns.length > 0 || chat.pending || chat.error) {
      scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chat.turns, chat.pending, chat.error, chat.live]);

  return (
    <>
      <div ref={scroller} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ maxWidth: SCREEN_COLUMN, margin: '0 auto', padding: '24px 16px' }}>
          <HostHeader host={host} />
          <Transcript
            host={host}
            turns={chat.turns}
            pending={chat.pending || waitingFor !== undefined}
            thinkingHost={waitingFor}
            error={chat.error}
            live={chat.live}
          />
        </div>
      </div>

      {/* The one composer, at the bottom of the centre. Strip 16/12 around
          the 816 column; the textarea and the button on one baseline. The
          label is for screen readers. The note beneath states the settings
          at caption size. */}
      <div
        className="chrome"
        style={{
          flex: 'none',
          borderTop: '1px solid var(--line)',
          borderBottom: 0,
          padding: '12px 0',
        }}
      >
        <div style={{ maxWidth: SCREEN_COLUMN, margin: '0 auto', padding: '0 16px' }}>
          {/* THE BETA NOTE, just above the typing box on every screen (the shared
              console page of 26 Nov 2026, rule 3), in core's words. Their final words wait on the maintainer. */}
          {/* Under 1280 pixels it is one short line: its first sentence, core's own words (rule 26). */}
          <p className="wb-beta-note">
            <span className="wb-beta-long">{BETA_NOTE}</span>
            <span className="wb-beta-short">{BETA_SHORT}</span>
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              ref={composer}
              id={composerId}
              className="wb-composer wb-composer-desk"
              rows={2}
              value={chat.draft}
              disabled={chat.pending || waitingFor !== undefined}
              onChange={(e) => chat.setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void chat.send();
                }
              }}
              placeholder={host.composerPlaceholder}
              aria-label={`Message ${host.name}`}
              aria-describedby={host.composerNote ? `${composerId}-note` : undefined}
              style={{ flex: 1, minWidth: 0 }}
            />
            <button
              type="button"
              className="wb-send-desk"
              onClick={() => void chat.send()}
              disabled={chat.pending || waitingFor !== undefined || chat.draft.trim() === ''}
            >
              {chat.pending ? 'Sending…' : 'Send'}
            </button>
          </div>
          {host.composerNote && (
            <p id={`${composerId}-note`} className="t-caption" style={{ margin: '6px 0 0', fontSize: 11 }}>
              {host.composerNote}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * The host's header — 48px framed tile, 35px face, 10px corner, still.
 * Name uses the book's H3 token. Role as an eyebrow.
 */
export function HostHeader({ host }: { host: AgentHost }) {
  /* On a screen that opens on its chat alone, the way to its other tabs. */
  const more = useContext(ScreenMore);
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
      <span
        aria-hidden
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          flex: 'none',
          display: 'grid',
          placeItems: 'center',
          background: `color-mix(in oklab, var(${host.colourToken}) 12%, var(--card))`,
          border: `1px solid color-mix(in oklab, var(${host.colourToken}) 30%, transparent)`,
          overflow: 'hidden',
        }}
      >
        <AgentFace portrait={host.portrait} name={host.name} size={35} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h1
            style={{
              fontSize: 'var(--fs-h3)',
              fontWeight: 600,
              margin: 0,
              letterSpacing: '-0.015em',
              lineHeight: 1.15,
            }}
          >
            {host.name}
          </h1>
          {more && (
            <button type="button" className="wb-row-action wb-about-link" onClick={more}>
              About {host.name}
            </button>
          )}
        </div>
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
