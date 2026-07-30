import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const tokenKey = role === 'admin' ? 'adminToken' : 'deliveryToken';
  const token = localStorage.getItem(tokenKey);

  if (!token) {
    const loginPath = role === 'admin' ? '/admin-login' : '/delivery-login';
    return <Navigate to={loginPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
