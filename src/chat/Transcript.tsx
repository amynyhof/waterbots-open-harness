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
 * A bubble look with typing dots was drawn here for a landing surface on
 * 3 Sep 2026 and discarded with it the same day. The hero chat's look waits
 * on the maintainer's reference and is not guessed at here.
 */

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
  return (
    <>
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
    </>
  );
}

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

      {turn.action && (
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
      )}
    </div>
  );
}
