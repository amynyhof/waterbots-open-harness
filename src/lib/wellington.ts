/**
 * Wellington, as the console holds him — his host descriptor and his adapter
 * into the shared chat machinery.
 *
 * ONE PLACE, because two frames render him: the landing's hero chat and the
 * desk. The conversation itself is held by the shell (src/App.tsx) with
 * useConversation; this file is who he is and how an answer of his becomes a
 * turn. His side effects — what he learned writing into the visit — happen in
 * the adapter, before the turn is handed back, the same way Phoebe's worksheet
 * updates do.
 *
 * His role is "Team Lead" — maintainer's naming ruling, 2 Sep 2026, everywhere
 * he is named on this site. Not "Floor manager", and not "host" as a title.
 */

import wellingtonPortrait from '../../brand/assets/bots/wellington.svg';
import type { AgentHost, AgentTurn, Ask, TurnAction } from '../chat/evidence';
import { SITE_URL } from './site';
import type { ConsoleSurface } from './surfaces';
import type { Learned } from './visit';
import { askWellington, type WellingtonRoute } from './wellingtonClient';

export const WELLINGTON: AgentHost = {
  name: 'Wellington',
  role: 'Team Lead',
  portrait: wellingtonPortrait,
  colourToken: '--bot-wellington',
  composerPlaceholder: 'Reply to Wellington',
  composerNote: 'Nothing is kept between visits. Thirty messages a day.',
  thinkingLine: 'Wellington is thinking…',
  abstainedLabel: 'not something this console holds',
};

/**
 * A route becomes one action under the turn. The map is built from a closed
 * list; an unknown route was already dropped to "none" by the relay and the
 * client, so nothing invented can reach here.
 */
export function actionFor(
  route: WellingtonRoute,
  go: (surface: ConsoleSurface) => void
): TurnAction | undefined {
  switch (route) {
    case 'eligibility':
      return { label: 'Open the Eligibility tab', go: () => go('eligibility') };
    case 'quantification':
      return { label: 'Open Quantify', go: () => go('quantification') };
    case 'map':
      return { label: 'Open the Partners map', go: () => go('map') };
    case 'paid':
      return { label: 'Open waterbots.ai', href: SITE_URL };
    default:
      return undefined;
  }
}

/** His adapter: the relay's answer becomes a turn, and what he learned goes to the visit. */
export function wellingtonAsk(
  onLearned: (learned: Learned) => void,
  go: (surface: ConsoleSurface) => void
): Ask {
  return async (history, signal): Promise<AgentTurn> => {
    const answer = await askWellington(
      history.map(({ role, text }) => ({
        role: role === 'agent' ? ('assistant' as const) : ('user' as const),
        content: text,
      })),
      signal
    );
    if (Object.keys(answer.learned).length > 0) onLearned(answer.learned);
    return {
      role: 'agent',
      text: answer.reply,
      evidence: [],
      abstained: answer.abstained,
      action: actionFor(answer.route, go),
    };
  };
}
