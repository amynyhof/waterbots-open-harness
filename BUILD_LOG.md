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
