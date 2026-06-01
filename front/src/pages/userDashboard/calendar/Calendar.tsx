import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDumbbell,
    faHeartPulse,
    faPersonWalking,
    faHouse,
    faCalendarDays,
    faUserGear,
    faUser,
    faChevronLeft,
    faChevronRight,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Calendar.css";
import "../UserDashboard.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkoutType = "Strength" | "Cardio" | "Mobility";

interface Workout {
    type: WorkoutType;
    label: string;
    duration: number;
}

interface DayData {
    calories: number;
    calGoal: number;
    waterMl: number;
    waterGoal: number;
    workouts: Workout[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
    Strength: "Strength",
    Cardio: "Cardio",
    Mobility: "Mobility",
};

const WORKOUT_COLORS: Record<WorkoutType, string> = {
    Strength: "#dc2626",
    Cardio: "#059669",
    Mobility: "#9333ea",
};

const WORKOUT_TYPE_ICONS: Record<WorkoutType, any> = {
    Strength: faDumbbell,
    Cardio: faHeartPulse,
    Mobility: faPersonWalking,
};

const MONTH_NAMES_EN = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const WEEKDAY_ABBR = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];



// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeDateKey(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

// Monday-based: 0=Mon, 6=Sun
function getFirstWeekday(year: number, month: number) {
    const d = new Date(year, month, 1).getDay(); // 0=Sun
    return (d + 6) % 7;
}


// ─── SVG Ring ─────────────────────────────────────────────────────────────────

const Ring = ({ pct, color, size = 44 }: { pct: number; color: string; size?: number }) => {
    const r = (size - 8) / 2;
    const circ = 2 * Math.PI * r;
    const dash = circ * Math.min(pct, 1);
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke={color} strokeWidth="5"
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: "stroke-dasharray 0.5s ease" }}
            />
        </svg>
    );
};

// ─── Day Detail Modal ─────────────────────────────────────────────────────────

interface DayModalProps {
    date: Date;
    data: DayData | null;
    onClose: () => void;
}

const DayModal: React.FC<DayModalProps> = ({ date, data, onClose }) => {
    const dateStr = date.toLocaleDateString("en-US", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    return (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-card">
                <div className="modal-header">
                    <div className="modal-date">{dateStr}</div>
                    <button className="modal-close" onClick={onClose} type="button">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className="modal-body">
                    {!data ? (
                        <div className="modal-empty">
                            <div className="modal-empty-icon">📋</div>
                            <div>No data recorded for this day.</div>
                        </div>
                    ) : (
                        <>
                            {/* Calories */}
                            <div className="modal-section">
                                <div className="modal-section-title">
                                    <span className="section-icon">🔥</span>
                                    Calories consumed
                                </div>
                                <div className="modal-cal-row">
                                    <span className="modal-cal-num">{data.calories.toLocaleString("en-US")}</span>
                                    <span className="modal-cal-unit">kcal</span>
                                </div>
                                <div className="modal-cal-goal">
                                    Goal: <strong>{data.calGoal.toLocaleString("en-US")} kcal</strong>
                                    &nbsp;({Math.round((data.calories / data.calGoal) * 100)}% reached)
                                </div>
                                <div className="modal-prog-bar">
                                    <div className="modal-prog-fill"
                                        style={{ width: `${Math.min((data.calories / data.calGoal) * 100, 100)}%` }} />
                                </div>
                            </div>

                            {/* Water */}
                            <div className="modal-section modal-water-bg">
                                <div className="modal-section-title">
                                    <span className="section-icon">💧</span>
                                    Water intake
                                </div>
                                <div className="modal-water-row">
                                    <span className="modal-water-num">{data.waterMl.toLocaleString("en-US")}</span>
                                    <span className="modal-cal-unit">ml</span>
                                </div>
                                <div className="modal-cal-goal">
                                    Goal: <strong>{data.waterGoal.toLocaleString("en-US")} ml</strong>
                                    &nbsp;({Math.round((data.waterMl / data.waterGoal) * 100)}% reached)
                                </div>
                                <div className="modal-prog-bar">
                                    <div className="modal-prog-fill water-fill"
                                        style={{ width: `${Math.min((data.waterMl / data.waterGoal) * 100, 100)}%` }} />
                                </div>
                            </div>

                            {/* Workouts */}
                            <div className="modal-section">
                                <div className="modal-section-title">
                                    <span className="section-icon">🏋️</span>
                                    Workouts ({data.workouts.length})
                                </div>
                                {data.workouts.length === 0 ? (
                                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                                        No workouts recorded.
                                    </div>
                                ) : (
                                    <div className="workout-list">
                                        {data.workouts.map((w, i) => (
                                            <div className="workout-item" key={i}>

                                                <div
                                                    style={{
                                                        width: "32px",
                                                        height: "32px",
                                                        borderRadius: "10px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        background: `${WORKOUT_COLORS[w.type]}15`,
                                                        color: WORKOUT_COLORS[w.type],
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={WORKOUT_TYPE_ICONS[w.type]}
                                                    />
                                                </div>

                                                <div style={{ flex: 1 }}>
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            fontWeight: 600,
                                                            color: "var(--text-primary)"
                                                        }}
                                                    >
                                                        {w.label}
                                                    </div>

                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "var(--text-muted)",
                                                            marginTop: "2px"
                                                        }}
                                                    >
                                                        {WORKOUT_TYPE_LABELS[w.type]} · {w.duration} min
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Calendar Page ────────────────────────────────────────────────────────────

const CalendarPage: React.FC = () => {
    const navigate = useNavigate();
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());
    const [calendarData, setCalendarData] = useState<Record<string, DayData>>({});
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedDayData, setSelectedDayData] = useState<DayData | null>(null);
    const [user, setUser] = useState<any>(null);

    const username = user?.name || "User";
    const initials = username
        .split(" ")
        .filter(Boolean)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const response = await fetch("http://localhost:5004/api/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const result = await response.json();
                    const userData = (result.isSuccess && result.data) ? result.data : result;
                    setUser(userData);
                }
            } catch (err) {
                console.error("Error fetching user in Calendar:", err);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {

        const fetchMonth = async () => {
            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:5004/api/calendar/month?year=${year}&month=${month + 1}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch calendar");
                }

                const data = await response.json();

                const transformed: Record<string, DayData> = {};

                Object.entries(data).forEach(([key, value]: any) => {

                    transformed[key] = {
                        calories: value.calories,
                        calGoal: 2200,

                        waterMl: value.waterMl,
                        waterGoal: 3000,

                        workouts: new Array(value.workoutsCount).fill({})
                    };
                });

                setCalendarData(transformed);

            } catch (err) {
                console.error(err);
            }
        };

        fetchMonth();

    }, [year, month]);

    // ── Build cells ──
    const firstWeekday = getFirstWeekday(year, month);
    const daysInMonth = getDaysInMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month === 0 ? 11 : month - 1);

    const cells: Array<{ day: number; currentMonth: boolean }> = [];

    for (let i = firstWeekday - 1; i >= 0; i--)
        cells.push({ day: daysInPrevMonth - i, currentMonth: false });

    for (let d = 1; d <= daysInMonth; d++)
        cells.push({ day: d, currentMonth: true });

    const remainder = cells.length % 7;
    if (remainder !== 0) {
        for (let d = 1; d <= (7 - remainder); d++)
            cells.push({ day: d, currentMonth: false });
    }

    // Number of rows = cells.length / 7 (always exact now)
    const numRows = cells.length / 7;
    const rowsClass = `rows-${numRows}`;

    // ── Nav ──
    const goBack = () => {
        if (month === 0) { setYear(y => y - 1); setMonth(11); }
        else setMonth(m => m - 1);
    };
    const goForward = () => {
        if (month === 11) { setYear(y => y + 1); setMonth(0); }
        else setMonth(m => m + 1);
    };

    const isToday = (day: number, current: boolean) =>
        current && day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

    const getDayData = (day: number): DayData | undefined =>
        calendarData[makeDateKey(year, month, day)];

    // ── Right panel stats derived from mock data ──
    const allEntries = Object.values(calendarData);
    const avgCal = Math.round(allEntries.reduce((s, d) => s + d.calories, 0) / allEntries.length);
    const avgWater = Math.round(allEntries.reduce((s, d) => s + d.waterMl, 0) / allEntries.length);
    const totalWorkouts = allEntries.reduce((s, d) => s + d.workouts.length, 0);
    const daysWithGoal = allEntries.filter(d => d.calories >= d.calGoal * 0.9).length;

    // Flatten recent workouts for right panel
    const recentWorkouts: Array<{ workout: Workout; date: string }> = [];
    Object.entries(calendarData)
        .sort(([a], [b]) => b.localeCompare(a))
        .forEach(([key, d]) => {
            d.workouts.forEach(w => {
                if (recentWorkouts.length < 4)
                    recentWorkouts.push({ workout: w, date: key });
            });
        });

    // Streak grid: last 28 days
    const streakCells: Array<"done" | "missed" | "active"> = [];
    for (let i = 27; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = makeDateKey(d.getFullYear(), d.getMonth(), d.getDate());
        if (i === 0) streakCells.push("active");
        else streakCells.push(calendarData[key] ? "done" : "missed");
    }

    const calPct = avgCal / 2200;
    const waterPct = avgWater / 3000;

    const dateStr = now.toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    return (
        <div className="db-root">

            {/* ── SIDEBAR ── */}
            <aside className="db-sidebar">
                <div className="db-logo-wrapper">
                    <img src="/OmniTrackLogo.png" alt="OmniTrack Logo" className="db-logo-img" />
                    <span className="db-logo-text">OmniTrack</span>
                </div>

                <nav className="db-nav-links">
                    <button className="db-nav-item" onClick={() => navigate('/dashboard')}>
                        <FontAwesomeIcon icon={faHouse} className="nav-item-icon" />
                        <span>Dashboard</span>
                    </button>
                    <button className="db-nav-item active" onClick={() => navigate('/calendar')}>
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

            {/* ── CENTER ── */}
            <main className="cal-center">

                {/* Header */}
                <div className="cal-header">
                    <div>
                        <h1>Calendar</h1>
                        <p>{dateStr}</p>
                    </div>
                </div>

                {/* Month nav */}
                <div className="cal-month-nav">
                    <button className="cal-nav-arrow" onClick={goBack} type="button">
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <div className="cal-month-title">
                        {MONTH_NAMES_EN[month]} {year}
                    </div>
                    <button className="cal-nav-arrow" onClick={goForward} type="button">
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>

                {/* Calendar grid */}
                <div className="cal-grid-card">
                    <div className="cal-weekdays">
                        {WEEKDAY_ABBR.map(d => (
                            <div className="cal-weekday" key={d}>{d}</div>
                        ))}
                    </div>
                    <div className={`cal-days ${rowsClass}`}>
                        {cells.map((cell, idx) => {
                            const data = cell.currentMonth ? getDayData(cell.day) : undefined;
                            const today = isToday(cell.day, cell.currentMonth);
                            return (
                                <div
                                    key={idx}
                                    className={[
                                        "cal-day",
                                        !cell.currentMonth ? "other-month" : "",
                                        today ? "today" : "",
                                    ].filter(Boolean).join(" ")}
                                    onClick={async () => {

                                        if (!cell.currentMonth) return;

                                        const date = new Date(year, month, cell.day);

                                        setSelectedDate(date);

                                        try {

                                            const token = localStorage.getItem("token");

                                            const formatted =
                                                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

                                            const response = await fetch(
                                                `http://localhost:5004/api/calendar/day/${formatted}`,
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${token}`
                                                    }
                                                }
                                            );

                                            if (!response.ok) {
                                                throw new Error("Failed to fetch day data");
                                            }

                                            const data = await response.json();

                                            setSelectedDayData(data);

                                        } catch (err) {
                                            console.error(err);
                                        }
                                    }}
                                >
                                    <div className="cal-day-num">{cell.day}</div>
                                    {data && (
                                        <div className="cal-day-indicators">

                                            {data.calories > 0 && (
                                                <div className="cal-day-pill cal">
                                                    🔥 {data.calories.toLocaleString("en-US")} kcal
                                                </div>
                                            )}

                                            {data.waterMl > 0 && (
                                                <div className="cal-day-pill water">
                                                    💧 {(data.waterMl / 1000).toFixed(1)} L
                                                </div>
                                            )}

                                            {data.workouts.length > 0 && (
                                                <div className="cal-day-pill workout">
                                                    🏋️ {data.workouts.length} workouts
                                                </div>
                                            )}

                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom stats row */}
                <div className="cal-stats-row">
                    <div className="cal-stat-card">
                        <div className="cal-stat-lbl">Avg calories / day</div>
                        <div className="cal-stat-num">{avgCal.toLocaleString("en-US")}<em>kcal</em></div>
                        <div className="cal-stat-desc">{daysWithGoal} goal days reached</div>
                    </div>
                    <div className="cal-stat-card">
                        <div className="cal-stat-lbl">Avg water / day</div>
                        <div className="cal-stat-num">{(avgWater / 1000).toFixed(1)}<em>L</em></div>
                        <div className="cal-stat-desc">out of 3 L daily goal</div>
                    </div>
                    <div className="cal-stat-card">
                        <div className="cal-stat-lbl">Monthly workouts</div>
                        <div className="cal-stat-num">{totalWorkouts}<em>total</em></div>
                        <div className="cal-stat-desc">{allEntries.length} active days recorded</div>
                    </div>
                </div>

            </main>

            {/* ── DAY MODAL ── */}
            {selectedDate && (
                <DayModal
                    date={selectedDate}
                    data={selectedDayData}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </div>
    );
};

export default CalendarPage;