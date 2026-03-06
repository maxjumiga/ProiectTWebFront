import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faCalendarDays,
    faUser,
    faUserGear,
    faBell,
    faEnvelope,
    faPenToSquare,
    faCamera,
    faShield,
    faLock,
    faKey,
    faEye,
    faEyeSlash,
    faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import "./profil.css";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProfilePageProps {
    username?: string;
    email?: string;
    onLogin?: () => void;
    onDashboard?: () => void;
    onSettings?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

const ProfilePage: React.FC<ProfilePageProps> = ({
    username = "Ion Popescu",
    email = "ion.popescu@gmail.com",
    onLogin,
    onDashboard,
    onSettings,
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
                <div className="db-logo"></div>
                <nav className="db-nav">
                    <button className="db-nav-btn" onClick={onDashboard} title="Dashboard">
                        <FontAwesomeIcon icon={faHouse} />
                    </button>
                    <button className="db-nav-btn" title="Programări">
                        <FontAwesomeIcon icon={faCalendarDays} />
                    </button>
                    <button className="db-nav-btn active" title="Profil">
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                    <button className="db-nav-btn" onClick={onSettings} title="Setări">
                        <FontAwesomeIcon icon={faUserGear} />
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
                            <FontAwesomeIcon icon={faBell} />
                        </button>
                        <button className="ph-icon-btn" onClick={onSettings} title="Setări">
                            <FontAwesomeIcon icon={faUserGear} />
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
                                        <FontAwesomeIcon icon={faCamera} />
                                    </div>
                                </div>
                                <div className="profile-online-dot" />
                            </div>
                            <div className="profile-info">
                                <div className="profile-name">{username}</div>
                                <div className="profile-username">@{username.toLowerCase().replace(" ", "_")}</div>
                                <div className="profile-email">
                                    <FontAwesomeIcon icon={faEnvelope} />
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
                                <FontAwesomeIcon icon={faPenToSquare} />
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
                                    <FontAwesomeIcon icon={faShield} />
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
                                    <FontAwesomeIcon icon={faLock} />
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
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>

                        <button className="change-password-btn">
                            <FontAwesomeIcon icon={faKey} />
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

                <button className="logout-btn" onClick={onLogin}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Deconectare
                </button>
            </aside>
        </div>
    );
};

export default ProfilePage;