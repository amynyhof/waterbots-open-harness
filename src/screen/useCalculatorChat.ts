/**
 * Calvin's chat and Violet's, the part they share — 25 Nov 2026, the shared console behaviours, item 9: "Clicking an agent
 * in the crew opens that agent's Chat tab first. The agent is introduced, then asks for the facts its tool needs, one
 * question at a time, and the tool fills in as the visitor answers."
 *
 * HOW A CHAT GOES. The first time the desk shows, Wellington's line heads it and the agent speaks first. Each answer
 * writes its facts to the record and fills the calculator. A number that is refused is never used: its message shows under
 * the agent's reply, whether or not the agent sent it, and the agent is told of it. A number or a kind of project that is
 * not the visitor's own was taken out before it came here (api/_chatGuards.ts), and the line under the reply says so.
 *
 * WHEN THE PART IS DONE: the figure shows, nothing it needs is blank, and it came from the visitor's answers. Opening the
 * chat ends nothing while there is still something to ask. Then Wellington comes, as at every other desk.
 *
 * This hook holds no calculator and writes no words. The seat it is handed knows its own agent's screen.
 */

import { useEffect, useRef, useState } from 'react';
import type { Ask } from '@waterbots/core/chat';
import type { AgentHost, AgentTurn, Turn, TurnButton } from '../chat/evidence';
import { useConversation, type Conversation } from '../chat/useConversation';
import { askCalculator, notTaken, type CalculatorAnswer } from '../lib/calculatorClient';
import { chipsFor, withWayOn } from '../lib/chips';
import type { Surface } from '../lib/surfaces';
import { WELLINGTON } from '../lib/wellington';
import type { ScreenTab } from './AgentScreen';

/** What the agent's own screen gives the chat, read at the moment it is asked. */
export interface CalculatorSeat {
  /** What goes with a turn. `answered` is true once the visitor has answered here, or nothing is left to ask. */
  turn: (answered: boolean) => Record<string, unknown> | null;
  /** Writes an answer's facts and fills the calculator. Resolves once the screen holds it. */
  apply: (answer: CalculatorAnswer) => Promise<{ refused: string[]; filled: boolean }>;
  /** What is still to ask, and whether the figure shows. */
  asks: () => readonly Ask[];
  figure: () => boolean;
}

export interface CalculatorChatOptions {
  host: AgentHost;
  name: 'Calvin' | 'Violet';
  desk: 'quantification' | 'water';
  seat: CalculatorSeat;
  /** True while the desk is the step in view and open. */
  visible: boolean;
  invite: string;
  waiting: boolean;
  /** Bumped each time the visitor opens the agent from the crew. */
  showChat: number;
  onward?: () => TurnButton[];
  onWellington?: (at: Surface, composerId: string) => Promise<AgentTurn | null>;
  /** Wellington has asked something in this chat, so the visitor's next words are for him; and what sends them to him. */
  heAsks?: () => boolean;
  onReplyToHim?: (text: string, at: Surface, composerId: string) => Promise<AgentTurn | null>;
  /** Their part is done. */
  onDone: () => void;
}

/** True when Wellington spoke last here and is waiting for the answer. */
export function answersHim(turns: readonly Turn[], heAsks: (() => boolean) | undefined): boolean {
  const last = [...turns].reverse().find((turn): turn is AgentTurn => turn.role === 'agent');
  return heAsks?.() === true && last?.speaker?.name === WELLINGTON.name;
}

/** His turn in another agent's chat, with the chips that answer him where he has asked something. */
export function hisTurn(turn: AgentTurn, heAsks: (() => boolean) | undefined, send: (text: string) => void): AgentTurn {
  const chips = heAsks?.() === true ? chipsFor({ answers: turn.answers ?? [], send }) : undefined;
  const buttons = withWayOn(chips, turn.buttons);
  return { ...turn, speaker: WELLINGTON, ...(buttons ? { buttons } : {}) };
}

export function useCalculatorChat(o: CalculatorChatOptions): { chat: Conversation; tab: ScreenTab; setTab: (tab: ScreenTab) => void; composerId: string } {
  const composerId = `wb-${o.name.toLowerCase()}-composer`;
  const [tab, setTab] = useState<ScreenTab>('chat');
  /* Read at answer time, never from the render the question was sent in. */
  const now = useRef(o);
  now.current = o;

  const left = useRef<string[]>([]);
  const refused = useRef<string[]>([]);
  const answered = useRef(false);
  const joined = useRef(false);
  const open = () => now.current.seat.asks().filter((ask) => !left.current.includes(ask.key));

  async function wellingtonJoins() {
    const turn = await now.current.onWellington?.(o.desk, composerId);
    if (turn) chatRef.current.append([hisTurn(turn, now.current.heAsks, (text) => void chatRef.current.sendText(text))]);
    else joined.current = false;
  }

  async function ask(
    history: { role: 'user' | 'agent'; text: string }[],
    signal: AbortSignal,
    meta?: { opened?: boolean; introduced?: boolean }
  ): Promise<AgentTurn> {
    const opened = meta?.opened === true;
    const last = history[history.length - 1];
    if (!opened && last?.role === 'user' && answersHim(chatRef.current.turns, now.current.heAsks)) {
      const his = await now.current.onReplyToHim?.(last.text, o.desk, composerId);
      if (his) return hisTurn(his, now.current.heAsks, (text) => void chatRef.current.sendText(text));
    }
    if (!opened) answered.current = true;
    const turn = now.current.seat.turn(answered.current || open().length === 0);
    if (!turn) throw new Error(`${o.name}’s calculator is not ready yet. Try again in a moment.`);
    const answer = await askCalculator(
      o.name,
      history.map(({ role, text }) => ({ role: role === 'agent' ? ('assistant' as const) : ('user' as const), content: text })),
      turn,
      { opened, introduced: opened && meta?.introduced === true, leftForNow: left.current, refused: refused.current },
      signal
    );
    left.current = [...new Set([...left.current, ...answer.leftForNow])];
    const applied = await now.current.seat.apply(answer);
    /* A message the agent has read already is not told twice. */
    const messages = [...new Set([...answer.refused, ...applied.refused])];
    refused.current = applied.refused.filter((message) => !answer.refused.includes(message));
    const under = [...messages, notTaken(answer)].filter((text) => text !== '').join(' ');

    const asks = open();
    const ready = now.current.seat.figure() && !asks.some((a) => a.needed);
    const done = ready && under === '' && (asks.length === 0 || (answered.current && answer.handBack === 'wellington'));
    if (done) now.current.onDone();
    /* He comes when the part is done, whether or not the field was set; and when the agent hands on something not theirs.
       Not while a number was refused or not filled in: the visitor's answer to that comes first. */
    const joins = done ? answer.handBack === 'wellington' || !joined.current : answer.handBack === 'wellington' && !opened && under === '';
    if (joins) {
      if (done) joined.current = true;
      window.setTimeout(() => void wellingtonJoins(), 0);
    }
    const buttons = joins
      ? undefined
      : withWayOn(
          chipsFor({
            answers: [],
            send: (text) => void chatRef.current.sendText(text),
            /* The calculator has something new to see: the visitor is one tap from it. */
            tab: applied.filled || now.current.seat.figure() ? { label: 'Tool', open: () => setTab('tool') } : null,
          }),
          /* Nothing is left to ask, whether or not there is a figure: the way on is here, so the visitor is never left
             with nothing to do (item 8). */
          done || asks.length === 0 || (ready && answer.handBack === 'wellington') ? now.current.onward?.() : undefined
        );
    return {
      role: 'agent',
      text: answer.reply,
      evidence: [],
      /* A number that was refused: what it is and its range, in core's one message. And what was not filled in. */
      ...(under ? { caption: under } : {}),
      ...(buttons ? { buttons } : {}),
    };
  }

  const chat = useConversation(ask, o.name);
  const chatRef = useRef(chat);
  chatRef.current = chat;

  const spoken = useRef(false);
  useEffect(() => {
    if (!o.visible || spoken.current || o.waiting) return;
    spoken.current = true;
    const line = o.invite.trim();
    if (line) chatRef.current.seed([{ role: 'agent', text: line, evidence: [], speaker: WELLINGTON }]);
    void chatRef.current.askOpened({ opened: true, introduced: line !== '' });
  }, [o.visible, o.invite, o.waiting]);

  useEffect(() => {
    if (o.showChat > 0) setTab('chat');
  }, [o.showChat]);

  return { chat, tab, setTab, composerId };
}

/** Gives React time to hold what was just written, so the next read is of the new state. */
export function settled(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, 60));
}
