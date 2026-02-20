import { motion } from 'framer-motion';

interface Props { onNext: () => void; }

export default function WelcomeStep({ onNext }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center px-10 py-16 h-full bg-[#13151f]"
        >
            <motion.div
                initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5, ease: 'backOut' }}
                className="w-20 h-20 rounded-2xl bg-violet-600 flex items-center justify-center shadow-[0_0_50px_rgba(124,58,237,0.5)] mb-10 mx-auto"
            >
                <svg viewBox="0 0 32 32" className="w-10 h-10 fill-white">
                    <path d="M4 16a2 2 0 0 1 2-2h2V9a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0v-1H6a2 2 0 0 1-2-2ZM24 9a1 1 0 0 1 2 0v14a1 1 0 0 1-2 0v-5h-2a2 2 0 0 1 0-4h2V9ZM12 7a1 1 0 0 1 1 1v16a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1ZM19 5a1 1 0 0 1 1 1v20a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1Z" />
                </svg>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-5xl font-extrabold text-white leading-tight mb-4"
            >
                Your body.<br /><span className="text-violet-400">Your data.</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                className="text-zinc-400 text-base max-w-xs mb-10 leading-relaxed"
            >
                Build your personal profile so we can tailor workouts and nutrition exactly to you.
            </motion.p>

            <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={onNext}
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base px-10 py-4 rounded-2xl shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all duration-200"
            >
                Get Started →
            </motion.button>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                className="text-zinc-600 text-sm mt-5">Takes less than 2 minutes</motion.p>
        </motion.div>
    );
}