import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaSignOutAlt, 
  FaTimes,
  FaFileInvoiceDollar,
  FaChartLine,
  FaCog,
  FaUserShield,
  FaBusinessTime
} from 'react-icons/fa';
import { GiCash } from 'react-icons/gi';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white text-gray-800 transition-all duration-300 ease-in-out
          w-60 flex flex-col border-r border-gray-200
          ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900 bg-opacity-20 rounded-lg">
              <FaUserShield className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold tracking-wide text-white">Admin Portal</h2>
          </div>
          <button
            className="text-white text-xl md:hidden focus:outline-none"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <div className="mb-8 px-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Management
            </h3>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/admin" 
                  end 
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-100 hover:text-gray-900 text-gray-600'}`
                  }
                >
                  <FaTachometerAlt className="text-lg" /> 
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/users" 
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-100 hover:text-gray-900 text-gray-600'}`
                  }
                >
                  <FaUsers className="text-lg" /> 
                  <span>User Management</span>
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="mb-8 px-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/admin/gst" 
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-100 hover:text-gray-900 text-gray-600'}`
                  }
                >
                  <FaFileInvoiceDollar className="text-lg" /> 
                  <span>GST Services</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/itr" 
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-100 hover:text-gray-900 text-gray-600'}`
                  }
                >
                  <FaFileInvoiceDollar className="text-lg" /> 
                  <span>ITR Services</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/trademark" 
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-100 hover:text-gray-900 text-gray-600'}`
                  }
                >
                  <FaBusinessTime className="text-lg" /> 
                  <span>Trademark</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/business-advisory" 
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-100 hover:text-gray-900 text-gray-600'}`
                  }
                >
                  <FaBusinessTime className="text-lg" /> 
                  <span>Business Advisory</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/tax-planning" 
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-100 hover:text-gray-900 text-gray-600'}`
                  }
                >
                  <GiCash className="text-lg" /> 
                  <span>Tax Planning</span>
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="px-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Analytics
            </h3>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/admin/reports" 
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-100 hover:text-gray-900 text-gray-600'}`
                  }
                >
                  <FaChartLine className="text-lg" /> 
                  <span>Reports</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/settings" 
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-100 hover:text-gray-900 text-gray-600'}`
                  }
                >
                  <FaCog className="text-lg" /> 
                  <span>Settings</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer with Logout */}
        <div className="px-4 pb-6 mt-auto bg-gray-100">
          <div className="p-2.5 bg-gray-50 rounded-lg mb-4 mt-2.5">
            <div className="text-sm text-gray-600 mb-2">Logged in as:</div>
            <div className="font-medium text-gray-800">Admin User</div>
          </div>
          <button
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-4 rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> 
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;