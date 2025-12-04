import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const LandingNavbar = () => {
    return (
        <nav className="landing-nav">
            <div className="container flex justify-between items-center h-full">
                <div className="logo flex items-center gap-2">
                    <Activity className="text-primary" size={28} />
                    <span className="text-xl font-bold">BizPulse</span>
                </div>

                <div className="nav-links flex gap-8 items-center">
                    <a href="#features" className="text-muted hover:text-white transition-colors">Features</a>
                    <a href="#pricing" className="text-muted hover:text-white transition-colors">Pricing</a>
                    <a href="#blog" className="text-muted hover:text-white transition-colors">Blog</a>
                </div>

                <div className="auth-buttons flex gap-4">
                    <button className="btn btn-outline">Request a Demo</button>
                    <Link to="/dashboard" className="btn btn-primary">Sign Up</Link>
                </div>
            </div>
            <style>{`
        .landing-nav {
          height: 80px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(11, 14, 20, 0.8);
          backdrop-filter: blur(10px);
          z-index: 100;
        }
      `}</style>
        </nav>
    );
};

export default LandingNavbar;
