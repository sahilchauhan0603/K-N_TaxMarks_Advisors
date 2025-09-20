import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';

const subTabs = [
  { key: 'filing', label: 'GST Filing (Registration & Amendments)', endpoint: '/api/gst-filing', columns: ['name', 'email', 'mobile', 'gstNumber', 'filingType', 'businessName', 'notes', 'documents', 'createdAt'] },
  { key: 'return_filing', label: 'GST Return Filing', endpoint: '/api/gst-return-filing', columns: ['name', 'email', 'mobile', 'gstin', 'notes', 'documents', 'createdAt'] },
  { key: 'resolution', label: 'GST Resolution', endpoint: '/api/gst-resolution', columns: ['name', 'email', 'mobile', 'gstNumber', 'issue', 'notes', 'documents', 'createdAt'] },
];

// Helper to format column names
const formatColHeader = (col) => {
  if (col === 'gstin') return 'GSTIN';
  if (col === 'gstNumber') return 'GST Number';
  if (col === 'filingType') return 'Filing Type';
  if (col === 'businessName') return 'Business Name';
  if (col === 'createdAt') return 'Created At';
  if (col === 'documentPath' || col === 'documents') return 'Documents';
  if (col === 'issue') return 'Issue';
  if (col === 'notes') return 'Notes';
  // Capitalize first letter and add spaces before uppercase letters
  return col.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
};

const AdminGST = () => {
  const [activeTab, setActiveTab] = useState('filing');
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
  const columns = subTabs.find(t => t.key === activeTab)?.columns || [];
  const filteredData = data.filter(row => {
    const searchStr = search.toLowerCase();
    return columns.some(col => (row[col] || '').toString().toLowerCase().includes(searchStr));
  }).filter(row => {
    if (!filter) return true;
    if (activeTab === 'return_filing' && row.gstin) return row.gstin === filter;
    if (activeTab === 'resolution' && row.gstNumber) return row.gstNumber === filter;
    if (activeTab === 'filing' && row.gstNumber) return row.gstNumber === filter;
    return true;
  });

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Handle document download
  const handleDownload = (documentPath) => {
    if (documentPath) {
      // In a real app, this would be the actual download URL
      window.open(`/api/download?path=${encodeURIComponent(documentPath)}`, '_blank');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-[960px] mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">GST Service Requests</h2>
        <p className="text-gray-600 mb-6">Manage and review all GST service requests</p>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
          {subTabs.map(tab => (
            <button
              key={tab.key}
              className={`px-5 py-3 rounded-t-lg font-medium transition-all ${activeTab === tab.key 
                ? 'bg-white border-t border-l border-r border-gray-200 text-yellow-600 shadow-sm relative' 
                : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-50'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-600"></div>
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
                className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400"
              />
            </div>
            
            <div className="w-full md:w-56">
              <input
                type="text"
                placeholder={activeTab === 'return_filing' ? 'Filter by GSTIN' : 'Filter by GST Number'}
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400"
              />
            </div>
            
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
                      {columns.map(col => (
                        <th 
                          key={col} 
                          className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 ${
                            col === 'name' || col === 'email' ? 'w-40' :
                            col === 'mobile' ? 'w-32' :
                            col === 'businessName' || col === 'companyName' ? 'w-48' :
                            col === 'businessType' || col === 'companyType' || col === 'gstNumber' ? 'w-36' :
                            col === 'turnover' ? 'w-32' :
                            col === 'query' || col === 'notes' || col === 'issueDescription' ? 'w-64' :
                            col === 'documents' ? 'w-32' :
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
                        <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
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
                          className="hover:bg-yellow-50 transition-colors duration-150"
                        >
                          <td className="w-16 px-4 py-4 text-sm text-gray-700 border-r border-gray-200 font-semibold">{idx + 1}</td>
                          {columns.map(col => (
                            <td 
                              key={col} 
                              className={`px-4 py-4 text-sm text-gray-700 border-r border-gray-200 ${
                                col === 'name' || col === 'email' ? 'w-40' :
                                col === 'mobile' ? 'w-32' :
                                col === 'businessName' || col === 'companyName' ? 'w-48' :
                                col === 'businessType' || col === 'companyType' || col === 'gstNumber' ? 'w-36' :
                                col === 'turnover' ? 'w-32' :
                                col === 'query' || col === 'notes' || col === 'issueDescription' ? 'w-64' :
                                col === 'documents' ? 'w-32' :
                                col === 'createdAt' ? 'w-44' : 'w-32'
                              }`}
                            >
                              <div className="overflow-hidden">
                                {col === 'createdAt' ? (
                                  <span className="text-gray-500 block truncate">{formatDate(row[col])}</span>
                                ) : col === 'documents' ? (
                                  row[col] ? (
                                    <button
                                      onClick={() => handleDownload(row[col])}
                                      className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1 truncate"
                                    >
                                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                      </svg>
                                      <span className="truncate">Download</span>
                                    </button>
                                  ) : (
                                    <span className="block truncate">-</span>
                                  )
                                ) : col === 'email' ? (
                                  <a href={`mailto:${row[col]}`} className="text-yellow-600 hover:text-yellow-800 block truncate" title={row[col]}>
                                    {row[col] || '-'}
                                  </a>
                                ) : col === 'mobile' ? (
                                  <a href={`tel:${row[col]}`} className="text-gray-700 block truncate">
                                    {row[col] || '-'}
                                  </a>
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

export default AdminGST;