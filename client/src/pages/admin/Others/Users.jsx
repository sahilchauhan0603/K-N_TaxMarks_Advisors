import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import { FaTrash, FaSearch, FaFilter, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { format, parseISO, subDays } from 'date-fns';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...users];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) ||
        (user.phone && user.phone.includes(term))
      );
    }
    
    // Apply state filter
    if (selectedState !== 'all') {
      result = result.filter(user => user.state === selectedState);
    }
    
    // Apply date filter
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case 'today':
          startDate = subDays(now, 1);
          break;
        case 'week':
          startDate = subDays(now, 7);
          break;
        case 'month':
          startDate = subDays(now, 30);
          break;
        case 'year':
          startDate = subDays(now, 365);
          break;
        default:
          break;
      }
      
      if (startDate) {
        result = result.filter(user => 
          new Date(user.createdAt) >= startDate
        );
      }
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedState, dateRange, users]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setUsers(users.filter(u => u._id !== id));
    } catch {
      alert('Failed to delete user');
    }
  };

  // Get unique states for filter dropdown
  const uniqueStates = [...new Set(users.map(user => user.state))].filter(Boolean);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 p-4 md:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-sky-200 rounded w-1/3"></div>
          <div className="h-12 bg-sky-200 rounded"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-sky-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-sky-800 mb-2">Users Management</h1>
        <p className="text-sky-600 mb-6">Manage all registered users in the system</p>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow border border-sky-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-sky-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                className="pl-10 pr-4 py-2 w-full border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition"
            >
              <FaFilter /> Filters <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-sky-100 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-sky-700 mb-1">State</label>
                <select
                  className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="all">All States</option>
                  {uniqueStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-sky-700 mb-1">Date Range</label>
                <select
                  className="w-full border border-sky-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedState('all');
                    setDateRange('all');
                  }}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sky-700">
            Showing <span className="font-semibold">{filteredUsers.length}</span> user{filteredUsers.length !== 1 ? 's' : ''}
          </p>
          {filteredUsers.length > usersPerPage && (
            <p className="text-sky-700">
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            </p>
          )}
        </div>
        
        {/* Users Table */}
        <div className="overflow-x-auto rounded-xl shadow border border-sky-100 bg-white">
          <table className="min-w-full divide-y divide-sky-100">
            <thead className="bg-sky-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">State</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-sky-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-sky-50">
              {currentUsers.length > 0 ? (
                currentUsers.map(user => (
                  <tr key={user._id} className="hover:bg-sky-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-sky-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sky-700">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sky-700">{user.phone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.state ? 'bg-sky-100 text-sky-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.state || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sky-500 text-sm">
                      {format(parseISO(user.createdAt), 'PPpp')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full transition hover:bg-red-50"
                        title="Delete user"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sky-500">
                    No users found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredUsers.length > usersPerPage && (
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'}`}
            >
              <FaChevronLeft /> Previous
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    page === currentPage ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'}`}
            >
              Next <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;