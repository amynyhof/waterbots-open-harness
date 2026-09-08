/**
 * The bridge's client half — building the seal and sending it.
 *
 * ITEM S7, the contract ruled 7 Sep 2026, the sender built 8 Sep 2026 on
 * the maintainer's approved plan. When the visitor clicks "Save this project
 * and sign up", this file turns the visit into a seal, posts it to
 * /api/handoff, and on a ticket coming back moves the page to production's
 * sign-up with only that ticket in the address. The journey on this site
 * ends there, in the same window — the maintainer's ruling of 8 Sep 2026.
 *
 * WHAT CROSSES IS WHAT WAS RULED AND NOTHING ELSE. `buildSeal` is the one
 * place the visit becomes a seal, and it reads only:
 *
 *   - the four record fields with their source tags;
 *   - the pin as ids, level, label and published area;
 *   - each criterion's state and its way forward;
 *   - each pack's answers as typed, the pack's own word for where it stands
 *     — complete, incomplete, pending, blocked — and whether the answers are
 *     the pack's worked example.
 *
 * It never reads a pack's figures, its headline, or a single computed
 * number, and it never sees the conversation. The server refuses a seal that
 * carries any of those (api/_handoff.ts), so the line is drawn twice.
 *
 * NOTHING IS KEPT HERE. The seal leaves; this site holds no copy and no
 * ticket. A reload after the click starts over, as any reload does.
 */

import type { CriterionStatus } from './criteriaState';
import type { MethodPack } from './methodPacks';
import { HANDOFF_LANDING } from './site';
import { isWorkedExample, type Visit } from './visit';

/* --------------------------------------------------------------------------
   The seal, as the client builds it. The server's reader (api/_handoff.ts)
   holds the same shape and is the one that decides.
   -------------------------------------------------------------------------- */

export interface SealField {
  value: string;
  source: '' | 'typed' | 'chat' | 'pin';
}

export interface SealBody {
  record: { does: SealField; kind: SealField; place: SealField; name: SealField };
  pin: {
    hybasId: number;
    pfafId: number;
    level: 4 | 6;
    stressLabel: string;
    subAreaKm2: number;
    stressDerived: boolean;
  } | null;
  worksheet: { number: number; state: CriterionStatus['state']; routeForward?: string }[];
  packs: {
    key: string;
    name: string;
    status: 'complete' | 'incomplete' | 'pending' | 'blocked';
    workedExample: boolean;
    answers: Record<string, string>;
  }[];
}

/**
 * The visit as a seal.
 *
 * `numbers` are the criteria's own numbers in worksheet order, so the seal
 * says "criterion 3" the way the manual does rather than by position. Only
 * packs with something typed are included; a pack nobody touched has
 * nothing to carry.
 */
export function buildSeal(
  visit: Visit,
  statuses: CriterionStatus[],
  numbers: number[],
  packs: MethodPack[]
): SealBody {
  const { context, pin } = visit;
  const field = (name: 'does' | 'kind' | 'place' | 'name'): SealField => ({
    value: context[name],
    source: context.provenance[name],
  });

  return {
    record: { does: field('does'), kind: field('kind'), place: field('place'), name: field('name') },
    pin: pin
      ? {
          hybasId: pin.hybasId,
          pfafId: pin.pfafId,
          level: pin.level,
          stressLabel: pin.stressLabel,
          subAreaKm2: pin.subAreaKm2,
          stressDerived: pin.level === 4,
        }
      : null,
    worksheet: statuses.map((status, i) => ({
      number: numbers[i] ?? i + 1,
      state: status.state,
      ...(status.routeForward !== undefined ? { routeForward: status.routeForward } : {}),
    })),
    packs: packs.flatMap((pack) => {
      const values = visit.packValues[pack.key];
      if (!values) return [];
      const answers: Record<string, string> = {};
      for (const [key, value] of Object.entries(values)) {
        if (typeof value === 'string' && value !== '') answers[key] = value;
      }
      if (Object.keys(answers).length === 0) return [];
      return [
        {
          key: pack.key,
          name: pack.name,
          /* The pack's own word. A classification, never a figure. */
          status: pack.compute(values).kind,
          workedExample: isWorkedExample(pack, values),
          answers,
        },
      ];
    }),
  };
}

/* --------------------------------------------------------------------------
   Sending it.
   -------------------------------------------------------------------------- */

/** Thrown with a message that is already fit to show a reader. */
export class HandoffError extends Error {}

export interface Ticket {
  ticketId: string;
  expiresAt: string;
}

export async function sealVisit(seal: SealBody, signal?: AbortSignal): Promise<Ticket> {
  let response: Response;
  try {
    response = await fetch('/api/handoff', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(seal),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new HandoffError('The save could not be reached. That is usually the connection. Nothing was kept.');
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new HandoffError('The save answered something that could not be read. Nothing was kept.');
  }

  const body = (payload ?? {}) as { ticketId?: unknown; expiresAt?: unknown; error?: unknown };
  if (!response.ok) {
    throw new HandoffError(
      typeof body.error === 'string' ? body.error : 'Something went wrong on our side. Nothing was kept.'
    );
  }
  if (typeof body.ticketId !== 'string' || body.ticketId === '') {
    throw new HandoffError('The save answered without a ticket. Nothing was kept.');
  }
  return { ticketId: body.ticketId, expiresAt: typeof body.expiresAt === 'string' ? body.expiresAt : '' };
}

/** Production's landing, with only the ticket in the address. */
export function handoffAddress(ticketId: string): string {
  return `${HANDOFF_LANDING}?handoff=${encodeURIComponent(ticketId)}`;
}

/* --------------------------------------------------------------------------
   What the row shows while it happens. Every state is named; none is silent.
   -------------------------------------------------------------------------- */

export type SealState =
  | { kind: 'idle' }
  | { kind: 'sealing' }
  | { kind: 'sealed' }
  | { kind: 'failed'; message: string };
