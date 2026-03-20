// ============================================================
// AppRoutes.tsx — Sistemul central de rutare al aplicatiei
// Contine atat rutele publice/auth ale colegilor (Landing,
// Login, Register, Onboarding, Dashboard user, Profile etc.)
// cat si rutele panoului admin (Utilizatori, Alimente, Exercitii)
// cu layout-ul sau Sidebar + Header.
// ============================================================

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// -- Pagini colegi --
import Landing from '../pages/landing/Landing';
import Autentificare from '../features/autentificare/Autentificare';
import Inregistrare from '../features/inregistrare/Inregistrare';
import Dashboard from '../pages/Dashboard/Dashboard';
import Profile from '../pages/Dashboard/profile/Profil';
import Settings from '../pages/Dashboard/settings/Settings';
import Calendar from '../pages/Dashboard/calendar/Calendar';
import Onboarding from '../features/onboarding/Onboarding';
import AuthRoute from './AuthRoute';
import GuestRoute from './GuestRoute';

// -- Pagini admin (JumigaMaximilian) --
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import UserManagement from '../pages/utilizatori/UserManagement';
import GestionareAlimente from '../pages/alimente/GestionareAlimente';
import GestionareExercitii from '../pages/exercitii/GestionareExercitii';

// Layout-ul panoului admin: Sidebar fix + Header + continut
function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="app-shell">
            <Sidebar />
            <div className="main-area">
                <Header />
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                {/* Public Routes — pagina principala */}
                <Route path="/" element={<Landing />} />

                {/* Guest Routes — doar pentru utilizatori neautentificati */}
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<Autentificare />} />
                    <Route path="/register" element={<Inregistrare />} />
                </Route>

                {/* Protected Routes — utilizator autentificat */}
                <Route element={<AuthRoute />}>
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/calendar" element={<Calendar />} />

                    {/* Admin Panel Routes (JumigaMaximilian) — cu layout Sidebar + Header */}
                    <Route path="/utilizatori" element={<AdminLayout><UserManagement /></AdminLayout>} />
                    <Route path="/alimente" element={<AdminLayout><GestionareAlimente /></AdminLayout>} />
                    <Route path="/exercitii" element={<AdminLayout><GestionareExercitii /></AdminLayout>} />
                </Route>

                {/* Fallback — orice ruta necunoscuta → Landing */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}
