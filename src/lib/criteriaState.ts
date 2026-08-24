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
