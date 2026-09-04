/**
 * The shared chat layer — the dock frame.
 *
 * ONE COMPONENT, EVERY AGENT IN A DOCK. Phoebe uses it now, Bridget and
 * Calvin use it when their chats are built. The machinery — turns, pending,
 * the honest error, the abort on unmount — lives in useConversation, and the
 * turns are drawn by Transcript; this file is the dock-shaped frame around
 * them. The desk is the other frame around the same machine, so a chat built
 * in the centre of the console is not a second chat.
 *
 * IT DOES NOT KNOW WHICH AGENT IT IS RENDERING. Identity arrives as an
 * AgentHost; answers arrive through an Ask. Anything specific to one agent —
 * Phoebe moving worksheet rows when an answer lands — happens inside that
 * agent's own `ask` before it returns, and this file stays unaware of it.
 *
 * NOTHING CITATION-RELATED LIVES IN AN AGENT'S PANEL. Markers and citations are
 * rendered in AnswerBody and CiteLine, and nowhere else.
 *
 * NO SCRIPTED MESSAGES AND NO FAKE TYPING. NO MEMORY. A reload empties the
 * conversation, and the composer note says so.
 */

import { useEffect, useRef, type ReactNode } from 'react';
import Transcript from './Transcript';
import type { AgentHost, Ask } from './evidence';
import { useConversation } from './useConversation';

export default function AgentChat({
  host,
  ask,
  opening,
  composerId,
}: {
  host: AgentHost;
  ask: Ask;
  /** The empty state. Agent-specific, so the agent supplies it. */
  opening: ReactNode;
  /** Unique per mounted chat, so two chats on one page keep valid label ids. */
  composerId: string;
}) {
  const { turns, draft, setDraft, pending, error, send } = useConversation(ask, host.name);

  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [turns, pending, error]);

  return (
    <aside
      className="wb-panel wb-dock"
      aria-label={`${host.name}, ${host.role}`}
      style={{
        /* The host's accent tints the panel it speaks in — BRAND.md §6 and
           §7. The layer sets it from the host descriptor and never knows which
           agent it is rendering. */
        ['--host-accent' as string]: `var(${host.colourToken})`,
        width: 'var(--chat-rail)',
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <header
        style={{
          display: 'flex',
          gap: 11,
          alignItems: 'center',
          padding: '14px 16px',
          borderBottom: '1px solid var(--line)',
          flex: 'none',
        }}
      >
        <HostMark host={host} />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{host.name}</span>
            {host.beta && <span className="tag">beta</span>}
          </div>
          <div className="t-caption" style={{ fontSize: 11.5 }}>
            {host.role}
          </div>
        </div>
      </header>

      <div ref={scroller} style={{ flex: 1, overflowY: 'auto', padding: '18px 16px', minHeight: 0 }}>
        {turns.length === 0 && opening}
        <Transcript host={host} turns={turns} pending={pending} error={error} />
      </div>

      <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--line)', flex: 'none' }}>
        <label htmlFor={composerId} className="label" style={{ display: 'block', marginBottom: 6 }}>
          Message {host.name}
        </label>
        <textarea
          id={composerId}
          className="wb-composer"
          rows={2}
          value={draft}
          disabled={pending}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          placeholder={host.composerPlaceholder}
          aria-describedby={`${composerId}-note`}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            marginTop: 8,
          }}
        >
          <p id={`${composerId}-note`} className="t-caption" style={{ margin: 0, fontSize: 11 }}>
            {host.composerNote}
          </p>
          <button
            className="btn"
            onClick={() => void send()}
            disabled={pending || draft.trim() === ''}
            style={{ flex: 'none' }}
          >
            {pending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </aside>
  );
}

/**
 * The host's portrait.
 *
 * Published from brand/assets/bots/, which publishes exactly the portraits the
 * product ships and nothing else. Each is self-contained, so it loads as a
 * plain <img>.
 */
function HostMark({ host }: { host: AgentHost }) {
  return (
    <span
      style={{
        /* 40px in chat — BRAND.md §6 gives the portrait three sizes and this
           is the one for a chat panel. It was 36. */
        width: 40,
        height: 40,
        borderRadius: 'var(--r-pill)',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: `color-mix(in oklab, var(${host.colourToken}) 18%, transparent)`,
        border: `1.5px solid var(${host.colourToken})`,
        overflow: 'hidden',
      }}
    >
      <img src={host.portrait} alt="" width={34} height={34} style={{ display: 'block' }} />
    </span>
  );
}
