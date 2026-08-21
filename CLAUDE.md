# CLAUDE.md — WaterBots Open Harness

This file is the rulebook for AI engineering work in this repository.
Read it fully before doing anything.

## What this repo is

The public, Apache 2.0 home of the WaterBots map:
an interactive world map of HydroSHEDS watershed basins, colored by
water stress, with a small set of real water project locations
(planned, not yet placed) — and the foundation of an AI chat console
in the WaterBots style.

It deploys standalone and is linked from waterbots.ai. It shares
WaterBots branding, agent design, and agent knowledge with the main
platform, but shares no repository with it. The maintainer carries
any shared material across by hand; the engineer never fetches it.

**v1 is deployed and live at https://map.waterbots.ai.** Vercel builds
from `main` on push. See SESSION_HANDOFF.md for the deploy details.

## Rule zero — this repo only

You work in this repository and nowhere else. You never read, write,
or reference any other repository, working tree, or dev server. If a
task appears to require something outside this repo, stop and say so.
It becomes a written proposal for the maintainer to carry elsewhere —
never an action here.

## Non-negotiables

- **No mock or fabricated data — ever.** On a map: real HydroSHEDS
  basin boundaries, real project coordinates verified against their
  source registry, or nothing. In chat: no scripted fake
  conversations, no invented agent claims. An empty, honest state
  beats a fabricated one.
- **Proposal before code.** Nothing is built until the maintainer
  approves a written proposal. Nothing commits without her explicit
  word. Her browser review is part of every gate.
- **One step at a time.** Build one thing → report → browser review →
  commit word. No multi-step anticipation.
- **Atomic commits.** Subjects lead with the action taken —
  `Built:`, `Fixed:`, `Docs amended:`, `Proposal written:` — never
  the topic alone.
- **Honest states.** No silent failures, no false success messages.
  The product must tell you what happened.
- **Docs never drift.** At every session close, refresh the root docs
  (CLAUDE.md, README) to match what actually shipped. They must never
  be more than one session behind the build. Doc edits are proposed
  for the maintainer's review before they are committed.

## Language rules

- The words "validate/validation" are not used; say "confirms outputs"
  or reference the test suite.
- The word "golden" is not used; say "reference".
- Plain words lead, acronym in parentheses on first use.

## Citations — see CITATIONS.md

**CITATIONS.md in this repo is binding** on every surface, rule card,
README, and future agent answer. It carries the four-part citation
shape every cited claim must have, the rule that this repo holds rule
cards and never source PDFs or excerpts beyond short attributed
snippets, and the visual format citations render in. Read it before
writing anything that cites a source. It is published, not
engineer-eyes-only.

Where CITATIONS.md and this file both speak to a point — the data
licensing requirements below, derived values, plain-words-first — they
agree. If they ever diverge, that is a defect to raise with the
maintainer, not a choice to make.

## Data licensing — binding display requirements

Two datasets, two separate attributions. One combined line satisfies
neither.

**HydroSHEDS / HydroBASINS** — custom WWF license, **not** Creative
Commons. The full required copyright statement from License Agreement
Exhibit B must be displayed in a reasonably prominent manner, with the
product name filled in. Text only — WWF's name may appear in the
attribution text, but no WWF logo or trademark use, ever. Scientific
citations (Lehner & Grill 2013; Lehner, Verdin & Jarvis 2008) go in
the repo README and any About surface.

**WRI Aqueduct 4.0** — CC-BY 4.0. Requires visible attribution to
World Resources Institute with the suggested citation (Kuzma et al.
2023) in the README.

**Derived values are labelled as derived.** Aqueduct publishes water
stress at Level 6 only. Level 6 therefore renders WRI's published
figures directly; Level 4 is an area-weighted majority of its children
and must say so wherever it renders. Presenting a derived value as
WRI's is a fabricated claim about someone else's data.

**Basemap tiles** — whatever tile provider is used carries its own
attribution requirement (e.g. © OpenStreetMap contributors, © CARTO).
Leaflet's attribution control stays ON. A tiny, faded, hand-rolled
credit line does not meet any of these bars.

## Scope — v1

- HydroSHEDS basins worldwide, colored by Aqueduct 4.0 water stress.
  **Two layers with a zoom swap: Level 4 at world view, Level 6 from
  zoom 5.** Level 3 was tried first and rejected — single-watershed
  projects vanished inside continent-sized polygons. Level 6 alone
  reads as texture at world zoom (~4px per basin), which is why there
  are two.
- A small set of real, registry-verified project points. **Planned;
  not yet placed — awaiting registry-verified source data.**
- Chat console foundation: a right-hand chat panel in the
  WaterBots console style, and a collapsible left-hand navigation
  rail. Foundation means the shell — no live agent answers in v1.
  Which agent staffs the map is an open maintainer decision; log
  agent questions, do not build them.
- WaterBots branding per BRAND.md. Standalone deploy. No login.

## Legacy material

The `legacy/` folder is gitignored and never publishes. Its contents
are reference only — they predate current rules and must be
reimagined, not copied. Any claim revived from legacy documents must
be re-founded on cited sources.

## Brand

Follow BRAND.md and UI_REFERENCE.md in this repo. They are gitignored
(engineer-eyes-only, not published). Never invent colors, type, or
styles outside them.
