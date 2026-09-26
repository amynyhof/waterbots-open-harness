/**
 * The email to the WaterBots team — the door to a person, delivered.
 *
 * ITEM A18, the maintainer's word of 26 Sep 2026 on pull request #126: when a
 * visitor ticks "Send my project to the WaterBots team so a person can look at
 * it" and saves, an email goes to hello@waterbots.ai carrying the project's
 * name, place, type and stage, each pathway's readiness read and its Blocked
 * rows, and the visitor's note, in plain words, and nothing else. Nothing is
 * sent without the save, and nothing is sent without the tick.
 *
 * THE READ IS WORKED OUT HERE, NOT TAKEN FROM THE PAGE. The page sends each
 * pathway's rows as plain state ids beside the seal (`forTeam`); this file
 * checks every id and every state against the tool files' generated model and
 * computes the pathway state and the readiness read with the same functions
 * the console and Phoebe's relay use. The rows are read for this email only:
 * they are not stored, and they are not part of the seal production claims.
 *
 * THE PROVIDER IS RESEND, over one HTTPS call, with no package added. Its key
 * is a hosting secret, `RESEND_API_KEY`, set by the maintainer in the host's
 * settings and never in this repository. The sending address is on
 * waterbots.ai, so that domain has to be verified with the provider before the
 * first email can leave. Without the key the ticked save is refused, and says
 * so; an unticked save never touches this file.
 */

import type { SealBody } from './_handoff.js';
import { projectType, PROJECT_STAGES } from './_projectTypes.generated.js';
import {
  HER_PACKS,
  PATHWAY_STATE_IDS,
  PATHWAY_STATE_LABEL,
  READINESS_LABEL,
  ROW_STATE_IDS,
  pathwayStateOf,
  readinessOf,
  section,
  verdictRows,
  type RowContext,
} from './_worksheet.generated.js';

/** Where the email goes. The maintainer's word; not a setting. */
export const TEAM_ADDRESS = 'hello@waterbots.ai';

/** Who it is from. An address on waterbots.ai, verified with the provider. */
export const TEAM_MAIL_FROM = 'WaterBots map <map@waterbots.ai>';

/** The provider's one address. */
export const RESEND_URL = 'https://api.resend.com/emails';

const MAX_BECAUSE_CHARS = 600;

/** One pathway's rows as the page holds them, for this email only. */
export interface TeamPathway {
  pack: string;
  /** Row id → state id: a row state, or a pathway test's applies word. */
  states: Record<string, string>;
  /** Row id → the card's own reason, on Blocked rows only. */
  blocked: Record<string, string>;
  /** The pack's own sorting words — its class, its version — from her tests. */
  sorts: string[];
}

export type TeamReading = { forTeam: TeamPathway[] } | { problem: string };

const STATE_WORDS: readonly string[] = [...ROW_STATE_IDS, ...PATHWAY_STATE_IDS];

/**
 * Read `forTeam` off the request, or say what was wrong with it.
 *
 * Like the seal, nothing is repaired: an unknown pack, row, state or key
 * refuses the whole request, and a reason on a row that is not Blocked is
 * turned away rather than mailed.
 */
export function readForTeam(value: unknown): TeamReading {
  if (!Array.isArray(value)) return { problem: 'forTeam is not a list' };
  if (value.length > HER_PACKS.length) return { problem: 'forTeam has more pathways than there are' };
  const out: TeamPathway[] = [];
  for (const [i, entry] of value.entries()) {
    const where = `forTeam[${i}]`;
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) return { problem: `${where} is not an object` };
    const e = entry as Record<string, unknown>;
    for (const key of Object.keys(e)) {
      if (!['pack', 'states', 'blocked', 'sorts'].includes(key)) return { problem: `${where} carries "${key}"` };
    }
    const found = typeof e.pack === 'string' ? section(e.pack) : undefined;
    if (!found) return { problem: `${where}.pack is not one of Phoebe's packs` };
    if (out.some((p) => p.pack === found.pack)) return { problem: `${where}.pack is sent twice` };
    const ids = new Set(found.rows.map((row) => row.id));

    const states: Record<string, string> = {};
    if (typeof e.states !== 'object' || e.states === null || Array.isArray(e.states)) return { problem: `${where}.states is not an object` };
    for (const [id, state] of Object.entries(e.states as Record<string, unknown>)) {
      if (!ids.has(id)) return { problem: `${where}.states names row "${id}", which is not on that pathway` };
      if (typeof state !== 'string' || !STATE_WORDS.includes(state)) return { problem: `${where}.states.${id} is not a state` };
      states[id] = state;
    }

    const blocked: Record<string, string> = {};
    if (typeof e.blocked !== 'object' || e.blocked === null || Array.isArray(e.blocked)) return { problem: `${where}.blocked is not an object` };
    for (const [id, because] of Object.entries(e.blocked as Record<string, unknown>)) {
      if (states[id] !== 'blocked') return { problem: `${where}.blocked names row "${id}", which is not Blocked` };
      if (typeof because !== 'string' || because.length > MAX_BECAUSE_CHARS) return { problem: `${where}.blocked.${id} is not a short reason` };
      blocked[id] = because;
    }

    if (!Array.isArray(e.sorts)) return { problem: `${where}.sorts is not a list` };
    const words = [...found.appliesTo, ...found.versionFlags].map((w) => w.id);
    for (const word of e.sorts) {
      if (typeof word !== 'string' || !words.includes(word)) return { problem: `${where}.sorts holds a word that is not that pathway's` };
    }
    out.push({ pack: found.pack, states, blocked, sorts: e.sorts as string[] });
  }
  return { forTeam: out };
}

/** The same sorting the console does: her tests first, then the record's class. */
function contextOf(pathway: TeamPathway, gsClass: string): RowContext {
  const found = section(pathway.pack);
  const sorted = pathway.sorts.find((w) => found?.appliesTo.some((v) => v.id === w && v.id !== 'all'));
  const version = pathway.sorts.find((w) => found?.versionFlags.some((v) => v.id === w));
  const held = sorted ?? (gsClass ? gsClass.toLowerCase() : '');
  return { ...(held ? { gsClass: held } : {}), ...(version ? { versionFlag: version } : {}) };
}

/** A visitor's words on one line, for the subject. */
function oneLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export interface TeamMail {
  to: string;
  from: string;
  subject: string;
  text: string;
}

/**
 * The email, in plain words. Name, place, type, stage; each pathway's read and
 * its Blocked rows with the card's reason; the note. Nothing else — no other
 * field of the record, no pin id, no conversation, no ticket.
 */
export function composeTeamMail(seal: SealBody, forTeam: TeamPathway[]): TeamMail {
  const { record } = seal;
  const name = oneLine(record.name.value) || 'Unnamed project';
  const type = projectType(record.type.value);
  const typeWords =
    record.type.value === 'NONE'
      ? 'none of the listed types'
      : type
        ? `${type.id}, ${type.name}`
        : 'not known yet';
  const stage = PROJECT_STAGES.find((s) => s.id === record.stage.value)?.words ?? 'not known yet';

  const lines: string[] = [
    'A visitor to map.waterbots.ai saved their project and asked for a person at WaterBots to look at it.',
    '',
    `Project: ${name}`,
    `Where: ${oneLine(record.place.value) || 'not known yet'}`,
    `Type: ${typeWords}`,
    `Stage: ${stage}`,
    '',
  ];

  for (const pack of HER_PACKS) {
    const found = section(pack);
    if (!found) continue;
    const pathway = forTeam.find((p) => p.pack === pack) ?? { pack, states: {}, blocked: {}, sorts: [] };
    const context = contextOf(pathway, record.gsClass.value);
    const state = pathwayStateOf(pack, pathway.states, context);
    const title = found.sectionName.replace(/^The /, '');
    const heading = title.charAt(0).toUpperCase() + title.slice(1);
    if (state === 'does-not-apply') {
      lines.push(`${heading}: ${PATHWAY_STATE_LABEL[state]}.`);
    } else {
      lines.push(`${heading}: ${READINESS_LABEL[readinessOf(pack, pathway.states, context)]}.`);
      for (const row of verdictRows(pack, context)) {
        if (pathway.states[row.id] !== 'blocked') continue;
        const because = pathway.blocked[row.id];
        lines.push(`  Blocked: ${row.title}${because ? ` — ${oneLine(because)}` : ''}`);
      }
    }
  }

  lines.push('', 'Their note:', seal.humanNote ? seal.humanNote : '(none)');
  lines.push('', 'This is a screening from the free site, not a verdict.');

  return {
    to: TEAM_ADDRESS,
    from: TEAM_MAIL_FROM,
    subject: `A visitor asked for a person: ${name}`,
    text: lines.join('\n'),
  };
}

/** The hosting secret, or null when it is not set. */
export function teamMailKey(): string | null {
  const key = process.env.RESEND_API_KEY;
  return key && key.trim() ? key.trim() : null;
}

export class TeamMailError extends Error {}

/** Send it. Throws a TeamMailError with the provider's answer on any failure. */
export async function sendTeamMail(key: string, mail: TeamMail): Promise<void> {
  let response: Response;
  try {
    response = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: mail.from, to: [mail.to], subject: mail.subject, text: mail.text }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw new TeamMailError(`the mail provider could not be reached — ${String(error)}`);
  }
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new TeamMailError(`the mail provider answered ${response.status} — ${detail.slice(0, 200)}`);
  }
}
