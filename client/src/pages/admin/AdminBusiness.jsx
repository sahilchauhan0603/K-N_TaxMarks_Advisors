import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

const subTabs = [
  { key: 'startup', label: 'Startup & MSME Registration', endpoint: '/api/business-startup' },
  { key: 'incorporation', label: 'Company Incorporation', endpoint: '/api/business-incorporation' },
  { key: 'advisory', label: 'Legal & Financial Advisory', endpoint: '/api/business-advisory' },
];

const columns = {
  startup: ['name', 'email', 'mobile', 'businessName', 'businessType', 'notes', 'documentPath', 'createdAt'],
  incorporation: ['name', 'email', 'mobile', 'companyName', 'companyType', 'notes', 'documentPath', 'createdAt'],
  advisory: ['name', 'email', 'mobile', 'query', 'notes', 'documentPath', 'createdAt'],
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
    return columns[activeTab].some(col => (row[col] || '').toString().toLowerCase().includes(searchStr));
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

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-pink-700 tracking-tight">Business Advisory Requests</h2>
      <div className="flex gap-4 mb-6">
        {subTabs.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-lg font-semibold border-b-2 transition-all ${activeTab === tab.key ? 'border-pink-600 text-pink-700 bg-pink-50' : 'border-transparent text-gray-600 bg-gray-100 hover:bg-pink-50'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        {activeTab === 'startup' && (
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">All Business Types</option>
            <option value="Proprietorship">Proprietorship</option>
            <option value="Partnership">Partnership</option>
            <option value="LLP">LLP</option>
            <option value="Private Limited">Private Limited</option>
          </select>
        )}
        {activeTab === 'incorporation' && (
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">All Company Types</option>
            <option value="Private Limited">Private Limited</option>
            <option value="Public Limited">Public Limited</option>
            <option value="OPC">OPC</option>
            <option value="LLP">LLP</option>
          </select>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-4 border-l-4 border-pink-400 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-8 text-pink-500 font-semibold">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-pink-200 text-sm" style={{ minWidth: '800px' }}>
              <thead className="bg-pink-50 sticky top-0 z-10">
                <tr>
                  {columns[activeTab].map(col => (
                    <th key={col} className="px-6 py-3 text-left font-bold text-pink-700 uppercase tracking-wider whitespace-nowrap border-b border-pink-200 bg-pink-50 sticky top-0 z-10 shadow-sm">{formatColHeader(col)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr><td colSpan={columns[activeTab].length} className="text-center py-6 text-pink-300">No records found.</td></tr>
                ) : (
                  filteredData.map((row, idx) => (
                    <tr key={row._id || idx} className={idx % 2 === 0 ? "bg-pink-50 hover:bg-pink-100 transition" : "bg-white hover:bg-pink-50 transition"}>
                      {columns[activeTab].map(col => (
                        <td key={col} className="px-6 py-3 text-gray-700 whitespace-nowrap border-b border-pink-100">{col === 'createdAt' ? formatDate(row[col]) : (row[col] || '-')}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBusiness;
