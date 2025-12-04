import React from 'react';
import { Save, Bell, Lock, User } from 'lucide-react';

const Settings = () => {
    return (
        <div className="settings-page">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>

            <div className="grid grid-cols-1 gap-8 max-w-2xl">
                {/* Profile Settings */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="text-primary" size={20} />
                        <h3 className="text-lg font-bold">Profile Settings</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm text-muted mb-1">Full Name</label>
                            <input type="text" defaultValue="John Doe" className="w-full bg-dark border border-border rounded p-2 text-white" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border)' }} />
                        </div>
                        <div>
                            <label className="block text-sm text-muted mb-1">Email Address</label>
                            <input type="email" defaultValue="john@example.com" className="w-full bg-dark border border-border rounded p-2 text-white" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border)' }} />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <Bell className="text-primary" size={20} />
                        <h3 className="text-lg font-bold">Notifications</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Email Alerts</span>
                            <input type="checkbox" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Push Notifications</span>
                            <input type="checkbox" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Weekly Reports</span>
                            <input type="checkbox" defaultChecked />
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <Lock className="text-primary" size={20} />
                        <h3 className="text-lg font-bold">Security</h3>
                    </div>
                    <button className="btn btn-outline w-full mb-2">Change Password</button>
                    <button className="btn btn-outline w-full">Enable 2FA</button>
                </div>

                <div className="flex justify-end">
                    <button className="btn btn-primary flex items-center gap-2">
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
