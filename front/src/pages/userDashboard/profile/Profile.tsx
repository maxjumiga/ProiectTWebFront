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
import { useNavigate } from "react-router-dom";
import "./Profile.css";

// ─── Component ───────────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const username = "Ion Popescu";
    const email = "ion.popescu@gmail.com";
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
                    <button className="db-nav-btn" onClick={() => navigate('/dashboard')} title="Dashboard">
                        <FontAwesomeIcon icon={faHouse} />
                    </button>
                    <button className="db-nav-btn" onClick={() => navigate('/calendar')} title="Calendar">
                        <FontAwesomeIcon icon={faCalendarDays} />
                    </button>
                    <button className="db-nav-btn active" onClick={() => navigate('/profile')} title="Profile">
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                    <button className="db-nav-btn" onClick={() => navigate('/settings')} title="Settings">
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
                        <h1>My Profile</h1>
                        <p>MANAGE YOUR ACCOUNT</p>
                    </div>
                    <div className="profile-header-right">
                        <button className="ph-icon-btn" title="Notifications">
                            <FontAwesomeIcon icon={faBell} />
                        </button>
                        <button className="ph-icon-btn" onClick={() => navigate('/settings')} title="Settings">
                            <FontAwesomeIcon icon={faUserGear} />
                        </button>
                    </div>
                </div>

                {/* 2×2 Grid */}
                <div className="profile-grid">

                    {/* ── Card 1: Profil ── */}
                    <div className="p-card">
                        <div className="p-card-label">Profile information</div>
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
                                <div className="profile-member-since">Member since Jan 2025</div>
                            </div>
                        </div>
                    </div>

                    {/* ── Card 2: Traits ── */}
                    <div className="p-card">
                        <div className="p-card-label">Physical traits</div>
                        <div className="traits-grid">
                            <div className="trait-item gender">
                                <div className="trait-label">Gender</div>
                                <div className="trait-value">M</div>
                            </div>
                            <div className="trait-item age">
                                <div className="trait-label">Age</div>
                                <div className="trait-value">24<em>yrs</em></div>
                            </div>
                            <div className="trait-item height">
                                <div className="trait-label">Height</div>
                                <div className="trait-value">182<em>cm</em></div>
                            </div>
                            <div className="trait-item weight">
                                <div className="trait-label">Weight</div>
                                <div className="trait-value">78<em>kg</em></div>
                            </div>
                        </div>
                        <div className="trait-edit-row">
                            <button className="trait-edit-btn">
                                <FontAwesomeIcon icon={faPenToSquare} />
                                Edit
                            </button>
                        </div>
                    </div>

                    {/* ── Card 3: Securitate ── */}
                    <div className="p-card">
                        <div className="p-card-label">Account security</div>

                        {/* 2FA */}
                        <div className="security-row">
                            <div className="security-row-left">
                                <div className={`sec-icon ${twoFA ? "green" : "red"}`}>
                                    <FontAwesomeIcon icon={faShield} />
                                </div>
                                <div>
                                    <div className="sec-lbl">Two-factor authentication</div>
                                    <div className="sec-sub">{twoFA ? "Enabled — your account is protected" : "Disabled — recommended to enable"}</div>
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
                                    <div className="sec-lbl">Password</div>
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
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>

                        <button className="change-password-btn">
                            <FontAwesomeIcon icon={faKey} />
                            Change password
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
                                <div className="act-stat-lbl">Consistency</div>
                            </div>
                        </div>

                        {/* Goals */}
                        <div className="goal-section-lbl">Obiective curente</div>
                        <div className="goal-item">
                            <div className="goal-icon">💧</div>
                            <div className="goal-details">
                                <div className="goal-name">Daily hydration</div>
                                <div className="goal-bar">
                                    <div className="goal-bar-fill" style={{ width: "74%", background: "linear-gradient(90deg, #38bdf8, #0ea5e9)" }} />
                                </div>
                            </div>
                            <div className="goal-pct">74%</div>
                        </div>
                        <div className="goal-item">
                            <div className="goal-icon">🔥</div>
                            <div className="goal-details">
                                <div className="goal-name">Calories burned</div>
                                <div className="goal-bar">
                                    <div className="goal-bar-fill" style={{ width: "58%", background: "linear-gradient(90deg, #f97316, #fb923c)" }} />
                                </div>
                            </div>
                            <div className="goal-pct">58%</div>
                        </div>
                        <div className="goal-item">
                            <div className="goal-icon">🏃</div>
                            <div className="goal-details">
                                <div className="goal-name">Daily steps</div>
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
                    <div className="pr-section-title">Badges earned</div>
                    <div className="pr-section-sub">YOUR ACHIEVEMENTS</div>
                    <div className="badge-grid">
                        <div className="badge-item">
                            <div className="badge-emoji">🏆</div>
                            <div className="badge-name">Champion</div>
                            <div className="badge-desc">30 consecutive days</div>
                        </div>
                        <div className="badge-item">
                            <div className="badge-emoji">💧</div>
                            <div className="badge-name">Hydrated</div>
                            <div className="badge-desc">Water goal 7 days</div>
                        </div>
                        <div className="badge-item">
                            <div className="badge-emoji">🔥</div>
                            <div className="badge-name">Burner</div>
                            <div className="badge-desc">500 kcal/zi x5</div>
                        </div>
                        <div className="badge-item">
                            <div className="badge-emoji">⚡</div>
                            <div className="badge-name">Speedy</div>
                            <div className="badge-desc">10k steps in a day</div>
                        </div>
                        <div className="badge-item">
                            <div className="badge-emoji">🌙</div>
                            <div className="badge-name">Nocturnal</div>
                            <div className="badge-desc">Log after 10pm</div>
                        </div>
                        <div className="badge-item">
                            <div className="badge-emoji">🥗</div>
                            <div className="badge-name">Nutrition</div>
                            <div className="badge-desc">7 days on goal</div>
                        </div>
                    </div>
                </div>

                <hr className="pr-divider" />

                <div>
                    <div className="pr-section-title">Recent activity</div>
                    <div className="activity-feed">
                        <div className="feed-item">
                            <div className="feed-dot" style={{ background: "#10b981" }} />
                            <div className="feed-text">Water goal reached</div>
                            <div className="feed-time">today</div>
                        </div>
                        <div className="feed-item">
                            <div className="feed-dot" style={{ background: "#6366f1" }} />
                            <div className="feed-text">Profile updated</div>
                            <div className="feed-time">yesterday</div>
                        </div>
                        <div className="feed-item">
                            <div className="feed-dot" style={{ background: "#f97316" }} />
                            <div className="feed-text">New badge: 🏆 Champion</div>
                            <div className="feed-time">3d</div>
                        </div>
                        <div className="feed-item">
                            <div className="feed-dot" style={{ background: "#a855f7" }} />
                            <div className="feed-text">2FA enabled</div>
                            <div className="feed-time">5d</div>
                        </div>
                    </div>
                </div>

                <hr className="pr-divider" />

                <button className="logout-btn" onClick={() => {
                    localStorage.removeItem('user');
                    sessionStorage.removeItem('isAuthenticated');
                    navigate('/login');
                }}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Sign out
                </button>
            </aside>
        </div>
    );
};

export default ProfilePage;