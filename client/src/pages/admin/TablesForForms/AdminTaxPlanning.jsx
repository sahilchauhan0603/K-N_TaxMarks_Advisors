import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';

const subTabs = [
  { key: 'personal_corporate', label: 'Personal & Corporate Tax', endpoint: '/api/tax-personal-corporate' },
  { key: 'year_round', label: 'Year-round Strategies', endpoint: '/api/tax-year-round' },
  { key: 'compliance', label: 'Tax Compliance & Advisory', endpoint: '/api/tax-compliance' },
];

const columns = {
  personal_corporate: ['name', 'email', 'mobile', 'entityType', 'incomeDetails', 'notes', 'documentPath', 'createdAt'],
  year_round: ['name', 'email', 'mobile', 'investmentPlans', 'yearGoals', 'notes', 'documentPath', 'createdAt'],
  compliance: ['name', 'email', 'mobile', 'complianceType', 'query', 'notes', 'documentPath', 'createdAt'],
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

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Helper to format column names
  const formatColHeader = (col) => {
    if (col === 'entityType') return 'Entity Type';
    if (col === 'incomeDetails') return 'Income Details';
    if (col === 'investmentPlans') return 'Investment Plans';
    if (col === 'yearGoals') return 'Year Goals';
    if (col === 'complianceType') return 'Compliance Type';
    if (col === 'documentPath' || col === 'documents') return 'Documents';
    if (col === 'createdAt') return 'Created At';
    if (col === 'query') return 'Query';
    if (col === 'notes') return 'Notes';
    // Capitalize first letter and add spaces before uppercase letters
    return col.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  };

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
      <div className="bg-white rounded-2xl shadow-lg p-4 border-l-4 border-blue-400 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-8 text-blue-500 font-semibold">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200 text-sm" style={{ minWidth: '800px' }}>
              <thead className="bg-blue-50 sticky top-0 z-10">
                <tr>
                  {columns[activeTab].map(col => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 sticky top-0 z-10"
                      style={{ background: '#eff6ff' }}
                    >
                      {formatColHeader(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={columns[activeTab].length} className="text-center py-6 text-blue-300">No records found.</td>
                  </tr>
                ) : (
                  filteredData.map((row, idx) => (
                    <tr
                      key={row._id || idx}
                      className={
                        `transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`}
                    >
                      {columns[activeTab].map(col => (
                        <td
                          key={col}
                          className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                          style={{ borderBottom: '1px solid #e0e7ef' }}
                        >
                          {col === 'createdAt' ? formatDate(row[col]) : (row[col] || '-')}
                        </td>
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
