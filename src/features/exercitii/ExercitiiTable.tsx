// ExercitiiTable — tabelul cu lista de exerciții
import type { Exercitiu } from '../../types';
import {
    grupMuscularLabel,
    grupColorClass,
    dificultateLabel,
    dificultateColorClass,
    type GrupMuscular,
    type DificultateExercitiu,
} from './exercitiiConstants';

interface ExercitiiTableProps {
    filtered: Exercitiu[];
    onEdit: (e: Exercitiu) => void;
    onDelete: (id: string) => void;
}

export default function ExercitiiTable({ filtered, onEdit, onDelete }: ExercitiiTableProps) {
    return (
        <div className="um-card">
            <div className="table-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Exercițiu</th>
                            <th>Grupă musculară</th>
                            <th>Dificultate</th>
                            <th>Durată medie</th>
                            <th>Descriere</th>
                            <th style={{ textAlign: 'right' }}>Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? null : (
                            filtered.map(ex => (
                                <tr key={ex.id}>
                                    {/* Nume + avatar */}
                                    <td>
                                        <div className="ga-name-cell">
                                            <div className={`ga-avatar ${grupColorClass[ex.grupMuscular as GrupMuscular]}`}>
                                                {ex.nume.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="user-name">{ex.nume}</span>
                                        </div>
                                    </td>

                                    {/* Grupă musculară */}
                                    <td>
                                        <span className={`badge ga-badge-cat ${grupColorClass[ex.grupMuscular as GrupMuscular]}`}>
                                            {grupMuscularLabel[ex.grupMuscular as GrupMuscular]}
                                        </span>
                                    </td>

                                    {/* Dificultate */}
                                    <td>
                                        <span className={`badge ex-badge-dif ${dificultateColorClass[ex.dificultate as DificultateExercitiu]}`}>
                                            {dificultateLabel[ex.dificultate as DificultateExercitiu]}
                                        </span>
                                    </td>

                                    {/* Durată */}
                                    <td className="ga-num-cell">
                                        <span className="ga-kcal">{ex.durataMed}</span>
                                        <span className="ga-unit-sm">min</span>
                                    </td>

                                    {/* Descriere */}
                                    <td className="ex-descriere-cell">
                                        {ex.descriere || <span className="ex-no-desc">—</span>}
                                    </td>

                                    {/* Acțiuni */}
                                    <td>
                                        <div className="um-actions">
                                            <button
                                                className="btn-edit-sm"
                                                onClick={() => onEdit(ex)}
                                                title="Editează exercițiu"
                                            >
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                                Editează
                                            </button>
                                            <button
                                                className="btn-danger-sm"
                                                onClick={() => onDelete(ex.id)}
                                                title="Șterge exercițiu"
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
