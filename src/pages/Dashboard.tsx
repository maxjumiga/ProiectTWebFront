import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockUsers } from '../data/mockData';
import StatsCard from '../components/StatsCard';
import './Dashboard.css';

function startOfWeek(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
}

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default function Dashboard() {
    const now = new Date();

    const stats = useMemo(() => {
        const weekStart = startOfWeek(now);
        const monthStart = startOfMonth(now);

        const total = mockUsers.length;
        const thisWeek = mockUsers.filter(u => new Date(u.joinedAt) >= weekStart).length;
        const thisMonth = mockUsers.filter(u => new Date(u.joinedAt) >= monthStart).length;
        const activi = mockUsers.filter(u => u.status === 'activ').length;
        const inactivi = total - activi;
        const admins = mockUsers.filter(u => u.role === 'admin').length;

        return { total, thisWeek, thisMonth, activi, inactivi, admins };
    }, []);

    const recentUsers = useMemo(
        () => [...mockUsers].sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()).slice(0, 5),
        []
    );

    return (
        <div className="dashboard">
            {/* Stats grid */}
            <div className="stats-grid">
                <StatsCard
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                    label="Total Utilizatori"
                    value={stats.total}
                    color="blue"
                    trend={`${stats.admins} administratori · ${stats.total - stats.admins} utilizatori`}
                />
                <StatsCard
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
                    label="Această Săptămână"
                    value={stats.thisWeek}
                    color="green"
                    trend="Utilizatori înregistrați recent"
                />
                <StatsCard
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
                    label="Această Lună"
                    value={stats.thisMonth}
                    color="amber"
                    trend="Utilizatori înregistrați luna curentă"
                />
                <StatsCard
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
                    label="Utilizatori Activi"
                    value={stats.activi}
                    color="purple"
                    trend={`${stats.inactivi} inactivi`}
                />
            </div>

            {/* Recent users table */}
            <div className="dashboard-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">Utilizatori Recenți</h2>
                        <p className="section-sub">Ultimii 5 utilizatori înregistrați</p>
                    </div>
                    <Link to="/utilizatori" className="btn-link">
                        Vezi toți
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </Link>
                </div>

                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Utilizator</th>
                                <th>Rol</th>
                                <th>Status</th>
                                <th>Data înregistrării</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map(u => (
                                <tr key={u.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">{u.name.charAt(0)}</div>
                                            <div className="user-details">
                                                <span className="user-name">{u.name}</span>
                                                <span className="user-email">{u.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className={`badge ${u.role}`}>{u.role === 'admin' ? 'Admin' : 'Utilizator'}</span></td>
                                    <td><span className={`badge ${u.status}`}>{u.status === 'activ' ? 'Activ' : 'Inactiv'}</span></td>
                                    <td className="date-cell">{new Date(u.joinedAt).toLocaleDateString('ro-RO')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
