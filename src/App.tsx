/**
 * Step 1 token proof sheet.
 *
 * This is scaffolding, not product UI. Its only job is to render the BRAND.md
 * tokens so the surface ladder, type scale and accent roles can be confirmed
 * by eye before anything is built on top of them. It is replaced at step 2.
 */

const SURFACES = [
  {
    token: '--chrome',
    value: 'unpublished — aliases --paper',
    role: 'Navigation. BRAND.md publishes no Frost value; separated by a --line rule, not a fill.',
  },
  { token: '--paper', value: '#FBFBFE', role: 'The canvas.' },
  { token: '--card', value: '#FFFFFF', role: 'Cards. White, separated by a 1px --line border — no shadow.' },
  { token: '--raised', value: '#FFFFFF', role: 'Popovers and menus. Identical to --card on Frost, per BRAND.md.' },
];

/* Measured against #FFFFFF (--card). WCAG 2.1 relative luminance.
   Body and label text clears 4.5:1; --fg-4 is disabled/placeholder only and
   is not expected to clear it. */
const CONTRAST = [
  { token: '--fg-1', hex: '#0B1428', ratio: '18.4:1', use: 'Primary text', pass: true },
  { token: '--fg-2', hex: '#2A3146', ratio: '12.9:1', use: 'Secondary text', pass: true },
  { token: '--fg-3', hex: '#5B6478', ratio: '5.9:1', use: 'Readability floor', pass: true },
  { token: '--fg-4', hex: '#98A0B2', ratio: '2.6:1', use: 'Disabled / placeholder only — never body text', pass: false },
];

const BRAND_HUES = [
  { name: 'Marine', token: '--marine', role: 'Deep ocean — dark surface ink' },
  { name: 'Tide', token: '--tide', role: 'PRIMARY action' },
  { name: 'Iris', token: '--iris', role: 'Secondary accent — owns verification' },
  { name: 'Surf', token: '--surf', role: 'Live signal — no agent identity in this repo' },
  { name: 'Mint', token: '--mint', role: 'Success / approved' },
  { name: 'Plum', token: '--plum', role: 'Procedural depth' },
  { name: 'Slate', token: '--slate', role: 'Quiet monitoring' },
  { name: 'Amber', token: '--amber', role: 'Pending' },
  { name: 'Coral', token: '--coral', role: 'Warning' },
  { name: 'Seagrass', token: '--seagrass', role: 'Admin — via --role-admin' },
];

const STATES = [
  { name: 'Live', token: '--state-live', pulses: true },
  { name: 'Approved', token: '--state-approved', pulses: false },
  { name: 'Pending', token: '--state-pending', pulses: false },
  { name: 'Locked', token: '--state-locked', pulses: false },
  { name: 'Warn', token: '--state-warn', pulses: false },
];

const CREW = [
  { name: 'Wellington', token: '--bot-wellington' },
  { name: 'Audrey', token: '--bot-audrey' },
  { name: 'Ally', token: '--bot-ally' },
  { name: 'Vector', token: '--bot-vector' },
  { name: 'Monty', token: '--bot-monty' },
  { name: 'Reggie', token: '--bot-reggie' },
];

/* Step 4 preview — PUBLISHED ANCHORS ONLY.
   These are the BRAND.md Frost hues proposed as ramp anchors. The intermediate
   steps are NOT derived here: BRAND.md publishes no tint ramps, and inventing
   them is exactly what the brand rule forbids. Contrast is vs #FFFFFF. */
const RAMP_ANCHORS = [
  { cat: 'Low (<10%)', token: '--surf', hex: '#14C8D9', ratio: '2.0:1' },
  { cat: 'Low–Medium (10–20%)', token: null, hex: 'not published', ratio: '—' },
  { cat: 'Medium–High (20–40%)', token: '--amber', hex: '#E8A12B', ratio: '2.2:1' },
  { cat: 'High (40–80%)', token: null, hex: 'not published', ratio: '—' },
  { cat: 'Extremely High (>80%)', token: '--coral', hex: '#E25858', ratio: '3.4:1' },
  { cat: 'Arid & Low Water Use', token: '--slate', hex: '#3D5878', ratio: '8.0:1' },
  { cat: 'No data', token: '--state-locked', hex: '#98A0B2', ratio: '2.6:1' },
];

const RADII = [
  { name: 'xs', token: '--r-xs', use: 'Data tags' },
  { name: 'sm', token: '--r-sm', use: 'Buttons — never a pill' },
  { name: 'md', token: '--r-md', use: 'Console modules' },
  { name: 'lg', token: '--r-lg', use: 'Document cards' },
  { name: 'xl', token: '--r-xl', use: '' },
  { name: '2xl', token: '--r-2xl', use: '' },
];

function Section({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <div className="eyebrow" style={{ marginBottom: 16 }}>
        {eyebrow}
      </div>
      {children}
    </section>
  );
}

export default function App() {
  return (
    <div
      className="theme-light"
      style={{ minHeight: '100%', background: 'var(--paper)', color: 'var(--fg-1)' }}
    >
      {/* Chrome: flush, square, below the canvas. Wordmark anchors flush top-left. */}
      <header
        className="chrome"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px var(--gutter)',
        }}
      >
        <span className="wordmark" style={{ fontSize: 17 }}>
          WaterBots<span className="dot-ai">.AI</span>
        </span>
        <span className="t-mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
          Open Harness · step 1
        </span>
      </header>

      {/* Content starts high. No dead padding above the working surface. */}
      <main style={{ maxWidth: 'var(--measure)', margin: '0 auto', padding: '32px var(--gutter) 96px' }}>
        <h1 className="t-h2" style={{ margin: '0 0 12px' }}>
          Design token proof sheet
        </h1>
        <p className="t-body" style={{ color: 'var(--fg-2)', margin: '0 0 8px' }}>
          Every value on this page is read from a CSS custom property defined in{' '}
          <span className="t-mono">src/styles/tokens.css</span>, transcribed from BRAND.md. No
          component references a raw hex.
        </p>
        <p className="t-caption" style={{ margin: '0 0 40px' }}>
          This sheet is scaffolding, not product UI. It is replaced at step 2.
        </p>

        <Section eyebrow="Frost surfaces">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SURFACES.map((s) => (
              <div
                key={s.token}
                style={{
                  background: `var(${s.token})`,
                  border: '1px solid var(--line)',
                  padding: '16px 18px',
                  display: 'flex',
                  gap: 18,
                  alignItems: 'baseline',
                  flexWrap: 'wrap',
                }}
              >
                <span className="t-mono" style={{ fontSize: 12, minWidth: 84 }}>
                  {s.token}
                </span>
                <span className="t-mono" style={{ fontSize: 11, color: 'var(--fg-3)', minWidth: 190 }}>
                  {s.value}
                </span>
                <span className="t-caption" style={{ color: 'var(--fg-2)', flex: 1, minWidth: 220 }}>
                  {s.role}
                </span>
              </div>
            ))}
          </div>
          <p className="t-caption" style={{ marginTop: 12 }}>
            Frost has no four-surface ladder. BRAND.md publishes <span className="t-mono">--card</span>{' '}
            and <span className="t-mono">--raised</span> as the same white, and authors the ladder for
            Deep Marine only. On Frost, separation is carried by the 1px border — which is why every
            band above is outlined rather than distinguished by fill.
          </p>
        </Section>

        <Section eyebrow="Text contrast on Frost">
          <div className="card">
            {CONTRAST.map((c, i) => (
              <div
                key={c.token}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '10px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                  flexWrap: 'wrap',
                }}
              >
                <span className="t-mono" style={{ fontSize: 12, color: `var(${c.token})`, minWidth: 74 }}>
                  {c.token}
                </span>
                <span className="t-mono" style={{ fontSize: 11, color: 'var(--fg-3)', minWidth: 74 }}>
                  {c.hex}
                </span>
                <span className="t-mono" style={{ fontSize: 12, minWidth: 62 }}>
                  {c.ratio}
                </span>
                <span
                  className="chip"
                  style={{
                    ['--chip-role' as string]: c.pass ? 'var(--state-approved)' : 'var(--state-locked)',
                  }}
                >
                  {c.pass ? 'Clears 4.5:1' : 'Below 4.5:1'}
                </span>
                <span className="t-caption" style={{ flex: 1, minWidth: 200 }}>
                  {c.use}
                </span>
              </div>
            ))}
          </div>
          <p className="t-caption" style={{ marginTop: 12 }}>
            Measured against <span className="t-mono">--card</span> (#FFFFFF), not the canvas —
            contrast is measured against the surface a thing sits on. All three text tokens clear
            4.5:1. <span className="t-mono">--fg-4</span> does not, which is correct: it is for
            disabled and placeholder states, never for text a reader is expected to read.
          </p>
        </Section>

        <Section eyebrow="Type scale">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="t-display">Display</div>
            <div className="t-h1">Heading one</div>
            <div className="t-h2">Heading two</div>
            <div className="t-h3">Heading three</div>
            <div className="t-body">
              Body copy is DM Sans at 15px. Complete sentences in product UI — no fragments, no
              clipped phrases, no headline grammar.
            </div>
            <div className="t-caption">Caption, 13px, on the readability floor.</div>
            <div className="t-mono" style={{ fontSize: 13 }}>
              1.8 tCO₂e · HYBAS_ID 1030000010 · 14:03
            </div>
            <p className="t-caption" style={{ margin: 0 }}>
              Mono is for values. Concrete units beat adjectives.
            </p>
          </div>
        </Section>

        <Section eyebrow="Brand hues">
          <div className="card">
            {BRAND_HUES.map((h, i) => (
              <div
                key={h.token}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '10px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 'var(--r-xs)',
                    background: `var(${h.token})`,
                    flex: 'none',
                  }}
                />
                <span style={{ fontWeight: 500, minWidth: 92 }}>{h.name}</span>
                <span className="t-mono" style={{ fontSize: 11, color: 'var(--fg-3)', minWidth: 108 }}>
                  {h.token}
                </span>
                <span className="t-caption">{h.role}</span>
              </div>
            ))}
          </div>
          <p className="t-caption" style={{ marginTop: 12 }}>
            Roles are fixed. Amber and coral mean a warning or a sub-par metric — never emphasis,
            never decoration, never a category.
          </p>
        </Section>

        <Section eyebrow="Status taxonomy">
          <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
            {STATES.map((s) => (
              <span key={s.token} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                <span
                  className={`status-dot${s.pulses ? ' is-live' : ''}`}
                  style={{ ['--dot' as string]: `var(${s.token})` }}
                />
                <span className="t-caption" style={{ color: 'var(--fg-2)' }}>
                  {s.name}
                </span>
              </span>
            ))}
          </div>
          <p className="t-caption" style={{ marginTop: 12 }}>
            Only the Live dot pulses, and it drops to a static dot under reduced-motion. Status is a
            dot; agent identity is a portrait or a bubble. Map fills are a third form.
          </p>
        </Section>

        <Section eyebrow="Chips and tags">
          <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <span className="chip" style={{ ['--chip-role' as string]: 'var(--state-pending)' }}>
              Pending
            </span>
            <span className="chip" style={{ ['--chip-role' as string]: 'var(--state-approved)' }}>
              Approved
            </span>
            <span className="chip" style={{ ['--chip-role' as string]: 'var(--state-locked)' }}>
              Draft
            </span>
            <span className="tag">HydroSHEDS</span>
            <span className="tag">Aqueduct 4.0</span>
            <span className="tag">Level 3</span>
          </div>
          <p className="t-caption" style={{ marginTop: 12 }}>
            A chip carries a state; a tag carries a value. If the text would change when the record
            changes, it is a tag. A draft is not a warning — it takes a neutral chip.
          </p>
        </Section>

        <Section eyebrow="Stress ramp — Frost anchors, step 4 preview">
          <div className="card">
            {RAMP_ANCHORS.map((r, i) => (
              <div
                key={r.cat}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '9px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    width: 44,
                    height: 26,
                    borderRadius: 'var(--r-xs)',
                    background: r.token ? `var(${r.token})` : 'transparent',
                    border: r.token ? '1px solid var(--line)' : '1px dashed var(--fg-4)',
                    flex: 'none',
                  }}
                />
                <span style={{ minWidth: 176, fontSize: 14 }}>{r.cat}</span>
                <span className="t-mono" style={{ fontSize: 11, color: 'var(--fg-3)', minWidth: 96 }}>
                  {r.hex}
                </span>
                <span className="t-mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
                  {r.ratio}
                </span>
              </div>
            ))}
          </div>
          <p className="t-caption" style={{ marginTop: 12 }}>
            Anchors only. The two dashed rows are intermediate steps BRAND.md does not publish — they
            are left empty rather than invented. Note the luminance problem: Surf 2.0, No-data 2.6 and
            Amber 2.2 all sit in one narrow band against white, so this ramp does not currently order
            by lightness. Details in the step 4 plan.
          </p>
        </Section>

        <Section eyebrow="Buttons and radii">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary">Primary action</button>
              <button className="btn">Secondary</button>
              <button className="btn" disabled>
                Disabled
              </button>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {RADII.map((r) => (
                <div key={r.token} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: 56,
                      height: 40,
                      borderRadius: `var(${r.token})`,
                      border: '1px solid var(--line)',
                      background: 'var(--raised)',
                    }}
                  />
                  <div className="t-mono" style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 6 }}>
                    {r.name}
                  </div>
                  {r.use && (
                    <div className="t-mono" style={{ fontSize: 9, color: 'var(--fg-4)' }}>
                      {r.use}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section eyebrow="Crew identity on Frost">
          <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {CREW.map((c) => (
              <span key={c.token} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 'var(--r-pill)',
                    background: `var(${c.token})`,
                  }}
                />
                <span className="t-caption" style={{ color: 'var(--fg-2)' }}>
                  {c.name}
                </span>
              </span>
            ))}
          </div>
          <p className="t-caption" style={{ marginTop: 12 }}>
            Six of seven. Bridget is deliberately absent rather than guessed: the roster assigns her
            Surf, but Surf now carries no agent identity here — so she is the only crew member
            without an identity colour on Frost, and she is the step 6 chat host. Reggie's gap was
            dark-only; his Plum is published for Frost and renders above.
          </p>
        </Section>

        <footer style={{ borderTop: '1px solid var(--line)', paddingTop: 20 }}>
          <p className="t-caption" style={{ margin: 0 }}>
            No map, no data, and no agent is present yet. Basin geometry arrives at step 2 and the
            console shell at step 6.
          </p>
        </footer>
      </main>
    </div>
  );
}
