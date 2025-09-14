# Payment Approval System - Frontend


## 🏗️ Project Structure

```
src/
├── api/
│   └── apiService.js          # API communication layer
├── components/
│   ├── LoginView.jsx          # Authentication component
│   ├── Dashboard.jsx          # Main dashboard
│   ├── RequestView.jsx        # Payment request management
│   ├── ApprovalView.jsx       # Approval processing
│   ├── VendorView.jsx         # Vendor management
│   ├── AdminDashboard.jsx     # Admin-specific features
│   ├── NavBar.jsx             # Navigation header
│   ├── Sidebar.jsx            # Role-based navigation
│   └── MainContent.jsx        # Content router
├── styles/
│   └── App.css               # Application styles
└── App.jsx                   # Main application component
```

## 🔌 API Integration

The frontend communicates with the backend through:

```javascript
export const apiService = {
  login: async (email, password) => { /* ... */ },
  register: async (token, userData) => { /* ... */ },
  createPaymentRequest: async (token, data, file) => { /* ... */ },
  getPendingApprovals: async (token) => { /* ... */ },
};
```

## 🎨 Styling

- **Bootstrap 5** - Responsive grid and components
- **Custom CSS** - Application-specific styles in App.css
- **Font Awesome** - Icon library for UI elements
- **Status Badges** - Color-coded request status indicators

## 📊 Components Overview

### LoginView
- Email/password authentication
- Form validation
- Error handling
- Redirect to appropriate dashboard

### Dashboard
- Role-based statistics cards
- Recent activity tables
- Quick action buttons
- Notifications panel

### RequestView
- Payment request creation form
- Vendor selection dropdown
- File upload functionality
- Request history table

### ApprovalView
- Pending approvals list
- Approval/rejection actions
- Comment system
- Status tracking

## 🔐 Authentication Flow

1. User enters credentials in LoginView
2. API validates and returns JWT token
3. Token stored in localStorage
4. All subsequent requests include token in headers
5. Automatic token validation and refresh handling


## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run coverage report
npm run test:coverage
```

## 📋 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors** - Ensure backend allows frontend domain
2. **JWT Expired** - Token automatically cleared on 401 responses
3. **Role Access Issues** - Check user role in database
4. **File Upload Fails** - Verify Cloudinary configuration

### Development Tools

- React DevTools for component debugging
- Network tab for API call inspection
- LocalStorage viewer for token verification

## 📞 Support

For issues and questions:
1. Check the browser console for errors
2. Verify API endpoints are accessible
3. Confirm environment variables are set
4. Check user role permissions in database
```