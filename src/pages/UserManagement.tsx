import { useState, useMemo } from 'react';
import { mockUsers } from '../data/mockData';
import type { User, Role } from '../types';
import CustomSelect from '../components/CustomSelect';
import './UserManagement.css';

// ── Option lists ──────────────────────────────────────────────────
const roleFilterOptions = [
    { value: 'all', label: 'Toate rolurile' },
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'Utilizator' },
];
const statusFilterOptions = [
    { value: 'all', label: 'Toate statusurile' },
    { value: 'activ', label: 'Activ' },
    { value: 'inactiv', label: 'Inactiv' },
];
const roleOptions = [
    { value: 'user', label: 'Utilizator' },
    { value: 'admin', label: 'Admin' },
];
const roleColorMap: Record<string, string> = { admin: 'admin', user: 'user' };

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Delete confirmation
    const [deleteId, setDeleteId] = useState<string | null>(null);

    /* ── filtered list ── */
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return users.filter(u => {
            const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
            const matchRole = filterRole === 'all' || u.role === filterRole;
            const matchStatus = filterStatus === 'all' || u.status === filterStatus;
            return matchSearch && matchRole && matchStatus;
        });
    }, [users, search, filterRole, filterStatus]);

    /* ── delete user ── */
    function confirmDelete() {
        if (deleteId) {
            setUsers(prev => prev.filter(u => u.id !== deleteId));
            setDeleteId(null);
        }
    }

    /* ── inline role change ── */
    function changeRole(id: string, role: string) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: role as Role } : u));
    }

    return (
        <div className="um">
            {/* ── Toolbar ── */}
            <div className="um-toolbar">
                <div className="um-search-wrap">
                    <svg className="um-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        className="um-search"
                        type="text"
                        placeholder="Caută după nume sau email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className="um-search-clear" onClick={() => setSearch('')} title="Șterge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    )}
                </div>

                <div className="um-filters">
                    <CustomSelect
                        value={filterRole}
                        onChange={setFilterRole}
                        options={roleFilterOptions}
                        variant="default"
                    />
                    <CustomSelect
                        value={filterStatus}
                        onChange={setFilterStatus}
                        options={statusFilterOptions}
                        variant="default"
                    />
                </div>


            </div>

            {/* ── Result count ── */}
            <p className="um-count">
                {filtered.length === users.length
                    ? `${users.length} utilizatori total`
                    : `${filtered.length} din ${users.length} utilizatori`}
            </p>

            {/* ── Table ── */}
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
                                                onChange={val => changeRole(u.id, val)}
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
                                                    onClick={() => setDeleteId(u.id)}
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



            {/* ── Delete confirmation dialog ── */}
            {deleteId && (
                <div className="modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="modal modal--sm" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirmare ștergere</h3>
                            <button className="modal-close" onClick={() => setDeleteId(null)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="confirm-text">
                                Ești sigur că vrei să ștergi utilizatorul <strong>{users.find(u => u.id === deleteId)?.name}</strong>? Această acțiune nu poate fi anulată.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-ghost" onClick={() => setDeleteId(null)}>Anulează</button>
                            <button className="btn-danger" onClick={confirmDelete}>Șterge</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
