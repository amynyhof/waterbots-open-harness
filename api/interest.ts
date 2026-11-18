/**
 * POST /api/interest — Register your interest.
 *
 * The maintainer's plan of 14 Nov 2026, approved on 16 Nov 2026
 * (docs/proposals/queued-round-2026-11-16.md, item 5), with her ruling on
 * keeping: no time limit; a sign-up is kept until the person asks to be
 * removed, and nothing deletes on its own. What a sign-up is lives in
 * api/_interest.ts.
 *
 * THE ORDER, and why. Weight, shape, the robot field, then the store, then the
 * cap, then the write, then the email copy. The write is the record: once it
 * lands the visitor is told it was kept, and a copy that fails to send is
 * logged rather than unwinding a sign-up that is safely stored. A write that
 * fails is refunded off the cap and the visitor is told nothing was kept.
 *
 * Every answer says what happened, in words a visitor can read.
 */

import { INTEREST, countOneMessage, timeUntilReset } from './_cap.js';
import { INTEREST_KEY, MAX_INTEREST_BYTES, composeInterestMail, interestEntry, readInterest } from './_interest.js';
import { StoreError, appendKept, appendKeptWith, storeConfig } from './_store.js';
import { SUPPORTER_KEYS, supporterEntry, supporterId } from './_supporters.js';
import { TEAM_ADDRESS, TEAM_MAIL_FROM, TeamMailError, sendTeamMail, teamMailKey } from './_teamMail.js';

export async function GET(): Promise<Response> {
  return problem(405, 'This address takes POST requests only.');
}

export async function POST(req: Request): Promise<Response> {
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return problem(400, 'That could not be read. Nothing was kept.');
  }
  if (raw.length > MAX_INTEREST_BYTES) {
    return problem(413, 'That is more than the form takes. Nothing was kept.');
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return problem(400, 'That could not be read. Nothing was kept.');
  }

  const reading = readInterest(body);
  /* A robot filled the hidden field: dropped without a word, and nothing kept. */
  if ('robot' in reading) return json(200, { kept: true });
  if ('problem' in reading) {
    return problem(400, `That was not kept: ${reading.problem}.`);
  }

  const store = storeConfig();
  if (!store) {
    if (process.env.VERCEL === '1') {
      console.error('interest: the shared store is not configured, so nothing can be kept');
      return problem(503, 'The form is not working right now. This is a problem on our side. Nothing was kept.');
    }
    return problem(503, 'The form only works on the live site, not on this test copy. Nothing was kept.');
  }

  const decision = await countOneMessage(req, new Date(), INTEREST);
  if (decision.kind === 'misconfigured') {
    console.error(`interest: ${decision.missing} is not configured, so the daily cap cannot be enforced`);
    return problem(503, 'The form is not working right now. This is a problem on our side. Nothing was kept.');
  }
  if (decision.kind === 'refused') {
    return problem(
      429,
      `You have reached today's limit of ${decision.cap} sign-ups from this site. It resets at midnight UTC, ${timeUntilReset(decision.secondsToReset)}.`,
      { 'retry-after': String(decision.secondsToReset) }
    );
  }
  if (decision.kind === 'uncounted') {
    console.error(`interest: this sign-up was not counted against any cap — ${decision.why}`);
  }

  const now = new Date();
  const signup = reading.signup;
  /* A sign-up that asks to show support: its public part waits for the
     maintainer's approval (api/_supporters.ts), written in the same
     transaction as the sign-up, so it is kept whole or not at all. */
  const supporter = signup.support ? supporterId() : undefined;
  try {
    if (signup.support && supporter) {
      /* From the supporters page the public part is the name and comment alone (18 Nov 2026). */
      const shownOrganisation = signup.source === 'supporters' ? '' : signup.organisation;
      const waiting = supporterEntry(supporter, signup.name, shownOrganisation, signup.support, now, signup.source);
      await appendKeptWith(store, INTEREST_KEY, interestEntry(signup, now, supporter), [
        ['HSET', SUPPORTER_KEYS.waiting, supporter, JSON.stringify(waiting)],
      ]);
    } else {
      await appendKept(store, INTEREST_KEY, interestEntry(signup, now));
    }
  } catch (error) {
    if (decision.kind === 'allowed') await decision.refund();
    console.error(`interest: the sign-up could not be written — ${error instanceof StoreError ? error.message : String(error)}`);
    return problem(503, 'That was not kept just now. Trying again usually works.');
  }

  /* The copy to the team's inbox. The sign-up is already kept; a copy that
     does not go is a log line for the team, not a failure for the visitor. */
  const key = teamMailKey();
  let mailed = false;
  if (!key) {
    console.error('interest: RESEND_API_KEY is not set, so no copy went to the team inbox; the sign-up is kept');
  } else {
    try {
      const mail = composeInterestMail(signup, now, supporter);
      await sendTeamMail(key, { to: TEAM_ADDRESS, from: TEAM_MAIL_FROM, ...mail });
      mailed = true;
    } catch (error) {
      console.error(
        `interest: the copy to the team inbox did not go; the sign-up is kept — ${error instanceof TeamMailError ? error.message : String(error)}`
      );
    }
  }

  return json(200, { kept: true, mailed, ...(supporter ? { waiting: true } : {}) });
}

function json(status: number, payload: unknown, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  });
}

function problem(status: number, message: string, headers?: Record<string, string>): Response {
  return json(status, { error: message }, headers);
}
