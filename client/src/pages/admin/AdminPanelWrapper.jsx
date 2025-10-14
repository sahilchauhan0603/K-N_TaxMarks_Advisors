import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import './AdminPanel.css';
import { FaBars } from 'react-icons/fa';

const AdminPanelWrapper = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  return (
    <div className="admin-panel-wrapper">
      <div style={{ display: sidebarVisible ? 'block' : 'none' }}>
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {!sidebarOpen && (
          <button className="sidebar-fab" onClick={() => setSidebarOpen(true)} title="Show Sidebar">
            <FaBars />
          </button>
        )}
      </div>
      <div className={`admin-panel-content ${!sidebarVisible ? 'no-sidebar' : ''}`}>
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child, { setSidebarVisible })
            : child
        )}
      </div>
    </div>
  );
};

export default AdminPanelWrapper;
