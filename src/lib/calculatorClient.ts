/**
 * Talking to Calvin and Violet — 25 Nov 2026, the shared console behaviours, item 9.
 *
 * The browser never holds an API key and never reaches Anthropic directly. Everything goes through /api/calvin and
 * /api/violet, which are the only places the key exists.
 *
 * WHAT GOES WITH A TURN is what the agent's package reads: the screen's state as it stands, the asks the visitor left for
 * now, and the messages for numbers refused since the last turn. The relay writes the package's block from it. What comes
 * back is the package's answer, read by the package's own reader there; the numbers in it are checked again by its screen
 * (`fill`) and by the record.
 */

import type { GivenFacts } from '@waterbots/core/record';
import type { HandBack } from '@waterbots/core/reply';

export interface CalculatorAnswer {
  reply: string;
  handBack: HandBack;
  leftForNow: string[];
  facts: GivenFacts;
  /** The package's own shape; its screen's `fill` checks every value. */
  values: Record<string, unknown>;
}

/** Thrown with a message that is already fit to show a reader. */
export class CalculatorError extends Error {}

const object = (value: unknown): Record<string, unknown> => (typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : {});

export async function askCalculator(
  name: 'Calvin' | 'Violet',
  history: { role: 'user' | 'assistant'; content: string }[],
  turn: Record<string, unknown>,
  opts: { opened: boolean; introduced: boolean; leftForNow: readonly string[]; refused: readonly string[] },
  signal?: AbortSignal
): Promise<CalculatorAnswer> {
  const body: Record<string, unknown> = { messages: history, door: 'free-site', turn };
  if (opts.opened) body.opened = true;
  if (opts.introduced) body.introduced = true;
  if (opts.leftForNow.length) body.leftForNow = opts.leftForNow;
  if (opts.refused.length) body.refused = opts.refused;

  let response: Response;
  try {
    response = await fetch(`/api/${name.toLowerCase()}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new CalculatorError(`${name} could not be reached. That is usually the connection. The calculator still works.`);
  }
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new CalculatorError(response.ok ? `${name} answered in a shape this console could not read.` : `${name} is unavailable right now (error ${response.status}). The calculator still works.`);
  }
  const data = object(payload);
  if (!response.ok) throw new CalculatorError(typeof data.error === 'string' ? data.error : `${name} is unavailable right now (error ${response.status}).`);
  if (typeof data.reply !== 'string') throw new CalculatorError(`${name} answered in a shape this console could not read.`);
  return {
    reply: data.reply,
    handBack: data.handBack === 'wellington' ? 'wellington' : 'none',
    leftForNow: Array.isArray(data.leftForNow) ? data.leftForNow.filter((k): k is string => typeof k === 'string') : [],
    facts: object(data.facts) as GivenFacts,
    values: object(data.values),
  };
}
