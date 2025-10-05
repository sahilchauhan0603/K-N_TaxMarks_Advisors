import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';

const subTabs = [
  { key: 'startup', label: 'Startup & MSME Registration', endpoint: '/api/business-startup' },
  { key: 'incorporation', label: 'Company Incorporation', endpoint: '/api/business-incorporation' },
  { key: 'advisory', label: 'Legal & Financial Advisory', endpoint: '/api/business-advisory' },
];

const columns = {
  startup: ['user', 'businessName', 'businessType', 'notes', 'documentPath', 'createdAt'],
  incorporation: ['user', 'companyName', 'companyType', 'notes', 'documentPath', 'createdAt'],
  advisory: ['user', 'query', 'notes', 'documentPath', 'createdAt'],
};

const AdminBusiness = () => {
  const [activeTab, setActiveTab] = useState('startup');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // Search and filter state
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(subTabs.find(t => t.key === activeTab).endpoint + '/all');
        // Fix: handle API response shape
        if (res.data && Array.isArray(res.data.data)) {
          setData(res.data.data);
        } else if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setData([]);
        }
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  // Filtered data
  const filteredData = data.filter(row => {
    const searchStr = search.toLowerCase();
    return columns[activeTab].some(col => {
      if (col === 'user') {
        const user = row.userId || {};
        return (user.name || '').toLowerCase().includes(searchStr) ||
               (user.email || '').toLowerCase().includes(searchStr) ||
               (user.phone || '').toLowerCase().includes(searchStr);
      }
      return (row[col] || '').toString().toLowerCase().includes(searchStr);
    });
  }).filter(row => {
    if (!filter) return true;
    if (activeTab === 'startup' && row.businessType) return row.businessType === filter;
    if (activeTab === 'incorporation' && row.companyType) return row.companyType === filter;
    return true;
  });

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Helper to format column names
  const formatColHeader = (col) => {
    if (col === 'user') return 'User Details';
    if (col === 'businessName') return 'Business Name';
    if (col === 'businessType') return 'Business Type';
    if (col === 'companyName') return 'Company Name';
    if (col === 'companyType') return 'Company Type';
    if (col === 'documentPath' || col === 'documents') return 'Documents';
    if (col === 'createdAt') return 'Created At';
    if (col === 'query') return 'Query';
    if (col === 'notes') return 'Notes';
    // Capitalize first letter and add spaces before uppercase letters
    return col.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  };

  // Handle document download
  const handleDownload = (documentPath) => {
    if (documentPath) {
      // In a real app, this would be the actual download URL
      window.open(`/api/download?path=${encodeURIComponent(documentPath)}`, '_blank');
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await axios.get(subTabs.find(t => t.key === activeTab).endpoint + '/all');
      if (res.data && Array.isArray(res.data.data)) {
        setData(res.data.data);
      } else if (Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 bg-gray-50 min-h-screen">
      <div className="max-w-[960px] mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Business Advisory Requests</h2>
            <p className="text-gray-600">Manage and review all business service requests</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
          {subTabs.map(tab => (
            <button
              key={tab.key}
              className={`px-5 py-3 rounded-t-lg font-medium transition-all ${activeTab === tab.key 
                ? 'bg-white border-t border-l border-r border-gray-200 text-pink-600 shadow-sm relative' 
                : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600"></div>
              )}
            </button>
          ))}
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100 w-full">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search across all fields..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
              />
            </div>
            
            {(activeTab === 'startup' || activeTab === 'incorporation') && (
              <div className="w-full md:w-56">
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                >
                  <option value="">All Types</option>
                  {activeTab === 'startup' ? (
                    <>
                      <option value="Proprietorship">Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="LLP">LLP</option>
                      <option value="Private Limited">Private Limited</option>
                    </>
                  ) : (
                    <>
                      <option value="Private Limited">Private Limited</option>
                      <option value="Public Limited">Public Limited</option>
                      <option value="OPC">OPC</option>
                      <option value="LLP">LLP</option>
                    </>
                  )}
                </select>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="hidden sm:inline">{filteredData.length} results</span>
              {filter && (
                <button 
                  onClick={() => setFilter('')}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1"
                >
                  Clear filter
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border w-full border-gray-100">
          {loading ? (
            // Skeleton loading screen
            <div className="p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-hidden">
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                <table className="w-full table-fixed divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">S.No</th>
                      {columns[activeTab].map(col => (
                        <th 
                          key={col} 
                          className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 ${
                            col === 'user' ? 'w-56' :
                            col === 'businessName' || col === 'companyName' ? 'w-48' :
                            col === 'businessType' || col === 'companyType' ? 'w-36' :
                            col === 'query' || col === 'notes' ? 'w-64' :
                            col === 'documentPath' ? 'w-32' :
                            col === 'createdAt' ? 'w-44' : 'w-32'
                          }`}
                        >
                          {formatColHeader(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={columns[activeTab].length + 1} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="text-lg font-medium">No records found</p>
                            <p className="mt-1 max-w-md">Try adjusting your search or filter to find what you're looking for.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((row, idx) => (
                        <tr 
                          key={row._id || idx} 
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="w-16 px-4 py-4 text-sm text-gray-700 border-r border-gray-200 font-semibold">{idx + 1}</td>
                          {columns[activeTab].map(col => (
                            <td 
                              key={col} 
                              className={`px-4 py-4 text-sm text-gray-700 border-r border-gray-200 ${
                                col === 'user' ? 'w-56' :
                                col === 'businessName' || col === 'companyName' ? 'w-48' :
                                col === 'businessType' || col === 'companyType' ? 'w-36' :
                                col === 'query' || col === 'notes' ? 'w-64' :
                                col === 'documentPath' ? 'w-32' :
                                col === 'createdAt' ? 'w-44' : 'w-32'
                              }`}
                            >
                              <div className="overflow-hidden">
                                {col === 'user' ? (
                                  <div className="space-y-1">
                                    <div className="font-medium text-gray-900 truncate">{row.userId?.name || '-'}</div>
                                    <div className="text-gray-500 truncate">
                                      <a href={`mailto:${row.userId?.email}`} className="hover:text-pink-600" title={row.userId?.email}>
                                        {row.userId?.email || '-'}
                                      </a>
                                    </div>
                                    <div className="text-gray-500 truncate">
                                      <a href={`tel:${row.userId?.phone}`} className="hover:text-pink-600">
                                        {row.userId?.phone || '-'}
                                      </a>
                                    </div>
                                  </div>
                                ) : col === 'createdAt' ? (
                                  <span className="text-gray-500 block truncate">{formatDate(row[col])}</span>
                                ) : col === 'documentPath' ? (
                                  row.documentPath ? (
                                    <button
                                      onClick={() => handleDownload(row.documentPath)}
                                      className="text-pink-600 hover:text-pink-800 flex items-center gap-1 truncate"
                                    >
                                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                      </svg>
                                      <span className="truncate">Download</span>
                                    </button>
                                  ) : (
                                    <span className="block truncate">-</span>
                                  )
                                ) : (
                                  <span className="block truncate" title={row[col]}>
                                    {row[col] || '-'}
                                  </span>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBusiness;