/**
 * Wellington's relay.
 *
 * A Vercel serverless function, on Phoebe's proven pattern — the same shape,
 * the same guards, every setting stated rather than inherited. The Anthropic
 * API key lives in the project's environment variables and is read here, on
 * the server. It is never sent to the browser, never written into the bundle,
 * and never committed.
 *
 * THIRTY MESSAGES A DAY, per visitor, counted separately from Phoebe's twenty.
 * The counting lives in _cap.ts; what a visitor is told about it lives here.
 * A message is counted only when an answer is actually delivered — anything
 * that fails on our side is put back.
 *
 * HE ROUTES; HE DOES NOT ANSWER IN A COLLEAGUE'S PLACE. His replies carry a
 * route and what he learned about the project as fields, and the console acts
 * on the fields, never on the prose. Only a question outside every lane is an
 * abstention, and only those are written to the shared log, marked as his —
 * maintainer's ruling C, 2 Sep 2026.
 *
 * THE PROMPT IS CACHED. It is small — the base rules, the roster, his region —
 * and identical on every request, so it carries a cache breakpoint. Nothing
 * volatile may be added above that breakpoint.
 */

import Anthropic from '@anthropic-ai/sdk';
import { recordAbstention } from './_abstentions.js';
import { MIN_REPLY_CHARS, isDegenerateReply } from './_reply.js';
import { WELLINGTON, countOneMessage, timeUntilReset } from './_cap.js';
import { WELLINGTON_RESPONSE_SCHEMA, WELLINGTON_SYSTEM_PROMPT } from './_wellingtonPrompt.js';
import { validate } from './_wellingtonAnswer.js';

/**
 * The same tier as Phoebe — Claude Opus 5 — by the maintainer's ruling B of
 * 2 Sep 2026, and for a measured reason rather than a guessed one. Sonnet at
 * medium effort returned an empty answer about one time in eight on Phoebe's
 * work; Opus brought that to one in fifty (item A6). A host who speaks first
 * cannot be the one who goes silent. If his measured walk shows he is easy,
 * dropping the tier is this one line and a later ruling.
 */
const MODEL = 'claude-opus-5';

/**
 * The output budget for one answer, hidden thinking included. Phoebe's number,
 * for Phoebe's reasons (see api/phoebe.ts): raising it does not raise the
 * bill, and 16,000 is the documented default for a request that is not
 * streamed. His answers are short; his thinking is what spends this.
 */
const MAX_TOKENS = 16000;

/**
 * How hard he thinks. "medium", stated rather than inherited — a default
 * nobody wrote down is a decision nobody made. His task is narrower than
 * Phoebe's: read a short roster, place the question in a lane, say the lane's
 * sentence.
 */
const EFFORT = 'medium' as const;

/** How long the relay waits for the model before giving up. Phoebe's 120 seconds, same reasoning. */
const CALL_TIMEOUT_MS = 120_000;

/** A 400 that arrives after this long is a failure during generation, not a malformed request. One retry. */
const LATE_400_MS = 5_000;

/** A conversation this long has left the desk behind. */
const MAX_TURNS = 40;

/** Long enough for a real message, short enough to refuse an essay. */
const MAX_MESSAGE_CHARS = 4000;

const DIAGNOSE = process.env.PHOEBE_DIAGNOSE === '1';

function diag(label: string, fields: Record<string, unknown>): void {
  if (!DIAGNOSE) return;
  console.error(`wellington/diag ${label} ${JSON.stringify(fields)}`);
}

function pick(value: unknown, key: string): unknown {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)[key]
    : undefined;
}

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * NAMED METHOD EXPORTS, NOT A DEFAULT EXPORT — load-bearing, and the reason
 * is in api/phoebe.ts and item S6. scripts/check-api-exports.mjs fails the
 * build if a default export appears under api/.
 */

/** Most of the budget is spent before the first visible word. Stated, like Phoebe's. */
export const maxDuration = 60;

export async function GET(): Promise<Response> {
  return problem(405, 'This endpoint takes POST requests only.');
}

export async function POST(req: Request): Promise<Response> {
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
      'This conversation has grown long enough that Wellington has lost the thread. Reload the page to start fresh — he keeps no memory between visits in any case.'
    );
  }

  const clean: Anthropic.MessageParam[] = [];
  let lastQuestion = '';
  for (const m of messages) {
    if (m?.role !== 'user' && m?.role !== 'assistant') {
      return problem(400, 'That request could not be read.');
    }
    if (typeof m.content !== 'string' || m.content.trim() === '') continue;
    if (m.content.length > MAX_MESSAGE_CHARS) {
      return problem(
        400,
        `That message is longer than Wellington can take in at once — the limit is ${MAX_MESSAGE_CHARS.toLocaleString()} characters. Try the most important part first.`
      );
    }
    clean.push({ role: m.role, content: m.content });
    if (m.role === 'user') lastQuestion = m.content;
  }
  if (clean.length === 0 || clean[clean.length - 1].role !== 'user') {
    return problem(400, 'No message was sent.');
  }

  /* Shape first, then whether we can actually answer — same order as Phoebe's,
     for the same reason. */
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('wellington: ANTHROPIC_API_KEY is not set in this environment');
    return problem(
      503,
      'Wellington is not connected in this environment. His API key has not been configured, so he cannot answer. This is a configuration problem on our side, not something you did.'
    );
  }

  /* The cap, counted at the last moment before the model, under his own name. */
  const decision = await countOneMessage(req, new Date(), WELLINGTON);

  if (decision.kind === 'misconfigured') {
    console.error(
      `wellington: ${decision.missing} is not configured, so the daily cap cannot be enforced. Refusing to answer without it.`
    );
    return problem(
      503,
      'Wellington is not answering right now. The daily limit that keeps him free and open to everyone is not running in this environment, and he does not answer without it. This is a configuration problem on our side, not something you did.'
    );
  }

  if (decision.kind === 'refused') {
    return problem(
      429,
      `You have reached today's limit of ${decision.cap} messages to Wellington. He is free and open to anyone, and the daily limit is what keeps him that way. Your count resets at midnight UTC, ${timeUntilReset(decision.secondsToReset)}. Nothing you have told him is kept between visits in any case.`,
      { 'retry-after': String(decision.secondsToReset) }
    );
  }

  if (decision.kind === 'uncounted') {
    console.error(`wellington: this message was not counted against any cap — ${decision.why}`);
  }

  const undelivered = async (response: Response): Promise<Response> => {
    if (decision.kind === 'allowed') await decision.refund();
    return response;
  };

  const client = new Anthropic({ apiKey });

  let response: Anthropic.Message;
  const calledAt = Date.now();

  const callModel = (): Promise<Anthropic.Message> =>
    client.messages.create(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: [
          { type: 'text', text: WELLINGTON_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
        ],
        messages: clean,
        thinking: { type: 'adaptive' },
        output_config: {
          effort: EFFORT,
          format: { type: 'json_schema', schema: WELLINGTON_RESPONSE_SCHEMA },
        },
      },
      { timeout: CALL_TIMEOUT_MS }
    );

  try {
    try {
      response = await callModel();
    } catch (first) {
      const status = pick(first, 'status');
      const elapsed = Date.now() - calledAt;
      const lateFourHundred = status === 400 && elapsed > LATE_400_MS;
      if (!lateFourHundred) throw first;
      console.error(
        `wellington: a 400 arrived after ${(elapsed / 1000).toFixed(1)}s, which is too late to be a malformed request — retrying once`
      );
      response = await callModel();
    }
  } catch (error) {
    diag('api-error', {
      ms: Date.now() - calledAt,
      status: pick(error, 'status'),
      message: String(pick(error, 'message') ?? '').slice(0, 400),
      requestId: pick(error, 'request_id') ?? pick(error, 'requestID'),
    });
    return undelivered(fromApiError(error));
  }

  diag('response', {
    ms: Date.now() - calledAt,
    model: MODEL,
    effort: EFFORT,
    stopReason: response.stop_reason,
    usage: {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
      cacheRead: response.usage.cache_read_input_tokens ?? 0,
      cacheWrite: response.usage.cache_creation_input_tokens ?? 0,
    },
  });

  if (response.stop_reason === 'refusal') {
    return undelivered(
      problem(502, 'Wellington stopped part-way through that one and did not finish. Try rephrasing.')
    );
  }

  if (response.stop_reason === 'max_tokens') {
    console.error(
      `wellington: answer hit the output budget and was cut off — ${response.usage.output_tokens} of ${MAX_TOKENS} output tokens`
    );
    return undelivered(
      problem(
        502,
        'Wellington ran out of room part-way through that answer, so it was cut off before it was finished. This is a limit on our side, not something you did — asking again usually gets through.'
      )
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
    console.error(`wellington: reply was not the JSON shape requested — ${response.usage.output_tokens} of ${MAX_TOKENS} output tokens`);
    return undelivered(
      problem(502, 'Wellington answered in a shape this console could not read. Try asking again.')
    );
  }

  const answer = validate(parsed);
  if (!answer) {
    console.error(`wellington: returned an empty answer — ${response.usage.output_tokens} of ${MAX_TOKENS} output tokens`);
    return undelivered(
      problem(
        502,
        'Wellington returned an empty answer — he did not say anything at all. This is a fault on our side rather than something you did, and asking again usually works.'
      )
    );
  }

  if (isDegenerateReply(answer.reply)) {
    console.error(
      `wellington: returned an answer too short to be one — ${answer.reply.trim().length} characters against a floor of ${MIN_REPLY_CHARS}`
    );
    return undelivered(
      problem(
        502,
        'Wellington returned an answer with almost nothing in it. This is a fault on our side rather than something you did, and asking again usually works.'
      )
    );
  }

  diag('delivered', {
    replyChars: answer.reply.length,
    route: answer.route,
    context: Object.keys(answer.context ?? {}),
    abstained: answer.abstained,
    output: response.usage.output_tokens,
  });

  /* Only a question outside every lane is logged, and it is marked as his.
     His routings are not abstentions and are not written down. */
  if (answer.abstained) {
    await recordAbstention(lastQuestion, answer.abstentionTopic, new Date(), 'wellington');
  }

  return json(200, {
    ...answer,
    usage: {
      cacheRead: response.usage.cache_read_input_tokens ?? 0,
      cacheWrite: response.usage.cache_creation_input_tokens ?? 0,
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
    },
  });
}

/* -------------------------------------------------------------------------
   Responses. Every failure says what happened, in words a visitor can read.
------------------------------------------------------------------------- */

function json(status: number, payload: unknown, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  });
}

function problem(status: number, message: string, headers?: Record<string, string>): Response {
  return json(status, { error: message }, headers);
}

function fromApiError(error: unknown): Response {
  const status = pick(error, 'status');
  if (status === 429) {
    return problem(503, 'Wellington is busy right now — the service behind him is rate limited. Try again in a moment.');
  }
  if (status === 401 || status === 403) {
    console.error('wellington: the API key was refused');
    return problem(503, 'Wellington is not connected in this environment — his API key was refused. This is a configuration problem on our side.');
  }
  if (typeof status === 'number' && status >= 500) {
    return problem(503, 'The service behind Wellington is having trouble right now. Try again in a moment.');
  }
  if (pick(error, 'name') === 'APIConnectionTimeoutError' || pick(error, 'name') === 'AbortError') {
    return problem(504, 'Wellington took too long to answer and the request was stopped. Try again.');
  }
  console.error('wellington: unexpected API error —', String(pick(error, 'message') ?? error).slice(0, 400));
  return problem(502, 'Wellington could not answer that one. This is a fault on our side rather than something you did — asking again usually works.');
}
