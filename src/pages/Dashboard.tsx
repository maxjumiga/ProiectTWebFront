import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { OnboardingData } from '../types/onboarding';
import { calcBMI, calcBMR, calcTDEE, goalCalories, goalLabel, bmiCategory } from '../utils/calculations';
import './Dashboard.css';

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

export default function Dashboard() {
    const [activeNav, setActiveNav] = useState(0);
    const [data, setData] = useState<OnboardingData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem('onboarding');
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) { }
        }
    }, []);

    const onExit = () => {
        navigate('/');
    };

    const onLogout = () => {
        sessionStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('onboarding');
        localStorage.removeItem('onboardingCompleted');
        navigate('/');
    };

    if (!data) return null;

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
        <div className="dashboard-layout">
            {/* Sidebar */}
            <div className="dashboard-sidebar">
                {/* Logo */}
                <div className="sidebar-logo">
                    <svg viewBox="0 0 32 32">
                        <path d="M4 16a2 2 0 0 1 2-2h2V9a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0v-1H6a2 2 0 0 1-2-2ZM24 9a1 1 0 0 1 2 0v14a1 1 0 0 1-2 0v-5h-2a2 2 0 0 1 0-4h2V9ZM12 7a1 1 0 0 1 1 1v16a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1ZM19 5a1 1 0 0 1 1 1v20a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1Z" />
                    </svg>
                </div>

                {/* Nav */}
                <div className="sidebar-nav-container">
                    {navItems.map((item, i) => (
                        <button
                            key={item.label}
                            onClick={() => setActiveNav(i)}
                            title={item.label}
                            className={`sidebar-nav-btn ${activeNav === i ? 'active' : 'inactive'}`}
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>

                {/* Home / Exit Dashboard */}
                <button
                    onClick={onExit}
                    className="sidebar-action-btn"
                    style={{ marginTop: 'auto' }}
                    title="Exit Dashboard"
                >
                    🏠
                </button>

                {/* Logout */}
                <button
                    onClick={onLogout}
                    className="sidebar-logout-btn"
                    title="LOG OUT"
                >
                    LOG<br />OUT
                </button>

                {/* Avatar */}
                <div className="sidebar-avatar">
                    {gender === 'male' ? 'M' : gender === 'female' ? 'F' : 'U'}
                </div>
            </div>

            {/* Main content */}
            <div className="dashboard-main">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dashboard-header"
                >
                    <p className="header-greeting">{getGreeting()} 👋</p>
                    <p className="header-date">{today}</p>
                    <h1 className="header-title">Dashboard</h1>
                </motion.div>

                {/* Top cards */}
                <div className="top-cards-grid">
                    {cards.map((c, i) => (
                        <motion.div
                            key={c.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="tracking-card"
                            style={{ background: c.bg, border: `1px solid ${c.border}` }}
                        >
                            <p className="tracking-card-label" style={{ color: c.color }}>{c.label}</p>
                            <div className="tracking-card-value-container">
                                <span className="tracking-card-value">{c.value}</span>
                                <span className="tracking-card-unit">{c.unit}</span>
                            </div>
                            <p className="tracking-card-sub">{c.sub}</p>
                            {/* Progress bar */}
                            <div className="progress-bar-bg">
                                <div
                                    className="progress-bar-fill"
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
                    className="quick-stats-section"
                >
                    <h3 className="section-title">Statistici rapide</h3>
                    <div className="quick-stats-grid">
                        {quickStats.map((s) => (
                            <div key={s.label} className="stat-box">
                                <div className="stat-box-header">
                                    <span className="stat-icon">{s.icon}</span>
                                    <p className="stat-label">{s.label}</p>
                                </div>
                                <p className="stat-value">{s.value}</p>
                                {s.sub && <p className="stat-sub">{s.sub}</p>}
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
                        className="placeholder-section"
                    >
                        <div className="placeholder-header">
                            <div className="placeholder-title-group">
                                <span>{section.icon}</span>
                                <h3 className="placeholder-title">{section.title}</h3>
                            </div>
                            <button className="placeholder-action">
                                Vezi tot →
                            </button>
                        </div>
                        <div className="placeholder-box">
                            <p className="placeholder-text">În curând — începe să înregistrezi!</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Right panel — BMI Calculator */}
            <div className="dashboard-right-panel">
                <h3 className="panel-title">BMI Calculator</h3>
                <p className="panel-subtitle">Calculează indicele tău de masă corporală</p>

                {/* Height slider */}
                <div className="slider-group">
                    <div className="slider-header">
                        <p className="slider-label">Înălțime</p>
                        <p className="slider-value">{heightCm ?? 170} <span className="slider-unit">cm</span></p>
                    </div>
                    <div className="slider-track">
                        <div
                            className="slider-fill"
                            style={{
                                width: `${heightCm ? ((heightCm - 100) / 150) * 100 : 50}%`
                            }}
                        />
                    </div>
                </div>

                {/* Weight slider */}
                <div className="slider-group large-mb">
                    <div className="slider-header">
                        <p className="slider-label">Greutate</p>
                        <p className="slider-value">{weightKg ?? 70} <span className="slider-unit">kg</span></p>
                    </div>
                    <div className="slider-track">
                        <div
                            className="slider-fill"
                            style={{
                                width: `${weightKg ? ((weightKg - 30) / 170) * 100 : 30}%`
                            }}
                        />
                    </div>
                </div>

                {/* BMI result */}
                <div className="bmi-result-card">
                    <p className="bmi-card-label">Body Mass Index (BMI)</p>
                    <p className="bmi-card-value">{bmi ?? '—'}</p>
                    {bmi && (
                        <span
                            className="bmi-category-badge"
                            style={{
                                background: bmi < 18.5 ? 'rgba(56,189,248,0.2)' : bmi < 25 ? 'rgba(34,197,94,0.2)' : bmi < 30 ? 'rgba(251,191,36,0.2)' : 'rgba(239,68,68,0.2)',
                                color: bmi < 18.5 ? '#38bdf8' : bmi < 25 ? '#22c55e' : bmi < 30 ? '#fbbf24' : '#ef4444',
                            }}
                        >
                            {bmiCategory(bmi)}
                        </span>
                    )}

                    {/* BMI scale */}
                    <div className="bmi-scale-bar" />
                    <div className="bmi-scale-labels">
                        {['15', '18.5', '25', '30', '40'].map(v => (
                            <span key={v} className="bmi-scale-label">{v}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}