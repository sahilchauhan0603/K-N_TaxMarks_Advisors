import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios';
import Swal from 'sweetalert2';
import { 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaClock,
  FaSpinner,
  FaFileInvoiceDollar,
  FaBusinessTime,
  FaLandmark,
  FaCog,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaEdit
} from 'react-icons/fa';

const AdminServices = ({ setSidebarVisible }) => {
  const [services, setServices] = useState({
    gst: [],
    itr: [],
    tax: [],
    business: [],
    trademark: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 5;

  const serviceTypeMap = {
    gst: { name: 'GST Services', icon: <FaFileInvoiceDollar className="text-blue-500" />, color: 'blue' },
    itr: { name: 'ITR Services', icon: <FaLandmark className="text-green-500" />, color: 'green' },
    tax: { name: 'Tax Planning', icon: <FaCog className="text-purple-500" />, color: 'purple' },
    business: { name: 'Business Advisory', icon: <FaBusinessTime className="text-orange-500" />, color: 'orange' },
    trademark: { name: 'Trademark Services', icon: <FaLandmark className="text-red-500" />, color: 'red' }
  };

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'Approved': 'bg-green-100 text-green-800 border-green-200',
    'Declined': 'bg-red-100 text-red-800 border-red-200'
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Hide sidebar when modal is open
  useEffect(() => {
    if (setSidebarVisible) {
      setSidebarVisible(!showModal);
    }
  }, [showModal, setSidebarVisible]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/services');
      setServices(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewService = async (serviceType, serviceId) => {
    try {
      const response = await axios.get(`/api/admin/services/${serviceType}/${serviceId}`);
      setSelectedService({ ...response.data, serviceType });
      setShowModal(true);
    } catch (err) {
      Swal.fire('Error', 'Failed to fetch service details', 'error');
    }
  };

  const handleStatusUpdate = async (status, adminNotes = '', closeModal = true) => {
    try {
      setUpdating(true);
      const { serviceType, _id } = selectedService;
      
      await axios.put(`/api/admin/services/${serviceType}/${_id}/status`, {
        status,
        adminNotes
      });

      // Only close modal if requested (for direct status updates like "In Progress")
      if (closeModal) {
        setShowModal(false);
        setTimeout(() => {
          Swal.fire('Success', 'Service status updated successfully', 'success');
        }, 100);
      } else {
        // Modal already closed, show alert immediately
        Swal.fire('Success', 'Service status updated successfully', 'success');
      }
      fetchServices(); // Refresh the services list
    } catch (err) {
      if (closeModal) {
        setShowModal(false);
        setTimeout(() => {
          Swal.fire('Error', 'Failed to update service status', 'error');
        }, 100);
      } else {
        Swal.fire('Error', 'Failed to update service status', 'error');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusUpdateWithNotes = async (status) => {
    // Close the modal first, then show the admin notes dialog
    setShowModal(false);
    
    // Wait for modal to close, then show SweetAlert
    setTimeout(async () => {
      const { value: adminNotes } = await Swal.fire({
        title: `${status} Service`,
        input: 'textarea',
        inputLabel: 'Admin Notes (Optional)',
        inputPlaceholder: 'Add any notes for this status update...',
        showCancelButton: true,
        confirmButtonText: `Mark as ${status}`,
        confirmButtonColor: status === 'Approved' ? '#10b981' : '#ef4444'
      });

      if (adminNotes !== undefined) {
        await handleStatusUpdate(status, adminNotes, false);
      }
    }, 100);
  };

  // Get all services in a flat array for filtering
  const getAllServices = () => {
    const allServices = [];
    Object.entries(services).forEach(([type, serviceArray]) => {
      serviceArray.forEach(service => {
        allServices.push({ ...service, serviceType: type });
      });
    });
    return allServices;
  };

  // Filter services based on search term, status, and service type
  const getFilteredServices = () => {
    let filtered = getAllServices();

    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(service => service.status === statusFilter);
    }

    if (serviceTypeFilter !== 'All') {
      filtered = filtered.filter(service => service.serviceType === serviceTypeFilter);
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Get paginated services
  const getPaginatedServices = () => {
    const filtered = getFilteredServices();
    const startIndex = (currentPage - 1) * servicesPerPage;
    const endIndex = startIndex + servicesPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const getTotalPages = () => {
    const filtered = getFilteredServices();
    return Math.ceil(filtered.length / servicesPerPage);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, serviceTypeFilter]);

  // Pagination handlers
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    const totalPages = getTotalPages();
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const ServiceModal = () => {
    if (!selectedService) return null;

    const serviceInfo = serviceTypeMap[selectedService.serviceType];

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/40 bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {serviceInfo.icon}
                <h3 className="text-xl font-semibold text-gray-900">
                  {serviceInfo.name} Details
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* User Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">User Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><span className="font-medium">Name:</span> {selectedService.userId?.name}</div>
                <div><span className="font-medium">Email:</span> {selectedService.userId?.email}</div>
                <div><span className="font-medium">Phone:</span> {selectedService.userId?.phone}</div>
                <div><span className="font-medium">Submitted:</span> {new Date(selectedService.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Service Details</h4>
              <div className="space-y-2 text-sm">
                {Object.entries(selectedService).map(([key, value]) => {
                  if (['_id', '__v', 'userId', 'createdAt', 'updatedAt', 'serviceType', 'status', 'adminNotes', 'documentPath', 'documentUrl'].includes(key) || !value) return null;
                  return (
                    <div key={key} className="flex">
                      <span className="font-medium capitalize mr-2 min-w-32">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span>{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Current Status</h4>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[selectedService.status]}`}>
                  {selectedService.status}
                </span>
                <span className="text-sm text-gray-600">
                  Updated: {new Date(selectedService.updatedAt || selectedService.createdAt).toLocaleDateString()}
                </span>
              </div>
              {selectedService.adminNotes && (
                <div className="mt-3">
                  <span className="font-medium text-sm">Admin Notes:</span>
                  <p className="text-sm text-gray-600 mt-1">{selectedService.adminNotes}</p>
                </div>
              )}
            </div>

            {/* Document */}
            {selectedService.documentUrl && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Attached Document</h4>
                <a 
                  href={selectedService.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                >
                  <FaEye className="w-4 h-4 mr-2" />
                  View Document
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200 flex flex-wrap gap-3">
            <button
              onClick={() => handleStatusUpdate('In Progress')}
              disabled={updating}
              className="flex-1 min-w-32 bg-blue-600 text-white px-4 cursor-pointer py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {updating ? <FaSpinner className="animate-spin" /> : <FaClock />}
              <span>Mark In Progress</span>
            </button>
            
            <button
              onClick={() => handleStatusUpdateWithNotes('Approved')}
              disabled={updating}
              className="flex-1 min-w-32 bg-green-600 text-white px-4 cursor-pointer py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {updating ? <FaSpinner className="animate-spin" /> : <FaCheck />}
              <span>Approve</span>
            </button>
            
            <button
              onClick={() => handleStatusUpdateWithNotes('Declined')}
              disabled={updating}
              className="flex-1 min-w-32 bg-red-600 text-white px-4 cursor-pointer py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {updating ? <FaSpinner className="animate-spin" /> : <FaTimes />}
              <span>Decline</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  const allFilteredServices = getFilteredServices();
  const paginatedServices = getPaginatedServices();
  const totalServices = getAllServices().length;
  const totalPages = getTotalPages();
  const pendingCount = getAllServices().filter(s => s.status === 'Pending').length;
  const approvedCount = getAllServices().filter(s => s.status === 'Approved').length;

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Management</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Manage and review all service requests from users</p>
            {allFilteredServices.length !== totalServices && (
              <p className="text-sm text-blue-600 font-medium">
                Showing {allFilteredServices.length} of {totalServices} services
              </p>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{totalServices}</p>
              </div>
              <FaCog className="text-gray-400 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <FaClock className="text-yellow-400 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <FaCheck className="text-green-400 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-blue-600">{totalServices ? Math.round((approvedCount / totalServices) * 100) : 0}%</p>
              </div>
              <FaBusinessTime className="text-blue-400 text-2xl" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by user name, email, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </select>
            
            <select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Services</option>
              <option value="gst">GST Services</option>
              <option value="itr">ITR Services</option>
              <option value="tax">Tax Planning</option>
              <option value="business">Business Advisory</option>
              <option value="trademark">Trademark Services</option>
            </select>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedServices.map((service, index) => {
                  const serviceInfo = serviceTypeMap[service.serviceType];
                  const serialNumber = (currentPage - 1) * servicesPerPage + index + 1;
                  return (
                    <tr key={`${service.serviceType}-${service._id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {serialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.userId?.name}</div>
                        <div className="text-sm text-gray-500">{service.userId?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {serviceInfo.icon}
                          <span className="text-sm font-medium text-gray-900">{serviceInfo.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${statusColors[service.status]}`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewService(service.serviceType, service._id)}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer flex items-center space-x-1"
                        >
                          {service.status === 'Pending' ? <FaEye /> : <FaEdit />}
                          <span>{service.status === 'Pending' ? 'View Details' : 'Change Status'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {allFilteredServices.length === 0 && (
            <div className="text-center py-12">
              <FaBusinessTime className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {allFilteredServices.length > servicesPerPage && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * servicesPerPage) + 1} to {Math.min(currentPage * servicesPerPage, allFilteredServices.length)} of {allFilteredServices.length} services
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg cursor-pointer border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-1"
                >
                  <FaChevronLeft className="w-3 h-3" />
                  <span>Previous</span>
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageClick(pageNumber)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg cursor-pointer border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>Next</span>
                  <FaChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {showModal && <ServiceModal />}
    </div>
  );
};

export default AdminServices;