import React, { useState } from 'react';
import { FaChartBar, FaSearch, FaDownload, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import { FiUsers, FiFileText } from 'react-icons/fi';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [dateRange, setDateRange] = useState('last30');
  const [searchQuery, setSearchQuery] = useState('');

  const reportTypes = [
    { id: 'users', name: 'User Reports', icon: <FiUsers className="mr-2" /> },
    { id: 'services', name: 'Service Reports', icon: <FiFileText className="mr-2" /> },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaChartBar className="text-2xl text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search reports..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <select 
              className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" />
              <input 
                type="date" 
                className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-500">to</span>
              <input 
                type="date" 
                className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div className="ml-auto">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
              <FaDownload /> Export as CSV
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {reportTypes.map((tab) => (
              <button
                key={tab.id}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-gray-50 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <FaChartBar className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed Analytics Coming Soon</h3>
            <p className="text-gray-500">
              We're working on comprehensive reporting tools with interactive charts and detailed metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;