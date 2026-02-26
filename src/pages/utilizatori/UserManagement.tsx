// UserManagement — pagina de gestionare utilizatori
import { useState, useMemo } from 'react';
import { mockUsers } from '../../data/mockData';
import type { User, Role } from '../../types';
import SearchBar from '../../components/SearchBar';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import CustomSelect from '../../components/CustomSelect';
import UtilizatoriTable from '../../features/utilizatori/UtilizatoriTable';
import '../UserManagement.css';

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

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return users.filter(u =>
            (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
            (filterRole === 'all' || u.role === filterRole) &&
            (filterStatus === 'all' || u.status === filterStatus)
        );
    }, [users, search, filterRole, filterStatus]);

    function changeRole(id: string, role: string) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: role as Role } : u));
    }

    function handleDelete() {
        if (deleteId) {
            setUsers(prev => prev.filter(u => u.id !== deleteId));
            setDeleteId(null);
        }
    }

    return (
        <div className="um">
            {/* Toolbar */}
            <div className="um-toolbar">
                <SearchBar value={search} onChange={setSearch} placeholder="Caută după nume sau email..." />
                <div className="um-filters">
                    <CustomSelect value={filterRole} onChange={setFilterRole} options={roleFilterOptions} variant="default" />
                    <CustomSelect value={filterStatus} onChange={setFilterStatus} options={statusFilterOptions} variant="default" />
                </div>
            </div>

            {/* Contor */}
            <p className="um-count">
                {filtered.length === users.length
                    ? `${users.length} utilizatori total`
                    : `${filtered.length} din ${users.length} utilizatori`}
            </p>

            {/* Tabel */}
            <UtilizatoriTable
                filtered={filtered}
                onRoleChange={changeRole}
                onDelete={setDeleteId}
            />

            {/* Confirmare ștergere */}
            {deleteId && (
                <ConfirmDeleteModal
                    itemName={`utilizatorul ${users.find(u => u.id === deleteId)?.name}`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}
