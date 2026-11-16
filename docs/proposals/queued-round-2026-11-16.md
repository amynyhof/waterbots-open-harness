# Proposal — the queued round: build banner, Wellington's opening, reading level, one blue button, Register your interest

**Written 16 Nov 2026 for the maintainer. Proposal only: nothing is built.** It answers her message of 16 Nov 2026:
propose the queued round as its own pull request, separate from #174, which stays on hold until Calvin 0.3.0 is
out. One plan item joins BUILD_PLAN with this proposal: A29, "already earning Gold Standard credits?", passed to
Calvin as `creditedUnderV1`.

**Two of the five items are one line each in her message, and I found no fuller note of them** in this repository,
its branches or my own notes. For W28 and W29 below I say what I read them to mean; each has a question for her.

The build would be **one pull request, lane 3** (it touches `api/`, `scripts/` and the rulebooks), with captures in
the For the maintainer block. If she prefers, items 1 to 4 can go first and the form second, since the form is the
only one that stores anything.

---

## 1. W28 — a one-line build banner

**Today.** Above Wellington's chat on Dispatches there is a three-line paragraph, in her words of 23 Sep 2026: "This
site is under build. Look around: the agents and the free screening are being built so a visitor can find out
whether their project is a good fit for impact funding. Ask Wellington for a build update." It shows on the desk
only.

**My reading of W28:** one line, not three, and seen wherever a visitor lands.

**Proposed.**
- A thin strip directly under the site menu, on every page: the console's six steps and the Commons. One line, in
  quiet type, no colour of its own, no close button.
- The three-line paragraph on the desk is removed, so the banner is the only place it is said.
- Wording is hers (the S11 rule: one line in her words). A draft to start from: **"This site is still being built.
  Ask Wellington what's new."**
- On a phone the line may wrap to two; it never pushes the chat box off the screen.
- Wellington keeps his dated build-update fact; nothing in his prompt changes.

**Question for her:** every page, or the desk only? And her words for the line.

## 2. W29 — Wellington's opening line

**Today.** Dispatches is empty until the visitor types. Wellington's first words come only as an answer: he answers
what they said, says who he is and what the team does, then asks one follow-up (W19).

**My reading of W29:** Wellington speaks first, so a visitor who lands on the desk is greeted rather than met with
an empty chat.

**Proposed.**
- The first time Dispatches shows, and only when no question was carried in from the paid site's landing, the console
  sends him one opening turn, the way Phoebe's and Bridget's screens already do. No visitor bubble is added.
- He writes it himself, under his voice card: one or two short sentences, who he is and what the team does, then one
  question about their project. No fixed greeting, no script.
- When a question was carried in, nothing changes: he answers it first, as now.
- It counts as one of his thirty messages a day, like any answer.
- His prompt grows by about 150 characters (one rule for the opening turn). He is at 26,050 of 26,199 on #174's branch
  and 26,136 on `main`; I would trim first, as she ruled, and report the numbers.

**Question for her:** is this what W29 means? If W29 is instead a change to the words of his first reply, which words?

## 3. V1 — 3rd- to 6th-grade English in every voice card

**Today.** The voice cards say "two or three short sentences a twelve-year-old could read" (Wellington, Bridget);
Phoebe's base rules say "plain sentences a twelve-year-old could read". AGENT_RULES.md says "at or under a
sixth-grade reading level". Nothing measures it.

**Proposed.**
- **One rule, one home.** AGENT_RULES.md, *Speech*: "3rd- to 6th-grade English: short everyday words, short
  sentences, one idea each." The struck wording stays struck in place.
- **Every voice card says the same**, Wellington's, Phoebe's and Bridget's, in place of "a twelve-year-old could read".
  The prompts barely change in size.
- **A measured check.** A reading-grade count in `api/_reply.ts`, beside the length and card-word checks: the
  Flesch–Kincaid grade of each reply, from its words, sentences and syllables. Each relay logs a reply above the
  line, and the measured walks fail on it, as they do for card words.
- **The line is hers to set.** My proposal: a reply above grade 6 is logged; a walk fails if any reply is above
  grade 8, or the walk's average is above 6. A two-sentence reply gives a noisy grade, which is why I propose
  the average as the bar and the single reply only as a warning. Names, place names and the methodology's own terms
  (fNRB, VWBA) are left out of the count, so a correct name does not fail a reply.

**Question for her:** the two numbers (6 for the average, 8 for any one reply).

## 4. One blue button at a time

**Today**, a visitor can see three solid blue buttons at once:
- **Sign up**, in the site menu, always;
- **Save this project and sign up**, in the left rail, once something is on the record;
- **Meet Phoebe / Meet Bridget / Meet Calvin**, under Wellington's latest message, at a handoff.

(Calvin's calculator from the open core shows no blue button here: the core draws Save only when a host passes one.)

**Proposed rule:** at most one solid blue button on the screen. **The one next step wins**, in this order:
1. **Meet <name>**, while it is the latest turn on the step in view;
2. otherwise **Save this project and sign up**, once something is on the record;
3. otherwise **Sign up** in the menu.

Every other button keeps its place and its words, drawn quiet (outlined, no fill), as the chat chips are since P24.

**How.** One small function in the shell decides which button is blue from the visit and the step in view, and each
of the three asks it, so the rule lives in one place. A check holds it: for each case above, exactly one button is
blue. This also settles S29 and the last clause of S30 ("once Save shows, Sign up goes quiet"), which I would mark
done.

**Question for her:** the order. One alternative: Save always wins once it shows, and Meet <name> is quiet.

## 5. Register your interest

**Approved on 14 Nov 2026 (round 3, ruling 4)**, to be built as its own pull request after #173 merged. #173 has
merged. Restated here because the right panel changed since: it is now a quiet list with no links.

**What the visitor sees.**
- A page at `/interest`, under the site menu: name, organisation, email, "what interests you" (a short list: carbon
  credits, water benefits, partners and funders, the Agent Commons, something else), and a box, **unticked**, to agree
  that WaterBots keeps these details to contact them about the site.
- The way in: a quiet "Register your interest" link in the left rail under "Export screening report", and on the
  Commons each "Coming soon" row becomes "Coming soon · Register your interest", which opens the page with that
  module already chosen.
- After sending: one plain line saying it was received, and that they can write to hello@waterbots.ai to be removed.
  On a failure: a plain line saying it was not kept, and to try again.

**What is kept, and who sees it.**
- Each sign-up is one entry in this site's existing store (Upstash Redis, the `KV_REST_API_*` keys the daily caps
  already use), under its own list, with the date. **It has no expiry**, so she can count them over time (see the
  question below).
- A copy goes to hello@waterbots.ai through Resend, the way the team-review email already does (`RESEND_API_KEY`).
- **Who can see it:** people on the Vercel team with access to the store, and whoever reads the hello@ inbox. Nothing
  shows on the site, and nothing goes to the paid site.
- **Counting:** `scripts/count-interest.mjs`, run on her machine with the store's keys, prints the number of sign-ups
  and the number of distinct organisations, by interest. **It never prints a name or an email.**

**Guards.** A hidden field that only a robot fills (a filled one is dropped without a word); three sign-ups a day per
visitor, on the visitor counter the caps already use; every field checked for length; the box must be ticked, or
nothing is sent. The name scan and secrets scan run as always; the store's keys never enter the repository.

**Questions for her:**
- **How long are sign-ups kept?** "No expiry" was the approved plan. A retention period (for example 24 months) is
  the usual promise to make on a form that keeps names and emails, and the consent line would say it.
- The consent line's words, and whether the list of interests is right.

---

## 6. The plan item — A29, "already earning Gold Standard credits?"

Added to BUILD_PLAN.md with this proposal; built after Calvin 0.3.0, not in this round.

- **Why.** Calvin 0.2.0 shows a new project no carbon figure until a filed V1.0 fNRB is typed in (#174). Calvin 0.3.0
  is to take `creditedUnderV1`, so that a project never credited under V1.0 runs V2.0 alone, and only a credited one
  is asked its filed fNRB.
- **Who asks.** Phoebe already asks a registration question in the screening ("already registered with a standards
  body, or new?"). I propose her answer becomes a field she sets, yes, no or not sure, the way `closes` works, never
  read from her prose; the record carries it, the left rail shows it, and `src/lib/calvinProject.ts` passes it to
  Calvin. A visitor who skips Phoebe is asked by Calvin's own screen, if 0.3.0 asks; otherwise the field stays empty
  and Calvin says what it needs.
- **"Not sure"** passes nothing, so Calvin asks rather than assumes.
- **Question for her:** Phoebe, or Wellington with the other project facts?

---

## What would change, by file (for the build)

| Item | Files |
|---|---|
| W28 | `src/components/SiteMenu.tsx` or a new `BuildBanner.tsx`, `src/components/Desk.tsx`, `src/styles/base.css` |
| W29 | `src/App.tsx`, `src/lib/wellington.ts`, `api/wellington.ts`, `api/_wellingtonPrompt.ts`, `scripts/check-wellington.mjs` |
| V1 | `AGENT_RULES.md`, the three prompt files, `api/_reply.ts`, the relays, `scripts/check-reply-guard.mjs`, the measured walks |
| One blue | `src/App.tsx`, `src/components/SiteMenu.tsx`, `src/components/NavRail.tsx`, `src/chat/Transcript.tsx`, a check |
| Interest | `src/components/InterestPage.tsx`, `src/lib/pages.ts`, `api/interest.ts`, `api/_store.ts` (a list), `api/_teamMail.ts`, `scripts/count-interest.mjs`, `scripts/check-interest.mjs`, the Commons shelf |
| A29 | built later, after Calvin 0.3.0 |

Docs at the close: CLAUDE.md, BUILD_PLAN.md and AGENT_RULES.md, proposed for her review before they are committed.
