/**
 * Supporters, as the page holds them — the words the form's public box shows, the roles, and the
 * one call that reads the shown list. Approved 16 Nov 2026, the maintainer's word on #176
 * (docs/proposals/supporters-2026-11-16.md).
 *
 * The server's own copy of the roles, the limits and the box's words is api/_supporters.ts;
 * scripts/check-supporters.mjs holds the two to one another, word for word.
 *
 * Every public entry waits for her approval before it shows. Nothing shows or deletes on its own.
 */

export const ROLES = [
  { id: 'developer', label: 'Developer' },
  { id: 'standard-body', label: 'Standard body' },
  { id: 'consultant', label: 'Consultant' },
  { id: 'auditor', label: 'Auditor' },
  { id: 'funder', label: 'Funder' },
  { id: 'other', label: 'Other' },
] as const;

export const SUPPORT_LIMITS = { title: 80, comment: 280 } as const;

/** The public box's words: its bold opening, then the rest. Kept with each entry, so they change only with the server's. */
export const PUBLIC_WORDS =
  'Show my support publicly. My name, title, organisation, role and comment appear on the supporters page once the WaterBots team approves them. My email never does.';
export const PUBLIC_OPENING = 'Show my support publicly.';

/** The page's intro line, the maintainer's words of 16 Nov 2026. */
export const SUPPORTERS_INTRO = 'People who want water impact to be faster and fairer to prove.';

/** The quiet link to the page, on the Commons and the form. */
export const SUPPORTERS_LINK = 'See who supports this work';

/** Said after sending, to someone who ticked the public box. */
export const WAITING_LINE = 'Your support will show on the supporters page once the WaterBots team has looked at it.';

/** The page's way off it. */
export const OFF_THE_PAGE_LINE = 'To be taken off this page, write to hello@waterbots.ai.';

export interface ShownSupporter {
  name: string;
  organisation: string;
  role: string;
  title: string;
  comment: string;
  /** "YYYY-MM", the month it was approved. */
  joined: string;
}

export type SupportersReading = { kind: 'list'; supporters: ShownSupporter[] } | { kind: 'failed'; message: string };

/** The role's label, or nothing for an id that is not on the list. */
export function roleLabel(id: string): string {
  return ROLES.find((r) => r.id === id)?.label ?? '';
}

/** "November 2026" from "2026-11". */
export function joinedWords(joined: string): string {
  const [year, month] = joined.split('-').map(Number);
  if (!year || !month) return '';
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** Read the shown list. Never throws: a failure comes back with a line fit for a reader. */
export async function fetchSupporters(signal?: AbortSignal): Promise<SupportersReading> {
  let response: Response;
  try {
    response = await fetch('/api/supporters', { signal });
  } catch {
    return { kind: 'failed', message: 'The supporters list could not be reached. Check your connection and try again.' };
  }
  let payload: { supporters?: unknown; error?: unknown } = {};
  try {
    payload = await response.json();
  } catch {
    /* fall through */
  }
  if (!response.ok || !Array.isArray(payload.supporters)) {
    return {
      kind: 'failed',
      message: typeof payload.error === 'string' && payload.error ? payload.error : 'The supporters list could not be read just now.',
    };
  }
  const supporters = (payload.supporters as ShownSupporter[]).filter(
    (s) => s && typeof s.name === 'string' && s.name.trim() !== '' && roleLabel(s.role) !== ''
  );
  return { kind: 'list', supporters };
}
