import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function Landing() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    return (
        <div className="min-h-screen bg-[#F0F2F8] font-sans text-[#1A1A2E] overflow-x-hidden">
            {/* Navigation */}
            <nav className="w-full py-6 px-8 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#42448A] flex items-center justify-center shadow-lg shadow-[#42448A]/30">
                        <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white">
                            <path d="M4 16a2 2 0 0 1 2-2h2V9a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0v-1H6a2 2 0 0 1-2-2ZM24 9a1 1 0 0 1 2 0v14a1 1 0 0 1-2 0v-5h-2a2 2 0 0 1 0-4h2V9ZM12 7a1 1 0 0 1 1 1v16a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1ZM19 5a1 1 0 0 1 1 1v20a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1Z" />
                        </svg>
                    </div>
                    <span className="font-bold text-xl text-[#1E1F35] tracking-tight">Sănătate</span>
                </div>
                <div className="flex gap-4 items-center">
                    {isAuthenticated ? (
                        <Link to="/dashboard" className="px-5 py-2.5 font-medium bg-[#42448A] text-white rounded-xl shadow-lg shadow-[#42448A]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="px-5 py-2.5 font-medium text-[#42448A] hover:bg-[#42448A]/5 rounded-xl transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="px-5 py-2.5 font-medium bg-[#42448A] text-white rounded-xl shadow-lg shadow-[#42448A]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6 overflow-hidden">
                {/* Background Decorative Blob */}
                <div className="absolute top-0 right-0 -m-32 w-[500px] h-[500px] bg-[#42448A]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -m-32 w-[400px] h-[400px] bg-[#5BB6F5]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-7xl font-extrabold text-[#1E1F35] tracking-tight leading-tight mb-8"
                    >
                        Track Your Workouts.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#42448A] to-[#5BB6F5]">
                            Master Your Nutrition.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-[#272840]/70 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Your all-in-one personal fitness companion. Build healthy habits, reach your goals, and unlock a better version of yourself with data-driven insights.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-5 justify-center"
                    >
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="px-8 py-4 text-lg font-bold bg-[#42448A] text-white rounded-2xl shadow-xl shadow-[#42448A]/30 hover:shadow-2xl hover:-translate-y-1 transition-all">
                                Access Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="px-8 py-4 text-lg font-bold bg-[#42448A] text-white rounded-2xl shadow-xl shadow-[#42448A]/30 hover:shadow-2xl hover:-translate-y-1 transition-all">
                                    Get Started for Free
                                </Link>
                                <Link to="/login" className="px-8 py-4 text-lg font-bold bg-white text-[#1E1F35] rounded-2xl shadow-xl shadow-black/5 hover:bg-gray-50 transition-all border border-gray-100">
                                    Log Into Account
                                </Link>
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#1E1F35] mb-4">Everything You Need</h2>
                        <p className="text-lg text-[#272840]/70 max-w-2xl mx-auto">Powerful features built to simplify your health journey and give you the actionable data you need to succeed.</p>
                    </div>

                    <motion.div
                        variants={stagger}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                title: "Workout Tracking",
                                desc: "Log sets, reps, and weights easily. Monitor your volume and intensity over time with beautifully designed charts.",
                                icon: "💪",
                                color: "#FCAF79"
                            },
                            {
                                title: "Nutrition Monitoring",
                                desc: "Keep a close eye on your macros. Flexible tracking tailored to your specific dietary goals.",
                                icon: "🥗",
                                color: "#5BB6F5"
                            },
                            {
                                title: "Personalized Plan",
                                desc: "Receive customized daily targets based on your unique body metrics, goals, and experience level.",
                                icon: "🎯",
                                color: "#42448A"
                            }
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                variants={fadeIn}
                                className="bg-[#F0F2F8] p-8 rounded-3xl border border-white shadow-xl shadow-black/5 hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-2xl mb-6 border border-gray-100">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#1E1F35] mb-3">{f.title}</h3>
                                <p className="text-[#272840]/70 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-[#1E1F35] text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-lg text-white/60 max-w-2xl mx-auto">Three simple steps to start taking control of your fitness journey today.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-1/2 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-[#42448A] via-[#5BB6F5] to-[#FCAF79] -translate-y-1/2 opacity-30"></div>

                        {[
                            { step: "01", title: "Create Account", desc: "Sign up in seconds and get instant access to your new fitness dashboard." },
                            { step: "02", title: "Complete Onboarding", desc: "Tell us about yourself. Enter your metrics and goals so we can personalize your plan." },
                            { step: "03", title: "Track Progress", desc: "Use the dashboard daily to log metrics, track workouts, and monitor diet." }
                        ].map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center p-6"
                            >
                                <div className="w-16 h-16 rounded-full bg-[#1A1A2E] border-4 border-[#272840] flex items-center justify-center text-xl font-bold text-[#5BB6F5] mb-6 shadow-xl">
                                    {s.step}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                                <p className="text-white/60">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 relative overflow-hidden bg-[#F0F2F8]">
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold text-[#1E1F35] mb-8"
                    >
                        Ready to completely transform your lifestyle?
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="inline-block px-10 py-5 text-xl font-bold bg-gradient-to-r from-[#42448A] to-[#6063C7] text-white rounded-full shadow-2xl shadow-[#42448A]/40 hover:shadow-[#42448A]/60 hover:scale-105 transition-all">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link to="/register" className="inline-block px-10 py-5 text-xl font-bold bg-gradient-to-r from-[#42448A] to-[#6063C7] text-white rounded-full shadow-2xl shadow-[#42448A]/40 hover:shadow-[#42448A]/60 hover:scale-105 transition-all">
                                Start Your Fitness Journey
                            </Link>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-gray-200 text-center text-[#272840]/60 text-sm">
                <p>© {new Date().getFullYear()} Sănătate. All rights reserved.</p>
            </footer>
        </div>
    );
}
