import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faCalendarDays,
    faUserGear,
    faBell,
    faUser,
    faPlus,
    faDroplet,
    faFire,
    faDumbbell,
    faPencil,
    faArrowDown,
    faTrophy,
    faWeightScale,
    faQuestion,
    faChevronRight,
    faMoon,
    faSun

} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import WeightHistoryModal from "./modals/WeightHistoryModal";
import CaloriesModal from "./modals/CaloriesModal";
import WaterModal from "./modals/WaterModal";
import WorkoutsModal from "./modals/WorkoutsModal";
import { FoodLog, WorkoutLog, WorkoutType } from "./modals/types";

// ─── Chart Data ───────────────────────────────────────────────────────────────

// ─── Mock Food Data ───────────────────────────────────────────────────────────
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

// ─── Mock Exercise Data ───────────────────────────────────────────────────────

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

// --- Dashboard ----------------------------------------------------------------
const UserDashboard: React.FC = () => {
    const navigate = useNavigate();

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    const toggleTheme = () => {
        const newTheme = !isDarkMode ? 'dark' : 'light';
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    };

    const [user, setUser] = useState<any>(null);

    const [waterMl, setWaterMl] = useState(0);
    const [todayCalories, setTodayCalories] = useState(0);
    const [weight, setWeight] = useState(72);
    const token = localStorage.getItem("token") ?? "";

    // Real weight history from API
    interface WeightEntry { id: number; weight: number; loggedAt: string; }
    const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
    const [showWeightHistory, setShowWeightHistory] = useState(false);

    const fetchWeightHistory = async () => {
        try {
            const res = await fetch("http://localhost:5004/api/WeightLog/history?limit=7", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data: WeightEntry[] = await res.json();
                setWeightEntries(data);
            }
        } catch (e) { console.error(e); }
    };

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
            const response = await fetch("http://localhost:5004/api/WeightLog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ weight: val, loggedAt: new Date().toISOString() })
            });

            if (response.ok) {
                setWeight(val);
                setIsEditingWeight(false);
                await fetchWeightHistory();
            } else {
                alert("Could not update weight.");
            }
        } catch (err) {
            console.error(err);
            alert("Network error while saving weight.");
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
                            difficulty: we.difficulty || "Beginner"
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

    const fetchTodayFoodLogs = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5004/api/FoodLog/today/details", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const mapped: FoodLog[] = data.map((d: any) => ({
                    id: d.id,
                    food: {
                        id: d.foodId,
                        name: d.foodName,
                        calories: d.caloriesPer100g,
                        protein: d.proteinPer100g,
                        carbs: d.carbsPer100g,
                        fat: d.fatPer100g,
                        fiber: d.fiberPer100g || 0,
                        vitaminC: d.vitaminCPer100g || 0,
                        unit: "100g"
                    },
                    mealTime: d.mealTime || "Snack",
                    grams: d.quantityGrams
                }));

                setFoodLog(mapped);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleResetWater = async () => {
        try {
            const token = localStorage.getItem("token");
            await fetch("http://localhost:5004/api/WaterLog/today/reset", {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchWaterToday();
            fetchWeeklyProgress();
        } catch (err) {
            console.error(err);
        }
    };

    const handleResetFood = async () => {
        try {
            const token = localStorage.getItem("token");
            await fetch("http://localhost:5004/api/FoodLog/today/reset", {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTodayFoodLogs();
            fetchTodayCalories();
            fetchWeeklyProgress();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteFood = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:5004/api/FoodLog/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTodayFoodLogs();
            fetchTodayCalories();
            fetchWeeklyProgress();
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

                if (userData.weight) {
                    setWeight(userData.weight);
                }

            } catch (err) {
                console.error(err);
                navigate("/login");
            }
        };

        fetchUser();
        fetchWaterToday();
        fetchTodayCalories();
        fetchTodayFoodLogs();
        fetchWorkouts();
        fetchWeeklyProgress();
        fetchWeightHistory();

    }, []);

    const WATER_MAX = 3000;
    const CAL_GOAL = 2200;
    const todayCal = todayCalories;
    const calPct = Math.round((todayCal / CAL_GOAL) * 100);
    const waterPct = waterMl / WATER_MAX;

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

    // Weight history from real API entries (last 7 for sparkline)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sparkEntries = weightEntries.slice(-7);
    const weightHistory: number[] = sparkEntries.length > 0
        ? sparkEntries.map(e => e.weight)
        : [weight];
    const weightLabels: string[] = sparkEntries.length > 0
        ? sparkEntries.map(e => {
            const d = new Date(e.loggedAt);
            return `${months[d.getMonth()]} ${d.getDate()}`;
          })
        : ["Today"];

    const yesterdayW = sparkEntries.length >= 2 ? sparkEntries[sparkEntries.length - 2].weight : weight;
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
                        <span>Calendar</span>
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
                        <button
                            className="header-circle-btn theme-toggle-btn"
                            onClick={toggleTheme}
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
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
                            <strong>{Math.round(todayCal).toLocaleString("en-US")}</strong>
                            <span className="value-gray"> / {CAL_GOAL.toLocaleString("en-US")} kcal</span>
                        </div>
                        <div className="card-progress-section">
                            <div className="thick-progress-bar">
                                <div className="progress-fill cal-fill-bg" style={{ width: `${Math.min(calPct, 100)}%` }} />
                            </div>
                            <span className="progress-percent">{calPct}%</span>
                        </div>
                        <div className="card-helper-text">
                            Remaining: {Math.max(0, CAL_GOAL - Math.round(todayCal)).toLocaleString("en-US")} kcal
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

                    {/* CARD 3: Workouts This Week (Simplified) */}
                    <div className="db-grid-card card-workouts" onClick={() => setWorkoutModal(true)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
                        <div className="card-icon-container workout-icon-bg" style={{ width: '60px', height: '60px', fontSize: '24px', marginBottom: '16px' }}>
                            <FontAwesomeIcon icon={faDumbbell} />
                        </div>
                        <span className="card-title" style={{ fontSize: '18px', fontWeight: '800' }}>Log Today's Workout</span>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '600' }}>Click here to add a new session</span>
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
                            {weightHistory.length === 0 ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>No weight data yet</div>
                            ) : (() => {
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
                            <button className="weight-history-link" onClick={() => setShowWeightHistory(true)}>
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
                    onAddFood={() => {
                        fetchTodayFoodLogs();
                        fetchTodayCalories();
                        fetchWeeklyProgress();
                    }}
                    onResetFood={handleResetFood}
                    onDeleteFood={handleDeleteFood}
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
                    onResetWater={handleResetWater}
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
            {showWeightHistory && (
                <WeightHistoryModal
                    token={token}
                    isDark={isDarkMode}
                    currentWeight={weight}
                    onClose={() => setShowWeightHistory(false)}
                    onWeightLogged={newWeightValue => {
                        setWeight(newWeightValue);
                        fetchWeightHistory();
                    }}
                />
            )}

        </div>
    );
};

export default UserDashboard;