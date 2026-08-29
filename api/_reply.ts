/**
 * What counts as an answer at all.
 *
 * WHY THIS EXISTS. Phoebe sometimes finishes normally and says nothing. The
 * relay already refuses a reply that is empty once trimmed — item A4 — and
 * that guard tests for *empty*. Measured on 28 Aug 2026, four replies of one
 * to three characters reached callers instead, because three characters is not
 * empty. **A three-character reply is an empty reply wearing a character.**
 *
 * WHAT THIS IS NOT. Item A4 deliberately refused to put a minimum length on
 * the response schema, on the grounds that forcing the model to emit
 * *something* turns an honest failure into a meaningless answer that looks
 * real. This is the opposite move. It does not ask her to say more; it refuses
 * to hand a non-answer to a visitor as though it were one. A4's principle —
 * the empty reply should keep failing, and fail with the truth — is what this
 * implements rather than what it overturns.
 *
 * WHERE THE NUMBER COMES FROM. Across 256 measured answers that had any text
 * in them at all, the ten shortest were:
 *
 *     1, 1, 3, 3, 3, 3, 21, 221, 293, 295 …
 *
 * Degenerate replies cluster at one to three characters. **The shortest real
 * answer in two hundred and fifty-six was 221.** Any threshold between roughly
 * 30 and 200 separates them, so 40 sits in a gap ten times wider than it needs
 * to be.
 *
 * The one ambiguous point in that sample is the 21-character reply, whose text
 * was never captured. If 40 ever refuses something real, the relay's diagnosis
 * logging quotes any reply of forty characters or fewer in full, so the next
 * one explains itself instead of being argued about.
 */

/**
 * Shorter than this and it is not an answer.
 *
 * Stated as a named constant rather than written into a comparison, so that
 * changing it is a decision someone has to make on purpose.
 */
export const MIN_REPLY_CHARS = 40;

/**
 * True when a reply is too short to be an answer.
 *
 * Trimmed first: whitespace is not an answer either, and one of the measured
 * failures was a single character that may well have been a space.
 */
export function isDegenerateReply(reply: string): boolean {
  return reply.trim().length < MIN_REPLY_CHARS;
}
