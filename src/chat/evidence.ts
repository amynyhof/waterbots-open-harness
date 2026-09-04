/**
 * The contract between an agent and the shared chat layer.
 *
 * AGENTS SUPPLY EVIDENCE; THE LAYER RENDERS IT. Every open-site agent — Phoebe
 * now, Bridget next, whoever follows — hands the layer the same shape, and the
 * layer decides how a citation looks. Nothing here knows which agent is
 * speaking, and nothing agent-specific belongs in this folder.
 *
 * THE DEPENDENCY POINTS ONE WAY. This file defines the citation shape; an
 * agent's adapter converts its own records into it. Phoebe's card parser and
 * this file happen to describe a citation identically today, and the layer
 * still must not import from hers — the moment it does, the second agent has
 * to conform to the first agent's data model rather than to the contract.
 *
 * THE AGENT NEVER WRITES CITATION TEXT. It names a card; the adapter looks that
 * card up in the committed file and fills in the citation here. A wrong page or
 * an invented link is not something an agent can produce, because it is never
 * the thing producing citation text. See CITATIONS.md.
 */

/**
 * A citation, broken into the parts CITATIONS.md renders.
 *
 * All four parts of the shape are present: the wording is a rewrite (in
 * `plainEnglish` on the evidence), the citation is `document` + `version` +
 * `section`, and `href` is the publisher's canonical page. There is no field
 * for verbatim source text, deliberately — this repository holds none, and
 * Level 3 is not built on the free site (see OPEN_ITEMS.md S3).
 */
export interface Citation {
  /** "VWBA 2.0" — the short document name. */
  document: string;
  /** "Version 1, September 2025" — part of the four-part shape. */
  version: string;
  /** "Appendix A · criterion 1" — where in the document. */
  section: string;
  /** "p. 32" — the printed page. */
  page: string;
  /** The publisher's canonical URL. Required; no link, no citation. */
  href: string;
  /** The source line as written on the card, for a title attribute. */
  full: string;
}

/**
 * One thing an answer rests on.
 *
 * `id` is the agent's own stable handle for it — Phoebe's is "eligibility-3".
 * The LAYER assigns the reader-facing number, never the agent, so the numbering
 * is always 1, 2, 3 in order of first appearance no matter what the agent
 * called things.
 */
export interface Evidence {
  id: string;
  /** "Criterion 3 — Internal buy-in and external support". */
  label: string;
  citation: Citation;
  /** The rule in the card's own plain words. Never the source's words. */
  plainEnglish: string;
  /**
   * True where the rule rests on a table or a set of figures. CITATIONS.md
   * requires an honest note rather than a paraphrase that reads as precise
   * and is not.
   */
  isDataTable?: boolean;
}

export interface UserTurn {
  role: 'user';
  text: string;
}

export interface AgentTurn {
  role: 'agent';
  /** The Level 1 answer: plain, complete on its own. */
  text: string;
  /** What it rests on. Empty when abstaining or exchanging pleasantries. */
  evidence: Evidence[];
  /** True when the agent declined because no source covered the question. */
  abstained?: boolean;
  /**
   * One action under the turn — a route, drawn as the same quiet text link
   * the desk's rows use. An agent's adapter builds it from a structured field,
   * never from prose. Either a link out or something to do here.
   */
  action?: TurnAction;
}

export interface TurnAction {
  label: string;
  /** A link out, opened in a new window. */
  href?: string;
  /** Something to do on this console. The layer calls it and knows no more. */
  go?: () => void;
}

export type Turn = UserTurn | AgentTurn;

/** Who is hosting this chat. Supplied by the agent, rendered by the layer. */
export interface AgentHost {
  name: string;
  /** "Eligibility and Feasibility" — what they cover, in plain words. */
  role: string;
  /** Imported portrait URL. */
  portrait: string;
  /** The identity colour token name, e.g. "--bot-phoebe". Read, never re-typed. */
  colourToken: string;
  /** Beta is stated in words where it is true, not tucked away. */
  beta?: boolean;
  /** Composer placeholder and the standing note beneath it. */
  composerPlaceholder: string;
  composerNote: string;
  /** Shown while a request is in flight. Agent-specific wording. */
  thinkingLine: string;
  /** The small label beside an abstained turn. Phoebe's is "no card for this". */
  abstainedLabel?: string;
}

/**
 * What an agent hands the layer.
 *
 * Anything agent-specific that must happen when an answer arrives — Phoebe
 * moving worksheet rows, for instance — happens inside the agent's own `ask`
 * before it returns. The layer stays unaware of it.
 *
 * A thrown Error's `message` is shown to the reader as-is, so an adapter throws
 * only messages already fit to read.
 */
export type Ask = (
  history: { role: 'user' | 'agent'; text: string }[],
  signal: AbortSignal
) => Promise<AgentTurn>;

/** One piece of a laid-out answer: prose, or a marker standing in the prose. */
export type Segment =
  | { kind: 'text'; text: string }
  | { kind: 'marker'; ref: number; item: Evidence };

export interface Layout {
  /** The answer, split into paragraphs, each split into segments. */
  paragraphs: Segment[][];
  /** Every marker placed, numbered in order of first appearance. */
  marked: { ref: number; item: Evidence }[];
  /**
   * Evidence the agent cited but never marked. Rendered beneath the answer so
   * a citation is never silently dropped just because a marker was forgotten.
   */
  unmarked: Evidence[];
}

/** `[[eligibility-4]]` — the set and number the agent was given, nothing else. */
const MARKER = /\[\[([a-z]+-\d+)\]\]/g;

/**
 * Turns an agent's raw text into paragraphs and numbered markers.
 *
 * THE LAYER OWNS THE NUMBERING. The agent writes `[[eligibility-4]]`; the reader
 * sees ref1, ref2, ref3 in the order they appear, whatever the agent called
 * things and whatever order it listed them in.
 *
 * A MARKER FOR EVIDENCE THAT DOES NOT EXIST IS REMOVED, not rendered. The agent
 * can name a card it was never given; what it cannot do is make one appear. The
 * bracket text is dropped from the prose rather than shown raw, because
 * `[[eligibility-9]]` on screen is a defect leaking into an answer.
 */
export function layoutAnswer(text: string, evidence: Evidence[]): Layout {
  const byId = new Map(evidence.map((item) => [item.id, item]));
  const refs = new Map<string, number>();
  const marked: { ref: number; item: Evidence }[] = [];

  const paragraphs = text.split(/\n{2,}/).map((paragraph) => {
    const segments: Segment[] = [];
    let cursor = 0;

    for (const match of paragraph.matchAll(MARKER)) {
      const id = match[1];
      const item = byId.get(id);
      const at = match.index ?? 0;

      const before = paragraph.slice(cursor, at);
      cursor = at + match[0].length;

      /* An unknown id takes its brackets with it and leaves the prose intact.
         The space that preceded it goes too when what follows is punctuation or
         the end of the paragraph, so a dropped marker cannot leave "a claim ."
         behind — the reader would see the defect without being able to name it. */
      if (!item) {
        let kept = before;
        const next = paragraph[cursor] ?? '';
        if (/\s$/.test(kept) && (next === '' || /[\s.,;:!?)\]]/.test(next))) {
          kept = kept.replace(/\s+$/, '');
        }
        if (kept) pushText(segments, kept);
        continue;
      }

      if (before) pushText(segments, before);

      let ref = refs.get(id);
      if (ref === undefined) {
        ref = refs.size + 1;
        refs.set(id, ref);
        marked.push({ ref, item });
      }
      segments.push({ kind: 'marker', ref, item });
    }

    const rest = paragraph.slice(cursor);
    if (rest) pushText(segments, rest);
    return segments;
  });

  return {
    paragraphs: paragraphs.filter((segments) => segments.length > 0),
    marked,
    unmarked: evidence.filter((item) => !refs.has(item.id)),
  };
}

/** Joins adjacent prose so a dropped marker does not split a sentence in two. */
function pushText(segments: Segment[], text: string) {
  const last = segments[segments.length - 1];
  if (last && last.kind === 'text') last.text += text;
  else segments.push({ kind: 'text', text });
}
