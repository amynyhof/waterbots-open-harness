/**
 * Talking to Phoebe.
 *
 * The browser never holds an API key and never reaches Anthropic directly.
 * Everything goes through /api/phoebe, which is the only place the key exists.
 *
 * SHE NAMES CARDS; THIS FILE RENDERS THEM. The relay returns card references —
 * a pack and a name like `eligibility/4` — never citation text. The citation a
 * reader sees is looked up here, from the same committed card files the
 * worksheet reads. A wrong page or an invented link is therefore not something
 * she can produce. If she names a card that does not exist, the reference is
 * dropped.
 *
 * PER-PACK ROWS FROM 25 SEP 2026. Her verdicts used to be six numbers with
 * three states. They are now rows keyed by pack and by the row's own id, with
 * five states, plus each pathway's own test answers and, for a pack that has
 * one, its version flag. Every id and every word is checked against the tool
 * files' generated model, here and again in the relay.
 */

import { cardFor, routeFor } from './phoebeCards';
import type { PathwayUpdate, RowStatus, RowUpdate, Sheet } from './worksheetState';
import {
  PATHWAY_STATE_IDS,
  ROW_STATE_IDS,
  TOOL_SECTIONS,
  section,
  type PathwayStateId,
  type RowStateId,
} from './worksheet.generated';
import type { Evidence } from '../chat/evidence';

/**
 * The hand-back — contract line 8, item A15, step 4, 21 Sep 2026. A field
 * the console acts on, never a sentence read out of her prose: "wellington"
 * when the visitor's way on is back to him, "none" on the ordinary turn. The
 * relay checks it against this same closed list (api/_handBack.ts); it is
 * checked again here, and an unknown value is "none", never a destination.
 */
export type HandBack = 'none' | 'wellington';

const HAND_BACKS: readonly HandBack[] = ['none', 'wellington'];

export interface PhoebeAnswer {
  reply: string;
  /** What the answer rests on, in the shared chat layer's shape. */
  evidence: Evidence[];
  rows: RowUpdate[];
  pathways: PathwayUpdate[];
  /** What a pack's own tests settled about which rows this project has. */
  sorts: { pack: string; value: string }[];
  handBack: HandBack;
  abstained: boolean;
  abstentionTopic?: string;
  /** Which card sets the relay had loaded for this answer, so later asks keep them. */
  loaded?: string[];
  usage?: { cacheRead: number; cacheWrite: number; input: number; output: number };
}

/** Thrown with a message that is already fit to show a reader. */
export class PhoebeError extends Error {}

/**
 * The project record as the desk holds it, carried to Phoebe with every ask —
 * slice 3, 7 Sep 2026. The visitor's own words, never a verdict or a figure.
 * The relay checks it again (api/_record.ts); this side only sends what
 * is there, and sends nothing when nothing is.
 */
export interface CarriedRecord {
  does: string;
  type: string;
  gsClass: string;
  stage: string;
  place: string;
  name: string;
}

export function carriedRecord(context: CarriedRecord): CarriedRecord | null {
  const record = {
    does: context.does.trim(),
    type: context.type,
    gsClass: context.gsClass,
    stage: context.stage,
    place: context.place.trim(),
    name: context.name.trim(),
  };
  return record.does || record.type || record.stage || record.place || record.name ? record : null;
}

/**
 * The worksheet as it travels — contract line 3, item A15, step 3. One entry
 * per pack she works, each with its rows as they stand and its version flag.
 * The relay reads it back to her as a block, so she sees what is filled in and
 * what is still missing rather than remembering it from her own turns.
 */
export interface CarriedSheet {
  pack: string;
  rows: { id: string; state: string; because?: string; routes?: string[] }[];
  /** The class and the version, where this pack's own tests have settled them. */
  sorts?: string[];
}

export function carriedSheet(sheet: Sheet, packs: readonly string[]): CarriedSheet[] {
  return packs
    .filter((pack) => section(pack) !== undefined)
    .map((pack) => {
      const held = sheet.rows[pack] ?? {};
      const rows = Object.entries(held).map(([id, status]: [string, RowStatus]) => ({
        id,
        state: status.state,
        ...(status.because ? { because: status.because } : {}),
        ...(status.routes?.length ? { routes: status.routes } : {}),
      }));
      const sorts = sheet.sorts[pack] ?? [];
      return { pack, rows, ...(sorts.length ? { sorts } : {}) };
    });
}

export async function askPhoebe(
  history: { role: 'user' | 'assistant'; content: string }[],
  record: CarriedRecord | null,
  signal?: AbortSignal,
  opts?: {
    opened?: boolean;
    eligibilityDone?: boolean;
    sheet?: CarriedSheet[];
    /** Card sets already loaded earlier this visit, so a stage does not unload. */
    loaded?: string[];
  }
): Promise<PhoebeAnswer> {
  let response: Response;
  try {
    const body: {
      messages: typeof history;
      record?: CarriedRecord;
      sheet?: CarriedSheet[];
      loaded?: string[];
      opened?: true;
      eligibilityDone?: true;
    } = { messages: history };
    if (record) body.record = record;
    /* The rows go with every ask, from the console and from the Commons
       seat, so she sees her tool's state — what is filled in and what is
       still missing — rather than remembering it from her own turns. */
    if (opts?.sheet && opts.sheet.length > 0) body.sheet = opts.sheet;
    if (opts?.loaded && opts.loaded.length > 0) body.loaded = opts.loaded;
    if (opts?.opened) body.opened = true;
    if (opts?.eligibilityDone) body.eligibilityDone = true;
    response = await fetch('/api/phoebe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new PhoebeError(
      'Phoebe could not be reached. That is usually the connection rather than her.'
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new PhoebeError(
      response.ok
        ? 'Phoebe answered in a shape this console could not read.'
        : `Phoebe is unavailable right now (error ${response.status}).`
    );
  }

  const data = payload as Record<string, unknown>;

  if (!response.ok) {
    /* The relay writes readable messages for every failure it knows about. */
    throw new PhoebeError(
      typeof data.error === 'string'
        ? data.error
        : `Phoebe is unavailable right now (error ${response.status}).`
    );
  }

  if (typeof data.reply !== 'string') {
    throw new PhoebeError('Phoebe answered in a shape this console could not read.');
  }

  return {
    reply: data.reply,
    evidence: resolveEvidence(data.cited),
    rows: resolveRows(data.rows),
    pathways: resolvePathways(data.pathways),
    sorts: resolveSorts(data.sorts),
    handBack: HAND_BACKS.find((h) => h === data.handBack) ?? 'none',
    abstained: data.abstained === true,
    abstentionTopic:
      typeof data.abstentionTopic === 'string' ? data.abstentionTopic : undefined,
    loaded: Array.isArray(data.loaded) ? data.loaded.filter((s): s is string => typeof s === 'string') : undefined,
    usage: data.usage as PhoebeAnswer['usage'],
  };
}

/**
 * Phoebe's adapter into the shared chat layer.
 *
 * She returns a pack and a card name. This turns each one into an Evidence
 * record the layer can render — the card's title, its plain words, and the
 * citation, all read from the committed card file. She supplies none of it
 * beyond the name, which is the whole point: see CITATIONS.md. A route card
 * she names comes through the same door, so the fix a visitor reads is the
 * pack's own sentence with its own citation.
 */
function resolveEvidence(value: unknown): Evidence[] {
  if (!Array.isArray(value)) return [];
  const out: Evidence[] = [];
  const seen = new Set<string>();

  for (const raw of value) {
    if (typeof raw !== 'string') continue;
    const token = raw.trim();
    if (seen.has(token)) continue;

    /* `water:eligibility/4` — the section, the set, the card's own id. THE
       EVIDENCE ID IS THE TOKEN ITSELF, because the same token is the marker she
       writes in her prose: if the two were built differently they could differ,
       and a marker with no evidence behind it reaches the reader as brackets. */
    const match = token.match(/^([a-z][a-z0-9-]*):([a-z]+)\/(.+)$/);
    if (!match) continue;
    const [, sectionId, set, id] = match;
    const pack = TOOL_SECTIONS.find((part) => part.sectionId === sectionId)?.pack;
    if (!pack) continue;

    /* A reference to a card that does not exist is dropped in silence here
       rather than rendered — showing a citation for a missing card would be
       the fabrication this whole arrangement exists to prevent. The marker
       leaves the prose with it. */
    if (set === 'routes') {
      const route = routeFor(pack, id);
      if (!route) continue;
      seen.add(token);
      out.push({
        id: token,
        label: `Route ${route.id} — ${route.title}`,
        citation: route.citation,
        plainEnglish: route.route,
      });
      continue;
    }
    const card = cardFor(pack, `${set}/${id}`);
    if (!card) continue;
    seen.add(token);
    out.push({
      id: token,
      label: `${setWord(set)} ${card.id} — ${card.title}`,
      citation: card.citation,
      plainEnglish: card.plain,
    });
  }
  return out;
}

function setWord(set: string): string {
  if (set === 'eligibility') return 'Criterion';
  if (set === 'feasibility') return 'Consideration';
  if (set === 'applies') return 'Does this apply —';
  return 'Card';
}

/** A row update is dropped unless its pack, its row and its state all exist. */
function resolveRows(value: unknown): RowUpdate[] {
  if (!Array.isArray(value)) return [];
  const out: RowUpdate[] = [];
  for (const raw of value) {
    if (typeof raw !== 'object' || raw === null) continue;
    const u = raw as Record<string, unknown>;
    const pack = typeof u.pack === 'string' ? u.pack : '';
    const id = typeof u.id === 'string' ? u.id : '';
    const state = ROW_STATE_IDS.find((s) => s === u.state) as RowStateId | undefined;
    if (!pack || !id || !state) continue;
    const row = section(pack)?.rows.find((r) => r.id === id);
    if (!row) continue;
    const because = typeof u.because === 'string' ? u.because.trim() : '';
    const routes = Array.isArray(u.routes)
      ? u.routes.filter((r): r is string => typeof r === 'string' && row.routes.includes(r))
      : [];
    out.push({
      pack,
      id,
      state,
      ...(because ? { because } : {}),
      ...(routes.length ? { routes } : {}),
    });
  }
  return out;
}

function resolvePathways(value: unknown): PathwayUpdate[] {
  if (!Array.isArray(value)) return [];
  const out: PathwayUpdate[] = [];
  for (const raw of value) {
    if (typeof raw !== 'object' || raw === null) continue;
    const u = raw as Record<string, unknown>;
    const pack = typeof u.pack === 'string' ? u.pack : '';
    const id = typeof u.id === 'string' ? u.id : '';
    const state = PATHWAY_STATE_IDS.find((s) => s === u.state) as PathwayStateId | undefined;
    if (!pack || !id || !state) continue;
    if (!section(pack)?.rows.some((r) => r.id === id)) continue;
    const because = typeof u.because === 'string' ? u.because.trim() : '';
    out.push({ pack, id, state, ...(because ? { because } : {}) });
  }
  return out;
}

/**
 * What her tests settled about which rows a project has: its class, its
 * version, or both.
 *
 * A word a pack does not declare is dropped, and so is "all", which is what an
 * absent key already says. The shell holds them per pack; the relay checks the
 * same list before they get here.
 */
function resolveSorts(value: unknown): { pack: string; value: string }[] {
  if (!Array.isArray(value)) return [];
  const out: { pack: string; value: string }[] = [];
  for (const raw of value) {
    if (typeof raw !== 'object' || raw === null) continue;
    const u = raw as Record<string, unknown>;
    const pack = typeof u.pack === 'string' ? u.pack : '';
    const word = typeof u.value === 'string' ? u.value : '';
    const found = section(pack);
    if (!found || word === 'all') continue;
    const known =
      found.appliesTo.some((entry) => entry.id === word) ||
      found.versionFlags.some((entry) => entry.id === word);
    if (!known) continue;
    out.push({ pack, value: word });
  }
  return out;
}
