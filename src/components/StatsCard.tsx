import './StatsCard.css';

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: 'blue' | 'green' | 'amber' | 'purple';
    trend?: string;
}

export default function StatsCard({ icon, label, value, color, trend }: StatsCardProps) {
    return (
        <div className={`stats-card stats-card--${color}`}>
            <div className="stats-card-icon">{icon}</div>
            <div className="stats-card-body">
                <span className="stats-card-label">{label}</span>
                <span className="stats-card-value">{value}</span>
                {trend && <span className="stats-card-trend">{trend}</span>}
            </div>
        </div>
    );
}
