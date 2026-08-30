# BUILD_LOG.md — what was built, session by session

**Append-only. Never read at the opening.**

This file exists so that [SESSION_HANDOFF.md](./SESSION_HANDOFF.md) can stay thin. The handoff says
where things stand *now*; this says how they came to stand there. Maintainer's ruling,
29 Aug 2026 — the rule itself lives in
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) under *the opening reads stay thin,
forever*, and this file does not restate it.

**It is not one of the six opening documents and must never become one.** A session starts by
reading the current state, not the history. This is looked at when someone goes looking for how a
thing came to be, and at no other time.

## How it is written

- **One entry per session**, appended at the close, after the root docs are refreshed and before
  the checkpoint is committed.
- **Nothing already in it is ever edited.** A correction is a *new* entry that names what it
  corrects and why — the visible-corrections rule applied to a log rather than to a claim. An entry
  that quietly changed would make the whole file untrustworthy, which is the one thing a log cannot
  survive.
- **It records what happened, not what is required.** Rules live in the rulebooks; open threads
  live in [OPEN_ITEMS.md](./OPEN_ITEMS.md); the order of work lives in
  [BUILD_PLAN.md](./BUILD_PLAN.md).
- **An incident is recorded fully in the item that owns it**, per *record once, point everywhere
  else*. An entry here carries two lines and a pointer, not a second account that can drift.

## Entries

Newest last.

**Entries begin with the session of 29 Aug 2026**, which is the session this file was created in.
**Earlier history is not lost and has not been moved yet** — it currently sits in the "Before that"
and "Just finished" sections of [BUILD_PLAN.md](./BUILD_PLAN.md) and in each item's own row in
[OPEN_ITEMS.md](./OPEN_ITEMS.md). Sweeping it here is ordinary tidying, not a ruling, and it is
recorded as owed rather than done so that this file does not open with a false claim of
completeness.

---

## 29–30 August 2026 — the return to the brand book

**Eleven pull requests, #27 to #37, all merged.** The brand book (BRAND.md v3) arrived on 28 Aug by
the maintainer's hand; this was the work of bringing the shipped stylesheet to it.

**What landed, in order.** The design canon marked superseded by the maintainer's own header,
verbatim, with its original text preserved (#27). The work logged as item S9 (#28). A false comment
about `--chrome` struck and corrected (#29). The book's published values for canvas, hairline and
two radii (#30). The dark theme and the theme switch deleted (#31). The neutrals renamed `--fg-*`
to `--ink-*`, 76 references, no value changed (#32). Bridget settled as Surf `#14C8D9`, closing item
S8 (#33). Three process rulings into canon, and this file created (#34). The fourth plane retired,
shadow tokens, and the accent-tinted panel pattern, as one bundle (#35). The frame stepped back to
`#FBFBFE` (#36). The basemap wash at Slate 13% (#37).

**The session's real finding was not in the plan.** The map read flat, and two ramps were designed,
machine-checked against `check-palette`, put on the real map behind a dev-only switch, walked, and
withdrawn. **The cause was the basemap, not the data** — a 13% Slate wash supplied the richness the
ladder was being blamed for. `src/lib/stressPalette.ts` ends the session byte-identical to how it
started. Item S9 carries the whole account.

**A ruling moved twice in one day and both versions are on the record.** "Chrome takes the canvas"
was ratified, built, looked at, and superseded by "the frame and the content have different grounds"
after the frame and the map were found to be tonally fighting. The half that survived is that chrome
gets no plane below the canvas.

**Driftwood was proposed for the dry categories, passed the gate, and was refused on the merits.**
`check-palette` confirmed the chroma margin still separated Arid and No Data from every band. The
maintainer refused it anyway: the warm bronze made Arid read as a value. **The gate measures
separation; it cannot measure what a colour reads as.** That is written into `stressPalette.ts`
where the next hand would reach.

**Three process rulings entered canon**: pull requests bundle by the maintainer's checkpoints rather
than by step; an incident is recorded once in the item that owns it, with the migration gate riding
alongside; and the opening reads stay thin, forever — which is why this file exists.

**One thing about the machine, found and not acted on.** The working folder carries Windows line
endings while git stores Unix, although `.gitattributes` says `eol=lf`. Nothing is broken — git
normalises on the way in and `git status` stays clean — but item O6 records the fix as pinning them
"in the working folder", and that half is not true of files git has had no reason to rewrite. Logged
as item O10.
