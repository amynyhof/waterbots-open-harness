/**
 * Supporters — the board on /supporters.
 *
 * APPROVED 16 Nov 2026, the maintainer's word on #176 (docs/proposals/supporters-2026-11-16.md),
 * and changed by her word since:
 *   - ~~A person who sends the interest form may tick "Show my support publicly" ... then wait for her
 *     approval.~~ From 19 Nov 2026 Register your interest has no public box: **the supporters page is
 *     the one place to post.**
 *   - ~~A ticked "Show my name and comment on this page" goes on the board at once (18 Nov 2026).~~
 *     From 19 Nov 2026 there is no box: **writing a comment and pressing Post, then Post again in the
 *     pop-up, puts the name and comment on the board at once**, after the filter in
 *     api/_postFilter.ts. The pop-up's words are kept with the entry.
 *   - **The poster can edit and delete their own post** (19 Nov 2026): each post has a private key,
 *     sent once to the poster's browser and in an email link, never stored here. The store keeps only
 *     its SHA-256 (`editKey`), which never leaves the server. Edits pass the same filter.
 * She takes a post off with `npm run supporters -- hide <id>`. Nothing deletes on its own: a post goes
 * only when its poster deletes it, or when the person asks for their sign-up to be removed.
 *
 * THREE STATES, three hashes in the store, keyed by a short random id:
 *   supporters:shown     on the page
 *   supporters:waiting   from before 19 Nov 2026 only: sent from Register your interest, not yet approved
 *   supporters:declined  she declined it, or hid it — never on the page
 *
 * THE EMAIL IS NEVER HERE. A supporter entry holds the public fields, the dates and the edit key's
 * hash. The sign-up in `interest:signups` holds the email and the supporter id, which is how a
 * removal finds both.
 */

export const SUPPORTER_KEYS = {
  waiting: 'supporters:waiting',
  shown: 'supporters:shown',
  declined: 'supporters:declined',
} as const;

/** The roles of entries approved before 19 Nov 2026. No form asks one now; the page still labels them. */
export const ROLES = [
  { id: 'developer', label: 'Developer' },
  { id: 'standard-body', label: 'Standard body' },
  { id: 'consultant', label: 'Consultant' },
  { id: 'auditor', label: 'Auditor' },
  { id: 'funder', label: 'Funder' },
  { id: 'other', label: 'Other' },
] as const;

export const SUPPORT_LIMITS = { name: 80, comment: 280 } as const;

/** The pop-up's words before a post goes on the page, exactly as it shows them; kept with each post. */
export const CONFIRM_WORDS = 'Your name and comment will show on this page. Your email stays private.';

/** The supporters page's one box, exactly as the page shows it. */
export const NEWSLETTER_WORDS = 'Send me the WaterBots newsletter';

/** Nothing shown carries a link: an address, a "www." or a bare domain is refused, not cut. */
export const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|org|net|io|ai|co|info|biz|uk|de|fr|in|ke|ug|tz|ly|me|app|dev)\b)/i;

export interface SupportFields {
  role: string;
  title: string;
  comment: string;
}

/** What is kept in a supporter hash. No email, ever. */
export interface SupporterEntry {
  id: string;
  /** When the form was sent. */
  at: string;
  name: string;
  organisation: string;
  role: string;
  title: string;
  comment: string;
  /** The words they agreed to: the pop-up's, or, before 19 Nov 2026, a box's. */
  agreed: string;
  /** Set when she approved it (before 19 Nov 2026). */
  approvedAt?: string;
  /** Set when it went on the page straight from the page's own form. */
  shownAt?: string;
  /** Set when its poster last edited it. */
  editedAt?: string;
  /** Set when she declines or hides it. */
  declinedAt?: string;
  /** The SHA-256 of the post's private edit key, as hex. Never sent to the page. */
  editKey?: string;
}

/** What the page is given: the shown entries' public fields, the id, and the month they went on the page. */
export interface ShownSupporter {
  id: string;
  name: string;
  organisation: string;
  role: string;
  title: string;
  comment: string;
  /** "YYYY-MM", the month it went on the page. Never the day. */
  joined: string;
}

/** One line of text: spaces folded, ends trimmed, within its limit. */
export function oneLine(value: unknown, field: string, max: number, required: boolean): string | { problem: string } {
  if (value === undefined && !required) return '';
  if (typeof value !== 'string') return { problem: `${field} is not text` };
  const clean = value.replace(/\s+/g, ' ').trim();
  if (required && !clean) return { problem: `${field} is empty` };
  if (clean.length > max) return { problem: `${field} is longer than ${max} characters` };
  return clean;
}

const NOT_HERE = 'this form does not post to the supporters page; post on the supporters page itself';

/**
 * The post in a form, if there is one.
 *
 * REGISTER YOUR INTEREST posts nothing from 19 Nov 2026: a public box, a role, a title or a comment
 * is refused, named.
 *
 * THE SUPPORTERS PAGE posts every time: a comment is needed, with no link. A page left open from
 * before 19 Nov 2026 may still send its old box; unticked (`public: false`) it is honoured and nothing
 * posts, since that visitor never saw the pop-up.
 */
export function readSupport(
  b: Record<string, unknown>,
  source: 'interest' | 'supporters' = 'interest'
): { support: SupportFields | null; comment: string } | { problem: string } {
  if (source === 'interest') {
    if (b.public !== undefined && b.public !== false) return { problem: NOT_HERE };
    for (const key of ['role', 'title', 'comment']) {
      if (b[key] !== undefined && b[key] !== '') return { problem: NOT_HERE };
    }
    return { support: null, comment: '' };
  }
  for (const key of ['role', 'title']) {
    if (b[key] !== undefined && b[key] !== '') return { problem: `this form has no ${key}` };
  }
  if (b.public !== undefined && typeof b.public !== 'boolean') return { problem: 'the old box to show your name is not a yes or a no' };
  const comment = oneLine(b.comment, 'comment', SUPPORT_LIMITS.comment, true);
  if (typeof comment !== 'string') return { problem: comment.problem === 'comment is empty' ? 'a post needs a comment' : comment.problem };
  if (LINK.test(comment)) return { problem: 'the comment carries a link, and links are not shown' };
  return { support: b.public === false ? null : { role: '', title: '', comment }, comment };
}

/** A short random id: five letters and digits, lower case. */
export function supporterId(): string {
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

export const ID_SHAPE = /^[a-z0-9]{3,12}$/;
export const KEY_SHAPE = /^[A-Za-z0-9_-]{43}$/;

/** A post's private edit key: 32 random bytes, as base64url (43 characters). Given out once, never kept. */
export function editToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let text = '';
  for (const b of bytes) text += String.fromCharCode(b);
  return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** What the store keeps of a key: its SHA-256, as hex. */
export async function editKeyOf(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** The post from the supporters page: on the page at once, the name and comment alone. */
export function supporterEntry(id: string, name: string, support: SupportFields, now: Date, editKey: string): SupporterEntry {
  const at = now.toISOString();
  return { id, at, name, organisation: '', role: '', title: '', comment: support.comment, agreed: CONFIRM_WORDS, shownAt: at, editKey };
}

/** When an entry went on the page: approved by her, or shown straight from the page's form. */
function onPageSince(e: SupporterEntry): string {
  return e.approvedAt ?? e.shownAt ?? '';
}

/** One shown entry, as the page gets it: public fields only, never the edit key. */
export function forPage(e: SupporterEntry): ShownSupporter {
  return {
    id: e.id,
    name: e.name,
    organisation: e.organisation ?? '',
    role: e.role ?? '',
    title: e.title ?? '',
    comment: e.comment ?? '',
    joined: onPageSince(e).slice(0, 7),
  };
}

/** The shown entries, as the page gets them: newest first, public fields only. */
export function shownForPage(values: string[]): ShownSupporter[] {
  const entries: SupporterEntry[] = [];
  for (const raw of values) {
    try {
      const e = JSON.parse(raw) as SupporterEntry;
      if (e && typeof e.name === 'string' && typeof e.id === 'string' && onPageSince(e) !== '') entries.push(e);
    } catch {
      /* An unreadable entry is not shown. */
    }
  }
  entries.sort((a, b) => onPageSince(b).localeCompare(onPageSince(a)));
  return entries.map(forPage);
}

/** Where a private edit link points: this site, or its preview, never an address a request made up. */
export function editLink(requestUrl: string, id: string, token: string): string {
  let origin = 'https://open.waterbots.ai';
  try {
    const url = new URL(requestUrl);
    const host = url.hostname;
    if (host === 'open.waterbots.ai' || host === 'localhost' || host === '127.0.0.1' || /^waterbots-open-harness[a-z0-9-]*\.vercel\.app$/.test(host)) {
      origin = url.origin;
    }
  } catch {
    /* keep the site's own address */
  }
  /* The key rides after the #, so it is never sent to a server or kept in a log. */
  return `${origin}/supporters#edit=${id}.${token}`;
}
