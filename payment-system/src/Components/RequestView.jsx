import React, { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';
import RequestForm from './RequestForm';
// eslint-disable-next-line no-unused-vars
export default function RequestView({ user, token }) {
    const [requests, setRequests] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [requestsData, vendorsData] = await Promise.all([
                    apiService.getPaymentRequests(token),
                    apiService.getVendors(token)
                ]);
                if (requestsData.requests) setRequests(requestsData.requests);
                if (vendorsData.vendors) setVendors(vendorsData.vendors);
                if (requestsData.message) setError(requestsData.message);
            } catch {
                setError('Network error. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [token]);

    const refreshRequests = async () => {
        setIsLoading(true);
        try {
            const data = await apiService.getPaymentRequests(token);
            if (data.requests) setRequests(data.requests);
            else setError(data.message || 'Failed to load requests');
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="main-content"><h2>Payment Requests</h2><div className="spinner-border text-primary" /></div>;

    return (
        <div className="main-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><i className="fas fa-file-invoice me-2"></i>Payment Requests</h2>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <i className="fas fa-plus me-2"></i> New Request
                </button>
            </div>

            {error && <div className="alert alert-danger"><i className="fas fa-exclamation-circle me-2"></i>{error}</div>}

            {showForm && (
                <RequestForm
                    token={token}
                    vendors={vendors}
                    onCancel={() => setShowForm(false)}
                    onSuccess={() => {
                        setShowForm(false);
                        refreshRequests();
                    }}
                />
            )}

            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <span>My Requests</span>
                    <button className="btn btn-sm btn-outline-primary" onClick={refreshRequests}>
                        <i className="fas fa-refresh me-1"></i> Refresh
                    </button>
                </div>
                <div className="card-body">
                    {requests.length > 0 ? (
                        <table className="table table-hover">
                            <thead><tr><th>ID</th><th>Vendor</th><th>Amount</th><th>Description</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id}>
                                        <td>PR-{req.id.slice(0, 8)}</td>
                                        <td>{req.vendor_name || 'Unknown Vendor'}</td>
                                        <td>#{Number(req.amount).toFixed(2)}</td>
                                        <td>{req.description}</td>
                                        <td>{new Date(req.created_at).toLocaleDateString()}</td>
                                        <td><span className={`status-badge status-${req.status}`}>{req.status}</span></td>
                                        <td><button className="btn btn-sm btn-outline-primary"><i className="fas fa-eye me-1"></i> View</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-4">
                            <i className="fas fa-file-invoice fa-3x text-muted mb-3"></i>
                            <p className="text-muted">No payment requests found</p>
                            <button className="btn btn-primary mt-2" onClick={() => setShowForm(true)}>
                                <i className="fas fa-plus me-2"></i>Create Your First Request
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}