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
 * THE PROMPT IS CACHED. It is identical on every request, so it carries a
 * cache breakpoint. Nothing volatile may be added above that breakpoint. The
 * visit record rides as a second system block AFTER that breakpoint, the way
 * Phoebe's does, so only this small block changes between visitors.
 *
 * HE IS HIS PACKAGE'S FROM 26 NOV 2026 (@waterbots/wellington 0.1.0, J5): his
 * instructions for the Free site (`wellingtonInstructions`), the blocks for one
 * turn (`wellingtonBlocks`), his answer's shape and its checks
 * (`checkWellingtonTurn`), his reading of the agent map and his step notes.
 * This site hands in its shared texts, and keeps the call to the model and its
 * key, the daily limits and what a visitor is told when something fails. He
 * asks for no kind and no class: he gathers where the water comes from, whether
 * it is treated and where, and whether it is safe, as plain facts.
 */

import Anthropic from '@anthropic-ai/sdk';
import { MIN_REPLY_CHARS, READING_GRADE, isHardReply, readingGrade } from '@waterbots/core/reply';
import { cardWordsIn } from '@waterbots/phoebe';
import {
  JOINED,
  WELLINGTON_RESPONSE_SCHEMA,
  checkWellingtonTurn,
  openedLine,
  readMap,
  refusedCount,
  wellingtonBlocks,
  wellingtonInstructions,
  type Joined,
  type Opened,
  type TurnInput,
  type WellingtonAnswer,
} from '@waterbots/wellington';
import { recordAbstention } from './_abstentions.js';
import { AGENT_RULES_MD } from './_agentRules.generated.js';
import { CARRIED, WELLINGTON, countOneMessage, timeUntilReset } from './_cap.js';
import { BEFORE_AFTER_MD, PLAIN_WORDS_MD } from './_plainWords.generated.js';
import { AGENT_PRIMER_MD } from './_primer.generated.js';
import { FREE_SITE_DOOR } from './_door.js';
import { foundPathways, readCarried, readSheet } from './_record.js';
import { BUILD_STATUS_SHEET_MD } from './_statusSheet.generated.js';

/**
 * HIS INSTRUCTIONS, his package's for the Free site, built once at module load from the texts this site holds: core's
 * agent rules, the roster part of the primer, the plain-words list and its examples, and the build status sheet.
 */
export const WELLINGTON_SYSTEM_PROMPT = wellingtonInstructions('free-site', {
  agentRules: AGENT_RULES_MD,
  roster: AGENT_PRIMER_MD,
  plainWords: PLAIN_WORDS_MD,
  beforeAfter: BEFORE_AFTER_MD,
  statusSheet: BUILD_STATUS_SHEET_MD,
});

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
  let body: {
    messages?: IncomingMessage[];
    carried?: unknown;
    record?: unknown;
    stage?: unknown;
    sheet?: unknown;
    returned?: unknown;
    at?: unknown;
    to?: unknown;
    map?: unknown;
    asked?: unknown;
  };
  try {
    body = (await req.json()) as {
      messages?: IncomingMessage[];
      carried?: unknown;
      record?: unknown;
      stage?: unknown;
      sheet?: unknown;
      returned?: unknown;
      at?: unknown;
      to?: unknown;
      map?: unknown;
      asked?: unknown;
    };
  } catch {
    return problem(400, 'That request could not be read.');
  }

  /* A question carried in from the production landing's question box says so
     (item S13, 9 Sep 2026). It is counted under its own cap of ten a day
     before his thirty. Exactly `true` counts; anything else is a typed turn. */
  const carried = body.carried === true;

  /* THE VISITOR CAME BACK FROM PHOEBE — item A17, ruling R2, 26 Sep 2026.
     The desk sends one turn, once, the first time it shows after her
     worksheet is done, the way her screen sends `opened`. He may have said
     nothing yet this visit, so an empty thread is allowed on this turn only. */
  const returned = body.returned === true;

  /* WELLINGTON COMES TO YOU — the maintainer's ruling of 14 Nov 2026. When an
     agent's step is done he joins the visitor in that agent's chat with the
     next step; `at` names the step. Only with `returned`, and only these.
     `open` is his own desk on arrival: he speaks first (W29, 16 Nov 2026). */
  /* THE SAME HAND-OFF FOR EVERY AGENT — the maintainer's ruling of 24 Nov 2026 (the shared console behaviours, line
     5). `handoff` is sent the first time a colleague's page shows and he has not handed the visitor over: they came
     by the crew list. `to` names the page, from a closed list. */
  const joinedAt = JOINED.find((desk) => desk === body.at) ?? null;
  const at = returned ? (joinedAt ?? (body.at === 'open' ? ('open' as const) : null)) : null;
  /* THE VISITOR ANSWERS HIM THERE (25 Nov 2026): he asked something in another agent's chat, and their words came to him. */
  const replyingAt = returned ? null : joinedAt;
  const handTo: Joined | null = returned && body.at === 'handoff' ? (JOINED.find((s) => s === body.to) ?? null) : null;
  /* What opened this turn, when the visitor did not type it: his package's own words for each (`openedLine`). */
  const opened: Opened | undefined = !returned ? undefined : handTo ? { handoff: handTo } : at ? { at } : { returned: true };

  const messages = Array.isArray(body.messages) ? body.messages : null;
  if (!messages || (messages.length === 0 && !returned)) {
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
  /* THE VISITOR'S OWN WORDS in this chat, and nobody else's (core 0.5.0): his package fills a fact about the kind only
     from them, and a yes or no only as the answer to the question his last reply asked (`asked`, its `asking`). */
  const said = clean.flatMap((m) => (m.role === 'user' && typeof m.content === 'string' ? [m.content] : []));
  const asked = typeof body.asked === 'string' && /^[\w.-]{1,60}$/.test(body.asked) ? body.asked : undefined;
  if (returned && (clean.length === 0 || clean[clean.length - 1].role !== 'user')) {
    /* The model needs a user turn. This line is never shown as a bubble. */
    clean.push({ role: 'user', content: openedLine(opened ?? { returned: true }) });
    if (!lastQuestion) {
      lastQuestion = handTo ? `(handed over at ${handTo})` : at === 'open' ? '(opened the desk)' : at ? `(joined at ${at})` : '(came back from Eligibility)';
    }
  }
  if (clean.length === 0 || clean[clean.length - 1].role !== 'user') {
    return problem(400, 'No message was sent.');
  }

  /* THE VISIT THE DESK ALREADY HOLDS — 16 Sep 2026. The visitor's own words about the project, read on to core's record
     (api/_record.ts), or null. It rides as a block AFTER the cache breakpoint, so his rules stay cached and only these
     small blocks change between visitors. */
  const record = readCarried(body.record);
  /* THE AGENT MAP — J4, 23 Nov 2026, worked out in the browser from core's map and read again here by his package. */
  const map = readMap(body.map);
  /* WHAT PHOEBE FOUND — item A17, 26 Sep 2026. Her worksheet as the shell holds it, read into each pathway's read and the
     rows behind it by id and tool-file title. Never her own sentences. */
  const found = foundPathways(readSheet(body.sheet), record);
  const turn = (pass: number): TurnInput => ({
    place: 'free-site',
    record,
    map,
    found,
    ...(opened ? { opened } : {}),
    ...(replyingAt ? { replyingAt } : {}),
    pass,
    messages: said,
    ...(asked ? { asked } : {}),
    door: FREE_SITE_DOOR,
  });

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

  /* THE CARRIED CAP FIRST, when the question came over from the landing. Ten
     a day under its own name, on top of his thirty. Refused, the visitor is
     told in plain words and nothing is spent; the desk composer still works,
     because that is his cap, not this one. */
  const carriedDecision = carried ? await countOneMessage(req, new Date(), CARRIED) : null;

  if (carriedDecision?.kind === 'misconfigured') {
    console.error(
      `wellington: ${carriedDecision.missing} is not configured, so the carried-question cap cannot be enforced. Refusing to answer without it.`
    );
    return problem(
      503,
      'Wellington is not answering right now. The daily limit that keeps him free and open to everyone is not running in this environment, and he does not answer without it. This is a configuration problem on our side, not something you did.'
    );
  }

  if (carriedDecision?.kind === 'refused') {
    return problem(
      429,
      `You have brought ${carriedDecision.cap} questions over from waterbots.ai today, which is the daily limit for that door. You can still type to Wellington here. The count resets at midnight UTC, ${timeUntilReset(carriedDecision.secondsToReset)}. Nothing you have told him is kept between visits in any case.`,
      { 'retry-after': String(carriedDecision.secondsToReset) }
    );
  }

  if (carriedDecision?.kind === 'uncounted') {
    console.error(`wellington: this carried question was not counted against the carried cap — ${carriedDecision.why}`);
  }

  const refundCarried = async (): Promise<void> => {
    if (carriedDecision?.kind === 'allowed') await carriedDecision.refund();
  };

  /* The cap, counted at the last moment before the model, under his own name. */
  const decision = await countOneMessage(req, new Date(), WELLINGTON);

  /* Refused or unable under his own cap, the carried count is put back too —
     no answer was delivered, so nothing is spent on either counter. */
  if (decision.kind === 'misconfigured' || decision.kind === 'refused') await refundCarried();

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
    await refundCarried();
    return response;
  };

  const client = new Anthropic({ apiKey });

  let response: Anthropic.Message;
  let parsed: unknown;
  let answer: WellingtonAnswer;
  const calledAt = Date.now();

  const callModel = (pass: number): Promise<Anthropic.Message> =>
    client.messages.create(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: [
          { type: 'text', text: WELLINGTON_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
          /* His package's blocks for this turn, in order: the visit, what Phoebe found, the map, what opened the turn, and
             on a second call the note that it has to end in an answer. */
          ...wellingtonBlocks(turn(pass)).map((text) => ({ type: 'text' as const, text })),
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
        `wellington: a 400 arrived after ${(elapsed / 1000).toFixed(1)}s, which is too late to be a malformed request — retrying once`
      );
      response = await callModel(pass);
    }
  } catch (error) {
    return undelivered(fromApiError(error));
  }

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

  try {
    parsed = JSON.parse(text);
  } catch {
    console.error(`wellington: reply was not the JSON shape requested — ${response.usage.output_tokens} of ${MAX_TOKENS} output tokens`);
    return undelivered(
      problem(502, 'Wellington answered in a shape this console could not read. Try asking again.')
    );
  }

  /* HIS PACKAGE CHECKS THE ANSWER (`checkWellingtonTurn`): the route on a hand-off or at a step's end is the map's, a
     desk the map has closed is never routed to, an introduction goes with its route, and a reply that promises a look-up
     or calls the screening done too soon goes again once. */
  const outcome = checkWellingtonTurn(parsed, turn(pass));
  if (outcome.ok) {
    answer = outcome.answer;
    break;
  }
  if ('again' in outcome && pass === 1) {
    console.log(`wellington: ${outcome.again === 'look-up' ? 'the reply promised a look-up and did not answer' : 'the reply called the screening done with a step ahead'}, call ${pass}`);
    continue;
  }
  const fault = 'fault' in outcome ? outcome.fault : 'no answer';
  if (fault === 'empty') {
    console.error(`wellington: returned an empty answer — ${response.usage.output_tokens} of ${MAX_TOKENS} output tokens`);
    return undelivered(
      problem(
        502,
        'Wellington returned an empty answer — he did not say anything at all. This is a fault on our side rather than something you did, and asking again usually works.'
      )
    );
  }
  if (fault === 'too short') {
    console.error(`wellington: returned an answer too short to be one, against a floor of ${MIN_REPLY_CHARS}`);
    return undelivered(
      problem(
        502,
        'Wellington returned an answer with almost nothing in it. This is a fault on our side rather than something you did, and asking again usually works.'
      )
    );
  }
  return undelivered(
    problem(
      502,
      'Wellington went to look something up and did not come back with an answer. This is a fault on our side rather than something you did, and asking again usually works.'
    )
  );
  }

  /* The shared word list (14 Nov 2026): the plain-words list and the
     before-and-after pairs reach both agents, so his replies are held to the
     same list as hers. Logged, never blocked. */
  const cardWords = cardWordsIn(answer.reply);
  if (cardWords.length) console.warn(`wellington: reply used card words — ${cardWords.join(', ')}`);

  /* READING LEVEL (V1, 16 Nov 2026): 3rd- to 6th-grade English. A reply above
     grade 6 is logged, never blocked; the measured walks fail on the bars.
     See readingGrade in @waterbots/core/reply. */
  if (isHardReply(answer.reply)) {
    console.log(`wellington: reply read above grade ${READING_GRADE.average} — grade ${readingGrade(answer.reply)}`);
  }

  /* Only a question outside every lane is logged, and it is marked as his.
     His routings are not abstentions and are not written down. */
  if (answer.abstained) {
    await recordAbstention(lastQuestion, answer.abstentionTopic, new Date(), 'wellington');
  }

  return json(200, {
    ...answer,
    ...(refusedCount(parsed) ? { refused: refusedCount(parsed) } : {}),
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
