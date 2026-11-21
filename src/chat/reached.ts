/**
 * THE STEPS THIS VISIT HAS REACHED — the maintainer's word of 21 Nov 2026: a
 * "Meet …" button goes quiet once the visitor has reached that agent, by the
 * button or any other way, so it no longer stands as the blue next step. The
 * shell holds the set and provides it here; a chat with no provider (the
 * Agent Commons) has reached nothing.
 */

import { createContext } from 'react';
import type { Surface } from '../lib/surfaces';

export const Reached = createContext<ReadonlySet<Surface>>(new Set());
