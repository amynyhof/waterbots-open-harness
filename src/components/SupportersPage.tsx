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
 * HONEST STATES. No sample cards and no placeholder names, ever: a person shows only once approved. A
 * list that cannot be read says so; it is never shown as empty.
 *
 * THE FORM IS ON THE PAGE, from 18 Nov 2026, her word on #176, in place of the Register your interest
 * box: name, email, organisation (optional), a short comment, and two boxes, both unticked. It saves
 * where Register your interest saves (src/lib/supporters.ts, sendPageForm). The lines "Each person's
 * entry is shown with their permission", "No people are shown yet" and "To be taken off this page"
 * are gone by the same word; the thank-you says how to change or remove an entry.
 *
 * ONE BLUE BUTTON (src/lib/blue.ts): the form's Send is the page's next step, so it is the blue one and
 * the menu's Sign up is quiet, as on the interest form.
 *
 * THE SECOND ROUND OF 18 NOV 2026, her word on #176:
 *   - the form is seen without scrolling: beside the heading on a laptop, right under it on a phone,
 *     with the cards below;
 *   - no approval step: a ticked "show" box puts the name and comment on the board at once, and the
 *     server sends the card back, so the sender sees it there straight away;
 *   - a clear thank-you: a heading with a mint check, in the form's own place, brought into view and
 *     given focus, so it is seen and read out. Before this it was one small line where the form had
 *     been, and the board did not change, so a send looked like nothing had happened;
 *   - a post the filter blocks (api/_postFilter.ts) says so in plain words under Send, nothing kept.
 */

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  NEWSLETTER_WORDS,
  SHOWN_NOW_LINE,
  SHOW_WORDS,
  SUPPORT_LIMITS,
  THANKS_HEAD,
  THANKS_LINE,
  sendPageForm,
  type PageForm,
  ROLES,
  SUPPORTERS_INTRO,
  fetchSupporters,
  joinedWords,
  roleLabel,
  type ShownSupporter,
  type SupportersReading,
} from '../lib/supporters';
import { Portrait } from './CommonsShelf';
import WellingtonLeaning from './WellingtonLeaning';
import { crewMember } from '../lib/crew';
import { AGENT_SUPPORTERS, AGENT_TAG } from '../lib/supporters';

type Loading = { kind: 'loading' };

export default function SupportersPage({ shown }: { shown: boolean }) {
  const [reading, setReading] = useState<SupportersReading | Loading>({ kind: 'loading' });
  const [role, setRole] = useState<string>('all');
  /* Cards sent from this page in this visit, shown at once, before the next read of the list. */
  const [added, setAdded] = useState<ShownSupporter[]>([]);

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

  const read = reading.kind === 'list' ? reading.supporters : [];
  const same = (a: ShownSupporter, b: ShownSupporter) => a.name === b.name && a.comment === b.comment && a.joined === b.joined;
  const supporters = [...added.filter((a) => !read.some((r) => same(a, r))), ...read];
  /* A role shows in the filter only when an entry on the page has it; no counts. */
  const roles = useMemo(() => ROLES.filter((r) => supporters.some((s) => s.role === r.id)), [supporters]);
  const filter = roles.some((r) => r.id === role) ? role : 'all';
  const visible = filter === 'all' ? supporters : supporters.filter((s) => s.role === filter);

  return (
    <div className="wb-supporters" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px var(--gutter) 40px' }}>
        {/* The heading and the form side by side on a laptop, the form right under the heading on a
            phone, so the form is seen without scrolling. The cards come below. */}
        <div className="wb-supporters-top">
          <div className="wb-supporters-head" style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: 24, margin: '0 0 6px', letterSpacing: '-0.015em', lineHeight: 1.25 }}>Supporters</h1>
            <p className="t-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
              {SUPPORTERS_INTRO}
            </p>
            {/* Wellington, reclining — the figure from her concept note, as on the Commons
                (WellingtonLeaning.tsx). Decoration only; hidden on a phone, where the form needs the room. */}
            <WellingtonLeaning className="wb-supporters-wellington" style={{ marginTop: 18, width: 128, height: 144, opacity: 0.35 }} />
          </div>
          <SupportForm onShown={(card) => setAdded((list) => [card, ...list])} />
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

      </div>
    </div>
  );
}

const EMPTY: PageForm = { name: '', email: '', organisation: '', comment: '', show: false, newsletter: false, website: '' };

type SendState = { kind: 'idle' } | { kind: 'sending' } | { kind: 'kept'; shown: boolean } | { kind: 'failed'; message: string };

/** The form, on the page. Nothing is said to be kept until the server says it was. */
function SupportForm({ onShown }: { onShown: (card: ShownSupporter) => void }) {
  const [form, setForm] = useState<PageForm>(EMPTY);
  const [state, setState] = useState<SendState>({ kind: 'idle' });
  const thanks = useRef<HTMLDivElement>(null);
  const busy = state.kind === 'sending';
  const ready = form.name.trim() !== '' && form.email.trim() !== '';

  /* The thank-you is brought into view and given focus, so it is seen and read out. */
  useEffect(() => {
    if (state.kind !== 'kept' || !thanks.current) return;
    thanks.current.focus({ preventScroll: true });
    thanks.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [state.kind]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ready || busy) return;
    setState({ kind: 'sending' });
    try {
      const { shown } = await sendPageForm(form);
      if (shown) onShown(shown);
      setState({ kind: 'kept', shown: Boolean(shown) });
    } catch (error) {
      setState({ kind: 'failed', message: error instanceof Error ? error.message : 'That was not kept. Try again.' });
    }
  }

  return (
    <section className="wb-support-form" aria-label="Add your support">
      <h2 style={{ fontSize: 17, margin: '0 0 12px', lineHeight: 1.3 }}>Add your support</h2>
      {state.kind === 'kept' ? (
        <div ref={thanks} role="status" tabIndex={-1} className="wb-support-thanks">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="wb-support-thanks-mark" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.35 }}>{THANKS_HEAD}</span>
          </div>
          <p className="t-body" style={{ margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.55 }}>
            {state.shown && <>{SHOWN_NOW_LINE} </>}
            {THANKS_LINE}
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <div className="wb-support-form-grid">
            <Field label="Name">
              <input className="wb-form-input" type="text" autoComplete="name" value={form.name} maxLength={80} disabled={busy} required onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Email">
              <input className="wb-form-input" type="email" autoComplete="email" value={form.email} maxLength={254} disabled={busy} required onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
          </div>
          <Field label="Organization (optional)">
            <input className="wb-form-input" type="text" autoComplete="organization" value={form.organisation} maxLength={120} disabled={busy} onChange={(e) => setForm({ ...form, organisation: e.target.value })} />
          </Field>
          <Field label={`A short comment (up to ${SUPPORT_LIMITS.comment} characters, no links)`}>
            <textarea className="wb-form-input" rows={2} value={form.comment} maxLength={SUPPORT_LIMITS.comment} disabled={busy} onChange={(e) => setForm({ ...form, comment: e.target.value })} style={{ resize: 'vertical' }} />
          </Field>

          {/* The hidden field: off the screen and out of the tab order, so a person never fills it. */}
          <div aria-hidden style={{ position: 'absolute', left: -10000, width: 1, height: 1, overflow: 'hidden' }}>
            <label>
              Website
              <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </label>
          </div>

          <label className="wb-form-check">
            <input type="checkbox" checked={form.show} disabled={busy} onChange={(e) => setForm({ ...form, show: e.target.checked })} />
            {SHOW_WORDS}
          </label>
          <label className="wb-form-check" style={{ marginBottom: 14 }}>
            <input type="checkbox" checked={form.newsletter} disabled={busy} onChange={(e) => setForm({ ...form, newsletter: e.target.checked })} />
            {NEWSLETTER_WORDS}
          </label>

          <button type="submit" className="btn btn-primary wb-form-send" disabled={!ready || busy} aria-busy={busy || undefined}>
            {busy ? 'Sending…' : 'Send'}
          </button>
          {state.kind === 'failed' && (
            <p role="alert" style={{ margin: '10px 0 0', fontSize: 13, lineHeight: 1.5, color: 'var(--state-pending)' }}>
              {state.message}
            </p>
          )}
        </form>
      )}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <span className="wb-form-label">{label}</span>
      {children}
    </label>
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
        {roleLabel(s.role) && <span className="wb-role-chip">{roleLabel(s.role)}</span>}
      </div>
      {line && <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 2, overflowWrap: 'anywhere' }}>{line}</div>}
      {s.comment && (
        <p style={{ margin: '10px 0 0', fontSize: 13.5, lineHeight: 1.55, overflowWrap: 'anywhere' }}>“{s.comment}”</p>
      )}
      {joined && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 10 }}>Joined {joined}</div>}
    </li>
  );
}
