/**
 * Register your interest, as the page holds it — the words the form shows and
 * the one call that sends it. The server's own copy of the list, the limits
 * and the consent words is api/_interest.ts; scripts/check-interest.mjs holds
 * the two to one another, word for word, so the form never shows a line the
 * server would not keep.
 *
 * Kept until the person asks to be removed; nothing deletes on its own — the
 * maintainer's ruling of 16 Nov 2026. The form says how to ask.
 */

export const INTERESTS = [
  { id: 'carbon', label: 'Carbon credits' },
  { id: 'water', label: 'Water benefits' },
  { id: 'partners', label: 'Partners and funders' },
  { id: 'commons', label: 'The Agent Commons' },
  { id: 'other', label: 'Something else' },
] as const;

export const INTEREST_LIMITS = { name: 80, organisation: 120, email: 254 } as const;

/** The box's words. Kept with each sign-up, so it changes only with the server's. */
export const CONSENT_WORDS =
  'Keep my details so the WaterBots team can contact me about this site. I can ask to be removed at any time by writing to hello@waterbots.ai.';

/** How long a sign-up is kept, and how to ask for removal — said under the form. */
export const KEEPING_LINE =
  'We keep these details until you ask us to remove them. Nothing is deleted on its own. To be removed, write to hello@waterbots.ai.';

export interface InterestForm {
  name: string;
  organisation: string;
  email: string;
  interests: string[];
  module: string;
  consent: boolean;
  /** The hidden field only a robot fills. */
  website: string;
  /* ~~The box to show support publicly (16 Nov 2026, #176).~~ Gone from 19 Nov 2026, her word on #176:
     the supporters page is the one place to post. */
}

/** Thrown with a message already fit for a reader. */
export class InterestError extends Error {}

/** Send the form. Resolves when it was kept; throws an InterestError otherwise. */
export async function sendInterest(form: InterestForm, signal?: AbortSignal): Promise<void> {
  let response: Response;
  try {
    response = await fetch('/api/interest', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        organisation: form.organisation,
        email: form.email,
        interests: form.interests,
        ...(form.module ? { module: form.module } : {}),
        consent: form.consent,
        ...(form.website ? { website: form.website } : {}),
      }),
      signal,
    });
  } catch {
    throw new InterestError('The form could not reach the site. Check your connection and try again. Nothing was kept.');
  }
  if (response.ok) return;
  let message = '';
  try {
    message = ((await response.json()) as { error?: string }).error ?? '';
  } catch {
    /* fall through to the plain line */
  }
  throw new InterestError(message || 'That was not kept. Try again.');
}
