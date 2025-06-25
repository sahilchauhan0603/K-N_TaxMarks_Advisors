import React, { useState } from 'react';
import { FaCog, FaSearch, FaUserShield, FaBell, FaPalette, FaLock } from 'react-icons/fa';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [searchQuery, setSearchQuery] = useState('');

  const settingCategories = [
    { id: 'account', name: 'Account', icon: <FaUserShield className="mr-2" /> },
    { id: 'notifications', name: 'Notifications', icon: <FaBell className="mr-2" /> },
    { id: 'appearance', name: 'Appearance', icon: <FaPalette className="mr-2" /> },
    { id: 'security', name: 'Security', icon: <FaLock className="mr-2" /> },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaCog className="text-2xl text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search settings..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="md:w-1/4">
            <nav className="space-y-1">
              {settingCategories.map((category) => (
                <button
                  key={category.id}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeTab === category.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab(category.id)}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="md:w-3/4 bg-gray-50 rounded-xl p-6 min-h-[300px]">
            {activeTab === 'account' && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                    <FaUserShield className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Account Settings</h3>
                  <p className="text-gray-500 mb-4">
                    Update your admin profile information and preferences.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                    <FaBell className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notification Preferences</h3>
                  <p className="text-gray-500 mb-4">
                    Configure how and when you receive system notifications.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                    <FaPalette className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Appearance Settings</h3>
                  <p className="text-gray-500 mb-4">
                    Customize the look and feel of your admin dashboard.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                    <FaLock className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Security Settings</h3>
                  <p className="text-gray-500 mb-4">
                    Manage password, two-factor authentication, and security options.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;