/**
 * The relay Calvin's and Violet's chats share — 25 Nov 2026, the shared console behaviours, item 9.
 *
 * On Phoebe's, Wellington's and Bridget's proven pattern: the same guards, every setting stated. The key is read here, on
 * the server. It is never sent to the browser, never written into the bundle, and never committed.
 *
 * THEIR INSTRUCTIONS ARE THEIR PACKAGES'. The system prompt is core's agent rules, the agent's own prompt and notes as
 * the package ships them, and the one build status sheet (agent rule 16). After the breakpoint comes one block for the
 * turn, written by the package (calvinChatContext, violetChatContext): where the agent is, what the record holds, the
 * one thing to ask now, the values it does not ask for, and what is on its screen. This site writes no instructions of
 * its own for either. The model, the effort and the length are the package's settings too.
 *
 * THEIR TOOLS RUN HERE, the package's own, so a "what if" is the engine's answer and never the model's sum. At most
 * three rounds, then the model has to answer.
 *
 * THIRTY MESSAGES A DAY, per visitor, under each agent's own key (_cap.ts). A message is counted only when an answer is
 * actually delivered.
 *
 * WHAT COMES FROM THE BROWSER IS CHECKED. The screen's state lives there, so it crosses; every number and code in it is
 * read against its kind, and every string is one short line, so nothing in it can stand as a heading or an instruction.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { AgentTool } from '@waterbots/core/agent';
import type { ChatSettings } from '@waterbots/core/chat';
import { fromWire, toWire } from './_answerShape.js';
import { countOneMessage, timeUntilReset, type CapAgent } from './_cap.js';
import { readDoor } from './_door.js';
import { FINISH_NOTE, leavesWaiting } from './_lookUp.js';
import { MIN_REPLY_CHARS, READING_GRADE, isDegenerateReply, isHardReply, isLongReply, readingGrade, replyLength } from './_reply.js';

/** How long the relay waits for the model before giving up. Phoebe's 120 seconds, same reasoning. */
const CALL_TIMEOUT_MS = 120_000;
/** A 400 that arrives after this long is a failure during generation, not a malformed request. One retry. */
const LATE_400_MS = 5_000;
/** A conversation this long has left the calculator behind. */
const MAX_TURNS = 40;
/** Long enough for a real message, short enough to refuse an essay. */
const MAX_MESSAGE_CHARS = 4000;
/** Rounds of tool calls before the model has to answer. */
const MAX_TOOL_ROUNDS = 3;

/** What one turn carries beside its messages, as the browser sends it, checked. */
export interface TurnParts {
  opened: boolean;
  /** Wellington's line is not above this chat, so the agent says who they are (agent rule 17). */
  introduce: boolean;
  leftForNow: string[];
  refused: string[];
}

export interface CalculatorAgent<Reply extends { reply: string; handBack: string }> {
  name: 'Calvin' | 'Violet';
  /** What the calculator is called when the agent cannot answer. */
  cap: CapAgent;
  settings: ChatSettings;
  system: string;
  openedTurn: string;
  schema: Record<string, unknown>;
  tools: readonly AgentTool[];
  /** The package's block for this turn, or null when what came cannot be read. */
  block: (turn: unknown, parts: TurnParts) => string | null;
  read: (raw: unknown) => Reply | null;
}

function pick(value: unknown, key: string): unknown {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>)[key] : undefined;
}

/** One short line, or '' when it is not one. A line too long is left out whole, never cut. */
export function line(value: unknown, max = 200): string {
  if (typeof value !== 'string') return '';
  const text = value.replace(/\s+/g, ' ').trim();
  return text.length <= max ? text : '';
}

/** Up to `most` short lines. */
export function lines(value: unknown, most = 8, max = 200): string[] {
  return Array.isArray(value) ? value.map((v) => line(v, max)).filter((v) => v !== '').slice(0, most) : [];
}

/** A tool's name as the model service takes it: the part of its id after the last dot, which the prompts use. */
export function toolName(id: string): string {
  return id.slice(id.lastIndexOf('.') + 1);
}

export async function answerCalculatorChat<Reply extends { reply: string; handBack: string }>(req: Request, agent: CalculatorAgent<Reply>): Promise<Response> {
  const { name } = agent;
  const log = name.toLowerCase();
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (typeof parsed !== 'object' || parsed === null) return problem(400, 'That request could not be read.');
    body = parsed as Record<string, unknown>;
  } catch {
    return problem(400, 'That request could not be read.');
  }
  /* The console is the one place this chat is served. */
  if (readDoor(body.door) !== 'free-site') return problem(400, 'That request could not be read.');

  /* Exactly `true` counts; anything else is a typed turn. */
  const opened = body.opened === true;
  const messages = Array.isArray(body.messages) ? (body.messages as unknown[]) : null;
  if (!messages || (messages.length === 0 && !opened)) return problem(400, 'No message was sent.');
  if (messages.length > MAX_TURNS) {
    return problem(400, `This conversation has grown long enough that ${name} has lost the thread. Reload the page to start fresh. Nothing is kept between visits in any case.`);
  }
  const clean: Anthropic.MessageParam[] = [];
  for (const m of messages) {
    const role = pick(m, 'role');
    const content = pick(m, 'content');
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return problem(400, 'That request could not be read.');
    if (content.trim() === '') continue;
    if (content.length > MAX_MESSAGE_CHARS) {
      return problem(400, `That message is longer than ${name} can take in at once — the limit is ${MAX_MESSAGE_CHARS.toLocaleString()} characters. Try the most important part first.`);
    }
    clean.push({ role, content });
  }
  /* The first answer follows the turn the console sent, which is never kept as a bubble, so the thread opens on it again. */
  if (clean.length === 0 ? opened : clean[0].role === 'assistant') clean.unshift({ role: 'user', content: agent.openedTurn });
  if (clean.length === 0 || clean[clean.length - 1].role !== 'user') return problem(400, 'No message was sent.');

  const block = agent.block(body.turn, {
    opened: opened && clean.length === 1,
    introduce: opened && body.introduced !== true,
    leftForNow: lines(body.leftForNow, 20, 60),
    refused: lines(body.refused),
  });
  if (block === null) return problem(400, 'That request could not be read.');

  /* Shape first, then whether we can actually answer: the same order as the others. */
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error(`${log}: ANTHROPIC_API_KEY is not set in this environment`);
    return problem(503, `${name} is not connected in this environment. The API key has not been configured, so there is no answer. The calculator still works. This is a configuration problem on our side, not something you did.`);
  }

  /* The cap, counted at the last moment before the model, under this agent's own name. */
  const decision = await countOneMessage(req, new Date(), agent.cap);
  if (decision.kind === 'misconfigured') {
    console.error(`${log}: ${decision.missing} is not configured, so the daily cap cannot be enforced. Refusing to answer without it.`);
    return problem(503, `${name} is not answering right now. The daily limit that keeps this free and open to everyone is not running in this environment, and ${name} does not answer without it. The calculator still works. This is a configuration problem on our side, not something you did.`);
  }
  if (decision.kind === 'refused') {
    return problem(
      429,
      `You have reached today's limit of ${decision.cap} messages to ${name}. The chat is free and open to anyone, and the daily limit is what keeps it that way. The calculator still works, and your count resets at midnight UTC, ${timeUntilReset(decision.secondsToReset)}. Nothing you have said here is kept between visits in any case.`,
      { 'retry-after': String(decision.secondsToReset) }
    );
  }
  if (decision.kind === 'uncounted') console.error(`${log}: this message was not counted against any cap — ${decision.why}`);
  const undelivered = async (response: Response): Promise<Response> => {
    if (decision.kind === 'allowed') await decision.refund();
    return response;
  };

  const client = new Anthropic({ apiKey });
  const tools: Anthropic.Tool[] = agent.tools.map((tool) => ({
    name: toolName(tool.id),
    description: tool.description,
    input_schema: tool.inputSchema as Anthropic.Tool.InputSchema,
  }));
  const schema = toWire(agent.schema);
  const thread: Anthropic.MessageParam[] = [...clean];
  const calledAt = Date.now();
  let rounds = 0;
  let pass = 1;

  const callModel = (): Promise<Anthropic.Message> =>
    client.messages.create(
      {
        model: agent.settings.model,
        max_tokens: agent.settings.maxOutputTokens,
        system: [
          { type: 'text', text: agent.system, cache_control: { type: 'ephemeral' } },
          { type: 'text', text: block },
          /* The same question again: this one has to end in an answer (api/_lookUp.ts). */
          ...(pass > 1 ? [{ type: 'text' as const, text: FINISH_NOTE }] : []),
        ],
        messages: thread,
        tools,
        tool_choice: { type: rounds >= MAX_TOOL_ROUNDS ? 'none' : 'auto' },
        thinking: { type: 'adaptive' },
        output_config: { effort: agent.settings.effort, format: { type: 'json_schema', schema } },
      },
      { timeout: CALL_TIMEOUT_MS }
    );

  let response: Anthropic.Message;
  let answer: Reply;
  for (;;) {
    try {
      try {
        response = await callModel();
      } catch (first) {
        const elapsed = Date.now() - calledAt;
        if (!(pick(first, 'status') === 400 && elapsed > LATE_400_MS)) throw first;
        console.error(`${log}: a 400 arrived after ${(elapsed / 1000).toFixed(1)}s, which is too late to be a malformed request — retrying once`);
        response = await callModel();
      }
    } catch (error) {
      return undelivered(fromApiError(error, name, log));
    }

    if (response.stop_reason === 'refusal') return undelivered(problem(502, `${name} stopped part-way through that one and did not finish. Try rephrasing.`));
    if (response.stop_reason === 'max_tokens') {
      console.error(`${log}: answer hit the output budget and was cut off — ${response.usage.output_tokens} of ${agent.settings.maxOutputTokens} output tokens`);
      return undelivered(problem(502, `${name} ran out of room part-way through that answer, so it was cut off before it was finished. This is a limit on our side, not something you did — asking again usually gets through.`));
    }

    /* THE ENGINE ANSWERS, NEVER THE MODEL. Each call runs the package's own tool; a refusal goes back as its own words. */
    const calls = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use');
    if (response.stop_reason === 'tool_use' && calls.length > 0) {
      rounds += 1;
      thread.push({ role: 'assistant', content: response.content });
      thread.push({ role: 'user', content: await Promise.all(calls.map((call) => runTool(agent.tools, call))) });
      continue;
    }

    const text = response.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('');
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error(`${log}: reply was not the JSON shape requested — ${response.usage.output_tokens} of ${agent.settings.maxOutputTokens} output tokens`);
      return undelivered(problem(502, `${name} answered in a shape this console could not read. Try asking again.`));
    }
    const read = agent.read(fromWire(parsed));
    if (!read) {
      console.error(`${log}: returned an empty answer — ${response.usage.output_tokens} of ${agent.settings.maxOutputTokens} output tokens`);
      return undelivered(problem(502, `${name} returned an empty answer and did not say anything at all. This is a fault on our side rather than something you did, and asking again usually works.`));
    }
    if (isDegenerateReply(read.reply)) {
      console.error(`${log}: returned an answer too short to be one — ${read.reply.trim().length} characters against a floor of ${MIN_REPLY_CHARS}`);
      return undelivered(problem(502, `${name} returned an answer with almost nothing in it. This is a fault on our side rather than something you did, and asking again usually works.`));
    }
    answer = read;
    /* ONE ANSWER, IN THE SAME TURN (24 Nov 2026, item 4). Wellington joins on a hand-back, so nobody waits there. */
    if (answer.handBack === 'wellington' || !leavesWaiting(answer.reply)) break;
    console.log(`${log}: the reply promised a look-up and did not answer, call ${pass}`);
    if (pass > 1) {
      return undelivered(problem(502, `${name} went to look something up and did not come back with an answer. This is a fault on our side rather than something you did, and asking again usually works.`));
    }
    pass += 1;
  }

  /* Length and reading level are logged, never blocked (agent rules 1 and 2), as for the others. */
  if (isLongReply(answer.reply, agent.settings.reply)) {
    const { sentences, chars } = replyLength(answer.reply);
    console.log(`${log}: reply ran long — ${sentences} sentences, ${chars} characters`);
  }
  if (isHardReply(answer.reply)) console.log(`${log}: reply read above grade ${READING_GRADE.average} — grade ${readingGrade(answer.reply)}`);

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

async function runTool(tools: readonly AgentTool[], call: Anthropic.ToolUseBlock): Promise<Anthropic.ToolResultBlockParam> {
  const tool = tools.find((t) => toolName(t.id) === call.name);
  try {
    if (!tool) throw new Error(`There is no tool called ${call.name}.`);
    const { output, sources } = await tool.execute(call.input);
    return { type: 'tool_result', tool_use_id: call.id, content: JSON.stringify({ output, sources }) };
  } catch (error) {
    return { type: 'tool_result', tool_use_id: call.id, is_error: true, content: error instanceof Error ? error.message : String(error) };
  }
}

function json(status: number, payload: unknown, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(payload), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers } });
}

export function problem(status: number, message: string, headers?: Record<string, string>): Response {
  return json(status, { error: message }, headers);
}

function fromApiError(error: unknown, name: string, log: string): Response {
  const status = pick(error, 'status');
  if (status === 429) return problem(503, `${name} is busy right now — the service behind this chat is rate limited. Try again in a moment. The calculator still works.`);
  if (status === 401 || status === 403) {
    console.error(`${log}: the API key was refused`);
    return problem(503, `${name} is not connected in this environment — the API key was refused. This is a configuration problem on our side.`);
  }
  if (typeof status === 'number' && status >= 500) return problem(503, `The service behind ${name} is having trouble right now. Try again in a moment. The calculator still works.`);
  if (pick(error, 'name') === 'APIConnectionTimeoutError' || pick(error, 'name') === 'AbortError') return problem(504, `${name} took too long to answer and the request was stopped. Try again.`);
  console.error(`${log}: unexpected API error —`, String(pick(error, 'message') ?? error).slice(0, 400));
  return problem(502, `${name} could not answer that one. This is a fault on our side rather than something you did — asking again usually works.`);
}
