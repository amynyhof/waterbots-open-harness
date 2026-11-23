/**
 * Bridget's screen — the map's seat on the agent screen. Item S16, slice 4,
 * 9 Sep 2026. It replaces ChatPanel, her dock on the right, which is retired;
 * the crew rail with the save button stands where it stood.
 *
 * HER CHAT IS LIVE FROM 31 OCT 2026, the maintainer's ruling on #167 (item
 * A22, step 6 of the Road to v1). The strip of fixed lines above the map that
 * #167 first built is gone. The screen opens on her chat, as Phoebe's does.
 *
 * THE MAP HAS ITS OWN TAB, "Map", beside Chat, Knowledge pack and Credentials —
 * the same tab layout the other agents use, the map at full width. The
 * maintainer's third ruling of 31 Oct 2026, after the captures of the chat and
 * map side by side. The first time the Map tab opens for a place, it opens on
 * the country the visitor told Wellington (placeBox, src/lib/placeBox.ts), or
 * on the whole world when no single country is named; never a guess. A new pin
 * takes the visitor back to Chat, where her answer about it lands.
 *
 * HOW A VISIT GOES — the maintainer's rulings of 31 Oct and 14 Nov 2026.
 * The first time her step shows, Wellington's line to her heads the chat, and
 * the console sends `opened`: she answers in her own words, short — who she
 * is, why the basin matters, and her one question, the pin. Each new pin sends
 * `pinned`: she thanks the visitor, reports the basin and its reading, says
 * when it is derived, and says Wellington will join with the next step.
 * WELLINGTON COMES TO YOU (14 Nov 2026): when her part is done he joins this
 * chat with the next step and its button. She has no button of her own, and
 * no agent sends the visitor back to him.
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

import { useContext, useEffect, useRef, useState } from 'react';
import bridgetPortrait from '../../brand/assets/bots/bridget.svg';
import type { AgentHost, AgentTurn } from '../chat/evidence';
import { useConversation } from '../chat/useConversation';
import { meetShowing } from '../lib/blue';
import { Reached } from '../chat/reached';
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
  NATURAL_EARTH_HREF,
} from '../lib/licences';
import type { Surface } from '../lib/surfaces';
import { WELLINGTON } from '../lib/wellington';
import { citedDocument, toolSummary, toolVersion } from '../lib/toolReadmes';
import { placeBox } from '../lib/placeBox';
import type { MapPin } from '../lib/visit';
import type { Bbox } from '../lib/basins';
import AgentScreen, { type ScreenTab } from '../screen/AgentScreen';
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
  /* No line under her chat box, the maintainer's word of 13 Nov 2026, as Wellington's
     went on 12 Nov: the daily cap still says so when it is reached. */
  thinkingLine: 'Bridget is looking at the map…',
};

export default function BridgetScreen({
  onStatus,
  pin,
  onPin,
  place,
  phone,
  quantifyNext,
  visible,
  invite = '',
  onWellington,
  onMeet,
  onMapTab,
}: {
  onStatus: (status: MapStatus) => void;
  pin: MapPin | null;
  onPin: (pin: MapPin | null) => void;
  /** Where the project is, in the visitor's words, or blank. Never the pin's own line. */
  place: string;
  onNavigate: (surface: Surface) => void;
  phone: boolean;
  /** True when the right rail offers Quantify: then Calvin is next after the pin, not Wellington. */
  quantifyNext: boolean;
  /** True while Partners is the visible step — her first answer runs then, not on mount. */
  visible: boolean;
  /**
   * Wellington's line to her, shown at the top of her chat before her opening —
   * "Wellington comes to you", 14 Nov 2026. Display only, never sent to her.
   */
  invite?: string;
  /** Brings Wellington into her chat with the next step, once her part is done. */
  onWellington?: (at: 'eligibility' | 'map', composerId: string) => Promise<AgentTurn | null>;
  /** Tells the shell whether "Meet <name>" is under her chat's latest turn (one blue button, 16 Nov 2026). */
  onMeet?: (showing: boolean) => void;
  /** Tells the shell whether her Map tab is the one in view, so the map's line in the menu shows only with the map (21 Nov 2026). */
  onMapTab?: (open: boolean) => void;
}) {
  /* WELLINGTON COMES TO YOU — the maintainer's ruling of 14 Nov 2026. When her
     part is done (a basin reported, or a question not hers) he joins this chat
     with the next step and its button, under his own face. No agent sends the
     visitor back to him. */
  async function wellingtonJoins() {
    if (!onWellington) return;
    const turn = await onWellington('map', 'wb-bridget-composer');
    if (turn) chatRef.current.append([{ ...turn, speaker: WELLINGTON }]);
  }

  async function ask(
    history: { role: 'user' | 'agent'; text: string }[],
    signal: AbortSignal,
    meta?: { opened?: boolean; introduced?: boolean; pinned?: boolean }
  ): Promise<AgentTurn> {
    const answer = await askBridget(
      history.map(({ role, text }) => ({
        role: role === 'agent' ? ('assistant' as const) : ('user' as const),
        content: text,
      })),
      { place, phone, pin, quantifyNext },
      signal,
      { opened: meta?.opened === true, introduced: meta?.opened === true && meta.introduced === true, pinned: meta?.pinned === true }
    );
    /* After her answer lands, he joins: from the field alone. */
    if (answer.handBack === 'wellington') window.setTimeout(() => void wellingtonJoins(), 0);
    return {
      role: 'agent',
      text: answer.reply,
      evidence: [],
      abstained: answer.abstained,
    };
  }

  const chat = useConversation(ask, BRIDGET.name);
  /* ONE BLUE BUTTON (16 Nov 2026): the shell decides which button is blue, so
     it is told whether Wellington's "Meet <name>" is the latest thing here. */
  const reached = useContext(Reached);
  const meet = meetShowing(chat.turns, reached);
  useEffect(() => {
    onMeet?.(meet);
  }, [meet, onMeet]);
  const chatRef = useRef(chat);
  chatRef.current = chat;

  /* The first time her step shows, she introduces herself and asks her one question. */
  const opened = useRef(false);
  useEffect(() => {
    if (!visible || opened.current) return;
    opened.current = true;
    /* His line to her first, then her opening. */
    if (invite.trim()) {
      chatRef.current.seed([{ role: 'agent', text: invite.trim(), evidence: [], speaker: WELLINGTON }]);
    }
    void chatRef.current.askOpened({ opened: true, introduced: invite.trim() !== '' });
  }, [visible, invite]);

  /* The tab is held here, so a pin can bring the visitor back to Chat. */
  const [tab, setTab] = useState<ScreenTab>('chat');
  useEffect(() => {
    onMapTab?.(tab === 'tool');
  }, [tab, onMapTab]);

  /* THE MAP ZOOMS TO THE COUNTRY BY ITSELF — the ruling of 31 Oct 2026, made
     firmer on 14 Nov 2026 (B2), after a walk where the visitor was asked to
     find Kenya. The view is set as soon as the place is known, before the Map
     tab is ever opened, and set again the first time the tab opens for that
     place, in case the panel's size moved underneath it. Once per place: a
     reader who pans away and comes back is left where they were. No single
     country named, no move — the map's own view is the whole world. */
  const [focus, setFocus] = useState<{ box: Bbox; key: number } | null>(null);
  const focusedPlace = useRef<string | null>(null);
  const shownPlace = useRef<string | null>(null);
  useEffect(() => {
    const box = placeBox(place);
    if (focusedPlace.current !== place) {
      focusedPlace.current = place;
      if (box) setFocus((f) => ({ box, key: (f?.key ?? 0) + 1 }));
    }
    if (tab === 'tool' && shownPlace.current !== place) {
      shownPlace.current = place;
      if (box) setFocus((f) => ({ box, key: (f?.key ?? 0) + 1 }));
    }
  }, [tab, place]);

  /* A new basin takes the visitor back to Chat, where her answer about it lands. */
  const pinnedId = pin?.hybasId ?? null;
  const lastPinned = useRef<number | null>(null);
  useEffect(() => {
    if (pinnedId === null || pinnedId === lastPinned.current) return;
    lastPinned.current = pinnedId;
    setTab('chat');
  }, [pinnedId]);

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
      toolLabel="Map"
      active={tab}
      onActiveChange={setTab}
      tabs={{
        chat: <ScreenChat host={BRIDGET} chat={chat} composerId="wb-bridget-composer" />,
        tool: (
          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <BasinMap onStatus={onStatus} pinnedHybas={pin?.hybasId ?? null} onPin={onPin} focus={focus} />
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
          under &ldquo;Data &amp; licences&rdquo; on the map. When a visitor has named a country, the
          map opens on it, using the box around each country from{' '}
          <a href={NATURAL_EARTH_HREF} target="_blank" rel="noreferrer">
            Natural Earth
          </a>
          &rsquo;s 1:110m Admin 0 – Countries, v5.1.2, which is public domain. Nothing from it is
          drawn on the map.
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
