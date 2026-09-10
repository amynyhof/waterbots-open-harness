/**
 * The Agent Commons' right column — the crew, and the way to a project.
 * Item S18, slice 2, built 11 Sep 2026 to the approved picture.
 *
 * THE CREW STAYS IN THE RIGHT COLUMN, as it does on every console step, but
 * here it is a listing and not a set of doors: on the Commons an agent is
 * opened from its pack's card (slice 3), and a crew row that quietly left
 * the Commons for the console would be a side door nobody asked for. The
 * rows take the crew row's static form — same look, no hand cursor.
 *
 * WHERE THE SAVE BUTTON SITS ON THE CONSOLE, THE SIGN-UP DOOR SITS HERE. The
 * Commons holds no visit, so there is nothing to save; the one primary
 * action on this page is the plain link to production, in the book's §7
 * primary, with one caption under it saying what is and is not kept. The
 * wording is the approved picture's, in a visitor's words: what happens,
 * never how.
 *
 * NO NEXT STEPS. Rows derive from a visit, and the Commons has none.
 */

import { CREW } from '../lib/crew';
import { SITE_LABEL, SITE_URL } from '../lib/site';
import CrewRow from './CrewRow';

export default function CommonsRail() {
  return (
    <aside
      className="chrome"
      aria-label="The crew"
      style={{
        width: 'var(--chat-rail)',
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid var(--line)',
        borderBottom: 0,
        minHeight: 0,
      }}
    >
      <div
        className="t-mono"
        style={{
          fontSize: 10.5,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
          padding: '18px 18px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span aria-hidden style={{ width: 22, height: 1, background: 'var(--ink-4)' }} />
        The crew
      </div>

      <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {CREW.map((member) => (
          <CrewRow key={member.name} member={member} />
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ flex: 'none', padding: '12px 18px 16px', borderTop: '1px solid var(--line)' }}>
        <a
          className="wb-save-button"
          href={SITE_URL}
          style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
        >
          Sign up to manage a project
        </a>
        <p className="t-caption" style={{ margin: '8px 0 0', fontSize: 10.5, lineHeight: 1.55 }}>
          Free to explore, and nothing is kept between visits. Signing up opens a project on{' '}
          {SITE_LABEL}, where the crew keeps what you tell them.
        </p>
      </div>
    </aside>
  );
}
