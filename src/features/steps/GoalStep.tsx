import { motion } from 'framer-motion';
import type { Goal } from '../../types/onboarding';

interface Props { value: Goal | null; onChange: (v: Goal) => void; onNext: () => void; onBack: () => void; }

const options: { value: Goal; label: string; desc: string; emoji: string }[] = [
    { value: 'lose', label: 'Lose Weight', desc: 'Burn fat, reduce body weight', emoji: '🔥' },
    { value: 'maintain', label: 'Stay in Shape', desc: 'Maintain my current physique', emoji: '⚖️' },
    { value: 'gain', label: 'Build Muscle', desc: 'Increase strength & muscle mass', emoji: '💪' },
];

export default function GoalStep({ value, onChange, onNext, onBack }: Props) {
    return (
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }} className="flex flex-col px-8 py-10 h-full">
            <div className="mb-8">
                <span className="text-xs font-semibold text-[#42448A] uppercase tracking-widest">Step 2 of 6</span>
                <h2 className="text-3xl font-extrabold text-[#1E1F35] mt-2">What's your main goal?</h2>
                <p className="text-slate-600 text-sm mt-1">This shapes your calorie targets & plans.</p>
            </div>

            <div className="flex flex-col gap-3 flex-1">
                {options.map((opt) => (
                    <motion.button key={opt.value} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        onClick={() => onChange(opt.value)}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200
              ${value === opt.value ? 'border-[#42448A] bg-[#42448A]/10' : 'border-slate-200 bg-white hover:border-[#42448A]'}`}>
                        <span className="text-2xl w-9 text-center">{opt.emoji}</span>
                        <div className="flex-1">
                            <p className={`font-semibold text-base ${value === opt.value ? 'text-[#42448A]' : 'text-[#1E1F35]'}`}>{opt.label}</p>
                            <p className="text-slate-600 text-xs mt-0.5">{opt.desc}</p>
                        </div>
                        {value === opt.value && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="w-6 h-6 rounded-full bg-[#42448A] flex items-center justify-center text-white text-xs font-bold shrink-0">✓</motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            <div className="flex gap-3 mt-6">
                <button onClick={onBack} className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-500 font-semibold hover:border-[#42448A] transition-colors text-sm">← Back</button>
                <button onClick={onNext} disabled={!value} className="flex-[2] py-3.5 rounded-2xl bg-[#42448A] hover:opacity-90 text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm">Continue →</button>
            </div>
        </motion.div>
    );
}