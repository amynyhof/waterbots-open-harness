# Register your interest and Supporters — module rulings

The two sign-up pages' own rulings. The whole site's are in [RULINGS.md](../../RULINGS.md).

## Register your interest

- At `/interest`, reached from the left rail and from each Commons "Coming soon" row. A copy goes to the
  team inbox. Three a day per visitor.
- Sign-ups are kept in the site store with no time limit until the person asks to be removed; the form
  says how. `scripts/count-interest.mjs` counts and removes, and never prints a name or an email.
- It has no public box: the supporters page is the one place to post.

## Supporters

- At `/supporters`, reached from one quiet line on the Commons and on the form, never the menu.
- The four agents are the board's first entries, each with the crew's icon, a "WaterBots agent" tag and
  one line in its own voice (`src/lib/supporters.ts`). The reclining Wellington sits beside the heading.
- The form: name, email, a role (required, one of Project developer, Consultant, Funder, Auditor,
  Researcher, Other), an optional title and organisation, and a comment. It saves where Register your
  interest saves (`/api/interest`), marked `source: 'supporters'`.
- **Post** opens a pop-up with Wellington's icon, the words "Everything except your email will show on
  this page.", and "Post" and "Go back", in the site's one modal style. Post puts the entry on the board
  at once.
- Every post passes a filter (`api/_postFilter.ts`) that blocks rude, sexual and spam posts with a plain
  line and keeps nothing. Text only, no links, 280 characters. The maintainer takes one down with
  `npm run supporters -- hide <id>`.
- No supporter entry holds an email. No sample cards or placeholder names are ever drawn.
- The poster can edit and delete their own post: their browser remembers it, and an email carries a
  private link (the key after the #, only its SHA-256 in the store). Edits pass the same filter.
- A card reads the name, then "Title, Organization", whichever is filled in, and the role as a small
  tag in its own colour (`--supporter-*` in `tokens.css`: brand hues no agent on the page wears; "Other"
  plain).
- A person's removal (`count-interest.mjs --remove`) takes them off this page too.
- "Questions? hello@waterbots.ai" sits at the foot of the page.
