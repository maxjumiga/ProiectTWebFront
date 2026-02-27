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
import "./setari.css";

// ─── Toggle component ─────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label className="s-toggle">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="s-toggle-slider" />
    </label>
);

// ─── Types ────────────────────────────────────────────────────────────────────
type NavSection = "notificari" | "aspect" | "limba" | "securitate" | "date" | "cont";

interface SettingsPageProps {
    username?: string;
    onLogin?: () => void;
    onDashboard?: () => void;
    onProfile?: () => void;
}

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
const SettingsPage: React.FC<SettingsPageProps> = ({
    username = "Ion Popescu",
    onLogin,
    onDashboard,
    onProfile,
}) => {
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
        { id: "notificari", label: "Notificări", icon: <FontAwesomeIcon icon={faBell} /> },
        { id: "aspect", label: "Aspect & Temă", icon: <FontAwesomeIcon icon={faPalette} /> },
        { id: "limba", label: "Limbă & Regiune", icon: <FontAwesomeIcon icon={faGlobe} /> },
        { id: "securitate", label: "Securitate", icon: <FontAwesomeIcon icon={faShield} /> },
        { id: "date", label: "Date & Confidenț.", icon: <FontAwesomeIcon icon={faDatabase} /> },
        { id: "cont", label: "Cont", icon: <FontAwesomeIcon icon={faUser} /> },
    ];

    return (
        <div className="settings-root">

            {/* ── Sidebar ── */}
            <aside className="db-sidebar">
                <div className="db-logo"></div>
                <nav className="db-nav">
                    <button className="db-nav-btn" onClick={onDashboard} title="Acasă"><FontAwesomeIcon icon={faHouse} /></button>
                    <button className="db-nav-btn" title="Statistici"><FontAwesomeIcon icon={faCalendarDays} /></button>
                    <button className="db-nav-btn" onClick={onProfile} title="Profil"><FontAwesomeIcon icon={faUser} /></button>
                    <button className="db-nav-btn active" title="Setări"><FontAwesomeIcon icon={faUserGear} /></button>
                </nav>
                <div className="db-sidebar-bottom">
                    <button className="db-avatar" onClick={onProfile}>{initials}</button>
                </div>
            </aside>

            {/* ── Settings nav panel ── */}
            <nav className="settings-nav-panel">
                <div className="settings-nav-title">Setări</div>
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
                <div className="settings-nav-title">Sistem</div>
                <button className="snav-btn danger" onClick={onLogin}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Deconectare
                </button>
            </nav>

            {/* ── Main content ── */}
            <main className="settings-main">
                <div className="settings-header">
                    <div>
                        <h1>
                            {navItems.find(n => n.id === activeNav)?.label ?? "Setări"}
                        </h1>
                        <p>GESTIONEAZĂ PREFERINȚELE TALE</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span className={`saved-indicator${saved ? " visible" : ""}`}>
                            <FontAwesomeIcon icon={faCheck} /> Salvat
                        </span>
                        <button className="save-btn" onClick={handleSave}>
                            <FontAwesomeIcon icon={faFloppyDisk} />
                            Salvează modificările
                        </button>
                    </div>
                </div>

                {/* ══ NOTIFICĂRI ══ */}
                {activeNav === "notificari" && (
                    <>
                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faBell} />Canale de notificare</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><FontAwesomeIcon icon={faEnvelope} /></div>
                                        <div>
                                            <div className="s-lbl">Notificări pe email</div>
                                            <div className="s-sub">Primești rezumate și alerte pe adresa ta de Gmail</div>
                                        </div>
                                    </div>
                                    <Toggle checked={notifEmail} onChange={() => setNotifEmail(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><FontAwesomeIcon icon={faBolt} /></div>
                                        <div>
                                            <div className="s-lbl">Notificări push</div>
                                            <div className="s-sub">Alerte în timp real direct în browser</div>
                                        </div>
                                    </div>
                                    <Toggle checked={notifPush} onChange={() => setNotifPush(v => !v)} />
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faBullseye} />Ce vrei să primești</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><FontAwesomeIcon icon={faCalendarDays} /></div>
                                        <div>
                                            <div className="s-lbl">Raport săptămânal</div>
                                            <div className="s-sub">Rezumat cu progresul tău din ultima săptămână</div>
                                        </div>
                                    </div>
                                    <Toggle checked={notifReport} onChange={() => setNotifReport(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico green"><FontAwesomeIcon icon={faBell} /></div>
                                        <div>
                                            <div className="s-lbl">Memento programări</div>
                                            <div className="s-sub">Reamintire cu 24h înainte de o programare</div>
                                        </div>
                                    </div>
                                    <Toggle checked={notifAppt} onChange={() => setNotifAppt(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray"><FontAwesomeIcon icon={faBolt} /></div>
                                        <div>
                                            <div className="s-lbl">Sfaturi de sănătate</div>
                                            <div className="s-sub">Tips zilnice personalizate pe baza profilului tău</div>
                                        </div>
                                    </div>
                                    <Toggle checked={notifTips} onChange={() => setNotifTips(v => !v)} />
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faEnvelope} />Frecvență email</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><FontAwesomeIcon icon={faEnvelope} /></div>
                                        <div>
                                            <div className="s-lbl">Frecvență rezumate</div>
                                            <div className="s-sub">Cât de des vrei să primești email-uri de rezumat</div>
                                        </div>
                                    </div>
                                    <select className="s-select">
                                        <option>Zilnic</option>
                                        <option selected>Săptămânal</option>
                                        <option>Lunar</option>
                                        <option>Niciodată</option>
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
                            <div className="section-title"><FontAwesomeIcon icon={faMoon} />Temă</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray">{darkMode ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}</div>
                                        <div>
                                            <div className="s-lbl">Mod întunecat</div>
                                            <div className="s-sub">Activează tema dark pentru confort vizual nocturn</div>
                                        </div>
                                    </div>
                                    <Toggle checked={darkMode} onChange={() => setDarkMode(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><FontAwesomeIcon icon={faBolt} /></div>
                                        <div>
                                            <div className="s-lbl">Animații interfață</div>
                                            <div className="s-sub">Tranziții și efecte animate la navigare</div>
                                        </div>
                                    </div>
                                    <Toggle checked={animations} onChange={() => setAnimations(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><FontAwesomeIcon icon={faGear} /></div>
                                        <div>
                                            <div className="s-lbl">Mod compact</div>
                                            <div className="s-sub">Reduce spațiile pentru mai mult conținut vizibil</div>
                                        </div>
                                    </div>
                                    <Toggle checked={compactMode} onChange={() => setCompactMode(v => !v)} />
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faPalette} />Culoare accent</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico" style={{ background: ACCENT_COLORS.find(c => c.id === accentColor)?.value + "22", color: ACCENT_COLORS.find(c => c.id === accentColor)?.value }}>
                                            <FontAwesomeIcon icon={faPalette} />
                                        </div>
                                        <div>
                                            <div className="s-lbl">Culoarea principală</div>
                                            <div className="s-sub">Afectează butoanele, link-urile și elementele active</div>
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
                            <div className="section-title"><FontAwesomeIcon icon={faTextHeight} />Dimensiune text</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><FontAwesomeIcon icon={faFont} /></div>
                                        <div>
                                            <div className="s-lbl">Mărime font</div>
                                            <div className="s-sub">Ajustează dimensiunea textului în interfață</div>
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

                {/* ══ LIMBĂ ══ */}
                {activeNav === "limba" && (
                    <>
                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faGlobe} />Limbă & afișare</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><FontAwesomeIcon icon={faLanguage} /></div>
                                        <div>
                                            <div className="s-lbl">Limba aplicației</div>
                                            <div className="s-sub">Limba în care este afișată interfața</div>
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
                                            <div className="s-lbl">Fus orar</div>
                                            <div className="s-sub">Fusul orar folosit pentru date și ore</div>
                                        </div>
                                    </div>
                                    <select className="s-select" value={timezone} onChange={e => setTimezone(e.target.value)}>
                                        <option value="Europe/Bucharest">Europa/București</option>
                                        <option value="Europe/London">Europa/Londra</option>
                                        <option value="Europe/Paris">Europa/Paris</option>
                                        <option value="America/New_York">America/New York</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faBullseye} />Unități & format</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico green"><FontAwesomeIcon icon={faBullseye} /></div>
                                        <div>
                                            <div className="s-lbl">Sistem de unități</div>
                                            <div className="s-sub">Metric (kg, cm) sau Imperial (lbs, ft)</div>
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
                                            <div className="s-lbl">Format dată</div>
                                            <div className="s-sub">Modul în care sunt afișate datele calendaristice</div>
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
                            <div className="section-title"><FontAwesomeIcon icon={faShield} />Autentificare</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className={`s-ico ${twoFA ? "green" : "red"}`}><FontAwesomeIcon icon={faShield} /></div>
                                        <div>
                                            <div className="s-lbl">Autentificare în 2 pași (2FA)</div>
                                            <div className="s-sub">{twoFA ? "Activat — contul tău este protejat suplimentar" : "Dezactivat — recomandăm să activezi 2FA"}</div>
                                        </div>
                                    </div>
                                    <Toggle checked={twoFA} onChange={() => setTwoFA(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><FontAwesomeIcon icon={faBell} /></div>
                                        <div>
                                            <div className="s-lbl">Alerte de autentificare</div>
                                            <div className="s-sub">Primești email la fiecare logare nouă detectată</div>
                                        </div>
                                    </div>
                                    <Toggle checked={loginAlerts} onChange={() => setLoginAlerts(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><FontAwesomeIcon icon={faLock} /></div>
                                        <div>
                                            <div className="s-lbl">Timeout sesiune</div>
                                            <div className="s-sub">Deconectare automată după inactivitate</div>
                                        </div>
                                    </div>
                                    <select className="s-select" value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}>
                                        <option value="15">15 minute</option>
                                        <option value="30">30 minute</option>
                                        <option value="60">1 oră</option>
                                        <option value="0">Niciodată</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faLock} />Parolă & acces</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><FontAwesomeIcon icon={faLock} /></div>
                                        <div>
                                            <div className="s-lbl">Schimbă parola</div>
                                            <div className="s-sub">Ultima schimbare: acum 3 luni</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn"><FontAwesomeIcon icon={faLock} />Schimbă</button>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray"><FontAwesomeIcon icon={faDatabase} /></div>
                                        <div>
                                            <div className="s-lbl">Sesiuni active</div>
                                            <div className="s-sub">2 dispozitive conectate în prezent</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn danger"><FontAwesomeIcon icon={faRightFromBracket} />Deconectează toate</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ══ DATE & CONFIDENȚIALITATE ══ */}
                {activeNav === "date" && (
                    <>
                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faDatabase} />Stocare & backup</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico green"><FontAwesomeIcon icon={faDatabase} /></div>
                                        <div>
                                            <div className="s-lbl">Backup automat</div>
                                            <div className="s-sub">Datele tale sunt salvate automat în cloud zilnic</div>
                                        </div>
                                    </div>
                                    <Toggle checked={autoBackup} onChange={() => setAutoBackup(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><FontAwesomeIcon icon={faDownload} /></div>
                                        <div>
                                            <div className="s-lbl">Exportă datele mele</div>
                                            <div className="s-sub">Descarcă toate datele tale în format JSON sau CSV</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn"><FontAwesomeIcon icon={faDownload} />Exportă</button>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><FontAwesomeIcon icon={faArrowsRotate} /></div>
                                        <div>
                                            <div className="s-lbl">Ultimul backup</div>
                                            <div className="s-sub">Astăzi, 06:30 — 12.4 MB</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn"><FontAwesomeIcon icon={faArrowsRotate} />Backup acum</button>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faShield} />Confidențialitate</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><FontAwesomeIcon icon={faChartLine} /></div>
                                        <div>
                                            <div className="s-lbl">Analize de utilizare</div>
                                            <div className="s-sub">Ajută la îmbunătățirea aplicației prin date anonime</div>
                                        </div>
                                    </div>
                                    <Toggle checked={analytics} onChange={() => setAnalytics(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray"><FontAwesomeIcon icon={faUser} /></div>
                                        <div>
                                            <div className="s-lbl">Partajare date de sănătate</div>
                                            <div className="s-sub">Permite medicilor să acceseze datele tale cu acordul tău</div>
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
                            <div className="section-title"><FontAwesomeIcon icon={faUser} />Informații cont</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><FontAwesomeIcon icon={faUser} /></div>
                                        <div>
                                            <div className="s-lbl">Nume utilizator</div>
                                            <div className="s-sub">Vizibil în profilul tău public</div>
                                        </div>
                                    </div>
                                    <input className="s-input" defaultValue={username} placeholder="Nume utilizator" />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><FontAwesomeIcon icon={faEnvelope} /></div>
                                        <div>
                                            <div className="s-lbl">Adresă email</div>
                                            <div className="s-sub">Folosită pentru notificări și autentificare</div>
                                        </div>
                                    </div>
                                    <input className="s-input" defaultValue="ion.popescu@gmail.com" placeholder="Email" />
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><FontAwesomeIcon icon={faBolt} />Abonament</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico green"><FontAwesomeIcon icon={faBolt} /></div>
                                        <div>
                                            <div className="s-lbl">Plan curent: Free</div>
                                            <div className="s-sub">Ai acces la funcționalitățile de bază ale aplicației</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn"><FontAwesomeIcon icon={faBolt} />Upgrade Pro</button>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray"><FontAwesomeIcon icon={faGear} /></div>
                                        <div>
                                            <div className="s-lbl">Versiune aplicație</div>
                                            <div className="s-sub">Verifică dacă există actualizări disponibile</div>
                                        </div>
                                    </div>
                                    <span className="version-badge">v1.0.0</span>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title" style={{ color: "var(--error)" }}><FontAwesomeIcon icon={faTrash} />Zonă periculoasă</div>
                            <div className="danger-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><FontAwesomeIcon icon={faArrowsRotate} /></div>
                                        <div>
                                            <div className="s-lbl">Resetează datele</div>
                                            <div className="s-sub">Șterge tot istoricul de calorii și apă. Ireversibil.</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn danger"><FontAwesomeIcon icon={faArrowsRotate} />Resetează</button>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico red"><FontAwesomeIcon icon={faTrash} /></div>
                                        <div>
                                            <div className="s-lbl">Șterge contul</div>
                                            <div className="s-sub">Elimină permanent contul și toate datele asociate</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn danger"><FontAwesomeIcon icon={faTrash} />Șterge cont</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* ── Right dark panel ── */}
            <aside className="settings-right">
                <div>
                    <div className="sr-title">Jurnal activitate</div>
                    <div className="sr-sub">Ultimele modificări</div>
                    <div className="activity-log">
                        {[
                            { color: "#10b981", text: "Notificări push activate", time: "acum" },
                            { color: "#6366f1", text: "Limbă schimbată în Română", time: "2h" },
                            { color: "#f97316", text: "Parolă actualizată cu succes", time: "3 zile" },
                            { color: "#a855f7", text: "2FA activat pe cont", time: "5 zile" },
                            { color: "#38bdf8", text: "Backup automat configurat", time: "1 săpt." },
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
                    <div className="sr-title">Stocare utilizată</div>
                    <div className="storage-bar-wrap">
                        <div className="storage-bar-info">
                            <span className="storage-lbl">Total folosit</span>
                            <span className="storage-val">47 / 500 MB</span>
                        </div>
                        <div className="storage-bar">
                            <div className="storage-bar-fill" style={{ width: "9.4%" }} />
                        </div>
                        <div className="storage-items">
                            {[
                                { color: "#6366f1", label: "Date sănătate", val: "28 MB" },
                                { color: "#10b981", label: "Backup-uri", val: "14 MB" },
                                { color: "#f97316", label: "Imagini profil", val: "5 MB" },
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
                    <div className="sr-title">Scurtături tastatură</div>
                    <div className="shortcuts-list">
                        {[
                            { label: "Salvează", keys: ["Ctrl", "S"] },
                            { label: "Caută", keys: ["Ctrl", "K"] },
                            { label: "Dashboard", keys: ["Alt", "D"] },
                            { label: "Profil", keys: ["Alt", "P"] },
                            { label: "Setări", keys: ["Alt", "S"] },
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