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
 */

export type WellingtonRoute = 'none' | 'eligibility' | 'quantification' | 'map' | 'paid';
export type LearnedKind = 'water' | 'carbon' | 'unsure';

export interface Learned {
  name?: string;
  place?: string;
  kind?: LearnedKind;
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

const ROUTES: WellingtonRoute[] = ['none', 'eligibility', 'quantification', 'map', 'paid'];
const KINDS: LearnedKind[] = ['water', 'carbon', 'unsure'];

export async function askWellington(
  history: { role: 'user' | 'assistant'; content: string }[],
  signal?: AbortSignal
): Promise<WellingtonAnswer> {
  let response: Response;
  try {
    response = await fetch('/api/wellington', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: history }),
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
    if (typeof c.name === 'string' && c.name.trim()) learned.name = c.name.trim();
    if (typeof c.place === 'string' && c.place.trim()) learned.place = c.place.trim();
    if (KINDS.includes(c.kind as LearnedKind)) learned.kind = c.kind as LearnedKind;
  }

  return {
    reply: data.reply,
    route,
    learned,
    abstained: data.abstained === true,
    abstentionTopic: typeof data.abstentionTopic === 'string' ? data.abstentionTopic : undefined,
  };
}
