/**
 * Supporters — a page at /supporters, under the site menu. Approved 16 Nov 2026, the maintainer's
 * word on #176 (docs/proposals/supporters-2026-11-16.md), and changed by her word since.
 *
 * THE BOARD. The agents come first (18 Nov 2026): Wellington, Phoebe, Bridget and Calvin, each with
 * the crew's own icon, a "WaterBots agent" tag and one line in their voice (src/lib/supporters.ts).
 * Then the people's posts, newest first, read from the shown list (api/supporters.ts): the name as
 * typed, the comment in quotes as written, and the month it went on. No email ever reaches the page.
 *
 * HONEST STATES. No sample cards and no placeholder names, ever. A list that cannot be read says so;
 * it is never shown as empty.
 *
 * THE FORM, beside the heading on a laptop and right under it on a phone, so it is seen without
 * scrolling (18 Nov 2026). FROM 19 NOV 2026, HER WORD ON #176, the supporters page is the one place to
 * post, and there is no box to tick:
 *   - name, email, a role and a comment are needed; a title, the organisation and the newsletter box
 *     (unticked) are not. The role is one of six, picked once, each with its own colour on the card;
 *     under the name the card shows "Title, Organization", whichever is filled in (19 Nov 2026);
 *   - the button is "Post", and it opens a pop-up with Wellington's icon and her words, "Everything
 *     except your email will show on this page." (21 Nov 2026), with "Post" and "Go back". Post
 *     puts it on the board at once, after the server's filter (api/_postFilter.ts);
 *   - the poster can edit and delete their own post: this browser remembers it and shows Edit and
 *     Delete on their card, and an email carries a private link that does the same from anywhere.
 *     The link's key rides after the #, so it never reaches a server log; the page reads it, keeps it
 *     in this browser, and takes it out of the address. An edit can change every field the card shows,
 *     the role among them, and passes the same filter.
 *   - "Questions? hello@waterbots.ai" at the foot of the page.
 *
 * ONE BLUE BUTTON (src/lib/blue.ts): the form's Post is the page's next step; in a pop-up, the pop-up's
 * own yes is the blue one.
 */

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  AGENT_SUPPORTERS,
  AGENT_TAG,
  CONFIRM_WORDS,
  NEWSLETTER_WORDS,
  QUESTIONS_ADDRESS,
  QUESTIONS_WORDS,
  ROLES,
  SUPPORTERS_INTRO,
  SUPPORT_LIMITS,
  THANKS_EDIT_LINE,
  THANKS_HEAD,
  THANKS_NO_MAIL_LINE,
  deletePost,
  editPost,
  fetchSupporters,
  forgetPost,
  joinedWords,
  ownPostFromHash,
  ownPosts,
  rememberPost,
  roleLabel,
  sendPageForm,
  type OwnPost,
  type PageForm,
  type PostFields,
  type Posted,
  type ShownSupporter,
  type SupportersReading,
} from '../lib/supporters';
import { Portrait } from './CommonsShelf';
import WellingtonLeaning from './WellingtonLeaning';
import { crewMember } from '../lib/crew';

type Loading = { kind: 'loading' };

export default function SupportersPage({ shown }: { shown: boolean }) {
  const [reading, setReading] = useState<SupportersReading | Loading>({ kind: 'loading' });
  const [role, setRole] = useState<string>('all');
  /* Posts made in this visit, on the board at once, before the next read of the list. */
  const [added, setAdded] = useState<ShownSupporter[]>([]);
  /* Posts this visitor edited or deleted in this visit. */
  const [edited, setEdited] = useState<Record<string, ShownSupporter>>({});
  const [removed, setRemoved] = useState<string[]>([]);
  /* The posts this browser remembers, with their private keys. */
  const [own, setOwn] = useState<OwnPost[]>([]);
  /* A post opened from its email link, to bring into view once the list is read. */
  const [opened, setOpened] = useState<string | null>(null);
  const [openedNote, setOpenedNote] = useState('');

  /* Read the list each time the page is opened; read this browser's posts and any link from an email. */
  useEffect(() => {
    if (!shown) return;
    const fromLink = ownPostFromHash(window.location.hash);
    if (fromLink) {
      rememberPost(fromLink);
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
      setOpened(fromLink.id);
    }
    setOwn(ownPosts());
    const controller = new AbortController();
    setReading((r) => (r.kind === 'list' ? r : { kind: 'loading' }));
    void fetchSupporters(controller.signal).then((next) => {
      if (!controller.signal.aborted) setReading(next);
    });
    return () => controller.abort();
  }, [shown]);

  const supporters = useMemo(() => {
    const read = reading.kind === 'list' ? reading.supporters : [];
    return [...added.filter((a) => !read.some((r) => r.id === a.id)), ...read]
      .filter((s) => !removed.includes(s.id))
      .map((s) => edited[s.id] ?? s);
  }, [reading, added, edited, removed]);

  /* The post from the email link, brought into view; or a plain line when it is not on the page. */
  useEffect(() => {
    if (!opened || reading.kind !== 'list') return;
    const card = document.querySelector(`[data-post="${opened}"]`);
    if (card) {
      card.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setOpenedNote('');
    } else {
      setOpenedNote('The post from your link is no longer on this page.');
    }
    setOpened(null);
  }, [opened, reading.kind]);

  /* A role shows in the filter only when an entry on the page has it; no counts. */
  const roles = useMemo(() => ROLES.filter((r) => supporters.some((s) => s.role === r.id)), [supporters]);
  const filter = roles.some((r) => r.id === role) ? role : 'all';
  const visible = filter === 'all' ? supporters : supporters.filter((s) => s.role === filter);

  function onPosted(posted: Posted) {
    rememberPost(posted.own);
    /* Held here too, so Edit and Delete show even where the browser's storage is blocked. */
    setOwn((list) => [posted.own, ...list.filter((p) => p.id !== posted.own.id)]);
    setAdded((list) => [posted.shown, ...list]);
  }

  function onDeleted(id: string) {
    forgetPost(id);
    setOwn((list) => list.filter((p) => p.id !== id));
    setRemoved((list) => [...list, id]);
  }

  return (
    <div className="wb-supporters" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px var(--gutter) 32px' }}>
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
          <SupportForm onPosted={onPosted} />
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

        {openedNote && (
          <p role="status" className="t-body" style={{ fontSize: 14, color: 'var(--ink-2)', margin: '0 0 14px' }}>
            {openedNote}
          </p>
        )}

        <ul className="wb-supporter-grid">
          {/* The agents first, on "All"; a role filter shows people only. */}
          {filter === 'all' && AGENT_SUPPORTERS.map((a) => <AgentCard key={a.name} name={a.name} comment={a.comment} />)}
          {visible.map((s) => (
            <SupporterCard
              key={s.id}
              supporter={s}
              own={own.find((p) => p.id === s.id)}
              onEdited={(card) => setEdited((map) => ({ ...map, [card.id]: card }))}
              onDeleted={() => onDeleted(s.id)}
            />
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

        <p className="wb-supporters-foot">
          {QUESTIONS_WORDS} <a href={`mailto:${QUESTIONS_ADDRESS}`}>{QUESTIONS_ADDRESS}</a>
        </p>
      </div>
    </div>
  );
}

const EMPTY: PageForm = { name: '', email: '', title: '', organisation: '', role: '', comment: '', newsletter: false, website: '' };

type PostState =
  | { kind: 'idle' }
  | { kind: 'confirm' }
  | { kind: 'sending' }
  | { kind: 'kept'; mailed: boolean }
  | { kind: 'failed'; message: string };

/** The form, on the page. Nothing is said to be posted until the server says it was. */
function SupportForm({ onPosted }: { onPosted: (posted: Posted) => void }) {
  const [form, setForm] = useState<PageForm>(EMPTY);
  const [state, setState] = useState<PostState>({ kind: 'idle' });
  const thanks = useRef<HTMLDivElement>(null);
  const postButton = useRef<HTMLButtonElement>(null);
  const busy = state.kind === 'sending';
  const ready = form.name.trim() !== '' && form.email.trim() !== '' && form.role !== '' && form.comment.trim() !== '';

  /* The thank-you is brought into view and given focus, so it is seen and read out. */
  useEffect(() => {
    if (state.kind !== 'kept' || !thanks.current) return;
    thanks.current.focus({ preventScroll: true });
    thanks.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [state.kind]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ready || busy) return;
    setState({ kind: 'confirm' });
  }

  async function post() {
    setState({ kind: 'sending' });
    try {
      const posted = await sendPageForm(form);
      onPosted(posted);
      setState({ kind: 'kept', mailed: posted.mailed });
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
            {state.mailed ? THANKS_EDIT_LINE : THANKS_NO_MAIL_LINE}
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <div className="wb-support-form-grid">
            <Field label="Name">
              <input className="wb-form-input" type="text" autoComplete="name" value={form.name} maxLength={SUPPORT_LIMITS.name} disabled={busy} required onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Email">
              <input className="wb-form-input" type="email" autoComplete="email" value={form.email} maxLength={254} disabled={busy} required onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
          </div>
          <div className="wb-support-form-grid">
            <Field label="Title (optional)">
              <input className="wb-form-input" type="text" autoComplete="organization-title" value={form.title} maxLength={SUPPORT_LIMITS.title} disabled={busy} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Organization (optional)">
              <input className="wb-form-input" type="text" autoComplete="organization" value={form.organisation} maxLength={SUPPORT_LIMITS.organisation} disabled={busy} onChange={(e) => setForm({ ...form, organisation: e.target.value })} />
            </Field>
          </div>
          <Field label="Your role (pick one)">
            <RolePick value={form.role} disabled={busy} onChange={(role) => setForm({ ...form, role })} />
          </Field>
          <Field label={`A short comment (up to ${SUPPORT_LIMITS.comment} characters, no links)`}>
            <textarea className="wb-form-input" rows={2} value={form.comment} maxLength={SUPPORT_LIMITS.comment} disabled={busy} required onChange={(e) => setForm({ ...form, comment: e.target.value })} style={{ resize: 'vertical' }} />
          </Field>

          {/* The hidden field: off the screen and out of the tab order, so a person never fills it. */}
          <div aria-hidden style={{ position: 'absolute', left: -10000, width: 1, height: 1, overflow: 'hidden' }}>
            <label>
              Website
              <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </label>
          </div>

          <label className="wb-form-check" style={{ marginBottom: 14 }}>
            <input type="checkbox" checked={form.newsletter} disabled={busy} onChange={(e) => setForm({ ...form, newsletter: e.target.checked })} />
            {NEWSLETTER_WORDS}
          </label>

          <button ref={postButton} type="submit" className="btn btn-primary wb-form-send" disabled={!ready || busy} aria-busy={busy || undefined}>
            Post
          </button>
          {state.kind === 'failed' && (
            <p role="alert" style={{ margin: '10px 0 0', fontSize: 13, lineHeight: 1.5, color: 'var(--state-pending)' }}>
              {state.message}
            </p>
          )}
        </form>
      )}

      {(state.kind === 'confirm' || state.kind === 'sending') && (
        <Confirm
          words={CONFIRM_WORDS}
          yes="Post"
          busyYes="Posting…"
          busy={busy}
          onYes={() => void post()}
          onNo={() => {
            setState({ kind: 'idle' });
            postButton.current?.focus();
          }}
        />
      )}
    </section>
  );
}

/**
 * The pop-up: Wellington's icon, the words, a "Go back" and a yes. It wears the site's one modal style
 * (21 Nov 2026, her word on #176): BRAND.md §2.3's floating plane, a card with its hairline and §4's
 * modal shadow, as the map's Data & licences panel (LicencePanel.tsx) wears it, over the same veil. The yes takes the focus; Escape and
 * "Go back" close it; Tab stays inside it while it is open.
 */
function Confirm({
  words,
  yes,
  busyYes,
  busy,
  onYes,
  onNo,
}: {
  words: string;
  yes: string;
  busyYes: string;
  busy: boolean;
  onYes: () => void;
  onNo: () => void;
}) {
  const wellington = crewMember('Wellington');
  const box = useRef<HTMLDivElement>(null);
  const yesButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    yesButton.current?.focus();
  }, []);

  return (
    <div
      className="wb-confirm-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onNo();
      }}
    >
      <div
        ref={box}
        className="wb-confirm card card-document"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wb-confirm-words"
        onKeyDown={(e) => {
          if (e.key === 'Escape' && !busy) {
            e.preventDefault();
            onNo();
          }
          if (e.key === 'Tab' && box.current) {
            const buttons = [...box.current.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
            if (buttons.length === 0) return;
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <Portrait token={wellington.token}>
            <img src={wellington.portrait} alt="Wellington" width={24} height={24} style={{ display: 'block' }} />
          </Portrait>
          <p id="wb-confirm-words" style={{ margin: '2px 0 0', fontSize: 15, lineHeight: 1.55 }}>
            {words}
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
          <button type="button" className="btn" disabled={busy} onClick={onNo}>
            Go back
          </button>
          <button ref={yesButton} type="button" className="btn btn-primary" disabled={busy} aria-busy={busy || undefined} onClick={onYes}>
            {busy ? busyYes : yes}
          </button>
        </div>
      </div>
    </div>
  );
}

/** The role, one of six, required: a list to pick from, empty until a role is picked. */
function RolePick({ value, disabled, onChange }: { value: string; disabled: boolean; onChange: (role: string) => void }) {
  return (
    <select className="wb-form-input" value={value} disabled={disabled} required onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>
        Choose a role
      </option>
      {ROLES.map((r) => (
        <option key={r.id} value={r.id}>
          {r.label}
        </option>
      ))}
    </select>
  );
}

/** A person's role, as a small tag in the role's own colour (base.css, .wb-role-chip[data-role]). */
function RoleTag({ role }: { role: string }) {
  const label = roleLabel(role);
  return label ? (
    <span className="wb-role-chip" data-role={role}>
      {label}
    </span>
  ) : null;
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

type CardState = { kind: 'view' } | { kind: 'edit' } | { kind: 'saving' } | { kind: 'confirm-delete' } | { kind: 'deleting' };

/** A person's post. Its own poster sees Edit and Delete on it. */
function SupporterCard({
  supporter: s,
  own,
  onEdited,
  onDeleted,
}: {
  supporter: ShownSupporter;
  own?: OwnPost;
  onEdited: (card: ShownSupporter) => void;
  onDeleted: () => void;
}) {
  const [state, setState] = useState<CardState>({ kind: 'view' });
  const fromCard = (): PostFields => ({
    name: s.name,
    title: s.title,
    organisation: s.organisation,
    /* A role from the first list that is not on the new one is picked again. */
    role: ROLES.some((r) => r.id === s.role) ? s.role : '',
    comment: s.comment,
  });
  const [fields, setFields] = useState<PostFields>(fromCard);
  const [message, setMessage] = useState('');
  /* Under the name: "Title, Organization", whichever is filled in. */
  const line = [s.title, s.organisation].filter((part) => part.trim() !== '').join(', ');
  const joined = joinedWords(s.joined);
  const editing = state.kind === 'edit' || state.kind === 'saving';

  async function save() {
    if (!own) return;
    setState({ kind: 'saving' });
    setMessage('');
    try {
      onEdited(await editPost(own, fields));
      setState({ kind: 'view' });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'That did not change. Try again.');
      setState({ kind: 'edit' });
    }
  }

  async function remove() {
    if (!own) return;
    setState({ kind: 'deleting' });
    setMessage('');
    try {
      await deletePost(own);
      onDeleted();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'That was not deleted. Try again.');
      setState({ kind: 'view' });
    }
  }

  return (
    <li className="wb-supporter-card" data-post={s.id}>
      {editing ? (
        <div>
          <Field label="Name">
            <input className="wb-form-input" type="text" value={fields.name} maxLength={SUPPORT_LIMITS.name} disabled={state.kind === 'saving'} onChange={(e) => setFields({ ...fields, name: e.target.value })} />
          </Field>
          <Field label="Title (optional)">
            <input className="wb-form-input" type="text" value={fields.title} maxLength={SUPPORT_LIMITS.title} disabled={state.kind === 'saving'} onChange={(e) => setFields({ ...fields, title: e.target.value })} />
          </Field>
          <Field label="Organization (optional)">
            <input className="wb-form-input" type="text" value={fields.organisation} maxLength={SUPPORT_LIMITS.organisation} disabled={state.kind === 'saving'} onChange={(e) => setFields({ ...fields, organisation: e.target.value })} />
          </Field>
          <Field label="Your role (pick one)">
            <RolePick value={fields.role} disabled={state.kind === 'saving'} onChange={(role) => setFields({ ...fields, role })} />
          </Field>
          <Field label={`Comment (up to ${SUPPORT_LIMITS.comment} characters, no links)`}>
            <textarea className="wb-form-input" rows={3} value={fields.comment} maxLength={SUPPORT_LIMITS.comment} disabled={state.kind === 'saving'} onChange={(e) => setFields({ ...fields, comment: e.target.value })} style={{ resize: 'vertical' }} />
          </Field>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn wb-own-button" disabled={state.kind === 'saving' || !fields.name.trim() || !fields.role || !fields.comment.trim()} onClick={() => void save()}>
              {state.kind === 'saving' ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className="btn wb-own-button"
              disabled={state.kind === 'saving'}
              onClick={() => {
                setFields(fromCard());
                setMessage('');
                setState({ kind: 'view' });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, overflowWrap: 'anywhere' }}>{s.name}</span>
            <RoleTag role={s.role} />
          </div>
          {line && <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 2, overflowWrap: 'anywhere' }}>{line}</div>}
          {s.comment && <p style={{ margin: '10px 0 0', fontSize: 13.5, lineHeight: 1.55, overflowWrap: 'anywhere' }}>“{s.comment}”</p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {joined && <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Joined {joined}</span>}
            {own && (
              <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="btn wb-own-button"
                  disabled={state.kind === 'deleting'}
                  onClick={() => {
                    setFields(fromCard());
                    setMessage('');
                    setState({ kind: 'edit' });
                  }}
                >
                  Edit
                </button>
                <button type="button" className="btn wb-own-button" disabled={state.kind === 'deleting'} onClick={() => setState({ kind: 'confirm-delete' })}>
                  Delete
                </button>
              </span>
            )}
          </div>
        </>
      )}
      {message && (
        <p role="alert" style={{ margin: '10px 0 0', fontSize: 13, lineHeight: 1.5, color: 'var(--state-pending)' }}>
          {message}
        </p>
      )}
      {(state.kind === 'confirm-delete' || state.kind === 'deleting') && (
        <Confirm
          words="Delete your post? It comes off this page and cannot be brought back."
          yes="Delete"
          busyYes="Deleting…"
          busy={state.kind === 'deleting'}
          onYes={() => void remove()}
          onNo={() => setState({ kind: 'view' })}
        />
      )}
    </li>
  );
}
