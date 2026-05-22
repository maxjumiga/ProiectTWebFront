import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faCircleInfo,
    faEye,
    faEyeSlash,
    faCheck
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim())
            return;

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5004/api/User/send-reset-code",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!data.isSuccess) {
                throw new Error(data.message);
            }

            onSubmit?.(email.trim());
        }
        catch (err: any) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
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

                        <button
                            className="submit-btn"
                            type="submit"
                            disabled={!email.trim() || loading}
                        >
                            {loading
                                ? "Sending..."
                                : "Send verification code"}
                        </button>
                    </form>
                    {error && (
                        <p className="input-error-msg">
                            ⚠ {error}
                        </p>
                    )}
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
    const [loading, setLoading] = useState(false);
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
        if (!isComplete)
            return;
        onSubmit?.(code);
    };

    const handleResend = async () => {
        try {
            await fetch(
                "http://localhost:5004/api/User/send-reset-code",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                    }),
                }
            );

            setTimer(RESEND_SECONDS);

            setDigits(
                Array(OTP_LENGTH).fill("")
            );

            setHasError(false);

            inputsRef.current[0]?.focus();
        }
        catch {
            setHasError(true);
        }
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

                        <button
                            className="submit-btn"
                            type="submit"
                            disabled={!isComplete || loading}
                        >
                            {loading ? "Verifying..." : "Verify code"}
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

export interface ResetPasswordProps {
    email: string;
    code: string;
    onBack: () => void;
    onSubmit: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordProps> = ({
    email,
    code,
    onBack,
    onSubmit,
}) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!newPassword || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError("The new password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                "http://localhost:5004/api/User/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        code,
                        newPassword,
                    }),
                }
            );

            const data = await response.json();
            if (!response.ok || !data.isSuccess) {
                throw new Error(data.message || "Failed to reset password.");
            }

            setSuccess(true);
            setTimeout(() => {
                onSubmit();
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recovery-page">
            <button className="back-btn" onClick={onBack} type="button" disabled={loading || success}>
                <span className="back-arrow">←</span>
                Back
            </button>

            <div className="recovery-wrapper">
                <div className="recovery-card">
                    <div className="recovery-header">
                        <h1 className="recovery-title">New password</h1>
                        <p className="recovery-subtitle">Create a secure password for your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="form-group">
                            <label className="form-label">New password</label>
                            <div className="input-wrapper" style={{ position: "relative" }}>
                                <input
                                    className="form-input"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={loading || success}
                                    style={{ paddingLeft: "16px", paddingRight: "42px" }}
                                    required
                                />
                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        color: "var(--text-muted)",
                                        cursor: "pointer"
                                    }}
                                >
                                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: "16px" }}>
                            <label className="form-label">Confirm password</label>
                            <div className="input-wrapper" style={{ position: "relative" }}>
                                <input
                                    className="form-input"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading || success}
                                    style={{ paddingLeft: "16px", paddingRight: "42px" }}
                                    required
                                />
                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        color: "var(--text-muted)",
                                        cursor: "pointer"
                                    }}
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="input-error-msg" style={{ marginTop: "12px" }}>
                                ⚠ {error}
                            </p>
                        )}

                        {success && (
                            <p className="input-success-msg" style={{ marginTop: "12px", color: "var(--success)" }}>
                                ✓ Password reset successfully! Redirecting...
                            </p>
                        )}

                        <button
                            className="submit-btn"
                            type="submit"
                            disabled={loading || success}
                            style={{ marginTop: "24px" }}
                        >
                            {loading ? "Resetting..." : "Reset password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default function ForgotPasswordFlow() {
    const [step, setStep] = useState<"email" | "code" | "password">("email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    if (step === "email") {
        return (
            <ForgotPasswordPage
                onBack={() => navigate("/login")}
                onSubmit={(enteredEmail) => {
                    setEmail(enteredEmail);
                    setStep("code");
                }}
            />
        );
    }

    if (step === "code") {
        return (
            <VerifyCodePage
                email={email}
                onBack={() => setStep("email")}
                onSubmit={(enteredCode) => {
                    setCode(enteredCode);
                    setStep("password");
                }}
            />
        );
    }

    return (
        <ResetPasswordPage
            email={email}
            code={code}
            onBack={() => setStep("code")}
            onSubmit={() => {
                navigate("/login");
            }}
        />
    );
}