/**
 * The chat panel — the shell only.
 *
 * v1 builds the seat, not the agent. There are NO scripted messages, no fake
 * typing indicator, and no composer that appears to work. An empty, honest
 * state beats a fabricated one, and a live-looking input that silently does
 * nothing is a false success state.
 *
 * Chrome recedes (BRAND.md §8.3a): the dock sits below the canvas on
 * --chrome, flush and square, in the 360-380px band, with host presence
 * pinned at the top rather than stretched down the panel.
 *
 * BRIDGET IS A PLACEHOLDER HOST. Final staffing of the map is an open
 * maintainer decision, and her identity colour is provisional — the roster
 * assigns her Surf, which carries no agent identity in this repo, so she
 * inherits the Surf-family lifted value. At 1.68:1 against white it carries
 * her keyline, ring and wash, never text.
 */

const HOST = {
  name: 'Bridget',
  role: 'Partnerships',
};

export default function ChatPanel() {
  return (
    <aside
      className="chrome"
      aria-label={`${HOST.name}, ${HOST.role}`}
      style={{
        width: 'var(--chat-rail)',
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid var(--line)',
      }}
    >
      {/* Host presence, pinned to the top. */}
      <div
        style={{
          display: 'flex',
          gap: 11,
          alignItems: 'center',
          padding: '14px 16px',
          borderBottom: '1px solid var(--line)',
          flex: 'none',
        }}
      >
        <HostMark />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--fg-1)' }}>{HOST.name}</div>
          <div className="t-caption" style={{ fontSize: 11.5 }}>
            {HOST.role}
          </div>
        </div>
      </div>

      {/* The honest empty state. Complete sentences, no urgency, no emoji. */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px' }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Not live yet
        </div>
        <p className="t-body" style={{ margin: '0 0 12px', color: 'var(--fg-2)', fontSize: 14 }}>
          Bridget is not answering yet. This panel is the foundation for the chat console, and it is
          deliberately empty until she can give you a real answer.
        </p>
        <p className="t-caption" style={{ margin: 0, lineHeight: 1.6 }}>
          Which agent staffs this map is still an open decision, so nothing here is final.
        </p>
      </div>

      {/* Disabled composer. It states why, rather than looking usable. */}
      <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--line)', flex: 'none' }}>
        <label htmlFor="wb-composer" className="label" style={{ display: 'block', marginBottom: 6 }}>
          Message {HOST.name}
        </label>
        <textarea
          id="wb-composer"
          className="wb-composer"
          rows={2}
          disabled
          placeholder="Bridget is not live yet."
          aria-describedby="wb-composer-note"
        />
        <p id="wb-composer-note" className="t-caption" style={{ margin: '7px 0 0', fontSize: 11 }}>
          The composer is disabled because there is no agent behind it. It will be enabled when
          Bridget can answer.
        </p>
      </div>
    </aside>
  );
}

/**
 * Bridget's identity mark.
 *
 * A ring and wash in her identity colour, with her initial. The crew portraits
 * are the product's real iconography, but brand/assets/ is gitignored pending
 * the deployment-time publish decision — bundling a portrait now would both
 * pre-empt that decision and break a build from a fresh clone. The slot is
 * here and the swap is one element.
 */
function HostMark() {
  return (
    <span
      aria-hidden
      style={{
        width: 34,
        height: 34,
        borderRadius: 'var(--r-pill)',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: 'color-mix(in oklab, var(--bot-bridget) 30%, transparent)',
        border: '1.5px solid var(--bot-bridget)',
        color: 'var(--fg-1)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      B
    </span>
  );
}
