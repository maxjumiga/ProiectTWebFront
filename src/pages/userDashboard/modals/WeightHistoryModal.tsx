import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faWeightScale,
    faPlus,
    faArrowTrendDown,
    faArrowTrendUp,
    faCalendarAlt,
    faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import "./WeightHistoryModal.css";


interface WeightEntry {
    id: number;
    weight: number;
    loggedAt: string;
}

interface WeightHistoryModalProps {
    onClose: () => void;
    isDark: boolean;
    token: string;
    currentWeight: number;
    onWeightLogged: (newWeight: number) => void;
}

const WeightHistoryModal: React.FC<WeightHistoryModalProps> = ({
    onClose,
    isDark,
    token,
    currentWeight,
    onWeightLogged,
}) => {
    const [history, setHistory] = useState<WeightEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [newWeight, setNewWeight] = useState<string>("");
    const [isLogging, setIsLogging] = useState(false);
    const [logError, setLogError] = useState<string>("");
    const [activeRange, setActiveRange] = useState<"30" | "90" | "180" | "all">("30");
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5004/api/WeightLog/history", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data: WeightEntry[] = await res.json();
                setHistory(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleLogWeight = async () => {
        const val = parseFloat(newWeight);
        if (isNaN(val) || val < 10 || val > 500) {
            setLogError("Please enter a valid weight between 10 and 500 kg.");
            return;
        }
        setIsLogging(true);
        setLogError("");
        try {
            const res = await fetch("http://localhost:5004/api/WeightLog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ weight: val, loggedAt: new Date().toISOString() }),
            });
            if (res.ok) {
                setNewWeight("");
                await fetchHistory();
                onWeightLogged(val);
            } else {
                setLogError("Failed to log weight. Please try again.");
            }
        } catch {
            setLogError("Network error. Please try again.");
        } finally {
            setIsLogging(false);
        }
    };

    // ── Filter by range ──────────────────────────────────────────────────────────
    const filterHistory = () => {
        if (activeRange === "all") return history;
        const days = parseInt(activeRange);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return history.filter(e => new Date(e.loggedAt) >= cutoff);
    };

    const filtered = filterHistory();
    const hasData = filtered.length > 0;

    // ── Stats ────────────────────────────────────────────────────────────────────
    const firstWeight = filtered[0]?.weight;
    const lastWeight = filtered[filtered.length - 1]?.weight;
    const weightChange = hasData && filtered.length > 1 ? lastWeight - firstWeight : null;
    const minWeight = hasData ? Math.min(...filtered.map(e => e.weight)) : 0;
    const maxWeight = hasData ? Math.max(...filtered.map(e => e.weight)) : 0;
    const avgWeight = hasData
        ? filtered.reduce((s, e) => s + e.weight, 0) / filtered.length
        : 0;

    // ── SVG Chart ────────────────────────────────────────────────────────────────
    const chartW = 780;
    const chartH = 260;
    const pL = 50, pR = 24, pT = 28, pB = 44;
    const innerW = chartW - pL - pR;
    const innerH = chartH - pT - pB;

    let svgContent: React.ReactNode = null;

    if (hasData) {
        const margin = Math.max((maxWeight - minWeight) * 0.2, 1);
        const minW = minWeight - margin;
        const maxW = maxWeight + margin;
        const range = maxW - minW || 1;

        const mapY = (w: number) => pT + innerH - ((w - minW) / range) * innerH;
        const mapX = (i: number) => pL + (filtered.length === 1 ? innerW / 2 : (i / (filtered.length - 1)) * innerW);

        const points = filtered.map((e, i) => ({
            x: mapX(i),
            y: mapY(e.weight),
            val: e.weight,
            date: new Date(e.loggedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            fullDate: new Date(e.loggedAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
        }));

        const pathD = points.reduce(
            (acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`),
            ""
        );
        const areaD = pathD +
            ` L ${points[points.length - 1].x} ${pT + innerH} L ${points[0].x} ${pT + innerH} Z`;

        // Y gridlines
        const yTicks = 4;
        const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) =>
            minW + (i / yTicks) * (maxW - minW)
        );

        // X axis: show max 8 labels to avoid crowding
        const step = Math.max(1, Math.ceil(filtered.length / 8));
        const xLabelIdxs = new Set<number>();
        for (let i = 0; i < filtered.length; i += step) xLabelIdxs.add(i);
        xLabelIdxs.add(filtered.length - 1);

        const strokeColor = (weightChange !== null && weightChange < 0) ? "#10b981" : "#3b82f6";
        const gradId = (weightChange !== null && weightChange < 0) ? "wh-grad-green" : "wh-grad-blue";
        const gradStop = (weightChange !== null && weightChange < 0) ? "#10b981" : "#3b82f6";

        svgContent = (
            <svg
                ref={svgRef}
                viewBox={`0 0 ${chartW} ${chartH}`}
                width="100%"
                height={chartH}
                style={{ overflow: "visible" }}
            >
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={gradStop} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={gradStop} stopOpacity="0.02" />
                    </linearGradient>
                    <filter id="wh-glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Y grid lines */}
                {yTickVals.map((val, i) => {
                    const y = mapY(val);
                    return (
                        <g key={i}>
                            <line
                                x1={pL} x2={chartW - pR} y1={y} y2={y}
                                stroke={isDark ? "#2a2d3a" : "#f1f5f9"}
                                strokeWidth="1"
                                strokeDasharray="3 3"
                            />
                            <text
                                x={pL - 8} y={y + 4}
                                textAnchor="end"
                                fontSize="10"
                                fontWeight="600"
                                fill={isDark ? "#64748b" : "#94a3b8"}
                            >
                                {val.toFixed(1)}
                            </text>
                        </g>
                    );
                })}

                {/* Area fill */}
                <path d={areaD} fill={`url(#${gradId})`} />

                {/* Line */}
                <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: `drop-shadow(0 2px 6px ${strokeColor}55)` }}
                />

                {/* Data points */}
                {points.map((p, i) => {
                    const isHovered = hoveredIdx === i;
                    const isLast = i === points.length - 1;
                    return (
                        <g
                            key={i}
                            onMouseEnter={() => setHoveredIdx(i)}
                            onMouseLeave={() => setHoveredIdx(null)}
                            style={{ cursor: "pointer" }}
                        >
                            {/* Larger invisible hit zone */}
                            <circle cx={p.x} cy={p.y} r={12} fill="transparent" />

                            {/* Hover tooltip box */}
                            {isHovered && (
                                <g>
                                    <rect
                                        x={p.x - 44}
                                        y={p.y - 54}
                                        width={88}
                                        height={42}
                                        rx={8}
                                        fill={isDark ? "#1a1d27" : "#ffffff"}
                                        stroke={isDark ? "#2a2d3a" : "#e2e8f0"}
                                        strokeWidth="1"
                                        filter="drop-shadow(0 4px 12px rgba(0,0,0,0.15))"
                                    />
                                    <text x={p.x} y={p.y - 37} textAnchor="middle" fontSize="12" fontWeight="800" fill={strokeColor}>
                                        {p.val.toFixed(1)} kg
                                    </text>
                                    <text x={p.x} y={p.y - 22} textAnchor="middle" fontSize="9" fontWeight="500" fill={isDark ? "#64748b" : "#94a3b8"}>
                                        {p.fullDate}
                                    </text>
                                </g>
                            )}

                            {/* Dot */}
                            <circle
                                cx={p.x} cy={p.y}
                                r={isHovered || isLast ? 5.5 : 3.5}
                                fill={isDark ? "#1a1d27" : "#ffffff"}
                                stroke={strokeColor}
                                strokeWidth={isHovered || isLast ? 2.5 : 2}
                                style={{ transition: "r 0.15s ease" }}
                            />

                            {/* Label above dot for first, last, and hovered */}
                            {(i === 0 || isLast || isHovered) && (
                                <text
                                    x={p.x} y={p.y - 11}
                                    textAnchor="middle"
                                    fontSize="9.5"
                                    fontWeight="700"
                                    fill={strokeColor}
                                >
                                    {p.val.toFixed(1)}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* X axis labels */}
                {points.map((p, i) => (
                    xLabelIdxs.has(i) && (
                        <text
                            key={i}
                            x={p.x} y={chartH - 8}
                            textAnchor="middle"
                            fontSize="9.5"
                            fontWeight="600"
                            fill={isDark ? "#64748b" : "#94a3b8"}
                        >
                            {p.date}
                        </text>
                    )
                ))}
            </svg>
        );
    }

    return (
        <div className="wh-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="wh-modal">

                {/* ── Header ────────────────────────────────────────── */}
                <div className="wh-header">
                    <div className="wh-header-left">
                        <div className="wh-icon-wrap">
                            <FontAwesomeIcon icon={faWeightScale} />
                        </div>
                        <div>
                            <h2 className="wh-title">Weight History</h2>
                            <p className="wh-subtitle">Track your body weight over time</p>
                        </div>
                    </div>
                    <button className="wh-close-btn" onClick={onClose} type="button">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* ── Stats row ─────────────────────────────────────── */}
                <div className="wh-stats-row">
                    <div className="wh-stat-card">
                        <div className="wh-stat-icon" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>
                            <FontAwesomeIcon icon={faWeightScale} />
                        </div>
                        <div>
                            <div className="wh-stat-label">Current</div>
                            <div className="wh-stat-value">{currentWeight} <span className="wh-stat-unit">kg</span></div>
                        </div>
                    </div>

                    {weightChange !== null && (
                        <div className="wh-stat-card">
                            <div
                                className="wh-stat-icon"
                                style={{
                                    background: weightChange < 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                    color: weightChange < 0 ? "#10b981" : "#ef4444",
                                }}
                            >
                                <FontAwesomeIcon icon={weightChange < 0 ? faArrowTrendDown : faArrowTrendUp} />
                            </div>
                            <div>
                                <div className="wh-stat-label">Change</div>
                                <div
                                    className="wh-stat-value"
                                    style={{ color: weightChange < 0 ? "#10b981" : "#ef4444" }}
                                >
                                    {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)} <span className="wh-stat-unit">kg</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {hasData && (
                        <>
                            <div className="wh-stat-card">
                                <div className="wh-stat-icon" style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}>
                                    <FontAwesomeIcon icon={faChartLine} />
                                </div>
                                <div>
                                    <div className="wh-stat-label">Average</div>
                                    <div className="wh-stat-value">{avgWeight.toFixed(1)} <span className="wh-stat-unit">kg</span></div>
                                </div>
                            </div>

                            <div className="wh-stat-card">
                                <div className="wh-stat-icon" style={{ background: "rgba(249,115,22,0.1)", color: "#f97316" }}>
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                </div>
                                <div>
                                    <div className="wh-stat-label">Range</div>
                                    <div className="wh-stat-value">{minWeight.toFixed(1)}–{maxWeight.toFixed(1)} <span className="wh-stat-unit">kg</span></div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* ── Log new weight ─────────────────────────────────── */}
                <div className="wh-log-section">
                    <div className="wh-log-label">Log today's weight</div>
                    <div className="wh-log-row">
                        <div className="wh-log-input-wrap">
                            <input
                                className="wh-log-input"
                                type="number"
                                placeholder="e.g. 72.5"
                                min={10}
                                max={500}
                                step={0.1}
                                value={newWeight}
                                onChange={e => { setNewWeight(e.target.value); setLogError(""); }}
                                onKeyDown={e => e.key === "Enter" && handleLogWeight()}
                            />
                            <span className="wh-log-unit">kg</span>
                        </div>
                        <button
                            className="wh-log-btn"
                            onClick={handleLogWeight}
                            disabled={isLogging || !newWeight}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            {isLogging ? "Logging…" : "Log Weight"}
                        </button>
                    </div>
                    {logError && <div className="wh-log-error">{logError}</div>}
                </div>

                {/* ── Range selector ─────────────────────────────────── */}
                <div className="wh-range-row">
                    <span className="wh-range-label">Show:</span>
                    {(["30", "90", "180", "all"] as const).map(r => (
                        <button
                            key={r}
                            className={`wh-range-btn${activeRange === r ? " active" : ""}`}
                            onClick={() => setActiveRange(r)}
                        >
                            {r === "all" ? "All time" : `${r} days`}
                        </button>
                    ))}
                    <span className="wh-entry-count">{filtered.length} entries</span>
                </div>

                {/* ── Chart ─────────────────────────────────────────── */}
                <div className="wh-chart-wrap">
                    {loading ? (
                        <div className="wh-empty">
                            <div className="wh-empty-spinner" />
                            <p>Loading history…</p>
                        </div>
                    ) : !hasData ? (
                        <div className="wh-empty">
                            <div className="wh-empty-icon">⚖️</div>
                            <p>No weight entries for this period.</p>
                            <p className="wh-empty-sub">Use the input above to log your first weight.</p>
                        </div>
                    ) : (
                        svgContent
                    )}
                </div>

            </div>
        </div>
    );
};

export default WeightHistoryModal;
