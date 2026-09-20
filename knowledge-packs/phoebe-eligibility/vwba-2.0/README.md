# vwba-2.0 — Phoebe's Knowledge Pack

**Version 0.2.1.** This folder is the one home of what Phoebe knows. The card
files live in [`cards/`](./cards/), and everything on the live site that reads
them reads them from here. Maintainer's ruling, 17 Sep 2026.

## What she knows

Two card sets, both drawn from one document, *Volumetric Water Benefit
Accounting 2.0*, and both approved by the maintainer on 21 Aug 2026:

| Set | Source | Cards | File |
|---|---|---|---|
| Eligibility | Appendix A | Six criteria. All must be met. | [`cards/eligibility-cards-vwba.md`](./cards/eligibility-cards-vwba.md) |
| Feasibility | Appendix B | Ten considerations. Guidance, never a gate. | [`cards/feasibility-cards-vwba.md`](./cards/feasibility-cards-vwba.md) |

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
- **Any standard other than VWBA 2.0.** Gold Standard's methodology lives in
  Calvin's packs, not here.
- **The activity table (Appendix C) and the glossary.** Drafted, not approved,
  not read. Draft card files stay untracked until the maintainer approves them.
- **Whether a benefit was delivered or verified.** Nothing here says so.
- **Anything without a card.** She says she does not have a card for it. That is
  an answer, and each miss is written down for the maintainer to read. The
  abstention ladder is in [AGENT_RULES.md](../../../AGENT_RULES.md).

## The contract

Every specialist keeps the nine lines of **the specialist contract** in
[AGENT_RULES.md](../../../AGENT_RULES.md), the maintainer's ruling of 20 Sep 2026.
This table is where Phoebe stands against it, and it is refreshed whenever a line
moves. Read as of 20 Sep 2026.

| # | Line | Today | Where it is met |
|---|---|---|---|
| 1 | Introduces itself | **Yes** | Her prompt's first-turn rule and the opened note (`api/_systemPrompt.ts`, `api/_record.ts`) |
| 2 | Knows its own tools, and no one else's | **Partly** | She is told what she has no cards for and where her colleagues' tools are; nothing reads [`tool/README.md`](./tool/README.md) into her prompt |
| 3 | Sees its tool's state | **No** | Her request carries the record and one done flag, never the six rows (`api/phoebe.ts`) |
| 4 | Walks the user through the tool, one question at a time | **Partly** | The one-question rule is in her prompt; no rule works the rows in order |
| 5 | Fills the tool from answers, and shows what it filled | **Partly** | `criteriaUpdates` move the rows; nothing under her bubble says what moved |
| 6 | Answers only from its own cards, with a citation | **Partly** | The cards are her whole knowledge and the relay drops unknown cards; the card files embed whole, notes to the maintainer included (item K10, part 2) |
| 7 | Knows its limits and its level here. Says so | **Partly** | Limits, yes (prompt rule 9); her level is nowhere she reads |
| 8 | Knows Wellington leads. Hands back when done or out of its lane | **Partly** | The done note sends the visitor back to Dispatches; no hand-back field, and out of lane she names the colleague only |
| 9 | Posts official results to the project record for the next agent | **Partly** | Her verdicts reach the rows, her desk row and the seal; no next agent on this site reads them |

## Folder

| | |
|---|---|
| [`cards/`](./cards/) | The two card sets. The live site reads these files. |
| [`tool/`](./tool/) | Names the checklist and its live reader. No code lives here. |
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
