/**
 * Talking to Bridget — item A22, 31 Oct 2026.
 *
 * The browser never holds an API key and never reaches Anthropic directly.
 * Everything goes through /api/bridget, which is the only place the key exists.
 *
 * WHAT SHE IS SENT is what she needs for her one job and nothing else: the
 * place the visitor told Wellington, in their words; whether they are on a
 * phone, so she says tap rather than click; the pinned basin as the map
 * read it; and whether the right rail offers Quantify, so she says Calvin is
 * next or hands back to Wellington (the maintainer's ruling of 31 Oct 2026). The relay checks every part again (api/_bridgetPin.ts).
 */

import type { MapPin } from './visit';

/** The hand-back, the same closed list as Phoebe's (api/_handBack.ts). An unknown value is "none". */
export type HandBack = 'none' | 'wellington';

const HAND_BACKS: readonly HandBack[] = ['none', 'wellington'];

export interface BridgetAnswer {
  reply: string;
  handBack: HandBack;
  abstained: boolean;
}

/** Thrown with a message that is already fit to show a reader. */
export class BridgetError extends Error {}

export async function askBridget(
  history: { role: 'user' | 'assistant'; content: string }[],
  visit: { place: string; phone: boolean; pin: MapPin | null; quantifyNext: boolean },
  signal?: AbortSignal,
  opts?: { opened?: boolean; pinned?: boolean }
): Promise<BridgetAnswer> {
  const body: Record<string, unknown> = { messages: history, phone: visit.phone, quantifyNext: visit.quantifyNext };
  if (visit.place.trim()) body.place = visit.place.trim();
  if (visit.pin) {
    body.pin = {
      hybasId: visit.pin.hybasId,
      level: visit.pin.level,
      subAreaKm2: visit.pin.subAreaKm2,
      stressLabel: visit.pin.stressLabel,
    };
  }
  if (opts?.opened) body.opened = true;
  if (opts?.pinned) body.pinned = true;

  let response: Response;
  try {
    response = await fetch('/api/bridget', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new BridgetError('Bridget could not be reached. That is usually the connection rather than her. The map still works.');
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new BridgetError(
      response.ok
        ? 'Bridget answered in a shape this console could not read.'
        : `Bridget is unavailable right now (error ${response.status}). The map still works.`
    );
  }

  const data = payload as Record<string, unknown>;
  if (!response.ok) {
    throw new BridgetError(
      typeof data.error === 'string' ? data.error : `Bridget is unavailable right now (error ${response.status}).`
    );
  }
  if (typeof data.reply !== 'string') {
    throw new BridgetError('Bridget answered in a shape this console could not read.');
  }

  return {
    reply: data.reply,
    handBack: HAND_BACKS.find((h) => h === data.handBack) ?? 'none',
    abstained: data.abstained === true,
  };
}
