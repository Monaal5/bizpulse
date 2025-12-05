import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User, Mail, Briefcase, MapPin, Save, Loader2, Camera, Image as ImageIcon, Plus, Copy, Trash2, Key } from 'lucide-react';

const UserProfile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({
        full_name: '',
        designation: '', // Using this as Tagline
        location: '',
        bio: '',
        avatar_url: ''
    });

    // Mock data for UI elements not yet in DB
    const [tags, setTags] = useState(['Fintech', 'Blockchain', 'SaaS', 'Data Analytics']);
    const [apiKeys, setApiKeys] = useState([
        { name: 'Primary Key', key: 'bp_pk_...c4a3', created: 'Jan 12, 2024' },
        { name: 'Analytics Read-Only', key: 'bp_rk_...e8f9', created: 'Mar 2, 2024' }
    ]);

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUser(user);

                let { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setProfile({
                        full_name: data.full_name || '',
                        designation: data.designation || '',
                        location: data.location || '',
                        bio: data.bio || '',
                        avatar_url: data.avatar_url || ''
                    });
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('No user logged in');

            const updates = {
                id: user.id,
                full_name: profile.full_name,
                designation: profile.designation,
                location: profile.location,
                bio: profile.bio,
                updated_at: new Date(),
            };

            let { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header Card */}
            <div className="card p-0 overflow-hidden mb-6 relative border-border">
                {/* Background Pattern/Gradient */}
                <div className="h-48 bg-gradient-to-r from-[#1e293b] to-[#0f172a] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #3B82F6 0%, transparent 50%)' }}></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                </div>

                <div className="px-8 pb-8 relative">
                    {/* Avatar */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-darker border-4 border-bg-card flex items-center justify-center overflow-hidden shadow-2xl">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={64} className="text-muted" />
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-bg-card border border-border rounded-full text-white hover:text-primary transition-colors shadow-md">
                                <Camera size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Header Info */}
                    <div className="mt-20 text-center">
                        <h1 className="text-3xl font-bold mb-1">{profile.full_name || 'Innovate Inc.'}</h1>
                        <p className="text-primary text-lg mb-1">{profile.designation || 'Fintech Solutions'}</p>
                        <p className="text-muted text-sm mb-8">{user?.email || 'contact@innovateinc.com'}</p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto border-t border-border pt-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">1,200</div>
                                <div className="text-sm text-muted mt-1">Trends Tracked</div>
                            </div>
                            <div className="text-center border-l border-r border-border">
                                <div className="text-3xl font-bold text-white">92%</div>
                                <div className="text-sm text-muted mt-1">Data Accuracy</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">24</div>
                                <div className="text-sm text-muted mt-1">Active Users</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Company Details Form */}
                <div className="lg:col-span-2 card h-fit">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold">Company Profile Details</h3>
                        <button className="btn btn-outline py-1.5 px-3 text-xs flex items-center gap-2">
                            <ImageIcon size={14} /> Change Cover
                        </button>
                    </div>

                    <form id="profile-form" onSubmit={updateProfile} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-muted mb-2">Company Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg py-3 px-4 bg-darker border border-border text-white focus:border-primary outline-none transition-all"
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    placeholder="Innovate Inc."
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted mb-2">Tagline</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg py-3 px-4 bg-darker border border-border text-white focus:border-primary outline-none transition-all"
                                    value={profile.designation}
                                    onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                                    placeholder="Fintech Solutions"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-muted mb-2">Contact Email</label>
                                <input
                                    type="text"
                                    disabled
                                    className="w-full rounded-lg py-3 px-4 bg-darker border border-border text-muted cursor-not-allowed outline-none"
                                    value={user?.email || ''}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted mb-2">Location</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg py-3 px-4 bg-darker border border-border text-white focus:border-primary outline-none transition-all"
                                    value={profile.location}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                    placeholder="San Francisco, CA"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-muted mb-2">Company Bio</label>
                            <textarea
                                className="w-full rounded-lg py-3 px-4 bg-darker border border-border text-white focus:border-primary outline-none h-32 resize-none transition-all placeholder-gray-600"
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                placeholder="Lorem ipsum dolor sit amet..."
                            ></textarea>
                        </div>
                    </form>
                </div>

                {/* Right Column: Tags & API Keys */}
                <div className="flex flex-col gap-6">
                    {/* Sector Tags */}
                    <div className="card">
                        <h3 className="text-lg font-bold mb-4">Sector Tags</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-darker border border-border rounded-full text-sm text-muted hover:text-white hover:border-primary transition-colors cursor-pointer">
                                    {tag}
                                </span>
                            ))}
                            <button className="px-3 py-1 border border-dashed border-border rounded-full text-sm text-muted hover:text-primary hover:border-primary transition-colors flex items-center gap-1">
                                <Plus size={14} /> Add Tag
                            </button>
                        </div>
                    </div>

                    {/* API Keys */}
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">API Keys</h3>
                            <button className="btn btn-outline py-1 px-2 text-xs">Generate New Key</button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {apiKeys.map((key, index) => (
                                <div key={index} className="p-3 bg-darker rounded-lg border border-border">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-semibold text-white">{key.name}</span>
                                        <div className="flex gap-2">
                                            <Copy size={14} className="text-muted hover:text-white cursor-pointer" />
                                            <Trash2 size={14} className="text-muted hover:text-red-500 cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted font-mono mb-2">{key.key}</div>
                                    <div className="text-xs text-muted">Created on <span className="text-white">{key.created}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Save Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={updateProfile}
                    disabled={saving}
                    className="btn btn-primary px-8 py-3 shadow-2xl flex items-center gap-2 text-lg"
                >
                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
