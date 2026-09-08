/**
 * The seal — what crosses the bridge to the paid site, and nothing else.
 *
 * THE BRIDGE IS ITEM S7, and its contract was ruled on 7 Sep 2026 from
 * production's proposal, carried by the maintainer's hand. When a visitor
 * clicks "Save this project and sign up", the visit in front of them is
 * sealed under a random ticket for one hour, the visitor goes to production's
 * sign-up with only the ticket in the address, and production claims the seal
 * once, server to server, behind a shared key. This file is the shape of that
 * seal and the check that refuses anything else.
 *
 * WHAT THE SEAL HOLDS, as ruled:
 *
 *   - the four record fields — what it does, what kind, where it is, what it
 *     is called — each with its source tag: typed, told Wellington, or from
 *     the pin;
 *   - the basin pin as ids: the HydroSHEDS and Pfafstetter ids, the level,
 *     the stress label, the published area;
 *   - Phoebe's worksheet: each criterion's state and its way forward;
 *   - each calculator pack's answers, with the pack's own word for where it
 *     stands — complete, incomplete, pending or blocked (the maintainer's
 *     ruling of 8 Sep 2026: the pack's own word, a label and never a figure)
 *     — and flagged worked-example where that is what they are;
 *   - a sealed-at timestamp, written here on the server.
 *
 * NEVER A COMPUTED NUMBER. NEVER THE CONVERSATION'S TURNS. That line is not
 * only drawn in the client that builds the seal; it is enforced here, where
 * the seal is read. Every object is checked against the keys it may carry and
 * A KEY THAT IS NOT ON THE LIST REFUSES THE WHOLE SEAL. A body carrying
 * `messages`, `figures` or `headline` is not trimmed to fit; it is turned
 * away, so that the only way across is the way that was ruled.
 *
 * STRINGS ARE THE VISITOR'S OWN AND ARE CAPPED WHERE THE DESK CAPS THEM.
 * A field over its cap refuses the seal rather than being cut, for the same
 * reason the record relay drops one whole: a cut sentence is not the
 * visitor's sentence. The pin's numbers are the dataset's published ids and
 * area, which are not computed here and are the one place a number is a
 * fact rather than a result.
 *
 * Two things production should know, recorded in item S7 and repeated here
 * because this is the file they read: a pack's status is a classification
 * the pack makes and not a number, and a Level 4 pin's stress label is
 * derived from its Level 6 basins, which `stressDerived` says outright.
 */

import { randomBytes } from 'node:crypto';

/** The name of this shape, so production can tell a seal from anything else. */
export const SEAL_SHAPE = 'waterbots-open-harness/handoff/1';

/** One hour, as ruled. After this the store forgets the seal on its own. */
export const TICKET_TTL_SECONDS = 60 * 60;

/**
 * The most a seal may weigh on the wire. Four short fields, one pin, six
 * criteria and three packs of short answers come to well under two
 * kilobytes; sixteen leaves room for long ways forward and refuses a body
 * that is something else.
 */
export const MAX_SEAL_BYTES = 16 * 1024;

/* The desk's own caps. "What it does" is capped at 280 on the desk; the rail's
   name and place inputs at 160. A way forward is Phoebe's sentence or two. */
const MAX_DOES_CHARS = 280;
const MAX_NAME_CHARS = 160;
const MAX_PLACE_CHARS = 160;
const MAX_LABEL_CHARS = 80;
const MAX_ROUTE_CHARS = 600;
const MAX_ANSWER_CHARS = 200;
const MAX_CRITERIA = 12;
const MAX_PACKS = 10;
const MAX_ANSWERS_PER_PACK = 40;

export type SealSource = '' | 'typed' | 'chat' | 'pin';
export type SealKind = '' | 'water' | 'carbon' | 'unsure';
export type SealCriterionState = 'unchecked' | 'met' | 'not-yet';
export type SealPackStatus = 'complete' | 'incomplete' | 'pending' | 'blocked';

const SOURCES: readonly SealSource[] = ['', 'typed', 'chat', 'pin'];
const KINDS: readonly SealKind[] = ['', 'water', 'carbon', 'unsure'];
const STATES: readonly SealCriterionState[] = ['unchecked', 'met', 'not-yet'];
const STATUSES: readonly SealPackStatus[] = ['complete', 'incomplete', 'pending', 'blocked'];

export interface SealField {
  value: string;
  source: SealSource;
}

export interface SealRecord {
  does: SealField;
  kind: SealField & { value: SealKind };
  place: SealField;
  name: SealField;
}

export interface SealPin {
  hybasId: number;
  pfafId: number;
  level: 4 | 6;
  stressLabel: string;
  subAreaKm2: number;
  /** True at Level 4, where the label is an area-weighted reading of Level 6. */
  stressDerived: boolean;
}

export interface SealCriterion {
  number: number;
  state: SealCriterionState;
  routeForward?: string;
}

export interface SealPack {
  key: string;
  name: string;
  status: SealPackStatus;
  workedExample: boolean;
  answers: Record<string, string>;
}

/** What the client sends. The server adds the shape name and the timestamp. */
export interface SealBody {
  record: SealRecord;
  pin: SealPin | null;
  worksheet: SealCriterion[];
  packs: SealPack[];
}

/** What is stored, and what production receives. */
export interface Seal extends SealBody {
  shape: typeof SEAL_SHAPE;
  sealedAt: string;
}

/** A refusal names the field, so the client's message can too. */
export type SealReading = { seal: SealBody } | { problem: string };

/* --------------------------------------------------------------------------
   Reading a seal off a request body.
   -------------------------------------------------------------------------- */

class Refused extends Error {}

function refuse(message: string): never {
  throw new Refused(message);
}

function object(value: unknown, where: string, allowed: readonly string[]): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    refuse(`${where} is not an object`);
  }
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key)) refuse(`${where} carries "${key}", which is not part of a seal`);
  }
  return record;
}

function text(value: unknown, where: string, max: number): string {
  if (typeof value !== 'string') refuse(`${where} is not text`);
  if (value.length > max) refuse(`${where} is longer than ${max} characters`);
  return value;
}

function oneOf<T extends string>(value: unknown, where: string, allowed: readonly T[]): T {
  if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value)) {
    refuse(`${where} is not one of ${allowed.map((a) => `"${a}"`).join(', ')}`);
  }
  return value as T;
}

function wholeNumber(value: unknown, where: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    refuse(`${where} is not a whole number`);
  }
  return value;
}

function finite(value: unknown, where: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    refuse(`${where} is not a number`);
  }
  return value;
}

function field(value: unknown, where: string, max: number): SealField {
  const v = object(value, where, ['value', 'source']);
  return {
    value: text(v.value, `${where}.value`, max),
    source: oneOf(v.source, `${where}.source`, SOURCES),
  };
}

function readRecord(value: unknown): SealRecord {
  const v = object(value, 'record', ['does', 'kind', 'place', 'name']);
  const kind = field(v.kind, 'record.kind', MAX_LABEL_CHARS);
  return {
    does: field(v.does, 'record.does', MAX_DOES_CHARS),
    kind: { value: oneOf(kind.value, 'record.kind.value', KINDS), source: kind.source },
    place: field(v.place, 'record.place', MAX_PLACE_CHARS),
    name: field(v.name, 'record.name', MAX_NAME_CHARS),
  };
}

function readPin(value: unknown): SealPin | null {
  if (value === null) return null;
  const v = object(value, 'pin', ['hybasId', 'pfafId', 'level', 'stressLabel', 'subAreaKm2', 'stressDerived']);
  const level = v.level;
  if (level !== 4 && level !== 6) refuse('pin.level is not 4 or 6');
  const derived = v.stressDerived;
  if (typeof derived !== 'boolean') refuse('pin.stressDerived is not true or false');
  if (derived !== (level === 4)) refuse('pin.stressDerived does not match pin.level');
  return {
    hybasId: wholeNumber(v.hybasId, 'pin.hybasId'),
    pfafId: wholeNumber(v.pfafId, 'pin.pfafId'),
    level,
    stressLabel: text(v.stressLabel, 'pin.stressLabel', MAX_LABEL_CHARS),
    subAreaKm2: finite(v.subAreaKm2, 'pin.subAreaKm2'),
    stressDerived: derived,
  };
}

function readWorksheet(value: unknown): SealCriterion[] {
  if (!Array.isArray(value)) refuse('worksheet is not a list');
  if (value.length > MAX_CRITERIA) refuse(`worksheet has more than ${MAX_CRITERIA} criteria`);
  return value.map((entry, i) => {
    const where = `worksheet[${i}]`;
    const v = object(entry, where, ['number', 'state', 'routeForward']);
    const criterion: SealCriterion = {
      number: wholeNumber(v.number, `${where}.number`),
      state: oneOf(v.state, `${where}.state`, STATES),
    };
    if (v.routeForward !== undefined) {
      criterion.routeForward = text(v.routeForward, `${where}.routeForward`, MAX_ROUTE_CHARS);
    }
    return criterion;
  });
}

function readPacks(value: unknown): SealPack[] {
  if (!Array.isArray(value)) refuse('packs is not a list');
  if (value.length > MAX_PACKS) refuse(`packs has more than ${MAX_PACKS} entries`);
  return value.map((entry, i) => {
    const where = `packs[${i}]`;
    const v = object(entry, where, ['key', 'name', 'status', 'workedExample', 'answers']);
    if (typeof v.workedExample !== 'boolean') refuse(`${where}.workedExample is not true or false`);
    if (typeof v.answers !== 'object' || v.answers === null || Array.isArray(v.answers)) {
      refuse(`${where}.answers is not an object`);
    }
    const raw = v.answers as Record<string, unknown>;
    const keys = Object.keys(raw);
    if (keys.length > MAX_ANSWERS_PER_PACK) refuse(`${where}.answers has more than ${MAX_ANSWERS_PER_PACK} fields`);
    const answers: Record<string, string> = {};
    for (const key of keys) {
      text(key, `${where}.answers key`, MAX_LABEL_CHARS);
      answers[key] = text(raw[key], `${where}.answers.${key}`, MAX_ANSWER_CHARS);
    }
    return {
      key: text(v.key, `${where}.key`, MAX_LABEL_CHARS),
      name: text(v.name, `${where}.name`, MAX_LABEL_CHARS),
      status: oneOf(v.status, `${where}.status`, STATUSES),
      workedExample: v.workedExample,
      answers,
    };
  });
}

/**
 * Read a seal off a parsed request body, or say what was wrong with it.
 *
 * Nothing is repaired and nothing is trimmed. The body is the seal exactly,
 * or it is refused with the first problem found.
 */
export function readSeal(value: unknown): SealReading {
  try {
    const v = object(value, 'the seal', ['record', 'pin', 'worksheet', 'packs']);
    if (!('record' in v) || !('pin' in v) || !('worksheet' in v) || !('packs' in v)) {
      refuse('the seal is missing one of record, pin, worksheet, packs');
    }
    return {
      seal: {
        record: readRecord(v.record),
        pin: readPin(v.pin),
        worksheet: readWorksheet(v.worksheet),
        packs: readPacks(v.packs),
      },
    };
  } catch (error) {
    if (error instanceof Refused) return { problem: error.message };
    throw error;
  }
}

/** The seal as stored: the body, its shape name and the moment it was sealed. */
export function sealed(body: SealBody, now: Date): Seal {
  return { shape: SEAL_SHAPE, sealedAt: now.toISOString(), ...body };
}

/* --------------------------------------------------------------------------
   Tickets.
   -------------------------------------------------------------------------- */

/**
 * The ticket's shape, as production accepts it: 16 to 128 characters from
 * A–Z, a–z, 0–9, underscore and hyphen. Ours are 32.
 */
export const TICKET_PATTERN = /^[A-Za-z0-9_-]{16,128}$/;

/**
 * A fresh ticket: 24 random bytes, written in the URL-safe alphabet, which
 * comes to 32 characters and 192 bits. Nobody guesses one.
 */
export function newTicketId(): string {
  return randomBytes(24).toString('base64url');
}

export function isTicketId(value: unknown): value is string {
  return typeof value === 'string' && TICKET_PATTERN.test(value);
}

/** Where a seal lives in the store. */
export function sealKey(ticketId: string): string {
  return `handoff:seal:${ticketId}`;
}
