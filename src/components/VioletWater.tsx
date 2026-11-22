/**
 * The water calculator — Violet's D-3 screen from the open core, from 22 Nov
 * 2026, the maintainer's word on #189 (Road to v1 step 5). It takes the place
 * of this site's own D-3 pack, so there is one D-3 calculator.
 *
 * WHAT IS HERS AND WHAT IS OURS. Every number, label, note and source on it is
 * her package's (@waterbots/violet, from the release calvin-violet-v0.5.0):
 * her screen holds what the visitor sets and her engine does every sum. This
 * file only mounts it, locked to the ex-ante view as the open site screens
 * before a project runs, and hands what she gives back to the visit.
 *
 * PEOPLE SERVED COME FROM THE RECORD (her 0.5.0). Her screen has no box for
 * them; on the console the record is Wellington's, and on the Commons it is the
 * facts form, passed the same way it is passed to Calvin (her ruling A, 22 Nov
 * 2026). A count that changes on the record changes on her screen.
 *
 * STILL UNDER CALVIN (ruling E). The chip is Calvin's "Water benefits"; Violet
 * becomes her own crew member on the v1 road, through the shared spec with the
 * paid site, not in this swap.
 *
 * STYLED BY THIS SITE'S TOKENS. Her package ships no stylesheet: her markup is
 * plain, under `.violet-d3`, and src/styles/violet.css gives it this site's
 * look, scoped to that class.
 */

import { D3Screen } from '@waterbots/violet/screen';
import type { CalvinProject } from '@waterbots/calvin/screen';
import type { WaterEstimate } from '../lib/visit';
import '../styles/violet.css';

export default function VioletWater({
  project,
  onChange,
}: {
  /** The project as the record gives it, the same object Calvin reads. */
  project: CalvinProject;
  /** What the visitor set and what her engine gave back, after every change. */
  onChange?: (water: WaterEstimate) => void;
}) {
  return (
    <div className="wb-water">
      <D3Screen project={project} lockView="ex-ante" onChange={(input, result) => onChange?.({ input, result })} />
    </div>
  );
}
