import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner fullPage={true} />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminRequired && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
