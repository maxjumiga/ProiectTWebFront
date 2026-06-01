// ============================================================
// routes/AdminAuthRoute.tsx — Protectia rutelor de admin
// Verifica daca utilizatorul este autentificat ca administrator.
// Daca nu, redirectioneaza automat la /admin/login.
// Autentificarea admin e stocata separat de auth-ul utilizatorilor
// normali, in sessionStorage cu cheia 'isAdminAuthenticated'.
// ============================================================

import { Navigate, Outlet } from 'react-router-dom';

// Functie helper pentru decodarea JWT (aceeasi ca in Authentication.tsx)
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export default function AdminAuthRoute() {
    const token = localStorage.getItem('token');
    
    let isAdminAuthenticated = false;

    if (token) {
        const decoded = parseJwt(token);
        const role = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded?.role;
        if (role === "Admin") {
            isAdminAuthenticated = true;
        }
    }

    if (!isAdminAuthenticated) {
        // Necautentificat ca admin → redirect la pagina de login comuna (/login)
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
