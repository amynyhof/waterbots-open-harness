/**
 * POST /api/supporter-post — a poster edits or deletes their own post on /supporters.
 *
 * The maintainer's word of 19 Nov 2026 on #176: the poster can edit and delete their own post, from
 * their browser, which remembers it, or from the private link in their email. Edits go through the
 * same filter as a new post (api/_postFilter.ts).
 *
 *   { action: 'edit', id, key, name, title, organisation, role, comment }
 *                                                every field the card shows, changed (title and
 *                                                organisation may be empty; a role from the list)
 *   { action: 'delete', id, key }                the post off the page, gone from the board's store
 *
 * THE KEY IS THE PROOF. Each post's private key was given out once, when it was posted; the store
 * keeps only its SHA-256 (api/_supporters.ts). A key that does not match changes nothing and says so.
 * A post she took off the page cannot be edited back on; it can still be deleted. Deleting a post
 * keeps the person's sign-up: removing that is still a request to hello@waterbots.ai.
 *
 * Every answer says what happened, in words a visitor can read.
 */

import { BLOCKED_LINE, blockedPost } from './_postFilter.js';
import { StoreError, hashFields, hashWrites, storeConfig } from './_store.js';
import {
  ID_SHAPE,
  KEY_SHAPE,
  SUPPORTER_KEYS,
  SUPPORT_LIMITS,
  editKeyOf,
  forPage,
  linkIn,
  oneLine,
  readRole,
  type SupporterEntry,
} from './_supporters.js';

const MAX_BYTES = 2000;
const KEYS = ['action', 'id', 'key', 'name', 'title', 'organisation', 'role', 'comment'];
const FIELDS = ['name', 'title', 'organisation', 'role', 'comment'];

export async function GET(): Promise<Response> {
  return problem(405, 'This address takes POST requests only.');
}

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BYTES) return problem(413, 'That is more than a post takes. Nothing changed.');
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return problem(400, 'That could not be read. Nothing changed.');
  }
  for (const k of Object.keys(body)) if (!KEYS.includes(k)) return problem(400, `That carries "${k}". Nothing changed.`);
  const { action, id, key } = body;
  if (action !== 'edit' && action !== 'delete') return problem(400, 'That is neither an edit nor a delete. Nothing changed.');
  if (typeof id !== 'string' || !ID_SHAPE.test(id) || typeof key !== 'string' || !KEY_SHAPE.test(key)) {
    return problem(400, 'This link is not complete. Open the link from your email again. Nothing changed.');
  }

  /* An edit is read and filtered before the store is touched. */
  let fields = { name: '', title: '', organisation: '', role: '', comment: '' };
  if (action === 'edit') {
    const n = oneLine(body.name, 'name', SUPPORT_LIMITS.name, true);
    if (typeof n !== 'string') return problem(400, `That was not changed: ${n.problem}.`);
    const t = oneLine(body.title ?? '', 'title', SUPPORT_LIMITS.title, false);
    if (typeof t !== 'string') return problem(400, `That was not changed: ${t.problem}.`);
    const o = oneLine(body.organisation ?? '', 'organisation', SUPPORT_LIMITS.organisation, false);
    if (typeof o !== 'string') return problem(400, `That was not changed: ${o.problem}.`);
    const r = readRole(body.role);
    if (typeof r !== 'string') return problem(400, `That was not changed: ${r.problem}.`);
    const c = oneLine(body.comment, 'comment', SUPPORT_LIMITS.comment, true);
    if (typeof c !== 'string') return problem(400, `That was not changed: ${c.problem === 'comment is empty' ? 'a post needs a comment' : c.problem}.`);
    if (linkIn({ name: n, title: t, organisation: o, comment: c })) return problem(400, 'That was not changed: links are not shown.');
    if (blockedPost([n, t, o, c])) return problem(422, BLOCKED_LINE.replace('Nothing was kept.', 'Nothing changed.'));
    fields = { name: n, title: t, organisation: o, role: r, comment: c };
  } else if (FIELDS.some((f) => body[f] !== undefined)) {
    return problem(400, 'A delete carries nothing but the post and its key. Nothing changed.');
  }

  const store = storeConfig();
  if (!store) {
    if (process.env.VERCEL === '1') {
      console.error('supporter-post: the shared store is not configured');
      return problem(503, 'Posts cannot be changed right now. This is a problem on our side. Nothing changed.');
    }
    return problem(503, 'Posts can only be changed on the live site, not on this test copy. Nothing changed.');
  }

  try {
    const [shownRaw, declinedRaw] = await hashFields(store, [
      [SUPPORTER_KEYS.shown, id],
      [SUPPORTER_KEYS.declined, id],
    ]);
    const raw = shownRaw ?? declinedRaw;
    const entry = raw ? (JSON.parse(raw) as SupporterEntry) : null;
    if (!entry) return problem(404, 'This post is no longer on the page. Nothing changed.');
    if (!entry.editKey || entry.editKey !== (await editKeyOf(key))) {
      return problem(403, 'This link does not match the post. Nothing changed.');
    }

    if (action === 'delete') {
      await hashWrites(store, [
        ['HDEL', SUPPORTER_KEYS.shown, id],
        ['HDEL', SUPPORTER_KEYS.declined, id],
      ]);
      return json(200, { deleted: true });
    }

    if (!shownRaw) {
      return problem(409, 'The WaterBots team took this post off the page, so it cannot be edited. You can still delete it. Questions? hello@waterbots.ai.');
    }
    const next: SupporterEntry = { ...entry, ...fields, editedAt: new Date().toISOString() };
    await hashWrites(store, [['HSET', SUPPORTER_KEYS.shown, id, JSON.stringify(next)]]);
    return json(200, { shown: forPage(next) });
  } catch (error) {
    console.error(`supporter-post: the change could not be made — ${error instanceof StoreError ? error.message : String(error)}`);
    return problem(503, 'That did not go through just now. Trying again usually works. Nothing changed.');
  }
}

function json(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

function problem(status: number, message: string): Response {
  return json(status, { error: message });
}
