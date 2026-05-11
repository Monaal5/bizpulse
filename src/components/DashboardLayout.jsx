import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

const DashboardLayout = () => {
    return (
        <div className="layout-main">
            <Sidebar />
            <main className="content-wrapper">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
