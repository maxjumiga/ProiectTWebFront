// ============================================================
// App.tsx — Componenta radacina a aplicatiei
// Configureaza rutarea (navigarea intre pagini) si structura
// generala a layout-ului: Sidebar + Header + continut pagina.
// Orice pagina noua trebuie adaugata ca <Route> aici.
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';       // Meniul lateral de navigare
import Header from './components/Header';         // Bara de sus cu titlul paginii
import Dashboard from './pages/Dashboard';        // Pagina principala cu statistici
import UserManagement from './pages/utilizatori/UserManagement';        // Pagina gestionare utilizatori
import GestionareAlimente from './pages/alimente/GestionareAlimente';   // Pagina gestionare alimente
import GestionareExercitii from './pages/exercitii/GestionareExercitii'; // Pagina gestionare exercitii
import './index.css'; // Stiluri globale suplimentare

export default function App() {
  return (
    // BrowserRouter — activeaza rutarea bazata pe URL (ex: /dashboard, /utilizatori)
    <BrowserRouter>
      {/* app-shell — containerul principal care tine sidebar-ul si continutul */}
      <div className="app-shell">

        {/* Sidebar — meniul lateral fix cu linkuri de navigare */}
        <Sidebar />

        {/* main-area — zona dreapta: header + pagina curenta */}
        <div className="main-area">

          {/* Header — bara de sus cu titlul paginii curente si data */}
          <Header />

          {/* page-content — zona cu scroll unde se randeaza pagina activa */}
          <main className="page-content">
            <Routes>
              {/* Redirecteaza calea radacina "/" catre "/dashboard" automat */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Fiecare Route asociaza un URL cu o componenta de pagina */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/utilizatori" element={<UserManagement />} />
              <Route path="/alimente" element={<GestionareAlimente />} />
              <Route path="/exercitii" element={<GestionareExercitii />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
