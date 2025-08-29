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
          placeholder={activeTab === 'return_filing' ? 'Filter by GSTIN' : 'Filter by GST Number'}
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full md:w-48 px-4 py-2 border border-yellow-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-4 border-l-4 border-yellow-400 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-8 text-yellow-500 font-semibold">Loading...</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-yellow-200 text-sm" style={{ minWidth: '800px' }}>
              <thead className="bg-yellow-100 sticky top-0 z-10">
                <tr>
                  {columns.map(col => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-bold text-yellow-700 uppercase tracking-wider bg-yellow-100 sticky top-0 z-10 shadow-sm"
                    >
                      {formatColHeader(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-6 text-yellow-300">No records found.</td>
                  </tr>
                ) : (
                  filteredData.map((row, idx) => (
                    <tr
                      key={row._id || idx}
                      className={`transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-yellow-50'} hover:bg-yellow-100`}
                    >
                      {columns.map(col => (
                        <td
                          key={col}
                          className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                          style={{ borderBottom: '1px solid #fef3c7' }}
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

export default AdminGST;
