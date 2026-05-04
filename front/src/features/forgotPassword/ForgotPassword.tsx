import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import "./ForgotPassword.css";

// ─── Icons ───────────────────────────────────────────────────────────────────

const MailIcon = () => (
    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
);

const InfoIcon = () => (
    <FontAwesomeIcon icon={faCircleInfo} className="info-box-icon" />
);

const MailBadgeIcon = () => (
    <FontAwesomeIcon icon={faEnvelope} />
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
        <div className="recovery-page">
            <button className="back-btn" onClick={onBack} type="button">
                <span className="back-arrow">←</span>
                Back
            </button>

            <div className="recovery-wrapper">
                <div className="recovery-card">

                    <div className="recovery-header">
                        <h1 className="recovery-title">Password recovery</h1>
                        <p className="recovery-subtitle">Enter the email address associated with your account.</p>
                    </div>

                    <div className="info-box">
                        <InfoIcon />
                        <p className="info-box-text">
                            We will send a 6-digit <strong>verification code</strong> to your email address.
                            The code is valid for <strong>10 minutes</strong> and can be used only once.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="form-group">
                            <label className="form-label" htmlFor="recovery-email">Email address</label>
                            <div className="input-wrapper">
                                <input
                                    id="recovery-email"
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

                        <button className="submit-btn" type="submit" disabled={!email.trim()}>
                            Send verification code
                        </button>
                    </form>

                    <div className="form-footer">
                        <span>Remembered your password?</span>
                        <button className="footer-link" onClick={onBack} type="button">
                            Log in
                        </button>
                    </div>

                </div>
            </div>
        </div>
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
    email = "example@gmail.com",
    onBack,
    onSubmit,
    onResend,
}) => {
    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [hasError, setHasError] = useState(false);
    const [timer, setTimer] = useState(RESEND_SECONDS);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

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
        <div className="recovery-page">
            <button className="back-btn" onClick={onBack} type="button">
                <span className="back-arrow">←</span>
                Back
            </button>

            <div className="recovery-wrapper">
                <div className="recovery-card">

                    <div className="recovery-header">
                        <h1 className="recovery-title">Verify email</h1>
                        <p className="recovery-subtitle">
                            We sent a 6-digit code to the address:
                        </p>
                        <div className="email-pill">
                            <MailBadgeIcon />
                            {email}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="form-group">
                            <label className="form-label">Verification code</label>
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
                                <p className="input-error-msg">⚠ Incorrect code. Try again.</p>
                            )}
                        </div>

                        <button className="submit-btn" type="submit" disabled={!isComplete}>
                            Verify code
                        </button>
                    </form>

                    <div className="resend-row">
                        <span>Didn't receive the code?</span>
                        {timer > 0 ? (
                            <span className="resend-timer">Resend in {formatTimer(timer)}</span>
                        ) : (
                            <button className="resend-btn" onClick={handleResend} type="button">
                                Resend code
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};