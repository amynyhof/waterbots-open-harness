import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import { beforeSend } from './lib/analytics';
import { watchViewport } from './lib/phone';
import './styles/base.css';

watchViewport();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* Cookie-free page views, the path only (src/lib/analytics.ts). */}
    <Analytics beforeSend={beforeSend} />
  </StrictMode>
);
