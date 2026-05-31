import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faArrowTrendUp,
    faCalendarDays,
    faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../types';
import StatsCard from '../../components/StatsCard';
import { getAdminUsers } from '../../services/adminApi';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [requestError, setRequestError] = useState('');

    useEffect(() => {
        async function loadUsers() {
            try {
                setLoading(true);
                setRequestError('');
                setUsers(await getAdminUsers());
            } catch (error) {
                setRequestError(error instanceof Error ? error.message : 'Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, []);

    const stats = useMemo(() => {
        const total = users.length;
        const admins = users.filter(u => u.role === 'admin').length;
        const onboarded = users.filter(u => u.onboardingCompleted).length;
        const pendingOnboarding = total - onboarded;
        const twoFactor = users.filter(u => u.twoFactorEnabled).length;

        return { total, admins, onboarded, pendingOnboarding, twoFactor };
    }, [users]);

    const recentUsers = useMemo(
        () => [...users].sort((a, b) => b.id - a.id).slice(0, 5),
        [users]
    );

    return (
        <div className="dashboard">
            {requestError && <div className="form-error" style={{ marginBottom: '1rem' }}>{requestError}</div>}

            <div className="stats-grid">
                <StatsCard
                    icon={<FontAwesomeIcon icon={faUsers} style={{ width: 22, height: 22 }} />}
                    label="Total Users"
                    value={stats.total}
                    color="blue"
                    trend={`${stats.admins} administrators · ${stats.total - stats.admins} standard users`}
                />
                <StatsCard
                    icon={<FontAwesomeIcon icon={faArrowTrendUp} style={{ width: 22, height: 22 }} />}
                    label="Onboarded"
                    value={stats.onboarded}
                    color="green"
                    trend={`${stats.pendingOnboarding} users still pending onboarding`}
                />
                <StatsCard
                    icon={<FontAwesomeIcon icon={faCalendarDays} style={{ width: 22, height: 22 }} />}
                    label="2FA Enabled"
                    value={stats.twoFactor}
                    color="amber"
                    trend="Accounts protected with two-factor authentication"
                />
                <StatsCard
                    icon={<FontAwesomeIcon icon={faCircleCheck} style={{ width: 22, height: 22 }} />}
                    label="Pending Setup"
                    value={stats.pendingOnboarding}
                    color="purple"
                    trend="Users who have not completed onboarding yet"
                />
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">Latest Users</h2>
                        <p className="section-sub">Most recent users returned by the API</p>
                    </div>
                </div>

                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Onboarding</th>
                                <th>2FA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="um-empty">Loading dashboard data...</td>
                                </tr>
                            ) : (
                                recentUsers.map(u => (
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
                                        <td><span className={`badge ${u.role}`}>{u.role === 'admin' ? 'Admin' : 'User'}</span></td>
                                        <td><span className={`badge ${u.onboardingCompleted ? 'activ' : 'inactiv'}`}>{u.onboardingCompleted ? 'Completed' : 'Pending'}</span></td>
                                        <td><span className={`badge ${u.twoFactorEnabled ? 'activ' : 'inactiv'}`}>{u.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
