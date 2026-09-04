# WaterBots Open Harness

An interactive world map of HydroSHEDS watershed basins, coloured by water stress, and an
eligibility console where an AI agent helps you work out whether a water stewardship project can
generate a countable water benefit.

It deploys standalone and is linked from [waterbots.ai](https://waterbots.ai).

## Status

**The basin map is live at [map.waterbots.ai](https://map.waterbots.ai).** It renders real
HydroSHEDS basin geometry coloured by real WRI Aqueduct values, with no fabricated data anywhere in
it.

**The eligibility console is live, and Phoebe answers there.** Confirmed against production on
24 Aug 2026, and the daily cap confirmed there on 25 Aug 2026, when it shipped. She is free to use
and capped at **20 messages a day per visitor** — enough for a real
working session, and what keeps her open to anyone. When someone reaches the cap she says so plainly
and says when it comes back. If her relay is ever unconfigured she states that she is not connected
rather than pretending to answer.

Every open thread lives in [OPEN_ITEMS.md](./OPEN_ITEMS.md), grouped into five families:
Knowledge, Agents, Surfaces, Data and Operations. What is being built next, and why, is in
[BUILD_PLAN.md](./BUILD_PLAN.md).

The largest gap: **project points are not placed**, because nothing goes on the map until there is
registry-verified source data with published coordinates.

**The console has four surfaces, in the production shape**, from 2 Sep 2026: a journey bar of six
phases across the top, four tabs beneath it — Dispatch, Eligibility, Partners (Map), Quantify — and
the desk opens first. **Wellington's desk** holds the visit's project context and rows that derive
from the visit and are never invented: Phoebe's eligibility result, the basin pinned on the map,
Calvin's screening figure, and always, last, *Save this project and sign up*, which opens
waterbots.ai and carries nothing across. Nothing is kept between visits.

**The quantification step carries three screening packs** — the water volume a household or
community supply project provides, and the carbon reduction a safe-drinking-water project screens
at under the legacy and the Paris-aligned versions of the Gold Standard methodology, with the
transition delta between the two. **Every number it produces is a screening estimate**: anticipated,
not delivered, not verified, and needing consultant review. Nothing is filled in for a visitor, and
reloading clears it.

**Wellington is the Team Lead, and his chat is live on the desk** from 3 Sep 2026. He welcomes a
visitor, learns the project in plain words, and routes: Phoebe for whether it can count, the
Quantify tab for figures, the map for basins, waterbots.ai for saving and for his full desk. He
quotes no figure from any worksheet, invents no teammate or capability, uses screening language
only, and never presses anyone to sign up. Thirty messages a day, counted separately from Phoebe's
twenty, and nothing kept between visits. **Bridget is the map's agent and Calvin is the
quantification step's.** Neither console is built yet — each panel is there, each agent is named in
it, and each says plainly that it is not answering.

## What is built

- **Basin map.** HydroSHEDS HydroBASINS Level 4 at world view, swapping to Level 6 from zoom 5.
- **Water stress.** WRI Aqueduct 4.0, joined at 100% coverage. Level 6 values are WRI's published
  figures; Level 4 is an area-weighted majority of its children, labelled as derived wherever it
  renders.
- **Eligibility worksheet.** Six criteria, all of which must be met, each showing what would change
  a shortfall rather than only reporting one. **The six criteria decide whether a project can
  qualify at all.** Ten further considerations sit below them and do a different job: they help you
  choose well between projects that already qualify.
- **Phoebe (beta).** The eligibility and feasibility agent, answering from a fixed set of rule cards
  and abstaining when none covers the question.
- **The desk.** Wellington's dispatch desk, in the shape of the production console's: the visit's
  project context, rows that derive from this visit only, his live chat under the desk divider —
  replies land on the desk, never on a row — and the save door to waterbots.ai. A click on the map
  pins a basin for the visit. What the visitor tells him fills the context card, labelled as from
  the conversation, and never overwrites what they typed.
- **Quantification step.** Three method packs in one pack-keyed slot. **VWBA 2.0 · D-3 Volume
  Provided**, for household and community water supply, ex-ante, Option 3: three questions can stop
  the number outright, the formula is written out with the visitor's own figures in it, and **a
  blank without-project volume is never read as zero**. **Carbon · Legacy V1** and **Carbon · PAA
  v2.0**, Gold Standard's *Emission Reductions from Safe Drinking Water Supply* in both versions,
  from one module that differs in one input — the non-renewable share of biomass, filled from the
  CDM's expired defaults on the legacy tab and from MoFuSS on the PAA tab, both cited. The emission
  factor is derived under a stated standard profile and labelled derived; the PAA tab says which
  v2.0 adjustments it does not apply; and the transition delta between the two is one line under
  the tabs. **Blank is never zero on any pack.**
- **A shared chat layer** that every agent on this site uses, so citations are rendered one way
  rather than reinvented per agent.

## Phoebe, and how citations work here

Phoebe reads from **two committed card sets** — six eligibility criteria and ten feasibility
considerations, both drawn from Volumetric Water Benefit Accounting 2.0 — and nothing else. Asked
about anything outside them, she says she does not have that card yet rather than guessing. An
honest gap is more useful than an answer nobody can tell is wrong.

**She never writes a citation.** She names a card and places a marker in her answer; the console
looks that card up in the committed file and renders the citation itself. A wrong page number or an
invented link is therefore not something she can produce. A marker naming a card that does not exist
is dropped rather than shown.

Clicking a marker opens one line: the document, its version, the section, the page, and a link to the
publisher's own page. Every card carries that link — no canonical link, no card.

The rules behind this are published, not internal: [CITATIONS.md](./CITATIONS.md) governs what a
citation is and how it renders, and [AGENT_RULES.md](./AGENT_RULES.md) governs how any agent here
speaks, when it must abstain, and what it may say about work that is not built yet.

**She is in beta**, and the console says so where she appears. Nothing she produces is a decision,
and no standards body endorses, certifies or is affiliated with this project.

## Roadmap

**Coming: project mapping and impact quantification. Developers will place verified project
locations and boundaries on this map, alongside estimated and verified impact figures logged per
project — groundwork for consortium building and large-volume impact partnerships.**

Nothing is placed until it can be verified against its source registry — an empty map is honest, an
invented one is not. The same applies to impact figures: an estimate is labelled an estimate, and a
verified figure names what verified it.

## Running locally

```bash
npm install
npm run dev
```

The dev server runs on **port 5173** (pinned, `strictPort`).

The map needs nothing further. **Phoebe needs an Anthropic API key** in the environment *before* the
server starts, since her relay reads `process.env`:

```powershell
$env:ANTHROPIC_API_KEY = "..."
npm run dev
```

Without it she does not fail silently — the console states that she is not connected and why.

**The daily cap needs a shared store, and locally it has none.** On a laptop Phoebe answers
uncapped and writes a line to the server log saying so; that is development only. Anywhere the
deployment platform runs her, a missing store stops her answering at all rather than quietly
serving a public endpoint with no limit.

### Settings a deployment needs

| Setting | What it is for |
|---|---|
| `ANTHROPIC_API_KEY` | Phoebe's relay. Without it she says she is not connected. |
| `KV_REST_API_URL` and `KV_REST_API_TOKEN` | The shared store that holds the daily count and the abstention log. `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are read as an alternative pair. |
| `PHOEBE_VISITOR_SALT` | A long random secret mixed into the scrambled visitor identity. **Set once and never changed** — changing it makes every visitor look new and resets every count to zero. |
| `PHOEBE_LOG_KEY` | The secret that opens `/api/abstentions`. Without it that address returns nothing. |
| `VITE_CARTO_KEY` | The basemap key. **Read at build time, not at runtime** — Vite bakes `VITE_`-prefixed settings into the bundle when it builds, so it must be present before the build runs. Without it the map still works and every tile is watermarked. |

No visitor's network address is ever stored. It is scrambled together with the secret above and
only the result is kept, under a key that expires when the day does. The abstention log holds no
visitor identifier at all, so a question can never be traced back to a person.

### Confirming the build

~~Eleven checks~~ ~~Twelve checks~~ ~~Thirteen checks~~ **Fourteen checks**, all of which must pass.
Eight guard against faults that nothing else here can see:
`check-attribution` reads the built bundle rather than the source, so it catches a refactor that
drops a required licence statement while leaving the site looking perfectly correct;
`check-api-exports` catches a relay that would build cleanly and then answer nothing once deployed;
`check-cap` proves the twentieth message passes and the twenty-first is refused, which would
otherwise cost twenty-one real messages to confirm by hand; `check-basemap-key` reads the built
bundle for the basemap key, because a build without one produces a map that works, looks healthy,
and is watermarked on every tile; and `check-reply-guard` proves the relay refuses an answer too
short to be one, because that fault shows up in about two requests in a hundred and waiting for it
is not a test; `check-vwba-d3` proves the water pack answers the way the method says — above all
that a blank without-project volume is never treated as zero, which is the one way this calculation
can produce a large, confident, wrong number with nothing looking broken; and `check-gs-sdws` proves
both carbon packs reproduce every recorded reference figure to four decimal places, that the
derived emission factor lands on every recorded point, and that a blank share, a blank leakage
figure or an unchosen method leaves the result honest rather than zero; and `check-wellington`
proves his relay checks the model's output rather than trusting it, that his region of the primer
reaches him and only him, that no prompt tells any agent to say anything word for word, that a typed
context entry is never overwritten by what he heard, and that the shell holds his one conversation.

```bash
node scripts/check-basins.mjs
node scripts/check-stress.mjs
node scripts/check-palette.mjs
node scripts/check-cards.mjs
node scripts/check-api-exports.mjs
node scripts/check-visitor-id.mjs
node scripts/check-cap.mjs
node scripts/check-reply-guard.mjs
node scripts/check-vwba-d3.mjs
node scripts/check-gs-sdws.mjs
node scripts/check-wellington.mjs
node scripts/build-prompt-modules.mjs --check
npm run build && node scripts/check-attribution.mjs && node scripts/check-basemap-key.mjs
```

`check-cap` runs the real relay code against a **stand-in store** on your own machine — the
counting, the refusal, the refund and the abstention log are the files that deploy; only the
database is stood in for. That stand-in is not fabricated data: the rule against fabricated data
protects what a visitor is shown, and a test stand-in that never reaches a person is a different
thing. What it cannot prove is that the real store behaves like the stand-in; only a deployed
address and a browser can.

## Licence

The **source code** in this repository is licensed under the Apache License 2.0 — see
[LICENSE](./LICENSE).

**The data is licensed separately, and not under Apache 2.0.** Two datasets are used, under two
different licences, each with its own attribution requirement. Both attributions are displayed in
the product; neither is satisfied by a combined credit line.

---

### HydroSHEDS / HydroBASINS — basin boundaries

HydroBASINS is distributed under the HydroSHEDS License Agreement — a custom World Wildlife Fund
licence, **not** a Creative Commons licence. It is free for non-commercial and commercial use,
subject to the terms of that agreement.

The following copyright statement is required by Exhibit B of the License Agreement and is
reproduced verbatim, with this product's name filled in:

> This product **WaterBots Open Harness** incorporates data from the HydroSHEDS version 1 database
> which is © World Wildlife Fund, Inc. (2006-2022) and has been used herein under license. WWF has
> not evaluated the data as altered and incorporated within **WaterBots Open Harness**, and
> therefore gives no warranty regarding its accuracy, completeness, currency or suitability for any
> particular purpose. Portions of the HydroSHEDS v1 database incorporate data which are the
> intellectual property rights of © USGS (2006-2008), NASA (2000-2005), ESRI (1992-1998), CIAT
> (2004-2006), UNEP-WCMC (1993), WWF (2004), Commonwealth of Australia (2007), and Her Royal Majesty
> and the British Crown and are used under license. The HydroSHEDS v1 database and more information
> are available at https://www.hydrosheds.org.

Attribution is **text only**. No WWF logo, trademark, trade name or service mark is used anywhere in
this product.

**Scientific citations:**

- Lehner, B., Grill G. (2013): Global river hydrography and network routing: baseline data and new
  approaches to study the world's large river systems. _Hydrological Processes_, 27(15): 2171–2186.
  Data is available at www.hydrosheds.org.
- Lehner, B., Verdin, K., Jarvis, A. (2008): New global hydrography derived from spaceborne
  elevation data. _Eos, Transactions, AGU_, 89(10): 93-94.

---

### WRI Aqueduct 4.0 — water stress

Water stress data is from WRI Aqueduct 4.0, © World Resources Institute, licensed under the
[Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

**Suggested citation**, as published by WRI:

> Kuzma, S., M.F.P. Bierkens, S. Lakshman, T. Luo, L. Saccoccia, E. H. Sutanudjaja, and R. Van Beek.
> 2023. "Aqueduct 4.0: Updated decision-relevant global water risk indicators." Technical Note.
> Washington, DC: World Resources Institute. Available online at: doi.org/10.46830/writn.23.00061.

**Level 6 is as-published; Level 4 is derived.** Aqueduct 4.0 publishes water stress for HydroSHEDS
**Level 6** basins, which is what this map renders at detail zoom — those values are WRI's own,
deduplicated across the basin × subnational-admin rows, with no aggregation and 100% coverage.

The **Level 4** world view has no published Aqueduct value, so each basin takes an **area-weighted
majority** of its Level 6 children: a majority rather than a mean, because the categories are
ordinal bands and two of them are not points on the scale. That derivation is ours, and is labelled
as such wherever it renders. `No Data` and `Arid and Low Water Use` are carried through as their own
categories and are never folded into a stress level.

---

### Source documents

The methodology this console follows is **cited and linked, never reproduced**. Volumetric Water
Benefit Accounting 2.0 is published by the World Resources Institute with LimnoTech, Bluerisk and
the Bonneville Environmental Foundation, and is available at
[doi.org/10.46830/wrigb.23.00112](https://doi.org/10.46830/wrigb.23.00112).

The rule cards in this repository are **rewrites in our own words**, each carrying its own citation
and a link to the publisher's page. No source PDF, and no extract beyond a short attributed snippet,
is held here.

### Basemap

Map tiles carry their own attribution, displayed in the map's attribution control alongside the
above. Leaflet's attribution control is always enabled.

Tiles come from **CARTO**, on their Voyager style, and CARTO's free tier requires an API key and
requires that the CARTO and OpenStreetMap attribution stays visible. That is what the free tier is
in exchange for, so the attribution control is not decoration here — it is a licence condition,
and `check-attribution` fails the build if either credit goes missing.

**The key is a build-time setting** (`VITE_CARTO_KEY`) and is not held in this repository. A build
without it produces a working map with every tile watermarked, which is why
`check-basemap-key.mjs` reads the built bundle and fails rather than letting it ship.

## Theme

**There is one brand and it is light.** The brand book, **version 4.1 from 30 Aug 2026**,
supersedes the two-theme era, and `src/styles/tokens.css` carries one set of surface tokens with no
theme class to switch between. ~~BRAND.md v3, brought by the maintainer on 28 Aug 2026~~ — version 3 brought the
one light brand on 28 Aug and held for two days; version 4 kept it and added what this site had
worked out.

> **Corrected 29 Aug 2026.** This section read: ~~"The free surfaces render on **Frost**, the light
> theme. They are public surfaces with no login, and BRAND.md's surface rule puts public and
> orientation surfaces on light. The Deep Marine tokens are retained in `src/styles/tokens.css` as
> correct reference but no component here applies them. Note that Frost has no four-surface ladder:
> BRAND.md publishes `--card` and `--raised` as the same white, and authors the ladder for Deep
> Marine only."~~ Every sentence was true of the two-theme book. Version 3 carries no Deep Marine,
> no surface rule choosing between two themes, and no four-surface ladder, so the Deep Marine tokens
> were deleted rather than left as reference to a book that no longer exists.

**What survives unchanged is the structure**, because the book still publishes it: `--card` and
`--raised` are the same `#FFFFFF`, and separation is carried by the 1px `--line` border rather than
by fill — §2.3, three planes and no fourth, with the hairline doing the structural work.

## Brand decisions

The brand book does not publish every value this project needed. Where one was missing it was
**derived from the book's own formulas**, never invented, and the derivation is recorded so it can
be checked. **Several of these were carried up into version 4 on 30 Aug 2026** and are now the
book's own — each says so below:

- **The frame and the content have different grounds** — maintainer's ruling, 29 Aug 2026.
  `--paper` `#F6F5FA` is the **content** canvas, carried by the map and the worksheet. `--frame`
  `#FBFBFE` is the **frame**: top bar, rail, and both docks' ground. Measured, the frame is
  **1.96 CIE L\* lighter** than the content canvas and carries **41% less chroma** — it recedes by
  being lighter and less tinted rather than by being a darker plane beneath.

  > **Corrected the same day.** Earlier on 29 Aug this said ~~"`--chrome` — retired. Chrome takes
  > the canvas."~~ That reading was right that chrome gets no plane *below* the canvas and wrong
  > that the frame and the content share one ground. It was built, looked at, and the frame and the
  > map were found to be tonally fighting.

  ~~**Proposed for the master brand book:**~~ **In the book from version 4, §2.3** — *the warm
  canvas belongs to content; the frame sits one step lighter and quieter*, carried in whole in the
  maintainer's own words. The active navigation item rises one plane to `--card` **with the 1px
  hairline §2.3 pairs with a white card** — a fill alone is 1.31 L\* against the frame and nearly
  invisible; that is in §2.3 too. The full record is item S9 in [OPEN_ITEMS.md](./OPEN_ITEMS.md).
- **Phoebe's identity colour** — **Anemone `#A04E7E`**, with **Anemone Light `#C36E9F`** on her
  antenna. Anemone was held in the book as an unclaimed spare, kept so a future role would not have
  to re-open the search; this is that use. **Version 4 §6 puts Phoebe on the roster by name**, under
  a rule that lets a surface extend the shared crew with its own agents, so she is no longer an
  agent the book does not know about. Anemone Light is a new value set by the maintainer, one
  lightness step above Anemone at the same hue — the same step the published Plum-to-Iris pair
  makes. At 5.40:1 on white the head colour is safe on text; **the antenna value is not**, and is
  used only for that stroke.
- **Bridget's identity colour** — **Surf `#14C8D9`**, assigned to her by name in the book's §6.
  At 2.04:1 against white it carries her keyline, ring and wash, never text; her name is set in
  `--ink`. Her portrait was always drawn in Surf, so this makes the ring and the artwork agree.

  > **Corrected 29 Aug 2026.** This read: ~~"`#7FD5DF`, the Surf-family lifted value.
  > **Provisional** until map staffing is settled."~~ That value came from a retired agent, and the
  > reason for it expired when the book named Bridget's colour outright.

  It is deliberately the same value as `--state-live`. The book's §2.6 accepts Surf's double duty on
  the condition that **form carries the meaning**: a status may only be a dot or a keyline on a data
  row, an identity only a bubble, portrait, surface accent or keyline.
- **Warning text is a darkened coral** — **`#BF4949`**, in `--state-warn-text`. The book's §2.5
  rule is that a role colour used as **type** is darkened to clear 4.5:1, the same hue mixed toward
  ink, while the dot or fill value is unchanged. Coral `#E25858` set as 11px type measured
  **3.52:1** against the frame; `#BF4949` measures **4.77:1** there and clears 4.5:1 on every ground
  this brand has. Hue is held exactly; lightness and chroma are reduced together.

  > **This one went the other way.** The book published no darkened coral, so the value was
  > proposed, measured and ruled before it was used. Measuring the book's own three darkened values
  > at the same time showed that **live and approved did not reach the contrast §2.5 promises** —
  > 3.99:1 and 3.83:1 against the frame. Corrected values were accepted into the book at
  > **version 4.1**, and **verification was measured and left unchanged**. Nothing on this site
  > rendered wrongly: neither colour is used as type here. Item S9 in
  > [OPEN_ITEMS.md](./OPEN_ITEMS.md) carries it.

- **The three shadow values** — `--shadow-sm`, `--shadow-md` and `--shadow-lg` are the book's own,
  published in §4 on 30 Aug 2026. Two of them replaced values this repository had derived and sent
  up for ratification; the book's carry a **negative spread**, which §4 says is what keeps a shadow
  from reading as a grey box.
- **Stress ramp** — five bands derived from Surf, Amber and Coral, with monotonically descending
  lightness and chroma separating the scale from the two categories that are not on it. Both
  properties are asserted by `scripts/check-palette.mjs` rather than trusted to the eye.

**Bridget is the map's agent**, confirmed 24 Aug 2026. ~~Her identity colour stays marked
provisional above because BRAND.md assigns Surf no agent identity and her value was published under
a retired agent — that is a brand question, separate from staffing, and it is still open.~~
**Struck 30 Aug 2026.** It was left behind when the value settled: the book assigns Bridget Surf by
name, the provisional value is gone from the code, and nothing above is marked provisional any more.
**She is one agent shared across both properties**, not a copy — version 4 §6 says so outright.

## How this repository is run

The rules are published rather than kept internal, because a public project that cites sources
should be checkable on how it works as well as on what it says.

| File | What it governs |
|---|---|
| [CLAUDE.md](./CLAUDE.md) | Engineering rules, and the rule that this repository sees only itself |
| [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) | How work moves: propose, approve, build, review, commit |
| [AGENT_RULES.md](./AGENT_RULES.md) | How an agent speaks, and when it must abstain |
| [CITATIONS.md](./CITATIONS.md) | What a citation is and how it renders |
| [OPEN_ITEMS.md](./OPEN_ITEMS.md) | Every open thread, grouped into five families |
| [OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md) | Closed items, kept in full rather than deleted |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | What is being built next, and why |
| [OPEN_ITEMS.md](./OPEN_ITEMS.md) | Every open thread, in five families |
| [SESSION_HANDOFF.md](./SESSION_HANDOFF.md) | Where things stand **now**, for whoever picks the work up |
| [BUILD_LOG.md](./BUILD_LOG.md) | How it came to stand there — append-only, one entry per session |
| [DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) | Superseded by the brand book; kept as history |

## Not in this repository

Brand source files, design references, prior-prototype material and source PDFs are held locally and
are gitignored. They are not published here.
