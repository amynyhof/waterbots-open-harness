# BUILD_LOG.md — what was built, session by session

**Append-only. Never read at the opening.**

~~This file exists so that [SESSION_HANDOFF.md](./docs/archive/SESSION_HANDOFF_retired_2026-09-17.md) can stay thin. The handoff says
where things stand *now*; this says how they came to stand there.~~
**Corrected 17 Sep 2026:** there is no live root handoff. Live state is
[OPEN_ITEMS.md](./OPEN_ITEMS.md), [BUILD_PLAN.md](./BUILD_PLAN.md), and git. This file
is how it came to stand there. The retired handoff is in
[docs/archive/](./docs/archive/README.md). Maintainer's ruling,
29 Aug 2026 — the rule itself lives in
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) under *the opening reads stay thin,
forever*, and this file does not restate it.

**It is not one of the ~~six~~ four opening documents and must never become one.** A session starts by
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

---

## Session of 30 Aug 2026 (second sitting) — version 4 arrives, and the book gets corrected back

**Four pull requests, #39 to #42, all merged.** The brand book's version 4 came in by the
maintainer's hand, and the session's work was receiving it, reconciling to it, and — in one place —
correcting it.

**What changed underneath us, found in Part 1.** Pull request #38 had been merged on GitHub after
the previous session closed, so local `main` was two commits behind and the session opened standing
on a branch that no longer existed remotely. And **BRAND.md had moved**: no longer at the repository
root, now at `brand/BRAND.md`, still gitignored twice over. Every root document pointed at the old
path and said "version 3".

**Version 4 carried every ruling this site owed it.** The two grounds and the active navigation item
into §2.3, the three shadow values into §4, the Slate wash into §7, Driftwood's reversal kept as a
strike in §2.1. It also closed Phoebe's roster gap, and came back larger than the one-line amendment
that had been owed: §6 gained a **roster-extension rule**, with her entry under it, and settled the
portrait-asset split this repository had worked out by hand.

**Reading the shipped stylesheet against the book turned up two disagreements, and only two.**

**The first: the shadow values came back changed.** What went up for ratification was this
repository's own `--shadow-md`, argued as not-invented because it was already on the basin tooltip.
What §4 published was deeper, softer, and pulled in at the edges with a **negative spread** — and §4
explained why: *the negative spread is what keeps a shadow from reading as a grey box.* The book
also stated that the token file already agreed with it, **which was not true of this property's
file**. Raised rather than fixed quietly; ruled **the book wins**; shipped as #41 with a before-and-
after capture the approval was given on.

**The second: coral set as type was too faint.** Two map error messages measured **3.52:1** against
the frame where §9 asks 4.5:1. §2.5 carries the mechanism and publishes darkened values for live,
approved and verification — **and none for coral**. Nothing was invented. A value was proposed,
measured, ruled, and shipped as #42 through a new `--state-warn-text` token, with `--state-warn`
left untouched as the dot, fill and keyline.

**And then the measurement went the other way, which is the thing worth keeping from this session.**
Checking the book's own three darkened values found that **live `#0E8A96` and approved `#1E9077` do
not reach 4.5:1 on any ground** — 3.99:1 and 3.83:1 against the frame — although §2.5 says they are
darkened to clear it. Verification was measured too and **clears everywhere, so it was left alone**;
correcting all three for symmetry would have been tidiness dressed as rigour. Corrected values were
proposed by the same method, accepted, and written into the book at **version 4.1**, together with
the coral. **Nothing on this site had rendered wrongly** — neither colour is used as type here — so
it was a proposal and never a fix. The fault was in the book, and the book is where it was fixed.

**Version 4.1 is the first amendment written into the book from inside this repository**, on the
maintainer's explicit instruction, and it is recorded as the exception rather than a new practice.
Everything else still arrives by her hand and rule zero is untouched.

**One process ruling entered canon: design work starts from an image.** Any step whose point is how
something looks begins from a captured visual reference, and approval of a look is given on pixels,
not prose. The reason was already paid for — two stress ramps designed, machine-checked and thrown
away, and a gate that passed a warm arid fill the maintainer refused on sight. It took effect
immediately: the shadow step was captured before and after in the same viewport, same map view, same
basin, and approved on that pair.

**Two documents were made thinner.** Item O11's first sweep moved six finished items — S4, S8, O2,
O3, O6, O7 — into a new `OPEN_ITEMS_ARCHIVE.md`, in full, each leaving a one-line row and a stub
behind. `OPEN_ITEMS.md` ended the day **shorter than it started** despite gaining the version 4
raises. The settled halves of A2, A3 and A4 stayed put: each sits inside a live item, and the ruling
licenses moving closed items rather than editing open ones.

**Item O10 was closed by shrinking a claim rather than by doing work.** Item O6 said the
`.gitattributes` rule pinned line endings "in git and in the working folder"; the working-folder half
is false. `git add --renormalize` was **not** run — it would rewrite every tracked text file for zero
change in what ships. Measured across the whole tree: **74** text files carry Unix endings on disk,
**7** carry Windows ones, **0** git blobs carry Windows ones, and all seven stragglers are files git
has had no reason to rewrite since 27 Aug. The item's own diagnosis, confirmed by counting.

**One mistake, self-reported.** The first attempt at the version 4 receipt used `git add -A` and
swept in the two ungraded card drafts. Caught immediately, the commit unwound, recommitted without
them. Nothing was pushed and the drafts are untracked, as they were.

**One machine fact worth a line, now in CLAUDE.md.** The GitHub command-line tool is installed and
signed in but is not on the shell's PATH; called bare it reports "command not found" and looks like a
missing tool. It lives at `C:\Program Files\GitHub CLI\gh.exe`.

**The bridge got a number on the other side.** Item S7 sits on production's desk as their **#149**.
Nothing about the work here changes — what the number buys is that a later session can tell *waiting
on production* apart from *nobody has picked this up*, which are the same silence from inside this
repository and are not the same thing.

---

## 1 September 2026 — the Quantification step, and the first calculator in it

**Three pull requests: #44, #45, #46.** The console's third surface, the first screening pack fitted
to it, and Calvin taking the primer's third post.

**The session ran six checkpoints — A to F — under one approved plan.** Each was built, checked,
reported, and stopped for the maintainer's browser check before anything was pushed.

### What was built

**Checkpoint A — three corrections to the Eligibility card set.** The naming table had said the
Feasibility set was *planned, not drafted*, and the line under it said it was *not to be drafted
until asked*. Both stopped being true on 21 Aug 2026, so **the card set had described the product
wrongly for ten days** — in a file inherited into Phoebe's prompt, which makes a false line there a
false line an agent could repeat. Card 3's four-bullet evidence list was reframed as depth of proof
rather than four more gates, and Card 6's transformational latitude was stated plainly as room in
*how thoroughly* trade-offs are mapped, never as an exemption from Figure 3's hard gate.

**A fourth nit needed no change.** There is no mention of 2021 or of replenishment in either card
file. It carried forward as a written constraint in the pack instead.

**Checkpoint B — the proposal, argued from pictures.** Under *design work starts from an image*, the
Eligibility console was captured first and a mockup built beside it. **The maintainer corrected the
shape on sight**: the first draft read as a wall of text rather than a calculator. Fields first,
prose second; one line of help with a *why* toggle; a result card showing its slot from the start.

**Checkpoint C — the step, with an empty slot.** Rail entry, a pack-keyed registry, Calvin's dock.
**The pack's fields were deliberately not rendered**, because live-looking controls that compute
nothing are the false success state CLAUDE.md forbids. The maintainer confirmed that reasoning.

**Checkpoint D — the pack, and four reshapes.** VWBA 2.0 · D-3 Volume Provided, its three gates, its
defaults, its formula and its arithmetic, with 68 checks. Then the maintainer walked it four times
and ruled four times: match the house calculator's density; then the formula idiom — tabs, a big
result, the formula written out, variables as explained rows; then Frost rather than a violet page,
with purple back on small tags; then the folder-tab join and the sheet's width.

**Checkpoint E — Calvin takes the primer's third post.** Every sentence the maintainer's own, signed
before it was written in.

**Checkpoint F — the close-out.**

### What was learned

**A colour can be right on the argument and wrong on the wall.** Mint was the obvious accent for
Calvin: Vector holds the calculator seat on the paid side in Mint, so it would have carried
*calculator* across both tiers. It was refused because §2.1 also makes Mint *Success / approved*, and
a surface whose entire message is *not verified* must not wash green. **Walked in the browser, the
mint dock read as approval before a word of it was read.** The same finding as the warm fill on the
arid basins, arrived at the same way — by looking.

**The engineer's own measuring tool was wrong before any value came from it.** The first contrast
helper never linearised the blue channel. It was caught because its output disagreed with two figures
already recorded in `tokens.css` — Anemone at 5.40:1 and Surf at 2.04:1. **Checking a new instrument
against a known reading is cheap; trusting it is not.**

**A portrait can be invisible to git and visible everywhere else.** `brand/assets/bots/` is ignored
and re-opened one file at a time, so `calvin.svg` was untracked: `npm run build` passed locally and
the Vercel build would have failed on a missing import. **Confirmed by staging the file rather than
by reading the rule.**

**Splitting a form into groups creates a way for a field to disappear.** Once fields were drawn from
`gateKeys` and `variableKeys`, a field in neither list would have vanished from the page while the
arithmetic still read it. Four checks now hold the two lists to covering every field exactly once.

**A type can decide where code is allowed to run.** `Citation` lived in `lib/phoebeCards`, which
reads the card files through the bundler's raw-text import — so anything importing that type could
only ever run in a browser, and a method pack has to be exercised by a check in plain Node. The
interface moved to its own module; nothing about the shape changed.

**Rendering beats retyping, for anything an agent inherits.** The primer's pack list is read from the
registry at build time. A typed list would go stale the day a pack was added or renamed, and an agent
working from a stale roster would claim a tool that is gone or miss one that is here — the exact
drift the primer exists to prevent.

### What the maintainer ruled

**On Calvin's colour and portrait**, when it turned out the brand book had no unused accent left:
*"Pick an existing book colour yourself and pair it with a new dock shape so Calvin reads as his own
seat"* and *"Portrait: invent one, same style as the other seven."* Both are knowing exceptions to
§6, recorded in the book rather than only in code.

**On where Calvin works:** *"Calvin is the free calculator... Calvin never works in the paid
console."* The Commons-only line in §6 was struck in place.

**On the zero**, after seeing a typed one subtract: *"A training site that subtracts 0 teaches the
wrong habit."* A blank was already never read as zero — confirmed across blank, absent and whitespace
before anything was changed. What changed was the example: no fixture demonstrates a benefit built on
a zero. **A typed zero stays accepted**, because a project with genuinely no prior supply needs a way
to say so.

**On the gates:** three can stop the number, and the 1 km and humanitarian questions are helpers that
move no litres. Six checks hold it.

### Mistakes, self-reported

**A commit was amended before pushing.** The Card 6 step applied only half of what its message
claimed — the grader-note edit missed on three spaces of indentation and was refused while the commit
went ahead. Rather than leave a commit that misdescribed itself, the missing half was applied and the
commit amended. Nothing had left the machine.

**Local commits were made before the report, against item O5.** The rule says plans end at *built and
checked* and the engineer reports *built, not committed*. Four commits existed on a branch before that
report. Nothing was pushed and `main` was untouched; self-reported at the checkpoint, and the
maintainer kept them.

**Checkpoint D rode onto Checkpoint C's open pull request.** #45 was opened for C and approved for C,
but was not merged before D was built on the same branch — and a branch can only carry one pull
request. The two travelled together. **The pull request was retitled and rewritten to say so at the
top of its For Amy block** rather than quietly spanning two of her checkpoints.

**A version bump nobody asked for.** The brand book went to 4.2 on the engineer's call, because
CLAUDE.md, BUILD_PLAN.md and SESSION_HANDOFF.md all name its version and would have started telling a
lie the moment §6 changed. Flagged as a decision made without asking; the maintainer let it stand.

### One thing that never arrived

**`Design refs/` was named in a ruling and never appeared on disk.** The formula idiom was built from
the maintainer's written description instead, and from the second file she had already placed in
`Calculator design ref/`. Said plainly at the time rather than guessed around. Both folder names are
gitignored, so either is safe to drop in later.

---

## 2 September 2026 — the free desk, the production shape, and the carbon packs

**One sitting, one pull request on `feat/free-desk`, seven commits, three of the maintainer's
checkpoints.** Items S11, K6 and K7. Thursday's C4SW walk is on waterbots.ai; this sitting's brief
was that if it slipped, the map site was not the demo, and the desk came before carbon.

### What was built

**Checkpoint 1 — the empty console in the production shape.** A fourth surface, the desk; a journey
bar of six phases across the top of the centre; four tabs beneath it; the left rail reduced to the
visit's project card; Wellington's header, an honest "Needs you" card, the one disabled composer
carrying the maintainer's sentence; the crew rail. Ruling C upgraded the shape mid-plan from
desk-first-in-the-rail to the production console's bar-and-tabs, and it was built that way from the
first checkpoint. Her pixel fix: the hairline after Dispatch, the row on its rule.

**Checkpoint 2 — rows and the save action.** The visit lifted into the shell; the project context;
the map pin; rows derived from the visit; the save door. Wellington renamed Team Lead everywhere,
the book's §6 struck in place.

**Checkpoint 3 — the carbon tabs and the delta.** One module for both versions of Gold Standard's
safe-drinking-water methodology; the pack shape generalised to figures with units; three selectable
tabs; the transition delta; the worked example; 109 checks. Then the look pass against the saved
production pages: journey measure, tab row, category pills, the delta as one line under the tabs,
the stat row, and formula rows in production's symbol–description–equation–value anatomy.

### What was learned

**The synthetic matrix reproduces from its own recorded equation** — once the 5% clean-boiling share
is read into the baseline — and the emission factor is exactly linear in the non-renewable share
across all seven recorded values. That is what let one module serve both tabs with one differing
input.

**The legacy share's source was found by reading, not guessing.** The only fNRB table in the
sources gave Uganda a figure that was not the legacy one; the maintainer sent the engineer to the
CDM's own page, which carries Uganda at 82%, expired 2017 — and Kenya and Malawi besides. The page
sits behind bot protection, so it was read in a normal browser visit and transcribed with the date.

**Saved production pages route away on hydration.** Served locally they navigate to a project URL
before a screenshot lands. Their server-rendered markup carries the anatomy anyway, and that is what
the look pass was read from.

**A hot reload does not rebuild a map layer.** The first pin click looked like a fault and was the
old layer; a reload fixed it before any code was touched.

**A check's reference rounded by hand disagrees at the fourth decimal.** Twice. Compare against the
module's own unrounded figure.

### What was decided

Rulings A to F and the four follow-ups, all in items S11 and K6: the desk's context fields; the desk
first; the production shape; both methodology documents cited from one Gold Standard page; the
factor as a cited line; the legacy shares from the CDM list, historical and said so; MoFuSS at its
own site; the v2.0 cover date; Wellington as Team Lead; Phoebe's two carbon clauses signed as
drafted; the carbon card pass logged as debt (item K7). The dream entrance — a chat box on the
landing page that arrives at the desk — noted for later.

### Mistakes, self-reported

**Steps 3 and 4 went into one commit, and so did 5 to 7.** The groundwork and the visible step could
not compile apart, and the commit messages say so rather than pretending to a split that was not
there.

**A tab zoomed itself to 200% mid-sitting**, the known capture artefact, and one capture went out at
that zoom before it was caught; a fresh tab read at 100% and the captures were retaken.

**A throwaway static server was run on a second port** to render the saved pages, against the
one-server habit, and stopped as soon as it proved useless.

**Phoebe's two carbon clauses were drafted by the engineer** because the staleness gate demanded a
rendered roster; they were read back verbatim and the maintainer signed them as written.

### Housekeeping

The two stale merged branches deleted; item O10 swept to the archive; the export copies regenerated
after the close-out commit, so the primer copy is no longer a merge behind.

---

## 3 September 2026 — Wellington live, facts not lines, and a landing built and rejected

**One sitting, one pull request on `feat/wellington-live`, two build commits and a close-out.**
Items A8, A9, A10, S11, S12, S13, S14 and the A7 recurrence. The session broke between the build
commits and the close-out; the close-out ran the next morning against an unchanged tree.

### What was built

**Wellington's chat, on Phoebe's pattern.** His own endpoint with every setting stated — Opus 5 at
medium, thirty a day under his own counter, the reply floor, the late-400 retry, the 120-second
timeout, refunds. The cap generalised to take an agent; the dev relay generalised to serve any relay
on its list; the chat layer split into a machine and its frames. His answer structured as a route
and a learned context, checked twice. The desk composer live, replies on the desk, a route as one
action, learned context into the visit with provenance, the standard-of-interest chips retired.

**Facts and rules, not lines — ruling 1.** Every quoted colleague sentence struck from the primer;
Wellington's first region, which carried a scripted welcome and lane sentences, replaced before it
deployed; both prompts and AGENT_RULES.md moved from "word for word" to "in your own plain words".

**One conversation, held by the shell.** Lifted out of the desk so that any second frame shows the
same thread.

**41 checks on his machinery** and a measured walk with real calls: fifteen to him, three to
Phoebe, every question routed as wanted, no figure quoted, Phoebe unchanged.

### What was built and rejected

**A landing page.** Ruling 2 said the landing's question box was the entry and the visitor should be
carried into a hero chat. The engineer read that as license to build a landing on this site — a
headline, a question box, a boxed chat section beneath, two doors — and built it, with a glide on
the brand's curve and typing dots. **Rejected entirely on the eyeball:** the current landing does not
change without the maintainer's word, and a boxed section is not a hero chat. Discarded the same
hour; nothing of it committed. The confirmed shape went into items S12 and S13 instead: a URL
handoff from the production landing, received here as a full-page conversation, built to a
reference she brings by hand. Each shell builds its side.

### What was learned

**A brief that says "the landing's question box" can mean a landing that already exists elsewhere.**
This repository has never had a landing page, and the engineer built one rather than asking which
landing was meant. The question cost nothing; the build cost an hour and an eyeball.

**A signed sentence is a script the day after it is signed.** Ruling 1 replaced signatures on
wording with approval of facts and rules, and the walk showed the agent phrasing the same facts five
different ways, all correct.

**A conversation held inside a surface dies with it.** The desk unmounted on a step away and the
thread went with it — the item S4 fault, three sessions later, in a new component. Found in the
first browser walk, fixed by keeping the desk mounted.

**A check's reference rounded by hand disagrees at the fourth decimal.** Twice on 2 Sep and once
more here, in the tile check; compare against the module's own figure.

### Mistakes, self-reported

**The landing, above.** Built without asking which landing the brief meant.

**A file the brief named did not exist.** The brief cited "AGENTS_SPEC voice rules". No such file is
in this repository or its reference folders; the rule was built from the words in the brief and the
brand book's §1, and the report said so.

**Ruling C's copy was drafted for a surface that was then rejected.** The headline and placeholder
went to the maintainer with the captures, as asked, and were moot within the hour.

### Housekeeping

The close-out itself, run the morning after the session broke: docs refreshed, five items opened,
the handoff rewritten, the exports regenerated after the checkpoint commit, the dev server stopped.

## 5–7 September 2026 — the desk plan's three slices, one row, and the bridge's contract

Three sittings across three days, one engineer, five pull requests (#50 to #54), all merged by the
maintainer.

### What was built

**Slice 1 — the desk is the conversation, the rail is the record (#50).** The centre lost its
context card and its rows; Wellington's turns and the one composer are what remains. The left rail
holds the project card and four record rows — what it does, what kind, where it is, what it is
called — in the order the seats need them, ruled from Bob; each row says where its value came from,
and name and place keep a quiet typing box. The journey bar lost its caption and never scrolls,
collapsing to numbered rings.

**The naming ruling, then the one row (#51).** The six phase names became canon and agents say them
as written. The desk tab was renamed "Dispatches" to match production; the same day the tab words
became production's tool names, Map and Calculator; two days later the tab row went altogether.
The journey bar is the navigation: Dispatches first with a hairline after it, then the six phases.
Agents point people at the step, never at a tab.

**Slice 2 — the basin pin via Bridget (#52).** Her row appears once a place is known and asks for
the pin; a pinned basin fills it. Three eyeball rulings rode along: the desk's composer matched to
production's to the pixel and the desk column narrowed to 816 to share its edge; a plain-words rule
for Wellington — never "seat", "console", "dispatch", "rail" or "surface" — with the same words
taken out of what he reads and out of the desk's page copy; and the prompt-size gate raised to
24,000 characters.

**The bridge's contract (#53).** Production's proposal, carried by hand, recorded in item S7 as the
ruled contract and checked field by field against the code. Not built.

**Slice 3 — Phoebe's row closes the loop (#54).** The four record fields ride with each of her
requests as a second system block after the cache breakpoint, checked on the relay in a new
`api/_record.ts`; her prompt gained one rule; her opening reads the record back. Walked with real
calls: she started from the record, moved nothing until she had evidence, then moved one criterion
to met and one to not yet, and the desk showed her row.

### What was decided

- **Phase names are canon; tabs are gone; the bar is the navigation.** One row, offered to
  production later as item S15.
- **Wellington's words are a first-time visitor's.** Facts and rules only, no scripted line; his
  greeting is not scripted and never was — his first turn is a rule in his prompt.
- **Gates change on the maintainer's word.** The engineer raised one first and asked second; she
  accepted it and ruled for next time. It is now in CLAUDE.md's non-negotiables.
- **The bridge's shape**, five points, in item S7. The sender builds next, once she carries
  production's sign-up address, claim endpoint and key name.
- **The map's heaviness is logged, not fixed** (item O12), and the old `validate()` in Phoebe's relay
  is a later hygiene pass (item O13).

### What was learned

**The loop was one-way and nobody had noticed.** Phoebe's verdicts reached the desk from the first
day; nothing the desk learned reached her, and her panel asked the visitor to say it all again.
Slice 3 was named "Phoebe's row" and the row was already there; the missing half was the other
direction.

**A rule that grows a prompt trips a size gate.** Three rulings in a week each cost a hundred
characters. Trimming duplicated sentences was fine twice; the third time the right move was to ask
for the gate to move, and the engineer moved it instead.

**The visitor's own full stop meets our comma.** Read-back copy that embeds a sentence has to strip
its end, or it reads "households., in Kampala".

**The browser extension's captures fail on the map page.** The world-view redraw after a pin froze
the renderer past the screenshot timeout twice and once returned a tiled fragment; reading the DOM
by script got the state, and the desk captured once the map was hidden. Recorded as item O12.

### Mistakes, self-reported

**The prompt-size gate, raised without asking.** Above; accepted, and ruled for next time.

**A branch deleted on a wrong reading of "merged".** The maintainer wrote that #51 was merged; the
fetch showed it open, the sync deleted the local branch anyway, and it was restored from origin
with nothing lost. The report said so and she merged it later.

**The tab-row amendment lasted two commits.** Map and Calculator were built on the maintainer's
amendment and replaced by her next ruling before merge. Not a fault; recorded so the strikes in
item A11 make sense.

### Housekeeping

The close-out itself: items O13 and the slice notes, the build plan's "just finished" and "next",
the README and CLAUDE.md refreshed, the handoff rewritten fresh, the exports regenerated after the
checkpoint. The migration gate ran and found no migrations.

## 8 September 2026 — the bridge sender

**One sitting. Pull request #56, merged; this close-out is #57.** Item S7 built, closed and
archived. No real model calls.

### What was built

**The bridge sender (#56)**, in one pull request and three steps, on the maintainer's approved
plan. The three facts from production arrived by her hand at the open: the landing address, the
claim's shape and answers, and the key's name, `BRIDGE_KEY`, already set on Production.

*Step 1, the seal.* `POST /api/handoff` reads the visit as a seal — the four record fields with
their source tags, the pin as ids with `stressDerived` said outright, each criterion's state and way
forward, each pack's answers as typed with the pack's own word and the worked-example flag — and
refuses anything beyond that whole: a key not on the list turns the seal away rather than being
trimmed. A good seal is kept for one hour under a 32-character random ticket with `SET … EX NX`, so
a repeated ticket refuses rather than overwrites. Ten a day per visitor under the counter
`handoff`, charged after the shape check so a bad body costs nobody. The dev relay and the
api-exports gate learned routes in a subfolder, and a flat route now answers 404 below itself as
production does.

*Step 2, the button and the consent line.* The save row's link became the book's primary button
with the consent line under it; the click seals and moves the same window to production's welcome
with only the ticket in the address. Every state shows. The first capture was not approved: the
lines used "seal", "store" and "machine". Rewritten in a visitor's words, recaptured, approved.

*Step 3, the claim.* `GET /api/handoff/<ticketId>` behind the key, compared in constant time over
hashes and checked before anything else; `GETDEL` hands the seal over and deletes it in one
command; 200 once, then 404; 401 for a wrong key; nothing but the outcome logged.

**The check.** `scripts/check-handoff.mjs`, 65 checks against the stand-in store, including the
desk's own seal built by the compiled client going through the compiled route, and the whole round
trip ending with the seal gone.

**After merge, on the live site.** A seal from an empty visit came back with a ticket and an hour's
expiry; a wrong key and a missing key answered 401; the route's edges answered 405 and 404. The
right-key claims were left to the maintainer — the engineer never holds the key.

### What was decided

- **The plan, and the shape of the pull request.** One PR, not two: a button that seals before the
  claim exists sends a visitor to a door that does not open, and a claim with no button is
  invisible. One revert handle, one eyeball.
- **Ten seals a day**, own counter, same shape as the chat caps.
- **The pack's own word crosses**, all four, a label and never a figure.
- **The same window**, because the journey on this site ends there and browsers block a new tab
  opened after a network call.
- **Lines a visitor reads say what happens, in plain words.** No "seal", "ticket", "store" or
  "claim". Now in CLAUDE.md's scope note for the bridge.

### What was learned

**A gate that only looks at the top level waves through what it cannot see.** The api-exports gate
read `api/*.ts` and would have passed the first subfolder route unchecked. It walks now.

**Connect strips the mount path.** The dev relay handed the handler `req.url` with the mount gone;
a route that reads its ticket off the path would have read nothing. The relay now builds the
request from `originalUrl`, the way the platform gives it.

**The key is nowhere on the machine, and that is right.** The post-merge check that needs it is the
maintainer's, and the report says so instead of pretending the round trip was seen.

### Mistakes, self-reported

**The first capture's words.** The consent line and the local-only line were written in the
engineer's vocabulary. The rule was already on the desk — plain words a first-time visitor knows —
and it was applied to Wellington and not to the row. Caught by the maintainer at the eyeball.

**The crew rail's props were typed and not destructured**, and the check script reused a name.
Both caught by the type check and the script's own run before anything was committed.

### Housekeeping

The close-out itself: item S7 closed and moved to the archive in full, the third sweep; the build
plan's "just finished" and "next"; the README's desk paragraph and settings table; CLAUDE.md's
scope note; the handoff rewritten fresh; the exports regenerated after the checkpoint. The
migration gate ran and found no migrations.

## 8 September 2026, second sitting — the canon, the look pass, and the capture rule

**Three pull requests, #58, #59 and this close-out.** Items S7's live check logged, S16 logged. Three
real model calls: two to hear the canon, one for the look pass's first capture.

### What was built

**The canon (#58).** Four rulings on pace and posture, logged in AGENT_RULES.md and given to Phoebe
and Wellington as rules: short replies, one question at a time, every reply ends with the next step;
"I don't know" is a valid answer, offer options and move on; a planned project is normal, the
criteria are things to do and not a quiz, feasibility after eligibility is information and not a
gate; status lines in a visitor's words. Phoebe's waiting line says she is reviewing the criteria.
Heard on two real calls: Wellington short and one question; Phoebe right on the posture and long on
the words.

**The look pass (#59).** Eight changes to the screen, approved on two captures at 1280 by 720:
Wellington's first words warm and about the site, and the next step named in words; the project name
once, in the card; nothing under a record value but the pin's line, the explainer behind an (i); the
footer gone and the save button at the foot of the right rail; the phase names showing at laptop
width, rings only below 880; next steps in the right rail only, no button under his turn; the map's
one plain line; and the desk's grey intro paragraph gone.

### What was decided

- **The four canon rules**, above, binding on every agent.
- **Every capture for the maintainer's eyeball is attached inside the For Amy block as an image.**
  Ruled at the close, after two captures reached her only as chat attachments and local paths. Logged
  in PROCESS_RULES.md with the engineer's way of doing it: committed under `captures/`, embedded by
  raw address at the commit.
- **Item S16, phase screens**, logged from her item 12 as a candidate for production. Proposal
  first, images first, on her word.

### What was learned

**The rules were already there and the row was missed.** The plain-words rule had been applied to
Wellington and not to the desk's own copy, and the first capture used the engineer's words. The
second ruling of the day, on captures, was the same shape: a thing that reached the maintainer in a
form she could not use. Both are now written where the next session reads them.

**A branch cut from main before a merge lands still merges cleanly when the two touch different
sections.** The canon changed Wellington's base rules; the look pass changed his first turn; #58 and
#59 combined without a conflict.

### Mistakes, self-reported

**Two captures reached the maintainer as file paths.** She could not open them where she reads. She
ruled; the rule is logged; this close-out has no capture to attach.

**A strike-through was typed into a source file.** The journey bar's old constant was "struck" with
tildes in TypeScript for one edit before being replaced with a comment. Caught before the type check
ran.

### Housekeeping

The close-out itself: item S16 logged, the build plan's "just finished" and "next", the README's
desk paragraph, CLAUDE.md's scope note, PROCESS_RULES.md's capture rule, the handoff rewritten
fresh, the exports regenerated after the checkpoint. The migration gate ran and found no migrations.

## 9 September 2026 — the agent screen, in four slices

**Five pull requests, #61 to #64 and this close-out.** Item S16 built, closed and archived; its
B→A raise and its carry list for production wait on the maintainer's hand. Four real model calls
across the day: two for the pictures, one for the desk's capture, one for Phoebe's.

### What was built

**The proposal (8 Sep, second sitting's close).** Under 300 words, approved as written the next
morning: the shared parts, what differs per consumer, six slices in order, what each capture would
show, and no change to Phoebe's route. Amended the same morning to four tabs — Chat · Tool ·
Knowledge pack · Credentials — with the Knowledge pack its own tab, Credentials exam and scores only,
and memory never a tab.

**The pictures (#61).** Six captures at 1280 by 720, drawn inside the running app by script over the
real frame — the rail, the bar, the crew and the save button as they ship — with two real turns in
the bubbles. The desk with Wellington in bubbles; Phoebe's screen on the Chat tab; her Knowledge
pack, top and foot; her Credentials with the read-more layers open and honest; Bridget's screen with
Tool first. Approved on pixels with three rulings: the not-live line belongs on Chat, not on Tool;
the record's source shows only behind the (i); tabs wear the agent's colour, and the active crew card
takes the same underline.

**The desk (#62).** The screen built once in `src/screen/AgentScreen.tsx` and the desk its first
consumer. Wellington in bubbles; Chat · Knowledge pack · Credentials, no Tool; "Next phase:
Eligibility" read from the journey; the tab row on a Tide tint with the active tab darker, bold and
underlined; his crew card underlined in Tide. Both quiet tabs say what is true in a sentence.

**Phoebe's screen (#63).** Her chat in the centre on her Anemone tint, beta beside her name; the
worksheet as Tool; the Knowledge pack assembled from the committed cards, the approval date read
from the files' own status line, rows that open to the rule, the evidence and the citation; the
Credentials tab one component for every agent; her dock retired and the crew rail with the save
button in its place. The Chat tab body moved out of the desk into `src/screen/ScreenChat.tsx`.

**Bridget's and Calvin's screens (#64).** Tool first: the map and the calculator moved inside their
screens, mounted for the whole visit. One plain line on each Chat tab and no composer. Bridget's
pack the map's two datasets, cited as the licences module cites them; Calvin's pack the three live
method packs from the registry, each opening to its citation. Both docks and the old dock frame
deleted. The crew rail with the save button on every step.

### What was decided

- **Four tabs, and memory is never a tab.** The maintainer's amendment of 8 Sep 2026.
- **The three rulings on the pictures**, 9 Sep 2026, above; ruling 2 waits on a source being built
  into the rail, which nothing does yet.
- **Ten calls of the engineer's, each kept**: the active tab underline in the agent's colour and
  the "Next phase" button in Tide; a state chip's text in ink; Name · Role over the agent's bubble
  and no label on the visitor's; no "Where to start" paragraph above an empty conversation; Phoebe's
  composer note states her cap; Calvin's caveat strip not carried over, the worksheet already saying
  it three times; the roles Map and Calculator; no "Next phase" on Quantify; panels hidden by
  visibility so the map stays drawn; the old dock frame deleted with the docks.
- **The B→A raise** — the agent screen as a §7 component of the brand book — and **the carry list
  for production**, both recorded once under item S16 in the archive.

### What was learned

**Draw inside the running app.** The pictures were first attempted as saved page markup and the
extension refused to hand the markup out; drawing by script over the live page gave the real frame
for free and every pixel outside the centre column was already right.

**A forced `visibility: visible` on a child defeats `hidden` on its ancestor.** The screen's open
panel set it explicitly, the shell hid the whole screen, and the hidden screens' maps and
worksheets showed through Bridget's map in the first capture of slice 4. The open panel now inherits.

**The first click after a page load does not land in the composer.** Three slices in a row typed
into nothing on the first try. Focusing by script and dispatching the input and the Enter key was
what worked; noted in the handoff.

**A long shell command with a large quoted block fails to parse before running anything.** Twice.
Writing the block with the file tool and splicing it with short commands is the way; nothing was
half-done either time because nothing ran.

### Mistakes, self-reported

**The pictures drew a line under the record's values.** "Wellington heard this" was the engineer's
reading of the amendment on memory tagged by source; the maintainer ruled it behind the (i), on
hover, and no line under values. Nothing was built that way.

**One capture went out with hidden screens showing through.** Found on the engineer's own eyeball
before the pull request; the fix and a clean second capture went in the same commit.

**A type error on the pin's id** — the map's id is a number and the screen typed it as a string —
caught by the build, fixed in one line.

### Housekeeping

The close-out itself: item S16 closed and moved to the archive with its raise and its carry list, the
index row updated, the build plan's "just finished" and "next", the README's console paragraphs,
CLAUDE.md's scope note, AGENT_RULES.md's and the primer's "no tab row" lines corrected in place, the
prompt modules rebuilt, the handoff rewritten fresh, the exports regenerated after the checkpoint.
The migration gate ran and found no migrations. **Pull request #64 was still open on GitHub when the
close-out was written**, so the docs branch was cut from the slice-4 branch and the docs pull request
says so on its first line.

## 9 September 2026, second sitting — the handoff receiver

**One pull request, #66, and this close-out.** Item S13 built; item S12 parked by the maintainer's
word. Two real model calls attempted, one delivered.

### What was built

**The receiver.** The desk reads `?question=` from the address on arrival, cleans the address so a
reload or a shared link cannot send it twice, opens Dispatches and hands the question to Wellington
as the visitor's first turn, in a bubble, so his answer is the first thing a visitor sees. Nothing
is kept. Bad or empty input — missing, blank, over the cap, or a sequence that did not decode — is
ignored with no error; the page opens as it always opens. The parser is `src/lib/carried.ts`, with
no imports so the gate compiles it alone, and it carries the sender's contract in one line:
`?question=`, percent-encoded UTF-8 the way `encodeURIComponent` writes it, at most 500 characters
decoded, first occurrence only.

**The flag and the cap.** `Ask` gained an optional third parameter, `AskMeta { carried?: boolean }`;
Wellington's adapter passes it to the client, which adds `carried: true` to the body only when
true, and the relay reads it as exactly true. A carried question counts under its own counter,
`carried`, ten a day per visitor — the bridge's number — before his thirty and on top of it; a
refusal on either counter refunds the other, and every undelivered path refunds both. The
maintainer's sentence was "Ten-a-day cap applies"; the shape was stated as an assumption in the
pull request and approved with the merge.

**The gates.** `check-cap` grew to 36 checks — the carried counter to ten under its own name, his
thirty untouched, the relay reading the flag strictly and refunding on the undelivered path.
`check-wellington` grew to 60 — the parameter and the cap, a real question through, non-ASCII
through, blank, missing, over-long and broken encoding all ignored, whitespace folded, the first
occurrence only, the address cleaned and everything else in it kept, the shell reading it once.

**The docs.** Item S13 marked built with the contract recorded where the item said it would be;
item S12 parked as a later item, not built, with the note that the same receiver will feed it.

### What was learned

**React's development double-mount aborts a request started in the first mount's effect.** The
first real call put the question in its bubble and nothing else happened — no thinking line, no
answer, no error, and the local relay logged "aborted" before the handler ran. StrictMode's
simulated unmount ran the conversation hook's cleanup, which aborts whatever is in flight. The send
now sits in a zero-delay timer that the effect's cleanup clears and the repeated mount sets again,
so it fires once after mounting settles. A silent state, found on the engineer's own eyeball before
the pull request, and the code says why the timer is there.

**Two real calls attempted, one delivered**, both reported in the pull request. The aborted one
was stopped at the relay while reading the request body; the log shows no model reply.

### Decisions

- **The cap's shape**: a separate counter of ten for carried questions, on top of Wellington's
  thirty. Assumed, stated, approved with the merge of #66.
- **The receiver lands on the desk, not a hero page.** The hero chat is parked; the shell holds
  the one conversation, so the hero page will show the same thread when it comes.

### Housekeeping

The close-out itself: the build plan's "just finished" and "next", the README's console paragraph
on the door opening the other way, CLAUDE.md's scope bullet, item S13's cap note, the handoff
rewritten fresh, the exports regenerated after the checkpoint. The migration gate ran and found no
migrations. Local `main` had fallen behind `origin` at the opening — #64 and #65 had merged after
the last close — and was fast-forwarded before anything was built.

## 11 September 2026 — the Agent Commons, v0

**Three pull requests merged, #68 to #70, and this close-out.** Item S18's slices 1 to 3 — the
pictures approved, the address and the shelf built, open-one built — and two items logged, S19 and
S20. One real model call, to Phoebe, for a capture. The sitting opened after the machine died
overnight; nothing pushed was lost, and nothing unpushed existed.

### What was built

**The address and the shelf (slice 2, #69).** The console at `/` and the Commons at `/commons`, one
home in `src/lib/pages.ts` and the site's first rewrite rule in `vercel.json`. One word, "Agent
Commons", at the right of the top bar on both pages; the wordmark is the way back; the browser's
back button works. The console is hidden under the Commons and never unmounted, so a conversation
and the drawn map survive the step out and back. The shelf assembles one card per knowledge pack
from the registries — Phoebe's card sets, Calvin's three method packs, Bridget's two datasets —
each wearing its holder's face, every chip "not yet graded". The roster moved out of the crew rail
into `src/lib/crew.ts` and the row into `CrewRow.tsx`.

**Open one (slice 3, #70).** `Commons.tsx` is the page: one row under the top bar carrying the
sign-up door and, when a pack is open, the way back and the pack's name once. `CommonsSeats.tsx`
holds three seats on the one agent screen as its third consumer: Phoebe's with her own conversation,
asked with no record, and a worksheet of the seat's own that her verdicts move; Calvin's with a
calculator of its own, opened on the pack whose card was clicked; Bridget's with her datasets and
Credentials and no map. No "Next phase" anywhere; nothing beside the centre. The hosts, the pack
views and the Credentials tab are the console's, exported and never re-typed. The Credentials tab
now says the grade is the one public exam's, on every consumer. Each method pack carries a short
shelf line and a short document name, written once in the registry.

**The gates.** Unchanged in count and all passing at each pull request; nothing under `api/`
changed.

### What was learned

**An explicit `visibility: visible` beats a hidden ancestor.** The desk showed through the shelf
on slice 2's first capture, because each console surface's wrapper set "visible" outright — the
same fault the agent screen's panels had in item S16 slice 4. The open surface now inherits. Three
layers hide one another in this shell, page → surface → tab panel, and each new layer re-finds this
unless the rule is known. It is written at the wrappers.

**A history push inside a state updater doubles in development.** React runs the updater twice in
StrictMode, so every move to the Commons pushed two entries and the back button landed on the same
page. The push is outside the updater now. Found in the browser walk, before the commit.

**Two mounted screens of one agent shared ids.** The agent screen built its tab and panel ids from
the host's name, so the console's Phoebe and the Commons' Phoebe collided while both were mounted.
The screen now takes an id slug from its consumer. Found in slice 3's walk.

**The picture's hand-written lines were not the registry's.** Slice 1 drew short "good at" lines
and short document names by hand; the rule that nothing is typed twice put each pack's `measures`
sentence and the citation's full title on the card instead, and the cards ran to twice the drawn
height. The maintainer ruled the short lines into the registry, once, and the shelf reads them.
A picture drawn over the real frame still needs its words to come from where the build's will.

**The machine's clock and the maintainer's date disagreed by a day.** The clock read 10 Sep while
#68 merged and slice 2 was built; she dated her rulings 11 Sep. Her date is recorded everywhere,
and the disagreement is noted under item S18 rather than silently resolved either way.

### Decisions

- **An agent opens alone on the Commons** — no crew, no next steps; back to the shelf and the
  sign-up door the only other things on the screen. Her correction on the slice 1 pictures, canon.
- **The shelf is the crew.** No crew column on the Commons; shelf plus sign-up only.
- **Short lines and short document names on the cards**, drafted by the engineer, approved on
  pixels with #70.
- **Calls stated and kept**: no address per pack; the Commons' Phoebe is her own conversation, the
  third consumer's; the same daily caps; Bridget's map stays the console's; the sign-up door goes to
  waterbots.ai's front door.
- **Item S19 logged, the Workshop** — make your own agent on the Commons; the cost model in order;
  publishing reviewed by her first; every pack saved in both shapes; grading manual until Deb's rig
  runs on a trigger. Not built; proposal next, on her word.
- **Item S20 logged, "Connect with a human expert"** — a button beside sign-up on every Commons
  agent, a short contact form only, never the conversation. Not built; two design questions open.
- **Slice 4 waits on Deb's per-case file; slice 5, the flag button, is later.**

### Housekeeping

The close-out itself: the build plan, the README's Commons paragraph and its Credentials line,
CLAUDE.md's scope bullet, items S18 to S20, the handoff rewritten fresh, the exports regenerated
after the checkpoint. The migration gate ran and found no migrations. Thirteen local branches whose
remotes were deleted on merge are still on this machine, from before this sitting; harmless, and
pruned on the maintainer's word.

## 15 September 2026 — landing facts into the visit card

**One pull request merged, #74, and this close-out.** Item S13's receiver grew optional facts.
The maintainer said stop this sitting and not to open follow-up work unless she pastes a new brief.

### What was built

**The facts.** The same arrival that reads `?question=` now reads optional `does` (max 300), `name`
(max 80) and `place` (max 80). Good fields are written into the visit through the existing
`learnedContext` writer, provenance chat, so the visit card shows them and Phoebe receives them
with her record. The address is stripped of `question`, `does`, `name` and `place` together, so a
reload does not re-apply them. Today's first-turn path is unchanged: a good question opens
Dispatches and is handed to Wellington in a bubble. Facts without a question fill the card only;
no question is invented. Kind is never read. Unknown keys stay in the address.

**Bad input.** A missing, blank, over-long or unreadable field is ignored whole, never cut, and
never toasted. One bad field does not drop the others. Question-only URLs still work.

**The contract**, matching Shell A, in `src/lib/carried.ts`:

`https://map.waterbots.ai/?question=<≤500>[&does=<≤300>][&name=<≤80>][&place=<≤80>]`

Omit empty keys. No kind. No provenance in the URL — this site stamps chat. Caps are the sender's
job.

**The gate.** `check-wellington` grew from 60 to 77: the three fact caps, good facts through,
blank / over-long / broken encoding ignored without dropping a sibling, kind never read, facts
without a question still stripped, chat provenance stamped, the shell writing through
`learnedContext`, no toast.

### What was learned

**Wellington's first turn can overwrite chat-provenance fields he extracts from the question.**
The URL facts land first; if the question also names the place or the activity, his `context`
return then replaces those chat fields with what he heard. Typed fields stay protected. This
slice left that as-is: the card and Phoebe hold the URL facts until he answers; his chat was not
rewritten.

**React StrictMode still needs the facts held in a ref**, the same pattern as the question, because
the address is cleaned on first paint.

### Decisions

- **Wellington chat re-ask left as-is**, by the maintainer's yes of 15 Sep 2026. No prompt rewrite.
- **No follow-up from this sitting** unless she pastes a new brief.

### Housekeeping

The close-out itself: the build plan's "just finished" and "next", the README's carry paragraph,
CLAUDE.md's scope bullet, item S13's contract line struck and amended, the handoff rewritten
fresh, the exports regenerated after the checkpoint. The migration gate ran and found no
migrations. The wellington-free-site-brain worktree was removed at the sitting's open, on her
word. Two VWBA card drafts stay uncommitted.

## 16 September 2026 — Wellington treats filled visit fields as known

**One pull request merged, #76, and this close-out.** Item S13: the visit record reaches Wellington
on every ask. The maintainer said stop this sitting and wait for a new brief.

### What was built

**The visit on every ask.** `readRecord` is shared with Phoebe. Field lines are shared. Wellington
gets his own block headed “What this visit already holds”, after the cache breakpoint. Filled does,
name, place and kind are treated as known; he may still ask for anything missing. Kind is still
never in the URL. Phoebe's block is unchanged. The 300 vs 280 does-cap mismatch was left alone.

**The first carried turn.** The shell writes a visit ref before the deferred send, so URL facts are
on the first ask, not the blank visit from the last paint. Today's receiver is unchanged: facts
still stamp the card; a question still seeds the first turn.

**The gate.** `check-wellington` grew from 77 to 87.

**Browser.** Continue-style URL with does, name and place: card filled; he named those three and
only asked kind. Question-only: card empty; first turn still fires; he asked what the project does.

### What was learned

**The first-turn race is real.** `setVisit` in the same effect as `sendCarried` is not enough. The
ref must be written before the send. Proved: the browser POST on the facts URL already carried the
record.

### Decisions

- Reuse `readRecord`; Wellington-specific block; pass kind when the visit has it; keep the #74
  receiver and Phoebe's block; leave the 300 vs 280 does cap.
- **No follow-up from this sitting** until she pastes a new brief.

### Housekeeping

The close-out itself: the build plan's "just finished" and "next", the README's carry paragraph and
check-wellington line, CLAUDE.md's scope bullet, item S13's visit-aware line and gate count, the
handoff rewritten fresh, the exports regenerated after the checkpoint. The migration gate ran and
found no migrations. Two VWBA card drafts stay uncommitted.

## 16 September 2026 (second sitting) — knowledge-packs tree scaffold (open, v0.1.0)

**Pull request opened, not merged.** Scaffold only. No runtime wire. No SESSION_HANDOFF rewrite.
Kind still never in the URL. Two VWBA card drafts stay uncommitted.

### What was built

A public-safe `knowledge-packs/` tree at v0.1.0, matching folder names and stub shapes. Copy is
rewritten for the open rail. The word used for the road of phases is **pathway**.

Seat packs: `product-shared` (journey / roster / pathway; no `tools/`), `wellington-host` (host
stub; `tools/` notes none named yet), `phoebe-eligibility` (pointers at the live card files, not
copies; two tools so the shape is not one blob), `bridget-map` (the two live datasets),
`calvin-quantify` (one folder per live `methodPacks` key, plus empty D-4 and D-6 stubs already
named on the live D-3 pack), `reggie-library` (this site has no library seat; empty stubs, one
package per standard already on open).

Nothing in the tree is read by the live site. No method arithmetic was invented. No private files
were pasted.

### Decisions

- Empty `tools/` with a README note only for Wellington, who has no named tools.
- Future Calvin D-methods: only D-4 and D-6 as empty stubs, because the live D-3 pack already
  names them. No invented extra carbon folder; the two Gold Standard tools are the live carbon.
- Reggie included as a stub so the per-standard contract is visible.

### Housekeeping

`BUILD_LOG.md` note only. Handoff left as the previous sitting left it. DRAFT card files left
untracked.

## 17 September 2026 — archive stale session docs (prepare for packs)

**Pull request opened, not merged.** Docs only. Archive, never delete. No pack content. No
runtime wire. No live-site UI. Two VWBA card drafts stay uncommitted.

### What was built

`docs/archive/` stood up, with a README written for the open rail. Root
`SESSION_HANDOFF.md` moved to
`docs/archive/SESSION_HANDOFF_retired_2026-09-17.md`. `DESIGN_CANON_for_ShellB.md`
moved to `docs/archive/DESIGN_CANON_for_ShellB.md`. Each file opens with a
superseded-by header. There is no live root handoff; do not recreate one.

Opening reads are four: CLAUDE.md, PROCESS_RULES_for_ShellB.md, BUILD_PLAN.md,
OPEN_ITEMS.md. PROCESS_RULES remains the one home; CLAUDE.md points here.
Close-out no longer rewrites a handoff. BUILD_LOG stays not an opening read.
`knowledge-packs/` is live product knowledge, not archive.

The header of this file (a live pointer, not a session entry) was struck in
place so it did not keep naming a root handoff that no longer exists. Session
entries below that header were not edited.

### Decisions

- Paid shape: no live root SESSION_HANDOFF. Live state is OPEN_ITEMS, BUILD_PLAN,
  BUILD_LOG, and git. Never read the archive for current state.
- Full OPEN_ITEMS wall rewrite / closed-item sweep parked. Packs content, runtime
  wire, Deb export, and kind in the URL parked.

### Housekeeping

Root docs refreshed for this sitting. DRAFT card files left untracked. The
migration gate ran and found no migrations. `check-wellington` passed at 108 —
docs-only, the count is unchanged from before this sitting.

## 17 September 2026 — leftover root debt: chat-format archive and live claims

**Pull request opened, not merged.** Docs only. Archive, never delete. No pack
content. No runtime wire. No live-site UI. No primer rewrite. Two VWBA card
drafts stay uncommitted.

The sitting above said pull request #80 was opened, not merged. **It merged on
main the same day** (`ba045a3`). That line is left in place; this entry is the
correction.

### What was built

`CHAT_FORMAT_RULES_for_ShellB.md` moved to
`docs/archive/CHAT_FORMAT_RULES_for_ShellB.md`. A superseded-by header names
CLAUDE.md, CITATIONS.md, and AGENT_RULES.md as the live homes. Archive README
and the published README index point at the archive copy. CLAUDE.md and
PROCESS_RULES had no root link to fix.

OPEN_ITEMS north star: struck “only step 1 and part of step 2 exist today” and
Eligibility “the agent behind it is in progress.” Phoebe is live from 24 Aug
2026; Eligibility, Partners (the map), and Quantify are live. Families and
open rows were not swept.

Eligibility grader note 4: struck “not drafted yet.” Feasibility cards are
live. `api/_cards.generated.ts` regenerated so the relay matches the source.

BUILD_PLAN: #80 marked merged on main. README brand book version 4.1 struck;
4.2 from 31 Aug 2026, matching CLAUDE.md.

### Decisions

- Sitting 2 (OPEN_ITEMS slim / pathway vocabulary) and sitting 3 (primer
  “no tab row” vs screen tabs) not started.
- Regenerating the cards module is the mechanical follow-on of the grader-note
  correction, not a primer rewrite.

### Housekeeping

Root docs refreshed for this sitting. DRAFT card files left untracked. The
migration gate ran and found no migrations. `check-wellington` passed at 108 —
docs-only, the count is unchanged from before this sitting.

## 17 September 2026 — Vector leftover scrape / Calvin parity

**Pull request opened, not merged.** Docs only. No pack content. No runtime
wire. No live-site UI. No primer rewrite. Two VWBA card drafts stay uncommitted.

The sitting above said pull request #81 was opened, not merged. **It merged on
main** (`979e8a5`). That line is left in place; this entry is the correction.

### What was built

Inventory of `vector` (case-insensitive) on this repo, excluding lockfile and
`node_modules`. Live product copy already staffs Quantify as Calvin. One class A
hit: `src/styles/tokens.css` said Vector *holds* the paid calculator seat.
Struck and dated. Calvin is the only Quantify face here. Vector is not a second
chatbot face. Map/GIS “vector” words were not renamed.

`--bot-vector` was left in place (class C — unused paid-roster token, same
shelf as unused Audrey / Ally / Monty / Reggie). Brand book Vector-as-Calculator
left for Amy’s hand; the book is gitignored and is not edited without her word.

### Decisions

- Sitting 2 (OPEN_ITEMS slim / pathway vocabulary) and sitting 3 (primer
  “no tab row” vs screen tabs) not started.
- No paid `/api/agents` shim. This repo has no Vector agent route.

### Housekeeping

Root docs refreshed for this sitting. DRAFT card files left untracked. The
migration gate ran and found no migrations. `check-wellington` passed at 108 —
docs-only, the count is unchanged from before this sitting.

## 17 September 2026 — brand book §6: Calculator / Quantify is Calvin

**Pull request opened, not merged.** Brand book (gitignored) plus the tracked
note in CLAUDE.md. No pack content. No runtime wire. No live-site UI. Two VWBA
card drafts stay uncommitted.

The sitting above said pull request #82 was opened, not merged. **It merged on
main** (`0511053`). That line is left in place; this entry is the correction.

### What was built

`brand/BRAND.md` §6: Calculator / Quantify seat is **Calvin**, not Vector.
Struck and dated. Look table keeps Vector's portrait row and says that seat is
Calvin. `--bot-vector` not deleted. `vector.svg` not renamed. Book stays at
version 4.2. The book is gitignored and does not publish; CLAUDE.md records the
ruling so the pull request can be reviewed.

### Decisions

- Sitting 2 (OPEN_ITEMS slim / pathway vocabulary) not started.
- §2.6 “Mint as an identity means Vector” left alone; this sitting is §6 only.

### Housekeeping

Root docs refreshed for this sitting. DRAFT card files left untracked. The
migration gate ran and found no migrations. `check-wellington` passed at 108 —
docs-only, the count is unchanged from before this sitting.

## 17 September 2026 — Phoebe's VWBA pack is the cards' one home

**Pull request #84, merged on main** (`1bab56e`). A move, not an edit. Runtime
paths changed; card wording unchanged but one link; no primer rewrite; no
live-site UI change. Two VWBA card drafts stay uncommitted.

The sitting above said pull request #83 was opened, not merged. **It merged on
main** (`af850e9`). That line is left in place; this entry is the correction.

### What was built

Both card files moved from the repository root into
`knowledge-packs/phoebe-eligibility/vwba-2.0/cards/` with `git mv`; git records
them as 100% renames. Readers repointed: `src/lib/phoebeCards.ts` (two raw
imports, two filename constants, its root-location comment corrected with the
date), `scripts/check-cards.mjs` (one `CARDS_DIR` constant),
`scripts/build-prompt-modules.mjs` (two source paths). The generated relay copy
was rebuilt; its diff was the `Sources:` header line only.

The two pointer folders `tools/eligibility/` and `tools/feasibility/` are gone.
New pages: `vwba-2.0/README.md` (what she knows, helps with, does not cover;
one citation table with two rows), `vwba-2.0/CHANGELOG.md` at 0.2.0,
`vwba-2.0/tool/README.md` naming the worksheet and its reader,
`vwba-2.0/evals/README.md` saying no exam has been sat. Seat README and
changelog rewritten with the "stays a pointer" line struck. Tree README: the
new shape written as the rule going forward, one pack at a time, the old shape
struck and kept for the packs still on it; tree at 0.2.0.

Second commit, same pull request: line 44 of the eligibility cards linked to
the process rules by `./`, which resolved from the root. It now climbs four
levels. Generator re-run; `ELIGIBILITY_MD` differs by that one line,
`FEASIBILITY_MD` unchanged.

### How it was proven

The two exported strings were saved out of `api/_cards.generated.ts` before
anything moved and compared after the rebuild: `ELIGIBILITY_MD` 20,534 chars
identical, `FEASIBILITY_MD` 26,400 chars identical. The Eligibility step's Tool
tab was opened in the dev server before and after; the full page text hashed
the same (3,351 chars, same SHA-256). `check-cards` passed, the generator's
`--check` reported current, `npm run build` passed. Both captures were
committed under `captures/` and embedded in the pull request.

### Decisions

- **The pack is the home.** Overturns the pack README's "this tree stays a
  pointer" and the tree README's "nothing is wired", on purpose. Item K8.
- **New pack shape is the rule going forward, one pack at a time.** Phoebe's
  is the first; the others stay as scaffolded until their own briefs.
- **The broken link was fixed, not left as debt** — prove the move first, then
  fix as a second commit, one eyeball for both.
- DRAFT card files left alone; the maintainer moves them by hand. Their home
  is the cards folder once approved.
- Roster work is the next brief. Not started.

### What was learned

- The generated module's header names its sources, so a pure move still
  changes that file by one line. The gate compares the strings, and the strings
  were saved and compared by hand rather than trusted to the gate alone.
- Opening the Eligibility step in the dev server sends a real ask to Phoebe's
  relay. Two of the day's twenty for this browser went to the eyeball checks.
- A single shell command carrying seven markdown pages as heredocs failed to
  parse before writing anything; the pages were written with the file tool and
  the tree README by a small node script. Nothing was lost.

### Housekeeping

Root docs refreshed for this sitting: BUILD_PLAN, OPEN_ITEMS (row K8), CLAUDE.md
(one sentence in Scope), README (one paragraph). DRAFT card files left
untracked. The migration gate ran and found no migrations. `check-wellington`
passed at 108. Exports regenerated after the checkpoint commit.

## 17 September 2026 — the root tidy, and the export step retired

Second sitting of the day. One brief from the maintainer: tidy the root and
retire the exports step. Proposal first, a table of every file and folder at
the root with a call for each; approved as a batch of five steps, in order.
Three pull requests, stacked by her eyeball stops: #86 (the retirement, with
the gitignore tidy riding), #87 (the two moves), and a third carrying the
UI_REFERENCE retirement and this close-out. All open as this is written.

### What was built

Step 1. Close-out step 6 of the process rules struck and dated, its two
ordering paragraphs with it; the number kept so older references land. Item
O8 closed with a dated correction; the script question moot. BUILD_PLAN's
"not next" row no longer counts it. The `exports/` ignore block removed;
the folder deleted from the working tree. It held 21 `Shell_B_` copies, four
pull-request body drafts and one Python one-off from the §6 edit; nothing
tracked read it.

Step 5, riding with step 1 by her word. The dead `Calculator design ref/`
root rule dropped, comment corrected and dated. `.claude/settings.local.json`
written into this repository's ignore file; until then only a global ignore
on the maintainer's machine held it back.

Step 2. `agent-primer.md` moved to `knowledge-packs/product-shared/` with
`git mv`, history kept. Readers followed: `scripts/build-prompt-modules.mjs`
(two paths), `scripts/check-wellington.mjs` (one), `AGENT_RULES.md` (the
naming sentence, struck and dated). Generator re-run. Second commit: the
primer's six links climb two levels; the shared pack README strikes
"nothing here is wired", names the primer, changelog at 0.2.0; the tree
README says where it lives. Third commit: the capture.

Step 3. `OPEN_ITEMS_ARCHIVE.md` moved to `docs/OPEN_ITEMS_ARCHIVE.md` with
`git mv`. Nineteen links in OPEN_ITEMS, the README's table row and the
file's own four links follow. The README's duplicate OPEN_ITEMS row removed.
Both READMEs say the file sits beside `docs/archive/`, not in it.

Step 4. `UI_REFERENCE.md` moved by hand into `legacy/`, which is ignored
whole, so git sees no file change. CLAUDE.md's "follow the brand book and
UI_REFERENCE.md" struck and dated; the file's own ignore line removed.

### How it was proven

The two generated strings were saved out of the relay modules before the
primer moved and compared after: `AGENT_PRIMER_MD` 7,954 chars identical,
`WELLINGTON_PRIMER_MD` 3,913 chars identical, and identical again after the
link fix, because all six links sit outside both generated regions. The
generated modules differ by their `Sources:` header line only.
`check-wellington` 108, `check-vwba-d3` 69, `check-cards`,
`check-api-exports`, the generator's `--check`, and `npm run build` all
passed. 180 relative links across the touched documents resolved, none
missing. One real call to Wellington on the dev server for the capture: he
named Phoebe and the Eligibility step from the moved primer and filled two
record fields. One of his thirty for this browser.

### Decisions

- **The export step is retired**, the maintainer's ruling: the library syncs
  from GitHub. The close-out now ends at the checkpoint commit and the
  `main` equals `origin` check.
- **The shared pack is the primer's one home**, on Phoebe's cards pattern.
- **The items archive is live history, not a retired document**, so it
  lives under `docs/` beside the archive folder and not in it.
- **The brand book governs design alone.** UI_REFERENCE.md had never been
  used by any session's build.
- **Kept, each with a live reader:** `captures/` (fourteen merged pull
  requests embed from it by raw address at a commit, and the process rule
  names it), `Design refs/`, `legacy/` (`build-stress` reads the Aqueduct
  download from it), `data-src/` (three scripts).
- **Not in this batch:** the OPEN_ITEMS sweep. Her word: log it as the next
  brief, and she wants the list triaged, not just swept. Item O11.
- **Pull requests stacked by eyeball stop**: each of the second and third has
  the previous branch as its base, so its Files changed shows only its own
  work; GitHub retargets to `main` as each one merges.

### What was learned

- `git add -A -- <old path>` fails once `git mv` has staged the rename,
  because the old path no longer matches anything. Stage the new path.
- A rulebook change wants its own revert handle, so a five-step batch that
  touches two rulebooks is three pull requests at the fewest, not one.
- Stacking a branch on the previous one keeps each review's diff to its
  own work when two steps edit the same file (OPEN_ITEMS.md twice today).

### Housekeeping

Root docs refreshed for this sitting: BUILD_PLAN, OPEN_ITEMS (O8, O11, K8's
next-brief line), CLAUDE.md (step 4), README (the table), PROCESS_RULES
(step 1). DRAFT card files left untracked. The migration gate ran and found
no migrations. Dev server stopped at the close. No export step: there is
no longer one. `main` equal to `origin` at the close; nothing merged yet.

## 18 September 2026 — the OPEN_ITEMS triage

One brief: triage OPEN_ITEMS, proposal only, then her go with rulings.
Housekeeping first on her word: 29 local branches whose remotes were gone
and whose commits were all in main, deleted; `wellington-free-site-brain`,
never pushed, had zero commits outside main and was deleted on her word.
Two pull requests, stacked: #89 (O5's rule into the process rules, its own
because it is a rulebook change) and the sweep with this close-out.

### What was built

The proposal: `triage-2026-09-18.md` at the root, untracked, one line per
open row — id, six-word title, bucket, reason — plus the orphans, the pairs
and the counts. 45 open rows sorted: BONES 7, WALKTHROUGH 2, PARTNER 3,
PARK 15, CLOSE 18. Eight orphan threads named with a proposed home. Six
pairs named. The terminal showed only the counts and the top five BONES.

Her go, with rulings: A7 closed on the benign reading; O5's rule carried
into PROCESS_RULES first, dated, then swept; orphans and pairs as proposed,
including the two new rows; three new BONES rows in her words.

Step 1 (#89). PROCESS_RULES gains "Approval is never a commit word for
main" under "How work moves": O5's words quoted, dated 24 Aug, marked
carried 18 Sep, with one paragraph reading it together with the batch
ruling of 28 Aug — commits on a branch and pull requests are part of an
approved batch; nothing reaches main without her word. Flagged in the For
Amy block for her check.

Step 2, first commit: the sweep. A script moved the eighteen sections from
OPEN_ITEMS.md to docs/OPEN_ITEMS_ARCHIVE.md bottom-up, appended one dated
close line to each saying why and where anything it still named now lives,
rewrote the sections' relative links for the new folder, left a stub and
marked each index row swept. The archive gained Knowledge and Agents
sections and a fifth-sweep line. Second commit: the Bucket column in the
index table, its four stray blank lines removed (they had split the table
into five in rendered markdown), the buckets defined once under Families,
five new rows — A12, A13, K9, K10, O14 — three folds (O13, S5, O9), pair
notes (K2, O1, S11), and O11's record of the triage. Third commit: this
close-out.

### How it was proven

A second script took each moved item's original text from `main`, applied
only the link rewrite, and asserted it appears verbatim in the archive:
18 of 18. Relative links across both files checked after each commit,
none missing. The index table parsed row by row; a row that failed to
parse or lacked a bucket would have stopped the script before writing.
OPEN_ITEMS.md: 2,881 lines before, 1,627 after the sweep, 1,804 after the
new rows. The archive: 2,196 lines.

### Decisions

- **Buckets are a second axis, not a replacement for families.** A family
  says what kind of thing an item is; a bucket says what it is for now.
  Families did not change.
- **CLOSE means swept, not deleted.** Every closed item keeps its index
  row, shown as *closed*, and its full text in the archive.
- **Items open only "as the home for a story" close.** The archive keeps
  stories in full; an opening read is a briefing.
- **A rule found living inside an item goes into the rulebook before the
  item closes** (O5), by her word.
- **"Levels are Meet, Screen, Work"** is recorded as her words and not
  defined here; it is defined when `roster.yaml` arrives.
- **The proposal file is deleted after the merge**, by her word; the root
  stays clean.

### What was learned

- Chained string replacements bite: rewriting `](./docs/archive/` to
  `](./archive/` and then `](./` to `](../` turned the first result into
  `../archive/`. Order the broad rewrite first, then undo its one
  exception. The link check caught it before anything was committed.
- A markdown table with a blank line inside it is several tables. The
  index had carried four such lines since at least 30 Aug.
- A triage of 45 rows fits in one sitting when the sort is written before
  anything moves and the move is a script that refuses to run on a row it
  cannot parse.

### Housekeeping

Root docs refreshed for this sitting: BUILD_PLAN, OPEN_ITEMS, PROCESS_RULES
(#89). CLAUDE.md and README untouched. DRAFT card files left untracked.
The migration gate ran and found no migrations. No dev server was started.
`main` equal to `origin` at the close; nothing merged yet.

## 18 September 2026, second sitting — one roster (item A13)

One brief, one pull request: #91, `feat/a13-one-roster`, open at the close.
Proposal first, to `proposal-A13.md` at the root, untracked; her go with
four rulings; the file deleted on her word before the branch was cut.

### What was built

Step 1: `roster.yaml`, her carry, committed as carried — the repository's
`text=auto eol=lf` stores it with LF, the one difference from her file, and
said so in the For Amy block. `scripts/check-roster.mjs`, with `yaml` as a
dev dependency and the TypeScript compiler API for the crew file and the
shelf, so a failure names the exact line. `npm run build` runs it first;
`npm run roster:check` runs it alone, under production's name for it.
Step 2: the shared pack README's roster table struck and pointed at the
file; Reggie's line corrected in place; pack 0.3.0, tree 0.3.0; the root
README's check list. Step 3: Bridget's role in `crew.ts` to "Partners",
two captures. Step 4: this close-out.

### How it was proven

The check tripped on exactly one line before step 3 — `crew.ts:57` against
`roster.yaml:92` — and on nothing else, as the proposal said. Three faults
provoked on a scratch copy of the roster (an unquoted built word, a retired
name as a face, a missing `phase`) each named their line; the file was
restored and compared byte for byte. After step 3: 264 checks, 0 problems;
`npm run build` green with the check in front; `check-wellington` 108;
`build-prompt-modules --check` current, both generated prompts unchanged.
Two captures in the browser at 1440 wide: her card on the desk and on the
Commons shelf, both reading PARTNERS.

### Decisions

- **Checked, not generated.** The crew file holds what the roster does not;
  the primer is her prose with its struck history. Her go on the proposal.
- **A model cannot follow a pointer.** Wellington's "four people" sentence
  stays her wording and is checked for names and count, never rendered.
- **Allowed words are read from the file** for levels and doors; the
  `built` words are one table in the check, because each one carries a
  rule about what the primer may say. She may add "partly" at the source.
- **This site never edits the roster.** The Bridget trip was fixed in
  `crew.ts`, by her ruling; the wording fault in the roster's own comments
  goes to the source, by her hand.

### What was learned

- The gates in the README are run by hand; Vercel runs only the build
  command. "On every build" therefore means in front of `npm run build`,
  and a failed check now blocks a deploy. Said plainly in the proposal.
- Wellington's crew facts put a name on a bullet's second line. A check
  that reads bullets must join their run-on lines first; the first draft
  did not and tripped twice on true facts.
- A per-door "ok" line for ten seats is 200 lines nobody reads. The shape
  checks stay counted and go quiet; one summary line per seat instead.

### Housekeeping

Root docs refreshed: BUILD_PLAN, OPEN_ITEMS, CLAUDE.md (one Scope bullet).
README's check list. The migration gate ran and found no migrations. The
dev server was started for the two captures and stopped. DRAFT card files
left untracked. `main` equal to `origin` at the close; nothing merged.

### After the merge, same sitting

#91 merged on her eyeball; the branch deleted by the merge setting. On her word one row was
logged and not fixed: item A14, the screen host records' own role words for Bridget and Phoebe,
which are not drawn (Bridget's) or not checked (both). Either they go or the check reads them; one
home. The row went up in its own small pull request, because nothing reaches `main` on the
strength of an approval. `main` equal to `origin` at the close.

## 20–21 September 2026 — the specialist contract, Phoebe first (item A15), steps 0 to 3

One brief, one batch. Proposal first to `proposal-agent-contract.md` at the root, untracked;
her go with four rulings (R1 rung 2 stays and line 8 adds the hand-back; R2 the notes split
first; R3 the shown line on prose with a capture; R4 the bar, no worse than 1 in 60, stop and
tell her if worse) and one addition, the measured counts and the run's cost in one plain
sentence in every For Amy block; the file deleted on her word. Line 10 arrived by her word
before the rulebook merged, with where the project context is at each door; the addition to
steps 2 and 3 for it was reported and went on her go. Three pull requests merged on her
eyeball: #93 (step 0, own, rulebook), #94 (step 1, own, cards), #95 (steps 2 and 3). The
session stopped on her word after #95 with steps 4, 5 and 6 recorded in BUILD_PLAN as
pull request D.

### What was built

Step 0: "The specialist contract" in AGENT_RULES.md, her ten lines, her words; ten-row tables
on three pack READMEs; the tree README's one line; item A15; item O14's carry. Step 1: the
grader notes out of both card files into `cards/grader-notes.md`, 155 lines carried whole,
none reworded, none added; the relay's copy shrank by exactly the moved text, 6,358 and 4,453
characters; `scripts/measure-phoebe.mjs`, the sixty-request instrument from item A6, run by
hand. Step 2: an AGENT-FACING region in her pack's `tool/README.md`, a fourth bundle row in
`build-prompt-modules`, `api/_tool.generated.ts`, and "Your tool" in her prompt; her level
sentence, screen, held to the roster by a new block in `check-roster` (267); Wellington named
as her lead. Step 3: `readWorksheet` and `worksheetBlock` in `api/_record.ts`; the rows sent
from `PhoebeScreen` and the Commons seat through `carriedWorksheet`; the block after the cache
breakpoint in `api/phoebe.ts`; rule 10 in her prompt; the rail's (i); ten new checks in
`check-wellington` (118).

### How it was proven

Two measured runs, sixty requests each, zero empty, all sixty stop reasons `end_turn`, both
within her bar: after step 1, 60 calls, 1,192,840 input tokens with cache reads included,
26,579 output; after steps 2 and 3, 60 calls, 1,256,680 input, 24,312 output. The Tool and
Knowledge pack tabs captured byte-identical before and after the notes split. The level check
provoked with a wrong word named `api/_systemPrompt.ts:77` against `roster.yaml:85`. One desk
walk for stop 3, two captures: she names her tool, its six rows and three states, her level,
and Wellington; after one piece of evidence she reads row three back as Met from the block,
says what settled it, and tells Not yet checked from Not yet.

### Decisions

- **The contract lives in the rulebook; the per-agent table lives on the pack.** One home
  each. She carries the rulebook section to production (item O14).
- **Line 10's tool list is generated from the pack, the primer's pattern**, so what she is
  told about her inputs cannot drift from the pack; the gate holds it to the record block's
  own field names.
- **The level sentence is typed and checked, never generated** — the A13 ruling applied; one
  sentence covers both doors only because the roster gives both "screen", and the check says so.
- **The worksheet block is the record's eligibility section.** Her official results, read
  back to her, carried on the seal. Wellington reading it is his side, named and not built.

### What was learned

- The Chrome extension's screenshot timed out on every capture of the console, the stall item
  O12 recorded; a headless Chrome over the DevTools protocol from a scratchpad script
  captured cleanly at 1440 by 900 and drove the walk. Not in the repo.
- A measured run that fails forty-four times in a fifth of a second each is the key, not the
  prompt: "credit balance is too low", a 400 the late-400 retry rightly does not retry. Stopped
  and told her per R4; she topped up; the clean rerun stood.
- The worksheet block costs about 1,000 cached tokens a call (cache read 19,847 to 20,911),
  against the 10,811 characters the notes split took out.

### Housekeeping

Stacked pull requests B on A: B retargeted to `main` before A merged with delete-branch, per
the stacked-merge lesson. Dev server started with `PHOEBE_DIAGNOSE=1` for the runs; headless
Chrome on port 9222; both stopped at the close. DRAFT card files left untracked. The proposal
file deleted on her word. `main` equal to `origin` after each merge and at the close.

## 21–22 September 2026 — the specialist contract, Phoebe first (item A15), steps 4 to 6, and her rulings at eyeball stop 4

Steps 4, 5 and 6 committed on `feat/contract-phoebe-hand-back`, then two of her rulings from
eyeball stop 4 added to the same branch before the pull request opened, then merged as #97
on her eyeball after she walked it herself. Batch complete: four pull requests, four eyeball
stops, all four passed.

### What was built

Step 4: `handBack` on her answer, `none` or `wellington`, checked against a closed list by
the relay (`api/_handBack.ts`) and the client; the way back drawn from the field alone —
"Back to Wellington on Dispatches" here, "Back to the shelf" on the Commons. Step 5: her
prompt walks the six rows in the manual's order, one row, one question, from the first
unchecked; `worksheetCaption` in `src/lib/criteriaState.ts` draws "Worksheet: 3 Met · 0 Not
yet" under any turn that moved a row, in the citation line's own class, no new colour. Step
6: `PHOEBE_DIAGNOSE` and every `diag()` call removed from `api/phoebe.ts`, 119 lines, all
removals; the measured-run method written into the pack's `evals/README.md` as an internal
gate, one paragraph, no score.

Her two rulings at eyeball stop 4, built into the same pull request: Wellington's own copy of
the same diagnostic switch removed from `api/wellington.ts`, 34 lines, so the A6 instrument
is gone from both relays, with two new checks in `check-wellington` holding it out of each,
each provoked and seen to fail before it passed; and her scope written into Phoebe's prompt
as facts she phrases herself — "What you check today, and what is coming" — eligibility under
VWBA 2.0 today, carbon eligibility a second pathway, coming and not live, no carbon cards, a
project may qualify on one pathway and not the other. One line in row 7 of her pack's contract
table. One capture, of her saying that scope unprompted in her own words, driven by a headless
Chrome script against the local relay and committed to `captures/`.

Three of her rulings logged as new open items, none started: **A16**, Wellington guides and
leads and never asks "water or carbon" at the door, because which pathways apply is a finding
and finding it is Phoebe's; **A17**, the handoff goes both ways — her hand-back is built, his
side of the return, reading what she found, is not; **K7 expanded**, her second pack
`gs-paa-v2.0` in the pack shape beside `vwba-2.0`, with a cited "does this apply" test on every
pack so she knows which worksheets to fill and reports each pathway on its own.

### How it was proven

Three measured runs on the final prompt, all zero empty in sixty, within her bar of 1 in 60
(ruling R4); the middle run (after step 5, before step 6) carried 1 empty in 20 on the
twenty-request walk, the A6 signature, reported to her before going on, and she said go on.
One full measured walk on the final prompt: six verdicts in seven turns, order kept in six of
six moving turns, one question or none in seven of seven replies, hand-back set to Wellington
on the last turn, zero empty. Pack `vwba-2.0` at 0.4.3 with changelog entries for all three
steps and the stop-4 rulings.

### Decisions

- **The instrument comes out of both relays, not just the one it was named for.** Step 6's
  brief named Phoebe's relay only; her ruling at the walk widened it, on the reasoning that a
  switch left in one place is a switch that can come back in the other by habit — which is
  also why two checks now hold it out rather than one.
- **Scope is a fact, phrased, not a sentence recited.** Consistent with the ruling of 3 Sep
  2026 (item A9): the prompt states what is true and tells her to say it in her own words: no
  prompt anywhere hands an agent a sentence to repeat word for word.
- **No robot screenshots for eyeball stop 4.** Her word: she walked the desk herself from a
  Vercel preview link and three plain steps in the pull request, rather than the engineer
  capturing it for her. The one capture that did ship was for a single fact — her scope in her
  own words — not a stand-in for her own walk.

### What was learned

- The composer-and-send-button probe that finds a visible textarea by placeholder has to
  filter on computed visibility, not just `offsetParent`: every mounted screen keeps its panel
  in the DOM, so the first matching element in document order can belong to a hidden pane. The
  first driver script for the capture clicked a disabled Send button on Wellington's hidden
  composer and nothing happened; the second, filtering on `getComputedStyle(...).visibility`,
  worked first try.
- A stray backgrounded shell from an earlier `python - <<EOF` attempt was left waiting on
  stdin from the previous session onward; found and killed at the start of this session
  before any work began, per the opening ritual's "kill stray dev servers" step, widened to
  stray shells generally.

### Housekeeping

Dev server and headless Chrome (port 9222) both started and stopped within the session.
`main` equal to `origin` before the merge and after it. Pull request #97 merged with
delete-branch; the migration gate checked and clear, as it always is here. The generated
pack modules (`api/_cards.generated.ts`, `api/_tool.generated.ts`, the two primers) checked
current against their committed sources — this batch's changes live in `api/_systemPrompt.ts`
and the hand-back/caption machinery, not in generated card or tool content, so nothing was
owed there. Two untracked DRAFT card files left alone, as before.

## 22 September 2026 — Phoebe's carbon pack (item K7): the three-layer read, the proposal, her rulings, and steps 1 and 2

One brief, pasted at the open: the next brief from BUILD_PLAN, proposal only, to the repo root,
untracked, no cards drafted. Read `sources-local/Methodology` at three layers and inventory every
basic eligibility requirement for a safe-water project, citing document, version and section;
then propose the card set, a cited "does this apply" test for both packs, how Phoebe decides which
worksheets to fill and reports each pathway on its own, one worksheet row per requirement, sized in
steps with eyeball stops. Then, the same day, her rulings on the proposal and a second brief: build
pull request A, steps 1 and 2 only, and stop at stop 1 for her grade.

### What was built

The proposal, `PROPOSAL_K7_gs-paa-v2.0.md`, untracked at the root: a register of every document
read with its canonical page and whether it resolved; an inventory of 32 basic eligibility
requirements in three layers, each cited to section and page, with what it applies to and which
external standard governs it, and a table of everything read and deliberately not made a row; the
applies test, four cards for the carbon pack drawn from the methodology's scope words and the
Paris-alignment sunset, two for the water pack drawn from the VWBA glossary and Appendix A; the
walk, the arithmetic that trips the cap, one tool with two sections, rows keyed by pack in the
record and the seal; nine steps in four pull requests; seven rulings; and the defects found in the
sources, raised and not fixed.

Then, on her rulings, steps 1 and 2 on `feat/k7-gs-paa-pack`. Step 1: the scaffold
`knowledge-packs/phoebe-eligibility/gs-paa-v2.0/` in the ruled shape — README with what she will
know, help with and not cover, the timing facts the standard fixes, and every cited document with
its confirmed page; changelog; `cards/` with a note and no cards; `tool/` naming the carbon section
of the one worksheet with no agent-facing region; `evals/` saying no exam sat. The seat README and
changelog to 0.5.0, the tree to 0.6.0, the water pack's README to 0.4.4 with its "Gold Standard's
methodology lives in Calvin's packs, not here" line struck and corrected. Step 2: six applies cards
as two `-DRAFT` files at the root, untracked, never read, for her grade.

### How it was proven

`check-cards` 267 checks green; `check-roster` green; the three generated prompt modules current.
Nothing on the live site reads the new folder: the reader, the gate and the generator still name
the water pack's files by path, so the scaffold is invisible to the build. The site is unchanged.

Every Gold Standard canonical page confirmed by fetching it on 22 Sep 2026: seven resolved at the
`<number>-<slug>/` guess (101, 102, 103, 201, 429, 447, 501); the five that did not (104, 107, 118,
119, 120) were found through the publisher's own site search, and their real slugs are written into
the pack README. The three WHO and JMP pages are not yet confirmed and the README says so.

### Decisions

- **R4 as amended is a rule about how questions are written, not only how verdicts land.** Her
  words: questions cover both pathways whenever one answer can, so the free site screens well. It
  goes into the applies cards' "how the test is run" preface now, and into Phoebe's prompt at
  step 8.
- **R5: the cap stays at 20.** The proposal reported the trip (six rows in seven turns measured;
  up to 32 rows plus the tests) and proposed 40. She held it at 20 and will revisit after the
  first real walk. Recorded; not moved.
- **Transitioning projects get no rows of their own.** The methodology has no transition clause;
  the timetable for this method lives in Annex 5 of the auditor's requirements (120). So a
  transitioning project is judged on V2.0's rows with a version flag from card T4 that changes
  when certain rows must be met, and T4 cites 119 and 120 beside the methodology.
- **"Basic" was defined before the rows were counted**, so the 145-row raw read did not become a
  145-row worksheet: a condition in "shall" or "is not eligible" words that decides entry and that
  an owner can answer at screening. Everything set aside is listed with its reason.

### What was learned

- `pdftotext` is on this machine's PATH; the Gold Standard PDFs extract cleanly with printed
  footers matching the page index, and the VWBA manual does not. The V2.0 methodology's
  definitions table mis-aligns labels against text under layout extraction and must never be
  quoted raw. Saved to memory.
- The inventory was fanned out to three parallel reads, one per layer, each returning a cited
  table, then spot-checked against the source text at the lines that mattered most (the
  applicability section, the positive list, the sunset clause, the transition annex). The layer
  reads found two things a single pass would likely have missed: the mis-pointed WHO table, and
  that the transition rule for this method sits in the auditor's document, not the methodology.
- A heredoc through the shell failed on the proposal's length and punctuation; the dedicated
  write tool was used instead. Not a rule, a note.

### Housekeeping

`main` equal to `origin` at a86bf9e at the open; nothing changed underneath since the contract
batch closed. Two node processes running belong to the production repository and were left
alone under rule zero. No dev server started. The migration gate checked and clear. The two older
untracked DRAFT files (activity table, glossary) untouched; two new untracked DRAFT files beside
them. The proposal file stays at the root until the work merges.

## 23 September 2026 — a guide, not a gate (items A18 and A16): the proposal, her rulings, and the rulings into the record

Two briefs in one sitting, both pasted before she graded K7's applies cards. First: a proposal,
not a build, on five findings from her card review — Wellington names a standard project type
from a cited list and confirms before logging; Phoebe is a guide, not a gate; never invented;
unknown is not a fail; a readiness read, not pass or fail. Then her rulings on it, R1 to R9 yes
with three riders, and a second brief: build pull request 1, the rulings into the record, and
step 2, the types file draft, and stop at stop 2 for her grade of twenty-five lines.

### What was built

The proposal, `PROPOSAL_guide-not-gate.md`, untracked at the root: the three standing rulings it
moves and why the source carries the change (Figure 3's own loop); a twenty-four-type list on two
axes in one shared file, confirm then log, "what kind" retired; five row states with Blocked
only where a card's **Can it be fixed?** line allows; the readiness read's three words and their
definitions; twenty-eight cited routes, nine water and nineteen carbon, resting on pages already
read and one real published project, the Meta 2023 report's Navajo water supply; the offer of a
person through the save door with two fields on the seal; the reading-level rule found already in
the rulebook; nine steps, five eyeball stops, one contract change for production; nine rulings.

Then, on her rulings, on `feat/guide-not-gate-rulings` stacked on K7's branch: the fifth rule under
*Pace and posture* in AGENT_RULES.md in her words; the hard-gate design decision of 20 Aug 2026
struck and corrected in place at the head of `eligibility-cards-vwba.md`; item A16 expanded with
her finding and the roster rule for the types file; a new item A18 as the work's home with her
riders verbatim; three carries added to item O14; the K7 proposal marked superseded in part; pack
changelogs bumped. And `project-types-DRAFT.md` at the root, untracked, twenty-five lines.

### How it was proven

`check-cards` green after the correction; the relay's card module regenerated and confirmed to
hold the corrected paragraph; `check-roster` untouched. **The correction reaches Phoebe's prompt**,
which the proposal's "docs only" label for pull request 1 did not foresee: the card file embeds
whole. So the measured run was made, sixty requests against the local relay, and its counts are on
the pull request; the corrected paragraph tells her the worksheet keeps its three states until the
build lands, so her behaviour today is unchanged by design.

### Decisions

- **The correction goes into the card file now, not at the build.** The visible-corrections rule
  wants a superseded assertion struck where it stands, and the rule's one home is the rulebook;
  the card file points there. The cost is one measured run, paid.
- **"The reviewer" and "Q11" are recorded in her words and not decoded.** Who the reviewer is and
  what Q1 to Q10 are is the paid side's; the carry on item O14 says what she said.
- **The types file is drafted here and will be owned there.** Her rider makes it the roster's
  twin: once carried, this site is held to it by a check and never edits it.

### What was learned

- A "docs only" pull request is not docs only when the document is a card file: the generator
  embeds every card file whole, so any edit above the first card is a prompt change. Worth
  remembering before the next design-decision correction; the AGENT-FACING region pattern is the
  way to keep people-facing prose out of a prompt, and the card files do not use it.
- The proposal's own For Amy block came in at 152 words on the first count and had to be cut
  twice to reach 149; count before claiming.

### Housekeeping

Dev server started on 5173 for the measured run and stopped after it. `main` still equal to
`origin` at a86bf9e; pull request #99 open and unchanged. The migration gate checked and clear.
Four untracked DRAFT files and two untracked proposals at the root, all named on their items.

## 23 September 2026, second sitting — the no-strikes canon, two merges, the types file home, and stop 3

Her grade of the types draft ("ships, one edit") arrived with a new canon and a build order: no
crossed-out text in any live document, applied to #100 at once; one open item in a new cleanup
family for the older strikes; a second item for exportable tools; then merge #99, retarget and
merge #100, confirm main equals origin; move the types file into the shared pack; draft step 3 and
the water half of step 4 at the root; stop at stop 3.

### What was built

**Into #100 before it merged.** PROCESS_RULES' *Visible corrections over rewritten history* replaced
by *Corrections replace text; the archive keeps the old wording*, in her words; the old section's
whole text is the first entry of `docs/archive/CORRECTIONS.md`, a new file indexed in the archive
README. Every strike this batch had made (#99 and #100) replaced by current text: the head of the
eligibility card file, whose 20 Aug 2026 paragraph now sits whole in `vwba-2.0/CHANGELOG.md`; the
seat, water-pack and tree READMEs, their old wording in their CHANGELOGs; the K7 row here and the
K7 heading in BUILD_PLAN, in the archive file. A sixth family, Cleanup, with its reason and item C1
in her words; item S21 in her words. The card module regenerated; a second measured run on the final
prompt, 0 empty in 60, 1,336,000 input tokens.

**Merges, on her word.** #99 merged without deleting its branch; #100 retargeted from that branch to
`main`, then merged with its branch deleted; the K7 branch deleted after. `main` equal to `origin`
at 8eb4f71.

**The types file.** `project-types-DRAFT.md` moved into `knowledge-packs/product-shared/` as
`project-types.md` with the one citation edit from her grade and its status line approved; the
grader notes moved whole into the shared pack's CHANGELOG 0.4.0; tree 0.7.0; the pack README and
the tree folder map name it. Nothing reads it yet. On `feat/project-types-shared`, pull request
open.

**Two drafts at the root, untracked, for stop 3.** `can-it-be-fixed-vwba-DRAFT.md`: six lines, one
per water criterion, five *yes* and one *depends* (criterion 4, on whether the sponsor is legally
obliged, with the card's two carve-outs); `routes-cards-vwba-DRAFT.md`: R-1 to R-9, each two or
three short sentences resting on a guidebook page read this session — Figure 3's loop, Step 1,
Step 3, Steps 4.3 and 4.4, Appendix E and Table E-1, method D-3 — and one on the Meta 2023
report's Navajo Community Water Supply project.

### How it was proven

`check-cards` green after the head rewrite; `git diff` against the merge base adds no `~~` line
except two pre-existing strikes that share a line or a generated string with an edit. The second
measured run within the bar. The Meta report's address on Meta's sustainability site resolved but
was too large for the fetching tool to read; the card says so and waits for her eyeball.

### Decisions

- **Criterion 4 is *depends*, not *no*.** The proposal's first cut had it as the water pathway's one
  true disqualifier; read against the card's two carve-outs, a flat *no* would make them
  unreachable. The line names the one legal fact and allows Blocked only once it is confirmed. Her
  grade decides.
- **Grader notes for a shared-pack file go in its CHANGELOG.** The pack has no `grader-notes.md`
  and the notes were four short paragraphs; the CHANGELOG is where the file's history already lives.
- **Merge #99 with its branch kept, then retarget.** The memory from the last stacked pair held:
  deleting the base branch first would have closed #100.

### What was learned

- Applying a no-strikes rule to a batch is mostly a matter of finding where the old wording goes,
  and the pack CHANGELOGs were the natural home for most of it; the archive file only had to take
  what no pack owns.
- A pull request description's For Amy block came in at 153 and 151 words on two drafts before
  149; the count is worth a script line before every `gh pr edit`.

### Housekeeping

Dev server started for the second measured run and stopped after it. Two proposals and five draft
files untracked at the root, each named on its item. The migration gate checked and clear.

## 23 September 2026, third sitting — stop 3 passed, the fixability lines and routes into the water pack, a third canon line, and the applies cards' "no" redrafted

Her grade: both drafts ship as written, criterion 4 stays *depends*, R-8 ships with the Meta
line, the title confirmed. A new canon for every agent: wherever Phoebe shows a Fixable or
Unknown row she also says, as a fact she phrases, that WaterBots is building tools and resources
on the paid site for exactly these fixes and that the visitor can save the project and sign up
for updates and access; the same line on the save door. Then: merge #101, confirm main equals
origin, redraft the six applies cards' "If the answer is no" sections under the guide-not-gate
canon, keep them at the root, stop for her grade.

### What was built

#101 merged with its branch deleted; `main` equal to `origin` at fb7240a. On
`feat/water-routes-into-pack`: the six **Can it be fixed?** paragraphs inserted after "The rule in
plain words" on each water card, wording as graded; `routes-cards-vwba.md` moved whole into
`vwba-2.0/cards/` with its status approved and the two Meta lines saying the address was
confirmed; both drafts' grader notes appended to `grader-notes.md`; the two draft files removed.
Water pack 0.5.0 with a three-set table on its README, seat 0.6.0, tree 0.8.0. The third canon
line recorded under ruling 5 in AGENT_RULES.md in her words, under item A18, and as a carry on
item O14 for production's side of the save door.

The six "If the answer is no" sections of the applies cards (T1 to T4, W1 and W2), still untracked
drafts at the root, redrafted: each no sorted into Fixable with a cited route (the water routes by
id; the carbon ones by the methodology's section, since the carbon routes file is not drafted yet
and the card says so), Unknown not a fail with the save door offered, or Blocked where no cited
route exists and the other pathway may still apply. Both drafts' prefaces say the no is sorted.

### How it was proven

The runtime parser reads a card's rule paragraph up to the first blank line, so an added paragraph
after it changes nothing the worksheet or the Knowledge pack tab shows; `check-cards` green on the
new file. The card module regenerated, so the paragraphs reach Phoebe's prompt; the measured run
on that prompt is on the pull request. The routes file is read by nothing and the generator does
not name it.

### Decisions

- **The fixability paragraphs go on the cards now, not at the build.** The draft she graded said
  so, and the design decision already tells her the worksheet keeps three states; the paragraphs
  are knowledge about which criteria could ever be Blocked, consistent with the posture she holds.
- **Carbon "no" sections cite the methodology directly** where the route would be, and say the
  carbon routes card is not drafted yet, rather than inventing a route id that has no card.

### Housekeeping

Dev server started for the measured run and stopped after it. Two proposals and four draft files
untracked at the root: the K7 and guide proposals, the two older VWBA drafts, and the two applies
drafts now redrafted.

## 23 September 2026, fourth sitting — the applies sets into their packs, the T4 fact, and K7 step 3 drafted

Her grade: both applies files pass as redrafted, with one addition on card T4 for a transitioning
project, as a fact Phoebe phrases: a transition-assistance module, overseen by trusted
consultants, is coming to the paid site; the visitor can save the project and sign up for access.
Then merge #102, confirm main equals origin, move both applies files into their packs, draft K7
step 3, the seventeen methodology rows as cards with their fixability lines, and stop at K7 stop 2.

### What was built

#102 merged with its branch deleted; `main` equal to `origin` at 0ff9dce. On
`feat/applies-into-packs`: the T4 fact added to the carbon applies set in her words; both applies
files moved whole into `gs-paa-v2.0/cards/applies-cards-gs.md` and
`vwba-2.0/cards/applies-cards-vwba.md` with their status approved and each saying nothing reads
it until step 5; the carbon pack's `grader-notes.md` created and the water pack's appended; the
carbon pack's `cards/README.md` rewritten to say what is approved and what is drafted. The fact
logged beside the paid-site tools line in AGENT_RULES.md, under items A18 and K7, and as a carry
on item O14. Carbon pack 0.2.0, water pack 0.6.0, seat 0.7.0, tree 0.9.0.

`eligibility-cards-gs-DRAFT.md` at the root, untracked: the seventeen methodology cards M1 to
M17 from the K7 proposal's §5.1, each in the card shape with "Can it be fixed?", "Applies to" and
"External standard", citing the methodology's section and page and a framework document's page
as a second link where one is cited. Ten *yes*, seven *depends* with the Blocked case named in
the line, no flat *no*.

### How it was proven

`check-cards` green; the generated modules current, because the applies sets are named by no
reader and the water card file did not change, so Phoebe's prompt is unchanged and no measured
run was owed. `check-roster` green.

### Decisions

- **No flat *no* among the seventeen.** The proposal's first cut named M2, M12, M13 and M14 as
  the carbon pathway's disqualifiers; written against the cards, each turns on a design fact
  with a route until the visitor confirms it, so each is *depends*, the way criterion 4 is on the
  water pathway. The carbon pathway's one flat *no* stays on applies card T2. The carbon "no"
  list goes to the reviewer as Q11 either way, her word.
- **Routes named on the cards are the proposal's planned ids**, with the methodology section
  each would rest on, so a reader can check the source now; the gate will refuse a named route
  with no card when the routes reader lands.

### Housekeeping

No dev server started. Two proposals and three draft files untracked at the root: the K7 and
guide proposals, the two older VWBA drafts, and the new methodology cards draft.

## 23 September 2026, fifth sitting — sources-local mirrors the paid library's naming, every citation path fixed

Her brief, after confirming main equal to origin: mirror the paid repository's `Methodology/`
names in `sources-local/`, untracked, by command — move the three loose VWBA PDFs into
`sources-local/Methodology/vwba-2.0/` (the Meta report under `published-reports/`), and rename
the guidebook and the 2021 paper to the paid library's naming pattern. Fix every "local copy"
path in cards and proposals to match. Add a short README saying the folder mirrors the paid
repository, untracked, carried by hand, never committed. Docs PR, stop.

### What was found and done

The move had already happened: `sources-local/Methodology/vwba-2.0/` existed with the Meta
report correctly under `published-reports/`, but the guidebook and the 2021 paper still carried
their old names. Confirmed the 2021 paper's identity from its own text (Reig and Vionnet 2021,
*Volumetric Water Benefit Accounting (VWBA): A Practical Guide to Implementing Water Replenishment
Targets*, working paper for Bluerisk, Valuing Nature and the CEO Water Mandate) before renaming it.
Both files renamed to the paid library's pattern:
`VWBA_V2.0_Volumetric-Water-Benefit-Accounting-2.0-Guidebook.pdf` and
`VWBA_2021_Volumetric-Water-Benefit-Accounting-A-Practical-Guide-to-Implementing-Water-Replenishment-Targets.pdf`.

Every "Local copy" line citing the old paths, in six tracked and untracked card files
(`eligibility-cards-vwba.md`, `feasibility-cards-vwba.md`, `applies-cards-vwba.md`,
`routes-cards-vwba.md`, the two untracked Appendix C and glossary drafts) plus one prose reference
in `grader-notes.md` and the Meta report's path on `routes-cards-vwba.md`, rewritten to the new
paths. Swept the two proposals and the newest draft for the same strings; none held one. The card
module regenerated.

`sources-local/README.md` written: what the folder mirrors, why, the layout and naming pattern,
what lives here today, and what it is not — never a place a card points a reader to, never
committed. It is itself gitignored, confirmed with `git check-ignore`.

### How it was proven

`check-cards` green, 267 checks. The path-line change reaches Phoebe's prompt, because
`eligibility-cards-vwba.md` and `feasibility-cards-vwba.md` embed whole into it; a sixty-request
measured run on the renamed-path prompt came back 0 empty in 60, 1,400,140 input tokens. Grepped
the whole tree for the old path strings after the edit: none remained outside the mirror folder
itself; grepped code files (`.ts`, `.tsx`, `.mjs`) for the same strings: none found.

### Decisions

- **The measured run was made even though the brief called this a docs change.** The distinction
  this session already drew — a "docs only" pull request is not docs only when the document is a
  card file the generator embeds — held here too: a path string is a small change, but it is still
  a change to what Phoebe reads, and the rule is about what reaches the prompt, not about how big
  the edit looks.
- **The README lives in `sources-local/`, gitignored, not at the repository root.** The brief said
  untracked and carried by hand; putting it where the mirror itself lives, rather than in a tracked
  root document that points at an untracked folder, keeps the one fact — what this folder is — in
  the one place a maintainer opening the folder would look first.

### Housekeeping

Dev server started for the measured run and stopped after it. `main` equal to `origin` at 92df1ef
before this branch opened. No OPEN_ITEMS row: the work is complete, not an open thread, so it is
recorded here and in the pull request rather than given a row that would need closing on arrival.

## 23 September 2026, sixth sitting — M1–M17 approved, the addendum, phase tags on every card, and the framework cards drafted

Her grade: all seventeen methodology cards pass, two conditions — confirm the WHO and JMP pages
on M3, M4, M5 and M7 before the cards move in, and the Blocked cases on M5, M12, M13 and M14 go
to the reviewer as Q11. Then an addendum to the guide-not-gate proposal, one page, then build:
phase tags on every eligibility row with a preview block for a planned project; Wellington asks
the stage; Phoebe frames from it, the retroactive rule and what VWBA says about running projects
cited; the human door fires once on any Blocked project. Tag M1–M17 and the six water cards;
draft P1–P2 and G1–G13 with tags; stop at K7 stop 3.

### What was built

The three publisher pages fetched and confirmed: the WHO 2022 guidelines, the WHO scheme's
Rounds III and IV results report, and the JMP 2018 core questions. One correction found on the
way: the scheme report's publisher page dates it 18 March 2026, not 2025 as M3 and the pack README
said; both fixed. The four Blocked cases named on item O14's Q11 carry. M1–M17 moved into
`gs-paa-v2.0/cards/eligibility-cards-gs.md`, status approved with both conditions recorded, notes
to `grader-notes.md`.

The addendum written into `PROPOSAL_guide-not-gate.md`: the tag and its *engineer's rule* (a row
is *To start* when its evidence is design, documents or facts available before the first unit
runs; *To remain eligible* when its evidence is records kept while the project runs; a row with
both is *To start* with a *Kept up by* clause); the preview block with her fact and its four
feasibility-card citations, B-1, B-2, B-3 and B-5; the stage with each standard's start-date
definition; the framing from stage with the retroactive rule and the guidebook's lines on
projects under way; the door once; and a table of what builds now and what waits for its step.

The **Phase** line on every card: seventeen carbon (sixteen *To start*, M17 *To remain
eligible*, eight *Kept up by*) and six water (all *To start*, criterion 5 with *Kept up by*), plus
one paragraph on each pack's design decision saying what the tag means. The card module
regenerated. `eligibility-cards-gs-framework-DRAFT.md` at the root, untracked: P1–P2 and G1–G13
in the full card shape with fixability, phase, applies-to and external-standard lines, three
*depends* (P1, G6, G12), all *To start*, five *Kept up by*. Pack versions: carbon 0.3.0, water
0.7.0, seat 0.8.0, tree 0.10.0.

### How it was proven

`check-cards` green after the water cards changed; the tag line sits after "Can it be fixed?" and
after a blank line, so the runtime parser's rule paragraph is unchanged. The lines reach Phoebe's
prompt through the two live card files; the measured run on that prompt is on the pull request.
The carbon set is named by no reader, so its tags reach nothing yet.

### Decisions

- **One *To remain eligible* row in 38, and it is M17.** The definition chosen makes a row *To
  start* when a planned project can answer it from its design, and pushes the running part into a
  clause the preview block collects. That keeps "never a mark against a planned project" true
  without inventing rows, and it is the one rule in the addendum she did not state, so it is
  marked for her to strike.
- **The preview block cites the water pack's feasibility cards rather than restating them**, her
  "one home"; the carbon pack's M17 points at B-2.
- **Framing from stage cites both standards at the row that carries the year (G12)** and at the
  guidebook's own lines, so Phoebe's future rule has a card behind every sentence.

### Housekeeping

Dev server started for the measured run and stopped after it. Two proposals and three draft files
untracked at the root: the K7 and guide proposals (the latter with its addendum), the two older
VWBA drafts, and the framework cards draft.

## 23 September 2026, seventh sitting — the framework cards approved, item K11 logged, and the carbon routes drafted

Her word: merge #104, retarget and merge #105, confirm main equals origin; the engineer's tag rule
in the addendum stands as written; the fifteen framework cards all pass as drafted, move them into
the carbon pack; log one item for the next version, a third tag "Partners phase" where Bridget
helps on the paid site, not built now; then step 4's carbon half, the nineteen carbon routes as a
draft at the root, cited only from the methodology, the documents it names as binding, or a held
published project; stop for her grade.

### What was built

#104 merged with its branch kept, #105 retargeted to main and merged, both branches gone, main
equal to origin at fb89aea. On `feat/carbon-routes`: P1–P2 and G1–G13 appended whole to
`gs-paa-v2.0/cards/eligibility-cards-gs.md` as part two with their sources table, so all 32 rows
of the carbon pathway sit in one file; the status line and preface say so; notes to
`grader-notes.md`; the draft removed. Item K11 logged in her words, with the rows that look like
Partners work named as candidates and nothing moved. The addendum's engineer's rule marked as
standing, her word. Carbon pack 0.4.0, seat 0.9.0, tree 0.11.0.

`routes-cards-gs-DRAFT.md` at the root, untracked: R-1 to R-19, the ids the eligibility cards
already name, each two or three short sentences on a section read this session. Fifteen rest on
the methodology itself or a document it names as binding at §3.4.1 or §4.1.2; four (R-14, R-15,
R-17, R-19) rest on a document one link removed through the Principles & Requirements, and each
shows its chain so she can strike it. No held published project is a carbon project, so none is
cited; the gaps with no route are named.

### How it was proven

`check-cards` green; the generated modules current, because the carbon pack is named by no reader
and the water card file did not change, so Phoebe's prompt is unchanged and no measured run was
owed. Thirty-two `## Card` headings counted in the pack file.

### Decisions

- **Part two carries its own sources table** rather than folding ten documents into the file's
  head, so a reader of M1–M17 still meets one document first and the framework's ten only where
  they are cited.
- **The four one-link-removed routes are drafted, not withheld.** Her rule names "the documents it
  names as binding"; 101 is named, and 101 binds 102, which binds 104. Withholding them would leave
  G9, G10, G11 and P1 with no route at all, which is a bigger departure from her intent than
  drafting them with the chain shown and letting her strike.

### Housekeeping

No dev server started. Two proposals and three draft files untracked at the root: the K7 and guide
proposals, the two older VWBA drafts, and the carbon routes draft.

## 23 September 2026, eighth sitting — the phase tags applied, the cap to thirty, the desk's build note, and the close-out with the next order

Her grade of the phase-tags proposal: the tags pass as proposed; the free-site cap moves to thirty,
matching Wellington's; the other rulings take the proposal's own recommendation. Then: one honest
line on the desk in her words that the site is under build and a visitor can ask Wellington for a
build update; a dated build-update fact he phrases, refreshed at every close-out, added to the
close-out ritual; BUILD_PLAN names the next order, four pull requests; confirm each line of the
close-out, then stop.

### What was built

The **Phase** line on all 38 cards replaced with the navigation's phase: water, criteria 1, 2 and 4
Eligibility, 3 and 6 Partners, 5 Plan; carbon, nine Eligibility, thirteen Partners, one Quantify,
ten Plan, M17 to remain eligible; the design-decision paragraph on each pack says what the tag
means and names the free screen. The cap to thirty in `api/_cap.ts`, its comment, the visitor
module's comments, CLAUDE.md, the README twice, item O1, and the one check in `check-wellington`
that held Phoebe's cap at twenty, moved on her word. The desk's build note above Wellington's chat
in her words, as a caption in the screen column. `knowledge-packs/wellington-host/build-update.md`
with an agent-facing region, a new generator bundle to `api/_buildUpdate.generated.ts`, the region
embedded in his prompt under "The build update, when asked", and a check that it is present, dated
and unscripted. Step 8 in the close-out ritual. Items S11, S21 and A18 refreshed; item K11 closed
into the Partners group the same day it was logged; BUILD_PLAN carries *The next order*.

### How it was proven

`check-cards`, `check-cap`, `check-roster` and `check-wellington` (137) green; `tsc` clean. The
water cards and Wellington's prompt both changed, so Phoebe's sixty-request run and Wellington's
measured run were made; counts on the pull request. One capture of the desk with its note,
`captures/2026-09-23-desk-build-note.png`, by headless Chrome against the dev server.

### Decisions

- **The prompt-size gate tripped, and the bar was not moved.** Wellington's prompt has a gate of
  24,000 characters; the first build-update region, about two thousand characters, took him to
  25,492. The region was cut three times, to about three hundred characters, until the gate passed
  with little room left. The trip and the number are reported on the pull request for her ruling;
  the type-and-stage work next in the order will add more to his prompt, so the number needs her
  word before that build.
- **The cap check moved with the cap**, because her ruling named the number; a gate that holds a
  superseded ruling is the one kind of threshold change that needs no proposal.
- **Item K11 closed the day it opened.** The navigation-phase ruling made Partners one of six tags
  rather than a third beside two; the rows it would have moved are the Partners group.

### Housekeeping

Dev server started for the runs and the capture and stopped after. Three proposals and two draft
files untracked at the root. Pull request #106 (the carbon routes) still open at her grade; this
work is stacked on it. `main` equal to `origin` at fb89aea, unchanged by this sitting.

## 23 September 2026, ninth sitting — an inventory, the carbon routes into the pack, OPEN_ITEMS swept, V1's done line, the seal, and close-out

Orientation with a written inventory of every knowledge pack (`INVENTORY_knowledge-packs.md`,
untracked, docs only, no build). Then two pull requests on her word: the nineteen carbon routes
into the pack and OPEN_ITEMS.md actually swept; then her later ruling the same day, "V1 — the
done line," replacing the next-order section and sealing every card set. Both merged. Close-out
runs with a short Wellington run in place of the standing sixty, her ruling now folded into the
done line.

### What was built

`routes-cards-gs.md` — the nineteen approved carbon routes, moved whole from the untracked root
draft into `knowledge-packs/phoebe-eligibility/gs-paa-v2.0/cards/`, with the pack, seat and tree
versions and changelogs bumped and the grader notes appended (pull request #108). The
knowledge-packs README's stale version footer corrected under the no-strikes rule. Item K1 in
OPEN_ITEMS.md notes the two parked water drafts (activity types, glossary) by name. OPEN_ITEMS.md
itself swept: 27 closed items whose full write-up was still sitting in the live file, though most
already said "moved to the archive," actually moved — K11 into the archive for the first time,
the other 26 reduced to their index row, matching how item S16 was already handled. Then
BUILD_PLAN.md's "The next order" section (four pull requests) replaced with her later ruling,
"V1 — the done line": what v1 means for the whole free site, one bullet per seat, what is parked,
and a seven-step build order (pull request #109); the old section kept whole in
`docs/archive/CORRECTIONS.md`. The seal recorded in `knowledge-packs/CHANGELOG.md`, tree version
0.13.0: every card set frozen at its version on this date until a real project fails on one. At
close, CLAUDE.md gets a short pointer to the done line and the seal; OPEN_ITEMS.md's K7 row
refreshed to say the routes are approved and in the pack, not still drafted.

### How it was proven

All fourteen check scripts green on both pull requests (267 roster checks, both card gates,
attribution, cap, reply guard, visitor id, basemap key, both method-pack gates, basins, stress,
palette) and `tsc` + the Vite build clean on both. No prompt changed on either pull request, so
no measured run was owed for them. At close, a short Wellington run (one pass each of his five
standing questions plus Phoebe's three, eight requests, not the standing sixty) confirmed he still
routes correctly and abstains where he should, and Phoebe's behaviour is unchanged: all eight
requests came back 200, routing and abstention as wanted, one abstain on the out-of-lane question
as wanted.

### Decisions

- **A short run stood in for the sixty-request measured run**, her ruling now folded into "V1 —
  the done line": one short run after a prompt change, no new exam questions. No prompt changed
  this sitting, so this run was a sanity check on the close-out step itself, not a gate owed by a
  change — recorded here so the count is honest about why it is eight and not sixty.
- **26 of the 27 swept items were already duplicated in `docs/OPEN_ITEMS_ARCHIVE.md`.** Only K11
  was missing from the archive; the other 26 had been copied there at an earlier sweep but never
  actually removed from the live file, which is the exact defect *record once, point everywhere
  else* exists to catch. Fixed by removing the live-file body for all 27 and adding K11's full
  text to the archive once.
- **The seal's version number (0.13.0) was the engineer's judgment call**, reported to her as
  such on the pull request rather than assumed to need no comment, since a threshold or version
  number is hers to confirm even when the change itself was already approved in words.

### Housekeeping

Dev server started for the Wellington run and stopped after. `for-reviewer-Q11.md` and
`INVENTORY_knowledge-packs.md` remain untracked at the root, for her use, not for this session's
pull requests. The two old water drafts (`activity-cards-vwba-DRAFT.md`,
`definitions-cards-vwba-DRAFT.md`) and the three earlier proposal files remain untracked at the
root, named and parked by item K1 and the done line. `main` equal to `origin` at 0358cfe before
this close-out's own commit.

## 24 September 2026 — build-order step 1: the Knowledge tabs, and the tool definition contract built

Five pull requests, all merged on her word: #111 (already merged when the sitting opened), #113,
#114, #115 and #116. Build-order step 1 under "V1 — the done line" is done, and the tool definition
contract of `PROPOSAL_knowledge-tab-and-tool-contract.md` §7 was pulled forward into it by her word
rather than waiting for Phoebe's runtime step. No prompt changed, so no measured run was owed.

### What was built

**Calvin's and Bridget's Knowledge tabs (#113).** A new reader, `src/lib/toolReadmes.ts`, reads
each live tool folder's README for its version, its plain sentence and the document it cites.
Calvin's three method-pack rows wear their folders' versions; Bridget's two dataset rows moved onto
the shared `KnowledgePackTab` and `MapSources` — her own second drawing of the same look — was
deleted, so one component now draws every agent's Knowledge tab. Both tabs gained the Evals
section. `src/lib/licences.ts` gained the two publishers and the two canonical addresses as their
own exports, all four already present word for word inside the verbatim attribution strings above
them; no existing string changed. `CiteLine` learned to drop an empty page slot with its separator,
because a dataset has a version and a publisher and no printed page. Two captures at 1280 wide, by
headless Chrome against the dev server.

**The water tool file (#114).** `knowledge-packs/phoebe-eligibility/vwba-2.0/tool/eligibility-worksheet.yaml`:
the eight keys of §7.2, eight rows in the order asked — the two applies questions, then the six
criteria — each with the eight keys of §7.3 and no others, citing its card by id and its routes by
route card id. `scripts/check-tool.mjs` is the gate, written in the check family's shape and
re-deriving the cards from the card files rather than importing the reader.

**The carbon tool file (#115).** Thirty-six rows in the card files' order: T1–T4, M1–M17, P1–P2,
G1–G13. Eleven cited documents, each held equal to its row of the pack README's four tables. All
nineteen carbon routes are named by at least one row. The rows were generated from the card files
rather than typed, and the gate grew to hold a row's title, its "Can it be fixed?" value and its
phase to the card.

**The `applies` key (#116).** Ruling R9 as amended: one optional ninth key per row, which rows
exist for a project's technology class or version, read from the card's own "Applies to" line,
absent meaning every project. Six carbon rows carry it; no water row does. Both packs and the tree
bumped; the seat pack caught up at 0.11.0, so every level agrees.

### What was learned

**A gate that derives is worth more than a gate that lists.** The first version of `check-tool`
checked shapes and closed lists. It passed a tool file whose rows could have said anything about
their own cards. Holding four facts — title, fixability, phase, `applies` — to the card turned the
same script from a format check into a mirror check, and it is what made generating the carbon
rows from the card files safe rather than merely quick.

**A skip has to be counted or it reads as a pass.** Four applies cards carry no fixability line and
no Phase line, and the water pack's six criteria carry no "Applies to" line. The gate prints how
many rows it skipped for each check, so a set that quietly stops carrying a line cannot look like a
set that agrees.

**The derivation had to be mechanical before a line of it was written.** The "Applies to" rule was
run over all forty-four cards in a scratch script first: six rows resolve to a class, thirty-eight
to every project, and no card limits a row to a version today. A line the rule cannot read is
reported rather than assumed to mean "all".

**Where a card described a fix and no route card carried it, nothing was invented.** Three rows —
T1's and M2's change of pump drive, M14's justified sub-national area — name no route, say so in a
comment, and are logged on the carbon pack's own page as route cards to draft after v1.

### Decisions

- **The licences module gained four values rather than a regex.** The proposal said Bridget's link
  is read "from the licences module where it already carries the address", and both addresses sat
  inside verbatim licence strings that must not be altered to get at them. Naming them as exports
  beside the strings they come from was the engineer's call, reported on the pull request for her
  word; she let it stand.
- **The gate stays hand-run, her ruling of 24 Sep 2026.** The contract says it "runs with the
  others and fails the build"; in this repository only `check-roster` is inside `npm run build`,
  and `check-cards` says the same thing in the same sense. `check-tool` matches `check-cards`.
- **The state colours stay as they are until build-order step 3, her ruling the same day.**
  Blocked's colour is recorded as interim; the pathway state's and the readiness reads' are left
  empty rather than invented, because a colour is approved on pixels.
- **The W1/W2 fixability reading stands as commented, her ruling the same day.** The water applies
  cards carry no "Can it be fixed?" line; their values are read from "If the answer is no" and the
  file says so.

### How it was proven

`check-tool`, `check-cards`, `check-attribution`, `check-api-exports`, `check-cap`, `check-handoff`,
`check-reply-guard`, `check-visitor-id`, `check-wellington` (137), `check-gs-sdws` (109),
`check-vwba-d3` (69), `check-palette` and `check-roster` (267) green on every pull request;
`npm run build` green. Twenty-eight failure modes were introduced across the three gate pull
requests and each confirmed to fail the gate, then reverted. Two captures committed under
`captures/` and embedded in #113's For Amy block.

### Housekeeping

`PROPOSAL_knowledge-tab-and-tool-contract.md` deleted at this close-out, its work merged. The dev
server was started for the two captures and stopped; a headless Chrome driven over the DevTools
protocol took them, scratch only, never committed. **Wellington's prompt is 23,940 characters of
its 24,000 gate** after this close-out's build-update refresh — sixty characters of room, and step
2 adds to his prompt, so the trim-or-raise question is due before it and is hers. The two old water
drafts and three earlier proposal files remain untracked at the root. Tagged `v1-tools-2026-09-24`
on her word, so a collaborator can read this exact version by link.

## 24 September 2026, second sitting — the prompt trim, then build-order step 2: Wellington's type and stage

Two pull requests, both merged on her word: #118, the trim, and #119, the build. Step 2 under "V1 —
the done line" is done. Both prompts changed, so one short run each was run after each pull
request, her word; the sixty-run measurement was not owed and is not claimed.

### The trim (#118)

Her ruling at the close of 23 Sep had been trim first, raise only if a trim cannot make space.
`PROPOSAL_wellington-prompt-trim.md` measured his prompt section by section — 23,940 against the
24,000 gate, 60 of room — and found about 4,200 characters that could go without losing a rule:
his prompt's code stated rules his primer region already stated, and the shared roster region
carried seven struck passages and five date stamps that reached Phoebe too. She ruled both tiers,
the old wording to the pack CHANGELOG under the no-strikes rule, the types list in its short form,
and the gate held at 24,000 until the build landed, then raised by the measured amount to leave
500. Tier 1 took him to 21,199; Tier 2 to 19,811 and Phoebe from 68,288 to 66,900; the agent
primer is now clean of strikes, item C1's sweep for that file. The name stamp left his region and
is recorded nowhere, her word.

### The build (#119)

**The list, parsed once.** `scripts/build-prompt-modules.mjs` gained a parsed bundle:
`product-shared/project-types.md` is read once, its shape checked (20 water types, 4 classes,
1 none), and written to `api/_projectTypes.generated.ts` and `src/lib/projectTypes.generated.ts`,
both under the staleness gate. The short form — id, the standard's name, one plain sentence, no
cites — is 4,034 characters.

**His chat.** The type rule in his prompt: match from what the project does, say the definition
back, never the id, return `type` only on the visitor's yes, NONE on a yes to none of these, no
type when not sure; the class asked only for a drinking-water project and `gsClass` kept only
beside C-19 — on the relay, in the client, and on the seal; the stage asked and `stage` returned
only on yes. His region gives five fields in the seats' order; the three kinds are gone.

**"What kind" retired** from his answer and schema, the visit context, the rail — which shows
"What type" wearing the standard's name with the sentence on hover, and "Stage" — both agents'
record blocks (the standard's words, never an id alone), Phoebe's tool text (five facts) and one
sentence of her prompt, and the seal, which now carries `record.type`, `record.gsClass` and
`record.stage`, refuses the old `kind` key, and refuses a class beside any type but C-19.
Production's carry is written on item O14 in one line.

**The gate.** His prompt measured 25,699 after the whole build, including the refreshed
build-update fact; the gate is 26,199, measured plus 500, her ruling, with the reason above the
check. The runtime commit had said 26,197, measured before the fact was refreshed; the docs commit
corrected it.

### How it was proven

`check-wellington` (148), `check-handoff` (69), `check-roster` (267), `check-cards`,
`check-tool`, `check-api-exports`, `check-cap`, `check-reply-guard`, `check-visitor-id`,
`check-vwba-d3` (69), `check-gs-sdws` (109), the staleness gate and `npm run build` green.
One short run each after each pull request: Wellington 5 of 5 as wanted, Phoebe 3 of 3, none empty.
One four-turn walk against the relay logged the type on the second turn, the class on the third,
the stage on the fourth, then routed to Eligibility. The desk-walk script for Stop 4 is in #119's
For Amy block; she merged on her word.

### Housekeeping

`PROPOSAL_wellington-prompt-trim.md` deleted at this close-out, its work merged. The build-update
fact was refreshed inside #119, so no run was owed at the close. No migrations exist; no stray
server. Item A17, Wellington reading Phoebe's verdicts back, is untouched. Step 3, Phoebe's carbon
runtime, is next while the paid engine finishes.

## 25–26 September 2026 — build-order step 3: Phoebe's carbon runtime, the door to a person, and the close-out

Five pull requests, all merged on her word: #121, #122, #124 and #126, with two one-line plan
updates, #123 and #125. Step 3 under "V1 — the done line" is done. The proposal,
`PROPOSAL_phoebe-carbon-runtime.md`, was ruled on 25 Sep 2026 — R1 to R5, R7, R9, R10 and R11 as
proposed; R6 amended to staged loading; R8 amended to fix the save door first — and is deleted at
this close-out, its work merged.

### The save door first (#121)

Her live test of 25 Sep: a full desk conversation reached production as an empty record, because
production's receiver still reads `record.kind`. The word came back on the seal, derived from the
type (`both`, `water`, `neither`, or blank), asked of nobody, and refused when it disagrees with the
type. The full account is under item A16.

### Pull request A (#122) — the water pathway on its tool file

One generator reads both tool files and the roster and writes the same module for the relay and the
browser. The water pack's agent-facing region retired into its changelog. Five row states, a
readiness read computed from the rows, cited routes under a Fixable row, her verdicts as per-pack
rows. Her cards load in stages. Her cap wording corrected in four places; the banned word left her
relay. The seal kept production's three words rather than the per-pathway shape, a decision named
in the pull request: the rows are owed on item O14.

### Pull request B (#124) — the carbon pathway

Both packs, the applies tests run together, questions written to cover both pathways, sorting by
class and version. Two findings from the walks, both fixed: she named the class without recording
it, and she abstained cold on a set staged loading had not handed her yet. Her size ceiling moved
twice inside the pull request, each time by the measured amount of those fixes, to 203,787.

### Pull request C (#126) — the door to a person

On a Blocked row she offers a person once. A box and a note sit above the save button, only when a
row is Blocked; the tools line sits on the door when a row is Fixable or Unknown. The seal carries
`wantsHuman` and `humanNote` only on a tick, so an ordinary save keeps production's shape. Her size
gate tripped by 157 on the first draft; the new text was shortened and the bar did not move.

**Then, on her word before merge:** a ticked save emails hello@waterbots.ai. No mail path existed,
so Resend was picked, over one HTTPS call, its key the hosting secret `RESEND_API_KEY`. The page
sends each pathway's rows beside the seal; the server checks them against the tool model, works out
the read itself, writes the email and keeps nothing. Seal first, email second; a failed email takes
the seal back. Her ruling the same day: no visitor contact in the email, and one line that the
project reaches the paid site at sign-up and the team replies from there. No real email was sent;
the captured body from the real code is in `captures/2026-09-26-team-email-body.txt`.

### How it was proven

`check-handoff` 75 → 103, with a stand-in mail provider; `check-phoebe` 61 → 71; every other check
and `npm run build` green. Short run after C: Phoebe 9 of 9 answered, none empty, one cold
abstention on a feasibility question. One real walk to a Blocked row: criterion 4, the permit, with
her offer made once and the box ticked. At the close, Wellington's short run after the build-update
refresh: 4 of 5 as wanted; the fifth asked the type before sending a carbon-figure question to
Quantify, and gave no figure.

### What was learned

A seal is a contract, and adding to it is safest as keys that appear only when they mean something.
The door had to be true before it could be offered: the box's words promised a person, and the
email is what made them so. Until her key and domain are set, the live site refuses a ticked save
and says so.

### The close-out

AGENT_RULES.md: rung 3 is live for a Blocked project, and the "until that build lands" paragraph is
replaced. The worksheet header and Phoebe's line in the next steps say "or why it cannot" where a
row is Blocked. Old wording for both is in `docs/archive/CORRECTIONS.md`. BUILD_PLAN: step 3 done,
Calvin's brief next once the paid engine's new seal is carried by her hand, items A17 and S21
listed as open v1 work. OPEN_ITEMS: A18 and K7 built, sweep due. CLAUDE.md: the scope line.
Wellington's build-update fact refreshed and regenerated; his prompt 25,735 against 26,199. No
migrations exist. Noticed, not changed: the build-update file's own text still names his gate as
24,000.

## 26–27 September 2026 — Wellington reads back what Phoebe found (A17), people served, and the engine bundle checked

**What was built.** Two pull requests, each proposal first, each merged on her word.

- **#128, item A17.** His side of the return. Each ask to him carries Phoebe's worksheet as row ids
  and states only; the relay reads it into a "What Phoebe found" note after the cache breakpoint,
  built by the functions that draw the screen: each pathway's read, and any Blocked or still-open
  row by id and its title from the tool file, never her sentences. The desk sends him one turn the
  first time the visitor comes back from her, on the pattern of her own greeting. A route to Quantify
  becomes "none" in code when every pathway reads likely not or does not apply. A pathway she has
  not looked at reads not enough known, so it does not stop the route. Prompt 25,773 → 25,894: a
  261-character rule in, a 140-character repeat of rules 1 and 2 out. Docs followed in #129.
- **#130, people served.** For C-11 and C-19 he asks how many people or households a project
  serves, after the stage and before he routes, and logs a whole count and its unit as said. It
  reaches him and Phoebe on the record, a People served row on the rail, and `record.served` on the
  seal, checked on the server. Households are never converted here, her R1: the one household size
  in the repository with a source arrived later, in the carried bundle, and its rights row is still
  pending. His primer's line that people counts and the technology wait for Quantify was wrong and
  was replaced by the true rule, her R2.

**How it was proven.** `check-wellington` 118 → 142, `check-handoff` 103 → 109, every other gate and
`npm run build` green. Short runs with real calls: three return greetings for A17 — likely
eligible, Blocked on row 4 (named in plain words, no id), and a Blocked visit asking for a number,
where he declined Quantify himself, so the code check did not fire in that run. For people served,
two walks logged 240 households and 1,500 people correctly but he never asked; after the rule, one
walk with the number held back: he asked it himself after the stage, logged it, then routed.

**What was learned.**
- A prompt with 8 characters of room cannot take a rule; the room came from a sentence his
  prompt repeated from a runtime block that already says it every time it arrives. Look for
  repeats before cutting a rule.
- A primer line can be wrong, not just outdated: "people counts wait for Quantify" described a
  choice nobody had made.
- A walk that volunteers the answer proves logging, not asking. The walk has to hold the answer
  back to test the question.
- A default needs its source before it can be used silently. The request for a silent household
  size ran into two non-negotiables, was raised rather than chosen, and was ruled as option A.

**The engine bundle.** `carried/`, placed by her hand from the paid site's `calculator-seal-2026-09-26`
(gs4gg-carbon v0.16.0). First check: 31 of 31 hashes matched, but no registry rows travelled. After
her refresh: 32 of 32 match the hash list and the manifest's short hashes, and
`carried/sources/registry.yaml` holds exactly the twelve rows the data files cite. One row,
`mofuss-fnrb-2024`, has no version; the household-size row's rights read `pending-determination`.
Untracked and left exactly as it is.

**The close-out.** BUILD_PLAN: A17 and people served done, the bundle recorded, Calvin's brief next in
a fresh session. OPEN_ITEMS: A16 carries people served, A15's line 9 closed by A17, O14 gains the
`record.served` carry. CLAUDE.md: two scope lines. Wellington's build-update fact refreshed to
27 Sep and regenerated; his prompt 26,108 against 26,199. Five stale proposal files deleted from the
root, all untracked: A17, people served, K7, guide-not-gate, phase-tags-by-nav. No migrations exist.

## 27–29 September 2026 — Calvin's brief proposed, and the engine bundle merged on `main`

**What was built.** No code. One proposal, one note, one merged pull request of carried files.

- **The opening.** All 32 hashes in `carried/carry-hashes.sha256` matched disk after her refresh,
  and nothing sat under `carried/` that the list did not name. Main equalled origin at 32bb8eb.
- **`PROPOSAL_calvin-brief.md`**, untracked at the root, build-order step 5. It names the engine's
  home as a tracked twin held by a hash gate in the build; the screen's two headlines and five
  carbon blocks in her order; what is hidden and not deleted; the three sliders with their sources
  — Table 9's caps by user group (V2.0 §7.3.11, p. 31), the 347-day sensor threshold (SDWS 32,
  pp. 67–68), proportional crediting on the passing fraction (§7.4.3 b, p. 32); households to
  people through the engine's own `derivePopulation`; the four tags; a `used` block on the seal;
  Calvin's chat on the proven relay pattern, filling by fields; three checks; three pull requests
  at three eyeball stops; eleven rulings, the first of which blocks the rest. Two facts were
  checked before writing it: a scratch copy of the engine typechecks byte-identical under this
  site's strict compiler settings with one stand-in file; and the manifest does not name the entry
  point, so an outside caller had to read the code.
- **`carried/HOW-TO-CALL.md`**, 58 lines, on her word: `computeScenario`, the two pre-checks, the
  required inputs and their kinds, what comes back, the two refusals.
- **The bundle merged on `main` as it stands, #132, tagged `engine-carry-2026-09-27`** at b099ca1,
  by a merge commit so the tag stays on the history. `v1-tools-2026-09-24` was already on GitHub;
  Deb has both as of 28 Sep 2026.

**How it was proven.** A fresh clone of the tag from GitHub: 32 of 32 hashes match. `npm run
build` green with the bundle tracked.

**What was learned.**
- **Her word to push `main` met the ruleset.** A repository rule requires a pull request on
  `main` with no approvals; a direct push is refused. The tag push went through and carried the
  commit up, so for a while a tag pointed at a commit on no branch. The pull request is the only
  road, even on her word.
- **"Byte-identical" and a normalising repository disagree.** `* text=auto eol=lf` rewrote 27 of
  the 32 files to LF on the first commit, so the committed bytes no longer matched the hash list
  that was made over her Windows-ended files. Found by hashing the committed blobs, not the
  working tree. `carried/** -text` fixed it; the first commit, b13e73b, is on no branch and no tag.
- **A root ignore rule reaches into a carried tree.** `legacy/`, written for the old prototype
  folder, swallowed `carried/calculators/data/legacy/` on both commits; the re-commit came back
  30 of 32 until `!carried/calculators/data/legacy/` was added. A hash check that counts the files
  it expects, not only the files it finds, is what caught it.
- **A pasted brief can be cut off mid-sentence.** The proposal was written to what the eleven
  rulings plainly need, and the chat said which parts were inferred.

**The close-out.** BUILD_PLAN: the bundle merged and tagged, the proposal awaiting rulings.
CLAUDE.md: the scope line says the bundle is tracked. Wellington's build-update fact refreshed to
29 Sep and regenerated; his prompt is 26,117 against the unchanged gate of 26,199, 82 characters
of room; `check-wellington` 142 of 142 and the staleness gate current. No migrations
exist. Four merged branches from earlier sittings were not deleted on merge and still exist on
origin; noted, not touched.

## 30 September 2026 — the free-site fixes before the demo

A rehearsal sitting. The maintainer walked the free site and sent small fixes one at a time, each
built on a branch, checked, and merged on her word; the demo then ran on `main` at #138 (her word).

- **#134**, the wordmark starts over. A full load of the landing clears every screen's held state at
  once; the server-side caps are not reset by it. The rail's `waterbots.ai` link untouched.
- **#135**, item A19 logged: his prompt 26,117 against BUILD_PLAN's 26,108.
- **#136**, six things. The chat box grows to three lines. No "Next phase" chip on any desk, her ruling,
  replacing the 16 Sep rule on this site. A rail row that sends the visitor somewhere clears when taken.
  Phoebe's desk opens on her own greeting (his routing message was a display-only copy). The Done-later
  section of her Tool tab collapsed by default. Her closing question in bold, display only.
- **#137**, a pin takes the map invite; his invite to Quantify lands next where a pathway read allows
  it; only rows that send the visitor somewhere clear, record facts stay (her ruling).
- **#138**, the bold question sees past citation chips.

**What was learned.**
- **Two rulings met an older one.** The first chip rule (show it once he routes) would have hidden the
  chip at the moment it should show, under the 16 Sep rule; that was said in the pull request and she
  ruled the chip out of every desk. The pinned basin's reading was cleared by the first clear-when-taken
  rule and she ruled it a record fact; the rule was narrowed to rows that send the visitor somewhere.
- **"Same branch" meant a merged one twice.** #136 and then #137 were already merged when the next
  fix came; each went on a fresh branch off `main` and a new pull request, said plainly.
- **A shell command strips backslashes.** Regexes and strings written inline in a command arrived
  without them, and one edit silently matched the wrong block. Files with backslashes were written
  with the file tools; a wrong match was caught by the type check and reverted.
- **The daily cap has no outside setting.** It is a constant in `api/_cap.ts`, a check fails the build
  if an environment variable can move it, and the count is one Upstash key per agent, visitor and day:
  `<agent>:count:<UTC date>:<hash>`, the hash a SHA-256 of the secret salt and the address. Clearing
  is a delete in the Upstash console, and the day turns over at 00:00 UTC. Nothing was built.
- **A19 was a stale line, not a defect.** The nine characters were the 29 Sep build-update refresh,
  and BUILD_LOG had recorded 26,117 correctly; two live docs kept 26,108.

**The close-out.** BUILD_PLAN: the fixes live, Calvin's brief waiting on the re-sealed bundle, A19
found. CLAUDE.md and README.md: no "Next phase" chip, the fixes, the corrected prompt figure; the old
wording is in docs/archive/CORRECTIONS.md. OPEN_ITEMS: A19 notes its cause. Wellington's build-update
fact refreshed to 30 Sep and regenerated; his prompt is 26,043 against the unchanged gate of 26,199,
156 characters of room; `check-wellington` 148 of 148. No migrations exist. `main` equals `origin`, and
no merged branch is left on origin.

## 3 October 2026 — the tidy-up: OPEN_ITEMS swept, family work written down, BUILD_PLAN's history moved

One docs-only pull request, on the maintainer's approval of `TIDY_2026-10-01.md` as a batch, 1 Oct
2026. Five commits, one per step of her list. No code, no pack content, no live-site change.

**What this entry holds.** The text moved out of OPEN_ITEMS.md, whole, so nothing is lost by the
move: ten item bodies, thirty-eight index rows, and a table of where each item went. The same
pull request moves BUILD_PLAN's "Previously" sections here; they follow at the foot of this entry
as Part B. **Headings in moved text are demoted two levels so this file's own structure holds;
the words are otherwise exactly as they stood.** Strikes inside moved text are the old wording of
their day, kept as history; sweeping them is item C1's, not this entry's.

**The ruling behind it.** Maintainer, 1 Oct 2026: closed items move out of OPEN_ITEMS into
BUILD_LOG at every close-out, no closed row left behind, and every loose item gets a family. It is
step 9 of the close-out ritual in PROCESS_RULES_for_ShellB.md. Bodies swept before this entry stay
in `docs/OPEN_ITEMS_ARCHIVE.md`; nothing is moved twice. The twenty-eight rows below are those
earlier sweeps' index rows, now moved here; their bodies are in that file.

### Where each item went

| # | Item | What it ended as, and what it left behind |
|---|---|---|
| K7 | A carbon card pass in Phoebe's card format — and her second pack, with a "does this apply" test | Built 22–26 Sep 2026: #99, #100, #111, #113, #114, #115, #116, #122, #124, #126. Residues: three route cards no card carries (now K12); the Q11 carry was already on O14. |
| A1 | Phoebe abstention loop | Built 25 Aug 2026. The index row had no body section. |
| A6 | Phoebe fails about one request in six, and every fault fails late | Fixed and guarded 28 Aug 2026; the diagnostic instrument left both relays in #97. Residue: the runaway call cut off at 120 seconds, not prevented (now A20). |
| A13 | One roster — roster.yaml from production, checked against the primer and crew.ts | Built 18 Sep 2026, #91. Residue: the confirmed free and Commons columns of `roster.yaml`, carried again (now a row on O14). |
| A15 | The specialist contract — ten lines every specialist keeps; Phoebe first | Built 22 Sep 2026: #93, #94, #95, #97. No residue; Calvin's and Bridget's briefs against the ten lines sit on A12, A21 and A22. |
| A16 | Wellington guides and leads — he never asks "water or carbon" | Built 24 Sep 2026, #119; save-door patch 25 Sep, #121; people served 27 Sep, #130. Its carries are on O14, with production's receiver recorded as not fixed (Shell A item #243). |
| A17 | The handoff goes both ways — forward and back | Built 26 Sep 2026, #128. No residue. |
| A18 | A specialist is a guide, not a gate — the readiness read, the cited routes, and the door to a person | Built 25–26 Sep 2026: #122, #124, #126. Residues: the interim Blocked colour (now S22) and the reading-grade figure (now K13). `RESEND_API_KEY` is set in Production and Preview (26 Sep), and waterbots.ai is verified in Resend: recorded 3 Oct 2026 on her word. |
| A19 | Wellington's prompt measures 26,117 on `main`; BUILD_PLAN says 26,108 | Cause found at the 30 Sep 2026 close-out: the 29 Sep build-update refresh added nine characters. No residue. |
| O11 | OPEN_ITEMS.md is heavy and wants an archive | Closed 3 Oct 2026. Its job — sweep when heavy — is now step 9 of the close-out ritual, at every close-out. |

**To find a swept item.** Look for its number as a heading in this file. If it closed before
3 Oct 2026, look in `docs/OPEN_ITEMS_ARCHIVE.md`.

### Facts recorded in the same pull request, 3 Oct 2026, on the maintainer's word

- **Shell A is the paid site.** Shell B is this repository. Stated once in OPEN_ITEMS.md, under *Families*.
- **`RESEND_API_KEY` is set in Production and Preview, since 26 Sep 2026, and waterbots.ai is verified in Resend.**
  The sentences that said the key waited on her are replaced; their old wording is in `docs/archive/CORRECTIONS.md`.
- **Phoebe's VWBA cards are reviewed by the maintainer.** Recorded on item K10, part 1.
- **The paid-site receiver is not fixed.** Shell A item #243. Recorded on the seal row of item O14.
- **Four storage keys show "Needs Attention" in Vercel.** Logged as item O15, to check later; not looked at.

### New rows, so no residue and no loose item left a family

K12 and K13 (Knowledge), A20, A21 and A22 (Agents), S22 and S23 (Surfaces), O15 (Operations). A21, A22 and
S23 are v1 build-order steps 5, 6 and 4, which were not items before. The Agents family regained its header.

### Index rows of the twenty-eight closed items, as they stood

Their bodies are in `docs/OPEN_ITEMS_ARCHIVE.md`.

| # | Item | Family | Bucket | State |
|---|---|---|---|---|
| K4 | "Knowledge Pack" — the word for a packaged knowledge set | Knowledge | closed | canon, ruled 26 Aug 2026 — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| K5 | The VWBA 2.0 D-3 screening pack | Knowledge | closed | **built 1 Sep 2026** — the first pack in the slot — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| K6 | The Gold Standard safe-drinking-water carbon packs, Legacy V1 and PAA v2.0 | Knowledge | closed | **built 2 Sep 2026** — two packs, one module, the transition delta — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| K8 | Phoebe's VWBA pack is the cards' one home; the new pack shape, one pack at a time | Knowledge | closed | **built 17 Sep 2026, #84** — canon — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| K11 | A third phase tag, "Partners phase" — rows where Bridget helps on the paid site | Knowledge | closed | **logged 23 Sep 2026** — **overtaken the same day** by the phase-tags-by-nav ruling: every row carries its navigation phase, and thirteen carbon rows and two water rows are Partners; closed into item A18 — **swept 23 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| A2 | Final agent staffing | Agents | closed | settled 24 Aug 2026; Bridget's colour settled 29 Aug 2026 — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| A3 | Agent handoff primer | Agents | closed | shipped 28 Aug 2026 — rung 2 live — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| A4 | Phoebe returned an empty answer | Agents | closed | one cause fixed 25 Aug 2026 — **not the only one**, see A6 — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| A7 | An abstention cited a card | Agents | closed | logged 28 Aug 2026; **recurred 3 Sep 2026, benign branch** — reading owed — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| A8 | Wellington's chat, live on the desk | Agents | closed | **built 3 Sep 2026** — on Phoebe's pattern, thirty a day — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| A9 | Agents phrase the roster's facts themselves | Agents | closed | **canon, ruled 3 Sep 2026** — no word-for-word lines anywhere — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| A11 | The phase names are canon, and agents point at the step, never a tab | Agents | closed | **ruled and resolved 5 Sep 2026**, amended 7 Sep, same pull request — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S2 | The shared chat layer | Surfaces | closed | built through Level 2 — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S3 | Level 3 citation pop-out | Surfaces | closed | out of scope — paid platform — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S4 | Chat docks were thrown away on a surface switch | Surfaces | closed | fixed 23 Aug 2026 — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S7 | The bridge — handing a finished screening to the paid platform | Surfaces | closed | ruled 26 Aug 2026; the contract ruled 7 Sep 2026; **built 8 Sep 2026, #56** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S8 | Brightness pull-up to the book's published Frost values | Surfaces | closed | closed 29 Aug 2026 — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S9 | The return to the brand book | Surfaces | closed | **closed 30 Aug 2026** — both raises shipped, book at v4.1 — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S10 | The Quantification step | Surfaces | closed | **built 1 Sep 2026** — the third surface, pack-keyed; three packs from 2 Sep — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S13 | The handoff receiver — a question carried in from the production landing | Surfaces | closed | ~~logged 3 Sep 2026, not built~~ **built 9 Sep 2026** — the desk receives it; **optional does/name/place from 15 Sep 2026, #74**; **Wellington visit-aware from 16 Sep 2026, #76**; the sender's contract is recorded here for production to carry — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S16 | The agent screen — every step is a screen, the agent's chat in the middle and its tool as a tab; a candidate for production | Surfaces | closed | **built 9 Sep 2026, #61 to #64** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md); the B→A raise into the book and the carry list wait on the maintainer's hand |
| O2 | Restore branch protection on `main` | Operations | closed | closed 24 Aug 2026 — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| O3 | Reverse link from waterbots.ai | Operations | closed | closed 24 Aug 2026 — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| O5 | The engineer pushed without a commit word, twice | Operations | closed | logged 24 Aug 2026 — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| O6 | The card gate reports stale cards that are not stale | Operations | closed | closed 27 Aug 2026 — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| O7 | Merged branches pile up, and are now to be cleared | Operations | closed | closed 27 Aug 2026 — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| O8 | The export step in the close-out ritual | Operations | closed | ~~ruled 27 Aug 2026, open on the script question~~ **closed 17 Sep 2026** — the step and the folder are retired — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| O10 | Line endings are pinned in git but not in the working folder | Operations | closed | closed 30 Aug 2026 — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |

### Index rows of the ten items moved with their bodies, as they stood

| # | Item | Family | Bucket | State |
|---|---|---|---|---|
| K7 | A carbon card pass in Phoebe's card format — **and her second pack, `gs-paa-v2.0`, with a cited "does this apply" test per pack** | Knowledge | BONES | **logged 2 Sep 2026 as debt**; **expanded 21 Sep 2026; proposed and ruled 22 Sep 2026; steps 1 to 4 built by 23 Sep 2026** — both applies sets, all 32 carbon eligibility cards and the nineteen carbon routes approved and in their packs, then sealed at their versions ("V1 — the done line"). **Step 5 built 24 Sep 2026 (#111, #113)**, and the tool definition contract with it (#114 to #116): both packs carry a tool file, gated by `scripts/check-tool.mjs`, read by nothing yet. Her runtime — the worksheet, the record and her prompt — is what is left **Her runtime built 25–26 Sep 2026 (#122, #124, #126), step 3 under V1's done line; built, sweep due** |
| A1 | Phoebe abstention loop | Agents | PARK | built 25 Aug 2026 |
| A6 | Phoebe fails about one request in six, and every fault fails late | Agents | BONES | fixed and guarded 28 Aug 2026 — 12% to 2% |
| A13 | One roster — roster.yaml from production, checked against the primer and crew.ts | Agents | BONES | ~~**logged 18 Sep 2026 from the maintainer's brief** — waits on her carry~~ **built 18 Sep 2026, #91 merged** — the free and Commons columns stay "unconfirmed" until she carries a confirmed file |
| A15 | The specialist contract — ten lines every specialist keeps; Phoebe first | Agents | BONES | ~~**ruled 20 Sep 2026; the batch approved the same day** — steps 0 to 3 merged (#93, #94, #95) by 21 Sep; steps 4 to 6 open as pull request D, #97, at her eyeball~~ **built 22 Sep 2026, all four pull requests merged (#93, #94, #95, #97), eyeball stop 4 passed** — line 9, the one gap left, closed by item A17, #128, 26 Sep 2026 |
| A16 | Wellington guides and leads — he never asks "water or carbon" — **and names the project type from a cited list** | Agents | BONES | **logged 21 Sep 2026 from her walk of #97** — which pathways apply is Phoebe's to find; **expanded and ruled 23 Sep 2026**: a cited list of twenty-four types, confirm then log; **the types file graded and moved into `product-shared/` the same day**, on the roster rule; **his runtime built 24 Sep 2026, #119 merged on her word**: the short-form list in his prompt, type and class and stage confirmed then logged, "what kind" retired from the record and the rail; the gate to 26,199 by the measured amount; **the save-door patch of 25 Sep 2026** puts the word back on the seal alone, derived from the type, until production's receiver is carried; **people served built 27 Sep 2026, #130 merged on her word** — asked after the stage for C-11 and C-19, households never converted |
| A17 | The handoff goes both ways — forward and back | Agents | BONES | **logged 21 Sep 2026 from her walk of #97**; **built 26 Sep 2026, #128 merged on her word** — he reads each pathway's read and any Blocked or still-open row by id and tool-file title, never her sentences; greets the visitor back once; Quantify only where a pathway fits; built, sweep due |
| A18 | A specialist is a guide, not a gate — the readiness read, the cited routes, and the door to a person | Agents | BONES | **ruled 23 Sep 2026 from her review of Phoebe's cards** — the rule is in AGENT_RULES.md (#100, merged); **stop 3 passed the same day**: fixability lines on the six water cards and nine water routes in the pack; the "tools on the paid site" line ruled canon; **her addendum of 23 Sep 2026 ruled and its tags built**: a Phase line on every eligibility card, the stage question, framing from the stage, the door once; nothing runtime built **Built 25–26 Sep 2026 (#122, #124, #126)**: five row states, the readiness read per pathway, the cited routes, the tools line, and the door to a person — her offer once on a Blocked row, a box and note at the save door, an email to the WaterBots team on a ticked save; built, sweep due |
| A19 | Wellington's prompt measures 26,117 on `main`; BUILD_PLAN says 26,108 — find the nine characters | Agents | BONES | **logged 30 Sep 2026 from the maintainer's word; cause found at the 30 Sep close-out** — the 29 Sep build-update refresh added nine characters; the live docs now carry the measured number |
| O11 | OPEN_ITEMS.md is heavy and wants an archive | Operations | BONES | **two sweeps done** — 30 Aug and 2 Sep 2026; **the triage is the next brief, 17 Sep 2026** |

### The item bodies, verbatim

#### K7. A carbon card pass in Phoebe's card format — and her second pack, with a "does this apply" test

**Debt, logged 2 Sep 2026 and not built.** After Thursday's C4SW walk: a card pass in Phoebe's
card format, drafted from the two Gold Standard PDFs in `sources-local/methodology/`, graded by
the maintainer, and carried through the same pipeline as the VWBA cards — committed source, a
generated module, a staleness gate. Until it lands Phoebe has no carbon cards and abstains on
carbon questions, which is the correct outcome.

**Why it is a row and not a task.** The maintainer asked for one open-items row so it is not
lost. It waits for Thursday and on her word.

##### Expanded 21 Sep 2026, from the maintainer's walk of pull request #97

Her ruling at eyeball stop 4, in her words:

> Phoebe's second pack, gs-paa-v2.0, in the new shape, with a cited "does this apply" test per
> pack so she knows which worksheets to fill and reports each pathway on its own.

**Four things it now holds, beyond the card pass.**

1. **A second pack of her own**, `knowledge-packs/phoebe-eligibility/gs-paa-v2.0/`, in the pack
   shape ruled on 17 Sep 2026 — `cards/`, `tool/`, `evals/`, `README.md`, `CHANGELOG.md` — beside
   `vwba-2.0/`, which is the first thing in this repository to make a seat hold two packs. **One
   pack at a time** still holds; this is the brief that proves the shape carries a second.
2. **A cited "does this apply" test on every pack, hers included.** A short test, drawn from the
   standard's own words and cited like any other claim under [CITATIONS.md](./CITATIONS.md),
   that says whether this pack's pathway is in play for the project in front of her. `vwba-2.0`
   gains one too; a pack without one cannot be sorted.
3. **She runs the tests to know which worksheets to fill.** Which pathways apply is hers to find
   (item A16), and the tests are how she finds it. A pathway that does not apply is said and
   dropped; a pathway that applies opens its worksheet.
4. **Each pathway is reported on its own.** One verdict per pathway, never merged into a single
   "eligible". A project may qualify on one and not the other, and a reader must be able to tell
   which. Her prompt already carries that as a fact from 21 Sep 2026 (item A15); this row is the
   machinery behind it — the worksheets, the record's eligibility section, and the rail.

**What this does not settle.** Whether the second worksheet is a second tool or one tool with two
sets of rows; how the record's eligibility section holds two pathways; and whether Calvin's carbon
method packs (item K6, built) and this eligibility pack cite the same documents twice. All three
are the proposal's to answer, with her ruling on the shape.

**Ordering.** The card pass above comes first — there is no pack without cards. Items A16 and A17
are the same work seen from Wellington's side.

##### Proposed and ruled, 22 Sep 2026

**The proposal** is `PROPOSAL_K7_gs-paa-v2.0.md`, untracked at the repository root until the work
merges. It read `sources-local/Methodology/` at three layers — the rules for every Gold Standard
project (101, 102, 103, 104, 107, 118), the Paris-alignment framework (119, 120, 447, 454, 456,
201, 461, 503, 446) and the methodology itself in both versions with its product rules (429 V2.0
and its SI, 429 V1.0, 501) — plus the WHO and JMP standards the methodology hands conditions to.
It found **32 basic eligibility requirements**, each cited by document, version, section and page:
seventeen from the methodology's own gate, two from the framework, thirteen from the general
rules; and a further set read and deliberately not made rows, each with its reason. It proposed one
card and one worksheet row per requirement; a cited "does this apply" test per pack, four cards for
the carbon pack and two for the water pack; one tool with two sections and a pathway state above
each; rows keyed by pack in the record, the relay and the seal; nine steps in four pull requests
with five eyeball stops; and seven rulings.

**The three questions this item left open, answered by the proposal and ruled:** one tool with two
sections, not two tools (R3); the record's eligibility section and the seal hold rows per pathway
plus each pathway's state, and production is told before the sender changes (R6); Calvin's carbon
packs and this one cite the same methodology page for different sections and different jobs, each
card standing alone, nothing shared (§9.4 of the proposal, under R1).

**Her rulings, in her words:**

> Rulings on PROPOSAL_K7_gs-paa-v2.0.md §11: R1, R2, R3, R6, R7 yes as proposed. R4 yes, with
> this: questions are written to cover both pathways whenever one answer can, so the free site
> screens well; a verdict covers every row the answer settles; when a pathway drops out, she says
> so and continues with the other. R5: the cap stays at 20; revisit after the first real walk.
> Build pull request A, steps 1 and 2 only: the pack scaffold, confirm the four unconfirmed pages,
> and the six applies cards as -DRAFT files at the root. Stop at Stop 1 for my grade.

**What the read found in the sources and raised, never fixed** (proposal §12, ruling R7 says the
cards say so in a line): the methodology's ongoing water-quality bar cites a WHO table that says
non-detect while the text says under 10 per 100 ml; SODIS is on the positive list but not among
the eligible technologies; the methodology and its supplement disagree on the 5 m³ a day
groundwater line; corresponding adjustments and host-country authorisation appear in none of the
held documents, only a negative-list check; the suppressed-demand requirements are cited as not yet
published; the methodology carries two publication dates two days apart.

**Steps 1 and 2 built the same day, on `feat/k7-gs-paa-pack`, pull request A open.** The scaffold
`knowledge-packs/phoebe-eligibility/gs-paa-v2.0/` in the ruled shape, not live, nothing reading it,
with every Gold Standard canonical page confirmed (twelve pages, fourteen documents; the guessed
slugs for 104, 107, 118, 119 and 120 were found through the publisher's own search); the seat, the
tree and the water pack's README corrected and bumped. The six applies cards drafted at the root as
`applies-cards-gs-DRAFT.md` and `applies-cards-vwba-DRAFT.md`, untracked, never read.

**Stop 1 passed, 23 Sep 2026.** Both applies files graded "pass as redrafted" after their "If the
answer is no" sections were redrafted under the guide-not-gate rule (item A18), with one addition
on card T4 in her words: for a transitioning project, a fact Phoebe phrases, that a
transition-assistance module, overseen by trusted consultants, is coming to the paid site and the
visitor can save the project and sign up for access; logged beside the paid-site tools line in
AGENT_RULES.md and on item O14. Both sets moved into their packs, `gs-paa-v2.0/cards/applies-cards-gs.md`
and `vwba-2.0/cards/applies-cards-vwba.md`, approved, read by nothing until step 5's reader.

**Step 3 drafted the same day, at stop 2.** `eligibility-cards-gs-DRAFT.md` at the root,
untracked: the seventeen methodology cards M1 to M17, each with "Can it be fixed?" (ten *yes*,
seven *depends*, no flat *no*; the flat *no* on the carbon pathway sits on applies card T2),
"Applies to" and "External standard", citing the methodology's section and page and, where a
framework document is also cited, its page as a second link. The carbon routes they name are the
proposal's planned ids, not cards yet.

**Stop 2 passed, 23 Sep 2026, later.** Her grade: "all 17 pass", two conditions. Both met before
the move: the WHO and JMP pages cited on M3, M4, M5 and M7 confirmed on the publishers' sites (the
scheme report's page dates it 18 March 2026; M3 corrected); the Blocked cases on M5, M12, M13 and
M14 carried to the reviewer as Q11, on item O14. M1–M17 are in
`gs-paa-v2.0/cards/eligibility-cards-gs.md`, each with the Phase line her addendum ruled the same
day (item A18). **Step 4 drafted at once:** `eligibility-cards-gs-framework-DRAFT.md` at the root,
untracked, the fifteen framework and general cards P1–P2 and G1–G13 with fixability lines and
tags — three *depends* (P1, G6, G12), no flat *no*, all *To start*.

**Stop 3 passed, 23 Sep 2026, later.** Her grade: "all pass as drafted". The fifteen appended to
`gs-paa-v2.0/cards/eligibility-cards-gs.md` as part two, so all 32 rows of the carbon pathway sit
in one file; notes to `grader-notes.md`. **Step 4, carbon half, drafted at once:**
`routes-cards-gs-DRAFT.md` at the root, untracked, the nineteen routes R-1 to R-19 the eligibility
cards already name, cited only from the methodology, the documents it names as binding, or a held
published project (none is a carbon project, so none is cited); four rest on documents one link
removed through the Principles & Requirements and say so, for her to strike. **Her grade of the
nineteen is the next stop.** The tag rule of the addendum stands as written, her word the same day.
A third tag, "Partners phase", is item K11, the next version, not built.

**Step 5 built, 24 Sep 2026 — the pack-keyed reader, and the tool files with it.** Four pull
requests merged on her word, build-order step 1 under "V1 — the done line". `src/lib/phoebeCards.ts`
is pack-keyed and reads seven card files and both pack READMEs; every approved card in both packs
shows on Phoebe's Knowledge tab, water then carbon, each set with its own approval date, the two
untracked drafts saying Draft and nothing more, and one honest line saying she reads the water
cards today (#111). Calvin's and Bridget's tabs took a version on every row and the same Evals
section, and Bridget's rows moved onto the shared component so one component draws every agent's
tab (#113).

**And the tool definition contract landed with it, pulled forward on her word.** Both packs now
carry `tool/eligibility-worksheet.yaml` — one tool, a section each, forty-four rows between them,
every row citing its card by id and its routes by route card id (#114, #115). Ruling R9 as amended
24 Sep 2026 gave a row one optional ninth key, `applies`: which rows exist for a project's
technology class or version, read from the card's own "Applies to" line, absent meaning every
project (#116). `scripts/check-tool.mjs` is the gate; it holds a row's title, its fixability, its
phase and its `applies` to the card, and runs by hand with the other checks on her ruling.
**Nothing reads either file yet**, and both `tool/README.md` files with their agent-facing regions
stand as they are until her runtime step. **Three fixes a carbon card describes that no route card
carries — T1's and M2's change of pump drive, M14's justified sub-national area — are logged on the
carbon pack's own page as route cards to draft after v1.**

Logged 2 Sep 2026. **Expanded 21 Sep 2026. Proposed and ruled 22 Sep 2026; stops 1 to 3 passed
23 Sep 2026; the carbon routes approved and step 4 done the same day; step 5 built 24 Sep 2026.
What is left is her runtime: the worksheet and the record (pull request C) and her prompt and the
measured walk (D). Bucket BONES.**

#### A6. Phoebe fails about one request in six, and every fault fails late

**Top priority. Measured 28 Aug 2026, twenty requests, and it is live.**

**This affects real visitors on `map.waterbots.ai` today.** It is not caused by the agent handoff
primer, it predates it, and it was found only because the primer was being tested against a
baseline.

##### What was measured

One question, asked twenty times through the real relay: *"We are planning to restore 40 hectares of
wetland upstream of our bottling plant in a water-stressed basin. Would that be eligible to generate
a countable benefit?"* Ten through `main`'s prompt, ten through the parked step-two prompt. Each
attempt recorded its HTTP status, elapsed time, reply length and cited-card count.

**`main`, no primer — the code that is deployed:**

| # | Result | Time |
|---|---|---|
| 1 | Short — 569 characters, 6 cards | 21.6s |
| 2 | Full — 1,247 characters | 15.4s |
| 3 | **HTTP 502 — empty answer, refused** | 12.3s |
| 4 | **HTTP 502 — API error 400, "Invalid request data"** | 25.2s |
| 5 | Full — 1,503 characters | 22.0s |
| 6 | Full — 1,503 characters | 21.5s |
| 7 | Short — 640 characters, **0 cards** | 48.3s |
| 8 | Full — 1,331 characters | 18.1s |
| 9 | **HTTP 502 — empty answer, refused** | 11.7s |
| 10 | Full — 1,424 characters | 18.6s |

**With the parked primer, for comparison:**

| # | Result | Time |
|---|---|---|
| 1 | **Timeout — no response** | 240s |
| 2 | Full — 1,730 characters | 25.0s |
| 3 | Full — 1,028 characters | 22.5s |
| 4 | **Timeout — no response** | 240s |
| 5 | Full — 1,207 characters | 23.2s |
| 6 | Full — 1,494 characters | 21.0s |
| 7 | Full — 1,685 characters | 12.2s |
| 8 | **Degenerate — 7 characters, delivered** | 23.9s |
| 9 | Full — 1,222 characters | 15.4s |
| 10 | Full — 1,831 characters | 22.2s |

**Three failures in ten on each side.** The rate is the same; the shape differs. The primer does not
make Phoebe less reliable — it changes how she fails.

##### Four faults, and they are not one fault

1. **Empty answers far below the budget.** Logged at **945** and **733** of 16,000 output tokens.
   Item A4 recorded this symptom as fixed, and its cause — hidden thinking exhausting the budget —
   was real and was fixed. **This is a different cause with the same symptom.** A4 is corrected
   rather than reopened.
2. **`API error 400 — Invalid request data`**, request id `req_011CeV9mhFbtJtXQBh1E41qK`. **That is
   our request being rejected**, not the model answering badly. It has never been seen before and
   nothing in the repository explains it.
3. **A seven-character reply was delivered to the caller.** Item A4 deliberately refused to put a
   minimum length on the schema, arguing that forcing the model to emit something turns an honest
   failure into a meaningless answer that looks real. **The guard tests for an empty reply, and
   seven characters is not empty**, so it passed. The principle was right and the guard does not
   implement it. **This is the same lie the guard exists to stop.**
4. **Answers vary enormously on identical input** — 569 to 1,503 characters, one citing six cards
   and another citing none, on the same question through the same prompt.

##### One fault that belongs to the parked primer, not here

**Two requests hung with no response at all**, and `main` did not hang once in twenty attempts today.
The relay logs the line printed immediately before the model is called and then nothing — no error,
no refusal, no token count. **It is waiting on a call that never returns, and it has no timeout of
its own to end the wait.**

Locally that is an infinite wait. On the deployment platform it would hit the platform's own function
limit and return a gateway error, so a visitor would see a failure rather than a hung page.

**It is recorded here because it may share a cause with the faults above** and re-measuring it is
part of this item's work. It does not belong to the primer until that has been checked.

##### The diagnosis, 28 Aug 2026 — seventy-five requests, instrumented

**The relay was instrumented first** so that failures explain themselves: stop reason, content
blocks, token usage, elapsed time, the parsed shape, and — for a reply of forty characters or fewer
— the reply quoted in full. It is behind `PHOEBE_DIAGNOSE=1`, off by default, and is debt to remove
when this item closes.

**Seventy-five requests across three questions**, all against the deployed prompt.

| Fault | Rate | State |
|---|---|---|
| Empty or near-empty reply | **9 in 75 — 12%** | **Explained** |
| `API error 400 — Invalid request data` | 2 in 75 — 3% | **Explained, and its message is false** |
| Budget exhausted at 16,000 | 2 in 75 — 3% | **Explained** |
| Answers varying on identical input | — | **Mostly not a fault** |
| Any failure | **13 in 75 — 17%** | |

###### Fault 1 and 3 — she finishes on purpose and says nothing

```
stopReason: "end_turn"        output: 920 of 16000
parsedKeys: [reply, citedCards, abstained]
textPreview: {"reply": "","citedCards":[],"abstained": false}
```

**Not the budget** — 920 to 1,525 of 16,000, measured across five instances. **Not truncation** —
`end_turn` with valid JSON. **Not a refusal** — no refusal stop reason in seventy-five requests.
**Not a parsing fault** — it parses cleanly with the right keys.

She spends 900 to 1,500 output tokens, most of it hidden thinking, then writes a well-formed answer
whose reply is an empty string and whose `abstained` flag is **false**. She does not consider it a
refusal. She simply produces nothing.

**Fault 3 is the same event with a character in it.** Four replies of one to three characters were
delivered to callers, same `end_turn`, same `abstained: false`, same zero cards. They are not empty,
so the guard passed them. **What those characters were is still unknown** — the instrument that
would quote them was added afterwards and has not caught one since. That gap is named rather than
filled with a guess.

###### Fault 2 — the "invalid request" is not our request

Reproduced twice. The instrumentation recorded what was sent, and it is **identical to the thirteen
requests that succeeded in the same run**:

```
model: claude-sonnet-5   maxTokens: 16000   effort: medium
systemChars: 53810       messageCount: 1    messageChars: [163]
```

**And the timing settles it.** Both failures returned after **27.8 and 31.4 seconds**. A genuinely
malformed request is rejected in milliseconds, because nothing has to be computed to know it is
malformed. **A 400 arriving after half a minute of work is a failure during generation wearing the
label of a client error.**

That is why nothing in this repository explained it. There was nothing to explain.

###### Fault 5 — the budget wall, which item A4 said did not exist

Two requests spent **16,000 of 16,000** and stopped on `max_tokens`, taking **102.8 and
109.5 seconds** against a normal call of about twenty. A4's headroom claim is corrected in place
under the visible-corrections rule.

**Five times slower, not slightly slower.** That is a runaway rather than a shortage of room, which
is why raising the number is not the obvious answer.

###### Fault 4 — mostly the measuring instrument, not Phoebe

Answers do vary, and far less than first reported. **The first pass called anything under 800
characters a failure**, which mislabelled twelve correct short answers to a simple question. The
real variance is the empty-answer fault plus legitimate differences between questions.

##### The shape all of it shares

**Every fault fails late.** Nine hundred to 1,500 tokens of thinking and then nothing; 28 to
31 seconds and then a false 400; 102 seconds and then a wall. **None of them is a bad request, a bad
card, or a bad schema** — the inputs are identical to the successes in every case measured.

They are one thing failing to finish, which is why a fix has to touch how she thinks rather than
what she is given.

##### What the difficulty of the question does

| Question | Empty-answer rate |
|---|---|
| Wetland restoration — complex, six criteria | **7 in 30 — 23%** |
| Community consultation — simple, one card | 1 in 15 |
| Feasibility — the other card set | **0 in 15** |

**The harder the question, the more often she says nothing.**

##### What a fix has to move, and how it is proved

**The empty-answer rate is the number: 12% overall, 23% on hard questions.** The proof is the same
seventy-five requests, the same three questions, the same instrument.

**Budget exhaustion and the false 400 are separate faults with separate answers**, and a fix
proposal must say for each whether a model or effort change can reach it, or whether it is upstream
weather that can only be guarded against. Maintainer's ruling, 28 Aug 2026: **if it is weather, the
guard proposal — including the near-empty hole — rides next.**

##### The fix, ruled and shipped 28 Aug 2026 — Opus 5

**Four measured runs, sixty to seventy-five requests each, same three questions, same instrument.**

| | Sonnet · medium<br>morning | Sonnet · low<br>Option A | Sonnet · medium<br>fresh | **Opus · medium**<br>**Option B** |
|---|---|---|---|---|
| Empty answers, 60 | 8 — 13% | 6 — 10% | 7 — 12% | **1 — 2%** |
| Empty, hard question | 7 in 30 — 23% | 5 in 30 — 17% | 3 in 30 — 10% | **1 in 30 — 3%** |
| Calls over 240 seconds | 0 | **8** | 0 | **0** |
| Budget wall | 2 | 0 | 0 | 1 |
| Median call | ~20s | 7.1s | 14.6s | **8.2s** |
| Mean output tokens | ~2,000 | 558 | 1,086 | **705** |
| Cards on hard answers | — | 5.0 | 4.1 | **4.8** |
| Abstention discipline | — | 15 of 15 | — | **15 of 15** |

**Option A was refused.** It barely moved the rate and produced eight calls over four minutes where
a same-hour `medium` baseline produced none. Maintainer's ruling: *a four-minute wait is worse than
the fault it barely dents.*

**Option B was ruled and shipped.** It clears every condition set for it: the hard-question rate
falls from 23% to 3%, discipline holds at fifteen of fifteen, citation improves rather than
degrades, and it is faster than the baseline rather than slower.

**The upgrade was the one line the code had named since 21 Aug 2026**, which said to raise the model
if abstention discipline proved weak. **Discipline was never weak — the answer was.** The same line
fixed it.

**Cost:** Opus is dearer per token and produced fewer tokens, 705 against 1,086, and answered
faster. The net is the maintainer's to weigh and is not guessed at here.

##### A measurement caveat that outlives this item

**The hard-question rate swung from 23% to 10% on the identical configuration four hours apart.**
Same model, same effort, same question, same instrument.

**A thirty-request sub-sample cannot carry a decision.** The sixty-request figure is the steady one
— 13% and 12% on two separate `medium` runs — and the ruling rests on that. Framing 23% as a stable
target was overconfident, and it is recorded here so the next comparison is sized properly.

##### The budget wall is ours, and it is banked

**Effort reaches it.** `low` produced none in seventy-five; `medium` produced two on Sonnet and one
on Opus. That settles the question the fix proposal owed: **the wall is not upstream weather.**

**It is not fixed and Opus does not remove it** — one request in seventy-five still spent 16,000 of
16,000. **It belongs to the guard proposal's scope**, along with the near-empty hole and the false
`API error 400`, which remains weather.

##### The guards, shipped 28 Aug 2026 — what the model change does not reach

**Two steps, run as one approved plan.**

**A reply shorter than 40 characters is refused rather than delivered.** `api/_reply.ts` holds the
floor as a named constant; `scripts/check-reply-guard.mjs` is the eleventh check and proves it in
both directions. **This is not the schema minimum item A4 refused** — A4 declined to make the model
say more, and this refuses to hand a non-answer to a visitor. Same principle, opposite direction.

**The relay has a timeout of its own, 120 seconds, where it had none at all.** Locally that was an
unbounded wait; on the platform the deployment's own limit ended the request and a visitor got a
gateway error instead of the honest message this relay gives everywhere else. **A default nobody
wrote down is a decision nobody made** — this item's own family lesson, unapplied until now.

**One retry, only for a 400 arriving after five seconds**, because a malformed request is rejected
in milliseconds and the two measured instances came back at 27.8 and 31.4 seconds. **A retry cannot
cost a visitor two of their twenty**, and `check-cap` now proves it rather than the code merely
asserting it.

**The budget wall is not closed by any of this.** It is cut off at 120 seconds rather than run to
completion, which limits its cost without removing its cause.

##### What this item is, and is not

**It is a diagnosis, not a fix.** Finding the faults comes first, and any fix is proposed separately
once there is something to fix rather than something to guess at.

**What "done" looks like for the diagnosis:** each of the four faults above either explained with
evidence, or shown not to exist. Then, and only then, a proposal.

##### Why this outranks everything else in this lane

**A third of visitor questions failing is worse than any feature being missing.** The agent handoff
primer is built and parked. Nothing published claims it is live, so nothing is dishonest while it
waits.

**And the honest note about how this was found.** Two earlier baseline runs came back nine-for-nine
clean, and were reported as a clean baseline. They were small samples and luck. **The clean baseline
was wrong, and reporting it as a baseline was wrong**, which is why this item carries the raw twenty
rather than a summary.

Opened 28 Aug 2026. **Diagnosed, fixed and shipped 28 Aug 2026 — Opus 5, 12% to 2%. Open on what
the fix does not reach: the budget wall, the near-empty hole, and the false 400, all of which go to
the guard proposal.**

#### A13. One roster — roster.yaml from production, checked against the primer and crew.ts

**Logged 18 Sep 2026 from the maintainer's brief. Waits on her carry. Not started.** Her words, kept whole:

> One roster. I will carry roster.yaml from production. The primer's crew facts and
> `src/lib/crew.ts` get checked against it, and the build fails if they disagree. Levels are Meet,
> Screen, Work.

**What holds the roster today, in four places.** The crew list in `src/lib/crew.ts` (four agents,
their roles and steps); the crew facts in the primer's regions,
`knowledge-packs/product-shared/agent-primer.md`; the roster table in that pack's README; and the
brand book's §6, which is gitignored and governs. Four homes for one fact is the drift the one-home
rule exists to stop.

**The shape, as read from her words.** A `roster.yaml` arrives by her hand, from production, the way
every shared rule arrives (rule zero — nothing is fetched). A check in `scripts/` reads it and
compares what this site says against it — names, roles, steps, whatever the file carries — and the
build fails on any disagreement, the way the card gate fails on a stale card. Whether the file then
becomes the source that `crew.ts` and the primer are generated from, or only the thing they are
checked against, is a question for the proposal.

**"Levels are Meet, Screen, Work."** Her words, recorded as given. What a level is on this site is
not known here and is not guessed; it is defined when the file arrives.

~~Logged 18 Sep 2026. **Waits on the maintainer's carry of `roster.yaml`. Bucket BONES.**~~

**Built 18 Sep 2026, pull request #91, merged the same day on her eyeball.** She carried `roster.yaml` by hand
the same day, version 0.3.0, ruled 17 Sep; it sits in the shared pack and this site never edits it.
The levels are the file's own — meet, screen, work, later, none — and the doors are free, commons
and paid; both are read from the file, never typed into the check.

- **Checked, not generated**, by her go on the proposal: `src/lib/crew.ts` holds only what the
  roster does not (portrait, colour, whether the accent may carry text, which screen opens) and
  the primer is her approved prose with its struck history. `scripts/check-roster.mjs` holds the
  crew file, the Commons shelf, both primer regions and Wellington's people sentence to the roster,
  and runs in front of `npm run build`, so a disagreement fails the deploy and names the line.
  `npm run roster:check` runs it alone, under production's name for it.
- **"unconfirmed" passes either way, always.** A new allowed word for `built` is one row in the
  check (`BUILT_WORDS`); she said she may add "partly" at the source for a seat whose tool is open
  and whose chat is not.
- **What tripped:** Bridget's role in `crew.ts` read "Map" where the roster's seat is "Partners".
  Her ruling: `crew.ts` changes. Her card reads "Partners" on the desk and on the Commons shelf.
- **Allowed and printed:** Reggie, Goldie, Edgar, Monty, Melody and Audrey are on the roster and
  not built here; Ally is a second face of the Partners seat and nowhere on this site. Nothing is
  built for any of them; later briefs.
- **Her four rulings of 18 Sep 2026:** the primer's "basin map" wording stays this brief;
  Wellington's prompt sentence naming the four stays her wording, checked and never rendered;
  Ally as above; the check in front of the build, with `yaml` as a dev dependency.
- **The other homes point at the file.** The shared pack README's roster table is struck, dated;
  it had already drifted on Bridget's label. Shared pack 0.3.0, tree 0.3.0.
- **What she took to the source:** the table of what is truly built at the free door and on the
  Commons, ten seats; and the two "this repository" lines in the roster that mean the paid site.
  Both were in the proposal, which is deleted.
- **Two finds left for her word, not changed:** the screen host records' own role words. Logged
  as item A14 on her word the same day; the story lives there.

**Open until:** she confirms the free and Commons columns at the source and carries the file
again. **Bucket BONES.**

#### A15. The specialist contract — ten lines every specialist keeps; Phoebe first

**Ruled 20 Sep 2026 from the maintainer's brief; proposal approved as a batch the same day.**
Her ten lines live once, in [AGENT_RULES.md](./AGENT_RULES.md) under "The specialist
contract", in her words. This row is the work's home. Her reason, in her words:

> Every specialist on this site must behave the same way, so I can review one agent at a
> time against one standard, and Deb's rig can grade each line.

**Line 10 was added the same day, by her word, before the rulebook section merged**: what
knowledge and values the tool needs, the kind of value each input takes, where it usually comes
from; check the project context first, ask only for what is missing, say where each value came
from. With it she named where the project context is at each door; both are in AGENT_RULES.md.
Each pack table is ten rows. Phoebe reads partly on line 10; what reaching yes adds to steps 2
and 3 is reported to her and waits on her go.

**Where each agent stood on 20 Sep 2026**, read from the code: Phoebe one yes, seven partly,
one no on the first nine, partly on the tenth — she never saw her own worksheet, was never told her level, and read the grader
notes at the foot of her card files as knowledge. Bridget and Calvin, with no chat, no on
nearly every line; the tool posts to the record and the agent does not exist to. The full
tables live on each pack README under "The contract".

**Her four rulings of 20 Sep 2026, on the proposal:**

1. **Rung 2 stays as written, and line 8 adds to it.** Out of her lane a specialist still
   says the colleague's facts in her own words, and sets a hand-back field so the console
   offers the way back to Wellington, because he routes. Recorded in AGENT_RULES.md.
2. **The grader-notes split (item K10, part 2) goes first.** Her card review runs alongside
   as her own job; any wording she changes lands as its own commit under her eyeball, never
   inside the move.
3. **The shown line proceeds on prose**, with a before-and-after capture in the pull request;
   same place and size as the citation line, no new colour; she may strike it at the eyeball.
4. **The measured bar: no worse than 1 in 60 empty answers over sixty requests.** If any
   measured run is worse, the engineer stops and tells her before going on. And every For
   Amy block carries the measured counts in one plain sentence, and roughly what the run cost
   in API calls.

**The plan, six steps, four pull requests, four eyeball stops.** Step 0, the contract into the
rulebook and the pack tables (own pull request). Step 1, the notes split (own pull request).
Steps 2 and 3, her tool, her level and her lead in her prompt, and the worksheet's rows sent
to her with every ask and read back as the record's eligibility section (one pull request, one
walk). Steps 4, 5 and 6, the hand-back field, the walk in order with the shown line, and the
A6 instrument removed (one pull request, one full walk). Item A6's residual faults block no
line; they set the proof method.

**Named, not built:** Wellington's side — reading her verdicts from the record and greeting
the visitor back knowing what she found. Its own brief, after Phoebe. Calvin's and Bridget's
briefs come after, each on the same nine lines; the lists are on their pack READMEs' tables
and in item A12.

**Where it stands, 22 Sep 2026.** ~~Steps 0 to 3 merged on her eyeball: #93, #94, #95.~~ **All four
pull requests merged on her eyeball: #93, #94, #95 and #97, eyeball stop 4 passed 22 Sep 2026.**
Three measured runs, all zero empty in sixty, and one full walk: six verdicts in seven turns, the
order kept in six of six moving turns, one question a turn, the hand-back set at the end. Lines 1,
2, 3, 4, 5, 6, 7, 8 and 10 read yes for Phoebe; 9 is still partly, because no agent here reads her
verdicts yet — that gap is item A17. ~~Steps 4, 5 and 6 are open as pull request D, #97, at her
eyeball~~ **The batch is complete.** The full record of the six steps is in
[BUILD_PLAN.md](./BUILD_PLAN.md) under *Previously*.

**Her rulings at eyeball stop 4, 21 Sep 2026, made on her own walk.** Two were built into #97:
Wellington's copy of the A6 instrument came out with the rest, so the switch is gone from both
relays; and her scope reaches her as facts she phrases — she checks eligibility under VWBA 2.0
today, carbon eligibility is coming and not live — recorded in one line of her pack's contract
table. Three are logged and not started, each wanting its own proposal: items **A16** and **A17**
in this family, and item **K7** expanded with her second pack and a cited "does this apply" test
per pack. **This item's own work is complete**; those three carry on, and the next brief is K7 —
Phoebe's carbon pack — on the maintainer's word.

**Bucket BONES.** Batch complete 22 Sep 2026. A16, A17 and K7 (expanded) carry the open work on.

#### A16. Wellington guides and leads — he never asks "water or carbon"

**Logged 21 Sep 2026 from the maintainer's walk of pull request #97, at eyeball stop 4. Not
started.** Her ruling, in her words:

> Wellington guides and leads. He does not ask "water or carbon". Which pathways apply is
> Phoebe's to find.

**What she saw.** Walking the desk herself she was asked to choose a pathway before anyone had
looked at the project. That is a question the visitor cannot answer and the site can: whether a
project can earn a countable water benefit, a carbon credit, both or neither is a finding, not a
preference, and finding it is the eligibility specialist's job.

**What it means for him.** His part is to learn what the project is and route to the step that
comes next; it is not to sort visitors into pathways at the door. What has to change in his
prompt, his route list, and the desk's own words is the work of the brief, not of this row.

**What it means for her.** Finding which pathways apply is Phoebe's, and she can only do it for
the pathways she holds cards for — one today. This row and item A17 and item K7 are one piece of
work seen from three sides, and the K7 row carries the pack side.

##### Expanded and ruled 23 Sep 2026 — he names the project type from a cited list

Her finding, from her review of the applies cards, in her words:

> Wellington translates the visitor's words into a standard project type from the rulebooks
> (e.g. "pipes and a borehole" -> Community Water Supply) and stores that type in the project
> context, not the raw words. He confirms in plain words first: "That sounds like a Community
> Water Supply - [simple definition] - does that sound right?" then logs it on yes. Needs a cited
> list of the standard project types he matches to (GS four classes; VWBA activity table).

**The proposal, `PROPOSAL_guide-not-gate.md`, untracked at the root, and her rulings R1 to R9 on
it, all yes as proposed, 23 Sep 2026.** The list is twenty-four types in one shared file,
`knowledge-packs/product-shared/project-types.md`: the twenty rows of the VWBA guidebook's
activity table (Appendix C, Table C-1, pp. 37–39) and Gold Standard's four technology classes
(GS4GG PAA M400-12 V2.0, Table 2, pp. 6–7; Table 3, p. 9), plus "none of these", each with a
one-line plain definition and its citation. He matches in his own words, says the definition
back, and logs `type` (and `gsClass` for a drinking-water project) only on the visitor's yes;
the relay checks both against the file; the raw words stay in "What it does". **"What kind"
retires** (R2). **The file follows the roster rule, her word of 23 Sep 2026: drafted here,
carried by her hand, and the paid repository becomes its source** — after which it is never edited
here, and a check holds this site to it, as `roster.yaml` is held. The carry is on item O14's list.

**Where it stands, 23 Sep 2026.** The rule is in the record (#100, merged). The types file was
drafted at the root, graded by her the same day — "ships", one edit, the "not ruled out" note cited
as Appendix C, pp. 37–39, the note itself on p. 39 — and moved whole into
`knowledge-packs/product-shared/project-types.md`, approved, on the roster rule; the carry to the
paid repository is on item O14, and nothing reads the file yet. His prompt, his fields, the rail and
the seal change at the proposal's step 5, not started. Item A18 carries Phoebe's side of the same
brief.

**The stage joins the type, 23 Sep 2026**, her addendum: Wellington asks whether the project is on
paper, being built, or already running, and logs it beside the type, only on the visitor's
confirmation, from a closed list; each standard's start-date definition is cited in the addendum
(101 v2.1 §4.1.39–4.1.41, §5.1.29; V2.0 Table 1; VWBA Glossary p. 66 and Step 3 p. 21). Builds at
the proposal's step 5 with the type.

**Built 24 Sep 2026, on her word of the same day, one pull request, #119, merged on her word the
same day.** The list reaches him in its short form — id, the standard's name, one plain sentence, no
cites — parsed once from the shared file into a module for the relay and one for the browser,
both under the staleness gate. He matches from what the project does, says the definition back
in his own words and never the id, and `type` is returned only on the visitor's yes; NONE on a
yes to none of these; no type when they are not sure. A drinking-water project (C-19) is asked
its class the same way, and `gsClass` is kept only beside C-19, on the relay, in the client and
on the seal. The stage — on paper, being built, already running — is asked and `stage` returned
only on the visitor's yes. "What kind" is gone from his answer, the visit, the rail, both agents'
record blocks and Phoebe's tool text; the rail shows a "What type" row with the
standard's name and its sentence behind it, and a "Stage" row. The seal carries `type`,
`gsClass` and `stage` for `kind`, told to production once on item O14. His prompt measured
25,699 after the build; the gate is 26,199, her ruling, raised by the measured amount to leave
500. One short run each for him and for Phoebe; one four-turn walk against the relay logged the
type on the second turn, the class on the third, the stage on the fourth. Item A17, his reading
of what Phoebe found, is untouched.

##### The save door broke, and the word came back — 25 Sep 2026

**Found by the maintainer's own live test**, the day after #119 merged: she held a full
conversation with Wellington at the desk — the project's name, what it does, its type, its stage
and its country — clicked save, and arrived on production to be told her screening had not made
it across. The record reached production empty.

**Why.** Production's receiver still reads `record.kind`, the field this site retired the day
before. The three fields that replaced it — `type`, `gsClass`, `stage` — mean nothing to it yet,
and without the word it knew, it read the record as empty. Nothing was lost on this side and no
visitor's words were mishandled; the save simply did not arrive as a project.

**Her ruling, 25 Sep 2026.** Until the carry updates production's receiver, this site's sender
carries `kind` alongside the three new fields, derived from the type — water, carbon, both,
neither — and this site's own check allows the pair. Built the same day as its own small pull
request, ahead of build-order step 3.

**How it is derived, and what it is not.** `pathwayKind` in the generated project-type module is
the one home: no type gives a blank, the potable-water type C-19 gives *both* because it is the
one type both standards' lists name, any other activity type gives *water*, and "none of these"
gives *neither*. *Carbon* stays in the closed list because production reads the word and a
carbon-only type could join the list later; no type on the list yields it today, because the four
Gold Standard classes are classes and a class is never a type. **It is a hint about which
standards name this kind of activity and never a verdict on a pathway** — which pathway a project
fits is Phoebe's to find, and her verdicts cross in the worksheet, not here. The seal's reader
refuses a `kind` that disagrees with the type, so the pair cannot drift apart.

**What is still owed.** The carry on item O14 now has two parts: production's receiver reads
`type`, `gsClass` and `stage`, and on that day the word retires from the seal here. The retirement
everywhere a visitor or an agent can see it is unchanged and was never undone.

**People served, 27 Sep 2026: #130, merged on her word, her five rulings on the proposal.** For a
water supply project (C-11 or C-19) he asks how many people or households it serves, after the
stage and before he routes, and logs a whole count and its unit as said. R1: households travel as
households and are never converted on this site; the conversion lands in Calvin's brief, from the
UN household size now in `carried/`. R2: the primer line "Rough people counts and the technology
wait for the Quantify step" was wrong and is replaced by the true rule — type, technology and
people served come from the visitor's description and answers; whatever is still missing when they
reach Calvin, Calvin asks. R3: C-11 and C-19 only, after the stage. R4: a People served row on the
rail, and `record.served` on the seal, which production ignores until its storage is carried (item
O14). R5: Phoebe reads the same record line. His prompt's repeat of the visit block's own lines was
cut to make room; 26,073 at merge, under the unchanged 26,199.

**Ruled 23 Sep 2026; built 24 Sep 2026; the save-door patch 25 Sep 2026; people served 27 Sep 2026.
Bucket BONES.**

#### A17. The handoff goes both ways — forward and back

**Logged 21 Sep 2026 from the maintainer's walk of pull request #97, at eyeball stop 4. Built
26 Sep 2026, #128, merged on her word; the four rulings of its proposal approved as written.** Her
ruling, in her words:

> The handoff both ways, forward and back.

**Where it stands today.** Forward is built: Wellington hands the visitor to a step, and from
21 Sep 2026 Phoebe hands back by a field — `handBack`, drawn as the way back to him on Dispatches,
or to the shelf on the Commons (item A15, step 4). What is not built is his side of the return:
he does not read what she found, so a visitor who walks back arrives to a colleague who does not
know where they have been. That gap is named under item A15 as "Wellington reading the record's
eligibility section", and this row is the maintainer's word that the round trip — not the one
field — is the thing to build.

**What the round trip has to carry.** Her verdicts, as the record's eligibility section, which
already travels; what is still open; and enough for him to greet the visitor knowing what she
found, in his own words, never as a recital. Rule zero and the agent-phrasing ruling of 3 Sep
2026 both apply.

**What was built, #128.** Each ask to him carries her worksheet as row ids and states only, read
into a "What Phoebe found" note after the cache breakpoint: each pathway's read, and any Blocked or
still-open row by id and its title from the tool file. A pathway she has not looked at yet reads not
enough known. The desk sends him one turn the first time the visitor comes back from her, so he
greets them knowing it. A route to Quantify becomes "none" when every pathway reads likely not or
does not apply. His prompt is 25,894, under the unchanged gate of 26,199. Bucket BONES.

#### A18. A specialist is a guide, not a gate — the readiness read, the cited routes, and the door to a person

**Ruled 23 Sep 2026 from the maintainer's review of Phoebe's applies cards, before she graded
them.** Her findings 2 to 5, in her words, are the fifth ruling under *Pace and posture* in
[AGENT_RULES.md](./AGENT_RULES.md), which is the rule's one home. This row is the work's home.

**What it replaces.** The hard gate of 20 Aug 2026 — six absolute criteria, no partial credit —
is struck and corrected in place at the head of `eligibility-cards-vwba.md`. The guidebook's own
Figure 3 loops a miss back to the implementer before it ends in "not eligible" (VWBA 2.0, Step 2.3,
p. 19), so the source carries the change. The three row states of `criteriaState.ts` and the
relay's worksheet reader become five when the build lands. Until then nothing runtime changes: a
criterion not met is "Not yet" with a route forward, and Phoebe's prompt says so in the corrected
paragraph she reads.

**The proposal, `PROPOSAL_guide-not-gate.md`, untracked at the root, and her rulings on its §10,
23 Sep 2026: R1 to R9 yes as proposed**, with three riders in her words:

> R8: print a grade-6 target, not enforced. The Blocked colour is the interim one until my pixels.
> The carbon "no" list also goes to the reviewer as Q11 (note it for the paid side).
> project-types.md follows the roster rule: drafted here, carried by my hand, the paid repo
> becomes its source.

**What the build holds, in the proposal's order.**

1. **Five row states**: Not yet checked, Met, Fixable with a cited route, Unknown with what to find
   out, Blocked. Blocked only where the card's **Can it be fixed?** line says *no*, or *depends*
   after the visitor declines the design change. The first "no" list is in the proposal's §4.1,
   for her grade with the cards; **the carbon part of it also goes to the reviewer as Q11**, her
   word, a paid-side note carried by her hand (item O14).
2. **The readiness read per pathway**: likely eligible (every row that applies is Met), likely
   not (any row Blocked), not enough known yet (anything else, with the list). Shown on the Tool
   tab, the desk row and the seal. "Likely" because nothing here is verified.
3. **Routes cards**, one cited fix per common gap: nine for the water pathway, nineteen for
   carbon, resting on the guidebook, the methodology and the documents it names as binding, or one
   real published project. One is held today — LimnoTech for Meta, *Volumetric Water Benefits: 2023
   Report*, 25 June 2024, the Navajo Community Water Supply project, pp. 25–26. A gap with no source
   gets no card. Item K3 is where more reports arrive, by her hand.
4. **Unknown is not a fail.** For an unknown baseline or survey she names the cited route (the
   methodology's Baseline Scenario Survey and Gold Standard's questionnaire workbooks; the
   guidebook's Appendix E) and offers the save door.
5. **The door to a person**: rung 3 of the abstention ladder, live for the free site through the
   save door that already exists (item S7), with two fields on the seal, `wantsHuman` and a short
   note in the visitor's words, and a consent line that says what happens. Production builds the
   receiving side. Item S20's form stays the Commons door.
6. **A reading-grade figure** printed by `check-cards` for every route card and plain-words line,
   against a grade-6 target, not enforced. Her rider on R8.
7. **The Blocked colour** reuses `--state-pending` with the word "Blocked" until her pixels; a
   raise for the brand book's §2.5, which has no stopped state that is not an error.

**Sequencing (R9).** The rulings into the record first, then the types file (item A16), then the
fixability line on every eligibility card and the two routes files, each at her grade; then
Wellington's runtime on its own; Phoebe's runtime inside item K7's pull requests C and D so the
worksheet, the record, the seal and the prompts change once. One contract change for production,
told once, covering K7's per-pathway rows and this item's fields; on item O14's list.

**A third ruling under this item, 23 Sep 2026, canon for every agent**, recorded in her words
under *Pace and posture* in AGENT_RULES.md: wherever Phoebe shows a Fixable or Unknown row, she
also says, as a fact she phrases, that WaterBots is building tools and resources on the paid site
to help implementers do exactly these fixes, and that they can save their project and sign up for
updates and access; the same line goes on the save door's copy. A fact, never a sales line; said
there and nowhere else. It reaches her prompt and the save door with this item's build, and
production's side of the door is a carry on item O14. **A companion fact for one case, the same
day:** on carbon applies card T4, for a transitioning project, that a transition-assistance module,
overseen by trusted consultants, is coming to the paid site and the visitor can save the project
and sign up for access; on the card, in the rulebook beside the tools line, and on item O14.

**Her addendum, 23 Sep 2026, ruled "then build"**, recorded once in the guide-not-gate proposal's
addendum and summarised here. (1) **Every eligibility row gets a phase tag**, *To start* or *To
remain eligible*; a planned project's readiness read counts *To start* rows only; the *To remain*
rows show together as one preview block, opened by a fact Phoebe phrases, in her words: "routine
reporting is the critical part of impact funding, which means ongoing access to the project and
its data, data systems, staff, and good relationships with stakeholders and legal owners;
WaterBots supports this with tools and resources as each phase requires them." She may ask one
feasibility question about that readiness, and one answer settles every *To remain* row it can;
never a mark against a planned project; a running or transitioning project gets every row; where
the water pack's ten considerations already cover it, they are cited — B-1, B-2, B-3, B-5 — one
home. (2) **Wellington asks the stage** — on paper, being built, already running — and logs it
with the type, each standard's start-date definition cited (item A16). (3) **Phoebe frames from
the stage**: already running means carbon is hard to certify after the fact, the retroactive rule
cited (101 v2.1 §4.1.42, §4.1.49, §5.1.37), look at VWBA, which is open to a running project
(Step 3, p. 21; criterion 6, p. 33; Step 6, p. 27; Glossary, p. 66) subject to criterion 4.
(4) **The human door fires once on any Blocked project**: save and send to the WaterBots team,
yes or not now. **Built now:** the tags on all 23 approved cards and the fifteen drafted ones;
an *engineer's rule* on what "to remain" means, which **stands as written, her word of 23 Sep 2026,
later**. The rest builds at the steps the addendum names.

**The tags moved to the navigation's phases, 23 Sep 2026, later still** — `PROPOSAL_phase-tags-by-nav.md`,
graded her way on every ruling: *To start* retired; each row carries the phase where it is acted
on; the Eligibility-phase rows are the free screen, asked on this site, both pathways, with the
readiness read on them (3 water, 8 carbon, P2 settled by the test); every other row shown once,
grouped by phase with the seat that helps there, never asked; the Monitor group takes the addendum's
preview block and its fact; Communicate shows as an honest empty group; the cap to thirty; the
prompt rule of that proposal's §6 for her runtime. Applied to all 38 cards the same day. Item K11's
"Partners phase" is answered by the Partners group and is closed into it below.

**Where it stands, 23 Sep 2026, later.** Stop 3 passed: both drafts graded "ships as written",
criterion 4 stays *depends*, R-8 ships with the Meta line, its title confirmed by her. The six
**Can it be fixed?** paragraphs are on the cards in `vwba-2.0/cards/eligibility-cards-vwba.md`,
reaching Phoebe's prompt (measured run on the pull request); the nine routes are
`vwba-2.0/cards/routes-cards-vwba.md`, read by nothing yet. Both drafts' notes are in
`grader-notes.md`. The six applies cards' "If the answer is no" sections are redrafted under this
rule at the root, untracked, for her grade with K7's stop 1. Nothing runtime is built.

**Built 25–26 Sep 2026, step 3 under V1's done line.** #122 the water pathway on its tool file,
the five states and the read; #124 the carbon pathway, staged by pathway state; #126 the door to a
person. On #126, by her word the same day: a ticked save sends one email to hello@waterbots.ai —
name, place, type, stage, each pathway's read worked out on the server, its Blocked rows with the
card's reason, the note, and a line that the project reaches the paid site at sign-up and the team
replies from there; no visitor contact. Resend over HTTPS; the key is the hosting secret
`RESEND_API_KEY` and waterbots.ai is verified with Resend, both hers to set. Until both are set, a
ticked save is refused and says so. If the email fails, the save is taken back. The seal carries
`wantsHuman` and `humanNote` only on a tick; production's side is on item O14. The Blocked colour is
still the interim one until her pixels, and the grade-6 figure is not built.

**Ruled 23 Sep 2026; built 26 Sep 2026. Bucket BONES until swept.**

#### A19. Wellington's prompt measures 26,117 on `main`; BUILD_PLAN says 26,108

**Logged 30 Sep 2026, from the maintainer's word. Cause found at the 30 Sep close-out; the item stays until the sweep.**

Measured on `main` on 30 Sep 2026, before and after pull request #134: his system prompt is
**26,117 characters**. BUILD_PLAN.md records **26,108** "after the build-update refresh at this
close-out" (27 Sep 2026). The difference is nine characters. The gate is unchanged at 26,199, so
the prompt is under it either way and no check trips.

The measurement was the length of `WELLINGTON_SYSTEM_PROMPT` as `scripts/check-wellington.mjs`
loads it. Pull request #134 touched no file that feeds it, so the nine characters were already on
`main`.

**Found at the 30 Sep 2026 close-out.** The 26,108 was the 27 Sep figure. The 29 Sep close-out's
build-update refresh (b69d4f5) lengthened the generated build-update module by exactly nine
characters, 572 to 581, and BUILD_LOG's 29 Sep entry recorded the resulting 26,117 correctly. Two
live lines, in BUILD_PLAN.md and CLAUDE.md, had kept the older figure and are corrected. The 30 Sep
refresh shortened the region, and his prompt is now **26,043** against the unchanged gate of 26,199.

**What "done" looks like:** at the next close-out, measure the prompt, say which change added the
nine characters, and write the measured number into BUILD_PLAN.md and CLAUDE.md so the two agree.
The gate does not move; report a trip and propose a number, as the rule says.

Logged 30 Sep 2026; found the same day. **Open until the sweep, bucket BONES.**

#### O11. OPEN_ITEMS.md is heavy and wants an archive

**Flagged 30 Aug 2026, under the maintainer's ruling that the opening reads stay thin, forever.**
That ruling says plainly that a growing opening document is a defect and that an engineer who
notices one says so.

**This file is 1,900-odd lines and grew by about 300 in one session.** It is read at the start of
every session, and a good part of it is items that are closed and finished: O2, O3, O6, O7, S4, S8,
and the settled halves of A2, A3 and A4.

**What the ruling prescribes:** sweep closed items to an archive file. A closed item is finished; it
earns a pointer and a home elsewhere, not a place in a document read at the start of every session.

**Sweeping is ordinary tidying and needs no ruling.** It is logged rather than done because it was
noticed at a close-out, and moving a third of this file is not a thing to do in the last ten minutes
of a session. **What does need a decision is nothing** — the families stay as they are; only closed
rows move.

**What "done" looks like:** an archive file holding the closed items in full, each with its dates and
its reasoning intact, and a one-line row left behind in the index table here pointing at it. Nothing
is summarised away in the move.

##### The first sweep — done 30 Aug 2026

**Six items moved in full to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md):** S4, S8, O2, O3, O6
and O7. Each keeps its dates, its measurements, its wrong turns and its corrections; **nothing was
summarised away**, which was this item's own test for what "done" looks like.

**Each leaves two things behind.** A one-line row in the index table above, pointing at the archive,
and a short stub where the item stood, saying when it closed and where it went. An item cannot be
lost by being finished.

**What it bought:** this file fell from **2,173 lines to about 1,850** in the same session that
added the version 4 raises, so it ends the day shorter than it started despite growing. The archive
is **not** one of the ~~six~~ four opening documents and is never read at the opening.

**The settled halves of A2, A3 and A4 stayed put**, and that is deliberate rather than an omission.
This item named them as candidates, but each sits inside an item that is still live — A4 in
particular says plainly that its cause was *not the only one* and points at A6. **Splitting a live
item's insides is more than ordinary tidying**, and the ruling that licenses sweeping licenses
moving *closed items*, not editing open ones. It is left for the maintainer to say whether those
items should be split at all.

**Item O10 closed the same day and was not swept.** A freshly closed item is worth leaving in place
for a session, where the next reader will look for it. It is the obvious first candidate for the
next sweep.

**The families did not change**, exactly as this item predicted: only closed rows moved.

##### The second sweep — 2 Sep 2026

**Item O10 moved in full**, the obvious candidate the first sweep named. Three items joined the file
the same day — K6, K7 and S11 — so the file did not get shorter, and it stays over 2,000 lines. The
next candidates are the settled halves the first sweep declined to split, which still need the
maintainer's word.

##### The triage — logged as the next brief, 17 Sep 2026

**Flagged again at the open of the root-tidy sitting of 17 Sep 2026:** this file stood at
2,855 lines and 176 KB, read at the start of every session. The maintainer's word at the close of
that sitting: *"Not in this batch: the OPEN_ITEMS sweep. Log it as the next brief. I want that list
triaged, not just swept."*

**What that asks for, as read here and hers to correct on the proposal.** A sweep moves closed rows
to the archive and touches nothing open. A triage reads every open row and gives it a state: still
open and why; closed and swept; folded into another item; or split, where an item carries a
settled half and a live half — the settled halves of A2, A3 and A4 that the first sweep declined to
split without her word. Families stay as they are unless the triage shows they are wrong, which is
her decision under the families rule. The archive now lives at
[docs/OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md).

**Proposal first; nothing is moved until she says go.**

Logged 30 Aug 2026, **first sweep done 30 Aug 2026, second sweep done 2 Sep 2026.** Open as a
standing habit — ~~the next sweep runs when this file gets heavy again~~ **the triage is the next
brief, 17 Sep 2026**.

##### The triage — done 18 Sep 2026

**The maintainer's go, 18 Sep 2026, on the sort proposed the same day.** Every open row was put in one of five
buckets — BONES, WALKTHROUGH, PARTNER, PARK, CLOSE — defined once under *Families* above and shown in
a new column of the index table. Eighteen rows closed and were swept to
[docs/OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) in full, each with a dated line saying
why: K4, K5, K6, K8, A2, A3, A4, A7, A8, A9, A11, S2, S3, S9, S10, S13, O5, O8. Two of them needed
a ruling first — A7's benign reading was accepted, and O5's rule went into the process rules before
its record left. Every moved item's text was checked verbatim against the archive.

**Orphans adopted.** Eight threads had lived inside other items with no row of their own. Two became
rows: item A12 (the two chats not built) and item O14 (carries by the maintainer's hand). Three
folded into rows that already existed: the dock copy saying "console" into O13, the rail-width
rider into S5, Route C into O9. Three stay where they were, named: the typeable controls under S11,
the diagnostic switch under A6, a path per Commons pack under S18. Pairs named: A4/A6, A11/S15,
S5/O4, K2/K7, S12/S14, and the three rows waiting on real usage.

**Three rows added from her brief, all BONES:** A13 (one roster), K9 (Calvin's and Bridget's packs
to the new shape), K10 (Phoebe ready for Deb's rig).

**What it bought:** the opening read fell from 2,881 lines to the figure in the build log of
18 Sep 2026, with nothing summarised away. The proposal file, `triage-2026-09-18.md`, was untracked
and is deleted after the merge. The families did not change.

Logged 30 Aug 2026; first sweep 30 Aug, second 2 Sep, **triage and third sweep 18 Sep 2026.** Open as a
standing habit — the next triage runs when this file gets heavy again, on her word.

### Part B — BUILD_PLAN's "Previously" sections, and the stale "next" section, as they stood on 3 Oct 2026

Twenty-six sections moved out of BUILD_PLAN.md whole, in the order they stood: twenty-four whose headings
begin "Previously" (one of them "Previously planned next — the hero chat, when its reference arrives", wholly
stale), "The K7 brief as it was given", and, also wholly stale, "Building next — the hero chat, when its
reference arrives". BUILD_PLAN.md now holds the compatibility goal, "V1 — the done line" and "Family
work". Headings are demoted two levels; the words are exactly as they stood, strikes included, as the
history of their day.

#### Previously — the specialist contract, Phoebe first (item A15)

**20–21 Sep 2026. Four pull requests merged on her eyeball: #93, #94, #95 and #97.** One brief, one
batch approved 20 Sep 2026: steps 0 to 6, four pull requests, four eyeball stops, all four passed.
Her ten lines, her words, live once in AGENT_RULES.md under "The specialist contract"; each pack
README carries a ten-row table of where its agent stands. Item A15 in
[OPEN_ITEMS.md](./OPEN_ITEMS.md) is the work's home and holds her rulings.

- **Step 0 (#93):** the contract into the rulebook, line 10 added the same day, where the project
  context is at each door, ten-row tables on Phoebe's, Calvin's and Bridget's pack READMEs.
- **Step 1 (#94):** the grader notes left Phoebe's card files for `cards/grader-notes.md`, 155
  lines carried whole; her prompt 10,811 characters shorter. Line 6 to yes.
- **Steps 2 and 3 (#95):** her tool from her pack's `tool/README.md`, generated into her prompt;
  her level, held to the roster; Wellington named as her lead; the six worksheet rows travel with
  every ask and come back as "What the worksheet shows". Lines 2, 3, 7 and 10 to yes.
- **Steps 4 to 6, and her rulings at eyeball stop 4 (#97):** her answer carries `handBack`, checked
  against a closed list, drawing the way back to Wellington or the Commons shelf. Line 8 to yes.
  Her prompt walks the six rows in the manual's order, one row, one question; a "Worksheet: 3 Met ·
  0 Not yet" line draws under any turn that moved a row. Lines 4 and 5 to yes. The A6 diagnostic
  instrument left both relays — `api/phoebe.ts` and, on her word at the walk, `api/wellington.ts`
  too — with `check-wellington` holding it out of each. Her scope reached her as facts she phrases,
  never a sentence to repeat: eligibility under VWBA 2.0 today, carbon coming and not live, one
  pathway does not mean eligible everywhere. One capture, of her saying that scope in her own
  words, in `captures/2026-09-21-phoebe-scope-water-only.png`.
- **Three measured runs, all zero empty in sixty**, within her bar of 1 in 60 (ruling R4). One full
  walk: six verdicts in seven turns, order kept six of six, one question a turn, hand-back set at
  the end. `scripts/measure-phoebe.mjs` and `scripts/measure-phoebe-walk.mjs` are the instruments,
  run by hand, never a gate; the method is written into the pack's `evals/README.md`.
- **Where each contract line stands, 22 Sep 2026:** 1, 2, 3, 4, 5, 6, 7, 8 and 10 read yes; 9 is
  partly — her verdicts reach the record, but no agent on this site reads them back yet.

**Named, not built, and three logged as their own items from her walk at stop 4.** Wellington
reading her verdicts and greeting the visitor back knowing what she found — **item A17**, the
handoff both ways. Wellington never asking "water or carbon" at the door — **item A16**, which
pathways apply is Phoebe's to find. Her second pack, `gs-paa-v2.0`, in the pack shape beside
`vwba-2.0`, with a cited "does this apply" test on every pack — **item K7, expanded**. Calvin's and
Bridget's briefs, on the same ten lines, come after Phoebe's carbon pack; their own item, moving their
packs to the new shape, is item K9.

The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).

#### Previously — a guide, not a gate (items A18 and A16)

**Built by 26 Sep 2026**: item A16 with step 2 (#119), item A18 with step 3 (#122 to #126). What
follows is how it stood on 23 Sep 2026.

**23 Sep 2026. Pull request #100 merged on her word, the types file moved into the shared pack on
`feat/project-types-shared` (pull request open), and the two drafts for stop 3 at the root.** Her
five findings from reviewing Phoebe's applies cards became `PROPOSAL_guide-not-gate.md`, untracked
at the root, and her rulings on its §10 the same day were R1 to R9 yes as proposed, with three
riders: a grade-6 target printed and not enforced; the Blocked colour interim until her pixels; the
carbon "no" list to the reviewer as Q11, a paid-side note; and `project-types.md` on the roster's
rule, drafted here, carried by her hand, the paid repository its source.

- **Pull request 1 (#100), merged 23 Sep 2026:** the fifth rule under *Pace and posture* in
  AGENT_RULES.md, her words; the hard-gate design decision of 20 Aug 2026 replaced at the head of
  the eligibility cards, its old wording kept in the water pack's CHANGELOG; two measured runs, both
  zero empty in sixty; items A16 and A18; three carries on item O14. **And her canon of the same
  day: no crossed-out text in any live document** — PROCESS_RULES rewritten, the old rule's wording
  opening `docs/archive/CORRECTIONS.md`, every strike this batch made replaced, a Cleanup family
  started with item C1 for the older strikes, and item S21 logged.
- **Step 2, graded "ships" with one citation edit:** `project-types.md` lives in
  `knowledge-packs/product-shared/` from 23 Sep 2026, approved, on the roster rule; nothing reads
  it yet. Shared pack 0.4.0, tree 0.7.0.
- **Step 3 and the water half of step 4, graded "ships as written" and in the pack, 23 Sep 2026
  (#101 merged; the move on `feat/water-routes-into-pack`, pull request open):** the six
  **Can it be fixed?** paragraphs on the water cards, criterion 4 *depends*; the nine routes as
  `routes-cards-vwba.md`, R-8 with the Meta line, its title confirmed by her. Water pack 0.5.0,
  seat 0.6.0, tree 0.8.0. The paragraphs reach Phoebe's prompt; measured run on the pull request.
- **A third ruling the same day, canon for every agent:** wherever a Fixable or Unknown row shows,
  the visitor is told, as a fact phrased, that WaterBots is building tools and resources on the paid
  site for exactly these fixes, and can save the project and sign up; the same line on the save
  door. In AGENT_RULES.md under ruling 5; production's side on item O14.
- **The six applies cards passed as redrafted, 23 Sep 2026 (#102 merged), and are in their packs**
  with one addition on T4 in her words, the transition-assistance fact; carbon pack 0.2.0, water
  pack 0.6.0, seat 0.7.0, tree 0.9.0. Read by nothing until K7's step 5.
- **K7 stop 2 passed, 23 Sep 2026 (#103 merged, then this batch):** M1–M17 approved with her two
  conditions met and moved into the carbon pack. **Her addendum the same day, "then build":** phase
  tags on every eligibility row, the stage question for Wellington, Phoebe framing from the stage,
  the human door once on a Blocked project — recorded in the proposal's addendum and under items
  A18 and A16. **Built now:** the Phase line on all six water cards and all seventeen carbon cards
  (measured run on the pull request); K7 step 4, the fifteen framework cards, drafted at the root
  with tags (#105, merged). **K7 stop 3 passed the same day:** the fifteen appended to the carbon
  pack, all 32 rows in one file; the tag rule stands as written, her word; item K11 logged for a
  third tag, "Partners phase", not built. **K7 step 4, carbon half, drafted:** the nineteen carbon
  routes at the root, untracked, for her grade. On `feat/carbon-routes`, pull request open.
- **The phase-tags proposal graded the same day, all five rulings her way:** the tags as proposed
  (R1), the free-screen count of 3 water and 8 carbon rows (R2), **the cap to thirty** (R3), the
  Monitor group takes the preview block (R4), Communicate shows as an honest empty group (R5). The
  tags applied to all 38 cards, the cap moved in code and in every document that stated it, the
  desk's build note and Wellington's dated build-update fact built, the close-out ritual's step 8
  added. On `feat/phase-tags-cap-build-note`, stacked on the carbon routes branch (#106), pull
  request open.
- **Next:** the order under *The next order* above, once #106 and this pull request land.

#### Previously — Phoebe's carbon pack (item K7)

**Built by 26 Sep 2026**: the cards and tool file by 24 Sep, her runtime with step 3. What follows
is how it stood on 22–23 Sep 2026.

**22 Sep 2026. Proposed, ruled, and steps 1 and 2 built on `feat/k7-gs-paa-pack`; merged as #99 on
23 Sep 2026 on her word. Stop 1 passed the same day: both applies sets approved and in their
packs. Stops 2 and 3 passed the same day: all 32 carbon eligibility cards approved and in one file.
The nineteen carbon routes drafted at the root; her grade of them is the next stop.**
**23 Sep 2026: the row model of its §4.1 and §9.2 is superseded by the guide proposal above; the
cards, the tests and the steps stand.** The proposal, `PROPOSAL_K7_gs-paa-v2.0.md`,
untracked at the root, read the sources at three layers and found 32 basic eligibility
requirements, each cited; it proposed one card and one worksheet row per requirement, a cited
"does this apply" test per pack, one tool with two sections, and nine steps in four pull requests.
Her rulings the same day: R1, R2, R3, R6 and R7 yes as proposed; **R4 yes, with this: questions
are written to cover both pathways whenever one answer can, a verdict covers every row the answer
settles, and when a pathway drops out she says so and continues with the other; R5: the cap stays
at 20, revisited after the first real walk.** Item K7 keeps her words.

- **Step 1, built:** the pack scaffold `knowledge-packs/phoebe-eligibility/gs-paa-v2.0/` in the
  ruled shape, not live, nothing reads it; every Gold Standard canonical page confirmed, twelve
  pages for fourteen documents; seat and tree READMEs and changelogs bumped; the water pack's
  README corrected to point at its sibling. Docs only.
- **Step 2, built:** six applies cards, four for the carbon pack and two for the water pack, as
  `applies-cards-gs-DRAFT.md` and `applies-cards-vwba-DRAFT.md` at the root, untracked, for her
  grade. **Eyeball stop 1.**
- **Next, on her grade:** steps 3 and 4, the 32 eligibility cards drafted in two sittings for her
  grade (stops 2 and 3); then pull request B, the pack-keyed reader and gate; C, the worksheet and
  the record; D, Phoebe's prompt and the measured walk. Nothing beyond step 2 is started.

#### The K7 brief as it was given — proposed and ruled 22 Sep 2026; see above

Her ruling at eyeball stop 4, 21 Sep
2026: the carbon card pass drafted from the two Gold Standard PDFs, graded by her, becomes her
second pack, `gs-paa-v2.0`, in the pack shape beside `vwba-2.0` — `cards/`, `tool/`, `evals/`,
README, CHANGELOG — with a cited "does this apply" test on every pack, including `vwba-2.0`, so she
knows which worksheets to fill and reports each pathway on its own, never merged into one verdict.
The card pass comes first; there is no pack without cards. Items A16 (Wellington never asks "water
or carbon") and A17 (the handoff both ways) are the same work seen from his side, and come after —
his prompt and route list are not touched by this brief.

#### Previously — one roster

**18 Sep 2026, second sitting. Pull request #91, merged the same day on her eyeball.** One brief, item A13. A
build-time check, one word changed on screen, and docs. No new chat, seat or Meet-level page. No
primer change; both generated prompts byte-identical.

- **`roster.yaml` is the one crew list**, carried by the maintainer's hand from production into
  `knowledge-packs/product-shared/`, committed as carried, never edited here. Ten seats, three
  doors, the levels each door allows, and whether each seat is built there.
- **`check-roster` runs in front of every `npm run build`.** It holds `src/lib/crew.ts`, the
  Commons shelf, the primer's crew facts and Wellington's people sentence to the roster, and fails
  the deploy naming the file and line. Checked, not generated, by her go. "unconfirmed" passes.
  Absent seats and Ally are printed, never silent. A new `built` word is one row.
- **Bridget's card reads "Partners"**, the roster's seat label, on the desk and on the Commons.
  It read "Map"; the check found it, she ruled the crew file changes.
- **The other homes point at the file.** The shared pack README's table is struck. Pack 0.3.0.
- **Waits on her:** the confirmed free and Commons columns, carried in a new file; the roster's two
  "this repository" lines at the source. The two screen-host `role` lines are item A14, logged on
  her word at the merge, not fixed now.
- **Next brief, on her word.** Nothing is chosen here. The BONES bucket is the shortlist.

The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).

#### Previously — the OPEN_ITEMS triage

**18 Sep 2026. Two pull requests, stacked: #89 (item O5's rule into the process rules) and the one
that carries this close-out (the sweep, the buckets, the new rows); open as this is written.** Docs
only. No pack content. No runtime wire. No live-site UI.

- **Every open row has a bucket** — BONES, WALKTHROUGH, PARTNER, PARK or CLOSE, the maintainer's
  five, defined once under *Families* in OPEN_ITEMS and shown in a new column of its index table.
  Counts after the triage: BONES 10, WALKTHROUGH 2, PARTNER 3, PARK 17, closed 27 of 59 rows.
- **Eighteen items closed and swept** to `docs/OPEN_ITEMS_ARCHIVE.md` in full, each with a dated
  line saying why; verbatim checked. A7 closed on her accepted benign reading; O5 closed after its
  rule moved into PROCESS_RULES under "How work moves". OPEN_ITEMS.md from 2,881 to 1,804 lines.
- **Eight orphans adopted**: two new rows, A12 (the two chats not built) and O14 (carries by her
  hand, listed once); three folds into O13, S5 and O9; three named where they already sat.
- **Three new BONES rows in her words:** A13 (one roster, `roster.yaml` from production, checked at
  build; waits on her carry), K9 (Calvin's and Bridget's packs to the new shape, one brief each),
  K10 (Phoebe ready for Deb's rig: cards reviewed, engineer notes split out, exam questions signed).
- **Housekeeping the same day:** 29 merged local branches deleted; the one unpushed branch, all of
  it in main, deleted on her word; the triage proposal file deleted from the root after the merge.
- **Next brief, on her word.** Nothing is chosen here. The BONES bucket is the shortlist.

The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).

#### Previously — the root tidy, and the export step retired

**17 Sep 2026, second sitting. Three pull requests, stacked in order: #86, #87, and the one that
carries this close-out; open as this is written.** Docs and two moves. No pack content changed. No
live-site UI change. One real call to Wellington for the capture.

- **The export step is retired.** The project library syncs from GitHub, so hand-carried copies
  are no longer needed. Close-out step 6 is struck and dated in the process rules; item O8 is
  closed; the `exports/` folder and its ignore rule are gone. The close-out ritual now ends at
  the checkpoint commit and the `main` equals `origin` check.
- **The agent primer lives in the shared pack**, `knowledge-packs/product-shared/agent-primer.md`,
  on Phoebe's cards pattern: both generated strings byte-identical before and after, the
  generator's `Sources:` header the only change to the relay, six links climbing two levels, the
  checks green, one capture. Pack at 0.2.0.
- **The closed-items archive lives under `docs/`**, at `docs/OPEN_ITEMS_ARCHIVE.md`, beside
  `docs/archive/` and not in it; every link followed, 180 checked.
- **UI_REFERENCE.md is retired to `legacy/`.** The brand book governs design alone; CLAUDE.md's
  sentence is struck and dated.
- **Two small finds fixed on the way:** the README table's duplicate OPEN_ITEMS row, and the
  gitignore's dead "Calculator design ref" rule. Claude Code's per-machine settings file is now
  ignored by this repository's own rule.
- **Not touched:** the two untracked DRAFT card files; `captures/`, `Design refs/`, `legacy/`,
  `data-src/`, all kept, each with a live reader.
- ~~**Next brief, by the maintainer's word:** the OPEN_ITEMS triage, item O11. Not a sweep alone;
  she wants the list triaged. Proposal first.~~ **Done 18 Sep 2026; see Just finished.**

The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).

#### Previously — Phoebe's VWBA pack is the cards' one home

**17 Sep 2026. Pull request #84, merged on main.** A move, not an edit. Runtime paths changed;
no card wording changed but one link; no primer rewrite; no live-site UI change.

- **The pack is the home.** Both card sets live at
  `knowledge-packs/phoebe-eligibility/vwba-2.0/cards/`, moved with their history kept. Every
  reader followed: `src/lib/phoebeCards.ts`, `scripts/check-cards.mjs`,
  `scripts/build-prompt-modules.mjs`. The relay's generated copy was rebuilt; its two exported
  strings were byte-identical before the one link fix, and differ by that one line after it.
- **The new pack shape is the rule going forward, one pack at a time:** `<standard>/` holding
  `cards/`, `tool/`, `evals/`, `README.md`, `CHANGELOG.md`. Phoebe's pack is the first in
  it. The other packs stay as they are until their own briefs. Written in the tree README with
  the old lines struck.
- **The two pointer tools are gone**; their citation tables live once, on the pack README.
  Pack at 0.2.0, tree at 0.2.0.
- **Not touched:** Phoebe's prompt, the primer, screen code, and the two untracked DRAFT card
  files. The maintainer moves those by hand; their home is the cards folder once approved.
- ~~**Next brief, on the maintainer's word:** roster work. Not started.~~ **Corrected 17 Sep 2026,
  second sitting:** the root tidy came first, and the next brief after it is the OPEN_ITEMS
  triage. Roster work waits on her word.

Item K8 in [OPEN_ITEMS.md](./OPEN_ITEMS.md). The history of how it was done is in
[BUILD_LOG.md](./BUILD_LOG.md).

#### Previously — brand book §6: Calculator / Quantify is Calvin

**17 Sep 2026. Pull request #83, ~~not merged.~~ merged on main.** Brand book (gitignored) plus
the tracked note in CLAUDE.md. No pack content. No runtime wire. No live-site UI.

- **§6 live text:** Calculator / Quantify seat is **Calvin**, not Vector. Struck and dated.
  The book stays at version 4.2.
- **`--bot-vector` is not deleted.** `vector.svg` is not renamed. `calvin.svg` is already live.
- The brand book does not publish. This pull request records the ruling in CLAUDE.md;
  Amy carries the book by hand.

The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).

#### Previously — Vector leftover scrape / Calvin parity

**17 Sep 2026. Pull request #82, ~~not merged.~~ merged on main.** Docs only. No pack content. No
runtime wire. No live-site UI. No primer rewrite.

- **Live product copy already staffs Quantify as Calvin.** Primer, crew, `--bot-calvin`,
  `calvin.svg`, and `knowledge-packs/calvin-quantify/` were already Calvin. No second
  rename of map/GIS “vector” words. No paid `/api/agents` shim.
- **One class A leftover:** `src/styles/tokens.css` still said Vector *holds* the paid
  calculator seat. Struck and dated. Calvin is the only Quantify face here.
- **Class C left for Amy:** unused `--bot-vector` token (sits with unused paid-roster
  tokens); gitignored brand book still names Vector as the shared-crew Calculator.

The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).

#### Previously — leftover root debt: chat-format archive and live claims

**17 Sep 2026. Pull request #81, ~~not merged.~~ merged on main.** Docs only. No pack content. No
runtime wire. No live-site UI. No primer rewrite.

- **`CHAT_FORMAT_RULES_for_ShellB.md` left the root.** It moved to
  [docs/archive/CHAT_FORMAT_RULES_for_ShellB.md](./docs/archive/CHAT_FORMAT_RULES_for_ShellB.md).
  Language, citations, and agent speech still live in CLAUDE.md, CITATIONS.md, and
  AGENT_RULES.md. The file is the extraction record, not a live rulebook.
- **OPEN_ITEMS north star** no longer says only step 1 and part of step 2 exist, or that
  the Eligibility agent is in progress. Phoebe is live; Eligibility, Partners (the map),
  and Quantify are live. Families and open rows were not swept.
- **Eligibility grader note 4** no longer says Feasibility is not drafted. Those cards
  are live.
- **Brand book in the README** is version 4.2, matching CLAUDE.md.

The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).

#### Previously — stale session docs archived

**17 Sep 2026. Pull request #80, ~~not merged.~~ merged on main.** Docs only. No pack content. No
runtime wire. No live-site UI.

- **Root `SESSION_HANDOFF.md` is retired.** It moved to
  [docs/archive/SESSION_HANDOFF_retired_2026-09-17.md](./docs/archive/SESSION_HANDOFF_retired_2026-09-17.md).
  There is no live root handoff. **Do not recreate one.** Live state is this file,
  [OPEN_ITEMS.md](./OPEN_ITEMS.md), [BUILD_LOG.md](./BUILD_LOG.md), and git.
- **The design canon is archived** at
  [docs/archive/DESIGN_CANON_for_ShellB.md](./docs/archive/DESIGN_CANON_for_ShellB.md).
  The brand book still wins. It is not an opening read.
- **Opening reads are four:** CLAUDE.md, PROCESS_RULES_for_ShellB.md, this file, OPEN_ITEMS.md.
  Close-out no longer rewrites a handoff. BUILD_LOG stays not an opening read.
- **`knowledge-packs/` is live product knowledge**, not archive.

The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).

#### Previously — knowledge-packs tree scaffold

**16 Sep 2026. Pull request #79, merged on main.** Scaffold only. The site is not wired to the
pack tree. Copy is rewritten for the open rail. The word used for the road of phases is
**pathway**.

#### Previously — Wellington treats filled visit fields as known

**16 Sep 2026. Pull request #76, and that close-out.** Item S13: Wellington now sees the visit
record on every ask. The maintainer said stop this sitting; no follow-up until she pastes a brief.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).** This section says only what
is now true.

- **Filled does, name, place and kind count as known.** Wellington receives the same record Phoebe
  already got (`readRecord`), in his own block headed “What this visit already holds”. He may still
  ask for anything missing. Kind is still never in the URL.
- **The first carried turn is not blank.** A ref is written before that send, so URL facts reach
  him on the same ask that seeds the first bubble. Today's receiver is unchanged: URL facts still
  stamp the card; a question still seeds the first turn when present. Phoebe's block is unchanged.
- **The gate holds it:** `check-wellington` ~~(77)~~ **(87 from 16 Sep 2026)**.

#### Previously — landing facts into the visit card

**15 Sep 2026. Pull request #74, and that close-out.** Item S13's receiver grew optional facts.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).** This section says only what
was true then.

- **Optional `does`, `name` and `place` ride beside `?question=`.** On arrival the desk writes any
  good facts into the visit as chat provenance, strips those keys from the address with the
  question, and keeps today's first-turn path. Facts without a question fill the card only; no
  question is invented. Bad, empty or over-long fields are ignored whole, never cut, never toasted.
  Kind is not in the URL. ~~Wellington's chat was not rewritten: the card and Phoebe get the facts;
  he may still ask in chat for facts that were only in the params.~~ **Visit-aware from 16 Sep 2026,
  #76 — see Just finished.**
- **The sender's contract, for production to carry:**
  `https://map.waterbots.ai/?question=<≤500>[&does=<≤300>][&name=<≤80>][&place=<≤80>]`.
  Percent-encoded UTF-8. Omit empty keys. No kind. No provenance in the URL — this site stamps
  chat. Caps are the sender's job. The contract lives in `src/lib/carried.ts`.
- **The gate holds it:** `check-wellington` ~~(77)~~ **(87 from 16 Sep 2026)**.

#### Previously — the handoff receiver

**9 Sep 2026, second sitting. Pull request #66.** Item S13 built; item S12 parked by the
maintainer's word.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).** This section says only what
was true then; the contract line below was amended on 15 Sep 2026, #74.

- **A question carried in from the production landing lands on the desk.** The shell reads
  `?question=` from the address on arrival, cleans the address, opens Dispatches and hands the
  question to Wellington as the visitor's first turn, in a bubble. Nothing is kept. Bad or empty
  input is ignored with no error. The parser and the contract are `src/lib/carried.ts`.
- ~~**The sender's contract, for production to carry:** `https://map.waterbots.ai/?question=<text>`,
  percent-encoded UTF-8 the way `encodeURIComponent` writes it, at most 500 characters decoded, the
  first occurrence only.~~ **Amended 15 Sep 2026, #74** — see Just finished.
- **Ten a day per visitor**, under a counter of its own on Wellington's relay, on top of his thirty
  and never instead of it. The shape is the maintainer's ruling of 9 Sep 2026. A refused eleventh is
  told in plain words and the desk composer still works.
- **The gates hold it**: `check-wellington` ~~(60)~~ ~~**(77 from 15 Sep 2026)**~~ **(87 from 16 Sep 2026)** for the parser and
  the shell reading the address once, `check-cap` (36) for the counter.
- **The hero chat (item S12) is parked**, a later item, not built. The same receiver feeds it when
  it comes, because the shell holds the one conversation.

#### Previously — the agent screen

**9 Sep 2026. Pull requests #61 to #64, and that day's first close-out.** Item S16 built, closed and
archived; item S17 logged and parked.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).** This section says only what
is now true.

- **Every step is an agent screen**, built once in `src/screen/AgentScreen.tsx`: the agent's chat in
  the middle in bubbles, and tabs above it — Chat, always; Tool, when the agent has one; Knowledge
  pack; Credentials. The tab row wears the agent's colour, the active tab a step darker, bold and
  underlined in it, and the active crew card takes the same underline. "Next phase" sits at the
  row's right end on every step but Quantify, where the save button is the way on.
- **The desk** is Wellington's screen, Chat · Knowledge pack · Credentials. **Phoebe's** has her
  chat on her tint, the worksheet as Tool, her Knowledge pack assembled from the committed cards with
  the approval date read from the files, and Credentials honest that no exam has been sat.
  **Bridget's and Calvin's** open on Tool — the map and the calculator — with one plain line on the
  Chat tab and no composer; Bridget's pack is the map's two datasets and Calvin's the live method
  packs.
- **The right column is the crew with the save button on every step.** The three host docks and the
  old dock frame are gone.
- **Memory is never a tab.** It stays in the record on the left rail. The record's source shows only
  behind the (i), on hover, when a source is built into the rail; nothing does yet.
- **The B→A raise** — the agent screen as a §7 component of the brand book — and **the carry list
  for production**, every file with its path and what it needs on the other side, are recorded once
  under item S16 in the archive and wait on the maintainer's hand.

#### Previously — the canon and the look pass

**Second sitting of 8 Sep 2026. Pull requests #58 and #59, merged.** Item S16 logged.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).** This section says only what
is now true.

- **Four canon rules on pace and posture** bind every agent, in AGENT_RULES.md: short replies, one
  question at a time, every reply ends with the next step; "I don't know" is a valid answer; a
  planned project is normal and the criteria are things to do, not a quiz; status lines in a
  visitor's words. Phoebe and Wellington hold them as rules.
- **The desk after the look pass.** Wellington opens warmly and names the next step in words; the
  project name shows once, in the card; the record has three rows and its explainer behind an (i);
  the save button sits at the foot of the right rail, in view at laptop height; the phase names show
  at laptop width; next steps live in the right rail only; the map's line is one plain sentence; no
  intro paragraph above the conversation.
- **Every capture for the maintainer's eyeball goes inside the For Amy block as an image**, by her
  ruling; the rule is in PROCESS_RULES.md.

#### Previously — the bridge sender

**Session of 8 Sep 2026. Pull request #56, merged.** Item S7, closed and archived.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).** This section says only what
is now true.

- **The save row is the bridge.** "Save this project and sign up" is a button with a consent line
  under it in a first-time visitor's words. The click seals the visit — the four record fields with
  their source tags, the pin as ids, each criterion's state and way forward, each pack's answers as
  typed with the pack's own word and the worked-example flag — keeps it for one hour under a random
  ticket in the short-lived store, and moves the page to production's welcome with only the ticket
  in the address. Never a computed number, never the conversation. This site keeps no copy.
- **Production claims it once**, server to server, behind `BRIDGE_KEY`: 200 with the seal, then
  404; 401 for a wrong key. The key is checked first and in constant time.
- **Ten seals a day per visitor**, under their own counter. Anything beyond the contract refuses
  the whole seal. On a test copy the row says saving only works on the live site.
- ~~**The claim's right-key round trip on the live site is the maintainer's to run.**~~ **Confirmed
  by her own walk, 8 Sep 2026**: a screening saved from the live desk reached production.

#### Previously — the desk plan's three slices, one row, and the bridge's contract

**Sessions of 5–7 Sep 2026. Pull requests #50 to #54, all merged.** Items S11, S15, A11, S7.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md).** This section says only what
is now true.

- **The desk is the conversation, and the rail is the record.** Wellington asks for four fields in
  the order the seats need them — what it does, what kind, where it is, what it is called — and what
  he hears fills the record on the left, each field saying where it came from. A typed entry is
  never overwritten. The two typeable controls for "what it does" and "kind" are still owed.
- **One row is the navigation.** Dispatches first with a hairline after it, then the six phases;
  Eligibility, Partners and Quantify open this site's tools, the last three are named and quiet.
  The tab row is gone. Collapsed, the phases are rings (1) to (6) and Dispatches keeps its own mark.
  Item S15 offers the shape to production, later, by the maintainer's hand.
- **Bridget's row asks for the pin** once a place is known, from typing, from Wellington, or from a
  pin; a pinned basin fills it with the basin's published reading.
- **Phoebe's row closes the loop.** The record goes to her with every ask, as a block after the
  cache breakpoint, checked on the relay; her verdicts come back through the criteria to her row.
- **Agents say the six phase names as written**, point people at the step and never at a tab, and
  speak plain words — never "seat", "console", "dispatch", "rail" or "surface". Facts and rules,
  no scripted lines. The desk's composer is production's to the pixel.
- **The bridge's contract is ruled** (item S7), from production's proposal by the maintainer's
  hand: a button and a consent line; the visit sealed under a random ticket in the short-lived
  store for an hour — record fields with source tags, the pin as ids, the worksheet's states and
  ways forward, each pack's answers flagged, a timestamp; never a computed number, never the
  conversation; the visitor sent to sign-up with only the ticket in the address; a hand-over-once
  endpoint behind a key kept in settings. ~~Not built.~~ **Built 8 Sep 2026; see above.**

#### Previously — Wellington live on the desk

**Session of 3 Sep 2026. One pull request, on `feat/wellington-live`, open as this is written.**
Wellington's chat on Phoebe's proven pattern, the rule that agents phrase the roster's facts
themselves, and one conversation held by the shell. Items A8, A9 and S11.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md)**, which is append-only and is
never read at the opening. This section says only what is now true.

- **Wellington answers on the desk.** His own endpoint, thirty a day under his own counter, the
  reply floor, the retry rule and the timeout, all stated in code. Opus 5 at medium, for item A6's
  measured reason.
- **He routes; the console acts.** A route and what he learned come back as fields, checked against
  closed lists twice. A route is one action under his turn; what he learned fills the visit without
  ever overwriting a typed entry.
- **Facts and rules, not lines.** Every agent phrases the roster's facts itself. No prompt says word
  for word, and a check refuses one that does.
- **One conversation.** The shell holds his thread; the desk is a frame around it, and the hero
  chat, when it comes, will be another.
- **The standard-of-interest chips are gone.** The kind of project lives in his plain question.
- **A landing surface was built and rejected entirely.** Nothing of it shipped; item S12 records the
  confirmed shape instead.

#### Previously — the free desk, the production shape, and the carbon packs

**Session of 2 Sep 2026. Pull request #48, merged.** The console's fourth surface and its new
shape, the two carbon packs, and a look pass against the saved production pages. Items S11 and K6.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md)**, which is append-only and is
never read at the opening. This section says only what is now true.

- **Four surfaces, in the production shape.** One row across the top of the centre from
  7 Sep 2026 — Dispatches first, then six phases; three open this site's surfaces, three are named
  and quiet — and no tab row. The desk opens first.
- **Wellington's desk.** Project context, rows derived from the visit and never invented, and the
  save door to waterbots.ai as the last row, carrying nothing across. Wellington is Team Lead,
  extended and never forked; ~~his chat is on the paid site and the composer says so~~ **his chat
  is live on the desk from 3 Sep 2026**.
- **The visit lives in the shell.** Context, pin, eligibility rows and every pack's answers, kept
  for this visit only. A click on the map pins a basin.
- **Three packs in the slot.** The water pack and two carbon packs from one module — Gold
  Standard's safe-drinking-water methodology, legacy and Paris-aligned — differing in one cited
  input, with the transition delta as one line under the tabs. A pack's result is now figures with
  units and a headline; the surface knows no method.
- **Thirteen checks now, not twelve.** `check-gs-sdws` reproduces every recorded reference figure
  to four decimals and proves blank is never zero.
- **Production is canon for the console's shape.** Journey bar, ~~tab row~~ (removed 7 Sep 2026, item S15), row anatomy and the
  calculator's idiom were read from the saved pages and matched — the look only.

#### Previously — the Quantification step and its first pack

**Session of 1 Sep 2026. Three pull requests, #44 to #46.** The console's third surface, the first
screening calculator inside it, and Calvin taking the primer's third post.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md)**, which is append-only and is
never read at the opening. This section says only what is now true.

- **Three surfaces.** Basin map, Eligibility, **Quantification**. The rail says three.
- **The step is pack-keyed and knows no method.** Fields, gates, defaults, formula and arithmetic
  all come from the pack. Item S10.
- **One pack is fitted:** VWBA 2.0 · D-3 Volume Provided — household and community water supply,
  ex-ante, Option 3. Item K5. **Carbon screening is named on the tab strip and marked planned**; it
  carries nothing and is not clickable.
- **Everything the step produces is a screening estimate**, anticipated and never verified, with a
  consultant-review tag wherever it renders.
- **A blank without-project volume is never read as zero**, and no example anywhere subtracts one.
- **Calvin staffs it.** Plum `#5848A8`, a portrait in the house form, the primer's third post. His
  chat is not built and the panel says so.
- **The brand book is version 4.2**, §6 filled in with Calvin's row and two recorded exceptions.

**Twelve checks now, not eleven.** `check-vwba-d3` is at 68 and guards the arithmetic, the gates,
the formula, the tab strip and the primer's rendered pack list.

#### Previously — the return to the brand book

**Sessions of 29 and 30 Aug 2026. Eleven pull requests, #27 to #37, all merged.** The brand book
arrived on 28 Aug and this is the work of bringing the shipped stylesheet to it.

**The history of how it was done is in [BUILD_LOG.md](./BUILD_LOG.md)**, which is append-only and is
never read at the opening. This section says only what is now true.

**What the site is, after it:**

- **One light brand.** The dark theme and the theme switch are gone; there is one set of tokens.
- **Two grounds.** `--paper` `#F6F5FA` is the content canvas — the map and the worksheet. `--frame`
  `#FBFBFE` is the frame — top bar, rail, and both docks' ground. Content warm, frame lighter and
  quieter.
- **Three planes and no fourth.** The derived `--chrome` plane is retired.
- **The book's names and values** — neutrals as `--ink*`, the book's hairline and radii, three
  shadow tokens applied only to what genuinely floats.
- **Accent-tinted host panels.** Both chat docks and the legend carry their host's accent at the
  book's 5% fill and 25% border. Bridget is **Surf `#14C8D9`**, settled.
- **A basemap wash**, Slate at 13%, which is where the map's richness came from.

**The stress ramp is unchanged.** A ramp change was designed, machine-checked, walked and withdrawn
— the finding was that the map read flat because of the basemap, not the data. Item S9 carries it.

~~**Four rulings are owed to the master brand book by the maintainer's hand**, listed once in item
S9: the two grounds, the active nav item, the three shadow values, and Slate as a basemap wash.~~
**All four landed in version 4 on 30 Aug 2026** — §2.3, §2.3, §4 and §7. Item S9 records where each
one sits. **Driftwood was proposed and refused on the merits** and is struck from that list; §2.1
keeps the strike rather than erasing it.

**What the reconciliation found, kept short because item S9 is its one home.** The shipped surfaces
already matched the book in almost every value — the ten accents, both recorded spares, the four
neutrals, the hairline, the seven radii, the five states, the seven crew hues, the two grounds, the
active navigation item, the wash. **Two did not, and both are shipped:** the shadow values took the
book's §4 (pull request #41), and coral gained a darkened text value at 4.5:1 (#42).

**The second of those corrected the book rather than the site.** Measuring §2.5 showed that the
published live and approved text values did not reach the contrast the same sentence promises.
Corrected values were accepted and written into **version 4.1**, along with the new coral;
verification was measured and left alone. **Nothing here rendered wrongly** — neither value is used
as type on this site — so it was a proposal, not a fix.

**Version 4.1 is the only amendment written into the book from inside this repository**, on the
maintainer's explicit instruction, and it is the exception rather than a new practice.

**The design exploration leaves no artefact here, and that is deliberate.** Its outcome — the cool
end that was ruled, the hybrid that was built, and the finding that withdrew it — is recorded in
full in item S9. Maintainer's ruling, 30 Aug 2026: **the screenshots are not coming, because there
is nothing left for images to teach.** No folder waits for them.

#### Building next — the hero chat, when its reference arrives

**Building next, from 21 Sep 2026: pull request D of the specialist contract batch — ~~steps 4, 5 and 6~~
~~steps 5 and 6~~ step 6, one full walk at eyeball stop 4.** Steps 4 and 5 are committed on the branch,
21 Sep 2026, and wait there; the pull request opens with step 6. See *In progress* at the head of this file. The batch is approved;
nothing else starts before it lands.

~~**The OPEN_ITEMS triage is next, by the maintainer's word of 17 Sep 2026**~~ **Done 18 Sep 2026;
the next brief is hers to name, and the BONES bucket in OPEN_ITEMS is the shortlist.** Her word of
17 Sep at the close of the root tidy: *"Not in this batch: the OPEN_ITEMS sweep. Log it as the next brief. I want that list
triaged, not just swept."* The file was 2,855 lines and 176 KB when that sitting opened, flagged
in its Part 1 report under the thin-reads rule. What triage means beyond a sweep is hers to rule on
the proposal; item O11 carries the log. Nothing is built toward it until she says go.

~~**The bridge sender (item S7) is next**, by the maintainer's word of 7 Sep 2026, and it starts when
she carries three facts from production.~~ **The three facts landed and the sender shipped on
8 Sep 2026** (#56). Item S7 is closed.

~~**The phase-screens proposal (item S16) is next**, by the maintainer's word of 8 Sep 2026.~~
**Proposed, drawn, approved and built in four slices on 8–9 Sep 2026** (#61 to #64). Item S16 is
closed; its raise into the brand book and its carry list for production wait on the maintainer's
hand. **Item S17 is parked for a design session** and nothing is built toward it.

~~**The hero chat follows**, as below, and it still waits on the maintainer's reference file. Nothing
is built toward it until she says the file is in.~~ **The hero chat (item S12) is parked by the
maintainer's word of 9 Sep 2026 — a later item, not built.** Its receiver (item S13) did not wait
for it: it shipped the same day onto the desk (#66). ~~**What comes next is decided at the next
session's open.**~~

**Landing facts into the visit card shipped 15 Sep 2026 (#74).** Item S13's receiver now reads
optional `does`, `name` and `place` beside `?question=`. **No follow-up from this sitting** —
the maintainer's word of 15 Sep 2026: stop; do not open follow-up work unless she pastes a new
brief.

**The Agent Commons (item S18) is next, by the maintainer's word of 9 Sep 2026.** The proposal was
approved as written the same day, and slices 1 to 3 are approved: the pictures, the address and the
shelf, and open-one on the agent screen. ~~**Slice 1 is drawn** — three pictures at 1280 by 720, in
the pull request for her eyeball — and slices 2 and 3 build on her approval of the pixels.~~ **Slice 1
was approved on 10 Sep 2026 with one correction, dated 11 Sep by her: on the Commons an agent opens
alone — no crew beside it, no next steps, only the way back to the shelf and the sign-up door. Slice 2
is built, 11 Sep 2026: the address and the shelf. ~~Slice 3 is next, on the corrected shape.~~ Slice 3
is built the same day, on her eyeball, and two rulings on the shelf landed with it: short lines and
short document names on the cards, and no crew column — the shelf is the crew.** **Slice 3 merged
the same day (#70), and Commons v0 — slices 1 to 3 — is done.** Slice 4, Credentials fed by Deb's
rig, waits on his per-case file, the first of the three changes she takes to Deb herself; they are
listed under the item. The flag button, slice 5, is later.

**The Workshop (item S19) is logged for after slice 3, by the maintainer's word of 11 Sep 2026** — a
visitor makes an agent on the Commons, names it, picks its colour, hands it a knowledge pack, and the
same agent screen holds it. Free to try under a tight cap, then bring your own key, then a builder
subscription later; private until published, and publishing is reviewed by her first; every pack
saved in both shapes so it can sit the one public exam. **Not built. ~~The proposal follows slice 3.~~
Slice 3 has landed; the proposal is next, on her word.**

**"Connect with a human expert" (item S20) is logged the same day, at the close** — a button beside
sign-up on every Commons agent that sends a short contact form to WaterBots consulting, or to a
workshop agent's builder if the builder opted in. The conversation is never attached. **Not built;
two design questions wait on a session: the form's fields, and whether a builder's contact is public
or relayed through us.**

#### Previously planned next — the hero chat, when its reference arrives

**One family is queued and blocked.** The hero chat (item S12) is the next build and it waits on a
demo reference arriving in `Design refs/` by the maintainer's hand. Nothing is built toward it
until she says the file is in. Its receiver (item S13) waits on it in turn.

**The confirmed shape, for the record:** the production landing's question box hands a visitor to
this site with the question carried; this site opens the hero chat as its own full page, the whole
viewport the conversation, built to the reference; the console carry stays as built. Each shell
builds only its side.

**The other candidates, none chosen:**

1. **The carbon card pass** (item K7) — cards in Phoebe's format drafted from the two Gold Standard
   PDFs, graded by the maintainer, through the same pipeline as the VWBA cards. Logged as debt.
2. **Tightening Wellington's answers** (item A10) — logged as debt, not for now.
3. **Calvin's chat**, which would move the step's gates into his conversation. The largest, and not
   scheduled.
4. **A further method pack** — item K2 names the remaining candidates.
5. **Bridget's chat**, unchanged and still not scheduled.

**What comes next is decided at the next session's open.**
