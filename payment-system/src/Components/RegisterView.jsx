import React, { useState } from 'react';
import { apiService} from '../api/apiService';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterView({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    role: 'staff' 
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('here')
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.role) newErrors.role = 'Role is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await apiService.register(formData);
      if (result.user && result.token) {
        onLogin(result.user, result.token);
        navigate('/dashboard'); 
      } else {
        setErrors({ general: result.message || 'Registration failed' });
      }
    } catch {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card">
            <div className="card-header text-center bg-success text-white">
              <h4><i className="fas fa-user-plus me-2"></i>Create Account</h4>
              <p className="mb-0">Register for a new account</p>
            </div>
            <div className="card-body">
              {errors.general && <div className="alert alert-danger">{errors.general}</div>}
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="form-control mb-3"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control mb-3"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="department"
                  placeholder="Department (optional)"
                  className="form-control mb-3"
                  value={formData.department}
                  onChange={handleChange}
                />


                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Role *</label>
                  <select
                    name="role"
                    id="role"
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
                  {errors.role && <small className="text-danger">{errors.role}</small>}
                </div>

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-control mb-3"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="form-control mb-3"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
                <div className="text-center mt-3">
                  <p>Already have an account? <Link to="/login">Sign In</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}