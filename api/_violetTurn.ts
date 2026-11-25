/**
 * Violet's instructions and the block for one of her turns — 25 Nov 2026. Both are her package's; see _calculatorChat.ts.
 * Her figures are worked out again here, by her own engine, from what her screen holds, so nothing she reads is the
 * browser's word.
 *
 * In its own module with no SDK, so the check script can load it compiled as the platform compiles it.
 */

import { HOME_USES, PROJECT_TYPE_IDS, type ProjectFacts } from '@waterbots/core/record';
import { TECHNOLOGY_CLASSES } from '@waterbots/core/technologyLabels';
import { computeD3, violetChatContext, type D3Input } from '@waterbots/violet';
import { AGENT_RULES_MD } from './_agentRules.generated.js';
import { BUILD_STATUS_SHEET_MD } from './_statusSheet.generated.js';
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

/** The kind of project, from the closed lists. The label is the site's own for it. */
function readKind(value: unknown): ProjectFacts {
  const v = object(value);
  const source = { by: 'site intake' as const, note: 'the project record' };
  const facts: ProjectFacts = {};
  const label = oneLine(v.technology, 120);
  const code = v.code === 'CWS' || v.code === 'HWT' ? v.code : undefined;
  if (label) facts.technology = { label, ...(code ? { code } : {}), source };
  const type = PROJECT_TYPE_IDS.find((id) => id === v.type);
  if (type) facts.type = { value: type, source };
  const technologyClass = TECHNOLOGY_CLASSES.find((id) => id === v.technologyClass);
  if (technologyClass) facts.technologyClass = { value: technologyClass, source };
  const homeUse = HOME_USES.find((h) => h === v.homeUse);
  if (homeUse) facts.homeUse = { value: homeUse, source };
  return facts;
}

export function violetBlock(
  turn: unknown,
  parts: { opened: boolean; introduce: boolean; leftForNow: string[]; refused: string[] }
): string | null {
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
      facts: readKind(t.facts),
      chosen: t.chosen === true,
      opened: parts.opened,
      introduce: parts.introduce,
      leftForNow: parts.leftForNow,
      refused: parts.refused,
    });
  } catch {
    /* An input her engine cannot take is a request this site never sends. */
    return null;
  }
}
