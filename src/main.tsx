import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { watchViewport } from './lib/phone';
import './styles/base.css';

watchViewport();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
