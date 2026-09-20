# tool — the eligibility checklist

**No code lives here.** This page names the checklist and where it reads from.

- **The checklist** is the Eligibility worksheet on the Tool tab of Phoebe's
  screen: [`src/components/EligibilityWorksheet.tsx`](../../../../src/components/EligibilityWorksheet.tsx).
  Six criteria, then ten considerations, each with its card's plain words and
  its citation.
- **The live reader** is [`src/lib/phoebeCards.ts`](../../../../src/lib/phoebeCards.ts).
  It reads the two files in [`../cards/`](../cards/) and nothing else. It fails
  loudly if a card's shape drifts, so an empty worksheet cannot be shown as if
  no criteria existed.
- **The build gate** is [`scripts/check-cards.mjs`](../../../../scripts/check-cards.mjs).
  It re-derives both sets a second way and fails the build on any gap.
- **Phoebe's relay** reads the same files through
  [`scripts/build-prompt-modules.mjs`](../../../../scripts/build-prompt-modules.mjs),
  which copies them into `api/_cards.generated.ts`. The gate fails if that copy
  is stale.

The Knowledge pack tab shows the cards' approval date, read from the status line
at the head of each card file.

**What is never read.** [`../cards/grader-notes.md`](../cards/grader-notes.md) holds
the notes to the maintainer that sat at the foot of each card file until
20 Sep 2026. The reader, the gate and the generator name the two card files and
nothing else, so those notes no longer reach Phoebe's prompt. Item K10, part 2.
