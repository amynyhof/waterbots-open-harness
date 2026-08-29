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

**The design canon has arrived — 27 Aug 2026.** The session this file was waiting on has an
outcome, and the outcome is written down. It came by the maintainer's hand as rules-as-rules, the
same way the process rules arrived, and it lives at
[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md). **That file is the home; this section
does not restate it.**

**This shell's design language prevailed**, as the ruling had signalled it would, so almost nothing
arrives inbound. Three things this repository already does are now binding rather than merely
current: the Frost light theme, the left rail with its "Collapse" row and "<" glyph, and the chat
dock's citation and formatting rules.

**Two things change, and neither is built.** A brightness pull-up to BRAND.md's published Frost
values, which the canon asks to be proposed as one sized step — item S8 in
[OPEN_ITEMS.md](./OPEN_ITEMS.md). And a rider to widen the rail modestly whenever it is next
opened for another reason, which the canon says is explicitly not its own work item.

**Three rules held while we waited. Two of them are permanent and one has done its job.**

1. **Build to this repository's own rules.** [CLAUDE.md](./CLAUDE.md),
   [AGENT_RULES.md](./AGENT_RULES.md), [CITATIONS.md](./CITATIONS.md),
   [DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) and BRAND.md are
   what binds. The compatibility goal is a direction, not a specification, and it
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

## Before that — the session of 27 Aug 2026

**Session of 27 Aug 2026.** Five steps landed and one is written and waiting. Taken in order.

**The line endings are pinned (item O6, closed).** A `.gitattributes` file, merged as pull request
#8. The cause turned out to sit one layer below what the item recorded: git had cached the Windows
length for the file and compares that cached size before it compares content, so it called a
byte-identical file modified without looking inside. That one fact explained all three puzzles the
item had listed separately.

**Three process rulings are logged (pull request #9).** A session batches steps and the close-out
ritual runs once at the end of the sitting; the engineer opens its own pull requests; and every pull
request description opens with a "For Amy" block in plain English. The export step is named in the
ritual and its order ruled — **commit first, then regenerate the copies**, so they carry the
close-out itself. That is item O8.

**The design canon arrived and is logged (pull request #10).**
[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) is its home — see the compatibility goal
above, which no longer waits on anything.

**The brightness pull-up shipped (item S8, pull request #11)**, and then the map itself turned out to
be a different problem.

**The basemap stopped being free, and the live site was serving watermarked tiles (item O9, pull
request #12).** CARTO ended keyless access; `map.waterbots.ai` was stamped "API KEY REQUIRED" across
every tile for anyone arriving with a cold cache. It applied to the style the map shipped with from
launch, so there was no reverting out of it. The map now runs keyed, on CARTO's Voyager style, which
the maintainer walked and approved. A new check reads the built bundle and fails a keyless build.

**Ten checks now**, not nine.

## Just finished — reliability, the guards, and the primer

**Session of 28 Aug 2026.** Six steps landed after the morning's close-out.

**Phoebe was failing about one request in six, and it is fixed (item A6).** Empty answers, a false
`API error 400`, a budget wall, and replies of one to three characters delivered as answers. Found
by accident while testing the primer against a baseline, diagnosed over seventy-five instrumented
requests, and fixed by moving her to **Opus 5**: the empty-answer rate falls from 12% to 2%, and
she is faster and cites more cards than before.

**Two guards followed, for what the model change does not reach.** A reply shorter than 40
characters is refused rather than delivered — the floor comes from 256 measured answers whose ten
shortest were 1, 1, 3, 3, 3, 3, 21, 221, 293, 295. And the relay now has **a timeout of its own**,
120 seconds, where it had none at all, plus one narrow retry for a 400 that arrives too late to be
a malformed request.

**Eleven checks now.** `check-reply-guard` joined them, and `check-cap` gained two proving a retry
cannot cost a visitor two of their twenty.

**The agent handoff primer is live (item A3).** Step two shipped after the reliability work, and
rung 2 of the abstention ladder moves from *partly live* to **live** in
[AGENT_RULES.md](./AGENT_RULES.md). Phoebe says the maintainer's sentence about Bridget word for
word — compared character by character, not by eye — and the hang that had parked the work did not
recur in ten attempts.

**Two rulings were logged**: the session opening became a two-part ritual, and the free calculator
agent is named **Calvin** — the name only, with everything else coming by the maintainer's hand
when his lane opens.

## Building next — the return to the brand book

**The brand book arrived by the maintainer's hand on 28 Aug 2026: version 3, one light brand,
superseding the two-theme era.** It governs both properties and is complete on its own page.
`BRAND.md` in this repository is now that book. It is gitignored, as it has always been, so it does
not publish.

**[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) is superseded by it and does not yet
say so.** The superseded header comes by the maintainer's hand, under the visible-corrections rule,
with the original reasoning preserved.

**What the book changes here, measured against the shipped stylesheet:** the canvas moves from
`#FBFBFE` to **`#F6F5FA`**, the hairline from 9% to 10%, two radii grow, the neutrals are renamed
from `--fg-*` to `--ink-*`, shadow tokens appear, **the dark theme retires entirely**, and the
three-plane rule leaves this repository's derived `--chrome` without a home — which the book says
to raise rather than invent, and the maintainer is taking to production's book.

**Three things it settles.** Bridget is **Surf `#14C8D9`**, not the provisional lifted value.
Status and identity are told apart by *form* rather than colour, which closes item S8's rider. And
the stress ramp survives, because §2.5 still defines warm as a warning **or a sub-par metric**,
which is what water stress is.

**Phoebe stays Anemone.** The book's roster is production's crew; each surface extends it with its
own agents under the book's rules. A one-line amendment to close that gap at the source is **owed
by the maintainer's hand** at the master book's next revision.

**It is proposed as sized steps and none is built.** The assets tree named in the book's §8 is on
the maintainer's desktop and has not been moved.

## Not next, and why

| Family | Why it waits |
|---|---|
| **Knowledge** | Large and unbounded until the full-docs card pass (item K1) reports what card sets are actually needed. Doing it in the wrong order means writing cards nobody asked for. |
| **Surfaces** | The bridge (item S7) was ruled on 26 Aug 2026 but has no proposal — the shape of the handoff is coordinated by the maintainer's hand. The brightness pull-up (item S8) shipped on 27 Aug and stays open only on its rider: both agent identity colours are re-reviewed against the status taxonomy, because an agent colour must never read as a project status and Bridget's soft Surf sits near *Live*. The rest of the family is polish (item S5) or waits on data that does not exist yet (item S1). |
| **Data** | Blocked on material the maintainer supplies — registry coordinates for the project points (item D2), public disclosures for corporate goals and target geographies (item D1). Not work that can start from inside the repository. |
| **Operations** | **Nothing is due.** What remains waits on real usage that does not exist yet: the number twenty (item O1), the basemap's five-million-request ceiling (item O9), and the primer review against the abstention log (item A5). Two questions are open and unhurried — whether the export copies should be produced by a script (item O8), and whether an abstention that cited a card is a fault at all (item A7, waiting on a recurrence). |
