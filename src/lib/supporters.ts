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

/**
 * THE PAGE'S OWN FORM — the maintainer's word of 18 Nov 2026 on #176, in place of the Register your
 * interest box. It saves where that form saves (POST /api/interest, the store's `interest:signups`
 * list), marked as sent from this page. Name and email are needed; organisation and comment are not;
 * both boxes start unticked. A ticked "show" box sends the name and comment to wait for her approval,
 * like every public entry. The box words are the server's (api/_supporters.ts), word for word.
 */
export const SHOW_WORDS = 'Show my name and comment on this page';
export const NEWSLETTER_WORDS = 'Send me the WaterBots newsletter';

/** The thank-you, after the form is kept. */
export const THANKS_LINE = 'Thank you. To change or remove your entry, write to hello@waterbots.ai.';
/** Added to the thank-you when the "show" box was ticked, so no one waits for an entry that is waiting on a person. */
export const SHOWN_AFTER_LOOK_LINE = 'Your name and comment will show here once the WaterBots team has looked at them.';

export interface PageForm {
  name: string;
  email: string;
  organisation: string;
  comment: string;
  show: boolean;
  newsletter: boolean;
  /** The hidden field only a robot fills. */
  website: string;
}

/** Send the page's form. Resolves when it was kept; throws an Error whose message is fit for a reader. */
export async function sendPageForm(form: PageForm, signal?: AbortSignal): Promise<void> {
  let response: Response;
  try {
    response = await fetch('/api/interest', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        source: 'supporters',
        name: form.name,
        email: form.email,
        ...(form.organisation.trim() ? { organisation: form.organisation } : {}),
        ...(form.comment.trim() ? { comment: form.comment } : {}),
        public: form.show,
        newsletter: form.newsletter,
        ...(form.website ? { website: form.website } : {}),
      }),
      signal,
    });
  } catch {
    throw new Error('The form could not reach the site. Check your connection and try again. Nothing was kept.');
  }
  if (response.ok) return;
  let message = '';
  try {
    message = ((await response.json()) as { error?: string }).error ?? '';
  } catch {
    /* fall through to the plain line */
  }
  throw new Error(message || 'That was not kept. Try again.');
}

/**
 * THE AGENTS ARE THE BOARD'S FIRST ENTRIES — the maintainer's word of 18 Nov 2026 on #176. Each is
 * one of the crew (src/lib/crew.ts), shown with its icon, its name, a small "WaterBots agent" tag
 * and one line in its own voice on why water impact should be faster and fairer to prove. They are
 * the site's own words, written for her to read and approve, and tagged so no one takes them for a
 * person's entry. They wait for no one's approval and come from no store.
 */
export const AGENT_TAG = 'WaterBots agent';

export const AGENT_SUPPORTERS: { name: 'Wellington' | 'Phoebe' | 'Bridget' | 'Calvin'; comment: string }[] = [
  { name: 'Wellington', comment: 'Good water projects should not have to wait years to show they help people.' },
  { name: 'Phoebe', comment: 'Clear rules mean every project gets a fair check, not just the big ones.' },
  { name: 'Bridget', comment: 'A small village should get the same fair look as a big city.' },
  { name: 'Calvin', comment: 'When the math is open, anyone can check it, and the proof comes faster.' },
];

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
    (s) => s && typeof s.name === 'string' && s.name.trim() !== '' && (s.role === '' || roleLabel(s.role) !== '')
  );
  return { kind: 'list', supporters };
}
