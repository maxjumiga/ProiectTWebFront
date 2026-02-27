import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill everything in');
            return;
        }

        let users: Record<string, any> = {};
        try {
            users = JSON.parse(localStorage.getItem('users') || '{}');
        } catch (e) { }

        const userRecord = users[email];
        if (!userRecord || userRecord.password !== password) {
            setError('Invalid email or password');
            return;
        }

        // Simulate login
        sessionStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ email }));

        // Restore onboarding data if exists (optional but helpful)
        if (userRecord.onboardingData) {
            localStorage.setItem('onboarding', JSON.stringify(userRecord.onboardingData));
        }

        // Set global flag
        localStorage.setItem('onboardingCompleted', userRecord.onboardingCompleted ? 'true' : 'false');

        if (userRecord.onboardingCompleted) {
            navigate('/dashboard');
        } else {
            navigate('/onboarding');
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F8] flex items-center justify-center p-4 relative">
            <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white text-[#42448A] font-bold rounded-xl shadow-sm hover:shadow-md transition-all z-10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Home
            </Link>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100"
            >
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-[#42448A] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#42448A]/30">
                        <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white">
                            <path d="M4 16a2 2 0 0 1 2-2h2V9a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0v-1H6a2 2 0 0 1-2-2ZM24 9a1 1 0 0 1 2 0v14a1 1 0 0 1-2 0v-5h-2a2 2 0 0 1 0-4h2V9ZM12 7a1 1 0 0 1 1 1v16a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1ZM19 5a1 1 0 0 1 1 1v20a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1Z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[#1E1F35] mb-2">Welcome Back</h2>
                    <p className="text-[#272840]/60">Log into your Sănătate account</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-[#FCAF79]/10 text-[#e65c00] text-sm font-medium text-center border border-[#FCAF79]/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-bold text-[#1A1A2E] mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#F0F2F8] border-none rounded-2xl px-5 py-4 text-[#1A1A2E] outline-none focus:ring-2 focus:ring-[#42448A]/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#1A1A2E] mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#F0F2F8] border-none rounded-2xl px-5 py-4 text-[#1A1A2E] outline-none focus:ring-2 focus:ring-[#42448A]/50 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 mt-2 bg-[#42448A] text-white font-bold rounded-2xl shadow-xl shadow-[#42448A]/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all text-lg"
                    >
                        Log In
                    </button>
                </form>

                <p className="text-center mt-8 text-[#272840]/60 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-[#42448A] hover:underline">
                        Sign up here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
