/**
 * Phoebe's relay.
 *
 * A Vercel serverless function. The Anthropic API key lives in the project's
 * environment variables and is read here, on the server. It is never sent to
 * the browser, never written into the bundle, and never committed.
 *
 * WHAT THIS DOES NOT DO YET. Rate limiting and abstention logging are step 4.
 * This function counts nothing and stores nothing, and the response says so
 * honestly rather than implying a cap that is not enforced.
 *
 * THE PROMPT IS CACHED. The system prompt holds both card sets, roughly 12,000
 * tokens, identical on every request. It carries a cache breakpoint so that
 * after the first message it is read at about a tenth of the input price.
 * Nothing volatile may be added above that breakpoint.
 */

import Anthropic from '@anthropic-ai/sdk';
import { RESPONSE_SCHEMA, SYSTEM_PROMPT } from './_systemPrompt';

/**
 * Claude Sonnet 5 — the maintainer's ruling of 21 Aug 2026.
 *
 * The task is narrow and fully grounded: read a fixed card set, refuse
 * everything else. If abstention discipline proves weak under testing, the
 * upgrade is this one line — 'claude-opus-5'.
 */
const MODEL = 'claude-sonnet-5';

/**
 * The output budget for one answer.
 *
 * This is NOT the length of her reply. Most of it is spent before the first
 * visible word: she weighs what the person said against each of the six
 * criteria, and that reasoning is charged to the same budget as the answer.
 *
 * Measured 22 Aug 2026 on one ordinary project description, three runs with
 * the budget lifted: 2,762 / 3,246 / 4,423 output tokens, for a visible answer
 * of roughly 1,400-1,650 characters. The reasoning is 80-90% of the spend and
 * it swings by 60% between identical runs.
 *
 * At the previous value of 2048 that ran out mid-structure on any message
 * describing a real project: the JSON came back half-written, JSON.parse threw,
 * and the reader was told her answer had a bad shape. 8192 is roughly double
 * the worst run observed, so ordinary variation never reaches it.
 *
 * Raising this does not raise the bill. Output is charged on what is produced,
 * not on what is budgeted; the only cost that changes is that truncated
 * answers stop being paid for and discarded.
 */
const MAX_TOKENS = 8192;

/** A conversation this long has left the worksheet behind. */
const MAX_TURNS = 40;

/** Long enough for a real question, short enough to refuse an essay. */
const MAX_MESSAGE_CHARS = 4000;

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const config = { runtime: 'nodejs' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return problem(405, 'This endpoint takes POST requests only.');
  }

  let body: { messages?: IncomingMessage[] };
  try {
    body = (await req.json()) as { messages?: IncomingMessage[] };
  } catch {
    return problem(400, 'That request could not be read.');
  }

  const messages = Array.isArray(body.messages) ? body.messages : null;
  if (!messages || messages.length === 0) {
    return problem(400, 'No message was sent.');
  }
  if (messages.length > MAX_TURNS) {
    return problem(
      400,
      'This conversation has grown long enough that Phoebe has lost the thread. Reload the page to start fresh — she keeps no memory between visits in any case.'
    );
  }

  const clean: Anthropic.MessageParam[] = [];
  for (const m of messages) {
    if (m?.role !== 'user' && m?.role !== 'assistant') {
      return problem(400, 'That request could not be read.');
    }
    if (typeof m.content !== 'string' || m.content.trim() === '') continue;
    if (m.content.length > MAX_MESSAGE_CHARS) {
      return problem(
        400,
        `That message is longer than Phoebe can take in at once — the limit is ${MAX_MESSAGE_CHARS.toLocaleString()} characters. Try asking the most important part first.`
      );
    }
    clean.push({ role: m.role, content: m.content });
  }
  if (clean.length === 0 || clean[clean.length - 1].role !== 'user') {
    return problem(400, 'No question was sent.');
  }

  /* The configuration check sits AFTER the request is validated, on purpose.
     Reporting "Phoebe is not connected" for a malformed request would send
     someone hunting a server problem that is not there. Shape first, then
     whether we can actually answer. */
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    /* An honest state. The console shows this rather than a silent failure or
       a fabricated reply. */
    console.error('phoebe: ANTHROPIC_API_KEY is not set in this environment');
    return problem(
      503,
      'Phoebe is not connected in this environment. Her API key has not been configured, so she cannot answer. This is a configuration problem on our side, not something you did.'
    );
  }

  const client = new Anthropic({ apiKey });

  let response: Anthropic.Message;
  try {
    response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      /* The cache breakpoint. Everything above it is byte-identical between
         requests; the conversation below it is not cached. */
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: clean,
      output_config: { format: { type: 'json_schema', schema: RESPONSE_SCHEMA } },
    });
  } catch (error) {
    return fromApiError(error);
  }

  /* Claude Sonnet 5 can decline a request outright. That is a real state and
     it gets said, not smoothed over into an empty answer. */
  if (response.stop_reason === 'refusal') {
    return problem(
      502,
      'Phoebe stopped part-way through that one and did not finish an answer. Try rephrasing the question.'
    );
  }

  /* Running out of budget is a different failure from writing a bad answer,
     and it must not be reported as one. A truncated reply reaches JSON.parse
     as half-written JSON and throws there, which used to surface as "Phoebe
     answered in a shape this console could not read" - blaming her answer for
     what is our budget. Caught here instead, and named. */
  if (response.stop_reason === 'max_tokens') {
    console.error('phoebe: answer hit the output budget and was cut off');
    return problem(
      502,
      'Phoebe ran out of room part-way through that answer, so it was cut off before it was finished. Nothing has been recorded. This is a limit on our side, not something you did - asking again, or in smaller pieces, usually gets through.'
    );
  }

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    console.error('phoebe: reply was not the JSON shape requested');
    return problem(
      502,
      'Phoebe answered in a shape this console could not read. Nothing has been recorded. Try asking again.'
    );
  }

  const answer = validate(parsed);
  if (!answer) {
    console.error('phoebe: reply failed validation');
    return problem(
      502,
      'Phoebe answered in a shape this console could not read. Nothing has been recorded. Try asking again.'
    );
  }

  return json(200, {
    ...answer,
    usage: {
      /* Surfaced so the cache can be confirmed working rather than assumed. */
      cacheRead: response.usage.cache_read_input_tokens ?? 0,
      cacheWrite: response.usage.cache_creation_input_tokens ?? 0,
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
    },
  });
}

/* -------------------------------------------------------------------------
   Validation. The model's output is checked, not trusted.
------------------------------------------------------------------------- */

interface Answer {
  reply: string;
  citedCards: { set: 'eligibility' | 'feasibility'; number: number }[];
  criteriaUpdates: { number: number; state: 'met' | 'not-yet'; routeForward?: string }[];
  abstained: boolean;
  abstentionTopic?: string;
}

function validate(value: unknown): Answer | null {
  if (typeof value !== 'object' || value === null) return null;
  const v = value as Record<string, unknown>;

  if (typeof v.reply !== 'string' || v.reply.trim() === '') return null;

  const citedCards: Answer['citedCards'] = [];
  if (Array.isArray(v.citedCards)) {
    for (const raw of v.citedCards) {
      if (typeof raw !== 'object' || raw === null) continue;
      const c = raw as Record<string, unknown>;
      const set = c.set === 'eligibility' || c.set === 'feasibility' ? c.set : null;
      const number = typeof c.number === 'number' ? c.number : null;
      if (!set || number === null) continue;
      /* Six eligibility criteria, ten feasibility considerations. A reference
         outside those ranges is dropped rather than rendered — the console
         would otherwise show a citation for a card that does not exist. */
      const ceiling = set === 'eligibility' ? 6 : 10;
      if (!Number.isInteger(number) || number < 1 || number > ceiling) continue;
      citedCards.push({ set, number });
    }
  }

  const criteriaUpdates: Answer['criteriaUpdates'] = [];
  if (Array.isArray(v.criteriaUpdates)) {
    for (const raw of v.criteriaUpdates) {
      if (typeof raw !== 'object' || raw === null) continue;
      const u = raw as Record<string, unknown>;
      const number = typeof u.number === 'number' ? u.number : null;
      const state = u.state === 'met' || u.state === 'not-yet' ? u.state : null;
      if (number === null || !Number.isInteger(number) || number < 1 || number > 6) continue;
      if (!state) continue;
      const routeForward = typeof u.routeForward === 'string' ? u.routeForward.trim() : '';
      /* The hard rule, enforced here and not merely asked for: a shortfall
         without a way out is not an acceptable verdict, so it is discarded
         rather than shown. */
      if (state === 'not-yet' && routeForward === '') continue;
      criteriaUpdates.push(
        state === 'not-yet' ? { number, state, routeForward } : { number, state }
      );
    }
  }

  const abstained = v.abstained === true;
  const topic = typeof v.abstentionTopic === 'string' ? v.abstentionTopic.trim() : '';

  return {
    reply: v.reply.trim(),
    citedCards,
    criteriaUpdates,
    abstained,
    ...(abstained && topic ? { abstentionTopic: topic } : {}),
  };
}

/* -------------------------------------------------------------------------
   Responses. Every failure says what happened, in words a visitor can read.
------------------------------------------------------------------------- */

function json(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

function problem(status: number, message: string): Response {
  return json(status, { error: message });
}

function fromApiError(error: unknown): Response {
  if (error instanceof Anthropic.AuthenticationError) {
    console.error('phoebe: the API key was rejected');
    return problem(
      503,
      'Phoebe is not connected. Her API key was rejected, which is a configuration problem on our side.'
    );
  }
  if (error instanceof Anthropic.RateLimitError) {
    return problem(
      429,
      'Phoebe is handling more questions than she can keep up with at the moment. Waiting a minute usually clears it.'
    );
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return problem(504, 'Phoebe could not be reached just now. Trying again usually works.');
  }
  if (error instanceof Anthropic.APIError) {
    console.error(`phoebe: API error ${error.status}`, error.message);
    return problem(502, 'Something went wrong reaching Phoebe. Nothing has been recorded.');
  }
  console.error('phoebe: unexpected failure', error);
  return problem(500, 'Something went wrong on our side. Nothing has been recorded.');
}
