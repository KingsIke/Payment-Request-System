import React, { useState, useRef } from 'react';
import { apiService } from '../api/apiService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RequestForm({ token, vendors, onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    vendorId: '',
    amount: '',
    description: '',
    department: '',
    justification: ''
  });

  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid file (JPEG, PNG, PDF, DOC, DOCX)');
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const { vendorId, amount, description, department, justification } = formData;
    if (!vendorId || !amount || !description || !department || !justification) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await apiService.createPaymentRequest(token, formData, selectedFile);
      if (result.request) {
        toast.success('Payment request submitted successfully!');
        onSuccess();
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Failed to create request');
        setError(result.message || 'Failed to create request');
      }
    } catch (err) {
      toast.error(err.message || 'Network error. Please try again.');
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <strong>Create Payment Request</strong>
        <button className="btn btn-sm btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="vendorId" className="form-label">Vendor</label>
            <select
              name="vendorId"
              id="vendorId"
              className="form-control"
              value={formData.vendorId}
              onChange={handleChange}
              required
            >
              <option value="">Select Vendor</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            className="form-control mb-3"
            value={formData.amount}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            className="form-control mb-3"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            className="form-control mb-3"
            value={formData.department}
            onChange={handleChange}
            required
          />

          <textarea
            name="justification"
            placeholder="Justification"
            className="form-control mb-3"
            value={formData.justification}
            onChange={handleChange}
            required
          />

          <div className="mb-3">
            <input
              ref={fileInputRef}
              type="file"
              className="form-control"
              id="paymentImage"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            />
            <div className="form-text">
              Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 5MB)
            </div>

            {selectedFile && (
              <div className="mt-2 p-2 border rounded d-flex justify-content-between align-items-center">
                <div>
                  <i className="fas fa-file me-2"></i>
                  {selectedFile.name}
                  <small className="text-muted ms-2">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </small>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={removeFile}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}