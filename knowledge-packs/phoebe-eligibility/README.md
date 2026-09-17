# phoebe-eligibility — eligibility and feasibility (open)

**Version 0.1.0.** Phoebe staffs Eligibility. She works from two committed card
sets. This pack **points at those files**. It does not copy them.

| Tool | Points at | Live reader |
|---|---|---|
| [eligibility](./tools/eligibility/) | [`eligibility-cards-vwba.md`](../../eligibility-cards-vwba.md) | [`src/lib/phoebeCards.ts`](../../src/lib/phoebeCards.ts) |
| [feasibility](./tools/feasibility/) | [`feasibility-cards-vwba.md`](../../feasibility-cards-vwba.md) | same |

Do not copy `eligibility-cards-vwba.md`, `feasibility-cards-vwba.md`, or
`phoebeCards.ts` into this pack. A card edit belongs in the card file. This
tree stays a pointer.

## Multi-tool shape

Two tools today. **Not one blob forever.** A later card set — carbon cards, or
another standard — gets its own `tools/<tool-id>/` folder. It is not folded into
eligibility or feasibility.

## What she does

Eligibility is a hard gate: six criteria from VWBA 2.0 Appendix A; miss one and
the project is not eligible, and every “not yet” arrives with a route forward.

Feasibility is guidance: ten considerations from Appendix B, only for projects
that already pass the gate. None of them is a bar to entry.

Draft card files at the repo root stay uncommitted and are never read.

## Citations

Document, version, and link live on each tool README. No PDF body text here.
The four-part shape for a cited claim is in [CITATIONS.md](../../CITATIONS.md).
