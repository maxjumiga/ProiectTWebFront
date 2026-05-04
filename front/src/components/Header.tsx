// ============================================================
// components/Header.tsx — Bara de sus (header) a aplicatiei
// Afiseaza dinamic titlul si subtitlul paginii curente,
// citind URL-ul curent cu hook-ul useLocation din react-router.
// Contine data curenta formatata in romana si butonul de logout.
// ============================================================

import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

// Map intre caile URL si titlurile corespunzatoare afisate in header
const routeTitles: Record<string, { title: string; subtitle: string }> = {
    '/admin': { title: 'Main Panel', subtitle: 'Welcome back, Administrator' },
    '/users': { title: 'User Management', subtitle: 'Manage user accounts' },
    '/food': { title: 'Food Management', subtitle: 'Manage the food database' },
    '/exercises': { title: 'Exercises Management', subtitle: 'Manage the exercises database' },
};

export default function Header() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const meta = routeTitles[pathname] ?? { title: 'Admin Panel', subtitle: '' };

    // Data curenta formatata in romana (ex: "Vineri, 20 Martie 2026")
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Sterge datele de autentificare admin si redirectioneaza la /login
    const handleLogout = () => {
        sessionStorage.removeItem('isAdminAuthenticated');
        sessionStorage.removeItem('isAuthenticated');
        navigate('/login', { replace: true });
    };

    return (
        <header className="header">
            {/* Stanga: titlul si subtitlul paginii curente */}
            <div className="header-left">
                <h1 className="header-title">{meta.title}</h1>
                {meta.subtitle && <p className="header-subtitle">{meta.subtitle}</p>}
            </div>

            {/* Dreapta: data + buton logout */}
            <div className="header-right">
                <div className="header-date">
                    <FontAwesomeIcon icon={faCalendarDays} style={{ width: 14, height: 14 }} />
                    <span>{today}</span>
                </div>

                <button
                    className="header-logout-btn"
                    onClick={handleLogout}
                    title="Logout from admin panel"
                >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
}
