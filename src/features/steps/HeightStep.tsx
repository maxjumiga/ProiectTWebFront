import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
    value: number | null; // stored in cm
    onChange: (cm: number) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function HeightStep({ value, onChange, onNext, onBack }: Props) {
    const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
    const [ft, setFt] = useState(value ? String(Math.floor(value / 2.54 / 12)) : '5');
    const [inches, setInches] = useState(value ? String(Math.round((value / 2.54) % 12)) : '8');
    const [cm, setCm] = useState(value ? String(Math.round(value)) : '173');

    const handleCmChange = (raw: string) => {
        setCm(raw);
        const num = parseInt(raw);
        if (!isNaN(num) && num >= 100 && num <= 250) onChange(num);
    };

    const handleFtChange = (newFt: string, newIn: string) => {
        setFt(newFt);
        setInches(newIn);
        const f = parseInt(newFt) || 0;
        const i = parseInt(newIn) || 0;
        const totalCm = Math.round((f * 12 + i) * 2.54);
        if (totalCm >= 100 && totalCm <= 250) onChange(totalCm);
    };

    const isValid = value !== null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col px-6 py-10 h-full"
        >
            <div className="mb-10">
                <p className="text-lime-400 text-sm font-semibold uppercase tracking-widest mb-2">Step 3</p>
                <h2 className="font-display text-4xl font-bold text-white">How tall<br />are you?</h2>
            </div>

            {/* Unit toggle */}
            <div className="flex bg-zinc-900 rounded-xl p-1 mb-10 w-fit">
                {(['cm', 'ft'] as const).map((u) => (
                    <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${unit === u ? 'bg-lime-400 text-black' : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        {u === 'cm' ? 'CM' : 'FT / IN'}
                    </button>
                ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                {unit === 'cm' ? (
                    <div className="text-center">
                        <div className="flex items-end justify-center gap-2">
                            <input
                                type="number"
                                value={cm}
                                onChange={(e) => handleCmChange(e.target.value)}
                                min={100}
                                max={250}
                                className="bg-transparent text-white font-display text-8xl font-bold text-center w-48 outline-none border-b-2 border-lime-400 pb-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="text-zinc-400 text-2xl mb-4">cm</span>
                        </div>
                        <p className="text-zinc-600 text-sm mt-4">Range: 100 – 250 cm</p>
                    </div>
                ) : (
                    <div className="flex items-end justify-center gap-6">
                        <div className="text-center">
                            <input
                                type="number"
                                value={ft}
                                onChange={(e) => handleFtChange(e.target.value, inches)}
                                min={3}
                                max={8}
                                className="bg-transparent text-white font-display text-8xl font-bold text-center w-32 outline-none border-b-2 border-lime-400 pb-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <p className="text-zinc-400 mt-2">ft</p>
                        </div>
                        <div className="text-center">
                            <input
                                type="number"
                                value={inches}
                                onChange={(e) => handleFtChange(ft, e.target.value)}
                                min={0}
                                max={11}
                                className="bg-transparent text-white font-display text-8xl font-bold text-center w-32 outline-none border-b-2 border-lime-400 pb-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <p className="text-zinc-400 mt-2">in</p>
                        </div>
                    </div>
                )}
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
                    className="flex-2 grow py-4 rounded-2xl bg-lime-400 text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(163,230,53,0.4)] transition-shadow"
                >
                    Continue →
                </button>
            </div>
        </motion.div>
    );
}