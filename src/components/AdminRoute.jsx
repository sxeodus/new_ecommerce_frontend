import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const AdminRoute = () => {
  // Select only the user state to prevent unnecessary re-renders
  const user = useAuthStore((state) => state.user);

  // This single check handles all cases:
  // 1. Not logged in (user is null) -> redirect
  // 2. Logged in but not an admin (user.isAdmin is false) -> redirect
  // 3. Logged in and is an admin -> render child routes
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;