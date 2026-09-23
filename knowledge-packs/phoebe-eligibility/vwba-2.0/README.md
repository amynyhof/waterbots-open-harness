# vwba-2.0 — Phoebe's Knowledge Pack

**Version 0.6.0.** This folder is the one home of what Phoebe knows about the
water pathway (corrected 22 Sep 2026; see the CHANGELOG). Her carbon pathway has
its own folder beside this one, [`../gs-paa-v2.0/`](../gs-paa-v2.0/), a scaffold,
not live. The card files live in [`cards/`](./cards/), and everything on the live
site that reads them reads them from here. Maintainer's ruling, 17 Sep 2026.

## What she knows

Four card sets, drawn from one document, *Volumetric Water Benefit
Accounting 2.0*, and one real published project:

| Set | Source | Cards | File |
|---|---|---|---|
| Eligibility | Appendix A | Six criteria. All must be met. Approved 21 Aug 2026. From 23 Sep 2026 each card carries a **Can it be fixed?** line — five *yes*, one *depends* (criterion 4) — the only place the word Blocked can come from. | [`cards/eligibility-cards-vwba.md`](./cards/eligibility-cards-vwba.md) |
| Feasibility | Appendix B | Ten considerations. Guidance, never a gate. Approved 21 Aug 2026. | [`cards/feasibility-cards-vwba.md`](./cards/feasibility-cards-vwba.md) |
| Routes | Figure 3, Steps 1, 3 and 4, Appendices A, C, D and E; and the Meta 2023 volumetric water benefits report | Nine cited fixes, one per common gap. A route hangs on a Fixable row; never a promise. Approved 23 Sep 2026. **Not read by anything until the routes reader is built** (item A18). | [`cards/routes-cards-vwba.md`](./cards/routes-cards-vwba.md) |
| Applies | Glossary; Appendix A criterion 1; Appendix C, Table C-1; Step 3 | Two questions that say whether the water pathway is in play; never a verdict; each "no" sorted into Fixable, Unknown or Blocked. Approved 23 Sep 2026. **Not read by anything until the pack-keyed reader is built** (item K7). | [`cards/applies-cards-vwba.md`](./cards/applies-cards-vwba.md) |

Every card is a rewrite in plain words. No sentence is copied from the source.
Every card carries the four-part citation from [CITATIONS.md](../../../CITATIONS.md)
and the publisher's canonical link, so each one stands alone.

## What she helps with

- **Whether a project can count a volumetric water benefit.** The six criteria are
  a hard gate: miss one and the project is not eligible. Every "not yet" arrives
  with a route forward, in the words of the card.
- **How to weigh a project that already passes.** The ten considerations help a
  visitor choose well between eligible projects. None of them is a bar to entry,
  and they carry no ranking. Weighing them is the visitor's job.
- **Reading the project record against the cards.** She sees the visit record
  with every ask, and her verdicts come back to her row in the record.

## What she does not cover

- **Working a number out.** That is the Quantify step, and it is Calvin's.
- **The map.** That is the Partners step, and it is Bridget's.
- **Any standard other than VWBA 2.0.** Gold Standard's safe-water methodology
  has its own eligibility pack beside this one, [`../gs-paa-v2.0/`](../gs-paa-v2.0/),
  a scaffold with no approved card; its arithmetic lives in Calvin's packs. Until
  that pack is live she checks nothing carbon and says so (corrected 22 Sep 2026;
  see the CHANGELOG).
- **The activity table (Appendix C) and the glossary.** Drafted, not approved,
  not read. Draft card files stay untracked until the maintainer approves them.
- **Whether a benefit was delivered or verified.** Nothing here says so.
- **Anything without a card.** She says she does not have a card for it. That is
  an answer, and each miss is written down for the maintainer to read. The
  abstention ladder is in [AGENT_RULES.md](../../../AGENT_RULES.md).

## The contract

Every specialist keeps the ten lines of **the specialist contract** in
[AGENT_RULES.md](../../../AGENT_RULES.md), the maintainer's ruling of 20 Sep 2026.
This table is where Phoebe stands against it, and it is refreshed whenever a line
moves. Read as of 21 Sep 2026.

| # | Line | Today | Where it is met |
|---|---|---|---|
| 1 | Introduces itself | **Yes** | Her prompt's first-turn rule and the opened note (`api/_systemPrompt.ts`, `api/_record.ts`) |
| 2 | Knows its own tools, and no one else's | ~~**Partly**~~ **Yes, from 21 Sep 2026** | ~~She is told what she has no cards for and where her colleagues' tools are; nothing reads [`tool/README.md`](./tool/README.md) into her prompt.~~ The agent-facing region of [`tool/README.md`](./tool/README.md) is generated into her prompt as "Your tool": one tool, six rows, what a row takes, where its value comes from, and that the map and the calculator are her colleagues'. `check-wellington` holds it |
| 3 | Sees its tool's state | ~~**No**~~ **Yes, from 21 Sep 2026** | ~~Her request carries the record and one done flag, never the six rows.~~ The six rows go with every ask, from the console and from the Commons seat, and come back to her as the block "What the worksheet shows" after the cache breakpoint (`api/_record.ts`, `api/phoebe.ts`); `check-wellington` holds the reader and the block |
| 4 | Walks the user through the tool, one question at a time | ~~**Partly**~~ **Yes, from 21 Sep 2026** | The one-question rule is in her prompt; ~~no rule works the rows in order~~ her prompt walks the rows in the manual's order from the first unchecked, one row, one question (`api/_systemPrompt.ts`, hard rule 3); `check-wellington` holds the rule and `scripts/measure-phoebe-walk.mjs` measures the walk with real calls |
| 5 | Fills the tool from answers, and shows what it filled | ~~**Partly**~~ **Yes, from 21 Sep 2026** | `criteriaUpdates` move the rows; ~~nothing under her bubble says what moved~~ under any turn that moved a row the console draws one line from her verdicts, never from prose — "Worksheet: 3 Met · 0 Not yet" — in the citation line's place and size (`src/lib/criteriaState.ts`, `src/chat/Transcript.tsx`); ruling R3, on prose, she may strike it at the eyeball |
| 6 | Answers only from its own cards, with a citation | ~~**Partly**~~ **Yes, from 20 Sep 2026** | The cards are her whole knowledge and the relay drops unknown cards. ~~The card files embed whole, notes to the maintainer included (item K10, part 2).~~ The grader notes left the card files for [`cards/grader-notes.md`](./cards/grader-notes.md), which she never reads |
| 7 | Knows its limits and its level here. Says so | ~~**Partly**~~ **Yes, from 21 Sep 2026** | Limits, yes (prompt rule 9). ~~Her level is nowhere she reads.~~ Her prompt says she works at the screen level on this site and on the Commons, and `check-roster` holds that sentence's level word to `roster.yaml`. **Scope, from 21 Sep 2026 (the maintainer's ruling at eyeball stop 4):** her prompt carries as facts that today she checks eligibility under VWBA 2.0 only and that carbon eligibility is coming and not live, and she phrases both herself; `check-wellington` holds the facts and holds that no sentence is handed to her to repeat |
| 8 | Knows Wellington leads. Hands back when done or out of its lane | ~~**Partly**~~ **Yes, from 21 Sep 2026** | Knows, from 21 Sep 2026: her prompt says Wellington is the Team Lead and leads the visit, and that a finished part or an uncovered question goes back to him on Dispatches. Hands back: ~~the done note sends the visitor to Dispatches; no hand-back field yet (step 4)~~ her answer carries `handBack`, `none` or `wellington`, checked against that closed list by the relay (`api/_handBack.ts`) and again by the client, and the console draws the way back from the field alone — to Dispatches here, to the shelf on the Commons; out of her lane she still says the colleague's facts and sets the field (rung 2, ruling R1). `check-wellington` holds it |
| 9 | Posts official results to the project record for the next agent | **Partly** | Her verdicts reach the rows, her desk row and the seal, and from 21 Sep 2026 they are the record's eligibility section: read back to her on every ask and carried whole on the seal. ~~No next agent on this site reads them.~~ Wellington reading that section is his side, named under item A15 and not built |
| 10 | Knows what its tool needs, the kind of value each input takes and where it comes from; checks the project context first; says where each value came from | ~~**Partly**~~ **Yes, from 21 Sep 2026** | Her tool section tells her what each row and each record field is, why it matters, the kind of value it takes and where it usually comes from; to check the record first and ask only for what is missing; to ask for everything when no record comes; and to say what settled a row. ~~What is still owed: the rows themselves reaching her with every ask.~~ The rows reach her with every ask, each verdict marked as her own from earlier in the conversation, so she reads back where each value stands and where it came from |

## Folder

| | |
|---|---|
| [`cards/`](./cards/) | The two card sets. The live site reads these files. From 20 Sep 2026 [`cards/grader-notes.md`](./cards/grader-notes.md) sits beside them: the notes to the maintainer that used to sit at the foot of each card file, moved out whole so Phoebe does not read them as knowledge. Nothing reads it. |
| [`tool/`](./tool/) | Names the checklist and its live reader, and carries the agent-facing region her prompt embeds about her tool (from 21 Sep 2026). No code lives here. |
| [`evals/`](./evals/) | No exam has been sat. Says so. |
| `README.md` | This page. |
| [`CHANGELOG.md`](./CHANGELOG.md) | This pack's own version history. |

## Cited document

| | |
|---|---|
| **Document** | *Volumetric Water Benefit Accounting 2.0* |
| **Version** | Version 1, September 2025 |
| **Sections** | Appendix A, "Project eligibility criteria" (six criteria) · Appendix B, "Project selection considerations" (ten considerations) |
| **Link** | https://doi.org/10.46830/wrigb.23.00112 |

Publisher: World Resources Institute, with LimnoTech, Bluerisk, and Bonneville
Environmental Foundation. CC BY 4.0. No endorsement is implied.

No PDF body text is kept here. The source PDF stays in `sources-local/`, which is
gitignored and never publishes.
