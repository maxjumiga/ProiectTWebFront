import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import workoutUserImg from '../../assets/workout_app_user.png';
import nutritionUserImg from '../../assets/nutrition_app_user.png';
import './Landing.css'; const fadeIn = {
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
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

    return (
        <div className="landing-page">
            {/* Navigation */}
            <header className="landing-header">
                <nav className="landing-nav">
                    <div className="landing-logo-container">
                        <div className="landing-logo-icon">
                            <svg viewBox="0 0 32 32">
                                <path d="M4 16a2 2 0 0 1 2-2h2V9a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0v-1H6a2 2 0 0 1-2-2ZM24 9a1 1 0 0 1 2 0v14a1 1 0 0 1-2 0v-5h-2a2 2 0 0 1 0-4h2V9ZM12 7a1 1 0 0 1 1 1v16a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1ZM19 5a1 1 0 0 1 1 1v20a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1Z" />
                            </svg>
                        </div>
                        <span className="landing-logo-text">Sănătate</span>
                    </div>
                    <div className="landing-nav-links">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn-primary">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn-secondary">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                {/* Faint Illustrations */}
                <img src={workoutUserImg} alt="Workout App User" className="hero-illustration hero-illustration-right" />
                <img src={nutritionUserImg} alt="Nutrition App User" className="hero-illustration hero-illustration-left" />

                {/* Background Decorative Blob */}
                <div className="hero-blob-right" />
                <div className="hero-blob-left" />

                <div className="hero-content">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="hero-title"
                    >
                        Track Your Workouts.<br />
                        <span>
                            Master Your Nutrition.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hero-subtitle"
                    >
                        Your all-in-one personal fitness companion. Build healthy habits, reach your goals, and unlock a better version of yourself with data-driven insights.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="hero-actions"
                    >
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn-hero-primary">
                                Access Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn-hero-primary">
                                    Get Started for Free
                                </Link>
                                <Link to="/login" className="btn-hero-secondary">
                                    Log Into Account
                                </Link>
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">✦ Features</span>
                        <h2 className="section-title" style={{ fontSize: '4rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem', color: '#1E1F35', textAlign: 'center' }}>Everything You Need</h2>
                        <span className="section-title-accent" />
                        <p className="section-subtitle" style={{ fontSize: '1.2rem', lineHeight: 1.7, textAlign: 'center', color: 'rgba(39,40,64,0.65)', maxWidth: '42rem' }}>Powerful features built to simplify your health journey and give you the actionable data you need to succeed.</p>
                    </div>

                    <motion.div
                        variants={stagger}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                        className="features-grid"
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
                                className="feature-card"
                            >
                                <div className="feature-icon-wrapper" style={{ color: f.color }}>
                                    {f.icon}
                                </div>
                                <h3 className="feature-card-title">{f.title}</h3>
                                <p className="feature-card-desc">{f.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title" style={{ fontSize: '4rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem', color: '#fff', textAlign: 'center' }}>How It Works</h2>
                        <span className="section-title-accent" style={{ background: 'linear-gradient(90deg, #5BB6F5, #FCAF79)' }} />
                        <p className="section-subtitle" style={{ fontSize: '1.2rem', lineHeight: 1.7, textAlign: 'center', color: 'rgba(255,255,255,1)', maxWidth: '42rem' }}>Three simple steps to start taking control of your fitness journey today.</p>
                    </div>

                    <div className="steps-grid">
                        <div className="steps-line"></div>

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
                                className="step-card"
                            >
                                <div className="step-number">
                                    {s.step}
                                </div>
                                <h3 className="step-title">{s.title}</h3>
                                <p className="step-desc">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="reviews-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge" style={{ background: 'rgba(252, 175, 121, 0.15)', borderColor: 'rgba(252, 175, 121, 0.3)', color: '#FCAF79' }}>✦ Testimonials</span>
                        <h2 className="section-title">Success Stories</h2>
                        <span className="section-title-accent" style={{ background: 'linear-gradient(90deg, #FCAF79, #42448A)' }} />
                        <p className="section-subtitle">Join thousands of others who have transformed their lives using Sănătate.</p>
                    </div>

                    <div className="reviews-grid">
                        {[
                            { name: "Alex Popescu", role: "Lost 15kg in 6 months", review: "Sănătate changed the way I look at my food and workouts. The personalized plans are simply incredible. I've never felt better!", rating: 5, color: "#FCAF79" },
                            { name: "Maria Ionescu", role: "Marathon Runner", review: "The workout tracking is super clean and intuitive. I love how I can see my volume progress over the months. Highly recommended for any athlete.", rating: 5, color: "#5BB6F5" },
                            { name: "Andrei Radu", role: "Gained 5kg Muscle", review: "Best app I've used for tracking my macros and workouts in one place. The dark mode dashboard is absolutely gorgeous to use every day.", rating: 5, color: "#42448A" }
                        ].map((r, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.2, duration: 0.6 }}
                                className="review-card"
                            >
                                <div className="review-stars" style={{ color: r.color }}>
                                    {[...Array(r.rating)].map((_, i) => <span key={i}>★</span>)}
                                </div>
                                <p className="review-text">"{r.review}"</p>
                                <div className="review-author">
                                    <div className="author-avatar" style={{ backgroundColor: r.color }}>
                                        {r.name.charAt(0)}
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

            {/* Final CTA */}
            <section className="cta-section">
                <div className="cta-container">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="cta-title"
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
                            <Link to="/dashboard" className="btn-cta">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link to="/register" className="btn-cta">
                                Start Your Fitness Journey
                            </Link>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <p>© {new Date().getFullYear()} Sănătate. All rights reserved.</p>
            </footer>
        </div>
    );
}
