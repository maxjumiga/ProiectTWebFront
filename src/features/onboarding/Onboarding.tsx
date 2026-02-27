import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import type { OnboardingData } from '../../types/onboarding';
import WelcomeStep from '../steps/WelcomeStep';
import GenderStep from '../steps/GenderStep';
import GoalStep from '../steps/GoalStep';
import HeightStep from '../steps/HeightStep';
import WeightStep from '../steps/WeightStep';
import AgeStep from '../steps/AgeStep';
import SummaryStep from '../steps/SummaryStep';

const TOTAL_STEPS = 6;
const stepLabels = ['Welcome', 'Gender', 'Goal', 'Height', 'Weight', 'Age', 'Summary'];

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [data, setData] = useState<OnboardingData>(() => {
        const saved = localStorage.getItem('onboarding');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return { gender: null, age: null, heightCm: null, weightKg: null, goal: null };
    });

    const setField = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
        setData((prev) => ({ ...prev, [key]: value }));

    const next = () => setStep((s) => s + 1);
    const back = () => setStep((s) => s - 1);

    const complete = () => {
        localStorage.setItem('onboarding', JSON.stringify(data));
        localStorage.setItem('onboardingCompleted', 'true');

        try {
            const currentUserStr = localStorage.getItem('user');
            if (currentUserStr) {
                const currentUser = JSON.parse(currentUserStr);
                const email = currentUser.email;
                let users = JSON.parse(localStorage.getItem('users') || '{}');
                if (users[email]) {
                    users[email].onboardingCompleted = true;
                    // also store the data if desired
                    users[email].onboardingData = data;
                    localStorage.setItem('users', JSON.stringify(users));
                }
            }
        } catch (e) { }

        navigate('/dashboard');
    };

    const isWelcome = step === 0;

    return (
        <div className="min-h-screen bg-[#F0F2F8] flex items-center justify-center p-4 relative">
            <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white text-[#42448A] font-bold rounded-xl shadow-sm hover:shadow-md transition-all z-10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Home
            </Link>
            <div className="w-full max-w-4xl min-h-[600px] flex rounded-3xl overflow-hidden shadow-2xl">

                {/* SIDEBAR */}
                {!isWelcome && (
                    <div className="w-72 shrink-0 bg-[#1E1F35] flex flex-col p-8">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-9 h-9 rounded-xl bg-[#42448A] flex items-center justify-center">
                                <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white">
                                    <path d="M4 16a2 2 0 0 1 2-2h2V9a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0v-1H6a2 2 0 0 1-2-2ZM24 9a1 1 0 0 1 2 0v14a1 1 0 0 1-2 0v-5h-2a2 2 0 0 1 0-4h2V9ZM12 7a1 1 0 0 1 1 1v16a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1ZM19 5a1 1 0 0 1 1 1v20a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1Z" />
                                </svg>
                            </div>
                            <span className="text-white font-bold text-lg">Sănătate</span>
                        </div>

                        <div className="flex flex-col gap-1 flex-1">
                            {stepLabels.slice(1).map((label, i) => {
                                const stepNum = i + 1;
                                const isActive = step === stepNum;
                                const isDone = step > stepNum;
                                return (
                                    <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
                      ${isDone ? 'bg-[#42448A] text-white' : isActive ? 'bg-[#42448A]/10 border-2 border-[#42448A] text-[#42448A]' : 'bg-[#272840] text-zinc-600'}`}>
                                            {isDone ? '✓' : stepNum}
                                        </div>
                                        <span className={`text-sm font-medium ${isActive ? 'text-white' : isDone ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                            {label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8">
                            <div className="flex justify-between text-xs text-zinc-500 mb-2">
                                <span>Progress</span>
                                <span>{Math.round((Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100)}%</span>
                            </div>
                            <div className="h-1.5 bg-[#272840] rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#42448A] rounded-full"
                                    initial={false}
                                    animate={{ width: `${(Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100}%` }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT */}
                <div className="flex-1 bg-white relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 0 && <motion.div key="welcome" className="absolute inset-0"><WelcomeStep onNext={next} /></motion.div>}
                        {step === 1 && <motion.div key="gender" className="absolute inset-0"><GenderStep value={data.gender} onChange={(v) => setField('gender', v)} onNext={next} onBack={back} /></motion.div>}
                        {step === 2 && <motion.div key="goal" className="absolute inset-0"><GoalStep value={data.goal} onChange={(v) => setField('goal', v)} onNext={next} onBack={back} /></motion.div>}
                        {step === 3 && <motion.div key="height" className="absolute inset-0"><HeightStep value={data.heightCm} onChange={(v) => setField('heightCm', v)} onNext={next} onBack={back} /></motion.div>}
                        {step === 4 && <motion.div key="weight" className="absolute inset-0"><WeightStep weightValue={data.weightKg} onWeightChange={(v) => setField('weightKg', v)} onNext={next} onBack={back} /></motion.div>}
                        {step === 5 && <motion.div key="age" className="absolute inset-0"><AgeStep value={data.age} onChange={(v) => setField('age', v)} onNext={next} onBack={back} /></motion.div>}
                        {step === 6 && <motion.div key="summary" className="absolute inset-0"><SummaryStep data={data} onComplete={complete} onBack={back} /></motion.div>}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
