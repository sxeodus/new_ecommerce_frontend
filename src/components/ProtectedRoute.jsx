import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const ProtectedRoute = () => {
  const user = useAuthStore((state) => state.user);

  // If the user object exists, render the child routes.
  // Otherwise, redirect to the login page.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;