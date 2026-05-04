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
            setPasswordError("Passwords do not match.");
        } else {
            setPasswordError("");
        }
    };

    const handlePasswordChange = (val: string) => {
        setPassword(val);
        if (confirmPassword && val !== confirmPassword) {
            setPasswordError("Passwords do not match.");
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
                Back
            </button>

            <div className="register-wrapper">
                <div className="register-card">

                    <div className="register-header">
                        <h1 className="register-title">Create an account</h1>
                        <p className="register-subtitle">Fill in the details below to register</p>
                    </div>

                    {error && (
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(252, 175, 121, 0.1)', color: '#e65c00', fontSize: '0.875rem', fontWeight: 500, textAlign: 'center', border: '1px solid rgba(252, 175, 121, 0.2)' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} autoComplete="off">

                        {/* Nickname */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="nickname">Username</label>
                            <div className="input-wrapper">
                                <input
                                    id="nickname"
                                    className="form-input"
                                    type="text"
                                    placeholder="e.g.: john_doe"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    autoComplete="off"
                                />
                                <UserIcon />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email address</label>
                            <div className="input-wrapper">
                                <input
                                    id="email"
                                    className="form-input"
                                    type="email"
                                    placeholder="example@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="off"
                                />
                                <MailIcon />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <input
                                    id="password"
                                    className="form-input has-eye"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="At least 6 characters"
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
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                            <div className="input-wrapper">
                                <input
                                    id="confirmPassword"
                                    className={`form-input has-eye ${confirmStatus}`}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Repeat password"
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
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                                </button>
                            </div>
                            {passwordError && (
                                <p className="input-error-msg">⚠ {passwordError}</p>
                            )}
                        </div>

                        <button className="submit-btn" type="submit" disabled={!isValid}>
                            Register
                        </button>
                    </form>

                    <div className="form-footer">
                        <span>Already have an account?</span>
                        <button className="footer-link" onClick={() => navigate('/login')} type="button">
                            Sign in
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RegisterPage;