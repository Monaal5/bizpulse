import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Upload, FileText, CheckCircle, ArrowLeft, BrainCircuit, ShieldCheck, TrendingUp, TrendingDown, Briefcase, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './StockAI.css';
import './Companies.css';

const CompanyDetail = ({ company, onBack }) => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStockAnalysis();
    }, [company]);

    const fetchStockAnalysis = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock_name: company.name })
            });
            const data = await response.json();
            setAnalysisData(data);
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-muted">Analyzing market intelligence for {company.name}...</p>
            </div>
        );
    }

    if (!analysisData) return <div>No analysis data found for {company.name}</div>;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="analysis-results">
            <div className="mb-6 flex justify-between items-center">
                <button onClick={onBack} className="btn-premium secondary flex items-center gap-2">
                    <ArrowLeft size={18} /> Back to Hub
                </button>
                <div className="flex gap-4">
                    <button className="btn-premium secondary">Follow Entity</button>
                    <button className="btn-premium primary">Institutional Watchlist</button>
                </div>
            </div>

            {/* Header Section */}
            <div className="analysis-header glass mb-8">
                <div className="flex items-center gap-6">
                    <div className="logo-viewport">
                        {analysisData.logo_url ? (
                            <img src={analysisData.logo_url} alt={analysisData.stock} className="logo-img" />
                        ) : (
                            <Briefcase size={32} className="text-primary" />
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black tracking-tight">{analysisData.stock}</h2>
                            <span className="ticker-badge">{analysisData.ticker}</span>
                        </div>
                        <p className="text-muted mt-2 max-w-2xl text-sm leading-relaxed">{analysisData.description}</p>
                    </div>
                    <div className="price-display text-right">
                        <div className="text-sm text-muted uppercase tracking-widest mb-1">Current Valuation</div>
                        <div className="text-4xl font-black text-primary">
                            {analysisData.current_price ? `₹${analysisData.current_price.toFixed(2)}` : 'PRIVATE'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart and Sentiment Grid */}
            <div className="main-intel-grid">
                <motion.div className="chart-card glass">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary" />
                            <h4 className="font-bold uppercase tracking-wider text-sm">Market Performance</h4>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        {analysisData.charts ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analysisData.charts['1y'] || []}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="date" hide />
                                    <YAxis hide domain={['auto', 'auto']} />
                                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted italic">
                                Private Company: Historical price data restricted
                            </div>
                        )}
                    </div>
                </motion.div>

                <div className="sentiment-grid-v2">
                    <motion.div className="neural-card glass">
                        <div className="flex items-center gap-2 mb-6">
                            <BrainCircuit size={20} className="text-primary" />
                            <h4 className="font-bold uppercase tracking-wider text-sm">Neural Sentiment</h4>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className={`prediction-huge ${analysisData.prediction?.toLowerCase()}`}>
                                {analysisData.prediction}
                            </div>
                            <p className="text-muted text-xs mt-2 uppercase tracking-widest">Global Archive Consensus</p>
                            
                            <div className="prob-bars-v2 mt-6 w-full">
                                {Object.entries(analysisData.probabilities || {}).map(([key, val]) => (
                                    <div key={key} className="prob-row">
                                        <div className="flex justify-between text-[10px] mb-1 uppercase font-bold">
                                            <span>{key}</span>
                                            <span>{val.toFixed(1)}%</span>
                                        </div>
                                        <div className="prob-track">
                                            <div className={`prob-fill-v2 ${key.toLowerCase()}`} style={{ width: `${val}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div className="risk-card glass">
                        <div className="flex items-center gap-2 mb-6">
                            <ShieldCheck size={20} className="text-primary" />
                            <h4 className="font-bold uppercase tracking-wider text-sm">Neural Risk Score</h4>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="risk-meter">
                                <div className="risk-value" style={{ '--risk': `${analysisData.risk_score || 45}%` }}>
                                    {analysisData.risk_score || 45}%
                                </div>
                                <svg viewBox="0 0 100 50">
                                    <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" strokeLinecap="round" />
                                    <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="url(#riskGradientDetail)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(analysisData.risk_score || 45) * 1.26} 126`} />
                                    <defs>
                                        <linearGradient id="riskGradientDetail" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#10b981" />
                                            <stop offset="50%" stopColor="#f59e0b" />
                                            <stop offset="100%" stopColor="#ef4444" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div className="competitors-list mt-8 w-full">
                                <p className="text-[10px] uppercase tracking-widest text-muted mb-3">Strategic Peers</p>
                                <div className="flex flex-wrap gap-2">
                                    {(analysisData.details?.competitors || []).map(comp => (
                                        <span key={comp} className="comp-tag">{comp}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Grid: Financials & Info */}
            <div className="info-grid-v2">
                <motion.div className="ratios-card glass">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingDown size={20} className="text-primary" />
                        <h4 className="font-bold uppercase tracking-wider text-sm">Key Intelligence Ratios</h4>
                    </div>
                    <div className="ratios-grid">
                        <div className="ratio-item"><span>P/E Ratio</span> <span className="value">{analysisData.key_stats?.pe_ratio?.toFixed(1) || '0.0'}x</span></div>
                        <div className="ratio-item"><span>P/B Ratio</span> <span className="value">{analysisData.key_stats?.pb_ratio?.toFixed(1) || '0.0'}x</span></div>
                        <div className="ratio-item"><span>EPS</span> <span className="value">₹{analysisData.key_stats?.eps?.toFixed(2) || '0.00'}</span></div>
                        <div className="ratio-item"><span>ROE</span> <span className="value">{(analysisData.key_stats?.roe * 100).toFixed(1) || '0.0'}%</span></div>
                        <div className="ratio-item"><span>Market Cap</span> <span className="value">{analysisData.key_stats?.market_cap ? (analysisData.key_stats.market_cap / 1e12).toFixed(2) + 'T' : 'N/A'}</span></div>
                        <div className="ratio-item"><span>Beta</span> <span className="value">{analysisData.key_stats?.beta?.toFixed(2) || '0.0'}</span></div>
                    </div>
                </motion.div>

                <motion.div className="details-card glass">
                    <div className="flex items-center gap-2 mb-6">
                        <Info size={20} className="text-primary" />
                        <h4 className="font-bold uppercase tracking-wider text-sm">Corporate Metadata</h4>
                    </div>
                    <div className="details-list">
                        <div className="detail-row"><span>Founded</span> <span>{analysisData.details?.founded || 'N/A'}</span></div>
                        <div className="detail-row"><span>Headquarters</span> <span>{analysisData.details?.headquarters}</span></div>
                        <div className="detail-row"><span>Employees</span> <span>{analysisData.details?.employees}</span></div>
                        <div className="detail-row"><span>CEO / Key Leadership</span> <span>{analysisData.details?.ceo}</span></div>
                        <div className="detail-row"><span>Industry</span> <span>{analysisData.industry}</span></div>
                        <div className="detail-row"><span>Exchange</span> <span>{analysisData.details?.listings}</span></div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CompanyDetail;
