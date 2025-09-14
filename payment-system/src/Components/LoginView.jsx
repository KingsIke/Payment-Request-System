import React, { useState } from 'react';
import { apiService } from '../api/apiService';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await apiService.login(email, password);
      if (result.user && result.token) {
        onLogin(result.user, result.token);
        navigate('/'); 
      } else {
        setError(result.message || 'Login failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-header text-center bg-primary text-white">
              <h4><i className="fas fa-money-check me-2"></i>Payment System</h4>
              <p className="mb-0">Sign in to your account</p>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
                {/* <div className="text-center mt-3">
                  <p>
                    Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-none">
                      Register Now
                    </Link>
                  </p>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}