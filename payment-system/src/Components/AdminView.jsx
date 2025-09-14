/* eslint-disable no-unused-vars */
// // eslint-disable-next-line no-unused-vars
// export default function AdminView({ user, token }) {
//     return (
//         <div className="main-content">
//             <h2 className="mb-4"><i className="fas fa-cog me-2"></i>Administration</h2>
//             <div className="alert alert-info">
//                 <i className="fas fa-info-circle me-2"></i>
//                 This section would provide system administration functions for admin users.
//             </div>
//         </div>
//     );
// }

import React, { useState } from 'react';
import { apiService } from '../api/apiService';
import { toast } from 'react-toastify';

export default function AdminView({ user, token }) {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    role: 'staff'
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...userData } = formData;
      const result = await apiService.register(token, userData);
      
      if (result.user) {
        toast.success(`User ${result.user.email} registered successfully!`);
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          department: '',
          role: 'staff'
        });
        setShowRegisterForm(false);
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="main-content">
      <h2 className="mb-4"><i className="fas fa-cog me-2"></i>Administration Dashboard</h2>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5><i className="fas fa-users me-2"></i>User Management</h5>
            </div>
            <div className="card-body">
              <button 
                className="btn btn-primary mb-3"
                onClick={() => setShowRegisterForm(!showRegisterForm)}
              >
                <i className="fas fa-user-plus me-2"></i>
                {showRegisterForm ? 'Cancel Registration' : 'Register New User'}
              </button>

              {showRegisterForm && (
                <div className="card mb-3">
                  <div className="card-body">
                    <h6>Register New User</h6>
                    <form onSubmit={handleRegister}>
                      <div className="mb-2">
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          className="form-control"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          className="form-control"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <input
                          type="text"
                          name="department"
                          placeholder="Department"
                          className="form-control"
                          value={formData.department}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <select
                          name="role"
                          className="form-control"
                          value={formData.role}
                          onChange={handleChange}
                          required
                        >
                          <option value="staff">Staff</option>
                          <option value="manager">Manager</option>
                          <option value="finance">Finance</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <button 
                        type="submit" 
                        className="btn btn-success w-100"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Registering...' : 'Register User'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              <div className="mt-3">
                <h6>System Users</h6>
                <p className="text-muted">User list and management tools would appear here.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5><i className="fas fa-chart-bar me-2"></i>System Statistics</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="stat-card bg-primary text-white p-3 rounded">
                    <h3>25</h3>
                    <small>Total Users</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="stat-card bg-success text-white p-3 rounded">
                    <h3>142</h3>
                    <small>Payment Requests</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-card bg-info text-white p-3 rounded">
                    <h3>18</h3>
                    <small>Vendors</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-card bg-warning text-white p-3 rounded">
                    <h3>7</h3>
                    <small>Pending Approvals</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}