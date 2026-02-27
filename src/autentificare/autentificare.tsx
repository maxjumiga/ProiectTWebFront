import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
    faEyeSlash
} from "@fortawesome/free-regular-svg-icons";
import {
    faEnvelope,
    faLock
} from "@fortawesome/free-solid-svg-icons";
import "./autentificare.css";

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
    const [showPassword, setShowPassword] = useState(false);

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
                        <button className="footer-link register" onClick={onRegister} type="button">
                            Înregistrare
                        </button>
                        <button className="footer-link muted" onClick={onForgotPassword} type="button">
                            Ai uitat parola?
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default LoginPage;