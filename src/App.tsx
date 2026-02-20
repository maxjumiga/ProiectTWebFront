import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { OnboardingData } from './types/onboarding';
import WelcomeStep from './features/steps/WelcomeStep';
import GenderStep from './features/steps/GenderStep';
import GoalStep from './features/steps/GoalStep';
import HeightStep from './features/steps/HeightStep';
import WeightStep from './features/steps/WeightStep';
import AgeStep from './features/steps/AgeStep';
import SummaryStep from './features/steps/SummaryStep';
import Dashboard from './pages/Dashboard';

const TOTAL_STEPS = 6;
const stepLabels = ['Welcome', 'Gender', 'Goal', 'Height', 'Weight', 'Age', 'Summary'];

export default function App() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    gender: null, age: null, heightCm: null, weightKg: null, goal: null,
  });

  const setField = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);
  const complete = () => { localStorage.setItem('onboarding', JSON.stringify(data)); setDone(true); };

  if (done) return <Dashboard data={data} />;

  const isWelcome = step === 0;

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl min-h-[600px] flex rounded-3xl overflow-hidden shadow-2xl">

        {/* SIDEBAR */}
        {!isWelcome && (
          <div className="w-72 shrink-0 bg-[#1a1d2e] flex flex-col p-8">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
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
                      ${isDone ? 'bg-violet-600 text-white' : isActive ? 'bg-violet-600/20 border-2 border-violet-500 text-violet-400' : 'bg-[#252840] text-zinc-600'}`}>
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
              <div className="h-1.5 bg-[#252840] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-violet-600 rounded-full"
                  initial={false}
                  animate={{ width: `${(Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className="flex-1 bg-[#13151f] relative overflow-hidden">
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