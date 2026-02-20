import { useState } from 'react';
import { motion } from 'framer-motion';
import type { OnboardingData } from '../types/onboarding';
import { calcBMI, calcBMR, calcTDEE, goalCalories, goalLabel, bmiCategory } from '../utils/calculations';

interface Props {
    data: OnboardingData;
}

const navItems = [
    { icon: '⊞', label: 'Dashboard', active: true },
    { icon: '📈', label: 'Progress', active: false },
    { icon: '🗓', label: 'Schedule', active: false },
    { icon: '☀', label: 'Wellness', active: false },
];

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bună dimineața';
    if (h < 18) return 'Bună ziua';
    return 'Bună seara';
}

export default function Dashboard({ data }: Props) {
    const [activeNav, setActiveNav] = useState(0);
    const { gender, age, heightCm, weightKg, goal } = data;

    const bmi = heightCm && weightKg ? calcBMI(weightKg, heightCm) : null;
    const bmr = gender && age && heightCm && weightKg ? calcBMR(weightKg, heightCm, age, gender) : null;
    const tdee = bmr ? calcTDEE(bmr) : null;
    const calories = tdee && goal ? goalCalories(tdee, goal) : null;

    const today = new Date().toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const cards = [
        {
            label: 'CALORII CONSUMATE ASTĂZI',
            value: '0',
            unit: 'kcal',
            target: calories ?? 0,
            sub: `Obiectiv: ${calories ?? '—'} kcal`,
            progress: 0,
            color: '#f97316',
            bg: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.03))',
            border: 'rgba(249,115,22,0.2)',
        },
        {
            label: 'APĂ BĂUTĂ ASTĂZI',
            value: '0',
            unit: 'ml',
            target: 3000,
            sub: 'din 3.000 ml zilnic',
            progress: 0,
            color: '#38bdf8',
            bg: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(56,189,248,0.03))',
            border: 'rgba(56,189,248,0.2)',
        },
    ];

    const quickStats = [
        { label: 'BMI', value: bmi?.toString() ?? '—', sub: bmi ? bmiCategory(bmi) : '', icon: '📊' },
        { label: 'Obiectiv', value: goal ? goalLabel(goal) : '—', sub: '', icon: '🎯' },
        { label: 'Greutate', value: weightKg ? `${weightKg} kg` : '—', sub: '', icon: '⚖️' },
        { label: 'Vârstă', value: age ? `${age} ani` : '—', sub: '', icon: '👤' },
    ];

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: '#0f1117' }}>
            {/* Sidebar */}
            <div
                className="w-16 flex flex-col items-center py-6 gap-6 shrink-0"
                style={{ background: '#161b27', borderRight: '1px solid #2a3347' }}
            >
                {/* Logo */}
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 shrink-0"
                    style={{ background: 'linear-gradient(135deg, #7c6ff7, #a89df9)' }}
                >
                    <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white">
                        <path d="M4 16a2 2 0 0 1 2-2h2V9a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0v-1H6a2 2 0 0 1-2-2ZM24 9a1 1 0 0 1 2 0v14a1 1 0 0 1-2 0v-5h-2a2 2 0 0 1 0-4h2V9ZM12 7a1 1 0 0 1 1 1v16a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1ZM19 5a1 1 0 0 1 1 1v20a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1Z" />
                    </svg>
                </div>

                {/* Nav */}
                <div className="flex flex-col gap-2 flex-1">
                    {navItems.map((item, i) => (
                        <button
                            key={item.label}
                            onClick={() => setActiveNav(i)}
                            title={item.label}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all"
                            style={activeNav === i
                                ? { background: 'rgba(124,111,247,0.2)', color: '#a89df9' }
                                : { color: '#3a4560' }
                            }
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>

                {/* Logout */}
                <button
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ color: '#3a4560' }}
                    title="Logout"
                >
                    ⇥
                </button>

                {/* Avatar */}
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: '#7c6ff7', color: 'white' }}
                >
                    {gender === 'male' ? 'M' : gender === 'female' ? 'F' : 'U'}
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-y-auto p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <p className="text-sm" style={{ color: '#6b7a99' }}>{getGreeting()} 👋</p>
                    <p className="text-xs mt-0.5 capitalize" style={{ color: '#3a4560' }}>{today}</p>
                    <h1 className="font-display text-2xl font-bold text-white mt-1">Dashboard</h1>
                </motion.div>

                {/* Top cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {cards.map((c, i) => (
                        <motion.div
                            key={c.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-2xl p-5"
                            style={{ background: c.bg, border: `1px solid ${c.border}` }}
                        >
                            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: c.color, opacity: 0.8 }}>{c.label}</p>
                            <div className="flex items-end gap-1 mb-1">
                                <span className="font-display text-3xl font-bold text-white">{c.value}</span>
                                <span className="text-sm mb-1" style={{ color: '#6b7a99' }}>{c.unit}</span>
                            </div>
                            <p className="text-xs mb-3" style={{ color: '#6b7a99' }}>{c.sub}</p>
                            {/* Progress bar */}
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${c.progress}%`, background: c.color }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick stats */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl p-5 mb-6"
                    style={{ background: '#161b27', border: '1px solid #2a3347' }}
                >
                    <h3 className="font-semibold text-white mb-4">Statistici rapide</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {quickStats.map((s) => (
                            <div
                                key={s.label}
                                className="rounded-xl p-3"
                                style={{ background: '#1e2535', border: '1px solid #2a3347' }}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-base">{s.icon}</span>
                                    <p className="text-xs uppercase tracking-wider" style={{ color: '#6b7a99' }}>{s.label}</p>
                                </div>
                                <p className="font-display text-lg font-bold text-white">{s.value}</p>
                                {s.sub && <p className="text-xs mt-0.5" style={{ color: '#6b7a99' }}>{s.sub}</p>}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Placeholder sections */}
                {[
                    { title: "Antrenamente de astăzi", icon: '💪' },
                    { title: "Jurnal alimentar", icon: '🥗' },
                    { title: "Evoluție săptămânală", icon: '📈' },
                ].map((section, i) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="rounded-2xl p-5 mb-4"
                        style={{ background: '#161b27', border: '1px solid #2a3347' }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span>{section.icon}</span>
                                <h3 className="font-semibold text-white text-sm">{section.title}</h3>
                            </div>
                            <button className="text-xs font-semibold" style={{ color: '#7c6ff7' }}>
                                Vezi tot →
                            </button>
                        </div>
                        <div
                            className="h-14 flex items-center justify-center rounded-xl"
                            style={{ border: '1.5px dashed #2a3347' }}
                        >
                            <p className="text-xs" style={{ color: '#3a4560' }}>În curând — începe să înregistrezi!</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Right panel — BMI Calculator */}
            <div
                className="w-64 shrink-0 p-5 overflow-y-auto"
                style={{ background: '#161b27', borderLeft: '1px solid #2a3347' }}
            >
                <h3 className="font-display font-bold text-white mb-1">BMI Calculator</h3>
                <p className="text-xs mb-6" style={{ color: '#6b7a99' }}>Calculează indicele tău de masă corporală</p>

                {/* Height slider */}
                <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm" style={{ color: '#6b7a99' }}>Înălțime</p>
                        <p className="text-sm font-semibold text-white">{heightCm ?? 170} <span style={{ color: '#6b7a99' }}>cm</span></p>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: '#2a3347' }}>
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${heightCm ? ((heightCm - 100) / 150) * 100 : 50}%`,
                                background: 'linear-gradient(90deg, #7c6ff7, #a89df9)'
                            }}
                        />
                    </div>
                </div>

                {/* Weight slider */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm" style={{ color: '#6b7a99' }}>Greutate</p>
                        <p className="text-sm font-semibold text-white">{weightKg ?? 70} <span style={{ color: '#6b7a99' }}>kg</span></p>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: '#2a3347' }}>
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${weightKg ? ((weightKg - 30) / 170) * 100 : 30}%`,
                                background: 'linear-gradient(90deg, #7c6ff7, #a89df9)'
                            }}
                        />
                    </div>
                </div>

                {/* BMI result */}
                <div className="rounded-2xl p-4" style={{ background: '#1e2535', border: '1px solid #2a3347' }}>
                    <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#6b7a99' }}>Body Mass Index (BMI)</p>
                    <p className="font-display text-4xl font-bold text-white mb-2">{bmi ?? '—'}</p>
                    {bmi && (
                        <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                                background: bmi < 18.5 ? 'rgba(56,189,248,0.2)' : bmi < 25 ? 'rgba(34,197,94,0.2)' : bmi < 30 ? 'rgba(251,191,36,0.2)' : 'rgba(239,68,68,0.2)',
                                color: bmi < 18.5 ? '#38bdf8' : bmi < 25 ? '#22c55e' : bmi < 30 ? '#fbbf24' : '#ef4444',
                            }}
                        >
                            {bmiCategory(bmi)}
                        </span>
                    )}

                    {/* BMI scale */}
                    <div className="mt-4 h-2 rounded-full overflow-hidden" style={{
                        background: 'linear-gradient(90deg, #38bdf8 0%, #22c55e 30%, #fbbf24 60%, #ef4444 100%)'
                    }} />
                    <div className="flex justify-between mt-1">
                        {['15', '18.5', '25', '30', '40'].map(v => (
                            <span key={v} className="text-xs" style={{ color: '#3a4560' }}>{v}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}