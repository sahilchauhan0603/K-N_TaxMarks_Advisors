import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import Swal from 'sweetalert2';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [pendingTestimonials, setPendingTestimonials] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, [activeTab]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      if (activeTab === 'pending') {
        const response = await axios.get('/api/testimonials/admin/pending');
        setPendingTestimonials(response.data);
      } else {
        const response = await axios.get('/api/testimonials/admin/all');
        setTestimonials(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const approveTestimonial = async (id) => {
    const result = await Swal.fire({
      title: 'Approve Testimonial?',
      text: 'This testimonial will be visible to users on the website.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      // Explicitly use admin token for approve request
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        setError('Admin token not found. Please login again.');
        return;
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      };
      
      await axios.put(`/api/testimonials/${id}/approve`, {}, config);
      
      // Move testimonial from pending to approved
      const testimonial = pendingTestimonials.find(t => t._id === id);
      if (testimonial) {
        setPendingTestimonials(pendingTestimonials.filter(t => t._id !== id));
        setTestimonials([{ ...testimonial, isApproved: true }, ...testimonials]);
      }
      
      // Refresh data to ensure consistency
      fetchTestimonials();
      
      // Show success message
      Swal.fire({
        title: 'Approved!',
        text: 'The testimonial has been approved successfully.',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve testimonial');
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Failed to approve testimonial',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const deleteTestimonial = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Testimonial?',
      text: 'This action cannot be undone. The testimonial will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      // Explicitly use admin token for delete request
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        setError('Admin token not found. Please login again.');
        return;
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      };
      
      await axios.delete(`/api/testimonials/${id}`, config);
      
      if (activeTab === 'pending') {
        setPendingTestimonials(pendingTestimonials.filter(t => t._id !== id));
      } else {
        setTestimonials(testimonials.filter(t => t._id !== id));
      }
      
      // Show success message
      Swal.fire({
        title: 'Deleted!',
        text: 'The testimonial has been deleted successfully.',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete testimonial');
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Failed to delete testimonial',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const getStatusBadge = (isApproved) => {
    return isApproved ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Approved
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  const currentTestimonials = activeTab === 'pending' ? pendingTestimonials : testimonials;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 bg-gray-50 min-h-screen">
      <div className="max-w-[960px] mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Testimonials Management</h1>
            <p className="text-gray-600">Review, approve, and manage user testimonials.</p>
          </div>
          <button
            onClick={fetchTestimonials}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 cursor-pointer rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Approval ({pendingTestimonials.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Testimonials ({testimonials.length})
          </button>
        </nav>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {currentTestimonials.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h6a2 2 0 002-2V8M9 12h6"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === 'pending' ? 'No pending testimonials' : 'No testimonials'}
          </h3>
          <p className="text-gray-500">
            {activeTab === 'pending' 
              ? 'All testimonials have been reviewed.' 
              : 'No testimonials have been submitted yet.'}
          </p>
        </div>
      ) : (
        <div className="max-h-[600px] overflow-y-auto">
          <div className="grid gap-6 pr-2">
            {currentTestimonials.map((testimonial) => (
            <div key={testimonial._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    {testimonial.photoUrl && (
                      <img
                        src={testimonial.photoUrl}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-gray-600">{testimonial.role}</p>
                      <p className="text-sm text-gray-500">Service: {testimonial.service}</p>
                      {testimonial.userId && (
                        <p className="text-sm text-gray-500">
                          User: {testimonial.userId.name} ({testimonial.userId.email})
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(testimonial.isApproved)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 italic">"{testimonial.feedback}"</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Submitted on {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  
                  <div className="flex space-x-2">
                    {!testimonial.isApproved && (
                      <button
                        onClick={() => approveTestimonial(testimonial._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 cursor-pointer py-2 rounded-lg text-sm font-medium flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Approve</span>
                      </button>
                    )}
                    <button
                      onClick={() => deleteTestimonial(testimonial._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 cursor-pointer py-2 rounded-lg text-sm font-medium flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}
      </div>
    // </div>
  );
};

export default AdminTestimonials;