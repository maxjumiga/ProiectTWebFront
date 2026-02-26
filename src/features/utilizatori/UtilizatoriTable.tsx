// UtilizatoriTable — tabelul cu lista de utilizatori
import type { User } from '../../types';
import CustomSelect from '../../components/CustomSelect';

const roleOptions = [{ value: 'user', label: 'Utilizator' }, { value: 'admin', label: 'Admin' }];
const roleColorMap: Record<string, string> = { admin: 'admin', user: 'user' };

interface UtilizatoriTableProps {
    filtered: User[];
    onRoleChange: (id: string, role: string) => void;
    onDelete: (id: string) => void;
}

export default function UtilizatoriTable({ filtered, onRoleChange, onDelete }: UtilizatoriTableProps) {
    return (
        <div className="um-card">
            <div className="table-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Utilizator</th>
                            <th>Rol</th>
                            <th>Data înregistrării</th>
                            <th style={{ textAlign: 'right' }}>Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="um-empty">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .3 }}>
                                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <span>Niciun utilizator găsit</span>
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
                                        <CustomSelect
                                            value={u.role}
                                            onChange={val => onRoleChange(u.id, val)}
                                            options={roleOptions}
                                            variant="inline"
                                            colorMap={roleColorMap}
                                        />
                                    </td>
                                    <td className="date-cell">{new Date(u.joinedAt).toLocaleDateString('ro-RO')}</td>
                                    <td>
                                        <div className="um-actions">
                                            <button
                                                className="btn-danger-sm"
                                                onClick={() => onDelete(u.id)}
                                                title="Șterge utilizator"
                                            >
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                                                </svg>
                                                Șterge
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
