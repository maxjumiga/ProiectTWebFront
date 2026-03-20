// ============================================================
// App.tsx — Componenta radacina a aplicatiei
// Delega intregul routing catre AppRoutes (care contine atat
// paginile publice/auth ale colegilor, cat si panoul admin).
// ============================================================

import AppRoutes from './routes/AppRoutes';

export default function App() {
  return <AppRoutes />;
}
