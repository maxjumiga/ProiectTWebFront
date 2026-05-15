import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faCalendarDays,
    faUserGear,
    faBell,
    faUser,
    faMagnifyingGlass,
    faXmark,
    faPlus,
    faDroplet,
    faFire,
    faDumbbell,
    faHistory,
    faHeartPulse,
    faPersonWalking,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

// ─── Chart Data ───────────────────────────────────────────────────────────────
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CAL_DATA = [1650, 2100, 1800, 2350, 1950, 2200, 1420];
const WAT_DATA = [1800, 2400, 2000, 2800, 2200, 2600, 1600];

// ─── Mock Food Data ───────────────────────────────────────────────────────────
interface FoodItem {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    vitaminC: number;
    fiber: number;
    unit: string;
}

// const FOOD_DATABASE: FoodItem[] = [
//     { id: 1, name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, vitaminC: 0, fiber: 0, unit: "100g" },
//     { id: 2, name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 1.8, vitaminC: 0, fiber: 3.5, unit: "100g" },
//     { id: 3, name: "Broccoli", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, vitaminC: 89, fiber: 2.6, unit: "100g" },
//     { id: 4, name: "Whole Egg", calories: 155, protein: 13, carbs: 1.1, fat: 11, vitaminC: 0, fiber: 0, unit: "100g" },
//     { id: 5, name: "Oatmeal", calories: 389, protein: 17, carbs: 66, fat: 7, vitaminC: 0, fiber: 10, unit: "100g" },
//     { id: 6, name: "Salmon", calories: 208, protein: 20, carbs: 0, fat: 13, vitaminC: 3, fiber: 0, unit: "100g" },
//     { id: 7, name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, vitaminC: 19, fiber: 3, unit: "100g" },
//     { id: 8, name: "Greek Yogurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, vitaminC: 1, fiber: 0, unit: "100g" },
//     { id: 9, name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, vitaminC: 8, fiber: 2.6, unit: "100g" },
//     { id: 10, name: "Almonds", calories: 579, protein: 21, carbs: 22, fat: 50, vitaminC: 0, fiber: 12, unit: "100g" },
// ];

type MealTime = "Breakfast" | "Lunch" | "Dinner" | "Snack";

interface FoodLog {
    food: FoodItem;
    mealTime: MealTime;
    grams: number;
}

// ─── Mock Exercise Data ───────────────────────────────────────────────────────
interface ExerciseItem {
    id: number;
    name: string;
    primaryMuscleGroup: string;
    secondaryMuscleGroup?: string;
    difficulty: string;
    fatigueCost: string;
}

type WorkoutType = "Strength" | "Cardio" | "Mobility";

interface WorkoutExerciseLog {
    exercise: ExerciseItem;
    sets: number;
    reps: number;
    weight: number;
}

interface WorkoutLog {
    id?: number;
    date: string;
    duration: number;
    type: WorkoutType;
    label: string;
    exercises: WorkoutExerciseLog[];
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
const BarChart = () => {
    const W = 520, H = 148, pL = 8, pR = 8, pT = 8, pB = 24;
    const cW = W - pL - pR, cH = H - pT - pB;
    const n = DAYS.length, gW = cW / n;
    const bW = gW * 0.27, gap = bW * 0.35;
    const mC = Math.max(...CAL_DATA), mW = Math.max(...WAT_DATA);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
                </linearGradient>
            </defs>
            {[0, 0.5, 1].map((v, i) => (
                <line key={i} x1={pL} x2={W - pR}
                    y1={pT + cH - v * cH} y2={pT + cH - v * cH}
                    stroke="#e4e7f0" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "3 5"} />
            ))}
            {DAYS.map((d, i) => {
                const cx = pL + i * gW + gW / 2;
                const ch = (CAL_DATA[i] / mC) * cH;
                const wh = (WAT_DATA[i] / mW) * cH;
                return (
                    <g key={i}>
                        <rect x={cx - gap / 2 - bW} y={pT + cH - ch} width={bW} height={ch} fill="url(#cg)" rx="3" />
                        <rect x={cx + gap / 2} y={pT + cH - wh} width={bW} height={wh} fill="url(#wg)" rx="3" />
                        <text x={cx} y={H - 5} textAnchor="middle" fontSize="10"
                            fontFamily="'Space Mono', monospace" fill="#a8adc4">{d}</text>
                    </g>
                );
            })}
        </svg>
    );
};

// ─── Water Bottle ─────────────────────────────────────────────────────────────
const WaterBottle = ({ pct }: { pct: number }) => {
    const bH = 68, bW = 28, cH = 9, bY = cH;
    const fH = bH * Math.min(pct, 1);
    const fY = bY + bH - fH;
    return (
        <svg className="water-bottle-svg" viewBox="0 0 42 92" fill="none">
            <defs>
                <clipPath id="bc"><rect x="7" y={bY} width={bW} height={bH} rx="5" /></clipPath>
                <linearGradient id="wf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
            </defs>
            <rect x={(42 - 13) / 2} y="2" width={13} height={cH} rx="3" fill="#cbd5e1" />
            <rect x="7" y={bY} width={bW} height={bH} rx="5"
                fill="#f4f6fb" stroke="#e4e7f0" strokeWidth="1.5" />
            <rect x="7" y={fY} width={bW} height={fH}
                fill="url(#wf)" clipPath="url(#bc)"
                style={{ transition: "all 0.5s ease" }} />
            <rect x="11" y={bY + 5} width="3" height={bH - 10} rx="1.5" fill="white" opacity="0.3" />
            {[0.33, 0.66].map((v, i) => (
                <line key={i} x1="7" x2="15"
                    y1={bY + bH - bH * v} y2={bY + bH - bH * v}
                    stroke="#bfdbfe" strokeWidth="1" strokeDasharray="2 2" />
            ))}
        </svg>
    );
};

// ─── BMI helpers ──────────────────────────────────────────────────────────────
const calcBMI = (h: number, w: number) => w / ((h / 100) ** 2);
const bmiStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", bg: "#bfdbfe", color: "#1d4ed8" };
    if (bmi < 25) return { label: "Healthy", bg: "#bbf7d0", color: "#065f46" };
    if (bmi < 30) return { label: "Overweight", bg: "#fed7aa", color: "#9a3412" };
    return { label: "Obese", bg: "#fecdd3", color: "#9f1239" };
};
const bmiBarPos = (bmi: number) => `${Math.min(Math.max((bmi - 15) / 25, 0), 1) * 100}%`;

// ─── Calories Modal ───────────────────────────────────────────────────────────
interface CaloriesModalProps {
    foodLog: FoodLog[];
    onClose: () => void;
    onAddFood: (log: FoodLog) => void;
}

const CaloriesModal: React.FC<CaloriesModalProps> = ({ foodLog, onClose, onAddFood }) => {
    const [search, setSearch] = useState("");
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [mealTime, setMealTime] = useState<MealTime>("Breakfast");
    const [grams, setGrams] = useState(100);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const dropRef = useRef<HTMLDivElement>(null);

    // const filtered = FOOD_DATABASE.filter(f =>
    //     f.name.toLowerCase().includes(search.toLowerCase())
    // );

    useEffect(() => {

        if (search.trim().length < 2) {
            setFoods([]);
            return;
        }

        const fetchFoods = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:5004/api/UsdaFood/search-usda?query=${search}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch foods");
                }

                const data = await response.json();
                console.log(data);
                const mappedFoods: FoodItem[] = data.foods.map((f: any) => ({
                    id: f.fdcId,
                    name: f.description,
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0,
                    vitaminC: 0,
                    fiber: 0,
                    unit: "100g"
                }));

                const uniqueFoods = mappedFoods.filter(
                    (food, index, self) =>
                        index === self.findIndex(
                            f => f.name.toLowerCase() === food.name.toLowerCase()
                        )
                );

                setFoods(uniqueFoods);

            } catch (err) {
                console.error(err);
            }
        };

        const timeout = setTimeout(() => {
            fetchFoods();
        }, 300);

        return () => clearTimeout(timeout);

    }, [search]);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleAdd = async () => {

        if (!selectedFood || grams <= 0) return;

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5004/api/FoodLog/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        fdcId: selectedFood.id,
                        quantityGrams: grams,
                        // mealTime: mealTime
                    })
                }
            );

            if (!response.ok) {

                const text = await response.text();

                console.log(text);
            }

            onAddFood({
                food: selectedFood,
                mealTime,
                grams
            });

            setSelectedFood(null);
            setSearch("");
            setGrams(100);

        } catch (err) {
            console.error(err);
        }
    };

    const macro = (val: number) => ((val * grams) / 100).toFixed(1);

    const groupedLog: Record<MealTime, FoodLog[]> = {
        Breakfast: foodLog.filter(l => l.mealTime === "Breakfast"),
        Lunch: foodLog.filter(l => l.mealTime === "Lunch"),
        Dinner: foodLog.filter(l => l.mealTime === "Dinner"),
        Snack: foodLog.filter(l => l.mealTime === "Snack"),
    };

    const mealIcons: Record<MealTime, string> = {
        Breakfast: "🌅",
        Lunch: "☀️",
        Dinner: "🌙",
        Snack: "🍎",
    };

    return (
        <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="db-modal-card db-modal-wide">
                <div className="db-modal-header">
                    <div className="db-modal-title">
                        <span className="db-modal-icon cal-icon">🔥</span>
                        Calories Consumed Today
                    </div>
                    <button className="db-modal-close" onClick={onClose} type="button">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className="db-modal-body">
                    {/* Today's log */}
                    {foodLog.length > 0 && (
                        <div className="db-modal-section">
                            <div className="db-modal-section-title">
                                📋 Today's Food Log
                            </div>
                            {(["Breakfast", "Lunch", "Dinner", "Snack"] as MealTime[]).map(meal => (
                                groupedLog[meal].length > 0 && (
                                    <div key={meal} className="meal-group">
                                        <div className="meal-group-label">
                                            {mealIcons[meal]} {meal}
                                        </div>
                                        {groupedLog[meal].map((log, i) => {
                                            const factor = log.grams / 100;
                                            const kcal = Math.round(log.food.calories * factor);
                                            return (
                                                <div className="food-log-item" key={i}>
                                                    <div className="food-log-name">{log.food.name}</div>
                                                    <div className="food-log-meta">
                                                        <span className="food-log-grams">{log.grams}g</span>
                                                        <span className="food-log-kcal">{kcal} kcal</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )
                            ))}
                        </div>
                    )}

                    {/* Add food form */}
                    <div className="db-modal-section">
                        <div className="db-modal-section-title">➕ Add Food</div>

                        {/* Food search — full width */}
                        <div className="add-food-grid">
                            <div className="add-food-search-wrap" ref={dropRef}>
                                <div className="add-food-input-row">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="search-prefix-icon" />
                                    <input
                                        type="text"
                                        className="db-input"
                                        placeholder="Search food (e.g. Chicken Breast)…"
                                        value={search}
                                        onFocus={() => setDropdownOpen(true)}
                                        onChange={e => {
                                            setSearch(e.target.value);
                                            setSelectedFood(null);
                                            setDropdownOpen(true);
                                        }}
                                    />
                                </div>
                                {dropdownOpen && foods.length > 0 && (
                                    <div className="food-dropdown">
                                        {foods.map(f => (
                                            <div
                                                key={f.id}
                                                className="food-dropdown-item"
                                                onClick={async () => {

                                                    try {

                                                        const token = localStorage.getItem("token");

                                                        const response = await fetch(
                                                            `http://localhost:5004/api/UsdaFood/${f.id}`,
                                                            {
                                                                method: "GET",
                                                                headers: {
                                                                    Authorization: `Bearer ${token}`
                                                                }
                                                            }
                                                        );

                                                        if (!response.ok) {
                                                            throw new Error("Failed to fetch food details");
                                                        }

                                                        const details = await response.json();

                                                        console.log(details);

                                                        const detailedFood: FoodItem = {
                                                            id: f.id,
                                                            name: f.name,
                                                            calories: details.calories ?? 0,
                                                            protein: details.protein ?? 0,
                                                            carbs: details.carbs ?? 0,
                                                            fat: details.fat ?? 0,
                                                            vitaminC: details.vitaminC ?? 0,
                                                            fiber: details.fiber ?? 0,
                                                            unit: "100g"
                                                        };

                                                        setSelectedFood(detailedFood);
                                                        setSearch(detailedFood.name);
                                                        setDropdownOpen(false);

                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                }}
                                            >
                                                <span className="food-dropdown-name">{f.name}</span>
                                                <span className="food-dropdown-cal">Click to view nutrition</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Meal time + Grams — side by side */}
                            <div className="add-food-sub-row">
                                <div className="add-food-field">
                                    <label className="db-field-label">Meal Time</label>
                                    <select
                                        className="db-select"
                                        value={mealTime}
                                        onChange={e => setMealTime(e.target.value as MealTime)}
                                    >
                                        <option value="Breakfast">🌅 Breakfast</option>
                                        <option value="Lunch">☀️ Lunch</option>
                                        <option value="Dinner">🌙 Dinner</option>
                                        <option value="Snack">🍎 Snack</option>
                                    </select>
                                </div>
                                <div className="add-food-field">
                                    <label className="db-field-label">Quantity (grams)</label>
                                    <input
                                        type="number"
                                        className="db-input"
                                        min={1}
                                        max={2000}
                                        value={grams}
                                        onChange={e => setGrams(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Macro preview */}
                        {selectedFood && (
                            <div className="macro-preview">
                                <div className="macro-preview-title">Nutritional values for {grams}g</div>
                                <div className="macro-grid">
                                    <div className="macro-chip cal-chip">
                                        <span className="macro-val">{macro(selectedFood.calories)}</span>
                                        <span className="macro-lbl">kcal</span>
                                    </div>
                                    <div className="macro-chip prot-chip">
                                        <span className="macro-val">{macro(selectedFood.protein)}g</span>
                                        <span className="macro-lbl">Protein</span>
                                    </div>
                                    <div className="macro-chip carb-chip">
                                        <span className="macro-val">{macro(selectedFood.carbs)}g</span>
                                        <span className="macro-lbl">Carbs</span>
                                    </div>
                                    <div className="macro-chip fat-chip">
                                        <span className="macro-val">{macro(selectedFood.fat)}g</span>
                                        <span className="macro-lbl">Fat</span>
                                    </div>
                                    <div className="macro-chip vitc-chip">
                                        <span className="macro-val">{macro(selectedFood.vitaminC)}mg</span>
                                        <span className="macro-lbl">Vit. C</span>
                                    </div>
                                    <div className="macro-chip fiber-chip">
                                        <span className="macro-val">{macro(selectedFood.fiber)}g</span>
                                        <span className="macro-lbl">Fiber</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: "8px" }}>
                            <button
                                className="db-btn-primary"
                                onClick={handleAdd}
                                disabled={!selectedFood || grams <= 0}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Add to Log
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Water Modal ──────────────────────────────────────────────────────────────
interface WaterModalProps {
    waterMl: number;
    waterMax: number;
    onClose: () => void;
    onUpdate: (ml: number) => void;
}

const WaterModal: React.FC<WaterModalProps> = ({ waterMl, waterMax, onClose, onUpdate }) => {
    const [customStr, setCustomStr] = useState("");
    const customVal = parseInt(customStr, 10);
    const customOk = !isNaN(customVal) && customVal > 0;
    const pct = Math.min((waterMl / waterMax) * 100, 100);

    const add = async (ml: number) => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5004/api/WaterLog/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        amountMl: ml
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add water");
            }

            onUpdate(Math.min(waterMl + ml, waterMax));

        } catch (err) {
            console.error(err);
        }
    };
    const sub = async (ml: number) => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5004/api/WaterLog/remove",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        amountMl: ml
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to remove water");
            }

            onUpdate(Math.max(waterMl - ml, 0));

        } catch (err) {
            console.error(err);
        }
    };

    const getHydrationStatus = () => {
        if (pct >= 100) return { label: "Goal Reached! 🎉", color: "#10b981" };
        if (pct >= 66) return { label: "Almost there!", color: "#f97316" };
        if (pct >= 33) return { label: "Keep it up!", color: "#0ea5e9" };
        return { label: "Stay hydrated!", color: "#6366f1" };
    };

    const hydStatus = getHydrationStatus();

    const presets = [
        { label: "Espresso", ml: 50, icon: "☕" },
        { label: "Glass", ml: 200, icon: "🥤" },
        { label: "Bottle", ml: 500, icon: "💧" },
        { label: "Large", ml: 750, icon: "🫙" },
    ];

    return (
        <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="db-modal-card">
                <div className="db-modal-header">
                    <div className="db-modal-title">
                        <span className="db-modal-icon water-icon">💧</span>
                        Water Consumed Today
                    </div>
                    <button className="db-modal-close" onClick={onClose} type="button">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className="db-modal-body">
                    {/* Status */}
                    <div className="db-modal-section water-status-section">
                        <div className="water-modal-top">
                            <WaterBottle pct={waterMl / waterMax} />
                            <div className="water-modal-stats">
                                <div className="water-modal-big">
                                    {waterMl.toLocaleString("en-US")}
                                    <em>ml</em>
                                </div>
                                <div className="water-modal-sub">
                                    of <strong>{waterMax.toLocaleString("en-US")} ml</strong> daily goal
                                </div>
                                <div className="water-modal-prog-wrap">
                                    <div className="water-modal-prog">
                                        <div className="water-modal-prog-fill" style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className="water-modal-pct" style={{ color: hydStatus.color }}>
                                        {pct.toFixed(0)}%
                                    </div>
                                </div>
                                <div className="water-hydration-badge" style={{ color: hydStatus.color }}>
                                    {hydStatus.label}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick add presets */}
                    <div className="db-modal-section">
                        <div className="db-modal-section-title">⚡ Quick Add</div>
                        <div className="water-preset-grid">
                            {presets.map(p => (
                                <button key={p.label} className="water-preset-btn" onClick={() => add(p.ml)}>
                                    <span className="preset-icon">{p.icon}</span>
                                    <span className="preset-label">{p.label}</span>
                                    <span className="preset-ml">+{p.ml} ml</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom amount */}
                    <div className="db-modal-section">
                        <div className="db-modal-section-title">📏 Custom Amount</div>
                        <div className="water-custom-row">
                            <div className="water-custom-input-wrap">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className="db-input water-custom-input"
                                    placeholder="ml"
                                    value={customStr}
                                    onChange={e => {
                                        const v = e.target.value.replace(/[^0-9]/g, '');
                                        setCustomStr(v);
                                    }}
                                />
                            </div>
                            <button
                                className="water-action-btn water-action-add"
                                onClick={() => { add(customVal); setCustomStr(''); }}
                                disabled={!customOk}
                            >
                                + Add
                            </button>
                            <button
                                className="water-action-btn water-action-remove"
                                onClick={() => { sub(customVal); setCustomStr(''); }}
                                disabled={!customOk}
                            >
                                − Remove
                            </button>
                        </div>
                    </div>

                    {/* Reset */}
                    <button className="db-btn-ghost" onClick={() => onUpdate(0)}>
                        Reset today's water intake
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Workouts Modal ───────────────────────────────────────────────────────────
interface WorkoutsModalProps {
    workouts: WorkoutLog[];
    onClose: () => void;
    onAddWorkout: (w: WorkoutLog) => void;
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
                            difficulty: we.difficulty || "Beginner",
                            fatigueCost: we.fatigueCost || 0
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
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="db-modal-card db-modal-split">
                
                {/* Left Sidebar: History */}
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
                                        icon={(WORKOUT_TYPE_COLORS[w.type] || WORKOUT_TYPE_COLORS["Strength"]).icon} 
                                        style={{color: (WORKOUT_TYPE_COLORS[w.type] || WORKOUT_TYPE_COLORS["Strength"]).color}} 
                                    />
                                </div>
                                <div className="history-item-meta">
                                    {new Date(w.date).toLocaleDateString()} · {w.duration}m
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Content: Form */}
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
                                <div className="wk-form-field" style={{width: '140px'}}>
                                    <label className="db-field-label">Type</label>
                                    <div className="custom-dropdown-wrap" ref={typeDropRef}>
                                        <div 
                                            className="db-select-custom" 
                                            onClick={() => setTypeDropOpen(!typeDropOpen)}
                                        >
                                            {type}
                                            <FontAwesomeIcon icon={typeDropOpen ? faXmark : faPlus} style={{fontSize: '10px', opacity: 0.5}} />
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
                                <div className="wk-form-field" style={{width: '140px'}}>
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
                        <div style={{flex: 1}} />
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

// --- Dashboard ----------------------------------------------------------------
const UserDashboard: React.FC = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);

    const [waterMl, setWaterMl] = useState(0);
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(72);

    // Modal states
    const [calModal, setCalModal] = useState(false);
    const [waterModal, setWaterModal] = useState(false);
    const [workoutModal, setWorkoutModal] = useState(false);

    // Food log state
    const [foodLog, setFoodLog] = useState<FoodLog[]>([]);
    // Workout log state
    const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);

    const fetchWorkouts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                "http://localhost:5004/api/workout/list",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
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
                            difficulty: we.difficulty || "Beginner",
                            fatigueCost: we.fatigueCost || 0
                        },
                        sets: we.sets,
                        reps: we.reps,
                        weight: we.weight
                    }))
                }));
                setWorkouts(mapped);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(
                    "http://localhost:5004/api/user/me",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    navigate("/login");
                    return;
                }

                const data = await response.json();

                setUser(data);

                if (data.height) {
                    setHeight(data.height);
                }

                if (data.weight) {
                    setWeight(data.weight);
                }

            } catch (err) {
                console.error(err);
                navigate("/login");
            }
        };

        fetchUser();

        const fetchWaterToday = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5004/api/WaterLog/today",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch water");
                }

                const data = await response.json();

                console.log(data);

                setWaterMl(data.amountMl ?? 0);

            } catch (err) {
                console.error(err);
            }
        };

        fetchWaterToday();

        fetchWorkouts();

    }, []);

    const WATER_MAX = 3000;
    const CAL_GOAL = 2200;
    const todayCal = 0;
    const totalFoodCal = foodLog.reduce((sum, log) => sum + Math.round(log.food.calories * log.grams / 100), 0);
    const calPct = Math.round(((todayCal + totalFoodCal) / CAL_GOAL) * 100);
    const waterPct = waterMl / WATER_MAX;

    const bmi = calcBMI(height, weight);
    const status = bmiStatus(bmi);

    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    const username = user?.name || "User";

    const initials = (username || "User")
        .split(" ")
        .filter(Boolean)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    return (
        <div className="db-root">

            {/* ── SIDEBAR ── */}
            <aside className="db-sidebar">
                <div className="db-logo">
                    <img src="/favicon.svg" alt="OmniTrack Logo" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
                </div>

                <nav className="db-nav">
                    <button className="db-nav-btn active" onClick={() => navigate('/dashboard')} title="Home">
                        <FontAwesomeIcon icon={faHouse} />
                    </button>
                    <button className="db-nav-btn" onClick={() => navigate('/calendar')} title="Calendar">
                        <FontAwesomeIcon icon={faCalendarDays} />
                    </button>
                    <button className="db-nav-btn" onClick={() => navigate('/profile')} title="Profile">
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                    <button className="db-nav-btn" onClick={() => navigate('/settings')} title="Settings">
                        <FontAwesomeIcon icon={faUserGear} />
                    </button>
                </nav>

                <div className="db-sidebar-bottom">
                    <button className="db-avatar" onClick={() => navigate('/profile')}>{initials}</button>
                </div>
            </aside>

            {/* ── CENTER ── */}
            <main className="db-center">

                {/* Header */}
                <div className="db-header">
                    <div>
                        <h1>Good day, {username} 👋</h1>
                        <p>{dateStr}</p>
                    </div>
                    <div className="db-header-right">
                        <button className="db-icon-btn">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                        <button className="db-icon-btn">
                            <FontAwesomeIcon icon={faBell} />
                        </button>
                    </div>
                </div>

                {/* Stats row */}
                <div className="db-stats-row">

                    {/* Calories — clickable */}
                    <div
                        className="db-card db-card-clickable"
                        onClick={() => setCalModal(true)}
                        title="Click to log food"
                    >
                        <div className="db-card-lbl">
                            <FontAwesomeIcon icon={faFire} style={{ color: "#f97316", marginRight: 6 }} />
                            Calories consumed today
                        </div>
                        <div className="cal-top">
                            <div className="cal-num">{(todayCal + totalFoodCal).toLocaleString("en-US")}<em>kcal</em></div>
                            <div className="cal-pill">{calPct}%</div>
                        </div>
                        <div className="cal-sub">
                            Goal: <strong>{CAL_GOAL.toLocaleString("en-US")} kcal</strong> ({calPct}% reached)
                        </div>
                        <div className="cal-prog">
                            <div className="cal-prog-fill" style={{ width: `${Math.min(calPct, 100)}%` }} />
                        </div>
                        <div className="db-card-click-hint">
                            <FontAwesomeIcon icon={faPlus} /> Log food
                        </div>
                    </div>

                    {/* Water — clickable */}
                    <div
                        className="db-card db-card-clickable"
                        onClick={() => setWaterModal(true)}
                        title="Click to log water"
                    >
                        <div className="db-card-lbl">
                            <FontAwesomeIcon icon={faDroplet} style={{ color: "#60b8f5", marginRight: 6 }} />
                            Water consumed today
                        </div>
                        <div className="water-body">
                            <div className="water-bottle-wrap">
                                <WaterBottle pct={waterPct} />
                            </div>
                            <div className="water-details">
                                <div className="water-num">{waterMl.toLocaleString("en-US")}<em>ml</em></div>
                                <div className="water-sub">of <strong>{WATER_MAX.toLocaleString("en-US")} ml</strong> daily</div>
                                <div className="water-prog">
                                    <div className="water-prog-fill" style={{ width: `${Math.min(waterPct * 100, 100)}%` }} />
                                </div>
                            </div>
                        </div>
                        <div className="db-card-click-hint">
                            <FontAwesomeIcon icon={faDroplet} /> Log water
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="db-card db-chart-card">
                    <div className="chart-hdr">
                        <span className="db-card-lbl">Weekly progress</span>
                        <div className="chart-legend">
                            <div className="legend-item"><span style={{ background: "#f97316" }} className="legend-dot" />Calories</div>
                            <div className="legend-item"><span style={{ background: "#38bdf8" }} className="legend-dot" />Water</div>
                        </div>
                    </div>
                    <div className="chart-box"><BarChart /></div>
                </div>

                {/* Bottom row */}
                <div className="db-bottom-row">

                    {/* Workouts — clickable */}
                    <div
                        className="db-card db-card-clickable"
                        onClick={() => setWorkoutModal(true)}
                        title="Click to log workout"
                    >
                        <div className="db-card-lbl">
                            <FontAwesomeIcon icon={faDumbbell} style={{ color: "#6366f1", marginRight: 6 }} />
                            My Workouts
                        </div>

                        {workouts.length === 0 ? (
                            <div className="workout-empty-state">
                                <div className="workout-empty-icon">🏋️</div>
                                <div className="workout-empty-text">No workouts logged yet</div>
                                <div className="workout-empty-sub">Click to add your first workout</div>
                            </div>
                        ) : (
                            <div className="workout-preview-list">
                                {workouts.slice(-2).map((w, i) => {
                                    const tc = WORKOUT_TYPE_COLORS[w.type] || WORKOUT_TYPE_COLORS["Strength"];
                                    return (
                                        <div className="workout-preview-item" key={i}>
                                            <span className="workout-type-badge-db" style={{ background: tc.bg, color: tc.color }}>
                                                <FontAwesomeIcon icon={tc.icon} style={{marginRight: 4}} />
                                                {w.type}
                                            </span>
                                            <span className="workout-preview-name">{w.label}</span>
                                            <span className="workout-preview-time">{w.duration}m · {new Date(w.date).toLocaleDateString()}</span>
                                        </div>
                                    );
                                })}
                                {workouts.length > 2 && (
                                    <div className="workout-more">+{workouts.length - 2} more workouts in history</div>
                                )}
                            </div>
                        )}
                        <div className="db-card-click-hint">
                            <FontAwesomeIcon icon={faPlus} /> Log workout
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="db-card">
                        <div className="db-card-lbl">Quick stats</div>
                        <div className="qs-list">
                            <div className="qs-row">
                                <div className="qs-left">
                                    <div className="qs-ico" style={{ background: "var(--cal-soft)", color: "var(--cal-color)" }}>
                                        <FontAwesomeIcon icon={faFire} />
                                    </div>
                                    <span className="qs-lbl">Calories this week</span>
                                </div>
                                <span className="qs-val">13,470</span>
                            </div>
                            <div className="qs-row">
                                <div className="qs-left">
                                    <div className="qs-ico" style={{ background: "var(--water-soft)", color: "var(--water-color)" }}>
                                        <FontAwesomeIcon icon={faDroplet} />
                                    </div>
                                    <span className="qs-lbl">Water this week</span>
                                </div>
                                <span className="qs-val">15.4 L</span>
                            </div>
                            <div className="qs-row">
                                <div className="qs-left">
                                    <div className="qs-ico" style={{ background: "var(--green-soft)", color: "var(--green)" }}>
                                        <FontAwesomeIcon icon={faDumbbell} />
                                    </div>
                                    <span className="qs-lbl">Goal days reached</span>
                                </div>
                                <span className="qs-val">5 / 7</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── RIGHT DARK PANEL — BMI ── */}
            <aside className="db-right">
                <div>
                    <div className="bmi-title">BMI Calculator</div>
                    <div className="bmi-sub">Calculate your body mass index</div>
                </div>

                {/* Sliders */}
                <div className="bmi-slider-card">
                    <div className="sl-row">
                        <div className="sl-hdr">
                            <span className="sl-lbl">Height</span>
                            <span className="sl-val">{height}<em>cm</em></span>
                        </div>
                        <input type="range" className="bmi-range"
                            min={140} max={210} value={height}
                            onChange={e => setHeight(Number(e.target.value))}
                            style={{ background: `linear-gradient(90deg, #6366f1 ${((height - 140) / 70) * 100}%, rgba(255,255,255,0.12) ${((height - 140) / 70) * 100}%)` }}
                        />
                    </div>
                    <div className="sl-row">
                        <div className="sl-hdr">
                            <span className="sl-lbl">Weight</span>
                            <span className="sl-val">{weight}<em>kg</em></span>
                        </div>
                        <input type="range" className="bmi-range"
                            min={40} max={150} value={weight}
                            onChange={e => setWeight(Number(e.target.value))}
                            style={{ background: `linear-gradient(90deg, #6366f1 ${((weight - 40) / 110) * 100}%, rgba(255,255,255,0.12) ${((weight - 40) / 110) * 100}%)` }}
                        />
                    </div>
                </div>

                {/* BMI Result */}
                <div className="bmi-result-card">
                    <div className="bmi-result-lbl">Body Mass Index (BMI)</div>
                    <div className="bmi-big">{bmi.toFixed(1)}</div>
                    <div className="bmi-badge" style={{ background: status.bg, color: status.color }}>
                        {status.label}
                    </div>

                    <div className="bmi-bar-wrap">
                        <div className="bmi-bar">
                            <div className="bmi-indicator" style={{ left: bmiBarPos(bmi) }} />
                        </div>
                        <div className="bmi-bar-ticks">
                            <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── MODALS ── */}
            {calModal && (
                <CaloriesModal
                    foodLog={foodLog}
                    onClose={() => setCalModal(false)}
                    onAddFood={log => setFoodLog(prev => [...prev, log])}
                />
            )}
            {waterModal && (
                <WaterModal
                    waterMl={waterMl}
                    waterMax={WATER_MAX}
                    onClose={() => setWaterModal(false)}
                    onUpdate={setWaterMl}
                />
            )}
            {workoutModal && (
                <WorkoutsModal
                    workouts={workouts}
                    onClose={() => {
                        setWorkoutModal(false);
                        fetchWorkouts();
                    }}
                    onAddWorkout={fetchWorkouts}
                />
            )}

        </div>
    );
};

export default UserDashboard;