import React from 'react';
import { ShieldCheck, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import './Ledger.css';

const Ledger = () => {
    return (
        <div>
            <div className="ledger-header">
                <div>
                    <h2 className="text-2xl font-bold">Blockchain Ledger / Verifications</h2>
                    <p className="text-muted">A transparent, immutable record of all on-chain data verifications for your business.</p>
                </div>
                <button className="btn btn-primary flex items-center gap-2">
                    <ShieldCheck size={16} /> Verify New Record
                </button>
            </div>

            <div className="ledger-table-card">
                <h3 className="text-lg font-bold mb-4">Recent Verifications</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Event Type</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Proof</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="font-mono text-sm text-muted">0xAbc...789</td>
                            <td>Market Data Snapshot</td>
                            <td>Oct 26, 2023, 10:45 AM</td>
                            <td><span className="status-badge status-verified">● Verified</span></td>
                            <td><Eye size={16} className="text-muted cursor-pointer hover:text-white" /></td>
                        </tr>
                        <tr>
                            <td className="font-mono text-sm text-muted">0xDef...456</td>
                            <td>Funding Round Verified</td>
                            <td>Oct 25, 2023, 03:20 PM</td>
                            <td><span className="status-badge status-verified">● Verified</span></td>
                            <td><Eye size={16} className="text-muted cursor-pointer hover:text-white" /></td>
                        </tr>
                        <tr>
                            <td className="font-mono text-sm text-muted">0xGhi...123</td>
                            <td>Quarterly Trend Report</td>
                            <td>Oct 24, 2023, 11:00 AM</td>
                            <td><span className="status-badge status-pending">● Pending</span></td>
                            <td><Eye size={16} className="text-muted cursor-pointer hover:text-white" /></td>
                        </tr>
                        <tr>
                            <td className="font-mono text-sm text-muted">0xJkl...890</td>
                            <td>New Competitor Data Added</td>
                            <td>Oct 23, 2023, 09:12 AM</td>
                            <td><span className="status-badge status-failed">● Failed</span></td>
                            <td><Eye size={16} className="text-muted cursor-pointer hover:text-white" /></td>
                        </tr>
                        <tr>
                            <td className="font-mono text-sm text-muted">0xMno...567</td>
                            <td>Platform Data Integrity Check</td>
                            <td>Oct 22, 2023, 01:55 PM</td>
                            <td><span className="status-badge status-verified">● Verified</span></td>
                            <td><Eye size={16} className="text-muted cursor-pointer hover:text-white" /></td>
                        </tr>
                    </tbody>
                </table>

                <div className="pagination">
                    <div className="page-item"><ChevronLeft size={16} /></div>
                    <div className="page-item active">1</div>
                    <div className="page-item">2</div>
                    <div className="page-item">3</div>
                    <div className="page-item">...</div>
                    <div className="page-item">8</div>
                    <div className="page-item">9</div>
                    <div className="page-item">10</div>
                    <div className="page-item"><ChevronRight size={16} /></div>
                </div>
            </div>
        </div>
    );
};

export default Ledger;
