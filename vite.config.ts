import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Serves /api/phoebe during `npm run dev`.
 *
 * In production Vercel runs everything under api/ as serverless functions.
 * Vite's dev server does not, so without this the composer would fail against
 * a 404 locally and the relay could only ever be tested by deploying.
 *
 * DEV ONLY — `apply: 'serve'`. It never runs in a build and ships nothing.
 * The handler is imported through Vite's own module loader, so it is the same
 * file Vercel deploys, with hot reload, rather than a second copy that could
 * drift from it.
 *
 * THIS BRIDGE IS THE WEAKEST PART OF THE ARRANGEMENT, and it has hidden two
 * production outages (item S6 in OPEN_ITEMS.md). Node's http objects are not
 * web Requests, so something has to convert, and whatever converts is a place
 * where development can be kinder than production without anyone noticing.
 *
 * The rules that keep it honest:
 *
 *   1. NEVER SUPPLY WHAT PRODUCTION WOULD NOT. Pass through the method, the
 *      headers and the body as they arrived. Do not default a missing header,
 *      do not normalise a method, do not repair a malformed body. If the
 *      handler needs a header that was not sent, that is a fault to see here
 *      rather than a fault to discover on the deployed site.
 *   2. NEVER READ THE RESULT LOOSELY. The handler must return a Response. If it
 *      returns anything else, say so loudly instead of coping.
 *   3. This file may not grow logic that belongs in the handler.
 */
/**
 * Which relays the dev server will serve. ONE ROW PER AGENT WITH AN ENDPOINT.
 * Anything not on this list is a 404 here, as it would be on the platform
 * with no file behind it. Wellington joined on 3 Sep 2026.
 */
const RELAYS = ['phoebe', 'wellington'] as const;

function phoebeDevRelay(): Plugin {
  return {
    name: 'agent-dev-relay',
    apply: 'serve',
    configureServer(server) {
      for (const relay of RELAYS) serveRelay(server, relay);
    },
  };
}

function serveRelay(server: ViteDevServer, relay: string): void {
  const path = `/api/${relay}`;
  const file = `/api/${relay}.ts`;
  server.middlewares.use(path, async (req, res) => {
        try {
          const module = await server.ssrLoadModule(file);

          /* Route by method, the way Vercel does. It invokes the named HTTP
             method export and uses the Response it returns; a default export
             would be invoked the Node way and its return value ignored. This
             used to reach for `module.default`, which is precisely the shape
             production does not support — the plugin was the only reason that
             ever appeared to work. */
          const method = (req.method ?? 'GET').toUpperCase();
          const handler = module[method] as ((r: Request) => Promise<Response>) | undefined;

          if (typeof handler !== 'function') {
            res.statusCode = 405;
            res.setHeader('content-type', 'application/json');
            res.end(
              JSON.stringify({
                error: `${file.slice(1)} exports no ${method} handler. Vercel routes by method; add a named export or use a method that exists.`,
              })
            );
            return;
          }

          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);

          /* Headers pass through as they arrived. The previous version
             defaulted a missing content-type to application/json, which is a
             kindness production does not extend. */
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value);
            else if (Array.isArray(value)) for (const v of value) headers.append(key, v);
          }

          const request = new Request(`http://localhost${req.url ?? path}`, {
            method: req.method,
            headers,
            body: chunks.length ? Buffer.concat(chunks) : undefined,
          });

          const result = await handler(request);

          /* Rule 2. A handler that does not return a Response is broken in a
             way production would show as a hang, so it is shown as a failure
             here instead of being quietly tolerated. */
          if (!(result instanceof Response)) {
            throw new Error(
              `${file.slice(1)} did not return a Response. Vercel invokes this handler with a ` +
                'web Request and uses what it returns; anything else hangs in production.'
            );
          }
          res.statusCode = result.status;
          result.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(await result.text());
        } catch (error) {
          /* An honest failure. The console shows the message rather than
             hanging or inventing a reply. */
          server.config.logger.error(`[${relay}-dev-relay] ${String(error)}`);
          res.statusCode = 500;
          res.setHeader('content-type', 'application/json');
          res.end(
            JSON.stringify({
              error: `The local relay failed before reaching ${relay}. The dev server log has the details.`,
            })
          );
        }
  });
}

// Port is pinned deliberately. Port 3000 belongs to a different project and is
// never used by this repo; strictPort makes Vite fail loudly rather than drift
// onto another port if 5173 is busy.
export default defineConfig({
  plugins: [react(), tailwindcss(), phoebeDevRelay()],
  server: {
    port: 5173,
    strictPort: true,
  },
});
