/**
 * Talking to Phoebe.
 *
 * The browser never holds an API key and never reaches Anthropic directly.
 * Everything goes through /api/phoebe, which is the only place the key exists.
 *
 * SHE NAMES CARDS; THIS FILE RENDERS THEM. The relay returns card references —
 * a set and a number — never citation text. The citation a reader sees is
 * looked up here, from the same committed card files the worksheet reads. A
 * wrong page or an invented link is therefore not something she can produce.
 * If she names a card that does not exist, the reference is dropped.
 */

import { CONSIDERATIONS, CRITERIA } from './phoebeCards';
import type { CriterionState } from './criteriaState';
import type { Evidence } from '../chat/evidence';

export interface CriterionUpdate {
  number: number;
  state: Extract<CriterionState, 'met' | 'not-yet'>;
  routeForward?: string;
}

export interface PhoebeAnswer {
  reply: string;
  /** What the answer rests on, in the shared chat layer's shape. */
  evidence: Evidence[];
  updates: CriterionUpdate[];
  abstained: boolean;
  abstentionTopic?: string;
  usage?: { cacheRead: number; cacheWrite: number; input: number; output: number };
}

/** Thrown with a message that is already fit to show a reader. */
export class PhoebeError extends Error {}

export async function askPhoebe(
  history: { role: 'user' | 'assistant'; content: string }[],
  signal?: AbortSignal
): Promise<PhoebeAnswer> {
  let response: Response;
  try {
    response = await fetch('/api/phoebe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: history }),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new PhoebeError(
      'Phoebe could not be reached. That is usually the connection rather than her.'
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new PhoebeError(
      response.ok
        ? 'Phoebe answered in a shape this console could not read.'
        : `Phoebe is unavailable right now (error ${response.status}).`
    );
  }

  const data = payload as Record<string, unknown>;

  if (!response.ok) {
    /* The relay writes readable messages for every failure it knows about. */
    throw new PhoebeError(
      typeof data.error === 'string'
        ? data.error
        : `Phoebe is unavailable right now (error ${response.status}).`
    );
  }

  if (typeof data.reply !== 'string') {
    throw new PhoebeError('Phoebe answered in a shape this console could not read.');
  }

  return {
    reply: data.reply,
    evidence: resolveEvidence(data.citedCards),
    updates: resolveUpdates(data.criteriaUpdates),
    abstained: data.abstained === true,
    abstentionTopic:
      typeof data.abstentionTopic === 'string' ? data.abstentionTopic : undefined,
    usage: data.usage as PhoebeAnswer['usage'],
  };
}

/**
 * Phoebe's adapter into the shared chat layer.
 *
 * She returns a set and a number. This turns each one into an Evidence record
 * the layer can render — the card's title, its plain words, and the citation,
 * all read from the committed card file. She supplies none of it beyond the
 * number, which is the whole point: see CITATIONS.md.
 */
function resolveEvidence(value: unknown): Evidence[] {
  if (!Array.isArray(value)) return [];
  const out: Evidence[] = [];
  const seen = new Set<string>();

  for (const raw of value) {
    if (typeof raw !== 'object' || raw === null) continue;
    const ref = raw as Record<string, unknown>;
    const set = ref.set === 'eligibility' || ref.set === 'feasibility' ? ref.set : null;
    const number = typeof ref.number === 'number' ? ref.number : null;
    if (!set || number === null) continue;

    const key = `${set}-${number}`;
    if (seen.has(key)) continue;

    const card =
      set === 'eligibility'
        ? CRITERIA.find((c) => c.number === number)
        : CONSIDERATIONS.find((c) => c.number === number);

    /* A reference to a card that does not exist is dropped in silence here
       rather than rendered — showing a citation for a missing card would be
       the fabrication this whole arrangement exists to prevent. */
    if (!card) continue;

    seen.add(key);
    out.push({
      id: key,
      label: `${set === 'eligibility' ? 'Criterion' : 'Consideration'} ${number} — ${card.title}`,
      citation: card.citation,
      plainEnglish: 'rule' in card ? card.rule : card.summary,
    });
  }
  return out;
}

function resolveUpdates(value: unknown): CriterionUpdate[] {
  if (!Array.isArray(value)) return [];
  const out: CriterionUpdate[] = [];

  for (const raw of value) {
    if (typeof raw !== 'object' || raw === null) continue;
    const u = raw as Record<string, unknown>;
    const number = typeof u.number === 'number' ? u.number : null;
    const state = u.state === 'met' || u.state === 'not-yet' ? u.state : null;
    if (number === null || !state) continue;
    if (!CRITERIA.some((c) => c.number === number)) continue;

    const routeForward = typeof u.routeForward === 'string' ? u.routeForward.trim() : '';
    /* The relay drops these too. Checked again here because a "Not yet" with
       no way forward must never reach the worksheet. */
    if (state === 'not-yet' && routeForward === '') continue;

    out.push(state === 'not-yet' ? { number, state, routeForward } : { number, state });
  }
  return out;
}
