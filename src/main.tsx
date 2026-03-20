// ============================================================
// main.tsx — Punctul de intrare al aplicatiei React
// Acest fisier initializeaza aplicatia si o monteaza in DOM.
// Este primul fisier executat cand aplicatia porneste.
// ============================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // Stilurile globale aplicate pe intreaga aplicatie
import App from './App.tsx'

// --- Gestionarea erorilor de runtime ---
// Capteaza erorile JavaScript neasteptate si le afiseaza pe pagina
// in loc sa lase pagina alba — util pentru debugging in dezvoltare
window.addEventListener('error', (e) => {
  document.getElementById('root')!.innerHTML = `
    <div style="background:#0a0f1e;color:#ef4444;padding:32px;font-family:monospace;min-height:100vh;">
      <h2 style="margin-bottom:16px;">❌ Eroare Runtime</h2>
      <pre style="background:#1a0000;padding:16px;border-radius:8px;overflow:auto;font-size:13px;">${e.message}\n\n${e.error?.stack ?? ''}</pre>
    </div>`;
});

// Capteaza Promise-urile respinse (erori asincrone) si le afiseaza similar
window.addEventListener('unhandledrejection', (e) => {
  document.getElementById('root')!.innerHTML = `
    <div style="background:#0a0f1e;color:#ef4444;padding:32px;font-family:monospace;min-height:100vh;">
      <h2 style="margin-bottom:16px;">❌ Promise Rejection</h2>
      <pre style="background:#1a0000;padding:16px;border-radius:8px;overflow:auto;font-size:13px;">${String(e.reason)}</pre>
    </div>`;
});

// Monteaza aplicatia React in elementul HTML cu id="root" din index.html
// StrictMode activeaza verificari suplimentare in dezvoltare (nu afecteaza productia)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
