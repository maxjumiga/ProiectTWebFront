import { motion } from 'framer-motion';
import type { OnboardingData } from '../../types/onboarding';
import { calcBMI, calcBMR, calcTDEE, goalCalories, goalLabel, heightDisplay, bmiCategory } from '../../utils/calculations';

interface Props { data: OnboardingData; onComplete: () => void; onBack: () => void; }

export default function SummaryStep({ data, onComplete, onBack }: Props) {
    const { gender, age, heightCm, weightKg, goal } = data;
    const bmi = heightCm && weightKg ? calcBMI(weightKg, heightCm) : null;
    const bmr = gender && age && heightCm && weightKg ? calcBMR(weightKg, heightCm, age, gender) : null;
    const tdee = bmr ? calcTDEE(bmr) : null;
    const calories = tdee && goal ? goalCalories(tdee, goal) : null;

    const stats = [
        { label: 'BMI', value: bmi?.toString() ?? '—', sub: bmi ? bmiCategory(bmi) : '', color: 'bg-blue-500/10 border-blue-500/20' },
        { label: 'Daily Calories', value: calories ? `${calories} kcal` : '—', sub: 'per day', color: 'bg-orange-500/10 border-orange-500/20' },
        { label: 'BMR', value: bmr ? `${Math.round(bmr)} kcal` : '—', sub: 'base metabolic rate', color: 'bg-violet-500/10 border-[#42448A]/20' },
    ];

    const profile = [
        { label: 'Gender', value: gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : '—' },
        { label: 'Age', value: age ? `${age} years` : '—' },
        { label: 'Height', value: heightCm ? heightDisplay(heightCm) : '—' },
        { label: 'Weight', value: weightKg ? `${weightKg} kg` : '—' },
        { label: 'Goal', value: goal ? goalLabel(goal) : '—' },
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }} className="flex flex-col px-8 py-10 h-full overflow-y-auto">
            <div className="mb-6">
                <h2 className="text-3xl font-extrabold text-[#1E1F35]">Your Profile is Ready</h2>
                <p className="text-slate-600 text-sm mt-1">Here's what we calculated for you.</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
                {stats.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                        className={`${s.color} border rounded-2xl p-4`}>
                        <p className="text-slate-600 text-xs uppercase tracking-wider mb-1">{s.label}</p>
                        <p className="text-[#1E1F35] font-bold text-xl leading-tight">{s.value}</p>
                        <p className="text-slate-700 text-xs mt-1">{s.sub}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
                <p className="text-slate-600 text-xs uppercase tracking-widest mb-4">Your Info</p>
                <div className="space-y-3">
                    {profile.map((p) => (
                        <div key={p.label} className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm">{p.label}</span>
                            <span className="text-[#1E1F35] text-sm font-semibold">{p.value}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            <div className="flex gap-3">
                <button onClick={onBack} className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-500 font-semibold hover:border-[#42448A] transition-colors text-sm">← Edit</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onComplete}
                    className="flex-[2] py-3.5 rounded-2xl bg-[#42448A] hover:opacity-90 text-white font-bold shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all text-sm">
                    Go to Dashboard 🚀
                </motion.button>
            </div>
        </motion.div>
    );
}