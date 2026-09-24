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
 * IT IS DRAWN BY THE SHARED COMPONENT from 24 Sep 2026, the Knowledge-tab
 * proposal's step 3 and ruling R6. MapSources, her own second drawing of the
 * same look, is retired: one component now draws every agent's Knowledge tab,
 * which is how a rule binding "every agent's Knowledge tab" stays kept. Each
 * dataset row gained its tool folder's version, its plain-words line and its
 * publisher's canonical link, and the tab gained the Evals section every
 * agent's tab carries. NOTHING ABOUT THE MAP'S DATA, LICENCES OR ATTRIBUTION
 * MOVED: the two attributions are still two rows, the WWF statement is still
 * text, and the words under each row are the licences module's, verbatim.
 *
 * BRIDGET IS SHARED, NOT COPIED (BRAND.md §6): same accent, same portrait,
 * same name as the shared crew's. Surf may carry a keyline and a tint and
 * never text, so her name is set in ink, as everywhere else.
 */

import bridgetPortrait from '../../brand/assets/bots/bridget.svg';
import type { AgentHost } from '../chat/evidence';
import { nextPhaseAfter, nextPhaseCompetes } from '../lib/journey';
import {
  AQUEDUCT_CITATION,
  AQUEDUCT_HREF,
  AQUEDUCT_LICENCE,
  AQUEDUCT_PUBLISHER,
  HYDROBASINS_CITATION,
  HYDROSHEDS_CITATION,
  HYDROSHEDS_HREF,
  HYDROSHEDS_PUBLISHER,
} from '../lib/licences';
import { PROJECT_MAPPING_NOTE } from '../lib/site';
import type { Surface } from '../lib/surfaces';
import { citedDocument, toolSummary, toolVersion } from '../lib/toolReadmes';
import type { MapPin } from '../lib/visit';
import AgentScreen from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import KnowledgePackTab, { type PackRow, type PackView } from '../screen/KnowledgePackTab';
import NotLiveChat from '../screen/NotLiveChat';
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
  inviteSurface,
}: {
  onStatus: (status: MapStatus) => void;
  pinnedHybas: number | null;
  onPin: (pin: MapPin | null) => void;
  onNavigate: (surface: Surface) => void;
  inviteSurface: Surface | null;
}) {
  const next = nextPhaseAfter('map');
  const nextSurface = next?.surface ?? null;

  return (
    <AgentScreen
      host={BRIDGET}
      opensOn="tool"
      next={next && nextSurface ? { label: next.label, go: () => onNavigate(nextSurface) } : null}
      nextQuiet={nextPhaseCompetes('map', inviteSurface)}
      tabs={{
        chat: <NotLiveChat host={BRIDGET} line={NOT_LIVE_LINE} note={PROJECT_MAPPING_NOTE} />,
        tool: (
          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <BasinMap onStatus={onStatus} pinnedHybas={pinnedHybas} onPin={onPin} />
          </div>
        ),
        pack: <KnowledgePackTab view={BRIDGET_PACK} />,
        credentials: <CredentialsTab host={BRIDGET} />,
      }}
    />
  );
}

/* --------------------------------------------------------------------------
   Her Knowledge Pack, assembled from the two dataset folders and the licences
   module — build-order step 1 under "V1 — the done line", 24 Sep 2026.

   WHAT COMES FROM WHERE. The row's plain words and its tool version come from
   knowledge-packs/bridget-map/tools/<id>/README.md, which is the folder's own
   statement of what it is; the document and its version come from that
   README's cited-document table; the publisher and the canonical link come
   from src/lib/licences.ts, the one home for this site's attribution facts;
   and the words inside each open row are the licences module's required
   strings, verbatim and unchanged. Nothing on this tab is typed twice.

   A DATASET HAS NO PAGE. The cite line draws document · version · publisher →
   link, and CiteLine drops the empty page slot rather than drawing it blank.
   -------------------------------------------------------------------------- */

const BASINS = 'hydrosheds-hydrobasins';
const STRESS = 'wri-aqueduct-4.0';

/** One dataset row: what it is, then the citations the licence requires. */
function datasetRow(
  id: string,
  badge: string,
  title: string,
  publisher: string,
  href: string,
  citations: { heading: string; lines: string[] }[]
): PackRow {
  const cited = citedDocument(id);
  return {
    id: `dataset-${id}`,
    badge,
    title,
    tag: `v${toolVersion(id)}`,
    layers: [
      { heading: 'What it is', text: toolSummary(id) },
      ...citations.map((c) =>
        c.lines.length === 1 ? { heading: c.heading, text: c.lines[0] } : { heading: c.heading, bullets: c.lines }
      ),
    ],
    citation: {
      document: cited.document,
      version: cited.version,
      section: publisher,
      page: '',
      full: `${cited.document} · ${cited.version} · ${publisher}`,
      href,
    },
  };
}

export const BRIDGET_PACK: PackView = {
  heading: `${BRIDGET.name}’s Knowledge Pack`,
  /* One section, unlabelled: two datasets, not two pathways. It carries no
     tags and no version of its own — in the old pack shape each tool folder
     is the versioned thing, so the version sits on the row (item K9). */
  sections: [
    {
      key: 'datasets',
      tags: [],
      version: null,
      source: (
        <>
          Bridget carries no rule cards. Her tool is the map, drawn from two published datasets.
          From zoom 5 the map shows WRI&rsquo;s published water-stress figures for each basin; the
          world view&rsquo;s colours are derived from them, an area-weighted majority of each larger
          basin&rsquo;s children, and the legend says so. The full attributions and licences are
          under &ldquo;Data &amp; licences&rdquo; on the map.
        </>
      ),
      sets: [
        {
          label: 'THE DATASETS · 2 PUBLISHED SOURCES',
          approved: null,
          rows: [
            datasetRow(BASINS, 'HB', 'HydroSHEDS HydroBASINS — the basins', HYDROSHEDS_PUBLISHER, HYDROSHEDS_HREF, [
              { heading: 'Scientific citations', lines: [HYDROBASINS_CITATION, HYDROSHEDS_CITATION] },
            ]),
            datasetRow(STRESS, 'AQ', 'WRI Aqueduct 4.0 — water stress', AQUEDUCT_PUBLISHER, AQUEDUCT_HREF, [
              { heading: 'Scientific citation', lines: [AQUEDUCT_CITATION] },
              { heading: 'Licence', lines: [AQUEDUCT_LICENCE] },
            ]),
          ],
        },
      ],
    },
  ],
  evals: true,
};
