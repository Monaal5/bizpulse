import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Plus, RefreshCw, Play, Loader2 } from 'lucide-react';
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
    { name: 'AI/ML', value: 400 },
    { name: 'Fintech', value: 300 },
    { name: 'SaaS', value: 300 },
    { name: 'Health', value: 200 },
];

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

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
        // Simulate API call
        setTimeout(() => {
            setIsScraping(false);
            // Update KPIs with random slight variations
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
            // Add a forecast data point
            const lastItem = barData[barData.length - 1];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const currentMonthIndex = months.indexOf(lastItem.name.replace(' (F)', ''));
            const nextMonth = months[(currentMonthIndex + 1) % 12];

            const forecastPoint = {
                name: `${nextMonth} (F)`,
                funding: Math.floor(lastItem.funding * (1 + (Math.random() * 0.2 - 0.05))) // -5% to +15% growth
            };
            setBarData([...barData, forecastPoint]);
        }, 2000);
    };

    return (
        <div>
            <div className="dashboard-header">
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <div className="flex gap-4">
                    <button onClick={handleAddMarketData} className="btn btn-primary flex items-center gap-2">
                        <Plus size={16} /> Add Market Data
                    </button>
                    <button
                        onClick={handleRunScrape}
                        disabled={isScraping}
                        className="btn btn-outline flex items-center gap-2"
                    >
                        {isScraping ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                        {isScraping ? 'Scraping...' : 'Run Scrape'}
                    </button>
                    <button
                        onClick={handleStartForecast}
                        disabled={isForecasting}
                        className="btn btn-outline flex items-center gap-2"
                    >
                        {isForecasting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                        {isForecasting ? 'Forecasting...' : 'Start Forecast'}
                    </button>
                </div>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-label">Total Companies Tracked</div>
                    <div className="kpi-value">{kpiValues.companies.toLocaleString()}</div>
                    <div className="kpi-change positive">+2.5% vs last month</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Avg Funding (Seed)</div>
                    <div className="kpi-value">${kpiValues.avgFunding}M</div>
                    <div className="kpi-change negative">-1.2% vs last month</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Top Growing Sector</div>
                    <div className="kpi-value">AI/ML</div>
                    <div className="kpi-change positive">+5.8% vs last month</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-label">Verified Records</div>
                    <div className="kpi-value">{kpiValues.verifiedRecords}M</div>
                    <div className="kpi-change positive">+0.1% vs last month</div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3 className="text-lg font-bold mb-4">Funding Trends</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} />
                            <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="funding" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-card">
                    <h3 className="text-lg font-bold mb-4">Sector Distribution</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={dataPie}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {dataPie.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
