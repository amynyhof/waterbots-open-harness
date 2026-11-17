/**
 * Register your interest — what a sign-up is, and the email copy of it.
 *
 * THE MAINTAINER'S PLAN OF 14 Nov 2026 (round 3, ruling 4), restated in
 * docs/proposals/queued-round-2026-11-16.md and approved on 16 Nov 2026 with
 * her ruling on keeping: **no time limit. A sign-up is kept until the person
 * asks to be removed, and the form says how to ask. Nothing deletes on its
 * own.**
 *
 * A SIGN-UP IS EXACTLY THESE FIELDS, or it is refused whole and the refusal
 * names the field: a name, an organisation, an email, one or more interests
 * from a closed list, the Commons module it came from if any, and the consent
 * box, which must be ticked. Nothing is repaired or guessed. A hidden field
 * that only a robot fills (`website`) is read here too, so the endpoint can
 * drop that request without a word.
 *
 * WHO SEES IT: people on the Vercel team with access to the store, and whoever
 * reads the hello@waterbots.ai inbox. Nothing shows on the site, and nothing
 * goes to the paid site. scripts/count-interest.mjs counts sign-ups and
 * organisations and never prints a name or an email.
 *
 * SUPPORTERS, from 16 Nov 2026 (#176): a sign-up may also tick "Show my support
 * publicly", with a role, a title and a comment. That public part waits for the
 * maintainer's approval in its own place (api/_supporters.ts), never with the
 * email; the sign-up keeps the supporter's id so a removal finds both.
 */

import { readSupport, type SupportFields } from './_supporters.js';

/** The store's one list for sign-ups. No expiry, never trimmed: her ruling. */
export const INTEREST_KEY = 'interest:signups';

/** The closed list of interests, in the form's order. The ids are what is kept. */
export const INTERESTS = [
  { id: 'carbon', label: 'Carbon credits' },
  { id: 'water', label: 'Water benefits' },
  { id: 'partners', label: 'Partners and funders' },
  { id: 'commons', label: 'The Agent Commons' },
  { id: 'other', label: 'Something else' },
] as const;

export const INTEREST_LIMITS = { name: 80, organisation: 120, email: 254 } as const;

/** The consent words, exactly as the form shows them; kept with each sign-up. */
export const CONSENT_WORDS =
  'Keep my details so the WaterBots team can contact me about this site. I can ask to be removed at any time by writing to hello@waterbots.ai.';

/** One body is small; anything larger is not a sign-up. */
export const MAX_INTEREST_BYTES = 2000;

export interface InterestBody {
  name: string;
  organisation: string;
  email: string;
  interests: string[];
  module: string;
  /** The public part, only when the box to show support is ticked. */
  support: SupportFields | null;
}

export type InterestReading = { signup: InterestBody } | { robot: true } | { problem: string };

const KEYS = ['name', 'organisation', 'email', 'interests', 'module', 'consent', 'website', 'public', 'role', 'title', 'comment'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MODULE = /^[a-z0-9-]{1,40}$/;

function text(value: unknown, field: string, max: number, required: boolean): string | { problem: string } {
  if (value === undefined && !required) return '';
  if (typeof value !== 'string') return { problem: `${field} is not text` };
  const clean = value.replace(/\s+/g, ' ').trim();
  if (required && !clean) return { problem: `${field} is empty` };
  if (clean.length > max) return { problem: `${field} is longer than ${max} characters` };
  return clean;
}

/** Read a sign-up off a request body, or say what was wrong with it. */
export function readInterest(body: unknown): InterestReading {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return { problem: 'the form could not be read' };
  const b = body as Record<string, unknown>;
  for (const key of Object.keys(b)) if (!KEYS.includes(key)) return { problem: `the form carries "${key}"` };

  /* The hidden field: a person never sees it, so a filled one is a robot. */
  if (typeof b.website === 'string' && b.website.trim() !== '') return { robot: true };

  const name = text(b.name, 'name', INTEREST_LIMITS.name, true);
  if (typeof name !== 'string') return name;
  const organisation = text(b.organisation, 'organisation', INTEREST_LIMITS.organisation, true);
  if (typeof organisation !== 'string') return organisation;
  const email = text(b.email, 'email', INTEREST_LIMITS.email, true);
  if (typeof email !== 'string') return email;
  if (!EMAIL.test(email)) return { problem: 'email is not an email address' };

  if (!Array.isArray(b.interests) || b.interests.length === 0) return { problem: 'no interest is chosen' };
  const ids: readonly string[] = INTERESTS.map((i) => i.id);
  const interests: string[] = [];
  for (const id of b.interests) {
    if (typeof id !== 'string' || !ids.includes(id)) return { problem: 'an interest is not one on the list' };
    if (!interests.includes(id)) interests.push(id);
  }

  const module = b.module === undefined || b.module === '' ? '' : typeof b.module === 'string' && MODULE.test(b.module) ? b.module : null;
  if (module === null) return { problem: 'module is not a module' };

  /* The box must be ticked: exactly true, never a truthy something. */
  if (b.consent !== true) return { problem: 'the box to keep these details is not ticked' };

  const reading = readSupport(b);
  if ('problem' in reading) return reading;

  return { signup: { name, organisation, email: email.toLowerCase(), interests, module, support: reading.support } };
}

/**
 * The entry kept in the store: the sign-up, the date, and the consent words it agreed to. A sign-up
 * that asked to show support keeps the supporter's id, and nothing public beyond what it already holds.
 */
export function interestEntry(signup: InterestBody, now: Date, supporter?: string): string {
  const { support, ...kept } = signup;
  return JSON.stringify({ at: now.toISOString(), ...kept, consent: CONSENT_WORDS, ...(support && supporter ? { supporter } : {}) });
}

/** The copy to hello@waterbots.ai, in plain words. */
export function composeInterestMail(signup: InterestBody, now: Date, supporter?: string): { subject: string; text: string } {
  const labels = signup.interests.map((id) => INTERESTS.find((i) => i.id === id)?.label ?? id);
  const lines = [
    'Someone registered their interest on open.waterbots.ai.',
    '',
    `Name: ${signup.name}`,
    `Organisation: ${signup.organisation}`,
    `Email: ${signup.email}`,
    `Interested in: ${labels.join(', ')}`,
    ...(signup.module ? [`From the Agent Commons module: ${signup.module}`] : []),
    `When: ${now.toISOString().slice(0, 16).replace('T', ' ')} UTC`,
    '',
    `They agreed to: "${CONSENT_WORDS}"`,
    '',
    ...(signup.support && supporter
      ? [
          'They also asked to show their support publicly. It is waiting for your approval and is not on the',
          'supporters page until you approve it. To see what is waiting, run this in the repository folder:',
          '  npm run supporters',
          '',
        ]
      : []),
    'This sign-up is kept in the site store until they ask to be removed. To remove it, run scripts/count-interest.mjs --remove <their email>.',
  ];
  return { subject: `Registered interest: ${signup.organisation}`, text: lines.join('\n') };
}
