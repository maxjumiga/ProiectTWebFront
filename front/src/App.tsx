// ============================================================
// App.tsx — Componenta radacina a aplicatiei
// Delega intregul routing catre AppRoutes (care contine atat
// paginile publice/auth ale colegilor, cat si panoul admin).
// ============================================================

import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, []);

  return <AppRoutes />;
}
