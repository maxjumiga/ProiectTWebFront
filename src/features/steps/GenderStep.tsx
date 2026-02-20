import { motion } from 'framer-motion';
import type { Gender } from '../../types/onboarding';

interface Props { value: Gender | null; onChange: (v: Gender) => void; onNext: () => void; onBack: () => void; }

const options: { value: Gender; label: string; desc: string; emoji: string }[] = [
    { value: 'male', label: 'Male', desc: 'Biological male', emoji: '♂' },
    { value: 'female', label: 'Female', desc: 'Biological female', emoji: '♀' },
    { value: 'other', label: 'Other', desc: 'Prefer not to specify', emoji: '⚬' },
];

export default function GenderStep({ value, onChange, onNext, onBack }: Props) {
    return (
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }} className="flex flex-col px-8 py-10 h-full">
            <div className="mb-8">
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Step 1 of 6</span>
                <h2 className="text-3xl font-extrabold text-white mt-2">What's your biological sex?</h2>
                <p className="text-zinc-500 text-sm mt-1">Used for accurate calorie calculations.</p>
            </div>

            <div className="flex flex-col gap-3 flex-1">
                {options.map((opt) => (
                    <motion.button key={opt.value} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        onClick={() => onChange(opt.value)}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200
              ${value === opt.value ? 'border-violet-500 bg-violet-600/10' : 'border-[#252840] bg-[#1a1d2e] hover:border-[#363a5a]'}`}>
                        <span className="text-2xl w-9 text-center">{opt.emoji}</span>
                        <div className="flex-1">
                            <p className={`font-semibold text-base ${value === opt.value ? 'text-violet-300' : 'text-white'}`}>{opt.label}</p>
                            <p className="text-zinc-500 text-xs mt-0.5">{opt.desc}</p>
                        </div>
                        {value === opt.value && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">✓</motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            <div className="flex gap-3 mt-6">
                <button onClick={onBack} className="flex-1 py-3.5 rounded-2xl border border-[#252840] text-zinc-400 font-semibold hover:border-[#363a5a] transition-colors text-sm">← Back</button>
                <button onClick={onNext} disabled={!value} className="flex-[2] py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm">Continue →</button>
            </div>
        </motion.div>
    );
}