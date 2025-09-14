import React from 'react';

// eslint-disable-next-line no-unused-vars
export default function ReportView({ user, token }) {
    return (
        <div className="main-content">
            <h2 className="mb-4"><i className="fas fa-chart-bar me-2"></i>Reports</h2>
            <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                This section would provide financial reports and analytics for authorized users.
            </div>
        </div>
    );
}