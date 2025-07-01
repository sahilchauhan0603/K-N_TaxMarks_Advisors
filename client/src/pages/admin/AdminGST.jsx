import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

const subTabs = [
  { key: 'return_filing', label: 'GST Return Filing', endpoint: '/api/gst-return-filing' },
  { key: 'resolution', label: 'GST Resolution', endpoint: '/api/gst-resolution' },
];

const columns = {
  return_filing: ['name', 'email', 'mobile', 'gst in', 'notes', 'documents', 'created At'],
  resolution: ['name', 'email', 'mobile', 'gst in', 'notes', 'documents', 'created At'],
};

const AdminGST = () => {
  const [activeTab, setActiveTab] = useState('return_filing');
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
  const filteredData = data.filter(row => {
    const searchStr = search.toLowerCase();
    return columns[activeTab].some(col => (row[col] || '').toString().toLowerCase().includes(searchStr));
  }).filter(row => {
    if (!filter) return true;
    if (activeTab === 'return_filing' && row.gstin) return row.gstin === filter;
    if (activeTab === 'resolution' && row.gstin) return row.gstin === filter;
    return true;
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-yellow-700 tracking-tight">GST Service Requests</h2>
      <div className="flex gap-4 mb-6">
        {subTabs.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-lg font-semibold border-b-2 transition-all ${activeTab === tab.key ? 'border-yellow-600 text-yellow-700 bg-yellow-50' : 'border-transparent text-gray-600 bg-gray-100 hover:bg-yellow-50'}`}
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
          className="w-full md:w-64 px-4 py-2 border border-yellow-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="text"
          placeholder="Filter by GSTIN"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full md:w-48 px-4 py-2 border border-yellow-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-4 border-l-4 border-yellow-400">
        {loading ? (
          <div className="text-center py-8 text-yellow-500 font-semibold">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-yellow-200">
              <thead className="bg-yellow-50">
                <tr>
                  {columns[activeTab].map(col => (
                    <th key={col} className="px-4 py-2 text-left text-xs font-bold text-yellow-700 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr><td colSpan={columns[activeTab].length} className="text-center py-6 text-yellow-300">No records found.</td></tr>
                ) : (
                  filteredData.map((row, idx) => (
                    <tr key={row._id || idx} className="hover:bg-yellow-50">
                      {columns[activeTab].map(col => (
                        <td key={col} className="px-4 py-2 text-sm text-gray-700">{row[col] || '-'}</td>
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

export default AdminGST;
