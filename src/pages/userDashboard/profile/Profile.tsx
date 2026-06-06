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
    faClock,
    faCalendarDay,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import "../UserDashboard.css";
import WorkoutDetailsModal from "../modals/WorkoutDetailsModal";

// ─── Component ───────────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();

    // State pentru utilizatorul curent
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    // State pentru editarea trăsăturilor fizice
    const [isEditingTraits, setIsEditingTraits] = useState(false);
    const [editedGender, setEditedGender] = useState("M");
    const [editedAge, setEditedAge] = useState<number>(24);
    const [editedHeight, setEditedHeight] = useState<number>(180);
    const [editedWeight, setEditedWeight] = useState<number>(75);

    const [weightHistory, setWeightHistory] = useState<any[]>([]);
    const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);

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

    // Workout details modal
    const [viewingWorkout, setViewingWorkout] = useState<any>(null);

    // Modal ștergere cont
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteCode, setDeleteCode] = useState(["", "", "", ""]);
    const [deleteError, setDeleteError] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState("");
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [isRequestingDelete, setIsRequestingDelete] = useState(false);

    // Fake password pentru afișare
    const fakePassword = "MySecretPass123";
    const token = localStorage.getItem("token");

    const fetchUser = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
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

    const fetchWeightHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5004/api/WeightLog/history?limit=5", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setWeightHistory(data);
            }
        } catch (err) {
            console.error("Error fetching weight history:", err);
        }
    };

    const fetchRecentWorkouts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5004/api/workout/list", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Sortează după dată descrescător
                data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setRecentWorkouts(data.slice(0, 3));
            }
        } catch (err) {
            console.error("Error fetching recent workouts:", err);
        }
    };

    const handleDeleteWeight = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this weight log?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5004/api/WeightLog/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                fetchWeightHistory();
                fetchUser(); // to update current weight maybe, though not strictly required
            } else {
                alert("Could not delete weight log.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteWorkout = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this workout?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5004/api/workout/delete/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                fetchRecentWorkouts();
            } else {
                alert("Could not delete workout.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchWeightHistory();
        fetchRecentWorkouts();
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
            // Updateăm gender, age, height
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

            if (!response.ok) {
                alert("Nu s-au putut actualiza datele fizice.");
                return;
            }

            // Dacă greutatea s-a schimbat, logăm și în WeightLog
            if (editedWeight !== user?.weight) {
                await fetch("http://localhost:5004/api/WeightLog", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ weight: editedWeight, loggedAt: new Date().toISOString() })
                });
                // Refresh weight history
                fetchWeightHistory();
            }

            await fetchUser();
            setIsEditingTraits(false);
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

    const handleRequestDelete = async () => {
        setIsRequestingDelete(true);
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5004/api/User/request-delete",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok)
                throw new Error("Failed to request account deletion.");

            // Deschide modalul pentru cod
            setShowDeleteModal(true);
            setDeleteCode(["", "", "", ""]);
            setDeleteError("");
            setDeleteSuccess("");
        } catch (err: any) {
            console.error(err);
            setDeleteError(err.message || "Failed to connect to the server.");
            setShowDeleteModal(true);
        } finally {
            setIsRequestingDelete(false);
        }
    };

    const handleDeleteCodeChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...deleteCode];
        newCode[index] = value;
        setDeleteCode(newCode);

        // Auto-focus next input
        if (value && index < 3) {
            const next = document.getElementById(`delete-code-${index + 1}`);
            next?.focus();
        }
    };

    const handleDeleteCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !deleteCode[index] && index > 0) {
            const prev = document.getElementById(`delete-code-${index - 1}`);
            prev?.focus();
        }
    };

    const handleDeleteCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
        if (pasted.length === 4) {
            setDeleteCode(pasted.split(""));
            const last = document.getElementById("delete-code-3");
            last?.focus();
        }
    };

    const handleConfirmDelete = async () => {
        const code = deleteCode.join("");
        if (code.length !== 4) {
            setDeleteError("Please enter the full 4-digit code.");
            return;
        }

        setDeleteError("");
        setIsDeletingAccount(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5004/api/User/me",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        email: user?.email,
                        code: code,
                    }),
                }
            );

            // Încearcă să parseze răspunsul JSON (dacă există)
            let data: any = null;
            try {
                data = await response.json();
            } catch {
                // Serverul poate returna un body gol (204 etc.)
            }

            if (!response.ok) {
                throw new Error(data?.message || "Failed to delete account.");
            }

            if (data && data.isSuccess === false) {
                throw new Error(data.message || "Failed to delete account.");
            }

            setDeleteSuccess("Account deleted successfully. Redirecting...");

            // Curăță toate datele de autentificare
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("isAuthenticated");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err: any) {
            setDeleteError(err.message || "Failed to delete account.");
        } finally {
            setIsDeletingAccount(false);
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
                        <span>Calendar</span>
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
                        <button className="ph-icon-btn" onClick={() => navigate('/settings')} title="Settings">
                            <FontAwesomeIcon icon={faUserGear} />
                        </button>
                        <button
                            className="profile-logout-btn"
                            onClick={handleRequestDelete}
                            title="Delete Account"
                            disabled={isRequestingDelete}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#dc2626',
                                border: 'none',
                                padding: '10px 16px',
                                borderRadius: '10px',
                                fontSize: '13px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                marginLeft: '12px'
                            }}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                            <span>{isRequestingDelete ? "Requesting..." : "Delete Account"}</span>
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
                                        step="0.1"
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

                    {/* ── Card 3: Weight Journey ── */}
                    <div className="p-card weight-journey-card">
                        <div className="p-card-label">Weight Journey</div>
                        <div className="weight-journey-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Current Weight</span>
                                    <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                        {weightHistory.length > 0 ? weightHistory[0].weight : (user?.weight || '--')} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>kg</span>
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Starting Weight</span>
                                    <span style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: '500' }}>
                                        {weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : (user?.weight || '--')} <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>kg</span>
                                    </span>
                                </div>
                            </div>

                            <div className="weight-history-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {weightHistory.slice(0, 4).map((log, i) => (
                                    <div key={log.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '2px solid #10b981' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                            <FontAwesomeIcon icon={faCalendarDay} style={{ color: '#10b981', opacity: 0.8 }} />
                                            {new Date(log.loggedAt).toLocaleDateString()}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{log.weight} kg</span>
                                            <button
                                                onClick={() => handleDeleteWeight(log.id)}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', opacity: 0.6, cursor: 'pointer', fontSize: '14px', padding: '4px' }}
                                                title="Delete weight log"
                                                type="button"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {weightHistory.length === 0 && (
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '12px 0' }}>No weight logs recorded yet.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Card 4: Recent Workouts ── */}
                    <div className="p-card recent-workouts-card">
                        <div className="p-card-label">Recent Workouts</div>
                        <div className="recent-workouts-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '1rem' }}>
                            {recentWorkouts.map((w, idx) => (
                                <div className="recent-workout-item" key={w.id || idx} onClick={() => setViewingWorkout(w)} style={{ cursor: "pointer", display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '3px solid #6366f1' }}>
                                    <div className="workout-icon-box" style={{ background: `${w.type === 'Strength' || w.type === 1 ? '#dc2626' : w.type === 'Cardio' || w.type === 0 ? '#059669' : '#9333ea'}20`, color: w.type === 'Strength' || w.type === 1 ? '#dc2626' : w.type === 'Cardio' || w.type === 0 ? '#059669' : '#9333ea', padding: '10px', borderRadius: '8px' }}>
                                        <FontAwesomeIcon icon={w.type === 'Strength' || w.type === 1 ? faDumbbell : w.type === 'Cardio' || w.type === 0 ? faHeartPulse : faPersonWalking} />
                                    </div>
                                    <div className="workout-text" style={{ flex: 1 }}>
                                        <div className="w-name" style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '15px' }}>{w.label || 'Workout Session'}</div>
                                        <div className="w-details" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{w.duration} min • {new Date(w.date).toLocaleDateString()}</div>
                                    </div>
                                    <button
                                        className="delete-weight-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteWorkout(w.id);
                                        }}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', opacity: 0.6, cursor: 'pointer' }}
                                        title="Delete this workout"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            ))}
                            {recentWorkouts.length === 0 && (
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '12px 0' }}>No recent workouts found.</div>
                            )}
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

            {/* ── Workout Details Modal ── */}
            {viewingWorkout && (
                <WorkoutDetailsModal
                    workout={viewingWorkout}
                    user={user}
                    onClose={() => setViewingWorkout(null)}
                />
            )}

            {/* ── Delete Account Modal ── */}
            {showDeleteModal && (
                <div className="s-modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="s-modal-card s-modal-card--danger" onClick={(e) => e.stopPropagation()}>
                        <div className="s-modal-header s-modal-header--danger">
                            <div className="s-modal-title s-modal-title--danger">
                                <FontAwesomeIcon icon={faTrash} />
                                <span>Delete Account</span>
                            </div>
                            <button
                                className="s-modal-close"
                                onClick={() => setShowDeleteModal(false)}
                                type="button"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        <div className="s-modal-body">
                            <div className="s-delete-warning-banner">
                                <FontAwesomeIcon icon={faTrash} />
                                <div>
                                    <strong>This action is permanent</strong>
                                    <p>All your data, progress, and account information will be permanently removed and cannot be recovered.</p>
                                </div>
                            </div>

                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "4px" }}>
                                We've sent a 4-digit verification code to <strong>{user?.email}</strong>. Enter it below to confirm deletion.
                            </p>

                            <div className="s-delete-code-group">
                                {deleteCode.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`delete-code-${i}`}
                                        className="s-delete-code-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleDeleteCodeChange(i, e.target.value)}
                                        onKeyDown={(e) => handleDeleteCodeKeyDown(i, e)}
                                        onPaste={i === 0 ? handleDeleteCodePaste : undefined}
                                        autoFocus={i === 0}
                                    />
                                ))}
                            </div>

                            {deleteError && (
                                <div className="s-modal-error-box">
                                    <span>⚠ {deleteError}</span>
                                </div>
                            )}

                            {deleteSuccess && (
                                <div className="s-modal-success-box">
                                    <FontAwesomeIcon icon={faCheck} />
                                    <span>{deleteSuccess}</span>
                                </div>
                            )}
                        </div>

                        <div className="s-modal-footer">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                style={{
                                    padding: "8px 16px",
                                    fontSize: "13px",
                                    width: "auto",
                                    border: "none",
                                    background: "transparent",
                                    color: "var(--text-muted)",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    fontFamily: "inherit"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="s-delete-confirm-btn"
                                onClick={handleConfirmDelete}
                                disabled={isDeletingAccount || !!deleteSuccess || deleteCode.join("").length !== 4}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                {isDeletingAccount ? "Deleting..." : "Confirm account deletion"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;