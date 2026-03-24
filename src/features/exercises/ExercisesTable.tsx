// ============================================================
// features/exercises/ExercisesTable.tsx — Tabelul cu exercitii
// Componenta de prezentare care afiseaza lista de exercitii filtrate.
// Nu gestioneaza starea — logica ramane in GestionareExercitii.tsx
// Fiecare rand contine:
//   - Avatar colorat cu initiala exercitiului + numele
//   - Badge pentru grupa musculara (colorat pe categorie)
//   - Badge pentru dificultate (verde/portocaliu/rosu)
//   - Durata medie in minute
//   - Descrierea exercitiului (sau "—" daca lipseste)
//   - Butoane Edit si Sterge
// ============================================================

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Exercitiu } from '../../types';
import {
    grupMuscularLabel,
    grupColorClass,
    dificultateLabel,
    dificultateColorClass,
    type GrupMuscular,
    type DificultateExercitiu,
} from './exercitiiConstants';

// Proprietatile primite de la GestionareExercitii
interface ExercitiiTableProps {
    filtered: Exercitiu[];                // Lista de exercitii deja filtrata
    onEdit: (e: Exercitiu) => void;       // Callback pentru deschidere modal editare
    onDelete: (id: string) => void;       // Callback pentru initierea stergerii
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
                        {/* Daca lista e goala dupa filtrare, nu se afiseaza nimic */}
                        {filtered.length === 0 ? null : (
                            filtered.map(ex => (
                                <tr key={ex.id}>

                                    {/* Celula nume: avatar colorat cu initiala + name */}
                                    <td>
                                        <div className="ga-name-cell">
                                            {/* Culoarea avatarului depinde de grupa musculara */}
                                            <div className={`ga-avatar ${grupColorClass[ex.grupMuscular as GrupMuscular]}`}>
                                                {ex.nume.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="user-name">{ex.nume}</span>
                                        </div>
                                    </td>

                                    {/* Badge colorat pentru grupa musculara */}
                                    <td>
                                        <span className={`badge ga-badge-cat ${grupColorClass[ex.grupMuscular as GrupMuscular]}`}>
                                            {grupMuscularLabel[ex.grupMuscular as GrupMuscular]}
                                        </span>
                                    </td>

                                    {/* Badge colorat pentru dificultate (verde/portocaliu/rosu) */}
                                    <td>
                                        <span className={`badge ex-badge-dif ${dificultateColorClass[ex.dificultate as DificultateExercitiu]}`}>
                                            {dificultateLabel[ex.dificultate as DificultateExercitiu]}
                                        </span>
                                    </td>

                                    {/* Durata in minute */}
                                    <td className="ga-num-cell">
                                        <span className="ga-kcal">{ex.durataMed}</span>
                                        <span className="ga-unit-sm">min</span>
                                    </td>

                                    {/* Descrierea — daca nu exista, afiseaza "—" */}
                                    <td className="ex-descriere-cell">
                                        {ex.descriere || <span className="ex-no-desc">—</span>}
                                    </td>

                                    {/* Butoanele de actiune */}
                                    <td>
                                        <div className="um-actions">
                                            <button
                                                className="btn-edit-sm"
                                                onClick={() => onEdit(ex)}
                                                title="Editează exercițiu"
                                            >
                                                <FontAwesomeIcon icon={faPenToSquare} style={{ width: 13, height: 13 }} />
                                                Editează
                                            </button>
                                            <button
                                                className="btn-danger-sm"
                                                onClick={() => onDelete(ex.id)}
                                                title="Șterge exercițiu"
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
