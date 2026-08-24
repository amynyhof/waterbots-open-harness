import { defineConfig, type Plugin } from 'vite';
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
 */
function phoebeDevRelay(): Plugin {
  return {
    name: 'phoebe-dev-relay',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/phoebe', async (req, res) => {
        try {
          const module = await server.ssrLoadModule('/api/phoebe.ts');
          const handler = module.default as (r: Request) => Promise<Response>;

          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);

          const request = new Request('http://localhost/api/phoebe', {
            method: req.method,
            headers: { 'content-type': req.headers['content-type'] ?? 'application/json' },
            body: chunks.length ? Buffer.concat(chunks) : undefined,
          });

          const result = await handler(request);
          res.statusCode = result.status;
          result.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(await result.text());
        } catch (error) {
          /* An honest failure. The console shows the message rather than
             hanging or inventing a reply. */
          server.config.logger.error(`[phoebe-dev-relay] ${String(error)}`);
          res.statusCode = 500;
          res.setHeader('content-type', 'application/json');
          res.end(
            JSON.stringify({
              error:
                'The local relay failed before reaching Phoebe. The dev server log has the details.',
            })
          );
        }
      });
    },
  };
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
