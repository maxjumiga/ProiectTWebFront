import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Autentificare.css";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill everything in');
            return;
        }

        // Verificare credentiale admin — daca match, acces direct in panoul admin
        if (email.trim() === 'admin@sanatate.ro' && password === 'admin2026') {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            sessionStorage.setItem('isAuthenticated', 'true');
            navigate('/admin');
            return;
        }

        let users: Record<string, any> = {};
        try {
            users = JSON.parse(localStorage.getItem('users') || '{}');
        } catch (e) { }

        const userRecord = users[email];
        if (!userRecord || userRecord.password !== password) {
            setError('Invalid email or password');
            return;
        }

        sessionStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ email }));

        if (userRecord.onboardingData) {
            localStorage.setItem('onboarding', JSON.stringify(userRecord.onboardingData));
        }

        localStorage.setItem('onboardingCompleted', userRecord.onboardingCompleted ? 'true' : 'false');

        if (userRecord.onboardingCompleted) {
            navigate('/dashboard');
        } else {
            navigate('/onboarding');
        }
    };

    return (
        <div className="auth-container">
            <button className="back-btn" onClick={() => navigate('/')} type="button">
                <span className="back-arrow">←</span>
                Înapoi
            </button>

            <div className="login-wrapper">
                <div className="login-card">

                    <div className="login-header">
                        <h1 className="login-title">Bun venit înapoi</h1>
                        <p className="login-subtitle">Autentifică-te în contul tău</p>
                    </div>

                    {error && (
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(252, 175, 121, 0.1)', color: '#e65c00', fontSize: '0.875rem', fontWeight: 500, textAlign: 'center', border: '1px solid rgba(252, 175, 121, 0.2)' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Gmail / Utilizator
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="email"
                                    className="form-input"
                                    type="text"
                                    placeholder="exemplu@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="username"
                                />
                                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Parolă
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="password"
                                    className="form-input has-eye"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <FontAwesomeIcon icon={faLock} className="input-icon" />
                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
                                >
                                    {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                                </button>
                            </div>
                        </div>

                        <button className="submit-btn" type="submit">
                            Autentificare
                        </button>

                        <div className="google-txt">
                            SAU
                        </div>

                        <button className="submit-btn" type="button">
                            Autentificare cu Google
                        </button>
                    </form>

                    <div className="form-footer">
                        <button className="footer-link register" onClick={() => navigate('/register')} type="button">
                            Înregistrare
                        </button>
                        <button className="footer-link muted" type="button">
                            Ai uitat parola?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;