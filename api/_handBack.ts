/**
 * The hand-back — contract line 8, item A15, step 4, 21 Sep 2026.
 *
 * A specialist knows Wellington leads and hands the visitor back to him when
 * the task is done or the question is out of its lane. The maintainer's
 * ruling of 20 Sep 2026 (R1): the hand-back is a FIELD the console acts on,
 * never a sentence it reads. Out of her lane a specialist still says the
 * colleague's facts in her own words (rung 2, unchanged) and sets the field
 * beside them.
 *
 * ONE CLOSED LIST, read here and mirrored by the client. "none" is the
 * ordinary turn; "wellington" is the hand-back. An unknown value is "none",
 * never an invented destination — the same rule as his route. What the
 * console draws for "wellington" is the console's: the way back to
 * Dispatches on this site, the way back to the shelf on the Agent Commons,
 * where there is no desk.
 *
 * In its own module, with no dependency on the SDK, so the check script can
 * load it compiled as the platform compiles it and prove it without a model
 * call — the pattern of _wellingtonAnswer.ts.
 */

export type HandBack = 'none' | 'wellington';

export const HAND_BACKS: readonly HandBack[] = ['none', 'wellington'];

/** The field as the model set it, or "none" when it is missing or unknown. */
export function readHandBack(value: unknown): HandBack {
  return HAND_BACKS.find((h) => h === value) ?? 'none';
}
