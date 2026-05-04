import { useState, useRef, useEffect, UIEvent } from 'react';
import { motion } from 'framer-motion';
import './Steps.css';

interface Props {
    value: number | null;
    onChange: (age: number) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function AgeStep({ value, onChange, onNext, onBack }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const itemHeight = 60; // pixel height of each row
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const minAge = 10;
    const maxAge = 120;
    const items = Array.from({ length: maxAge - minAge + 1 }, (_, i) => minAge + i);

    const [activeVal, setActiveVal] = useState(value || 25);

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
    }, [mounted]);

    const updateValue = (val: number, smooth: boolean = true) => {
        const clamped = Math.max(minAge, Math.min(maxAge, val));
        setActiveVal(clamped);
        onChange(clamped);

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
        const currentScrollTop = e.currentTarget.scrollTop; // capturat inainte de callback async
        const idx = Math.round(currentScrollTop / itemHeight);
        const selected = items[idx];

        if (selected !== activeVal && selected >= minAge && selected <= maxAge) {
            setActiveVal(selected);
            onChange(selected);
        }

        setIsScrolling(true);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
            // Snap exact dupa scroll - folosim ref, nu e.currentTarget (care e null dupa 400ms)
            if (!scrollRef.current) return;
            const exactIdx = Math.round(scrollRef.current.scrollTop / itemHeight);
            scrollRef.current.scrollTo({
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
                <span className="step-sub-label">Step 5 of 6</span>
                <h2 className="step-title">How old are you?</h2>
                <p className="step-desc">Used for accurate calorie calculations.</p>
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
                    <span className="micro-unit">yrs</span>
                    <button onClick={() => jump(1)} className="micro-btn">+</button>
                </div>

                <div style={{ height: '1.5rem', marginTop: '1rem' }}>
                    {value === null && <p className="error-msg text-center" style={{ color: '#94a3b8' }}>Please select your age</p>}
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
                    disabled={value === null}
                    className="btn-next"
                >
                    Continue →
                </button>
            </div>
        </motion.div>
    );
}
