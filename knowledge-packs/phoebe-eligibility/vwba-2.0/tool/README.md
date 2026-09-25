# tool — the eligibility checklist

**No code lives here.** This page names the checklist and where it reads from.

- **The tool itself is defined in [`eligibility-worksheet.yaml`](./eligibility-worksheet.yaml)**,
  beside this page: the rows, their states, what each takes, where a value comes
  from, and each row's citations by card id. From 25 Sep 2026 the runtime reads
  it — the worksheet on screen, Phoebe's prompt, and the checks all come from
  that one file.
- **The checklist on screen** is the Eligibility worksheet on the Tool tab of
  Phoebe's screen: [`src/components/EligibilityWorksheet.tsx`](../../../../src/components/EligibilityWorksheet.tsx).
  One section per pathway: the rows asked here with their five states and their
  cited routes, then the rows acted on at later phases, then the ten
  considerations.
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

## What Phoebe is told about her tool

**The tool file is the one home, from 25 Sep 2026.** What Phoebe is told about
this tool — its rows, the order they are asked in, what each one takes, where a
value may come from, the five row states and what each carries, the pathway
states, the readiness reads, and the record fields the tool reads — is generated
from [`eligibility-worksheet.yaml`](./eligibility-worksheet.yaml) beside this
page by [`scripts/build-worksheet-module.mjs`](../../../../scripts/build-worksheet-module.mjs),
which writes `api/_tool.generated.ts` under a staleness gate.

**This page used to carry that text itself**, in a marked agent-facing region
that the prompt generator embedded. The region retired when the runtime started
reading the tool file, by the maintainer's ruling R1 of 25 Sep 2026, so that one
fact about this tool is written in one place. Its whole wording is in this pack's
[CHANGELOG](../CHANGELOG.md).

**The rules that sat in that region moved into her prompt**, where her other
rules live: say where a value came from, ask only for what is missing, a row you
have heard nothing about stays Not yet checked, and what the record block is and
is not. They were never facts about the tool; they are how she behaves.

**Nothing on this page reaches her prompt.** It is for people.
