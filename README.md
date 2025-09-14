# 💳 Payment Request and Approval System

A full-stack web application for managing payment requests, approvals, and vendor management with role-based access control.

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Usage](#-usage)
- [Troubleshooting](#-troubleshooting)
- [Support](#-support)
- [License](#-license)

---

## 🚀 Features

### 🔐 User Management
- User registration and authentication  
- Role-based access control (Staff, Manager, Finance, Admin)  
- JWT-based authentication  

### 💼 Payment Workflow
- Create payment requests with vendor details  
- Multi-level approval system (Department Head → Finance)  
- Real-time status tracking (Pending, Processing, Approved, Rejected)  
- Audit trail for all actions  

### 🏢 Vendor Management
- Add and manage vendor information  
- Vendor banking details and tax information  
- Secure vendor data storage  

### 📊 Dashboard & Reporting
- Visual statistics and metrics  
- Recent activity tracking  
- Comprehensive reporting capabilities  

---

## 🛠 Technology Stack

### Frontend
- React  
- Bootstrap  
- Font Awesome  
- JavaScript (ES6+)  

### Backend
- Node.js  
- Express.js  
- TypeScript  
- PostgreSQL  
- JWT  
- bcryptjs  
- Joi  

---

## 📁 Project Structure

### Frontend

```
public/
  index.html
src/
  components/
    Login.js
    Register.js
    Dashboard.js
    PaymentRequest.js
    ApprovalView.js
    VendorView.js
  App.js
  index.js
```

### Backend

```
src/
  config/
    database.ts
  controllers/
    authController.ts
    paymentController.ts
    vendorController.ts
    approvalController.ts
  middleware/
    auth.ts
    validation.ts
  models/
    User.ts
    PaymentRequest.ts
    Vendor.ts
    Approval.ts
  routes/
    auth.ts
    payments.ts
    vendors.ts
    approvals.ts
  types/
    index.ts
  app.ts
```

---

## 📥 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)  
- PostgreSQL (v12 or higher)  
- npm or yarn  

### Backend Setup

```bash
git clone <repository-url>
cd payment-approval-system/backend
npm install
```

Create a `.env` file:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=payment_system
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key
```

Set up the database:

```bash
createdb payment_system
psql -d payment_system -f database/schema.sql
```

Start the backend server:

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Frontend Setup

```bash
cd ../frontend
npm install
```

Update API base URL:

```js
const API_BASE_URL = 'http://localhost:3000/api';
```

Start the frontend:

```bash
npm start
```

---

## 📖 API Documentation

### Authentication

| Method | Endpoint         | Description         | Auth |
|--------|------------------|---------------------|------|
| POST   | /api/auth/login  | User login          | ❌   |
| POST   | /api/auth/register | User registration | ❌   |
| GET    | /api/auth/me     | Get current user    | ✅   |

### Payments

| Method | Endpoint               | Description               | Auth |
|--------|------------------------|---------------------------|------|
| POST   | /api/payments          | Create payment request    | ✅   |
| GET    | /api/payments          | Get user's requests       | ✅   |
| GET    | /api/payments/dashboard | Get dashboard data       | ✅   |
| GET    | /api/payments/:id      | Get specific request      | ✅   |

### Vendors

| Method | Endpoint               | Description               | Auth |
|--------|------------------------|---------------------------|------|
| GET    | /api/vendors           | Get all vendors           | ✅   |
| POST   | /api/vendors           | Create new vendor         | ✅ (Admin) |
| PUT    | /api/vendors/:id       | Update vendor             | ✅ (Admin) |
| DELETE | /api/vendors/:id       | Delete vendor             | ✅ (Admin) |

### Approvals

| Method | Endpoint               | Description               | Auth |
|--------|------------------------|---------------------------|------|
| GET    | /api/approvals         | Get pending approvals     | ✅ (Manager/Finance) |
| POST   | /api/approvals/:id     | Process approval          | ✅ (Manager/Finance) |

---

## 📦 Usage

### User Roles

#### Staff
- Create payment requests  
- View own requests  
- Add vendor information  

#### Manager
- All staff permissions  
- Approve/reject requests (Level 1)  
- View department requests  

#### Finance
- All manager permissions  
- Final approval (Level 2)  
- Generate financial reports  

#### Admin
- Full access  
- Manage users and vendors  
- System administration  

### Workflow

1. Staff creates a payment request  
2. Manager reviews and approves/rejects  
3. Finance reviews for final approval  
4. Payment is processed  
5. All actions logged in audit trail  

---

## 🔧 Troubleshooting

### Common Issues

#### Database
- Ensure PostgreSQL is running  
- Check `.env` credentials  
- Confirm database exists  

#### Authentication
- Verify JWT secret  
- Check token expiration  

#### CORS
- Confirm frontend/backend URLs  
- Check backend CORS settings  

#### Password Hashing
- Confirm bcrypt installation  
- Validate password comparison logic  

### Debug Mode

```bash
export DEBUG=app:*
export NODE_ENV=development
```

---

## 📞 Support

- Email: [support@payment-system.com](mailto:support@payment-system.com)  
- Documentation: API Docs  
- Issue Tracker: GitHub Issues  

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```