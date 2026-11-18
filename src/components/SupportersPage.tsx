/**
 * Supporters — a page at /supporters, under the site menu. Approved 16 Nov 2026, the maintainer's
 * word on #176 (docs/proposals/supporters-2026-11-16.md).
 *
 * ONLY WHAT SHE APPROVED. The page reads the shown list (api/supporters.ts) and draws a card for each
 * real, approved entry: the name as typed, the role, the title and organisation when given, the
 * comment in quotes as written, and the month it was approved. Nothing waiting or declined is ever
 * read, and no email is ever sent to the page.
 *
 * THE AGENTS COME FIRST, from 18 Nov 2026, the maintainer's word on #176: Wellington, Phoebe,
 * Bridget and Calvin, each with the crew's own icon, a "WaterBots agent" tag and one line in their
 * voice (src/lib/supporters.ts). They are tagged so no one takes them for a person's entry, and the
 * reclining Wellington from her concept note sits beside the heading, as on the Commons.
 *
 * HONEST STATES. With no approved person yet, the people's part says "No people are shown yet." — no
 * sample cards, no placeholder names, ever. A list that cannot be read says so; it is never shown as empty.
 *
 * NO BLUE BUTTON OF ITS OWN (src/lib/blue.ts): the page has no next step, so the menu's Sign up stays
 * the blue one. The Register your interest box is the rail's tinted one.
 */

import { useEffect, useMemo, useState } from 'react';
import { pathForInterest } from '../lib/pages';
import {
  OFF_THE_PAGE_LINE,
  ROLES,
  SUPPORTERS_INTRO,
  fetchSupporters,
  joinedWords,
  roleLabel,
  type ShownSupporter,
  type SupportersReading,
} from '../lib/supporters';
import { InterestIcon } from './NavRail';
import { Portrait } from './CommonsShelf';
import WellingtonLeaning from './WellingtonLeaning';
import { crewMember } from '../lib/crew';
import { AGENT_SUPPORTERS, AGENT_TAG } from '../lib/supporters';

type Loading = { kind: 'loading' };

export default function SupportersPage({ shown, onInterest }: { shown: boolean; onInterest?: () => void }) {
  const [reading, setReading] = useState<SupportersReading | Loading>({ kind: 'loading' });
  const [role, setRole] = useState<string>('all');

  /* Read the list each time the page is opened, so an approval shows on the next visit. */
  useEffect(() => {
    if (!shown) return;
    const controller = new AbortController();
    setReading((r) => (r.kind === 'list' ? r : { kind: 'loading' }));
    void fetchSupporters(controller.signal).then((next) => {
      if (!controller.signal.aborted) setReading(next);
    });
    return () => controller.abort();
  }, [shown]);

  const supporters = reading.kind === 'list' ? reading.supporters : [];
  /* A role shows in the filter only when an approved entry has it; no counts. */
  const roles = useMemo(() => ROLES.filter((r) => supporters.some((s) => s.role === r.id)), [supporters]);
  const filter = roles.some((r) => r.id === role) ? role : 'all';
  const visible = filter === 'all' ? supporters : supporters.filter((s) => s.role === filter);

  return (
    <div className="wb-supporters" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px var(--gutter) 40px' }}>
        <div style={{ position: 'relative' }}>
          <div className="wb-supporters-head" style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: 24, margin: '0 0 6px', letterSpacing: '-0.015em', lineHeight: 1.25 }}>Supporters</h1>
            <p className="t-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
              {SUPPORTERS_INTRO}
            </p>
            <p className="t-caption" style={{ margin: '4px 0 18px', fontSize: 12.5, color: 'var(--ink-3)' }}>
              Each person's entry is shown with their permission.
            </p>
          </div>
          {/* Wellington, reclining — the figure from her concept note, as on the Commons
              (WellingtonLeaning.tsx). Decoration only; hidden on a phone, where the words need the room. */}
          <WellingtonLeaning className="wb-supporters-wellington" style={{ position: 'absolute', right: 0, top: -14, width: 128, height: 144, opacity: 0.35 }} />
        </div>

        {roles.length > 1 && (
          <div role="group" aria-label="Show supporters by role" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '0 0 16px' }}>
            {[{ id: 'all', label: 'All' }, ...roles].map((r) => (
              <button
                key={r.id}
                type="button"
                className="wb-chip"
                aria-pressed={filter === r.id}
                onClick={() => setRole(r.id)}
                style={filter === r.id ? { color: 'var(--ink)', borderColor: 'var(--ink-3)', background: 'var(--card)' } : undefined}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        <ul className="wb-supporter-grid">
          {/* The agents first, on "All"; a role filter shows people only. */}
          {filter === 'all' && AGENT_SUPPORTERS.map((a) => <AgentCard key={a.name} name={a.name} comment={a.comment} />)}
          {visible.map((s, i) => (
            <SupporterCard key={`${s.name}-${s.joined}-${i}`} supporter={s} />
          ))}
        </ul>

        {reading.kind === 'loading' && (
          <p role="status" className="t-body" style={{ fontSize: 14, color: 'var(--ink-2)', margin: '14px 0 0' }}>
            Loading the people who support this work…
          </p>
        )}
        {reading.kind === 'failed' && (
          <p role="alert" className="t-body" style={{ fontSize: 14, color: 'var(--state-pending)', margin: '14px 0 0' }}>
            {reading.message}
          </p>
        )}
        {reading.kind === 'list' && supporters.length === 0 && (
          <p className="t-body" style={{ fontSize: 14, color: 'var(--ink-2)', margin: '14px 0 0' }}>
            No people are shown yet.
          </p>
        )}

        <a
          className="wb-interest-cta"
          href={pathForInterest()}
          style={{ display: 'inline-flex', margin: '24px 0 10px' }}
          onClick={(e) => {
            if (!onInterest || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            onInterest();
          }}
        >
          <InterestIcon />
          Register your interest
        </a>
        <p className="t-caption" style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-3)' }}>
          {OFF_THE_PAGE_LINE}
        </p>
      </div>
    </div>
  );
}

/** One of the crew, as the board's first entries: the crew's icon, the name, the agent tag, one line in quotes. */
function AgentCard({ name, comment }: { name: string; comment: string }) {
  const agent = crewMember(name);
  return (
    <li className="wb-supporter-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Portrait token={agent.token}>
          <img src={agent.portrait} alt="" width={24} height={24} style={{ display: 'block' }} />
        </Portrait>
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1.35,
            color: agent.nameInAccent ? `var(${agent.textToken ?? agent.token})` : 'var(--ink)',
          }}
        >
          {agent.name}
        </span>
        <span className="wb-role-chip" style={{ marginLeft: 'auto' }}>
          {AGENT_TAG}
        </span>
      </div>
      <p style={{ margin: '10px 0 0', fontSize: 13.5, lineHeight: 1.55 }}>“{comment}”</p>
    </li>
  );
}

function SupporterCard({ supporter: s }: { supporter: ShownSupporter }) {
  const line = [s.title, s.organisation].filter((part) => part.trim() !== '').join(' · ');
  const joined = joinedWords(s.joined);
  return (
    <li className="wb-supporter-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, overflowWrap: 'anywhere' }}>{s.name}</span>
        <span className="wb-role-chip">{roleLabel(s.role)}</span>
      </div>
      {line && <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 2, overflowWrap: 'anywhere' }}>{line}</div>}
      {s.comment && (
        <p style={{ margin: '10px 0 0', fontSize: 13.5, lineHeight: 1.55, overflowWrap: 'anywhere' }}>“{s.comment}”</p>
      )}
      {joined && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 10 }}>Joined {joined}</div>}
    </li>
  );
}
