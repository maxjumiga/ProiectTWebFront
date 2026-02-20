import { motion } from 'framer-motion';

interface Props {
    onNext: () => void;
}

export default function WelcomeStep({ onNext }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -32 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center text-center px-6 py-16 h-full"
        >
            {/* Logo mark */}
            <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6, ease: 'backOut' }}
                className="mb-10"
            >
                <div className="w-20 h-20 rounded-2xl bg-lime-400 flex items-center justify-center shadow-[0_0_40px_rgba(163,230,53,0.4)] mx-auto">
                    <svg viewBox="0 0 32 32" className="w-10 h-10 fill-black">
                        <path d="M4 16a2 2 0 0 1 2-2h2V9a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0v-1H6a2 2 0 0 1-2-2ZM24 9a1 1 0 0 1 2 0v14a1 1 0 0 1-2 0v-5h-2a2 2 0 0 1 0-4h2V9ZM12 7a1 1 0 0 1 1 1v16a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1ZM19 5a1 1 0 0 1 1 1v20a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1Z" />
                    </svg>
                </div>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="font-display text-5xl font-bold text-white leading-tight mb-4"
            >
                Your body.<br />
                <span className="text-lime-400">Your data.</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-zinc-400 text-lg max-w-sm mb-12 leading-relaxed"
            >
                Let's build your personal profile so we can tailor workouts and nutrition exactly to you.
            </motion.p>

            <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onNext}
                className="bg-lime-400 text-black font-semibold text-lg px-10 py-4 rounded-2xl shadow-[0_0_30px_rgba(163,230,53,0.3)] hover:shadow-[0_0_50px_rgba(163,230,53,0.5)] transition-shadow duration-300"
            >
                Get Started →
            </motion.button>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-zinc-600 text-sm mt-6"
            >
                Takes less than 2 minutes
            </motion.p>
        </motion.div>
    );
}