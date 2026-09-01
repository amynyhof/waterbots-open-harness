/**
 * The Quantification worksheet — Calvin's centre console.
 *
 * Step 3 of the console's journey: what benefit would this project produce?
 * It is the same shell as Eligibility — left rail, centre worksheet, right
 * agent dock — because a person who learns one surface should already know
 * the next. No wizard, no standalone calculator page, no second layout.
 *
 * THE SLOT IS EMPTY, AND THAT IS THE BUILT STATE, not an unfinished one. The
 * step exists; no method pack is fitted to it yet. It reads the registry in
 * lib/methodPacks and says plainly what is in it, which today is nothing.
 *
 * WHY THE PACK'S FIELDS ARE NOT HERE YET. The first pack's questions are
 * designed and signed, and they are deliberately not rendered until the pack
 * behind them can answer. Live-looking controls that compute nothing would be
 * a form that appears to work and does not — the same false success state that
 * keeps a disabled composer under Bridget's dock rather than a usable-looking
 * one.
 *
 * NOTHING HERE IS TYPED TO ANY ONE METHOD. The slot renders whatever pack the
 * registry holds, from the pack's own fields. It does not know what D-3 is,
 * and it must never learn — the same seat has to hold carbon screening and the
 * other D-methods later.
 */

import { fittedPack, type MethodPack } from '../lib/methodPacks';

const TIER_LABEL: Record<MethodPack['tier'], string> = {
  screening: 'Screening · not verified',
};

export default function QuantificationWorksheet() {
  const pack = fittedPack();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px var(--gutter) 64px' }}>
        <header style={{ marginBottom: 26 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Quantification
          </div>
          <h1 className="t-h3" style={{ margin: '0 0 10px' }}>
            What benefit would this project produce?
          </h1>
          <p className="t-body" style={{ margin: 0, color: 'var(--ink-2)', maxWidth: '62ch' }}>
            This step holds method packs — one tool for each way of working a number out. Nothing is
            filled in for you, and reloading clears whatever you enter.
          </p>
        </header>

        <div className="eyebrow" style={{ marginBottom: 12 }}>
          The pack in this slot
        </div>

        {pack ? <PackSummary pack={pack} /> : <EmptySlot />}

        <div className="eyebrow" style={{ margin: '30px 0 12px' }}>
          What this step will and will not tell you
        </div>
        <p className="t-caption" style={{ margin: '0 0 10px', maxWidth: '64ch', lineHeight: 1.7 }}>
          Every number this step produces is a <strong>screening estimate</strong> — an early figure
          to see whether a project looks worth pursuing. It is not a delivered volume, it is not a
          verified one, and it needs consultant review before it is used for anything.
        </p>
        <p className="t-caption" style={{ margin: 0, maxWidth: '64ch', lineHeight: 1.7 }}>
          This console keeps no memory between visits, so nothing you enter here is stored or
          carried anywhere else.
        </p>
      </div>
    </div>
  );
}

/** The honest empty slot. The step is built; nothing is fitted to it. */
function EmptySlot() {
  return (
    <div
      style={{
        border: '1px dashed color-mix(in oklab, var(--ink-4) 70%, transparent)',
        borderRadius: 'var(--r-md)',
        padding: '24px 22px',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8 }}>No method pack is fitted yet.</div>
      <p className="t-caption" style={{ margin: 0, maxWidth: '62ch', lineHeight: 1.7 }}>
        The step is built and the slot is empty. The first pack — a screening estimate of the water
        volume a household or community supply project provides — is being built now, and its
        questions will appear here when it can actually answer them.
      </p>
    </div>
  );
}

/**
 * A fitted pack, rendered from the pack's own fields.
 *
 * The citation is rendered by the console from the pack's committed record —
 * never written by an agent, per CITATIONS.md.
 */
function PackSummary({ pack }: { pack: MethodPack }) {
  return (
    <>
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          padding: '13px 16px',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5 }}>{pack.name}</div>
          <div className="t-caption" style={{ marginTop: 2, fontSize: 12.5 }}>
            {pack.scope}
          </div>
        </div>
        <span
          className="t-mono"
          style={{
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            padding: '5px 9px',
            borderRadius: 'var(--r-pill)',
            color: 'var(--bot-calvin)',
            border: '1px solid color-mix(in oklab, var(--bot-calvin) 32%, transparent)',
            background: 'color-mix(in oklab, var(--bot-calvin) 7%, var(--card))',
          }}
        >
          {TIER_LABEL[pack.tier]}
        </span>
      </div>
      <p className="t-caption" style={{ margin: '10px 0 0', fontSize: 11.5 }}>
        {pack.citation.document} · {pack.citation.version} · {pack.citation.section} ·{' '}
        {pack.citation.page} ·{' '}
        <a className="wb-cite-link" href={pack.citation.href} target="_blank" rel="noreferrer">
          {pack.citation.href}
        </a>
      </p>
    </>
  );
}
