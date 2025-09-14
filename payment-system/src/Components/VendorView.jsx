/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';


export default function VendorView({ user, token }) {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const loadVendors = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getVendors(token);
      if (data.vendors) {
        setVendors(data.vendors);
      } else {
        setError(data.message || 'Failed to load vendors');
      }
    } catch (error) {
      console.error('Error loading vendors:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, [token]);

  return (
    <div className="main-content">
      <h2 className="mb-4"><i className="fas fa-building me-2"></i>Vendors</h2>

      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-4">
          <VendorForm
            token={token}
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              loadVendors();
            }}
          />
        </div>
      )}

      <div className="row">
        {vendors.map(vendor => (
          <div key={vendor.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card vendor-card h-100">
              <div className="card-body">
                <h5 className="card-title">{vendor.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{vendor.email}</h6>
                <p className="card-text">{vendor.contact_info}</p>
                <div className="mt-3">
                  <small className="text-muted d-block">Bank: {vendor.bank_name}</small>
                  <small className="text-muted d-block">Account: {vendor.bank_account_no}</small>
                  <small className="text-muted">Tax ID: {vendor.tax_id}</small>
                </div>
              </div>
              <div className="card-footer bg-transparent">
                <div className="d-flex justify-content-end">
                  <button className="btn btn-sm btn-outline-primary me-2">
                    <i className="fas fa-edit me-1"></i> Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    <i className="fas fa-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card vendor-card h-100">
            <div className="card-body d-flex align-items-center justify-content-center">
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                <i className="fas fa-plus me-2"></i> Add New Vendor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function VendorForm({ token, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactInfo: '',
    bankAccountNo: '',
    bankName: '',
    taxId: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await apiService.createVendor(token, formData);
      if (result.vendor) {
        onSuccess();
      } else {
        setError(result.message || 'Failed to create vendor');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <strong>Add New Vendor</strong>
        <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>Cancel</button>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" className="form-control mb-2" onChange={handleChange} required />
          <input name="email" placeholder="Email" className="form-control mb-2" onChange={handleChange} required />
          <input name="contactInfo" placeholder="Contact Info" className="form-control mb-2" onChange={handleChange} required />
          <input name="bankName" placeholder="Bank Name" className="form-control mb-2" onChange={handleChange} required />
          <input name="bankAccountNo" placeholder="Bank Account No" className="form-control mb-2" onChange={handleChange} required />
          <input name="taxId" placeholder="Tax ID" className="form-control mb-2" onChange={handleChange} required />
          <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Create Vendor'}
          </button>
        </form>
      </div>
    </div>
  );
}