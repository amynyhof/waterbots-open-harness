/**
 * Every time Phoebe declines, written down.
 *
 * Item A1 in OPEN_ITEMS.md. When Phoebe says she does not have a card for
 * something, that is the most useful thing she says all day: it is a real
 * question, asked by a real person, that the card sets do not cover. Each one is
 * kept so the maintainer can read it and decide — a legitimate limit of the card
 * set, or a card that should be written.
 *
 * This is also what keeps the honest-states rule true for the agent as well as
 * the map. A refusal to answer has to be visible somewhere, not swallowed.
 *
 * WHAT A RECORD HOLDS. When it happened, what Phoebe said it was about, and the
 * question as the person typed it. The maintainer's ruling of 25 Aug 2026: the
 * real question is kept, because "curve number method" tells you a gap exists
 * while the question tells you what card to write.
 *
 * WHAT A RECORD DOES NOT HOLD. Any trace of who asked. The scrambled identity
 * the daily cap counts against is deliberately not written here, so a question
 * can never be tied back to a person, or to any other question by the same
 * person. The two stores share a database and nothing else.
 *
 * WRITING THIS NEVER COSTS SOMEONE THEIR ANSWER. If the record cannot be
 * written, the answer still goes out and the failure goes to the log.
 * Bookkeeping must not eat a reply.
 */

import { appendCapped, readList, storeConfig, type StoreConfig } from './_store.js';

/** Where the list lives. */
const KEY = 'phoebe:abstentions';

/**
 * How many are kept.
 *
 * Enough to hold a long stretch of real questions, small enough that the store
 * cannot fill up on its own. The oldest fall off the end as new ones arrive.
 */
export const KEPT = 500;

/**
 * How much of a question is kept.
 *
 * A question can be up to 4,000 characters — the relay's own limit — and almost
 * none of them will be. This is long enough to carry any ordinary question
 * whole, and a record says plainly when it has been cut rather than leaving the
 * maintainer to wonder whether a trailing thought was ever there.
 */
const QUESTION_CHARS = 500;

export interface Abstention {
  /** When, in UTC. */
  at: string;
  /**
   * Which agent declined, when it was not Phoebe. Absent on Phoebe's own
   * records, which is how they were written before 3 Sep 2026 and how they
   * stay. Wellington writes here only when a question falls outside every
   * lane — his ordinary routings are not abstentions and are not logged.
   * Maintainer's ruling C, 2 Sep 2026.
   */
  agent?: string;
  /** What Phoebe said it was about, in her own few words. May be absent. */
  topic?: string;
  /** The question as it was typed. */
  question: string;
  /** Present and true only when the question above was cut short. */
  truncated?: true;
}

/**
 * Record one abstention. Never throws.
 *
 * The caller has already sent nothing to the visitor at this point, and must not
 * be made to care whether this worked. A failure here is a line in the log and
 * nothing more.
 */
export async function recordAbstention(
  question: string,
  topic: string | undefined,
  now: Date,
  agent?: string
): Promise<void> {
  const store = storeConfig();
  const who = agent ?? 'phoebe';
  if (!store) {
    console.error(`${who}: an abstention could not be recorded — the shared store is not set here`);
    return;
  }

  const trimmed = question.trim();
  const entry: Abstention = {
    at: now.toISOString(),
    ...(agent ? { agent } : {}),
    ...(topic ? { topic } : {}),
    question: trimmed.slice(0, QUESTION_CHARS),
    ...(trimmed.length > QUESTION_CHARS ? { truncated: true as const } : {}),
  };

  try {
    await appendCapped(store, KEY, JSON.stringify(entry), KEPT);
  } catch (error) {
    console.error(
      `${who}: an abstention could not be recorded —`,
      error instanceof Error ? error.message : error
    );
  }
}

export interface AbstentionReport {
  kept: number;
  returned: number;
  /** Entries in the store that could not be read back. Reported, not hidden. */
  unreadable: number;
  abstentions: Abstention[];
}

/** Read the list back, newest first. */
export async function readAbstentions(store: StoreConfig): Promise<AbstentionReport> {
  const raw = await readList(store, KEY, KEPT);

  const abstentions: Abstention[] = [];
  let unreadable = 0;

  for (const item of raw) {
    try {
      const parsed = JSON.parse(item) as Abstention;
      if (typeof parsed?.at === 'string' && typeof parsed?.question === 'string') {
        abstentions.push(parsed);
      } else {
        unreadable += 1;
      }
    } catch {
      /* Counted rather than dropped in silence. A grading list that quietly
         loses entries is worse than one that says it lost some. */
      unreadable += 1;
    }
  }

  return { kept: KEPT, returned: abstentions.length, unreadable, abstentions };
}
