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
 *   - the record fields with their source tags — what it does, its type, its
 *     stage, people served as said (from 27 Sep 2026, never converted), where,
 *     what it is called;
 *   - from 26 Nov 2026 (shape 2, core 0.4.0), no class: `kindTicket`, the kind
 *     facts the visitor gave, in core's own save-ticket shape (`kindTicket`);
 *   - `kind`, the retired word, derived from the type and asked of nobody,
 *     because production's receiver still reads it (item O14, the save-door
 *     patch of 25 Sep 2026);
 *   - the pin as ids, level, label and published area;
 *   - each of the water pathway's criteria, its state in production's three
 *     words, and its way forward where there is one;
 *   - each pack's answers as typed, the pack's own word for where it stands
 *     — complete, incomplete, pending, blocked — and whether the answers are
 *     the pack's worked example;
 *   - only when the visitor ticked the box to send the project to a person,
 *     `wantsHuman` and their note (item A18, the door to a person). Unticked,
 *     neither key is sent, so the seal is the shape production reads today.
 *
 * It never reads a pack's figures, its headline, or a single computed
 * number, and it never sees the conversation. The server refuses a seal that
 * carries any of those (api/_handoff.ts), so the line is drawn twice.
 *
 * NOTHING IS KEPT HERE. The seal leaves; this site holds no copy and no
 * ticket. A reload after the click starts over, as any reload does.
 */

import { factsWithKind } from '@waterbots/core/projectKinds';
import { DRINKING_WATER_TYPE, PROJECT_TYPE_IDS, kindTicket, type KindTicket } from '@waterbots/core/record';
import { HER_PACKS, section, stateOf, type Sheet } from '@waterbots/phoebe';
import { HANDOFF_LANDING } from './site';
import { WATER_METHOD_ID, WATER_METHOD_NAME, type Visit, type WaterEstimate } from './visit';

/**
 * The pack whose rows cross today.
 *
 * Production claims six numbered criteria, which are the water pathway's. The
 * carbon pathway's rows go over with the per-pathway carry on item O14.
 */
const WATER_PACK = 'vwba-2.0';

/**
 * The six numbered criteria, from the tool file rather than from a list here.
 *
 * Their ids are the manual's own numbers, so the seal says "criterion 3" the
 * way the guidebook does. The applies tests are not among them: production
 * claims six criteria, and the pathway's own questions are this site's.
 */
function waterCriteria(): string[] {
  return (section(WATER_PACK)?.rows ?? [])
    .filter((row) => row.card.startsWith('eligibility/'))
    .map((row) => row.id)
    .sort((a, b) => Number(a) - Number(b));
}

/* --------------------------------------------------------------------------
   The seal, as the client builds it. The server's reader (api/_handoff.ts)
   holds the same shape and is the one that decides.
   -------------------------------------------------------------------------- */

export interface SealField {
  value: string;
  source: '' | 'typed' | 'chat' | 'pin';
}

/** The retired word, derived from the type and asked of nobody; api/_handoff.ts says why it still rides. */
function pathwayKind(type: string): '' | 'water' | 'both' | 'neither' {
  if (type === '') return '';
  if (type === DRINKING_WATER_TYPE) return 'both';
  if (type === 'NONE') return 'neither';
  return (PROJECT_TYPE_IDS as readonly string[]).includes(type) ? 'water' : '';
}

export interface SealBody {
  record: {
    does: SealField;
    type: SealField;
    stage: SealField;
    kind: SealField;
    place: SealField;
    name: SealField;
    /** People served, as said — digits and a unit, or both blank. Ruling R4, 27 Sep 2026. */
    served: SealField & { unit: '' | 'people' | 'households' };
  };
  /** The kind facts the visitor gave, as core's save ticket holds them, with the rules' version. */
  kindTicket: KindTicket;
  pin: {
    hybasId: number;
    pfafId: number;
    level: 4 | 6;
    stressLabel: string;
    subAreaKm2: number;
    stressDerived: boolean;
  } | null;
  worksheet: { number: number; state: 'unchecked' | 'met' | 'not-yet'; routeForward?: string }[];
  packs: {
    key: string;
    name: string;
    status: 'complete' | 'incomplete' | 'pending' | 'blocked';
    workedExample: boolean;
    answers: Record<string, string>;
  }[];
  wantsHuman?: true;
  humanNote?: string;
}

/**
 * The door to a person, as the rail holds it: the box and the note.
 *
 * The note is capped where the server caps it (api/_handoff.ts), so the box
 * stops the visitor at the limit rather than the save refusing afterwards.
 */
export interface PersonAsk {
  wanted: boolean;
  note: string;
}

export const NO_PERSON: PersonAsk = { wanted: false, note: '' };
export const MAX_HUMAN_NOTE_CHARS = 280;

/**
 * The visit as a seal.
 *
 * `numbers` are the criteria's own numbers in worksheet order, so the seal
 * says "criterion 3" the way the manual does rather than by position. Only
 * packs with something typed are included; a pack nobody touched has
 * nothing to carry.
 */
/**
 * The five row states, mapped onto the three words production reads.
 *
 * WHY A MAPPING AND NOT THE NEW SHAPE. The seal is a contract with the paid
 * site, and on 25 Sep 2026 a seal that dropped one key it knew arrived there as
 * an empty record (item A16). The per-pathway rows and the readiness read are
 * owed to production as one carry, on item O14, and they go over on the day that
 * carry lands. Until then the water pathway's six criteria cross in the shape
 * production already claims, and the mapping below is lossy but says nothing
 * untrue:
 *
 *   Met        → met
 *   Fixable    → not yet, with her own sentence on what it would take as the
 *                way forward; the route card's id stays on this site, where the
 *                console draws the route with its citation
 *   Unknown    → not yet, with what would find it out as the way forward
 *   Blocked    → not yet, with no way forward, because there is none to give
 *   Not yet checked → unchecked
 *
 * Nothing here invents a route, and nothing calls a blocked row fixable.
 */
function sealState(state: string): 'unchecked' | 'met' | 'not-yet' {
  if (state === 'met') return 'met';
  if (state === 'unchecked') return 'unchecked';
  return 'not-yet';
}

/**
 * VIOLET'S D-3 ANSWERS IN THE SAVE, from 22 Nov 2026 — what the visitor set on
 * her screen, in the same shape the site's own pack sent: one entry, its key
 * kept, each answer a short text, never a figure. People served are not here:
 * they are the record's, and travel there. Her screen computes; nothing here does.
 */
function waterAnswers(water: WaterEstimate): Record<string, string> {
  const { input } = water;
  const answers: Record<string, string> = {};
  const put = (key: string, value: number | string | undefined) => {
    if (value !== undefined && value !== '') answers[key] = String(value);
  };
  put('view', input.view);
  put('option', input.option);
  put('withoutProjectM3PerYear', input.withoutProjectM3PerYear);
  put('accessLevel', input.accessLevel);
  put('meteredM3PerYear', input.meteredM3PerYear);
  put('flowM3PerHour', input.flowM3PerHour);
  put('operatingHoursPerYear', input.operatingHoursPerYear);
  put('litresPerPersonPerDay', input.litresPerPersonPerDay?.value);
  put('litresPerPersonPerDaySource', input.litresPerPersonPerDay?.source);
  put('daysOfAccessPerYear', input.daysOfAccessPerYear);
  return answers;
}

export function buildSeal(visit: Visit, sheet: Sheet, person: PersonAsk = NO_PERSON): SealBody {
  const { context, pin } = visit;
  const field = (name: 'does' | 'type' | 'stage' | 'place' | 'name'): SealField => ({
    value: context[name],
    source: context.provenance[name],
  });

  return {
    record: {
      does: field('does'),
      type: field('type'),
      stage: field('stage'),
      /* Derived from the type, never asked. It carries the type's own source
         tag, because the type is the fact it is derived from. Where no type is
         known it is blank, exactly as the type is. */
      kind: { value: pathwayKind(context.type), source: context.provenance.type },
      place: field('place'),
      name: field('name'),
      served: context.served
        ? { value: String(context.served.count), unit: context.served.unit, source: context.provenance.served }
        : { value: '', unit: '', source: '' },
    },
    /* Core's own save ticket, from the facts as the visitor gave them: only what they said, never a blank filled in. */
    kindTicket: kindTicket({ facts: factsWithKind(context.kindFacts) }),
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
    worksheet: waterCriteria().map((id) => {
      const held = stateOf(sheet, WATER_PACK, id);
      /* The way forward is her own sentence, and only where the state carries
         one. A Blocked row has none to give, and inventing one there would be
         the fabrication this whole arrangement exists to prevent. */
      const forward = held.state === 'fixable' || held.state === 'unknown' ? held.because : undefined;
      return {
        number: Number(id),
        state: sealState(held.state),
        ...(forward ? { routeForward: forward } : {}),
      };
    }),
    packs: visit.water
      ? [
          {
            key: WATER_METHOD_ID,
            name: WATER_METHOD_NAME,
            /* A classification, never a figure: whole once her engine has every value it needs. */
            status: visit.water.result.vwbM3PerYear !== null ? 'complete' : 'incomplete',
            workedExample: false,
            answers: waterAnswers(visit.water),
          },
        ]
      : [],
    /* Only a ticked box sends anything. The note is the visitor's own, trimmed
       of blank space at its ends and nothing else; left empty, it is not sent. */
    ...(person.wanted
      ? { wantsHuman: true as const, ...(person.note.trim() ? { humanNote: person.note.trim() } : {}) }
      : {}),
  };
}

/**
 * Each pathway's rows, for the email to the WaterBots team (item A18,
 * 26 Sep 2026). Sent beside the seal only when the box is ticked; the server
 * works the readiness read out from them itself, writes the email, and keeps
 * none of it. It is not part of the seal and production never sees it.
 */
export interface TeamPathway {
  pack: string;
  states: Record<string, string>;
  blocked: Record<string, string>;
  sorts: string[];
}

export function teamRows(sheet: Sheet): TeamPathway[] {
  return HER_PACKS.map((pack) => {
    const rows = sheet.rows[pack] ?? {};
    const states: Record<string, string> = {};
    const blocked: Record<string, string> = {};
    for (const [id, status] of Object.entries(rows)) {
      states[id] = status.state;
      if (status.state === 'blocked' && status.because) blocked[id] = status.because;
    }
    return { pack, states, blocked, sorts: sheet.sorts[pack] ?? [] };
  });
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

export async function sealVisit(
  seal: SealBody,
  forTeam?: TeamPathway[],
  signal?: AbortSignal
): Promise<Ticket> {
  let response: Response;
  try {
    response = await fetch('/api/handoff', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(seal.wantsHuman && forTeam ? { ...seal, forTeam } : seal),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new HandoffError('Saving could not be reached. That is usually the connection. Nothing was kept.');
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new HandoffError('Saving did not work just now. Nothing was kept.');
  }

  const body = (payload ?? {}) as { ticketId?: unknown; expiresAt?: unknown; error?: unknown };
  if (!response.ok) {
    throw new HandoffError(
      typeof body.error === 'string' ? body.error : 'Something went wrong on our side. Nothing was kept.'
    );
  }
  if (typeof body.ticketId !== 'string' || body.ticketId === '') {
    throw new HandoffError('Saving did not work just now. Nothing was kept.');
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
