/**
 * THE SAVE DOOR — one "Save and sign up" button, the maintainer's word of
 * 21 Nov 2026. It shows once something is on the record, as before.
 *
 * ON A LAPTOP it sits in the right panel, under the crew, with the box that
 * sends the project to the team for review (it goes with the save, so it moved
 * with it). Until 21 Nov 2026 both sat at the foot of the left rail.
 *
 * ON A PHONE it sits in the site menu's top row, beside Sign in and Sign up,
 * with the WaterBots.AI wordmark — the maintainer's word of 21 Nov 2026, in
 * place of the bar above the chat box. The team box stays in the right panel,
 * which on a phone is the Crew panel; a tick there goes with the menu's Save,
 * so a phone has one Save button too.
 *
 * ONE BLUE BUTTON AT A TIME (src/lib/blue.ts, 16 Nov 2026): Save is solid blue
 * only when it is the one next step; otherwise it keeps its place and words,
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
  /** One blue button at a time: Save is the blue one only when nothing comes before it. */
  blue: boolean;
}

/** On a laptop: the team box, then Save, under the crew in the right panel. */
export function SaveDoorPanel({ save }: { save: SaveDoor }) {
  return (
    <div className="wb-crew-save">
      <TeamBox save={save} />
      <SaveButton save={save} />
    </div>
  );
}

/** On a phone, in the Crew panel: the team box alone, because Save is in the site menu. */
export function SaveDoorTeamOnly({ save }: { save: SaveDoor }) {
  if (!save.showPerson) return null;
  return (
    <div className="wb-crew-save">
      <TeamBox save={save} />
    </div>
  );
}

/**
 * THE DOOR TO A PERSON — item A18, 26 Sep 2026; from 14 Nov 2026 shown
 * whenever a path is ruled out, Blocked or not applying (the ruling of
 * 23 Sep 2026), and never offered in chat. Nothing is sent until Save is
 * pressed, and then only with it.
 */
function TeamBox({ save }: { save: SaveDoor }) {
  const { sealing, person, onPerson } = save;
  const busy = sealing.kind === 'sealing' || sealing.kind === 'sealed';
  if (!save.showPerson) return null;
  return (
    <div style={{ margin: '0 2px 10px' }}>
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

/** The one button, and what went wrong if saving failed. */
function SaveButton({ save }: { save: SaveDoor }) {
  return (
    <>
      <SaveOnly save={save} />
      <SaveFailed save={save} />
    </>
  );
}

/** The button alone. In the menu its waiting words are short, so the row never wraps. */
function SaveOnly({ save, short = false }: { save: SaveDoor; short?: boolean }) {
  const { sealing } = save;
  const busy = sealing.kind === 'sealing' || sealing.kind === 'sealed';
  return (
    <button
      type="button"
      className={save.blue ? 'wb-save-button' : 'wb-save-button is-quiet'}
      onClick={save.onSeal}
      disabled={busy}
      aria-busy={sealing.kind === 'sealing' || undefined}
    >
      {sealing.kind === 'sealing' && (short ? 'Saving…' : 'Saving your project…')}
      {sealing.kind === 'sealed' && (short ? 'Saved' : 'Saved. Taking you to waterbots.ai…')}
      {(sealing.kind === 'idle' || sealing.kind === 'failed') && 'Save and sign up'}
    </button>
  );
}

/** What went wrong, if saving failed. */
function SaveFailed({ save, inMenu = false }: { save: SaveDoor; inMenu?: boolean }) {
  if (save.sealing.kind !== 'failed') return null;
  return (
    <p
      role="alert"
      className={inMenu ? 'wb-site-menu-alert' : undefined}
      style={{ margin: inMenu ? 0 : '8px 0 0', fontSize: 12, lineHeight: 1.5, color: 'var(--state-pending)' }}
    >
      {save.sealing.message}
    </p>
  );
}

/** On a phone, in the site menu's top row: the button, with short waiting words. */
export function MenuSave({ save }: { save: SaveDoor }) {
  return <SaveOnly save={save} short />;
}

/** On a phone, what went wrong, on its own line under the menu's top row. */
export function MenuSaveFailed({ save }: { save: SaveDoor }) {
  return <SaveFailed save={save} inMenu />;
}
