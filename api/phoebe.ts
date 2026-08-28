/**
 * Phoebe's relay.
 *
 * A Vercel serverless function. The Anthropic API key lives in the project's
 * environment variables and is read here, on the server. It is never sent to
 * the browser, never written into the bundle, and never committed.
 *
 * TWENTY MESSAGES A DAY, per visitor. The counting itself lives in _cap.ts;
 * what a visitor is told about it lives here, with every other message a
 * visitor reads. A message is counted only when an answer is actually
 * delivered — anything that fails on our side is put back.
 *
 * EVERY ABSTENTION IS WRITTEN DOWN. When Phoebe says she has no card for
 * something, that is a real question the card sets do not cover, and it is kept
 * so it can be graded into a card. See _abstentions.ts for what is kept and
 * what deliberately is not.
 *
 * THE PROMPT IS CACHED. The system prompt holds both card sets, roughly 12,000
 * tokens, identical on every request. It carries a cache breakpoint so that
 * after the first message it is read at about a tenth of the input price.
 * Nothing volatile may be added above that breakpoint.
 */

import Anthropic from '@anthropic-ai/sdk';
import { recordAbstention } from './_abstentions.js';
import { MIN_REPLY_CHARS, isDegenerateReply } from './_reply.js';
import { countOneMessage, timeUntilReset } from './_cap.js';
import { RESPONSE_SCHEMA, SYSTEM_PROMPT } from './_systemPrompt.js';

/**
 * Claude Sonnet 5 — the maintainer's ruling of 21 Aug 2026.
 *
 * The task is narrow and fully grounded: read a fixed card set, refuse
 * everything else. If abstention discipline proves weak under testing, the
 * upgrade is this one line — 'claude-opus-5'.
 */
const MODEL = 'claude-opus-5';

/**
 * The output budget for one answer.
 *
 * THIS IS NOT THE LENGTH OF HER REPLY, and most of it is not even visible.
 * Claude Sonnet 5 thinks before it writes, that thinking is hidden, and it is
 * charged to this same budget.
 *
 * Measured 25 Aug 2026, four real requests through this exact prompt and model:
 *
 *   "why?"                                    416 output tokens,   238 characters
 *   "Is it eligible?"                       1,073 output tokens,   384 characters
 *   "Does a borehole in Kenya qualify?"       710 output tokens, 1,010 characters
 *   two sentences about a Turkana project   4,194 output tokens, 1,848 characters
 *
 * Every one of those came back as a thinking block with zero visible text
 * followed by the answer. That last row is the important one: 1,848 characters
 * is roughly 460 tokens of reply, so about 3,700 tokens — 88% of the spend —
 * were invisible thinking, on a two-sentence question.
 *
 * A SHORT QUESTION IS NOT A CHEAP ONE. This budget was previously described as
 * "roughly double the worst run observed", which stopped being true: a
 * two-sentence message already reaches half of 8,192. Worse, a vague question
 * gives her less to ground on, so she deliberates more rather than less. That
 * is how a one-sentence message ran out of room on 25 Aug 2026, and how the
 * empty answer of 23 Aug happened — see item A4.
 *
 * At the earlier value of 2048 every real project description ran out
 * mid-structure: the JSON came back half-written and JSON.parse threw. 8,192
 * fixed that and left less headroom than it appeared to. 16,000 is the
 * documented default for a request that is not streamed.
 *
 * RAISING THIS DOES NOT RAISE THE BILL. Output is charged on what is produced,
 * not on what is budgeted. The only spend that changes is that truncated
 * answers stop being paid for and thrown away.
 */
const MAX_TOKENS = 16000;

/**
 * How hard she thinks before answering.
 *
 * Set explicitly rather than inherited. Left unset, this model thinks
 * adaptively at "high" effort, which is where the runs above came from — and
 * nothing in the code said so, which is why two days of faults looked
 * inexplicable. A default nobody wrote down is a decision nobody made.
 *
 * "medium" because her task is narrow and fully grounded: read a fixed card
 * set, weigh what the person said against it, refuse everything else. She is
 * not solving an open problem. Lower effort means less spend and, more
 * importantly here, less variation between identical runs.
 *
 * If abstention discipline or answer quality ever weakens, this is the first
 * line to raise — before the model.
 */
const EFFORT = 'medium' as const;

/**
 * DIAGNOSIS INSTRUMENTATION — item A6, added 28 Aug 2026. Temporary.
 *
 * Phoebe fails about a third of the time on an ordinary question, measured
 * over twenty requests. Four faults were seen and none of them is explained:
 * empty answers far below the budget, an API error 400 on our own request, a
 * seven-character reply delivered to the caller, and answers ranging from 569
 * to 1,503 characters on identical input.
 *
 * The existing failure logs say what happened and not why. An empty answer
 * logs its token spend and nothing about the stop reason, the content blocks
 * returned, or how long the call took. This adds that, and only that — no
 * behaviour changes, nothing a visitor sees.
 *
 * OFF UNLESS ASKED. Set PHOEBE_DIAGNOSE=1 in the environment. A diagnosis that
 * ships as permanent noise is how logs stop being read.
 *
 * IT NEVER LOGS THE VISITOR'S QUESTION, only its length. The abstention log is
 * where question text belongs, under the rules written for it.
 *
 * REMOVE THIS once item A6 reports. It is debt, and it is named as debt.
 */
/**
 * How long the relay waits for the model before giving up.
 *
 * IT HAD NONE. The call was made with no timeout at all: on a laptop that is
 * an unbounded wait, and on the platform it means the deployment's own
 * function limit ends the request, so a visitor gets a gateway error instead
 * of the honest message this relay is careful to give everywhere else. A
 * default nobody wrote down is a decision nobody made — this repository's own
 * lesson from item A4, unapplied here until now.
 *
 * WHERE 120 SECONDS COMES FROM. Measured 28 Aug 2026 over seventy-five
 * requests on the shipped model: median call 8.2 seconds, slowest complete
 * answer 50. Two failures ran to about 100 seconds before hitting the output
 * budget, and eight calls at a lower effort setting passed four minutes.
 * 120 leaves more than double the headroom over anything that has ever
 * succeeded, and cuts a runaway off long before a visitor gives up.
 */
const CALL_TIMEOUT_MS = 120_000;

/**
 * A 400 that arrives late is not a bad request.
 *
 * Measured 28 Aug 2026: two requests came back `400 Invalid request data`
 * after 27.8 and 31.4 seconds, with parameters identical to the thirteen that
 * succeeded in the same run. **A genuinely malformed request is rejected in
 * milliseconds, because nothing has to be computed to know it is malformed.**
 * A 400 after half a minute of work is a failure during generation wearing the
 * label of a client error.
 *
 * So one retry, and deliberately narrow: only a 400, and only a late one.
 * Retrying a real 400 would be a bug, and this cannot become one.
 */
const LATE_400_MS = 5_000;

const DIAGNOSE = process.env.PHOEBE_DIAGNOSE === '1';

function diag(label: string, fields: Record<string, unknown>): void {
  if (!DIAGNOSE) return;
  console.error(`phoebe/diag ${label} ${JSON.stringify(fields)}`);
}

/** Reads a property off an unknown thrown value without assuming its shape. */
function pick(value: unknown, key: string): unknown {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)[key]
    : undefined;
}

/** A conversation this long has left the worksheet behind. */
const MAX_TURNS = 40;

/** Long enough for a real question, short enough to refuse an essay. */
const MAX_MESSAGE_CHARS = 4000;

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * NAMED METHOD EXPORTS, NOT A DEFAULT EXPORT. This is load-bearing.
 *
 * Vercel always invokes a default export the Node way — `(req, res) => void` —
 * and ignores what it returns. This handler is written against the web
 * standard: it takes a Request and returns a Response. Exported as `default`,
 * that Response went to a caller that never reads return values, so nothing was
 * ever written and every request hung until the platform gave up. A GET that
 * should answer 405 in a millisecond hung for two minutes.
 *
 * A named HTTP method export is invoked the web way, and its Response is used.
 * Vercel's own build log named this, after two wrong guesses at it:
 *
 *   "default export returned a Response. The default-export signature is
 *    (req, res) => void — returns are ignored. Fix: export a fetch function or
 *    a named HTTP method."
 *
 * DO NOT REINTRODUCE A DEFAULT EXPORT HERE. scripts/check-api-exports.mjs fails
 * the build if one appears, because this cost three failed deploys to find and
 * nothing local could see it.
 *
 * Routing by method is the platform's job now, so there is no method check in
 * the body. GET is exported separately to keep an honest answer for anyone who
 * opens the URL; other methods get the platform's own 405.
 *
 * NOT the edge runtime, and that is a decision rather than an omission. Edge
 * would also match this handler's shape, but it caps how long a response may
 * take, and Phoebe is slow by design — she thinks at length before writing, and
 * that thinking is hidden. See MAX_TOKENS above for the measurements. Trading a
 * hang for a truncation is not a fix.
 */

/**
 * How long one answer may take.
 *
 * Most of the budget is spent before the first visible word — see MAX_TOKENS
 * above, where it is measured. That takes far longer than the platform's
 * default allowance. Set explicitly so a slow answer is a slow answer rather
 * than a timeout that reads like the hang this file has already produced
 * twice.
 */
export const maxDuration = 60;

/** Someone opening the URL in a browser gets a straight answer, not a 404. */
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
      'This conversation has grown long enough that Phoebe has lost the thread. Reload the page to start fresh — she keeps no memory between visits in any case.'
    );
  }

  const clean: Anthropic.MessageParam[] = [];
  /* The question she is answering, kept aside for the abstention log. The last
     user turn is the only part of a conversation ever written down. */
  let lastQuestion = '';
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
    if (m.role === 'user') lastQuestion = m.content;
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

  /* The cap, counted at the last moment before the model — after everything a
     request can be refused for on its own terms, so a malformed message never
     costs anyone one of their twenty. */
  const decision = await countOneMessage(req, new Date());

  if (decision.kind === 'misconfigured') {
    console.error(
      `phoebe: ${decision.missing} is not configured, so the daily cap cannot be enforced. Refusing to answer without it.`
    );
    return problem(
      503,
      'Phoebe is not answering right now. The daily limit that keeps her free and open to everyone is not running in this environment, and she does not answer without it. This is a configuration problem on our side, not something you did.'
    );
  }

  if (decision.kind === 'refused') {
    return problem(
      429,
      `You have reached today's limit of ${decision.cap} messages. Phoebe is free and open to anyone, and the daily limit is what keeps her that way. Your count resets at midnight UTC, ${timeUntilReset(decision.secondsToReset)}. Nothing you have told her is kept between visits in any case.`,
      { 'retry-after': String(decision.secondsToReset) }
    );
  }

  if (decision.kind === 'uncounted') {
    /* An honest state in the log rather than a silent lapse: this message is
       being answered without being counted, and here is why. */
    console.error(`phoebe: this message was not counted against any cap — ${decision.why}`);
  }

  /** Every way out of here that is not a delivered answer gives the message back. */
  const undelivered = async (response: Response): Promise<Response> => {
    if (decision.kind === 'allowed') await decision.refund();
    return response;
  };

  const client = new Anthropic({ apiKey });

  let response: Anthropic.Message;
  const calledAt = Date.now();

  /* One attempt, and a second only for a late 400 — see LATE_400_MS. The
     retry is inside a single visitor message: the cap was charged before this
     point and is refunded by undelivered() if both attempts fail, so a retry
     never costs anyone two of their twenty. Confirmed in
     scripts/check-cap.mjs rather than assumed. */
  const callModel = (): Promise<Anthropic.Message> =>
    client.messages.create(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        /* The cache breakpoint. Everything above it is byte-identical between
           requests; the conversation below it is not cached. */
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages: clean,
        /* Stated rather than inherited. This model thinks adaptively whether
           or not it is asked to, and that thinking is spent from MAX_TOKENS
           above. */
        thinking: { type: 'adaptive' },
        output_config: {
          effort: EFFORT,
          format: { type: 'json_schema', schema: RESPONSE_SCHEMA },
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
      diag('late-400-retry', {
        firstAttemptMs: elapsed,
        requestId: pick(first, 'request_id') ?? pick(first, 'requestID'),
      });
      console.error(
        `phoebe: a 400 arrived after ${(elapsed / 1000).toFixed(1)}s, which is too late to be a malformed request — retrying once`
      );
      response = await callModel();
    }
  } catch (error) {
    /* Fault 2 of item A6 is an API error 400 on our own request. This records
       what we sent, so that fault is explicable rather than mysterious. */
    diag('api-error', {
      ms: Date.now() - calledAt,
      status: pick(error, 'status'),
      name: pick(error, 'name'),
      message: String(pick(error, 'message') ?? '').slice(0, 400),
      requestId: pick(error, 'request_id') ?? pick(error, 'requestID'),
      sent: {
        model: MODEL,
        maxTokens: MAX_TOKENS,
        effort: EFFORT,
        systemChars: SYSTEM_PROMPT.length,
        messageCount: clean.length,
        messageChars: clean.map((m) => m.content.length),
        roles: clean.map((m) => m.role),
      },
    });
    return undelivered(fromApiError(error));
  }

  /* Every response, good or bad, so a failure can be read against a success
     rather than on its own. */
  diag('response', {
    ms: Date.now() - calledAt,
    /* Which settings produced this number. Added after a measurement run was
       nearly attributed to the wrong model: a second dev server could not take
       the port, exited, and the requests went to the one still running. A
       measurement that does not say what produced it is not a measurement. */
    model: MODEL,
    effort: EFFORT,
    stopReason: response.stop_reason,
    blocks: response.content.map((b) => b.type),
    usage: {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
      cacheRead: response.usage.cache_read_input_tokens ?? 0,
      cacheWrite: response.usage.cache_creation_input_tokens ?? 0,
    },
    budget: MAX_TOKENS,
  });

  /* Claude Sonnet 5 can decline a request outright. That is a real state and
     it gets said, not smoothed over into an empty answer. */
  if (response.stop_reason === 'refusal') {
    diag('refusal', { output: response.usage.output_tokens, blocks: response.content.map((b) => b.type) });
    return undelivered(
      problem(
        502,
        'Phoebe stopped part-way through that one and did not finish an answer. Try rephrasing the question.'
      )
    );
  }

  /* Running out of budget is a different failure from writing a bad answer,
     and it must not be reported as one. A truncated reply reaches JSON.parse
     as half-written JSON and throws there, which used to surface as "Phoebe
     answered in a shape this console could not read" - blaming her answer for
     what is our budget. Caught here instead, and named. */
  if (response.stop_reason === 'max_tokens') {
    console.error(
      `phoebe: answer hit the output budget and was cut off — ${response.usage.output_tokens} of ${MAX_TOKENS} output tokens, most of it hidden thinking`
    );
    return undelivered(
      problem(
        502,
        'Phoebe ran out of room part-way through that answer, so it was cut off before it was finished. Nothing has been recorded. This is a limit on our side, not something you did - asking again, or in smaller pieces, usually gets through.'
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
    diag('unparseable', {
      stopReason: response.stop_reason,
      textChars: text.length,
      output: response.usage.output_tokens,
      textPreview: text.slice(0, 300),
    });
    console.error(
      `phoebe: reply was not the JSON shape requested — ${response.usage.output_tokens} of ${MAX_TOKENS} output tokens`
    );
    return undelivered(
      problem(
        502,
        'Phoebe answered in a shape this console could not read. Nothing has been recorded. Try asking again.'
      )
    );
  }

  /* An answer with nothing in it is its own failure, and it is now said as one.
     validate() refuses for exactly one reason — a reply that is missing, not
     text, or empty once trimmed — so reaching here means she said nothing at
     all. It used to be reported as "a shape this console could not read", which
     described a different fault and sent two days of hunting in the wrong
     direction. Item A4. Do not paper over it by accepting an empty reply:
     showing a blank turn would be the dishonest fix. */
  const answer = validate(parsed);
  if (!answer) {
    /* Fault 1 of item A6. The stop reason is the field nobody has looked at,
       and the parsed shape says whether she wrote a well-formed answer with an
       empty reply or something else entirely. */
    diag('empty-answer', {
      stopReason: response.stop_reason,
      textChars: text.length,
      parsedKeys:
        typeof parsed === 'object' && parsed !== null ? Object.keys(parsed) : typeof parsed,
      replyType: typeof pick(parsed, 'reply'),
      replyChars: String(pick(parsed, 'reply') ?? '').length,
      abstained: pick(parsed, 'abstained'),
      output: response.usage.output_tokens,
      budget: MAX_TOKENS,
      textPreview: text.slice(0, 300),
    });
    console.error(
      `phoebe: returned an empty answer — ${response.usage.output_tokens} of ${MAX_TOKENS} output tokens, most of it hidden thinking`
    );
    return undelivered(
      problem(
        502,
        'Phoebe returned an empty answer — she did not say anything at all. Nothing has been recorded. This is a fault on our side rather than something you did, and asking again usually works.'
      )
    );
  }

  /* An answer of one to three characters is the empty answer wearing a
     character. validate() refuses a reply that is empty once trimmed; measured
     on 28 Aug 2026, four replies of one to three characters got past it and
     reached callers. Refused here for the same reason and with the same honest
     message — see api/_reply.ts for where the number comes from and why this
     is not the schema minimum item A4 refused. */
  if (isDegenerateReply(answer.reply)) {
    diag('degenerate-reply', {
      stopReason: response.stop_reason,
      replyChars: answer.reply.length,
      reply: JSON.stringify(answer.reply),
      citedCards: answer.citedCards?.length ?? 0,
      abstained: answer.abstained,
      output: response.usage.output_tokens,
      floor: MIN_REPLY_CHARS,
    });
    console.error(
      `phoebe: returned an answer too short to be one — ${answer.reply.trim().length} characters against a floor of ${MIN_REPLY_CHARS}, ${response.usage.output_tokens} of ${MAX_TOKENS} output tokens`
    );
    return undelivered(
      problem(
        502,
        'Phoebe returned an answer with almost nothing in it — a few characters and no substance. Nothing has been recorded. This is a fault on our side rather than something you did, and asking again usually works.'
      )
    );
  }

  /* Fault 4 of item A6 is that answers vary enormously on identical input, so
     the successes have to be measured as well as the failures. */
  diag('delivered', {
    stopReason: response.stop_reason,
    replyChars: answer.reply.length,
    citedCards: answer.citedCards?.length ?? 0,
    abstained: answer.abstained,
    output: response.usage.output_tokens,
    /* A reply of one to three characters has reached a caller. The length said
       so and nothing said what those characters were, which is the difference
       between a stray full stop and a word. Quoted, so whitespace is visible.
       Only for tiny replies: a full answer's text is not diagnostic. */
    ...(answer.reply.length <= 40 ? { replyPreview: JSON.stringify(answer.reply) } : {}),
  });

  /* Recorded before the answer goes out, and awaited rather than left running:
     once a Response is returned the platform may stop this function where it
     stands, and unfinished work stops with it. It cannot fail the answer — the
     recorder swallows its own failures into the log. */
  if (answer.abstained) {
    await recordAbstention(lastQuestion, answer.abstentionTopic, new Date());
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
  if (error instanceof Anthropic.APIConnectionTimeoutError) {
    console.error(`phoebe: gave up waiting after ${CALL_TIMEOUT_MS / 1000}s`);
    return problem(
      504,
      'Phoebe took too long to answer that one and we stopped waiting. Nothing has been recorded. This is a limit on our side rather than something you did — asking again, or in smaller pieces, usually gets through.'
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
