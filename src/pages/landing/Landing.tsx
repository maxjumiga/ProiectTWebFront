import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faUtensils, faBullseye, faUserPlus, faClipboardCheck, faChartLine, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import workoutUserImg from '../../assets/workout_app_user.png';
import nutritionUserImg from '../../assets/nutrition_app_user.png';
import './Landing.css';

const s = {
    // Section header wrapper
    header: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '4rem' } as React.CSSProperties,
    // Titles on light background
    title: { fontFamily: "'Sora', sans-serif", fontSize: 'clamp(1.9rem, 5vw, 2.7rem)', fontWeight: 800, textAlign: 'center', width: '100%', marginBottom: '1.25rem', color: '#1a1a2e' } as React.CSSProperties,
    // Subtitles on light background
    subtitle: { fontSize: '1.1rem', color: '#334155', textAlign: 'center', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.7 } as React.CSSProperties,
    // Titles on dark background
    titleDark: { fontFamily: "'Sora', sans-serif", fontSize: 'clamp(1.9rem, 5vw, 2.7rem)', fontWeight: 800, textAlign: 'center', width: '100%', marginBottom: '1.25rem', color: '#ffffff' } as React.CSSProperties,
    // Subtitles on dark background
    subtitleDark: { fontSize: '1.1rem', color: '#ffffff', textAlign: 'center', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.7, opacity: 1 } as React.CSSProperties,
} as const;


const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};
const stagger = { animate: { transition: { staggerChildren: 0.15 } } };

export default function Landing() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const scrollToFeatures = (e: React.MouseEvent) => {
        e.preventDefault();
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sectionRef = useRef<HTMLElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <div className="landing-page">
            {/* ── Nav ── */}
            <header className="landing-header">
                <nav className="landing-nav">
                    <div
                        className="landing-logo-container"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="landing-logo-icon">
                            <img src="/OmniTrackLogo.png" alt="OmniTrack" />
                        </div>
                        <span className="landing-logo-text">OmniTrack</span>
                    </div>
                    <div className="landing-nav-links">

                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn-primary">Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn-secondary">Login</Link>
                                <Link to="/register" className="btn-primary">Get Started</Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            {/* ── Hero ── */}
            <section id="hero" className="hero-section">

                <div className="hero-background-images">
                    <div className="hero-bg-panel">
                        <img src="/heroImgs/gym.jpg" alt="Gym" />
                        <div className="hero-bg-overlay" />
                    </div>
                    <div className="hero-bg-panel">
                        <img src="/heroImgs/cardio.jpg" alt="Cardio" />
                        <div className="hero-bg-overlay" />
                    </div>
                    <div className="hero-bg-panel">
                        <img src="/heroImgs/nutrition.jpg" alt="Nutrition" />
                        <div className="hero-bg-overlay" />
                    </div>
                </div>

                <div className="hero-content" style={{ maxWidth: '80rem' }}>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="hero-title"
                        style={{
                            color: '#fff',
                            textShadow: '0 4px 25px rgba(0,0,0,0.7)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            fontSize: 'clamp(2rem, 6vw, 3.5rem)', /* Forced size */
                            lineHeight: '1.2'
                        }}
                    >
                        <div style={{ whiteSpace: 'nowrap', marginBottom: '0.4rem' }}>
                            Track Your <span style={{ color: '#f59e0b' }}>Workouts.</span>
                        </div>
                        <div style={{ whiteSpace: 'nowrap' }}>
                            Master Your <span style={{ color: '#3b82f6' }}>Nutrition.</span>
                        </div>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hero-subtitle"
                        style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 2px 10px rgba(0,0,0,0.5)', marginTop: '2rem' }}
                    >
                        The intelligent companion for your fitness journey. Get data-driven insights,
                        personalized plans, and reach your goals faster than ever.
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="hero-actions">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn-hero-primary">Access Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn-hero-primary">Start Free Trial</Link>
                                <a href="#features" onClick={scrollToFeatures} className="btn-hero-secondary" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(5px)', textDecoration: 'none' }}>Learn More</a>
                            </>

                        )}
                    </motion.div>
                </div>
            </section>

            {/* ── Stats Bar ── */}
            <motion.div 
                className="stats-bar"
                variants={stagger}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
            >
                {[
                    { value: '50k+', label: 'Workouts Logged' },
                    { value: '12k+', label: 'Active Users' },
                    { value: '4.9/5', label: 'User Rating' },
                    { value: '24/7', label: 'Customer Support' },
                ].map((stat, i) => (
                    <motion.div key={i} variants={fadeInUp} className="stat-item">
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                    </motion.div>
                ))}
            </motion.div>


            {/* ── Capabilities ── */}
            <section className="features-section" id="features">

                <div className="section-container">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={s.header}>
                        <span className="section-badge">✦ Capabilities</span>
                        <h2 style={s.title}>Everything You Need</h2>
                        <p style={s.subtitle}>Powerful features built to simplify your health journey and give you the actionable data you need to succeed.</p>
                    </motion.div>
                    <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="features-grid">
                        {[
                            { title: 'Workout Intelligence', desc: "Log every set and rep with ease. Our analytics show you exactly how you're progressing over time.", icon: faDumbbell },
                            { title: 'Smart Nutrition', desc: "Comprehensive macro tracking. Know exactly what you're fueling your body with every single day.", icon: faUtensils },
                            { title: 'Data-Driven Plans', desc: 'Get targets tailored to your metabolism and goals. No more guesswork in your fitness routine.', icon: faBullseye },
                        ].map((f, i) => (
                            <motion.div key={i} variants={fadeInUp} className="feature-card">
                                <div className="feature-icon-wrapper"><FontAwesomeIcon icon={f.icon} /></div>
                                <h3 className="feature-card-title">{f.title}</h3>
                                <p className="feature-card-desc">{f.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Process ── */}
            <section 
                ref={sectionRef}
                className="how-it-works-section" 
                onMouseMove={handleMouseMove}
            >
                {/* Spotlight Light Effect */}
                <div 
                    className="spotlight-overlay"
                    style={{
                        background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.07), transparent 80%)`
                    }}
                ></div>



                <div className="section-container">

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={s.header}>
                        <span className="section-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', opacity: 1 }}>✦ Process</span>
                        <h2 style={s.titleDark}>Simple Roadmap</h2>
                        <p style={s.subtitleDark}>Three simple steps to start taking control of your fitness journey today.</p>
                    </motion.div>

                    <div className="steps-grid">
                        {[
                            { icon: faUserPlus, title: 'Create Account', desc: 'Sign up in seconds and get instant access to your new fitness dashboard.' },
                            { icon: faClipboardCheck, title: 'Complete Onboarding', desc: 'Tell us about yourself so we can calculate the perfect targets for you.' },
                            { icon: faChartLine, title: 'Track Progress', desc: 'Use the dashboard daily to log metrics and watch yourself reach new heights.' },
                        ].map((s2, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="step-card">
                                <div className="step-number"><FontAwesomeIcon icon={s2.icon} /></div>
                                <h3 className="process-title-white">{s2.title}</h3>
                                <p className="process-desc-white">{s2.desc}</p>
                            </motion.div>
                        ))}

                    </div>

                </div>
            </section>

            {/* ── Community ── */}
            <section className="reviews-section">
                <div className="section-container">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={s.header}>
                        <span className="section-badge">✦ Community</span>
                        <h2 style={s.title}>Success Stories</h2>
                        <p style={s.subtitle}>Join thousands of others who have transformed their lives using OmniTrack.</p>
                    </motion.div>
                    <div className="reviews-grid">
                        {[
                            { name: 'Greg Plitt', role: 'Fitness Icon & Legend', review: "The most intuitive tracking app I've ever used. It stays out of the way and lets me focus on the iron.", img: '/reviewPFP/greg.png' },
                            { name: 'Rachel Brathen', role: 'Yoga Instructor', review: 'I love how I can see my nutrition balance so clearly. It has helped me stay energized throughout the day.', img: '/reviewPFP/rachel.png' },
                            { name: 'Mike O\'Hearn', role: 'Titan & Bodybuilder', review: 'The progress charts are addictive. Seeing my bench press go up month after month is the best motivation.', img: '/reviewPFP/mikeohearn.jpg' },
                        ].map((r, i) => (

                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="review-card">
                                <div className="review-stars">★★★★★</div>
                                <p className="review-text">"{r.review}"</p>
                                <div className="review-author">
                                    <div className="author-avatar">
                                        <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    </div>
                                    <div className="author-info">
                                        <h4>{r.name}</h4>
                                        <span>{r.role}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>


                </div>
            </section>

            {/* ── CTA ── */}
            <section className="cta-section">
                <div className="cta-container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="section-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>✦ Join the Movement</span>
                        <h2 className="cta-title">Ready to transform your lifestyle?</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', fontSize: '1.2rem' }}>
                            Start your 14-day free trial today. No credit card required.
                        </p>

                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn-cta">
                                {isAuthenticated ? 'Go to Dashboard' : 'Get Started for Free'}
                            </Link>
                            <div className="btn-cta-pulse"></div>
                        </div>

                        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', opacity: 0.6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
                                <FontAwesomeIcon icon={faClipboardCheck} />
                                <span style={{ fontSize: '0.9rem' }}>Fast Setup</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
                                <FontAwesomeIcon icon={faChartLine} />
                                <span style={{ fontSize: '0.9rem' }}>Secure Data</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <div className="landing-logo-container" style={{ marginBottom: '1.5rem' }}>
                            <div className="landing-logo-icon">
                                <img src="/OmniTrackLogo.png" alt="OmniTrack" />
                            </div>
                            <span className="landing-logo-text" style={{ color: '#fff' }}>OmniTrack</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '18rem' }}>
                            The ultimate companion for tracking your fitness journey and nutritional goals. Built for results.
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="social-link"><FontAwesomeIcon icon={faDumbbell} /></a>
                            <a href="#" className="social-link"><FontAwesomeIcon icon={faUtensils} /></a>
                            <a href="#" className="social-link"><FontAwesomeIcon icon={faBullseye} /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Platform</h4>
                            <a href="#">Features</a>
                            <a href="#">Nutrition</a>
                            <a href="#">Workouts</a>
                            <a href="#">Pricing</a>
                        </div>
                        <div className="footer-column">
                            <h4>Company</h4>
                            <a href="#">About Us</a>
                            <a href="#">Success Stories</a>
                            <a href="#">Contact</a>
                            <a href="#">Privacy</a>
                        </div>
                        <div className="footer-column">
                            <h4>Resources</h4>
                            <a href="#">Blog</a>
                            <a href="#">Community</a>
                            <a href="#">Help Center</a>
                            <a href="#">API Docs</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} OmniTrack. All rights reserved. Crafted with passion for fitness.</p>
                </div>
            </footer>
        </div>
    );
}
