/**
 * The transcript — every turn of a conversation, drawn one way for every agent.
 *
 * MOVED OUT OF AgentChat ON 3 Sep 2026 so the desk and the dock draw turns
 * with one component. It knows which agent is speaking only through the
 * AgentHost it is handed. Markers and citations render in AnswerBody and
 * nowhere else.
 *
 * A TURN MAY CARRY ONE ACTION. Wellington routes; his adapter turns a route
 * field into a labelled action, and this draws it as the same quiet text link
 * the desk's rows use. Phoebe's turns carry none. The layer does not know what
 * the action does — it calls what it is given.
 *
 * ONE LOOK — the shared chat language, carried by the maintainer on 13 Sep 2026
 * from paid docs/chat/SHARED_CHAT.md (rules travel as rules; this repository
 * does not read the paid tree). Visitor right, hairline; host left, tint, 35px
 * face with no box, Name · Role above. The unused rows look is gone so there
 * is not a second bubble language.
 *
 * The agent's tint is read from the host's colour token, never re-typed
 * (BRAND.md §6), and it is an identity — a bubble, a portrait, a keyline —
 * never a status dot (§2.6). The signature above the bubble is set in the
 * accent only where the accent may carry text; Surf may not, and Bridget's
 * host says so when her screen comes.
 *
 * THINKING is face + three opacity-pulse dots + the host's existing line,
 * never flush-left text. Only the thinking face floats, and gently. Idle
 * faces stay still. Item S14's motion (opacity only, no bounce) lands here
 * on the live chats; the hero chat (S12) stays parked.
 */

import { type CSSProperties } from 'react';
import AnswerBody from './AnswerBody';
import type { AgentHost, AgentTurn, Turn } from './evidence';

export default function Transcript({
  host,
  turns,
  pending,
  error,
}: {
  host: AgentHost;
  turns: Turn[];
  pending: boolean;
  error: string | null;
}) {
  const accent = { '--turn-accent': `var(${host.colourToken})` } as CSSProperties;

  return (
    <>
      {turns.map((turn, i) =>
        turn.role === 'user' ? (
          <ReaderBubble key={i} text={turn.text} />
        ) : (
          <HostBubble key={i} host={host} turn={turn} />
        )
      )}

      {pending && (
        <div className="wb-thinking" style={accent} role="status" aria-live="polite">
          <HostFace host={host} thinking />
          <span className="wb-thinking-dots" aria-hidden>
            <span />
            <span />
            <span />
          </span>
          <span className="wb-thinking-line">{host.thinkingLine}</span>
        </div>
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
    </>
  );
}

function HostFace({ host, thinking = false }: { host: AgentHost; thinking?: boolean }) {
  return (
    <span className={thinking ? 'wb-turn-face wb-turn-face-thinking' : 'wb-turn-face'} aria-hidden>
      <img src={host.portrait} alt="" width={35} height={35} />
    </span>
  );
}

function ReaderBubble({ text }: { text: string }) {
  return (
    <div className="wb-turn wb-turn-me">
      <div className="wb-turn-body">
        <div className="wb-bubble">{text}</div>
      </div>
    </div>
  );
}

function HostBubble({ host, turn }: { host: AgentHost; turn: AgentTurn }) {
  const accent = { '--turn-accent': `var(${host.colourToken})` } as CSSProperties;
  return (
    <div className="wb-turn wb-turn-host" style={accent}>
      <HostFace host={host} />
      <div className="wb-turn-body">
        <div className="wb-turn-who">
          <span>
            {host.name} · {host.role}
          </span>
          {turn.abstained && (
            <span className="t-caption" style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'none', letterSpacing: 0 }}>
              {host.abstainedLabel ?? 'no card for this'}
            </span>
          )}
        </div>
        <div className="wb-bubble">
          <AnswerBody text={turn.text} evidence={turn.evidence} />
          <TurnAction turn={turn} />
        </div>
      </div>
    </div>
  );
}

/** The one action a turn may carry. */
function TurnAction({ turn }: { turn: AgentTurn }) {
  if (!turn.action) return null;
  return (
    <div style={{ marginTop: 7 }}>
      {turn.action.href ? (
        <a
          className="wb-row-action"
          href={turn.action.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {turn.action.label}
          <span aria-hidden> ↗</span>
        </a>
      ) : (
        <button type="button" className="wb-row-action" onClick={turn.action.go}>
          {turn.action.label}
        </button>
      )}
    </div>
  );
}
