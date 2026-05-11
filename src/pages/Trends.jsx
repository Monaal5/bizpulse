import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Treemap, AreaChart, Area } from 'recharts';
import { Calendar, Loader2, TrendingUp, Info, Activity, Layers, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import './Trends.css';

const dataTimeline = [
    { name: 'Jan', value1: 4000, value2: 2400 },
    { name: 'Feb', value1: 3000, value2: 1398 },
    { name: 'Mar', value1: 2000, value2: 9800 },
    { name: 'Apr', value1: 2780, value2: 3908 },
    { name: 'May', value1: 1890, value2: 4800 },
    { name: 'Jun', value1: 2390, value2: 3800 },
    { name: 'Jul', value1: 3490, value2: 4300 },
];

const CustomContent = (props) => {
    const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;
    return (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={8}
                ry={8}
                style={{
                    fill: payload?.fill || '#3B82F6',
                    stroke: 'rgba(255,255,255,0.1)',
                    strokeWidth: 1,
                }}
            />
            {width > 60 && height > 40 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={14}
                    fontWeight="700"
                    style={{ pointerEvents: 'none' }}
                >
                    {name}
                </text>
            )}
        </motion.g>
    );
};

const Trends = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [treemapData, setTreemapData] = useState([]);

    useEffect(() => {
        const fetchTrendsData = async () => {
            try {
                const { data, error } = await supabase
                    .from('companies')
                    .select('*');
                
                if (error) throw error;
                setCompanies(data);

                const categoryCounts = data.reduce((acc, curr) => {
                    acc[curr.category] = (acc[curr.category] || 0) + 1;
                    return acc;
                }, {});

                const colors = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#0ea5e9'];
                const formattedTreemap = Object.keys(categoryCounts).map((cat, i) => ({
                    name: cat,
                    size: categoryCounts[cat] * 100,
                    fill: colors[i % colors.length]
                }));
                setTreemapData(formattedTreemap);
            } catch (err) {
                console.error("Error fetching trends:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendsData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
            className="trends-container"
        >
            <motion.div variants={itemVariants} className="trends-header-modern">
                <div className="title-group">
                    <h2 className="text-3xl font-bold">Dynamic Sector Explorer</h2>
                    <p className="text-muted">Real-time market concentration and emerging industry shifts.</p>
                </div>
                <div className="live-status">
                    <div className="pulse-dot"></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-accent">Live Analysis</span>
                </div>
            </motion.div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            ) : (
                <>
                <div className="trends-layout">
                    <motion.div variants={itemVariants} className="heatmap-section glass">
                        <div className="section-header">
                            <div className="flex items-center gap-2">
                                <Layers size={18} className="text-primary" />
                                <h3 className="text-lg font-bold">Market Concentration</h3>
                            </div>
                            <div className="text-xs text-muted">Density by active entries</div>
                        </div>
                        <div className="treemap-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                                <Treemap
                                    data={treemapData}
                                    dataKey="size"
                                    aspectRatio={16 / 9}
                                    stroke="#fff"
                                    content={<CustomContent />}
                                />
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="insights-section glass">
                        <div className="section-header">
                            <div className="flex items-center gap-2">
                                <Activity size={18} className="text-accent" />
                                <h3 className="text-lg font-bold">Recent Intelligence</h3>
                            </div>
                            <TrendingUp className="text-accent" size={18} />
                        </div>

                        <div className="insights-list">
                            {companies.slice(-6).reverse().map((item, i) => (
                                <motion.div 
                                    whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                    className="insight-item" 
                                    key={i}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="entry-logo">
                                            {item.logo || '🏢'}
                                        </div>
                                        <div className="entry-meta">
                                            <div className="entry-name">{item.name}</div>
                                            <div className="entry-category">{item.category}</div>
                                        </div>
                                    </div>
                                    <ArrowUpRight size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="status-badge">NEW</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="timeline-section glass">
                    <div className="section-header">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={18} className="text-primary" />
                            <h3 className="text-lg font-bold">Sentiment Velocity Explorer</h3>
                        </div>
                        <p className="text-xs text-muted">Aggregated ecosystem interest over time</p>
                    </div>
                    <div className="timeline-chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dataTimeline}>
                                <defs>
                                    <linearGradient id="colorV1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorV2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                <Tooltip
                                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                                />
                                <Area type="monotone" dataKey="value1" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorV1)" />
                                <Area type="monotone" dataKey="value2" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorV2)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
                </>
            )}
        </motion.div>
    );
};

export default Trends;
