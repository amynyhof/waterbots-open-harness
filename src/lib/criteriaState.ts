/**
 * The state of one eligibility criterion on the worksheet.
 *
 * THREE STATES, AND NO FOURTH. Appendix A is a hard gate — the maintainer
 * ruled on 20 Aug 2026 that a criterion is met or it is not, with no
 * weighting, no partial credit and no averaging. There is deliberately no
 * "partly met", no percentage and no score.
 *
 * The default is 'unchecked', and it means exactly what it says: nobody has
 * looked yet. It never stands in for a failure, and a worksheet that has not
 * been through a conversation shows six of them honestly rather than
 * pretending to know.
 *
 * 'not-yet' always travels with a route forward. A verdict that only reports
 * failure is not an acceptable output — see the design decision at the top of
 * eligibility-cards-vwba.md.
 */
export type CriterionState = 'unchecked' | 'met' | 'not-yet';

export interface CriterionStatus {
  state: CriterionState;
  /**
   * What would move this from 'not-yet' to 'met' — the specific evidence,
   * document, consultation or design change. Required whenever the state is
   * 'not-yet'; the gate is hard, the posture is not.
   */
  routeForward?: string;
}

/** How each state is named on screen. Complete words, never a symbol alone. */
export const STATE_LABEL: Record<CriterionState, string> = {
  unchecked: 'Not yet checked',
  met: 'Met',
  'not-yet': 'Not yet',
};

/**
 * The colour each state carries.
 *
 * These are the brand's status taxonomy tokens, not new colours. 'unchecked'
 * takes --state-locked because nothing has happened to it yet; it is an
 * absence, not a warning, and must never read as a failure.
 */
export const STATE_TOKEN: Record<CriterionState, string> = {
  unchecked: 'var(--state-locked)',
  met: 'var(--state-approved)',
  'not-yet': 'var(--state-pending)',
};

/**
 * The starting worksheet: every criterion unchecked.
 *
 * v1 has no memory across visits, and a refresh resets this. That is the
 * maintainer's ruling of 21 Aug 2026 and it is the honest behaviour — carrying
 * state the product cannot actually remember would be a fabricated state.
 */
export function initialStatuses(count: number): CriterionStatus[] {
  return Array.from({ length: count }, () => ({ state: 'unchecked' as const }));
}

/**
 * The shown line — contract line 5, item A15, step 5, 21 Sep 2026. Under any
 * turn of Phoebe's that moved a row, the console says what the worksheet now
 * holds, in one caption drawn from her structured verdicts and never from her
 * prose: "Worksheet: 3 Met · 2 Not yet". The counts are the whole worksheet
 * after the move, so the line and the Tool tab cannot disagree. Rows not yet
 * checked are not counted; an absence is not a verdict. Maintainer's ruling
 * R3 of 20 Sep 2026: on prose, same place and size as the citation line, no
 * new colour, and she may strike it at the eyeball.
 */
export function worksheetCaption(statuses: CriterionStatus[]): string {
  const met = statuses.filter((s) => s.state === 'met').length;
  const notYet = statuses.filter((s) => s.state === 'not-yet').length;
  return `Worksheet: ${met} ${STATE_LABEL.met} · ${notYet} ${STATE_LABEL['not-yet']}`;
}
