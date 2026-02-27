import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './Components/Home/Dashboard';
import AdminLogin from './Components/LoginPage/AdminLogin';
import ChangePassword from './Components/LoginPage/ChangePassword';
import ForgotPassword from './Components/LoginPage/ForgotPassword';
import Home from './Components/Home/Home';
import Farmers from './Components/Home/Farmers';
import Consumers from './Components/Home/Consumers';
import Admins from './Components/Home/Admins';
import Products from './Components/Home/Products';
import Orders from './Components/Home/Orders';
import Profile from './Components/Home/AdminProfile';
import AddUser from './Components/Home/AddUser';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    const authData = localStorage.getItem('authData') || sessionStorage.getItem('authData');
    setIsAuthenticated(!!authData);
    setLoading(false);
  }, []);

  // Handle login success
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authData');
    sessionStorage.removeItem('authData');
    setIsAuthenticated(false);
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AdminLogin onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AdminLogin onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Home />} />
          <Route path="farmers" element={<Farmers />} />
          <Route path="farmers/:userId" element={<Farmers />} />
          <Route path="consumers" element={<Consumers />} />
          <Route path="consumers/:userId" element={<Consumers />} />
          <Route path="admins" element={<Admins />} />
          <Route path="admins/:userId" element={<Admins />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile onLogout={handleLogout} />} />
          <Route path="add-user" element={<AddUser />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
