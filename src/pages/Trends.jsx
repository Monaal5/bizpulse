import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Treemap } from 'recharts';
import { Calendar } from 'lucide-react';
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

const dataTreemap = [
    { name: 'Technology', size: 1000, fill: '#3B82F6' },
    { name: 'Healthcare', size: 800, fill: '#10B981' },
    { name: 'Finance', size: 600, fill: '#8B5CF6' },
    { name: 'Retail', size: 400, fill: '#F59E0B' },
    { name: 'Energy', size: 300, fill: '#EF4444' },
    { name: 'Education', size: 200, fill: '#6366F1' },
];

const CustomContent = (props) => {
    const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: payload?.fill || '#3B82F6', // Use the fill from the data or fallback
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            {width > 50 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 7}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={14}
                >
                    {name}
                </text>
            )}
        </g>
    );
};

const Trends = () => {
    return (
        <div>
            <div className="trends-header">
                <div>
                    <h2 className="text-2xl font-bold">Trends / Sector Explorer</h2>
                    <p className="text-muted">Track market trends and competitor data to make informed decisions.</p>
                </div>
                <button className="btn btn-outline flex items-center gap-2">
                    <Calendar size={16} /> Jul 5, 2024 - Aug 7, 2024
                </button>
            </div>

            <div className="filter-bar">
                <div className="filter-chip active">All Sectors</div>
                <div className="filter-chip">Technology</div>
                <div className="filter-chip">Healthcare</div>
                <div className="filter-chip">Finance</div>
                <div className="filter-chip">Retail</div>
                <div className="filter-chip">Fintech</div>
                <div className="filter-chip">E-commerce</div>
            </div>

            <div className="trends-grid">
                <div className="heatmap-card">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Sector Heatmap</h3>
                        <div className="text-xs text-muted">Low ● ● ● ● High</div>
                    </div>
                    <ResponsiveContainer width="100%" height="90%">
                        <Treemap
                            data={dataTreemap}
                            dataKey="size"
                            aspectRatio={4 / 3}
                            stroke="#fff"
                            content={<CustomContent />}
                        />
                    </ResponsiveContainer>
                </div>

                <div className="movers-card">
                    <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                        <h3 className="text-lg font-bold">Top Movers</h3>
                        <div className="flex gap-4 text-sm">
                            <span className="text-primary font-bold cursor-pointer">Top Gainers</span>
                            <span className="text-muted cursor-pointer hover:text-white">Top Losers</span>
                        </div>
                    </div>

                    <div className="movers-list">
                        {[
                            { name: 'AI Innovations', sector: 'Technology', change: '+15.2%', color: 'bg-blue-500' },
                            { name: 'HealthTech United', sector: 'Healthcare', change: '+12.8%', color: 'bg-green-500' },
                            { name: 'Fintech Solutions', sector: 'Finance', change: '+8.7%', color: 'bg-purple-500' },
                            { name: 'C-commerce World', sector: 'Retail', change: '+6.1%', color: 'bg-yellow-500' },
                            { name: 'BioTech Labs', sector: 'Healthcare', change: '+13.1%', color: 'bg-green-500' },
                        ].map((item, i) => (
                            <div className="mover-item" key={i}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full ${item.color.replace('bg-', '')} flex items-center justify-center text-xs font-bold`} style={{ backgroundColor: item.color === 'bg-blue-500' ? '#3B82F6' : item.color === 'bg-green-500' ? '#10B981' : item.color === 'bg-purple-500' ? '#8B5CF6' : '#F59E0B' }}>
                                        {item.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{item.name}</div>
                                        <div className="text-xs text-muted">{item.sector}</div>
                                    </div>
                                </div>
                                <div className="text-accent font-bold text-sm">{item.change}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="timeline-card">
                <h3 className="text-lg font-bold mb-4">Timeline Explorer</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <LineChart data={dataTimeline}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} />
                        <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="value1" stroke="#3B82F6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="value2" stroke="#10B981" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Trends;
