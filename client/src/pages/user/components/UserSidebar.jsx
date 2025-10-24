import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User,
  Briefcase,
  Star,
  CreditCard,
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Shield
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Swal from 'sweetalert2';

const UserSidebar = ({
  activeSection,
  onSectionChange,
  serviceCount = 0,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "profile",
      label: "Profile Overview",
      icon: <User className="w-5 h-5" />,
    },
    {
      key: "services", 
      label: "My Services",
      icon: <Briefcase className="w-5 h-5" />,
      badge: serviceCount > 0 ? serviceCount.toString() : null,
    },
    {
      key: "testimonials",
      label: "My Testimonials", 
      icon: <Star className="w-5 h-5" />,
    },
    {
      key: "bills",
      label: "My Bills",
      icon: <CreditCard className="w-5 h-5" />,
    },
  ];

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Confirm Logout',
      text: 'Are you sure you want to sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1f2937',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, sign out',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      logout();
      navigate('/');
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed cursor-pointer top-4 left-4 z-50 bg-white border border-gray-200 rounded-lg p-2 shadow-lg"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Sidebar */}
      <div className={`
        ${isCollapsed ? 'w-18' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:static h-screen md:h-auto bg-white border-r border-gray-200 shadow-lg
        transition-all duration-300 z-50 md:z-auto
        flex flex-col
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gray-800 text-white w-8 h-8 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800">User Portal</h2>
                <p className="text-xs text-gray-500">Account Management</p>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Collapse toggle - Desktop only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden cursor-pointer md:flex absolute top-16 -right-3 bg-white border border-gray-200 rounded-full w-6 h-6 items-center justify-center shadow-md hover:bg-gray-50 z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          )}
        </button>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  onSectionChange(item.key);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${activeSection === item.key
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.label : ''}
              >
                {item.icon}
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {/* User info */}
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </div>
              </div>
            </div>
          )}

          {/* Back to Home */}
          <Link
            to="/"
            onClick={() => setIsMobileOpen(false)}
            className={`
              w-full flex items-center gap-3 cursor-pointer px-1 py-2.5 rounded-lg text-sm font-medium
              transition-colors duration-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'Back to Home' : ''}
          >
            <Home className="w-5 h-5" />
            {!isCollapsed && <span className="flex-1 text-left">Back to Home</span>}
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 cursor-pointer px-1 py-2.5 rounded-lg text-sm font-medium
              transition-colors duration-200 text-red-600 hover:bg-red-50 hover:text-red-700
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'Sign Out' : ''}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="flex-1 text-left">Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;