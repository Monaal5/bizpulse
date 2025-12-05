import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        // Attempt to sign up
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            // Check if session is established immediately (Email confirmation disabled)
            if (data.session) {
                alert('Account created successfully!');
                navigate('/dashboard');
            } else {
                // Email confirmation enabled
                alert('Please check your email to confirm your account.');
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-dark text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary opacity-5 blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple opacity-5 blur-[100px]"></div>
            </div>

            <div className="card p-8 w-full max-w-md relative z-10 shadow-2xl border-border-light">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                        ⚡
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-muted">Enter your credentials to access BizPulse</p>
                </div>

                <form className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-muted mb-2">Email Address</label>
                        <div className="relative">
                            <input
                                className="w-full rounded-lg py-3 pl-12 pr-4 bg-darker border border-border text-white focus:border-primary outline-none transition-colors"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ color: 'white', backgroundColor: 'var(--bg-darker)' }} // Inline style backup
                            />
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-muted mb-2">Password</label>
                        <div className="relative">
                            <input
                                className="w-full rounded-lg py-3 pl-12 pr-4 bg-darker border border-border text-white focus:border-primary outline-none transition-colors"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ color: 'white', backgroundColor: 'var(--bg-darker)' }} // Inline style backup
                            />
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
                        </div>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="btn btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
                    </button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-card text-muted">Or</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSignUp}
                        disabled={loading}
                        className="btn btn-outline w-full py-3"
                    >
                        Create an account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;
