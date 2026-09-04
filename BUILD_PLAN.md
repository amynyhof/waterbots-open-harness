# BUILD_PLAN.md — what is being built, and why

Which family of work is being built now, which comes next, and what each one is
waiting on. **This file commits to an order, not to dates.**

Read it with [OPEN_ITEMS.md](./OPEN_ITEMS.md), which holds the items themselves
and the north star they lead toward, and with
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which says how work
moves from a proposal to a commit.

**This file is rewritten whenever the plan changes**, and refreshed at every
session close, so it never describes a plan we have already left behind.

---

## Compatibility goal

**This is the standing direction. It sits under the north star in
[OPEN_ITEMS.md](./OPEN_ITEMS.md) and shapes how everything below is built.**

**Shell B is heading toward compatibility with the production console.** Someone
who steps up to the paid platform should find the step seamless: the same
behaviours and the same shapes, in a different colour, with more tabs. What a
person learns on the free surfaces keeps working when they cross over.

**The final look is not settled, and this is not a one-way copy.** Some of what
this shell works out may flow back the other way. **Which parts settle where is
decided in a design session with the production side** — not in this repository,
and not by an engineer working in it.

**The brand book is the design authority, and it is version 4.2 from 31 Aug 2026.** ~~BRAND.md v3 is
the design authority — 28 Aug 2026.~~ ~~It is version 4.~~ Version 3 held for two days; version 4 and
then 4.1 both landed on 30 Aug. The book governs both properties and is complete on its own page.
It lives at `brand/BRAND.md`, gitignored, and does not publish. ~~The design canon is the outcome of the session this file was waiting on.~~ **The
canon is superseded by the book** and says so at its own head; it stays published as history, and
where the two disagree the book wins.

**The canon's rulings were not wrong.** The Frost light theme, the left rail with its "Collapse" row
and "<" glyph, and the chat dock's citation and formatting rules were all carried into the book and
live there now. Both of the things it asked for are done: the brightness pull-up shipped on 27 Aug
(item S8, now closed) and the rail-width rider rode on 29 Aug when the rail was next opened.

**Three rules held while we waited. Two of them are permanent and one has done its job.**

1. **Build to this repository's own rules.** [CLAUDE.md](./CLAUDE.md),
   [AGENT_RULES.md](./AGENT_RULES.md), [CITATIONS.md](./CITATIONS.md),
   [DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) and the brand book
   are what binds. The compatibility goal is a direction, not a specification, and it
   does not override any of them. **Still holds.**
2. **Flag drift as an open item, in its family.** This one was for the design
   session, and the design session has happened. **It is retired as a standing
   rule**, and what it was collecting is now settled by the canon. Anything that
   still looks like drift is an ordinary open item.
3. **Never copy from, fetch from, or match the production site unaided.** Not its
   files, not its shapes, not its wording, and not by inference from memory. This
   is rule zero in CLAUDE.md and the wall in CITATIONS.md, applied to design.
   **A compatibility goal is not permission to go and look** — rules travel as
   rules, and they travel by the maintainer's hand. **Still holds**, and the canon
   restates it itself.

---

## Just finished — Wellington live on the desk

**Session of 3 Sep 2026. One pull request, on `feat/wellington-live`, open as this is written.**
Wellington's chat on Phoebe's proven pattern, the rule that agents phrase the roster's facts
themselves, and one conversation held by the shell. Items A8, A9 and S11.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md)**, which is append-only and is
never read at the opening. This section says only what is now true.

- **Wellington answers on the desk.** His own endpoint, thirty a day under his own counter, the
  reply floor, the retry rule and the timeout, all stated in code. Opus 5 at medium, for item A6's
  measured reason.
- **He routes; the console acts.** A route and what he learned come back as fields, checked against
  closed lists twice. A route is one action under his turn; what he learned fills the visit without
  ever overwriting a typed entry.
- **Facts and rules, not lines.** Every agent phrases the roster's facts itself. No prompt says word
  for word, and a check refuses one that does.
- **One conversation.** The shell holds his thread; the desk is a frame around it, and the hero
  chat, when it comes, will be another.
- **The standard-of-interest chips are gone.** The kind of project lives in his plain question.
- **A landing surface was built and rejected entirely.** Nothing of it shipped; item S12 records the
  confirmed shape instead.

## Previously — the free desk, the production shape, and the carbon packs

**Session of 2 Sep 2026. Pull request #48, merged.** The console's fourth surface and its new
shape, the two carbon packs, and a look pass against the saved production pages. Items S11 and K6.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md)**, which is append-only and is
never read at the opening. This section says only what is now true.

- **Four surfaces, in the production shape.** A journey bar of six phases across the top of the
  centre — three open this site's surfaces, three say they open with a saved project — and four
  tabs beneath it: Dispatch, Eligibility, Partners (Map), Quantify. The desk opens first.
- **Wellington's desk.** Project context, rows derived from the visit and never invented, and the
  save door to waterbots.ai as the last row, carrying nothing across. Wellington is Team Lead,
  extended and never forked; his chat is on the paid site and the composer says so.
- **The visit lives in the shell.** Context, pin, eligibility rows and every pack's answers, kept
  for this visit only. A click on the map pins a basin.
- **Three packs in the slot.** The water pack and two carbon packs from one module — Gold
  Standard's safe-drinking-water methodology, legacy and Paris-aligned — differing in one cited
  input, with the transition delta as one line under the tabs. A pack's result is now figures with
  units and a headline; the surface knows no method.
- **Thirteen checks now, not twelve.** `check-gs-sdws` reproduces every recorded reference figure
  to four decimals and proves blank is never zero.
- **Production is canon for the console's shape.** Journey bar, tab row, row anatomy and the
  calculator's idiom were read from the saved pages and matched — the look only.

## Previously — the Quantification step and its first pack

**Session of 1 Sep 2026. Three pull requests, #44 to #46.** The console's third surface, the first
screening calculator inside it, and Calvin taking the primer's third post.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md)**, which is append-only and is
never read at the opening. This section says only what is now true.

- **Three surfaces.** Basin map, Eligibility, **Quantification**. The rail says three.
- **The step is pack-keyed and knows no method.** Fields, gates, defaults, formula and arithmetic
  all come from the pack. Item S10.
- **One pack is fitted:** VWBA 2.0 · D-3 Volume Provided — household and community water supply,
  ex-ante, Option 3. Item K5. **Carbon screening is named on the tab strip and marked planned**; it
  carries nothing and is not clickable.
- **Everything the step produces is a screening estimate**, anticipated and never verified, with a
  consultant-review tag wherever it renders.
- **A blank without-project volume is never read as zero**, and no example anywhere subtracts one.
- **Calvin staffs it.** Plum `#5848A8`, a portrait in the house form, the primer's third post. His
  chat is not built and the panel says so.
- **The brand book is version 4.2**, §6 filled in with Calvin's row and two recorded exceptions.

**Twelve checks now, not eleven.** `check-vwba-d3` is at 68 and guards the arithmetic, the gates,
the formula, the tab strip and the primer's rendered pack list.

## Previously — the return to the brand book

**Sessions of 29 and 30 Aug 2026. Eleven pull requests, #27 to #37, all merged.** The brand book
arrived on 28 Aug and this is the work of bringing the shipped stylesheet to it.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md)**, which is append-only and is
never read at the opening. This section says only what is now true.

**What the site is, after it:**

- **One light brand.** The dark theme and the theme switch are gone; there is one set of tokens.
- **Two grounds.** `--paper` `#F6F5FA` is the content canvas — the map and the worksheet. `--frame`
  `#FBFBFE` is the frame — top bar, rail, and both docks' ground. Content warm, frame lighter and
  quieter.
- **Three planes and no fourth.** The derived `--chrome` plane is retired.
- **The book's names and values** — neutrals as `--ink*`, the book's hairline and radii, three
  shadow tokens applied only to what genuinely floats.
- **Accent-tinted host panels.** Both chat docks and the legend carry their host's accent at the
  book's 5% fill and 25% border. Bridget is **Surf `#14C8D9`**, settled.
- **A basemap wash**, Slate at 13%, which is where the map's richness came from.

**The stress ramp is unchanged.** A ramp change was designed, machine-checked, walked and withdrawn
— the finding was that the map read flat because of the basemap, not the data. Item S9 carries it.

~~**Four rulings are owed to the master brand book by the maintainer's hand**, listed once in item
S9: the two grounds, the active nav item, the three shadow values, and Slate as a basemap wash.~~
**All four landed in version 4 on 30 Aug 2026** — §2.3, §2.3, §4 and §7. Item S9 records where each
one sits. **Driftwood was proposed and refused on the merits** and is struck from that list; §2.1
keeps the strike rather than erasing it.

**What the reconciliation found, kept short because item S9 is its one home.** The shipped surfaces
already matched the book in almost every value — the ten accents, both recorded spares, the four
neutrals, the hairline, the seven radii, the five states, the seven crew hues, the two grounds, the
active navigation item, the wash. **Two did not, and both are shipped:** the shadow values took the
book's §4 (pull request #41), and coral gained a darkened text value at 4.5:1 (#42).

**The second of those corrected the book rather than the site.** Measuring §2.5 showed that the
published live and approved text values did not reach the contrast the same sentence promises.
Corrected values were accepted and written into **version 4.1**, along with the new coral;
verification was measured and left alone. **Nothing here rendered wrongly** — neither value is used
as type on this site — so it was a proposal, not a fix.

**Version 4.1 is the only amendment written into the book from inside this repository**, on the
maintainer's explicit instruction, and it is the exception rather than a new practice.

**The design exploration leaves no artefact here, and that is deliberate.** Its outcome — the cool
end that was ruled, the hybrid that was built, and the finding that withdrew it — is recorded in
full in item S9. Maintainer's ruling, 30 Aug 2026: **the screenshots are not coming, because there
is nothing left for images to teach.** No folder waits for them.

## Building next — the hero chat, when its reference arrives

**One family is queued and blocked.** The hero chat (item S12) is the next build and it waits on a
demo reference arriving in `Design refs/` by the maintainer's hand. Nothing is built toward it
until she says the file is in. Its receiver (item S13) waits on it in turn.

**The confirmed shape, for the record:** the production landing's question box hands a visitor to
this site with the question carried; this site opens the hero chat as its own full page, the whole
viewport the conversation, built to the reference; the console carry stays as built. Each shell
builds only its side.

**The other candidates, none chosen:**

1. **The carbon card pass** (item K7) — cards in Phoebe's format drafted from the two Gold Standard
   PDFs, graded by the maintainer, through the same pipeline as the VWBA cards. Logged as debt.
2. **Tightening Wellington's answers** (item A10) — logged as debt, not for now.
3. **Calvin's chat**, which would move the step's gates into his conversation. The largest, and not
   scheduled.
4. **A further method pack** — item K2 names the remaining candidates.
5. **Bridget's chat**, unchanged and still not scheduled.

**What comes next is decided at the next session's open.**

## Not next, and why

| Family | Why it waits |
|---|---|
| **Knowledge** | Large and unbounded until the full-docs card pass (item K1) reports what card sets are actually needed. Doing it in the wrong order means writing cards nobody asked for. **The first method pack (item K5) landed 1 Sep 2026 and the two carbon packs (item K6) on 2 Sep, both outside that order, because the maintainer scoped them herself.** The carbon card pass (item K7) waits for Thursday. |
| **Surfaces** | **The hero chat (item S12) is next and waits on the maintainer's reference file**; its receiver (item S13) waits on it; the typing-dots exception (item S14) waits on her hand into the book. The bridge (item S7) **sits on production's desk as their #149**. The brightness pull-up (item S8) and the return to the book (item S9) are both **closed**. The rest of the family is polish (item S5), the dev-relay gap (item S6), or waits on data that does not exist yet (item S1). |
| **Data** | Blocked on material the maintainer supplies — registry coordinates for the project points (item D2), public disclosures for corporate goals and target geographies (item D1). Not work that can start from inside the repository. |
| **Operations** | **Nothing is due.** What remains waits on real usage that does not exist yet: the number twenty (item O1), the basemap's five-million-request ceiling (item O9), and the primer review against the abstention log (item A5). Two questions are open and unhurried — whether the export copies should be produced by a script (item O8), and whether an abstention that cited a card is a fault at all (item A7 — it recurred on 3 Sep and reads as the benign branch; the maintainer's reading closes it). |
