import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faEnvelope,
    faLock,
    faEye,
    faEyeSlash
} from "@fortawesome/free-solid-svg-icons";
import "./inregistrare.css";

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

// const EyeOpenIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
//         <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
//         <circle cx="12" cy="12" r="3" />
//     </svg>
// );

// const EyeClosedIcon = () => (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
//         <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
//         <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
//         <line x1="1" y1="1" x2="23" y2="23" />
//     </svg>
// );

interface RegisterPageProps {
    onBack?: () => void;
    onLogin?: () => void;
    onSubmit?: (nickname: string, email: string, password: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
    onBack,
    onLogin,
    onSubmit,
}) => {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

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
        if (!isValid) return;
        onSubmit?.(nickname, email, password);
    };

    const confirmStatus =
        confirmPassword.length === 0
            ? ""
            : confirmPassword === password
                ? "input-success"
                : "input-error";

    return (
        <>
            {/* Back button — fixed top-left */}
            <button className="back-btn" onClick={onBack} type="button">
                <span className="back-arrow">←</span>
                Înapoi
            </button>

            <div className="register-wrapper">
                <div className="register-card">

                    <div className="register-header">
                        <h1 className="register-title">Creează un cont</h1>
                        <p className="register-subtitle">Completează datele de mai jos pentru a te înregistra</p>
                    </div>

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
                        <button className="footer-link" onClick={onLogin} type="button">
                            Autentifică-te
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default RegisterPage;