/**
 * Violet's relay — 25 Nov 2026. Her chat runs on what her package ships; everything the two calculator chats share is in
 * _calculatorChat.ts, and what is hers alone is in _violetTurn.ts.
 *
 * NAMED METHOD EXPORTS, NOT A DEFAULT EXPORT — load-bearing; scripts/check-api-exports.mjs fails the build otherwise.
 */

import { readVioletAnswer, VIOLET_ANSWER_SCHEMA, VIOLET_CHAT, VIOLET_OPENED, violetToolsFor } from '@waterbots/violet';
import { answerCalculatorChat, problem } from './_calculatorChat.js';
import { VIOLET } from './_cap.js';
import { violetBlock, violetGuard, VIOLET_SYSTEM_PROMPT } from './_violetTurn.js';

/** Most of the budget is spent before the first visible word. Stated, like the others'. */
export const maxDuration = 60;

export async function GET(): Promise<Response> {
  return problem(405, 'This endpoint takes POST requests only.');
}

export async function POST(req: Request): Promise<Response> {
  return answerCalculatorChat(req, {
    name: 'Violet',
    cap: VIOLET,
    settings: VIOLET_CHAT,
    system: VIOLET_SYSTEM_PROMPT,
    openedTurn: VIOLET_OPENED,
    schema: VIOLET_ANSWER_SCHEMA,
    /* The record decides her tool, never the model (violet 0.8.0). */
    tools: violetToolsFor,
    block: violetBlock,
    guard: violetGuard,
    read: readVioletAnswer,
  });
}
