/**
 * Register your interest — a page at /interest, under the site menu.
 *
 * THE MAINTAINER'S PLAN OF 14 Nov 2026 (round 3, ruling 4), restated in
 * docs/proposals/queued-round-2026-11-16.md and approved on 16 Nov 2026, with
 * her ruling on keeping: **no time limit; a sign-up is kept until the person
 * asks to be removed, and the form says how to ask. Nothing deletes on its
 * own.** The keeping line under the form says so, and the box says how.
 *
 * Name, organisation, email, what interests you, and a box, unticked, to agree
 * that the details are kept. Opened from a Commons "Coming soon" row, the
 * module is already chosen and named. A hidden field only a robot fills. The
 * Send button is the one blue button on this page (src/lib/blue.ts).
 *
 * HONEST STATES. Nothing is said to be kept until the server says it was; a
 * failure says it was not kept and what to do. No pretend progress.
 */

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { SHELF } from '../lib/commonsShelf';
import {
  CONSENT_WORDS,
  INTEREST_LIMITS,
  INTERESTS,
  InterestError,
  KEEPING_LINE,
  sendInterest,
  type InterestForm,
} from '../lib/interest';

const EMPTY: InterestForm = {
  name: '',
  organisation: '',
  email: '',
  interests: [],
  module: '',
  consent: false,
  website: '',
};

type SendState = { kind: 'idle' } | { kind: 'sending' } | { kind: 'kept' } | { kind: 'failed'; message: string };

/** The module named in the address, if it is one on the Commons shelf. */
function moduleFromSearch(search: string): string {
  const slug = new URLSearchParams(search).get('module') ?? '';
  return SHELF.some((card) => card.slug === slug) ? slug : '';
}

export default function InterestPage({ shown }: { shown: boolean }) {
  const [form, setForm] = useState<InterestForm>(EMPTY);
  const [state, setState] = useState<SendState>({ kind: 'idle' });

  /* Each time the page is opened, read the module from the address. A module
     from the Commons ticks the Agent Commons for the visitor; they may untick it. */
  useEffect(() => {
    if (!shown) return;
    const module = moduleFromSearch(window.location.search);
    setForm((f) => ({
      ...f,
      module,
      interests: module && !f.interests.includes('commons') ? [...f.interests, 'commons'] : f.interests,
    }));
  }, [shown]);

  const moduleTitle = useMemo(() => SHELF.find((card) => card.slug === form.module)?.title ?? '', [form.module]);
  const busy = state.kind === 'sending';
  const ready =
    form.name.trim() !== '' &&
    form.organisation.trim() !== '' &&
    form.email.trim() !== '' &&
    form.interests.length > 0 &&
    form.consent;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ready || busy) return;
    setState({ kind: 'sending' });
    try {
      await sendInterest(form);
      setState({ kind: 'kept' });
    } catch (error) {
      setState({
        kind: 'failed',
        message: error instanceof InterestError ? error.message : 'That was not kept. Try again.',
      });
    }
  }

  const toggle = (id: string) =>
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(id) ? f.interests.filter((x) => x !== id) : [...f.interests, id],
    }));

  return (
    <div className="wb-interest" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '28px var(--gutter) 40px' }}>
        <h1 style={{ fontSize: 24, margin: '0 0 6px', letterSpacing: '-0.015em', lineHeight: 1.25 }}>
          Register your interest
        </h1>
        <p className="t-body" style={{ margin: '0 0 20px', fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
          Tell us who you are and what you would like to hear about. The WaterBots team will be in touch.
        </p>

        {state.kind === 'kept' ? (
          <p role="status" className="t-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55 }}>
            Thank you. Your details were kept. To be removed, write to hello@waterbots.ai.
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            {moduleTitle && (
              <p className="t-caption" style={{ margin: '0 0 14px', fontSize: 12.5, color: 'var(--ink-2)' }}>
                About: {moduleTitle}, on the Agent Commons.
              </p>
            )}

            <Field label="Your name">
              <input
                className="wb-form-input"
                type="text"
                autoComplete="name"
                value={form.name}
                maxLength={INTEREST_LIMITS.name}
                disabled={busy}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Organisation">
              <input
                className="wb-form-input"
                type="text"
                autoComplete="organization"
                value={form.organisation}
                maxLength={INTEREST_LIMITS.organisation}
                disabled={busy}
                onChange={(e) => setForm({ ...form, organisation: e.target.value })}
              />
            </Field>
            <Field label="Email">
              <input
                className="wb-form-input"
                type="email"
                autoComplete="email"
                value={form.email}
                maxLength={INTEREST_LIMITS.email}
                disabled={busy}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>

            <fieldset style={{ border: 0, margin: '4px 0 16px', padding: 0 }}>
              <legend className="wb-form-label">What interests you</legend>
              {INTERESTS.map((interest) => (
                <label key={interest.id} className="wb-form-check">
                  <input
                    type="checkbox"
                    checked={form.interests.includes(interest.id)}
                    disabled={busy}
                    onChange={() => toggle(interest.id)}
                  />
                  {interest.label}
                </label>
              ))}
            </fieldset>

            {/* The hidden field: off the screen and out of the tab order, so a
                person never fills it. A filled one is dropped by the server. */}
            <div aria-hidden style={{ position: 'absolute', left: -10000, width: 1, height: 1, overflow: 'hidden' }}>
              <label>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </label>
            </div>

            <label className="wb-form-check" style={{ alignItems: 'flex-start', marginBottom: 16 }}>
              <input
                type="checkbox"
                checked={form.consent}
                disabled={busy}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                style={{ marginTop: 3 }}
              />
              {CONSENT_WORDS}
            </label>

            <button type="submit" className="btn btn-primary wb-form-send" disabled={!ready || busy} aria-busy={busy || undefined}>
              {busy ? 'Sending…' : 'Send'}
            </button>
            {state.kind === 'failed' && (
              <p role="alert" style={{ margin: '10px 0 0', fontSize: 13, lineHeight: 1.5, color: 'var(--state-pending)' }}>
                {state.message}
              </p>
            )}

            <p className="t-caption" style={{ margin: '18px 0 0', fontSize: 12, lineHeight: 1.5, color: 'var(--ink-3)' }}>
              {KEEPING_LINE}
            </p>
          </form>
        )}
      </div>
    </div>
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
