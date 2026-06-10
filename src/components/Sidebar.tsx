// ============================================================
// components/Sidebar.tsx — Meniul lateral de navigare (sidebar)
// Componenta fixa pe partea stanga a ecranului care contine:
//   - Logo-ul aplicatiei cu iconita si numele
//   - Lista de linkuri de navigare (NavLink)
//   - Informatii despre utilizatorul logat (admin chip)
// NavLink din react-router-dom aplica automat clasa "activa"
// pe link-ul care corespunde URL-ului curent.
// ============================================================

import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTableCells,      // Iconita dashboard (grila de patrate)
    faUsers,           // Iconita utilizatori
    faBasketShopping,  // Iconita alimente
    faDumbbell,        // Iconita exercitii
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

// ── Citeste si decodifica JWT-ul din localStorage ────────────
function getAdminInfoFromToken(): { name: string; role: string } {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { name: 'Administrator', role: 'Admin' };

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(
            decodeURIComponent(
                window.atob(base64).split('').map(c =>
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join('')
            )
        );

        // ASP.NET Core pune numele in ClaimTypes.Name
        const name =
            payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
            payload['name'] ||
            payload['unique_name'] ||
            'Administrator';

        const role =
            payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
            payload['role'] ||
            'Admin';

        return { name, role };
    } catch {
        return { name: 'Administrator', role: 'Admin' };
    }
}

// Lista de elemente de navigare — fiecare are o cale URL, eticheta si iconita
const navItems = [
    {
        to: '/admin',
        label: 'Main Panel',
        icon: faTableCells,
    },
    {
        to: '/admin/users',
        label: 'Users',
        icon: faUsers,
    },
    {
        to: '/admin/food',
        label: 'Food Management',
        icon: faBasketShopping,
    },
    {
        to: '/admin/exercises',
        label: 'Exercises Management',
        icon: faDumbbell,
    },
];

export default function Sidebar() {
    const { name, role } = getAdminInfoFromToken();
    // Initiala avatarului — prima litera a numelui, cu majuscula
    const initial = name.charAt(0).toUpperCase();

    return (
        <aside className="sidebar">

            {/* Zona logo — iconita + numele aplicatiei + subtitlul */}
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <img src="/favicon.svg" alt="OmniTrack Logo" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                </div>
                <div className="logo-text">
                    <span className="logo-name">OmniTrack</span>
                    <span className="logo-sub">Admin Panel</span>
                </div>
            </div>

            {/* Navigarea principala — se genereaza din lista navItems */}
            <nav className="sidebar-nav">
                <span className="nav-section-label">Navigation</span>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        // Functie care returneaza clasa CSS — adauga "nav-link--active" pe link-ul curent
                        className={({ isActive }) =>
                            'nav-link' + (isActive ? ' nav-link--active' : '')
                        }
                    >
                        {/* Containerul iconiței */}
                        <span className="nav-icon">
                            <FontAwesomeIcon icon={item.icon} style={{ width: 18, height: 18 }} />
                        </span>
                        {/* Eticheta textului */}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer sidebar — informatii despre administratorul logat (citite din JWT) */}
            <div className="sidebar-footer">
                <div className="admin-chip">
                    {/* Avatar cu initiala numelui real din token */}
                    <div className="admin-avatar">{initial}</div>
                    <div className="admin-info">
                        <span className="admin-name" title={name}>{name}</span>
                        <span className="admin-role">{role}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
