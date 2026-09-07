/**
 * Phoebe's seat in the shared chat layer.
 *
 * This file is now identity and wiring, and nothing else. The transcript, the
 * composer, the failure states and every citation are owned by
 * src/chat/AgentChat — one component that Bridget and any agent after her use
 * unchanged. Built twice, two chats diverge, and the part that diverges is the
 * part that carries citations.
 *
 * NOTHING CITATION-RELATED LIVES HERE. If a citation detail ever needs adding
 * to this file, that is the signal it belongs in the layer instead.
 *
 * THE SIDE EFFECT IS HERS, SO IT LIVES HERE. Phoebe moves worksheet rows when
 * an answer lands. That happens inside `ask` below, before the turn is handed
 * back, and the layer never learns that worksheets exist.
 *
 * SHE IS BETA, and it is stated in words rather than tucked away — early
 * access, shaped with founding users.
 */

import phoebePortrait from '../../brand/assets/bots/phoebe.svg';
import AgentChat from '../chat/AgentChat';
import type { AgentHost, AgentTurn } from '../chat/evidence';
import { CONSIDERATIONS, CRITERIA } from '../lib/phoebeCards';
import { askPhoebe, carriedRecord, type CarriedRecord, type CriterionUpdate } from '../lib/phoebeClient';
import type { VisitContext } from '../lib/visit';

const PHOEBE: AgentHost = {
  name: 'Phoebe',
  role: 'Eligibility and Feasibility',
  portrait: phoebePortrait,
  colourToken: '--bot-phoebe',
  beta: true,
  composerPlaceholder: 'Tell her about your project, or ask about a criterion.',
  composerNote: 'Nothing is kept between visits.',
  thinkingLine: 'Phoebe is reading her cards…',
};

export default function PhoebePanel({
  onCriteriaUpdate,
  record,
}: {
  onCriteriaUpdate: (updates: CriterionUpdate[]) => void;
  /**
   * The visit's project record, carried to Phoebe with every ask — slice 3,
   * 7 Sep 2026. What Wellington learned, or the visitor typed, goes with her
   * request so nobody says it twice; her verdicts come back through the
   * criteria to her row on the desk. That is the loop.
   */
  record: VisitContext;
}) {
  const carried = carriedRecord(record);

  async function ask(
    history: { role: 'user' | 'agent'; text: string }[],
    signal: AbortSignal
  ): Promise<AgentTurn> {
    const answer = await askPhoebe(
      history.map(({ role, text }) => ({
        role: role === 'agent' ? ('assistant' as const) : ('user' as const),
        content: text,
      })),
      carried,
      signal
    );

    /* Her side effect, fired before the turn is returned so a failed request
       never half-moves the worksheet. */
    if (answer.updates.length) onCriteriaUpdate(answer.updates);

    return {
      role: 'agent',
      text: answer.reply,
      evidence: answer.evidence,
      abstained: answer.abstained,
    };
  }

  return (
    <AgentChat
      host={PHOEBE}
      ask={ask}
      composerId="wb-phoebe-composer"
      opening={<Opening carried={carried} />}
    />
  );
}

/**
 * The empty state. Agent-specific, so Phoebe supplies it rather than the
 * layer. When the desk has a record, it says so and shows what is carried —
 * the visitor's own words, read back — so nobody is asked twice.
 */
function Opening({ carried }: { carried: CarriedRecord | null }) {
  /* The visitor's own sentence, less its full stop, so it sits inside ours. */
  const does = carried?.does.replace(/[.!]+$/, '') ?? '';
  const said = carried
    ? [does, carried.place ? `in ${carried.place}` : ''].filter(Boolean).join(', ')
    : '';
  return (
    <>
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Where to start
      </div>
      {said ? (
        <p className="t-body" style={{ margin: '0 0 12px', color: 'var(--ink-2)', fontSize: 14 }}>
          Phoebe already has what you told Wellington — {said} — and starts from it. Ask her
          about a criterion, or add what is missing, and she fills in the worksheet as you go.
        </p>
      ) : (
        <p className="t-body" style={{ margin: '0 0 12px', color: 'var(--ink-2)', fontSize: 14 }}>
          Tell Phoebe what your project does and where, and she will work through the six criteria
          with you, filling in the worksheet as you go.
        </p>
      )}
      <p className="t-caption" style={{ margin: '0 0 14px', lineHeight: 1.6 }}>
        She reads from {CRITERIA.length} eligibility criteria and {CONSIDERATIONS.length} selection
        considerations, and nothing else. Ask her something outside those — an activity type, a
        calculation, another standard — and she will say she does not have that card yet rather
        than guess at it.
      </p>
      <p className="t-caption" style={{ margin: 0, lineHeight: 1.6, color: 'var(--ink-3)' }}>
        She is in beta: early access, shaped with founding users.
      </p>
    </>
  );
}
