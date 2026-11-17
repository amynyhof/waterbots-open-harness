# Proposal — a public supporters page for Register your interest

> **Approved as proposed, 16 Nov 2026, the maintainer's word on #176; built after #174.** Her answers:
> the **full name as typed** shows; **company is the form's existing organisation field**, shown
> publicly, not a new field; **role is required** when the box is ticked; **`/supporters`** and
> **"Supporters"** are right; the intro line is **"People who want water impact to be faster and fairer
> to prove."** Approving an entry is **one simple command she can paste into PowerShell** (section 4).
> Where the text below differs, her answers stand.

~~**Written 16 Nov 2026 for the maintainer. Proposal only: nothing is built.**~~ **Written 16 Nov 2026 for the maintainer.** It answers her message of
16 Nov 2026: a public supporters view for Register your interest, with an opt-in box "Show my support
publicly", optional comment, title and company, a role from a closed list, and **every public entry
waiting for her approval before it shows. Nothing shows or deletes on its own.**

It builds on the form merged in #175 (`/interest`, `api/interest.ts`), and changes nothing about what
that form already keeps or how long: a sign-up is kept until the person asks to be removed.

---

## 1. Where it lives

- **A page of its own at `/supporters`**, under the site menu and the build banner, like `/interest`
  and the Commons. One more rewrite in `vercel.json`, one more page in `src/lib/pages.ts`.
- **The ways in.** The site menu is the main site's and stays as it is, so the page is not in it.
  Instead:
  - on the **Agent Commons**, one quiet line under the intro: "See who supports this work";
  - on the **interest form**, a line under the title: "See who supports this work";
  - on the **form's thank-you line**, for someone who ticked the public box: "Your support will show
    on the supporters page once the WaterBots team has looked at it."
- **Not on the console's left rail.** The rail is the visitor's project; the pinned "Register your
  interest" box stays as it is.

## 2. What changes on the form

Below the box that keeps their details (which stays required), a second box, **unticked**:

> **Show my support publicly.** My name, title, organisation, role and comment appear on the supporters
> page once the WaterBots team approves them. My email never does.

Ticking it opens ~~four~~ **three** more fields (her answer: company is the organisation the form
already asks for). Unticked, they stay hidden and nothing public is sent.

| Field | Required when ticked? | Limit | Shown publicly |
|---|---|---|---|
| Role | yes, one of: Developer, Standard body, Consultant, Auditor, Funder, Other | closed list | yes |
| Title | no | 80 characters | yes |
| ~~Company~~ Organisation | the form's existing field, required as today | 120 characters | yes, as the company |
| Comment | no | 280 characters, no links | yes |

The name comes from the form's existing name field, **shown in full, as typed**. **The email is never shown, never sent to the
page and never in the public list.**

```
 ┌──────────────────────────────────────────────────────────┐
 │  Register your interest                                   │
 │  …name · organisation · email · what interests you …      │
 │                                                           │
 │  [ ] Keep my details so the WaterBots team can contact me │
 │      …(required, as today)                                │
 │                                                           │
 │  [ ] Show my support publicly.                            │
 │      My name, title, organisation, role and comment appear│
 │      the supporters page once the WaterBots team approves │
 │      them. My email never does.                           │
 │   ┌ when ticked ───────────────────────────────────────┐  │
 │   │ Role      ( ) Developer   ( ) Standard body        │  │
 │   │           ( ) Consultant  ( ) Auditor              │  │
 │   │           ( ) Funder      ( ) Other                │  │
 │   │ Title     [______________________]  optional       │  │
 │   │ Comment   [______________________]  optional, 280  │  │
 │   └────────────────────────────────────────────────────┘  │
 │  [ Send ]   ← the page's one blue button, as today        │
 │  We keep these details until you ask us to remove them…   │
 └──────────────────────────────────────────────────────────┘
```

## 3. The supporters page

```
 ┌───────────────────────────────────────────────────────────────────────┐
 │ WaterBots.AI   Consulting  Open Source  Agent Commons   Sign in [Sign up]│
 │                   This site is still being built.                      │
 ├───────────────────────────────────────────────────────────────────────┤
 │                                                                         │
 │   Supporters                                                            │
 │   People who want water impact to be faster and fairer to prove.        │
 │   Each entry is shown with the person's permission.                     │
 │                                                                         │
 │   All · Developer · Standard body · Consultant · Auditor · Funder · Other│
 │                                                                         │
 │   ┌──────────────────────────────┐  ┌──────────────────────────────┐    │
 │   │ [Name]                [Role] │  │ [Name]                [Role] │    │
 │   │ [Title] · [Organisation]     │  │ [Organisation]               │    │
 │   │ "[Comment]"                  │  │                              │    │
 │   │ Joined [month year]          │  │ Joined [month year]          │    │
 │   └──────────────────────────────┘  └──────────────────────────────┘    │
 │   ┌──────────────────────────────┐  ┌──────────────────────────────┐    │
 │   │  …                           │  │  …                           │    │
 │   └──────────────────────────────┘  └──────────────────────────────┘    │
 │                                                                         │
 │   ┌ Register your interest ┐   (the same light-blue box as the rail)   │
 │   To be taken off this page, write to hello@waterbots.ai.               │
 └───────────────────────────────────────────────────────────────────────┘
```

- **The words in brackets are slots, not entries.** Nothing on the page is drawn until a real,
  approved entry exists.
- **Empty, it says so:** "No supporters are shown yet." and the Register your interest box. No
  sample cards, no placeholder names, ever.
- **Cards** are two across on a laptop, one on a phone. Title and company show only when given; a card
  with neither shows the name and role alone. The comment is in quotes, as written, never edited.
- **The role** is a small outlined chip, no colour of its own: roles are not agents and wear no accent.
- **The filter row** shows a role only when at least one approved entry has it, with no counts.
- **Order:** newest approved first. "Joined" is the month and year it was approved, never the day.
- **No blue button here.** The page has no next step of its own, so by the one-blue rule the menu's
  Sign up stays the blue one; the Register your interest box is the tinted one from the rail.

## 4. Her approval: nothing shows on its own

Three states for a public entry, and only one of them is ever on the page:

| State | How it gets there | On the page? |
|---|---|---|
| **Waiting** | the visitor ticked the box and sent the form | no |
| **Shown** | she approves it | yes |
| **Not shown** | she declines it, or the person asks to come off | no |

- **How she approves: one command, pasted into PowerShell** (her word of 16 Nov 2026). In the
  repository folder:

  ```powershell
  npm run supporters
  ```

  lists what is waiting, the public fields only and never the email, and under each entry prints the
  exact line to paste, for example:

  ```powershell
  npm run supporters -- approve k3f9
  ```

  The id is a short random code. `decline <id>` keeps an entry off the page, and `hide <id>` takes a
  shown one off; each is printed the same way, ready to paste. Every command says in one line what it
  did. **The store's keys are read from `.env.local`** (gitignored, on her machine only) when they
  are not already set, so there is nothing to type before the command; the first run says plainly if
  the file or a key is missing. `count-interest.mjs` reads them the same way.
- **The copy to hello@** says when someone asked to show their support, so she knows something is waiting.
- **Nothing deletes on its own.**
  - Declining or hiding keeps the entry off the page and keeps the sign-up.
  - Only a person's own request removes their sign-up (`count-interest.mjs --remove`), and that also
    takes them off the page.
  - Nothing expires.
- **She approves the entry as written.** No edits by her, so a comment always says what the person wrote.
  If a comment is the problem, she declines the entry; the person can send the form again.

## 5. How it is built (for the build, after her word)

- **Store:** the public part of each sign-up goes to its own keys:
  - `supporters:waiting`, `supporters:shown` and `supporters:declined`;
  - each entry has an id, the public fields and the dates;
  - no email, no expiry, never trimmed.
- **`GET /api/supporters`:** returns the shown list only, cached for five minutes. Nothing else is
  readable from outside.
- **The form's endpoint** takes the new fields only with the public box ticked. Role must be on the
  list, comment, title and company must fit their limits, and comments with links are refused. The cap
  stays three a day per visitor.
- **Checks** (`check-supporters.mjs`), against an in-memory store as `check-interest` does:
  - waiting is never in the public list;
  - the email never reaches it;
  - only approve moves an entry onto the page;
  - removal takes it off.
- **Files:**

  | Area | Files |
  |---|---|
  | page | `src/components/SupportersPage.tsx` |
  | client and pages | `src/lib/supporters.ts`, `src/lib/pages.ts` |
  | form | `src/components/InterestPage.tsx` |
  | Commons | `src/components/CommonsShelf.tsx` (the intro line) |
  | API | `api/_interest.ts`, `api/interest.ts`, `api/supporters.ts` |
  | scripts | `scripts/supporters.mjs`, `scripts/count-interest.mjs`, `scripts/check-supporters.mjs` |
  | config | `vercel.json`, `vite.config.ts` |
  | CI | `.github/workflows/checks.yml` |

  That makes the build lane 3.

---

## Questions for her — answered 16 Nov 2026

1. **Name on the page:** the full name as typed.
2. **Company and organisation:** the existing organisation field, shown publicly. No new field.
3. **Role:** required when the public box is ticked.
4. **The page's address and title:** `/supporters` and "Supporters".
5. **The intro line:** "People who want water impact to be faster and fairer to prove."
