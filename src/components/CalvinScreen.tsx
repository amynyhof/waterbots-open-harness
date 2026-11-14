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
 * the worksheet says it is a first screening, not an official decision, on
 * its method strip and on the result, beside the consultant-review tag
 * (wording of 14 Nov 2026), wherever a figure renders. The
 * strip was a second statement of the same thing beside the first.
 *
 * HIS KNOWLEDGE PACK IS THE METHOD PACKS. Calvin carries no rule cards; what
 * he works from is the registry in src/lib/methodPacks.ts — one row per live
 * pack, its name, what it measures, its scope, and its citation, all read
 * from the pack and never re-typed. A pack added to the registry appears
 * here the same day.
 *
 * EACH ROW WEARS ITS TOOL FOLDER'S VERSION from 24 Sep 2026 (ruling R10), read
 * from knowledge-packs/calvin-quantify/tools/<key>/README.md and never typed.
 * In the old pack shape the tool folder is the versioned thing, so the version
 * sits on the row rather than beside the heading; item K9 moves his pack to
 * the new shape and the tag follows it there. The Evals section joined the
 * foot of the tab the same day (ruling R5), the same sentence every agent's
 * tab carries.
 *
 * THERE IS NO "NEXT PHASE" ON QUANTIFY. The phase after it is Plan, which
 * opens with a saved project, so the way on is the save button at the foot
 * of the crew rail — the proposal's fourth slice, approved 8 Sep 2026.
 *
 * HIS ACCENT IS REEF from 31 Oct 2026, the maintainer's ruling; it was Plum,
 * Reggie's, by a knowing exception from 31 Aug. It is read from his token as
 * ever, and it never carries text: his text is Deep Reef, from 1 Nov 2026
 * (src/styles/tokens.css).
 */

import { useState, type ReactNode } from 'react';
import type { CalculatorState, CalvinProject } from '@waterbots/calvin/screen';
import { GS4GG_CALCULATOR_VERSION } from '@waterbots/calvin/engine';
import calvinPortrait from '../../brand/assets/bots/calvin.svg';
import type { AgentHost } from '../chat/evidence';
import { livePacks, type PackValues } from '../lib/methodPacks';
import { toolVersion } from '../lib/toolReadmes';
import AgentScreen from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import KnowledgePackTab, { type PackView } from '../screen/KnowledgePackTab';
import NotLiveChat from '../screen/NotLiveChat';
import QuantificationWorksheet from './QuantificationWorksheet';
import CalvinCalculator, { RecordFacts } from './CalvinCalculator';
import { CALVIN_PACKAGE_VERSION, CALVIN_RELEASE } from '../lib/calvinProject';
import { GS_SDWS_LEGACY_V1, GS_SDWS_PAA_V2 } from '../lib/gsSdws';

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
export const CALVIN_NOT_LIVE_LINE =
  'Calvin is not answering here yet. The calculator works: pick carbon credits or water benefits, and type in what you know.';

/**
 * THE TOOL TAB HOLDS TWO CALCULATORS FROM 14 NOV 2026. Carbon credits are the
 * open core's calculator (CalvinCalculator.tsx), installed from calvin-v0.2.0
 * and locked to ex-ante. Water benefits stay this site's own VWBA D-3
 * worksheet until Violet's module arrives from the open core (proposal step 5),
 * so the step has two looks until then (proposal section 8, B).
 */
export function CalvinTool({
  calc,
  project,
  header,
  activeKey,
  onSelect,
  allValues,
  onChange,
  opensOn = 'carbon',
}: {
  calc: CalculatorState;
  project: CalvinProject;
  header?: ReactNode;
  activeKey: string;
  onSelect: (key: string) => void;
  allValues: Record<string, PackValues>;
  onChange: (key: string, values: PackValues) => void;
  opensOn?: 'carbon' | 'water';
}) {
  const [which, setWhich] = useState<'carbon' | 'water'>(opensOn);
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div role="tablist" aria-label="Which calculator" style={{ display: 'flex', gap: 8, padding: '10px 18px', borderBottom: '1px solid var(--line)', flex: 'none' }}>
        {(['carbon', 'water'] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={which === key}
            className="wb-chip"
            onClick={() => setWhich(key)}
            style={which === key ? { color: 'var(--ink)', borderColor: 'var(--bot-calvin)', background: 'var(--card)' } : undefined}
          >
            {key === 'carbon' ? 'Carbon credits' : 'Water benefits'}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, visibility: which === 'carbon' ? undefined : 'hidden' }} aria-hidden={which !== 'carbon'}>
          <CalvinCalculator calc={calc} project={project} header={header} />
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', visibility: which === 'water' ? undefined : 'hidden' }} aria-hidden={which !== 'water'}>
          <QuantificationWorksheet activeKey={activeKey} onSelect={onSelect} allValues={allValues} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}

export default function CalvinScreen({
  calc,
  project,
  missingFacts,
  activeKey,
  onSelect,
  allValues,
  onChange,
}: {
  /** The open core's calculator state, held by the shell so the record, the panel and the report read it. */
  calc: CalculatorState;
  project: CalvinProject;
  /** The facts the calculator still needs, in a visitor's words. */
  missingFacts: string[];
  activeKey: string;
  onSelect: (key: string) => void;
  allValues: Record<string, PackValues>;
  onChange: (key: string, values: PackValues) => void;
}) {
  return (
    <AgentScreen
      host={CALVIN}
      opensOn="tool"
      tabs={{
        chat: <NotLiveChat host={CALVIN} line={CALVIN_NOT_LIVE_LINE} />,
        tool: (
          <CalvinTool
            calc={calc}
            project={project}
            header={<RecordFacts missing={missingFacts} />}
            activeKey={activeKey}
            onSelect={onSelect}
            allValues={allValues}
            onChange={onChange}
          />
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

export const CALVIN_PACK: PackView = {
  heading: "Calvin's Knowledge Pack",
  /* One section, unlabelled: he holds one set of tools, not two pathways. */
  sections: [
    {
      key: 'method-packs',
      tags: PACKS.map((p) => p.citation.document).filter((d, i, all) => all.indexOf(d) === i),
      version: null,
      source: (
        <>
          Calvin carries no rule cards. His carbon calculator is the open core&rsquo;s, @waterbots/calvin{' '}
          {CALVIN_PACKAGE_VERSION} from the release {CALVIN_RELEASE}, with its engine, gs4gg-carbon{' '}
          {GS4GG_CALCULATOR_VERSION}, which does every sum; here it shows the ex-ante view only. His water
          calculator is this site&rsquo;s own method pack until Violet&rsquo;s arrives. Everything they
          produce is a screening estimate: anticipated, not delivered. This is a first screening, not an
          official decision.
        </>
      ),
      sets: [
        {
          label: 'CARBON · THE OPEN CORE’S CALCULATOR',
          approved: null,
          rows: [GS_SDWS_LEGACY_V1, GS_SDWS_PAA_V2].map((p, i) => ({
            id: `core-${p.key}`,
            badge: i === 0 ? 'V1' : 'V2',
            title: p.name,
            tag: `calvin ${CALVIN_PACKAGE_VERSION}`,
            layers: [
              { heading: 'What it measures', text: p.measures },
              { heading: 'What it covers', text: p.scope },
              {
                heading: 'Where the numbers come from',
                text: `The open core's engine, gs4gg-carbon ${GS4GG_CALCULATOR_VERSION}, installed from the release ${CALVIN_RELEASE} and checked against its fingerprint. This site computes none of it.`,
              },
            ],
            citation: p.citation,
          })),
        },
        {
          label: `WATER · ${PACKS.length} METHOD ${PACKS.length === 1 ? 'PACK' : 'PACKS'}`,
          approved: null,
          rows: PACKS.map((p) => ({
            id: `pack-${p.key}`,
            badge: String(PACKS.indexOf(p) + 1),
            title: p.name,
            tag: `v${toolVersion(p.key)}`,
            layers: [
              { heading: 'What it measures', text: p.measures },
              { heading: 'What it covers', text: p.scope },
              { heading: 'The indicator', text: `${p.method.indicator}, in ${p.method.indicatorUnit}. ${p.method.definition}` },
            ],
            citation: p.citation,
          })),
        },
      ],
    },
  ],
  evals: true,
};
