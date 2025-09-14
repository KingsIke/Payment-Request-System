import React from 'react';

export default function Sidebar({ currentView, setCurrentView, userRole }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'tachometer-alt', roles: ['staff', 'manager', 'finance', 'admin'] },
        { id: 'requests', label: 'My Requests', icon: 'file-invoice', roles: ['staff', 'manager', 'finance', 'admin'] },
        { id: 'approvals', label: 'Approvals', icon: 'check-circle', roles: ['manager', 'finance', 'admin'] },
        { id: 'vendors', label: 'Vendors', icon: 'building', roles: ['staff', 'manager', 'finance', 'admin'] },
        { id: 'reports', label: 'Reports', icon: 'chart-bar', roles: ['finance', 'admin'] },
        { id: 'admin', label: 'Admin', icon: 'cog', roles: ['admin'] },
    ];

    return (
        <div className="col-md-3 col-lg-2 sidebar d-md-block">
            {menuItems
                .filter(item => item.roles.includes(userRole))
                .map(item => (
                    <a
                        key={item.id}
                        href="#"
                        className={currentView === item.id ? 'active fw-bold' : ''}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentView(item.id);
                        }}
                    >
                        <i className={`fas fa-${item.icon} me-2`}></i> {item.label}
                    </a>
                ))}
        </div>
    );
}