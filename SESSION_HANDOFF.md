# Session handoff

Written at the close of the session that built and deployed v1. Read this with
[CLAUDE.md](./CLAUDE.md), which is the rulebook and takes precedence.

---

## Where the build stands

**v1 is live at [map.waterbots.ai](https://map.waterbots.ai).** Six of seven planned steps are
built; the seventh is blocked on data the maintainer has to supply.

| Step | State |
|---|---|
| 1 · Vite scaffolding, Frost brand tokens, licence README | done |
| 2 · Two-layer zoom swap — Level 4 world, Level 6 detail | done |
| 3 · Water-stress join — 100% coverage | done |
| 4 · Palette and legend | done |
| 5 · Data & licences panel | done |
| 6 · Console shell — nav rail, chat dock | done |
| 7 · Project points | **not started — blocked** |

### What the map does

- **HydroSHEDS HydroBASINS** Level 4 (1,342 basins) at world view, swapping to Level 6
  (16,397 basins) from zoom 5, with a dead band at 4.5 so resting on the boundary cannot thrash an
  8.44 MB layer. Level 6 is lazily fetched on first crossing and viewport-filtered once mounted.
- **WRI Aqueduct 4.0** water stress at 100% coverage. Level 6 renders WRI's published figures with
  no aggregation; Level 4 is an area-weighted majority of its children and is labelled as derived
  wherever it renders.
- **Cover-fit** to the column — the map fills the viewport and pans rather than showing empty
  bands, clamped to one world.
- **Console shell** — collapsible rail, chat dock with Bridget as a named placeholder, disabled
  composer that states why.

### Confirming the build

Four gate scripts. All must pass; `check-attribution` requires a build first because it reads
`dist/`.

```bash
node scripts/check-basins.mjs       # counts, fields, geometry, Level 6 → 4 nesting
node scripts/check-stress.mjs       # join coverage, derivation labelling
node scripts/check-palette.mjs      # ramp lightness order, chroma separation
npm run build && node scripts/check-attribution.mjs
```

`check-attribution` greps the **built bundle**, not the source. It is a licence guard: a refactor
that dropped the HydroSHEDS statement would otherwise leave the map looking perfectly correct.

---

## Deployment

| | |
|---|---|
| **Live URL** | https://map.waterbots.ai |
| **Vercel URL** | https://waterbots-open-harness.vercel.app |
| **Repo** | https://github.com/amynyhof/waterbots-open-harness (public), branch `main` |
| **Host** | Vercel, imported from GitHub — pushes to `main` deploy automatically |
| **Framework preset** | Vite · build `npm run build` · output `dist` · install `npm install` |
| **Environment variables** | none |
| **Config file** | none — no `vercel.json`, no rewrites needed |

### Domain and DNS

`map.waterbots.ai` is a CNAME pointing at Vercel. DNS is managed at **Namecheap**.

Observed resolution at the time of writing: `map.waterbots.ai` resolves through
`1b84237467ad21cd.vercel-dns-016.com` to `216.150.16.129` / `216.150.1.129`.

> The exact record value should be read from the Vercel **Settings → Domains** panel or from
> Namecheap, not copied from the resolution above — Vercel issues a per-project target and it is
> not ours to guess.

TLS is a Let's Encrypt certificate issued 19 Aug 2026, valid to 17 Nov 2026, renewing
automatically.

### Branch protection

`main` carries a ruleset requiring changes through a pull request. A **bypass was added for the
repository owner** so the v1 work could be pushed directly.

> **Decide whether to keep it.** If the rule was deliberate, restore it and use a branch plus PR
> from here on. If it was incidental, the bypass is fine. Either way it is a live setting that
> outlasted the session it was added for.

### Verified live

Checked against `map.waterbots.ai`, not assumed:

- All three data files return HTTP 200 at byte-exact sizes (2,232,356 / 8,854,936 / 299,225).
- **Brotli compression is on** — 2.72 MB over the wire against 11.39 MB raw, a 4.2× saving. A
  visitor who never zooms past z5 transfers roughly 685 KB.
- A nonexistent path returns a real 404, not an HTML fallback masquerading as data.
- CARTO basemap tiles load from the public domain with no referrer restriction.
- Every required attribution string is present in the shipped bundle; no unfilled Exhibit B
  placeholder, no WWF logo reference.
- The layer swap, viewport filtering, tooltips and the licence panel all work in production.
- Zero console messages.

---

## Data pipeline

The source data is **not in this repository** — it is far too large and is reproducible.

| Input | Size | Where |
|---|---|---|
| HydroSHEDS shapefiles, levels 3–6 | ~1.2 GB | `data-src/`, gitignored, re-downloadable by script |
| WRI Aqueduct 4.0 download | 737 MB | `legacy/`, gitignored, **not** downloaded by any script |

```bash
node scripts/build-basins.mjs          # downloads, converts, simplifies both levels
node scripts/build-basins.mjs --clean  # and removes data-src/ afterwards
node scripts/build-stress.mjs          # needs the Aqueduct CSV
```

`build-basins.mjs` fetches everything it needs. **`build-stress.mjs` does not** — it reads the
Aqueduct CSV from `legacy/` and exits with instructions if it is missing. Set `AQUEDUCT_CSV` to
point elsewhere. Download it from https://www.wri.org/data/aqueduct-global-maps-40-data.

Only the three small outputs in `public/` are committed.

### Known data conditions, recorded so they are not rediscovered as bugs

- **`PFAF_ID` is unique only within a regional tile.** One Arctic/Siberia overlap produces exactly
  one collision at every level — `353` → `3530` → `353020`. It is present in the untouched source
  shapefiles. The check scripts name it and fail on any *other* collision.
- **`getBoundsZoom` clamps to the current `minZoom`.** Setting `minZoom` from its own output is a
  ratchet that can only climb, and it cropped the world when the column narrowed. `minZoom` is
  cleared before measuring. Do not "simplify" that away.
- **HydroBASINS excludes Antarctica.** The southern data limit is −55.883. The view deliberately
  extends to −68 so the Antarctic coastline gives context; the strip below the data limit is
  basemap only, by design.

---

## What the next session picks up

### 1. Project points — the blocked step

Nothing goes on the map until it can be verified. For each point the build needs:

1. The **registry** and a link.
2. **Project ID, name, developer, country** as that registry states them.
3. **Coordinates as published**, plus the retrieval date.

**The likely snag:** public carbon registries often publish a country or region but not point
coordinates. If so, the honest options are to ship basins only, or to place points at a documented
administrative centroid, visibly labelled approximate in both tooltip and legend. **A dot at a
plausible-looking spot is not one of the options.**

The prior prototype's hardcoded project array is **not** a source — its coordinates are rounded to
~0.05°, which reads as hand-placement.

### 2. Final agent staffing

Undecided. Bridget is a placeholder: named in the panel, stated as provisional, and she does not
answer. Her identity colour `#7FD5DF` is provisional with her.

Her portrait ships from `brand/assets/bots/bridget.svg`. If staffing changes, that file and the
`--bot-bridget` token both need revisiting, and the `.gitignore` negation that publishes exactly
two brand files needs updating.

### 3. Smaller open threads

- **The reverse link** from waterbots.ai to this map is the marketing site's job, not this
  repository's. Logged in `src/lib/site.ts`, not built.
- **The collapsed legend strip wraps** at very narrow columns. Cosmetic; left alone deliberately.
- **`public/hydrobasins_lev06.json` is 8.44 MB in git history.** Fine in practice — `.git` is under
  4 MB because it compresses well — but it is tracked rather than generated at deploy. Reversible
  now, awkward later.
- **Data files ship with unhashed filenames**, so they do not get immutable-asset caching. They
  carry ETags with `must-revalidate`, so a rebuild will not serve stale data. Only worth revisiting
  if traffic makes it matter.

---

## Working agreements that are easy to lose

These are in CLAUDE.md and binding; repeated here because they shaped nearly every decision.

- **No mock or fabricated data, ever.** Real basins, registry-verified coordinates, or nothing.
- **Proposal before code**, one step at a time, browser review before every commit, and nothing
  commits without the maintainer's explicit word.
- **Honest states.** No silent failures. A failed load says so; a derived value says it is derived;
  a disabled control says why.
- **Two datasets, two attributions.** One combined credit line satisfies neither licence.
- **Docs never drift** more than one session behind the build — which is why this file exists.
