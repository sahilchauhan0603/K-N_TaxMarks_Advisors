import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import { FaTrash, FaSearch, FaFilter, FaChevronDown, FaChevronLeft, FaChevronRight, FaEye, FaEdit, FaSyncAlt } from 'react-icons/fa';
import { format, parseISO, subDays } from 'date-fns';
import Swal from 'sweetalert2';

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
    const result = await Swal.fire({
      title: 'Delete User?',
      text: 'This action cannot be undone. The user and all their data will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete user!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setUsers(users.filter(u => u._id !== id));
      
      Swal.fire({
        title: 'Deleted!',
        text: 'The user has been deleted successfully.',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      });
    } catch {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete user. Please try again.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
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
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-sky-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-sky-200 rounded w-1/2 mb-6"></div>
            
            <div className="h-16 bg-sky-200 rounded-xl mb-6"></div>
            
            <div className="h-12 bg-sky-200 rounded-xl mb-4"></div>
            
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-sky-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 md:p-4 md:ml-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-sky-800 mb-2">Users Management</h1>
            <p className="text-sky-600">Manage all registered users in the system</p>
          </div>
          <button
            onClick={fetchUsers}
            className={`flex items-center gap-2 cursor-pointer px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow transition ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            title="Refresh user list"
            disabled={loading}
          >
            <FaSyncAlt className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow border border-sky-100 p-4">
            <div className="text-2xl font-bold text-sky-800">{users.length}</div>
            <div className="text-sm text-sky-600">Total Users</div>
          </div>
          <div className="bg-white rounded-xl shadow border border-sky-100 p-4">
            <div className="text-2xl font-bold text-sky-800">
              {users.filter(u => new Date(u.createdAt) > subDays(new Date(), 7)).length}
            </div>
            <div className="text-sm text-sky-600">Last 7 Days</div>
          </div>
          <div className="bg-white rounded-xl shadow border border-sky-100 p-4">
            <div className="text-2xl font-bold text-sky-800">
              {users.filter(u => new Date(u.createdAt) > subDays(new Date(), 30)).length}
            </div>
            <div className="text-sm text-sky-600">Last 30 Days</div>
          </div>
          <div className="bg-white rounded-xl shadow border border-sky-100 p-4">
            <div className="text-2xl font-bold text-sky-800">{uniqueStates.length}</div>
            <div className="text-sm text-sky-600">States</div>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow border border-sky-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-sky-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                className="pl-10 pr-4 py-3 w-full border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 cursor-pointer py-3 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition"
            >
              <FaFilter /> Filters <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-sky-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-sky-700 mb-2">State</label>
                <select
                  className="w-full border border-sky-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
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
                <label className="block text-sm font-medium text-sky-700 mb-2">Date Range</label>
                <select
                  className="w-full border border-sky-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
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
                  className="px-6 py-2.5 cursor-pointer bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition w-full"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results Count */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-sky-700 font-medium">
            Showing <span className="font-bold">{filteredUsers.length}</span> user{filteredUsers.length !== 1 ? 's' : ''}
            {searchTerm && <span className="text-sky-500"> for "{searchTerm}"</span>}
          </p>
          {filteredUsers.length > usersPerPage && (
            <p className="text-sky-700">
              Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
            </p>
          )}
        </div>
        
        {/* Users Table */}
        <div className="overflow-x-auto rounded-xl shadow border border-sky-100 bg-white">
          <table className="min-w-full divide-y divide-sky-100">
            <thead className="bg-sky-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-700 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-700 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-700 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-700 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-sky-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-sky-50">
              {currentUsers.length > 0 ? (
                currentUsers.map(user => (
                  <tr key={user._id} className="hover:bg-sky-50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-sky-100 rounded-full flex items-center justify-center">
                          <span className="text-sky-700 font-medium">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-sky-900">{user.name}</div>
                          <div className="text-sm text-sky-500">ID: {user._id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sky-700">{user.email}</div>
                      <div className="text-sm text-sky-500">{user.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 text-xs rounded-full font-medium ${
                        user.state ? 'bg-sky-100 text-sky-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.state || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sky-500 text-sm">
                      {format(parseISO(user.createdAt), 'MMM dd, yyyy')}
                      <div className="text-xs text-sky-400">
                        {format(parseISO(user.createdAt), 'hh:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center space-x-2">
                        {/* <button
                          className="text-sky-600 hover:text-sky-800 p-2 rounded-full transition hover:bg-sky-100"
                          title="View user"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="text-sky-600 hover:text-sky-800 p-2 rounded-full transition hover:bg-sky-100"
                          title="Edit user"
                        >
                          <FaEdit />
                        </button> */}
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full cursor-pointer transition hover:bg-red-50"
                          title="Delete user"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-sky-400">
                      <FaSearch className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No users found</p>
                      <p className="text-sm max-w-md">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredUsers.length > usersPerPage && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-sky-600">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'}`}
              >
                <FaChevronLeft /> Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        pageNum === currentPage ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2 py-2 text-sky-400">...</span>
                )}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100 text-sky-700 hover:bg-sky-200"
                  >
                    {totalPages}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'}`}
              >
                Next <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;