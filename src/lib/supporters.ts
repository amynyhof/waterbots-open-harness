/**
 * Supporters, as the page holds them — the words the form and the pop-up show, the calls that post,
 * read, edit and delete, and the posts this browser remembers. Approved 16 Nov 2026, the maintainer's
 * word on #176 (docs/proposals/supporters-2026-11-16.md), changed by her word since.
 *
 * The server's own copy of the limits and the words is api/_supporters.ts; scripts/check-supporters.mjs
 * holds the two to one another, word for word.
 *
 * ~~Every public entry waits for her approval before it shows. Nothing shows or deletes on its own.~~
 * ~~From 18 Nov 2026 a ticked box shows an entry at once.~~ FROM 19 NOV 2026, HER WORD ON #176: the
 * supporters page is the one place to post. There is no box: a comment and Post, then Post again in
 * the pop-up, puts the name and comment on the board at once, after the server's filter
 * (api/_postFilter.ts). The poster can edit and delete their own post, from this browser or from the
 * private link in their email. Nothing deletes on its own.
 */

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

/** The page's intro line, the maintainer's words of 16 Nov 2026. */
export const SUPPORTERS_INTRO = 'People who want water impact to be faster and fairer to prove.';

/** The quiet link to the page, on the Commons and the interest form. */
export const SUPPORTERS_LINK = 'See who supports this work';

/** The pop-up's words before a post goes on the page, her words of 19 Nov 2026. The server keeps them with each post. */
export const CONFIRM_WORDS = 'Your name and comment will show on this page. Your email stays private.';

/** The page's one box, unticked. */
export const NEWSLETTER_WORDS = 'Send me the WaterBots newsletter';

/** The line at the foot of the page, her words of 19 Nov 2026. */
export const QUESTIONS_WORDS = 'Questions?';
export const QUESTIONS_ADDRESS = 'hello@waterbots.ai';

/** The thank-you, after a post: a heading a visitor cannot miss, then how to edit or delete. */
export const THANKS_HEAD = 'Thank you. Your post is on this page.';
export const THANKS_EDIT_LINE = 'To edit or delete it, use the buttons on your card, or the private link in the email we sent you.';
/** When the email with the private link did not go: said plainly, never hidden. */
export const THANKS_NO_MAIL_LINE =
  'To edit or delete it, use the buttons on your card. The email with your private link did not go; write to hello@waterbots.ai if you need it.';

export interface PageForm {
  name: string;
  email: string;
  organisation: string;
  comment: string;
  newsletter: boolean;
  /** The hidden field only a robot fills. */
  website: string;
}

/** A post this browser made, or opened from its email link: the id and the private key. */
export interface OwnPost {
  id: string;
  key: string;
}

export interface Posted {
  shown: ShownSupporter;
  own: OwnPost;
  /** Whether the email with the private link went. */
  mailed: boolean;
}

/** An Error whose message is fit for a reader. */
async function refusal(response: Response, fallback: string): Promise<Error> {
  try {
    const message = ((await response.json()) as { error?: string }).error;
    if (message) return new Error(message);
  } catch {
    /* fall through to the plain line */
  }
  return new Error(fallback);
}

/**
 * Post the page's form, after the pop-up. Resolves with the card, its private key and whether the
 * email went; throws an Error whose message is fit for a reader, the filter's plain line among them.
 */
export async function sendPageForm(form: PageForm, signal?: AbortSignal): Promise<Posted> {
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
        comment: form.comment,
        newsletter: form.newsletter,
        ...(form.website ? { website: form.website } : {}),
      }),
      signal,
    });
  } catch {
    throw new Error('The form could not reach the site. Check your connection and try again. Nothing was kept.');
  }
  if (!response.ok) throw await refusal(response, 'That was not kept. Try again.');
  let body: { shown?: ShownSupporter; edit?: { id?: string; token?: string }; posterMailed?: boolean } = {};
  try {
    body = await response.json();
  } catch {
    /* checked below */
  }
  if (!body.shown || typeof body.shown.name !== 'string' || typeof body.edit?.id !== 'string' || typeof body.edit?.token !== 'string') {
    throw new Error('The site answered, but not with your post. Reload the page to see whether it is there.');
  }
  return { shown: body.shown, own: { id: body.edit.id, key: body.edit.token }, mailed: body.posterMailed === true };
}

/** Change the name and comment of one's own post. Resolves with the changed card. */
export async function editPost(own: OwnPost, name: string, comment: string): Promise<ShownSupporter> {
  let response: Response;
  try {
    response = await fetch('/api/supporter-post', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'edit', id: own.id, key: own.key, name, comment }),
    });
  } catch {
    throw new Error('The site could not be reached. Check your connection and try again. Nothing changed.');
  }
  if (!response.ok) throw await refusal(response, 'That did not change. Try again.');
  const body = (await response.json().catch(() => ({}))) as { shown?: ShownSupporter };
  if (!body.shown) throw new Error('The site answered, but not with your post. Reload the page to see it.');
  return body.shown;
}

/** Delete one's own post. */
export async function deletePost(own: OwnPost): Promise<void> {
  let response: Response;
  try {
    response = await fetch('/api/supporter-post', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id: own.id, key: own.key }),
    });
  } catch {
    throw new Error('The site could not be reached. Check your connection and try again. Nothing changed.');
  }
  if (!response.ok) throw await refusal(response, 'That was not deleted. Try again.');
}

/**
 * THE POSTS THIS BROWSER REMEMBERS — her word of 19 Nov 2026: "their browser remembers the post and
 * shows Edit and Delete on their card". Kept in this browser's own storage, nowhere else. Storage that
 * is blocked or cleared only means the buttons do not show; the email link still works.
 */
const OWN_KEY = 'wb-supporter-posts';
const OWN_ID = /^[a-z0-9]{3,12}$/;
const OWN_SECRET = /^[A-Za-z0-9_-]{43}$/;

export function ownPosts(): OwnPost[] {
  try {
    const list: unknown = JSON.parse(window.localStorage.getItem(OWN_KEY) ?? '[]');
    return Array.isArray(list)
      ? list.filter((p): p is OwnPost => !!p && typeof p.id === 'string' && OWN_ID.test(p.id) && typeof p.key === 'string' && OWN_SECRET.test(p.key))
      : [];
  } catch {
    return [];
  }
}

export function rememberPost(own: OwnPost): void {
  try {
    const list = ownPosts().filter((p) => p.id !== own.id);
    window.localStorage.setItem(OWN_KEY, JSON.stringify([own, ...list].slice(0, 20)));
  } catch {
    /* storage blocked: the email link still works */
  }
}

export function forgetPost(id: string): void {
  try {
    window.localStorage.setItem(OWN_KEY, JSON.stringify(ownPosts().filter((p) => p.id !== id)));
  } catch {
    /* nothing to forget */
  }
}

/** The private link's part after the #: "edit=<id>.<key>". Anything else is ignored, with no error. */
export function ownPostFromHash(hash: string): OwnPost | null {
  const match = /^#edit=([a-z0-9]{3,12})\.([A-Za-z0-9_-]{43})$/.exec(hash);
  return match ? { id: match[1], key: match[2] } : null;
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
  /** The post's id: how its poster's browser finds its card. */
  id: string;
  name: string;
  organisation: string;
  role: string;
  title: string;
  comment: string;
  /** "YYYY-MM", the month it went on the page. */
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
    (s) => s && typeof s.id === 'string' && typeof s.name === 'string' && s.name.trim() !== '' && (s.role === '' || roleLabel(s.role) !== '')
  );
  return { kind: 'list', supporters };
}
