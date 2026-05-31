import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDumbbell,
    faHeartPulse,
    faHistory,
    faMagnifyingGlass,
    faPersonWalking,
    faPlus,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import { ExerciseItem, WorkoutExerciseLog, WorkoutLog, WorkoutType } from "./types";

interface WorkoutsModalProps {
    workouts: WorkoutLog[];
    onClose: () => void;
    onAddWorkout: (w: WorkoutLog | null) => void;
}

const WORKOUT_TYPE_COLORS: Record<WorkoutType, { bg: string; color: string; icon: any }> = {
    Strength: { bg: "rgba(239,68,68,0.1)", color: "#dc2626", icon: faDumbbell },
    Cardio: { bg: "rgba(16,185,129,0.1)", color: "#059669", icon: faHeartPulse },
    Mobility: { bg: "rgba(168,85,247,0.1)", color: "#9333ea", icon: faPersonWalking },
};

const WorkoutsModal: React.FC<WorkoutsModalProps> = ({ workouts: initialWorkouts, onClose, onAddWorkout }) => {
    const [workouts, setWorkouts] = useState<WorkoutLog[]>(initialWorkouts);
    const [isLoggingNew, setIsLoggingNew] = useState(true);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [label, setLabel] = useState("");
    const [type, setType] = useState<WorkoutType>("Strength");
    const [duration, setDuration] = useState(60);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const [availableExercises, setAvailableExercises] = useState<ExerciseItem[]>([]);
    const [exSearch, setExSearch] = useState("");
    const [exDropOpen, setExDropOpen] = useState(false);
    const [exSets, setExSets] = useState(3);
    const [exReps, setExReps] = useState(10);
    const [exWeight, setExWeight] = useState(60);
    const [exercises, setExercises] = useState<WorkoutExerciseLog[]>([]);
    const [pendingEx, setPendingEx] = useState<ExerciseItem | null>(null);
    const [typeDropOpen, setTypeDropOpen] = useState(false);
    const exDropRef = useRef<HTMLDivElement>(null);
    const typeDropRef = useRef<HTMLDivElement>(null);

    const token = localStorage.getItem("token");

    const fetchWorkouts = async () => {
        try {
            const res = await fetch("http://localhost:5004/api/workout/list", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const mapped: WorkoutLog[] = data.map((w: any) => ({
                    id: w.id,
                    date: w.date,
                    duration: w.duration,
                    type: w.type as WorkoutType,
                    label: w.label,
                    exercises: (w.workoutExercises || []).map((we: any) => ({
                        exercise: {
                            id: we.exerciseId,
                            name: we.exerciseName || "Unknown Exercise",
                            primaryMuscleGroup: we.primaryMuscleGroup || "N/A",
                            secondaryMuscleGroup: we.secondaryMuscleGroup,
                            difficulty: we.difficulty || "Beginner"
                        },
                        sets: we.sets,
                        reps: we.reps,
                        weight: we.weight
                    }))
                }));
                setWorkouts(mapped);
            }
        } catch (e) { console.error(e); }
    };

    const fetchExercises = async () => {
        try {
            const res = await fetch("http://localhost:5004/api/exercise/list", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAvailableExercises(data);
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchWorkouts();
        fetchExercises();
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (exDropRef.current && !exDropRef.current.contains(e.target as Node)) {
                setExDropOpen(false);
            }
            if (typeDropRef.current && !typeDropRef.current.contains(e.target as Node)) {
                setTypeDropOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filteredEx = availableExercises.filter(e =>
        e.name.toLowerCase().includes(exSearch.toLowerCase())
    );

    const addExercise = () => {
        if (!pendingEx || exSets <= 0 || exReps <= 0) return;
        setExercises(prev => [...prev, { exercise: pendingEx, sets: exSets, reps: exReps, weight: exWeight }]);
        setPendingEx(null);
        setExSearch("");
        setExSets(3);
        setExReps(10);
        setExWeight(60);
    };

    const removeExercise = (idx: number) => {
        setExercises(prev => prev.filter((_, i) => i !== idx));
    };

    const resetForm = () => {
        setLabel(""); setType("Strength"); setDuration(60); setDate(new Date().toISOString().split('T')[0]);
        setExercises([]); setPendingEx(null); setSelectedId(null); setIsLoggingNew(true);
    };

    const selectForEdit = (w: WorkoutLog) => {
        setSelectedId(w.id || null);
        setLabel(w.label);
        setType(w.type);
        setDuration(w.duration);
        setDate(w.date.split('T')[0]);
        setExercises([...w.exercises]);
        setIsLoggingNew(false);
    };

    const handleSave = async () => {
        if (!label.trim()) return;

        const body = {
            date: new Date(date).toISOString(),
            duration,
            type,
            label: label.trim(),
            workoutExercises: exercises.map(ex => ({
                exerciseId: ex.exercise.id,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight
            }))
        };

        try {
            const url = selectedId
                ? `http://localhost:5004/api/workout/update/${selectedId}`
                : "http://localhost:5004/api/workout/create";
            const method = selectedId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                fetchWorkouts();
                resetForm();
                onAddWorkout(body as any);
            }
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this workout?")) return;
        try {
            const res = await fetch(`http://localhost:5004/api/workout/delete/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                fetchWorkouts();
                if (selectedId === id) resetForm();
                onAddWorkout(null);
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="db-modal-card db-modal-split">
                <div className="modal-sidebar">
                    <div className="sidebar-header-modal">
                        <FontAwesomeIcon icon={faHistory} />
                        History
                    </div>
                    <div className="history-list">
                        <button
                            className={`history-new-btn ${isLoggingNew && !selectedId ? 'active' : ''}`}
                            onClick={resetForm}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Log New Workout
                        </button>
                        {workouts.map(w => (
                            <div
                                key={w.id}
                                className={`history-item ${selectedId === w.id ? 'active' : ''}`}
                                onClick={() => selectForEdit(w)}
                            >
                                <div className="history-item-top">
                                    <span className="history-label">{w.label}</span>
                                    <FontAwesomeIcon
                                        icon={(WORKOUT_TYPE_COLORS[w.type] || WORKOUT_TYPE_COLORS.Strength).icon}
                                        style={{ color: (WORKOUT_TYPE_COLORS[w.type] || WORKOUT_TYPE_COLORS.Strength).color }}
                                    />
                                </div>
                                <div className="history-item-meta">
                                    {new Date(w.date).toLocaleDateString()} · {w.duration}m
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-main-content">
                    <div className="db-modal-header no-border">
                        <div className="db-modal-title">
                            {selectedId ? "Edit Workout" : "New Workout"}
                        </div>
                        <button className="db-modal-close" onClick={onClose} type="button">
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>

                    <div className="db-modal-body">
                        <div className="db-modal-section">
                            <div className="wk-form-row">
                                <div className="wk-form-field wk-grow">
                                    <label className="db-field-label">Workout Name</label>
                                    <input
                                        type="text"
                                        className="db-input"
                                        placeholder="Upper body, Morning run…"
                                        value={label}
                                        onChange={e => setLabel(e.target.value)}
                                    />
                                </div>
                                <div className="wk-form-field" style={{ width: '140px' }}>
                                    <label className="db-field-label">Type</label>
                                    <div className="custom-dropdown-wrap" ref={typeDropRef}>
                                        <div
                                            className="db-select-custom"
                                            onClick={() => setTypeDropOpen(!typeDropOpen)}
                                        >
                                            {type}
                                            <FontAwesomeIcon icon={typeDropOpen ? faXmark : faPlus} style={{ fontSize: '10px', opacity: 0.5 }} />
                                        </div>
                                        {typeDropOpen && (
                                            <div className="custom-dropdown-list animate-fup">
                                                {(["Strength", "Cardio", "Mobility"] as WorkoutType[]).map(t => (
                                                    <div
                                                        key={t}
                                                        className={`custom-drop-item ${type === t ? 'selected' : ''}`}
                                                        onClick={() => { setType(t); setTypeDropOpen(false); }}
                                                    >
                                                        {t}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="wk-form-row">
                                <div className="wk-form-field wk-grow">
                                    <label className="db-field-label">Date</label>
                                    <input
                                        type="date"
                                        className="db-input"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                    />
                                </div>
                                <div className="wk-form-field" style={{ width: '140px' }}>
                                    <label className="db-field-label">Duration (min)</label>
                                    <input
                                        type="number"
                                        className="db-input"
                                        value={duration}
                                        onChange={e => setDuration(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="db-modal-section">
                            <div className="section-header-row">
                                <div className="db-modal-section-title">Exercises</div>
                                <div className="exercise-count-badge">{exercises.length}</div>
                            </div>

                            <div className="ex-list-rework">
                                {exercises.map((ex, i) => (
                                    <div className="ex-item-rework" key={i}>
                                        <div className="ex-item-info">
                                            <div className="ex-item-name">{ex.exercise.name}</div>
                                            <div className="ex-item-muscles">
                                                {ex.exercise.primaryMuscleGroup} {ex.exercise.secondaryMuscleGroup ? `· ${ex.exercise.secondaryMuscleGroup}` : ''}
                                            </div>
                                        </div>
                                        <div className="ex-item-stats">
                                            <div className="ex-stat"><span>Sets</span>{ex.sets}</div>
                                            <div className="ex-stat"><span>Reps</span>{ex.reps}</div>
                                            <div className="ex-stat"><span>Kg</span>{ex.weight}</div>
                                        </div>
                                        <button className="ex-remove-minimal" onClick={() => removeExercise(i)}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="ex-adder-box">
                                <div className="ex-search-row" ref={exDropRef}>
                                    <div className="input-with-icon">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} className="field-icon" />
                                        <input
                                            type="text"
                                            className="db-input"
                                            placeholder="Add exercise..."
                                            value={exSearch}
                                            onFocus={() => setExDropOpen(true)}
                                            onChange={e => {
                                                setExSearch(e.target.value);
                                                setPendingEx(null);
                                                setExDropOpen(true);
                                            }}
                                        />
                                    </div>
                                    {exDropOpen && filteredEx.length > 0 && (
                                        <div className="exercise-dropdown">
                                            {filteredEx.map(ex => (
                                                <div
                                                    key={ex.id}
                                                    className="ex-drop-item"
                                                    onClick={() => {
                                                        setPendingEx(ex);
                                                        setExSearch(ex.name);
                                                        setExDropOpen(false);
                                                    }}
                                                >
                                                    <div className="ex-drop-name">{ex.name}</div>
                                                    <div className="ex-drop-meta">{ex.primaryMuscleGroup} · {ex.difficulty}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {pendingEx && (
                                    <div className="ex-pending-details animate-fup">
                                        <div className="ex-details-grid">
                                            <div className="ex-detail-item">
                                                <label>Primary</label>
                                                <span>{pendingEx.primaryMuscleGroup}</span>
                                            </div>
                                            <div className="ex-detail-item">
                                                <label>Secondary</label>
                                                <span>{pendingEx.secondaryMuscleGroup || "None"}</span>
                                            </div>
                                            <div className="ex-detail-item">
                                                <label>Difficulty</label>
                                                <span className={`diff-badge ${pendingEx.difficulty.toLowerCase()}`}>{pendingEx.difficulty}</span>
                                            </div>
                                        </div>
                                        <div className="ex-inputs-row">
                                            <div className="mini-field">
                                                <label>Sets</label>
                                                <input type="number" min="1" value={exSets} onChange={e => setExSets(Number(e.target.value))} />
                                            </div>
                                            <div className="mini-field">
                                                <label>Reps</label>
                                                <input type="number" min="1" value={exReps} onChange={e => setExReps(Number(e.target.value))} />
                                            </div>
                                            <div className="mini-field">
                                                <label>Weight</label>
                                                <input type="number" min="0" value={exWeight} onChange={e => setExWeight(Number(e.target.value))} />
                                            </div>
                                            <button
                                                className="add-ex-btn"
                                                onClick={addExercise}
                                                disabled={!pendingEx || exSets <= 0 || exReps <= 0}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer-rework">
                        {selectedId && (
                            <button className="btn-delete" onClick={() => handleDelete(selectedId)}>
                                Delete Workout
                            </button>
                        )}
                        <div style={{ flex: 1 }} />
                        <button className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button className="btn-save" onClick={handleSave} disabled={!label || exercises.length === 0}>
                            {selectedId ? "Save Changes" : "Save Workout"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutsModal;
