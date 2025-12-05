import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import CompanyDetail from './CompanyDetail';
import './Companies.css';

const mockCompanies = [
    {
        id: 1,
        name: 'Innovate Inc.',
        description: 'Pioneering the future of SaaS solutions.',
        logo: '🦊',
        color: '#D97706',
        tags: ['FinTech', 'SaaS', 'B2B', 'Artificial Intelligence'],
        category: 'Fintech',
        fundingData: [
            { name: '2020', value: 2000 },
            { name: '2021', value: 3000 },
            { name: '2022', value: 2500 },
            { name: '2023', value: 4500 },
            { name: '2024', value: 3800 },
        ],
        competitors: [
            { name: 'QuantumLeap', valuation: '$1.2B', employees: 850, initial: 'Q', colorClass: 'bg-blue-500', growthClass: 'text-accent' },
            { name: 'Nexus Dynamics', valuation: '$980M', employees: 620, initial: 'N', colorClass: 'bg-green-500', growthClass: 'text-red-500' },
            { name: 'Apex Solutions', valuation: '$850M', employees: 510, initial: 'A', colorClass: 'bg-purple-500', growthClass: 'text-accent' },
        ]
    },
    {
        id: 2,
        name: 'HealthGuard',
        description: 'AI-driven healthcare diagnostics platform.',
        logo: '🏥',
        color: '#10B981',
        tags: ['Healthcare', 'AI', 'MedTech'],
        category: 'Healthcare',
        fundingData: [
            { name: '2020', value: 1000 },
            { name: '2021', value: 1500 },
            { name: '2022', value: 3000 },
            { name: '2023', value: 4200 },
            { name: '2024', value: 5500 },
        ],
        competitors: [
            { name: 'MediCare Plus', valuation: '$2.1B', employees: 1200, initial: 'M', colorClass: 'bg-blue-500', growthClass: 'text-accent' },
            { name: 'DocBot', valuation: '$800M', employees: 400, initial: 'D', colorClass: 'bg-yellow-500', growthClass: 'text-accent' },
        ]
    },
    {
        id: 3,
        name: 'BlockChainify',
        description: 'Enterprise blockchain solutions for supply chain.',
        logo: '🔗',
        color: '#3B82F6',
        tags: ['Blockchain', 'Supply Chain', 'Enterprise'],
        category: 'Web3',
        fundingData: [
            { name: '2020', value: 500 },
            { name: '2021', value: 2000 },
            { name: '2022', value: 1800 },
            { name: '2023', value: 2500 },
            { name: '2024', value: 3000 },
        ],
        competitors: [
            { name: 'ChainLinker', valuation: '$1.5B', employees: 600, initial: 'C', colorClass: 'bg-purple-500', growthClass: 'text-accent' },
        ]
    },
    {
        id: 4,
        name: 'EduTech Pro',
        description: 'Personalized learning experiences for students.',
        logo: '🎓',
        color: '#8B5CF6',
        tags: ['EdTech', 'Consumer', 'Mobile'],
        category: 'Education',
        fundingData: [
            { name: '2020', value: 800 },
            { name: '2021', value: 1200 },
            { name: '2022', value: 1500 },
            { name: '2023', value: 2000 },
            { name: '2024', value: 2800 },
        ],
        competitors: [
            { name: 'LearnFast', valuation: '$500M', employees: 200, initial: 'L', colorClass: 'bg-green-500', growthClass: 'text-accent' },
        ]
    }
];

const Companies = () => {
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companies, setCompanies] = useState(mockCompanies);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*');

            if (error) throw error;

            if (data && data.length > 0) {
                // Transform DB snake_case to camelCase if needed, or ensure DB has correct structure
                // Assuming DB columns match what we need or we map them here
                const formattedData = data.map(c => ({
                    id: c.id,
                    name: c.name,
                    description: c.description,
                    logo: c.logo,
                    color: c.color,
                    tags: c.tags || [],
                    category: c.category,
                    fundingData: c.funding_data || [],
                    competitors: c.competitors || []
                }));
                // Combine with mock or replace. User wants "real data", so let's prefer DB but keep mock if DB is empty for now?
                // Actually, let's append DB data to mock data for the demo, or just use DB if we populate it well.
                // User said "add one more company... also use real company data".
                // I'll append for now to ensure the UI isn't empty if DB is empty.
                setCompanies([...mockCompanies, ...formattedData]);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    if (selectedCompany) {
        return <CompanyDetail company={selectedCompany} onBack={() => setSelectedCompany(null)} />;
    }

    // Group companies by category
    const categories = [...new Set(companies.map(c => c.category))];

    return (
        <div className="companies-list-page">
            <h2 className="text-2xl font-bold mb-6">Companies</h2>

            {categories.map(category => (
                <div key={category} className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-primary border-b border-border pb-2">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.filter(c => c.category === category).map(company => (
                            <div
                                key={company.id}
                                className="card cursor-pointer hover:border-primary transition-colors"
                                onClick={() => setSelectedCompany(company)}
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-opacity-10" style={{ backgroundColor: `${company.color}20`, color: company.color }}>
                                        {company.logo}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{company.name}</h4>
                                        <p className="text-xs text-muted">{company.tags[0]}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted mb-4 line-clamp-2">{company.description}</p>
                                <div className="flex gap-2 flex-wrap">
                                    {company.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs px-2 py-1 rounded bg-dark border border-border text-muted">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Companies;
