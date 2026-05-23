import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Aliment } from '../../types';

interface FoodTableProps {
    filtered: Aliment[];
    onEdit: (a: Aliment) => void;
    onDelete: (id: number) => void;
}

export default function FoodTable({ filtered, onEdit, onDelete }: FoodTableProps) {
    return (
        <div className="um-card">
            <div className="table-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Food</th>
                            <th>Calories</th>
                            <th>Protein</th>
                            <th>Carbs</th>
                            <th>Fats</th>
                            <th>Fiber</th>
                            <th>Vitamin C</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? null : (
                            filtered.map(a => (
                                <tr key={a.id}>
                                    <td>
                                        <div className="ga-name-cell">
                                            <div className="ga-avatar cat-altele">
                                                {a.nume.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="user-name">{a.nume}</span>
                                        </div>
                                    </td>
                                    <td className="ga-num-cell"><span className="ga-kcal">{a.calorii}</span><span className="ga-unit-sm">kcal</span></td>
                                    <td className="ga-num-cell"><span>{a.proteine}g</span></td>
                                    <td className="ga-num-cell"><span>{a.carbohidrati}g</span></td>
                                    <td className="ga-num-cell"><span>{a.grasimi}g</span></td>
                                    <td className="ga-num-cell"><span>{a.fibre}g</span></td>
                                    <td className="ga-num-cell"><span>{a.vitaminaC}mg</span></td>
                                    <td>
                                        <div className="um-actions">
                                            <button className="btn-edit-sm" onClick={() => onEdit(a)} title="Edit food">
                                                <FontAwesomeIcon icon={faPenToSquare} style={{ width: 13, height: 13 }} />
                                                Edit
                                            </button>
                                            <button className="btn-danger-sm" onClick={() => onDelete(a.id)} title="Delete food">
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
