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
3. [DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) —
   **superseded by the brand book on 28 Aug 2026 and still read**, because
   it is history that explains why three things here are the way they are
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

**Three root rulebooks, one home per rule.** CLAUDE.md owns engineering
work and the language rules; CITATIONS.md owns what a citation is and
how it renders; AGENT_RULES.md owns how an agent behaves and speaks. A
rule restated in two of them is a defect, not thoroughness — the copies
drift, and then nobody can tell which one is current.

**The count has moved twice.** ~~It became four on 27 Aug 2026, when the
design canon arrived.~~ **It is three again from 29 Aug 2026**, because
the canon was superseded by the brand book and design values now live in
the brand book, which is gitignored and is not a published rulebook. It
said three for as long as there were three, four for two days, and three
again.

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
  the map and Calvin staffs quantification; neither chat is built, and
  both panels say so plainly.
- **Quantification, the third surface, from 1 Sep 2026.** The step holds
  **method packs** — one tool per way of working a number out — and the
  first is fitted: VWBA 2.0 · D-3 Volume Provided, for household and
  community water supply, ex-ante. **The surface is pack-keyed and is
  never typed to one method**, because the same seat must later hold
  carbon screening and the other D-methods. **Everything it produces is
  a screening estimate** — anticipated, never delivered and never
  verified — and it carries a consultant-review tag wherever it renders.
  **A blank without-project volume is never read as zero.**
  **Three packs from 2 Sep 2026:** two carbon packs joined, Gold
  Standard's safe-drinking-water methodology in its legacy and its
  Paris-aligned versions, one module differing in one cited input, with
  the transition delta between them. **Blank is never zero on any pack**,
  and a default with no source asks instead.
- **The free desk, the fourth surface, from 2 Sep 2026 — and the console
  in the production shape.** A journey bar of six phases across the top
  of the centre, four tabs beneath it, the desk first. **Wellington,
  Team Lead, hosts it, extended from the shared crew and never forked**;
  he answers on the paid site, and the one composer says so. **Rows
  derive from this visit and are never invented**, the last is always
  the save door to waterbots.ai, and nothing is persisted here. **Production
  is canon for the console's shape** — layout, row anatomy and density
  are taken from saved production pages brought in by the maintainer's
  hand, and none of their data, composers, organisations, roles or
  saving.
- WaterBots branding per the brand book. Standalone deploy. No login.

## Legacy material

The `legacy/` folder is gitignored and never publishes. Its contents
are reference only — they predate current rules and must be
reimagined, not copied. Any claim revived from legacy documents must
be re-founded on cited sources.

## Brand and design — see the brand book

Follow the brand book and UI_REFERENCE.md in this repo. They are
gitignored (engineer-eyes-only, not published). Never invent colors,
type, or styles outside them.

**The brand book lives at `brand/BRAND.md`.** ~~It lives at the
repository root as `BRAND.md`.~~ **Corrected 30 Aug 2026** — it moved
into `brand/` alongside the asset tree when version 4 arrived. It is
gitignored twice over, by the bare `BRAND.md` rule and by `brand/*`, so
it still does not publish.

~~**BRAND.md is the brand book, version 3, and it governs all design on
this site.**~~ ~~**It is version 4 from 30 Aug 2026.**~~ ~~**It is version
4.1**~~ **It is version 4.2 from 31 Aug 2026**, and it governs all design on
this site. Version 3 arrived on 28 Aug 2026 and held for two days; version 4
and then 4.1 both landed on 30 Aug; 4.2 followed on 31 Aug. One light brand,
still superseding the two-theme era. It is complete on its own page and it
governs both properties.

**What version 4 changed**, all of it carried up from this site's work:
the roster-extension rule in §6, with **Phoebe's own entry**; `--chrome`
retired in §2.3, with the frame-versus-content line and its worked
example; the **three shadow values written into §4**, which had carried
the names and no values; and the **Slate map wash** recorded in §7. A
sixth change — Driftwood into use — was proposed and reversed the same
night, and §2.1 keeps the strike rather than erasing it.

**One line of §6 was struck and corrected in place on 2 Sep 2026**, by the
maintainer's ruling: Wellington's role label is **"Team Lead"** everywhere he
is named — not "Floor manager", not "Host" as a title. The book stays at
version 4.2; the strike is kept.

**What version 4.2 changed, and it is the second amendment written into the
book from inside this repository.** §6 only. **Calvin's row is filled in** — he
is the free calculator, giving screening-level estimates **on the open site as
well as in the Commons**, and he **never works in the paid console**. The
Commons-only line is struck in place. His accent is **Plum `#5848A8`** and his
portrait was **drawn here in the house form**, both by the maintainer's ruling
of 31 Aug 2026 and both **knowing exceptions to §6's own rules** — the book
forbids pointing an accent at a second agent, and says his portrait arrives
with the Commons design. They are recorded in the book as exceptions rather
than folded in silently. **Mint was the obvious pick and was refused on the
merits**: §2.1 also makes Mint *Success / approved*, and a screening surface
whose whole message is *not verified* must not wash green. The version bump
itself was the engineer's call, made so the documents naming the book's version
did not start telling a lie; the maintainer let it stand.

**What version 4.1 changed, and it was the first amendment written into
the book from inside this repository.** §2.5 only. Coral gained a text
value it had never had, and the published live and approved text values
were corrected, because measuring them against a shipped surface showed
they did not reach the 4.5:1 the same sentence promises. Verification was
measured too and is unchanged — a published value that already works is
left alone. Maintainer's ruling, 30 Aug 2026; **the engineer wrote it
into the book by her instruction, which is the exception, not the rule.**
Everything else still arrives by her hand.

~~**[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) is
binding**, and it is the only design input from outside this
repository.~~ **Corrected 29 Aug 2026: the canon is SUPERSEDED by the
book** and says so at its own head, by the maintainer's hand. Its
rulings were not wrong — the left rail, the "<" navigation and the chat
dock rules it confirmed were carried into the book and live there now.
It stays published as history. **Where the canon and the book disagree,
the book wins.**

**What the book does not carry is raised, never invented** — §0 is
explicit. ~~Four such rulings were made on 29–30 Aug 2026 and are owed to
the master book by the maintainer's hand~~; **all four landed in version
4 on 30 Aug 2026.** Item S9 in [OPEN_ITEMS.md](./OPEN_ITEMS.md) remains
the one home for them, and it now records where each one sits in the
book. ~~Two fresh raises took their place and are open in the same
item.~~ **Both are closed as of 30 Aug 2026** — the shadow values took the
book's, and coral gained a darkened text value at 4.5:1. Item S9 carries
both.

## Housekeeping — machine facts, not rules

**Small facts about this machine that cost a session's time when they
have to be rediscovered.** Rules live above and in the rulebooks; this is
only where things are.

- **The GitHub command-line tool is installed and signed in, but is not
  on the shell's PATH.** Call it at
  `C:\Program Files\GitHub CLI\gh.exe`. Found 30 Aug 2026, when
  `gh` alone reported "command not found" and looked, wrongly, like a
  missing tool. The rule about who opens pull requests is unchanged and
  lives in
  [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md).
- **The brand book carries Windows line endings** and is gitignored, so
  nothing normalises it. Edit it preserving them.
