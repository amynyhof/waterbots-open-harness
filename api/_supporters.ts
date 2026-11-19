/**
 * Supporters — the public part of Register your interest.
 *
 * APPROVED 16 Nov 2026, the maintainer's word on #176 (docs/proposals/supporters-2026-11-16.md).
 * A person who sends the interest form may tick "Show my support publicly". Their name as typed,
 * their organisation, a role from a closed list, and an optional title and comment then wait for
 * her approval. ~~**Nothing shows on its own and nothing deletes on its own.**~~
 *
 * **NO APPROVAL STEP ON THE SUPPORTERS PAGE'S OWN FORM, from 18 Nov 2026, her word on #176.** A
 * visitor who ticks "Show my name and comment on this page" goes straight into supporters:shown,
 * stamped `shownAt`, once the filter in api/_postFilter.ts lets it through. She takes one off with
 * `npm run supporters -- hide <id>`. Register your interest's own box is unchanged and still waits.
 * Nothing deletes on its own.
 *
 * THREE STATES, three hashes in the store, keyed by a short random id:
 *   supporters:waiting   sent, not yet looked at — never on the page
 *   supporters:shown     she approved it, or it came from the page's own form — the only state on the page
 *   supporters:declined  she declined it, or hid it — never on the page
 * No expiry, never trimmed. An entry moves only by her command (scripts/supporters.mjs), and leaves
 * only when the person asks for their sign-up to be removed (scripts/count-interest.mjs --remove).
 *
 * THE EMAIL IS NEVER HERE. A supporter entry holds the public fields and the dates. The sign-up in
 * `interest:signups` holds the email and the supporter id, which is how a removal finds both.
 */

export const SUPPORTER_KEYS = {
  waiting: 'supporters:waiting',
  shown: 'supporters:shown',
  declined: 'supporters:declined',
} as const;

/** The closed list of roles, in the form's order. The ids are what is kept. */
export const ROLES = [
  { id: 'developer', label: 'Developer' },
  { id: 'standard-body', label: 'Standard body' },
  { id: 'consultant', label: 'Consultant' },
  { id: 'auditor', label: 'Auditor' },
  { id: 'funder', label: 'Funder' },
  { id: 'other', label: 'Other' },
] as const;

export const SUPPORT_LIMITS = { title: 80, comment: 280 } as const;

/** The public box's words, exactly as the form shows them; kept with each entry. */
export const PUBLIC_WORDS =
  'Show my support publicly. My name, title, organisation, role and comment appear on the supporters page once the WaterBots team approves them. My email never does.';

/** The supporters page's two boxes, exactly as the page shows them (18 Nov 2026, #176). */
export const SHOW_WORDS = 'Show my name and comment on this page';
export const NEWSLETTER_WORDS = 'Send me the WaterBots newsletter';

/** A comment carries no links: an address, a "www." or a bare domain is refused, not cut. */
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
  /** The box's words they agreed to. */
  agreed: string;
  /** Set when she approves it. */
  approvedAt?: string;
  /** Set when it went on the page straight from the page's own form, with no approval (18 Nov 2026). */
  shownAt?: string;
  /** Set when she declines or hides it. */
  declinedAt?: string;
}

/** What the page is given: the shown entries' public fields, and the month they were approved. */
export interface ShownSupporter {
  name: string;
  organisation: string;
  role: string;
  title: string;
  comment: string;
  /** "YYYY-MM", the month it went on the page. Never the day. */
  joined: string;
}

function text(value: unknown, field: string, max: number): string | { problem: string } {
  if (value === undefined) return '';
  if (typeof value !== 'string') return { problem: `${field} is not text` };
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length > max) return { problem: `${field} is longer than ${max} characters` };
  return clean;
}

/**
 * The public part of a form, read only when the public box is ticked. Unticked, any of the three
 * fields with something in it is refused: nothing public is ever sent by accident.
 *
 * THE SUPPORTERS PAGE'S FORM (18 Nov 2026, #176) asks a comment whether or not the box is ticked,
 * and no role or title. Its comment comes back as `comment`, kept with the sign-up; ticked, the
 * public part is the name and that comment alone, with no role, title or organisation.
 */
export function readSupport(
  b: Record<string, unknown>,
  source: 'interest' | 'supporters' = 'interest'
): { support: SupportFields | null; comment: string } | { problem: string } {
  if (source === 'supporters') {
    for (const key of ['role', 'title']) {
      if (b[key] !== undefined && b[key] !== '') return { problem: `this form has no ${key}` };
    }
    if (b.public !== undefined && typeof b.public !== 'boolean') return { problem: 'the box to show your name is not a yes or a no' };
    const comment = text(b.comment, 'comment', SUPPORT_LIMITS.comment);
    if (typeof comment !== 'string') return comment;
    if (LINK.test(comment)) return { problem: 'the comment carries a link, and links are not shown' };
    return { support: b.public === true ? { role: '', title: '', comment } : null, comment };
  }
  if (b.public !== true) {
    if (b.public !== undefined && b.public !== false) return { problem: 'the box to show support is not a yes or a no' };
    for (const key of ['role', 'title', 'comment']) {
      if (b[key] !== undefined && b[key] !== '') return { problem: `${key} came without the box to show support ticked` };
    }
    return { support: null, comment: '' };
  }
  const roleIds: readonly string[] = ROLES.map((r) => r.id);
  if (typeof b.role !== 'string' || !roleIds.includes(b.role)) return { problem: 'a role from the list is needed to show support' };
  const title = text(b.title, 'title', SUPPORT_LIMITS.title);
  if (typeof title !== 'string') return title;
  const comment = text(b.comment, 'comment', SUPPORT_LIMITS.comment);
  if (typeof comment !== 'string') return comment;
  if (LINK.test(comment)) return { problem: 'the comment carries a link, and links are not shown' };
  return { support: { role: b.role, title, comment }, comment: '' };
}

/** A short random id: five letters and digits, lower case. */
export function supporterId(): string {
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

/** The entry for a sign-up that asked to show support: waiting, or, from the page's own form, shown at once. */
export function supporterEntry(
  id: string,
  name: string,
  organisation: string,
  support: SupportFields,
  now: Date,
  source: 'interest' | 'supporters' = 'interest'
): SupporterEntry {
  const at = now.toISOString();
  if (source === 'supporters') return { id, at, name, organisation, ...support, agreed: SHOW_WORDS, shownAt: at };
  return { id, at, name, organisation, ...support, agreed: PUBLIC_WORDS };
}

/** When an entry went on the page: approved by her, or shown straight from the page's form. */
function onPageSince(e: SupporterEntry): string {
  return e.approvedAt ?? e.shownAt ?? '';
}

/** One shown entry, as the page gets it: public fields only. */
export function forPage(e: SupporterEntry): ShownSupporter {
  return {
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
      if (e && typeof e.name === 'string' && onPageSince(e) !== '') entries.push(e);
    } catch {
      /* An unreadable entry is not shown. */
    }
  }
  entries.sort((a, b) => onPageSince(b).localeCompare(onPageSince(a)));
  return entries.map(forPage);
}
