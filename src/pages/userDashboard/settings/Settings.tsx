import React, { useState } from "react";
import { useEffect } from "react";
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
    faFont,
    faPen,
    faEye,
    faEyeSlash,
    faXmark,
    faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import "../UserDashboard.css";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";

// ─── Toggle component ─────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label className="s-toggle">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="s-toggle-slider" />
    </label>
);

// ─── Types ────────────────────────────────────────────────────────────────────
type NavSection = "general" | "securitate" | "cont";



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
    const [activeNav, setActiveNav] = useState<NavSection>("general");
    const [saved, setSaved] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        gender: "",
        age: 0,
        height: 0,
        weight: 0,
        goal: ""
    });
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);



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

    // Modal ștergere cont
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteCode, setDeleteCode] = useState(["", "", "", ""]);
    const [deleteError, setDeleteError] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState("");
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [isRequestingDelete, setIsRequestingDelete] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5004/api/User/me",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok)
                throw new Error("Failed");

            const resBody = await response.json();

            console.log("FULL RESPONSE:", resBody);
            console.log("DATA:", resBody.data);
            if (resBody.isSuccess && resBody.data) {
                setUserData(resBody.data);
                setTwoFA(
                    resBody.data.twoFactorEnabled
                );
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    const handleResetData = async () => {
        setShowResetConfirm(true);
    };

    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const confirmResetData = async () => {
        setShowResetConfirm(false);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5004/api/User/reset-data", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Data has been reset successfully.");
                window.location.reload();
            } else {
                alert("Failed to reset data.");
            }
        } catch (error) {
            console.error(error);
            alert("Error connecting to server.");
        }
    };

    const handleDeleteAccount = async () => {
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
                        email: userData.email,
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

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5004/api/User/me",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(userData),
                }
            );

            if (!response.ok)
                throw new Error("Failed to update");

            setSaved(true);

            setTimeout(() => setSaved(false), 2500);
        }
        catch (error) {
            console.error(error);
        }
    };

    const handleSaveField = async (field: "name" | "email") => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5004/api/User/me",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(userData),
                }
            );

            if (!response.ok)
                throw new Error("Failed to update");

            setSaved(true);
            setTimeout(() => setSaved(false), 2500);

            if (field === "name") {
                setIsEditingName(false);
            } else {
                setIsEditingEmail(false);
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (!currentPassword || !confirmCurrentPassword || !newPassword) {
            setPasswordError("All fields are required.");
            return;
        }

        if (currentPassword !== confirmCurrentPassword) {
            setPasswordError("The current passwords entered do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("The new password must be at least 6 characters.");
            return;
        }

        setIsUpdatingPassword(true);
        try {
            const token = localStorage.getItem("token");

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

            setPasswordSuccess("Password changed successfully!");

            setTimeout(() => {
                setShowPasswordModal(false);

                setCurrentPassword("");
                setConfirmCurrentPassword("");
                setNewPassword("");

                setPasswordError("");
                setPasswordSuccess("");
            }, 2000);
        } catch (err: any) {
            setPasswordError(err.message || "Failed to connect to the server.");
        } finally {
            setIsUpdatingPassword(false);
        }
    };



    const initials = (userData.name || "")
        .split(" ")
        .filter(Boolean)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    // ── Nav items ──
    const navItems: { id: NavSection; label: string; icon: React.ReactNode }[] = [
        { id: "general", label: "General", icon: <FontAwesomeIcon icon={faGear} /> },
        { id: "securitate", label: "Security", icon: <FontAwesomeIcon icon={faShield} /> },
        { id: "cont", label: "Account", icon: <FontAwesomeIcon icon={faUser} /> },
    ];

    return (
        <>
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
                    <button className="db-nav-item" onClick={() => navigate('/profile')}>
                        <FontAwesomeIcon icon={faUser} className="nav-item-icon" />
                        <span>Profile</span>
                    </button>
                    <button className="db-nav-item active" onClick={() => navigate('/settings')}>
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
                            <span className="user-display-name">{userData.name || "User"}</span>
                            <FontAwesomeIcon icon={faChevronRight} className="user-arrow-icon" />
                        </div>
                    </div>
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
                    </div>
                </div>

                {/* ══ GENERAL ══ */}
                {activeNav === "general" && (
                    <>


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
                                        <option defaultValue="Weekly">Weekly</option>
                                        <option>Lunar</option>
                                        <option>Never</option>
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
                                    <Toggle
                                        checked={twoFA}
                                        onChange={async () => {

                                            const newValue = !twoFA;

                                            setTwoFA(newValue);

                                            try {

                                                const token =
                                                    localStorage.getItem("token");

                                                await fetch(
                                                    "http://localhost:5004/api/User/me",
                                                    {
                                                        method: "PATCH",

                                                        headers: {
                                                            "Content-Type":
                                                                "application/json",

                                                            Authorization:
                                                                `Bearer ${token}`,
                                                        },

                                                        body: JSON.stringify({
                                                            twoFactorEnabled:
                                                                newValue
                                                        }),
                                                    }
                                                );
                                            }
                                            catch (error) {
                                                console.error(error);
                                            }
                                        }}
                                    />
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
                                    <button
                                        className="s-action-btn"
                                        onClick={() => {
                                            setShowPasswordModal(true);
                                            setCurrentPassword("");
                                            setConfirmCurrentPassword("");
                                            setNewPassword("");
                                            setPasswordError("");
                                            setPasswordSuccess("");
                                            setShowCurrentPassword(false);
                                            setShowConfirmCurrentPassword(false);
                                            setShowNewPassword(false);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faLock} />Change
                                    </button>
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
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                        <input
                                            className="s-input"
                                            value={userData.name}
                                            placeholder="Username"
                                            disabled={!isEditingName}
                                            onChange={(e) =>
                                                setUserData({
                                                    ...userData,
                                                    name: e.target.value
                                                })
                                            }
                                        />

                                        <button
                                            className="s-action-btn"
                                            onClick={() => {
                                                if (isEditingName) {
                                                    handleSaveField("name");
                                                } else {
                                                    setIsEditingName(true);
                                                }
                                            }}
                                        >
                                            {isEditingName ? (
                                                <>
                                                    <FontAwesomeIcon icon={faFloppyDisk} /> Save
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon icon={faPen} /> Change
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico purple"><FontAwesomeIcon icon={faEnvelope} /></div>
                                        <div>
                                            <div className="s-lbl">Email address</div>
                                            <div className="s-sub">Used for notifications and authentication</div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                        <input
                                            className="s-input"
                                            value={userData.email}
                                            placeholder="Email"
                                            disabled={!isEditingEmail}
                                            onChange={(e) =>
                                                setUserData({
                                                    ...userData,
                                                    email: e.target.value
                                                })
                                            }
                                        />

                                        <button
                                            className="s-action-btn"
                                            onClick={() => {
                                                if (isEditingEmail) {
                                                    handleSaveField("email");
                                                } else {
                                                    setIsEditingEmail(true);
                                                }
                                            }}
                                        >
                                            {isEditingEmail ? (
                                                <>
                                                    <FontAwesomeIcon icon={faFloppyDisk} /> Save
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon icon={faPen} /> Change
                                                </>
                                            )}
                                        </button>
                                    </div>
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
                                    <button className="s-action-btn danger" onClick={handleResetData} type="button">
                                        <FontAwesomeIcon icon={faArrowsRotate} />Reset
                                    </button>
                                </div>
                                <div className="s-row">
                                    <div className="s-row-left">
                                        <div className="s-ico red"><FontAwesomeIcon icon={faTrash} /></div>
                                        <div>
                                            <div className="s-lbl">Delete account</div>
                                            <div className="s-sub">Permanently removes account and all associated data</div>
                                        </div>
                                    </div>
                                    <button className="s-action-btn danger" onClick={handleDeleteAccount} type="button">
                                        <FontAwesomeIcon icon={faTrash} />Delete account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
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
                                    Enter your current password twice to confirm, followed by your new password.
                                </p>

                                {/* Parola actuală */}
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <div className="s-modal-input-wrapper">
                                        <FontAwesomeIcon icon={faLock} className="s-modal-input-icon" />
                                        <input
                                            className="s-input"
                                            type={showCurrentPassword ? "text" : "password"}
                                            placeholder="Enter current password"
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
                                            placeholder="Re-enter current password"
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
                                            placeholder="Enter new password (min. 6 characters)"
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
                                    <div className="s-modal-error-box">
                                        <span>⚠ {passwordError}</span>
                                    </div>
                                )}

                                {passwordSuccess && (
                                    <div className="s-modal-success-box">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <span>{passwordSuccess}</span>
                                    </div>
                                )}
                            </div>

                            <div className="s-modal-footer">
                                <button
                                    className="btn-ghost"
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    style={{ padding: "8px 16px", fontSize: "13px" }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="save-btn"
                                    type="submit"
                                    disabled={isUpdatingPassword || !!passwordSuccess}
                                    style={{ padding: "8px 16px", fontSize: "13px" }}
                                >
                                    {isUpdatingPassword ? "Saving..." : "Change password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
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
                                We've sent a 4-digit verification code to <strong>{userData.email}</strong>. Enter it below to confirm deletion.
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
            {showResetConfirm && (
            <ConfirmDeleteModal
                itemName={"all your data"}
                onConfirm={confirmResetData}
                onCancel={() => setShowResetConfirm(false)}
            />
            )}
        </>
    );
};

export default SettingsPage;