/**
 * One conversation with one agent — the machinery, without the frame.
 *
 * SPLIT OUT OF AgentChat ON 3 Sep 2026 so that the desk could hold a
 * conversation in the centre of the console without a second chat
 * implementation, and LIFTED INTO THE SHELL the same day so that any second
 * frame around Wellington — the hero chat, when its reference arrives — shows
 * ONE thread with the desk. The dock, the desk and any frame after them are
 * frames around one machine: the same turns, the same pending state, the same
 * honest error, the same abort on unmount. Built twice, two chats
 * diverge — and the part that diverges is the part that must not.
 *
 * NO SCRIPTED MESSAGES AND NO FAKE TYPING. What comes back is a real exchange
 * or an honest statement that something failed. A failed turn keeps the
 * question in the transcript so the reader can see what was asked.
 *
 * NO MEMORY. Nothing is stored, here or anywhere else. A reload empties the
 * conversation.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AgentTurn, Ask, Turn } from './evidence';

export interface Conversation {
  turns: Turn[];
  draft: string;
  setDraft: (value: string) => void;
  pending: boolean;
  error: string | null;
  /** Send the draft. Does nothing while a turn is in flight or the draft is blank. */
  send: () => Promise<void>;
  /**
   * Send a given text — a frame that already holds the visitor's words hands
   * them over this way, so nothing is retyped. Same rules as `send`.
   */
  sendText: (text: string) => Promise<void>;
}

export function useConversation(ask: Ask, hostName: string): Conversation {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inFlight = useRef<AbortController | null>(null);
  useEffect(() => () => inFlight.current?.abort(), []);

  const sendText = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || pending) return;

      const history: Turn[] = [...turns, { role: 'user', text: question }];
      setTurns(history);
      setDraft('');
      setError(null);
      setPending(true);

      const controller = new AbortController();
      inFlight.current = controller;

      try {
        const answer: AgentTurn = await ask(
          history.map((turn) => ({ role: turn.role, text: turn.text })),
          controller.signal
        );
        setTurns([...history, answer]);
      } catch (failure) {
        if (failure instanceof DOMException && failure.name === 'AbortError') return;
        /* An adapter throws only messages already fit for a reader. Anything
           else gets a plain one rather than a stack trace or a silence. */
        setError(
          failure instanceof Error && failure.message
            ? failure.message
            : `Something went wrong reaching ${hostName}. Nothing has been recorded.`
        );
      } finally {
        setPending(false);
        inFlight.current = null;
      }
    },
    [ask, pending, turns, hostName]
  );

  const send = useCallback(() => sendText(draft), [sendText, draft]);

  return { turns, draft, setDraft, pending, error, send, sendText };
}
