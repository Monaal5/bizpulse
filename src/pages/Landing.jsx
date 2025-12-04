import React from 'react';
import LandingNavbar from '../components/LandingNavbar';
import './Landing.css';
import { TrendingUp, Users, ShieldCheck, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="landing-page">
            <LandingNavbar />

            {/* Hero Section */}
            <section className="hero-section container">
                <div className="grid grid-cols-2 gap-8 items-center">
                    <div className="hero-content">
                        <h1>Make Informed Decisions with Blockchain-Verified Market Insights</h1>
                        <p>BizPulse leverages Data Analysis and Blockchain to give your business a transparent, secure, and immutable record of market performance, funding trends, and competitor movements.</p>
                        <Link to="/dashboard" className="btn btn-primary">Get Started for Free</Link>
                    </div>
                    <div className="hero-image">
                        {/* Abstract Graphic Placeholder */}
                        <div style={{
                            width: '100%',
                            height: '400px',
                            background: 'linear-gradient(45deg, #0f172a, #1e293b)',
                            borderRadius: '20px',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid #334155'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '300px',
                                height: '300px',
                                background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
                                filter: 'blur(40px)'
                            }}></div>
                            {/* Mock Chart Line */}
                            <svg viewBox="0 0 100 50" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', opacity: 0.5 }} preserveAspectRatio="none">
                                <path d="M0 50 Q 25 20 50 30 T 100 10" fill="none" stroke="#10b981" strokeWidth="0.5" />
                                <path d="M0 50 Q 30 40 60 20 T 100 30" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold mb-4">Gain a Competitive Edge with Trusted Data</h2>
                        <p className="text-muted">Our platform is built to provide you with the most reliable and actionable insights to fuel your growth.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Market Trend Analysis</h3>
                            <p className="text-muted text-sm">Stay ahead of the curve by analyzing real-time market trends and consumer behavior.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Competitor Tracking</h3>
                            <p className="text-muted text-sm">Monitor your competitors' strategies, performance, and market positioning with ease.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Blockchain-Verified Data</h3>
                            <p className="text-muted text-sm">Leverage the power of blockchain for transparent, secure, and immutable data you can trust.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="steps-section container">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold">Get Started in 3 Simple Steps</h2>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="step-item">
                        <div className="step-number">01</div>
                        <h3 className="text-lg font-bold mb-2">Connect Your Data</h3>
                        <p className="text-muted">Securely integrate your business data sources with our platform in just a few clicks.</p>
                    </div>
                    <div className="step-item">
                        <div className="step-number">02</div>
                        <h3 className="text-lg font-bold mb-2">Analyze Real-Time Insights</h3>
                        <p className="text-muted">Our AI-powered dashboard visualizes market trends and competitor movements for you.</p>
                    </div>
                    <div className="step-item">
                        <div className="step-number">03</div>
                        <h3 className="text-lg font-bold mb-2">Make Decisions with Confidence</h3>
                        <p className="text-muted">Use trusted, blockchain-verified data to drive your business strategy and growth.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section container">
                <div className="cta-box">
                    <h2 className="text-2xl font-bold mb-4">Ready to Empower Your Business with Data-Driven Decisions?</h2>
                    <p className="text-muted mb-8 max-w-xl mx-auto">Join hundreds of growing businesses that use BizPulse to gain a competitive edge. Get started today and see the difference trusted insights can make.</p>
                    <div className="flex justify-center gap-4 max-w-md mx-auto">
                        <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg bg-dark border border-border text-white focus:border-primary outline-none" />
                        <button className="btn btn-primary">Sign Up</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer container">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Activity className="text-primary" size={20} />
                        <span className="font-bold">BizPulse</span>
                    </div>
                    <div className="flex gap-6 text-sm text-muted">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                    <div className="text-sm text-muted">
                        © 2024 BizPulse. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
