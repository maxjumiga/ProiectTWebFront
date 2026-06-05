import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faDroplet, faGlassWater, faXmark, faCoffee } from "@fortawesome/free-solid-svg-icons";

interface WaterModalProps {
    waterMl: number;
    waterMax: number;
    onClose: () => void;
    onUpdate: (ml: number) => void;
    onResetWater: () => void;
}

const WaterBottle: React.FC<{ pct: number }> = ({ pct }) => {
    const capped = Math.min(Math.max(pct, 0), 1);
    const bW = 28;
    const bH = 70;
    const bY = 18;
    const fH = Math.max(0, Math.min(bH - 12, bH * capped));
    const fY = bY + bH - fH - 1;

    return (
        <svg className="water-bottle-svg" viewBox="0 0 42 92" fill="none">
            <defs>
                <clipPath id="bc"><rect x="7" y={bY} width={bW} height={bH} rx="5" /></clipPath>
                <linearGradient id="wf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
            </defs>
            <rect x={(42 - 13) / 2} y="2" width={13} height={40} rx="3" fill="#cbd5e1" />
            <rect x="7" y={bY} width={bW} height={bH} rx="5" fill="#f4f6fb" stroke="#e4e7f0" strokeWidth="1.5" />
            <rect x="7" y={fY} width={bW} height={fH} fill="url(#wf)" clipPath="url(#bc)" style={{ transition: "all 0.5s ease" }} />
            <rect x="11" y={bY + 5} width="3" height={bH - 10} rx="1.5" fill="white" opacity="0.3" />
            {[0.33, 0.66].map((v, i) => (
                <line key={i} x1="7" x2="15" y1={bY + bH - bH * v} y2={bY + bH - bH * v} stroke="#bfdbfe" strokeWidth="1" strokeDasharray="2 2" />
            ))}
        </svg>
    );
};

const WaterModal: React.FC<WaterModalProps> = ({ waterMl, waterMax, onClose, onUpdate, onResetWater }) => {
    const [customStr, setCustomStr] = useState("");
    const customVal = parseInt(customStr, 10);
    const customOk = !isNaN(customVal) && customVal > 0;
    const pct = Math.min((waterMl / waterMax) * 100, 100);

    const add = async (ml: number) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5004/api/WaterLog/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ amountMl: ml })
            });

            if (!response.ok) {
                throw new Error("Failed to add water");
            }

            onUpdate(waterMl + ml);
            setCustomStr("");
        } catch (err) {
            console.error(err);
        }
    };

    const sub = async (ml: number) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5004/api/WaterLog/remove", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ amountMl: ml })
            });

            if (!response.ok) {
                throw new Error("Failed to remove water");
            }

            onUpdate(Math.max(waterMl - ml, 0));
            setCustomStr("");
        } catch (err) {
            console.error(err);
        }
    };

    const getHydrationStatus = () => {
        if (pct >= 100) return { label: "Goal Reached!", color: "#10b981" };
        if (pct >= 66) return { label: "Almost there!", color: "#f97316" };
        if (pct >= 33) return { label: "Keep it up!", color: "#0ea5e9" };
        return { label: "Stay hydrated!", color: "#6366f1" };
    };

    const hydStatus = getHydrationStatus();
    const presets = [
        { label: "Espresso", ml: 50, icon: faCoffee },
        { label: "Glass", ml: 200, icon: faGlassWater },
        { label: "Bottle", ml: 500, icon: faDroplet },
        { label: "Large", ml: 750, icon: faGlassWater },
    ];

    return (
        <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="db-modal-card">
                <div className="db-modal-header">
                    <div className="db-modal-title">
                        <span className="db-modal-icon water-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesomeIcon icon={faDroplet} style={{ color: "#0ea5e9" }} />
                        </span>
                        Water Consumed Today
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="db-btn-secondary" onClick={onResetWater} style={{ padding: '6px 12px', fontSize: '11px', color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}>
                            Reset All
                        </button>
                        <button className="db-modal-close" onClick={onClose} type="button">
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                </div>

                <div className="db-modal-body">
                    <div className="db-modal-section water-status-section">
                        <div className="water-modal-top">
                            <WaterBottle pct={waterMl / waterMax} />
                            <div className="water-modal-stats">
                                <div className="water-modal-big">
                                    {waterMl.toLocaleString("en-US")}
                                    <em>ml</em>
                                </div>
                                <div className="water-modal-sub">
                                    of <strong>{waterMax.toLocaleString("en-US")} ml</strong> daily goal
                                </div>
                                <div className="water-modal-prog-wrap">
                                    <div className="water-modal-prog">
                                        <div className="water-modal-prog-fill" style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className="water-modal-pct" style={{ color: hydStatus.color }}>
                                        {pct.toFixed(0)}%
                                    </div>
                                </div>
                                <div className="water-hydration-badge" style={{ color: hydStatus.color }}>
                                    {hydStatus.label}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="db-modal-section">
                        <div className="db-modal-section-title">
                            <FontAwesomeIcon icon={faBolt} style={{ marginRight: 6 }} /> Quick Add
                        </div>
                        <div className="water-preset-grid">
                            {presets.map(p => (
                                <button key={p.label} className="water-preset-btn" type="button" onClick={() => add(p.ml)}>
                                    <FontAwesomeIcon icon={p.icon} style={{ fontSize: '18px', color: '#0ea5e9', marginBottom: '4px' }} />
                                    <span className="preset-label">{p.label}</span>
                                    <span className="preset-ml">+{p.ml} ml</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="db-modal-section">
                        <div className="db-modal-section-title">
                            <FontAwesomeIcon icon={faXmark} style={{ marginRight: 6 }} /> Custom Amount
                        </div>
                        <div className="water-custom-row">
                            <div className="water-custom-input-wrap">
                                <input
                                    type="number"
                                    className="db-input water-custom-input"
                                    placeholder="Add custom amount"
                                    value={customStr}
                                    onChange={e => setCustomStr(e.target.value)}
                                />
                                <span className="water-custom-unit">ml</span>
                            </div>
                            <button className="water-action-btn water-action-add" type="button" onClick={() => customOk && add(customVal)} disabled={!customOk}>
                                Add
                            </button>
                            <button className="water-action-btn water-action-remove" type="button" onClick={() => customOk && sub(customVal)} disabled={!customOk}>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaterModal;
