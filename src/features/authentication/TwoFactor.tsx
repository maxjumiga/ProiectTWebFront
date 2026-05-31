import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faShield, faCircleInfo, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import "./TwoFactor.css";

// Functie pentru decodarea JWT
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

const OTP_LENGTH = 4;

export default function TwoFactorPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve email from routing state
    const emailFromState = location.state?.email || "";
    const [email, setEmail] = useState(emailFromState);
    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    // If there is no email, redirect back to login
    useEffect(() => {
        if (!email) {
            setError("No email address provided. Redirecting to login...");
            const timerId = setTimeout(() => {
                navigate("/login");
            }, 3000);
            return () => clearTimeout(timerId);
        }
    }, [email, navigate]);

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const next = [...digits];
        next[index] = digit;
        setDigits(next);
        setError("");

        // Auto-advance focus to next input
        if (digit && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Go back on Backspace if current box is empty
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        const next = [...digits];
        pasted.split("").forEach((ch, i) => {
            next[i] = ch;
        });
        setDigits(next);
        setError("");

        // Focus the last filled box or the next empty box
        const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
        inputsRef.current[focusIdx]?.focus();
    };

    const code = digits.join("");
    const isComplete = code.length === OTP_LENGTH;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isComplete) return;

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5004/api/session/verify-2fa",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        code
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Invalid code. Please try again.");
            }

            const data = await response.json();

            if (!data || !data.token) {
                throw new Error("Invalid code. Please try again.");
            }

            setSuccess(true);

            // JWT token
            localStorage.setItem("token", data.token);
            
            // Decodare token
            const decoded = parseJwt(data.token);
            const role = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded?.role;

            sessionStorage.setItem("isAuthenticated", "true");

            // Onboarding status
            localStorage.setItem(
                "onboardingCompleted",
                data.onboardingCompleted ? "true" : "false"
            );

            // Onboarding data
            if (data.onboardingData) {
                localStorage.setItem("onboarding", JSON.stringify(data.onboardingData));
            }

            // Redirect
            setTimeout(() => {
                if (role === "Admin") {
                    navigate("/admin");
                } else if (data.onboardingCompleted) {
                    navigate("/dashboard");
                } else {
                    navigate("/onboarding");
                }
            }, 1500);

        } catch (err: any) {
            setError(err.message || "Connection to the server failed.");
            // Reset input fields on error for a fresh attempt
            setDigits(Array(OTP_LENGTH).fill(""));
            inputsRef.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <button className="back-btn" onClick={() => navigate("/login")} type="button">
                <span className="back-arrow">←</span>
                Back
            </button>

            <div className="login-wrapper">
                <div className="login-card 2fa-card">
                    <div className="login-header">
                        <div className="shield-icon-container">
                            <FontAwesomeIcon icon={faShield} className="shield-hero-icon" />
                        </div>
                        <h1 className="login-title">Two-Factor Authentication</h1>
                        <p className="login-subtitle">
                            Please enter the 4-digit code sent to your email.
                        </p>
                    </div>

                    {email && (
                        <div className="email-pill-container">
                            <div className="email-pill">
                                <FontAwesomeIcon icon={faEnvelope} />
                                <span>{email}</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            <FontAwesomeIcon icon={faCheck} />
                            <span>Verification successful! Logging in...</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="form-group">
                            <label className="form-label text-center">Verification Code</label>
                            <div className="otp-group" onPaste={handlePaste}>
                                {digits.map((d, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => {
                                            inputsRef.current[i] = el;
                                        }}
                                        className={`otp-input ${d ? "filled" : ""} ${error ? "input-error" : ""}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={d}
                                        onChange={(e) => handleChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        disabled={loading || success || !email}
                                        autoFocus={i === 0}
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            className="submit-btn"
                            type="submit"
                            disabled={!isComplete || loading || success || !email}
                        >
                            {loading ? "Verifying..." : "Verify & Continue"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
