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
    faHeartPulse,      // Iconita logo aplicatie
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

// Lista de elemente de navigare — fiecare are o cale URL, eticheta si iconita
const navItems = [
    {
        to: '/admin',
        label: 'Panou Principal',
        icon: faTableCells,
    },
    {
        to: '/utilizatori',
        label: 'Utilizatori',
        icon: faUsers,
    },
    {
        to: '/alimente',
        label: 'Gestionare Alimente',
        icon: faBasketShopping,
    },
    {
        to: '/exercitii',
        label: 'Gestionare Exerciții',
        icon: faDumbbell,
    },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">

            {/* Zona logo — iconita + numele aplicatiei + subtitlul */}
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <FontAwesomeIcon icon={faHeartPulse} style={{ width: 20, height: 20 }} />
                </div>
                <div className="logo-text">
                    <span className="logo-name">SănătateApp</span>
                    <span className="logo-sub">Panou Admin</span>
                </div>
            </div>

            {/* Navigarea principala — se genereaza din lista navItems */}
            <nav className="sidebar-nav">
                <span className="nav-section-label">Navigare</span>
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

            {/* Footer sidebar — informatii despre administratorul logat */}
            <div className="sidebar-footer">
                <div className="admin-chip">
                    {/* Avatar cu initiala numelui */}
                    <div className="admin-avatar">A</div>
                    <div className="admin-info">
                        <span className="admin-name">Administrator</span>
                        <span className="admin-role">Super Admin</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
