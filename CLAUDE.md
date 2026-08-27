# CLAUDE.md — WaterBots Open Harness

This file is the rulebook for AI engineering work in this repository.
Read it fully before doing anything.

## Start here — PROCESS_RULES_for_ShellB.md

**[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) governs how
work is run here**, and every session opens with it. It carries the order
work moves in — propose, approve, build, eyeball, commit word — how the
engineer is expected to speak, how open items are grouped, and what has to
be true before a session closes.

**Read these six before doing anything else, every new session:**

1. This file, CLAUDE.md
2. [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) — how
   work is run
3. [DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) — which
   design rules apply here, and at what strength
4. [BUILD_PLAN.md](./BUILD_PLAN.md) — what is being built now, what
   comes next, and the compatibility goal
5. [OPEN_ITEMS.md](./OPEN_ITEMS.md) — every open item, grouped into
   families, and the north star
6. [SESSION_HANDOFF.md](./SESSION_HANDOFF.md) — where the last session
   left things

**The session has not started until all six are read.** The opening
ritual itself is owned by
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md); this list is
the front door pointing at the same six, not a second rule. **The count
has moved twice in one day, both on the maintainer's ruling of
27 Aug 2026.** It was five against the process rules' four, which had left
themselves off their own list; then the design canon arrived and joined
the reads. Six is right.

Where this file and the process rules both speak to a point — proposal
before code, one step at a time, honest states, no fabricated data — they
agree. If they ever diverge, that is a defect to raise with the
maintainer, not a choice to make.

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

**This section is the single home for these four rules.** They bind
engineering prose, product copy, and agent answers alike;
CITATIONS.md and AGENT_RULES.md point here rather than restating them.

- The words "validate/validation" are not used; say "confirms outputs"
  or reference the test suite.
- The word "golden" is not used; say "reference".
- Plain words lead, acronym in parentheses on first use. In an agent
  conversation the acronym may stand bare after that first use; see
  AGENT_RULES.md.
- A packaged knowledge set is a **"Knowledge Pack."** Not "cartridge,"
  not "methodology pack." New copy uses the word; nothing already
  written is reworded for it.

## Citations — see CITATIONS.md

**CITATIONS.md in this repo is binding** on every surface, rule card,
README, and future agent answer. It carries the four-part citation
shape every cited claim must have, the rule that this repo holds rule
cards and never source PDFs or excerpts beyond short attributed
snippets, and the visual format citations render in. Read it before
writing anything that cites a source. It is published, not
engineer-eyes-only.

Where CITATIONS.md and this file both speak to a point — the data
licensing requirements below, derived values — they agree. If they ever
diverge, that is a defect to raise with the maintainer, not a choice to
make. Plain-words-first is no longer one of those points: it has a
single home in Language rules above, and CITATIONS.md points at it.

## Agents — see AGENT_RULES.md

**AGENT_RULES.md in this repo is binding** on every agent on this site.
It carries how an agent speaks, the three outcomes, the abstention
ladder, and what an agent may say about itself and about its
colleagues. It is published, not engineer-eyes-only.

**Four root documents, one home per rule.** CLAUDE.md owns engineering
work and the language rules; CITATIONS.md owns what a citation is and
how it renders; AGENT_RULES.md owns how an agent behaves and speaks;
DESIGN_CANON_for_ShellB.md owns which design rules apply here and at
what strength. A rule restated in two of them is a defect, not
thoroughness — the copies drift, and then nobody can tell which one is
current.

**It became four on 27 Aug 2026**, when the design canon arrived. It
said three for as long as there were three.

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
  rail. **Foundation meant the shell, and v1 shipped that way — but
  Phoebe has answered for real since 24 Aug 2026**, from two committed
  card sets, capped at 20 messages a day per visitor. Bridget staffs
  the map and her chat is not built; the panel says so plainly.
- WaterBots branding per BRAND.md. Standalone deploy. No login.

## Legacy material

The `legacy/` folder is gitignored and never publishes. Its contents
are reference only — they predate current rules and must be
reimagined, not copied. Any claim revived from legacy documents must
be re-founded on cited sources.

## Brand and design — see DESIGN_CANON_for_ShellB.md

Follow BRAND.md and UI_REFERENCE.md in this repo. They are gitignored
(engineer-eyes-only, not published). Never invent colors, type, or
styles outside them.

**[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) is
binding**, and it is published. It arrived by the maintainer's hand on
27 Aug 2026, the way the process rules did, and it is the only design
input from outside this repository. It does not hold values — BRAND.md
and UI_REFERENCE.md own those. It holds the ruling about which of them
apply here and at what strength.
