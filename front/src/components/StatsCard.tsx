// ============================================================
// components/StatsCard.tsx — Card statistica pentru Dashboard
// Afiseaza o singura metrica (ex: Total Utilizatori) cu:
//   - iconi ta relevanta
//   - eticheta descriptiva
//   - valoarea numerica
//   - un text optional de tendinta/detaliu
// Culoarea borderei stanga se schimba in functie de prop-ul "color"
// ============================================================

import './StatsCard.css';

// Tipurile de date acceptate de componenta
interface StatsCardProps {
    icon: React.ReactNode;             // Iconita Font Awesome sau orice element React
    label: string;                     // Titlul cardului (ex: "Total Utilizatori")
    value: number | string;            // Valoarea principala afisata mare
    color: 'blue' | 'green' | 'amber' | 'purple'; // Culoarea accentului
    trend?: string;                    // Text optional sub valoare (ex: "2 administratori")
}

export default function StatsCard({ icon, label, value, color, trend }: StatsCardProps) {
    return (
        // Clasa dinamica aplica culoarea borderii: stats-card--blue, --green etc.
        <div className={`stats-card stats-card--${color}`}>

            {/* Zona iconiței — fundal colorat in functie de tema */}
            <div className="stats-card-icon">{icon}</div>

            {/* Zona textului — eticheta, valoare, tendinta */}
            <div className="stats-card-body">
                <span className="stats-card-label">{label}</span>
                <span className="stats-card-value">{value}</span>
                {/* Afiseaza textul de tendinta doar daca exista */}
                {trend && <span className="stats-card-trend">{trend}</span>}
            </div>
        </div>
    );
}
