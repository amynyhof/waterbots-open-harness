# Open items

Every open thread in this repository, in one place. Moved out of
[SESSION_HANDOFF.md](./SESSION_HANDOFF.md) on 21 Aug 2026 — that file now carries session state and
hand-off notes only, and points here.

Read this with [CLAUDE.md](./CLAUDE.md), which is the rulebook and takes precedence, with
[AGENT_RULES.md](./AGENT_RULES.md), which binds every agent, and with
[CITATIONS.md](./CITATIONS.md), which binds anything that cites a source.

**Nothing here is in progress unless it says so.** An item on this list is a thing that is known,
recorded, and waiting — not a thing being worked on.

---

## The build plan lives in its own file

**What is being built now, what comes next, and the compatibility goal are in
[BUILD_PLAN.md](./BUILD_PLAN.md).** This file holds the items themselves; that
one holds the order they are worked in. Neither repeats the other.

---

## North star — the console's journey

Recorded 21 Aug 2026 as the shape the console is being built toward. **None of this is a
commitment to dates, and only step 1 and part of step 2 exist today.** It is here so that
individual pieces of work can be read against where they are meant to lead.

| Step | Surface | Tier | State |
|---|---|---|---|
| 1 | **Eligibility** — can this project generate a countable benefit? | Free | Worksheet built; the agent behind it is in progress |
| 2 | **Basin map / Partners** — where is the water stress, and who else is working there? | Free | Map built; the partner layer is item D1 |
| 3 | **Ex-ante quantification** — what benefit would this project produce? | Free | Not started |
| 4 | **Project management** — running the project after it starts | Paid | Not started |

**The free tier ends where step 4 begins.** Everything up to and including quantification is open
to anyone; managing a live project is where the paid platform takes over.

**The theme turns marine at step 4.** The free surfaces are Frost, the light theme this repository
ships. The paid tier is Deep Marine, and the change of surface is meant to be felt — it marks
crossing from open tools into the platform, rather than being a styling preference.

> This repository is the free tier. Step 4 is named here for context only; nothing about the paid
> platform is built, described, or linked from this repo, and rule zero still holds.


---

## Families

Items are grouped by **what kind of thing the work is**. That axis was chosen because it stays
stable when an agent is renamed or a surface is added — the earlier grouping mixed a subject, an
agent and a layer, which is why two items could each have belonged in two places.

**Every item belongs to a family.** A new item joins one or starts one, and starting one is a
maintainer decision recorded with its reason. **There are no loose rows.** If an item seems to fit
nowhere, that is a sign the families are wrong, not that the item is special.

| Family | What it covers |
|---|---|
| **[Knowledge](#family-knowledge)** | What the agents are allowed to know — card sets, the source corpus, and the methods behind a number. |
| **[Agents](#family-agents)** | How agents behave, what they may say, how they hand off, and who staffs which post. |
| **[Surfaces](#family-surfaces)** | What a visitor sees and works with — the map, the worksheet, the chat layer. |
| **[Data](#family-data)** | Where real, verifiable data comes from, and whether it exists yet. |
| **[Operations](#family-operations)** | The deploy, the repository, settings and limits that outlast the session that made them. |

| # | Item | Family | State |
|---|---|---|---|
| K1 | VWBA full-docs card pass | Knowledge | open |
| K2 | Co-benefit quantification module | Knowledge | open |
| K3 | VWB Report Corpus | Knowledge | open, no action yet |
| A1 | Phoebe abstention loop | Agents | open |
| A2 | Final agent staffing | Agents | settled 24 Aug 2026 |
| A3 | Agent handoff primer | Agents | logged, no build |
| A4 | Phoebe returned an empty answer, once | Agents | to investigate |
| S1 | Collaboration and collective action as a partner-finding surface | Surfaces | open |
| S2 | The shared chat layer | Surfaces | built through Level 2 |
| S3 | Level 3 citation pop-out | Surfaces | out of scope — paid platform |
| S4 | Chat docks were thrown away on a surface switch | Surfaces | fixed 23 Aug 2026 |
| S5 | The citation line wraps awkwardly in the narrow dock | Surfaces | cosmetic, polish later |
| S6 | The dev relay resolves imports differently from production | Surfaces | open |
| D1 | Corporate water stewardship goals and target geographies | Data | open |
| D2 | Project points | Data | blocked on data |
| O1 | Rate limit on public chat | Operations | shipped in v1, number to revisit |
| O2 | Restore branch protection on `main` | Operations | due after this week’s push |
| O3 | Reverse link from waterbots.ai | Operations | live, closed 24 Aug 2026 |
| O4 | Cosmetic and housekeeping items | Operations | left alone deliberately |

> **Renumbered 23 Aug 2026.** The previous identifiers were V1–V4, B1–B3 and P1–P8. Every
> reference to them elsewhere in the repository was updated in the same edit rather than left to
> rot: AGENT_RULES.md, SESSION_HANDOFF.md, `src/chat/evidence.ts` and
> `src/chat/EvidenceBlock.tsx`.

---

# Family: Knowledge

What the agents are allowed to know — card sets, the source corpus, and the methods behind a number.

Governed by [CITATIONS.md](./CITATIONS.md). Every item here ends in a card or a cited method, or it ends in an honest gap.

## K1. VWBA full-docs card pass

**A complete read of the VWBA manual, to identify the additional card sets Phoebe needs beyond
Eligibility and Feasibility.**

The card work so far has been driven appendix by appendix, on request. This item is the systematic
pass: read the manual end to end and report which further card sets are warranted — what each would
cover, which pages found it, and how it would relate to the sets that already exist.

The output is a written proposal listing candidate sets, not the sets themselves.

Opened 21 Aug 2026. Not started.

## K2. Co-benefit quantification module

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

## K3. VWB Report Corpus

Collect and parse roughly ten public volumetric water benefit reports, then identify the must-haves
common to all of them, to shape the production report product.

Opened 20 Aug 2026; **no action taken yet**. The same cite-and-link posture applies — reports live
in `sources-local/`, which never publishes, and the repo carries citations and findings rather than
copied text.

---

# Family: Agents

How agents behave, what they may say, how they hand off, and who staffs which post.

Governed by [AGENT_RULES.md](./AGENT_RULES.md). One rulebook, one family.

## A1. Phoebe abstention loop

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

## A2. Final agent staffing — settled

**Settled by the maintainer, 24 Aug 2026. Bridget is the map's agent. Phoebe is the Eligibility and
Feasibility agent. They are two posts, not one.** The grouping of this file into families had
assumed that provisionally; it is now the ruling.

**Her console is not built.** Bridget is named in the map's chat dock and the panel says plainly
that she is not answering yet. That is honest, not provisional — she is the agent, and her chat is
coming. Nothing in the product may imply she answers today.

Her portrait ships from `brand/assets/bots/bridget.svg`.

**One question this ruling does not answer.** Her identity colour `#7FD5DF` is still provisional,
and for a different reason: BRAND.md assigns Surf no agent identity, and her value was published
under a retired agent. That is a brand decision, not a staffing one, and it is still open. The
`--bot-bridget` token carries the same note.

**What this unblocks:** the agent handoff primer (item A3), which was waiting on the roster.

---

## A3. Agent handoff primer

**A short shared primer telling each agent what the other agents cover and what the overall process
is, so that a handoff is possible.**

Agents are a team and are meant to act like one. Today they cannot: no agent has any account of what
its colleagues do, so an agent asked something outside its own sources can only abstain, even when
another agent covers the question exactly. The example that prompted this: someone asks Phoebe where
the corporate funders are working, which is Bridget's map, and Phoebe has no way to point there.

**One handoff is live as an exception, hard-coded rather than derived from a primer.** Phoebe may
name Bridget and say that Bridget covers the basin map and the water-stress data — that sentence and
nothing further. It is written into Phoebe's prompt directly, because it is a single fact that could
be stated without inventing anything. It is not a small primer; it is a placeholder for one.

The primer would carry, per agent, the plain-English scope of what they cover, what they explicitly
do not, and the sentence another agent may say when pointing at them. It would also carry the shape
of the overall journey — eligibility, then the map, then quantification — so an agent can say where
someone is and what comes next.

**The roster is now settled** — Bridget on the map, Phoebe on eligibility, two posts (item A2,
24 Aug 2026) — so this is no longer blocked on it. **One thing still limits it:** the funder
locations in the example above do not exist yet; they are item D1.

**Rung 3 of the abstention ladder is blocked separately.** [AGENT_RULES.md](./AGENT_RULES.md) states
that an agent with no covering colleague offers a human consultant. There is no consultant, no
contact route, and no page to point at, so the rung is marked not yet live and agents say that
consultants are coming rather than promising one. A contact route is a maintainer decision, not a
repository file.

The output is the primer as a written document, in the same posture as the card sets — proposed,
reviewed, then inherited by each agent's prompt the way
[AGENT_RULES.md](./AGENT_RULES.md) already is.

Opened 22 Aug 2026. **Logged only — no build.**

## A4. Phoebe returned an empty answer, once

**Seen once, on 23 Aug 2026, between 3:24 PM and 4:14 PM, during the maintainer's browser check.**
The dev server logged `phoebe: reply failed validation` and the reader was told that Phoebe answered
in a shape the console could not read. It has not happened again in any test since.

**What that message actually means is narrow, which helps.** The relay's `validate` in
`api/phoebe.ts` rejects an answer outright for **one reason only**: `reply` was missing, was not
text, or was empty once trimmed. Everything else it checks — a card number out of range, a "not yet"
with no route forward — is dropped quietly rather than failing the whole answer.

So this was not a malformed answer. **It was an answer with nothing in it.**

**This is a different fault from running out of room**, which was fixed on 22 Aug 2026 and now
reports itself honestly as having been cut off. A truncated answer fails earlier, when the
half-written JSON will not parse. This one parsed fine and was simply empty.

**What to look at.** Whether an empty reply can arrive with cards or criteria updates attached — in
which case the worksheet could move while the reader is shown an error, which would be a worse
failure than the one on screen. And whether an empty answer deserves its own honest message rather
than the generic one, since "she said nothing" and "she said something unreadable" are different
things and the current wording claims the second.

**Do not paper over it by accepting an empty reply.** Showing a blank turn would be the dishonest
fix.

Opened 24 Aug 2026. Not investigated.

---

# Family: Surfaces

What a visitor sees and works with — the map, the worksheet, the chat layer.

Every item here ends in something on screen, so the maintainer’s browser review is the gate.

## S1. Collaboration and collective action as a partner-finding surface

**Regional collective action groups as a way to find partners.**

Feasibility card B-10 does something unusual: it goes past evaluating an opportunity and suggests
joining a regional collective action group, or helping start one, as a way of finding and
supporting projects. That makes collective action a *surface* rather than only a consideration —
something a user could be pointed toward, not merely asked about.

This item is that surface: what such groups exist, where, and how someone would reach them. It is
the natural companion to D1 — one finds who funds work in a place, the other finds who is already
organised there.

Opened 21 Aug 2026. Not started.

## S2. The shared chat layer

**One chat component every open-site agent uses. Agents supply evidence; the layer renders it.**

Phoebe has a chat dock today and Bridget will need one. Built twice, they diverge — and the part
that diverges is the part that carries citations, which is the part that must not. This item is the
single component both use, and any agent after them.

**The layer owns** the numbered inline markers, the one-line expand
(source · version · section · page → canonical link, in the map's attribution-bar style), the
transcript, the composer, and the honest failure states. **Nothing citation-related lives inside
`PhoebePanel.tsx`** once this lands; the panel keeps host identity and an adapter and nothing else.

**The contract** is an `Evidence` record — a stable id, a label, the citation from the committed
card file, and the plain-English text — plus an answer carrying Level 1 prose with `[[id]]` markers
in it. Each agent has its own adapter producing that shape: Phoebe's from the card files, Bridget's
later from basin and stress data. The layer never knows which agent it is rendering.

**The guarantee this preserves** is the one in [CITATIONS.md](./CITATIONS.md): an agent places a
marker and never writes citation text, so a wrong page or an invented link is not something an
agent can produce. A marker naming a card that does not exist is dropped rather than rendered.

**It requires a change under `api/`** — Phoebe returns cited cards with no inline positions today,
so the response schema and her prompt both need the marker. Authorised by the maintainer,
22 Aug 2026.

**Level 3 is out of scope and stays out.** See the item below.

**Debt this item cleared.** `.wb-source-link` in `src/styles/base.css` was a patch on the old
footer-style source list, fixing a link that Tailwind's preflight had stripped of its underline. It
was logged as deliberately temporary rather than kept quietly, and it is **now deleted** — the
layer's `.wb-cite-line` replaces it, in the attribution-bar style CITATIONS.md requires.

### What is built, 22 Aug 2026

- `src/chat/evidence.ts` — the contract. Citation, Evidence, the turn types, the host descriptor,
  and the numbering helper. The layer defines the citation shape and each agent's adapter converts
  into it, so the second agent conforms to the contract rather than to the first agent's data model.
- `src/chat/AgentChat.tsx` — the shell. Transcript, composer, honest failure states, host identity
  from a token. It does not know which agent it is rendering.
- `src/chat/EvidenceBlock.tsx` — the citation rendering, with the Level 2 line in it.
- `src/lib/phoebeClient.ts` — Phoebe's adapter. `resolveEvidence` turns her card numbers into
  Evidence records read from the committed card files.
- `src/components/PhoebePanel.tsx` — reduced from 365 lines to identity and wiring. Her worksheet
  side effect stays hers; the layer never learns worksheets exist.

### Level 2, built 23 Aug 2026

- `layoutAnswer` in `evidence.ts` splits an answer into paragraphs and segments, numbering markers
  **in order of first appearance** rather than in whatever order the agent listed its cards.
- `AnswerBody.tsx` renders the prose with markers in it. A marker is a button, not a link: it
  discloses something already on the page, and the link out to the publisher lives inside the line
  it opens.
- `CiteLine.tsx` is the one line, in CITATIONS.md's fixed order, and the end of a citation here.
- `api/_systemPrompt.ts` — rule 7 teaches Phoebe to place `[[eligibility-4]]` at the end of the
  point a card supports, and the schema's `reply` description carries the same. She still names a
  card and nothing more.

**Three failure paths are handled rather than assumed away.** A marker naming a card that does not
exist is removed from the prose, along with the space before it where that would otherwise leave
"a claim ." on screen. A card cited without a marker still renders, under "Also rests on", so a
forgotten marker cannot silently drop a citation. A repeated marker keeps one number.

Opened 22 Aug 2026. **Built through Level 2.** Level 3 is out of scope — see S3.

## S3. Level 3 citation pop-out — paid platform, not this repo

**Maintainer ruling, 22 Aug 2026.** The free site does not build Level 3. No pop-out, no tabs.
Clicking a marker shows one line and nothing more.

The extracted chat rules describe a third level: a "read more" pop-out with a plain-English tab and
a verbatim source-text tab. **That is a paid-platform feature.** It is logged here for two reasons.

First, so nobody rebuilds it from the extracted rules by mistake — the rules are in the repository
and read as though all three levels apply here.

Second, because it could not have been built here anyway, and the reason is worth keeping.
[CITATIONS.md](./CITATIONS.md) forbids this repository holding document excerpts beyond short
attributed snippets, and neither committed card set contains a single one — checked 22 Aug 2026,
the word "Excerpt" appears zero times in either file, and the card files state outright that every
sentence is a rewrite. A verbatim source-text tab on this site would have had nothing to show.

Nothing to do. Recorded so the decision is not re-litigated from the rules alone.

## S4. Chat docks were thrown away on a surface switch

**Fixed 23 Aug 2026.** Recorded because it was a real defect found in a browser check, and because
the reasoning behind the fix is the kind that gets undone by a later tidy-up.

**What went wrong.** A visitor could work through several criteria with Phoebe, glance at the map,
come back, and find the worksheet still filled in but the whole conversation gone. The worksheet
survived because its state is held in the console shell; the conversation did not, because it is
held inside the chat dock, and the shell threw the dock away whenever you left its surface.

The mismatch is what made it bad. Half the work remembered and half of it forgotten reads as the
product losing what someone said.

**Where it was.** The console shell, `src/App.tsx` — not the shared chat layer. A chat component
holding its own conversation is correct and is what makes it reusable; the shell destroying that
component was the bug. **Bridget would have inherited it**, and so would every agent after her,
because the shell showed one dock or the other with the same either/or switch.

**The fix.** Both docks stay mounted and the one you are not on is hidden — the same treatment the
map already had a few lines above, for the same reason. Hidden means hidden from everyone: it is
taken out of the tab order and out of the accessibility tree, so nobody can type into a composer
they cannot see.

**A refresh still empties everything**, and the page still says so. That is the
no-memory-across-visits ruling of 21 Aug 2026 and it stands. Stepping over to the map and back is
not a new visit, so it must not behave like one.

**Two fixes considered and rejected.** Lifting the conversation into the shell would work, but it
puts one agent's conversation in the shell and then the next agent's too, which is the opposite of
what the shared layer is for. Saving it to browser storage would break the no-memory ruling.

**A note on how it was found.** The maintainer reported the page jumping back to the map and losing
the conversation. That specific symptom turned out to be the dev server reloading the page because
the engineer was editing files during her browser check — not a product fault. This defect was
found while chasing that, and it is the real one.

## S5. The citation line wraps awkwardly in the narrow dock

**Cosmetic. Logged 24 Aug 2026 in the maintainer's browser check, and deliberately not fixed.**

The expanded citation — document, version, section, page, then the link — is one line by design, and
in the chat dock's narrow column it wraps in a way that reads poorly. Nothing is lost or hidden;
every part of the citation is present and the link works. It is the shape of the wrap that is wrong,
not the content.

**Polish later.** Fixing it well probably means deciding what may fold and what must stay together —
the version is the part most likely to be droppable to a second line — rather than nudging the
spacing until one width looks right.

Related: the collapsed legend strip on the map wraps at very narrow columns too, recorded in the
cosmetic and housekeeping list under Operations. If both are addressed, they are one piece of work
about narrow columns rather than two.

## S6. The dev relay resolves imports differently from production

**The one path that could catch a production-only fault is the path that behaves least like
production.** Opened 24 Aug 2026, after it caused a live outage.

Phoebe's relay is served in development by a plugin in `vite.config.ts` that loads the same handler
Vercel deploys. That was deliberate — one handler, no second copy to drift — and it is still right.
But **Vite resolves module paths and Node does not resolve them the same way**. In production the
handler is compiled and run by plain Node, which requires a local import to name the file exactly,
extension included.

**What it cost.** Two imports in `api/` named their files without an extension. Every check passed:
the type checker was set to a mode that assumes a bundler will sort the paths out, and the dev relay
resolved them happily. Phoebe answered perfectly on a laptop and could never have answered once
deployed. The deploy was green, the key was correct, and every message returned a 500.

**What was done about it.** The two imports were corrected and the api folder's type-check mode was
changed to match how the code actually runs, so an extensionless import is now a build failure
rather than a production one. That guard was confirmed by removing an extension on purpose and
watching the build stop.

**Why this item stays open.** The guard closes this specific difference. It does not close the gap
that produced it. Anything else the dev relay resolves, polyfills or tolerates that Node would not
is still invisible until it reaches production — module formats, built-in APIs, environment
variables, the shape of the request object.

**What would close it.** Something that exercises the relay the way Vercel does before a push, or a
narrower guard set that names each known difference and tests for it. The first is better and
larger; the second is cheap and partial. Neither is designed yet.

**What not to do.** Do not fix this by giving development its own copy of the handler. Two copies
that drift is a worse problem than one copy resolved two ways.

---

# Family: Data

Where real, verifiable data comes from, and whether it exists yet.

The no-fabricated-data rule in [CLAUDE.md](./CLAUDE.md) is the whole difficulty in each of these. An empty, honest state beats a fabricated one.

## D1. Corporate water stewardship goals and target geographies

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

## D2. Project points — the blocked step

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

# Family: Operations

The deploy, the repository, settings and limits that outlast the session that made them.

Little of this is product, and several are not repository files at all — they are live settings the maintainer changes by hand.

## O1. Rate limit on public chat

**A cap of 20 messages per day per visitor ships in v1**, per the maintainer's ruling of
21 Aug 2026. See the Phoebe build for how it is implemented.

**This item is only to revisit the number later.** Twenty is a starting point chosen before there
is any traffic to reason from, not a figure derived from usage. Once real usage exists, the number
should be reconsidered against it — raised, lowered, or reshaped into something other than a flat
daily count.

Opened 21 Aug 2026.

## O2. Restore branch protection on `main`

Remove the owner bypass, restoring pull-request protection, after this week's build push (week
ending Sunday 23 Aug 2026). The bypass is held open deliberately as of 20 Aug 2026 so the current
build can push directly; the ruleset resumes once that push lands.

This is a live GitHub setting, not a repository file — the maintainer clears the bypass in
**Settings → Rules → Rulesets**. Until then, direct pushes to `main` are expected, not a lapse.

## O3. Reverse link from waterbots.ai — closed

**The link is live.** Confirmed by the maintainer, 24 Aug 2026. waterbots.ai links to this map.

It was always the marketing site's job rather than this repository's, and it is recorded here only
because the README describes the relationship between the two sites and has to be true about it.
Nothing further to do.

## O4. Cosmetic and housekeeping items

- **The collapsed legend strip wraps** at very narrow columns. Cosmetic; left alone deliberately.
- **`public/hydrobasins_lev06.json` is 8.44 MB in git history.** Fine in practice — `.git` is under
  4 MB because it compresses well — but it is tracked rather than generated at deploy. Reversible
  now, awkward later.
- **Data files ship with unhashed filenames**, so they do not get immutable-asset caching. They
  carry ETags with `must-revalidate`, so a rebuild will not serve stale data. Only worth revisiting
  if traffic makes it matter.

---
