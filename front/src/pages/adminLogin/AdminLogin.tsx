// ============================================================
// pages/adminLogin/AdminLogin.tsx — Pagina de autentificare admin
// Pagina separata de login dedicata exclusiv administratorilor.
// Credentiale hardcoded (fara backend): admin@sanatate.ro / admin2026
// La autentificare reusita, seteaza sessionStorage si redirectioneaza
// catre panoul admin (/admin).
// ============================================================

import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHeartPulse,
    faEnvelope,
    faLock,
    faEye,
    faEyeSlash,
    faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import './AdminLogin.css';

// Credentiale admin hardcoded (frontend-only, fara backend)
const ADMIN_CREDENTIALS = {
    email: 'admin@omnitrack.ro',
    password: 'admin2026',
};

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulam o mica intarziere pentru UX
        setTimeout(() => {
            if (
                email.trim() === ADMIN_CREDENTIALS.email &&
                password === ADMIN_CREDENTIALS.password
            ) {
                // Autentificare reusita — setam sessionStorage
                sessionStorage.setItem('isAdminAuthenticated', 'true');
                navigate('/admin', { replace: true });
            } else {
                setError('Incorrect email or password.');
                setLoading(false);
            }
        }, 600);
    };

    return (
        <div className="admin-login-page">
            {/* Fundal animat cu gradient */}
            <div className="admin-login-bg" />

            <div className="admin-login-card">

                {/* Header card */}
                <div className="admin-login-header">
                    <div className="admin-login-logo">
                        <img src="/favicon.svg" alt="OmniTrack Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    </div>
                    <h1 className="admin-login-title">OmniTrack</h1>
                    <p className="admin-login-subtitle">Administration Panel</p>
                </div>

                {/* Badge admin */}
                <div className="admin-login-badge">
                    <FontAwesomeIcon icon={faShieldHalved} />
                    <span>Restricted access — Administrators only</span>
                </div>

                {/* Formular */}
                <form className="admin-login-form" onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="admin-form-group">
                        <label htmlFor="admin-email">Administrator email</label>
                        <div className="admin-input-wrap">
                            <FontAwesomeIcon icon={faEnvelope} className="admin-input-icon" />
                            <input
                                id="admin-email"
                                type="email"
                                placeholder="admin@omnitrack.ro"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="admin-input"
                            />
                        </div>
                    </div>

                    {/* Parola */}
                    <div className="admin-form-group">
                        <label htmlFor="admin-password">Password</label>
                        <div className="admin-input-wrap">
                            <FontAwesomeIcon icon={faLock} className="admin-input-icon" />
                            <input
                                id="admin-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="admin-input"
                            />
                            <button
                                type="button"
                                className="admin-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>

                    {/* Eroare */}
                    {error && (
                        <div className="admin-login-error">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="admin-login-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="admin-login-spinner" />
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>

                <p className="admin-login-footer">
                    Not an administrator? <a href="/">Back to app</a>
                </p>
            </div>
        </div>
    );
}
