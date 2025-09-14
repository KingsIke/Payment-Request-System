import React, { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';

// eslint-disable-next-line no-unused-vars
export default function Dashboard({ user, token }) {
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, processing: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.getDashboardData(token);
        setStats(data.stats || {});
        setRecentRequests(data.recentRequests || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [token]);

const totalValue = recentRequests
  .filter(r => r.status !== 'rejected')
  .reduce((sum, r) => sum + Number(r.amount || 0), 0);


  if (isLoading) {
    return (
      <div className="main-content">
        <h2 className="mb-4"><i className="fas fa-tachometer-alt me-2"></i>Dashboard</h2>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h2 className="mb-4"><i className="fas fa-tachometer-alt me-2"></i>Dashboard</h2>

      <div className="row mb-4">
       <StatCard label="Pending Requests" value={stats.pending} icon="clock" color="pending" />
<StatCard label="Approved" value={stats.approved} icon="check-circle" color="approved" />
<StatCard label="Processing" value={stats.processing} icon="cog" color="processing" />
<StatCard label="Total Value" value={totalValue} icon="chart-line" color="rejected" isCurrency={true} />
      </div>

      <div className="row">
        <div className="col-md-8">
          <RecentRequestsTable recentRequests={recentRequests} />
        </div>
        <div className="col-md-4">
          <WorkflowCard />
          <NotificationsCard />
        </div>
      </div>
    </div>
  );
}

// ✅ Reusable Stat Card
function StatCard({ label, value, icon, color, isCurrency = false }) {
  const displayValue = isCurrency
    ? `#${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    : value.toLocaleString();

  return (
    <div className="col-md-3">
      <div className={`dashboard-stat stat-${color}`}>
        <h3>{displayValue}</h3>
        <p><i className={`fas fa-${icon} me-1`}></i> {label}</p>
        <small>{isCurrency ? 'Total value' : `${value} requests`}</small>
      </div>
    </div>
  );
}
// ✅ Recent Requests Table
function RecentRequestsTable({ recentRequests }) {
  return (
    <div className="card">
      <div className="card-header">
        <i className="fas fa-history me-2"></i>Recent Payment Requests
      </div>
      <div className="card-body">
        {recentRequests.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map(request => (
                  <tr key={request.id}>
                    <td>PR-{request.id.substring(0, 8)}</td>
                    <td>{request.vendorName}</td>
                    <td>#{Number(request.amount).toFixed(2)}</td>
                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${request.status}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-muted">No recent requests</p>
        )}
      </div>
    </div>
  );
}

// ✅ Workflow Card
function WorkflowCard() {
  return (
    <div className="card">
      <div className="card-header">
        <i className="fas fa-tasks me-2"></i>Approval Workflow Process
      </div>
      <div className="card-body">
        {[
          { icon: 'paper-plane', label: 'Staff Request', note: 'Initial submission', completed: true },
          { icon: 'user-tie', label: 'Department Head', note: 'Level 1 Approval', completed: true },
          { icon: 'chart-line', label: 'Finance Manager', note: 'Level 2 Approval', completed: false },
          { icon: 'money-check', label: 'Payment Processing', note: 'Final disbursement', completed: false },
        ].map((step, index) => (
          <div key={index} className={`workflow-step ${step.completed ? 'step-completed' : ''}`}>
            <div className="step-icon"><i className={`fas fa-${step.icon}`}></i></div>
            <div className="step-content">
              <h6 className="mb-0">{step.label}</h6>
              <small className="text-muted">{step.note}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ Notifications Card
function NotificationsCard() {
  return (
    <div className="card mt-4">
      <div className="card-header">
        <i className="fas fa-bell me-2"></i>Notifications
      </div>
      <div className="card-body">
        {[
          { icon: 'info-circle', color: 'primary', text: 'Your request PR-001 is pending department head approval', time: '2 hours ago' },
          { icon: 'check-circle', color: 'success', text: 'Request PR-002 has been approved by finance', time: '1 day ago' },
          { icon: 'plus-circle', color: 'info', text: 'New vendor "Equipment Rental Co." was added', time: '2 days ago' },
        ].map((note, index) => (
          <div key={index} className="d-flex align-items-start mb-3">
            <i className={`fas fa-${note.icon} text-${note.color} me-2 mt-1`}></i>
            <div>
              <small className="d-block">{note.text}</small>
              <small className="text-muted">{note.time}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}