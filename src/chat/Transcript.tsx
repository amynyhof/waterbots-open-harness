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
 * TWO LOOKS, ONE TRANSCRIPT — item S16, slice 2, 9 Sep 2026. The agent
 * screen draws turns as BUBBLES: the visitor's on the right in white with the
 * hairline, the agent's on the left in the agent's own tint with its portrait
 * beside it, signed Name · Role above. The docks still draw ROWS, the look
 * they have had since 3 Sep, until each dock's own slice retires it into the
 * screen. The pictures of 8 Sep 2026 (#61) are what the bubbles follow, and
 * the maintainer approved them on pixels.
 *
 * The agent's tint is read from the host's colour token, never re-typed
 * (BRAND.md §6), and it is an identity — a bubble, a portrait, a keyline —
 * never a status dot (§2.6). The signature above the bubble is set in the
 * accent only where the accent may carry text; Surf may not, and Bridget's
 * host says so when her screen comes.
 *
 * ~~A bubble look with typing dots was drawn here for a landing surface on
 * 3 Sep 2026 and discarded with it the same day.~~ Bubbles are back by the
 * maintainer's brief of 8 Sep 2026; the typing dots are not part of this and
 * stay on item S14.
 */

import { type CSSProperties } from 'react';
import AnswerBody from './AnswerBody';
import type { AgentHost, AgentTurn, Turn } from './evidence';

export type TranscriptLook = 'rows' | 'bubbles';

export default function Transcript({
  host,
  turns,
  pending,
  error,
  look = 'rows',
}: {
  host: AgentHost;
  turns: Turn[];
  pending: boolean;
  error: string | null;
  /** Rows in a dock; bubbles on the agent screen. */
  look?: TranscriptLook;
}) {
  return (
    <>
      {turns.map((turn, i) =>
        look === 'bubbles' ? (
          turn.role === 'user' ? (
            <ReaderBubble key={i} text={turn.text} />
          ) : (
            <HostBubble key={i} host={host} turn={turn} />
          )
        ) : turn.role === 'user' ? (
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
    </>
  );
}

/* --------------------------------------------------------------------------
   Rows — the docks' look.
   -------------------------------------------------------------------------- */

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
            {host.abstainedLabel ?? 'no card for this'}
          </span>
        )}
      </div>

      <AnswerBody text={turn.text} evidence={turn.evidence} />

      <TurnAction turn={turn} />
    </div>
  );
}

/* --------------------------------------------------------------------------
   Bubbles — the agent screen's look.
   -------------------------------------------------------------------------- */

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
      <span className="wb-turn-portrait" aria-hidden>
        <img src={host.portrait} alt="" width={24} height={24} style={{ display: 'block' }} />
      </span>
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

/** The one action a turn may carry, drawn the same way in either look. */
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
