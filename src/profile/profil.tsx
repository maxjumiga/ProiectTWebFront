import React, { useState } from "react";
import "./profil.css";

// ─── Icons ───────────────────────────────────────────────────────────────────

const HomeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
    </svg>
);

const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
);

const ChartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 4-6" />
    </svg>
);

const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const BellIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="M2 7l10 7 10-7" />
    </svg>
);

const EditIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const CameraIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const LockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
);

const KeyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="15.5" r="5.5" />
        <path d="M21 2l-9.6 9.6" />
        <path d="M15.5 7.5l3 3L22 7l-3-3" />
    </svg>
);

const EyeOpenIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeClosedIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
);

const LogOutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const TargetIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProfilePageProps {
    username?: string;
    email?: string;
    onLogout?: () => void;
    onDashboard?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

const ProfilePage: React.FC<ProfilePageProps> = ({
                                                     username = "Ion Popescu",
                                                     email = "ion.popescu@gmail.com",
                                                     onLogout,
                                                     onDashboard,
                                                 }) => {
    const [twoFA, setTwoFA] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Fake password for display
    const fakePassword = "MySecretPass123";

    const initials = username
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="profile-root">
            {/* ── Sidebar ── */}
            <aside className="db-sidebar">
                <div className="db-logo">NF</div>
                <nav className="db-nav">
                    <button className="db-nav-btn" onClick={onDashboard} title="Dashboard">
                        <HomeIcon />
                    </button>
                    <button className="db-nav-btn" title="Statistici">
                        <ChartIcon />
                    </button>
                    <button className="db-nav-btn active" title="Profil">
                        <UserIcon />
                    </button>
                    <button className="db-nav-btn" title="Setări">
                        <SettingsIcon />
                    </button>
                </nav>
                <div className="db-sidebar-bottom">
                    <div className="db-avatar">{initials}</div>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="profile-main">
                {/* Header */}
                <div className="profile-header">
                    <div className="profile-header-left">
                        <h1>Profilul meu</h1>
                        <p>GESTIONEAZĂ CONTUL TĂU</p>
                    </div>
                    <div className="profile-header-right">
                        <button className="ph-icon-btn" title="Notificări">
                            <BellIcon />
                        </button>
                        <button className="ph-icon-btn" title="Setări">
                            <SettingsIcon />
                        </button>
                    </div>
                </div>

                {/* 2×2 Grid */}
                <div className="profile-grid">

                    {/* ── Card 1: Profil ── */}
                    <div className="p-card">
                        <div className="p-card-label">Informații profil</div>
                        <div className="profile-avatar-area">
                            <div className="profile-big-avatar">
                                <div className="profile-big-avatar-img">
                                    {initials}
                                    <div className="avatar-edit-overlay">
                                        <CameraIcon />
                                    </div>
                                </div>
                                <div className="profile-online-dot" />
                            </div>
                            <div className="profile-info">
                                <div className="profile-name">{username}</div>
                                <div className="profile-username">@{username.toLowerCase().replace(" ", "_")}</div>
                                <div className="profile-email">
                                    <MailIcon />
                                    {email}
                                </div>
                                <div className="profile-member-since">Membru din Ian 2025</div>
                            </div>
                        </div>
                    </div>

                    {/* ── Card 2: Trăsături ── */}
                    <div className="p-card">
                        <div className="p-card-label">Trăsături fizice</div>
                        <div className="traits-grid">
                            <div className="trait-item gender">
                                <div className="trait-label">Gen</div>
                                <div className="trait-value">M</div>
                            </div>
                            <div className="trait-item age">
                                <div className="trait-label">Vârstă</div>
                                <div className="trait-value">24<em>ani</em></div>
                            </div>
                            <div className="trait-item height">
                                <div className="trait-label">Înălțime</div>
                                <div className="trait-value">182<em>cm</em></div>
                            </div>
                            <div className="trait-item weight">
                                <div className="trait-label">Greutate</div>
                                <div className="trait-value">78<em>kg</em></div>
                            </div>
                        </div>
                        <div className="trait-edit-row">
                            <button className="trait-edit-btn">
                                <EditIcon />
                                Editează
                            </button>
                        </div>
                    </div>

                    {/* ── Card 3: Securitate ── */}
                    <div className="p-card">
                        <div className="p-card-label">Securitate cont</div>

                        {/* 2FA */}
                        <div className="security-row">
                            <div className="security-row-left">
                                <div className={`sec-icon ${twoFA ? "green" : "red"}`}>
                                    <ShieldIcon />
                                </div>
                                <div>
                                    <div className="sec-lbl">Autentificare în 2 pași</div>
                                    <div className="sec-sub">{twoFA ? "Activat — contul tău e protejat" : "Dezactivat — recomandat să activezi"}</div>
                                </div>
                            </div>
                            <label className="twofa-toggle">
                                <input
                                    type="checkbox"
                                    checked={twoFA}
                                    onChange={() => setTwoFA((v) => !v)}
                                />
                                <span className="twofa-slider" />
                            </label>
                        </div>

                        {/* Password */}
                        <div className="security-row">
                            <div className="security-row-left">
                                <div className="sec-icon purple">
                                    <LockIcon />
                                </div>
                                <div>
                                    <div className="sec-lbl">Parolă</div>
                                    <div className="password-display">
                                        {showPassword ? (
                                            <span className="password-text">{fakePassword}</span>
                                        ) : (
                                            <span className="password-dots">••••••••</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                className="eye-toggle-btn"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
                            >
                                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                            </button>
                        </div>

                        <button className="change-password-btn">
                            <KeyIcon />
                            Schimbă parola
                        </button>
                    </div>

                    {/* ── Card 4: Obiective & Activitate ── */}
                    <div className="p-card">
                        <div className="p-card-label">Obiective & Activitate</div>

                        {/* Stats row */}
                        <div className="activity-stats">
                            <div className="act-stat">
                                <div className="act-stat-num">38<em>zile</em></div>
                                <div className="act-stat-lbl">Streak</div>
                            </div>
                            <div className="act-stat">
                                <div className="act-stat-num">142</div>
                                <div className="act-stat-lbl">Sesiuni</div>
                            </div>
                            <div className="act-stat">
                                <div className="act-stat-num">91<em>%</em></div>
                                <div className="act-stat-lbl">Consistență</div>
                            </div>
                        </div>

                        {/* Goals */}
                        <div className="goal-section-lbl">Obiective curente</div>
                        <div className="goal-item">
                            <div className="goal-icon">💧</div>
                            <div className="goal-details">
                                <div className="goal-name">Hidratare zilnică</div>
                                <div className="goal-bar">
                                    <div className="goal-bar-fill" style={{ width: "74%", background: "linear-gradient(90deg, #38bdf8, #0ea5e9)" }} />
                                </div>
                            </div>
                            <div className="goal-pct">74%</div>
                        </div>
                        <div className="goal-item">
                            <div className="goal-icon">🔥</div>
                            <div className="goal-details">
                                <div className="goal-name">Calorii arse</div>
                                <div className="goal-bar">
                                    <div className="goal-bar-fill" style={{ width: "58%", background: "linear-gradient(90deg, #f97316, #fb923c)" }} />
                                </div>
                            </div>
                            <div className="goal-pct">58%</div>
                        </div>
                        <div className="goal-item">
                            <div className="goal-icon">🏃</div>
                            <div className="goal-details">
                                <div className="goal-name">Pași zilnici</div>
                                <div className="goal-bar">
                                    <div className="goal-bar-fill" style={{ width: "85%", background: "linear-gradient(90deg, #10b981, #34d399)" }} />
                                </div>
                            </div>
                            <div className="goal-pct">85%</div>
                        </div>
                    </div>

                </div>
            </main>

            {/* ── Right dark panel ── */}
            <aside className="profile-right">
                <div>
                    <div className="pr-section-title">Insigne obținute</div>
                    <div className="pr-section-sub">REALIZĂRILE TALE</div>
                    <div className="badge-grid">
                        <div className="badge-item">
                            <div className="badge-emoji">🏆</div>
                            <div className="badge-name">Campion</div>
                            <div className="badge-desc">30 zile consecutiv</div>
                        </div>
                        <div className="badge-item">
                            <div className="badge-emoji">💧</div>
                            <div className="badge-name">Hidratat</div>
                            <div className="badge-desc">Obiectiv apă 7 zile</div>
                        </div>
                        <div className="badge-item">
                            <div className="badge-emoji">🔥</div>
                            <div className="badge-name">Ardere</div>
                            <div className="badge-desc">500 kcal/zi x5</div>
                        </div>
                        <div className="badge-item">
                            <div className="badge-emoji">⚡</div>
                            <div className="badge-name">Rapid</div>
                            <div className="badge-desc">10k pași în zi</div>
                        </div>
                        <div className="badge-item">
                            <div className="badge-emoji">🌙</div>
                            <div className="badge-name">Nocturn</div>
                            <div className="badge-desc">Log după ora 22</div>
                        </div>
                        <div className="badge-item">
                            <div className="badge-emoji">🥗</div>
                            <div className="badge-name">Nutriție</div>
                            <div className="badge-desc">7 zile în obiectiv</div>
                        </div>
                    </div>
                </div>

                <hr className="pr-divider" />

                <div>
                    <div className="pr-section-title">Activitate recentă</div>
                    <div className="activity-feed">
                        <div className="feed-item">
                            <div className="feed-dot" style={{ background: "#10b981" }} />
                            <div className="feed-text">Obiectiv apă atins</div>
                            <div className="feed-time">azi</div>
                        </div>
                        <div className="feed-item">
                            <div className="feed-dot" style={{ background: "#6366f1" }} />
                            <div className="feed-text">Profil actualizat</div>
                            <div className="feed-time">ieri</div>
                        </div>
                        <div className="feed-item">
                            <div className="feed-dot" style={{ background: "#f97316" }} />
                            <div className="feed-text">Insignă nouă: 🏆 Campion</div>
                            <div className="feed-time">3z</div>
                        </div>
                        <div className="feed-item">
                            <div className="feed-dot" style={{ background: "#a855f7" }} />
                            <div className="feed-text">2FA activat</div>
                            <div className="feed-time">5z</div>
                        </div>
                    </div>
                </div>

                <hr className="pr-divider" />

                <button className="logout-btn" onClick={onLogout}>
                    <LogOutIcon />
                    Deconectare
                </button>
            </aside>
        </div>
    );
};

export default ProfilePage;