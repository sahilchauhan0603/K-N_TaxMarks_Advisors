import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios';
import { 
  FaRupeeSign, 
  FaSpinner, 
  FaEdit, 
  FaCheck, 
  FaTimes,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaLandmark,
  FaCog,
  FaBusinessTime,
  FaSave,
  FaSync
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const AdminServicePricing = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [saving, setSaving] = useState(false);

  // Check admin authentication status
  const isAdminAuthenticated = () => {
    const adminToken = localStorage.getItem('adminToken');
    const adminEmail = localStorage.getItem('adminEmail');
    return !!(adminToken && adminEmail);
  };

  const categoryMapping = {
    'itr': 'ITR Filing',
    'gst': 'GST Services',  
    'trademark': 'Trademark Services',
    'business': 'Business Advisory',
    'tax': 'Tax Planning'
  };

  const serviceIcons = {
    'itr': <FaLandmark className="text-green-500" />,
    'gst': <FaFileInvoiceDollar className="text-blue-500" />,
    'trademark': <FaLandmark className="text-purple-500" />,
    'business': <FaBusinessTime className="text-orange-500" />,
    'tax': <FaCog className="text-indigo-500" />,
  };

  const categoryColors = {
    'itr': 'bg-green-50 border-green-200',
    'gst': 'bg-blue-50 border-blue-200',
    'trademark': 'bg-purple-50 border-purple-200',
    'business': 'bg-orange-50 border-orange-200',
    'tax': 'bg-indigo-50 border-indigo-200',
  };

  useEffect(() => {
    fetchServicePricing();
  }, []);

  const fetchServicePricing = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/pricing');
      setServices(response.data.data.all || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch service pricing');
      console.error('Error fetching service pricing:', err);
      
      // Initialize pricing if it fails (first time setup)
      try {
        await axios.post('/api/pricing/initialize');
        const retryResponse = await axios.get('/api/pricing');
        setServices(retryResponse.data.data.all || []);
        setError('');
      } catch (initErr) {
        console.error('Error initializing pricing:', initErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const groupServicesByCategory = () => {
    const grouped = {};
    services.forEach(service => {
      const categoryKey = service.serviceCategory;
      if (!grouped[categoryKey]) {
        grouped[categoryKey] = [];
      }
      grouped[categoryKey].push(service);
    });
    return grouped;
  };

  const handleEditClick = (service) => {
    setEditingService(service._id);
    setEditPrice(service.price.toString());
  };

  const handleSavePrice = async (serviceId) => {
    if (!editPrice || isNaN(editPrice) || editPrice <= 0) {
      Swal.fire({
        title: 'Invalid Price',
        text: 'Please enter a valid price amount',
        icon: 'error'
      });
      return;
    }

    // Check if admin is authenticated
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please login as admin to update prices',
        icon: 'warning',
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/admin/login';
        }
      });
      return;
    }

    try {
      setSaving(true);
      console.log('Updating price for service:', serviceId, 'to:', editPrice);
      
      const response = await axios.put(`/api/pricing/${serviceId}`, {
        price: parseFloat(editPrice)
      });

      console.log('Price update response:', response.data);

      // Update local state
      setServices(prevServices => 
        prevServices.map(service => 
          service._id === serviceId 
            ? { ...service, price: parseFloat(editPrice) }
            : service
        )
      );

      setEditingService(null);
      setEditPrice('');
      
      // Emit event to notify other components of price update
      const updatedService = services.find(s => s._id === serviceId);
      if (updatedService) {
        window.dispatchEvent(new CustomEvent('priceUpdated', {
          detail: {
            category: updatedService.serviceCategory,
            serviceType: updatedService.serviceType,
            newPrice: parseFloat(editPrice)
          }
        }));
      }
      
      Swal.fire({
        title: 'Success!',
        text: 'Service price updated successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Error updating price:', err);
      
      let errorMessage = 'Failed to update service price';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login as admin.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Admin privileges required.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        footer: err.response?.status === 401 || err.response?.status === 403 ? 
          '<a href="/admin/login">Click here to login as admin</a>' : null
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setEditPrice('');
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading service pricing...</p>
        </div>
      </div>
    );
  }

  const groupedServices = groupServicesByCategory();

  // Show empty state if no services
  if (!loading && services.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <FaMoneyBillWave className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Services Found</h2>
          <p className="text-gray-600 mb-6">The pricing system needs to be initialized with default service data.</p>
          <button
            onClick={fetchServicePricing}
            className="px-6 cursor-pointer py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
          >
            <FaSync />
            <span>Initialize Pricing System</span>
          </button>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Pricing Management</h1>
              <p className="text-gray-600">Manage and update pricing for all services</p>
              {/* Admin Authentication Status */}
              {/* <div className="mt-2">
                {isAdminAuthenticated() ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Admin Authenticated ({localStorage.getItem('adminEmail')})
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    ⚠ Not Authenticated - <a href="/admin/login" className="underline ml-1">Login as Admin</a>
                  </span>
                )}
              </div> */}
            </div>
            <button
              onClick={fetchServicePricing}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <FaSync className={`${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              </div>
              <FaMoneyBillWave className="text-gray-400 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Service Categories</p>
                <p className="text-2xl font-bold text-blue-600">{Object.keys(groupedServices).length}</p>
              </div>
              <FaCog className="text-blue-400 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Price Range</p>
                <div className="text-lg font-bold text-green-600">
                  {services.length > 0 ? (
                    `${formatPrice(Math.min(...services.map(s => s.price)))} - ${formatPrice(Math.max(...services.map(s => s.price)))}`
                  ) : 'No data'}
                </div>
              </div>
              <FaRupeeSign className="text-green-400 text-2xl" />
            </div>
          </div>
        </div>

        {/* Service Categories */}
        <div className="space-y-6">
          {Object.entries(groupedServices).map(([categoryKey, categoryServices]) => (
            <div key={categoryKey} className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden ${categoryColors[categoryKey] || 'bg-gray-50 border-gray-200'}`}>
              {/* Category Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {serviceIcons[categoryKey] || <FaCog className="text-gray-500" />}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{categoryMapping[categoryKey] || categoryKey}</h2>
                      <p className="text-sm text-gray-600">{categoryServices.length} services available</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Price Range</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(Math.min(...categoryServices.map(s => s.price)))} - {formatPrice(Math.max(...categoryServices.map(s => s.price)))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Service List */}
              <div className="p-6">
                <div className="grid gap-4">
                  {categoryServices.map((service, index) => (
                    <div key={service._id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{service.serviceName}</h3>
                              <p className="text-sm text-gray-600">Service Type: {service.serviceType}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {/* Price Display/Edit */}
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Current Price</p>
                            {editingService === service._id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                  className="w-24 px-2 py-1 text-lg font-bold text-center border border-gray-300 rounded"
                                  placeholder="Price"
                                  min="0"
                                />
                              </div>
                            ) : (
                              <p className="text-xl font-bold text-green-600">{formatPrice(service.price)}</p>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            {editingService === service._id ? (
                              <>
                                <button
                                  onClick={() => handleSavePrice(service._id)}
                                  disabled={saving || !isAdminAuthenticated()}
                                  className={`p-2 cursor-pointer text-white rounded-lg disabled:opacity-50 ${
                                    !isAdminAuthenticated() 
                                      ? 'bg-gray-400 cursor-not-allowed' 
                                      : 'bg-green-600 hover:bg-green-700'
                                  }`}
                                  title={!isAdminAuthenticated() ? "Admin login required" : "Save Price"}
                                >
                                  {saving ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-2 cursor-pointer bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                  title="Cancel"
                                >
                                  <FaTimes />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleEditClick(service)}
                                disabled={!isAdminAuthenticated()}
                                className={`p-2 cursor-pointer text-white rounded-lg disabled:opacity-50 ${
                                  !isAdminAuthenticated() 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                                title={!isAdminAuthenticated() ? "Admin login required to edit prices" : "Edit Price"}
                              >
                                <FaEdit />
                              </button>
                            )}
                            
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              service.isActive !== false 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {service.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <FaFileInvoiceDollar className="text-blue-500 text-xl mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Pricing Management</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Click the edit button to modify service prices in real-time</p>
                <p>• All prices are displayed in Indian Rupees (₹)</p>
                <p>• Updated prices are immediately applied to new service forms</p>
                <p>• Prices are automatically applied when admins complete services</p>
                <p>• Custom amounts can still be set during service completion if needed</p>
                <p>• Bills are generated automatically with 72-hour payment terms</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServicePricing;