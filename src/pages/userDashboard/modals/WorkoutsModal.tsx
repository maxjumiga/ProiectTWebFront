import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDumbbell,
    faHeartPulse,
    faMagnifyingGlass,
    faPersonWalking,
    faPlus,
    faXmark,
    faCheck,
    faClock,
    faCalendarDay
} from "@fortawesome/free-solid-svg-icons";
import { ExerciseItem, WorkoutExerciseLog, WorkoutLog, WorkoutType } from "./types";

interface WorkoutsModalProps {
    workouts: WorkoutLog[];
    onClose: () => void;
    onAddWorkout: (w: WorkoutLog | null) => void;
}

const WORKOUT_TYPES: { value: WorkoutType; icon: any; color: string; bg: string }[] = [
    { value: "Strength", icon: faDumbbell, color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
    { value: "Cardio", icon: faHeartPulse, color: "#10b981", bg: "rgba(16,185,129,0.12)" },
    { value: "Mobility", icon: faPersonWalking, color: "#a855f7", bg: "rgba(168,85,247,0.12)" },
];

const WorkoutsModal: React.FC<WorkoutsModalProps> = ({ onClose, onAddWorkout }) => {
    const [label, setLabel] = useState("");
    const [type, setType] = useState<WorkoutType>("Strength");
    const [duration, setDuration] = useState(60);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const [availableExercises, setAvailableExercises] = useState<ExerciseItem[]>([]);
    const [exSearch, setExSearch] = useState("");
    const [exDropOpen, setExDropOpen] = useState(false);
    const [exSets, setExSets] = useState(3);
    const [exReps, setExReps] = useState(10);
    const [exWeight, setExWeight] = useState(60);
    const [exercises, setExercises] = useState<WorkoutExerciseLog[]>([]);
    const [pendingEx, setPendingEx] = useState<ExerciseItem | null>(null);
    const [saved, setSaved] = useState(false);

    const exDropRef = useRef<HTMLDivElement>(null);
    const token = localStorage.getItem("token");

    const fetchExercises = async () => {
        try {
            const res = await fetch("http://localhost:5004/api/exercise/list", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setAvailableExercises(await res.json());
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (exDropRef.current && !exDropRef.current.contains(e.target as Node)) {
                setExDropOpen(false);
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

    const handleSave = async () => {
        if (!label.trim() || exercises.length === 0) return;
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
            const res = await fetch("http://localhost:5004/api/workout/create", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                setSaved(true);
                onAddWorkout(body as any);
                setTimeout(() => onClose(), 1200);
            }
        } catch (e) { console.error(e); }
    };

    const selectedType = WORKOUT_TYPES.find(t => t.value === type)!;

    return (
        <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="wk-simple-modal">

                {/* Header */}
                <div className="wk-simple-header">
                    <div className="wk-simple-header-left">
                        <div className="wk-simple-icon" style={{ background: selectedType.bg, color: selectedType.color }}>
                            <FontAwesomeIcon icon={selectedType.icon} />
                        </div>
                        <div>
                            <div className="wk-simple-title">Log Today's Workout</div>
                            <div className="wk-simple-sub">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
                        </div>
                    </div>
                    <button className="db-modal-close" onClick={onClose} type="button">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className="wk-simple-body">
                    {/* Row 1: Workout name */}
                    <div className="wk-field-group">
                        <label className="wk-field-label">Workout Name</label>
                        <input
                            type="text"
                            className="db-input"
                            placeholder="e.g. Upper Body, Morning Run…"
                            value={label}
                            onChange={e => setLabel(e.target.value)}
                        />
                    </div>

                    {/* Row 2: Type + Duration + Date */}
                    <div className="wk-row-3">
                        {/* Type selector */}
                        <div className="wk-field-group">
                            <label className="wk-field-label">Type</label>
                            <div className="wk-type-pills">
                                {WORKOUT_TYPES.map(t => (
                                    <button
                                        key={t.value}
                                        className={`wk-type-pill ${type === t.value ? "active" : ""}`}
                                        style={type === t.value ? { background: t.bg, color: t.color, borderColor: t.color } : {}}
                                        onClick={() => setType(t.value)}
                                        type="button"
                                    >
                                        <FontAwesomeIcon icon={t.icon} />
                                        {t.value}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "12px" }}>
                            <div className="wk-field-group" style={{ flex: 1 }}>
                                <label className="wk-field-label">
                                    <FontAwesomeIcon icon={faClock} style={{ marginRight: 6, opacity: 0.6 }} />
                                    Duration (min)
                                </label>
                                <input
                                    type="number"
                                    className="db-input"
                                    value={duration}
                                    min={1}
                                    onChange={e => setDuration(Number(e.target.value))}
                                />
                            </div>
                            <div className="wk-field-group" style={{ flex: 1 }}>
                                <label className="wk-field-label">
                                    <FontAwesomeIcon icon={faCalendarDay} style={{ marginRight: 6, opacity: 0.6 }} />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    className="db-input"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Exercises */}
                    <div className="wk-field-group">
                        <div className="wk-exercises-header">
                            <label className="wk-field-label">Exercises</label>
                            {exercises.length > 0 && (
                                <span className="wk-ex-count">{exercises.length} added</span>
                            )}
                        </div>

                        {/* Added exercises list */}
                        {exercises.length > 0 && (
                            <div className="wk-ex-list">
                                {exercises.map((ex, i) => (
                                    <div className="wk-ex-row" key={i}>
                                        <div className="wk-ex-info">
                                            <span className="wk-ex-name">{ex.exercise.name}</span>
                                            <span className="wk-ex-meta">{ex.sets}×{ex.reps} · {ex.weight}kg</span>
                                        </div>
                                        <button className="wk-ex-remove" onClick={() => removeExercise(i)} type="button">
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Search + add exercise */}
                        <div className="wk-ex-adder" ref={exDropRef}>
                            <div className="wk-ex-search-row">
                                <div className="input-with-icon" style={{ flex: 1 }}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="field-icon" />
                                    <input
                                        type="text"
                                        className="db-input"
                                        placeholder="Search exercise…"
                                        value={exSearch}
                                        onFocus={() => setExDropOpen(true)}
                                        onChange={e => {
                                            setExSearch(e.target.value);
                                            setPendingEx(null);
                                            setExDropOpen(true);
                                        }}
                                    />
                                </div>
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

                            {pendingEx && (
                                <div className="wk-pending-row animate-fup">
                                    <div className="wk-pending-name">{pendingEx.name}</div>
                                    <div className="wk-pending-inputs">
                                        <div className="mini-field">
                                            <label>Sets</label>
                                            <input type="number" min="1" value={exSets} onChange={e => setExSets(Number(e.target.value))} />
                                        </div>
                                        <div className="mini-field">
                                            <label>Reps</label>
                                            <input type="number" min="1" value={exReps} onChange={e => setExReps(Number(e.target.value))} />
                                        </div>
                                        <div className="mini-field">
                                            <label>kg</label>
                                            <input type="number" min="0" value={exWeight} onChange={e => setExWeight(Number(e.target.value))} />
                                        </div>
                                        <button
                                            className="add-ex-btn"
                                            onClick={addExercise}
                                            disabled={!pendingEx || exSets <= 0 || exReps <= 0}
                                            type="button"
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="wk-simple-footer">
                    <button className="btn-cancel" onClick={onClose} type="button">Cancel</button>
                    <button
                        className={`btn-save ${saved ? "btn-saved" : ""}`}
                        onClick={handleSave}
                        disabled={!label.trim() || exercises.length === 0 || saved}
                        type="button"
                    >
                        {saved
                            ? <><FontAwesomeIcon icon={faCheck} /> Saved!</>
                            : "Log Workout"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkoutsModal;
