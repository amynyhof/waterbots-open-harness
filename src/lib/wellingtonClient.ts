/**
 * Talking to Wellington.
 *
 * The browser never holds an API key and never reaches Anthropic directly.
 * Everything goes through /api/wellington, which is the only place the key
 * exists — the same arrangement as Phoebe's.
 *
 * HE ROUTES AND HE LEARNS; THE CONSOLE ACTS. His answer carries a route and
 * what he learned about the project as fields, checked here against closed
 * lists a second time. The desk turns the route into one action under his
 * turn and writes what he learned into the visit under its own rules
 * (src/lib/visit.ts). Nothing is read out of his prose.
 *
 * THE VISIT GOES WITH EVERY ASK from 16 Sep 2026, when anything is filled,
 * so he treats what is there as known rather than asking again. An empty
 * visit sends no record.
 *
 * TYPE, CLASS AND STAGE from 24 Sep 2026 (item A16), each an id from the
 * closed lists in the generated project-type module, each logged only on
 * the visitor's yes. "What kind" retired the same day.
 */

import {
  GS_CLASS_IDS,
  PROJECT_STAGE_IDS,
  PROJECT_TYPE_IDS,
  type GsClassId,
  type ProjectStageId,
  type ProjectTypeId,
} from './projectTypes.generated';
import type { Served } from './visit';

export type WellingtonRoute = 'none' | 'eligibility' | 'quantification' | 'map' | 'paid';

export interface Learned {
  does?: string;
  name?: string;
  place?: string;
  type?: ProjectTypeId;
  gsClass?: GsClassId;
  stage?: ProjectStageId;
  served?: Served;
}

/** Ten million, the relay's own ceiling (api/_wellingtonAnswer.ts). */
const MAX_SERVED = 10_000_000;

/** A whole count from 1 to ten million and a listed unit, or nothing. */
function readServed(value: unknown): Served | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const v = value as Record<string, unknown>;
  const unit = v.unit === 'people' || v.unit === 'households' ? v.unit : undefined;
  const count = v.count;
  if (!unit || typeof count !== 'number' || !Number.isInteger(count) || count < 1 || count > MAX_SERVED) {
    return undefined;
  }
  return { count, unit };
}

/** The visit as the relay's `readRecord` expects it. Empty strings are fine; omit the object when nothing is filled. */
export interface VisitRecord {
  does: string;
  type: string;
  gsClass: string;
  stage: string;
  place: string;
  name: string;
  served?: Served;
}

export interface WellingtonAnswer {
  reply: string;
  route: WellingtonRoute;
  learned: Learned;
  abstained: boolean;
  abstentionTopic?: string;
}

/** Thrown with a message that is already fit to show a reader. */
export class WellingtonError extends Error {}

/** Phoebe's worksheet as it travels to him: rows by id and state, nothing she wrote. */
export interface FoundSheet {
  pack: string;
  rows: { id: string; state: string }[];
  sorts?: string[];
}

const ROUTES: WellingtonRoute[] = ['none', 'eligibility', 'quantification', 'map', 'paid'];

export async function askWellington(
  history: { role: 'user' | 'assistant'; content: string }[],
  signal?: AbortSignal,
  /**
   * True when the last turn was carried in from the production landing's
   * question box (item S13). The relay counts it under the carried cap of
   * ten a day as well as his thirty. The flag is only ever sent as true; a
   * typed turn sends no flag at all.
   */
  carried = false,
  /** The visit as it stands. Null when nothing is filled — he may still ask. */
  record: VisitRecord | null = null,
  /** The screening loop stage the console owns. Never inferred from his prose. */
  stage: 'learn' | 'eligibility' | 'partners' | 'quantify' = 'learn',
  /**
   * Item A17, 26 Sep 2026. `sheet` is Phoebe's worksheet as the shell holds
   * it, each row by id and state only — never her own sentences. `returned` is
   * true on the one turn the desk sends when the visitor comes back from her.
   */
  found: { sheet?: FoundSheet[]; returned?: boolean } = {}
): Promise<WellingtonAnswer> {
  let response: Response;
  try {
    const body: {
      messages: typeof history;
      carried?: true;
      record?: VisitRecord;
      stage?: typeof stage;
      sheet?: FoundSheet[];
      returned?: true;
    } = {
      messages: history,
    };
    if (carried) body.carried = true;
    if (record) body.record = record;
    if (stage !== 'learn') body.stage = stage;
    if (found.sheet && found.sheet.some((s) => s.rows.length > 0)) body.sheet = found.sheet;
    if (found.returned) body.returned = true;
    response = await fetch('/api/wellington', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new WellingtonError(
      'Wellington could not be reached. That is usually the connection rather than him.'
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new WellingtonError(
      response.ok
        ? 'Wellington answered in a shape this console could not read.'
        : `Wellington is unavailable right now (error ${response.status}).`
    );
  }

  const data = payload as Record<string, unknown>;

  if (!response.ok) {
    throw new WellingtonError(
      typeof data.error === 'string'
        ? data.error
        : `Wellington is unavailable right now (error ${response.status}).`
    );
  }

  if (typeof data.reply !== 'string') {
    throw new WellingtonError('Wellington answered in a shape this console could not read.');
  }

  const route = ROUTES.includes(data.route as WellingtonRoute) ? (data.route as WellingtonRoute) : 'none';

  const learned: Learned = {};
  if (typeof data.context === 'object' && data.context !== null) {
    const c = data.context as Record<string, unknown>;
    if (typeof c.does === 'string' && c.does.trim()) learned.does = c.does.trim();
    if (typeof c.name === 'string' && c.name.trim()) learned.name = c.name.trim();
    if (typeof c.place === 'string' && c.place.trim()) learned.place = c.place.trim();
    const type = PROJECT_TYPE_IDS.find((id) => id === c.type);
    if (type) learned.type = type;
    const gsClass = GS_CLASS_IDS.find((id) => id === c.gsClass);
    if (gsClass) learned.gsClass = gsClass;
    const projectStage = PROJECT_STAGE_IDS.find((id) => id === c.stage);
    if (projectStage) learned.stage = projectStage;
    const served = readServed(c.served);
    if (served) learned.served = served;
  }

  return {
    reply: data.reply,
    route,
    learned,
    abstained: data.abstained === true,
    abstentionTopic: typeof data.abstentionTopic === 'string' ? data.abstentionTopic : undefined,
  };
}
