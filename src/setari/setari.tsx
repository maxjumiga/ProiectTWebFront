import React, { useState } from "react";
import "./setari.css";

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconHome = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
    </svg>
);
const IconCal = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
);
const IconUser = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
);
const IconSettings = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);
const IconLogout = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);

// Settings nav icons
const IconBell        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IconPalette     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="8" cy="14" r="1" fill="currentColor"/><circle cx="12" cy="9" r="1" fill="currentColor"/><circle cx="16" cy="14" r="1" fill="currentColor"/></svg>;
const IconGlobe       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IconShield      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconDatabase    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;
const IconTrash       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconSave        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IconCheck       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconMoon        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IconSun         = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const IconMail        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/></svg>;
const IconLock        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>;
const IconDownload    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IconRefresh     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const IconTarget      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IconZap         = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;

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
    onLogout?: () => void;
    onDashboard?: () => void;
    onProfile?: () => void;
}

// ─── Accent colors ────────────────────────────────────────────────────────────
const ACCENT_COLORS = [
    { id: "indigo", value: "#6366f1" },
    { id: "violet", value: "#8b5cf6" },
    { id: "sky",    value: "#0ea5e9" },
    { id: "emerald",value: "#10b981" },
    { id: "rose",   value: "#f43f5e" },
    { id: "amber",  value: "#f59e0b" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const SettingsPage: React.FC<SettingsPageProps> = ({
                                                       username = "Ion",
                                                       onLogout,
                                                       onDashboard,
                                                       onProfile,
                                                   }) => {
    const [activeNav, setActiveNav] = useState<NavSection>("notificari");
    const [saved, setSaved] = useState(false);

    // Notificări
    const [notifEmail,  setNotifEmail]  = useState(true);
    const [notifPush,   setNotifPush]   = useState(true);
    const [notifReport, setNotifReport] = useState(false);
    const [notifAppt,   setNotifAppt]   = useState(true);
    const [notifTips,   setNotifTips]   = useState(false);

    // Aspect
    const [darkMode,     setDarkMode]     = useState(false);
    const [accentColor,  setAccentColor]  = useState("indigo");
    const [fontSize,     setFontSize]     = useState(14);
    const [compactMode,  setCompactMode]  = useState(false);
    const [animations,   setAnimations]   = useState(true);

    // Limbă & regiune
    const [language, setLanguage] = useState("ro");
    const [timezone, setTimezone] = useState("Europe/Bucharest");
    const [units,    setUnits]    = useState("metric");
    const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

    // Securitate
    const [twoFA,        setTwoFA]        = useState(false);
    const [loginAlerts,  setLoginAlerts]  = useState(true);
    const [sessionTimeout, setSessionTimeout] = useState("30");

    // Date & confidențialitate
    const [shareData,   setShareData]   = useState(false);
    const [analytics,   setAnalytics]   = useState(true);
    const [autoBackup,  setAutoBackup]  = useState(true);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const initials = username.charAt(0).toUpperCase();

    // ── Nav items ──
    const navItems: { id: NavSection; label: string; icon: React.ReactNode }[] = [
        { id: "notificari", label: "Notificări",         icon: <IconBell /> },
        { id: "aspect",     label: "Aspect & Temă",      icon: <IconPalette /> },
        { id: "limba",      label: "Limbă & Regiune",    icon: <IconGlobe /> },
        { id: "securitate", label: "Securitate",         icon: <IconShield /> },
        { id: "date",       label: "Date & Confidenț.", icon: <IconDatabase /> },
        { id: "cont",       label: "Cont",               icon: <IconUser /> },
    ];

    return (
        <div className="settings-root">

            {/* ── Sidebar ── */}
            <aside className="db-sidebar">
                <div className="db-logo">W&H</div>
                <nav className="db-nav">
                    <button className="db-nav-btn" onClick={onDashboard} title="Acasă"><IconHome /></button>
                    <button className="db-nav-btn" title="Statistici"><IconCal /></button>
                    <button className="db-nav-btn" onClick={onProfile} title="Profil"><IconUser /></button>
                    <button className="db-nav-btn active" title="Setări"><IconSettings /></button>
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
                <button className="snav-btn danger" onClick={onLogout}>
                    <IconLogout />
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
                            <IconCheck /> Salvat
                        </span>
                        <button className="save-btn" onClick={handleSave}>
                            <IconSave />
                            Salvează modificările
                        </button>
                    </div>
                </div>

                {/* ══ NOTIFICĂRI ══ */}
                {activeNav === "notificari" && (
                    <>
                        <div className="settings-section">
                            <div className="section-title"><IconBell />Canale de notificare</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><IconMail /></div>
                                        <div>
                                            <div className="s-lbl">Notificări pe email</div>
                                            <div className="s-sub">Primești rezumate și alerte pe adresa ta de Gmail</div>
                                        </div>
                                    </div>
                                    <Toggle checked={notifEmail} onChange={() => setNotifEmail(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><IconZap /></div>
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
                            <div className="section-title"><IconTarget />Ce vrei să primești</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><IconCal /></div>
                                        <div>
                                            <div className="s-lbl">Raport săptămânal</div>
                                            <div className="s-sub">Rezumat cu progresul tău din ultima săptămână</div>
                                        </div>
                                    </div>
                                    <Toggle checked={notifReport} onChange={() => setNotifReport(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico green"><IconBell /></div>
                                        <div>
                                            <div className="s-lbl">Memento programări</div>
                                            <div className="s-sub">Reamintire cu 24h înainte de o programare</div>
                                        </div>
                                    </div>
                                    <Toggle checked={notifAppt} onChange={() => setNotifAppt(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray"><IconZap /></div>
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
                            <div className="section-title"><IconMail />Frecvență email</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><IconMail /></div>
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
                            <div className="section-title"><IconMoon />Temă</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray">{darkMode ? <IconMoon /> : <IconSun />}</div>
                                        <div>
                                            <div className="s-lbl">Mod întunecat</div>
                                            <div className="s-sub">Activează tema dark pentru confort vizual nocturn</div>
                                        </div>
                                    </div>
                                    <Toggle checked={darkMode} onChange={() => setDarkMode(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><IconZap /></div>
                                        <div>
                                            <div className="s-lbl">Animații interfață</div>
                                            <div className="s-sub">Tranziții și efecte animate la navigare</div>
                                        </div>
                                    </div>
                                    <Toggle checked={animations} onChange={() => setAnimations(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><IconSettings /></div>
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
                            <div className="section-title"><IconPalette />Culoare accent</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico" style={{ background: ACCENT_COLORS.find(c => c.id === accentColor)?.value + "22", color: ACCENT_COLORS.find(c => c.id === accentColor)?.value }}>
                                            <IconPalette />
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
                            <div className="section-title"><IconSun />Dimensiune text</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><IconSun /></div>
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
                            <div className="section-title"><IconGlobe />Limbă & afișare</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><IconGlobe /></div>
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
                                        <div className="s-ico purple"><IconGlobe /></div>
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
                            <div className="section-title"><IconTarget />Unități & format</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico green"><IconTarget /></div>
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
                                        <div className="s-ico orange"><IconGlobe /></div>
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
                            <div className="section-title"><IconShield />Autentificare</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className={`s-ico ${twoFA ? "green" : "red"}`}><IconShield /></div>
                                        <div>
                                            <div className="s-lbl">Autentificare în 2 pași (2FA)</div>
                                            <div className="s-sub">{twoFA ? "Activat — contul tău este protejat suplimentar" : "Dezactivat — recomandăm să activezi 2FA"}</div>
                                        </div>
                                    </div>
                                    <Toggle checked={twoFA} onChange={() => setTwoFA(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><IconBell /></div>
                                        <div>
                                            <div className="s-lbl">Alerte de autentificare</div>
                                            <div className="s-sub">Primești email la fiecare logare nouă detectată</div>
                                        </div>
                                    </div>
                                    <Toggle checked={loginAlerts} onChange={() => setLoginAlerts(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><IconLock /></div>
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
                            <div className="section-title"><IconLock />Parolă & acces</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><IconLock /></div>
                                        <div>
                                            <div className="s-lbl">Schimbă parola</div>
                                            <div className="s-sub">Ultima schimbare: acum 3 luni</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn"><IconLock />Schimbă</button>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray"><IconDatabase /></div>
                                        <div>
                                            <div className="s-lbl">Sesiuni active</div>
                                            <div className="s-sub">2 dispozitive conectate în prezent</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn danger"><IconLogout />Deconectează toate</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ══ DATE & CONFIDENȚIALITATE ══ */}
                {activeNav === "date" && (
                    <>
                        <div className="settings-section">
                            <div className="section-title"><IconDatabase />Stocare & backup</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico green"><IconDatabase /></div>
                                        <div>
                                            <div className="s-lbl">Backup automat</div>
                                            <div className="s-sub">Datele tale sunt salvate automat în cloud zilnic</div>
                                        </div>
                                    </div>
                                    <Toggle checked={autoBackup} onChange={() => setAutoBackup(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><IconDownload /></div>
                                        <div>
                                            <div className="s-lbl">Exportă datele mele</div>
                                            <div className="s-sub">Descarcă toate datele tale în format JSON sau CSV</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn"><IconDownload />Exportă</button>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><IconRefresh /></div>
                                        <div>
                                            <div className="s-lbl">Ultimul backup</div>
                                            <div className="s-sub">Astăzi, 06:30 — 12.4 MB</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn"><IconRefresh />Backup acum</button>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <div className="section-title"><IconShield />Confidențialitate</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><IconCal /></div>
                                        <div>
                                            <div className="s-lbl">Analize de utilizare</div>
                                            <div className="s-sub">Ajută la îmbunătățirea aplicației prin date anonime</div>
                                        </div>
                                    </div>
                                    <Toggle checked={analytics} onChange={() => setAnalytics(v => !v)} />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray"><IconUser /></div>
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
                            <div className="section-title"><IconUser />Informații cont</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico blue"><IconUser /></div>
                                        <div>
                                            <div className="s-lbl">Nume utilizator</div>
                                            <div className="s-sub">Vizibil în profilul tău public</div>
                                        </div>
                                    </div>
                                    <input className="s-input" defaultValue={username} placeholder="Nume utilizator" />
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><IconMail /></div>
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
                            <div className="section-title"><IconZap />Abonament</div>
                            <div className="s-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico green"><IconZap /></div>
                                        <div>
                                            <div className="s-lbl">Plan curent: Free</div>
                                            <div className="s-sub">Ai acces la funcționalitățile de bază ale aplicației</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn"><IconZap />Upgrade Pro</button>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico gray"><IconSettings /></div>
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
                            <div className="section-title" style={{ color: "var(--error)" }}><IconTrash />Zonă periculoasă</div>
                            <div className="danger-card">
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico orange"><IconRefresh /></div>
                                        <div>
                                            <div className="s-lbl">Resetează datele</div>
                                            <div className="s-sub">Șterge tot istoricul de calorii și apă. Ireversibil.</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn danger"><IconRefresh />Resetează</button>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico red"><IconTrash /></div>
                                        <div>
                                            <div className="s-lbl">Șterge contul</div>
                                            <div className="s-sub">Elimină permanent contul și toate datele asociate</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn danger"><IconTrash />Șterge cont</button>
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
                            { color: "#10b981", text: "Notificări push activate",       time: "acum" },
                            { color: "#6366f1", text: "Limbă schimbată în Română",      time: "2h" },
                            { color: "#f97316", text: "Parolă actualizată cu succes",   time: "3 zile" },
                            { color: "#a855f7", text: "2FA activat pe cont",            time: "5 zile" },
                            { color: "#38bdf8", text: "Backup automat configurat",      time: "1 săpt." },
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
                                { color: "#10b981", label: "Backup-uri",    val: "14 MB" },
                                { color: "#f97316", label: "Imagini profil",val: "5 MB" },
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
                            { label: "Salvează",       keys: ["Ctrl", "S"] },
                            { label: "Caută",          keys: ["Ctrl", "K"] },
                            { label: "Dashboard",      keys: ["Alt", "D"] },
                            { label: "Profil",         keys: ["Alt", "P"] },
                            { label: "Setări",         keys: ["Alt", "S"] },
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