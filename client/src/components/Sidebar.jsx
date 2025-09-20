
import React, { useState } from "react";
import { User, Edit3, Briefcase, Receipt, LogOut, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ activeSection, onSectionChange }) => {
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { key: "profile", label: "Profile Overview", icon: <User className="w-5 h-5" />, description: "View your profile" },
    { key: "edit", label: "Edit Profile", icon: <Edit3 className="w-5 h-5" />, description: "Update your information" },
    { key: "services", label: "My Services", icon: <Briefcase className="w-5 h-5" />, description: "Manage services", comingSoon: true },
    { key: "bills", label: "My Bills", icon: <Receipt className="w-5 h-5" />, description: "View billing history", comingSoon: true },
  ];

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="w-full lg:w-80 bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Account Settings</h2>
              <p className="text-blue-100 text-sm">Manage your profile</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onSectionChange(item.key)}
                disabled={item.comingSoon}
                className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                  activeSection === item.key
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
                    : item.comingSoon
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-100 hover:border-blue-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center p-4 relative z-10">
                  <div className={`mr-4 transition-transform duration-300 ${activeSection === item.key ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {item.icon}
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.comingSoon && (
                        <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full font-medium">
                          Soon
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${
                      activeSection === item.key ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>
                {activeSection === item.key && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 backdrop-blur-sm" />
                )}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full group bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200 hover:border-red-300 rounded-xl p-4 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-center text-red-600">
                <LogOut className="w-5 h-5 mr-4 transition-transform duration-300 group-hover:scale-110" />
                <div className="text-left">
                  <span className="font-medium text-sm">Sign Out</span>
                  <p className="text-xs text-red-500 mt-1">End your session</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Out</h3>
              <p className="text-gray-600 mb-8">Are you sure you want to sign out of your account?</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
