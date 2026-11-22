# The save and questions carried in — module rulings

The bridge between this site and the paid site, in both directions. The whole site's rulings are in
[RULINGS.md](../../RULINGS.md).

## The save

- The click keeps the visit for one hour under a random ticket and moves the same window to the paid
  site's welcome, with only the ticket in the address. The paid site collects it once, behind
  `BRIDGE_KEY`, checked first in constant time; then it is gone.
- The save never carries a computed number or the conversation, and this site keeps no copy. A pack's
  own status word crosses as a label, never a figure.
- Ten saves a day per visitor, on their own counter.
- The save carries `type`, `gsClass` and `stage`, and `kind` derived from the type, until the paid
  site's receiver stops reading `kind`.
- It carries `wantsHuman` and `humanNote` only when the box is ticked. A ticked save sends one email to
  the team with the project's facts and no visitor contact; a failed email undoes the save.
- Off the live site, saving says it works only there and that nothing was kept.
- Lines a visitor reads say what happens, in plain words: never "seal", "ticket", "store" or "claim".

## Questions carried in

- A visitor who types a question into the paid site's landing box arrives here with it in the address.
  The desk reads it, cleans the address, and hands it to Wellington as the visitor's first turn. Nothing
  is kept.
- The address contract: `?question=<≤500>[&does=<≤300>][&name=<≤80>][&place=<≤80>]`, percent-encoded
  UTF-8, empty keys left out, no kind, and no provenance in the address (this site stamps it). It lives
  in `src/lib/carried.ts`.
- A bad or empty field is ignored with no message. The page opens as it always opens and never invents
  a question.
- Ten carried questions a day per visitor, on a counter of their own, on top of Wellington's thirty.
