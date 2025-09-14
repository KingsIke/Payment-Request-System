import React from 'react';

export default function NavBar({ user, onLogout }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <i className="fas fa-money-check me-2"></i>
                    <strong>Payment Approval System</strong>
                </a>
                <div className="d-flex align-items-center">
                    <span className="text-light me-3">
                        <i className="fas fa-user me-1"></i>
                        {user.name} ({user.role})
                    </span>
                    <button className="btn btn-outline-light btn-sm" onClick={onLogout}>
                        <i className="fas fa-sign-out-alt me-1"></i> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}