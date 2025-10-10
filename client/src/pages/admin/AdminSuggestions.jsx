import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { 
  FaEye, FaEyeSlash, FaTrash, FaEdit, FaFilter, FaSearch, 
  FaLightbulb, FaExclamationTriangle, FaCalendarAlt, FaUser,
  FaEnvelope, FaTag, FaStickyNote
} from 'react-icons/fa';
import { MdMessage, MdSubject } from 'react-icons/md';
import Swal from 'sweetalert2';

const AdminSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({
    category: 'All',
    priority: 'All',
    isRead: 'All',
    searchTerm: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const categories = ['All', 'Website UI/UX', 'Service Quality', 'New Service Request', 'Technical Issue', 'General Feedback', 'Other'];
  const priorities = ['All', 'Low', 'Medium', 'High'];

  useEffect(() => {
    fetchSuggestions();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [filters.category, filters.priority, filters.isRead, filters.sortBy, filters.sortOrder]);

  useEffect(() => {
    applySearchFilter();
  }, [suggestions, filters.searchTerm]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/suggestions', {
        params: {
          category: filters.category !== 'All' ? filters.category : undefined,
          priority: filters.priority !== 'All' ? filters.priority : undefined,
          isRead: filters.isRead !== 'All' ? filters.isRead : undefined,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder
        }
      });
      setSuggestions(response.data.suggestions);
      // Apply frontend search filtering to backend results
      applySearchFilter(response.data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      Swal.fire('Error', 'Failed to fetch suggestions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/suggestions/stats/summary');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const applySearchFilter = (suggestionsData = suggestions) => {
    let filtered = [...suggestionsData];

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(suggestion =>
        suggestion.name.toLowerCase().includes(searchLower) ||
        suggestion.email.toLowerCase().includes(searchLower) ||
        suggestion.subject.toLowerCase().includes(searchLower) ||
        suggestion.message.toLowerCase().includes(searchLower)
      );
    }

    setFilteredSuggestions(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const toggleReadStatus = async (suggestionId, currentStatus) => {
    try {
      await axios.put(`/api/suggestions/${suggestionId}/read`, {
        isRead: !currentStatus
      });
      
      setSuggestions(prev => prev.map(suggestion =>
        suggestion._id === suggestionId
          ? { ...suggestion, isRead: !currentStatus }
          : suggestion
      ));
      
      fetchStats(); // Refresh stats
      
      Swal.fire({
        title: 'Success!',
        text: `Suggestion marked as ${!currentStatus ? 'read' : 'unread'}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating read status:', error);
      Swal.fire('Error', 'Failed to update suggestion status', 'error');
    }
  };

  const deleteSuggestion = async (suggestionId) => {
    const result = await Swal.fire({
      title: 'Delete Suggestion?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/suggestions/${suggestionId}`);
        setSuggestions(prev => prev.filter(suggestion => suggestion._id !== suggestionId));
        fetchStats(); // Refresh stats
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Suggestion has been deleted successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error deleting suggestion:', error);
        Swal.fire('Error', 'Failed to delete suggestion', 'error');
      }
    }
  };

  const openSuggestionModal = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setAdminNotes(suggestion.adminNotes || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSuggestion(null);
    setAdminNotes('');
  };

  const saveAdminNotes = async () => {
    try {
      await axios.put(`/api/suggestions/${selectedSuggestion._id}/notes`, {
        adminNotes
      });
      
      setSuggestions(prev => prev.map(suggestion =>
        suggestion._id === selectedSuggestion._id
          ? { ...suggestion, adminNotes }
          : suggestion
      ));
      
      Swal.fire({
        title: 'Success!',
        text: 'Admin notes updated successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
      closeModal();
    } catch (error) {
      console.error('Error saving admin notes:', error);
      Swal.fire('Error', 'Failed to save admin notes', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Website UI/UX': '🎨',
      'Service Quality': '⭐',
      'New Service Request': '🆕',
      'Technical Issue': '🔧',
      'General Feedback': '💭',
      'Other': '📝'
    };
    return icons[category] || '💭';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800 border-green-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'High': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority] || colors['Medium'];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="p-2 bg-gray-50 min-h-screen">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center mb-4">
              <FaLightbulb className="text-3xl text-slate-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">User Suggestions</h1>
            </div>
            <p className="text-gray-600">Manage and review user feedback and suggestions</p>
          </div>
          <button
            onClick={fetchSuggestions}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 cursor-pointer rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Refresh</span>
          </button>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaLightbulb />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Suggestions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSuggestions || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <FaEyeSlash />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unreadSuggestions || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaCalendarAlt />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todaySuggestions || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaExclamationTriangle />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.priorityStats?.find(p => p._id === 'High')?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-1" /> Search
            </label>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              placeholder="Search suggestions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaTag className="inline mr-1" /> Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-400"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaExclamationTriangle className="inline mr-1" /> Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-400"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaFilter className="inline mr-1" /> Status
            </label>
            <select
              value={filters.isRead}
              onChange={(e) => handleFilterChange('isRead', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-400"
            >
              <option value="All">All</option>
              <option value="false">Unread</option>
              <option value="true">Read</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-400"
            >
              <option value="createdAt">Date</option>
              <option value="priority">Priority</option>
              <option value="category">Category</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suggestions Table */}
      <div className="bg-white rounded-xl shadow-sm border w-full border-gray-100">
        <div className="w-full overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuggestions.map((suggestion) => (
                <tr key={suggestion._id} className={`hover:bg-gray-50 ${!suggestion.isRead ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      suggestion.isRead ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {suggestion.isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{suggestion.name}</div>
                      <div className="text-sm text-gray-500">{suggestion.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{suggestion.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <span className="mr-1">{getCategoryIcon(suggestion.category)}</span>
                      {suggestion.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(suggestion.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => openSuggestionModal(suggestion)}
                      className="text-blue-600 hover:text-blue-900 cursor-pointer transition-colors"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => toggleReadStatus(suggestion._id, suggestion.isRead)}
                      className="text-green-600 hover:text-green-900 cursor-pointer transition-colors"
                      title={suggestion.isRead ? "Mark as Unread" : "Mark as Read"}
                    >
                      {suggestion.isRead ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <button
                      onClick={() => deleteSuggestion(suggestion._id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredSuggestions.length === 0 && (
            <div className="text-center py-12">
              <FaLightbulb className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Modal for viewing suggestion details */}
      {showModal && selectedSuggestion && (
        <div className="fixed inset-0 z-50 overflow-y-auto ml-10">
          <div className="flex items-center justify-center min-h-screen py-4 px-4">
            {/* Backdrop with blur effect */}
            <div 
              className="fixed inset-0 bg-black/40 bg-opacity-75 backdrop-blur-sm transition-opacity" 
              onClick={closeModal}
            ></div>
            
            {/* Modal content */}
            <div className="relative bg-white rounded-lg text-left shadow-xl transform transition-all max-w-3xl w-full mx-auto">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FaLightbulb className="mr-2 text-amber-500" />
                    Suggestion Details
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer rounded-full p-2 transition-colors"
                    title="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <FaUser className="mr-2 text-blue-500" />
                        Name
                      </label>
                      <p className="text-sm text-gray-900 font-medium">{selectedSuggestion.name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <FaEnvelope className="mr-2 text-green-500" />
                        Email
                      </label>
                      <p className="text-sm text-gray-900 font-medium">{selectedSuggestion.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <FaTag className="mr-2 text-purple-500" />
                        Category
                      </label>
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getCategoryIcon(selectedSuggestion.category)}</span>
                        <p className="text-sm text-gray-900 font-medium">{selectedSuggestion.category}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <FaExclamationTriangle className="mr-2 text-orange-500" />
                        Priority
                      </label>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedSuggestion.priority)}`}>
                        {selectedSuggestion.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <MdSubject className="mr-2 text-indigo-500" />
                      Subject
                    </label>
                    <p className="text-sm text-gray-900 font-medium bg-white p-3 rounded border">
                      {selectedSuggestion.subject}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <MdMessage className="mr-2 text-teal-500" />
                      Message
                    </label>
                    <div className="bg-white border rounded-md p-4">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {selectedSuggestion.message}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <FaStickyNote className="mr-2 text-yellow-600" />
                      Admin Notes
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-vertical"
                      placeholder="Add internal notes about this suggestion..."
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <FaCalendarAlt className="mr-2 text-gray-500" />
                      Submitted
                    </label>
                    <p className="text-sm text-gray-700 font-medium bg-white p-2 rounded border">
                      {formatDate(selectedSuggestion.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 border cursor-pointer border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAdminNotes}
                  className="px-6 py-2 cursor-pointer bg-slate-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-slate-700 transition-colors shadow-sm"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminSuggestions;