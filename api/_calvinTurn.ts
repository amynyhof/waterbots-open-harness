/**
 * Calvin's instructions and the block for one of his turns — 25 Nov 2026. Both are his package's; see _calculatorChat.ts.
 *
 * In its own module with no SDK, so the check script can load it compiled as the platform compiles it.
 */

import { calvinAsks, calvinChatContext, guardCalvinReply, type CalvinReply, type CalvinTurn } from '@waterbots/calvin/agent';
import { carbonAnswer, type ProjectFacts } from '@waterbots/core/record';
import { AGENT_RULES_MD } from './_agentRules.generated.js';
import type { ReplyGuard, TurnParts } from './_calculatorChat.js';
import { FREE_SITE_DOOR } from './_door.js';
import { CALVIN_KNOWLEDGE_MD, CALVIN_PROMPT_MD } from './_calvinPrompt.generated.js';
import { BUILD_STATUS_SHEET_MD } from './_statusSheet.generated.js';

export const CALVIN_SYSTEM_PROMPT = [AGENT_RULES_MD, CALVIN_PROMPT_MD, CALVIN_KNOWLEDGE_MD, BUILD_STATUS_SHEET_MD].map((part) => part.trim()).join('\n\n') + '\n';

/** What he sees of his screen is one paragraph; a screen that runs longer is not his. */
const MAX_SCREEN_CHARS = 4000;

const oneLine = (value: unknown, max: number): string => {
  if (typeof value !== 'string') return '';
  const text = value.replace(/\s+/g, ' ').trim();
  return text.length <= max ? text : '';
};

/**
 * His calculator's values, as the screen holds them. Numbers, yes or no, a code, or a short list of those: nothing in it
 * can carry a sentence. Null when it holds anything else.
 */
export function readCalcState(value: unknown): Record<string, unknown> | null {
  const plain = (v: unknown, depth: number): boolean => {
    if (v === null || typeof v === 'boolean') return true;
    if (typeof v === 'number') return Number.isFinite(v);
    if (typeof v === 'string') return v.length <= 60 && /^[\w .,()/+-]*$/.test(v);
    if (depth > 3 || typeof v !== 'object') return false;
    const entries = Array.isArray(v) ? v.map((x, i) => [String(i), x] as const) : Object.entries(v);
    return entries.length <= 80 && entries.every(([key, x]) => /^\w{1,40}$/.test(key) && plain(x, depth + 1));
  };
  return typeof value === 'object' && value !== null && !Array.isArray(value) && plain(value, 0) ? (value as Record<string, unknown>) : null;
}

/** What his method does with the project, under each version in use: core's one table, from the facts (calvin 0.8.0). */
function answers(facts: ProjectFacts): Pick<CalvinTurn, 'answer' | 'answerV1'> {
  return { answer: carbonAnswer(facts, '2026'), ...(facts.creditedUnderV1?.value === true ? { answerV1: carbonAnswer(facts, '2021') } : {}) };
}

export function calvinBlock(turn: unknown, parts: TurnParts, facts: ProjectFacts): string | null {
  if (typeof turn !== 'object' || turn === null) return null;
  const t = turn as Record<string, unknown>;
  const state = readCalcState(t.state);
  const screen = oneLine(t.screen, MAX_SCREEN_CHARS);
  if (!state || screen === '') return null;
  /* Only whether a figure shows, and the country's fNRB with where it comes from, are read from the result. */
  const fnrb = typeof t.fnrb === 'object' && t.fnrb !== null ? (t.fnrb as Record<string, unknown>) : null;
  const label = oneLine(fnrb?.label, 240);
  const result =
    t.figure === true
      ? ({
          fNRB: typeof fnrb?.value === 'number' && Number.isFinite(fnrb.value) ? fnrb.value : null,
          provenance: label && typeof fnrb?.value === 'number' ? [{ field: 'fNRB', label }] : [],
        } as unknown as CalvinTurn['result'])
      : null;
  const notCoveredYet = oneLine(t.notCoveredYet, 120);
  try {
    return calvinChatContext({
      place: 'free-site',
      state: state as unknown as CalvinTurn['state'],
      screen,
      result,
      sliders: t.sliders === true,
      transition: t.transition === true,
      ...(notCoveredYet ? { notCoveredYet } : {}),
      facts,
      ...answers(facts),
      opened: parts.opened,
      introduce: parts.introduce,
      leftForNow: parts.leftForNow,
      refused: parts.refused,
      /* This door's facts, and whether the visitor has talked with him before (calvin 0.9.0). */
      door: FREE_SITE_DOOR,
      talkedBefore: parts.talkedBefore,
    });
  } catch {
    /* A state his package cannot read is a request this site never sends. */
    return null;
  }
}

/**
 * THE GUARDS ON HIS NUMBERS AND HIS FACTS are his package's (`guardCalvinReply`, calvin 0.9.0): a number the visitor did not
 * give here goes back to him once, then comes out, and the visitor is told; a number they gave out of range has its message.
 * A fact the visitor did not give is dropped quietly and stays blank: a yes or no only counts as the answer to the question
 * his last reply asked (`asked`, its `asking`), and anything else only in the visitor's own words. He is told once, and asks.
 */
export function calvinGuard(turn: unknown, leftForNow: readonly string[], facts: ProjectFacts, asked: string | undefined): ReplyGuard<CalvinReply> | null {
  if (typeof turn !== 'object' || turn === null) return null;
  const t = turn as Record<string, unknown>;
  const state = readCalcState(t.state);
  if (!state) return null;
  const calc = state as unknown as CalvinTurn['state'];
  try {
    const guard = (reply: CalvinReply, messages: readonly string[], key: string | undefined) => guardCalvinReply(reply, { state: calc, messages, facts, ...(key ? { asked: key } : {}) });
    /* An out-of-range number's message, read before he answers: for the question he asked, or else the one his screen asks next. */
    const notCoveredYet = oneLine(t.notCoveredYet, 120);
    const next = asked ?? calvinAsks(calc, { transition: t.transition === true, ...(notCoveredYet ? { notCoveredYet } : {}), ...answers(facts) }).find((ask) => !leftForNow.includes(ask.key))?.key;
    return { check: (reply, messages) => guard(reply, messages, asked), outOfRange: (messages) => guard({ reply: '', handBack: 'none', leftForNow: [] }, messages, next).outOfRange };
  } catch {
    return null;
  }
}
