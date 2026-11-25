# The console — module rulings

The open site's console: layout, navigation, the record, the calculators' frame, words on screen and
the look. The whole site's rulings are in [RULINGS.md](../../RULINGS.md). By that page, a console change
goes into the shared spec first, then both sites build it together; until the shared spec holds these,
they stand here.

## Menu and navigation

- Every page carries the main site's menu, with the same words, order and look as the live
  waterbots.ai menu. The links live once, in `src/lib/site.ts`. The wordmark goes to waterbots.ai.
- The menu has Sign in and one button: "Sign up" until something is on the record, then "Save and sign
  up", the one Save on the site. The box that sends the project to the team sits under it.
- During a screening, Consulting, Open Source and Agent Commons fold into one small "Menu" button beside
  the wordmark.
- **The agents lead.** A visitor moves by clicking an agent in the crew on the right, or by Wellington's
  "Meet …" button. The journey bar is a progress line that does not click, "you are here" its strongest
  mark. Plan, Monitor and Communicate fold into one "After you save" mark.
- The journey bar never scrolls and collapses to numbered rings when narrow; the phase names show at
  laptop width.
- Each move to a step is a history entry, so the browser's Back button goes back a step; a reload starts
  the visit over.
- On a phone the top row is the wordmark, the menu button, Sign in and the one button, and never wraps
  (it fits from 360px). The rings and the row under them are one row: Project, the step by name with a
  dot per step, Crew.
- The site says it is early in one place: a small "beta" beside waterbots.ai at the foot of the left
  rail. No agent or module wears a beta tag.

## The agent screen and the crew

- Every step is one agent screen: the agent's chat in bubbles, and tabs above it: Chat, Tool (when the
  agent has one), Knowledge pack and Credentials, in the agent's colour. The active crew card takes the
  same underline.
- Where the chat is not live (Calvin's, Violet's and Bridget's seats in the Agent Commons), the screen opens on Tool or
  its Knowledge pack, and the Chat tab holds one plain line.
- Memory is never a tab; it stays in the record, its source behind the (i).
- Three consumers share one screen (the Commons, this site, the paid site), differing only in memory and
  tool depth.
- **The crew shows only the agents the agent map has called** (the shared console behaviours, 24 Nov 2026, line
  1). One not called yet is hidden, not dimmed; it appears when the map calls it and never disappears after
  that. Later agents wait until the agent before them has finished; Calvin and Violet share Step 3.
- **Chips answer the question just asked, and come first** (line 2). Then the one that opens a tab the agent asked
  for, "Go to map" (line 3); last, at most one helper. An answer chip is sent as the visitor's own words, so it
  never holds a fact the visitor has not said.
- **An answer comes in the same turn** (line 4). A reply that ends by promising a look-up is never sent: the
  question goes again at once, and if that does not answer it the visitor is told so (`api/_lookUp.ts`).
- **The same hand-off for every agent** (line 5). Wellington's line heads each agent's page the first time it
  opens, whichever way the visitor came. The agent waits for it.
- The crew is the right column on every step, one status line each. Each line says what the agent is
  ready to do, then what they found, and shows only once it is news or while that agent's step is in
  view.
- **The journey is told by step** (the shared console behaviours, 24 Nov 2026, items 6 and 7; `src/lib/steps.ts`): Step 1
  Eligibility, Step 2 Partners, Step 3 Quantify, in the journey's words. What comes next is read from the agent map. A
  step is done when its agent has finished or handed on; the screening is never called done while a step is ahead.
- **Every hand-off button has one format** (item 8): the step and the agent, "Step 2 of 3: Partners. Meet Bridget", in
  the next agent's colour, whether or not the visitor has been there. Beside it, a quiet "Keep chatting". There is
  always one to the next step; at the end, "Export screening report" and "Save and sign up" (item 10).
- **A crew card opens that agent's Chat tab first** (item 9), for every agent. **Calvin's and Violet's chats** run on what
  their packages ship (25 Nov 2026): the instructions, the settings and the list of what to ask. This site writes none of
  its own. Each answer fills the record and the calculator; a refused number's message shows under the reply. Thirty
  messages a day each, as for the other agents (`src/screen/useCalculatorChat.ts`, `api/_calculatorChat.ts`).
- **Step 3 is done** when each calculator the map calls has a figure that came from the visitor's answers (25 Nov 2026).
  Opening a calculator ends nothing.
- **Home use is asked when the map asks** (25 Nov 2026), by Wellington, before he introduces the next agent. In another
  agent's chat, the visitor's next words are then his.
- **One blue button at a time** (`src/lib/blue.ts`): Save, else the menu's Sign up. A form's Send on its own page. A
  hand-off is in its agent's colour, so it is no longer the blue one (24 Nov 2026).
- Wellington's desk opens on his chat alone; "About Wellington" beside his name brings back his
  Knowledge pack and Credentials.
- No intro paragraph above the conversation; the map's line is one plain sentence.
- Every chat box grows to three lines, then scrolls. The desk composer matches production: one line,
  13px, 816px.
- One component draws every agent's Knowledge tab. An ungraded card set says "Draft"; the Evals section
  says no exam has run yet and points at Credentials.

## The project record

- The desk is the conversation; the record on the left rail is what Wellington's interview fills.
- Rows come from this visit and are never invented. Nothing is kept between visits.
- The record starts collapsed, its heading counting the rows it holds, and shows only rows with a value.
- The project card shows the name once, under a "Project name" label over a box.
- A rail row that sends the visitor somewhere clears once taken. Record facts never clear.
- Nothing sits under a record value except the pin's line; explainers sit behind an (i).
- The record says "What type" and "Stage"; "What kind" is retired. A detail not given yet reads "Not
  given yet".

## Calculators on this site

- Calvin's carbon calculator is the open core's, locked to ex-ante (`exAnteOnly`, sliders on), on
  Quantify and on the Commons. Its state lives with the calculator and opens again once the record names
  the technology.
- **Violet is her own crew member** (the maintainer's word of 23 Nov 2026): her own seat and desk, beside
  Calvin's on Quantify. Her seat word and job line are the crew list's. People served come from the
  record; on the Commons, from her facts form.
- **One calculator layout.** Violet's screen has Calvin's layout and her own colour, drawn by her package.
  Her header pins at the top of the box that scrolls (`--wb-pin-top: 0px`).
- **The agent map decides who is called** (J4). A pathway that reads unlikely closes its calculator's desk:
  the desk says why, what would change it, and that the calculator can be read about in the Agent Commons,
  where it does not open yet. Its agent is not called, so their card does not appear; one already in the
  crew stays, and says it is unlikely for this project.
- **No note box** on the Free site or in the Agent Commons. Each export carries the agents' own notes on
  the values still blank or assumed, under the agent's label from core.
- Calvin's header says only what the record still lacks, or that his calculator does not cover the kind of
  project yet.
- **Not covered yet** is core's own answer from core 0.3.0 (25 Nov 2026): community level treatment, institutional
  treatment and a new or alternative supply get no carbon figure, and treatment of any kind gets no water figure.
- **One fixed sentence** (the maintainer's, 25 Nov 2026), where water benefits stay in play and no calculator covers the
  kind of project yet: `NO_CALCULATOR_YET` in `src/lib/projectRecord.ts`. It shows under Wellington's turn as Quantify
  comes up, on Violet's desk and in the report.
- **One export during a screening.** On Quantify Calvin's and Violet's own exports are hidden
  (`hideExportButton`), and "Export screening report" in the left rail carries his figure, his full working
  and her estimate. The Commons keeps theirs.

## The screening report

- "Export screening report" sits in the left rail under the project: print-only, growing with the
  visit. A detail not given yet reads "Not given yet". "Every value used" means inputs, never results.
- "This is a first screening, not an official decision" stays beside the figures, on the worksheets and
  in the report, never in a banner.

## Citations on screen

- The plain answer comes first. A compact marker, `(ref1)`, sits in the text; opening it shows one muted
  line and nothing more: source · version · section · page → canonical link, in the map's
  attribution-bar style.
- A pop-out with a source-text tab is a paid-platform feature and is never built here: this repository
  holds no source text to put in it.
- A citation reference is a tag, not a chip: 4px radius, 1px `--line` border, no fill, DM Mono 11px,
  label in `--fg-2`. Chips carry states, never citations.

## The look

- The brand book (`brand/BRAND.md`) is the design authority. One light brand: no dark theme, no theme
  switch.
- The frame and the content have different grounds: `--paper` is the content canvas, `--frame` the
  frame. An active navigation item rises one plane to `--card` with its 1px hairline.
- Agent colours: Phoebe is Anemone, Bridget is Surf, Calvin is Reef with Deep Reef (`--deep-reef`) for
  his text, Violet is Orchid and still needs a text shade and a portrait: her name is ink and her initial
  is drawn. Neither Reef nor Orchid carries text. The Quantify seat is Calvin, not Vector; `--bot-vector` and `vector.svg` are kept.
- An agent colour never reads as a project status. Purple belongs on small tags, never washed behind
  numbers.
