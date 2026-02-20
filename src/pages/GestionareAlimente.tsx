import './GestionareAlimente.css';

export default function GestionareAlimente() {
    return (
        <div className="ga-empty">
            <div className="ga-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 2l1.5 13.5A2 2 0 0 0 6.5 17H18a2 2 0 0 0 2-1.5L21.5 6H6" />
                    <path d="M16 16v6" /><path d="M8 16v6" />
                    <path d="M12 16v6" />
                </svg>
            </div>
            <h2>Gestionare Alimente</h2>
            <p>Această secțiune este în curs de dezvoltare.<br />Funcționalitățile vor fi disponibile în curând.</p>
            <span className="ga-badge">În curând</span>
        </div>
    );
}
