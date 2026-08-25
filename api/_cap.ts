/**
 * Twenty messages a day.
 *
 * The maintainer's ruling of 21 Aug 2026, and item O1 in OPEN_ITEMS.md. Phoebe
 * is free, public and open to anyone, and every message she answers costs money.
 * The cap is what keeps her open.
 *
 * WHAT IS COUNTED. Answers actually delivered, and nothing else. The count goes
 * up at the last moment before the model is called, and comes back down if that
 * call fails on our side. Nobody spends one of their twenty on our fault.
 *
 * The named trade in that: someone determined to abuse this could send messages
 * that reliably fail and never be charged for them, and those calls still cost
 * us. It was weighed and chosen — ordinary visitors meet failures and abusers do
 * not, so charging for failures would punish the wrong people. Maintainer's
 * ruling, 25 Aug 2026.
 *
 * WHAT HAPPENS WHEN THE STORE IS UNWELL — two different situations, two
 * different answers, and they are not the same thing:
 *
 *   Never set up. On the platform, this means a public endpoint is running
 *   without the cap it is supposed to have, so Phoebe does not answer at all
 *   and says why. On a laptop it is ordinary, and it warns loudly instead.
 *
 *   Set up but stumbling. One request goes through uncounted and the failure is
 *   written to the log. Refusing every visitor because a counter is unwell is
 *   worse than one uncounted message.
 *
 * This file decides. It writes no visitor-facing words — those live with all the
 * other ones, in phoebe.ts.
 */

import { countMessage, refundMessage, storeConfig } from './_store.js';
import {
  clientAddress,
  counterKey,
  secondsUntilMidnight,
  secondsUntilReset,
  utcDayStamp,
  visitorId,
} from './_visitor.js';

/** The maintainer's ruling of 21 Aug 2026. Item O1 revisits the number later. */
export const DAILY_CAP = 20;

export type CapDecision =
  /** Counted. Call `refund` if no answer is delivered. */
  | { kind: 'allowed'; refund: () => Promise<void> }
  /** Let through without counting, for a reason worth a log line. */
  | { kind: 'uncounted'; why: string }
  /** Out of messages until the day turns over. */
  | { kind: 'refused'; cap: number; secondsToReset: number }
  /** Running where the cap must work, with what it needs missing. */
  | { kind: 'misconfigured'; missing: string };

/**
 * Are we somewhere the cap has to work?
 *
 * Anywhere the platform is running this — production and preview alike, since a
 * preview deployment is a public web address too. A laptop is the only place a
 * missing cap is an ordinary state rather than a fault.
 */
function onThePlatform(): boolean {
  return process.env.VERCEL === '1';
}


/**
 * Count this message against the sender's day, and say what should happen.
 *
 * Called at the last moment before the model, so that everything a request can
 * be refused for on its own terms — an unreadable body, an empty message, a
 * conversation that has run too long — is already out of the way. A malformed
 * request must not cost anyone one of their twenty.
 */
export async function countOneMessage(req: Request, now: Date): Promise<CapDecision> {
  const store = storeConfig();
  const salt = process.env.PHOEBE_VISITOR_SALT;

  if (!store || !salt) {
    const missing = !store ? 'the shared store' : 'PHOEBE_VISITOR_SALT';
    if (onThePlatform()) return { kind: 'misconfigured', missing };
    return { kind: 'uncounted', why: `${missing} is not set here — development only` };
  }

  const address = clientAddress(req.headers);
  if (!address) {
    /* On the platform this should not be possible: it writes the address header
       itself. Letting the message through rather than refusing it, because
       refusing every visitor over a missing header would be the worse failure —
       but it is logged, because it would mean something has changed about how
       requests reach this function. */
    return { kind: 'uncounted', why: 'the request carried no address header' };
  }

  const key = counterKey(visitorId(address, salt), utcDayStamp(now));

  let count: number;
  try {
    count = await countMessage(store, key, secondsUntilReset(now));
  } catch (error) {
    return { kind: 'uncounted', why: describe(error) };
  }

  if (count > DAILY_CAP) {
    /* Put it back, so the stored number keeps meaning what it says — messages
       counted — rather than climbing while someone keeps trying. If the refund
       itself fails the number reads high for the rest of the day, which changes
       nothing: they are over the cap either way. */
    try {
      await refundMessage(store, key);
    } catch (error) {
      console.error('phoebe: could not put back a refused message —', describe(error));
    }
    return { kind: 'refused', cap: DAILY_CAP, secondsToReset: secondsUntilMidnight(now) };
  }

  return {
    kind: 'allowed',
    refund: async () => {
      try {
        await refundMessage(store, key);
      } catch (error) {
        /* The visitor keeps their answer either way; they have simply been
           charged for something that failed. Worth a log line, not a failure. */
        console.error('phoebe: could not refund an undelivered message —', describe(error));
      }
    },
  };
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * How long until the count comes back, in words a person can read.
 *
 * The exact moment is midnight UTC and the message says so. This is the part
 * that makes it useful — "in about 7 hours" is what someone actually wants to
 * know, and it is measured rather than guessed at.
 */
export function timeUntilReset(secondsToReset: number): string {
  if (secondsToReset <= 60 * 60) return 'in under an hour';
  const hours = Math.round(secondsToReset / 3600);
  return `in about ${hours} hour${hours === 1 ? '' : 's'}`;
}
