import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
    value: number | null;
    onChange: (age: number) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function AgeStep({ value, onChange, onNext, onBack }: Props) {
    const [raw, setRaw] = useState(value ? String(value) : '');

    const handleChange = (input: string) => {
        setRaw(input);
        const num = parseInt(input);
        if (!isNaN(num) && num >= 10 && num <= 100) {
            onChange(num);
        }
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
                <p className="text-lime-400 text-sm font-semibold uppercase tracking-widest mb-2">Step 5</p>
                <h2 className="font-display text-4xl font-bold text-white">How old<br />are you?</h2>
                <p className="text-zinc-500 mt-2 text-sm">Used to calculate your personalised calorie target.</p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-end gap-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl px-6 py-8">
                    <input
                        type="number"
                        value={raw}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="25"
                        min={10}
                        max={100}
                        autoFocus
                        className="bg-transparent text-white font-display text-7xl font-bold flex-1 outline-none placeholder:text-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-zinc-500 text-2xl mb-3">yrs</span>
                </div>

                {raw && (parseInt(raw) < 10 || parseInt(raw) > 100) && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-3 ml-1"
                    >
                        Please enter a valid age between 10 and 100.
                    </motion.p>
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
