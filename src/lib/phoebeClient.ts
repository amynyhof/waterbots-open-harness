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

import { answersFrom } from './chips';
import { evidenceFor, readPhoebeAnswer, section, type PathwayUpdate, type RowStatus, type RowUpdate, type Sheet } from '@waterbots/phoebe';
import type { Evidence } from '../chat/evidence';
import type { KindFacts } from './visit';

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
  /** Chips that answer the question just asked (24 Nov 2026). */
  answers: string[];
  /** What the answer rests on, in the shared chat layer's shape. */
  evidence: Evidence[];
  rows: RowUpdate[];
  pathways: PathwayUpdate[];
  /** What a pack's own tests settled about which rows this project has. */
  sorts: { pack: string; value: string }[];
  handBack: HandBack;
  /** P15, 14 Nov 2026: this message says her quiz is on the Tool tab — the console dots the tab. */
  showTool: boolean;
  /** P21, 14 Nov 2026: one idea for a "Learn more about …" button, or "". */
  learnMore: string;
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
  /** The source, the treatment and whether the water is safe, as the visitor said them (core 0.4.0). */
  kindFacts: KindFacts;
  stage: string;
  place: string;
  name: string;
  /** People served, as the visitor said it — ruling R5, 27 Sep 2026, so she need not ask again. */
  served?: { count: number; unit: string } | null;
}

export function carriedRecord(context: CarriedRecord): CarriedRecord | null {
  const record: CarriedRecord = {
    does: context.does.trim(),
    type: context.type,
    kindFacts: context.kindFacts,
    stage: context.stage,
    place: context.place.trim(),
    name: context.name.trim(),
    ...(context.served ? { served: context.served } : {}),
  };
  return record.does || record.type || record.stage || record.place || record.name || record.served || Object.keys(record.kindFacts).length > 0
    ? record
    : null;
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
    /** On the opened turn: Wellington's line shows above hers, so he has introduced her (rule 17). */
    introduced?: boolean;
    eligibilityDone?: boolean;
    sheet?: CarriedSheet[];
    /** Where she is working (J2): the Free site, or alone in the Agent Commons. */
    door?: 'free-site' | 'agent-commons';
    /** Card sets already loaded earlier this visit, so a stage does not unload. */
    loaded?: string[];
    /**
     * Her reply as it is written, the whole text so far each time, or null to
     * clear it (13 Nov 2026). Given, the relay streams; not given, it answers
     * once, as before.
     */
    onLive?: (text: string | null) => void;
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
      introduced?: true;
      eligibilityDone?: true;
      door?: 'free-site' | 'agent-commons';
      stream?: true;
    } = { messages: history };
    if (opts?.door) body.door = opts.door;
    if (opts?.onLive) body.stream = true;
    if (record) body.record = record;
    /* The rows go with every ask, from the console and from the Commons
       seat, so she sees her tool's state — what is filled in and what is
       still missing — rather than remembering it from her own turns. */
    if (opts?.sheet && opts.sheet.length > 0) body.sheet = opts.sheet;
    if (opts?.loaded && opts.loaded.length > 0) body.loaded = opts.loaded;
    if (opts?.opened) body.opened = true;
    if (opts?.opened && opts.introduced) body.introduced = true;
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
  if (response.ok && /application\/x-ndjson/.test(response.headers.get('content-type') ?? '')) {
    payload = await readStream(response, opts?.onLive);
  } else {
    try {
      payload = await response.json();
    } catch {
      throw new PhoebeError(
        response.ok
          ? 'Phoebe answered in a shape this console could not read.'
          : `Phoebe is unavailable right now (error ${response.status}).`
      );
    }
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

  /* Her answer is held to her tool files again here, by her package's own check (`readPhoebeAnswer`): a row, a state, a
     route or a card that is not on its list is dropped rather than shown. */
  const checked = typeof data.reply === 'string' ? readPhoebeAnswer(data) : null;
  if (!checked) {
    throw new PhoebeError('Phoebe answered in a shape this console could not read.');
  }

  return {
    reply: checked.reply,
    answers: answersFrom(data.answers),
    evidence: evidenceFor(checked.cited),
    rows: checked.rows as RowUpdate[],
    pathways: checked.pathways as PathwayUpdate[],
    sorts: checked.sorts,
    handBack: HAND_BACKS.find((h) => h === checked.handBack) ?? 'none',
    showTool: checked.showTool,
    learnMore: checked.learnMore,
    abstained: checked.abstained,
    abstentionTopic: checked.abstentionTopic,
    loaded: Array.isArray(data.loaded) ? data.loaded.filter((s): s is string => typeof s === 'string') : undefined,
    usage: data.usage as PhoebeAnswer['usage'],
  };
}

/**
 * Her streamed answer, read line by line (api/phoebe.ts, `streamed`).
 *
 * Text lines are shown as they come; a reset clears them, because the same
 * question is going again; the last line is the checked answer, returned as
 * the one JSON answer would have been, or the relay's own failure message,
 * thrown. A stream that ends with neither is said plainly, never shown as an
 * answer.
 */
async function readStream(response: Response, onLive?: (text: string | null) => void): Promise<unknown> {
  const reader = response.body?.getReader();
  if (!reader) throw new PhoebeError('Phoebe answered in a shape this console could not read.');
  const decoder = new TextDecoder();
  let buffered = '';
  let live = '';
  for (;;) {
    let chunk: ReadableStreamReadResult<Uint8Array>;
    try {
      chunk = await reader.read();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error;
      throw new PhoebeError(
        'Phoebe’s answer was cut off on the way here. That is usually the connection rather than her. Asking again usually works.'
      );
    }
    const { done, value } = chunk;
    buffered += decoder.decode(value, { stream: !done });
    const lines = buffered.split('\n');
    buffered = done ? '' : (lines.pop() ?? '');
    for (const line of lines) {
      if (line.trim() === '') continue;
      let event: Record<string, unknown>;
      try {
        event = JSON.parse(line) as Record<string, unknown>;
      } catch {
        throw new PhoebeError('Phoebe answered in a shape this console could not read.');
      }
      if (event.type === 'text' && typeof event.text === 'string') {
        live += event.text;
        onLive?.(live);
      } else if (event.type === 'reset') {
        live = '';
        onLive?.(null);
      } else if (event.type === 'done') {
        return event.answer;
      } else if (event.type === 'error') {
        throw new PhoebeError(
          typeof event.error === 'string' ? event.error : 'Something went wrong reaching Phoebe. Nothing has been recorded.'
        );
      }
    }
    if (done) break;
  }
  throw new PhoebeError(
    'Phoebe stopped part-way through that answer and it did not finish. Nothing has been recorded. Asking again usually works.'
  );
}
