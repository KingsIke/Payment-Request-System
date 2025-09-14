import React, { useState, useEffect } from 'react';
import LoginView from './Components/LoginView';
import { ToastContainer } from 'react-toastify';

import NavBar from './Components/NavBar';
import Sidebar from './Components/Sidebar';
import MainContent from './Components/MainContent';
import RegisterView from './Components/RegisterView';
import Dashboard from './Components/Dashboard';
import { apiService } from './api/apiService';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentView, setCurrentView] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      apiService.getCurrentUser(token)
        .then(data => {
          if (data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
            setToken(null);
            navigate('/login');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          navigate('/login');
        });
    }
  }, [token, navigate]);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
     <>
       <ToastContainer position="top-right" autoClose={3000} /> 
       {!token || !user ? (
         <Routes>
           <Route path="/login" element={<LoginView onLogin={handleLogin} />} />
           <Route path="*" element={<Navigate to="/login" />} />
         </Routes>
       ) : (
         <>
           <NavBar user={user} onLogout={handleLogout} />
           <div className="container-fluid">
             <div className="row">
               <Sidebar
                 currentView={currentView}
                 setCurrentView={setCurrentView}
                 userRole={user.role}
               />
               <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                 <MainContent
                   currentView={currentView}
                   user={user}
                   token={token}
                 />
               </div>
             </div>
           </div>
         </>
       )}
     </>
   );
}