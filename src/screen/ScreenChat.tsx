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
 * BETA IS STATED IN WORDS beside the name, where the host says it is true.
 */

import { useEffect, useRef } from 'react';
import Transcript from '../chat/Transcript';
import type { AgentHost } from '../chat/evidence';
import type { Conversation } from '../chat/useConversation';

/** Shared chat column: 816px. */
export const SCREEN_COLUMN = 816;

export default function ScreenChat({
  host,
  chat,
  composerId,
}: {
  host: AgentHost;
  chat: Conversation;
  /** Unique per mounted chat, so two screens on one page keep valid label ids. */
  composerId: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chat.turns.length > 0 || chat.pending || chat.error) {
      scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chat.turns, chat.pending, chat.error]);

  return (
    <>
      <div ref={scroller} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ maxWidth: SCREEN_COLUMN, margin: '0 auto', padding: '24px 16px' }}>
          <HostHeader host={host} />
          <Transcript
            host={host}
            turns={chat.turns}
            pending={chat.pending}
            error={chat.error}
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
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              id={composerId}
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
              placeholder={host.composerPlaceholder}
              aria-label={`Message ${host.name}`}
              aria-describedby={`${composerId}-note`}
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
          <p id={`${composerId}-note`} className="t-caption" style={{ margin: '6px 0 0', fontSize: 11 }}>
            {host.composerNote}
          </p>
        </div>
      </div>
    </>
  );
}

/**
 * The host's header — 48px framed tile, 35px face, 10px corner, still.
 * Name uses the book's H3 token. Role as an eyebrow. Beta as a tag where
 * it is true.
 */
export function HostHeader({ host }: { host: AgentHost }) {
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
        <img src={host.portrait} alt="" width={35} height={35} style={{ display: 'block' }} />
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
          {host.beta && <span className="tag">beta</span>}
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
