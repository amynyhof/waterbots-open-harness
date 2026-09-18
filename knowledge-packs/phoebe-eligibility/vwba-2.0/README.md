# vwba-2.0 — Phoebe's Knowledge Pack

**Version 0.2.0.** This folder is the one home of what Phoebe knows. The card
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
