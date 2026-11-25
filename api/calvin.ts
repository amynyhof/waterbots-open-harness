/**
 * Calvin's relay — 25 Nov 2026. His chat runs on what his package ships; everything the two calculator chats share is in
 * _calculatorChat.ts, and what is his alone is in _calvinTurn.ts.
 *
 * NAMED METHOD EXPORTS, NOT A DEFAULT EXPORT — load-bearing; scripts/check-api-exports.mjs fails the build otherwise.
 */

import { CALVIN_ANSWER_SCHEMA, CALVIN_CHAT, CALVIN_OPENED, GS4GG_CARBON_TOOLS, readCalvinAnswer } from '@waterbots/calvin/agent';
import { answerCalculatorChat, problem, readKindLines } from './_calculatorChat.js';
import { calvinBlock, calvinGuard, CALVIN_SYSTEM_PROMPT } from './_calvinTurn.js';
import { CALVIN } from './_cap.js';

/** Most of the budget is spent before the first visible word. Stated, like the others'. */
export const maxDuration = 60;

export async function GET(): Promise<Response> {
  return problem(405, 'This endpoint takes POST requests only.');
}

export async function POST(req: Request): Promise<Response> {
  return answerCalculatorChat(req, {
    name: 'Calvin',
    cap: CALVIN,
    settings: CALVIN_CHAT,
    system: CALVIN_SYSTEM_PROMPT,
    openedTurn: CALVIN_OPENED,
    schema: CALVIN_ANSWER_SCHEMA,
    tools: GS4GG_CARBON_TOOLS,
    block: calvinBlock,
    guard: (turn, leftForNow) => calvinGuard(turn, leftForNow, readKindLines(turn)),
    read: readCalvinAnswer,
  });
}
