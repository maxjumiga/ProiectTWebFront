import React, { useState } from "react";
import "./autentificare.css";

const MailIcon = () => (
    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="M2 7l10 7 10-7" />
    </svg>
);

const LockIcon = () => (
    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
);

interface LoginPageProps {
    onBack?: () => void;
    onRegister?: () => void;
    onForgotPassword?: () => void;
    onSubmit?: (email: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
                                                 onBack,
                                                 onRegister,
                                                 onForgotPassword,
                                                 onSubmit,
                                             }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(email, password);
    };

    return (
        <>
            {/* Back button — fixed top-left corner */}
            <button className="back-btn" onClick={onBack} type="button">
                <span className="back-arrow">←</span>
                Înapoi
            </button>

            {/* Login card — centered */}
            <div className="login-wrapper">
                <div className="login-card">

                    <div className="login-header">
                        <h1 className="login-title">Bun venit înapoi</h1>
                        <p className="login-subtitle">Autentifică-te în contul tău</p>
                    </div>

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
                                <MailIcon />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Parolă
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="password"
                                    className="form-input"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <LockIcon />
                            </div>
                        </div>

                        <button className="submit-btn" type="submit">
                            Autentificare
                        </button>
                    </form>

                    <div className="form-footer">
                        <button className="footer-link register" onClick={onRegister} type="button">
                            Înregistrare
                        </button>
                        <button className="footer-link" onClick={onForgotPassword} type="button">
                            Ai uitat parola?
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default LoginPage;