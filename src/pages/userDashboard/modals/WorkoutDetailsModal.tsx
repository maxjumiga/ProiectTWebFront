import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDumbbell,
    faHeartPulse,
    faPersonWalking,
    faXmark,
    faFire,
    faClock
} from "@fortawesome/free-solid-svg-icons";

// Types based on the backend DTOs
export interface WorkoutExercise {
    exerciseName: string;
    sets: number;
    reps: number;
    weight: number;
    difficulty?: number;
}

export interface WorkoutData {
    type: "Strength" | "Cardio" | "Mobility" | number;
    label: string;
    duration: number;
    date: string;
    workoutExercises: WorkoutExercise[];
}

interface WorkoutDetailsModalProps {
    workout: WorkoutData;
    user?: any;
    onClose: () => void;
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

const WorkoutDetailsModal: React.FC<WorkoutDetailsModalProps> = ({ workout, user, onClose }) => {
    const wType = workout.type;
    const color = WORKOUT_COLORS[wType] || "#3b82f6";
    const icon = WORKOUT_TYPE_ICONS[wType] || faDumbbell;
    const label = WORKOUT_TYPE_LABELS[wType] || "Workout";

    const dateStr = new Date(workout.date).toLocaleDateString("en-US", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    // Real estimated calories formula based on user data and exercises
    const calculateBurn = (): number => {
        let baseBurn = workout.duration * 5.0; // fallback default
        
        if (user && user.weight) {
            // Base metabolism for workout time based on user weight (approx 4 METs for general active time)
            baseBurn = workout.duration * (user.weight / 70) * 4.0;
        }

        if (workout.workoutExercises && workout.workoutExercises.length > 0) {
            let volumeBurn = 0;
            const bodyWeight = (user && user.weight) ? user.weight : 75;

            workout.workoutExercises.forEach(ex => {
                // If weight is 0, it's likely a bodyweight exercise, so assume moving ~65% of body weight
                const effWeight = ex.weight > 0 ? ex.weight : (bodyWeight * 0.65);
                // 1 rep of 1 kg is roughly 0.015 kcal of work done
                volumeBurn += (ex.sets * ex.reps * effWeight * 0.015);
            });

            return Math.round(baseBurn + volumeBurn);
        }
        
        return Math.round(baseBurn);
    };

    return (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-card" style={{ maxWidth: "450px" }}>
                <div className="modal-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: `${color}15`,
                                color: color,
                            }}
                        >
                            <FontAwesomeIcon icon={icon} />
                        </div>
                        <div>
                            <div style={{ fontSize: "18px", fontWeight: "700" }}>{workout.label || label}</div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{dateStr}</div>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose} type="button">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className="modal-body">
                    <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                        <div style={{ flex: 1, background: "var(--bg-secondary)", borderRadius: "12px", padding: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <FontAwesomeIcon icon={faClock} style={{ color: "var(--text-muted)" }} />
                            <div>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Duration</div>
                                <div style={{ fontSize: "15px", fontWeight: "600" }}>{workout.duration} min</div>
                            </div>
                        </div>
                        <div style={{ flex: 1, background: "var(--bg-secondary)", borderRadius: "12px", padding: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <FontAwesomeIcon icon={faFire} style={{ color: "var(--orange)" }} />
                            <div>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Est. Burn</div>
                                <div style={{ fontSize: "15px", fontWeight: "600" }}>{calculateBurn()} kcal</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "var(--text-primary)" }}>
                        Exercises ({workout.workoutExercises?.length || 0})
                    </div>

                    {!workout.workoutExercises || workout.workoutExercises.length === 0 ? (
                        <div style={{ padding: "20px", textAlign: "center", background: "var(--bg-secondary)", borderRadius: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
                            No exercises logged for this session.
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {workout.workoutExercises.map((ex, idx) => (
                                <div key={idx} style={{ background: "var(--bg-secondary)", padding: "12px 16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ fontWeight: "600", fontSize: "14px" }}>
                                        {ex.exerciseName}
                                    </div>
                                    <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Sets</span>
                                            <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{ex.sets}</span>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Reps</span>
                                            <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{ex.reps}</span>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Weight</span>
                                            <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{ex.weight}kg</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkoutDetailsModal;
