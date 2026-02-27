import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faCalendarDays,
    faUserGear,
    faUser,
    faChevronLeft,
    faChevronRight,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./calendar.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkoutType = "forta" | "stretching" | "rezistenta" | "cardio";

interface Workout {
    type: WorkoutType;
    label: string;
    from: string;
    to: string;
}

interface DayData {
    calories: number;
    calGoal: number;
    waterMl: number;
    waterGoal: number;
    workouts: Workout[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
    forta: "Forță",
    stretching: "Stretching",
    rezistenta: "Rezistență",
    cardio: "Cardio",
};

function makeDateKey(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Generate mock data for some days of the current month
function generateMockData(): Record<string, DayData> {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const data: Record<string, DayData> = {};

    const samples: DayData[] = [
        {
            calories: 1840, calGoal: 2200, waterMl: 2100, waterGoal: 3000,
            workouts: [
                { type: "forta", label: "Antrenament forță", from: "07:00", to: "08:15" },
                { type: "stretching", label: "Stretching dimineață", from: "06:30", to: "06:55" },
            ],
        },
        {
            calories: 2350, calGoal: 2200, waterMl: 2800, waterGoal: 3000,
            workouts: [
                { type: "cardio", label: "Alergare", from: "06:00", to: "06:45" },
            ],
        },
        {
            calories: 1650, calGoal: 2200, waterMl: 1500, waterGoal: 3000,
            workouts: [],
        },
        {
            calories: 2000, calGoal: 2200, waterMl: 2500, waterGoal: 3000,
            workouts: [
                { type: "rezistenta", label: "Ciclu rezistență", from: "18:00", to: "19:10" },
                { type: "stretching", label: "Yoga seară", from: "20:00", to: "20:30" },
            ],
        },
        {
            calories: 1920, calGoal: 2200, waterMl: 3000, waterGoal: 3000,
            workouts: [
                { type: "forta", label: "Upper body", from: "09:00", to: "10:20" },
            ],
        },
        {
            calories: 2200, calGoal: 2200, waterMl: 2200, waterGoal: 3000,
            workouts: [
                { type: "cardio", label: "Ciclism", from: "07:30", to: "08:30" },
                { type: "forta", label: "Picioare", from: "17:00", to: "18:00" },
            ],
        },
    ];

    // Spread the samples across random days in the past
    const today = now.getDate();
    const usedDays = new Set<number>();
    samples.forEach((sample, i) => {
        let d = Math.max(1, today - i * 3 - Math.floor(Math.random() * 2));
        while (usedDays.has(d) && d > 1) d--;
        usedDays.add(d);
        data[makeDateKey(y, m, d)] = sample;
    });

    return data;
}

const MOCK_DATA = generateMockData();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTH_NAMES_RO = [
    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie",
];

const WEEKDAY_ABBR = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

// Returns 0=Mon...6=Sun
function getFirstWeekday(year: number, month: number) {
    const d = new Date(year, month, 1).getDay(); // 0=Sun
    return (d + 6) % 7; // convert to Mon-based
}

function formatDuration(from: string, to: string) {
    const [fh, fm] = from.split(":").map(Number);
    const [th, tm] = to.split(":").map(Number);
    const mins = (th * 60 + tm) - (fh * 60 + fm);
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? mins % 60 + "min" : ""}`.trim();
}

const username = "Ion Popescu";
const initials = username.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

// ─── Day Detail Modal ─────────────────────────────────────────────────────────

interface DayModalProps {
    date: Date;
    data: DayData | null;
    onClose: () => void;
}

const DayModal: React.FC<DayModalProps> = ({ date, data, onClose }) => {
    const dateStr = date.toLocaleDateString("ro-RO", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
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
                            <div>Nu există date înregistrate pentru această zi.</div>
                        </div>
                    ) : (
                        <>
                            {/* Calories */}
                            <div className="modal-section">
                                <div className="modal-section-title">
                                    <span className="section-icon">🔥</span>
                                    Calorii consumate
                                </div>
                                <div className="modal-cal-row">
                                    <span className="modal-cal-num">{data.calories.toLocaleString("ro-RO")}</span>
                                    <span className="modal-cal-unit">kcal</span>
                                </div>
                                <div className="modal-cal-goal">
                                    Obiectiv: <strong>{data.calGoal.toLocaleString("ro-RO")} kcal</strong>
                                    &nbsp;({Math.round((data.calories / data.calGoal) * 100)}% atins)
                                </div>
                                <div className="modal-prog-bar">
                                    <div
                                        className="modal-prog-fill"
                                        style={{ width: `${Math.min((data.calories / data.calGoal) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Water */}
                            <div className="modal-section modal-water-bg">
                                <div className="modal-section-title">
                                    <span className="section-icon">💧</span>
                                    Apă băută
                                </div>
                                <div className="modal-water-row">
                                    <span className="modal-water-num">{data.waterMl.toLocaleString("ro-RO")}</span>
                                    <span className="modal-cal-unit">ml</span>
                                </div>
                                <div className="modal-cal-goal">
                                    Obiectiv: <strong>{data.waterGoal.toLocaleString("ro-RO")} ml</strong>
                                    &nbsp;({Math.round((data.waterMl / data.waterGoal) * 100)}% atins)
                                </div>
                                <div className="modal-prog-bar">
                                    <div
                                        className="modal-prog-fill water-fill"
                                        style={{ width: `${Math.min((data.waterMl / data.waterGoal) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Workouts */}
                            <div className="modal-section">
                                <div className="modal-section-title">
                                    <span className="section-icon">🏋️</span>
                                    Antrenamente ({data.workouts.length})
                                </div>
                                {data.workouts.length === 0 ? (
                                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                                        Niciun antrenament înregistrat.
                                    </div>
                                ) : (
                                    <div className="workout-list">
                                        {data.workouts.map((w, i) => (
                                            <div className="workout-item" key={i}>
                                                <span className={`workout-type-badge ${w.type}`}>
                                                    {WORKOUT_TYPE_LABELS[w.type]}
                                                </span>
                                                <span style={{ fontSize: "13px", color: "var(--text-primary)", flex: 1 }}>
                                                    {w.label}
                                                </span>
                                                <span className="workout-time">{w.from} – {w.to}</span>
                                                <span className="workout-duration">({formatDuration(w.from, w.to)})</span>
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

interface CalendarPageProps {
    onProfile?: () => void;
    onSettings?: () => void;
    onDashboard?: () => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ onProfile, onSettings, onDashboard }) => {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const firstWeekday = getFirstWeekday(year, month);
    const daysInMonth = getDaysInMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    // Build cells
    const cells: Array<{ day: number; currentMonth: boolean }> = [];

    // Previous month tail
    for (let i = firstWeekday - 1; i >= 0; i--) {
        cells.push({ day: daysInPrevMonth - i, currentMonth: false });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, currentMonth: true });
    }
    // Next month head
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
        for (let d = 1; d <= remaining; d++) {
            cells.push({ day: d, currentMonth: false });
        }
    }

    const goBack = () => {
        if (month === 0) { setYear(y => y - 1); setMonth(11); }
        else setMonth(m => m - 1);
    };
    const goForward = () => {
        if (month === 11) { setYear(y => y + 1); setMonth(0); }
        else setMonth(m => m + 1);
    };
    // const goToday = () => { setYear(now.getFullYear()); setMonth(now.getMonth()); };

    const handleDayClick = (day: number, currentMonth: boolean) => {
        if (!currentMonth) return;
        setSelectedDate(new Date(year, month, day));
    };

    const isToday = (day: number, currentMonth: boolean) => {
        return currentMonth &&
            day === now.getDate() &&
            month === now.getMonth() &&
            year === now.getFullYear();
    };

    const getDayData = (day: number): DayData | undefined => {
        return MOCK_DATA[makeDateKey(year, month, day)];
    };

    const dateStr = new Date().toLocaleDateString("ro-RO", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    return (
        <div className="cal-root">
            {/* SIDEBAR */}
            <aside className="cal-sidebar">
                <div className="cal-logo" />
                <nav className="cal-nav">
                    <button className="cal-nav-btn" onClick={onDashboard} title="Acasă">
                        <FontAwesomeIcon icon={faHouse} />
                    </button>
                    <button className="cal-nav-btn active" title="Calendar">
                        <FontAwesomeIcon icon={faCalendarDays} />
                    </button>
                    <button className="cal-nav-btn" onClick={onProfile} title="Profil">
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                    <button className="cal-nav-btn" onClick={onSettings} title="Setări">
                        <FontAwesomeIcon icon={faUserGear} />
                    </button>
                </nav>
                <div className="cal-sidebar-bottom">
                    <button className="cal-avatar" onClick={onProfile}>{initials}</button>
                </div>
            </aside>

            {/* MAIN */}
            <main className="cal-main">
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
                        {MONTH_NAMES_RO[month]} {year}
                    </div>
                    <button className="cal-nav-arrow" onClick={goForward} type="button">
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>

                {/* Calendar grid */}
                <div className="cal-grid-wrapper">
                    {/* Weekday headers */}
                    <div className="cal-weekdays">
                        {WEEKDAY_ABBR.map(d => (
                            <div className="cal-weekday" key={d}>{d}</div>
                        ))}
                    </div>

                    {/* Day cells */}
                    <div className="cal-days">
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
                                        data ? "has-data" : "",
                                    ].filter(Boolean).join(" ")}
                                    onClick={() => handleDayClick(cell.day, cell.currentMonth)}
                                >
                                    <div className="cal-day-num">{cell.day}</div>
                                    {data && (
                                        <div className="cal-day-indicators">
                                            <div className="cal-day-pill cal">
                                                🔥 {data.calories.toLocaleString("ro-RO")} kcal
                                            </div>
                                            <div className="cal-day-pill water">
                                                💧 {(data.waterMl / 1000).toFixed(1)} L
                                            </div>
                                            {data.workouts.length > 0 && (
                                                <div className="cal-day-pill workout">
                                                    🏋️ {data.workouts.length} antren.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* DAY MODAL */}
            {selectedDate && (
                <DayModal
                    date={selectedDate}
                    data={MOCK_DATA[makeDateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())] ?? null}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </div>
    );
};

export default CalendarPage;