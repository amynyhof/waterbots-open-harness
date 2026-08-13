import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Port is pinned deliberately. Port 3000 belongs to a different project and is
// never used by this repo; strictPort makes Vite fail loudly rather than drift
// onto another port if 5173 is busy.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
  },
});
