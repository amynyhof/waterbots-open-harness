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

/* --------------------------------------------------------------------------
   How long a reply runs — the maintainer's word of 13 Nov 2026 for Phoebe:
   two or three short sentences, then one question.
   -------------------------------------------------------------------------- */

/**
 * Phoebe's ceiling: four sentences at most, the question included, and 400
 * characters. Her target reply in her prompt is three sentences and 190
 * characters, so the ceiling sits a full sentence and about twice the length
 * above what she is asked for. A threshold, so it moves only on the
 * maintainer's word.
 *
 * WHERE IT BITES. Not on a visitor: a long answer still reaches them, because
 * refusing a real answer for its length would be the worse failure. The relay
 * writes a line to the log for each one, so real traffic can be counted, and
 * scripts/measure-phoebe-walk.mjs fails a walk that has one. One message a
 * visit may run longer by her prompt — the one that shows the rows done later,
 * by phase — and the walk leaves that one out by name.
 */
export const PHOEBE_REPLY_LIMIT = { sentences: 4, chars: 400 } as const;

/** Short words with a full stop that do not end a sentence. */
const NOT_AN_END = /\b(e\.g|i\.e|etc|vs|approx|No|Dr|Mr|Ms|Mrs|St)\.(?=\s)/g;

/**
 * Sentences and characters in a reply, counted the same way everywhere.
 *
 * A sentence ends at a full stop, a question mark or an exclamation mark
 * followed by a space or the end — so "2.5" and "e.g." do not end one, and
 * nor does an ellipsis, as in "tell me… how". Plain counting, not grammar: it
 * is a check on length, not on style.
 */
export function replyLength(reply: string): { sentences: number; chars: number } {
  const text = reply.trim().replace(NOT_AN_END, (match) => match.replace(/\./g, ''));
  const ends = text.match(/[.?!]+["”’)]*(?=\s|$)/g) ?? [];
  /* A last sentence with no mark still counts. */
  const trailing = text.length > 0 && !/[.?!]+["”’)]*$/.test(text) ? 1 : 0;
  return { sentences: ends.length + trailing, chars: reply.trim().length };
}

/** True when a reply runs past the ceiling, on either count. */
export function isLongReply(
  reply: string,
  limit: { sentences: number; chars: number } = PHOEBE_REPLY_LIMIT
): boolean {
  const { sentences, chars } = replyLength(reply);
  return sentences > limit.sentences || chars > limit.chars;
}

/* --------------------------------------------------------------------------
   Card words in chat — the maintainer's word of 14 Nov 2026 (P23): plain
   words a newcomer knows. Her cards and worksheet name things in the
   standards' own words, and on the walk of that day she said them back
   ("water stewardship work with a volume behind it", "mapped way to count",
   "community supply kind"). These are those phrases and their near kin.
   -------------------------------------------------------------------------- */

/** Each phrase a newcomer would not know, with the plain sense to say instead. */
export const CARD_WORDS: readonly { pattern: RegExp; label: string }[] = [
  { pattern: /water stewardship (activity|work|project)/i, label: 'water stewardship activity' },
  { pattern: /volume behind it/i, label: 'a volume behind it' },
  { pattern: /mapped (route|way|path) to count/i, label: 'mapped route to counting' },
  { pattern: /counting route/i, label: 'counting route' },
  { pattern: /mapped activity/i, label: 'mapped activity' },
  { pattern: /supply (kind|class|technolog)/i, label: 'community supply kind or class' },
  { pattern: /technology class/i, label: 'technology class' },
  { pattern: /\bcriteri(on|a)\b/i, label: 'criterion' },
  { pattern: /additionality/i, label: 'additionality' },
  { pattern: /volume provided/i, label: 'Volume Provided' },
  { pattern: /\bbaseline\b(?!\s+survey)/i, label: 'baseline (not "baseline survey")' },
  { pattern: /\bthe (water|carbon) pathway\b/i, label: 'the water or carbon pathway' },
  { pattern: /\b(applies|eligibility) (test|row)s?\b/i, label: 'applies test or eligibility row' },
  { pattern: /\b(CWS|HWT|IWT|CWT)\b/, label: 'a class id' },
  /* The maintainer's word of 14 Nov 2026, the next round on #173: "the method
     names" and "the method lists", and "a first look", which tells a visitor a
     result is near when three agents still come before one (W23). Each is a
     "Not" in knowledge-packs/product-shared/before-and-after.md. */
  { pattern: /\bthe (\w+ )?method (names|lists)\b/i, label: 'the method names or lists' },
  { pattern: /\bfirst look\b/i, label: 'a first look (a result sounds near)' },
];

/** The card words a reply uses, by label; empty when it speaks plainly. */
export function cardWordsIn(reply: string): string[] {
  return CARD_WORDS.filter(({ pattern }) => pattern.test(reply)).map(({ label }) => label);
}

/* --------------------------------------------------------------------------
   Reading level — V1, the maintainer's word of 16 Nov 2026: every agent
   speaks 3rd- to 6th-grade English. The rule lives once, in AGENT_RULES.md,
   and every voice card says it; this measures it.
   -------------------------------------------------------------------------- */

/**
 * Her two bars, 16 Nov 2026. A walk fails when its replies average above
 * grade 6, or when any one reply is above grade 8. A relay logs a reply above
 * grade 6, so real traffic can be counted. Thresholds: they move only on her
 * word. The average is the bar and the single reply only the outer limit,
 * because a two-sentence reply gives a noisy grade.
 */
export const READING_GRADE = { average: 6, reply: 8 } as const;

/**
 * Syllables in one word, by the usual rule of thumb: vowel groups, less a
 * silent final e. Plain counting, not a dictionary; it is right often enough
 * to measure a reply, and it counts every reply the same way.
 */
export function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const trimmed = w.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/, (m) => m[0]).replace(/^y/, '');
  return Math.max(1, (trimmed.match(/[aeiouy]{1,2}/g) ?? []).length);
}

/**
 * The words a reply's grade is counted on. Names, place names and the
 * methods' own terms are left out (the proposal of 16 Nov 2026, approved), so
 * a correct name never fails a reply: a word with a digit, a word with a
 * capital after its first letter (fNRB, VWBA, WaterBots), and a capitalised
 * word that does not start a sentence (Phoebe, Turkana, Gold Standard).
 */
export function gradedWords(reply: string): string[] {
  const out: string[] = [];
  let sentenceStart = true;
  for (const raw of reply.trim().split(/\s+/)) {
    const word = raw.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9']+$/g, '');
    const ends = /[.?!:]["”’)]*$/.test(raw);
    if (word) {
      const named =
        /\d/.test(word) ||
        /^.+[A-Z]/.test(word) ||
        (/^[A-Z]/.test(word) && !sentenceStart && word !== 'I');
      if (!named) out.push(word);
      sentenceStart = false;
    }
    if (ends) sentenceStart = true;
  }
  return out;
}

/**
 * The Flesch–Kincaid grade of a reply, to one decimal, from its sentences,
 * its counted words and their syllables. Never below 0: a very plain reply is
 * grade 0, not a negative grade that would pull a walk's average down.
 */
export function readingGrade(reply: string): number {
  const words = gradedWords(reply);
  if (words.length === 0) return 0;
  const { sentences } = replyLength(reply);
  const syl = words.reduce((n, w) => n + syllables(w), 0);
  const grade = 0.39 * (words.length / Math.max(1, sentences)) + 11.8 * (syl / words.length) - 15.59;
  return Math.max(0, Math.round(grade * 10) / 10);
}

/** True when a relay should log the reply: above the average bar. */
export function isHardReply(reply: string): boolean {
  return readingGrade(reply) > READING_GRADE.average;
}

/** A walk's verdict on its replies' grades: the average and the hardest, against her bars. */
export function walkGrades(grades: number[]): { average: number; hardest: number; passes: boolean } {
  const average = grades.length ? Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 10) / 10 : 0;
  const hardest = grades.length ? Math.max(...grades) : 0;
  return { average, hardest, passes: average <= READING_GRADE.average && hardest <= READING_GRADE.reply };
}
