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

import { readKindFacts } from '@waterbots/core/projectKinds';
import { HOME_USES, PROJECT_STAGES, PROJECT_TYPE_IDS } from '@waterbots/core/record';
import { readServed } from '@waterbots/wellington';
import type { AskMeta } from '../chat/evidence';
import { answersFrom } from './chips';
import type { MapNote } from './projectRecord';
import type { Surface } from './surfaces';
import type { KindFacts, Learned, Served } from './visit';

export type WellingtonRoute = 'none' | 'eligibility' | 'quantification' | 'water' | 'map' | 'paid';

export type { Learned };

/** The visit as the relay reads it (api/_record.ts). Empty strings are fine; omit the object when nothing is filled. */
export interface VisitRecord {
  does: string;
  type: string;
  /** The source, the treatment and whether the water is safe, as the visitor said them (core 0.4.0). */
  kindFacts: KindFacts;
  stage: string;
  place: string;
  name: string;
  served?: Served;
}

export interface WellingtonAnswer {
  reply: string;
  route: WellingtonRoute;
  /** Chips that answer the question just asked (24 Nov 2026). */
  answers: string[];
  /** W24: his one line to a colleague, at the top of their page; only on a route to them. Every colleague's from 24 Nov 2026. */
  introduction?: string;
  learned: Learned;
  abstained: boolean;
  abstentionTopic?: string;
  /** A count core's fact check refused, and why (J3). It is not on the record. */
  refused?: 'below zero' | 'zero' | 'not a whole number' | 'not a number';
}

/** Thrown with a message that is already fit to show a reader. */
export class WellingtonError extends Error {}

/** Phoebe's worksheet as it travels to him: rows by id and state, nothing she wrote. */
export interface FoundSheet {
  pack: string;
  rows: { id: string; state: string }[];
  sorts?: string[];
}

const ROUTES: WellingtonRoute[] = ['none', 'eligibility', 'quantification', 'water', 'map', 'paid'];

const REFUSED = ['below zero', 'zero', 'not a whole number', 'not a number'] as const;

/**
 * THE QUESTION HIS LAST REPLY ASKED (core 0.5.0, 26 Nov 2026): its `asking`, wherever he said it this visit, sent back as
 * `asked` on his next turn. His package takes a yes or no only as the answer to it. It lives as long as the page does,
 * as the visit does.
 */
let lastAsking: string | undefined;

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
  found: { sheet?: FoundSheet[]; returned?: boolean; at?: AskMeta['at']; to?: Surface; map?: MapNote } = {}
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
      at?: AskMeta['at'];
      to?: Surface;
      map?: MapNote;
      door?: 'free-site';
      asked?: string;
    } = {
      messages: history,
      door: 'free-site',
    };
    /* The agent map (J4, 23 Nov 2026), worked out by core from the shared record. He leads from it. */
    if (found.map) body.map = found.map;
    if (lastAsking) body.asked = lastAsking;
    if (carried) body.carried = true;
    if (record) body.record = record;
    if (stage !== 'learn') body.stage = stage;
    if (found.sheet && found.sheet.some((s) => s.rows.length > 0)) body.sheet = found.sheet;
    if (found.returned) body.returned = true;
    /* "Wellington comes to you" (14 Nov 2026): the step whose chat he joins. */
    if (found.at) body.at = found.at;
    if (found.at === 'handoff' && found.to) body.to = found.to;
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

  lastAsking = typeof data.asking === 'string' && /^[w.-]{1,60}$/.test(data.asking) ? data.asking : undefined;

  const route = ROUTES.includes(data.route as WellingtonRoute) ? (data.route as WellingtonRoute) : 'none';

  const learned: Learned = {};
  if (typeof data.context === 'object' && data.context !== null) {
    const c = data.context as Record<string, unknown>;
    if (typeof c.does === 'string' && c.does.trim()) learned.does = c.does.trim();
    if (typeof c.name === 'string' && c.name.trim()) learned.name = c.name.trim();
    if (typeof c.place === 'string' && c.place.trim()) learned.place = c.place.trim();
    const type = PROJECT_TYPE_IDS.find((id) => id === c.type);
    if (type) learned.type = type;
    Object.assign(learned, readKindFacts(c));
    const projectStage = PROJECT_STAGES.find((id) => id === c.stage);
    if (projectStage) learned.stage = projectStage;
    const served: Served | undefined = readServed(c.served);
    if (served) learned.served = served;
    const homeUse = HOME_USES.find((h) => h === c.homeUse);
    if (homeUse) learned.homeUse = homeUse;
  }

  const introduction =
    route !== 'none' && route !== 'paid' && typeof data.introduction === 'string' && data.introduction.trim()
      ? data.introduction.trim()
      : undefined;

  return {
    reply: data.reply,
    answers: answersFrom(data.answers),
    route,
    ...(introduction ? { introduction } : {}),
    learned,
    abstained: data.abstained === true,
    abstentionTopic: typeof data.abstentionTopic === 'string' ? data.abstentionTopic : undefined,
    refused: REFUSED.find((r) => r === data.refused),
  };
}
