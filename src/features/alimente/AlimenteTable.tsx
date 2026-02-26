// AlimenteTable — tabelul cu lista de alimente
import type { Aliment } from '../../types';
import { categorieLabel, categorieColorClass } from './alimenteConstants';

interface AlimenteTableProps {
    alimente: Aliment[];
    filtered: Aliment[];
    onEdit: (a: Aliment) => void;
    onDelete: (id: string) => void;
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
                        {filtered.length === 0 ? null : (
                            filtered.map(a => (
                                <tr key={a.id}>
                                    <td>
                                        <div className="ga-name-cell">
                                            <div className={`ga-avatar ${categorieColorClass[a.categorie]}`}>
                                                {a.nume.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="user-name">{a.nume}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ga-badge-cat ${categorieColorClass[a.categorie]}`}>
                                            {categorieLabel[a.categorie]}
                                        </span>
                                    </td>
                                    <td className="ga-num-cell">
                                        <span className="ga-kcal">{a.calorii}</span>
                                        <span className="ga-unit-sm">kcal</span>
                                    </td>
                                    <td className="ga-num-cell"><span>{a.proteine}g</span></td>
                                    <td className="ga-num-cell"><span>{a.carbohidrati}g</span></td>
                                    <td className="ga-num-cell"><span>{a.grasimi}g</span></td>
                                    <td>
                                        <div className="um-actions">
                                            <button
                                                className="btn-edit-sm"
                                                onClick={() => onEdit(a)}
                                                title="Editează aliment"
                                            >
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                                Editează
                                            </button>
                                            <button
                                                className="btn-danger-sm"
                                                onClick={() => onDelete(a.id)}
                                                title="Șterge aliment"
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
