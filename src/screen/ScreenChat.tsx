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
 * THE COMPOSER IS PRODUCTION'S TO THE PIXEL — maintainer's eyeball ruling 2a,
 * 7 Sep 2026: one line tall, 13px on 1.5, 8px by 12px inside, on the card
 * plane with the hairline and the medium radius; the Send button 13px medium
 * on Tide, faded to 45% while it cannot send; the pair 816px wide, which is
 * production's desk column, so the transcript above takes the same width.
 *
 * BETA IS STATED IN WORDS beside the name, where the host says it is true.
 */

import { useEffect, useRef } from 'react';
import Transcript from '../chat/Transcript';
import type { AgentHost } from '../chat/evidence';
import type { Conversation } from '../chat/useConversation';

/** Production's desk column, read from the saved page: 816px. */
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
        <div style={{ maxWidth: SCREEN_COLUMN, margin: '0 auto', padding: '22px var(--gutter) 24px' }}>
          <HostHeader host={host} />
          <Transcript
            host={host}
            turns={chat.turns}
            pending={chat.pending}
            error={chat.error}
            look="bubbles"
          />
        </div>
      </div>

      {/* The one composer, at the bottom of the centre. A hairline above,
          12px by 16px around, the textarea and the button on one baseline. The
          label is for screen readers; production carries none on the page.
          The note beneath states the settings at caption size. */}
      <div
        className="chrome"
        style={{
          flex: 'none',
          borderTop: '1px solid var(--line)',
          borderBottom: 0,
          padding: '12px 0',
        }}
      >
        <div style={{ maxWidth: SCREEN_COLUMN, margin: '0 auto', padding: '0 var(--gutter)' }}>
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
 * The host's header — production's desk header: a 48px portrait tile in the
 * host's tint, the name at 22px, the role as an eyebrow, beta as a tag where
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
          borderRadius: 'var(--r-md)',
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
          <h1 style={{ fontSize: 22, margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 }}>
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
