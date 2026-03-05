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

// ─── Constants ────────────────────────────────────────────────────────────────

const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
    forta: "Forță",
    stretching: "Stretching",
    rezistenta: "Rezistență",
    cardio: "Cardio",
};

const WORKOUT_COLORS: Record<WorkoutType, string> = {
    forta: "#dc2626",
    stretching: "#9333ea",
    rezistenta: "#b45309",
    cardio: "#059669",
};

const MONTH_NAMES_RO = [
    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie",
];

const WEEKDAY_ABBR = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];

const username = "Ion Popescu";
const initials = username.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

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

function formatDuration(from: string, to: string) {
    const [fh, fm] = from.split(":").map(Number);
    const [th, tm] = to.split(":").map(Number);
    const mins = (th * 60 + tm) - (fh * 60 + fm);
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

function generateMockData(): Record<string, DayData> {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const data: Record<string, DayData> = {};

    const samples: Array<{ offset: number; data: DayData }> = [
        {
            offset: 0,
            data: {
                calories: 1420, calGoal: 2200, waterMl: 1600, waterGoal: 3000,
                workouts: [{ type: "stretching", label: "Yoga dimineață", from: "07:00", to: "07:40" }],
            },
        },
        {
            offset: 2,
            data: {
                calories: 2100, calGoal: 2200, waterMl: 2400, waterGoal: 3000,
                workouts: [
                    { type: "forta", label: "Upper body", from: "08:00", to: "09:15" },
                    { type: "stretching", label: "Cool-down", from: "09:15", to: "09:35" },
                ],
            },
        },
        {
            offset: 4,
            data: {
                calories: 1800, calGoal: 2200, waterMl: 2000, waterGoal: 3000,
                workouts: [],
            },
        },
        {
            offset: 6,
            data: {
                calories: 2350, calGoal: 2200, waterMl: 2800, waterGoal: 3000,
                workouts: [{ type: "cardio", label: "Alergare în parc", from: "06:15", to: "07:00" }],
            },
        },
        {
            offset: 8,
            data: {
                calories: 1950, calGoal: 2200, waterMl: 2200, waterGoal: 3000,
                workouts: [
                    { type: "rezistenta", label: "Ciclu rezistență", from: "18:00", to: "19:10" },
                    { type: "stretching", label: "Yoga seară", from: "20:00", to: "20:30" },
                ],
            },
        },
        {
            offset: 11,
            data: {
                calories: 2200, calGoal: 2200, waterMl: 3000, waterGoal: 3000,
                workouts: [
                    { type: "forta", label: "Picioare & core", from: "09:00", to: "10:20" },
                    { type: "cardio", label: "Ciclism", from: "17:30", to: "18:15" },
                ],
            },
        },
        {
            offset: 14,
            data: {
                calories: 1650, calGoal: 2200, waterMl: 1500, waterGoal: 3000,
                workouts: [],
            },
        },
        {
            offset: 16,
            data: {
                calories: 2080, calGoal: 2200, waterMl: 2600, waterGoal: 3000,
                workouts: [{ type: "cardio", label: "Înnot", from: "07:00", to: "07:55" }],
            },
        },
    ];

    const today = now.getDate();
    samples.forEach(({ offset, data: d }) => {
        const day = Math.max(1, today - offset);
        if (day >= 1 && day <= getDaysInMonth(y, m)) {
            data[makeDateKey(y, m, day)] = d;
        }
    });

    return data;
}

const MOCK_DATA = generateMockData();

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
    const dateStr = date.toLocaleDateString("ro-RO", {
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
                                    <div className="modal-prog-fill"
                                        style={{ width: `${Math.min((data.calories / data.calGoal) * 100, 100)}%` }} />
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
                                    <div className="modal-prog-fill water-fill"
                                        style={{ width: `${Math.min((data.waterMl / data.waterGoal) * 100, 100)}%` }} />
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
    onHome?: () => void;
    onProfile?: () => void;
    onSettings?: () => void;
    onDashboard?: () => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ onHome, onProfile, onSettings, onDashboard }) => {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
        MOCK_DATA[makeDateKey(year, month, day)];

    // ── Right panel stats derived from mock data ──
    const allEntries = Object.values(MOCK_DATA);
    const avgCal = Math.round(allEntries.reduce((s, d) => s + d.calories, 0) / allEntries.length);
    const avgWater = Math.round(allEntries.reduce((s, d) => s + d.waterMl, 0) / allEntries.length);
    const totalWorkouts = allEntries.reduce((s, d) => s + d.workouts.length, 0);
    const daysWithGoal = allEntries.filter(d => d.calories >= d.calGoal * 0.9).length;

    // Flatten recent workouts for right panel
    const recentWorkouts: Array<{ workout: Workout; date: string }> = [];
    Object.entries(MOCK_DATA)
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
        else streakCells.push(MOCK_DATA[key] ? "done" : "missed");
    }

    const calPct = avgCal / 2200;
    const waterPct = avgWater / 3000;

    const dateStr = now.toLocaleDateString("ro-RO", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    return (
        <div className="cal-root">

            {/* ── SIDEBAR ── */}
            <aside className="cal-sidebar">
                <div className="cal-logo" />
                <nav className="cal-nav">
                    <button className="cal-nav-btn" onClick={onDashboard ?? onHome} title="Acasă">
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
                        {MONTH_NAMES_RO[month]} {year}
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
                                    onClick={() => {
                                        if (cell.currentMonth) setSelectedDate(new Date(year, month, cell.day));
                                    }}
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

                {/* Bottom stats row */}
                <div className="cal-stats-row">
                    <div className="cal-stat-card">
                        <div className="cal-stat-lbl">Medie calorii / zi</div>
                        <div className="cal-stat-num">{avgCal.toLocaleString("ro-RO")}<em>kcal</em></div>
                        <div className="cal-stat-desc">{daysWithGoal} zile cu obiectiv atins</div>
                    </div>
                    <div className="cal-stat-card">
                        <div className="cal-stat-lbl">Medie apă / zi</div>
                        <div className="cal-stat-num">{(avgWater / 1000).toFixed(1)}<em>L</em></div>
                        <div className="cal-stat-desc">din 3 L obiectiv zilnic</div>
                    </div>
                    <div className="cal-stat-card">
                        <div className="cal-stat-lbl">Antrenamente lună</div>
                        <div className="cal-stat-num">{totalWorkouts}<em>total</em></div>
                        <div className="cal-stat-desc">{allEntries.length} zile active înregistrate</div>
                    </div>
                </div>

            </main>

            {/* ── RIGHT DARK PANEL ── */}
            <aside className="cal-right">

                {/* Title */}
                <div>
                    <div className="rp-title">Statistici lunare</div>
                    <div className="rp-sub">Rezumat {MONTH_NAMES_RO[month].toLowerCase()} {year}</div>
                </div>

                {/* Goal rings */}
                <div className="rp-card">
                    <div className="rp-label">Obiective medii</div>
                    <div className="rp-goal-row">
                        <Ring pct={calPct} color="#f97316" size={44} />
                        <div>
                            <div className="rp-goal-info-title">Calorii</div>
                            <div className="rp-goal-info-sub">{Math.round(calPct * 100)}% din obiectiv</div>
                        </div>
                    </div>
                    <div style={{ marginTop: "8px" }} className="rp-goal-row">
                        <Ring pct={waterPct} color="#38bdf8" size={44} />
                        <div>
                            <div className="rp-goal-info-title">Apă</div>
                            <div className="rp-goal-info-sub">{Math.round(waterPct * 100)}% din obiectiv</div>
                        </div>
                    </div>
                </div>

                {/* Summary stats */}
                <div className="rp-card">
                    <div className="rp-label">Săptămâna curentă</div>
                    <div className="rp-stat-row">
                        <div className="rp-stat-left">
                            <div className="rp-stat-ico" style={{ background: "rgba(249,115,22,0.15)" }}>🔥</div>
                            <span className="rp-stat-lbl">Cal. medii</span>
                        </div>
                        <span className="rp-stat-val">{avgCal.toLocaleString("ro-RO")}</span>
                    </div>
                    <div className="rp-stat-row">
                        <div className="rp-stat-left">
                            <div className="rp-stat-ico" style={{ background: "rgba(56,189,248,0.15)" }}>💧</div>
                            <span className="rp-stat-lbl">Apă medie</span>
                        </div>
                        <span className="rp-stat-val">{(avgWater / 1000).toFixed(1)} L</span>
                    </div>
                    <div className="rp-stat-row">
                        <div className="rp-stat-left">
                            <div className="rp-stat-ico" style={{ background: "rgba(16,185,129,0.15)" }}>🏋️</div>
                            <span className="rp-stat-lbl">Antrenamente</span>
                        </div>
                        <span className="rp-stat-val">{totalWorkouts}</span>
                    </div>
                    <div className="rp-stat-row">
                        <div className="rp-stat-left">
                            <div className="rp-stat-ico" style={{ background: "rgba(99,102,241,0.15)" }}>🎯</div>
                            <span className="rp-stat-lbl">Zile obiectiv</span>
                        </div>
                        <span className="rp-stat-val">{daysWithGoal} / {allEntries.length}</span>
                    </div>
                </div>

                {/* Recent workouts */}
                <div className="rp-card">
                    <div className="rp-label">Antrenamente recente</div>
                    {recentWorkouts.length === 0 ? (
                        <div style={{ fontSize: "11px", color: "var(--dark-muted)" }}>Niciun antrenament înregistrat.</div>
                    ) : (
                        recentWorkouts.map(({ workout: w }, i) => (
                            <div className="rp-workout-item" key={i}>
                                <div className="rp-workout-dot" style={{ background: WORKOUT_COLORS[w.type] }} />
                                <span className="rp-workout-name">{w.label}</span>
                                <span className="rp-workout-time">{w.from}–{w.to}</span>
                            </div>
                        ))
                    )}
                </div>

                {/* Activity streak grid — last 28 days */}
                <div className="rp-card">
                    <div className="rp-label">Activitate — ultimele 28 zile</div>
                    <div className="rp-streak-grid">
                        {streakCells.map((s, i) => (
                            <div key={i} className={`rp-streak-cell ${s}`} />
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "9px", color: "var(--dark-muted)", fontFamily: "Space Mono" }}>
                            <div style={{ width: "9px", height: "9px", borderRadius: "3px", background: "rgba(16,185,129,0.3)" }} />
                            Activ
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "9px", color: "var(--dark-muted)", fontFamily: "Space Mono" }}>
                            <div style={{ width: "9px", height: "9px", borderRadius: "3px", background: "rgba(255,255,255,0.05)" }} />
                            Inactiv
                        </div>
                    </div>
                </div>

            </aside>

            {/* ── DAY MODAL ── */}
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