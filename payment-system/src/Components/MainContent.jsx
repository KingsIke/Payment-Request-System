import React from 'react';
import Dashboard from './Dashboard';
import RequestView from './RequestView';
import ApprovalView from './ApprovalView';
import VendorView from './VendorView';
import ReportView from './ReportView';
import AdminView from './AdminView';

export default function MainContent({ currentView, user, token }) {
    switch (currentView) {
        case 'dashboard':
            return <Dashboard user={user} token={token} />;
        case 'requests':
            return <RequestView user={user} token={token} />;
        case 'approvals':
            return <ApprovalView user={user} token={token} />;
        case 'vendors':
            return <VendorView user={user} token={token} />;
        case 'reports':
            return <ReportView user={user} token={token} />;
            case 'admin1':
            return <AdminDashboard user={user} token={token} />;
        case 'admin':
            return <AdminView user={user} token={token} />;
        default:
            return <Dashboard user={user} token={token} />;
    }
}