/**
 * The transcript — every turn of a conversation, drawn one way for every agent.
 *
 * MOVED OUT OF AgentChat ON 3 Sep 2026 so the desk and the dock draw turns
 * with one component. It knows which agent is speaking only through the
 * AgentHost it is handed. Markers and citations render in AnswerBody and
 * nowhere else.
 *
 * A TURN MAY CARRY ONE CAPTION — the shown line, from a field, never from
 * prose (contract line 5, 21 Sep 2026) — drawn in the citation line's class.
 *
 * A TURN MAY CARRY ONE ACTION. Wellington routes; his adapter turns a route
 * field into a labelled action, and this draws it as the same quiet text link
 * the desk's rows use. ~~Phoebe's turns carry none.~~ Corrected 21 Sep 2026:
 * Phoebe's carry the hand-back (contract line 8) — the way back to Wellington,
 * or to the shelf on the Commons — from a field, never from her prose; and
 * Wellington's route draws nothing since the look pass of 8 Sep 2026. The
 * layer does not know what the action does — it calls what it is given.
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

import { useContext, type CSSProperties } from 'react';
import { Reached } from './reached';
import AgentFace from '../components/AgentFace';
import AnswerBody from './AnswerBody';
import type { AgentHost, AgentTurn, Turn } from './evidence';

/** The chip that puts the cursor back in the chat box (src/lib/wellington.ts). */
const KEEP_CHATTING = 'Keep chatting';

export default function Transcript({
  host,
  turns,
  pending,
  error,
  live = null,
  thinkingHost,
}: {
  host: AgentHost;
  turns: Turn[];
  pending: boolean;
  error: string | null;
  /**
   * The reply so far while it streams in (13 Nov 2026). Drawn in the host's
   * own bubble in place of the thinking dots, and replaced by the answer.
   */
  live?: string | null;
  /** Who is thinking, when it is not the host: Wellington, writing his hand-off line (24 Nov 2026). */
  thinkingHost?: AgentHost;
}) {
  const thinker = thinkingHost ?? host;
  const accent = { '--turn-accent': `var(${thinker.colourToken})` } as CSSProperties;

  return (
    <>
      {turns.map((turn, i) =>
        turn.role === 'user' ? (
          <ReaderBubble key={i} text={turn.text} />
        ) : (
          <HostBubble key={i} host={host} turn={turn} latest={i === turns.length - 1 && !pending} />
        )
      )}

      {pending && live && (
        <div aria-busy="true">
          <HostBubble host={host} turn={{ role: 'agent', text: live, evidence: [] }} />
        </div>
      )}

      {pending && !live && (
        <div className="wb-thinking" style={accent} role="status" aria-live="polite">
          <HostFace host={thinker} thinking />
          <span className="wb-thinking-dots" aria-hidden>
            <span />
            <span />
            <span />
          </span>
          <span className="wb-thinking-line">{thinker.thinkingLine}</span>
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
      <AgentFace portrait={host.portrait} name={host.name} size={35} />
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

function HostBubble({ host, turn, latest = false }: { host: AgentHost; turn: AgentTurn; latest?: boolean }) {
  const who = turn.speaker ?? host;
  const accent = { '--turn-accent': `var(${who.colourToken})`, ...(who.nameToken ? { '--turn-name': `var(${who.nameToken})` } : {}) } as CSSProperties;
  return (
    <div className="wb-turn wb-turn-host" style={accent}>
      <HostFace host={who} />
      <div className="wb-turn-body">
        <div className="wb-turn-who">
          <span>
            {/* NAME AND ROLE ONCE (the shared console page of 26 Nov 2026, rule 10): the screen's
                header carries its host's role, so the host's own bubbles carry the name alone.
                Someone else speaking here, such as Wellington in another agent's chat, keeps both. */}
            {who.name === host.name ? who.name : `${who.name} · ${who.role}`}
          </span>
          {turn.abstained && (
            <span className="t-caption" style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'none', letterSpacing: 0 }}>
              {who.abstainedLabel ?? 'no card for this'}
            </span>
          )}
        </div>
        <div className="wb-bubble">
          <AnswerBody
            text={turn.text}
            evidence={turn.evidence}
            boldClosingQuestion={who.boldClosingQuestion}
          />
          {/* The shown line — the citation line's own class, so it is the
              same place, size and colour, and nothing new is invented. */}
          {turn.caption && <div className="wb-cite-line" style={{ marginTop: 6 }}>{turn.caption}</div>}
          <TurnAction turn={turn} />
          {latest && <TurnButtons turn={turn} />}
        </div>
      </div>
    </div>
  );
}

/**
 * The buttons under the latest turn (14 Nov 2026): the blue primary one
 * first — only the main next step, such as "Meet Phoebe" — then quiet chips,
 * small, outlined and unfilled (P24). Only the latest turn draws them, so an old handoff's
 * buttons do not stay on the thread as if they were still the next step.
 */
export function TurnButtons({ turn }: { turn: Pick<AgentTurn, 'buttons'> }) {
  /* A Meet button whose agent this visit has reached is drawn quiet (21 Nov 2026). */
  const reached = useContext(Reached);
  if (!turn.buttons?.length) return null;
  return (
    <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {turn.buttons.map((button) => {
        /* Every hand-off has one format, in the next agent's colour (24 Nov 2026). */
        if (button.handoff) {
          return (
            <button
              key={button.label}
              type="button"
              className="wb-handoff"
              style={{ '--handoff': `var(${button.handoff.token})` } as CSSProperties}
              onClick={button.go}
            >
              <AgentFace portrait={button.handoff.portrait} name={button.handoff.name} size={20} />
              {button.label}
            </button>
          );
        }
        const blue = button.primary && !(button.reaches && reached.has(button.reaches));
        return (
          <button
            key={button.label}
            type="button"
            /* "Keep chatting" has a blue outline (the shared console page of 26 Nov 2026, rule 4). */
            className={blue ? 'btn btn-primary' : button.label === KEEP_CHATTING ? 'wb-chip wb-chip-keep' : 'wb-chip'}
            style={blue ? { padding: '6px 14px', fontSize: 13 } : undefined}
            onClick={button.go}
          >
            {button.label}
          </button>
        );
      })}
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
