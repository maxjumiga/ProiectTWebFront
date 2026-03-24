// ============================================================
// features/food/FoodTable.tsx — Tabelul cu alimente
// Componenta de prezentare care afiseaza lista de alimente filtrate.
// Nu gestioneaza starea — logica ramane in GestionareAlimente.tsx
// Fiecare rand contine:
//   - Avatar colorat cu initiala alimentului
//   - Badge colorat cu categoria
//   - Valorile nutritionale (calorii, proteine, carbohidrati, grasimi)
//   - Butoane Edit si Sterge
// ============================================================

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Aliment } from '../../types';
import { categorieLabel, categorieColorClass } from './alimenteConstants';

// Proprietatile primite de la GestionareAlimente
interface AlimenteTableProps {
    alimente: Aliment[];                 // Lista completa (pentru ref)
    filtered: Aliment[];                 // Lista filtrata de afisat
    onEdit: (a: Aliment) => void;        // Callback pentru deschiderea modalului de editare
    onDelete: (id: string) => void;      // Callback pentru initierea stergerii
}

export default function AlimenteTable({ filtered, onEdit, onDelete }: AlimenteTableProps) {
    return (
        <div className="um-card">
            <div className="table-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Aliment</th>
                            <th>Categorie</th>
                            <th>Calorii</th>
                            <th>Proteine</th>
                            <th>Carbohidrați</th>
                            <th>Grăsimi</th>
                            <th style={{ textAlign: 'right' }}>Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Daca lista e goala, nu se afiseaza nimic (null) */}
                        {filtered.length === 0 ? null : (
                            filtered.map(a => (
                                <tr key={a.id}>
                                    {/* Celula nutritie: avatar colorat cu initiala + numele alimentului */}
                                    <td>
                                        <div className="ga-name-cell">
                                            {/* Clasa de culoare a avatarului depinde de categorie */}
                                            <div className={`ga-avatar ${categorieColorClass[a.categorie]}`}>
                                                {a.nume.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="user-name">{a.nume}</span>
                                        </div>
                                    </td>

                                    {/* Badge colorat pentru categorie */}
                                    <td>
                                        <span className={`badge ga-badge-cat ${categorieColorClass[a.categorie]}`}>
                                            {categorieLabel[a.categorie]}
                                        </span>
                                    </td>

                                    {/* Valori nutritionale cu unitati de masura */}
                                    <td className="ga-num-cell">
                                        <span className="ga-kcal">{a.calorii}</span>
                                        <span className="ga-unit-sm">kcal</span>
                                    </td>
                                    <td className="ga-num-cell"><span>{a.proteine}g</span></td>
                                    <td className="ga-num-cell"><span>{a.carbohidrati}g</span></td>
                                    <td className="ga-num-cell"><span>{a.grasimi}g</span></td>

                                    {/* Butoanele de actiune: Editare si Stergere */}
                                    <td>
                                        <div className="um-actions">
                                            {/* Buton Editare — deschide modalul cu datele pre-completate */}
                                            <button
                                                className="btn-edit-sm"
                                                onClick={() => onEdit(a)}
                                                title="Editează aliment"
                                            >
                                                <FontAwesomeIcon icon={faPenToSquare} style={{ width: 13, height: 13 }} />
                                                Editează
                                            </button>
                                            {/* Buton Stergere — deschide modalul de confirmare */}
                                            <button
                                                className="btn-danger-sm"
                                                onClick={() => onDelete(a.id)}
                                                title="Șterge aliment"
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
