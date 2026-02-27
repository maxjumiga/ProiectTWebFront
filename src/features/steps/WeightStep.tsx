import { useState, useRef, useEffect, UIEvent } from 'react';
import { motion } from 'framer-motion';

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
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }} className="flex flex-col px-8 py-10 h-full">
            <div className="mb-6">
                <span className="text-xs font-semibold text-[#42448A] uppercase tracking-widest">Step 4 of 6</span>
                <h2 className="text-3xl font-extrabold text-[#1E1F35] mt-2">What's your weight?</h2>
            </div>

            <div className="flex items-center justify-between mb-8">
                <p className="text-slate-500 text-sm font-medium">Select unit</p>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {(['kg', 'lbs'] as const).map((u) => (
                        <button key={u} onClick={() => {
                            if (unit !== u) {
                                // Switch happens: Activeval automatically converts via the useEffect re-running
                                // Wait, we need to explicitly force activeVal update before effect
                                const converted = u === 'kg' ? Math.round(activeVal / 2.205) : Math.round(activeVal * 2.205);
                                setActiveVal(converted);
                                setUnit(u);
                            }
                        }}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${unit === u ? 'bg-white text-[#42448A] shadow-sm' : 'text-slate-500 hover:text-[#1E1F35]'}`}>
                            {u.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Scroll Picker container */}
                <div className="relative w-48 h-[240px] flex justify-center py-4 overflow-hidden mb-6" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)' }}>

                    {/* Active highlight bar */}
                    <div className="absolute top-1/2 left-0 w-full h-[60px] -translate-y-1/2 border-y-2 border-[#42448A]/30 bg-[#42448A]/5 pointer-events-none rounded-xl" />

                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar flex flex-col items-center cursor-grab active:cursor-grabbing"
                        style={{ padding: `90px 0`, scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {items.map((val) => (
                            <div
                                key={val}
                                className={`h-[60px] w-full flex items-center justify-center text-4xl font-extrabold transition-all duration-200 shrink-0 snap-center
                                    ${activeVal === val ? 'text-[#1E1F35] scale-110' : 'text-slate-300 scale-90 blur-[0.5px]'}`}
                            >
                                {val}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Micro Adjustments */}
                <div className="flex items-center gap-6">
                    <button onClick={() => jump(-1)} className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 text-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-sm">
                        −
                    </button>
                    <span className="text-slate-500 font-semibold w-8 text-center">{unit}</span>
                    <button onClick={() => jump(1)} className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 text-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-sm">
                        +
                    </button>
                </div>

                <style>{`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                `}</style>
            </div>

            <div className="flex gap-3 mt-6">
                <button onClick={onBack} className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-500 font-semibold hover:border-[#42448A] transition-colors text-sm">← Back</button>
                <button onClick={onNext} disabled={!weightValue} className="flex-[2] py-3.5 rounded-2xl bg-[#42448A] hover:opacity-90 text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm">Continue →</button>
            </div>
        </motion.div>
    );
}