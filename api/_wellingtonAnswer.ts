/**
 * Wellington's answer, checked rather than trusted.
 *
 * In its own module, with no dependency on the SDK, so the check script can
 * load it the way check-reply-guard loads _reply.ts — compiled as the platform
 * compiles it, and exercised without a model call. The relay imports it; the
 * shape is the relay's contract with the console.
 */

export type Route = 'none' | 'eligibility' | 'quantification' | 'map' | 'paid';
export type Kind = 'water' | 'carbon' | 'unsure';

const ROUTES: Route[] = ['none', 'eligibility', 'quantification', 'map', 'paid'];
const KINDS: Kind[] = ['water', 'carbon', 'unsure'];

/** What the visitor stated, in their own words. Every field optional. */
export interface LearnedContext {
  name?: string;
  place?: string;
  kind?: Kind;
}

export interface Answer {
  reply: string;
  route: Route;
  context?: LearnedContext;
  abstained: boolean;
  abstentionTopic?: string;
}

/** A learned field is kept only if it is short enough to be a name or a place, never an essay. */
const MAX_CONTEXT_CHARS = 160;

export function validate(value: unknown): Answer | null {
  if (typeof value !== 'object' || value === null) return null;
  const v = value as Record<string, unknown>;

  if (typeof v.reply !== 'string' || v.reply.trim() === '') return null;

  /* An unknown route is "none", never an invented destination. */
  const route: Route = ROUTES.includes(v.route as Route) ? (v.route as Route) : 'none';

  let context: LearnedContext | undefined;
  if (typeof v.context === 'object' && v.context !== null) {
    const c = v.context as Record<string, unknown>;
    const out: LearnedContext = {};
    const name = typeof c.name === 'string' ? c.name.trim() : '';
    const place = typeof c.place === 'string' ? c.place.trim() : '';
    if (name && name.length <= MAX_CONTEXT_CHARS) out.name = name;
    if (place && place.length <= MAX_CONTEXT_CHARS) out.place = place;
    if (KINDS.includes(c.kind as Kind)) out.kind = c.kind as Kind;
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

