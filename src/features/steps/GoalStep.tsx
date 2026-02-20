import { motion } from 'framer-motion';
import type { Goal } from '../../types/onboarding';

interface Props {
    value: Goal | null;
    onChange: (v: Goal) => void;
    onNext: () => void;
    onBack: () => void;
}

const options: { value: Goal; label: string; desc: string; emoji: string }[] = [
    { value: 'lose', label: 'Lose Weight', desc: 'Burn fat, reduce body weight', emoji: '🔥' },
    { value: 'maintain', label: 'Stay in Shape', desc: 'Maintain my current physique', emoji: '⚖️' },
    { value: 'gain', label: 'Build Muscle', desc: 'Increase strength & muscle mass', emoji: '💪' },
];

export default function GoalStep({ value, onChange, onNext, onBack }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col px-6 py-10 h-full"
        >
            <div className="mb-10">
                <p className="text-lime-400 text-sm font-semibold uppercase tracking-widest mb-2">Step 2</p>
                <h2 className="font-display text-4xl font-bold text-white">What's your<br />main goal?</h2>
                <p className="text-zinc-500 mt-2 text-sm">This shapes your calorie targets & plans.</p>
            </div>

            <div className="flex flex-col gap-4 flex-1">
                {options.map((opt) => (
                    <motion.button
                        key={opt.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onChange(opt.value)}
                        className={`flex items-center gap-5 px-6 py-5 rounded-2xl border-2 transition-all duration-200 text-left
              ${value === opt.value
                                ? 'border-lime-400 bg-lime-400/10 shadow-[0_0_20px_rgba(163,230,53,0.15)]'
                                : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
                            }`}
                    >
                        <span className="text-3xl w-10 text-center">{opt.emoji}</span>
                        <div className="flex-1">
                            <p className={`text-lg font-semibold ${value === opt.value ? 'text-lime-400' : 'text-white'}`}>
                                {opt.label}
                            </p>
                            <p className="text-zinc-500 text-sm mt-0.5">{opt.desc}</p>
                        </div>
                        {value === opt.value && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 rounded-full bg-lime-400 flex items-center justify-center text-black text-xs font-bold flex-shrink-0"
                            >
                                ✓
                            </motion.span>
                        )}
                    </motion.button>
                ))}
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
                    disabled={!value}
                    className="flex-2 flex-grow py-4 rounded-2xl bg-lime-400 text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(163,230,53,0.4)] transition-shadow"
                >
                    Continue →
                </button>
            </div>
        </motion.div>
    );
}