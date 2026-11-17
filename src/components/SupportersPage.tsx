/**
 * Supporters — a page at /supporters, under the site menu. Approved 16 Nov 2026, the maintainer's
 * word on #176 (docs/proposals/supporters-2026-11-16.md).
 *
 * ONLY WHAT SHE APPROVED. The page reads the shown list (api/supporters.ts) and draws a card for each
 * real, approved entry: the name as typed, the role, the title and organisation when given, the
 * comment in quotes as written, and the month it was approved. Nothing waiting or declined is ever
 * read, and no email is ever sent to the page.
 *
 * HONEST STATES. Empty says "No supporters are shown yet." — no sample cards, no placeholder names,
 * ever. A list that cannot be read says so; it is never shown as empty.
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
        <h1 style={{ fontSize: 24, margin: '0 0 6px', letterSpacing: '-0.015em', lineHeight: 1.25 }}>Supporters</h1>
        <p className="t-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
          {SUPPORTERS_INTRO}
        </p>
        <p className="t-caption" style={{ margin: '4px 0 18px', fontSize: 12.5, color: 'var(--ink-3)' }}>
          Each entry is shown with the person's permission.
        </p>

        {reading.kind === 'loading' && (
          <p role="status" className="t-body" style={{ fontSize: 14, color: 'var(--ink-2)' }}>
            Loading the supporters…
          </p>
        )}

        {reading.kind === 'failed' && (
          <p role="alert" className="t-body" style={{ fontSize: 14, color: 'var(--state-pending)' }}>
            {reading.message}
          </p>
        )}

        {reading.kind === 'list' && supporters.length === 0 && (
          <p className="t-body" style={{ fontSize: 14.5 }}>
            No supporters are shown yet.
          </p>
        )}

        {reading.kind === 'list' && supporters.length > 0 && (
          <>
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
              {visible.map((s, i) => (
                <SupporterCard key={`${s.name}-${s.joined}-${i}`} supporter={s} />
              ))}
            </ul>
          </>
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
