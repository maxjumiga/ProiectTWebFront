import { motion } from 'framer-motion';
import type { OnboardingData } from '../../types/onboarding';
import { calcBMI, calcBMR, calcTDEE, goalCalories, goalLabel, heightDisplay, bmiCategory } from '../../utils/calculations';

interface Props {
    data: OnboardingData;
    onComplete: () => void;
    onBack: () => void;
}

export default function SummaryStep({ data, onComplete, onBack }: Props) {
    const { gender, age, heightCm, weightKg, goal } = data;

    const bmi = heightCm && weightKg ? calcBMI(weightKg, heightCm) : null;
    const bmr = gender && age && heightCm && weightKg
        ? calcBMR(weightKg, heightCm, age, gender) : null;
    const tdee = bmr ? calcTDEE(bmr) : null;
    const calories = tdee && goal ? goalCalories(tdee, goal) : null;

    const stats = [
        { label: 'BMI', value: bmi?.toString() ?? '—', sub: bmi ? bmiCategory(bmi) : '' },
        { label: 'Daily Calories', value: calories ? `${calories}` : '—', sub: 'kcal / day' },
        { label: 'Base Metabolic Rate', value: bmr ? `${Math.round(bmr)}` : '—', sub: 'kcal / day' },
    ];

    const profile = [
        { label: 'Gender', value: gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : '—' },
        { label: 'Age', value: age ? `${age} years` : '—' },
        { label: 'Height', value: heightCm ? heightDisplay(heightCm) : '—' },
        { label: 'Weight', value: weightKg ? `${weightKg} kg` : '—' },
        { label: 'Goal', value: goal ? goalLabel(goal) : '—' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col px-6 py-10 h-full overflow-y-auto"
        >
            <div className="mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="w-12 h-12 rounded-xl bg-lime-400/20 border border-lime-400/40 flex items-center justify-center text-2xl mb-4"
                >
                    ✓
                </motion.div>
                <h2 className="font-display text-4xl font-bold text-white">Your Profile<br />is Ready</h2>
                <p className="text-zinc-500 mt-2 text-sm">Here's what we calculated for you.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-3 mb-6">
                {stats.map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.1 }}
                        className="bg-lime-400/10 border border-lime-400/20 rounded-2xl px-5 py-4 flex items-center justify-between"
                    >
                        <div>
                            <p className="text-zinc-400 text-xs uppercase tracking-widest">{s.label}</p>
                            <p className="text-white font-display text-3xl font-bold mt-0.5">{s.value}</p>
                        </div>
                        <p className="text-lime-400/70 text-sm text-right max-w-[100px]">{s.sub}</p>
                    </motion.div>
                ))}
            </div>

            {/* Profile details */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 mb-8"
            >
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Your Info</p>
                <div className="space-y-3">
                    {profile.map((p) => (
                        <div key={p.label} className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">{p.label}</span>
                            <span className="text-white text-sm font-medium">{p.value}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="flex-1 py-4 rounded-2xl border border-zinc-700 text-zinc-400 font-semibold hover:border-zinc-500 transition-colors"
                >
                    ← Edit
                </button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onComplete}
                    className="flex-2 flex-grow py-4 rounded-2xl bg-lime-400 text-black font-bold shadow-[0_0_30px_rgba(163,230,53,0.3)] hover:shadow-[0_0_50px_rgba(163,230,53,0.5)] transition-shadow"
                >
                    Go to Dashboard 🚀
                </motion.button>
            </div>
        </motion.div>
    );
}