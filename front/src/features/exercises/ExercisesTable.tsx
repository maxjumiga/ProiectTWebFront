import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { DificultateExercitiu, Exercitiu, GrupMuscular } from '../../types';
import {
    costObosealaLabel,
    dificultateColorClass,
    dificultateLabel,
    grupColorClass,
    grupMuscularLabel,
} from './exercisesConstants';

interface ExercisesTableProps {
    filtered: Exercitiu[];
    onEdit: (e: Exercitiu) => void;
    onDelete: (id: number) => void;
}

export default function ExercisesTable({ filtered, onEdit, onDelete }: ExercisesTableProps) {
    return (
        <div className="um-card">
            <div className="table-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Exercise</th>
                            <th>Muscle Group</th>
                            <th>Secondary Muscle</th>
                            <th>Difficulty</th>
                            <th>Fatigue Cost</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? null : (
                            filtered.map(ex => (
                                <tr key={ex.id}>
                                    <td>
                                        <div className="ga-name-cell">
                                            <div className={`ga-avatar ${grupColorClass[ex.grupMuscular as GrupMuscular]}`}>
                                                {ex.nume.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="user-name">{ex.nume}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ga-badge-cat ${grupColorClass[ex.grupMuscular as GrupMuscular]}`}>
                                            {grupMuscularLabel[ex.grupMuscular as GrupMuscular]}
                                        </span>
                                    </td>
                                    <td className="ex-descriere-cell">
                                        {ex.grupaSecundara || <span className="ex-no-desc">—</span>}
                                    </td>
                                    <td>
                                        <span className={`badge ex-badge-dif ${dificultateColorClass[ex.dificultate as DificultateExercitiu]}`}>
                                            {dificultateLabel[ex.dificultate as DificultateExercitiu]}
                                        </span>
                                    </td>
                                    <td className="ga-num-cell">
                                        <span>{costObosealaLabel[ex.costOboseala]}</span>
                                    </td>
                                    <td>
                                        <div className="um-actions">
                                            <button className="btn-edit-sm" onClick={() => onEdit(ex)} title="Edit exercise">
                                                <FontAwesomeIcon icon={faPenToSquare} style={{ width: 13, height: 13 }} />
                                                Edit
                                            </button>
                                            <button className="btn-danger-sm" onClick={() => onDelete(ex.id)} title="Delete exercise">
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
