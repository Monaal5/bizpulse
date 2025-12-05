import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User, Mail, Briefcase, MapPin, Save, Loader2, Camera, Image as ImageIcon } from 'lucide-react';

const UserProfile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({
        full_name: '',
        designation: '',
        location: '',
        bio: '',
        avatar_url: ''
    });

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
        <div className="max-w-5xl mx-auto pb-8">
            <h2 className="text-2xl font-bold mb-6">User Profile</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="card p-0 overflow-hidden h-fit border-border">
                    {/* Cover Image */}
                    <div className="h-32 bg-gradient-to-r from-primary to-purple relative">
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    </div>

                    {/* Avatar & Info */}
                    <div className="px-6 pb-6 text-center relative">
                        <div className="relative w-28 h-28 mx-auto -mt-14 mb-4">
                            <div className="w-full h-full rounded-full bg-darker border-4 border-bg-card flex items-center justify-center overflow-hidden shadow-lg">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} className="text-muted" />
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white hover:bg-primary-hover transition-colors shadow-md border-2 border-bg-card">
                                <Camera size={14} />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold mb-1">{profile.full_name || 'User'}</h3>
                        <p className="text-primary text-sm mb-4 font-medium">{profile.designation || 'No designation'}</p>

                        <div className="flex items-center justify-center gap-2 text-sm text-muted mb-6 bg-darker py-2 px-4 rounded-full w-fit mx-auto">
                            <Mail size={14} />
                            <span>{user?.email}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
                            <div className="text-center">
                                <div className="text-lg font-bold">12</div>
                                <div className="text-xs text-muted">Projects</div>
                            </div>
                            <div className="text-center border-l border-border">
                                <div className="text-lg font-bold">85%</div>
                                <div className="text-xs text-muted">Success Rate</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="card lg:col-span-2">
                    <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                        <h3 className="text-lg font-bold">Edit Profile</h3>
                        <button className="btn btn-outline py-2 px-4 text-sm flex items-center gap-2">
                            <ImageIcon size={16} /> Change Cover
                        </button>
                    </div>

                    <form onSubmit={updateProfile} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-muted mb-2 font-medium">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full rounded-lg py-3 pl-10 pr-4 bg-darker border border-border text-white focus:border-primary outline-none transition-all"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-muted mb-2 font-medium">Designation</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full rounded-lg py-3 pl-10 pr-4 bg-darker border border-border text-white focus:border-primary outline-none transition-all"
                                        value={profile.designation}
                                        onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                                        placeholder="Product Manager"
                                    />
                                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-muted mb-2 font-medium">Location</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full rounded-lg py-3 pl-10 pr-4 bg-darker border border-border text-white focus:border-primary outline-none transition-all"
                                    value={profile.location}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                    placeholder="San Francisco, CA"
                                />
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-muted mb-2 font-medium">Bio</label>
                            <textarea
                                className="w-full rounded-lg py-3 px-4 bg-darker border border-border text-white focus:border-primary outline-none h-32 resize-none transition-all placeholder-gray-600"
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-border">
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn btn-primary flex items-center gap-2 px-8"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
