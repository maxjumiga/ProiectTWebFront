import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Authentication.css";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill everything in");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5004/api/session/auth",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        credential: email,
                        password
                    })
                }
            );

            if (!response.ok) {
                setError("Invalid email or password");
                return;
            }

            const data = await response.json();

            // JWT
            localStorage.setItem("token", data.token);

            // user info
            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            sessionStorage.setItem(
                "isAuthenticated",
                "true"
            );

            // onboarding status
            localStorage.setItem(
                "onboardingCompleted",
                data.onboardingCompleted ? "true" : "false"
            );

            // onboarding data
            if (data.onboardingData) {
                localStorage.setItem(
                    "onboarding",
                    JSON.stringify(data.onboardingData)
                );
            }

            // redirect
            if (data.onboardingCompleted) {
                navigate("/dashboard");
            } else {
                navigate("/onboarding");
            }

        } catch (err) {
            setError("Cannot connect to server");
        }
    };

    return (
        <div className="auth-container">
            <button className="back-btn" onClick={() => navigate('/')} type="button">
                <span className="back-arrow">←</span>
                Back
            </button>

            <div className="login-wrapper">
                <div className="login-card">

                    <div className="login-header">
                        <h1 className="login-title">Welcome back</h1>
                        <p className="login-subtitle">Sign in to your account</p>
                    </div>

                    {error && (
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(252, 175, 121, 0.1)', color: '#e65c00', fontSize: '0.875rem', fontWeight: 500, textAlign: 'center', border: '1px solid rgba(252, 175, 121, 0.2)' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Email / Username
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="email"
                                    className="form-input"
                                    type="text"
                                    placeholder="example@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="username"
                                />
                                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Password
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
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <FontAwesomeIcon icon={faEye} />
                                    ) : (
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button className="submit-btn" type="submit">
                            Sign In
                        </button>

                        <div className="google-txt">
                            OR
                        </div>

                        <button className="submit-btn" type="button">
                            Sign in with Google
                        </button>
                    </form>

                    <div className="form-footer">
                        <button
                            className="footer-link register"
                            onClick={() => navigate('/register')}
                            type="button"
                        >
                            Register
                        </button>

                        <button
                            className="footer-link muted"
                            type="button"
                        >
                            Forgot password?
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;