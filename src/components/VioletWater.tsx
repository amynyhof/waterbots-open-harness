/**
 * The water calculator — Violet's D-3 screen from the open core, from 22 Nov
 * 2026, the maintainer's word on #189 (Road to v1 step 5). It takes the place
 * of this site's own D-3 pack, so there is one D-3 calculator.
 *
 * WHAT IS HERS AND WHAT IS OURS. Every number, label, note and source on it is
 * her package's (@waterbots/violet, from the release violet-v0.7.0):
 * her screen holds what the visitor sets and her engine does every sum. This
 * file only mounts it, locked to the ex-ante view as the open site screens
 * before a project runs, and hands what she gives back to the visit.
 *
 * THE SHARED RECORD FROM 0.6.0 (J3, 23 Nov 2026). Her screen opens on the record: people served as entered, the
 * access level and the water before the project, and it follows them when the record changes. Her screen has no
 * box for people served; on the console the record is Wellington's, and on the Commons it is the facts form.
 *
 * ONE CALCULATOR LAYOUT FROM 0.6.0 (J5, 23 Nov 2026). Her screen has Calvin's layout and her own colour. Her
 * stylesheet, @waterbots/violet/styles.css, draws it; this site's src/styles/violet.css after it sets only this
 * site's tokens, her colour, where her header pins, and the two rules the brand book asks for. The smaller figures
 * scroll away, as on Calvin's (unpinFigureBlock), and her hero tile stays at the top.
 *
 * ONE EXPORT DURING A SCREENING. On the Free site her own Export button is hidden, as Calvin's is: "Export
 * screening report" in the left rail is the one export and carries her notes. The Agent Commons keeps hers.
 *
 * HER STATE IS HELD ABOVE HER SCREEN on the console from 0.7.0 (25 Nov 2026), so her chat fills it: the desk calls her
 * package's own hook and hands it in. In the Agent Commons her screen keeps its own.
 */

import { D3Screen, type D3State } from '@waterbots/violet/screen';
import type { Place } from '@waterbots/core/places';
import type { ProjectRecord } from '@waterbots/core/record';
import type { WaterEstimate } from '../lib/visit';
import '@waterbots/violet/styles.css';
import '../styles/violet.css';

export default function VioletWater({
  record,
  place,
  hideExportButton = false,
  onChange,
  state,
}: {
  /** The shared project record, or in the Agent Commons a temporary one of the same shape. */
  record: ProjectRecord;
  /** Where Violet is working: the Free site or the Agent Commons (J2). */
  place: Place;
  hideExportButton?: boolean;
  /** What the visitor set and what her engine gave back, after every change. */
  onChange?: (water: WaterEstimate) => void;
  /** Her state, where the desk holds it. */
  state?: D3State;
}) {
  return (
    <div className="wb-water">
      <D3Screen
        {...(state ? { state } : { onChange: (input, result) => onChange?.({ input, result }) })}
        record={record}
        place={place}
        lockView="ex-ante"
        unpinFigureBlock
        hideExportButton={hideExportButton}
      />
    </div>
  );
}
