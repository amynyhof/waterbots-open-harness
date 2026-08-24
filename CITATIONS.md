# CITATIONS.md — WaterBots Open Harness (Shell B)

How this project cites sources. Binding on every surface, rule card,
README, and future agent answer. This is a public repo: these rules are
written to be safe to publish and complete on their own.

**This file owns what a citation is and how it renders.**
[AGENT_RULES.md](./AGENT_RULES.md) owns how an agent behaves and speaks,
and [CLAUDE.md](./CLAUDE.md) owns the language rules. Each rule has one
home. Where a rule belongs to another file, this one points at it rather
than restating it, so the two cannot drift apart. Where this file and
AGENT_RULES.md both speak to a point, **this file wins**, and a
disagreement between them is a defect to raise with the maintainer.

## The four-part shape

Every cited claim has all four parts. Not three.

1. **Reworded in our own words.** Never a verbatim reproduction of a
   source document. Direct quotes are limited to short attributed
   snippets.
2. **A short attributed excerpt** where a quote is genuinely needed —
   brief, marked as a quote, credited.
3. **The citation** — document title, version, and section.
   Example: VWBA 2.0 §4.2.
4. **The canonical link** — the publisher's own page. Never a mirror,
   never an aggregator, never a re-hosted copy.

**No canonical link, no citation, and the content does not ship.** Every
card in this repository carries a working canonical link. This is a
safety net rather than a preference: a claim nobody can go and check is
indistinguishable from one that was invented, and the link is what makes
the difference visible.

## What this repo holds, and what it never holds

- **Rule cards only.** A rule card is a plain-English statement of a
  rule, carrying its own citation and canonical link per the four-part
  shape. Cards are the only methodology-derived content committed here.
- **Never in this repo:** source PDFs, document excerpts beyond short
  attributed snippets, embeddings, or any derived vector data. This is
  binding regardless of how convenient inclusion would be. This rule
  means what publishes: source PDFs may sit in the gitignored
  `sources-local/` folder for local reading only, and are never
  committed or published.
- **Cite the real document.** A claim grounds in the actual published
  source. A summary, wiki, or secondhand write-up never stands in for
  it.
- **Version is part of the citation.** Name the exact version. The
  canonical link is required either way; where it resolves to a
  publisher page covering more than the cited version, or where the
  exact version has no page of its own, the card says so rather than
  substituting another version's content.
- **No endorsement implication.** Nothing here implies that any
  standards body endorses, certifies, or is affiliated with this
  project. This is the claim the *repository* makes; what an *agent*
  may say about certification is in
  [AGENT_RULES.md](./AGENT_RULES.md).

## Estimates and derived values

- **Estimates are labeled as estimates.** Screening-grade outputs say
  so, everywhere they render.
- **Derived values are labeled as derived.** Presenting a derived value
  as the publisher's own figure is a fabricated claim about someone
  else's data. (Example already live: Level 6 water stress renders
  WRI's published figures; the Level 4 world view is our area-weighted
  majority of Level 6 children and says so wherever it renders.)

## How a cited answer renders — the levels

The agent's job is to make the complex simple. **A citation means
everything is look-up-able, not that everything is shown.**

**Level 1 — the plain answer.** Short, plain-language, read by default,
and complete on its own. Nobody should have to open a citation to find
out what the answer was.

**Level 2 — the marker and its one line.** A compact numbered marker,
`(ref1)`, `(ref2)`, sits inline in the Level 1 prose. Activating it
shows **one line and nothing more**:

> source · version · section · page → canonical link

That line is the whole of Level 2. It renders muted, in the style of the
map's attribution bar, and its link is the publisher's canonical page.

**Level 3 is not built on the free site.** A pop-out carrying a
plain-English tab and a verbatim source-text tab is a paid-platform
feature (maintainer ruling, 22 Aug 2026). It is recorded here so that
nobody rebuilds it from the extracted rules by mistake, and because the
reason matters: **this repository holds no verbatim source text to put
in such a tab**, by the rule above, so the tab could only ever have been
an empty state on this site.

**The marker is built from the committed card, not from a retrieved
passage.** An agent names a card; the console resolves the number and
renders every citation field from the committed card file. The agent
places the marker and never writes the citation, so a wrong page or an
invented link is not something an agent can produce. A marker naming a
card that does not exist is dropped rather than rendered.

**Number-dense passages get an honest note.** Where a rule rests on a
table or a set of figures, the answer says so and sends the reader to
the canonical link, rather than paraphrasing a table into prose that
reads as precise and is not.

## Visual format (BRAND.md)

- **Section citations render muted** (`--fg-2`).
- **A citation reference is a `.tag`, not a `.chip`.** `VWBA 2.0`,
  `§4.2`: 4px radius (`--r-xs`), 1px `--line` border, no fill,
  DM Mono 11px / +0.06em, label in `--fg-2`. Chips carry states, never
  citations.
- **The test: if the text would change when the record changes, it is a
  tag.** Draft and Pending are states, so they are chips. `VWBA 2.0`
  and `§4.2` are values, so they are tags.
- **A `(refN)` marker is a tag**, by that test and by the rule above it.
- **Its expanded line renders in the map's attribution-bar style** —
  a faint card wash, `--fg-2`, 11px sans, and a link that carries a real
  link affordance rather than reading as fine print.
- **Copy style** — sentence form, tone and length are owned by
  [AGENT_RULES.md](./AGENT_RULES.md).
- **Language rules** — plain-words-first and the banned words are owned
  by [CLAUDE.md](./CLAUDE.md).

## Agent behavior

**Owned by [AGENT_RULES.md](./AGENT_RULES.md)** — cite or abstain, the
abstention ladder, how unbuilt capability is stated, and how an agent
speaks. It was briefly restated here and is not any more, because two
copies of a rule are two rules that can disagree.

## The wall

This repo and the main platform never mix. No file, link, path, or
credential from the private platform appears here. Rules travel as
rules; artifacts do not.
