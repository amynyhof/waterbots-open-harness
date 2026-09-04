/**
 * The free desk — Wellington's dispatch desk on the open site.
 *
 * THE SHAPE is the production desk's, from the saved page the maintainer
 * brought in by hand on 2 Sep 2026: the host's header, a "needs you" card of
 * dispatch rows, the desk chat beneath it under production's divider, and the
 * one composer at the bottom of the centre. Ruling C of that day: the two
 * consoles should rhyme. The look is taken and nothing else is.
 *
 * WELLINGTON IS LIVE HERE FROM 3 Sep 2026 — a real agent on real machinery,
 * on Phoebe's proven pattern. His replies land on the desk, never on a row.
 * The composer is the one composer per screen (BRAND.md §6), and it is the
 * same machine the docks use (src/chat/useConversation.ts) in a different
 * frame. There are NO scripted messages and no fake typing.
 *
 * HE ROUTES; THE DESK ACTS. A route comes back as a field and renders as one
 * quiet action under his turn — the same text link the rows use. What he
 * learned about the project comes back as a field and writes into the visit
 * under one rule: a typed entry is never overwritten; a blank field takes the
 * visitor's own words to him, and the card says where each field came from.
 *
 * ROWS DERIVE FROM THIS VISIT AND ARE NEVER INVENTED — deskRows in
 * src/lib/visit.ts. The last row is always "Save this project and sign up",
 * which opens the paid site in a new window and carries nothing across.
 *
 * THE PROJECT CONTEXT keeps name and place as fields. The "standard of
 * interest" chips are gone; what kind of project it is lives in Wellington's
 * plain question and shows here once he has heard the answer. A visitor who
 * never chats loses nothing that blocks them.
 */

import { useEffect, useRef } from 'react';
import bridgetPortrait from '../../brand/assets/bots/bridget.svg';
import calvinPortrait from '../../brand/assets/bots/calvin.svg';
import phoebePortrait from '../../brand/assets/bots/phoebe.svg';
import wellingtonPortrait from '../../brand/assets/bots/wellington.svg';
import Transcript from '../chat/Transcript';
import type { AgentHost } from '../chat/evidence';
import type { Conversation } from '../chat/useConversation';
import type { Surface } from '../lib/surfaces';
import { WELLINGTON } from '../lib/wellington';
import {
  KIND_LABEL,
  type DeskRow,
  type Provenance,
  type RowSender,
  type VisitContext,
} from '../lib/visit';

const SENDER: Record<RowSender, { name: string; role: string; portrait: string; token: string }> = {
  wellington: { name: 'Wellington', role: 'Team Lead', portrait: wellingtonPortrait, token: '--bot-wellington' },
  phoebe: { name: 'Phoebe', role: 'Eligibility', portrait: phoebePortrait, token: '--bot-phoebe' },
  bridget: { name: 'Bridget', role: 'Map', portrait: bridgetPortrait, token: '--bot-bridget' },
  calvin: { name: 'Calvin', role: 'Calculator', portrait: calvinPortrait, token: '--bot-calvin' },
};

export default function Desk({
  context,
  onTyped,
  chat,
  rows,
  onNavigate,
}: {
  context: VisitContext;
  onTyped: (field: 'name' | 'place', value: string) => void;
  /** Wellington's one conversation, held by the shell, shared with any other frame around him. */
  chat: Conversation;
  rows: DeskRow[];
  onNavigate: (surface: Surface) => void;
}) {

  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chat.turns.length > 0 || chat.pending || chat.error) {
      scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chat.turns, chat.pending, chat.error]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div ref={scroller} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {/* THE SAME BOX AS THE WORKSHEETS — 880px wide, the same gutter — so
            every centre surface shares one margin. */}
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '26px var(--gutter) 24px' }}>
          <HostHeader />

          <ProjectContext context={context} onTyped={onTyped} />

          <NeedsYou rows={rows} onNavigate={onNavigate} />

          <DeskChat host={WELLINGTON} turns={chat.turns} pending={chat.pending} error={chat.error} />
        </div>
      </div>

      {/* The one composer, at the bottom of the centre. Live. */}
      <div
        className="chrome"
        style={{
          flex: 'none',
          borderTop: '1px solid var(--line)',
          borderBottom: 0,
          padding: '12px 0 14px',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 var(--gutter)' }}>
          <label htmlFor="wb-desk-composer" className="label" style={{ display: 'block', marginBottom: 6 }}>
            Message {WELLINGTON.name}
          </label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              id="wb-desk-composer"
              className="wb-composer"
              rows={2}
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
              aria-describedby="wb-desk-composer-note"
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-primary"
              onClick={() => void chat.send()}
              disabled={chat.pending || chat.draft.trim() === ''}
              style={{ flex: 'none' }}
            >
              {chat.pending ? 'Sending…' : 'Send'}
            </button>
          </div>
          <p id="wb-desk-composer-note" className="t-caption" style={{ margin: '7px 0 0', fontSize: 11 }}>
            {WELLINGTON.composerNote}
          </p>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   The host's header.
   -------------------------------------------------------------------------- */

function HostHeader() {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
      <Portrait sender="wellington" size={48} />
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
   The project context — name and place as fields; the kind, once heard.
   -------------------------------------------------------------------------- */

const PROVENANCE_LABEL: Record<Provenance, string> = {
  '': '',
  typed: 'Typed',
  chat: 'From your conversation',
  pin: 'From the map pin',
};

function ProjectContext({
  context,
  onTyped,
}: {
  context: VisitContext;
  onTyped: (field: 'name' | 'place', value: string) => void;
}) {
  return (
    <section
      aria-labelledby="wb-project-context"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-md)',
        padding: '12px 16px 6px',
        marginBottom: 14,
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}
      >
        <div
          id="wb-project-context"
          className="t-mono"
          style={{
            fontSize: 10.5,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-2)',
          }}
        >
          Project context
        </div>
        <span className="t-caption" style={{ fontSize: 10.5 }}>
          This visit only. Nothing typed here is kept or sent anywhere but to Wellington when you ask him.
        </span>
      </div>

      <ContextRow label="Project name" provenance={context.provenance.name}>
        <input
          className="wb-context-input"
          type="text"
          value={context.name}
          onChange={(e) => onTyped('name', e.target.value)}
          placeholder="What you call it"
          aria-label="Project name"
          maxLength={120}
        />
      </ContextRow>

      <ContextRow
        label="Place"
        help="Pinning a basin on the map, or telling Wellington, fills this in if you leave it blank."
        provenance={context.provenance.place}
      >
        <input
          className="wb-context-input"
          type="text"
          value={context.place}
          onChange={(e) => onTyped('place', e.target.value)}
          placeholder="Where it is"
          aria-label="Place"
          maxLength={160}
        />
      </ContextRow>

      <ContextRow
        label="Kind of project"
        help={
          context.kind
            ? undefined
            : 'Wellington asks this in plain words. Nothing here depends on the answer.'
        }
        provenance={context.provenance.kind}
        last
      >
        <span style={{ fontSize: 12.5, color: context.kind ? 'var(--ink)' : 'var(--ink-4)' }}>
          {context.kind ? KIND_LABEL[context.kind] : '—'}
        </span>
      </ContextRow>
    </section>
  );
}

function ContextRow({
  label,
  help,
  provenance,
  last,
  children,
}: {
  label: string;
  help?: string;
  provenance: Provenance;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ borderBottom: last ? 0 : '1px solid var(--line)', padding: '9px 0 8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>
          {label}
          {provenance && (
            <span
              className="t-mono"
              style={{ marginLeft: 8, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}
            >
              {PROVENANCE_LABEL[provenance]}
            </span>
          )}
        </span>
        <div style={{ flex: 'none' }}>{children}</div>
      </div>
      {help && (
        <div style={{ fontSize: 10, lineHeight: 1.5, color: 'var(--ink-3)', marginTop: 3 }}>{help}</div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
   The "needs you" card — the dispatch rows.
   -------------------------------------------------------------------------- */

function NeedsYou({ rows, onNavigate }: { rows: DeskRow[]; onNavigate: (surface: Surface) => void }) {
  const derived = rows.filter((r) => r.key !== 'save');

  return (
    <section
      aria-labelledby="wb-needs-you"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
      }}
    >
      <div
        id="wb-needs-you"
        className="t-mono"
        style={{
          fontSize: 10.5,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--ink-2)',
          padding: '10px 16px',
          borderBottom: '1px solid var(--line)',
          borderTop: '2px solid var(--bot-wellington)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span>Needs you</span>
        <span style={{ color: 'var(--ink-4)', letterSpacing: '0.08em' }}>
          {rows.length} {rows.length === 1 ? 'next step' : 'next steps'}
        </span>
      </div>

      {derived.length === 0 && (
        <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 5 }}>
            Nothing from this visit yet.
          </div>
          <p className="t-caption" style={{ margin: 0, lineHeight: 1.65, maxWidth: '64ch' }}>
            Rows appear here from this visit only, and none is ever invented. Phoebe’s eligibility
            result lands here when the worksheet moves. The basin you pin on the map lands here. Calvin’s
            screening figure lands here once a pack has one.
          </p>
        </div>
      )}

      {rows.map((row, i) => (
        <DispatchRow key={row.key} row={row} last={i === rows.length - 1} onNavigate={onNavigate} />
      ))}
    </section>
  );
}

function DispatchRow({
  row,
  last,
  onNavigate,
}: {
  row: DeskRow;
  last: boolean;
  onNavigate: (surface: Surface) => void;
}) {
  const who = SENDER[row.from];
  return (
    <div
      style={{
        display: 'flex',
        gap: 13,
        alignItems: 'flex-start',
        padding: '13px 16px 14px',
        borderBottom: last ? 0 : '1px solid var(--line)',
      }}
    >
      <Portrait sender={row.from} size={36} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: row.from === 'bridget' ? 'var(--ink)' : `var(${who.token})`,
            }}
          >
            {who.name}
          </span>
          <span
            className="t-mono"
            style={{ fontSize: 9.5, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-3)' }}
          >
            {who.role}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--ink)' }}>{row.sentence}</p>
        <div style={{ marginTop: 7 }}>
          {row.action.kind === 'surface' ? (
            <button
              type="button"
              className="wb-row-action"
              onClick={() => row.action.kind === 'surface' && onNavigate(row.action.surface)}
            >
              {row.action.label}
            </button>
          ) : (
            <a className="wb-row-action" href={row.action.href} target="_blank" rel="noopener noreferrer">
              {row.action.label}
              <span aria-hidden> ↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   The desk chat — production's divider, then the transcript.

   The divider is the saved page's: a small eyebrow, a hairline that stretches
   to fill, and one caption. Replies land here on the desk, never on a row.
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
  return (
    <div style={{ marginTop: 22 }}>
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
      <p style={{ margin: '8px 0 14px', fontSize: 12, lineHeight: 1.55, color: 'var(--ink-4)' }}>
        Ask Wellington about this project. Replies land here on the desk, never on a row. He routes
        you to the right seat; he answers in full on waterbots.ai.
      </p>
      <Transcript host={host} turns={turns} pending={pending} error={error} />
    </div>
  );
}

/* --------------------------------------------------------------------------
   Portraits. Shared, never copied.
   -------------------------------------------------------------------------- */

function Portrait({ sender, size }: { sender: RowSender; size: number }) {
  const who = SENDER[sender];
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--r-md)',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: `color-mix(in oklab, var(${who.token}) 12%, var(--card))`,
        border: `1px solid color-mix(in oklab, var(${who.token}) 30%, transparent)`,
        overflow: 'hidden',
      }}
    >
      <img
        src={who.portrait}
        alt=""
        width={Math.round(size * 0.72)}
        height={Math.round(size * 0.72)}
        style={{ display: 'block' }}
      />
    </span>
  );
}
