# Open items

Every open thread in this repository, in one place. Moved out of
[SESSION_HANDOFF.md](./SESSION_HANDOFF.md) on 21 Aug 2026 — that file now carries session state and
hand-off notes only, and points here.

Read this with [CLAUDE.md](./CLAUDE.md), which is the rulebook and takes precedence over both.

**Nothing here is in progress unless it says so.** An item on this list is a thing that is known,
recorded, and waiting — not a thing being worked on.

---

## Contents

| # | Item | Kind | State |
|---|---|---|---|
| 1 | Project points | build | blocked on data |
| 2 | Phoebe abstention loop | agent | open |
| 3 | VWBA full-docs card pass | agent | open |
| 4 | VWB Report Corpus | research | open, no action yet |
| 5 | Final agent staffing | decision | undecided |
| 6 | Restore branch protection on `main` | repo setting | due after this week's push |
| 7 | Reverse link from waterbots.ai | external | not this repo's job |
| 8 | Cosmetic and housekeeping items | small | left alone deliberately |

---

## 1. Project points — the blocked step

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

---

## 2. Phoebe abstention loop

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

## 3. VWBA full-docs card pass

**A complete read of the VWBA manual, to identify the additional card sets Phoebe needs beyond
Eligibility.**

The card work so far has been driven appendix by appendix, on request. This item is the systematic
pass: read the manual end to end and report which further card sets are warranted — what each would
cover, which pages found it, and how it would relate to the sets that already exist.

The output is a written proposal listing candidate sets, not the sets themselves.

Opened 21 Aug 2026. Not started.

---

## 4. VWB Report Corpus

Collect and parse roughly ten public volumetric water benefit reports, then identify the must-haves
common to all of them, to shape the production report product.

Opened 20 Aug 2026 as a new family of work alongside the Phoebe card sets; **no action taken yet**.
The same cite-and-link posture applies — reports live in `sources-local/`, which never publishes,
and the repo carries citations and findings rather than copied text.

---

## 5. Final agent staffing

Undecided. Bridget is a placeholder in the map's chat dock: named in the panel, stated as
provisional, and she does not answer. Her identity colour `#7FD5DF` is provisional with her.

Her portrait ships from `brand/assets/bots/bridget.svg`. If staffing changes, that file and the
`--bot-bridget` token both need revisiting, and the `.gitignore` negation that publishes exactly
two brand files needs updating.

> **Note the two names now in play.** Bridget is the placeholder in the deployed map. Phoebe (beta)
> is the Eligibility and Feasibility specialist the card sets are being written for. Whether these
> are the same post, two posts, or one replacing the other is part of this undecided item.

---

## 6. Restore branch protection on `main`

Remove the owner bypass, restoring pull-request protection, after this week's build push (week
ending Sunday 23 Aug 2026). The bypass is held open deliberately as of 20 Aug 2026 so the current
build can push directly; the ruleset resumes once that push lands.

This is a live GitHub setting, not a repository file — the maintainer clears the bypass in
**Settings → Rules → Rulesets**. Until then, direct pushes to `main` are expected, not a lapse.

---

## 7. Reverse link from waterbots.ai

The link from the marketing site back to this map is that site's job, not this repository's. Logged
in `src/lib/site.ts`, not built.

---

## 8. Cosmetic and housekeeping items

- **The collapsed legend strip wraps** at very narrow columns. Cosmetic; left alone deliberately.
- **`public/hydrobasins_lev06.json` is 8.44 MB in git history.** Fine in practice — `.git` is under
  4 MB because it compresses well — but it is tracked rather than generated at deploy. Reversible
  now, awkward later.
- **Data files ship with unhashed filenames**, so they do not get immutable-asset caching. They
  carry ETags with `must-revalidate`, so a rebuild will not serve stale data. Only worth revisiting
  if traffic makes it matter.
