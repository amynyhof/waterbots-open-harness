# Open items

Every open thread in this repository, in one place. Moved out of
[SESSION_HANDOFF.md](./SESSION_HANDOFF.md) on 21 Aug 2026 — that file now carries session state and
hand-off notes only, and points here.

Read this with [CLAUDE.md](./CLAUDE.md), which is the rulebook and takes precedence, and with
[CITATIONS.md](./CITATIONS.md), which is binding on anything that cites a source.

**Nothing here is in progress unless it says so.** An item on this list is a thing that is known,
recorded, and waiting — not a thing being worked on.

---

## Families

Items are grouped by what they belong to rather than numbered in one flat run, because the work has
split into three streams that move independently.

| Family | What it covers |
|---|---|
| **[VWBA](#family-vwba)** | The methodology work — card sets, the source corpus, quantification |
| **[Bridget](#family-bridget)** | The map-side agent and the data that would let it answer questions |
| **[Platform and infrastructure](#family-platform-and-infrastructure)** | The repo, the deploy, the map build, and operational settings |

| # | Item | Family | State |
|---|---|---|---|
| V1 | VWBA full-docs card pass | VWBA | open |
| V2 | Co-benefit quantification module | VWBA | open |
| V3 | VWB Report Corpus | VWBA | open, no action yet |
| V4 | Phoebe abstention loop | VWBA | open |
| B1 | Corporate goals and target geographies | Bridget | open |
| B2 | Collaboration and collective action as a partner-finding surface | Bridget | open |
| B3 | Final agent staffing | Bridget | undecided |
| P1 | Project points | Platform | blocked on data |
| P2 | Rate limit on public chat | Platform | shipped in v1, number to revisit |
| P3 | Restore branch protection on `main` | Platform | due after this week's push |
| P4 | Reverse link from waterbots.ai | Platform | not this repo's job |
| P5 | Cosmetic and housekeeping items | Platform | left alone deliberately |

---

# Family: VWBA

The methodology stream. Where the card sets come from and what still needs reading.

**Card sets so far.** Eligibility (Appendix A, six cards) and Feasibility (Appendix B, ten cards)
are approved and committed. Activity (Appendix C, twenty cards) and Definitions (glossary,
thirty-four cards) are drafted and awaiting grading.

## V1. VWBA full-docs card pass

**A complete read of the VWBA manual, to identify the additional card sets Phoebe needs beyond
Eligibility and Feasibility.**

The card work so far has been driven appendix by appendix, on request. This item is the systematic
pass: read the manual end to end and report which further card sets are warranted — what each would
cover, which pages found it, and how it would relate to the sets that already exist.

The output is a written proposal listing candidate sets, not the sets themselves.

Opened 21 Aug 2026. Not started.

## V2. Co-benefit quantification module

**Per-method cards — carbon methodologies, water quality benefit accounting, the SDG-tool pattern —
so that co-benefits get numbers wherever a method exists to produce them.**

Feasibility card B-7 asks whether a project delivers benefits beyond water volume, and names water
quality, water access, carbon, biodiversity, and social and economic impacts. But it leaves those
benefits describable only in words unless a method exists to quantify them. That asymmetry is
flagged on the card itself: the volumetric benefit has a prescribed method behind it, the
co-benefits often do not.

This module closes that gap where it can be closed honestly — one card per method, each carrying
its own citation and canonical link, so a co-benefit that *can* be quantified is quantified rather
than narrated. Where no method exists, that stays the answer.

Opened 21 Aug 2026. Not started.

## V3. VWB Report Corpus

Collect and parse roughly ten public volumetric water benefit reports, then identify the must-haves
common to all of them, to shape the production report product.

Opened 20 Aug 2026; **no action taken yet**. The same cite-and-link posture applies — reports live
in `sources-local/`, which never publishes, and the repo carries citations and findings rather than
copied text.

## V4. Phoebe abstention loop

**Log every abstention visibly, so the maintainer can grade each one and decide whether it becomes
a new card.**

When Phoebe declines to answer — because no card covers the question, because the source is silent,
or because the evidence a project owner supplied does not reach any criterion — that abstention is
recorded where it can be read, not swallowed. Each logged abstention is then graded, and the
outcome is a maintainer decision: leave it as a legitimate limit of the card set, or turn it into a
new card.

This is the mechanism by which the card sets grow from real questions rather than from guesses
about what might be asked. It also keeps the honest-states rule true for the agent as well as the
map: a refusal to answer has to be visible, not silent.

Opened 21 Aug 2026. Not built.

---

# Family: Bridget

The map-side agent, and the data that would let it answer the questions people actually bring to a
map.

## B1. Corporate water stewardship goals and target geographies

**Public data — CDP disclosures, corporate sustainability reports — mapped to basins, so Bridget
can answer "who funds water work here?"**

The map already shows where water stress is. It cannot yet show who is doing anything about it.
This item is the layer that would connect the two: publicly disclosed corporate water goals and the
geographies they name, resolved to basins so the question can be asked spatially.

**The usual bar applies and is the whole difficulty.** Disclosures are public but uneven — a
company may name a country, a river, a watershed, or nothing locatable at all. Anything placed on
the map must be traceable to the disclosure it came from, and anything approximate must say so
where it renders. No inferred coordinates.

Opened 21 Aug 2026. Not started.

## B2. Collaboration and collective action as a partner-finding surface

**Regional collective action groups as a way to find partners.**

Feasibility card B-10 does something unusual: it goes past evaluating an opportunity and suggests
joining a regional collective action group, or helping start one, as a way of finding and
supporting projects. That makes collective action a *surface* rather than only a consideration —
something a user could be pointed toward, not merely asked about.

This item is that surface: what such groups exist, where, and how someone would reach them. It is
the natural companion to B1 — one finds who funds work in a place, the other finds who is already
organised there.

Opened 21 Aug 2026. Not started.

## B3. Final agent staffing

Undecided. Bridget is a placeholder in the map's chat dock: named in the panel, stated as
provisional, and she does not answer. Her identity colour `#7FD5DF` is provisional with her.

Her portrait ships from `brand/assets/bots/bridget.svg`. If staffing changes, that file and the
`--bot-bridget` token both need revisiting, and the `.gitignore` negation that publishes exactly
two brand files needs updating.

> **Two names are now in play.** Bridget is the placeholder in the deployed map. Phoebe (beta) is
> the Eligibility and Feasibility specialist the card sets are written for. Whether these are the
> same post, two posts, or one replacing the other is part of this undecided item — and the
> grouping of this file into families assumes, provisionally, that they are two.

---

# Family: Platform and infrastructure

The repository, the deploy, the map build, and settings that outlast the session that made them.

## P1. Project points — the blocked step

Nothing goes on the map until it can be verified. For each point the build needs:

1. The **registry** and a link.
2. **Project ID, name, developer, country** as that registry states them.
3. **Coordinates as published**, plus the retrieval date.

**The likely snag:** public carbon registries often publish a country or region but not point
coordinates. If so, the honest options are to ship basins only, or to place points at a documented
administrative centroid, visibly labelled approximate in both tooltip and legend. **A dot at a
plausible-looking spot is not one of the options.**

The prior prototype's hardcoded project array is **not** a source — its coordinates are rounded to
~0.05°, which reads as hand-placement.

## P2. Rate limit on public chat

**A cap of 20 messages per day per visitor ships in v1**, per the maintainer's ruling of
21 Aug 2026. See the Phoebe build for how it is implemented.

**This item is only to revisit the number later.** Twenty is a starting point chosen before there
is any traffic to reason from, not a figure derived from usage. Once real usage exists, the number
should be reconsidered against it — raised, lowered, or reshaped into something other than a flat
daily count.

Opened 21 Aug 2026.

## P3. Restore branch protection on `main`

Remove the owner bypass, restoring pull-request protection, after this week's build push (week
ending Sunday 23 Aug 2026). The bypass is held open deliberately as of 20 Aug 2026 so the current
build can push directly; the ruleset resumes once that push lands.

This is a live GitHub setting, not a repository file — the maintainer clears the bypass in
**Settings → Rules → Rulesets**. Until then, direct pushes to `main` are expected, not a lapse.

## P4. Reverse link from waterbots.ai

The link from the marketing site back to this map is that site's job, not this repository's. Logged
in `src/lib/site.ts`, not built.

## P5. Cosmetic and housekeeping items

- **The collapsed legend strip wraps** at very narrow columns. Cosmetic; left alone deliberately.
- **`public/hydrobasins_lev06.json` is 8.44 MB in git history.** Fine in practice — `.git` is under
  4 MB because it compresses well — but it is tracked rather than generated at deploy. Reversible
  now, awkward later.
- **Data files ship with unhashed filenames**, so they do not get immutable-asset caching. They
  carry ETags with `must-revalidate`, so a rebuild will not serve stale data. Only worth revisiting
  if traffic makes it matter.
