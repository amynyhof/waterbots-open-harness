# CITATIONS.md — WaterBots Open Harness (Shell B)

How this project cites sources. Binding on every surface, rule card,
README, and future agent answer. This is a public repo: these rules are
written to be safe to publish and complete on their own.

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
- **Version is part of the citation.** Name the exact version. If a
  needed version cannot be linked canonically, the card says so rather
  than substituting another version's content.
- **No endorsement implication.** Nothing here implies that any
  standards body endorses, certifies, or is affiliated with this
  project.

## Estimates and derived values

- **Estimates are labeled as estimates.** Screening-grade outputs say
  so, everywhere they render.
- **Derived values are labeled as derived.** Presenting a derived value
  as the publisher's own figure is a fabricated claim about someone
  else's data. (Example already live: Level 6 water stress renders
  WRI's published figures; the Level 4 world view is our area-weighted
  majority of Level 6 children and says so wherever it renders.)

## Data licensing — binding display requirements

Two datasets, two separate attributions. One combined line satisfies
neither.

- **HydroSHEDS / HydroBASINS** — custom WWF license, not Creative
  Commons. The full required copyright statement from License Agreement
  Exhibit B is displayed prominently, product name filled in. Text
  only — no WWF logo or trademark, ever. Scientific citations
  (Lehner & Grill 2013; Lehner, Verdin & Jarvis 2008) live in the
  README and any About surface.
- **WRI Aqueduct 4.0** — CC-BY 4.0. Visible attribution to World
  Resources Institute with the suggested citation (Kuzma et al. 2023)
  in the README.
- **Basemap tiles** carry their own attribution in the map's
  attribution control. Leaflet's attribution control stays ON. A tiny
  faded credit line does not meet any of these bars.

## Agent behavior (when agents go live here)

- Agents cite sources or abstain. Never a guess to avoid abstaining.
- Unbuilt capability is stated honestly ("planned," "not live yet"),
  never simulated.

## Visual format (BRAND.md)

- **Section citations render muted** (`--fg-2`).
- **A citation reference is a `.tag`, not a `.chip`.** `VWBA 2.0`,
  `§4.2`: 4px radius (`--r-xs`), 1px `--line` border, no fill,
  DM Mono 11px / +0.06em, label in `--fg-2`. Chips carry states, never
  citations.
- **Complete sentences in UI copy.** No fragments, no exclamation
  marks.
- **Plain words lead; acronym in parentheses on first use.**
- The word "golden" is not used; say "reference."

## The wall

This repo and the main platform never mix. No file, link, path, or
credential from the private platform appears here. Rules travel as
rules; artifacts do not.
