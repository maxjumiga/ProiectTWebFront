// ============================================================
// features/users/UsersTable.tsx — Tabelul cu utilizatori
// Componenta de prezentare (presentational) care primeste datele
// deja filtrate prin props si le afiseaza intr-un tabel.
// Nu gestioneaza starea — aceasta ramane in UserManagement.tsx
// Contine:
//   - Starea "gol" cu iconita cand nu exista rezultate de cautare
//   - Dropdown inline pentru schimbarea rolului direct din tabel
//   - Buton de stergere cu iconita Trash
// ============================================================

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../types';
import CustomSelect from '../../components/CustomSelect';

// Optiunile disponibile pentru schimbarea rolului unui utilizator
const roleOptions = [{ value: 'user', label: 'Utilizator' }, { value: 'admin', label: 'Admin' }];

// Map de culori pentru badge-urile de rol in dropdown inline
const roleColorMap: Record<string, string> = { admin: 'admin', user: 'user' };

// Proprietatile primite de la pagina parinte (UserManagement)
interface UtilizatoriTableProps {
    filtered: User[];                            // Lista de utilizatori deja filtrata
    onRoleChange: (id: string, role: string) => void; // Callback pentru schimbare rol
    onDelete: (id: string) => void;              // Callback pentru initierea stergerii
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
                        {/* Starea de lista goala — afisata cand cautarea nu returneaza rezultate */}
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="um-empty">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{ width: 40, height: 40, opacity: 0.3 }} />
                                    <span>Niciun utilizator găsit</span>
                                </td>
                            </tr>
                        ) : (
                            // Randarea fiecarui utilizator ca rand in tabel
                            filtered.map(u => (
                                <tr key={u.id}>
                                    {/* Celula utilizator: cerc cu initiala + nume + email */}
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">{u.name.charAt(0)}</div>
                                            <div className="user-details">
                                                <span className="user-name">{u.name}</span>
                                                <span className="user-email">{u.email}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Dropdown inline pentru schimbarea rolului */}
                                    <td>
                                        <CustomSelect
                                            value={u.role}
                                            onChange={val => onRoleChange(u.id, val)}
                                            options={roleOptions}
                                            variant="inline"    // Varianta compacta pentru tabel
                                            colorMap={roleColorMap}
                                        />
                                    </td>

                                    {/* Data formatata in romana */}
                                    <td className="date-cell">{new Date(u.joinedAt).toLocaleDateString('ro-RO')}</td>

                                    {/* Actiunile disponibile: doar stergere pentru utilizatori */}
                                    <td>
                                        <div className="um-actions">
                                            <button
                                                className="btn-danger-sm"
                                                onClick={() => onDelete(u.id)} // Deschide modalul de confirmare
                                                title="Șterge utilizator"
                                            >
                                                <FontAwesomeIcon icon={faTrash} style={{ width: 13, height: 13 }} />
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
