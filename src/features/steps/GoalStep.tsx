import { motion } from 'framer-motion';
import type { Goal } from '../../types/onboarding';
import './Steps.css';

interface Props { value: Goal | null; onChange: (v: Goal) => void; onNext: () => void; onBack: () => void; }

const options: { value: Goal; label: string; desc: string; emoji: string }[] = [
    { value: 'lose', label: 'Lose Weight', desc: 'Burn fat, reduce body weight', emoji: '🔥' },
    { value: 'maintain', label: 'Stay in Shape', desc: 'Maintain my current physique', emoji: '⚖️' },
    { value: 'gain', label: 'Build Muscle', desc: 'Increase strength & muscle mass', emoji: '💪' },
];

export default function GoalStep({ value, onChange, onNext, onBack }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            className="step-container"
        >
            <div className="step-header">
                <span className="step-sub-label">Step 2 of 6</span>
                <h2 className="step-title">What's your main goal?</h2>
                <p className="step-desc">This shapes your calorie targets & plans.</p>
            </div>

            <div className="step-content">
                {options.map((opt) => (
                    <motion.button
                        key={opt.value}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => onChange(opt.value)}
                        className={`option-btn ${value === opt.value ? 'selected' : 'normal'}`}
                    >
                        <span className="option-emoji">{opt.emoji}</span>
                        <div className="option-text">
                            <p className="option-label">{opt.label}</p>
                            <p className="option-sub">{opt.desc}</p>
                        </div>
                        {value === opt.value && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="option-checkmark"
                            >
                                ✓
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            <div className="step-actions">
                <button onClick={onBack} className="btn-back">← Back</button>
                <button onClick={onNext} disabled={!value} className="btn-next">Continue →</button>
            </div>
        </motion.div>
    );
}