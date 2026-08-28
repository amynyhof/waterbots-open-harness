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

## Just finished — a session of five landings

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

## Building next — step two of the agent handoff primer

**Step one is written and waiting on the maintainer's read: `agent-primer.md`, pull request #13.**
It is the document [AGENT_RULES.md](./AGENT_RULES.md) names as missing when it publishes rung 2 of
the abstention ladder as *partly live*. **No agent has it yet.**

**Step two wires it into Phoebe's prompt**, replacing the three hard-coded paragraphs in
`api/_systemPrompt.ts` that are the only live handoff today. It is proposed and not approved, and
the proposed mechanism is the card sets' machinery reused — committed source, generated module,
staleness gate — rather than a second way of getting committed words into a prompt.

**[AGENT_RULES.md](./AGENT_RULES.md) is edited as part of step two, not after it.** It says today
that there is no shared primer and that every handoff but one is not live. That becomes untrue the
moment Phoebe inherits the primer.

**The abstention log is no longer a prerequisite.** This file used to say to read it before writing
the primer, and that was good reasoning about a log with something in it. **It holds only test
entries**, so reading it teaches nothing about what visitors actually ask. Maintainer's ruling,
27 Aug 2026: write the primer from the rules, wire it from the rules, and log the review for when
traffic exists — that is item A5.

## Not next, and why

| Family | Why it waits |
|---|---|
| **Knowledge** | Large and unbounded until the full-docs card pass (item K1) reports what card sets are actually needed. Doing it in the wrong order means writing cards nobody asked for. |
| **Surfaces** | The bridge (item S7) was ruled on 26 Aug 2026 but has no proposal — the shape of the handoff is coordinated by the maintainer's hand. The brightness pull-up (item S8) shipped on 27 Aug and stays open only on its rider: both agent identity colours are re-reviewed against the status taxonomy, because an agent colour must never read as a project status and Bridget's soft Surf sits near *Live*. The rest of the family is polish (item S5) or waits on data that does not exist yet (item S1). |
| **Data** | Blocked on material the maintainer supplies — registry coordinates for the project points (item D2), public disclosures for corporate goals and target geographies (item D1). Not work that can start from inside the repository. |
| **Operations** | **Nothing is due.** The line endings (item O6) and the merged branches (item O7) are both closed as of 27 Aug 2026, and delete-on-merge now removes branches by itself. What remains waits on real usage that does not exist yet: the number twenty (item O1), the basemap's five-million-request ceiling (item O9), and the primer review against the abstention log (item A5). One question is open and unhurried — whether the export copies should be produced by a script rather than by hand (item O8). |
