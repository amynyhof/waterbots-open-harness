/**
 * Bridget's relay.
 *
 * A Vercel serverless function, on Phoebe's and Wellington's proven pattern —
 * the same shape, the same guards, every setting stated rather than inherited.
 * The Anthropic API key lives in the project's environment variables and is
 * read here, on the server. It is never sent to the browser, never written
 * into the bundle, and never committed.
 *
 * HER CHAT WENT LIVE ON 31 OCT 2026, the maintainer's ruling on #167 (item
 * A22). She asks one question, the pin, and reports the basin it landed on.
 * The console sends two turns no visitor typed: `opened`, the first time her
 * step shows, and `pinned`, each time a new basin is pinned. Each is one of
 * her answers and is counted like one. From the maintainer's second ruling the
 * same day her opening is her own words, not a greeting the console shows, so
 * `opened` is the turn that introduces her.
 *
 * THIRTY MESSAGES A DAY, per visitor, counted under her own key. The counting
 * lives in _cap.ts; what a visitor is told about it lives here. A message is
 * counted only when an answer is actually delivered.
 *
 * THE HAND-BACK IS A FIELD, and the console acts on it, never on her prose.
 * After a pin Wellington joins with the next step (`settleBridgetAnswer`).
 *
 * SHE IS HER PACKAGE'S FROM 26 NOV 2026 (@waterbots/bridget 0.1.0, J5): her
 * instructions, the pin and place checks, the blocks for a turn and the checks
 * on her answer. The map screen and its data stay with this site until the
 * rights check.
 *
 * THE PROMPT IS CACHED. The place, the device and the pin ride as a second
 * system block after the breakpoint, so only that small block changes.
 */

import Anthropic from '@anthropic-ai/sdk';
import { MIN_REPLY_CHARS, READING_GRADE, isHardReply, readingGrade } from '@waterbots/core/reply';
import {
  BRIDGET_ANSWER_SCHEMA,
  bridgetInstructions,
  bridgetRecordBlock,
  chatForTurn,
  readBridgetAnswer,
  readGpsOutcome,
  readPin,
  readPlace,
  replyVerdict,
  settleBridgetAnswer,
  turnBlocks,
  visitBlock,
  type BridgetAnswer as Answer,
} from '@waterbots/bridget';
import { recordAbstention } from './_abstentions.js';
import { AGENT_RULES_MD } from './_agentRules.generated.js';
import { BRIDGET_PROMPT_MD } from './_bridgetPrompt.generated.js';
import { BRIDGET, countOneMessage, timeUntilReset } from './_cap.js';
import { AGENT_PRIMER_MD } from './_primer.generated.js';
import { readCarried } from './_record.js';
import { BUILD_STATUS_SHEET_MD } from './_statusSheet.generated.js';

/**
 * HER INSTRUCTIONS, her package's for the Free site (`bridgetInstructions`, @waterbots/bridget 0.1.0, 26 Nov 2026), built
 * once at module load from her own prompt as her package ships it and the texts this site holds. The map screen and its
 * data stay with this site until the rights check.
 */
export const BRIDGET_SYSTEM_PROMPT = bridgetInstructions({
  place: 'free-site',
  prompt: BRIDGET_PROMPT_MD,
  agentRules: AGENT_RULES_MD,
  primer: AGENT_PRIMER_MD,
  statusSheet: BUILD_STATUS_SHEET_MD,
});

/** The same tier as her colleagues, for their measured reason (item A6): a voice that goes silent is the worse fault. */
const MODEL = 'claude-opus-5';

/** Her colleagues' budget, for their reasons (see api/phoebe.ts). Her replies are short; her thinking is what spends this. */
const MAX_TOKENS = 16000;

/** "medium", stated rather than inherited. Her task is the narrowest on the site: one question, one report. */
const EFFORT = 'medium' as const;

/** How long the relay waits for the model before giving up. Phoebe's 120 seconds, same reasoning. */
const CALL_TIMEOUT_MS = 120_000;

/** A 400 that arrives after this long is a failure during generation, not a malformed request. One retry. */
const LATE_400_MS = 5_000;

/** A conversation this long has left the map behind. */
const MAX_TURNS = 40;

/** Long enough for a real message, short enough to refuse an essay. */
const MAX_MESSAGE_CHARS = 4000;

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

/** Most of the budget is spent before the first visible word. Stated, like her colleagues'. */
export const maxDuration = 60;

export async function GET(): Promise<Response> {
  return problem(405, 'This endpoint takes POST requests only.');
}

export async function POST(req: Request): Promise<Response> {
  let body: {
    messages?: IncomingMessage[];
    opened?: unknown;
    introduced?: unknown;
    pinned?: unknown;
    place?: unknown;
    phone?: unknown;
    pin?: unknown;
    record?: unknown;
    gps?: unknown;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return problem(400, 'That request could not be read.');
  }

  /* Exactly `true` counts; anything else is a typed turn. */
  const opened = body.opened === true;
  const introduced = opened && body.introduced === true;
  const pinned = body.pinned === true;
  const pin = readPin(body.pin);

  /* A pinned turn with no pin that holds is not one: there is nothing to report. */
  if (pinned && !pin) {
    return problem(400, 'That pin could not be read.');
  }

  const messages = Array.isArray(body.messages) ? body.messages : null;
  if (!messages || (messages.length === 0 && !opened && !pinned)) {
    return problem(400, 'No message was sent.');
  }
  if (messages.length > MAX_TURNS) {
    return problem(
      400,
      'This conversation has grown long enough that Bridget has lost the thread. Reload the page to start fresh — she keeps no memory between visits in any case.'
    );
  }

  for (const m of messages) {
    if (m?.role !== 'user' && m?.role !== 'assistant') {
      return problem(400, 'That request could not be read.');
    }
    if (typeof m.content === 'string' && m.content.length > MAX_MESSAGE_CHARS) {
      return problem(
        400,
        `That message is longer than Bridget can take in at once — the limit is ${MAX_MESSAGE_CHARS.toLocaleString()} characters. Try the most important part first.`
      );
    }
  }
  /* Her package lays out the turn (`chatForTurn`): her first answer follows the turn the console sent, which is never kept
     as a bubble, and a pin or an opening with nothing typed reads as its own line. */
  const turn = chatForTurn(messages, { opened, introduced, pinned });
  if (!turn) return problem(400, 'No message was sent.');
  const clean: Anthropic.MessageParam[] = turn.chat;
  const lastIsUser = turn.typed;
  const lastQuestion = turn.typed ? turn.lastWords : pinned ? '(pinned a basin)' : '(opened Partners)';

  const gps = readGpsOutcome(body.gps);
  const visitText = visitBlock(readPlace(body.place), body.phone === true, pin, gps);
  /* THE PROJECT RECORD, the one Phoebe reads (J3, 23 Nov 2026), read on to core's record, so she never asks for what it holds. */
  const record = readCarried(body.record);
  const recordText = record ? bridgetRecordBlock(record) : null;

  /* Shape first, then whether we can actually answer — same order as Phoebe's. */
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('bridget: ANTHROPIC_API_KEY is not set in this environment');
    return problem(
      503,
      'Bridget is not connected in this environment. Her API key has not been configured, so she cannot answer. The map still works. This is a configuration problem on our side, not something you did.'
    );
  }

  /* The cap, counted at the last moment before the model, under her own name. */
  const decision = await countOneMessage(req, new Date(), BRIDGET);

  if (decision.kind === 'misconfigured') {
    console.error(
      `bridget: ${decision.missing} is not configured, so the daily cap cannot be enforced. Refusing to answer without it.`
    );
    return problem(
      503,
      'Bridget is not answering right now. The daily limit that keeps her free and open to everyone is not running in this environment, and she does not answer without it. The map still works. This is a configuration problem on our side, not something you did.'
    );
  }

  if (decision.kind === 'refused') {
    return problem(
      429,
      `You have reached today's limit of ${decision.cap} messages to Bridget. She is free and open to anyone, and the daily limit is what keeps her that way. The map still works, and your count resets at midnight UTC, ${timeUntilReset(decision.secondsToReset)}. Nothing you have told her is kept between visits in any case.`,
      { 'retry-after': String(decision.secondsToReset) }
    );
  }

  if (decision.kind === 'uncounted') {
    console.error(`bridget: this message was not counted against any cap — ${decision.why}`);
  }

  const undelivered = async (response: Response): Promise<Response> => {
    if (decision.kind === 'allowed') await decision.refund();
    return response;
  };

  const client = new Anthropic({ apiKey });

  let response: Anthropic.Message;
  let answer: Answer;
  const calledAt = Date.now();

  const callModel = (pass: number): Promise<Anthropic.Message> =>
    client.messages.create(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: [
          { type: 'text', text: BRIDGET_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
          /* Her package's blocks: the visit, the record, and on a second call the note that it has to end now. */
          ...turnBlocks(visitText, recordText, pass > 1).map((text) => ({ type: 'text' as const, text })),
        ],
        messages: clean,
        thinking: { type: 'adaptive' },
        output_config: {
          effort: EFFORT,
          format: { type: 'json_schema', schema: BRIDGET_ANSWER_SCHEMA },
        },
      },
      { timeout: CALL_TIMEOUT_MS }
    );

  /* ONE ANSWER, IN THE SAME TURN — 24 Nov 2026 (api/_lookUp.ts). A reply that ends by promising a look-up is never
     sent: the same question goes again once, and if that does not end in an answer the visitor is told so. */
  for (let pass = 1; ; pass += 1) {
  try {
    try {
      response = await callModel(pass);
    } catch (first) {
      const status = pick(first, 'status');
      const elapsed = Date.now() - calledAt;
      const lateFourHundred = status === 400 && elapsed > LATE_400_MS;
      if (!lateFourHundred) throw first;
      console.error(
        `bridget: a 400 arrived after ${(elapsed / 1000).toFixed(1)}s, which is too late to be a malformed request — retrying once`
      );
      response = await callModel(pass);
    }
  } catch (error) {
    return undelivered(fromApiError(error));
  }

  if (response.stop_reason === 'refusal') {
    return undelivered(
      problem(502, 'Bridget stopped part-way through that one and did not finish. Try rephrasing.')
    );
  }

  if (response.stop_reason === 'max_tokens') {
    console.error(
      `bridget: answer hit the output budget and was cut off — ${response.usage.output_tokens} of ${MAX_TOKENS} output tokens`
    );
    return undelivered(
      problem(
        502,
        'Bridget ran out of room part-way through that answer, so it was cut off before it was finished. This is a limit on our side, not something you did — asking again usually gets through.'
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
    console.error(`bridget: reply was not the JSON shape requested — ${response.usage.output_tokens} of ${MAX_TOKENS} output tokens`);
    return undelivered(problem(502, 'Bridget answered in a shape this console could not read. Try asking again.'));
  }

  /* HER PACKAGE CHECKS THE ANSWER (`readBridgetAnswer`) and decides (`replyVerdict`): send it, ask the same question once
     more because it promised a look-up, or say it could not be shown. */
  const read = readBridgetAnswer(parsed);
  const verdict = replyVerdict(read, { pinned, call: pass });
  if (verdict === 'send' && read) {
    answer = read;
    break;
  }
  if (verdict === 'again') {
    console.log(`bridget: the reply promised a look-up and did not answer, call ${pass}`);
    continue;
  }
  if (!read) {
    console.error(`bridget: returned an empty answer — ${response.usage.output_tokens} of ${MAX_TOKENS} output tokens`);
    return undelivered(
      problem(
        502,
        'Bridget returned an empty answer — she did not say anything at all. This is a fault on our side rather than something you did, and asking again usually works.'
      )
    );
  }
  if (read.reply.trim().length < MIN_REPLY_CHARS) {
    console.error(`bridget: returned an answer too short to be one — ${read.reply.trim().length} characters against a floor of ${MIN_REPLY_CHARS}`);
    return undelivered(
      problem(
        502,
        'Bridget returned an answer with almost nothing in it. This is a fault on our side rather than something you did, and asking again usually works.'
      )
    );
  }
  return undelivered(
    problem(
      502,
      'Bridget went to look something up and did not come back with an answer. This is a fault on our side rather than something you did, and asking again usually works.'
    )
  );
  }

  /* READING LEVEL (V1, 16 Nov 2026): 3rd- to 6th-grade English. A reply above
     grade 6 is logged, never blocked; the measured walks fail on the bars.
     See readingGrade in @waterbots/core/reply. */
  if (isHardReply(answer.reply)) {
    console.log(`bridget: reply read above grade ${READING_GRADE.average} — grade ${readingGrade(answer.reply)}`);
  }

  /* Only a question outside her one job is logged, and it is marked as hers. */
  if (answer.abstained) {
    await recordAbstention(lastQuestion, answer.abstentionTopic, new Date(), 'bridget');
  }

  return json(200, {
    /* Settled by her package: the more exact place only in the visitor's own words from this turn, the Map tab's chip on
       her first message, and the hand-back after a pin. */
    ...settleBridgetAnswer(answer, { typed: lastIsUser, lastWords: turn.lastWords, opened, pinned, pin }),
    usage: {
      cacheRead: response.usage.cache_read_input_tokens ?? 0,
      cacheWrite: response.usage.cache_creation_input_tokens ?? 0,
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
    },
  });
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

function fromApiError(error: unknown): Response {
  const status = pick(error, 'status');
  if (status === 429) {
    return problem(503, 'Bridget is busy right now — the service behind her is rate limited. Try again in a moment. The map still works.');
  }
  if (status === 401 || status === 403) {
    console.error('bridget: the API key was refused');
    return problem(503, 'Bridget is not connected in this environment — her API key was refused. This is a configuration problem on our side.');
  }
  if (typeof status === 'number' && status >= 500) {
    return problem(503, 'The service behind Bridget is having trouble right now. Try again in a moment. The map still works.');
  }
  if (pick(error, 'name') === 'APIConnectionTimeoutError' || pick(error, 'name') === 'AbortError') {
    return problem(504, 'Bridget took too long to answer and the request was stopped. Try again.');
  }
  console.error('bridget: unexpected API error —', String(pick(error, 'message') ?? error).slice(0, 400));
  return problem(502, 'Bridget could not answer that one. This is a fault on our side rather than something you did — asking again usually works.');
}
