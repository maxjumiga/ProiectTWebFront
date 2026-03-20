// ============================================================
// pages/utilizatori/UserManagement.tsx — Pagina gestionare utilizatori
// Permite administratorului sa:
//   - Caute utilizatori dupa nume sau email
//   - Filtreze dupa rol (admin/user) si status (activ/inactiv)
//   - Schimbe rolul unui utilizator direct din tabel (CustomSelect inline)
//   - Stearga un utilizator (cu confirmare prin modal)
// Starea locala (useState) simuleaza o baza de date in-memory.
// ============================================================

import { useState, useMemo } from 'react';
import { mockUsers } from '../../data/mockData';
import type { User, Role } from '../../types';
import SearchBar from '../../components/SearchBar';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import CustomSelect from '../../components/CustomSelect';
import UtilizatoriTable from '../../features/utilizatori/UtilizatoriTable';
import '../UserManagement.css';

// Optiunile pentru filtrul de rol (include "Toate rolurile" ca optiune implicita)
const roleFilterOptions = [
    { value: 'all', label: 'Toate rolurile' },
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'Utilizator' },
];

// Optiunile pentru filtrul de status
const statusFilterOptions = [
    { value: 'all', label: 'Toate statusurile' },
    { value: 'activ', label: 'Activ' },
    { value: 'inactiv', label: 'Inactiv' },
];

export default function UserManagement() {
    // Lista completa de utilizatori (initiata cu datele mock)
    const [users, setUsers] = useState<User[]>(mockUsers);

    // Textul de cautare introdus de utilizator
    const [search, setSearch] = useState('');

    // Filtrele active pentru rol si status ('all' = fara filtru)
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // ID-ul utilizatorului selectat pentru stergere (null = niciun modal deschis)
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Lista filtrata — recalculata automat cand se schimba search, filterRole sau filterStatus
    // useMemo previne filtrarea inutila la fiecare randare
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return users.filter(u =>
            // Conditia de cautare: textul trebuie sa apara in nume SAU email
            (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
            // Conditia de filtru rol: 'all' inseamna toti
            (filterRole === 'all' || u.role === filterRole) &&
            // Conditia de filtru status
            (filterStatus === 'all' || u.status === filterStatus)
        );
    }, [users, search, filterRole, filterStatus]);

    // Schimba rolul unui utilizator identificat prin ID
    function changeRole(id: string, role: string) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: role as Role } : u));
    }

    // Executa stergerea utilizatorului cu ID-ul din deleteId
    function handleDelete() {
        if (deleteId) {
            setUsers(prev => prev.filter(u => u.id !== deleteId));
            setDeleteId(null); // Inchidem modalul dupa stergere
        }
    }

    return (
        <div className="um">

            {/* Toolbar: cautare + filtre */}
            <div className="um-toolbar">
                <SearchBar value={search} onChange={setSearch} placeholder="Caută după nume sau email..." />
                <div className="um-filters">
                    {/* Filtrul de rol */}
                    <CustomSelect value={filterRole} onChange={setFilterRole} options={roleFilterOptions} variant="default" />
                    {/* Filtrul de status */}
                    <CustomSelect value={filterStatus} onChange={setFilterStatus} options={statusFilterOptions} variant="default" />
                </div>
            </div>

            {/* Contorul: afiseaza cate rezultate sunt vizibile din total */}
            <p className="um-count">
                {filtered.length === users.length
                    ? `${users.length} utilizatori total`
                    : `${filtered.length} din ${users.length} utilizatori`}
            </p>

            {/* Tabelul cu utilizatorii filtrati */}
            <UtilizatoriTable
                filtered={filtered}
                onRoleChange={changeRole}
                onDelete={setDeleteId} // Seteaza ID-ul pentru a deschide modalul de confirmare
            />

            {/* Modalul de confirmare stergere — apare doar cand deleteId nu e null */}
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
