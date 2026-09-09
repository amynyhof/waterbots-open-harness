/**
 * The Credentials tab — an agent's exam and scores, and nothing else.
 * Maintainer's amendment of 8 Sep 2026: the Knowledge pack is its own tab;
 * Credentials is exam and scores only.
 *
 * NO AGENT HAS SAT AN EXAM, and this tab says so rather than showing an empty
 * frame or a made-up score. The three layers an exam will have — the cases,
 * the answers as given, the grade with the grader's notes — are drawn open
 * with their honest state, the pictures the maintainer approved on 9 Sep 2026
 * (#61). When an exam is graded, the layers fill; until then they say "none
 * yet". No mock data, ever.
 *
 * ONE COMPONENT FOR EVERY AGENT. The desk used a one-sentence tab in slice 2;
 * from slice 3 it uses this, so Wellington's and Phoebe's credentials read
 * the same way.
 */

import type { AgentHost } from '../chat/evidence';
import { SCREEN_COLUMN } from './ScreenChat';

const LAYERS = [
  {
    title: "The cases, in a visitor's words",
    key: 'Cases',
    state:
      'None written yet. Each case will be a real question a visitor could ask, with the project facts it rests on.',
  },
  {
    title: 'The answers, as given',
    key: 'Answers',
    state:
      'None yet. Each answer is shown as given, with the cards it cited, and is never edited afterwards.',
  },
  {
    title: "The grade and the grader's notes",
    key: 'Score',
    state:
      "Not yet graded. The score is the maintainer's, with her notes on what was right and what was missed, and the date.",
  },
];

export default function CredentialsTab({ host }: { host: AgentHost }) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: SCREEN_COLUMN, margin: '0 auto', padding: '22px var(--gutter) 24px' }}>
        <h2 style={{ fontSize: 20, margin: '0 0 8px', letterSpacing: '-0.015em', lineHeight: 1.25 }}>
          {host.name}&rsquo;s credentials
        </h2>
        <div style={{ marginBottom: 10 }}>
          {/* A state, so a chip: outlined at 40% of the pending colour, no
              fill, the text in ink — amber may not carry type (§2.5). */}
          <span className="chip" style={{ ['--chip-role' as string]: 'var(--state-pending)' }}>
            no exam sat yet
          </span>
        </div>
        <p className="t-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
          {host.name} has not sat an exam. A score shows here only after the maintainer has graded
          one, and until then this page says so rather than guess.
        </p>

        <div className="wb-pack-sec">
          <span className="label" style={{ color: 'var(--ink-3)' }}>
            THE EXAM · HOW IT WILL READ
          </span>
        </div>
        <div className="wb-pack-group">
          {LAYERS.map((layer, i) => (
            <div key={layer.key}>
              <div className="wb-pack-row" style={{ cursor: 'default' }}>
                <span className="wb-pack-badge">{i + 1}</span>
                <span>{layer.title}</span>
              </div>
              <div className="wb-pack-open">
                <div className="wb-pack-k">{layer.key}</div>
                {layer.state}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
