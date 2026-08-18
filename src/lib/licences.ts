/**
 * Required attribution text.
 *
 * These strings are a licence obligation, not copy. They are reproduced
 * verbatim from the source documents and must not be paraphrased, shortened
 * or "improved". scripts/check-attribution.mjs asserts they survive into the
 * built bundle.
 *
 * Two datasets, two licences, two separate attributions. One combined credit
 * line satisfies neither.
 */

/**
 * The name that fills Exhibit B's [insert Licensee Derivative Product name]
 * placeholders. Kept as its own constant for reference, but NOT interpolated
 * into the statement below — see the note there.
 */
export const PRODUCT_NAME = 'WaterBots Open Harness';

/**
 * HydroSHEDS License Agreement, Exhibit B — REQUIRED ATTRIBUTIONS.
 *
 * Section 2.2 of the agreement requires this statement be displayed "with,
 * attached to or embodied in (in a reasonably prominent manner) the
 * documentation or metadata of any Licensee Product or Program provided to an
 * End User". It is carried here and in the repository README.
 *
 * TEXT ONLY. Section 8.1 prohibits use of WWF's name, trade name, trademarks
 * or logos without prior written consent — WWF may be named in this
 * attribution, but no WWF logo or mark appears anywhere in this product.
 *
 * WRITTEN OUT IN FULL, NOT INTERPOLATED. An earlier version built the product
 * name in with a template literal; the bundler shipped it as
 * `This product ${x} incorporates...`, assembled at runtime. It rendered
 * correctly, but the statement that ships should be exactly the statement
 * that was written, and auditable as one string. A licence obligation is not
 * a place for cleverness.
 */
export const HYDROSHEDS_EXHIBIT_B =
  'This product WaterBots Open Harness incorporates data from the HydroSHEDS version 1 database which is © World Wildlife Fund, Inc. (2006-2022) and has been used herein under license. WWF has not evaluated the data as altered and incorporated within WaterBots Open Harness, and therefore gives no warranty regarding its accuracy, completeness, currency or suitability for any particular purpose. Portions of the HydroSHEDS v1 database incorporate data which are the intellectual property rights of © USGS (2006-2008), NASA (2000-2005), ESRI (1992-1998), CIAT (2004-2006), UNEP-WCMC (1993), WWF (2004), Commonwealth of Australia (2007), and Her Royal Majesty and the British Crown and are used under license. The HydroSHEDS v1 database and more information are available at https://www.hydrosheds.org.';

/** HydroBASINS technical documentation §4.2. */
export const HYDROBASINS_CITATION =
  'Lehner, B., Grill G. (2013): Global river hydrography and network routing: baseline data and new approaches to study the world’s large river systems. Hydrological Processes, 27(15): 2171–2186. Data is available at www.hydrosheds.org.';

/** HydroSHEDS License Agreement, Exhibit B — scientific citation. */
export const HYDROSHEDS_CITATION =
  'Lehner, B., Verdin, K., Jarvis, A. (2008): New global hydrography derived from spaceborne elevation data. Eos, Transactions, AGU, 89(10): 93-94.';

/** WRI Aqueduct 4.0 technical note, suggested citation. */
export const AQUEDUCT_CITATION =
  'Kuzma, S., M.F.P. Bierkens, S. Lakshman, T. Luo, L. Saccoccia, E. H. Sutanudjaja, and R. Van Beek. 2023. “Aqueduct 4.0: Updated decision-relevant global water risk indicators.” Technical Note. Washington, DC: World Resources Institute. Available online at: doi.org/10.46830/writn.23.00061.';

export const AQUEDUCT_LICENCE =
  'Water stress data is © World Resources Institute, licensed under the Creative Commons Attribution 4.0 International License.';

/**
 * The short line that is always visible in Leaflet's attribution control.
 * The control is never disabled and this line is never faded out of legibility.
 */
export const SHORT_CREDIT =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &middot; ' +
  '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a> &middot; ' +
  'HydroSHEDS &copy; WWF &middot; WRI Aqueduct 4.0 &middot; ' +
  '<a href="#" class="wb-licences-link">Data &amp; licences</a>';
