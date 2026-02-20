import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
    weightValue: number | null;
    onWeightChange: (kg: number) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function WeightStep({ weightValue, onWeightChange, onNext, onBack }: Props) {
    const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
    const [weight, setWeight] = useState(weightValue ? String(Math.round(weightValue)) : '70');

    const handleWeightChange = (raw: string) => {
        setWeight(raw);
        const num = parseFloat(raw);
        if (!isNaN(num)) {
            const kg = unit === 'kg' ? num : num / 2.205;
            if (kg >= 30 && kg <= 300) onWeightChange(parseFloat(kg.toFixed(1)));
        }
    };

    const isValid = weightValue !== null;

    const displayWeight = unit === 'lbs' && weightValue
        ? String(Math.round(weightValue * 2.205))
        : weight;

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col px-6 py-10 h-full"
        >
            <div className="mb-8">
                <p className="text-lime-400 text-sm font-semibold uppercase tracking-widest mb-2">Step 4</p>
                <h2 className="font-display text-4xl font-bold text-white">What's your<br />weight?</h2>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6">
                <div className="flex items-center justify-between">
                    <p className="text-zinc-300 font-semibold">Your weight</p>
                    <div className="flex bg-zinc-900 rounded-xl p-1">
                        {(['kg', 'lbs'] as const).map((u) => (
                            <button
                                key={u}
                                onClick={() => setUnit(u)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${unit === u ? 'bg-lime-400 text-black' : 'text-zinc-400 hover:text-white'
                                    }`}
                            >
                                {u.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-end gap-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl px-6 py-8">
                    <input
                        type="number"
                        value={displayWeight}
                        onChange={(e) => handleWeightChange(e.target.value)}
                        min={unit === 'kg' ? 30 : 66}
                        max={unit === 'kg' ? 300 : 660}
                        autoFocus
                        className="bg-transparent text-white font-display text-7xl font-bold flex-1 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-zinc-500 text-2xl mb-3">{unit}</span>
                </div>
            </div>

            <div className="flex gap-3 mt-8">
                <button
                    onClick={onBack}
                    className="flex-1 py-4 rounded-2xl border border-zinc-700 text-zinc-400 font-semibold hover:border-zinc-500 transition-colors"
                >
                    ← Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="flex-2 flex-grow py-4 rounded-2xl bg-lime-400 text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(163,230,53,0.4)] transition-shadow"
                >
                    Continue →
                </button>
            </div>
        </motion.div>
    );
}