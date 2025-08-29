import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios';
import { FaCog, FaSearch, FaUserShield, FaBell, FaPalette, FaLock } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState({ notifications: {}, appearance: {}, account: {}, security: {} });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { setTheme, setColor } = useTheme();

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/admin/settings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        setSettings(res.data);
        // Sync theme context with backend settings
        if (res.data.appearance) {
          if (res.data.appearance.theme) setTheme(res.data.appearance.theme);
          if (res.data.appearance.color) setColor(res.data.appearance.color);
        }
      } catch (error) {
        // Optionally log the error or handle it appropriately
        console.error('Failed to fetch settings:', error);
      }
      setLoading(false);
    };
    fetchSettings();
  }, [setTheme, setColor]);

  // Sync ThemeContext when appearance changes
  useEffect(() => {
    if (settings.appearance) {
      if (settings.appearance.theme) setTheme(settings.appearance.theme);
      if (settings.appearance.color) setColor(settings.appearance.color);
    }
    // eslint-disable-next-line
  }, [settings.appearance]);

  const handleNotifChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, notifications: { ...prev.notifications, [name]: checked } }));
  };
  const handleAppearanceChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, appearance: { ...prev.appearance, [name]: value } }));
  };
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, account: { ...prev.account, [name]: value } }));
  };
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, security: { ...prev.security, [name]: value } }));
  };
  const saveSettings = async (section) => {
    setLoading(true);
    setSuccess('');
    try {
      const res = await axios.put('/api/admin/settings', { [section]: settings[section] }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setSettings((prev) => ({ ...prev, ...res.data }));
      setSuccess('Settings updated!');
    } catch {
      setSuccess('Failed to update settings.');
    }
    setLoading(false);
  };

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
                <div className="text-center max-w-md w-full">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                    <FaUserShield className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Account Settings</h3>
                  <p className="text-gray-500 mb-4">
                    Update your admin profile information and preferences.
                  </p>
                  <form className="space-y-4" onSubmit={e => { e.preventDefault(); saveSettings('account'); }}>
                    <div className="flex flex-col gap-2">
                      <label className="text-gray-700 font-medium">Full Name</label>
                      <input type="text" name="name" value={settings.account?.name || ''} onChange={handleAccountChange} className="border border-gray-300 rounded px-3 py-2" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-gray-700 font-medium">Email</label>
                      <input type="email" name="email" value={settings.account?.email || ''} onChange={handleAccountChange} className="border border-gray-300 rounded px-3 py-2" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition disabled:opacity-60 mt-4">{loading ? 'Saving...' : 'Save Account'}</button>
                    {success && <div className="mt-2 text-green-600">{success}</div>}
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center max-w-md w-full">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                    <FaBell className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notification Preferences</h3>
                  <p className="text-gray-500 mb-4">
                    Configure how and when you receive system notifications.
                  </p>
                  <form className="space-y-4" onSubmit={e => { e.preventDefault(); saveSettings('notifications'); }}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="notif-email" name="email" checked={!!settings.notifications.email} onChange={handleNotifChange} className="accent-blue-500" />
                      <label htmlFor="notif-email" className="text-gray-700">Email Notifications</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="notif-sms" name="sms" checked={!!settings.notifications.sms} onChange={handleNotifChange} className="accent-blue-500" />
                      <label htmlFor="notif-sms" className="text-gray-700">SMS Notifications</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="notif-inApp" name="inApp" checked={!!settings.notifications.inApp} onChange={handleNotifChange} className="accent-blue-500" />
                      <label htmlFor="notif-inApp" className="text-gray-700">In-App Notifications</label>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition disabled:opacity-60 mt-4">{loading ? 'Saving...' : 'Save Preferences'}</button>
                    {success && <div className="mt-2 text-green-600">{success}</div>}
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center max-w-md w-full">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                    <FaPalette className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Appearance Settings</h3>
                  <p className="text-gray-500 mb-4">
                    Customize the look and feel of your admin dashboard.
                  </p>
                  <form className="space-y-4" onSubmit={e => { e.preventDefault(); saveSettings('appearance'); }}>
                    <div className="flex flex-col gap-2">
                      <label className="text-gray-700 font-medium">Theme</label>
                      <select name="theme" value={settings.appearance.theme || 'light'} onChange={handleAppearanceChange} className="border border-gray-300 rounded px-3 py-2">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-gray-700 font-medium">Primary Color</label>
                      <select name="color" value={settings.appearance.color || 'blue'} onChange={handleAppearanceChange} className="border border-gray-300 rounded px-3 py-2">
                        <option value="blue">Blue</option>
                        <option value="pink">Pink</option>
                        <option value="purple">Purple</option>
                        <option value="yellow">Yellow</option>
                        <option value="green">Green</option>
                      </select>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition disabled:opacity-60 mt-4">{loading ? 'Saving...' : 'Save Appearance'}</button>
                    {success && <div className="mt-2 text-green-600">{success}</div>}
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center max-w-md w-full">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                    <FaLock className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Security Settings</h3>
                  <p className="text-gray-500 mb-4">
                    Manage password, two-factor authentication, and security options.
                  </p>
                  <form className="space-y-4" onSubmit={e => { e.preventDefault(); saveSettings('security'); }}>
                    <div className="flex flex-col gap-2">
                      <label className="text-gray-700 font-medium">Current Password</label>
                      <input type="password" name="currentPassword" value={settings.security?.currentPassword || ''} onChange={handleSecurityChange} className="border border-gray-300 rounded px-3 py-2" autoComplete="current-password" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-gray-700 font-medium">New Password</label>
                      <input type="password" name="newPassword" value={settings.security?.newPassword || ''} onChange={handleSecurityChange} className="border border-gray-300 rounded px-3 py-2" autoComplete="new-password" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-gray-700 font-medium">Enable Two-Factor Authentication</label>
                      <select name="twoFactor" value={settings.security?.twoFactor || 'off'} onChange={handleSecurityChange} className="border border-gray-300 rounded px-3 py-2">
                        <option value="off">Off</option>
                        <option value="on">On</option>
                      </select>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition disabled:opacity-60 mt-4">{loading ? 'Saving...' : 'Save Security'}</button>
                    {success && <div className="mt-2 text-green-600">{success}</div>}
                  </form>
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