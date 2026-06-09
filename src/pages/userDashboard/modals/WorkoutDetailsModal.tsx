import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDumbbell,
    faHeartPulse,
    faPersonWalking,
    faMagnifyingGlass,
    faXmark,
    faPenToSquare,
    faTrash,
    faPlus,
    faCheck,
    faClock,
    faCalendarDay
} from "@fortawesome/free-solid-svg-icons";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";

// Types based on the backend DTOs
export interface WorkoutExercise {
    exerciseId?: number;
    exerciseName: string;
    sets: number;
    reps: number;
    weight: number;
    difficulty?: number;
}

export interface WorkoutData {
    id?: number;
    type: "Strength" | "Cardio" | "Mobility" | number;
    label: string;
    duration: number;
    date: string;
    workoutExercises: WorkoutExercise[];
}

interface WorkoutDetailsModalProps {
    workout: WorkoutData;
    onClose: () => void;
    onSaved?: () => void;
    onDeleted?: () => void;
    user?: any;
}

interface ExerciseOption {
    id: number;
    name: string;
}

const WORKOUT_TYPE_LABELS: Record<string | number, string> = {
    0: "Strength",
    1: "Cardio",
    2: "Mobility",
    "Strength": "Strength",
    "Cardio": "Cardio",
    "Mobility": "Mobility",
};

const WORKOUT_COLORS: Record<string | number, string> = {
    0: "#dc2626",
    1: "#059669",
    2: "#9333ea",
    "Strength": "#dc2626",
    "Cardio": "#059669",
    "Mobility": "#9333ea",
};

const WORKOUT_TYPE_ICONS: Record<string | number, any> = {
    0: faDumbbell,
    1: faHeartPulse,
    2: faPersonWalking,
    "Strength": faDumbbell,
    "Cardio": faHeartPulse,
    "Mobility": faPersonWalking,
};

const WorkoutDetailsModal: React.FC<WorkoutDetailsModalProps> = ({ workout, onClose, onSaved, onDeleted }) => {
    const [editMode, setEditMode] = useState(false);
    const [workoutState, setWorkoutState] = useState<WorkoutData>(workout);
    const [exerciseOptions, setExerciseOptions] = useState<ExerciseOption[]>([]);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [addSearchOpen, setAddSearchOpen] = useState(false);
    const [exSearch, setExSearch] = useState("");
    const [exDropOpen, setExDropOpen] = useState(false);
    const [exercises, setExercises] = useState<Array<{ exercise: ExerciseOption; sets: number; reps: number; weight: number; search?: string; open?: boolean }>>([]);
    const rowSearchRefs = React.useRef<Array<HTMLInputElement | null>>([]);
    const addSearchRef = React.useRef<HTMLInputElement | null>(null);
    const [exRowOpenIndex, setExRowOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        setWorkoutState(workout);
        setEditMode(false);
        setStatusMessage(null);
        setStatusError(null);
        setAddSearchOpen(false);
        setExSearch("");
        setExDropOpen(false);
        setExRowOpenIndex(null);
        const exs = (workout?.workoutExercises || []).map((ex: any) => ({
            exercise: { id: ex.exerciseId ?? 0, name: ex.exerciseName || "" },
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            search: ex.exerciseName || "",
        }));
        setExercises(exs);
    }, [workout]);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await fetch("http://localhost:5004/api/exercise/list");
                if (!response.ok) return;
                const data = await response.json();
                setExerciseOptions(
                    data
                        .map((item: any) => ({ id: item.id, name: item.name }))
                        .sort((a: any, b: any) => a.name.localeCompare(b.name))
                );
            } catch (error) {
                console.error("Failed to fetch exercise list:", error);
            }
        };
        fetchExercises();
    }, []);

    const wType = workoutState.type;
    const color = WORKOUT_COLORS[wType] || "#3b82f6";
    const icon = WORKOUT_TYPE_ICONS[wType] || faDumbbell;
    const label = WORKOUT_TYPE_LABELS[wType] || "Workout";

    const dateStr = new Date(workoutState.date).toLocaleDateString("en-US", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    const removeExercise = (index: number) => {
        setWorkoutState(prev => {
            const next = { ...prev, workoutExercises: prev.workoutExercises.filter((_, idx) => idx !== index) };
            return next;
        });
        setExercises(prev => prev.filter((_, i) => i !== index));
    };

    const filterExercises = (query: string) => {
        const normalized = query.trim().toLowerCase();
        return exerciseOptions
            .filter(ex => !normalized || ex.name.toLowerCase().includes(normalized))
            .slice(0, 12);
    };

    const filteredEx = filterExercises(exSearch);

    const openAddExerciseSearch = () => {
        setAddSearchOpen(true);
        setExSearch("");
        setExDropOpen(true);
        setExRowOpenIndex(null);
        setTimeout(() => addSearchRef.current?.focus(), 0);
    };

    const cancelAddExerciseSearch = () => {
        setAddSearchOpen(false);
        setExSearch("");
        setExDropOpen(false);
    };

    const addExerciseFromOption = (exercise: ExerciseOption) => {
        const newExercise = { exercise, sets: 3, reps: 10, weight: 0, search: exercise.name };
        setExercises(prev => [...prev, newExercise]);
        setWorkoutState(prev => ({
            ...prev,
            workoutExercises: [
                ...prev.workoutExercises,
                { exerciseId: exercise.id, exerciseName: exercise.name, sets: 3, reps: 10, weight: 0 }
            ]
        }));
        cancelAddExerciseSearch();
    };

    const updateExerciseSearch = (index: number, query: string) => {
        const exactMatch = exerciseOptions.find(opt => opt.name.toLowerCase() === query.trim().toLowerCase());
        setExercises(prev => prev.map((it, i) => i === index ? {
            ...it,
            exercise: { id: exactMatch?.id ?? 0, name: query },
            search: query,
        } : it));
        setWorkoutState(prev => {
            const next = { ...prev, workoutExercises: [...prev.workoutExercises] };
            if (!next.workoutExercises[index]) return next;
            next.workoutExercises[index] = {
                ...next.workoutExercises[index],
                exerciseId: exactMatch?.id ?? 0,
                exerciseName: exactMatch?.name ?? query,
            };
            return next;
        });
        setExRowOpenIndex(index);
    };

    const selectExerciseForRow = (index: number, exercise: ExerciseOption) => {
        setExercises(prev => prev.map((it, i) => i === index ? {
            ...it,
            exercise,
            search: exercise.name,
        } : it));
        setWorkoutState(prev => {
            const next = { ...prev, workoutExercises: [...prev.workoutExercises] };
            if (!next.workoutExercises[index]) return next;
            next.workoutExercises[index] = {
                ...next.workoutExercises[index],
                exerciseId: exercise.id,
                exerciseName: exercise.name,
            };
            return next;
        });
        setExRowOpenIndex(null);
    };

    const updateExerciseNumber = (index: number, field: 'sets' | 'reps' | 'weight', value: number) => {
        setExercises(prev => prev.map((it, i) => i === index ? { ...it, [field]: value } : it));
        setWorkoutState(prev => {
            const next = { ...prev, workoutExercises: [...prev.workoutExercises] };
            if (!next.workoutExercises[index]) return next;
            next.workoutExercises[index] = { ...next.workoutExercises[index], [field]: value } as any;
            return next;
        });
    };

    const handleToggleEdit = () => {
        setEditMode(true);
        setStatusMessage(null);
        setStatusError(null);
    };

    const handleCancelEdit = () => {
        setWorkoutState(workout);
        setExercises((workout?.workoutExercises || []).map((ex: any) => ({
            exercise: { id: ex.exerciseId ?? 0, name: ex.exerciseName || "" },
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            search: ex.exerciseName || "",
        })));
        setEditMode(false);
        setStatusMessage(null);
        setStatusError(null);
        cancelAddExerciseSearch();
        setExRowOpenIndex(null);
    };

    const handleSaveWorkout = async () => {
        if (!workoutState.id) {
            setStatusError("Workout ID missing.");
            return;
        }

        const workoutExercises = workoutState.workoutExercises.map(ex => {
            const matchedExercise = exerciseOptions.find(opt => opt.id === ex.exerciseId || opt.name.toLowerCase() === ex.exerciseName.toLowerCase());
            return {
                exerciseId: matchedExercise?.id ?? ex.exerciseId ?? 0,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight,
            };
        });

        if (workoutExercises.some(ex => !ex.exerciseId || ex.exerciseId <= 0)) {
            setStatusError("Select each exercise from the search results before saving.");
            return;
        }

        const payload = {
            date: workoutState.date,
            duration: workoutState.duration,
            type: workoutState.type,
            label: workoutState.label,
            workoutExercises,
        };

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5004/api/workout/update/${workoutState.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : ""
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                setStatusError(errorText || "Unable to save workout.");
                return;
            }

            setEditMode(false);
            setStatusMessage("Workout updated successfully.");
            setStatusError(null);
            onSaved?.();
        } catch (error) {
            console.error(error);
            setStatusError("Error saving workout.");
        }
    };

    const handleDeleteWorkout = () => {
        if (!workoutState.id) return;
        setShowDeleteConfirm(true);
    };

    const confirmDeleteWorkout = async () => {
        if (!workoutState.id) return;
        setShowDeleteConfirm(false);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5004/api/workout/delete/${workoutState.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: token ? `Bearer ${token}` : ""
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                setStatusError(errorText || "Unable to delete workout.");
                return;
            }

            onDeleted?.();
            onClose();
        } catch (error) {
            console.error(error);
            setStatusError("Error deleting workout.");
        }
    };

    return (
        <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="wk-simple-modal">

                <div className="wk-simple-header">
                    <div className="wk-simple-header-left">
                        <div className="wk-simple-icon" style={{ background: `${color}12`, color: color }}>
                            <FontAwesomeIcon icon={icon} />
                        </div>
                        <div>
                            <div className="wk-simple-title">{workoutState.label || label}</div>
                            <div className="wk-simple-sub">{dateStr}</div>
                        </div>
                    </div>
                    <div className="wk-simple-header-right">
                        {!editMode ? (
                            <>
                                <button className="btn-primary" type="button" onClick={handleToggleEdit}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                                <button className="btn-danger-sm" type="button" onClick={handleDeleteWorkout}><FontAwesomeIcon icon={faTrash} /> Delete</button>
                            </>
                        ) : (
                            <>
                                <button className="btn-primary" type="button" onClick={handleSaveWorkout}><FontAwesomeIcon icon={faCheck} /> Save</button>
                                <button className="btn-ghost" type="button" onClick={handleCancelEdit}>Cancel</button>
                            </>
                        )}
                        <button className="db-modal-close" onClick={onClose} type="button">
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                </div>

                    <div className="wk-simple-body modal-body">
                    {statusMessage && (
                        <div className="status-message success">{statusMessage}</div>
                    )}
                    {statusError && (
                        <div className="status-message error">{statusError}</div>
                    )}

                    <div className="wk-row-3">
                        <div className="wk-field-group">
                            <label className="wk-field-label">Type</label>
                            <div className="wk-type-pills">
                                {Object.keys(WORKOUT_TYPE_LABELS).filter(k => isNaN(Number(k))).map(k => {
                                    const val = k as any;
                                    const isActive = (workoutState.type === val) || (String(workoutState.type) === val);
                                    return (
                                        <button
                                            key={val}
                                            className={`wk-type-pill ${isActive ? "active" : ""}`}
                                            style={isActive ? { background: WORKOUT_COLORS[val] + "12", color: WORKOUT_COLORS[val], borderColor: WORKOUT_COLORS[val] } : { opacity: 0.7 }}
                                            onClick={() => editMode ? setWorkoutState(prev => ({ ...prev, type: val })) : undefined}
                                            type="button"
                                        >
                                            <FontAwesomeIcon icon={WORKOUT_TYPE_ICONS[val] || faDumbbell} />
                                            {WORKOUT_TYPE_LABELS[val]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="wk-field-group" style={{ flex: 1 }}>
                            <label className="wk-field-label"><FontAwesomeIcon icon={faClock} style={{ marginRight: 6, opacity: 0.6, color: 'var(--text-muted)' }} /> Duration (min)</label>
                            {editMode ? (
                                <input type="number" className="db-input" min={1} value={workoutState.duration} onChange={e => setWorkoutState(prev => ({ ...prev, duration: Number(e.target.value) }))} />
                            ) : (
                                <div className="db-input" style={{ display: 'flex', alignItems: 'center', height: '40px' }}>{workoutState.duration} min</div>
                            )}
                        </div>

                        <div className="wk-field-group" style={{ flex: 1 }}>
                            <label className="wk-field-label"><FontAwesomeIcon icon={faCalendarDay} style={{ marginRight: 6, opacity: 0.6, color: 'var(--text-muted)' }} /> Date</label>
                            {editMode ? (
                                <input type="date" className="db-input" value={new Date(workoutState.date).toISOString().split('T')[0]} onChange={e => setWorkoutState(prev => ({ ...prev, date: new Date(e.target.value).toISOString() }))} />
                            ) : (
                                <div className="db-input" style={{ display: 'flex', alignItems: 'center', height: '40px' }}>{new Date(workoutState.date).toLocaleDateString()}</div>
                            )}
                        </div>
                    </div>

                    <div className="wk-ex-row-header">
                        <div className="wk-ex-title">Exercises ({workoutState.workoutExercises?.length || 0})</div>
                        {editMode && (
                            addSearchOpen ? (
                                <div className="wk-inline-adder">
                                    <div className="input-with-icon flex-1">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} className="field-icon" />
                                        <input
                                            ref={addSearchRef}
                                            type="text"
                                            className="db-input"
                                            placeholder="Search exercise..."
                                            value={exSearch}
                                            onFocus={() => setExDropOpen(true)}
                                            onChange={e => { setExSearch(e.target.value); setExDropOpen(true); }}
                                            onKeyDown={e => {
                                                if (e.key === "Escape") cancelAddExerciseSearch();
                                                if (e.key === "Enter" && filteredEx[0]) addExerciseFromOption(filteredEx[0]);
                                            }}
                                        />
                                    </div>
                                    <button className="add-ex-btn" type="button" onClick={cancelAddExerciseSearch} title="Cancel add exercise">
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                    {exDropOpen && filteredEx.length > 0 && (
                                        <div className="exercise-dropdown exercise-dropdown-down">
                                            {filteredEx.map(ex => (
                                                <div
                                                    key={ex.id}
                                                    className="ex-drop-item"
                                                    onMouseDown={ev => { ev.preventDefault(); addExerciseFromOption(ex); }}
                                                >
                                                    <div className="ex-drop-name">{ex.name}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button type="button" className="btn-ghost" onClick={openAddExerciseSearch}>
                                    <FontAwesomeIcon icon={faPlus} /> Add exercise
                                </button>
                            )
                        )}
                    </div>

                    <div className="wk-field-group">
                        <label className="wk-field-label">Exercises</label>

                            {exercises.length > 0 && (
                                <div className="wk-ex-list">
                                    {exercises.map((ex, i) => (
                                        <div className="wk-ex-row" key={i}>
                                            {editMode ? (
                                                <div className="wk-ex-edit-card">
                                                    <div className="wk-ex-edit-top">
                                                        <div className="input-with-icon" style={{ flex: 1 }}>
                                                            <input
                                                                ref={el => rowSearchRefs.current[i] = el}
                                                                className="db-input"
                                                                placeholder="Search exercise…"
                                                                value={ex.search ?? ex.exercise.name}
                                                                onChange={e => {
                                                                    updateExerciseSearch(i, e.target.value);
                                                                }}
                                                                onFocus={() => setExRowOpenIndex(i)}
                                                                onKeyDown={e => {
                                                                    const rowOptions = filterExercises(ex.search ?? ex.exercise.name);
                                                                    if (e.key === "Enter" && rowOptions[0]) selectExerciseForRow(i, rowOptions[0]);
                                                                    if (e.key === "Escape") setExRowOpenIndex(null);
                                                                }}
                                                            />
                                                        </div>
                                                        <button className="add-ex-btn" type="button" onClick={(e) => { e.stopPropagation(); removeExercise(i); }} title="Remove exercise"><FontAwesomeIcon icon={faTrash} /></button>
                                                    </div>

                                                    <div className="wk-ex-edit-bottom">
                                                        <div className="mini-field">
                                                            <label>Sets</label>
                                                            <input type="number" min={1} value={ex.sets} onChange={e => updateExerciseNumber(i, 'sets', Number(e.target.value))} />
                                                        </div>
                                                        <div className="mini-field">
                                                            <label>Reps</label>
                                                            <input type="number" min={1} value={ex.reps} onChange={e => updateExerciseNumber(i, 'reps', Number(e.target.value))} />
                                                        </div>
                                                        <div className="mini-field">
                                                            <label>Weight(kg)</label>
                                                            <input type="number" min={0} value={ex.weight} onChange={e => updateExerciseNumber(i, 'weight', Number(e.target.value))} />
                                                        </div>
                                                    </div>

                                                    {exRowOpenIndex === i && filterExercises(ex.search ?? ex.exercise.name).length > 0 && (
                                                        <div className="exercise-dropdown exercise-dropdown-down">
                                                            {filterExercises(ex.search ?? ex.exercise.name).map(opt => (
                                                                <div key={opt.id} className="ex-drop-item" onMouseDown={(ev) => { ev.preventDefault();
                                                                    selectExerciseForRow(i, opt);
                                                                }}>
                                                                    {opt.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="wk-ex-view">
                                                    <div className="wk-ex-info">
                                                        <span className="wk-ex-name">{ex.exercise.name}</span>
                                                        <span className="wk-ex-meta">{ex.sets}×{ex.reps} · {ex.weight}kg</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                    </div>
                </div>

                {/* Footer */}
                <div className="wk-simple-footer">
                    <button className="btn-cancel" onClick={editMode ? handleCancelEdit : onClose} type="button">Cancel</button>
                    <button className={`btn-save`} onClick={handleSaveWorkout} disabled={!editMode} type="button">
                        <FontAwesomeIcon icon={faCheck} /> Save
                    </button>
                </div>
            </div>
            {showDeleteConfirm && (
                <ConfirmDeleteModal
                    itemName={workoutState.label || "workout"}
                    onConfirm={confirmDeleteWorkout}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </div>
    );
};

export default WorkoutDetailsModal;
