import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props { weightValue: number | null; onWeightChange: (kg: number) => void; onNext: () => void; onBack: () => void; }

export default function WeightStep({ weightValue, onWeightChange, onNext, onBack }: Props) {
    const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
    const [weight, setWeight] = useState(weightValue ? String(Math.round(weightValue)) : '70');

    const handleChange = (raw: string) => {
        setWeight(raw);
        const n = parseFloat(raw);
        if (!isNaN(n)) { const kg = unit === 'kg' ? n : n / 2.205; if (kg >= 30 && kg <= 300) onWeightChange(parseFloat(kg.toFixed(1))); }
    };

    const display = unit === 'lbs' && weightValue ? String(Math.round(weightValue * 2.205)) : weight;

    return (
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }} className="flex flex-col px-8 py-10 h-full">
            <div className="mb-6">
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Step 4 of 6</span>
                <h2 className="text-3xl font-extrabold text-white mt-2">What's your weight?</h2>
            </div>

            <div className="flex items-center justify-between mb-6">
                <p className="text-zinc-400 text-sm font-medium">Select unit</p>
                <div className="flex bg-[#1a1d2e] rounded-xl p-1">
                    {(['kg', 'lbs'] as const).map((u) => (
                        <button key={u} onClick={() => setUnit(u)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${unit === u ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:text-white'}`}>
                            {u.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div className="flex items-end gap-3">
                    <input type="number" value={display} onChange={(e) => handleChange(e.target.value)}
                        autoFocus className="bg-transparent text-white text-8xl font-extrabold w-52 outline-none border-b-2 border-violet-500 pb-2 text-center" />
                    <span className="text-zinc-500 text-2xl mb-4">{unit}</span>
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button onClick={onBack} className="flex-1 py-3.5 rounded-2xl border border-[#252840] text-zinc-400 font-semibold hover:border-[#363a5a] transition-colors text-sm">← Back</button>
                <button onClick={onNext} disabled={!weightValue} className="flex-[2] py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm">Continue →</button>
            </div>
        </motion.div>
    );
}