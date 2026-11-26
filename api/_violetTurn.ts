/**
 * Violet's instructions and the block for one of her turns — 25 Nov 2026. Both are her package's; see _calculatorChat.ts.
 * Her figures are worked out again here, by her own engine, from what her screen holds, so nothing she reads is the
 * browser's word.
 *
 * In its own module with no SDK, so the check script can load it compiled as the platform compiles it.
 */

import type { ProjectFacts } from '@waterbots/core/record';
import { computeD3, guardVioletReply, violetAsks, violetChatContext, type D3Input, type VioletReply } from '@waterbots/violet';
import { AGENT_RULES_MD } from './_agentRules.generated.js';
import { BUILD_STATUS_SHEET_MD } from './_statusSheet.generated.js';
import type { ReplyGuard, TurnParts } from './_calculatorChat.js';
import { FREE_SITE_DOOR } from './_door.js';
import { VIOLET_KNOWLEDGE_MD, VIOLET_PROMPT_MD } from './_violetPrompt.generated.js';

export const VIOLET_SYSTEM_PROMPT = [AGENT_RULES_MD, VIOLET_PROMPT_MD, VIOLET_KNOWLEDGE_MD, BUILD_STATUS_SHEET_MD].map((part) => part.trim()).join('\n\n') + '\n';

const oneLine = (value: unknown, max: number): string => {
  if (typeof value !== 'string') return '';
  const text = value.replace(/\s+/g, ' ').trim();
  return text.length <= max ? text : '';
};
const object = (value: unknown): Record<string, unknown> => (typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : {});

const NUMBERS = ['withoutProjectM3PerYear', 'meteredM3PerYear', 'flowM3PerHour', 'operatingHoursPerYear', 'daysOfAccessPerYear'] as const;

/** What her screen holds, part by part. This site screens before a project runs, so the view is always that one. */
export function readD3Input(value: unknown): D3Input | null {
  const v = object(value);
  const option = (['capacity', 'beneficiaries'] as const).find((o) => o === v.option);
  if (!option) return null;
  const input: Record<string, unknown> = { view: 'ex-ante', option };
  if (v.accessLevel === 'full' || v.accessLevel === 'limited') input.accessLevel = v.accessLevel;
  for (const key of NUMBERS) if (typeof v[key] === 'number' && Number.isFinite(v[key])) input[key] = v[key];
  const pop = object(v.population);
  const population: Record<string, unknown> = {};
  if (pop.mode === 'people' || pop.mode === 'households') population.mode = pop.mode;
  for (const key of ['served', 'householdSize'] as const) if (typeof pop[key] === 'number' && Number.isFinite(pop[key])) population[key] = pop[key];
  if (Object.keys(population).length > 0) input.population = population;
  const litres = object(v.litresPerPersonPerDay);
  const source = oneLine(litres.source, 200);
  if (typeof litres.value === 'number' && Number.isFinite(litres.value) && source) input.litresPerPersonPerDay = { value: litres.value, source };
  return input as unknown as D3Input;
}

export function violetBlock(turn: unknown, parts: TurnParts, facts: ProjectFacts): string | null {
  const t = object(turn);
  const input = readD3Input(t.input);
  if (!input) return null;
  try {
    return violetChatContext({
      place: 'free-site',
      projectName: oneLine(t.projectName, 160),
      input,
      result: computeD3(input),
      refusals: Array.isArray(t.refusals) ? t.refusals.map((r) => oneLine(r, 200)).filter((r) => r !== '').slice(0, 8) : [],
      facts,
      chosen: t.chosen === true,
      opened: parts.opened,
      introduce: parts.introduce,
      leftForNow: parts.leftForNow,
      refused: parts.refused,
      /* This door's facts, and whether the visitor has talked with her before (violet 0.9.0). */
      door: FREE_SITE_DOOR,
      talkedBefore: parts.talkedBefore,
    });
  } catch {
    /* An input her engine cannot take is a request this site never sends. */
    return null;
  }
}

/**
 * THE GUARDS ON HER NUMBERS AND HER FACTS are her package's (`guardVioletReply`, violet 0.9.0): a number the visitor did not
 * give here goes back to her once, then comes out, and the visitor is told; a number they gave out of range has its message.
 * A fact the visitor did not give is dropped quietly and stays blank: a yes or no only counts as the answer to the question
 * her last reply asked (`asked`, its `asking`), and anything else only in the visitor's own words. She is told once, and asks.
 */
export function violetGuard(turn: unknown, leftForNow: readonly string[], facts: ProjectFacts, asked: string | undefined): ReplyGuard<VioletReply> | null {
  const t = object(turn);
  const input = readD3Input(t.input);
  if (!input) return null;
  try {
    const guard = (reply: VioletReply, messages: readonly string[], key: string | undefined) => guardVioletReply(reply, { input, messages, facts, ...(key ? { asked: key } : {}) });
    /* An out-of-range number's message, read before she answers: for the question she asked, or else the one her screen asks next. */
    const next = asked ?? violetAsks(input, t.chosen === true, facts).find((ask) => !leftForNow.includes(ask.key))?.key;
    const empty: VioletReply = { reply: '', handBack: 'none', leftForNow: [], facts: {}, values: {} };
    return { check: (reply, messages) => guard(reply, messages, asked), outOfRange: (messages) => guard(empty, messages, next).outOfRange };
  } catch {
    return null;
  }
}
