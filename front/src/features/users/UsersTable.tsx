import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../types';

interface UsersTableProps {
    filtered: User[];
    onDelete: (id: number) => void;
}

export default function UsersTable({ filtered, onDelete }: UsersTableProps) {
    return (
        <div className="um-card">
            <div className="table-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Onboarding</th>
                            <th>2FA</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="um-empty">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{ width: 40, height: 40, opacity: 0.3 }} />
                                    <span>No users found</span>
                                </td>
                            </tr>
                        ) : (
                            filtered.map(u => (
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
                                        <span className={`badge ${u.role}`}>{u.role === 'admin' ? 'Admin' : 'User'}</span>
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
