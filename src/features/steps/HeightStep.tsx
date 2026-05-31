import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Steps.css';

interface Props { value: number | null; onChange: (cm: number) => void; onNext: () => void; onBack: () => void; }

export default function HeightStep({ value, onChange, onNext, onBack }: Props) {
    const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
    const [cmInput, setCmInput] = useState(value ? String(Math.round(value)) : '170');

    // Derived values for feet/inches based on cm internal or local state
    const currentCm = value || 170;
    const initialFt = Math.floor(currentCm / 2.54 / 12);
    const initialIn = Math.round((currentCm / 2.54) % 12);

    const [ftInput, setFtInput] = useState(String(initialFt));
    const [inInput, setInInput] = useState(String(initialIn));

    const [isFocused, setIsFocused] = useState(false);

    // Sync input when `value` changes from outside (e.g. from slider)
    useEffect(() => {
        if (value) {
            if (unit === 'cm') {
                setCmInput(String(Math.round(value)));
            } else {
                setFtInput(String(Math.floor(value / 2.54 / 12)));
                setInInput(String(Math.round((value / 2.54) % 12)));
            }
        }
    }, [value, unit]);

    // Format switches
    const handleUnitSwitch = (u: 'cm' | 'ft') => {
        setUnit(u);
        if (u === 'ft') {
            const cmVal = parseInt(cmInput);
            if (!isNaN(cmVal)) {
                setFtInput(String(Math.floor(cmVal / 2.54 / 12)));
                setInInput(String(Math.round((cmVal / 2.54) % 12)));
            }
        } else {
            const f = parseInt(ftInput) || 0;
            const i = parseInt(inInput) || 0;
            const cmVal = Math.round((f * 12 + i) * 2.54);
            setCmInput(String(cmVal));
            if (cmVal >= 100 && cmVal <= 250) {
                onChange(cmVal);
            }
        }
    };

    // CM Handle
    const handleCmChange = (raw: string) => {
        if (raw.length > 3) return; // limit to 3 digits
        setCmInput(raw);
        const n = parseInt(raw);
        if (!isNaN(n) && n >= 100 && n <= 250) {
            onChange(n);
        }
    };

    const jumpCm = (delta: number) => {
        const n = parseInt(cmInput) || 170;
        const bounded = Math.max(100, Math.min(250, n + delta));
        handleCmChange(String(bounded));
    };

    // FT Handle
    const handleFtChange = (nFt: string, nIn: string) => {
        if (nFt.length > 1) return; // prevent extra digits
        if (nIn.length > 2) return;
        setFtInput(nFt);
        setInInput(nIn);
        const total = Math.round((parseInt(nFt) || 0) * 12 + (parseInt(nIn) || 0)) * 2.54 | 0;
        if (total >= 100 && total <= 250) onChange(total);
    };

    const jumpFt = (delta: number, type: 'ft' | 'in') => {
        let f = parseInt(ftInput) || 0;
        let i = parseInt(inInput) || 0;
        if (type === 'ft') f += delta;
        if (type === 'in') i += delta;

        // Wrap inches
        if (i >= 12) { f += 1; i -= 12; }
        if (i < 0) { f -= 1; i += 12; }

        // Bounds checking approx
        const cmVal = (f * 12 + i) * 2.54;
        if (cmVal < 100 || cmVal > 250) return;

        handleFtChange(String(f), String(i));
    };

    const sliderValue = value || 170;

    // Bounds Check for validation
    const isValid = value !== null && value >= 100 && value <= 250;
    const isError = (unit === 'cm' && cmInput.length > 0 && (parseInt(cmInput) < 100 || parseInt(cmInput) > 250)) ||
        (unit === 'ft' && ftInput.length > 0 && ((parseInt(ftInput) * 12 + parseInt(inInput)) * 2.54 < 100 || (parseInt(ftInput) * 12 + parseInt(inInput)) * 2.54 > 250));

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            className="step-container"
        >
            <div className="step-header">
                <span className="step-sub-label">Step 3 of 6</span>
                <h2 className="step-title">How tall are you?</h2>
            </div>

            <div className="unit-toggle-container">
                {(['cm', 'ft'] as const).map((u) => (
                    <button
                        key={u}
                        onClick={() => handleUnitSwitch(u)}
                        className={`unit-toggle-btn ${unit === u ? 'active' : 'inactive'}`}
                    >
                        {u === 'cm' ? 'CM' : 'FT / IN'}
                    </button>
                ))}
            </div>

            <div className="input-area" style={{ flexDirection: 'column' }}>
                {unit === 'cm' ? (
                    <div className="input-group">
                        <div className="input-controls">
                            <button onClick={() => jumpCm(-1)} className="adjust-btn">−</button>
                            <div className={`input-wrapper ${isFocused ? 'focused' : isError ? 'error' : 'normal'}`}>
                                <input
                                    type="number"
                                    value={cmInput}
                                    onChange={(e) => handleCmChange(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className="number-input"
                                />
                                <span className="input-unit">cm</span>
                            </div>
                            <button onClick={() => jumpCm(1)} className="adjust-btn">+</button>
                        </div>
                    </div>
                ) : (
                    <div className="input-group">
                        <div className="input-controls">
                            {/* FT */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <button onClick={() => jumpFt(-1, 'ft')} className="adjust-btn" style={{ width: '2rem', height: '2rem', fontSize: '1rem' }}>−</button>
                                    <div className={`input-wrapper ${isFocused ? 'focused' : isError ? 'error' : 'normal'}`}>
                                        <input
                                            type="number"
                                            value={ftInput}
                                            onChange={(e) => handleFtChange(e.target.value, inInput)}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() => setIsFocused(false)}
                                            className="number-input small"
                                        />
                                        <span className="input-unit small">ft</span>
                                    </div>
                                    <button onClick={() => jumpFt(1, 'ft')} className="adjust-btn" style={{ width: '2rem', height: '2rem', fontSize: '1rem' }}>+</button>
                                </div>
                            </div>
                            {/* IN */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <button onClick={() => jumpFt(-1, 'in')} className="adjust-btn" style={{ width: '2rem', height: '2rem', fontSize: '1rem' }}>−</button>
                                    <div className={`input-wrapper ${isFocused ? 'focused' : isError ? 'error' : 'normal'}`}>
                                        <input
                                            type="number"
                                            value={inInput}
                                            onChange={(e) => handleFtChange(ftInput, e.target.value)}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() => setIsFocused(false)}
                                            className="number-input small"
                                        />
                                        <span className="input-unit small">in</span>
                                    </div>
                                    <button onClick={() => jumpFt(1, 'in')} className="adjust-btn" style={{ width: '2rem', height: '2rem', fontSize: '1rem' }}>+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="range-container">
                    <input
                        type="range"
                        min="100"
                        max="250"
                        value={sliderValue}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            onChange(val);
                        }}
                        className="range-slider"
                        style={{ boxShadow: isFocused ? '0 0 0 4px rgba(66,68,138,0.1)' : 'none' }}
                    />
                    <div className="range-labels">
                        <span>{unit === 'cm' ? '100 cm' : '3 ft 3 in'}</span>
                        <span>{unit === 'cm' ? '250 cm' : '8 ft 2 in'}</span>
                    </div>
                </div>

                <div style={{ height: '1rem', marginTop: '1rem' }}>
                    {isError && <p className="error-msg text-center">Please enter a valid height.</p>}
                </div>
            </div>

            <div className="step-actions">
                <button
                    onClick={onBack}
                    className="btn-back"
                >
                    ← Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="btn-next"
                >
                    Continue →
                </button>
            </div>
        </motion.div>
    );
}