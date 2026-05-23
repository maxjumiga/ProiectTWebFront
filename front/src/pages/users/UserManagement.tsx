import { useEffect, useMemo, useState } from 'react';
import type { User } from '../../types';
import SearchBar from '../../components/SearchBar';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import CustomSelect from '../../components/CustomSelect';
import UsersTable from '../../features/users/UsersTable';
import { deleteAdminUser, getAdminUsers } from '../../services/adminApi';
import './UserManagement.css';

const roleFilterOptions = [
    { value: 'all', label: 'All roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
];

const statusFilterOptions = [
    { value: 'all', label: 'All onboarding states' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
];

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [requestError, setRequestError] = useState('');

    async function loadUsers() {
        try {
            setLoading(true);
            setRequestError('');
            setUsers(await getAdminUsers());
        } catch (error) {
            setRequestError(error instanceof Error ? error.message : 'Failed to load users.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return users.filter(u =>
            (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
            (filterRole === 'all' || u.role === filterRole) &&
            (
                filterStatus === 'all' ||
                (filterStatus === 'completed' && u.onboardingCompleted) ||
                (filterStatus === 'pending' && !u.onboardingCompleted)
            )
        );
    }, [users, search, filterRole, filterStatus]);

    async function handleDelete() {
        if (!deleteId) return;

        try {
            await deleteAdminUser(deleteId);
            setDeleteId(null);
            await loadUsers();
        } catch (error) {
            setRequestError(error instanceof Error ? error.message : 'Failed to delete user.');
        }
    }

    return (
        <div className="um">
            <div className="um-toolbar">
                <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." />
                <div className="um-filters">
                    <CustomSelect value={filterRole} onChange={setFilterRole} options={roleFilterOptions} variant="default" />
                    <CustomSelect value={filterStatus} onChange={setFilterStatus} options={statusFilterOptions} variant="default" />
                </div>
            </div>

            {requestError && <div className="form-error" style={{ marginBottom: '1rem' }}>{requestError}</div>}

            <p className="um-count">
                {filtered.length === users.length
                    ? `${users.length} users total`
                    : `${filtered.length} of ${users.length} users`}
            </p>

            {loading ? (
                <div className="um-card"><div className="um-empty"><span>Loading users...</span></div></div>
            ) : (
                <UsersTable
                    filtered={filtered}
                    onDelete={setDeleteId}
                />
            )}

            {deleteId && (
                <ConfirmDeleteModal
                    itemName={`user ${users.find(u => u.id === deleteId)?.name}`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}
