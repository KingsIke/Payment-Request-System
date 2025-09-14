const API_BASE_URL = 'http://localhost:3000/api'; 
export const apiService = {

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  },

register: async (token, userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
     },
    
    body: JSON.stringify(userData),
  });

  const data = await response.json(); 
  console.log('Register response:', data); 
  return data;
},

  getCurrentUser: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  },

  createPaymentRequest: async (token, data, file) => {
     const formData = new FormData();
  
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    
    if (file) {
      formData.append('paymentImage', file);
    }
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
   const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Request failed');
  return result;
  },

  getPaymentRequests: async (token) => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  },

  getDashboardData: async (token) => {
    const response = await fetch(`${API_BASE_URL}/payments/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  },

  getVendors: async (token) => {
    const response = await fetch(`${API_BASE_URL}/vendors`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  },

  createVendor: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/vendors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  getPendingApprovals: async (token) => {
    const response = await fetch(`${API_BASE_URL}/approvals`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  },

  processApproval: async (token, requestId, data) => {
    const response = await fetch(`${API_BASE_URL}/approvals/${requestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
};