import React, { useState, useEffect } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { 
    Search, TrendingUp, TrendingDown, Info, ShieldCheck, 
    Zap, ExternalLink, PlusCircle, Loader2, Sparkles, BrainCircuit, Globe, Building2,
    Calendar, Users, MapPin, Briefcase, ChevronRight, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import './StockAI.css';

const StockAI = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('Technology');
    const [isAdding, setIsAdding] = useState(false);
    const [chartRange, setChartRange] = useState('6mo');

    const categories = [
        "Technology", "Finance", "Healthcare", "E-commerce", 
        "Energy", "SaaS", "Fintech", "AI/ML", "Education",
        "DeepTech", "Sustainability", "Mobility", "Media", 
        "Cybersecurity", "Web3", "Quantum Computing", "Biotech",
        "Entertainment", "Sports Equipment"
    ];

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchTerm) return;

        setLoading(true);
        setError(null);
        setAnalysisData(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock_name: searchTerm }),
            });

            if (!response.ok) throw new Error('Company research failed');
            const data = await response.json();
            setAnalysisData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToTrends = async () => {
        if (!analysisData) return;
        setIsAdding(true);
        try {
            const { error } = await supabase
                .from('companies')
                .insert([{
                    name: analysisData.stock,
                    description: analysisData.description,
                    category: selectedCategory,
                    logo: analysisData.logo_url || '🏢',
                    color: '#6366f1',
                    tags: [analysisData.industry, analysisData.sector].filter(Boolean),
                    funding_amount: analysisData.key_stats?.market_cap || 0,
                    global_rank: 0,
                    funding_data: analysisData.financials || [],
                    competitors: []
                }]);

            if (error) throw error;
            alert(`${analysisData.stock} successfully added to Trends!`);
        } catch (err) {
            console.error("Error adding to trends:", err);
            alert("Failed to add to trends.");
        } finally {
            setIsAdding(false);
        }
    };

    const formatValue = (val) => {
        if (!val) return 'N/A';
        if (val >= 1e12) return `₹${(val / 1e12).toFixed(2)}T`;
        if (val >= 1e9) return `₹${(val / 1e9).toFixed(2)}B`;
        if (val >= 1e7) return `₹${(val / 1e7).toFixed(2)}Cr`;
        if (val >= 1e5) return `₹${(val / 1e5).toFixed(2)}L`;
        return val.toLocaleString();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="stock-ai-container">
            <motion.div variants={itemVariants} className="stock-header-modern">
                <div className="title-group">
                    <div className="flex items-center gap-3">
                        <div className="ai-icon-pulse">
                            <BrainCircuit className="text-primary" size={28} />
                        </div>
                        <h2 className="text-3xl font-bold">Deep Market Intelligence</h2>
                    </div>
                    <p className="text-muted">Advanced AI-driven company research & sentiment engine</p>
                </div>

                <form onSubmit={handleSearch} className="search-bar-modern glass">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search ticker or company name (e.g. AAPL, Reliance, OpenAI)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="search-btn-premium">
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Scan Asset'}
                    </motion.button>
                </form>
            </motion.div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="loading-state-modern">
                        <div className="scanner-container">
                            <div className="scanner-line"></div>
                            <Sparkles className="scan-sparkle" size={48} />
                            <p className="text-lg font-bold mt-4">Running Neural Analysis...</p>
                            <p className="text-sm text-muted">Fetching financials, news signals & social sentiment</p>
                        </div>
                    </motion.div>
                ) : error ? (
                    <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-card glass">
                        <Info className="text-red-500" size={32} />
                        <p>{error}</p>
                    </motion.div>
                ) : analysisData ? (
                    <motion.div 
                        key="results" 
                        initial="hidden" 
                        animate="visible" 
                        variants={containerVariants} 
                        className="analysis-results-v2"
                    >
                        {analysisData.error && (
                            <motion.div variants={itemVariants} className="private-company-banner glass">
                                <Info size={18} className="text-primary" />
                                <span>{analysisData.error} Displaying business intelligence from global archives.</span>
                            </motion.div>
                        )}

                        {/* Company Top Bar */}
                        <motion.div variants={itemVariants} className="company-info-header-v2 glass">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-6">
                                    <div className="company-logo-v2">
                                        {analysisData.logo_url ? <img src={analysisData.logo_url} alt="logo" /> : <Building2 size={32} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-3xl font-black">{analysisData.stock}</h3>
                                            <span className="ticker-badge">{analysisData.details?.listings || analysisData.ticker}</span>
                                        </div>
                                        <div className="flex gap-4 mt-2">
                                            <span className="info-tag">{analysisData.industry}</span>
                                            <span className="info-tag">{analysisData.sector}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-black text-white">₹{analysisData.current_price?.toFixed(2)}</div>
                                    <div className={`flex items-center justify-end gap-1 font-bold ${analysisData.confidence > 50 ? 'text-green-400' : 'text-red-400'}`}>
                                        {analysisData.confidence > 50 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                        {analysisData.confidence?.toFixed(1)}% Confidence
                                    </div>
                                </div>
                            </div>

                            <div className="quick-stats-grid mt-8">
                                <div className="stat-item">
                                    <span className="label">MARKET CAP</span>
                                    <span className="value">{formatValue(analysisData.key_stats?.market_cap)}</span>
                                    <span className="sub positive">↑ Large Cap</span>
                                </div>
                                <div className="stat-item">
                                    <span className="label">52W HIGH</span>
                                    <span className="value">₹{analysisData.key_stats?.high_52w?.toFixed(2)}</span>
                                    <span className="sub negative">↓ From High</span>
                                </div>
                                <div className="stat-item">
                                    <span className="label">52W LOW</span>
                                    <span className="value">₹{analysisData.key_stats?.low_52w?.toFixed(2)}</span>
                                    <span className="sub neutral">Visualize History</span>
                                </div>
                                <div className="stat-item">
                                    <span className="label">VOLUME</span>
                                    <span className="value">{(analysisData.key_stats?.current_vol / 1e6).toFixed(1)}M</span>
                                    <span className="sub neutral">Avg {(analysisData.key_stats?.vol_avg / 1e6).toFixed(1)}M</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Chart Section */}
                        <motion.div variants={itemVariants} className="chart-section-v2 glass">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex gap-2">
                                    {['1mo', '3mo', '6mo', '1y'].map(range => (
                                        <button 
                                            key={range} 
                                            onClick={() => setChartRange(range)}
                                            className={`range-btn ${chartRange === range ? 'active' : ''}`}
                                        >
                                            {range.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 text-muted text-sm">
                                    <Calendar size={14} />
                                    <span>Real-time price history from Yahoo Finance</span>
                                </div>
                            </div>
                            <div className="main-chart-wrapper">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={Array.isArray(analysisData.charts?.[chartRange]) ? analysisData.charts[chartRange] : []}>
                                        <defs>
                                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="date" hide />
                                        <YAxis hide domain={['auto', 'auto']} />
                                        <Tooltip 
                                            contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                            itemStyle={{ color: '#3b82f6' }}
                                        />
                                        <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#priceGradient)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Sentiment and Prediction Grid */}
                        <div className="sentiment-grid-v2">
                            <motion.div variants={itemVariants} className="neural-card glass">
                                <div className="flex items-center gap-2 mb-6">
                                    <BrainCircuit size={20} className="text-primary" />
                                    <h4 className="font-bold uppercase tracking-wider text-sm">Neural Sentiment</h4>
                                </div>
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className={`prediction-huge ${analysisData.prediction?.toLowerCase()}`}>
                                        {analysisData.prediction}
                                    </div>
                                    <p className="text-muted text-sm mt-2">Next 30-day forecast</p>
                                    
                                    <div className="prob-bars-v2 mt-8 w-full">
                                        {Object.entries(analysisData.probabilities || {}).map(([key, val]) => (
                                            <div key={key} className="prob-row">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span>{key}</span>
                                                    <span>{val.toFixed(1)}%</span>
                                                </div>
                                                <div className="prob-track">
                                                    <motion.div 
                                                        initial={{ width: 0 }} 
                                                        animate={{ width: `${val}%` }} 
                                                        className={`prob-fill-v2 ${key.toLowerCase()}`} 
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="donut-card glass">
                                <div className="flex items-center gap-2 mb-6">
                                    <TrendingUp size={20} className="text-primary" />
                                    <h4 className="font-bold uppercase tracking-wider text-sm">Sentiment Split</h4>
                                </div>
                                <div className="donut-wrapper">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={Object.entries(analysisData.probabilities || {}).map(([name, value]) => ({ name, value }))}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                <Cell fill="#ef4444" />
                                                <Cell fill="#94a3b8" />
                                                <Cell fill="#10b981" />
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="donut-legend">
                                    <div className="legend-item"><span className="dot buy"></span> Buy {(analysisData.probabilities?.BUY || 0).toFixed(1)}%</div>
                                    <div className="legend-item"><span className="dot hold"></span> Hold {(analysisData.probabilities?.HOLD || 0).toFixed(1)}%</div>
                                    <div className="legend-item"><span className="dot sell"></span> Sell {(analysisData.probabilities?.SELL || 0).toFixed(1)}%</div>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="risk-card glass">
                                <div className="flex items-center gap-2 mb-6">
                                    <ShieldCheck size={20} className="text-primary" />
                                    <h4 className="font-bold uppercase tracking-wider text-sm">Neural Risk Score</h4>
                                </div>
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="risk-meter">
                                        <div className="risk-value" style={{ '--risk': `${analysisData.risk_score || 45}%` }}>
                                            {analysisData.risk_score || 45}%
                                        </div>
                                        <svg viewBox="0 0 100 50">
                                            <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" strokeLinecap="round" />
                                            <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="url(#riskGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(analysisData.risk_score || 45) * 1.26} 126`} />
                                            <defs>
                                                <linearGradient id="riskGradient" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#10b981" />
                                                    <stop offset="50%" stopColor="#f59e0b" />
                                                    <stop offset="100%" stopColor="#ef4444" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    <p className="text-muted text-xs mt-4">Calculated via volatility & macro sentiment</p>
                                    
                                    <div className="competitors-list mt-6 w-full">
                                        <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Strategic Competitors</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(analysisData.details?.competitors || ['Google', 'Microsoft', 'Amazon']).map(comp => (
                                                <span key={comp} className="comp-tag">{comp}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Financials and Signals */}
                        <div className="financials-grid-v2">
                            <motion.div variants={itemVariants} className="financial-chart-card glass">
                                <div className="flex items-center gap-2 mb-6">
                                    <Briefcase size={20} className="text-primary" />
                                    <h4 className="font-bold uppercase tracking-wider text-sm">Revenue vs Profit (Quarterly)</h4>
                                </div>
                                <div className="bar-chart-wrapper">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={Array.isArray(analysisData.financials) ? analysisData.financials : []}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis hide />
                                            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px' }} />
                                            <Bar dataKey="revenue" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="profit" fill="#34d399" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="signals-card glass">
                                <div className="flex items-center gap-2 mb-6">
                                    <ShieldCheck size={20} className="text-primary" />
                                    <h4 className="font-bold uppercase tracking-wider text-sm">Recent Signals</h4>
                                </div>
                                <div className="signals-list">
                                    {Array.isArray(analysisData.news) && analysisData.news.map((news, idx) => (
                                        <div key={idx} className="signal-item">
                                            <div className={`signal-dot ${news.sentiment.toLowerCase()}`}></div>
                                            <div className="signal-content">
                                                <p className="signal-text">{news.title}</p>
                                                <div className="signal-meta">
                                                    <span>{news.publisher}</span>
                                                    <span className={`sentiment-tag ${news.sentiment.toLowerCase()}`}>{news.sentiment}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Ratios and Info */}
                        <div className="info-grid-v2">
                            <motion.div variants={itemVariants} className="ratios-card glass">
                                <div className="flex items-center gap-2 mb-6">
                                    <TrendingDown size={20} className="text-primary" />
                                    <h4 className="font-bold uppercase tracking-wider text-sm">Key Ratios</h4>
                                </div>
                                <div className="ratios-grid">
                                    <div className="ratio-item">
                                        <span className="label">P/E Ratio</span>
                                        <span className="value">{analysisData.key_stats?.pe_ratio?.toFixed(1)}x</span>
                                    </div>
                                    <div className="ratio-item">
                                        <span className="label">P/B Ratio</span>
                                        <span className="value">{analysisData.key_stats?.pb_ratio?.toFixed(1)}x</span>
                                    </div>
                                    <div className="ratio-item">
                                        <span className="label">EPS</span>
                                        <span className="value">₹{analysisData.key_stats?.eps?.toFixed(2)}</span>
                                    </div>
                                    <div className="ratio-item">
                                        <span className="label">ROE</span>
                                        <span className="value">{(analysisData.key_stats?.roe * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="ratio-item">
                                        <span className="label">Dividend</span>
                                        <span className="value">{(analysisData.key_stats?.dividend_yield * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="ratio-item">
                                        <span className="label">Beta</span>
                                        <span className="value">{analysisData.key_stats?.beta?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="details-card glass">
                                <div className="flex items-center gap-2 mb-6">
                                    <Info size={20} className="text-primary" />
                                    <h4 className="font-bold uppercase tracking-wider text-sm">Company Info</h4>
                                </div>
                                <div className="details-list">
                                    <div className="detail-row"><span>Founded</span> <span>{analysisData.details?.founded || 'N/A'} • {analysisData.details?.headquarters}</span></div>
                                    <div className="detail-row"><span>Employees</span> <span>~{analysisData.details?.employees?.toLocaleString()}</span></div>
                                    <div className="detail-row"><span>CEO / Key People</span> <span>{analysisData.details?.ceo}</span></div>
                                    {analysisData.details?.founders && analysisData.details.founders !== 'N/A' && (
                                        <div className="detail-row"><span>Founders</span> <span>{analysisData.details.founders}</span></div>
                                    )}
                                    {analysisData.details?.valuation && analysisData.details.valuation !== 'N/A' && (
                                        <div className="detail-row"><span>Valuation / Revenue</span> <span>{analysisData.details.valuation}</span></div>
                                    )}
                                    <div className="detail-row"><span>Market Cap</span> <span>{formatValue(analysisData.key_stats?.market_cap)}</span></div>
                                    <div className="detail-row"><span>Exchange</span> <span>{analysisData.details?.listings}</span></div>
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="category-select-modern flex-1">
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <button onClick={handleAddToTrends} disabled={isAdding} className="btn-premium primary flex-1">
                                        {isAdding ? <Loader2 className="animate-spin" /> : <PlusCircle size={18} />}
                                        Add to Trends
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state-modern">
                        <div className="sparkle-orbit">
                            <Sparkles className="icon-center" size={64} />
                        </div>
                        <h3 className="text-xl font-bold">Ready for Market Insights?</h3>
                        <p className="text-muted max-w-sm mx-auto">Enter any global stock ticker or company name above to begin deep neural analysis.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StockAI;
