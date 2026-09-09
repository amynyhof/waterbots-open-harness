/**
 * Calvin's screen — the calculator's seat on the agent screen. Item S16,
 * slice 4, 9 Sep 2026. It replaces CalvinPanel, his dock on the right, which
 * is retired; the crew rail with the save button stands where it stood.
 *
 * HIS CHAT IS NOT LIVE, so the screen opens on Tool, which is the
 * quantification worksheet, and the Chat tab carries the one plain line
 * saying he is not answering here yet — maintainer's ruling 1 of 9 Sep 2026.
 * No composer.
 *
 * THE DOCK'S CAVEAT STRIP IS NOT CARRIED OVER, and nothing is lost by that:
 * the worksheet says "screening, not verified" on its method strip, on the
 * result and on the consultant-review tag, wherever a figure renders. The
 * strip was a second statement of the same thing beside the first.
 *
 * HIS KNOWLEDGE PACK IS THE METHOD PACKS. Calvin carries no rule cards; what
 * he works from is the registry in src/lib/methodPacks.ts — one row per live
 * pack, its name, what it measures, its scope, and its citation, all read
 * from the pack and never re-typed. A pack added to the registry appears
 * here the same day.
 *
 * THERE IS NO "NEXT PHASE" ON QUANTIFY. The phase after it is Plan, which
 * opens with a saved project, so the way on is the save button at the foot
 * of the crew rail — the proposal's fourth slice, approved 8 Sep 2026.
 *
 * PLUM IS A KNOWING EXCEPTION (BRAND.md §6): the maintainer pointed Reggie's
 * accent at Calvin on 31 Aug 2026 and paired it with a shape of his own. The
 * shape is now his screen; the accent is read from his token as ever.
 */

import calvinPortrait from '../../brand/assets/bots/calvin.svg';
import type { AgentHost } from '../chat/evidence';
import { nextPhaseAfter } from '../lib/journey';
import { livePacks, type PackValues } from '../lib/methodPacks';
import type { Surface } from '../lib/surfaces';
import AgentScreen from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import KnowledgePackTab, { type PackView } from '../screen/KnowledgePackTab';
import NotLiveChat from '../screen/NotLiveChat';
import QuantificationWorksheet from './QuantificationWorksheet';

export const CALVIN: AgentHost = {
  name: 'Calvin',
  role: 'Calculator',
  portrait: calvinPortrait,
  colourToken: '--bot-calvin',
  composerPlaceholder: 'Reply to Calvin',
  composerNote: 'Nothing is kept between visits.',
  thinkingLine: 'Calvin is working it out…',
};

/** The one plain line — ruling 1, 9 Sep 2026. A visitor's words. */
const NOT_LIVE_LINE =
  'Calvin is not answering here yet. The calculator works: pick a method and type in what you know.';

export default function CalvinScreen({
  activeKey,
  onSelect,
  allValues,
  onChange,
  onNavigate,
}: {
  activeKey: string;
  onSelect: (key: string) => void;
  allValues: Record<string, PackValues>;
  onChange: (key: string, values: PackValues) => void;
  onNavigate: (surface: Surface) => void;
}) {
  const next = nextPhaseAfter('quantification');
  const nextSurface = next?.surface ?? null;

  return (
    <AgentScreen
      host={CALVIN}
      opensOn="tool"
      next={next && nextSurface ? { label: next.label, go: () => onNavigate(nextSurface) } : null}
      tabs={{
        chat: <NotLiveChat host={CALVIN} line={NOT_LIVE_LINE} />,
        tool: (
          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <QuantificationWorksheet
              activeKey={activeKey}
              onSelect={onSelect}
              allValues={allValues}
              onChange={onChange}
            />
          </div>
        ),
        pack: <KnowledgePackTab view={CALVIN_PACK} />,
        credentials: <CredentialsTab host={CALVIN} />,
      }}
    />
  );
}

/* --------------------------------------------------------------------------
   His Knowledge Pack, assembled from the registry.
   -------------------------------------------------------------------------- */

const PACKS = livePacks();

const CALVIN_PACK: PackView = {
  heading: "Calvin's Knowledge Pack",
  tags: PACKS.map((p) => p.citation.document).filter((d, i, all) => all.indexOf(d) === i),
  approved: null,
  source: (
    <>
      Calvin carries no rule cards. He works from {PACKS.length} method packs, one tool per way of
      working a number out, each read from its published method and cited beneath. Everything a
      pack produces is a screening estimate: anticipated, not delivered, and not verified.
    </>
  ),
  groups: [
    {
      label: `METHOD PACKS · ${PACKS.length} LIVE`,
      rows: PACKS.map((p) => ({
        id: `pack-${p.key}`,
        badge: String(PACKS.indexOf(p) + 1),
        title: p.name,
        layers: [
          { heading: 'What it measures', text: p.measures },
          { heading: 'What it covers', text: p.scope },
          { heading: 'The indicator', text: `${p.method.indicator}, in ${p.method.indicatorUnit}. ${p.method.definition}` },
        ],
        citation: p.citation,
      })),
    },
  ],
};
