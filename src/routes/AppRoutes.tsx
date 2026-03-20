// ============================================================
// AppRoutes.tsx — Sistemul central de rutare al aplicatiei
// Contine rutele publice/auth ale colegilor (Landing, Login,
// Register, Onboarding, Dashboard user, Profile, Settings,
// Calendar) cat si rutele panoului admin (JumigaMaximilian)
// protejate de AdminAuthRoute cu login propriu la /admin/login.
// ============================================================

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// -- Pagini colegi --
import Landing from '../pages/landing/Landing';
import Autentificare from '../features/autentificare/autentificare';
import Inregistrare from '../features/inregistrare/inregistrare';
import Dashboard from '../pages/Dashboard/Dashboard';
import Profile from '../pages/Dashboard/profile/profil';
import Settings from '../pages/Dashboard/settings/Settings';
import Calendar from '../pages/Dashboard/calendar/calendar';
import Onboarding from '../features/onboarding/Onboarding';
import AuthRoute from './AuthRoute';
import GuestRoute from './GuestRoute';

// -- Pagini admin (JumigaMaximilian) --
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AdminDashboard from '../pages/Dashboard';
import UserManagement from '../pages/utilizatori/UserManagement';
import GestionareAlimente from '../pages/alimente/GestionareAlimente';
import GestionareExercitii from '../pages/exercitii/GestionareExercitii';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminAuthRoute from './AdminAuthRoute';

// Layout-ul panoului admin: Sidebar fix + Header + continut pagina
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

                {/* Protected Routes — utilizator autentificat (colegi) */}
                <Route element={<AuthRoute />}>
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/calendar" element={<Calendar />} />
                </Route>

                {/* Admin Login — pagina publica de autentificare admin */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Panel Routes — protejate de AdminAuthRoute (isAdminAuthenticated) */}
                <Route element={<AdminAuthRoute />}>
                    <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
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
