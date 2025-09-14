import React, { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ApprovalView({ user, token }) {
  const [approvals, setApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  const loadApprovals = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getPendingApprovals(token);
      if (data.approvals) {
        setApprovals(data.approvals);
      } else {
        setError(data.message || 'Failed to load approvals');
        toast.error(data.message || 'Failed to load approvals');
      }
    } catch (error) {
      console.error('Error loading approvals:', error);
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, [token]);

  const handleApprove = async (requestId, action) => {
    if (!comments.trim()) {
      toast.error('Comments cannot be empty');
      return;
    }

    try {
      const result = await apiService.processApproval(token, requestId, {
        status: action,
        comments: comments
      });

      if (result.message && result.status) {
        toast.success(`Request ${action} successfully by ${result.role}`);
        await loadApprovals();
        setSelectedRequest(null);
        setComments('');
      } else if (result.details) {
        result.details.forEach(detail => {
          toast.error(detail.message);
        });
      } else {
        toast.error(result.message || 'Failed to process approval');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const getActionButtonText = (request, action) => {
    if (user.role === 'admin') {
      if (request.status === 'pending') {
        return action === 'approved' ? 'Approve (as Manager)' : 'Reject';
      } else if (request.status === 'approved') {
        return action === 'approved' ? 'Approve (as Finance)' : 'Reject';
      }
    }
    return action === 'approved' ? 'Approve' : 'Reject';
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <h2 className="mb-4">Approvals</h2>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="main-content">
      <h2 className="mb-4"><i className="fas fa-check-circle me-2"></i>Approvals</h2>
      <ToastContainer />

      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <i className="fas fa-tasks me-2"></i>Pending Approvals
          {user.role === 'admin' && (
            <span className="badge bg-info ms-2">Admin Mode: Full Access</span>
          )}
        </div>
        <div className="card-body">
          {approvals.length > 0 ? (
            approvals.map(request => (
              <div key={request.id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="card-title">PR-{request.id.substring(0, 8)}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">{request.vendor_name}</h6>
                      <p className="card-text">{request.description}</p>
                      <p className="card-text">
                        <small className="text-muted">
                          Requested by {request.user_name} ({request.user_email}) on {new Date(request.created_at).toLocaleDateString()}
                        </small>
                      </p>
                      {user.role === 'admin' && (
                        <span className={`badge bg-secondary me-2`}>
                          Current Status: {request.status}
                        </span>
                      )}
                    </div>
                    <div className="text-end">
                      <h4 className="text-primary">${Number(request.amount || 0).toFixed(2)}</h4>
                      <span className={`status-badge status-${request.status}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>

                  {selectedRequest === request.id ? (
                    <div className="mt-3">
                      <div className="mb-3">
                        <label htmlFor="comments" className="form-label">Approval Comments</label>
                        <textarea
                          className="form-control"
                          id="comments"
                          rows="3"
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder="Add your approval comments or reasons for rejection..."
                        ></textarea>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-success me-2"
                          onClick={() => handleApprove(request.id, 'approved')}
                        >
                          <i className="fas fa-check me-1"></i> 
                          {getActionButtonText(request, 'approved')}
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleApprove(request.id, 'rejected')}
                        >
                          <i className="fas fa-times me-1"></i> 
                          {getActionButtonText(request, 'rejected')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end mt-3">
                      <button
                        className="btn btn-primary"
                        onClick={() => setSelectedRequest(request.id)}
                      >
                        <i className="fas fa-edit me-1"></i> Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <i className="fas fa-check-circle fa-3x text-muted mb-3"></i>
              <p className="text-muted">No pending approvals</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}