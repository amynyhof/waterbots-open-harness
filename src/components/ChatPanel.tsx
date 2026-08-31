/**
 * The chat panel — the shell only.
 *
 * v1 builds the seat, not the agent. There are NO scripted messages, no fake
 * typing indicator, and no composer that appears to work. An empty, honest
 * state beats a fabricated one, and a live-looking input that silently does
 * nothing is a false success state.
 *
 * The dock is a host panel, not chrome. BRAND.md §2.3 names chrome as
 * navigation, rails and top bars; a chat panel is content. It sits in the
 * 360-380px band with host presence pinned at the top rather than stretched
 * down the panel.
 *
 * BRIDGET'S CHAT IS NOT BUILT, AND SHE IS NOT A PLACEHOLDER HOST. Staffing was
 * settled on 24 Aug 2026 — she is the map's agent — and her colour was settled
 * on 29 Aug 2026 as Surf #14C8D9, assigned to her by name in BRAND.md §6.
 * What is unbuilt is her chat, and the panel says so plainly.
 *
 * At 2.04:1 against white her colour carries her keyline, ring and wash, and
 * never text; her name is set in --ink.
 */

import { PROJECT_MAPPING_NOTE } from '../lib/site';
import bridgetPortrait from '../../brand/assets/bots/bridget.svg';

const HOST = {
  name: 'Bridget',
  role: 'Partnerships',
};

export default function ChatPanel() {
  return (
    <aside
      className="wb-panel wb-dock"
      aria-label={`${HOST.name}, ${HOST.role}`}
      style={{
        /* Bridget hosts the map, so the map's dock is tinted in her accent. */
        ['--host-accent' as string]: 'var(--bot-bridget)',
        width: 'var(--chat-rail)',
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
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
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{HOST.name}</div>
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
        <p className="t-body" style={{ margin: '0 0 12px', color: 'var(--ink-2)', fontSize: 14 }}>
          Bridget is not answering yet. This panel is the foundation for the chat console, and it is
          deliberately empty until she can give you a real answer.
        </p>
        <p className="t-caption" style={{ margin: 0, lineHeight: 1.6 }}>
          Bridget is the agent for this map. Her chat is still being built, which is why there is
          nothing to read here yet.
        </p>

        <div style={{ borderTop: '1px solid var(--line)', margin: '18px 0 14px' }} />

        {/* A statement of intent, not an affordance. No button, no form, and
            no placeholder pins on the map behind it. */}
        {/* The note itself opens with "Coming:", so the eyebrow says Roadmap
            rather than repeating the word. */}
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          Roadmap
        </div>
        <p className="t-caption" style={{ margin: 0, lineHeight: 1.6 }}>
          {PROJECT_MAPPING_NOTE}
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
 * Bridget's portrait.
 *
 * The crew portraits are the product's real iconography — BRAND.md has them
 * standing in for what a normal product would do with an icon. This one is
 * published from brand/assets/bots/bridget.svg; the rest of brand/ stays
 * unpublished.
 *
 * The portrait is self-contained (its fills are baked in), so it loads as a
 * plain <img> — unlike the wordmark, which needs inlining to pick up styling.
 *
 * The wash and ring behind it come from --bot-bridget, which is Surf — the
 * same colour the portrait itself is drawn in. They disagreed until
 * 29 Aug 2026, when the lifted #7FD5DF was retired.
 */
function HostMark() {
  return (
    <span
      style={{
        /* 40px in chat — BRAND.md §6. It was 36. */
        width: 40,
        height: 40,
        borderRadius: 'var(--r-pill)',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: 'color-mix(in oklab, var(--bot-bridget) 26%, transparent)',
        border: '1.5px solid var(--bot-bridget)',
        overflow: 'hidden',
      }}
    >
      <img
        src={bridgetPortrait}
        alt=""
        width={34}
        height={34}
        style={{ display: 'block' }}
      />
    </span>
  );
}
