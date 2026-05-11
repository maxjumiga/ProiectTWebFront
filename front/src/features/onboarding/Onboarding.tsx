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
import './Onboarding.css';

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

    const complete = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(
                "https://localhost:7025/api/session/complete-onboarding",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        gender: data.gender,
                        age: data.age,
                        height: data.heightCm,
                        weight: data.weightKg,
                        goal: data.goal
                    })
                }
            );

            if (!response.ok) {
                console.error(await response.text());
                return;
            }

            localStorage.setItem(
                "onboardingCompleted",
                "true"
            );

            localStorage.setItem(
                "onboarding",
                JSON.stringify(data)
            );

            navigate("/dashboard");

        } catch (err) {
            console.error(err);
        }
    };

    const isWelcome = step === 0;

    return (
        <div className="onboarding-container">
            <Link to="/" className="onboarding-back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Home
            </Link>
            <div className="onboarding-card">

                {/* SIDEBAR */}
                {!isWelcome && (
                    <div className="onboarding-sidebar">
                        <div className="sidebar-logo">
                            <div className="sidebar-logo-icon">
                                <img src="/OmniTrackLogo.png" alt="OmniTrack Logo" />
                            </div>
                            <span className="sidebar-logo-text">OmniTrack</span>
                        </div>

                        <div className="sidebar-steps">
                            {stepLabels.slice(1).map((label, i) => {
                                const stepNum = i + 1;
                                const isActive = step === stepNum;
                                const isDone = step > stepNum;

                                let indicatorClass = "step-indicator pending";
                                if (isDone) indicatorClass = "step-indicator done";
                                else if (isActive) indicatorClass = "step-indicator active";

                                let labelClass = "step-label pending";
                                if (isActive) labelClass = "step-label active";
                                else if (isDone) labelClass = "step-label done";

                                return (
                                    <div key={label} className="sidebar-step">
                                        <div className={indicatorClass}>
                                            {isDone ? '✓' : stepNum}
                                        </div>
                                        <span className={labelClass}>
                                            {label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="sidebar-progress">
                            <div className="progress-header">
                                <span>Progress</span>
                                <span>{Math.round((Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100)}%</span>
                            </div>
                            <div className="progress-bar-container">
                                <motion.div
                                    className="progress-bar-fill"
                                    initial={false}
                                    animate={{ width: `${(Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100}%` }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT */}
                <div className="onboarding-content">
                    <AnimatePresence mode="wait">
                        {step === 0 && <motion.div key="welcome" className="onboarding-step-wrapper"><WelcomeStep onNext={next} /></motion.div>}
                        {step === 1 && <motion.div key="gender" className="onboarding-step-wrapper"><GenderStep value={data.gender} onChange={(v) => setField('gender', v)} onNext={next} onBack={back} /></motion.div>}
                        {step === 2 && <motion.div key="goal" className="onboarding-step-wrapper"><GoalStep value={data.goal} onChange={(v) => setField('goal', v)} onNext={next} onBack={back} /></motion.div>}
                        {step === 3 && <motion.div key="height" className="onboarding-step-wrapper"><HeightStep value={data.heightCm} onChange={(v) => setField('heightCm', v)} onNext={next} onBack={back} /></motion.div>}
                        {step === 4 && <motion.div key="weight" className="onboarding-step-wrapper"><WeightStep weightValue={data.weightKg} onWeightChange={(v) => setField('weightKg', v)} onNext={next} onBack={back} /></motion.div>}
                        {step === 5 && <motion.div key="age" className="onboarding-step-wrapper"><AgeStep value={data.age} onChange={(v) => setField('age', v)} onNext={next} onBack={back} /></motion.div>}
                        {step === 6 && <motion.div key="summary" className="onboarding-step-wrapper"><SummaryStep data={data} onComplete={complete} onBack={back} /></motion.div>}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
