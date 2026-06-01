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
    faChevronDown,
    faPencil,
    faArrowDown,
    faTrophy,
    faWeightScale,
    faCircleCheck,
    faQuestion,
    faChevronRight,
    faAppleWhole,
    faMoon,
    faCoffee,
    faUtensils,
    faGlassWater,
    faBolt,
    faRuler,
    faListUl
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const formatDateKey = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// ─── Chart Data ───────────────────────────────────────────────────────────────
const DAYS_LABELS = ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"];
const CAL_DATA = [1842, 2100, 1800, 2350, 1950, 2210, 1420];
const WAT_DATA = [2100, 2400, 2000, 2800, 2200, 2600, 1600];

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
interface BarChartProps {
    labels: string[];
    calData: number[];
    waterData: number[];
}

const BarChart: React.FC<BarChartProps> = ({ labels, calData, waterData }) => {
    const W = 600, H = 220, pL = 40, pR = 60, pT = 20, pB = 30;
    const cW = W - pL - pR, cH = H - pT - pB;
    const n = labels.length || 7;
    const gW = cW / n;
    const bW = 12, gap = 4;
    
    const maxWaterScale = 4.0; // Liters
    const maxCalScale = 4000;  // kcal
    const CAL_GOAL = 2200;
    const WATER_GOAL = 3.0;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="db-svg-chart">
            <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ffedd5" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.5" />
                </linearGradient>
            </defs>
            
            {/* Horizontal Grid lines (5 ticks) */}
            {[0, 0.25, 0.5, 0.75, 1].map((v, i) => {
                const y = pT + cH - v * cH;
                const waterVal = (v * maxWaterScale).toFixed(0);
                const calVal = v === 0 ? "0" : `${(v * maxCalScale) / 1000}K`;
                return (
                    <g key={i} className="chart-grid-group">
                        <line x1={pL} x2={W - pR} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                        {/* Left Y Axis (Water L) */}
                        <text x={pL - 10} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="500">{waterVal}</text>
                        {/* Right Y Axis (Calories kcal) */}
                        <text x={W - pR + 10} y={y + 4} textAnchor="start" fontSize="10" fill="#94a3b8" fontWeight="500">{calVal}</text>
                    </g>
                );
            })}

            {/* Goal Line: Water 3.0 L */}
            {(() => {
                const yWaterGoal = pT + cH - (WATER_GOAL / maxWaterScale) * cH;
                return (
                    <g>
                        <line x1={pL} x2={W - pR} y1={yWaterGoal} y2={yWaterGoal} 
                            stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.8" />
                        <text x={W - pR + 10} y={yWaterGoal - 4} fontSize="9" fill="#2563eb" fontWeight="700">3.0 L (Goal)</text>
                    </g>
                );
            })()}

            {/* Goal Line: Calories 2,200 kcal */}
            {(() => {
                const yCalGoal = pT + cH - (CAL_GOAL / maxCalScale) * cH;
                return (
                    <g>
                        <line x1={pL} x2={W - pR} y1={yCalGoal} y2={yCalGoal} 
                            stroke="#f97316" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.8" />
                        <text x={W - pR + 10} y={yCalGoal + 10} fontSize="9" fill="#ea580c" fontWeight="700">2,200 kcal (Goal)</text>
                    </g>
                );
            })()}

            {/* Bars and labels */}
            {labels.map((d: string, i: number) => {
                const cx = pL + i * gW + gW / 2;
                
                // Water in liters for scaling
                const waterL = (waterData[i] || 0) / 1000;
                const calories = calData[i] || 0;

                const wh = Math.min((waterL / maxWaterScale) * cH, cH);
                const ch = Math.min((calories / maxCalScale) * cH, cH);

                return (
                    <g key={i}>
                        {/* Water Bar (Blue) */}
                        <rect x={cx - bW - gap / 2} y={pT + cH - wh} width={bW} height={wh} fill="url(#wg)" rx="4" />
                        
                        {/* Calories Bar (Orange) */}
                        <rect x={cx + gap / 2} y={pT + cH - ch} width={bW} height={ch} fill="url(#cg)" rx="4" />
                        
                        {/* X-Axis Date Label */}
                        <text x={cx} y={H - 8} textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600">{d}</text>
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

    const mealIcons: Record<MealTime, any> = {
        Breakfast: faCoffee,
        Lunch: faUtensils,
        Dinner: faMoon,
        Snack: faAppleWhole,
    };

    return (
        <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="db-modal-card db-modal-wide">
                <div className="db-modal-header">
                    <div className="db-modal-title">
                        <span className="db-modal-icon cal-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesomeIcon icon={faFire} style={{ color: "#ea580c" }} />
                        </span>
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
                                <FontAwesomeIcon icon={faListUl} style={{ marginRight: 6 }} /> Today's Food Log
                            </div>
                            {(["Breakfast", "Lunch", "Dinner", "Snack"] as MealTime[]).map(meal => (
                                groupedLog[meal].length > 0 && (
                                    <div key={meal} className="meal-group">
                                        <div className="meal-group-label">
                                            <FontAwesomeIcon icon={mealIcons[meal]} style={{ marginRight: 6 }} /> {meal}
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
                        <div className="db-modal-section-title">
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: 6 }} /> Add Food
                        </div>

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
                                        <option value="Breakfast">Breakfast</option>
                                        <option value="Lunch">Lunch</option>
                                        <option value="Dinner">Dinner</option>
                                        <option value="Snack">Snack</option>
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
        if (pct >= 100) return { label: "Goal Reached!", color: "#10b981" };
        if (pct >= 66) return { label: "Almost there!", color: "#f97316" };
        if (pct >= 33) return { label: "Keep it up!", color: "#0ea5e9" };
        return { label: "Stay hydrated!", color: "#6366f1" };
    };

    const hydStatus = getHydrationStatus();

    const presets = [
        { label: "Espresso", ml: 50, icon: faCoffee },
        { label: "Glass", ml: 200, icon: faGlassWater },
        { label: "Bottle", ml: 500, icon: faDroplet },
        { label: "Large", ml: 750, icon: faGlassWater },
    ];

    return (
        <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="db-modal-card">
                <div className="db-modal-header">
                    <div className="db-modal-title">
                        <span className="db-modal-icon water-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesomeIcon icon={faDroplet} style={{ color: "#0ea5e9" }} />
                        </span>
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
                        <div className="db-modal-section-title">
                            <FontAwesomeIcon icon={faBolt} style={{ marginRight: 6 }} /> Quick Add
                        </div>
                        <div className="water-preset-grid">
                            {presets.map(p => (
                                <button key={p.label} className="water-preset-btn" onClick={() => add(p.ml)}>
                                    <FontAwesomeIcon icon={p.icon} style={{ fontSize: '18px', color: '#0ea5e9', marginBottom: '4px' }} />
                                    <span className="preset-label">{p.label}</span>
                                    <span className="preset-ml">+{p.ml} ml</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom amount */}
                    <div className="db-modal-section">
                        <div className="db-modal-section-title">
                            <FontAwesomeIcon icon={faRuler} style={{ marginRight: 6 }} /> Custom Amount
                        </div>
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
                onAddWorkout(null as any);
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
                                        style={{ color: (WORKOUT_TYPE_COLORS[w.type] || WORKOUT_TYPE_COLORS["Strength"]).color }}
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

// --- Dashboard ----------------------------------------------------------------
const UserDashboard: React.FC = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);

    const [waterMl, setWaterMl] = useState(0);
    const [todayCalories, setTodayCalories] = useState(0);
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(72);
    const [weightHistoryLogs, setWeightHistoryLogs] = useState<Record<string, number>>(() => {
        const wVal = 72;
        const tempLogs: Record<string, number> = {};
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d);
        }
        tempLogs[formatDateKey(dates[0])] = wVal + 1.5;
        tempLogs[formatDateKey(dates[2])] = wVal + 0.9;
        tempLogs[formatDateKey(dates[4])] = wVal + 0.6;
        tempLogs[formatDateKey(dates[5])] = wVal + 0.2;
        return tempLogs;
    });

    // Weight inline edit states
    const [isEditingWeight, setIsEditingWeight] = useState(false);
    const [tempWeight, setTempWeight] = useState("72");

    useEffect(() => {
        if (weight) {
            setTempWeight(weight.toString());
        }
    }, [weight]);

    const handleSaveWeight = async () => {
        const val = parseFloat(tempWeight);
        if (isNaN(val) || val <= 0) return;
        
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5004/api/user/me", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    weight: val
                })
            });

            if (response.ok) {
                setWeight(val);
                setIsEditingWeight(false);
                const todayStr = formatDateKey(new Date());
                setWeightHistoryLogs(prev => ({
                    ...prev,
                    [todayStr]: val
                }));
            } else {
                alert("Could not update weight.");
            }
        } catch (err) {
            console.error(err);
            setWeight(val);
            setIsEditingWeight(false);
            const todayStr = formatDateKey(new Date());
            setWeightHistoryLogs(prev => ({
                ...prev,
                [todayStr]: val
            }));
        }
    };

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

    const [weeklyLabels, setWeeklyLabels] = useState<string[]>([]);
    const [weeklyCal, setWeeklyCal] = useState<number[]>([]);
    const [weeklyWater, setWeeklyWater] = useState<number[]>([]);
    const [weeklyLoading, setWeeklyLoading] = useState(true);

    const fetchWeeklyProgress = async () => {
        try {
            const dates = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                dates.push(d);
            }

            const token = localStorage.getItem("token");
            const promises = dates.map(d => {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                const formatted = `${year}-${month}-${day}`;
                return fetch(`http://localhost:5004/api/calendar/day/${formatted}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => {
                    if (res.ok) return res.json();
                    return { calories: 0, waterMl: 0 };
                }).catch(() => ({ calories: 0, waterMl: 0 }));
            });

            const results = await Promise.all(promises);
            
            const labels = dates.map(d => {
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return `${months[d.getMonth()]} ${d.getDate()}`;
            });
            
            const cals = results.map(r => r.calories || 0);
            const waters = results.map(r => r.waterMl || 0);

            setWeeklyLabels(labels);
            setWeeklyCal(cals);
            setWeeklyWater(waters);
            setWeeklyLoading(false);
        } catch (err) {
            console.error("Error fetching weekly progress:", err);
        }
    };

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

    const fetchTodayCalories = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                "http://localhost:5004/api/FoodLog/today",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch calories");
            }

            const data = await response.json();
            console.log(data);
            setTodayCalories(data.calories ?? 0);
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
                const userData = (data.isSuccess && data.data) ? data.data : data;

                setUser(userData);

                if (userData.height) {
                    setHeight(userData.height);
                }

                if (userData.weight) {
                    setWeight(userData.weight);
                    
                    const wVal = userData.weight;
                    const tempLogs: Record<string, number> = {};
                    const dates = [];
                    for (let i = 6; i >= 0; i--) {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        dates.push(d);
                    }
                    tempLogs[formatDateKey(dates[0])] = wVal + 1.5;
                    tempLogs[formatDateKey(dates[2])] = wVal + 0.9;
                    tempLogs[formatDateKey(dates[4])] = wVal + 0.6;
                    tempLogs[formatDateKey(dates[5])] = wVal + 0.2;
                    setWeightHistoryLogs(tempLogs);
                }

            } catch (err) {
                console.error(err);
                navigate("/login");
            }
        };

        fetchUser();
        fetchWaterToday();
        fetchTodayCalories();
        fetchWorkouts();
        fetchWeeklyProgress();

    }, []);

    const WATER_MAX = 3000;
    const CAL_GOAL = 2200;
    const todayCal = todayCalories;
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

    const initials = (username)
        .split(" ")
        .filter(Boolean)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    // Averages & Best Day calculations
    const avgWaterNum = weeklyWater.length > 0 
        ? (weeklyWater.reduce((a, b) => a + b, 0) / weeklyWater.length / 1000) 
        : 0;
    const avgWaterLabel = `${avgWaterNum.toFixed(1)} L`;

    const avgCalNum = weeklyCal.length > 0 
        ? Math.round(weeklyCal.reduce((a, b) => a + b, 0) / weeklyCal.length) 
        : 0;
    const avgCalLabel = `${avgCalNum.toLocaleString("en-US")} kcal`;

    let bestDayIdx = 0;
    let maxCal = 0;
    for (let i = 0; i < weeklyCal.length; i++) {
        if (weeklyCal[i] > maxCal) {
            maxCal = weeklyCal[i];
            bestDayIdx = i;
        }
    }
    const bestDayLabel = weeklyLabels[bestDayIdx] || "N/A";
    const bestDayWaterLabel = weeklyWater.length > bestDayIdx ? `${(weeklyWater[bestDayIdx] / 1000).toFixed(1)} L` : "0.0 L";
    const bestDayCalLabel = weeklyCal.length > bestDayIdx ? `${weeklyCal[bestDayIdx].toLocaleString("en-US")} kcal` : "0 kcal";

    // Weight history & change calculations for sparkline
    const dates: Date[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d);
    }
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const weightLabels = dates.map(d => `${months[d.getMonth()]} ${d.getDate()}`);

    const weightHistory = dates.map(d => {
        const key = formatDateKey(d);
        const todayStr = formatDateKey(new Date());
        if (key === todayStr) {
            return weight;
        }
        return weightHistoryLogs[key] !== undefined && weightHistoryLogs[key] !== null
            ? weightHistoryLogs[key]
            : weight;
    });

    const yesterdayW = weightHistory[5] !== undefined ? weightHistory[5] : weight;
    const change = weight - yesterdayW;
    const isChangePositive = change > 0;
    const isChangeNegative = change < 0;
    const changeText = change === 0 ? "0.0 kg" : `${isChangePositive ? '+' : ''}${change.toFixed(1)} kg`;

    return (
        <div className="db-root">

            {/* ── SIDEBAR ── */}
            <aside className="db-sidebar">
                <div className="db-logo-wrapper">
                    <img src="/OmniTrackLogo.png" alt="OmniTrack Logo" className="db-logo-img" />
                    <span className="db-logo-text">OmniTrack</span>
                </div>

                <nav className="db-nav-links">
                    <button className="db-nav-item active" onClick={() => navigate('/dashboard')}>
                        <FontAwesomeIcon icon={faHouse} className="nav-item-icon" />
                        <span>Dashboard</span>
                    </button>
                    <button className="db-nav-item" onClick={() => navigate('/calendar')}>
                        <FontAwesomeIcon icon={faCalendarDays} className="nav-item-icon" />
                        <span>Progress</span>
                    </button>
                    <button className="db-nav-item" onClick={() => navigate('/profile')}>
                        <FontAwesomeIcon icon={faUser} className="nav-item-icon" />
                        <span>Profile</span>
                    </button>
                    <button className="db-nav-item" onClick={() => navigate('/settings')}>
                        <FontAwesomeIcon icon={faUserGear} className="nav-item-icon" />
                        <span>Settings</span>
                    </button>
                </nav>

                <div className="db-sidebar-user">
                    <div className="user-avatar-wrap" onClick={() => navigate('/profile')}>
                        <div className="user-avatar-img">{initials}</div>
                    </div>
                    <div className="user-details-mini">
                        <div className="user-name-row">
                            <span className="user-display-name">{username}</span>
                            <FontAwesomeIcon icon={faChevronRight} className="user-arrow-icon" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── MAIN DASHBOARD AREA ── */}
            <main className="db-center">

                {/* Header */}
                <div className="db-header-new">
                    <div className="header-greeting-group">
                        <h1>Good morning, {username}!</h1>
                        <p>Here's your overview for today.</p>
                    </div>
                    <div className="header-actions-group">
                        <button className="header-circle-btn notification-btn">
                            <FontAwesomeIcon icon={faBell} />
                            <span className="bell-badge-dot" />
                        </button>
                        <div className="header-pill-btn date-selector-btn" style={{ cursor: "default" }}>
                            <FontAwesomeIcon icon={faCalendarDays} className="btn-icon-left" />
                            <span>{dateStr.split(',')[1]?.trim() || "May 18, 2024"}</span>
                        </div>
                    </div>
                </div>

                {/* Grid Container */}
                <div className="db-dashboard-grid">

                    {/* CARD 1: Calories Consumed */}
                    <div className="db-grid-card card-calories" onClick={() => setCalModal(true)}>
                        <div className="card-header-row">
                            <div className="card-icon-container cal-icon-bg">
                                <FontAwesomeIcon icon={faFire} />
                            </div>
                            <span className="card-title">Calories Consumed</span>
                        </div>
                        <div className="card-big-value">
                            <strong>{Math.round(todayCal + totalFoodCal).toLocaleString("en-US")}</strong>
                            <span className="value-gray"> / {CAL_GOAL.toLocaleString("en-US")} kcal</span>
                        </div>
                        <div className="card-progress-section">
                            <div className="thick-progress-bar">
                                <div className="progress-fill cal-fill-bg" style={{ width: `${Math.min(calPct, 100)}%` }} />
                            </div>
                            <span className="progress-percent">{calPct}%</span>
                        </div>
                        <div className="card-helper-text">
                            Remaining: {Math.max(0, CAL_GOAL - Math.round(todayCal + totalFoodCal)).toLocaleString("en-US")} kcal
                        </div>
                    </div>

                    {/* CARD 2: Water Consumed */}
                    <div className="db-grid-card card-water" onClick={() => setWaterModal(true)}>
                        <div className="card-header-row">
                            <div className="card-icon-container water-icon-bg">
                                <FontAwesomeIcon icon={faDroplet} />
                            </div>
                            <span className="card-title">Water Consumed</span>
                        </div>
                        <div className="card-big-value">
                            <strong>{(waterMl / 1000).toFixed(1)}</strong>
                            <span className="value-gray"> / {(WATER_MAX / 1000).toFixed(1)} L</span>
                        </div>
                        <div className="card-progress-section">
                            <div className="thick-progress-bar">
                                <div className="progress-fill water-fill-bg" style={{ width: `${Math.min(waterPct * 100, 100)}%` }} />
                            </div>
                            <span className="progress-percent">{Math.round(waterPct * 100)}%</span>
                        </div>
                        <div className="card-helper-text">
                            Remaining: {Math.max(0, (WATER_MAX - waterMl) / 1000).toFixed(1)} L
                        </div>
                    </div>

                    {/* CARD 3: Workouts This Week */}
                    <div className="db-grid-card card-workouts" onClick={() => setWorkoutModal(true)}>
                        <div className="card-header-row">
                            <div className="card-icon-container workout-icon-bg">
                                <FontAwesomeIcon icon={faDumbbell} />
                            </div>
                            <span className="card-title">Workouts This Week</span>
                        </div>
                        <div className="card-workout-body-wrap">
                            <div className="workout-stats-col">
                                <div className="card-big-value">
                                    <strong>{workouts.length}</strong>
                                    <span className="value-gray"> / 5 sessions</span>
                                </div>
                                <div className="card-progress-section">
                                    <div className="thick-progress-bar">
                                        <div className="progress-fill workout-fill-bg" style={{ width: `${Math.min((workouts.length / 5) * 100, 100)}%` }} />
                                    </div>
                                    <span className="progress-percent">{Math.round(Math.min((workouts.length / 5) * 100, 100))}%</span>
                                </div>
                            </div>
                            <div className="workout-illustration-container">
                                <img src="/runner_illustration.png" alt="Runner Illustration" className="runner-illustration-img" />
                            </div>
                        </div>
                    </div>

                    {/* CARD 4: Last 7 Days - Spans 2 Columns */}
                    <div className="db-grid-card card-weekly-progress span-2">
                        <div className="weekly-header-row">
                            <span className="weekly-card-title">Last 7 Days</span>
                            <div className="weekly-actions">
                                <div className="weekly-tabs">
                                    <button className="weekly-tab active">Daily Goals</button>
                                    <button className="weekly-tab">Daily Weight</button>
                                </div>
                                <button className="help-circle-btn">
                                    <FontAwesomeIcon icon={faQuestion} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="weekly-legends-row">
                            <div className="legend-dot-item">
                                <span className="legend-dot-marker blue-dot" />
                                <span className="legend-dot-label">Water (L)</span>
                            </div>
                            <div className="legend-dot-item">
                                <span className="legend-dot-marker orange-dot" />
                                <span className="legend-dot-label">Calories (kcal)</span>
                            </div>
                        </div>

                        <div className="weekly-chart-wrapper">
                            {weeklyLoading ? (
                                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Loading chart...</div>
                            ) : (
                                <BarChart labels={weeklyLabels} calData={weeklyCal} waterData={weeklyWater} />
                            )}
                        </div>

                        <div className="weekly-summary-stats">
                            <div className="summary-widget">
                                <div className="widget-header">
                                    <FontAwesomeIcon icon={faDroplet} className="widget-icon blue-text" />
                                    <span className="widget-label">Avg. Water / Day</span>
                                </div>
                                <div className="widget-value">{avgWaterLabel}</div>
                            </div>
                            <div className="summary-divider" />
                            <div className="summary-widget">
                                <div className="widget-header">
                                    <FontAwesomeIcon icon={faFire} className="widget-icon orange-text" />
                                    <span className="widget-label">Avg. Calories / Day</span>
                                </div>
                                <div className="widget-value">{avgCalLabel}</div>
                            </div>
                            <div className="summary-divider" />
                            <div className="summary-widget">
                                <div className="widget-header">
                                    <FontAwesomeIcon icon={faTrophy} className="widget-icon yellow-text" />
                                    <span className="widget-label">Best Day</span>
                                </div>
                                <div className="widget-best-details">
                                    <span className="widget-best-day">{bestDayLabel}</span>
                                    <span className="widget-best-meta">{bestDayWaterLabel} · {bestDayCalLabel}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 5: Today's Weight */}
                    <div className="db-grid-card card-weight">
                        <div className="weight-header-row">
                            <div className="weight-title-group">
                                <FontAwesomeIcon icon={faWeightScale} className="weight-title-icon" />
                                <span className="weight-card-title">Today's Weight</span>
                            </div>
                        </div>

                        <div className="weight-stats-split">
                            <div className="weight-stat-box">
                                <span className="weight-stat-label">Current Weight</span>
                                {isEditingWeight ? (
                                    <div className="weight-edit-inline">
                                        <input 
                                            type="number" 
                                            step="0.1" 
                                            className="weight-inline-input"
                                            value={tempWeight} 
                                            onChange={e => setTempWeight(e.target.value)} 
                                            autoFocus
                                        />
                                        <button className="weight-inline-save" onClick={handleSaveWeight}>Save</button>
                                        <button className="weight-inline-cancel" onClick={() => { setIsEditingWeight(false); setTempWeight(weight.toString()); }}>X</button>
                                    </div>
                                ) : (
                                    <div className="weight-stat-value-row">
                                        <span className="weight-stat-value"><strong>{weight}</strong> kg</span>
                                        <button className="weight-edit-trigger" onClick={() => setIsEditingWeight(true)}>
                                            <FontAwesomeIcon icon={faPencil} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="weight-stat-box">
                                <span className="weight-stat-label">Change from yesterday</span>
                                <div className={`weight-change-value-row ${isChangeNegative ? "green-text" : isChangePositive ? "red-text" : "muted-text"}`}>
                                    {isChangeNegative && <FontAwesomeIcon icon={faArrowDown} className="weight-change-icon" />}
                                    {isChangePositive && <FontAwesomeIcon icon={faPlus} className="weight-change-icon" style={{ fontSize: '10px', marginRight: '2px' }} />}
                                    <span className="weight-change-value">{changeText}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sparkline Weight chart */}
                        <div className="weight-sparkline-container">
                            {(() => {
                                const minW = Math.min(...weightHistory) - 1;
                                const maxW = Math.max(...weightHistory) + 1;
                                const range = maxW - minW || 1;
                                
                                // Plot dimensions
                                const widthTotal = 400;
                                const heightTotal = 200;
                                const paddingLeft = 45;
                                const paddingRight = 20;
                                const paddingTop = 25;
                                const paddingBottom = 35;
                                
                                const chartW = widthTotal - paddingLeft - paddingRight;
                                const chartH = heightTotal - paddingTop - paddingBottom;
                                
                                const mapY = (w: number) => paddingTop + chartH - ((w - minW) / range) * chartH;
                                const step = chartW / 6;
                                
                                const points = weightHistory.map((w, idx) => ({
                                    x: paddingLeft + idx * step,
                                    y: mapY(w),
                                    val: w
                                }));
                                
                                const pathD = points.reduce((acc, p, idx) => acc + (idx === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), "");
                                const areaD = pathD + ` L ${points[points.length - 1].x} ${paddingTop + chartH} L ${points[0].x} ${paddingTop + chartH} Z`;
                                
                                // Y ticks at min, mid, max
                                const yTicks = [minW, (minW + maxW) / 2, maxW];
                                
                                return (
                                    <svg viewBox={`0 0 ${widthTotal} ${heightTotal}`} width="100%" height={heightTotal} className="sparkline-svg">
                                        <defs>
                                            <linearGradient id="weight-grad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                                            </linearGradient>
                                        </defs>
                                        
                                        {/* Grid lines */}
                                        {yTicks.map((tickVal, idx) => {
                                            const y = mapY(tickVal);
                                            return (
                                                <g key={idx} className="chart-grid-group">
                                                    <line x1={paddingLeft} x2={widthTotal - paddingRight} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                                                    <text x={paddingLeft - 10} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="600">{tickVal.toFixed(1)}</text>
                                                </g>
                                            );
                                        })}
                                        
                                        {/* Shaded Area */}
                                        <path d={areaD} fill="url(#weight-grad)" />
                                        
                                        {/* Line path */}
                                        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0px 3px 5px rgba(59, 130, 246, 0.25))" }} />
                                        
                                        {/* Data points */}
                                        {points.map((p, idx) => (
                                            <g key={idx} className="chart-point-group">
                                                <circle cx={p.x} cy={p.y} r={idx === points.length - 1 ? "5" : "4"} 
                                                    fill="#ffffff" stroke="#3b82f6" strokeWidth="2.5" />
                                                
                                                {/* Tooltip / Weight value right above point */}
                                                <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#2563eb">
                                                    {p.val.toFixed(1)}
                                                </text>
                                            </g>
                                        ))}
                                        
                                        {/* X Axis Labels (Dates) */}
                                        {points.map((p, idx) => (
                                            <text key={idx} x={p.x} y={heightTotal - 10} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="600">
                                                {weightLabels[idx]}
                                            </text>
                                        ))}
                                    </svg>
                                );
                            })()}
                        </div>

                        <div className="weight-card-footer">
                            <button className="weight-history-link" onClick={() => navigate('/calendar')}>
                                <span>View weight history</span>
                                <FontAwesomeIcon icon={faChevronRight} className="footer-arrow-icon" />
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            {/* ── MODALS ── */}
            {calModal && (
                <CaloriesModal
                    foodLog={foodLog}
                    onClose={() => setCalModal(false)}
                    onAddFood={log => {
                        setFoodLog(prev => [...prev, log]);
                        fetchTodayCalories();
                        fetchWeeklyProgress();
                    }}
                />
            )}
            {waterModal && (
                <WaterModal
                    waterMl={waterMl}
                    waterMax={WATER_MAX}
                    onClose={() => setWaterModal(false)}
                    onUpdate={ml => {
                        setWaterMl(ml);
                        fetchWeeklyProgress();
                    }}
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