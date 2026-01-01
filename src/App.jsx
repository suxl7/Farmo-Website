import React, { useState, useEffect } from 'react'
import Dashboard from './Components/Home/Dashboard';
import AdminLogin, { LoginNotification } from './Components/LoginPage/AdminLogin';
import ForgotPassword from './Components/LoginPage/ForgotPassword';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authData = localStorage.getItem('authData') || sessionStorage.getItem('authData');
    if (authData) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('authData');
    sessionStorage.removeItem('authData');
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  return (
    <div>
      {currentPage === 'login' && <AdminLogin onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 'dashboard' && isAuthenticated && (
        <>
          <LoginNotification />
          <Dashboard onLogout={handleLogout} />
        </>
      )}
      {currentPage === 'forgot-password' && <ForgotPassword />}
    </div>
  )
}

export default App