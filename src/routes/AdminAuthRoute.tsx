// ============================================================
// routes/AdminAuthRoute.tsx — Protectia rutelor de admin
// Verifica daca utilizatorul este autentificat ca administrator.
// Daca nu, redirectioneaza automat la /admin/login.
// Autentificarea admin e stocata separat de auth-ul utilizatorilor
// normali, in sessionStorage cu cheia 'isAdminAuthenticated'.
// ============================================================

import { Navigate, Outlet } from 'react-router-dom';

export default function AdminAuthRoute() {
    const isAdminAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';

    if (!isAdminAuthenticated) {
        // Necautentificat ca admin → redirect la pagina de login admin
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}
