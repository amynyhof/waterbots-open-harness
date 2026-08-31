# Open items — archive

**Closed items, moved out of [OPEN_ITEMS.md](./OPEN_ITEMS.md) so that the document read at the start
of every session stays a briefing rather than an archive.** Maintainer's ruling, 29 Aug 2026, *the
opening reads stay thin, forever*: a closed item is finished, and it earns a pointer and a home
elsewhere rather than a place in an opening read. The sweep itself was item O11.

**This file is not one of the six opening documents and is never read at the opening.** It is read
when someone goes looking for how a thing came to be — the same posture as
[BUILD_LOG.md](./BUILD_LOG.md), and for the same reason.

**Nothing here was summarised, trimmed or reworded in the move.** Each item is exactly the text that
stood in OPEN_ITEMS.md, with its dates, its measurements, its wrong turns and its corrections
intact. A closed item's value is entirely in its detail; an archive that abbreviates is an archive
that loses the thing it was made to keep.

**Every item still has a one-line row in the index table in
[OPEN_ITEMS.md](./OPEN_ITEMS.md)**, pointing here, so no item can be lost by being finished.

**Items are added to this file only when they are closed**, and they keep their original
identifiers — S4 stays S4. Identifiers are never reused.

**First sweep: 30 Aug 2026**, six items — S4, S8, O2, O3, O6, O7.

---

# Family: Surfaces

## S4. Chat docks were thrown away on a surface switch

**Fixed 23 Aug 2026.** Recorded because it was a real defect found in a browser check, and because
the reasoning behind the fix is the kind that gets undone by a later tidy-up.

**What went wrong.** A visitor could work through several criteria with Phoebe, glance at the map,
come back, and find the worksheet still filled in but the whole conversation gone. The worksheet
survived because its state is held in the console shell; the conversation did not, because it is
held inside the chat dock, and the shell threw the dock away whenever you left its surface.

The mismatch is what made it bad. Half the work remembered and half of it forgotten reads as the
product losing what someone said.

**Where it was.** The console shell, `src/App.tsx` — not the shared chat layer. A chat component
holding its own conversation is correct and is what makes it reusable; the shell destroying that
component was the bug. **Bridget would have inherited it**, and so would every agent after her,
because the shell showed one dock or the other with the same either/or switch.

**The fix.** Both docks stay mounted and the one you are not on is hidden — the same treatment the
map already had a few lines above, for the same reason. Hidden means hidden from everyone: it is
taken out of the tab order and out of the accessibility tree, so nobody can type into a composer
they cannot see.

**A refresh still empties everything**, and the page still says so. That is the
no-memory-across-visits ruling of 21 Aug 2026 and it stands. Stepping over to the map and back is
not a new visit, so it must not behave like one.

**Two fixes considered and rejected.** Lifting the conversation into the shell would work, but it
puts one agent's conversation in the shell and then the next agent's too, which is the opposite of
what the shared layer is for. Saving it to browser storage would break the no-memory ruling.

**A note on how it was found.** The maintainer reported the page jumping back to the map and losing
the conversation. That specific symptom turned out to be the dev server reloading the page because
the engineer was editing files during her browser check — not a product fault. This defect was
found while chasing that, and it is the real one.

---

## S8. Brightness pull-up to BRAND.md's published Frost values

**From the design canon, received 27 Aug 2026** and held at
[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md), which is the home for the ruling
itself. This item is the work it asks for.

**The canon's note, in its own words:** the site "currently reads more muted than BRAND.md's
published Frost values," and the ruling is BRAND.md at full published brightness — Paper Frost
canvas, pure white cards with hairline borders, Tide `#2B5BFF` at full strength for primary
actions, accents at their published values. **The engineer's derived values — chrome, the agent
colours, the stress ramp — were derived correctly and stand.** The canon says so explicitly. This
is about surfaces and accents that drifted softer than the book.

**The canon asks for it as one sized step, proposed.** It is not built and no proposal has been
written.

### One thing measured on receipt, which the proposal will have to start from

**The tokens are already at the published values.** `src/styles/tokens.css` was read on receipt
rather than assumed:

| Token | In the file | BRAND.md publishes |
|---|---|---|
| `--paper` | `#fbfbfe` | Paper Frost `#FBFBFE` |
| `--card` / `--raised` | `#ffffff` | `#FFFFFF` |
| `--tide` | `#2b5bff` | Tide `#2B5BFF` |
| `--line` | `rgba(11,20,40,0.09)` | `rgba(11,20,40,0.09)` |

**So whatever reads muted is in how the tokens are applied, not in the tokens themselves** — a
component reaching for a softer token than the book intends, a wash, or an opacity. **The
proposal must find the specific places before it proposes anything**, and must not "fix" this by
editing values that already match the book.

**Bridget's provisional `#7FD5DF` is a lifted, softer member of the Surf family**, where BRAND.md
publishes Surf as `#14C8D9`. It is **not** brightened as part of this item — the maintainer ruled
on 27 Aug 2026 that she stays provisional at her current colour. It is picked up afterwards by the
taxonomy rider below.

### The agent colours — ruled, and a re-review rides on this item

The canon's standing rules say "agent identity colors remain platform rules (Phoebe violet;
Bridget Surf, provisional)." In BRAND.md, violet is Iris `#7B5BE6`, while Phoebe's colour here is
**Anemone `#A04E7E`** — a muted berry-magenta, set by the maintainer's ruling of 22 Aug 2026
precisely to move her *off* the provisional Plum and Iris pair taken from her portrait.

**Maintainer's ruling, 27 Aug 2026: Anemone stands.** "Violet" in the canon was loose wording, not
a new decision. The ruling of 22 Aug holds and nothing about Phoebe's colour changes.

**Bridget stays provisional at her current colour**, `#7FD5DF`. Same ruling, same day.

### Rider on this item — re-review both agent colours against the status taxonomy

**Maintainer's ruling, 27 Aug 2026.** After the brightness pull-up lands, both agent identity
colours are checked against the status taxonomy. **An agent colour must never read as a project
status.** A visitor who has learned that one colour means *live* should not meet the same colour
meaning *this is Bridget*.

**The specific worry, and it is not hypothetical.** Bridget's provisional `#7FD5DF` is a lifted
member of the Surf family, and the taxonomy sets `--state-live` at Surf `#14C8D9`. **Her colour
sits near Live.** Pulling the surfaces up to full published brightness moves everything around
both of them, which is exactly why the check comes after the pull-up and not before it.

The taxonomy to check against, as `src/styles/tokens.css` carries it today:

| State | Value |
|---|---|
| Live | `#14C8D9` — Surf |
| Approved | `#2BC9A5` — Mint |
| Pending | `#E8A12B` — Amber |
| Locked | `#98A0B2` |
| Warn | `#E25858` — Coral |

**This rides on S8 and is not its own item**, and it does not gate the pull-up — it follows it.

### The rail rider, recorded here so it is not lost

The canon also notes the left rail may read slightly thin, and asks that it be widened modestly
**when the rail is next touched for another reason**. It says plainly: *"Not its own work item —
log it as a rider."*

**So it is not an item and this is not it.** It lives in the canon. It is named here because this
item is the most likely next work to open the rail, and a rider nobody can find is a rider nobody
rides.

> **Handed on 29 Aug 2026.** This item's work is finished, so it is no longer the most likely next
> work to open the rail. **The rider now sits with item S9**, the return to the brand book. It is
> still not an item, and S9 is still not it.

### What shipped, 27 Aug 2026

**Two card surfaces pulled to full published white** — pull request #11. The citation line in the
chat dock and the map's credit strip were each painting a white card at 92%, so the page behind
tinted them. Both now paint `var(--card)`, with the hairline border already in place doing the
separating, exactly as BRAND.md pairs them.

**No token was touched, because none was wrong.** `src/styles/tokens.css` already sat at the
published values — Paper Frost `#FBFBFE`, card `#FFFFFF`, Tide `#2B5BFF`, the published line value
— and primary actions were already full-strength Tide. The softness was in how tokens were applied.
**Brightening a value that already matches the book would have moved the site away from BRAND.md
while appearing to obey the canon**, which is the trap this item was written to name.

**Then the maintainer named the map itself** — the grey base tiles, the pale fills, the grey no-data
land. That turned out to be a different thing again and is recorded at item O9: the basemap was not
dark, it was nearly colourless, and it had also stopped being free. The map now runs on CARTO's
Voyager style, which is the maintainer's ruling of 27 Aug 2026 after walking it.

**The arid and no-data basins were never touched and never will be by this item.** They are
deliberately near-neutral *and* deliberately low-opacity so the basemap shows through — the palette
file says so in its own words. They read as grey fog because they were windows onto a grey basemap.
A living basemap fixes them without weakening the distinction between "not a reading" and "a low
reading", which covers a fifth of all basins.

**The one open design question is answered.** Voyager's sea and the Low-stress band are both pale
cyan, and whether they would blur could not be settled by arithmetic. **Maintainer's verdict after
walking production, 27 Aug 2026: they read apart — the hairline borders on basins separate them from
open sea at every zoom tried.**

### Closed 29 Aug 2026 — the rider is answered by the book, not by a re-review

**The brightness work was done on 27 Aug.** What kept this item open was the rider: both agent
identity colours re-reviewed against the status taxonomy, because an agent colour must never read
as a project status and Bridget's provisional `#7FD5DF` sat near *Live*.

**BRAND.md v3 answers it, and the answer is better than the re-review would have been.** §2.6 rules
that **the form factor carries the meaning**: a status may only be a 7-10px dot or a 1px keyline on
a data row; an identity may only be a bubble, a portrait, a surface accent or a keyline. Surf as a
dot means *live*; Surf as a portrait means *Bridget*. **The book accepts Surf's double duty on
exactly that basis.**

So Bridget's colour is no longer merely *near* the Live colour — since 29 Aug it **is** the Live
colour, `#14C8D9`, and that is the book's intended state rather than a collision. The check that
matters is not "are these two colours far enough apart" but "is each one only ever used in its own
form", and that is a rule to hold rather than a measurement to take.

**Phoebe was re-reviewed too, and stands.** Anemone `#A04E7E` is unclaimed by any state in the
taxonomy and by any other agent.

Received 27 Aug 2026. Shipped 27 Aug 2026. **Closed 29 Aug 2026**, with the rider answered by
BRAND.md v3 §2.6 — see item S9.

---

# Family: Operations

## O2. Restore branch protection on `main` — closed

**Restored by the maintainer, 24 Aug 2026.** The owner bypass is removed and `main` requires a pull
request again.

The bypass had been held open deliberately since 20 Aug 2026 so the v1 build and this session's work
could be pushed directly. That allowance is over.

**What this means for the next session: direct pushes to `main` will be refused.** Changes go
through a pull request. An engineer who finds a push rejected has not hit a fault — that is the
ruleset doing its job, and the answer is a branch and a pull request, not a request to reopen the
bypass.

This was a live GitHub setting rather than a repository file, so nothing here enforces it and
nothing here can verify it. It is recorded on the maintainer's word.

---

## O3. Reverse link from waterbots.ai — closed

**The link is live.** Confirmed by the maintainer, 24 Aug 2026. waterbots.ai links to this map.

It was always the marketing site's job rather than this repository's, and it is recorded here only
because the README describes the relationship between the two sites and has to be true about it.
Nothing further to do.

---

## O6. The card gate reports stale cards that are not stale

**Found 26 Aug 2026**, while repairing an accidental move of the `api/` folder. It is small, it is
not urgent, and it is worth fixing because a gate that cries wolf is a gate people learn to ignore.

**What it looks like.** On this machine, on a fresh checkout, one of the nine checks fails:

```
node scripts/build-card-module.mjs --check
STALE — api/_cards.generated.ts does not match the card files.
The relay would deploy with out-of-date cards.
```

**Phoebe's cards are not out of date.** That was checked rather than assumed: the card text carried
inside the relay's copy was compared character by character against both committed card files, and
it matches exactly. Nothing about her knowledge is wrong, and nothing reaches a visitor.

**What it actually is: line endings.** Every line in a text file ends with a marker, and Windows and
Linux use different ones. Git stores one form and is set, on this machine, to write the other form
into the folder on checkout. The two forms mean the same thing, and git knows it — which is why
`git status` and a comparison against `main` both show no difference.

The gate does not know it. It rebuilds what the file *should* say and compares the raw characters,
so fifteen invisible markers read as a mismatch:

| | Line-end markers | Size |
|---|---|---|
| As git stores it | 0 | 44,299 bytes |
| As checked out here | 15 | 44,314 bytes |

Fifteen markers, fifteen bytes, same words.

**The script already knew about this problem and solved half of it.** Its own comment says the card
files it reads may arrive with either form and normalises them before use, "without this the
generated module differs by platform and the staleness gate fails on a clean tree." That care was
applied to what it reads and not to what it compares against.

**Why it matters at all.** Nothing is broken in production — the deployment platform builds from
what git stores, which has never changed. The cost is entirely to the people working here: a check
that fails on a clean tree teaches its reader that failures are normal, and the next real staleness
will look the same as this one.

### Two ways to settle it

1. **Pin the line endings** — a `.gitattributes` file telling git to leave this file's line endings
   alone on every machine. **Recommended.** It fixes the cause rather than the symptom, it works for
   anyone who clones the repository rather than only here, and it guards the same class of trouble
   that has already bitten this repository once: the card parser was line-ending sensitive and
   rendered a blank page on a Windows checkout while the Linux build was perfectly fine.
2. **Teach the gate to ignore line endings when it compares** — one line, mirroring what the script
   already does to the files it reads. Cheaper and narrower; it fixes this one gate and leaves the
   underlying difference in place for the next thing that trips on it.

**Neither is built.** Both are small enough to be one step by the sizing ruling of 26 Aug 2026 —
one thing to look at, one thing to undo.

### What not to do

**Do not settle it by regenerating the card module and committing the result.** That was done once
on 26 Aug 2026, at the maintainer's word, to get a clean run of the checks — and it is a patch, not
a fix. It writes the file in the form the gate wants, and then the next checkout writes it back the
other way and the gate fails again. Worse, in between, `git status` shows the file as modified with
nothing in it to commit, which is its own small confusion.

**A prediction worth recording, because it was wrong.** The engineer said that regenerating would
leave git showing nothing. It did not — git flagged the file as modified while reporting zero bytes
to stage. Switching branches afterwards did *not* undo it, because git preserves a file it believes
you have edited. So the patch survives longer than expected and is more confusing than expected,
which is an argument for fixing the cause and not the symptom.

### Ruled — pin the line endings

**Maintainer's ruling, 26 Aug 2026: take the durable fix.** A `.gitattributes` file pinning the line
endings, not the one-line change to the gate. The cause is fixed for every machine that clones this
repository rather than for this one only.

**It is the first step of the next session, before the agent handoff primer.** It is minutes of work
and it stops a check crying wolf on every fresh checkout, so it goes first — the primer is the
session's real work and follows immediately after.

**No build tonight.** Ruled and recorded only.

**What "done" looks like**, so the next session does not have to re-derive it: `git status` clean and
the card gate passing at the same time, on a fresh checkout, without the generator having to be
re-run. The patch currently in the folder — `api/_cards.generated.ts` showing as modified with zero
bytes to stage — should disappear as part of this, not be committed.

### Closed — fixed 27 Aug 2026

**A `.gitattributes` file pinning every text file to Unix line endings**, ~~in git and in the
working folder,~~ **in what git stores**, on every machine that clones this repository. Merged as
pull request #8. The "done" test above was met exactly: `git status` clean and the card gate passing
together, with the generator never re-run.

> **Corrected 30 Aug 2026, under the visible-corrections rule.** ~~"in git and in the working
> folder"~~ claimed more than the rule delivers. **`text=auto eol=lf` binds what git stores, which
> is what ships and what the rule was written to protect.** It does not reach back and rewrite files
> already sitting in the working folder — git only rewrites a file on checkout when its content
> changes, so a file that has not differed between branches since 27 Aug still carries whatever form
> it had before. **Nothing about the fix or its "done" test is affected**; only the sentence
> describing its reach was too wide. Item O10 owns the full story.

**The cause was one layer below what this item recorded.** The file in the folder already held Unix
endings and was byte-for-byte identical to what git stores — the same blob, `557be86f`. Git had
**cached the Windows length** for it, 44,314 against an actual 44,299, and it compares that cached
size before it compares content, so it reported the file as modified without ever looking inside.

That single fact explains all three puzzles this item recorded separately: `git diff` showed nothing
to stage, regenerating the file did not clear it, and switching branches did not undo it. The fix
still works for the reason the ruling gave, and it also clears the stale cache, because the next
checkout finally writes the form git expects.

**Nothing tracked in this repository was carrying Windows line endings**, confirmed with
`git add --renormalize`, so the rule prevents future drift rather than converting anything.

Logged 26 Aug 2026, ruled 26 Aug 2026, **fixed and closed 27 Aug 2026.**

---

## O7. Merged branches pile up, and are now to be cleared

**Maintainer's ruling, 26 Aug 2026: delete the merged branches, and turn on GitHub's
delete-on-merge so they stop accumulating.**

**Why there are any.** `main` is protected, so every change goes through a pull request and every
pull request leaves its branch behind once merged. Nothing deletes them, so the list grows by one or
two each session. None of them does any harm — every commit in them is already on `main` — but a long
list of dead branches makes the live one harder to see, and makes it easy to branch from a stale
one by mistake.

**What was there when this was ruled**, all confirmed merged into `main` by `git branch --merged`:

| Where | Branches |
|---|---|
| This machine | `docs/session-close-out`, `docs/bridge-vocab-design-canon`, `docs/step-sizing-ruling` |
| GitHub | the same three, plus `docs/session-close-out-25-aug` and `feat/phoebe-step-4-cap-and-abstention-log` |

**Two halves, and only one of them is repository work.**

1. **Deleting the branches** — the local three and the remote five. Safe, and confirmed safe rather
   than assumed: `git branch --merged main` lists every one of them, which means `main` already
   holds every commit they carry.
2. **Turning on delete-on-merge** — a live GitHub setting, in the repository's own settings, not a
   file here. **Nothing in this repository enforces it and nothing here can confirm it**, the same
   way branch protection (item O2) is recorded on the maintainer's word. It is the half that stops
   this coming back.

**No build tonight.** Ruled and recorded only. The branch holding this close-out is not one of the
five — it is still open and becomes deletable once its own pull request merges.

### Closed — both halves done 27 Aug 2026

**Delete-on-merge is on.** Turned on through GitHub's API and read back to confirm: `false` → `true`.
It has already worked on its own — every branch merged after it was set has been deleted by GitHub
without anyone asking.

**Every merged branch is gone**, here and on GitHub. The five named above, plus the four this
session created and merged, each confirmed an ancestor of `main` before deletion rather than
trusted. `main` is the only branch that remains.

**One thing was not as recorded.** The five branches on GitHub had already been deleted by the time
the setting was turned on, so the remote half needed nothing. That is noted rather than smoothed
over: the item's picture of the remote was a session old.

Logged and ruled 26 Aug 2026. **Closed 27 Aug 2026.**
