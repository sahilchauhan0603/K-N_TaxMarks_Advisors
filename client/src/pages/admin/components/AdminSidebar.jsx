import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaSignOutAlt, 
  FaTimes,
  FaFileInvoiceDollar,
  FaChartLine,
  FaCog,
  FaUserShield,
  FaBusinessTime,
  FaChevronDown,
  FaChevronRight,
  FaChevronLeft,
  FaBars,
  FaComments,
  FaLightbulb
} from 'react-icons/fa';
import { GiCash } from 'react-icons/gi';
import './AdminSidebar.css';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  // Get admin info from localStorage
  const adminEmail = localStorage.getItem('adminEmail');
  const adminLoginTime = localStorage.getItem('adminLoginTime');
  const formattedLoginTime = adminLoginTime ? new Date(adminLoginTime).toLocaleString() : '';
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    management: true,
    services: true,
    analytics: true
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout from the admin panel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminLoginTime');
      
      Swal.fire({
        title: 'Logged Out!',
        text: 'You have been successfully logged out.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      navigate('/admin/login');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${sidebarOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-logo">
              <FaUserShield />
            </div>
            {!isCollapsed && (
              <div>
                <h2>Admin Portal</h2>
                <p>Business Services</p>
              </div>
            )}
          </div>
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Collapse/Expand Button
        <button 
          className="admin-sidebar-collapse-btn"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FaChevronLeft className={isCollapsed ? 'rotate-180' : ''} />
        </button> */}

        {/* Scrollable content area */}
        <div className="admin-sidebar-content">
          {/* Navigation Links */}
          <nav className="admin-sidebar-nav">
            <div className="admin-sidebar-section">
              {!isCollapsed && (
                <button 
                  className="admin-sidebar-section-btn"
                  onClick={() => toggleSection('management')}
                >
                  <span>Management</span>
                  {expandedSections.management ? <FaChevronDown /> : <FaChevronRight />}
                </button>
              )}
              {(expandedSections.management || isCollapsed) && (
                <ul className="admin-sidebar-menu">
                  <li>
                    <NavLink 
                      to="/admin" 
                      end 
                      className={({ isActive }) =>
                        `admin-sidebar-link ${isActive ? 'active' : ''}`
                      }
                      title="Dashboard"
                    >
                      <FaTachometerAlt /> 
                      {!isCollapsed && <span>Dashboard</span>}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/admin/users" 
                      className={({ isActive }) =>
                        `admin-sidebar-link ${isActive ? 'active' : ''}`
                      }
                      title="User Management"
                    >
                      <FaUsers /> 
                      {!isCollapsed && <span>User Management</span>}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/admin/testimonials" 
                      className={({ isActive }) =>
                        `admin-sidebar-link ${isActive ? 'active' : ''}`
                      }
                      title="Testimonials"
                    >
                      <FaComments /> 
                      {!isCollapsed && <span>Testimonials</span>}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/admin/suggestions" 
                      className={({ isActive }) =>
                        `admin-sidebar-link ${isActive ? 'active' : ''}`
                      }
                      title="User Suggestions"
                    >
                      <FaLightbulb /> 
                      {!isCollapsed && <span>User Suggestions</span>}
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>

            <div className="admin-sidebar-section">
              {!isCollapsed && (
                <button 
                  className="admin-sidebar-section-btn"
                  onClick={() => toggleSection('services')}
                >
                  <span>Services</span>
                  {expandedSections.services ? <FaChevronDown /> : <FaChevronRight />}
                </button>
              )}
              {(expandedSections.services || isCollapsed) && (
                <ul className="admin-sidebar-menu">
                  <li>
                    <NavLink 
                      to="/admin/services" 
                      className={({ isActive }) =>
                        `admin-sidebar-link ${isActive ? 'active' : ''}`
                      }
                      title="Service Management"
                    >
                      <FaCog /> 
                      {!isCollapsed && <span>Service Management</span>}
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink 
                      to="/admin/tax-planning" 
                      className={({ isActive }) =>
                        `admin-sidebar-link ${isActive ? 'active' : ''}`
                      }
                      title="Tax Planning"
                    >
                      <GiCash /> 
                      {!isCollapsed && <span>Tax Planning</span>}
                    </NavLink>
                  </li> */}
                </ul>
              )}
            </div>

            <div className="admin-sidebar-section">
              {!isCollapsed && (
                <button 
                  className="admin-sidebar-section-btn"
                  onClick={() => toggleSection('analytics')}
                >
                  <span>Analytics</span>
                  {expandedSections.analytics ? <FaChevronDown /> : <FaChevronRight />}
                </button>
              )}
              {(expandedSections.analytics || isCollapsed) && (
                <ul className="admin-sidebar-menu">
                  <li>
                    <NavLink 
                      to="/admin/reports" 
                      className={({ isActive }) =>
                        `admin-sidebar-link ${isActive ? 'active' : ''}`
                      }
                      title="Reports"
                    >
                      <FaChartLine /> 
                      {!isCollapsed && <span>Reports</span>}
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink 
                      to="/admin/settings" 
                      className={({ isActive }) =>
                        `admin-sidebar-link ${isActive ? 'active' : ''}`
                      }
                      title="Settings"
                    >
                      <FaCog /> 
                      {!isCollapsed && <span>Settings</span>}
                    </NavLink>
                  </li> */}
                </ul>
              )}
            </div>
          </nav>
        </div>

        {/* Fixed footer with Logout */}
        <div className="admin-sidebar-footer">
          {!isCollapsed && (
            <div className="admin-user-info">
              <div className="admin-user-details">
                <div className="font-semibold">{adminEmail || 'Admin User'}</div>
                <span className="text-xs text-gray-500">Logged in: {formattedLoginTime || 'N/A'}</span>
              </div>
            </div>
          )}
          <button
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Logout"
            type="button"
          >
            <FaSignOutAlt /> 
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;