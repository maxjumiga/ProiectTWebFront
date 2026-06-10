import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../types';
import RoleDropdown from './RoleDropdown';

interface UsersTableProps {
    filtered: User[];
    onDelete: (id: number) => void;
    onRoleChange: (id: number, newRole: 'admin' | 'user') => void;
}

// Formatare data inregistrare + timp relativ (ex: "10 Jun 2026 · 3 days ago")
function formatRegisteredOn(raw?: string): { date: string; relative: string } {
    if (!raw) return { date: '—', relative: '' };

    const d = new Date(raw);
    if (isNaN(d.getTime())) return { date: '—', relative: '' };

    const date = d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    const diffMs = Date.now() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let relative = '';
    if (diffDays === 0) relative = 'Today';
    else if (diffDays === 1) relative = 'Yesterday';
    else if (diffDays < 30) relative = `${diffDays} days ago`;
    else if (diffDays < 365) relative = `${Math.floor(diffDays / 30)} months ago`;
    else relative = `${Math.floor(diffDays / 365)} years ago`;

    return { date, relative };
}

export default function UsersTable({ filtered, onDelete, onRoleChange }: UsersTableProps) {
    return (
        <div className="um-card">
            <div className="table-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Registered</th>
                            <th>Onboarding</th>
                            <th>2FA</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="um-empty">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{ width: 40, height: 40, opacity: 0.3 }} />
                                    <span>No users found</span>
                                </td>
                            </tr>
                        ) : (
                            filtered.map(u => {
                                const { date, relative } = formatRegisteredOn(u.registeredOn);
                                return (
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
                                        <td>
                                            <RoleDropdown
                                                value={u.role}
                                                onChange={(newRole) => onRoleChange(u.id, newRole)}
                                            />
                                        </td>
                                        <td>
                                            <div className="user-details">
                                                <span className="user-name" style={{ fontSize: '12.5px' }}>{date}</span>
                                                {relative && <span className="user-email">{relative}</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${u.onboardingCompleted ? 'activ' : 'inactiv'}`}>
                                                {u.onboardingCompleted ? 'Completed' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${u.twoFactorEnabled ? 'activ' : 'inactiv'}`}>
                                                {u.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="um-actions">
                                                <button
                                                    className="btn-danger-sm"
                                                    onClick={() => onDelete(u.id)}
                                                    title="Delete user"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} style={{ width: 13, height: 13 }} />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
