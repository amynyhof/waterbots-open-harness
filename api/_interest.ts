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
 * SUPPORTERS, from 16 Nov 2026 (#176): ~~a sign-up may also tick "Show my support
 * publicly", with a role, a title and a comment, which waits for the maintainer's
 * approval.~~ From 19 Nov 2026, her word, Register your interest posts nothing: the
 * supporters page is the one place to post (api/_supporters.ts). A post never holds
 * the email; the sign-up keeps the supporter's id so a removal finds both.
 */

import { BLOCKED_LINE, blockedPost } from './_postFilter.js';
import { CONFIRM_WORDS, LINK, NEWSLETTER_WORDS, readSupport, type SupportFields } from './_supporters.js';

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

/**
 * THE SUPPORTERS PAGE'S OWN FORM, from 18 Nov 2026, the maintainer's word on #176. It saves to the
 * same list as Register your interest, marked `source: 'supporters'`, and asks less: a name, an email,
 * an organisation if they like, a short comment, and two boxes, both unticked: "Show my name and
 * comment on this page" and "Send me the WaterBots newsletter". No interests and no consent box; the
 * thank-you line says how to change or remove the entry. ~~A public entry still waits for her approval.~~
 * From the same day, her word, a public entry goes on the page at once, after the filter
 * (api/_postFilter.ts); a blocked one is refused whole, with BLOCKED_LINE, and nothing is kept.
 */
export const SOURCES = ['interest', 'supporters'] as const;
export type Source = (typeof SOURCES)[number];

/** One body is small; anything larger is not a sign-up. */
export const MAX_INTEREST_BYTES = 2000;

export interface InterestBody {
  name: string;
  organisation: string;
  email: string;
  interests: string[];
  module: string;
  /** Which form sent it: Register your interest, or the supporters page (18 Nov 2026). */
  source: Source;
  /** The supporters page's comment, kept with the sign-up whether or not it is shown. */
  comment: string;
  /** The newsletter box, ticked. Only the supporters page asks it. */
  newsletter: boolean;
  /** The public part, only when the box to show support is ticked. */
  support: SupportFields | null;
}

export type InterestReading = { signup: InterestBody } | { robot: true } | { problem: string } | { blocked: string };

const KEYS = ['name', 'organisation', 'email', 'interests', 'module', 'consent', 'website', 'public', 'role', 'title', 'comment', 'source', 'newsletter'];
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

  if (b.source !== undefined && !(SOURCES as readonly unknown[]).includes(b.source)) return { problem: "the form is not one of this site's forms" };
  const source: Source = b.source === 'supporters' ? 'supporters' : 'interest';
  const page = source === 'supporters';

  const name = text(b.name, 'name', INTEREST_LIMITS.name, true);
  if (typeof name !== 'string') return name;
  /* The supporters page asks the organisation as optional. */
  const organisation = text(b.organisation, 'organisation', INTEREST_LIMITS.organisation, !page);
  if (typeof organisation !== 'string') return organisation;
  const email = text(b.email, 'email', INTEREST_LIMITS.email, true);
  if (typeof email !== 'string') return email;
  if (!EMAIL.test(email)) return { problem: 'email is not an email address' };

  /* The supporters page asks no interests; Register your interest asks at least one. */
  if (page && b.interests !== undefined && !(Array.isArray(b.interests) && b.interests.length === 0)) return { problem: 'this form asks no interests' };
  if (!page && (!Array.isArray(b.interests) || b.interests.length === 0)) return { problem: 'no interest is chosen' };
  const ids: readonly string[] = INTERESTS.map((i) => i.id);
  const interests: string[] = [];
  for (const id of page ? [] : (b.interests as unknown[])) {
    if (typeof id !== 'string' || !ids.includes(id)) return { problem: 'an interest is not one on the list' };
    if (!interests.includes(id)) interests.push(id);
  }

  const module = b.module === undefined || b.module === '' ? '' : typeof b.module === 'string' && MODULE.test(b.module) ? b.module : null;
  if (module === null) return { problem: 'module is not a module' };

  /* Register your interest: the box must be ticked, exactly true, never a truthy something. The
     supporters page has no such box; sending it is the ask, and its thank-you says how to change or remove. */
  if (!page && b.consent !== true) return { problem: 'the box to keep these details is not ticked' };
  if (page && b.consent !== undefined) return { problem: 'this form has no box to keep details' };

  if (b.newsletter !== undefined && typeof b.newsletter !== 'boolean') return { problem: 'the newsletter box is not a yes or a no' };
  if (!page && b.newsletter === true) return { problem: 'this form does not ask about the newsletter' };
  const newsletter = b.newsletter === true;

  const reading = readSupport(b, source);
  if ('problem' in reading) return reading;

  /* What goes on the board passes the filter, or the whole send is refused (18 Nov 2026, #176).
     The name is shown too, so it carries no link either. */
  if (reading.support) {
    if (LINK.test(name)) return { problem: 'the name carries a link, and links are not shown' };
    if (blockedPost([name, reading.support.comment])) return { blocked: BLOCKED_LINE };
  }

  return {
    signup: {
      name,
      organisation,
      email: email.toLowerCase(),
      interests,
      module,
      source,
      comment: reading.comment,
      newsletter,
      support: reading.support,
    },
  };
}

/**
 * The entry kept in the store: the sign-up, the date, and the consent words it agreed to. A sign-up
 * that asked to show support keeps the supporter's id, and nothing public beyond what it already holds.
 */
export function interestEntry(signup: InterestBody, now: Date, supporter?: string): string {
  const { support, ...kept } = signup;
  /* What they agreed to, in the words the form showed: the box on Register your interest; on the supporters page, the pop-up and the newsletter box. */
  const consent = signup.source === 'supporters' ? pageFormWords(signup) : CONSENT_WORDS;
  return JSON.stringify({ at: now.toISOString(), ...kept, consent, ...(support && supporter ? { supporter } : {}) });
}

/** What a supporters-page sign-up agreed to: the pop-up's words when it posted, and the newsletter box if ticked. */
function pageFormWords(signup: InterestBody): string {
  const posted = signup.support ? ` Posted after the pop-up: "${CONFIRM_WORDS}"` : '';
  const ticked = signup.newsletter ? ` Ticked: "${NEWSLETTER_WORDS}".` : '';
  return `Sent from the form on the supporters page.${posted}${ticked}`;
}

/** The copy to hello@waterbots.ai, in plain words. */
export function composeInterestMail(signup: InterestBody, now: Date, supporter?: string): { subject: string; text: string } {
  const labels = signup.interests.map((id) => INTERESTS.find((i) => i.id === id)?.label ?? id);
  const page = signup.source === 'supporters';
  const lines = [
    page ? 'Someone sent the form on the supporters page of open.waterbots.ai.' : 'Someone registered their interest on open.waterbots.ai.',
    '',
    `Name: ${signup.name}`,
    `Organisation: ${signup.organisation || '(not given)'}`,
    `Email: ${signup.email}`,
    ...(page
      ? [`Comment: ${signup.comment || '(none)'}`, `Newsletter: ${signup.newsletter ? 'yes, please send it' : 'no'}`]
      : [`Interested in: ${labels.join(', ')}`]),
    ...(signup.module ? [`From the Agent Commons module: ${signup.module}`] : []),
    `When: ${now.toISOString().slice(0, 16).replace('T', ' ')} UTC`,
    '',
    ...(page ? [] : [`They agreed to: "${CONSENT_WORDS}"`]),
    '',
    ...(signup.support && supporter
      ? [
          'Their name and comment are on the supporters page now. They can edit or delete the post themselves.',
          'To take it off, run this in the repository folder:',
          `  npm run supporters -- hide ${supporter}`,
          '',
        ]
      : []),
    'This sign-up is kept in the site store until they ask to be removed. To remove it, run scripts/count-interest.mjs --remove <their email>.',
  ];
  return { subject: page ? `Supporters page: ${signup.name}` : `Registered interest: ${signup.organisation}`, text: lines.join('\n') };
}

/**
 * The email to the poster, with the private link to edit or delete their post (19 Nov 2026, her word
 * on #176). Plain words; the link is theirs alone, so the email says to keep it to themselves.
 */
export function composePosterMail(signup: InterestBody, link: string): { subject: string; text: string } {
  const lines = [
    `Hello ${signup.name},`,
    '',
    'Thank you for posting on the WaterBots supporters page. This is your post:',
    '',
    `  "${signup.support?.comment ?? signup.comment}"`,
    '',
    'To edit or delete it, open this private link:',
    link,
    '',
    'Keep this link to yourself. Anyone who has it can change your post.',
    '',
    'Questions? Write to hello@waterbots.ai.',
  ];
  return { subject: 'Your post on the WaterBots supporters page', text: lines.join('\n') };
}
