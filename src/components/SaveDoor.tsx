/**
 * THE SAVE DOOR — the maintainer's word of 21 Nov 2026. The site menu has
 * Sign in and ONE button beside it, on a laptop and on a phone. It says
 * "Sign up" until something is on the record; then it becomes "Save and sign
 * up", which saves the visit and takes the visitor to waterbots.ai to sign up.
 * There is no other Save button: the one that sat under the crew in the right
 * panel, and the phone's bar above the chat box before it, are gone.
 *
 * THE BOX THAT SENDS THE PROJECT TO THE TEAM goes with Save, so it sits in the
 * menu too, on a line under the button, whenever a path is ruled out. Nothing
 * is sent until Save is pressed, and then only with it.
 *
 * ONE BLUE BUTTON AT A TIME (src/lib/blue.ts, 16 Nov 2026): the menu's button
 * is solid blue when it is the one next step, as Sign up or as Save; when a
 * "Meet …" button or a form's Send comes first, it keeps its place and words,
 * drawn quiet.
 */

import { MAX_HUMAN_NOTE_CHARS, type PersonAsk, type SealState } from '../lib/handoff';

export interface SaveDoor {
  /** Something is on the record, so there is a project to save. */
  show: boolean;
  sealing: SealState;
  onSeal: () => void;
  /** A path is ruled out: the box to send the project to the team shows. */
  showPerson: boolean;
  person: PersonAsk;
  onPerson: (next: PersonAsk) => void;
}

/** The menu's one button once something is on the record. Its waiting words are short, so the row never wraps. */
export function MenuSave({ save, blue }: { save: SaveDoor; blue: boolean }) {
  const { sealing } = save;
  const busy = sealing.kind === 'sealing' || sealing.kind === 'sealed';
  return (
    <button
      type="button"
      className={`wb-site-menu-link wb-site-menu-signup wb-site-menu-save${blue ? '' : ' is-quiet'}`}
      onClick={save.onSeal}
      disabled={busy}
      aria-busy={sealing.kind === 'sealing' || undefined}
    >
      {sealing.kind === 'sealing' && 'Saving…'}
      {sealing.kind === 'sealed' && 'Saved'}
      {(sealing.kind === 'idle' || sealing.kind === 'failed') && 'Save and sign up'}
    </button>
  );
}

/** Under the menu's top row: what went wrong if saving failed, and the box to send the project to the team. */
export function MenuSaveUnder({ save }: { save: SaveDoor }) {
  const failed = save.sealing.kind === 'failed';
  if (!failed && !save.showPerson) return null;
  return (
    <div className="wb-site-menu-under">
      {save.showPerson && <TeamBox save={save} />}
      {save.sealing.kind === 'failed' && (
        <p role="alert" style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: 'var(--state-pending)' }}>
          {save.sealing.message}
        </p>
      )}
    </div>
  );
}

/**
 * THE DOOR TO A PERSON — item A18, 26 Sep 2026; from 14 Nov 2026 shown
 * whenever a path is ruled out, Blocked or not applying (the ruling of
 * 23 Sep 2026), and never offered in chat.
 */
function TeamBox({ save }: { save: SaveDoor }) {
  const { sealing, person, onPerson } = save;
  const busy = sealing.kind === 'sealing' || sealing.kind === 'sealed';
  return (
    <div className="wb-team-box">
      <label
        style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, lineHeight: 1.45, color: 'var(--ink)', cursor: 'pointer' }}
      >
        <input
          type="checkbox"
          checked={person.wanted}
          disabled={busy}
          onChange={(e) => onPerson({ ...person, wanted: e.target.checked })}
          style={{ marginTop: 3, accentColor: 'var(--tide-ui)', flex: 'none' }}
        />
        Send my project to the WaterBots team so a person can look at it
      </label>
      {person.wanted && (
        <textarea
          className="wb-rail-input"
          value={person.note}
          disabled={busy}
          onChange={(e) => onPerson({ ...person, note: e.target.value })}
          placeholder="A note for them, if you like"
          aria-label="A note for the WaterBots team"
          maxLength={MAX_HUMAN_NOTE_CHARS}
          rows={2}
          style={{ resize: 'none', marginTop: 6 }}
        />
      )}
    </div>
  );
}
