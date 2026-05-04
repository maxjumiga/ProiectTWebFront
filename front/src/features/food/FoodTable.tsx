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
import { categorieLabel, categorieColorClass } from './foodConstants';

// Properties received from FoodManagement
interface FoodTableProps {
    alimente: Aliment[];                 // Full list (for ref)
    filtered: Aliment[];                 // Filtered list to display
    onEdit: (a: Aliment) => void;        // Callback for opening the edit modal
    onDelete: (id: string) => void;      // Callback for initiating deletion
}

export default function FoodTable({ filtered, onEdit, onDelete }: FoodTableProps) {
    return (
        <div className="um-card">
            <div className="table-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Food</th>
                            <th>Category</th>
                            <th>Calories</th>
                            <th>Protein</th>
                            <th>Carbs</th>
                            <th>Fats</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
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
                                                title="Edit food"
                                            >
                                                <FontAwesomeIcon icon={faPenToSquare} style={{ width: 13, height: 13 }} />
                                                Edit
                                            </button>
                                            {/* Buton Stergere — deschide modalul de confirmare */}
                                            <button
                                                className="btn-danger-sm"
                                                onClick={() => onDelete(a.id)}
                                                title="Delete food"
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
