/**
 * The shared chat layer.
 *
 * ONE COMPONENT, EVERY AGENT. Phoebe uses it now, Bridget uses it next, and
 * anyone after them uses the same one. Built twice, two chats diverge — and the
 * part that diverges is the part that carries citations, which is exactly the
 * part that must not.
 *
 * IT DOES NOT KNOW WHICH AGENT IT IS RENDERING. Identity arrives as an
 * AgentHost; answers arrive through an Ask. Anything specific to one agent —
 * Phoebe moving worksheet rows when an answer lands — happens inside that
 * agent's own `ask` before it returns, and this file stays unaware of it.
 *
 * NOTHING CITATION-RELATED LIVES IN AN AGENT'S PANEL. Markers and citations are
 * rendered in AnswerBody and CiteLine, and nowhere else.
 *
 * NO SCRIPTED MESSAGES AND NO FAKE TYPING. What is on screen is a real exchange
 * or an honest statement that something failed. A failed turn keeps the question
 * in the transcript so the reader can see what was asked.
 *
 * NO MEMORY. Nothing is stored, here or anywhere else. A reload empties the
 * conversation, and the composer note says so.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import AnswerBody from './AnswerBody';
import type { AgentHost, AgentTurn, Ask, Turn } from './evidence';

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
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scroller = useRef<HTMLDivElement>(null);
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [turns, pending, error]);

  useEffect(() => () => inFlight.current?.abort(), []);

  async function send() {
    const question = draft.trim();
    if (!question || pending) return;

    const history: Turn[] = [...turns, { role: 'user', text: question }];
    setTurns(history);
    setDraft('');
    setError(null);
    setPending(true);

    const controller = new AbortController();
    inFlight.current = controller;

    try {
      const answer: AgentTurn = await ask(
        history.map((turn) => ({ role: turn.role, text: turn.text })),
        controller.signal
      );
      setTurns([...history, answer]);
    } catch (failure) {
      if (failure instanceof DOMException && failure.name === 'AbortError') return;
      /* An adapter throws only messages already fit for a reader. Anything
         else gets a plain one rather than a stack trace or a silence. */
      setError(
        failure instanceof Error && failure.message
          ? failure.message
          : `Something went wrong reaching ${host.name}. Nothing has been recorded.`
      );
    } finally {
      setPending(false);
      inFlight.current = null;
    }
  }

  return (
    <aside
      className="chrome"
      aria-label={`${host.name}, ${host.role}`}
      style={{
        width: 'var(--chat-rail)',
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid var(--line)',
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

        {turns.map((turn, i) =>
          turn.role === 'user' ? (
            <ReaderTurn key={i} text={turn.text} />
          ) : (
            <HostTurn key={i} host={host} turn={turn} />
          )
        )}

        {pending && (
          <p className="t-caption" style={{ margin: '4px 0 0', color: 'var(--ink-3)' }}>
            {host.thinkingLine}
          </p>
        )}

        {error && (
          <div
            role="alert"
            style={{
              marginTop: 14,
              padding: '10px 12px',
              borderLeft: '2px solid var(--state-warn)',
              background: 'var(--paper)',
              borderRadius: 'var(--r-xs)',
            }}
          >
            <p className="t-caption" style={{ margin: 0, lineHeight: 1.6 }}>
              {error}
            </p>
          </div>
        )}
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

/* -------------------------------------------------------------------------
   Turns.
------------------------------------------------------------------------- */

function ReaderTurn({ text }: { text: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="label" style={{ marginBottom: 4, color: 'var(--ink-3)' }}>
        You
      </div>
      <p
        className="t-body"
        style={{ margin: 0, fontSize: 14, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}
      >
        {text}
      </p>
    </div>
  );
}

function HostTurn({ host, turn }: { host: AgentHost; turn: AgentTurn }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        className="label"
        style={{ marginBottom: 4, color: `var(${host.colourToken})`, display: 'flex', gap: 7 }}
      >
        {host.name}
        {turn.abstained && (
          <span className="t-caption" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>
            no card for this
          </span>
        )}
      </div>

      <AnswerBody text={turn.text} evidence={turn.evidence} />
    </div>
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
        width: 36,
        height: 36,
        borderRadius: 'var(--r-pill)',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: `color-mix(in oklab, var(${host.colourToken}) 18%, transparent)`,
        border: `1.5px solid var(${host.colourToken})`,
        overflow: 'hidden',
      }}
    >
      <img src={host.portrait} alt="" width={30} height={30} style={{ display: 'block' }} />
    </span>
  );
}
