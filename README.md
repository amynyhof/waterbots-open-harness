# WaterBots Open Harness

An interactive world map of HydroSHEDS watershed basins, coloured by water stress, and an
eligibility console where an AI agent helps you work out whether a water stewardship project can
generate a countable water benefit.

It deploys standalone and is linked from [waterbots.ai](https://waterbots.ai).

## Status

**The site is live at [open.waterbots.ai](https://open.waterbots.ai)**, its address from 28 Oct 2026;
the old map.waterbots.ai forwards there. The basin map renders real
HydroSHEDS basin geometry coloured by real WRI Aqueduct values, with no fabricated data anywhere in
it.

**The eligibility console is live, and Phoebe answers there.** Confirmed against production on
24 Aug 2026, and the daily cap confirmed there on 25 Aug 2026, when it shipped. She is free to use
and capped at **30 messages a day per visitor** (twenty until 23 Sep 2026) — enough for a real
working session, and what keeps her open to anyone. When someone reaches the cap she says so plainly
and says when it comes back. If her relay is ever unconfigured she states that she is not connected
rather than pretending to answer.

Every open thread lives in [BUILD_PLAN.md](./BUILD_PLAN.md), the one plan file, grouped into nine
families, the same nine in all three repositories: Agent orchestration, Calculators and methods, Knowledge, Console and
surfaces, v1 proof and grading, Data and map, Paid platform, Security and hygiene, and Experts and partners. The same file says what is being
built next, and why.

The largest gap: **project points are not placed**, because nothing goes on the map until there is
registry-verified source data with published coordinates.

**The console has four surfaces, in the production shape**, from 2 Sep 2026, one row from 7 Sep: the journey bar across the top — Dispatches
first, then six phases, of which Eligibility, Partners and Quantify open this site's tools — and
the desk opens first. **Wellington's desk** holds the visit's project context and rows that derive
from the visit and are never invented: Phoebe's eligibility result, the basin pinned on the map,
Calvin's screening figure, and ~~always, last,~~ **at the foot of the right rail, in view at laptop
height from the look pass of 8 Sep 2026,** ~~*Save this project and sign up*~~ *Save and sign up*, its words from 16 Nov 2026, at the foot of the left rail. ~~That opens
waterbots.ai and carries nothing across.~~ **From 8 Sep 2026 that button is the bridge to the paid
site**: a button with one line under it saying what goes with the visitor — what they said about
the project, the basin they pinned, where each eligibility criterion stands, and the numbers they
typed in — and the two things that never do: the results worked out here, and the conversation.
The click keeps the visit for one hour under a random code and moves the page to waterbots.ai's
welcome with only that code in the address; the paid site collects it once, server to server,
behind a shared key, and it is deleted on hand-over. Ten saves a day per visitor. This site keeps
no copy, and nothing is kept between visits.

**From 9 Sep 2026 the same door opens the other way.** A visitor who types a question into the box
on waterbots.ai's landing page arrives here with it: the desk reads the question from the address,
takes it out of the address so a reload cannot send it twice, and hands it to Wellington as the
visitor's first turn, so his answer is the first thing they see. Nothing is kept. A blank, missing
or unreadable question opens the page as it always opens, with no error and no invented question.
Ten carried questions a day per visitor, counted on top of Wellington's thirty.
**From 15 Sep 2026 the same arrival can carry optional facts** — `does`, `name` and `place` —
which fill the visit card and leave the address with the question. Empty keys are omitted. Kind is
not in the URL. A broken, over-long or empty fact is ignored, never cut, and never toasted.
**From 16 Sep 2026 those facts reach Wellington too**, so he does not ask again for a field the
visit already holds.

**The quantification step carries three screening packs** — the water volume a household or
community supply project provides, and the carbon reduction a safe-drinking-water project screens
at under the legacy and the Paris-aligned versions of the Gold Standard methodology, with the
transition delta between the two. **Every number it produces is a screening estimate**: anticipated,
not delivered, not verified, and needing consultant review. Nothing is filled in for a visitor, and
reloading clears it.

**Wellington is the Team Lead, and his chat is live on the desk** from 3 Sep 2026. He welcomes a
visitor, learns the project in plain words, and routes: Phoebe for whether it can count, the
Quantify step for figures, the Partners step for basins, waterbots.ai for saving and for his full desk. He
quotes no figure from any worksheet, invents no teammate or capability, uses screening language
only, and never presses anyone to sign up. Thirty messages a day, counted separately from Phoebe's
twenty, and nothing kept between visits. **Bridget is the map's agent and Calvin is the
quantification step's.** ~~Neither console is built yet — each panel is there, each agent is named in
it, and each says plainly that it is not answering.~~ **Bridget's chat is live from 31 Oct 2026**,
with her map on its own Map tab: she explains what she does and why the basin matters to funders and partners, asks
the visitor to pin their project's basin on the Map tab, which opens on the country they named, and
reads its water stress back in the chat, saying when the reading is derived. **Calvin's chat is not built**; his step has a screen of its own, which opens on the
calculator and says so in one plain line on its Chat tab.

**From 7 Sep 2026 the desk closes its loop.** What Wellington learns goes to Phoebe with every ask,
as the visitor's own words and never a verdict; her verdicts move the worksheet and her row on the
desk. Bridget's row asks for the basin pin once a place is known, and a pin fills it. Agents say the
six phase names as written, point people at a step and never at a tab, and use plain words a
first-time visitor knows.

**From 9 Sep 2026 every step is an agent screen.** The agent's chat sits in the middle, in bubbles
— the visitor's on the right, the agent's on the left in its own colour with its portrait — and tabs
above it: Chat, always; Tool, when the agent has one; Knowledge pack, the cards, versions and sources
it works from; Credentials, its exam and scores, which say plainly that ~~no exam has been sat~~ the
grade comes from one public exam run outside this site and that none has been run yet. The
tab row wears the agent's colour, and the crew card on the right is underlined in the same colour, so
a visitor can see whose screen it is. There is no "Next phase" chip: next steps live in the right rail only, and a row
clears once it is taken. **Wellington's** desk is his screen. **Phoebe's** has
her chat on her tint, the eligibility worksheet as its Tool, and a Knowledge pack assembled from the
committed cards. **Bridget's** opens on her
chat, with the map on its own tab, Map, at full width; a pin brings the visitor back to Chat. **Calvin's** opens on Tool, the calculator, and his
Chat tab says in one plain line that he is not answering here yet. The right column is the crew
with the save button on every step; the old host panels are gone. Memory is never a tab: what the
visit knows stays in the record on the left. The screen is built once and offered to production and
the Agent Commons, which differ from this site only in memory and in how deep the tool goes.

**Every page carries the main site's menu, from 28 Oct 2026**: the WaterBots.AI wordmark to
waterbots.ai, Consulting, Open Source (this site's screening), Agent Commons, and Sign in — the same
words, order and look as the live waterbots.ai menu, so the two sites read as one.

**The Agent Commons is live at [open.waterbots.ai/commons](https://open.waterbots.ai/commons)**,
from 11 Sep 2026, rewritten on 28 Oct 2026: a free, open library of AI agents for water projects,
how it works in four points, a "Build a module with us" button to the main site's Consulting page,
and the modules as one list, one row each — the agent, what the module does, its method, its stage,
owner, grade and community rating (display only, "No ratings yet"). **A module moves through six
stages** — seeking partners, proposed, in development, expert review, exam, graduated — each shown
as its name and a small bar, explained behind an (i) beside the column. Phoebe's eligibility and
feasibility cards are in development and open to try, tagged Beta; Bridget's two datasets are in
development and Calvin's water pack and Heather's health impact guide are proposed; the two carbon
packs are in expert review, their Gold Standard methods linked; and four modules seeking partners end
the list, each with "Work with us", an email to the team. Every grade reads "not yet graded",
because a grade on the Commons comes only from an independent exam, run outside this site on real,
completed projects, and no agent has sat it yet. **Each module that opens has its own address**,
such as [open.waterbots.ai/commons/phoebe](https://open.waterbots.ai/commons/phoebe), which can be
shared and opened directly. Open a module and the agent's screen appears alone — its chat, its tool
where it has one, its knowledge pack and its credentials — in the menu's centred column, with
"About this module" beside it (below it on a phone) and no crew and no next phase; the way back
returns to the list, and the site menu's Sign in leads to the main site. The Commons
carries no project record and keeps nothing; Phoebe answers there from what a visitor types, under
the same thirty messages a day.

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
- **Quantification step.** Calvin's two calculators, both from the open core and both ex-ante,
  installed from the release `calvin-violet-v0.5.1`. **Carbon credits** is `@waterbots/calvin`
  0.5.1: Gold Standard's *Emission Reductions from Safe Drinking Water Supply*, V1.0 and V2.0, its
  engine doing every sum. **Water benefits** is Violet's **VWBA 2.0 · D-3 Volume Provided**,
  `@waterbots/violet` 0.5.1, for household and community water supply: people served come from
  the project record, every result says "Draft — pending expert review", and **a blank
  without-project volume is never read as zero**. This site works none of either figure out.
- **A shared chat layer** that every agent on this site uses, so citations are rendered one way
  rather than reinvented per agent.

## Phoebe, and how citations work here

Phoebe reads from **two committed card sets** — six eligibility criteria and ten feasibility
considerations, both drawn from Volumetric Water Benefit Accounting 2.0 — and nothing else. Asked
about anything outside them, she says she does not have that card yet rather than guessing. An
honest gap is more useful than an answer nobody can tell is wrong.

Both card sets live in her Knowledge Pack,
[`knowledge-packs/phoebe-eligibility/vwba-2.0/cards/`](./knowledge-packs/phoebe-eligibility/vwba-2.0/cards/),
from 17 Sep 2026. The pack is their one home; the worksheet and Phoebe's relay both read from
there.

**She never writes a citation.** She names the card each answer rests on; the console looks that
card up in the committed file and renders the citation itself, on the worksheet row it supports. A
wrong page number or an invented link is therefore not something she can produce. A card that does not
exist is dropped rather than shown. **Her chat carries no citations from 12 Nov 2026**: it is the
plain answer, and the citations stay on the worksheet rows.

Each citation is one line: the document, its version, the section, the page, and a link to the
publisher's own page. Every card carries that link — no canonical link, no card.

The rules behind this are published, not internal: the 21 rules in [AGENT_RULES.md](./AGENT_RULES.md)
govern how any agent here talks, where every answer comes from, what it does when its sources do not
cover a question, and what it may say about work that is not built yet.

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
| `BRIDGE_KEY` | The shared key the paid site presents to collect a saved visit from `/api/handoff/<ticketId>`, as `Authorization: Bearer <key>`. Its name and value come from the paid site. Without it that address answers 503 and names the setting; saving itself still works, but nothing can be collected. |
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
is not a test; `check-calvin-package` proves the open core's calculators are the release's own files,
re-runs Calvin's reference cases, and proves Violet's water calculator never treats a blank
without-project volume as zero, which is the one way that calculation can produce a large,
confident, wrong number with nothing looking broken; and `check-gs-sdws` proves
both carbon packs reproduce every recorded reference figure to four decimal places, that the
derived emission factor lands on every recorded point, and that a blank share, a blank leakage
figure or an unchosen method leaves the result honest rather than zero; and `check-wellington`
proves his relay checks the model's output rather than trusting it, that his region of the primer
reaches him and only him, that no prompt tells any agent to say anything word for word, that a typed
context entry is never overwritten by what he heard, that the shell holds his one conversation, and
that a filled visit record is passed to him so he does not re-ask those fields; and `check-roster`
proves this site agrees with the one crew list, `knowledge-packs/product-shared/roster.yaml`,
carried from production and never edited here — every seat on the crew rail and the Commons shelf
is a roster seat wearing the roster's label at a door that allows it, the primer's crew facts and
Wellington's people sentence name the same seats, and no retired name is used. **It runs in front of
every `npm run build`**, so a disagreement fails the deploy and names the file and line.

```bash
node scripts/check-basins.mjs
node scripts/check-stress.mjs
node scripts/check-palette.mjs
node scripts/check-cards.mjs
node scripts/check-api-exports.mjs
node scripts/check-visitor-id.mjs
node scripts/check-cap.mjs
node scripts/check-reply-guard.mjs
node scripts/check-gs-sdws.mjs
node scripts/check-wellington.mjs
node scripts/check-roster.mjs
node scripts/check-lanes.mjs
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

**Opening on a country.** Bridget's Map tab opens on the country the visitor named, using the
box around each country from [Natural Earth](https://www.naturalearthdata.com)'s 1:110m Admin 0 –
Countries, v5.1.2, which is public domain. Only the names and boxes are kept, in
`src/lib/countryBoxes.generated.ts`, made by `scripts/build-country-boxes.mjs`; nothing from it is
drawn on the map.

**The key is a build-time setting** (`VITE_CARTO_KEY`) and is not held in this repository. A build
without it produces a working map with every tile watermarked, which is why
`check-basemap-key.mjs` reads the built bundle and fails rather than letting it ship.

## Theme

**There is one brand and it is light.** The brand book, ~~**version 4.1 from 30 Aug 2026**~~ **version 4.2 from 31 Aug 2026**,
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
  `#FBFBFE` is the **frame**: top bar, rail, and ~~both docks' ground~~ **the crew rail's ground, from 9 Sep 2026, the docks being gone**. Measured, the frame is
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
  invisible; that is in §2.3 too.
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
- **Calvin's identity colour** — **Reef `#0E8A94`**, the maintainer's ruling of 31 Oct 2026, in
  `--reef` through `--bot-calvin`, and his portrait is drawn in it. He was Plum `#5848A8` from
  31 Aug 2026, a knowing exception to the book's §6, which gives Plum to Reggie; Plum is Reggie's
  alone again. **Mint was refused on the merits then and still is**: the book also makes Mint
  *Success / approved*, and a screening step whose whole message is *not verified* must not wash
  green. At 4.13:1 on white Reef carries his portrait, keylines, tints and washes, never text. His
  name and his calculator's labels are set in **Deep Reef `#0C7C85`**, its text shade, in
  `--deep-reef` through `--bot-calvin-text`: 4.96:1 on white, the maintainer's ruling of 1 Nov 2026.
- **Violet's identity colour** — **Orchid `#A457D4`**, the same ruling, in `--orchid` through
  `--bot-violet`. Violet is the VWBA agent who will host the D-n modules on the Commons; she is not
  on the roster or on this site yet, so the token waits for her. At 4.29:1 on white it never carries
  text; she will need a darker text shade when she is built.
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
  > rendered wrongly: neither colour is used as type here.

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
| [RULINGS.md](./RULINGS.md) | Every ruling for how the whole site behaves |
| [FAMILY_OPEN_CLOSE.md](./FAMILY_OPEN_CLOSE.md) | How a family of work opens and closes |
| [AGENT_RULES.md](./AGENT_RULES.md) | The 21 rules every agent follows, read into every agent's prompt |
| [docs/modules/](./docs/modules/) | One short rulings file per module |
| [CLAUDE.md](./CLAUDE.md) | How this repository works: folders, checks and commands |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | The one plan file: the v1 finish line, and every open item, by family |
| [BUILD_LOG.md](./BUILD_LOG.md) | The last three months of finished work; GitHub's history keeps the rest |

## Not in this repository

Brand source files, design references, prior-prototype material and source PDFs are held locally and
are gitignored. They are not published here.
