import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import './AdminPanel.css';
import { FaBars } from 'react-icons/fa';

const AdminPanelWrapper = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  return (
    <div className="admin-panel-wrapper">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {!sidebarOpen && (
        <button className="sidebar-fab" onClick={() => setSidebarOpen(true)} title="Show Sidebar">
          <FaBars />
        </button>
      )}
      <div className="admin-panel-content">{children}</div>
    </div>
  );
};

export default AdminPanelWrapper;
