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
 *
 * THE GRADE IS THE ONE PUBLIC EXAM'S, from 11 Sep 2026 — the maintainer's
 * ONE GRADER ruling of 9 Sep (item S18), which this tab had been written
 * before: ~~the score was the maintainer's, with her notes~~. The grading rig
 * kept outside this repository is the only public grade; this site's own
 * checks are internal gates and never a score. The wording is the picture
 * she approved on 10 Sep, in a visitor's words, on every consumer of the
 * screen. The chip reads "not yet graded" here as it does on the shelf.
 */

import type { AgentHost } from '../chat/evidence';
import { SCREEN_COLUMN } from './ScreenChat';

const LAYERS = [
  {
    title: "The cases, in a visitor's words",
    key: 'Cases',
    state:
      "None yet. Each case will be a real project's question, in a visitor's words, with the facts it rests on.",
  },
  {
    title: 'The answers, as given',
    key: 'Answers',
    state:
      'None yet. Each answer is shown as given, with what it cited, and is never edited afterwards.',
  },
  {
    title: "The grade and the grader's notes",
    key: 'Score',
    state:
      "Not yet graded. The grade is the exam's, with what it checked on each answer, and the date it was run.",
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
            not yet graded
          </span>
        </div>
        <p className="t-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
          {host.name} has not been graded yet. The grade shown here comes from one public exam, run
          outside this site on real projects and real knowledge packs, and this page shows what that
          exam recorded: the questions, the answers as given, and the grader&rsquo;s call on each.
          Until it has been run, this page says so rather than guess.
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
