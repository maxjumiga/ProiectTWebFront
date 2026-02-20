import React, { useState } from "react";
import "./dashboard.css";

// ─── Icons ───────────────────────────────────────────────────────────────────
const HomeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
    </svg>
);
const ChartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 4-6"/>
    </svg>
);
const CalendarIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
);
const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
);
const BellIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
);
const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
);
const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────
const chartDays = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];
const calData   = [1650, 2100, 1800, 2350, 1950, 2200, 1420];
const waterData = [1800, 2400, 2000, 2800, 2200, 2600, 1600];

// ─── Sparkline ───────────────────────────────────────────────────────────────
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
    const mn = Math.min(...data), mx = Math.max(...data);
    const norm = (v: number) => (v - mn) / (mx - mn || 1);
    const w = 100, h = 44, p = 3;
    const pts = data.map((v, i) => ({
        x: p + (i / (data.length - 1)) * (w - p * 2),
        y: h - p - norm(v) * (h - p * 2)
    }));
    const line = pts.map(pt => `${pt.x},${pt.y}`).join(" ");
    const area = `${pts[0].x},${h} ${line} ${pts[pts.length-1].x},${h}`;
    return (
        <svg className="sparkline-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
                    <stop offset="100%" stopColor={color} stopOpacity="0"/>
                </linearGradient>
            </defs>
            <polygon points={area} fill="url(#sg)"/>
            <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};

// ─── Bar Chart ────────────────────────────────────────────────────────────────
const BarChart = () => {
    const svgW = 560, svgH = 150, pL = 10, pR = 10, pT = 8, pB = 26;
    const cW = svgW - pL - pR, cH = svgH - pT - pB;
    const n = chartDays.length;
    const gW = cW / n;
    const bW = gW * 0.26;
    const maxC = Math.max(...calData), maxW = Math.max(...waterData);

    return (
        <svg className="chart-svg" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.55"/>
                </linearGradient>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60b8f5" stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="#60b8f5" stopOpacity="0.55"/>
                </linearGradient>
            </defs>
            {[0, 0.5, 1].map((v, i) => (
                <line key={i} x1={pL} y1={pT + cH - v * cH} x2={svgW - pR} y2={pT + cH - v * cH}
                      stroke="#e2e5ef" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "3 4"}/>
            ))}
            {chartDays.map((day, i) => {
                const cx = pL + i * gW + gW / 2;
                const cH2 = (calData[i] / maxC) * cH;
                const wH = (waterData[i] / maxW) * cH;
                const gap = bW * 0.4;
                return (
                    <g key={i}>
                        <rect x={cx - gap / 2 - bW} y={pT + cH - cH2} width={bW} height={cH2} fill="url(#cg)" rx={3}/>
                        <rect x={cx + gap / 2} y={pT + cH - wH} width={bW} height={wH} fill="url(#wg)" rx={3}/>
                        <text x={cx} y={svgH - 6} textAnchor="middle" fontSize="10"
                              fontFamily="Space Mono, monospace" fill="#b0b4cc">{day}</text>
                    </g>
                );
            })}
        </svg>
    );
};

// ─── Water Bottle ─────────────────────────────────────────────────────────────
const WaterBottle = ({ percent }: { percent: number }) => {
    const bH = 64, bW = 28, capH = 8, capW = 12;
    const fillH = bH * Math.min(percent, 1);
    const fillY = capH + bH - fillH;
    return (
        <svg className="bottle-svg" viewBox="0 0 42 88" fill="none">
            <defs>
                <clipPath id="bc"><rect x="7" y={capH} width={bW} height={bH} rx="4"/></clipPath>
                <linearGradient id="wf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93c5fd"/>
                    <stop offset="100%" stopColor="#3b82f6"/>
                </linearGradient>
            </defs>
            <rect x={(42 - capW) / 2} y="2" width={capW} height={capH} rx="3" fill="#d1d5ef"/>
            <rect x="7" y={capH} width={bW} height={bH} rx="4" fill="#f0f2f8" stroke="#e2e5ef" strokeWidth="1.5"/>
            <rect x="7" y={fillY} width={bW} height={fillH} fill="url(#wf)" clipPath="url(#bc)"
                  style={{ transition: 'all 0.5s ease' }}/>
            <rect x="11" y={capH + 4} width="3" height={bH - 8} rx="1.5" fill="white" opacity="0.3"/>
            {[0.33, 0.66].map((v, i) => (
                <line key={i} x1="7" y1={capH + bH - bH * v} x2="15" y2={capH + bH - bH * v}
                      stroke="#c7d2fe" strokeWidth="1" strokeDasharray="2 2"/>
            ))}
        </svg>
    );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
interface DashboardProps {
    username?: string;
    onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ username = "Ion", onLogout }) => {
    const [waterMl, setWaterMl] = useState(1200);
    const waterMax = 3000;
    const waterPct = waterMl / waterMax;

    const todayCal = calData[calData.length - 1];
    const calGoal = 2200;
    const calPct = Math.round((todayCal / calGoal) * 100);

    const today = new Date();
    const dateStr = today.toLocaleDateString("ro-RO", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="wh-badge">W&H</div>
                <nav className="sidebar-nav">
                    <button className="nav-item active" title="Acasă"><HomeIcon /></button>
                    <button className="nav-item" title="Statistici"><ChartIcon /></button>
                    <button className="nav-item" title="Programări"><CalendarIcon /></button>
                    <button className="nav-item" title="Setări"><SettingsIcon /></button>
                </nav>
                <div className="sidebar-bottom">
                    <button className="nav-item" title="Ieșire" onClick={onLogout}><LogoutIcon /></button>
                    <div className="avatar">{username.charAt(0).toUpperCase()}</div>
                </div>
            </aside>

            {/* Main */}
            <main className="main-content">

                {/* Header */}
                <div className="page-header">
                    <div className="page-header-left">
                        <h1>Bună ziua, {username} 👋</h1>
                        <p>{dateStr}</p>
                    </div>
                    <div className="header-actions">
                        <div className="greeting-badge">Health Overview</div>
                        <button className="icon-btn"><SearchIcon /></button>
                        <button className="icon-btn"><BellIcon /></button>
                    </div>
                </div>

                {/* Stats row */}
                <div className="stats-row">
                    {/* Calories */}
                    <div className="card cal-card">
                        <div className="card-label">Calorii consumate astăzi</div>
                        <div className="cal-top">
                            <div>
                                <div className="cal-value">{todayCal.toLocaleString("ro-RO")}<span>kcal</span></div>
                                <div className="cal-goal">
                                    Obiectiv: <strong>{calGoal.toLocaleString("ro-RO")} kcal</strong> ({calPct}% atins)
                                </div>
                            </div>
                            <div className="cal-badge">{calPct >= 100 ? "✓" : `${calPct}%`}</div>
                        </div>
                        <div className="sparkline-wrap"><Sparkline data={calData} color="#f97316"/></div>
                    </div>

                    {/* Water */}
                    <div className="card water-card">
                        <div className="card-label">Apă băută astăzi</div>
                        <div className="water-inner">
                            <WaterBottle percent={waterPct}/>
                            <div className="water-info">
                                <div className="water-amount">{waterMl.toLocaleString("ro-RO")}<span>ml</span></div>
                                <div className="water-goal-text">din <strong>{waterMax.toLocaleString("ro-RO")} ml</strong> zilnic</div>
                                <div className="water-progress-bar">
                                    <div className="water-progress-fill" style={{ width: `${Math.min(waterPct * 100, 100)}%` }}/>
                                </div>
                                <div className="water-btn-row">
                                    <button className="water-btn" onClick={() => setWaterMl(p => Math.min(p + 250, waterMax))}>+250</button>
                                    <button className="water-btn primary" onClick={() => setWaterMl(p => Math.min(p + 500, waterMax))}>+500</button>
                                    <button className="water-btn" onClick={() => setWaterMl(p => Math.max(p - 250, 0))}>−</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="card chart-card">
                    <div className="chart-header">
                        <span className="chart-title">Evoluție săptămânală</span>
                        <div className="chart-legend">
                            <div className="legend-item"><div className="legend-dot" style={{ background: "#f97316" }}/>Calorii consumate</div>
                            <div className="legend-item"><div className="legend-dot" style={{ background: "#60b8f5" }}/>Apă băută</div>
                        </div>
                    </div>
                    <div className="chart-svg-wrap"><BarChart /></div>
                </div>

                {/* Bottom */}
                <div className="bottom-row">
                    {/* Appointments */}
                    <div className="card">
                        <div className="card-label">Programări viitoare</div>
                        <div className="appt-item">
                            <div className="appt-date-badge">
                                <div className="day">14</div><div className="month">Aug</div>
                            </div>
                            <div className="appt-info">
                                <div className="appt-name">Dr. Ionescu Maria</div>
                                <div className="appt-sub">Nutriționist • 10:00</div>
                            </div>
                        </div>
                        <div className="appt-item">
                            <div className="appt-date-badge" style={{ background: "var(--green)" }}>
                                <div className="day">21</div><div className="month">Aug</div>
                            </div>
                            <div className="appt-info">
                                <div className="appt-name">Dr. Popescu Andrei</div>
                                <div className="appt-sub">Medic de familie • 14:30</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="card">
                        <div className="card-label">Statistici rapide</div>
                        <div className="quick-stats">
                            <div className="qs-item">
                                <div className="qs-left">
                                    <div className="qs-icon" style={{ background: "var(--cal-soft)" }}>🔥</div>
                                    <span className="qs-label">Calorii săptămână</span>
                                </div>
                                <span className="qs-value">13.470</span>
                            </div>
                            <div className="qs-item">
                                <div className="qs-left">
                                    <div className="qs-icon" style={{ background: "var(--water-soft)" }}>💧</div>
                                    <span className="qs-label">Apă săptămână</span>
                                </div>
                                <span className="qs-value">15.4 L</span>
                            </div>
                            <div className="qs-item">
                                <div className="qs-left">
                                    <div className="qs-icon" style={{ background: "var(--green-soft)" }}>🎯</div>
                                    <span className="qs-label">Zile obiectiv atins</span>
                                </div>
                                <span className="qs-value">5 / 7</span>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;