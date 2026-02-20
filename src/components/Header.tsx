import { useLocation } from 'react-router-dom';
import './Header.css';

const routeTitles: Record<string, { title: string; subtitle: string }> = {
    '/dashboard': { title: 'Panou Principal', subtitle: 'Bine ai venit înapoi, Administrator' },
    '/utilizatori': { title: 'Gestionare Utilizatori', subtitle: 'Administrează conturile utilizatorilor' },
    '/alimente': { title: 'Gestionare Alimente', subtitle: 'Administrează baza de date cu alimente' },
};

export default function Header() {
    const { pathname } = useLocation();
    const meta = routeTitles[pathname] ?? { title: 'Admin Panel', subtitle: '' };

    const today = new Date().toLocaleDateString('ro-RO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="header">
            <div className="header-left">
                <h1 className="header-title">{meta.title}</h1>
                {meta.subtitle && <p className="header-subtitle">{meta.subtitle}</p>}
            </div>
            <div className="header-right">
                <div className="header-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{today}</span>
                </div>
                <div className="header-badge">
                    <span className="header-badge-dot" />
                    Sistem activ
                </div>
            </div>
        </header>
    );
}
