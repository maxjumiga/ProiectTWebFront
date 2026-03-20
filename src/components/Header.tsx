// ============================================================
// components/Header.tsx — Bara de sus (header) a aplicatiei
// Afiseaza dinamic titlul si subtitlul paginii curente,
// citind URL-ul curent cu hook-ul useLocation din react-router.
// Contine si data curenta formatata in limba romana.
// ============================================================

import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

// Map intre caile URL si titlurile corespunzatoare afisate in header
// Daca URL-ul nu e in map, se afiseaza titlul implicit "Admin Panel"
const routeTitles: Record<string, { title: string; subtitle: string }> = {
    '/dashboard': { title: 'Panou Principal', subtitle: 'Bine ai venit înapoi, Administrator' },
    '/utilizatori': { title: 'Gestionare Utilizatori', subtitle: 'Administrează conturile utilizatorilor' },
    '/alimente': { title: 'Gestionare Alimente', subtitle: 'Administrează baza de date cu alimente' },
    '/exercitii': { title: 'Gestionare Exerciții', subtitle: 'Administrează baza de date cu exerciții' },
};

export default function Header() {
    // Obtinem calea URL curenta (ex: '/dashboard') pentru a determina titlul
    const { pathname } = useLocation();

    // Gasim metadatele paginii curente; fallback la "Admin Panel" daca ruta nu e cunoscuta
    const meta = routeTitles[pathname] ?? { title: 'Admin Panel', subtitle: '' };

    // Formatam data curenta in romana (ex: "vineri, 6 martie 2026")
    const today = new Date().toLocaleDateString('ro-RO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="header">
            {/* Stanga: titlul si subtitlul paginii curente */}
            <div className="header-left">
                <h1 className="header-title">{meta.title}</h1>
                {/* Subtitlul apare doar daca exista (conditional rendering) */}
                {meta.subtitle && <p className="header-subtitle">{meta.subtitle}</p>}
            </div>

            {/* Dreapta: data curenta cu iconita de calendar */}
            <div className="header-right">
                <div className="header-date">
                    <FontAwesomeIcon icon={faCalendarDays} style={{ width: 14, height: 14 }} />
                    <span>{today}</span>
                </div>
            </div>
        </header>
    );
}
