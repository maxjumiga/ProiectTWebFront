import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faClock,
    faCalendarDays,
    faUser,
    faUserGear,
    faGear,
    faLanguage,
    faRightFromBracket,
    faBell,
    faPalette,
    faGlobe,
    faShield,
    faDatabase,
    faTrash,
    faFloppyDisk,
    faCheck,
    faMoon,
    faSun,
    faEnvelope,
    faLock,
    faDownload,
    faArrowsRotate,
    faBullseye,
    faBolt,
    faChartLine,
    faTextHeight,
    faFont
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

// ─── Toggle component ─────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label className="s-toggle">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="s-toggle-slider" />
    </label>
);

// ─── Types ────────────────────────────────────────────────────────────────────
type NavSection = "notificari" | "aspect" | "limba" | "securitate" | "date" | "cont";



// ─── Accent colors ────────────────────────────────────────────────────────────
const ACCENT_COLORS = [
    { id: "indigo", value: "#6366f1" },
    { id: "violet", value: "#8b5cf6" },
    { id: "sky", value: "#0ea5e9" },
    { id: "emerald", value: "#10b981" },
    { id: "rose", value: "#f43f5e" },
    { id: "amber", value: "#f59e0b" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const username = "Ion Popescu";
    const [activeNav, setActiveNav] = useState<NavSection>("notificari");
    const [saved, setSaved] = useState(false);

    // Notificări
    const [notifEmail, setNotifEmail] = useState(true);
    const [notifPush, setNotifPush] = useState(true);
    const [notifReport, setNotifReport] = useState(false);
    const [notifAppt, setNotifAppt] = useState(true);
    const [notifTips, setNotifTips] = useState(false);

    // Aspect
    const [darkMode, setDarkMode] = useState(false);
    const [accentColor, setAccentColor] = useState("indigo");
    const [fontSize, setFontSize] = useState(14);
    const [compactMode, setCompactMode] = useState(false);
    const [animations, setAnimations] = useState(true);

    // Limbă & regiune
    const [language, setLanguage] = useState("ro");
    const [timezone, setTimezone] = useState("Europe/Bucharest");
    const [units, setUnits] = useState("metric");
    const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

    // Securitate
    const [twoFA, setTwoFA] = useState(false);
    const [loginAlerts, setLoginAlerts] = useState(true);
    const [sessionTimeout, setSessionTimeout] = useState("30");

    // Date & confidențialitate
    const [shareData, setShareData] = useState(false);
    const [analytics, setAnalytics] = useState(true);
    const [autoBackup, setAutoBackup] = useState(true);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const initials = username.charAt(0).toUpperCase();

    // ── Nav items ──
    const navItems: { id: NavSection; label: string; icon: React.ReactNode }[] = [
        { id: "notificari", label: "Notifications", icon: <FontAwesomeIcon icon={faBell} /> },
        { id: "aspect", label: "Appearance & Theme", icon: <FontAwesomeIcon icon={faPalette} /> },
        { id: "limba", label: "Language & Region", icon: <FontAwesomeIcon icon={faGlobe} /> },
        { id: "securitate", label: "Security", icon: <FontAwesomeIcon icon={faShield} /> },
        { id: "date", label: "Data & Privacy", icon: <FontAwesomeIcon icon={faDatabase} /> },
        { id: "cont", label: "Account", icon: <FontAwesomeIcon icon={faUser} /> },
    ];

    return (
        <div className="settings-root">

            {/* ── Sidebar ── */}
            <aside className="db-sidebar">
                <div className="db-logo"></div>
                <nav className="db-nav">
                    <button className="db-nav-btn" onClick={() => navigate('/dashboard')} title="Home"><FontAwesomeIcon icon={faHouse} /></button>
                    <button className="db-nav-btn" onClick={() => navigate('/calendar')} title="Calendar"><FontAwesomeIcon icon={faCalendarDays} /></button>
                    <button className="db-nav-btn" onClick={() => navigate('/profile')} title="Profile"><FontAwesomeIcon icon={faUser} /></button>
                    <button className="db-nav-btn active" onClick={() => navigate('/settings')} title="Settings"><FontAwesomeIcon icon={faUserGear} /></button>
                </nav>
                <div className="db-sidebar-bottom">
                    <button className="db-avatar" onClick={() => navigate('/profile')}>{initials}</button>
                </div>
            </aside>

            {/* ── Settings nav panel ── */}
            <nav className="settings-nav-panel">
                <div className="settings-nav-title">Settings</div>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`snav-btn${activeNav === item.id ? " active" : ""}`}
                        onClick={() => setActiveNav(item.id)}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
                <div className="snav-spacer" />
                <div className="settings-nav-title">System</div>
                <button className="snav-btn danger" onClick={() => {
                    localStorage.removeItem('user');
                    sessionStorage.removeItem('isAuthenticated');
                    navigate('/login');
                }}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Sign out
                </button>
            </nav>

            {/* ── Main content ── */}
            <main className="settings-main">
                <div className="settings-header">
                    <div>
                        <h1>
                            {navItems.find(n => n.id === activeNav)?.label ?? "Settings"}
                        </h1>
                        <p>MANAGE YOUR PREFERENCES</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span className={`saved-indicator${saved ? " visible" : ""}`}>
                            <FontAwesomeIcon icon={faCheck} /> Saved
                        </span>
                        <button className="save-btn" onClick={handleSave}>
                            <FontAwesomeIcon icon={faFloppyDisk} />
                            Save changes
                        </button>
                    </div>
                </div>

                {/* ══ NOTIFICATIONS ══ */}
                {activeNav === "notificari" && (
                    <>
                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faBell} />Notification channels</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><FontAwesomeIcon icon={faEnvelope} /></div>
                                        <div>
                                            <div className="s-lbl">Email notifications</div>
                                            <div className="s-sub">Receive summaries and alerts on your Gmail</div>
                                        </div>
                                    </div>
                                    <Toggle checked={notifEmail} onChange={() => setNotifEmail(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><FontAwesomeIcon icon={faBolt} /></div>
                                        <div>
                                            <div className="s-lbl">Push notifications</div>
                                            <div className="s-sub">Real-time alerts directly in browser</div>
                                        </div>
                                    </div>
                                    <Toggle checked={notifPush} onChange={() => setNotifPush(v => !v)} />
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faBullseye} />What you want to receive</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><FontAwesomeIcon icon={faCalendarDays} /></div>
                                        <div>
                                            <div className="s-lbl">Weekly report</div>
                                            <div className="s-sub">Summary of your progress from the last week</div>
                                        </div>
                                    </div>
                                    <Toggle checked={notifReport} onChange={() => setNotifReport(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico green"><FontAwesomeIcon icon={faBell} /></div>
                                        <div>
                                            <div className="s-lbl">Appointment reminder</div>
                                            <div className="s-sub">Reminder 24h before an appointment</div>
                                        </div>
                                    </div>
                                    <Toggle checked={notifAppt} onChange={() => setNotifAppt(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray"><FontAwesomeIcon icon={faBolt} /></div>
                                        <div>
                                            <div className="s-lbl">Health tips</div>
                                            <div className="s-sub">Daily personalized tips based on your profile</div>
                                        </div>
                                    </div>
                                    <Toggle checked={notifTips} onChange={() => setNotifTips(v => !v)} />
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faEnvelope} />Email frequency</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><FontAwesomeIcon icon={faEnvelope} /></div>
                                        <div>
                                            <div className="s-lbl">Summary frequency</div>
                                            <div className="s-sub">How often you want to receive summary emails</div>
                                        </div>
                                    </div>
                                    <select className="s-select">
                                        <option>Zilnic</option>
                                        <option selected>Weekly</option>
                                        <option>Lunar</option>
                                        <option>Never</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ══ ASPECT ══ */}
                {activeNav === "aspect" && (
                    <>
                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faMoon} />Theme</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray">{darkMode ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}</div>
                                        <div>
                                            <div className="s-lbl">Dark mode</div>
                                            <div className="s-sub">Enable dark theme for night visual comfort</div>
                                        </div>
                                    </div>
                                    <Toggle checked={darkMode} onChange={() => setDarkMode(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><FontAwesomeIcon icon={faBolt} /></div>
                                        <div>
                                            <div className="s-lbl">Interface animations</div>
                                            <div className="s-sub">Transitions and animated effects during navigation</div>
                                        </div>
                                    </div>
                                    <Toggle checked={animations} onChange={() => setAnimations(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><FontAwesomeIcon icon={faGear} /></div>
                                        <div>
                                            <div className="s-lbl">Compact mode</div>
                                            <div className="s-sub">Reduces spacing for more visible content</div>
                                        </div>
                                    </div>
                                    <Toggle checked={compactMode} onChange={() => setCompactMode(v => !v)} />
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faPalette} />Accent color</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico" style={{ background: ACCENT_COLORS.find(c => c.id === accentColor)?.value + "22", color: ACCENT_COLORS.find(c => c.id === accentColor)?.value }}>
                                            <FontAwesomeIcon icon={faPalette} />
                                        </div>
                                        <div>
                                            <div className="s-lbl">Primary color</div>
                                            <div className="s-sub">Affects buttons, links and active elements</div>
                                        </div>
                                    </div>
                                    <div className="accent-colors">
                                        {ACCENT_COLORS.map(c => (
                                            <div
                                                key={c.id}
                                                className={`accent-dot${accentColor === c.id ? " selected" : ""}`}
                                                style={{ background: c.value }}
                                                onClick={() => setAccentColor(c.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faTextHeight} />Text size</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><FontAwesomeIcon icon={faFont} /></div>
                                        <div>
                                            <div className="s-lbl">Font size</div>
                                            <div className="s-sub">Adjust interface text size</div>
                                        </div>
                                    </div>
                                    <div className="s-slider-wrap">
                                        <input
                                            type="range"
                                            className="s-slider"
                                            min={12} max={18} value={fontSize}
                                            onChange={e => setFontSize(Number(e.target.value))}
                                        />
                                        <span className="s-slider-val">{fontSize}px</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ══ LANGUAGE ══ */}
                {activeNav === "limba" && (
                    <>
                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faGlobe} />Language & display</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><FontAwesomeIcon icon={faLanguage} /></div>
                                        <div>
                                            <div className="s-lbl">App language</div>
                                            <div className="s-sub">Interface display language</div>
                                        </div>
                                    </div>
                                    <select className="s-select" value={language} onChange={e => setLanguage(e.target.value)}>
                                        <option value="ro">🇷🇴 Română</option>
                                        <option value="en">🇬🇧 English</option>
                                        <option value="fr">🇫🇷 Français</option>
                                        <option value="de">🇩🇪 Deutsch</option>
                                    </select>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><FontAwesomeIcon icon={faClock} /></div>
                                        <div>
                                            <div className="s-lbl">Timezone</div>
                                            <div className="s-sub">Timezone used for dates and times</div>
                                        </div>
                                    </div>
                                    <select className="s-select" value={timezone} onChange={e => setTimezone(e.target.value)}>
                                        <option value="Europe/Bucharest">Europe/Bucharest</option>
                                        <option value="Europe/London">Europe/London</option>
                                        <option value="Europe/Paris">Europe/Paris</option>
                                        <option value="America/New_York">America/New York</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faBullseye} />Units & format</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico green"><FontAwesomeIcon icon={faBullseye} /></div>
                                        <div>
                                            <div className="s-lbl">Units system</div>
                                            <div className="s-sub">Metric (kg, cm) or Imperial (lbs, ft)</div>
                                        </div>
                                    </div>
                                    <select className="s-select" value={units} onChange={e => setUnits(e.target.value)}>
                                        <option value="metric">Metric (kg, cm)</option>
                                        <option value="imperial">Imperial (lbs, ft)</option>
                                    </select>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><FontAwesomeIcon icon={faGlobe} /></div>
                                        <div>
                                            <div className="s-lbl">Date format</div>
                                            <div className="s-sub">The way calendar dates are displayed</div>
                                        </div>
                                    </div>
                                    <select className="s-select" value={dateFormat} onChange={e => setDateFormat(e.target.value)}>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ══ SECURITATE ══ */}
                {activeNav === "securitate" && (
                    <>
                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faShield} />Authentication</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className={`s-ico ${twoFA ? "green" : "red"}`}><FontAwesomeIcon icon={faShield} /></div>
                                        <div>
                                            <div className="s-lbl">Two-factor authentication (2FA)</div>
                                            <div className="s-sub">{twoFA ? "Enabled — your account is extra protected" : "Disabled — we recommend enabling 2FA"}</div>
                                        </div>
                                    </div>
                                    <Toggle checked={twoFA} onChange={() => setTwoFA(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><FontAwesomeIcon icon={faBell} /></div>
                                        <div>
                                            <div className="s-lbl">Login alerts</div>
                                            <div className="s-sub">Receive email for every new detected login</div>
                                        </div>
                                    </div>
                                    <Toggle checked={loginAlerts} onChange={() => setLoginAlerts(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><FontAwesomeIcon icon={faLock} /></div>
                                        <div>
                                            <div className="s-lbl">Session timeout</div>
                                            <div className="s-sub">Automatic sign out after inactivity</div>
                                        </div>
                                    </div>
                                    <select className="s-select" value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}>
                                        <option value="15">15 minutes</option>
                                        <option value="30">30 minutes</option>
                                        <option value="60">1 hour</option>
                                        <option value="0">Never</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faLock} />Password & access</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><FontAwesomeIcon icon={faLock} /></div>
                                        <div>
                                            <div className="s-lbl">Change password</div>
                                            <div className="s-sub">Last change: 3 months ago</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn"><FontAwesomeIcon icon={faLock} />Change</button>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray"><FontAwesomeIcon icon={faDatabase} /></div>
                                        <div>
                                            <div className="s-lbl">Active sessions</div>
                                            <div className="s-sub">2 devices currently connected</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn danger"><FontAwesomeIcon icon={faRightFromBracket} />Sign out all</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ══ DATA & PRIVACY ══ */}
                {activeNav === "date" && (
                    <>
                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faDatabase} />Storage & backup</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico green"><FontAwesomeIcon icon={faDatabase} /></div>
                                        <div>
                                            <div className="s-lbl">Automatic backup</div>
                                            <div className="s-sub">Your data is automatically saved to the cloud daily</div>
                                        </div>
                                    </div>
                                    <Toggle checked={autoBackup} onChange={() => setAutoBackup(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><FontAwesomeIcon icon={faDownload} /></div>
                                        <div>
                                            <div className="s-lbl">Export my data</div>
                                            <div className="s-sub">Download all your data in JSON or CSV format</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn"><FontAwesomeIcon icon={faDownload} />Export</button>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><FontAwesomeIcon icon={faArrowsRotate} /></div>
                                        <div>
                                            <div className="s-lbl">Last backup</div>
                                            <div className="s-sub">Today, 06:30 — 12.4 MB</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn"><FontAwesomeIcon icon={faArrowsRotate} />Backup now</button>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faShield} />Privacy</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><FontAwesomeIcon icon={faChartLine} /></div>
                                        <div>
                                            <div className="s-lbl">Usage analytics</div>
                                            <div className="s-sub">Help improve the app through anonymous data</div>
                                        </div>
                                    </div>
                                    <Toggle checked={analytics} onChange={() => setAnalytics(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray"><FontAwesomeIcon icon={faUser} /></div>
                                        <div>
                                            <div className="s-lbl">Share health data</div>
                                            <div className="s-sub">Allow doctors to access your data with your consent</div>
                                        </div>
                                    </div>
                                    <Toggle checked={shareData} onChange={() => setShareData(v => !v)} />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ══ CONT ══ */}
                {activeNav === "cont" && (
                    <>
                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faUser} />Account information</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><FontAwesomeIcon icon={faUser} /></div>
                                        <div>
                                            <div className="s-lbl">Username</div>
                                            <div className="s-sub">Visible in your public profile</div>
                                        </div>
                                    </div>
                                    <input className="s-input" defaultValue={username} placeholder="Username" />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><FontAwesomeIcon icon={faEnvelope} /></div>
                                        <div>
                                            <div className="s-lbl">Email address</div>
                                            <div className="s-sub">Used for notifications and authentication</div>
                                        </div>
                                    </div>
                                    <input className="s-input" defaultValue="ion.popescu@gmail.com" placeholder="Email" />
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faBolt} />Subscription</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico green"><FontAwesomeIcon icon={faBolt} /></div>
                                        <div>
                                            <div className="s-lbl">Current plan: Free</div>
                                            <div className="s-sub">You have access to basic app features</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn"><FontAwesomeIcon icon={faBolt} />Upgrade Pro</button>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray"><FontAwesomeIcon icon={faGear} /></div>
                                        <div>
                                            <div className="s-lbl">App version</div>
                                            <div className="s-sub">Check if there are updates available</div>
                                        </div>
                                    </div>
                                    <span className="version-badge">v1.0.0</span>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title" style={{ color: "var(--error)" }}><FontAwesomeIcon icon={faTrash} />Danger zone</div>
                            <div className="danger-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><FontAwesomeIcon icon={faArrowsRotate} /></div>
                                        <div>
                                            <div className="s-lbl">Reset data</div>
                                            <div className="s-sub">Deletes all calorie and water history. Irreversible.</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn danger"><FontAwesomeIcon icon={faArrowsRotate} />Reset</button>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico red"><FontAwesomeIcon icon={faTrash} /></div>
                                        <div>
                                            <div className="s-lbl">Delete account</div>
                                            <div className="s-sub">Permanently removes account and all associated data</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn danger"><FontAwesomeIcon icon={faTrash} />Delete account</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* ── Right dark panel ── */}
            <aside className="settings-right">
                <div>
                    <div className="sr-title">Activity log</div>
                    <div className="sr-sub">Last changes</div>
                    <div className="activity-log">
                        {[
                            { color: "#10b981", text: "Push notifications enabled", time: "now" },
                            { color: "#6366f1", text: "Language changed to English", time: "2h" },
                            { color: "#f97316", text: "Password updated successfully", time: "3 days" },
                            { color: "#a855f7", text: "2FA enabled on account", time: "5 days" },
                            { color: "#38bdf8", text: "Automatic backup configured", time: "1 week" },
                        ].map((item, i) => (
                            <div className="log-item" key={i}>
                                <div className="log-dot" style={{ background: item.color }} />
                                <div className="log-text">{item.text}</div>
                                <div className="log-time">{item.time}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="sr-divider" />

                <div>
                    <div className="sr-title">Used storage</div>
                    <div className="storage-bar-wrap">
                        <div className="storage-bar-info">
                            <span className="storage-lbl">Total used</span>
                            <span className="storage-val">47 / 500 MB</span>
                        </div>
                        <div className="storage-bar">
                            <div className="storage-bar-fill" style={{ width: "9.4%" }} />
                        </div>
                        <div className="storage-items">
                            {[
                                { color: "#6366f1", label: "Health data", val: "28 MB" },
                                { color: "#10b981", label: "Backups", val: "14 MB" },
                                { color: "#f97316", label: "Profile images", val: "5 MB" },
                            ].map((item, i) => (
                                <div className="storage-item" key={i}>
                                    <div className="storage-item-left">
                                        <div className="storage-item-dot" style={{ background: item.color }} />
                                        {item.label}
                                    </div>
                                    <div className="storage-item-val">{item.val}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <hr className="sr-divider" />

                <div>
                    <div className="sr-title">Keyboard shortcuts</div>
                    <div className="shortcuts-list">
                        {[
                            { label: "Save", keys: ["Ctrl", "S"] },
                            { label: "Search", keys: ["Ctrl", "K"] },
                            { label: "Dashboard", keys: ["Alt", "D"] },
                            { label: "Profile", keys: ["Alt", "P"] },
                            { label: "Settings", keys: ["Alt", "S"] },
                        ].map((sc, i) => (
                            <div className="shortcut-row" key={i}>
                                <span className="shortcut-lbl">{sc.label}</span>
                                <div className="shortcut-keys">
                                    {sc.keys.map((k, j) => (
                                        <React.Fragment key={j}>
                                            {j > 0 && <span style={{ color: "var(--dark-muted)", fontSize: 10 }}>+</span>}
                                            <span className="kbd">{k}</span>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

        </div>
    );
};

export default SettingsPage;