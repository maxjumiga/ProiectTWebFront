// ============================================================
// pages/Dashboard.tsx — Pagina principala (dashboard)
// Afiseaza un rezumat al activitatii aplicatiei prin:
//   - 4 carduri de statistici (utilizatori total, saptamana, luna, activi)
//   - Tabel cu ultimii 5 utilizatori inregistrati
// Toate calculele se fac pe datele din mockData, folosind useMemo
// pentru a nu recalcula la fiecare randare inutila.
// ============================================================

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,          // Iconita card Total Utilizatori
    faArrowTrendUp,   // Iconita card Aceasta Saptamana
    faCalendarDays,   // Iconita card Aceasta Luna
    faCircleCheck,    // Iconita card Utilizatori Activi
    faArrowRight,     // Sageata "Vezi toti"
} from '@fortawesome/free-solid-svg-icons';
import { mockUsers } from '../../data/mockData';
import StatsCard from '../../components/StatsCard';
import './AdminDashboard.css';

// Calculeaza primul minut al saptamanii curente (duminica la 00:00)
function startOfWeek(date: Date) {
    const d = new Date(date);
    const day = d.getDay(); // 0 = duminica, 6 = sambata
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
}

// Calculeaza primul minut al lunii curente (ziua 1 la 00:00)
function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default function AdminDashboard() {
    const now = new Date();

    // Calculam toate statisticile dintr-o singura trecere prin mockUsers
    // useMemo previne recalculul la fiecare randare (doar cand se schimba dependintele)
    const stats = useMemo(() => {
        const weekStart = startOfWeek(now);
        const monthStart = startOfMonth(now);

        const total = mockUsers.length;
        // Filtram utilizatorii inregistrati in aceasta saptamana
        const thisWeek = mockUsers.filter(u => new Date(u.joinedAt) >= weekStart).length;
        // Filtram utilizatorii inregistrati in aceasta luna
        const thisMonth = mockUsers.filter(u => new Date(u.joinedAt) >= monthStart).length;
        const activi = mockUsers.filter(u => u.status === 'activ').length;
        const inactivi = total - activi;
        const admins = mockUsers.filter(u => u.role === 'admin').length;

        return { total, thisWeek, thisMonth, activi, inactivi, admins };
    }, []); // Array gol = se calculeaza o singura data la montare

    // Sortam utilizatorii dupa data inregistrarii (cel mai recent primul)
    // si luam primii 5 pentru tabelul "Utilizatori Recenti"
    const recentUsers = useMemo(
        () => [...mockUsers].sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()).slice(0, 5),
        []
    );

    return (
        <div className="dashboard">

            {/* Grila cu 4 carduri de statistici */}
            <div className="stats-grid">
                <StatsCard
                    icon={<FontAwesomeIcon icon={faUsers} style={{ width: 22, height: 22 }} />}
                    label="Total Users"
                    value={stats.total}
                    color="blue"
                    trend={`${stats.admins} administrators · ${stats.total - stats.admins} users`}
                />
                <StatsCard
                    icon={<FontAwesomeIcon icon={faArrowTrendUp} style={{ width: 22, height: 22 }} />}
                    label="This Week"
                    value={stats.thisWeek}
                    color="green"
                    trend="Recently registered users"
                />
                <StatsCard
                    icon={<FontAwesomeIcon icon={faCalendarDays} style={{ width: 22, height: 22 }} />}
                    label="This Month"
                    value={stats.thisMonth}
                    color="amber"
                    trend="Users registered this month"
                />
                <StatsCard
                    icon={<FontAwesomeIcon icon={faCircleCheck} style={{ width: 22, height: 22 }} />}
                    label="Active Users"
                    value={stats.activi}
                    color="purple"
                    trend={`${stats.inactivi} inactive`}
                />
            </div>

            {/* Sectiunea cu tabelul utilizatorilor recenti */}
            <div className="dashboard-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">Recent Users</h2>
                        <p className="section-sub">Last 5 registered users</p>
                    </div>
                    {/* Link catre pagina completa de utilizatori */}
                    <Link to="/users" className="btn-link">
                        View all
                        <FontAwesomeIcon icon={faArrowRight} style={{ width: 14, height: 14 }} />
                    </Link>
                </div>

                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Registration Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map(u => (
                                <tr key={u.id}>
                                    {/* Celula utilizator: avatar cu initiala + nume + email */}
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">{u.name.charAt(0)}</div>
                                            <div className="user-details">
                                                <span className="user-name">{u.name}</span>
                                                <span className="user-email">{u.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Badge colorat pentru rol */}
                                    <td><span className={`badge ${u.role}`}>{u.role === 'admin' ? 'Admin' : 'User'}</span></td>
                                    {/* Badge colorat pentru status */}
                                    <td><span className={`badge ${u.status}`}>{u.status === 'activ' ? 'Active' : 'Inactive'}</span></td>
                                    {/* Data formatata in engleza */}
                                    <td className="date-cell">{new Date(u.joinedAt).toLocaleDateString('en-US')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
