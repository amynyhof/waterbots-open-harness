# calvin-quantify — screening method packs (open)

**Version 0.1.0.** Calvin staffs Quantify. One tool per way of working a number
out. The live registry is [`src/lib/methodPacks.ts`](../../src/lib/methodPacks.ts).
This pack is not wired. Folder names for live tools match that registry’s keys.

Everything a pack produces is a **screening estimate** — anticipated, never
delivered, never verified — and carries a consultant-review tag wherever it
renders. A blank figure is never read as zero.

Chat is not live. The calculator is.

## Live tools (registry keys)

| Tool id | Live module |
|---|---|
| [vwba-2.0-d3-volume-provided](./tools/vwba-2.0-d3-volume-provided/) | [`src/lib/vwbaD3.ts`](../../src/lib/vwbaD3.ts) |
| [gs-sdws-legacy-v1](./tools/gs-sdws-legacy-v1/) | [`src/lib/gsSdws.ts`](../../src/lib/gsSdws.ts) |
| [gs-sdws-paa-v2](./tools/gs-sdws-paa-v2/) | same module, second variant |

## Empty stubs (named on open, not built)

The live D-3 pack already names two other VWBA methods as the ones that fit
instead, and refuses to give a number from D-3 for those projects. The folders
exist so the contract is visible. They hold **no arithmetic**.

| Tool id | Why it sits here |
|---|---|
| [vwba-2.0-d4](./tools/vwba-2.0-d4/) | Putting water back into the ground — named on the live D-3 pack as method D-4. Not built. |
| [vwba-2.0-d6](./tools/vwba-2.0-d6/) | Sanitation — named on the live D-3 pack as method D-6. Not built. |

Further D-methods and further carbon methods each get their own folder when they
go live. No method is invented here. No irrigation table, no metered option, and
no extra carbon method is given a folder until this site has one.

The two Gold Standard folders above **are** the carbon that is live. They are
not stubs.
