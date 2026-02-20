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

const TOTAL_STEPS = 6; // excludes welcome (step 0) and summary

export default function App() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    gender: null,
    age: null,
    heightCm: null,
    weightKg: null,
    goal: null,
  });

  const setField = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);
  const complete = () => {
    localStorage.setItem('onboarding', JSON.stringify(data));
    setDone(true);
  };

  if (done) return <Dashboard data={data} />;

  // Progress: step 0 is welcome (no bar), steps 1-4 are inputs, step 5 is summary
  const showProgress = step > 0 && step < 6;
  const progressPct = step < 5 ? (step / TOTAL_STEPS) * 100 : 100;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-lime-400/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md min-h-[680px] bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Progress bar */}
        {showProgress && (
          <div className="px-6 pt-6 pb-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-lime-400 rounded-full"
                  initial={false}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
              <span className="text-zinc-600 text-xs font-mono">
                {step < 5 ? `${step}/${TOTAL_STEPS}` : '✓'}
              </span>
            </div>
          </div>
        )}

        {/* Step content */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="welcome" className="absolute inset-0">
                <WelcomeStep onNext={next} />
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="gender" className="absolute inset-0">
                <GenderStep
                  value={data.gender}
                  onChange={(v) => setField('gender', v)}
                  onNext={next}
                  onBack={back}
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="goal" className="absolute inset-0">
                <GoalStep
                  value={data.goal}
                  onChange={(v) => setField('goal', v)}
                  onNext={next}
                  onBack={back}
                />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="height" className="absolute inset-0">
                <HeightStep
                  value={data.heightCm}
                  onChange={(v) => setField('heightCm', v)}
                  onNext={next}
                  onBack={back}
                />
              </motion.div>
            )}
            {step === 4 && (
              <motion.div key="weight" className="absolute inset-0">
                <WeightStep
                  weightValue={data.weightKg}
                  onWeightChange={(v) => setField('weightKg', v)}
                  onNext={next}
                  onBack={back}
                />
              </motion.div>
            )}
            {step === 5 && (
              <motion.div key="age" className="absolute inset-0">
                <AgeStep
                  value={data.age}
                  onChange={(v) => setField('age', v)}
                  onNext={next}
                  onBack={back}
                />
              </motion.div>
            )}
            {step === 6 && (
              <motion.div key="summary" className="absolute inset-0">
                <SummaryStep data={data} onComplete={complete} onBack={back} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}