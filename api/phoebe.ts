/**
 * Phoebe's relay.
 *
 * A Vercel serverless function. The Anthropic API key lives in the project's
 * environment variables and is read here, on the server. It is never sent to
 * the browser, never written into the bundle, and never committed.
 *
 * THIRTY MESSAGES A DAY, per visitor. The counting itself lives in _cap.ts;
 * what a visitor is told about it lives here, with every other message a
 * visitor reads. A message is counted only when an answer is actually
 * delivered — anything that fails on our side is put back.
 *
 * EVERY ABSTENTION IS WRITTEN DOWN. When Phoebe says she has no card for
 * something, that is a real question the card sets do not cover, and it is kept
 * so it can be graded into a card. See _abstentions.ts for what is kept and
 * what deliberately is not.
 *
 * THE PROMPT IS STAGED, AND BOTH HALVES ARE CACHED. From 25 Sep 2026 the cards
 * are no longer all sent on every request: the static half of the prompt — who
 * she is, her rules, her tool, her colleagues — carries the first cache
 * breakpoint, and the card sets this visit has actually reached carry the
 * second. So the static half stays cached when the stage moves, a run of turns
 * inside one stage is read at about a tenth of the input price, and a visitor
 * on one pathway is never read the other pathway's cards. The maintainer's
 * ruling R6, 25 Sep 2026; the staging itself is her package's (setsFor, nextSets).
 *
 * Nothing volatile may be added above those breakpoints.
 */

import Anthropic from '@anthropic-ai/sdk';
import { leavesWaiting, showable } from '@waterbots/core/lookUp';
import { MIN_REPLY_CHARS, READING_GRADE, isDegenerateReply, isHardReply, readingGrade, replyLength } from '@waterbots/core/reply';
import {
  CARD_SETS,
  MAX_PASSES,
  PHOEBE_ANSWER_SCHEMA,
  PHOEBE_REPLY_LIMIT,
  OPENED_TURN,
  cardWordsIn,
  isLongPhoebeReply,
  needCardsSoFar,
  needsOf,
  nextSets,
  openedAnswer,
  phoebeInstructions,
  phoebeTurn,
  readPhoebeAnswer,
  replySoFar,
  type CardSet,
  type PhoebeAnswer as Answer,
  type PhoebeDoor,
} from '@waterbots/phoebe';
import { recordAbstention } from './_abstentions.js';
import { AGENT_RULES_MD } from './_agentRules.generated.js';
import { PHOEBE, countOneMessage, timeUntilReset } from './_cap.js';
import { readDoor } from './_door.js';
import { BEFORE_AFTER_MD, PLAIN_WORDS_MD } from './_plainWords.generated.js';
import { AGENT_PRIMER_MD } from './_primer.generated.js';
import { readCarried, readSheet } from './_record.js';
import { BUILD_STATUS_SHEET_MD } from './_statusSheet.generated.js';

/**
 * THE LINES THAT FIT THIS SITE ALONE, which her package leaves to the site (`siteLines`, @waterbots/phoebe 0.1.0). Each is
 * her own line from this site's instructions before 26 Nov 2026, word for word; none is new. Her package holds the rest.
 */
const SITE_LINES: readonly string[] = [
  'At the Free site and the Agent Commons doors you work at the screen level: you use your tools and keep no memory.',
  'You have no memory. Each visit starts blank, and you cannot remember anything from a previous conversation. If someone refers to an earlier session, say plainly that you do not keep anything between visits. Do not pretend to remember and do not apologise at length.',
  '**This site holds no link to the consulting page yet:** name the page, never an address.',
  '**When you set a Blocked row, the console shows the box to reach the WaterBots team**, beside the save button; point to it.',
  '**A transitioning project hears one more fact, once**, on the card that finds it: a transition-assistance module, overseen by trusted consultants, is coming to the paid site, and the visitor can save the project and sign up for access. Said there and nowhere else.',
  '**You never say a phase runs here.** Say the phase name as written — Eligibility, Partners, Quantify, Plan, Monitor, Communicate — point at the step, never at a tab, and never at a "seat", a "console", a "dispatch" or a "surface". The one tab you name is your own Tool tab, when you say where the worksheet can be followed.',
  "Rule 8's (ref) marker is the worksheet's on this site.",
];

/** The lines that fit one door of this site only. */
const DOOR_LINES: Record<PhoebeDoor, readonly string[]> = {
  'free-site': ['When your part is done, or a question is not yours, Wellington joins the visitor in this chat with the next step. You never send them back to him.'],
  'agent-commons': [
    'On the Agent Commons you are opened alone, with no desk and no Wellington in reach; there the same field sends the visitor back to the shelf of knowledge packs, and the console draws that door itself.',
  ],
  'paid-site': [],
  mcp: [],
};

/**
 * HER INSTRUCTIONS, her package's (`phoebeInstructions`, 26 Nov 2026, J5), one set for each door this site opens her at,
 * built once at module load from the texts this site holds. Each is byte-identical on every request, so it is cached.
 */
const SYSTEM_PROMPTS: Record<'free-site' | 'agent-commons', string> = Object.fromEntries(
  (['free-site', 'agent-commons'] as const).map((door) => [
    door,
    phoebeInstructions({
      door,
      agentRules: AGENT_RULES_MD,
      primer: AGENT_PRIMER_MD,
      statusSheet: BUILD_STATUS_SHEET_MD,
      plainWords: PLAIN_WORDS_MD,
      beforeAfter: BEFORE_AFTER_MD,
      siteLines: [...SITE_LINES, ...DOOR_LINES[door]],
    }),
  ])
) as Record<'free-site' | 'agent-commons', string>;

/** Her answer's shape, as her package gives it. */
export const RESPONSE_SCHEMA = PHOEBE_ANSWER_SCHEMA;

/** The instructions at the Free site door, for the checks that measure them. */
export const SYSTEM_PROMPT = SYSTEM_PROMPTS['free-site'];

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
  let body: {
    messages?: IncomingMessage[];
    record?: unknown;
    sheet?: unknown;
    loaded?: unknown;
    opened?: unknown;
    introduced?: unknown;
    eligibilityDone?: unknown;
    door?: unknown;
    stream?: unknown;
  };
  try {
    body = (await req.json()) as {
      messages?: IncomingMessage[];
      record?: unknown;
      sheet?: unknown;
      loaded?: unknown;
      opened?: unknown;
      introduced?: unknown;
      eligibilityDone?: unknown;
      door?: unknown;
      stream?: unknown;
    };
  } catch {
    return problem(400, 'That request could not be read.');
  }

  const opened = body.opened === true;
  /* Rule 17, 22 Nov 2026: Wellington's line shows above her first answer, so he has introduced her. */
  const introduced = opened && body.introduced === true;
  const eligibilityDone = body.eligibilityDone === true;

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0 && !opened) {
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
  if (opened && (clean.length === 0 || clean[clean.length - 1].role !== 'user')) {
    /* Display-only on the thread: Wellington's copied invite. The model still
       needs a user turn. This sentence is never shown as a visitor bubble. */
    clean.push({ role: 'user', content: OPENED_TURN });
    if (!lastQuestion) lastQuestion = '(opened Eligibility)';
  }
  if (clean.length === 0 || clean[clean.length - 1].role !== 'user') {
    return problem(400, 'No question was sent.');
  }

  /* THE RECORD THE DESK CARRIES IN — slice 3, 7 Sep 2026, read on to core's record (api/_record.ts), or null; and which
     door she is at (J2, item A27, 23 Nov 2026). Her worksheet as the shell holds it, held to her tool files. Her package
     builds the blocks for the turn after her instructions (`phoebeTurn`): the cards it reaches, the door, the record, the
     worksheet (never on her first turn) and the visit's notes. Every verdict in them is her own. */
  const record = readCarried(body.record);
  const door: 'free-site' | 'agent-commons' = readDoor(body.door) === 'agent-commons' ? 'agent-commons' : 'free-site';
  const sheet = readSheet(body.sheet) ?? { rows: {}, sorts: {} };
  /* A set the visit has already been given rides along in `loaded`, because a set she has used must not disappear from
     under her mid-conversation (ruling R6, staged loading). */
  const loaded = Array.isArray(body.loaded)
    ? body.loaded.filter((set): set is string => typeof set === 'string')
    : [];
  const turnFor = (again: boolean, sets?: readonly CardSet[]) =>
    phoebeTurn({ door, record, sheet, loaded, opened, introduced, eligibilityDone, again, ...(sets ? { sets } : {}) });
  const { sets, pathways } = turnFor(false);

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
  const decision = await countOneMessage(req, new Date(), PHOEBE);

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

  /* STREAMED WHEN THE CONSOLE ASKS FOR IT — the maintainer's word of
     13 Nov 2026 (P13). The console sends `stream: true` and reads her reply as
     it is written; a caller that does not (the measuring scripts) gets the one
     JSON answer as before. Every failure above this line is still a plain
     JSON answer with its status, because nothing has been said yet. */
  if (body.stream === true) {
    return streamed((onText, onReset) => answerTurn(onText, onReset), undelivered);
  }
  return answerTurn();

  /**
   * Everything from the model call to the checked answer. `onText` receives
   * each new piece of the reply as it is written, and `onReset` says that what
   * was sent so far is to be thrown away, because the same question is going
   * again (a late 400, or a card set she asked for).
   */
  async function answerTurn(onText?: (text: string) => void, onReset?: () => void): Promise<Response> {
  let response: Anthropic.Message;
  const calledAt = Date.now();
  let firstWordAt: number | null = null;

  /**
   * One pass's streamed reply. A pass that asks for a card set is never shown,
   * because the visitor sees only the answer that follows (ruling R6); if her
   * answer names that set only after its reply, or ends by promising a look-up,
   * what was shown is reset before the next pass.
   */
  const passWriter = (last: boolean) => {
    let sent = 0;
    return {
      snapshot(raw: string): void {
        if (!onText) return;
        const asked = needCardsSoFar(raw);
        if (!last && asked && asked !== 'none' && (CARD_SETS as readonly string[]).includes(asked)) {
          return;
        }
        /* A sentence that promises a look-up is held until an answer follows it (api/_lookUp.ts). */
        const written = replySoFar(raw);
        const text = written === null ? null : showable(written);
        if (text === null || text.length <= sent) return;
        if (firstWordAt === null) firstWordAt = Date.now();
        onText(text.slice(sent));
        sent = text.length;
      },
      restart(): void {
        if (sent > 0) onReset?.();
        sent = 0;
      },
    };
  };

  /* One attempt, and a second only for a late 400 — see LATE_400_MS. The
     retry is inside a single visitor message: the cap was charged before this
     point and is refunded by undelivered() if both attempts fail, so a retry
     never costs anyone two of their thirty. Confirmed in
     scripts/check-cap.mjs rather than assumed.

     STREAMED FROM 13 NOV 2026, on every call: the request and the finished
     message are the same as before (finalMessage() is the Message create()
     returned), and while it is written the reply's text is read out of it for
     the visitor. */
  const callModel = (withSets: readonly CardSet[], writer: ReturnType<typeof passWriter>, pass: number): Promise<Anthropic.Message> => {
    const [cards, ...rest] = turnFor(pass > 1, withSets).blocks;
    const stream = client.messages.stream(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        /* TWO CACHE BREAKPOINTS. The first block is byte-identical on every
           request; the second changes only when the visit reaches a new stage,
           so the first stays cached across a stage change. Everything below
           them is this visitor's and is not cached. */
        system: [
          { type: 'text', text: SYSTEM_PROMPTS[door], cache_control: { type: 'ephemeral' } },
          { type: 'text', text: cards, cache_control: { type: 'ephemeral' } },
          /* The door, the record, the worksheet, the notes, and on a further call the note that it has to end now. */
          ...rest.map((text) => ({ type: 'text' as const, text })),
        ],
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
    stream.on('text', (_delta, snapshot) => writer.snapshot(snapshot));
    return stream.finalMessage();
  };

  /** One call, with one narrow retry for a late 400 — see LATE_400_MS. */
  const callOnce = async (withSets: readonly CardSet[], pass: number): Promise<Anthropic.Message> => {
    const writer = passWriter(pass === MAX_PASSES);
    try {
      return await callModel(withSets, writer, pass);
    } catch (first) {
      const status = pick(first, 'status');
      const elapsed = Date.now() - calledAt;
      const lateFourHundred = status === 400 && elapsed > LATE_400_MS;
      if (!lateFourHundred) throw first;
      console.error(
        `phoebe: a 400 arrived after ${(elapsed / 1000).toFixed(1)}s, which is too late to be a malformed request — retrying once`
      );
      writer.restart();
      return await callModel(withSets, writer, pass);
    }
  };

  /** What stopped one model response from being an answer at all, or null. */
  const stopped = (message: Anthropic.Message): Response | null => {
    /* Claude Sonnet 5 can decline a request outright. That is a real state and
       it gets said, not smoothed over into an empty answer. */
    if (message.stop_reason === 'refusal') {
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
    if (message.stop_reason === 'max_tokens') {
      console.error(
        `phoebe: answer hit the output budget and was cut off — ${message.usage.output_tokens} of ${MAX_TOKENS} output tokens, most of it hidden thinking`
      );
      return problem(
        502,
        'Phoebe ran out of room part-way through that answer, so it was cut off before it was finished. Nothing has been recorded. This is a limit on our side, not something you did - asking again, or in smaller pieces, usually gets through.'
      );
    }
    return null;
  };

  /**
   * One model response, read into an answer, into the card set she needs
   * first, or into the honest failure it is.
   *
   * It runs once on the ordinary turn and again on each further call — see the
   * loop below — so every failure message is written once rather than in two
   * places that could drift apart.
   */
  const readTurn = (message: Anthropic.Message, last: boolean): { answer: Answer } | { needs: CardSet } | { problem: Response } => {
    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error(
        `phoebe: reply was not the JSON shape requested — ${message.usage.output_tokens} of ${MAX_TOKENS} output tokens`
      );
      return {
        problem: problem(
          502,
          'Phoebe answered in a shape this console could not read. Nothing has been recorded. Try asking again.'
        ),
      };
    }

    /* A set she asks for comes before everything else in her answer: the same
       question goes again with it, and nothing of this pass is kept. */
    const needs = needsOf(parsed);
    if (needs !== 'none' && !last) return { needs };

    /* An answer with nothing in it is its own failure, and it is said as one.
       readAnswer() refuses for exactly one reason — a reply that is missing,
       not text, or empty once trimmed — so reaching here means she said nothing
       at all. It used to be reported as "a shape this console could not read",
       which described a different fault and sent two days of hunting in the
       wrong direction. Item A4. Do not paper over it by accepting an empty
       reply: showing a blank turn would be the dishonest fix. */
    const answer = readPhoebeAnswer(parsed);
    if (!answer) {
      console.error(
        `phoebe: returned an empty answer — ${message.usage.output_tokens} of ${MAX_TOKENS} output tokens, most of it hidden thinking`
      );
      return {
        problem: problem(
          502,
          'Phoebe returned an empty answer — she did not say anything at all. Nothing has been recorded. This is a fault on our side rather than something you did, and asking again usually works.'
        ),
      };
    }

    /* An answer of one to three characters is the empty answer wearing a
       character. readAnswer() refuses a reply that is empty once trimmed;
       measured on 28 Aug 2026, four replies of one to three characters got past
       it and reached callers. Refused here for the same reason and with the same
       honest message — see @waterbots/core/reply for where the number comes from and
       why this is not the schema minimum item A4 refused. */
    if (isDegenerateReply(answer.reply)) {
      console.error(
        `phoebe: returned an answer too short to be one — ${answer.reply.trim().length} characters against a floor of ${MIN_REPLY_CHARS}, ${message.usage.output_tokens} of ${MAX_TOKENS} output tokens`
      );
      return {
        problem: problem(
          502,
          'Phoebe returned an answer with almost nothing in it — a few characters and no substance. Nothing has been recorded. This is a fault on our side rather than something you did, and asking again usually works.'
        ),
      };
    }

    return { answer };
  };

  /* UNTIL SHE ANSWERS — 24 Nov 2026, the maintainer's ruling (api/_lookUp.ts).
     A set she has not been given is not a missing card, and she must never say
     it is (ruling R6, 25 Sep 2026). So when a question needs a set this turn
     does not carry, she names that set in a field, and the same question is
     asked again with it in front of her. The visitor sees the answer and
     nothing of what came before it.
     IT WAS ONE EXTRA CALL AND NO MORE, and where that did not end in an answer
     her holding sentence was delivered as one. Now the question goes again
     until it is answered, at most MAX_PASSES times, and the last call has every
     set still in play. It is not counted against anyone's day: the cap counts
     answers delivered to a visitor, and this is one answer. */
  let usedSets: CardSet[] = [...sets];
  let answer: Answer;
  let calls = 0;
  let inputTokens = 0;
  let outputTokens = 0;
  for (;;) {
    calls += 1;
    const last = calls === MAX_PASSES;
    try {
      response = await callOnce(usedSets, calls);
    } catch (error) {
      return undelivered(fromApiError(error));
    }
    inputTokens += response.usage.input_tokens;
    outputTokens += response.usage.output_tokens;
    const stop = stopped(response);
    if (stop) return undelivered(stop);
    const outcome = readTurn(response, last);
    if ('problem' in outcome) return undelivered(outcome.problem);

    let asked: CardSet | 'none' = 'none';
    if ('needs' in outcome) {
      asked = outcome.needs;
      console.log(`phoebe: asked for ${asked}, so the same question goes again with it`);
    } else {
      answer = outcome.answer;
      /* A reply that ends by promising a look-up is not an answer, unless Wellington is joining with the next step. */
      if (answer.handBack === 'wellington' || !leavesWaiting(answer.reply)) break;
      console.log(`phoebe: the reply promised a look-up and did not answer, call ${calls} of ${MAX_PASSES}`);
      if (last) {
        return undelivered(
          problem(
            502,
            'Phoebe went to look something up and did not come back with an answer. Nothing has been recorded. This is a fault on our side rather than something you did, and asking again usually works.'
          )
        );
      }
    }
    usedSets = nextSets({ used: usedSets, asked, pathways, last: calls + 1 === MAX_PASSES });
    /* Anything this pass showed is thrown away before the next speaks. */
    if (firstWordAt !== null) {
      onReset?.();
      firstWordAt = null;
    }
  }
  /* MESSAGE 1 SETS NOTHING (P14, 14 Nov 2026): on the opened turn any row, test
     or sort she returns is dropped, so the worksheet waits for message 2. */
  if (opened) answer = openedAnswer(answer);

  /* Recorded before the answer goes out, and awaited rather than left running:
     once a Response is returned the platform may stop this function where it
     stands, and unfinished work stops with it. It cannot fail the answer — the
     recorder swallows its own failures into the log. */
  if (answer.abstained) {
    await recordAbstention(lastQuestion, answer.abstentionTopic, new Date());
  }

  /* A LONG REPLY IS COUNTED, NOT REFUSED — the maintainer's word of
     13 Nov 2026 (P10): two or three short sentences, then one question. A real
     answer still reaches the visitor; the log says so, so real traffic can be
     counted, and the measured walk fails on one. See her package, @waterbots/phoebe. */
  if (isLongPhoebeReply(answer.reply)) {
    const length = replyLength(answer.reply);
    console.log(
      `phoebe: reply ran long — ${length.sentences} sentences and ${length.chars} characters, against ${PHOEBE_REPLY_LIMIT.sentences} and ${PHOEBE_REPLY_LIMIT.chars}`
    );
  }

  /* CARD WORDS ARE COUNTED THE SAME WAY (P23, 14 Nov 2026): logged here, and
     the measured walk fails on one. See CARD_WORDS in her package, @waterbots/phoebe. */
  const cardWords = cardWordsIn(answer.reply);
  if (cardWords.length) console.log(`phoebe: reply used card words — ${cardWords.join(', ')}`);

  /* READING LEVEL (V1, 16 Nov 2026): 3rd- to 6th-grade English. A reply above
     grade 6 is logged, never blocked; the measured walks fail on the bars.
     See readingGrade in @waterbots/core/reply. */
  if (isHardReply(answer.reply)) {
    console.log(`phoebe: reply read above grade ${READING_GRADE.average} — grade ${readingGrade(answer.reply)}`);
  }

  const doneAt = Date.now();
  /* SPEED, WRITTEN DOWN — added 14 Nov 2026, when the platform's log showed
     each answer's whole time but not when its first word reached the visitor. */
  console.log(
    `phoebe: first word ${firstWordAt === null ? 'not streamed' : `${((firstWordAt - calledAt) / 1000).toFixed(1)}s`}, whole answer ${((doneAt - calledAt) / 1000).toFixed(1)}s, ${calls} call(s)`
  );
  return json(200, {
    ...answer,
    /* Which card sets this answer was given, so the console can send them back
       with the next ask and a set she has used does not disappear. */
    loaded: usedSets,
    usage: {
      /* Surfaced so the cache can be confirmed working rather than assumed. */
      cacheRead: response.usage.cache_read_input_tokens ?? 0,
      cacheWrite: response.usage.cache_creation_input_tokens ?? 0,
      input: inputTokens,
      output: outputTokens,
      /* More than one on a turn where she asked for a set she did not have. */
      calls,
      /* How long the visitor waited, so speed is measured rather than felt:
         to the first word shown (streamed asks only) and to the whole answer. */
      firstWordMs: firstWordAt === null ? null : firstWordAt - calledAt,
      totalMs: doneAt - calledAt,
    },
  });
  }
}

/**
 * The answer as it is written: one JSON object a line (NDJSON).
 *
 *   {"type":"text","text":"…"}   the next piece of her reply, to show at once
 *   {"type":"reset"}             throw away what was shown; the question is going again
 *   {"type":"done","answer":{…}} the checked answer, exactly what the JSON answer was
 *   {"type":"error","status":502,"error":"…"} the honest failure, as the JSON answer said it
 *
 * The status is 200 because the stream has begun; the real outcome is the last
 * line. Every failure keeps its own words and its refund: `run` returns the
 * same Responses it always did, and they are read into the last line here. A
 * fault this cannot read is refunded and said plainly, never left hanging.
 */
function streamed(
  run: (onText: (text: string) => void, onReset: () => void) => Promise<Response>,
  undelivered: (response: Response) => Promise<Response>
): Response {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      /* A visitor who leaves mid-answer closes the stream; the work finishes
         and is counted as delivered, as it was when the answer came whole. */
      const send = (event: unknown): void => {
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          /* Closed by the reader. Nothing to tell anyone. */
        }
      };
      try {
        const final = await run(
          (text) => send({ type: 'text', text }),
          () => send({ type: 'reset' })
        );
        const payload = (await final.json()) as Record<string, unknown>;
        send(
          final.ok
            ? { type: 'done', answer: payload }
            : { type: 'error', status: final.status, error: payload.error }
        );
      } catch (error) {
        console.error('phoebe: the streamed answer failed', error);
        const failed = await undelivered(problem(500, 'Something went wrong on our side. Nothing has been recorded.'));
        send({ type: 'error', status: failed.status, error: ((await failed.json()) as { error?: string }).error });
      } finally {
        try {
          controller.close();
        } catch {
          /* Already closed by the reader. */
        }
      }
    },
  });
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'application/x-ndjson; charset=utf-8',
      'cache-control': 'no-store',
      /* Asks any proxy in between not to hold the lines back. */
      'x-accel-buffering': 'no',
    },
  });
}

/* -------------------------------------------------------------------------
   The stage, and reading her answer. Her output is checked, not trusted.
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
