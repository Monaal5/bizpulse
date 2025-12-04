import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Trends from './pages/Trends';
import Companies from './pages/Companies';
import Ledger from './pages/Ledger';
import Settings from './pages/Settings';
import AddMarketData from './pages/AddMarketData';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="trends" element={<Trends />} />
          <Route path="companies" element={<Companies />} />
          <Route path="ledger" element={<Ledger />} />
          <Route path="settings" element={<Settings />} />
          <Route path="add-data" element={<AddMarketData />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
