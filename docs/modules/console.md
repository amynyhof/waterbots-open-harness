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
- Where the chat is not live, the screen opens on Tool and the Chat tab holds one plain line.
- Memory is never a tab; it stays in the record, its source behind the (i).
- Three consumers share one screen (the Commons, this site, the paid site), differing only in memory and
  tool depth.
- The crew is the right column on every step, one status line each. Each line says what the agent is
  ready to do, then what they found, and shows only once it is news or while that agent's step is in
  view.
- There is no "Next phase" chip on any step. Every handoff's button sits in the chat: a blue "Meet
  <name>" and a quiet "Keep chatting". A "Meet …" button goes quiet once its agent is reached.
- **One blue button at a time** (`src/lib/blue.ts`): "Meet <name>" under the latest turn on the step in
  view, else Save, else the menu's Sign up. A form's Send on its own page.
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
- Violet's D-3 screen sits under Calvin's "Water benefits" chip until Violet joins the crew. People
  served come from the record; on the Commons, from its facts form.
- Calvin's header says only what the record still lacks.
- **One export during a screening.** On Quantify Calvin's own export is hidden (`hideExportButton`),
  and "Export screening report" in the left rail carries his figure and his full working. The Commons
  keeps his export.

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
  his text, Violet is Orchid and needs a text shade when she is built. Neither Reef nor Orchid carries
  text. The Quantify seat is Calvin, not Vector; `--bot-vector` and `vector.svg` are kept.
- An agent colour never reads as a project status. Purple belongs on small tags, never washed behind
  numbers.
