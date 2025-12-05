import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Users, ShieldCheck, Settings, HelpCircle, LogOut, Activity, User } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header flex items-center gap-2 mb-8">
                <Activity className="text-primary" size={28} />
                <div>
                    <h1 className="text-lg font-bold">BizPulse</h1>
                    <p className="text-xs text-muted">SME Analytics</p>
                </div>
            </div>

            <nav className="sidebar-nav flex-1">
                <NavLink to="/dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/dashboard/trends" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <TrendingUp size={20} />
                    <span>Market Trends</span>
                </NavLink>
                <NavLink to="/dashboard/companies" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Users size={20} />
                    <span>Competitors</span>
                </NavLink>
                <NavLink to="/dashboard/ledger" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <ShieldCheck size={20} />
                    <span>Blockchain Ledger</span>
                </NavLink>
                <NavLink to="/dashboard/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
                <NavLink to="/dashboard/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <User size={20} />
                    <span>Profile</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <div className="nav-item">
                    <HelpCircle size={20} />
                    <span>Help</span>
                </div>
                <div className="nav-item cursor-pointer" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
