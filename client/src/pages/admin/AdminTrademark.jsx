import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

const subTabs = [
  { key: 'search', label: 'Trademark Search & Registration', endpoint: '/api/trademark-search' },
  { key: 'documentation', label: 'Legal Documentation & Compliance', endpoint: '/api/trademark-documentation' },
  { key: 'protection', label: 'IP Protection & Dispute Resolution', endpoint: '/api/trademark-protection' },
];

const columns = {
  search: ['name', 'email', 'mobile', 'brandName', 'notes', 'documentPath', 'createdAt'],
  documentation: ['name', 'email', 'mobile', 'docType', 'notes', 'documentPath', 'createdAt'],
  protection: ['name', 'email', 'mobile', 'disputeType', 'notes', 'documentPath', 'createdAt'],
};

const AdminTrademark = () => {
  const [activeTab, setActiveTab] = useState('search');
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
      } catch (err) {
        console.error('Error fetching data:', err);
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
    if (activeTab === 'search' && row.brandName) return row.brandName === filter;
    if (activeTab === 'documentation' && row.docType) return row.docType === filter;
    if (activeTab === 'protection' && row.disputeType) return row.disputeType === filter;
    return true;
  });

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Helper to format column names
  const formatColHeader = (col) => {
    if (col === 'brandName') return 'Brand Name';
    if (col === 'docType') return 'Doc Type';
    if (col === 'disputeType') return 'Dispute Type';
    if (col === 'documentPath' || col === 'documents') return 'Documents';
    if (col === 'createdAt') return 'Created At';
    if (col === 'notes') return 'Notes';
    // Capitalize first letter and add spaces before uppercase letters
    return col.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-purple-700 tracking-tight">Trademark Service Requests</h2>
      <div className="flex gap-4 mb-6">
        {subTabs.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-lg font-semibold border-b-2 transition-all ${activeTab === tab.key ? 'border-purple-600 text-purple-700 bg-purple-50' : 'border-transparent text-gray-600 bg-gray-100 hover:bg-purple-50'}`}
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
          className="w-full md:w-64 px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        {activeTab === 'search' && (
          <input
            type="text"
            placeholder="Filter by Brand Name"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        )}
        {activeTab === 'documentation' && (
          <input
            type="text"
            placeholder="Filter by Doc Type"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        )}
        {activeTab === 'protection' && (
          <input
            type="text"
            placeholder="Filter by Dispute Type"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-4 border-l-4 border-purple-400 max-w-3xl mx-auto">
        {loading ? (
          <div className="text-center py-8 text-purple-500 font-semibold">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-200 text-sm" style={{ minWidth: '800px' }}>
              <thead className="bg-purple-50 sticky top-0 z-10">
                <tr>
                  {columns[activeTab].map(col => (
                    <th key={col} className="px-6 py-3 text-left font-bold text-purple-700 uppercase tracking-wider whitespace-nowrap border-b border-purple-200 bg-purple-50 sticky top-0 z-10 shadow-sm">{formatColHeader(col)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr><td colSpan={columns[activeTab].length} className="text-center py-6 text-purple-300">No records found.</td></tr>
                ) : (
                  filteredData.map((row, idx) => (
                    <tr key={row._id || idx} className={idx % 2 === 0 ? "bg-purple-50 hover:bg-purple-100 transition" : "bg-white hover:bg-purple-50 transition"}>
                      {columns[activeTab].map(col => (
                        <td key={col} className="px-6 py-3 text-gray-700 whitespace-nowrap border-b border-purple-100">{col === 'createdAt' ? formatDate(row[col]) : (row[col] || '-')}</td>
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

export default AdminTrademark;
