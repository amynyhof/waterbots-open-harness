# Chat citation & formatting rules — for the Open Harness chat

> **SUPERSEDED 22 Aug 2026. This is a historical extraction record, not
> a live rulebook. Do not read a rule from this file and act on it.**
>
> Every rule below was distributed on 22 Aug 2026 into the three root
> documents, one home each: **[CLAUDE.md](./CLAUDE.md)** (language
> rules), **[CITATIONS.md](./CITATIONS.md)** (what a citation is and
> how it renders), **[AGENT_RULES.md](./AGENT_RULES.md)** (how an agent
> behaves and speaks). Those files are what binds. This one is kept
> only to record what arrived and when.
>
> **Four rulings changed the content as it was distributed**, so this
> file is now wrong in four places:
>
> 1. **The canonical link is absolute here.** Kept, as a safety net —
>    every card in this repository carries a working link.
> 2. **This file calls a `(refN)` marker a "chip" in one place and
>    requires a `.tag` in another.** It is a **tag**.
> 3. **`CITATIONS_ShellB.md` does not exist.** The file that wins is
>    **CITATIONS.md**, subtitled "Shell B".
> 4. **`(refN)` is described as built from "the passage the retrieval
>    actually returned".** There is no retrieval layer on this site.
>    The marker is built from the committed rule card.
>
> **Level 3 is not built on the free site** (maintainer ruling,
> 22 Aug 2026). The pop-out with plain-English and source-text tabs is
> a paid-platform feature. This repository holds no verbatim source
> text to put in such a tab, by CITATIONS.md's own rule.

Extracted from main-platform canon (2026-08-22) for use on the open
site. Rules travel as rules; no private-platform files or paths appear
here.

## The four-part shape (every cited answer)

1. **Reworded in our own words** — never verbatim reproduction.
2. **A short attributed excerpt** only where a quote is genuinely
   needed — brief, marked as a quote, credited.
3. **The citation** — document title, version, section.
   Example: VWBA 2.0 §4.2.
4. **The canonical link** — the publisher's own page. Never a mirror
   or aggregator.

No canonical link → no citation → the content does not ship.

## Layered answers (progressive disclosure)

The agent's job is to make the complex simple. A citation means
everything is look-up-able, not shown. Every answer has three levels:

- **Level 1** — short, plain-language answer anyone reads by default.
  Plain words lead; the acronym follows in parentheses on first use
  ("the newer methodology (PAA v2.0)" — never the reverse). Later
  uses may be bare.
- **Level 2** — a compact `(refN)` marker that expands to
  **source · page · canonical link**.
- **Level 3** — "read more" opens a pop-out with two tabs: a
  plain-English paraphrase of that exact passage (default), and the
  verbatim source text with a View Source link (deep-linked to
  `#page=N` when the source is a direct PDF; landing pages link as-is
  with the page number shown).

**References anchor to evidence, not prose.** A `(refN)` chip is built
from the passage the retrieval actually returned; the model only
places the marker, so it cannot invent a page.

**Table passages:** number-dense extractions get an honest note —
"this is a data table — use View Source" — never a broken paraphrase.

## Visual formatting

- **A citation reference is a `.tag`, not a `.chip`.**
  `VWBA 2.0`, `§4.2`: 4px radius, 1px hairline border, no fill,
  DM Mono 11px / +0.06em, muted label color. Chips carry states
  (Draft, Pending); tags carry values. Test: if the text changes when
  the record changes, it's a tag.
- **Section citations render muted.** An expanded row opens with its
  § citation, muted, above the content.
- **Complete sentences in UI copy.** No fragments, no exclamation
  marks.
- **Plain words lead; acronym in parentheses on first use.**

## Honesty rules that govern chat

- Agents cite sources or abstain. Never a guess to avoid abstaining.
- Estimates are labeled as estimates, everywhere they render.
- Unbuilt capability is stated plainly ("planned," "not live yet"),
  never simulated.
- No standards-body branding; no endorsement implication.

## Banned words in outward-facing copy

- "validate / validation" → "confirms outputs"
- "golden" → "reference"
