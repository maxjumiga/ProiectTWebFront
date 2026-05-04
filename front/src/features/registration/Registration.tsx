import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faEnvelope,
    faLock,
    faEye,
    faEyeSlash
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Registration.css";

const UserIcon = () => (
    <FontAwesomeIcon icon={faUser} className="input-icon" />
);

const MailIcon = () => (
    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
);

const LockIcon = () => (
    <FontAwesomeIcon icon={faLock} className="input-icon" />
);

const EyeOpenIcon = () => (
    <FontAwesomeIcon icon={faEye} />
);

const EyeClosedIcon = () => (
    <FontAwesomeIcon icon={faEyeSlash} />
);

const RegisterPage: React.FC = () => {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleConfirmChange = (val: string) => {
        setConfirm(val);
        if (val && val !== password) {
            setPasswordError("Parolele nu coincid.");
        } else {
            setPasswordError("");
        }
    };

    const handlePasswordChange = (val: string) => {
        setPassword(val);
        if (confirmPassword && val !== confirmPassword) {
            setPasswordError("Parolele nu coincid.");
        } else {
            setPasswordError("");
        }
    };

    const isValid =
        nickname.trim().length > 0 &&
        email.trim().length > 0 &&
        password.length >= 6 &&
        password === confirmPassword;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || password.length < 6) {
            setError('Invalid email or password (min 6 chars)');
            return;
        }

        let users: Record<string, any> = {};
        try {
            users = JSON.parse(localStorage.getItem('users') || '{}');
        } catch (e) { }

        if (users[email]) {
            setError('User already exists. Please log in.');
            return;
        }

        users[email] = { password, onboardingCompleted: false };
        localStorage.setItem('users', JSON.stringify(users));

        sessionStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ email }));
        localStorage.setItem('onboardingCompleted', 'false');

        navigate('/onboarding');
    };

    const confirmStatus =
        confirmPassword.length === 0
            ? ""
            : confirmPassword === password
                ? "input-success"
                : "input-error";

    return (
        <div className="auth-container">
            <button className="back-btn" onClick={() => navigate('/')} type="button">
                <span className="back-arrow">←</span>
                Înapoi
            </button>

            <div className="register-wrapper">
                <div className="register-card">

                    <div className="register-header">
                        <h1 className="register-title">Creează un cont</h1>
                        <p className="register-subtitle">Completează datele de mai jos pentru a te înregistra</p>
                    </div>

                    {error && (
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(252, 175, 121, 0.1)', color: '#e65c00', fontSize: '0.875rem', fontWeight: 500, textAlign: 'center', border: '1px solid rgba(252, 175, 121, 0.2)' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} autoComplete="off">

                        {/* Nickname */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="nickname">Nume utilizator</label>
                            <div className="input-wrapper">
                                <input
                                    id="nickname"
                                    className="form-input"
                                    type="text"
                                    placeholder="ex: ion_popescu"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    autoComplete="off"
                                />
                                <UserIcon />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Adresă Gmail</label>
                            <div className="input-wrapper">
                                <input
                                    id="email"
                                    className="form-input"
                                    type="email"
                                    placeholder="exemplu@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="off"
                                />
                                <MailIcon />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Parolă</label>
                            <div className="input-wrapper">
                                <input
                                    id="password"
                                    className="form-input has-eye"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Minim 6 caractere"
                                    value={password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    autoComplete="new-password"
                                />
                                <LockIcon />
                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
                                >
                                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">Confirmă parola</label>
                            <div className="input-wrapper">
                                <input
                                    id="confirmPassword"
                                    className={`form-input has-eye ${confirmStatus}`}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Repetă parola"
                                    value={confirmPassword}
                                    onChange={(e) => handleConfirmChange(e.target.value)}
                                    autoComplete="new-password"
                                />
                                <LockIcon />
                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
                                >
                                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                                </button>
                            </div>
                            {passwordError && (
                                <p className="input-error-msg">⚠ {passwordError}</p>
                            )}
                        </div>

                        <button className="submit-btn" type="submit" disabled={!isValid}>
                            Înregistrare
                        </button>
                    </form>

                    <div className="form-footer">
                        <span>Ai deja un cont?</span>
                        <button className="footer-link" onClick={() => navigate('/login')} type="button">
                            Autentifică-te
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RegisterPage;