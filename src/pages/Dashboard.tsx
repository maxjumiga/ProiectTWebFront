import { motion } from 'framer-motion';
import type { OnboardingData } from '../types/onboarding';
import { calcBMI, calcBMR, calcTDEE, goalCalories, goalLabel } from '../utils/calculations';

interface Props {
    data: OnboardingData;
}

export default function Dashboard({ data }: Props) {
    const { gender, age, heightCm, weightKg, goal } = data;

    const bmi = heightCm && weightKg ? calcBMI(weightKg, heightCm) : null;
    const bmr = gender && age && heightCm && weightKg ? calcBMR(weightKg, heightCm, age, gender) : null;
    const tdee = bmr ? calcTDEE(bmr) : null;
    const calories = tdee && goal ? goalCalories(tdee, goal) : null;

    const cards = [
        { label: 'Daily Goal', value: calories ? `${calories} kcal` : '—', icon: '🔥', color: 'from-orange-500/20 to-orange-500/5' },
        { label: 'BMI', value: bmi?.toString() ?? '—', icon: '📊', color: 'from-blue-500/20 to-blue-500/5' },
        { label: 'Goal', value: goal ? goalLabel(goal) : '—', icon: '🎯', color: 'from-lime-500/20 to-lime-500/5' },
        { label: 'Weight', value: weightKg ? `${weightKg} kg` : '—', icon: '⚖️', color: 'from-purple-500/20 to-purple-500/5' },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[40%] w-[500px] h-[500px] bg-lime-400/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-10"
                >
                    <div>
                        <p className="text-zinc-500 text-sm">Good morning 👋</p>
                        <h1 className="font-display text-3xl font-bold mt-1">Dashboard</h1>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center">
                        <svg viewBox="0 0 32 32" className="w-5 h-5 fill-black">
                            <path d="M4 16a2 2 0 0 1 2-2h2V9a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0v-1H6a2 2 0 0 1-2-2ZM24 9a1 1 0 0 1 2 0v14a1 1 0 0 1-2 0v-5h-2a2 2 0 0 1 0-4h2V9ZM12 7a1 1 0 0 1 1 1v16a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1ZM19 5a1 1 0 0 1 1 1v20a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1Z" />
                        </svg>
                    </div>
                </motion.div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {cards.map((c, i) => (
                        <motion.div
                            key={c.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-gradient-to-br ${c.color} border border-zinc-800 rounded-2xl p-5`}
                        >
                            <p className="text-2xl mb-3">{c.icon}</p>
                            <p className="text-zinc-400 text-xs uppercase tracking-widest">{c.label}</p>
                            <p className="text-white font-display text-2xl font-bold mt-1">{c.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Placeholder sections */}
                {['Today\'s Workouts', 'Nutrition Log', 'Weekly Progress'].map((section, i) => (
                    <motion.div
                        key={section}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 mb-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white">{section}</h3>
                            <button className="text-lime-400 text-sm hover:text-lime-300 transition-colors">View all →</button>
                        </div>
                        <div className="h-16 flex items-center justify-center border border-dashed border-zinc-700 rounded-xl">
                            <p className="text-zinc-600 text-sm">Coming soon — start logging!</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}