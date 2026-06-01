import React, { useState, useEffect } from "react";
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
    faLock,
    faKey,
    faEye,
    faEyeSlash,
    faRightFromBracket,
    faXmark,
    faCheck,
    faHeartPulse,
    faWeightScale,
    faDroplet,
    faDumbbell,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import "../UserDashboard.css";

// ─── Component ───────────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    
    // State pentru utilizatorul curent
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    // State pentru editarea trăsăturilor fizice
    const [isEditingTraits, setIsEditingTraits] = useState(false);
    const [editedGender, setEditedGender] = useState("M");
    const [editedAge, setEditedAge] = useState(24);
    const [editedHeight, setEditedHeight] = useState(180);
    const [editedWeight, setEditedWeight] = useState(75);

    // State pentru descriere / bio
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [editedBio, setEditedBio] = useState("");

    // Modal parolă
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [confirmCurrentPassword, setConfirmCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showConfirmCurrentPassword, setShowConfirmCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // Fake password pentru afișare
    const fakePassword = "MySecretPass123";
    const token = localStorage.getItem("token");

    // Încărcăm datele utilizatorului la montarea componentei
    const fetchUser = async () => {
        try {
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await fetch("http://localhost:5004/api/user/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const result = await response.json();
                
                // În funcție de formatul ServiceResponse din C#, datele sunt sub proprietatea 'data' sau direct în root
                const userData = (result.isSuccess && result.data) ? result.data : result;
                
                setUser(userData);
            }
        } catch (err) {
            console.error("Error fetching user info:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // Inițializăm câmpurile de editare la deschiderea formularului
    const handleStartEdit = () => {
        if (user) {
            setEditedGender(user.gender || "M");
            setEditedAge(user.age || 24);
            setEditedHeight(user.height || 180);
            setEditedWeight(user.weight || 75);
            setIsEditingTraits(true);
        }
    };

    // Salvăm trăsăturile fizice în DB
    const handleSaveTraits = async () => {
        try {
            const response = await fetch("http://localhost:5004/api/user/me", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    gender: editedGender,
                    age: editedAge,
                    height: editedHeight,
                    weight: editedWeight
                })
            });

            if (response.ok) {
                // Reîncărcăm datele proaspete și închidem editarea
                await fetchUser();
                setIsEditingTraits(false);
            } else {
                alert("Nu s-au putut actualiza datele fizice.");
            }
        } catch (err) {
            console.error(err);
            alert("Eroare de conexiune la server.");
        }
    };

    // Salvăm descrierea (Bio) în DB
    const handleSaveBio = async () => {
        try {
            const response = await fetch("http://localhost:5004/api/user/me", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    bio: editedBio
                })
            });

            if (response.ok) {
                await fetchUser();
                setIsEditingBio(false);
            } else {
                alert("Nu s-a putut actualiza descrierea.");
            }
        } catch (err) {
            console.error("Error saving bio:", err);
            alert("Eroare de conexiune la server.");
        }
    };

    // BMI & health computations
    const heightM = (user?.height || 170) / 100;
    const weightKg = user?.weight || 70;
    const bmi = +(weightKg / (heightM * heightM)).toFixed(1);
    const getBmiCategory = (b: number) => {
        if (b < 18.5) return { label: "Underweight", color: "#38bdf8", bg: "rgba(56,189,248,0.12)" };
        if (b < 25)   return { label: "Normal weight", color: "#10b981", bg: "rgba(16,185,129,0.12)" };
        if (b < 30)   return { label: "Overweight", color: "#f97316", bg: "rgba(249,115,22,0.12)" };
        return           { label: "Obese", color: "#ef4444", bg: "rgba(239,68,68,0.12)" };
    };
    const bmiCat = getBmiCategory(bmi);
    const bmiPct = Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100);
    // Body water % estimate (Watson formula simplified)
    const bodyWaterPct = user?.gender === "F" ? 50 : 60;
    // Ideal weight range (Devine formula)
    const heightCm = user?.height || 170;
    const idealMin = user?.gender === "F"
        ? +(45.5 + 0.9 * (heightCm - 152.4)).toFixed(1)
        : +(50 + 0.9 * (heightCm - 152.4)).toFixed(1);
    const idealMax = +(idealMin + 7).toFixed(1);
    // Fitness score (composite)
    const fitnessScore = Math.min(100, Math.round(
        (bmi >= 18.5 && bmi < 25 ? 40 : bmi >= 25 && bmi < 30 ? 25 : 10) +
        (user?.age ? (user.age < 40 ? 30 : 20) : 20) +
        30
    ));
    const circumference = 2 * Math.PI * 36;
    const dashOffset = circumference - (fitnessScore / 100) * circumference;


    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (!currentPassword || !confirmCurrentPassword || !newPassword) {
            setPasswordError("Toate câmpurile sunt obligatorii.");
            return;
        }

        if (currentPassword !== confirmCurrentPassword) {
            setPasswordError("Parolele curente introduse nu se potrivesc.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("Noua parolă trebuie să aibă cel puțin 6 caractere.");
            return;
        }

        setIsUpdatingPassword(true);
        try {
            const response = await fetch(
                "http://localhost:5004/api/User/change-password",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!data.isSuccess) {
                throw new Error(data.message);
            }

            setPasswordSuccess("Parola a fost modificată cu succes!");

            setTimeout(() => {
                setShowPasswordModal(false);

                setCurrentPassword("");
                setConfirmCurrentPassword("");
                setNewPassword("");

                setPasswordError("");
                setPasswordSuccess("");
            }, 2000);
        } catch (err: any) {
            setPasswordError(err.message || "Eroare de conexiune la server.");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#f0f2f8', fontSize: '18px', fontWeight: 'bold', fontFamily: 'Sora' }}>
                Se încarcă profilul...
            </div>
        );
    }

    const username = user?.name || "Ion Popescu";
    const email = user?.email || "ion.popescu@gmail.com";

    const initials = username
        .split(" ")
        .filter(Boolean)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    return (
        <div className="db-root">
            {/* ── SIDEBAR ── */}
            <aside className="db-sidebar">
                <div className="db-logo-wrapper">
                    <img src="/OmniTrackLogo.png" alt="OmniTrack Logo" className="db-logo-img" />
                    <span className="db-logo-text">OmniTrack</span>
                </div>

                <nav className="db-nav-links">
                    <button className="db-nav-item" onClick={() => navigate('/dashboard')}>
                        <FontAwesomeIcon icon={faHouse} className="nav-item-icon" />
                        <span>Dashboard</span>
                    </button>
                    <button className="db-nav-item" onClick={() => navigate('/calendar')}>
                        <FontAwesomeIcon icon={faCalendarDays} className="nav-item-icon" />
                        <span>Progress</span>
                    </button>
                    <button className="db-nav-item active" onClick={() => navigate('/profile')}>
                        <FontAwesomeIcon icon={faUser} className="nav-item-icon" />
                        <span>Profile</span>
                    </button>
                    <button className="db-nav-item" onClick={() => navigate('/settings')}>
                        <FontAwesomeIcon icon={faUserGear} className="nav-item-icon" />
                        <span>Settings</span>
                    </button>
                </nav>

                <div className="db-sidebar-user">
                    <div className="user-avatar-wrap" onClick={() => navigate('/profile')}>
                        <div className="user-avatar-img">{initials}</div>
                    </div>
                    <div className="user-details-mini">
                        <div className="user-name-row">
                            <span className="user-display-name">{username}</span>
                            <FontAwesomeIcon icon={faChevronRight} className="user-arrow-icon" />
                        </div>
                    </div>
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
                        <button className="profile-logout-btn" onClick={() => {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            sessionStorage.removeItem('isAuthenticated');
                            navigate('/login');
                        }} title="Sign out" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            marginLeft: '12px'
                        }}>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                            <span>Sign out</span>
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
                                <div className="profile-username">@{username.toLowerCase().replace(/\s+/g, "_")}</div>
                                <div className="profile-email">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    {email}
                                </div>
                                <div className="profile-member-since">Member since Jan 2025</div>
                            </div>
                        </div>

                        {/* Bio/Description Section */}
                        <div className="profile-bio-container">
                            <div className="bio-header">
                                <span className="bio-title">About Me</span>
                                {!isEditingBio && (
                                    <button 
                                        className="bio-edit-btn" 
                                        onClick={() => {
                                            setEditedBio(user?.bio || "");
                                            setIsEditingBio(true);
                                        }}
                                        title="Edit Description"
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                        <span>Edit</span>
                                    </button>
                                )}
                            </div>
                            {isEditingBio ? (
                                <div className="bio-edit-form">
                                    <textarea
                                        className="bio-textarea"
                                        value={editedBio}
                                        onChange={(e) => setEditedBio(e.target.value)}
                                        placeholder="Tell us about yourself (goals, habits, interests)..."
                                        maxLength={500}
                                    />
                                    <div className="bio-edit-footer">
                                        <span className="bio-char-count">{editedBio.length}/500</span>
                                        <div className="bio-edit-actions">
                                            <button className="bio-save-btn" onClick={handleSaveBio}>
                                                Save
                                            </button>
                                            <button className="bio-cancel-btn" onClick={() => setIsEditingBio(false)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className={`bio-text ${!user?.bio ? 'bio-empty' : ''}`}>
                                    {user?.bio || "No description added yet. Click edit to share some details about yourself!"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Card 2: Traits ── */}
                    <div className="p-card">
                        <div className="p-card-label">Physical traits</div>
                        
                        {isEditingTraits ? (
                            <div className="traits-grid">
                                <div className="trait-item gender">
                                    <label className="trait-label" htmlFor="genderSelect">Gender</label>
                                    <select
                                        id="genderSelect"
                                        className="trait-input-select"
                                        value={editedGender}
                                        onChange={(e) => setEditedGender(e.target.value)}
                                    >
                                        <option value="M">M</option>
                                        <option value="F">F</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="trait-item age">
                                    <label className="trait-label" htmlFor="ageInput">Age</label>
                                    <input
                                        id="ageInput"
                                        type="number"
                                        className="trait-input-field"
                                        value={editedAge}
                                        onChange={(e) => setEditedAge(Number(e.target.value))}
                                    />
                                </div>
                                <div className="trait-item height">
                                    <label className="trait-label" htmlFor="heightInput">Height (cm)</label>
                                    <input
                                        id="heightInput"
                                        type="number"
                                        className="trait-input-field"
                                        value={editedHeight}
                                        onChange={(e) => setEditedHeight(Number(e.target.value))}
                                    />
                                </div>
                                <div className="trait-item weight">
                                    <label className="trait-label" htmlFor="weightInput">Weight (kg)</label>
                                    <input
                                        id="weightInput"
                                        type="number"
                                        className="trait-input-field"
                                        value={editedWeight}
                                        onChange={(e) => setEditedWeight(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="traits-grid">
                                <div className="trait-item gender">
                                    <div className="trait-label">Gender</div>
                                    <div className="trait-value">{user?.gender || "N/A"}</div>
                                </div>
                                <div className="trait-item age">
                                    <div className="trait-label">Age</div>
                                    <div className="trait-value">{user?.age || "N/A"}<em>yrs</em></div>
                                </div>
                                <div className="trait-item height">
                                    <div className="trait-label">Height</div>
                                    <div className="trait-value">{user?.height || "N/A"}<em>cm</em></div>
                                </div>
                                <div className="trait-item weight">
                                    <div className="trait-label">Weight</div>
                                    <div className="trait-value">{user?.weight || "N/A"}<em>kg</em></div>
                                </div>
                            </div>
                        )}

                        <div className="trait-edit-row">
                            {isEditingTraits ? (
                                <>
                                    <button className="trait-edit-btn" onClick={handleSaveTraits}>
                                        Save
                                    </button>
                                    <button 
                                        className="trait-edit-btn" 
                                        onClick={() => setIsEditingTraits(false)} 
                                        style={{ 
                                            background: "rgba(239, 68, 68, 0.08)", 
                                            color: "#ef4444", 
                                            borderColor: "rgba(239, 68, 68, 0.18)" 
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button className="trait-edit-btn" onClick={handleStartEdit}>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── Card 3: Health Snapshot ── */}
                    <div className="p-card health-snapshot-card">
                        <div className="p-card-label">Health snapshot</div>

                        <div className="health-snapshot-body">
                            {/* Left: Fitness Score Ring */}
                            <div className="fitness-ring-wrap">
                                <svg width="88" height="88" viewBox="0 0 88 88">
                                    <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="8" />
                                    <circle
                                        cx="44" cy="44" r="36"
                                        fill="none"
                                        stroke="url(#ringGrad)"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={dashOffset}
                                        transform="rotate(-90 44 44)"
                                        style={{ transition: "stroke-dashoffset 1s ease" }}
                                    />
                                    <defs>
                                        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#a78bfa" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="fitness-ring-inner">
                                    <span className="fitness-score-num">{fitnessScore}</span>
                                    <span className="fitness-score-lbl">score</span>
                                </div>
                            </div>

                            {/* Right: metrics */}
                            <div className="health-metrics-col">
                                {/* BMI */}
                                <div className="hm-row">
                                    <div className="hm-icon" style={{ background: bmiCat.bg, color: bmiCat.color }}>
                                        <FontAwesomeIcon icon={faWeightScale} />
                                    </div>
                                    <div className="hm-info">
                                        <div className="hm-label">BMI</div>
                                        <div className="hm-val">
                                            {bmi}
                                            <span className="hm-badge" style={{ background: bmiCat.bg, color: bmiCat.color }}>{bmiCat.label}</span>
                                        </div>
                                        <div className="bmi-bar">
                                            <div className="bmi-bar-fill" style={{ width: `${bmiPct}%`, background: bmiCat.color }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Body Water */}
                                <div className="hm-row">
                                    <div className="hm-icon" style={{ background: "rgba(56,189,248,0.12)", color: "#38bdf8" }}>
                                        <FontAwesomeIcon icon={faDroplet} />
                                    </div>
                                    <div className="hm-info">
                                        <div className="hm-label">Body water</div>
                                        <div className="hm-val">{bodyWaterPct}<em>%</em></div>
                                    </div>
                                </div>

                                {/* Ideal weight */}
                                <div className="hm-row">
                                    <div className="hm-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
                                        <FontAwesomeIcon icon={faDumbbell} />
                                    </div>
                                    <div className="hm-info">
                                        <div className="hm-label">Ideal weight</div>
                                        <div className="hm-val">{idealMin}–{idealMax}<em>kg</em></div>
                                    </div>
                                </div>

                                {/* Heart rate zone (placeholder) */}
                                <div className="hm-row">
                                    <div className="hm-icon" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                                        <FontAwesomeIcon icon={faHeartPulse} />
                                    </div>
                                    <div className="hm-info">
                                        <div className="hm-label">Max heart rate</div>
                                        <div className="hm-val">{220 - (user?.age || 25)}<em>bpm</em></div>
                                    </div>
                                </div>
                            </div>
                        </div>
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



            {/* ── Password Change Modal ── */}
            {showPasswordModal && (
                <div className="s-modal-overlay" onClick={() => setShowPasswordModal(false)}>
                    <div className="s-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="s-modal-header">
                            <div className="s-modal-title">
                                <FontAwesomeIcon icon={faLock} />
                                <span>Change Password</span>
                            </div>
                            <button
                                className="s-modal-close"
                                onClick={() => setShowPasswordModal(false)}
                                type="button"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordChange}>
                            <div className="s-modal-body">
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "4px" }}>
                                    Introduceți parola curentă de două ori pentru confirmare, urmată de noua parolă.
                                </p>

                                {/* Parola actuală */}
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <div className="s-modal-input-wrapper">
                                        <FontAwesomeIcon icon={faLock} className="s-modal-input-icon" />
                                        <input
                                            className="s-input"
                                            type={showCurrentPassword ? "text" : "password"}
                                            placeholder="Introduceți parola curentă"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="s-modal-eye-btn"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>

                                {/* Confirmă parola actuală */}
                                <div className="form-group">
                                    <label>Confirm Current Password</label>
                                    <div className="s-modal-input-wrapper">
                                        <FontAwesomeIcon icon={faLock} className="s-modal-input-icon" />
                                        <input
                                            className="s-input"
                                            type={showConfirmCurrentPassword ? "text" : "password"}
                                            placeholder="Reintroduceți parola curentă"
                                            value={confirmCurrentPassword}
                                            onChange={(e) => setConfirmCurrentPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="s-modal-eye-btn"
                                            onClick={() => setShowConfirmCurrentPassword(!showConfirmCurrentPassword)}
                                        >
                                            <FontAwesomeIcon icon={showConfirmCurrentPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>

                                {/* Noua parolă */}
                                <div className="form-group">
                                    <label>New Password</label>
                                    <div className="s-modal-input-wrapper">
                                        <FontAwesomeIcon icon={faLock} className="s-modal-input-icon" />
                                        <input
                                            className="s-input"
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Introduceți noua parolă (min. 6 caractere)"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="s-modal-eye-btn"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>

                                {passwordError && (
                                    <div className="s-modal-error-box animate-fup">
                                        <FontAwesomeIcon icon={faXmark} />
                                        <span>{passwordError}</span>
                                    </div>
                                )}

                                {passwordSuccess && (
                                    <div className="s-modal-success-box animate-fup">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <span>{passwordSuccess}</span>
                                    </div>
                                )}
                            </div>

                            <div className="s-modal-footer">
                                <button
                                    type="button"
                                    className="trait-edit-btn"
                                    style={{
                                        background: "rgba(239, 68, 68, 0.08)",
                                        color: "#ef4444",
                                        borderColor: "rgba(239, 68, 68, 0.18)"
                                    }}
                                    onClick={() => setShowPasswordModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="trait-edit-btn"
                                    disabled={isUpdatingPassword}
                                >
                                    {isUpdatingPassword ? "Updating..." : "Change Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;