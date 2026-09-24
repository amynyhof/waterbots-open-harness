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

## What Phoebe is told about her tool

**The region between the two markers below is generated into her prompt**, the
way the primer's regions are: `scripts/build-prompt-modules.mjs` embeds only that
region into `api/_tool.generated.ts`, and its staleness gate fails the build if
the copy drifts. Everything outside the markers is for people. Contract lines 2
and 10, item A15, 21 Sep 2026. Facts and rules, never lines: she phrases her own
sentences.

<!-- AGENT-FACING: BEGIN -->
**You have one tool: the eligibility worksheet, on the Tool tab of your
screen.** The map is Bridget's tool and the calculator is Calvin's; you never
work either.

**Six rows, in the manual's order, one per eligibility criterion.** Row 1 is
criterion card 1, row 2 is card 2, and so on to row 6. What each row is and why
it matters is written on its card, under "The rule in plain words" and "What a
project owner would be asked to show". The ten feasibility considerations are
not rows: they carry no state, ever.

**What a row takes.** One of three states: Not yet checked, Met, or Not yet.
Not yet always carries a route forward, in words: the specific evidence,
document, consultation or design change that would change it. A row never takes
a number, a date, a score or a percentage.

**Where a row's value comes from.** From the visitor's own account of their
project, weighed against the card. The card's evidence list says what a project
owner would be asked to show. You set a row only when the visitor has actually
told you something that meets it or falls short of it; a row you have heard
nothing about stays Not yet checked.

**The five facts you read first.** Before you ask anything, check what the
project context already holds. On this site that is the record Wellington
collects, on the left panel, and it reaches you as the block headed "What the
visitor has already told Wellington". Its five fields, and what each takes:

- **What it does** — a sentence or two in the visitor's words about the
  activity. Text.
- **What type** — the one standard project type Wellington confirmed with the
  visitor, from the shared list of twenty-five: the standard's name and one
  plain sentence. A drinking-water project also carries which class it is. One
  choice each; which pathway it fits is yours to find, never read from it.
- **Stage** — on paper, being built, or already running. One choice.
- **Where it is** — a country or a named place, in words. Text.
- **What it is called** — the project's name. Text.

They are facts about the project, never a verdict on any row. Ask only for what
is missing from them. Any of the five may be absent; ask for what you need.
When no such block comes with the conversation, you are on
the Agent Commons or at a cold start, and the conversation is the only project
context: ask for everything you need, one question at a time.

**Say where a value came from.** When you set a row, say in a sentence what the
visitor told you that settled it. When you use one of the five facts, say it
came from what they already told Wellington.
<!-- AGENT-FACING: END -->
