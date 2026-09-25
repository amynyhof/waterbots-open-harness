/**
 * The state of the eligibility worksheet — five row states, two pathways.
 *
 * FIVE STATES, FROM 25 SEP 2026. This file was `criteriaState.ts` and held
 * three: unchecked, met, not-yet. The maintainer's ruling of 23 Sep 2026 (item
 * A18) replaced the hard gate with a readiness read, and a miss is now sorted
 * before anything is ruled out: Fixable with a cited route, Unknown with what
 * to find out, or Blocked where the card itself says a miss cannot be designed
 * away. The old file's account of "three states and no fourth" is in the water
 * pack's CHANGELOG.
 *
 * THE WORDS AND THE COLOURS ARE NOT WRITTEN HERE. They come from the tool
 * files, through `worksheet.generated.ts`, because a tool is defined once in
 * one file in its pack — her ruling of 24 Sep 2026. This file holds the shape
 * the shell keeps and the moves it makes, and nothing a maintainer approves.
 *
 * ROWS ARE KEYED BY PACK AND BY THE ROW'S OWN ID, not by position. A pathway
 * has a different number of rows for a household filter than for a community
 * supply (the `applies` key), so a positional array would quietly line up the
 * wrong verdicts with the wrong rows.
 *
 * NO MEMORY ACROSS VISITS. A reload starts blank, which is the honest
 * behaviour: carrying state the product cannot actually remember would be a
 * fabricated state. The maintainer's ruling of 21 Aug 2026, unchanged.
 */

import {
  ROW_STATE_COLOUR,
  ROW_STATE_LABEL,
  READINESS_LABEL,
  PATHWAY_STATE_LABEL,
  pathwayStateOf,
  readinessOf,
  section,
  verdictRows,
  type PathwayStateId,
  type ReadinessId,
  type RowContext,
  type RowStateId,
} from './worksheet.generated';

export type { PathwayStateId, ReadinessId, RowContext, RowStateId };

/**
 * One row of the worksheet, as the shell holds it.
 *
 * `because` is the one sentence the state carries: what settled a Met row, what
 * to find out on an Unknown one, the card's own reason on a Blocked one. It is
 * Phoebe's sentence, never the console's.
 *
 * `routes` are route-card ids on a Fixable row. The console draws each route
 * from the committed card file, with its citation, so a route she names that
 * has no card is dropped rather than rendered — the same arrangement as her
 * citations.
 */
export interface RowStatus {
  state: RowStateId;
  because?: string;
  routes?: string[];
}

/** Every row's state, by pack and then by the row's own id. */
export type SheetRows = Record<string, Record<string, RowStatus>>;

/**
 * The worksheet as the shell holds it for one visit.
 *
 * A row that is not in `rows` has not been looked at. An absence is never a
 * verdict, so the empty sheet below is the honest starting point rather than a
 * grid of failures.
 */
export interface Sheet {
  rows: SheetRows;
  /** Each pack's version flag, where its own test sets one. */
  flags: Record<string, string>;
}

export const EMPTY_SHEET: Sheet = { rows: {}, flags: {} };

/** How each state is named on screen. Complete words, never a symbol alone. */
export const STATE_LABEL = ROW_STATE_LABEL;

/**
 * The colour each state carries, as a CSS value.
 *
 * These are the brand's status tokens, from the tool file. Not yet checked
 * takes the locked token because nothing has happened to it yet: it is an
 * absence, not a warning, and must never read as a failure. Blocked takes the
 * pending token with the word "Blocked" beside it, which is interim and
 * recorded as such — §2.5 of the brand book has no stopped state that is not
 * an error, and the raise is the maintainer's.
 */
export function stateColour(state: RowStateId): string {
  const token = ROW_STATE_COLOUR[state];
  return token ? `var(${token})` : 'var(--ink-3)';
}

export const PATHWAY_LABEL = PATHWAY_STATE_LABEL;
export const READ_LABEL = READINESS_LABEL;

/* --------------------------------------------------------------------------
   Reading the sheet.
   -------------------------------------------------------------------------- */

/** One row's state. A row nobody has looked at is Not yet checked. */
export function stateOf(sheet: Sheet, pack: string, id: string): RowStatus {
  return sheet.rows[pack]?.[id] ?? { state: 'unchecked' };
}

/** A pack's rows as plain state ids, which is what the generated reads take. */
export function statesOf(sheet: Sheet, pack: string): Record<string, string> {
  const rows = sheet.rows[pack] ?? {};
  return Object.fromEntries(Object.entries(rows).map(([id, status]) => [id, status.state]));
}

/** What the project is known to be, for sorting which rows it has. */
export function contextFor(sheet: Sheet, pack: string, gsClass: string): RowContext {
  return {
    ...(gsClass ? { gsClass: gsClass.toLowerCase() } : {}),
    ...(sheet.flags[pack] ? { versionFlag: sheet.flags[pack] } : {}),
  };
}

/** Whether the pathway is in play, from its own test rows. */
export function pathwayState(sheet: Sheet, pack: string, context: RowContext = {}): PathwayStateId {
  return pathwayStateOf(pack, statesOf(sheet, pack), context);
}

/** The readiness read for one pathway, from the rows and never from prose. */
export function readiness(sheet: Sheet, pack: string, context: RowContext = {}): ReadinessId {
  return readinessOf(pack, statesOf(sheet, pack), context);
}

/** Every Eligibility row that carries a verdict has one, for this pathway. */
export function packDone(sheet: Sheet, pack: string, context: RowContext = {}): boolean {
  const rows = verdictRows(pack, context);
  if (rows.length === 0) return false;
  return rows.every((row) => stateOf(sheet, pack, row.id).state !== 'unchecked');
}

/** How many rows on this pack have been looked at at all. */
export function touched(sheet: Sheet, pack: string, context: RowContext = {}): number {
  return verdictRows(pack, context).filter(
    (row) => stateOf(sheet, pack, row.id).state !== 'unchecked'
  ).length;
}

/** The count of each state on one pack's verdict rows. */
export function counts(
  sheet: Sheet,
  pack: string,
  context: RowContext = {}
): Record<RowStateId, number> {
  const tally = { unchecked: 0, met: 0, fixable: 0, unknown: 0, blocked: 0 } as Record<
    RowStateId,
    number
  >;
  for (const row of verdictRows(pack, context)) {
    tally[stateOf(sheet, pack, row.id).state] += 1;
  }
  return tally;
}

/* --------------------------------------------------------------------------
   Moving the sheet.
   -------------------------------------------------------------------------- */

/** One verdict of Phoebe's, as it arrives from her relay. */
export interface RowUpdate {
  pack: string;
  id: string;
  state: RowStateId;
  because?: string;
  routes?: string[];
}

/** One answer to a pathway test. */
export interface PathwayUpdate {
  pack: string;
  id: string;
  state: PathwayStateId;
  because?: string;
}

/**
 * Her verdicts applied to the sheet — one home for the move, so the console's
 * sheet and the Commons seat's sheet cannot drift apart. Pure: a new sheet,
 * the old one untouched. A verdict for a pack or a row that does not exist is
 * dropped by her relay before it reaches here, and dropped again here.
 */
export interface Verdicts {
  rows?: RowUpdate[];
  pathways?: PathwayUpdate[];
  flags?: Record<string, string>;
}

export function applyUpdates(sheet: Sheet, updates: Verdicts): Sheet {
  const rows: SheetRows = { ...sheet.rows };
  const put = (pack: string, id: string, status: RowStatus) => {
    if (!section(pack)) return;
    if (!section(pack)!.rows.some((row) => row.id === id)) return;
    rows[pack] = { ...(rows[pack] ?? {}), [id]: status };
  };
  for (const update of updates.rows ?? []) {
    put(update.pack, update.id, {
      state: update.state,
      ...(update.because ? { because: update.because } : {}),
      ...(update.routes && update.routes.length ? { routes: update.routes } : {}),
    });
  }
  for (const update of updates.pathways ?? []) {
    put(update.pack, update.id, {
      state: update.state as unknown as RowStateId,
      ...(update.because ? { because: update.because } : {}),
    });
  }
  const flags = { ...sheet.flags };
  for (const [pack, flag] of Object.entries(updates.flags ?? {})) {
    if (section(pack)) flags[pack] = flag;
  }
  return { rows, flags };
}

/**
 * The shown line — contract line 5, item A15. Under any turn of Phoebe's that
 * moved a row, the console says what the worksheet now holds, in one caption
 * drawn from her structured verdicts and never from her prose. Only the states
 * a pathway actually holds are named, so a walk that has met three rows does
 * not read as though it had blocked none on purpose. Rows not yet checked are
 * not counted; an absence is not a verdict.
 */
export function worksheetCaption(sheet: Sheet, packs: { pack: string; context?: RowContext }[]): string {
  const parts: string[] = [];
  for (const { pack, context } of packs) {
    const tally = counts(sheet, pack, context ?? {});
    const said = (['met', 'fixable', 'unknown', 'blocked'] as RowStateId[])
      .filter((state) => tally[state] > 0)
      .map((state) => `${tally[state]} ${STATE_LABEL[state]}`);
    if (said.length === 0) continue;
    const name = section(pack)?.sectionName ?? pack;
    parts.push(`${name}: ${said.join(' · ')}`);
  }
  return parts.length ? `Worksheet — ${parts.join(' — ')}` : '';
}
