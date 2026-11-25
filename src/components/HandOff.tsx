/**
 * Wellington's hand-off line at the head of a desk whose chat is not live — the maintainer's ruling of 24 Nov 2026, the
 * shared console behaviours, line 5: "The hand-off line he gives for the first agent is given for each later agent too."
 *
 * On Phoebe's and Bridget's pages his line is the first bubble of their chat. Calvin and Violet have no chat yet and
 * their screens open on their calculator, so the same bubble heads it, and their Chat tab. It is his own words with his
 * face, drawn by the chat's one transcript. Display only.
 */

import Transcript, { TurnButtons } from '../chat/Transcript';
import type { TurnButton } from '../chat/evidence';
import { WELLINGTON } from '../lib/wellington';

export default function HandOff({
  line,
  waiting = false,
  framed = false,
  wayOn = [],
}: {
  line: string;
  /** True while he is writing it. */
  waiting?: boolean;
  /** Above a calculator it has its own band; in a Chat tab the column is already drawn. */
  framed?: boolean;
  /** The buttons to what comes next, so a desk with no chat is never a dead end (24 Nov 2026). */
  wayOn?: TurnButton[];
}) {
  const text = line.trim();
  if (text === '' && !waiting && wayOn.length === 0) return null;
  const turn = (
    <>
    {(text !== '' || waiting) && <Transcript
      host={WELLINGTON}
      turns={text === '' ? [] : [{ role: 'agent', text, evidence: [] }]}
      pending={text === '' && waiting}
      error={null}
    />}
    {wayOn.length > 0 && (
      <div style={{ margin: text !== '' || waiting ? '-6px 0 12px' : '0 0 12px' }}>
        <TurnButtons turn={{ buttons: wayOn }} />
      </div>
    )}
    </>
  );
  if (!framed) return turn;
  return (
    <div
      data-hand-off
      /* Never more than a third of the desk, so on a phone the calculator keeps its room; a longer line scrolls. */
      style={{
        flex: 'none',
        maxHeight: '38%',
        overflowY: 'auto',
        background: 'var(--paper)',
        borderBottom: '1px solid var(--line)',
        padding: '12px 18px 0',
      }}
    >
      {turn}
    </div>
  );
}
