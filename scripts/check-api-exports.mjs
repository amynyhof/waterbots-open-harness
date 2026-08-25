/**
 * Gate: nothing under api/ may use a default export.
 *
 * WHY THIS EXISTS. Vercel always invokes a default export the Node way —
 * `(req, res) => void` — and throws away what it returns. Our handlers are
 * written against the web standard: they take a Request and return a Response.
 * Exported as `default`, that Response goes to a caller that never reads return
 * values, nothing is ever written, and every request hangs until the platform
 * gives up. A GET that should answer 405 in a millisecond hung for two minutes.
 *
 * It cost three failed deploys on 24 Aug 2026 to find, because nothing local
 * could see it: the type check passes, the build passes, and the dev relay used
 * to reach for `module.default` and hand-build the Request the handler wanted.
 * Development was kinder than production, which is item S6 in OPEN_ITEMS.md.
 *
 * Vercel's own build log said it plainly in the end. This turns that warning
 * into a build failure, locally, in about a second.
 *
 * WHAT IT CHECKS. Every .ts file directly under api/ that is a route — that is,
 * not one of the underscore-prefixed helper modules — must export at least one
 * named HTTP method and must not export a default.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const API_DIR = 'api';
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

/* Helper modules, not routes. Vercel does not invoke them. */
const isRoute = (name) => name.endsWith('.ts') && !name.startsWith('_');

const problems = [];
let routes = 0;

const files = readdirSync(API_DIR).filter(isRoute).sort();

if (files.length === 0) {
  console.error(`\n  FAILED — no route files found in ${API_DIR}/.`);
  console.error('  This gate is meant to guard routes. If they moved, move the gate.\n');
  process.exit(1);
}

for (const file of files) {
  routes += 1;
  const path = join(API_DIR, file);
  const source = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');

  /* Comments are stripped first, so the explanation of why default exports are
     forbidden does not itself trip the check that forbids them. */
  const code = source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  if (/^\s*export\s+default\b/m.test(code)) {
    problems.push(
      `${path}: has a default export. Vercel invokes it as (req, res) => void and ignores ` +
        `what it returns, so a handler that returns a Response hangs. Export a named HTTP ` +
        `method instead — export async function POST(request) { ... }`
    );
    continue;
  }

  const found = METHODS.filter((m) =>
    new RegExp(`^\\s*export\\s+(async\\s+)?function\\s+${m}\\b`, 'm').test(code)
  );

  if (found.length === 0) {
    problems.push(
      `${path}: exports no HTTP method. Vercel routes by method, so this file answers nothing. ` +
        `Expected one of: ${METHODS.join(', ')}.`
    );
    continue;
  }

  console.log(`  ${path.padEnd(24)} ${found.join(', ')}`);
}

console.log('');

if (problems.length > 0) {
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(`\nFAILED — ${problems.length} of ${routes} route file(s) cannot answer in production.\n`);
  process.exit(1);
}

console.log(`PASSED — ${routes} route file(s) export named HTTP methods and no default export.\n`);
