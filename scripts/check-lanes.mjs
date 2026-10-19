/**
 * Confirms the merge lanes decide the way the maintainer ruled on 19 Oct 2026.
 *
 *   node scripts/check-lanes.mjs
 *
 * It runs the real classifier against the real path lists in .github/lanes.json,
 * and the real diff scanner. Each case names a pull request's changed files and
 * the lane it must get. The cases that matter most: a notes-only pull request is
 * lane 1; an engine change is lane 3; a file on no list is lane 3; a change to
 * the lane rule is lane 3; a file moved out of lane 3 still counts as lane 3.
 */

import { loadLists, laneOfPullRequest } from './lane-classify.mjs';
import { scanSecrets, scanNumbers } from './scan-diff.mjs';

const lists = loadLists();
const failures = [];
const expect = (name, ok, why) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) failures.push(`${name}: ${why}`);
};
const f = (...paths) => paths.map((path) => ({ path, previous: null }));
const lane = (...paths) => laneOfPullRequest(f(...paths), lists);

console.log('Merge lanes — the classifier\n');

expect('a plan-and-notes-only pull request is lane 1', lane('BUILD_PLAN.md', 'BUILD_LOG.md', 'docs/archive/CORRECTIONS.md') === 1, 'notes files left lane 1');
expect('an engine change is lane 3', lane('carried/calculators/index.ts') === 3, 'carried engine file not lane 3');
expect('the app\'s own figures code is lane 3', lane('src/lib/vwbaD3.ts') === 3, 'src/lib not lane 3');
expect('a screen change is lane 2', lane('src/components/Rail.tsx') === 2, 'a screen is not lane 2');
expect('the README is lane 2', lane('README.md') === 2, 'README not lane 2');
expect('a package change is lane 3', lane('package.json') === 3 && lane('package-lock.json') === 3, 'a package file not lane 3');
expect('the relay is lane 3', lane('api/phoebe.ts') === 3, 'api not lane 3');
expect('a data file is lane 3', lane('public/water_stress.json') === 3 && lane('knowledge-packs/phoebe-eligibility/vwba-2.0/cards/x.md') === 3, 'a data file not lane 3');
expect('a rules file is lane 3', ['CLAUDE.md', 'PROCESS_RULES_for_ShellB.md', 'AGENT_RULES.md', 'CITATIONS.md'].every((p) => lane(p) === 3), 'a rules file not lane 3');
expect('a carry-related note is lane 3 even under docs', lane('docs/CARRY_NOTES.md') === 3, 'carry note slipped into lane 1');
expect('CI and the lane rule itself are lane 3', lane('.github/workflows/lanes.yml') === 3 && lane('.github/lanes.json') === 3 && lane('scripts/lane-classify.mjs') === 3, 'the lane rule is not lane 3');
expect('a file on no list is lane 3', lane('some-new-folder/thing.txt') === 3, 'an unlisted file did not default to lane 3');
expect('a secrets file is lane 3', lane('.env.production') === 3, 'an env file not lane 3');
expect('a test-only change is lane 1', lane('src/lib/x.test.ts') === 3 && lane('docs/x.test.ts') === 1, 'test files misplaced (a test under src/lib stays lane 3, one under docs is lane 1)');
expect('a mixed pull request takes its highest lane', lane('BUILD_PLAN.md', 'src/components/Rail.tsx') === 2 && lane('BUILD_PLAN.md', 'README.md', 'api/phoebe.ts') === 3, 'a mix did not take the highest lane');
expect('no files is lane 3', laneOfPullRequest([], lists) === 3, 'an empty list was not lane 3');
expect(
  'a file moved out of a lane 3 place still counts as lane 3',
  laneOfPullRequest([{ path: 'docs/engine-moved.md', previous: 'carried/calculators/index.ts' }], lists) === 3,
  'a rename hid a lane 3 file'
);
expect('the case of a path does not change its lane', lane('claude.md') === 3 && lane('Carried/x.ts') === 3, 'path case slipped past a lane 3 rule');

console.log('\nMerge lanes — the diff scanner\n');

const diff = (line) => `+++ b/x.md\n@@ -0,0 +1 @@\n+${line}\n`;
const fakeKey = 'sk-ant-' + 'a1B2c3D4e5F6g7H8i9J0k1L2';
expect('a key-shaped added line is caught', scanSecrets(diff(`token ${fakeKey}`)).length === 1, 'a key-shaped value was not caught');
expect('a named secret with a long value is caught', scanSecrets(diff('RESEND_API_KEY=' + 'x'.repeat(30))).length === 1, 'a named secret was not caught');
expect('a secret\'s name alone is not caught', scanSecrets(diff('Set RESEND_API_KEY and BRIDGE_KEY in the hosting settings.')).length === 0, 'a name with no value was flagged');
expect('only added lines are scanned', scanSecrets(`-RESEND_API_KEY=${'x'.repeat(30)}\n`).length === 0, 'a removed line was scanned');
expect('the number gate catches a term on an added line', scanNumbers(diff('the figure is 1234 alpha'), [/alpha/i]).length === 1, 'a gate pattern did not match');
expect('the number gate is quiet when nothing matches', scanNumbers(diff('plain words'), [/alpha/i]).length === 0, 'a gate pattern matched nothing it should');

if (failures.length) {
  console.log(`\nFAILED — ${failures.length} case(s):`);
  for (const x of failures) console.log(`  ${x}`);
  process.exit(1);
}
console.log('\nPASSED — the lanes decide as ruled.');
