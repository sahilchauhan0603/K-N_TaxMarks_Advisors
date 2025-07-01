import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

const subTabs = [
  { key: 'personal_corporate', label: 'Personal & Corporate Tax', endpoint: '/api/tax-personal-corporate' },
  { key: 'year_round', label: 'Year-round Strategies', endpoint: '/api/tax-year-round' },
  { key: 'compliance', label: 'Tax Compliance & Advisory', endpoint: '/api/tax-compliance' },
];

const columns = {
  personal_corporate: ['name', 'email', 'mobile', 'entity Type', 'income Details', 'notes', 'document Path', 'created At'],
  year_round: ['name', 'email', 'mobile', 'investment Plans', 'year Goals', 'notes', 'document Path', 'created At'],
  compliance: ['name', 'email', 'mobile', 'compliance Type', 'query', 'notes', 'document Path', 'created At'],
};

const AdminTaxPlanning = () => {
  const [activeTab, setActiveTab] = useState('personal_corporate');
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
    if (activeTab === 'personal_corporate' && row.entityType) return row.entityType === filter;
    if (activeTab === 'year_round' && row.yearGoals) return row.yearGoals === filter;
    if (activeTab === 'compliance' && row.complianceType) return row.complianceType === filter;
    return true;
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700 tracking-tight">Tax Planning Requests</h2>
      <div className="flex gap-4 mb-6">
        {subTabs.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-lg font-semibold border-b-2 transition-all ${activeTab === tab.key ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 bg-gray-100 hover:bg-blue-50'}`}
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
          className="w-full md:w-64 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {activeTab === 'personal_corporate' && (
          <input
            type="text"
            placeholder="Filter by Entity Type"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}
        {activeTab === 'year_round' && (
          <input
            type="text"
            placeholder="Filter by Year Goals"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}
        {activeTab === 'compliance' && (
          <input
            type="text"
            placeholder="Filter by Compliance Type"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-4 border-l-4 border-blue-400">
        {loading ? (
          <div className="text-center py-8 text-blue-500 font-semibold">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200">
              <thead className="bg-blue-50">
                <tr>
                  {columns[activeTab].map(col => (
                    <th key={col} className="px-4 py-2 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr><td colSpan={columns[activeTab].length} className="text-center py-6 text-blue-300">No records found.</td></tr>
                ) : (
                  filteredData.map((row, idx) => (
                    <tr key={row._id || idx} className="hover:bg-blue-50">
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

export default AdminTaxPlanning;
