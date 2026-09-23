# Grader notes — VWBA 2.0 cards, Appendix A and Appendix B

**Notes to the maintainer, moved out of the two card files on 20 Sep 2026** (item K10,
part 2; item A15). Until that day every line below sat at the foot of
[`eligibility-cards-vwba.md`](./eligibility-cards-vwba.md) or
[`feasibility-cards-vwba.md`](./feasibility-cards-vwba.md), and both files embed whole into
Phoebe's prompt, so she read these notes as knowledge. She never reads this file: the generator
names the two card files and nothing else.

**Every line is carried whole, not reworded.** Where a note says "this file", it means the card
file it was cut from. The status line, the design decision and the source table stay on the cards.

---

## Eligibility set — Appendix A

**The correction of 31 Aug 2026**, which stood under the naming table at the head of the file:

> **Corrected 31 Aug 2026.** This table said the Feasibility set was *planned, not drafted*, and the
> sentence above it said the set was *not to be drafted until asked*. **Both stopped being true on
> 21 Aug 2026**, the day [feasibility-cards-vwba.md](./feasibility-cards-vwba.md) was written and
> approved by the maintainer — ten cards, one per consideration, none skipped. Phoebe has answered
> from both sets since 24 Aug 2026, so this file described the product wrongly for ten days.
>
> **The false lines are struck rather than deleted**, per *visible corrections over rewritten
> history* in [PROCESS_RULES_for_ShellB.md](../../../../PROCESS_RULES_for_ShellB.md). What they cost is worth
> keeping: a card set that describes its own sibling as unwritten is a card set an agent could
> quote, and this one is inherited into Phoebe's prompt.


## Notes for the grader

1. **Terms of art are kept, sentences are not.** Phrases like *shared water challenge*,
   *without-project conditions*, *volumetric water benefit* and the six criterion titles are the
   source's vocabulary and are reproduced as labels so the cards can be checked against the
   original. Everything around them is rewritten. If the posture requires the criterion titles to
   be paraphrased too, that is a quick change — but it makes grading against the source harder.

   **Checked mechanically, not just by eye.** Every overlapping word-sequence between this file
   and the cited source pages was counted (script kept out of the repo, in the session scratchpad).
   Criterion titles were excluded from the comparison, since they are carried deliberately.
   Results: at an eight-word window, **zero** overlapping sequences. At six words, one — the
   document's own title inside a citation. At five words, seven, all of them short unavoidable
   technical phrasing: the document title, *the objective of the activity*, *sponsor is legally
   required to*, *reasons why compliance would not*, *a tracking and reporting plan*, and *elements
   that must be met*. None is a sentence. Two phrasings were rewritten during drafting once this
   check surfaced them. Flagging the five-word hits rather than reporting a clean zero, because the
   bar is yours to set and the raw numbers are more useful to you than my judgement of them.

   One extraction note: the criterion 5 and 6 titles appear in text extraction as *E stablished*
   and *T rade-offs*, an artifact of the decorative first letter in the PDF's typesetting. The
   titles as written on the cards are correct.

2. **The source is inconsistent about how binding the criteria are — resolved by ruling, not by
   the text.** Appendix A presents them as mandatory (p. 32). The Step 2.3 summary box uses softer,
   expectation-style wording (p. 20), and page 20 goes on to say the criteria are guidance for
   companies, applied through each company's own decision-making, with flexibility expected for
   large or complex projects, particularly around community consultation and trade-off
   identification. Figure 3 (p. 19), meanwhile, is absolute: miss any criterion and the project is
   not eligible. **The maintainer ruled on 20 Aug 2026 that the build follows Figure 3** — hard
   gate, with a route forward attached to every failure. See the design decision at the top of this
   file. The tension in the source is recorded here so the ruling is understood as a choice made
   against a genuinely ambiguous source, not as the only reading of it.

   **The flexibility page 20 describes is about depth of evidence, not about the gate.** Added
   31 Aug 2026, because this note names that flexibility and then leaves a reader to work out what
   it touches. It touches **how much proof is asked for** on the two criteria the page names —
   consultation, which is Card 3, and trade-off identification, which is Card 6. It never makes
   either criterion optional. Both cards now say so on their own face, so an agent reading one card
   cannot miss it by not reading this note.

3. **Criterion 4 is the one with real exceptions in it.** The other five are single-clause tests.
   Card 4 carries two carve-outs that could each be its own sub-rule if the card set needs finer
   granularity for the agent to reason over.

4. **Scope of these cards.** Appendix A only — the Eligibility set. Appendix B becomes the separate
   Feasibility set, ~~not drafted yet.~~ **Corrected 17 Sep 2026:** Feasibility cards are live —
   [feasibility-cards-vwba.md](./feasibility-cards-vwba.md). See the naming table at the top of this file.

5. **Page citations were re-checked against the page footers on 20 Aug 2026, and two were wrong.**
   The maintainer caught the first. Both are corrected above.

   - **Criterion 4 was cited as pp. 32–33. It is entirely on p. 33.** The error came from
     misreading a *column* break inside p. 33 as a *page* break in the extracted text. Nothing in
     the extraction supported the straddle claim; I asserted it.
   - **The Step 6 cross-reference was attributed to p. 32. It is on p. 20 only.** The sole
     occurrence of "Step 6" on p. 32 is the running navigation header along the top of the page,
     which is not a cross-reference.

   The re-check, done page by page against the printed footers:

   | Page | Footer reads | Appendix A content beginning on it |
   |---|---|---|
   | 32 | `32 \| WRI.ORG` | Appendix A intro and screening list; criteria **1** and **2** |
   | 33 | `Volumetric Water Benefit Accounting 2.0 \| 33` | criteria **3**, **4**, **5**, **6** |

   Every other citation in this file was re-confirmed the same way and holds: Step 2.3 and Figure 3
   at p. 19; the summary box at p. 20; Appendix B beginning p. 34; Appendix E beginning p. 62; the
   1:1 match between printed and PDF page numbers.

   **What went wrong is worth recording.** The 1:1 page-numbering check was real, and I reported it
   as though it covered the criterion-to-page mapping. It did not — those are two different claims,
   and only one was checked. Verifying one thing and citing it as cover for another is the failure
   mode to watch for in the rest of this card work.

6. **Not yet cross-checked** against `sources-local/VWBA summary.pdf` or the Meta 2023 report, both
   of which are sitting in the same folder. Say the word if the cards should be reconciled with
   either.

---

## Feasibility set — Appendix B


## Notes for the grader

1. **Page citations were checked against the footers per page, and two considerations straddle a
   break.** Consideration 4 begins on p. 34 and its evaluation guidance finishes on p. 35;
   consideration 9 begins on p. 35 with its reasoning and guidance on p. 36. Both cards say so.
   Every other consideration sits wholly on the page cited. This was established by extracting each
   page separately and seeing which page each heading falls on — not by reading a continuous text
   stream, where a column break and a page break look identical. That distinction is what produced
   the citation error in the Eligibility set, and it is the reason for the method here.

2. **The never-a-bar framing is structural, not decorative.** It appears in the file's opening
   section, in the comparison table, in the group headings, and in the label on every card's fourth
   part — *guidance, not a gate*. A reader arriving at a single card, as Phoebe serves them, still
   meets the framing on that card. That was the point of the per-card requirement, so it seemed
   right to apply it to framing as well as to citations.

3. **Two constraints on Phoebe drawn from the source, not invented.** The manual states the
   considerations carry no priority order, and that companies weigh them differently. Both are
   recorded in the opening section, because both restrict what Phoebe may say: she must not imply
   the numbering is a ranking, and she must not do the weighing on the user's behalf.

4. **Three places where a Feasibility card could be mistaken for an Eligibility one**, each flagged
   on its card:
   - **B-6** looks like criterion 2 but is not. Criterion 2 asks whether a real shared water
     challenge exists; B-6 asks whether the location fits *this company's* stated goals.
   - **B-8** values a project for what it may unlock. That is not a countable benefit, and an
     enabling project still has to satisfy criterion 1 on its own.
   - **B-7** may leave extra benefits described only in words. Phoebe should not let a qualitative
     account read as a quantified one.

5. **Terms of art are kept, sentences are not.** Consideration titles are quoted as labels so the
   cards can be checked against the source, as in the other sets. The manual's example lists —
   financing vehicles in B-9, cost components in B-3 — are name lists rather than prose and are
   carried as names.

6. **One wording discrepancy in the source.** Consideration 10 is titled *Opportunity for
   collaboration* in Appendix B (p. 36) but appears as *Opportunities for collaboration* in the
   Step 2.3 summary box (p. 20). Card B-10 cites the Appendix B form and notes the other. The other
   nine titles match across both places.

7. **The same drop-cap extraction artifact seen in the Eligibility set.** Six of the ten titles come
   out of text extraction with a stray space after the opening letter — *F easible*, *A nticipated*,
   *L ocation*, *O pportunity*, *E nabling*. It is the decorative first letter in the typesetting.
   The titles as written on the cards are correct.

8. **Overlap check run, same method as the committed Eligibility set.** Measured against pp. 34–36
   plus the p. 20 summary box. **At an eight-word window: zero overlapping sequences.** At a
   stricter six-word window: six short runs, being the document's own title in a citation, three
   name lists carried as names (the multiple-benefit categories in B-7, the innovative-finance
   examples in B-9, and *without-project condition* as a defined term), one phrase in B-2, and one
   deliberate short quotation in B-9 — *may be considered with higher priority* — which is marked
   as a quotation because the priority language is the point being made.

   Two passages were rewritten during drafting once the check surfaced them. **One of them was in
   the framing section at the top of this file** — a twelve-word run describing the
   not-a-requirement rule. That it appeared in the most important paragraph in the set, and was
   caught mechanically rather than by eye, is the argument for running the check on every set
   rather than on the ones that feel risky.

9. **Scope.** Appendix B only. This completes the pair Phoebe is named for — Eligibility from
   Appendix A, committed; Feasibility from Appendix B, this file. The activity set from Appendix C
   and the definitions set from the glossary remain drafts awaiting grading.

---

## "Can it be fixed?" lines — added to the six eligibility cards on 23 Sep 2026

Graded "ships as written"; criterion 4 stays *depends*. The notes that sat at the foot of the draft:

These notes are for the maintainer and go to `grader-notes.md` before the lines are read by
anything.

1. **Only one *depends*, no *no*.** The proposal's first cut (§4.1) put criterion 4 as the water
   "no". Read again against the card, a plain *no* would make the two carve-outs unreachable; the
   line is written as *depends* on the one legal fact, with Blocked allowed once that fact is
   confirmed. This is the single line where a water project can be Blocked, and she may prefer *no*
   with the carve-outs as exceptions; either is one word.
2. **Figure 3's loop** is the source behind every *yes*: a project that misses is sent back to the
   implementer to revisit scope and be re-evaluated, and only the second miss ends in "not
   eligible" (p. 19). The lines do not repeat that on each card; the design decision at the head of
   the card file carries it once.
3. **Nothing here changes a card's rule or evidence list.** Six paragraphs are added; nothing is
   reworded.

---

## Routes set — moved into `routes-cards-vwba.md` on 23 Sep 2026

Graded "ships as written"; R-8 ships with the Meta line, the title confirmed by the maintainer. The notes that sat at the foot of the draft:

These notes are for the maintainer and go to `grader-notes.md` before the file is read by
anything.

1. **Nine routes, every one on a page already read.** No route rests on anything outside the
   guidebook and the one published report. Gaps with no source and so no card on the water
   pathway: none found; every criterion has at least one route, which is what Figure 3's loop
   implies.
2. **R-8 is the only card with two canonical links**, one per document. The Meta address resolved
   but could not be read by the checking tool because of its size; if she cannot open it either,
   R-8 ships with the guidebook citation alone and the published-project line comes out.
3. **The shape** adds two labels the gate does not know yet, "The gap" and "What it does not
   promise"; the gate learns them at the proposal's step 5 with the routes reader.
4. **Page numbers** were checked against the local copy's footers: Step 1 begins on p. 16, Step 3
   and Step 4.3 and 4.4 are on pp. 21 and 25, D-3 is on pp. 44–45, Appendix E on pp. 62–64. Every
   criterion page matches the criteria cards already approved.
