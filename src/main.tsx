import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Prinde orice eroare de runtime și o afișează pe pagină (debugging)
window.addEventListener('error', (e) => {
  document.getElementById('root')!.innerHTML = `
    <div style="background:#0a0f1e;color:#ef4444;padding:32px;font-family:monospace;min-height:100vh;">
      <h2 style="margin-bottom:16px;">❌ Eroare Runtime</h2>
      <pre style="background:#1a0000;padding:16px;border-radius:8px;overflow:auto;font-size:13px;">${e.message}\n\n${e.error?.stack ?? ''}</pre>
    </div>`;
});

window.addEventListener('unhandledrejection', (e) => {
  document.getElementById('root')!.innerHTML = `
    <div style="background:#0a0f1e;color:#ef4444;padding:32px;font-family:monospace;min-height:100vh;">
      <h2 style="margin-bottom:16px;">❌ Promise Rejection</h2>
      <pre style="background:#1a0000;padding:16px;border-radius:8px;overflow:auto;font-size:13px;">${String(e.reason)}</pre>
    </div>`;
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
