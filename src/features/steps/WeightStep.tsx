import { useState, useRef, useEffect, UIEvent } from 'react';
import { motion } from 'framer-motion';
import './Steps.css';

interface Props { weightValue: number | null; onWeightChange: (kg: number) => void; onNext: () => void; onBack: () => void; }

export default function WeightStep({ weightValue, onWeightChange, onNext, onBack }: Props) {
    const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
    const scrollRef = useRef<HTMLDivElement>(null);
    const itemHeight = 60; // pixel height of each row
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();

    const internalWeight = weightValue || 70; // kg

    // Limits
    const minKg = 30;
    const maxKg = 300;

    // Derived variables based on unit
    const minVal = unit === 'kg' ? minKg : Math.round(minKg * 2.205);
    const maxVal = unit === 'kg' ? maxKg : Math.round(maxKg * 2.205);
    const items = Array.from({ length: maxVal - minVal + 1 }, (_, i) => minVal + i);

    // activeVal corresponds to the displayed unit value
    const [activeVal, setActiveVal] = useState(
        unit === 'kg' ? Math.round(internalWeight) : Math.round(internalWeight * 2.205)
    );

    // Track initialization to avoid setting scroll on unmounted DOM
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    // Effect to scroll to the initial activeVal
    useEffect(() => {
        if (mounted && scrollRef.current && !isScrolling) {
            const index = items.indexOf(activeVal);
            if (index !== -1) {
                // Instantly center the item
                scrollRef.current.scrollTop = index * itemHeight;
            }
        }
    }, [unit, mounted]); // Only run on mount or unit switch

    const updateValue = (val: number, smooth: boolean = true) => {
        const clamped = Math.max(minVal, Math.min(maxVal, val));
        setActiveVal(clamped);

        // Push up to parent in kg
        const kgVal = unit === 'kg' ? clamped : clamped / 2.205;
        onWeightChange(parseFloat(kgVal.toFixed(1)));

        // Scroll visually
        if (scrollRef.current) {
            const idx = items.indexOf(clamped);
            if (idx !== -1) {
                scrollRef.current.scrollTo({
                    top: idx * itemHeight,
                    behavior: smooth ? 'smooth' : 'auto'
                });
            }
        }
    };

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const idx = Math.round(e.currentTarget.scrollTop / itemHeight);
        const selected = items[idx];

        if (selected !== activeVal && selected >= minVal && selected <= maxVal) {
            setActiveVal(selected);
            const kgVal = unit === 'kg' ? selected : selected / 2.205;
            onWeightChange(parseFloat(kgVal.toFixed(1)));
        }

        setIsScrolling(true);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
            // Snap exactly after scroll ends
            const exactIdx = Math.round(e.currentTarget.scrollTop / itemHeight);
            e.currentTarget.scrollTo({
                top: exactIdx * itemHeight,
                behavior: 'smooth'
            });
        }, 400);
    };

    const jump = (delta: number) => {
        updateValue(activeVal + delta, true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            className="step-container"
        >
            <div className="step-header">
                <span className="step-sub-label">Step 4 of 6</span>
                <h2 className="step-title">What's your weight?</h2>
            </div>

            <div className="unit-select-row">
                <p className="unit-select-label">Select unit</p>
                <div className="unit-toggle-container" style={{ margin: 0 }}>
                    {(['kg', 'lbs'] as const).map((u) => (
                        <button
                            key={u}
                            onClick={() => {
                                if (unit !== u) {
                                    const converted = u === 'kg' ? Math.round(activeVal / 2.205) : Math.round(activeVal * 2.205);
                                    setActiveVal(converted);
                                    setUnit(u);
                                }
                            }}
                            className={`unit-toggle-btn ${unit === u ? 'active' : 'inactive'}`}
                        >
                            {u.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="input-area" style={{ flexDirection: 'column' }}>
                <div className="scroll-picker-container">
                    <div className="scroll-picker-highlight" />
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="scroll-picker"
                    >
                        {items.map((val) => (
                            <div
                                key={val}
                                className={`scroll-item ${activeVal === val ? 'active' : 'inactive'}`}
                            >
                                {val}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="micro-adjust">
                    <button onClick={() => jump(-1)} className="micro-btn">−</button>
                    <span className="micro-unit">{unit}</span>
                    <button onClick={() => jump(1)} className="micro-btn">+</button>
                </div>
            </div>

            <div className="step-actions">
                <button onClick={onBack} className="btn-back">← Back</button>
                <button onClick={onNext} disabled={!weightValue} className="btn-next">Continue →</button>
            </div>
        </motion.div>
    );
}