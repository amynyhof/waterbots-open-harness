/**
 * Bridget's screen — the map's seat on the agent screen. Item S16, slice 4,
 * 9 Sep 2026. It replaces ChatPanel, her dock on the right, which is retired;
 * the crew rail with the save button stands where it stood.
 *
 * HER CHAT IS NOT LIVE, so the screen opens on Tool, which is the map, and
 * the Chat tab carries the one plain line saying she is not answering here
 * yet — maintainer's ruling 1 of 9 Sep 2026. No composer. No scripted
 * greeting. Her roadmap line, the statement of intent that sat in her dock,
 * follows the line at caption size.
 *
 * THE MAP IS THE TOOL, and it is the same BasinMap the shell drew in the
 * centre until this slice — moved inside her screen, still mounted for the
 * whole visit, and kept at full size under visibility:hidden when another tab
 * is up, so nothing is redrawn on a tab switch. The pin still writes the
 * visit's place through the shell; the map's status line still reaches the
 * header. Nothing about the map's data, licences or attribution moves.
 *
 * HER KNOWLEDGE PACK IS THE MAP'S TWO DATASETS. Bridget carries no rule
 * cards; what she works from is HydroSHEDS HydroBASINS for the basins and WRI
 * Aqueduct 4.0 for water stress, and the tab names both with the citations
 * the licences module already carries, never re-typed. The derived-value
 * rule is stated where the values are described (CLAUDE.md, data licensing).
 *
 * BRIDGET IS SHARED, NOT COPIED (BRAND.md §6): same accent, same portrait,
 * same name as the shared crew's. Surf may carry a keyline and a tint and
 * never text, so her name is set in ink, as everywhere else.
 */

import bridgetPortrait from '../../brand/assets/bots/bridget.svg';
import type { AgentHost } from '../chat/evidence';
import { nextPhaseAfter } from '../lib/journey';
import {
  AQUEDUCT_CITATION,
  AQUEDUCT_LICENCE,
  HYDROBASINS_CITATION,
  HYDROSHEDS_CITATION,
} from '../lib/licences';
import { PROJECT_MAPPING_NOTE } from '../lib/site';
import type { Surface } from '../lib/surfaces';
import type { MapPin } from '../lib/visit';
import AgentScreen from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import NotLiveChat from '../screen/NotLiveChat';
import { SCREEN_COLUMN } from '../screen/ScreenChat';
import BasinMap, { type MapStatus } from './BasinMap';

export const BRIDGET: AgentHost = {
  name: 'Bridget',
  role: 'Map',
  portrait: bridgetPortrait,
  colourToken: '--bot-bridget',
  /* Neither is shown while her chat is not live; both are stated so the host
     is complete on the day it is. */
  composerPlaceholder: 'Reply to Bridget',
  composerNote: 'Nothing is kept between visits.',
  thinkingLine: 'Bridget is looking at the map…',
};

/** The one plain line — ruling 1, 9 Sep 2026. A visitor's words. */
const NOT_LIVE_LINE = 'Bridget is not answering here yet. The map works: click a basin to pin it.';

export default function BridgetScreen({
  onStatus,
  pinnedHybas,
  onPin,
  onNavigate,
}: {
  onStatus: (status: MapStatus) => void;
  pinnedHybas: number | null;
  onPin: (pin: MapPin | null) => void;
  onNavigate: (surface: Surface) => void;
}) {
  const next = nextPhaseAfter('map');
  const nextSurface = next?.surface ?? null;

  return (
    <AgentScreen
      host={BRIDGET}
      opensOn="tool"
      next={next && nextSurface ? { label: next.label, go: () => onNavigate(nextSurface) } : null}
      tabs={{
        chat: <NotLiveChat host={BRIDGET} line={NOT_LIVE_LINE} note={PROJECT_MAPPING_NOTE} />,
        tool: (
          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <BasinMap onStatus={onStatus} pinnedHybas={pinnedHybas} onPin={onPin} />
          </div>
        ),
        pack: <MapSources />,
        credentials: <CredentialsTab host={BRIDGET} />,
      }}
    />
  );
}

/* --------------------------------------------------------------------------
   Her Knowledge Pack — the two datasets the map is drawn from, cited as the
   licences module cites them.
   -------------------------------------------------------------------------- */

const SOURCES = [
  {
    badge: 'HB',
    title: 'HydroSHEDS HydroBASINS — the basins',
    lines: [HYDROBASINS_CITATION, HYDROSHEDS_CITATION],
  },
  {
    badge: 'AQ',
    title: 'WRI Aqueduct 4.0 — water stress',
    lines: [AQUEDUCT_CITATION, AQUEDUCT_LICENCE],
  },
];

export function MapSources() {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: SCREEN_COLUMN, margin: '0 auto', padding: '22px var(--gutter) 24px' }}>
        <h2 style={{ fontSize: 20, margin: '0 0 8px', letterSpacing: '-0.015em', lineHeight: 1.25 }}>
          {BRIDGET.name}&rsquo;s Knowledge Pack
        </h2>
        <p className="t-body" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
          Bridget carries no rule cards. Her tool is the map, drawn from two published datasets.
          From zoom 5 the map shows WRI&rsquo;s published water-stress figures for each basin; the
          world view&rsquo;s colours are derived from them, an area-weighted majority of each larger
          basin&rsquo;s children, and the legend says so. The full attributions and licences are
          under &ldquo;Data &amp; licences&rdquo; on the map.
        </p>

        <div className="wb-pack-sec">
          <span className="label" style={{ color: 'var(--ink-3)' }}>
            THE DATASETS
          </span>
        </div>
        <div className="wb-pack-group">
          {SOURCES.map((source) => (
            <div key={source.badge}>
              <div className="wb-pack-row" style={{ cursor: 'default' }}>
                <span className="wb-pack-badge">{source.badge}</span>
                <span>{source.title}</span>
              </div>
              <div className="wb-pack-open">
                {source.lines.map((line, i) => (
                  <p key={i} style={{ margin: i === 0 ? 0 : '8px 0 0' }}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
