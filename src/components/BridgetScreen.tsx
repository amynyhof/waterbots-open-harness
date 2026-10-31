/**
 * Bridget's screen — the map's seat on the agent screen. Item S16, slice 4,
 * 9 Sep 2026. It replaces ChatPanel, her dock on the right, which is retired;
 * the crew rail with the save button stands where it stood.
 *
 * HER CHAT IS LIVE FROM 31 OCT 2026, the maintainer's ruling on #167 (item
 * A22, step 6 of the Road to v1), and her map stands beside it on the Chat
 * tab — side by side on a computer, the map above the chat on a phone. The
 * strip of fixed lines above the map that #167 first built is gone, and so is
 * the separate Tool tab: the map is not somewhere else to go, it is what she
 * is talking about. The screen opens on her chat, as Phoebe's does.
 *
 * HOW A VISIT GOES. Her first message is the maintainer's, word for word,
 * shown the moment the chat mounts (BRIDGET_GREETING, api/_bridgetPrompt.ts,
 * held byte-identical to the copy here by scripts/check-wellington.mjs). The
 * first time her step shows, the console asks her to follow it — `opened`,
 * the pattern of Phoebe's first open — and she asks her one question, the pin,
 * in the place's own words. Each new pin sends `pinned`, and she reports the
 * basin and its reading, says when it is derived, and hands back to Wellington
 * by the field. The way back to Dispatches is drawn from that field, as
 * Phoebe's is; no next step is drawn here, because next steps live in the
 * right rail only (ruled 30 Sep 2026) and the pin has already moved the visit
 * on there (pinnedVisit, src/lib/visit.ts).
 *
 * THE MAP IS THE SAME BasinMap the shell drew in the centre until slice 4,
 * still mounted for the whole visit, and kept at full size under
 * visibility:hidden when another tab is up, so nothing is redrawn on a tab
 * switch. The pin still writes the visit's place through the shell; the map's
 * status line still reaches the header. Nothing about the map's data, licences
 * or attribution moves.
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

import { useEffect, useRef } from 'react';
import bridgetPortrait from '../../brand/assets/bots/bridget.svg';
import type { AgentHost, AgentTurn } from '../chat/evidence';
import { useConversation } from '../chat/useConversation';
import { askBridget } from '../lib/bridgetClient';
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
import { DESK_LABEL, type Surface } from '../lib/surfaces';
import { citedDocument, toolSummary, toolVersion } from '../lib/toolReadmes';
import type { MapPin } from '../lib/visit';
import AgentScreen from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import KnowledgePackTab, { type PackRow, type PackView } from '../screen/KnowledgePackTab';
import ScreenChat from '../screen/ScreenChat';
import BasinMap, { type MapStatus } from './BasinMap';

export const BRIDGET: AgentHost = {
  name: 'Bridget',
  role: 'Map',
  portrait: bridgetPortrait,
  colourToken: '--bot-bridget',
  composerPlaceholder: 'Reply to Bridget',
  composerNote: 'Nothing is kept between visits. Thirty messages a day.',
  thinkingLine: 'Bridget is looking at the map…',
};

/**
 * Her first message — the maintainer's words of 31 Oct 2026, word for word.
 * The relay's copy is BRIDGET_GREETING in api/_bridgetPrompt.ts; the check
 * holds the two byte-identical. Never edited without her.
 */
export const BRIDGET_GREETING =
  "Hi, I'm Bridget. I'm still being built, so today I can only help you pin your project and tell you about the water stress in that area. Soon I'll also help you find other projects and funders where you work.";

/** Shown in her name and never sent as her turn: the relay's prompt tells her it is already on the screen. */
const GREETING_TURN: AgentTurn = { role: 'agent', text: BRIDGET_GREETING, evidence: [], speaker: BRIDGET };

export default function BridgetScreen({
  onStatus,
  pin,
  onPin,
  place,
  onNavigate,
  phone,
  visible,
}: {
  onStatus: (status: MapStatus) => void;
  pin: MapPin | null;
  onPin: (pin: MapPin | null) => void;
  /** Where the project is, in the visitor's words, or blank. Never the pin's own line. */
  place: string;
  onNavigate: (surface: Surface) => void;
  phone: boolean;
  /** True while Partners is the visible step — her first answer runs then, not on mount. */
  visible: boolean;
}) {
  async function ask(
    history: { role: 'user' | 'agent'; text: string }[],
    signal: AbortSignal,
    meta?: { opened?: boolean; pinned?: boolean }
  ): Promise<AgentTurn> {
    const answer = await askBridget(
      history.map(({ role, text }) => ({
        role: role === 'agent' ? ('assistant' as const) : ('user' as const),
        content: text,
      })),
      { place, phone, pin },
      signal,
      { opened: meta?.opened === true, pinned: meta?.pinned === true }
    );
    return {
      role: 'agent',
      text: answer.reply,
      evidence: [],
      abstained: answer.abstained,
      /* The way back to him, from the field alone — Phoebe's hand-back. */
      ...(answer.handBack === 'wellington'
        ? { action: { label: `Back to Wellington on ${DESK_LABEL}`, go: () => onNavigate('desk') } }
        : {}),
    };
  }

  const chat = useConversation(ask, BRIDGET.name);
  const chatRef = useRef(chat);
  chatRef.current = chat;

  /* Her first message is on the thread from the start. */
  const greeted = useRef(false);
  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    chatRef.current.seed([GREETING_TURN]);
  }, []);

  /* The first time her step shows, she follows it with her one question. */
  const opened = useRef(false);
  useEffect(() => {
    if (!visible || opened.current) return;
    opened.current = true;
    void chatRef.current.askOpened({ opened: true });
  }, [visible]);

  /* Each new basin is reported once, after anything in flight has landed. An
     unpin says nothing; pinning the same basin again is not a new one. */
  const reported = useRef<number | null>(null);
  useEffect(() => {
    if (!pin || chat.pending || !opened.current) return;
    if (reported.current === pin.hybasId) return;
    reported.current = pin.hybasId;
    void chatRef.current.askOpened({ pinned: true });
  }, [pin, chat.pending]);

  return (
    <AgentScreen
      host={BRIDGET}
      tabs={{
        chat: (
          <div className="wb-bridget-split">
            <div className="wb-bridget-chat">
              <ScreenChat host={BRIDGET} chat={chat} composerId="wb-bridget-composer" />
            </div>
            <div className="wb-bridget-map" aria-label="The basin map">
              <BasinMap onStatus={onStatus} pinnedHybas={pin?.hybasId ?? null} onPin={onPin} />
            </div>
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
