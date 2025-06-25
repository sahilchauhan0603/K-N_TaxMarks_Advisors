import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminPanelWrapper from './AdminPanelWrapper';

// This will be replaced with real auth logic
const isAdminAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

const AdminLayout = () => {
  useEffect(() => {
    // Hide Navbar in admin panel
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.style.display = 'none';
    return () => {
      if (navbar) navbar.style.display = '';
    };
  }, []);

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" />;
  }
  return (
    <AdminPanelWrapper>
      <Outlet />
    </AdminPanelWrapper>
  );
};

export default AdminLayout;
