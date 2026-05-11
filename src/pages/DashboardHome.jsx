import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { Plus, RefreshCw, Play, Loader2, TrendingUp, Users, DollarSign, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './DashboardHome.css';

const initialDataBar = [
    { name: 'Jan', funding: 4000 },
    { name: 'Feb', funding: 3000 },
    { name: 'Mar', funding: 2000 },
    { name: 'Apr', funding: 2780 },
    { name: 'May', funding: 1890 },
    { name: 'Jun', funding: 2390 },
    { name: 'Jul', funding: 3490 },
];

const dataPie = [
    { name: 'AI/ML', value: 450 },
    { name: 'Fintech', value: 300 },
    { name: 'SaaS', value: 250 },
    { name: 'DeepTech', value: 200 },
    { name: 'GreenTech', value: 180 },
];

const COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b'];

const DashboardHome = () => {
    const navigate = useNavigate();
    const [barData, setBarData] = useState(initialDataBar);
    const [isScraping, setIsScraping] = useState(false);
    const [isForecasting, setIsForecasting] = useState(false);

    // KPI States
    const [kpiValues, setKpiValues] = useState({
        companies: 1250,
        avgFunding: 1.2,
        verifiedRecords: 5.6
    });

    const handleAddMarketData = () => {
        navigate('/dashboard/add-data');
    };

    const handleRunScrape = () => {
        setIsScraping(true);
        setTimeout(() => {
            setIsScraping(false);
            setKpiValues(prev => ({
                companies: prev.companies + Math.floor(Math.random() * 10),
                avgFunding: +(prev.avgFunding + (Math.random() * 0.2 - 0.1)).toFixed(1),
                verifiedRecords: +(prev.verifiedRecords + (Math.random() * 0.1)).toFixed(1)
            }));
        }, 2000);
    };

    const handleStartForecast = () => {
        setIsForecasting(true);
        setTimeout(() => {
            setIsForecasting(false);
            const lastItem = barData[barData.length - 1];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const currentMonthIndex = months.indexOf(lastItem.name.replace(' (F)', ''));
            const nextMonth = months[(currentMonthIndex + 1) % 12];

            const forecastPoint = {
                name: `${nextMonth} (F)`,
                funding: Math.floor(lastItem.funding * (1 + (Math.random() * 0.2 - 0.05)))
            };
            setBarData([...barData, forecastPoint]);
        }, 2000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="dashboard-container"
        >
            <motion.div variants={itemVariants} className="dashboard-header-modern">
                <div className="title-group">
                    <h2 className="text-3xl font-bold">Market Intelligence Hub</h2>
                    <p className="text-muted">Real-time ecosystem tracking powered by Blockchain & AI</p>
                </div>
                <div className="flex gap-4">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddMarketData} 
                        className="btn-premium primary"
                    >
                        <Plus size={18} /> Add Entry
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRunScrape}
                        disabled={isScraping}
                        className="btn-premium secondary"
                    >
                        {isScraping ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                        {isScraping ? 'Syncing...' : 'Sync Market'}
                    </motion.button>
                </div>
            </motion.div>

            <div className="kpi-grid-modern">
                {[
                    { label: 'Tracked Assets', value: kpiValues.companies.toLocaleString(), change: '+2.5%', icon: <Users size={24} />, trend: 'positive' },
                    { label: 'Avg Funding', value: `$${kpiValues.avgFunding}M`, change: '-1.2%', icon: <DollarSign size={24} />, trend: 'negative' },
                    { label: 'Growth Sector', value: 'AI/ML', change: '+5.8%', icon: <TrendingUp size={24} />, trend: 'positive' },
                    { label: 'Verified Proofs', value: `${kpiValues.verifiedRecords}M`, change: '+0.1%', icon: <ShieldCheck size={24} />, trend: 'positive' },
                ].map((kpi, idx) => (
                    <motion.div 
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="kpi-card-modern glass"
                    >
                        <div className="kpi-icon-wrapper">{kpi.icon}</div>
                        <div className="kpi-content">
                            <span className="kpi-label">{kpi.label}</span>
                            <div className="kpi-value">{kpi.value}</div>
                            <div className={`kpi-change-chip ${kpi.trend}`}>
                                {kpi.change}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="insights-banner glass">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="text-accent" size={20} />
                    <h3 className="font-bold">AI Intelligence Report</h3>
                </div>
                <p className="text-sm text-muted">
                    Ecosystem growth is accelerating in the <strong>AI/ML</strong> sector. Based on historical trends, we project a 12% increase in seed funding for Q3. Blockchain verification for {kpiValues.verifiedRecords}M records completed.
                </p>
                <motion.button 
                    whileHover={{ x: 5 }}
                    onClick={handleStartForecast}
                    disabled={isForecasting}
                    className="forecast-trigger"
                >
                    {isForecasting ? 'Generating Forecast...' : 'Run Prediction Engine'}
                    <Zap size={14} className={isForecasting ? 'animate-pulse' : ''} />
                </motion.button>
            </div>

            <div className="charts-grid-modern">
                <motion.div variants={itemVariants} className="chart-card-modern glass">
                    <div className="chart-info">
                        <h3 className="text-lg font-bold">Funding Velocity</h3>
                        <p className="text-xs text-muted">Monthly capital inflow across sectors</p>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8}/>
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                <Tooltip
                                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                />
                                <Bar dataKey="funding" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="chart-card-modern glass">
                    <div className="chart-info">
                        <h3 className="text-lg font-bold">Market Dominance</h3>
                        <p className="text-xs text-muted">Volume distribution by industry</p>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataPie}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="60%"
                                    outerRadius="80%"
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {dataPie.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px' }}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DashboardHome;
