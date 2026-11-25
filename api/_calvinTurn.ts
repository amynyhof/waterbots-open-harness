/**
 * Calvin's instructions and the block for one of his turns — 25 Nov 2026. Both are his package's; see _calculatorChat.ts.
 *
 * In its own module with no SDK, so the check script can load it compiled as the platform compiles it.
 */

import { calvinChatContext, type CalvinTurn } from '@waterbots/calvin/agent';
import { AGENT_RULES_MD } from './_agentRules.generated.js';
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

export function calvinBlock(
  turn: unknown,
  parts: { opened: boolean; introduce: boolean; leftForNow: string[]; refused: string[] }
): string | null {
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
      opened: parts.opened,
      introduce: parts.introduce,
      leftForNow: parts.leftForNow,
      refused: parts.refused,
    });
  } catch {
    /* A state his package cannot read is a request this site never sends. */
    return null;
  }
}
