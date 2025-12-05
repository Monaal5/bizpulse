import React, { useState, useEffect } from 'react';
import { Search, Save, X, DollarSign, Award, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AddMarketData = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        funding: '',
        rank: '',
        sector: 'Technology',
        description: ''
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Optional: Save current path to redirect back after login
                navigate('/auth');
            }
        };
        checkUser();
    }, [navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting data:', formData);

        try {
            const { error } = await supabase
                .from('companies')
                .insert([
                    {
                        name: formData.name,
                        category: formData.sector,
                        funding_amount: parseFloat(formData.funding),
                        global_rank: parseInt(formData.rank),
                        description: formData.description,
                        logo: '🏢', // Default logo
                        color: '#64748b', // Default color
                        tags: [formData.sector, 'New Entry'],
                        funding_data: [],
                        competitors: []
                    }
                ]);

            if (error) throw error;

            alert('Company added successfully!');
            navigate('/dashboard/companies');
        } catch (error) {
            console.error('Error adding company:', error);
            alert('Error adding company: ' + error.message);
        }
    };

    const inputStyle = {
        background: 'var(--bg-dark)',
        border: '1px solid var(--border)',
        color: '#ffffff'
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add Market Data</h2>
                <button onClick={() => navigate('/dashboard')} className="btn btn-outline p-2">
                    <X size={20} />
                </button>
            </div>

            {/* Search Section */}
            <div className="card mb-8">
                <h3 className="text-lg font-bold mb-4">Search Existing Company</h3>
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by company name..."
                            className="w-full rounded-lg py-4 pl-12 pr-4 text-lg text-white focus:border-primary outline-none placeholder-gray-500"
                            style={inputStyle}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none" size={20} />
                    </div>
                    <button type="submit" className="btn btn-outline">Search</button>
                </form>
            </div>

            {/* Manual Entry Form */}
            <div className="card">
                <h3 className="text-lg font-bold mb-6">Enter Market Data</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-muted mb-2">Company Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg py-4 pl-12 pr-4 text-lg text-white focus:border-primary outline-none placeholder-gray-500"
                                    style={inputStyle}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-muted mb-2">Sector</label>
                            <select
                                className="w-full rounded-lg py-4 px-4 text-lg text-white focus:border-primary outline-none"
                                style={inputStyle}
                                value={formData.sector}
                                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                            >
                                <option>Technology</option>
                                <option>Healthcare</option>
                                <option>Fintech</option>
                                <option>Retail</option>
                                <option>Education</option>
                                <option>E-commerce</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-muted mb-2">Total Funding ($)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    required
                                    className="w-full rounded-lg py-4 pl-12 pr-4 text-lg text-white focus:border-primary outline-none placeholder-gray-500"
                                    style={inputStyle}
                                    value={formData.funding}
                                    onChange={(e) => setFormData({ ...formData, funding: e.target.value })}
                                />
                                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-muted mb-2">Global Rank</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full rounded-lg py-4 pl-12 pr-4 text-lg text-white focus:border-primary outline-none placeholder-gray-500"
                                    style={inputStyle}
                                    value={formData.rank}
                                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                                />
                                <Award className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none" size={20} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-muted mb-2">Description / Notes</label>
                        <textarea
                            className="w-full rounded-lg py-4 px-4 text-lg text-white focus:border-primary outline-none h-40 resize-none placeholder-gray-500"
                            style={inputStyle}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-outline">Cancel</button>
                        <button type="submit" className="btn btn-primary flex items-center gap-2">
                            <Save size={18} /> Save Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMarketData;
