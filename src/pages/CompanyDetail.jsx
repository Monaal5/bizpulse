import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Upload, FileText, CheckCircle, ArrowLeft } from 'lucide-react';
import './Companies.css';

const CompanyDetail = ({ company, onBack }) => {
    return (
        <div>
            <div className="mb-4">
                <button onClick={onBack} className="btn btn-outline flex items-center gap-2 text-sm">
                    <ArrowLeft size={16} /> Back to List
                </button>
            </div>
            <div className="company-header">
                <div className="company-info">
                    <div className="company-logo" style={{ color: company.color }}>
                        {company.logo}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{company.name}</h1>
                        <p className="text-muted">{company.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-accent text-sm">
                            <CheckCircle size={14} /> Blockchain Verified
                        </div>
                        <div className="tags">
                            {company.tags.map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="btn btn-outline">Follow</button>
                    <button className="btn btn-primary">Add to Watchlist</button>
                </div>
            </div>

            <div className="company-grid">
                <div className="left-column">
                    <div className="funding-chart">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold">Funding History</h3>
                                <p className="text-xs text-muted">Total capital raised over time</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-outline py-1 px-2 text-xs">Logarithmic Scale</button>
                                <button className="btn btn-outline py-1 px-2 text-xs">1Y</button>
                                <button className="btn btn-outline py-1 px-2 text-xs">3Y</button>
                                <button className="btn btn-outline py-1 px-2 text-xs">5Y</button>
                                <button className="btn btn-outline py-1 px-2 text-xs">All</button>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={company.fundingData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} />
                                <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3B82F6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="competitor-table-card">
                        <h3 className="text-lg font-bold mb-4">Competitor Analysis</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Valuation</th>
                                    <th>Employees</th>
                                    <th>Growth (1Y)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {company.competitors.map((comp, i) => (
                                    <tr key={i}>
                                        <td className="flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded-full ${comp.colorClass} flex items-center justify-center text-xs`}>{comp.initial}</div>
                                            {comp.name}
                                        </td>
                                        <td>{comp.valuation}</td>
                                        <td>{comp.employees}</td>
                                        <td className={comp.growthClass}>
                                            {comp.growthClass === 'text-accent' ? (
                                                <svg width="50" height="20">
                                                    <path d="M0 20 L 10 15 L 20 18 L 30 10 L 40 5" fill="none" stroke="#10b981" strokeWidth="2" />
                                                </svg>
                                            ) : (
                                                <svg width="50" height="20">
                                                    <path d="M0 5 L 10 10 L 20 8 L 30 15 L 40 18" fill="none" stroke="#ef4444" strokeWidth="2" />
                                                </svg>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="right-column">
                    <div className="upload-card">
                        <h3 className="text-lg font-bold mb-2">Upload Data</h3>
                        <div className="upload-area">
                            <FileText size={40} className="text-muted" />
                            <div className="text-sm text-muted">Drag & drop your file here or</div>
                            <button className="btn btn-outline">Browse Files</button>
                            <div className="text-xs text-muted">Supports: CSV, PDF</div>
                        </div>
                        <div className="flex items-center gap-2 mb-4 justify-center text-sm text-muted">
                            <input type="checkbox" defaultChecked /> Anchor data to blockchain
                        </div>
                        <button className="btn btn-primary w-full">Upload Data</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;
