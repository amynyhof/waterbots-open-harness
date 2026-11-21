/**
 * Confirms one blue button at a time — the maintainer's word of 16 Nov 2026,
 * approved from docs/proposals/queued-round-2026-11-16.md.
 *
 *   node scripts/check-blue.mjs
 *
 * The rule lives in src/lib/blue.ts. This compiles that file as it ships and
 * holds every case to exactly one blue button, in her order — Meet <name>,
 * then Save, then the menu's Sign up, and the form's Send on its own page —
 * then reads the shell, the menu, the rail and the chat to see that each draws
 * what the rule says and nothing draws a blue button of its own.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const problems = [];
let checks = 0;
function expect(label, condition, detail) {
  checks += 1;
  if (condition) console.log(`  ok    ${label}`);
  else {
    console.log(`  FAIL  ${label}`);
    problems.push(`${label} — ${detail}`);
  }
}

const out = mkdtempSync(join(tmpdir(), 'wb-blue-'));
const compile = spawnSync(
  process.execPath,
  [join('node_modules', 'typescript', 'bin', 'tsc'), join('src', 'lib', 'blue.ts'), '--outDir', out, '--module', 'commonjs', '--target', 'es2022', '--skipLibCheck'],
  { encoding: 'utf8' }
);
if (compile.status !== 0) {
  console.error(compile.stdout || compile.stderr);
  process.exit(1);
}
writeFileSync(join(out, 'package.json'), '{"type":"commonjs"}');
const require = createRequire(import.meta.url);
const found = require(join(out, 'lib', 'blue.js'));
const { blueButton, meetShowing } = found.blueButton ? found : require(join(out, 'blue.js'));
rmSync(out, { recursive: true, force: true });

console.log('One blue button at a time (16 Nov 2026)\n');

/* Every combination of what could be showing, and which one must win. */
const BUTTONS = ['meet', 'save', 'signup', 'send'];
for (const meet of [false, true]) {
  for (const save of [false, true]) {
    for (const form of [false, true]) {
      const want = form ? 'send' : meet ? 'meet' : save ? 'save' : 'signup';
      const got = blueButton({ meet, save, form });
      const blues = BUTTONS.filter((b) => b === got).length;
      expect(
        `meet ${meet ? 'shown' : 'not shown'}, save ${save ? 'shown' : 'not shown'}${form ? ', on the form' : ''}: exactly one blue, ${want}`,
        blues === 1 && got === want,
        `got ${got}`
      );
    }
  }
}

console.log('\n  Meet <name> counts only under the latest turn');
const meetTurn = { role: 'agent', text: 'Phoebe is next.', evidence: [], abstained: false, buttons: [{ label: 'Meet Phoebe', primary: true, go() {} }, { label: 'Keep chatting', go() {} }] };
const chipTurn = { role: 'agent', text: 'Here is more.', evidence: [], abstained: false, buttons: [{ label: 'Learn more about wells', go() {} }] };
expect('an empty thread shows none', meetShowing([]) === false, 'it did');
expect('a latest turn with Meet shows it', meetShowing([meetTurn]) === true, 'it did not');
expect('once the visitor answers, it is gone', meetShowing([meetTurn, { role: 'user', text: 'ok' }]) === false, 'it stayed');
expect('quiet chips alone are not a blue button', meetShowing([chipTurn]) === false, 'a chip counted');

console.log('\n  Each button draws what the rule says');
const app = readFileSync(join('src', 'App.tsx'), 'utf8');
const menu = readFileSync(join('src', 'components', 'SiteMenu.tsx'), 'utf8');
const rail = readFileSync(join('src', 'components', 'NavRail.tsx'), 'utf8');
const css = readFileSync(join('src', 'styles', 'base.css'), 'utf8');
expect('the shell asks the rule once', (app.match(/blueButton\(/g) ?? []).length === 1, 'blueButton is not called exactly once in App.tsx');
expect(
  'the menu, the rail and the form are each told from it',
  /signupBlue=\{blue === 'signup'\}/.test(app) && /blue: blue === 'save'/.test(app),
  'App.tsx does not pass the rule to the menu and the rail'
);
expect('the menu draws Sign up quiet when told', /signupBlue \? '' : ' is-quiet'/.test(menu) && /\.wb-site-menu-signup\.is-quiet \{[^}]*background: transparent/.test(css), 'no quiet Sign up');
expect('the rail draws Save quiet when told', /save\.blue \? 'wb-save-button' : 'wb-save-button is-quiet'/.test(rail) && /\.wb-save-button\.is-quiet \{[^}]*background: transparent/.test(css), 'no quiet Save');
expect(
  "Phoebe's and Bridget's screens tell the shell when Meet is under their latest turn",
  ['PhoebeScreen', 'BridgetScreen'].every((f) => /onMeet\?\.\(meet\)/.test(readFileSync(join('src', 'components', `${f}.tsx`), 'utf8'))) &&
    /onMeet=\{onPhoebeMeet\}/.test(app) &&
    /onMeet=\{onBridgetMeet\}/.test(app),
  'a screen with a Meet button does not report it'
);

/* No other blue button anywhere: the only solid blue classes are these three
   and the chat's primary, and the only primary turn button is Meet <name>. */
const { readdirSync } = await import('node:fs');
const files = [];
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(e.name)) files.push(p);
  }
};
walk('src');
const users = files.filter((f) => /btn-primary|wb-save-button|wb-site-menu-signup|wb-form-send|primary: true/.test(readFileSync(f, 'utf8'))).map((f) => f.replace(/\\/g, '/')).sort();
const allowed = ['src/chat/Transcript.tsx', 'src/components/InterestPage.tsx', 'src/components/NavRail.tsx', 'src/components/SupportersPage.tsx', 'src/components/SiteMenu.tsx', 'src/lib/visit.ts', 'src/lib/wellington.ts'];
expect(
  'no other file draws a solid blue button',
  users.every((f) => allowed.includes(f)),
  `also in ${users.filter((f) => !allowed.includes(f)).join(', ')}`
);

if (problems.length) {
  console.error(`\nFAILED — ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`\nPASSED — ${checks} checks on one blue button at a time.`);
