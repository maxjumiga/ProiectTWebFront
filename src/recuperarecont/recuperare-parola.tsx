import React, { useState, useRef, useEffect } from "react";
import "./recuperare-parola.css";

// ─── Icons ───────────────────────────────────────────────────────────────────

const MailIcon = () => (
    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="M2 7l10 7 10-7" />
    </svg>
);

const LockOpenIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C18.25 22.15 22 17.25 22 12V6l-9-4z" />
    </svg>
);

const InfoIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="info-box-icon">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const MailBadgeIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="M2 7l10 7 10-7" />
    </svg>
);

// ─── Pagina 1: Introducere email ─────────────────────────────────────────────

interface ForgotPasswordProps {
    onBack?: () => void;
    onSubmit?: (email: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordProps> = ({ onBack, onSubmit }) => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) onSubmit?.(email.trim());
    };

    return (
        <>
            <button className="back-btn" onClick={onBack} type="button">
                <span className="back-arrow">←</span>
                Înapoi
            </button>

            <div className="recovery-wrapper">
                <div className="recovery-card">

                    <div className="icon-badge">
                        <LockOpenIcon />
                    </div>

                    <div className="recovery-header">
                        <h1 className="recovery-title">Recuperare parolă</h1>
                        <p className="recovery-subtitle">Introdu adresa de email asociată contului tău.</p>
                    </div>

                    <div className="info-box">
                        <InfoIcon />
                        <p className="info-box-text">
                            Îți vom trimite un <strong>cod de verificare</strong> din 6 cifre pe adresa ta de email.
                            Codul este valabil <strong>10 minute</strong> și poate fi folosit o singură dată.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="form-group">
                            <label className="form-label" htmlFor="recovery-email">Adresă email</label>
                            <div className="input-wrapper">
                                <input
                                    id="recovery-email"
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

                        <button className="submit-btn" type="submit" disabled={!email.trim()}>
                            Trimite cod de verificare
                        </button>
                    </form>

                    <div className="form-footer">
                        <span>Ți-ai amintit parola?</span>
                        <button className="footer-link" onClick={onBack} type="button">
                            Autentifică-te
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

// ─── Pagina 2: Verificare cod OTP ────────────────────────────────────────────

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

interface VerifyCodeProps {
    email?: string;
    onBack?: () => void;
    onSubmit?: (code: string) => void;
    onResend?: () => void;
}

export const VerifyCodePage: React.FC<VerifyCodeProps> = ({
                                                              email = "exemplu@gmail.com",
                                                              onBack,
                                                              onSubmit,
                                                              onResend,
                                                          }) => {
    const [digits, setDigits]     = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [hasError, setHasError] = useState(false);
    const [timer, setTimer]       = useState(RESEND_SECONDS);
    const inputsRef               = useRef<(HTMLInputElement | null)[]>([]);

    // countdown timer
    useEffect(() => {
        if (timer <= 0) return;
        const id = setTimeout(() => setTimer((t) => t - 1), 1000);
        return () => clearTimeout(id);
    }, [timer]);

    const handleChange = (index: number, value: string) => {
        // accept only one digit
        const digit = value.replace(/\D/g, "").slice(-1);
        const next = [...digits];
        next[index] = digit;
        setDigits(next);
        setHasError(false);

        // auto-advance
        if (digit && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        const next = [...digits];
        pasted.split("").forEach((ch, i) => { next[i] = ch; });
        setDigits(next);
        const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
        inputsRef.current[focusIdx]?.focus();
    };

    const code = digits.join("");
    const isComplete = code.length === OTP_LENGTH;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isComplete) return;
        // simulate wrong code for demo — in production, call your API here
        onSubmit?.(code);
    };

    const handleResend = () => {
        setTimer(RESEND_SECONDS);
        setDigits(Array(OTP_LENGTH).fill(""));
        setHasError(false);
        inputsRef.current[0]?.focus();
        onResend?.();
    };

    const formatTimer = (s: number) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    return (
        <>
            <button className="back-btn" onClick={onBack} type="button">
                <span className="back-arrow">←</span>
                Înapoi
            </button>

            <div className="recovery-wrapper">
                <div className="recovery-card">

                    <div className="icon-badge">
                        <ShieldIcon />
                    </div>

                    <div className="recovery-header">
                        <h1 className="recovery-title">Verifică email-ul</h1>
                        <p className="recovery-subtitle">
                            Am trimis un cod de 6 cifre la adresa:
                        </p>
                        <div className="email-pill">
                            <MailBadgeIcon />
                            {email}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="form-group">
                            <label className="form-label">Cod de verificare</label>
                            <div className="otp-group" onPaste={handlePaste}>
                                {digits.map((d, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { inputsRef.current[i] = el; }}
                                        className={`otp-input${d ? " filled" : ""}${hasError ? " input-error" : ""}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={d}
                                        onChange={(e) => handleChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        autoFocus={i === 0}
                                    />
                                ))}
                            </div>
                            {hasError && (
                                <p className="input-error-msg">⚠ Cod incorect. Încearcă din nou.</p>
                            )}
                        </div>

                        <button className="submit-btn" type="submit" disabled={!isComplete}>
                            Verifică codul
                        </button>
                    </form>

                    <div className="resend-row">
                        <span>Nu ai primit codul?</span>
                        {timer > 0 ? (
                            <span className="resend-timer">Retrimite în {formatTimer(timer)}</span>
                        ) : (
                            <button className="resend-btn" onClick={handleResend} type="button">
                                Retrimite cod
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};