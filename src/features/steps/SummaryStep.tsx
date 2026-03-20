import { motion } from 'framer-motion';
import type { OnboardingData } from '../../types/onboarding';
import { calcBMI, calcBMR, calcTDEE, goalCalories, goalLabel, heightDisplay, bmiCategory } from '../../utils/calculations';
import './Steps.css';

interface Props { data: OnboardingData; onComplete: () => void; onBack: () => void; }

export default function SummaryStep({ data, onComplete, onBack }: Props) {
    const { gender, age, heightCm, weightKg, goal } = data;
    const bmi = heightCm && weightKg ? calcBMI(weightKg, heightCm) : null;
    const bmr = gender && age && heightCm && weightKg ? calcBMR(weightKg, heightCm, age, gender) : null;
    const tdee = bmr ? calcTDEE(bmr) : null;
    const calories = tdee && goal ? goalCalories(tdee, goal) : null;

    const stats = [
        { label: 'BMI', value: bmi?.toString() ?? '—', sub: bmi ? bmiCategory(bmi) : '', colorClass: 'blue' },
        { label: 'Daily Calories', value: calories ? `${calories} kcal` : '—', sub: 'per day', colorClass: 'orange' },
        { label: 'BMR', value: bmr ? `${Math.round(bmr)} kcal` : '—', sub: 'base rate', colorClass: 'violet' },
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
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            className="step-container summary-container"
        >
            <div className="step-header">
                <h2 className="step-title">Your Profile is Ready</h2>
                <p className="step-desc">Here's what we calculated for you.</p>
            </div>

            <div className="stats-grid">
                {stats.map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className={`stat-card ${s.colorClass}`}
                    >
                        <p className="stat-label">{s.label}</p>
                        <p className="stat-value">{s.value}</p>
                        <p className="stat-sub">{s.sub}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="profile-card"
            >
                <p className="profile-header">Your Info</p>
                <div className="profile-list">
                    {profile.map((p) => (
                        <div key={p.label} className="profile-item">
                            <span className="profile-item-label">{p.label}</span>
                            <span className="profile-item-value">{p.value}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            <div className="step-actions">
                <button onClick={onBack} className="btn-back">← Edit</button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onComplete}
                    className="btn-complete"
                >
                    Go to Dashboard 🚀
                </motion.button>
            </div>
        </motion.div>
    );
}