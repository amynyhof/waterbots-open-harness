# evals — no exam has been sat

Nothing here yet, and this page says so rather than showing a score.

The only public grade for a Knowledge Pack comes from the grading rig kept
outside this repository, run on real projects and real packs. That is the
maintainer's ruling of 9 Sep 2026, recorded under the Agent Commons item in
[OPEN_ITEMS.md](../../../../OPEN_ITEMS.md). This site's own checks are build
gates, never a public score.

Until a real card from that rig exists, Phoebe's Credentials tab reads
"not yet graded", and this folder holds this page and nothing else.

## The measured run — an internal gate, not a grade

After any change to Phoebe's prompt, the engineer runs her through the local
relay with real model calls before the change goes to the maintainer's eyeball:
`scripts/measure-phoebe.mjs` asks three standing questions — one hard, across
six criteria; one simple, on one card; one on the other card set — twenty times
each, sixty requests in all, each as a single message with no history, and
counts the answers the relay refused as empty or near-empty, because those are
what a visitor would have met. `scripts/measure-phoebe-walk.mjs` does the same
for her walk: a scripted visitor, never shown to anyone, answers her questions
one row at a time and the script counts questions per reply, whether the row
she moved was the first unchecked one, turns to six verdicts, and empty or
refused turns. The bar is the maintainer's ruling of 20 Sep 2026: no worse
than one empty answer in sixty. A run worse than that stops the work and is
reported to her before anything else is built; every pull request carries the
run's counts and roughly what it cost. Sixty is the size because a thirty-request
sample once swung between 23% and 10% on identical settings (item A6). Neither
script is a build gate — each spends money on every run and is run by hand —
and neither produces a score for this page or for the Commons.
