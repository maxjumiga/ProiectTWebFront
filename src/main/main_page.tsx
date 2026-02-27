import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faCalendarDays,
    faUserGear,
    faBell,
    faUser,
    faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import "./main_page.css";

const username = "Ion Popescu";

const initials = username
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ─── Chart Data ───────────────────────────────────────────────────────────────
const DAYS = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];
const CAL_DATA = [1650, 2100, 1800, 2350, 1950, 2200, 1420];
const WAT_DATA = [1800, 2400, 2000, 2800, 2200, 2600, 1600]; // ml

// ─── Sparkline ────────────────────────────────────────────────────────────────
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
    const mn = Math.min(...data), mx = Math.max(...data);
    const n = (v: number) => (v - mn) / (mx - mn || 1);
    const W = 200, H = 46, P = 3;
    const pts = data.map((v, i) => ({
        x: P + (i / (data.length - 1)) * (W - P * 2),
        y: H - P - n(v) * (H - P * 2),
    }));
    const line = pts.map(p => `${p.x},${p.y}`).join(" ");
    const area = `${pts[0].x},${H} ${line} ${pts[pts.length - 1].x},${H}`;
    return (
        <svg className="db-sparkline" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={area} fill="url(#sg)" />
            <polyline points={line} fill="none" stroke={color} strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

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
    const bH = 68, bW = 28, cH = 9, cW = 13, bY = cH;
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
            {/* Cap */}
            <rect x={(42 - cW) / 2} y="2" width={cW} height={cH} rx="3" fill="#cbd5e1" />
            {/* Body */}
            <rect x="7" y={bY} width={bW} height={bH} rx="5"
                fill="#f4f6fb" stroke="#e4e7f0" strokeWidth="1.5" />
            {/* Fill */}
            <rect x="7" y={fY} width={bW} height={fH}
                fill="url(#wf)" clipPath="url(#bc)"
                style={{ transition: "all 0.5s ease" }} />
            {/* Shine */}
            <rect x="11" y={bY + 5} width="3" height={bH - 10} rx="1.5" fill="white" opacity="0.3" />
            {/* Tick marks */}
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
    if (bmi < 18.5) return { label: "Subponderal", bg: "#bfdbfe", color: "#1d4ed8" };
    if (bmi < 25) return { label: "Sănătos", bg: "#bbf7d0", color: "#065f46" };
    if (bmi < 30) return { label: "Supraponderal", bg: "#fed7aa", color: "#9a3412" };
    return { label: "Obez", bg: "#fecdd3", color: "#9f1239" };
};

// position on gradient bar: 15-40 → 0-100%
const bmiBarPos = (bmi: number) => `${Math.min(Math.max((bmi - 15) / 25, 0), 1) * 100}%`;

// ─── Dashboard ────────────────────────────────────────────────────────────────
interface DashboardProps {
    username?: string;
    onProfile?: () => void;
    onSettings?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ username = "Ion", onProfile, onSettings }) => {
    const [waterMl, setWaterMl] = useState(1200);
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(72);

    const WATER_MAX = 3000;
    const CAL_GOAL = 2200;
    const todayCal = CAL_DATA[CAL_DATA.length - 1];
    const calPct = Math.round((todayCal / CAL_GOAL) * 100);
    const waterPct = waterMl / WATER_MAX;

    const bmi = calcBMI(height, weight);
    const status = bmiStatus(bmi);

    const today = new Date();
    const dateStr = today.toLocaleDateString("ro-RO", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    return (
        <div className="db-root">

            {/* ── SIDEBAR ── */}
            <aside className="db-sidebar">
                <div className="db-logo"></div>

                <nav className="db-nav">
                    <button className="db-nav-btn active" title="Acasă">
                        <FontAwesomeIcon icon={faHouse} />
                    </button>
                    <button className="db-nav-btn" title="Calendar">
                        <FontAwesomeIcon icon={faCalendarDays} />
                    </button>
                    <button className="db-nav-btn" onClick={onProfile} title="Profil">
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                    <button className="db-nav-btn" onClick={onSettings} title="Setări">
                        <FontAwesomeIcon icon={faUserGear} />
                    </button>
                </nav>

                <div className="db-sidebar-bottom">
                    <button className="db-avatar" onClick={onProfile}>{initials}</button>
                </div>
            </aside>

            {/* ── CENTER ── */}
            <main className="db-center">

                {/* Header */}
                <div className="db-header">
                    <div>
                        <h1>Bună ziua, {username} 👋</h1>
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

                    {/* Calories */}
                    <div className="db-card">
                        <div className="db-card-lbl">Calorii consumate astăzi</div>
                        <div className="cal-top">
                            <div className="cal-num">{todayCal.toLocaleString("ro-RO")}<em>kcal</em></div>
                            <div className="cal-pill">{calPct}%</div>
                        </div>
                        <div className="cal-sub">
                            Obiectiv: <strong>{CAL_GOAL.toLocaleString("ro-RO")} kcal</strong> ({calPct}% atins)
                        </div>
                        <div className="cal-prog">
                            <div className="cal-prog-fill" style={{ width: `${Math.min(calPct, 100)}%` }} />
                        </div>
                        <Sparkline data={CAL_DATA} color="#f97316" />
                    </div>

                    {/* Water */}
                    <div className="db-card">
                        <div className="db-card-lbl">Apă băută astăzi</div>
                        <div className="water-body">
                            <div className="water-bottle-wrap">
                                <WaterBottle pct={waterPct} />
                            </div>
                            <div className="water-details">
                                <div className="water-num">{waterMl.toLocaleString("ro-RO")}<em>ml</em></div>
                                <div className="water-sub">din <strong>{WATER_MAX.toLocaleString("ro-RO")} ml</strong> zilnic</div>
                                <div className="water-prog">
                                    <div className="water-prog-fill" style={{ width: `${Math.min(waterPct * 100, 100)}%` }} />
                                </div>
                                <div className="water-btns">
                                    <button className="wbtn" onClick={() => setWaterMl(p => Math.min(p + 250, WATER_MAX))}>+250 ml</button>
                                    <button className="wbtn primary" onClick={() => setWaterMl(p => Math.min(p + 500, WATER_MAX))}>+500 ml</button>
                                    <button className="wbtn" onClick={() => setWaterMl(p => Math.max(p - 250, 0))}>−</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="db-card db-chart-card">
                    <div className="chart-hdr">
                        <span className="db-card-lbl">Evoluție săptămânală</span>
                        <div className="chart-legend">
                            <div className="legend-item"><span style={{ background: "#f97316" }} className="legend-dot" />Calorii</div>
                            <div className="legend-item"><span style={{ background: "#38bdf8" }} className="legend-dot" />Apă băută</div>
                        </div>
                    </div>
                    <div className="chart-box"><BarChart /></div>
                </div>

                {/* Bottom row */}
                <div className="db-bottom-row">

                    {/* Appointments */}
                    <div className="db-card">
                        <div className="db-card-lbl">Antrenamentele mele</div>
                        <div className="db-card-sublbl">Ultimul antrenament:</div>
                        <div className="appt-row">

                        </div>
                        <div className="appt-row">

                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="db-card">
                        <div className="db-card-lbl">Statistici rapide</div>
                        <div className="qs-list">
                            <div className="qs-row">
                                <div className="qs-left">
                                    <div className="qs-ico" style={{ background: "var(--cal-soft)" }}>🔥</div>
                                    <span className="qs-lbl">Calorii săptămână</span>
                                </div>
                                <span className="qs-val">13.470</span>
                            </div>
                            <div className="qs-row">
                                <div className="qs-left">
                                    <div className="qs-ico" style={{ background: "var(--water-soft)" }}>💧</div>
                                    <span className="qs-lbl">Apă săptămână</span>
                                </div>
                                <span className="qs-val">15.4 L</span>
                            </div>
                            <div className="qs-row">
                                <div className="qs-left">
                                    <div className="qs-ico" style={{ background: "var(--green-soft)" }}>🎯</div>
                                    <span className="qs-lbl">Zile obiectiv atins</span>
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
                    <div className="bmi-sub">Calculează indicele tău de masă corporală</div>
                </div>

                {/* Sliders */}
                <div className="bmi-slider-card">
                    <div className="sl-row">
                        <div className="sl-hdr">
                            <span className="sl-lbl">Înălțime</span>
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
                            <span className="sl-lbl">Greutate</span>
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

        </div>
    );
};

export default Dashboard;