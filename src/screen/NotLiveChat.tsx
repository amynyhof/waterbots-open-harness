/**
 * The Chat tab of an agent whose chat is not live. Item S16, slice 4,
 * 9 Sep 2026.
 *
 * ONE PLAIN LINE SAYING SO, on the Chat tab and not on Tool — maintainer's
 * ruling 1 of 9 Sep 2026: Tool is just the tool. The screen opens on Tool
 * when the chat is not live, and a visitor who steps to Chat reads the
 * host's header and this line: the agent is not answering here yet, and what
 * does work. No composer, because there is no agent behind one; a disabled
 * box that looks usable is the thing the honest-states rule forbids.
 *
 * A NOTE MAY FOLLOW, at caption size — a statement of intent, never an
 * affordance. Bridget's roadmap line lives here, as it did in her dock.
 */

import type { AgentHost } from '../chat/evidence';
import { HostHeader, SCREEN_COLUMN } from './ScreenChat';

export default function NotLiveChat({
  host,
  line,
  note,
}: {
  host: AgentHost;
  /** "Bridget is not answering here yet. The map works: click a basin to pin it." */
  line: string;
  note?: string;
}) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: SCREEN_COLUMN, margin: '0 auto', padding: '22px var(--gutter) 24px' }}>
        <HostHeader host={host} />
        <p className="t-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
          {line}
        </p>
        {note && (
          <p className="t-caption" style={{ margin: '14px 0 0', lineHeight: 1.6, color: 'var(--ink-3)' }}>
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
