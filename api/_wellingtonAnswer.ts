/**
 * Wellington's answer, checked rather than trusted.
 *
 * In its own module, with no dependency on the SDK, so the check script can
 * load it the way check-reply-guard loads _reply.ts — compiled as the platform
 * compiles it, and exercised without a model call. The relay imports it; the
 * shape is the relay's contract with the console.
 *
 * TYPE, CLASS AND STAGE FROM CLOSED LISTS — item A16, 24 Sep 2026. "What
 * kind" retired the same day. A type is an id from the shared project-type
 * file, generated into _projectTypes.generated.ts; a class is one of the
 * methodology's four and is kept only beside a drinking-water project; a
 * stage is one of three. An id off the list is dropped, never recorded, the
 * way an unknown route becomes "none". He logs any of them only on the
 * visitor's yes — that rule is in his prompt; this file holds the lists.
 */

import {
  DRINKING_WATER_TYPE,
  GS_CLASS_IDS,
  PROJECT_STAGE_IDS,
  PROJECT_TYPE_IDS,
  type GsClassId,
  type ProjectStageId,
  type ProjectTypeId,
} from './_projectTypes.generated.js';

export type Route = 'none' | 'eligibility' | 'quantification' | 'map' | 'paid';

const ROUTES: Route[] = ['none', 'eligibility', 'quantification', 'map', 'paid'];

/** What the visitor stated, in their own words. Every field optional. */
export interface LearnedContext {
  /** What the project does, in the visitor's own words. Added 4 Sep 2026. */
  does?: string;
  name?: string;
  place?: string;
  /** The standard project type, confirmed by the visitor. An id from the file. */
  type?: ProjectTypeId;
  /** The technology class of a drinking-water project, confirmed. Only beside C-19. */
  gsClass?: GsClassId;
  /** On paper, being built, or already running, confirmed. */
  stage?: ProjectStageId;
}

export interface Answer {
  reply: string;
  route: Route;
  context?: LearnedContext;
  abstained: boolean;
  abstentionTopic?: string;
}

/** A learned name or place is kept only if it is short enough to be one, never an essay. */
const MAX_CONTEXT_CHARS = 160;
/** What it does may run a sentence or two; more than that is a description, not a record. */
const MAX_DOES_CHARS = 280;

/**
 * What the visit already holds, so a class returned this turn can be checked
 * against a type confirmed on an earlier one.
 */
export interface KnownContext {
  type?: string;
}

export function validate(value: unknown, known: KnownContext = {}): Answer | null {
  if (typeof value !== 'object' || value === null) return null;
  const v = value as Record<string, unknown>;

  if (typeof v.reply !== 'string' || v.reply.trim() === '') return null;

  /* An unknown route is "none", never an invented destination. */
  const route: Route = ROUTES.includes(v.route as Route) ? (v.route as Route) : 'none';

  let context: LearnedContext | undefined;
  if (typeof v.context === 'object' && v.context !== null) {
    const c = v.context as Record<string, unknown>;
    const out: LearnedContext = {};
    const does = typeof c.does === 'string' ? c.does.trim() : '';
    if (does && does.length <= MAX_DOES_CHARS) out.does = does;
    const name = typeof c.name === 'string' ? c.name.trim() : '';
    const place = typeof c.place === 'string' ? c.place.trim() : '';
    if (name && name.length <= MAX_CONTEXT_CHARS) out.name = name;
    if (place && place.length <= MAX_CONTEXT_CHARS) out.place = place;
    const type = PROJECT_TYPE_IDS.find((id) => id === c.type);
    if (type) out.type = type;
    /* A class is a fact about a drinking-water project and nothing else. */
    const typeInForce = out.type ?? known.type;
    const gsClass = GS_CLASS_IDS.find((id) => id === c.gsClass);
    if (gsClass && typeInForce === DRINKING_WATER_TYPE) out.gsClass = gsClass;
    const stage = PROJECT_STAGE_IDS.find((id) => id === c.stage);
    if (stage) out.stage = stage;
    if (Object.keys(out).length > 0) context = out;
  }

  const abstained = v.abstained === true;
  const topic = typeof v.abstentionTopic === 'string' ? v.abstentionTopic.trim() : '';

  return {
    reply: v.reply.trim(),
    route,
    ...(context ? { context } : {}),
    abstained,
    ...(abstained && topic ? { abstentionTopic: topic } : {}),
  };
}
