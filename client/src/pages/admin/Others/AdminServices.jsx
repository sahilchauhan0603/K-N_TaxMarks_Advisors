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
  FaEdit,
  FaTrash
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
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');

  const serviceTypeMap = {
    gst: { 
      name: 'GST Services', 
      icon: <FaFileInvoiceDollar className="text-blue-500" />, 
      color: 'blue',
      amount: 1000 // ₹1000 for GST Services
    },
    itr: { 
      name: 'ITR Services', 
      icon: <FaLandmark className="text-green-500" />, 
      color: 'green',
      amount: 2000 // ₹2000 for ITR Services
    },
    tax: { 
      name: 'Tax Planning', 
      icon: <FaCog className="text-purple-500" />, 
      color: 'purple',
      amount: 3000 // ₹3000 for Tax Planning
    },
    business: { 
      name: 'Business Advisory', 
      icon: <FaBusinessTime className="text-orange-500" />, 
      color: 'orange',
      amount: 4000 // ₹4000 for Business Advisory
    },
    trademark: { 
      name: 'Trademark Services', 
      icon: <FaLandmark className="text-red-500" />, 
      color: 'red',
      amount: 5000 // ₹5000 for Trademark Services
    }
  };

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'Approved': 'bg-green-100 text-green-800 border-green-200',
    'Completed': 'bg-purple-100 text-purple-800 border-purple-200',
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

  const handleStatusUpdate = async (status, adminNotes = '', closeModal = true, billAmount = null, billDescription = null) => {
    try {
      setUpdating(true);
      const { serviceType, _id } = selectedService;
      
      const requestData = {
        status,
        adminNotes
      };

      // If status is completed, include billing information
      if (status === 'Completed') {
        const serviceInfo = serviceTypeMap[serviceType];
        requestData.billAmount = billAmount || serviceInfo.amount;
        requestData.billDescription = billDescription || `Payment for ${serviceInfo.name} service completion`;
      }
      
      await axios.put(`/api/admin/services/${serviceType}/${_id}/status`, requestData);

      // Only close modal if requested (for direct status updates like "In Progress")
      if (closeModal) {
        setShowModal(false);
        setTimeout(() => {
          const message = status === 'Completed' 
            ? 'Service completed and bill created successfully!' 
            : 'Service status updated successfully';
          Swal.fire('Success', message, 'success');
        }, 100);
      } else {
        // Modal already closed, show alert immediately
        const message = status === 'Completed' 
          ? 'Service completed and bill created successfully!' 
          : 'Service status updated successfully';
        Swal.fire('Success', message, 'success');
      }
      fetchServices(); // Refresh the services list
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update service status';
      if (closeModal) {
        setShowModal(false);
        setTimeout(() => {
          Swal.fire('Error', errorMessage, 'error');
        }, 100);
      } else {
        Swal.fire('Error', errorMessage, 'error');
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
      if (status === 'Completed') {
        // Special handling for completion - include billing information
        await handleCompletionWithBilling();
      } else {
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
      }
    }, 100);
  };

  const handleCompletionWithBilling = async () => {
    const serviceInfo = serviceTypeMap[selectedService.serviceType];
    const defaultAmount = serviceInfo.amount;

    const { value: formValues } = await Swal.fire({
      title: '🎉 Complete Service & Create Bill',
      html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Service:</label>
            <p class="text-gray-900 font-semibold">${serviceInfo.name}</p>
          </div>
          
          <div>
            <label for="billAmount" class="block text-sm font-medium text-gray-700 mb-1">Bill Amount (₹):</label>
            <input type="number" id="billAmount" class="swal2-input" placeholder="Enter amount" value="${defaultAmount}" min="1" step="1">
          </div>
          
          <div>
            <label for="billDescription" class="block text-sm font-medium text-gray-700 mb-1">Bill Description:</label>
            <input type="text" id="billDescription" class="swal2-input" placeholder="Enter description" value="Payment for ${serviceInfo.name} service completion">
          </div>
          
          <div>
            <label for="adminNotes" class="block text-sm font-medium text-gray-700 mb-1">Admin Notes (Optional):</label>
            <textarea id="adminNotes" class="swal2-textarea" placeholder="Add completion notes..."></textarea>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p class="text-sm text-blue-800">
              <strong>📋 What happens next:</strong><br/>
              • Service will be marked as completed<br/>
              • Bill will be created and sent to user<br/>
              • User will receive email notification<br/>
              • Payment due within 72 hours
            </p>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '✅ Complete & Create Bill',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      width: '500px',
      preConfirm: () => {
        const billAmount = document.getElementById('billAmount').value;
        const billDescription = document.getElementById('billDescription').value;
        const adminNotes = document.getElementById('adminNotes').value;
        
        if (!billAmount || billAmount <= 0) {
          Swal.showValidationMessage('Please enter a valid bill amount');
          return false;
        }
        
        if (!billDescription.trim()) {
          Swal.showValidationMessage('Please enter a bill description');
          return false;
        }
        
        return {
          billAmount: parseFloat(billAmount),
          billDescription: billDescription.trim(),
          adminNotes: adminNotes.trim()
        };
      }
    });

    if (formValues) {
      await handleStatusUpdate(
        'Completed', 
        formValues.adminNotes, 
        false, 
        formValues.billAmount, 
        formValues.billDescription
      );
    }
  };

  const handleDeleteService = async (serviceType, serviceId, serviceName, userName) => {
    const result = await Swal.fire({
      title: 'Delete Declined Service?',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Service:</strong> ${serviceName}</p>
          <p class="mb-2"><strong>User:</strong> ${userName}</p>
          <p class="text-red-600 text-sm">⚠️ This action cannot be undone!</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/admin/services/${serviceType}/${serviceId}`);
        
        Swal.fire({
          title: 'Deleted!',
          text: 'The declined service has been permanently deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        fetchServices(); // Refresh the services list
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete the service. Please try again.',
          icon: 'error'
        });
      }
    }
  };

  const handleViewDocument = (url) => {
    setDocumentUrl(url);
    setShowDocumentModal(true);
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

  const DocumentModal = () => {
    if (!showDocumentModal || !documentUrl) return null;

    const getFileExtension = (url) => {
      return url.split('.').pop().toLowerCase();
    };

    const fileExtension = getFileExtension(documentUrl);
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileExtension);
    const isPDF = fileExtension === 'pdf';

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/50 bg-opacity-50 flex items-center justify-center z-[10000] p-4">
        <div className="bg-white max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl rounded-lg">
          {/* Header - Fixed */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <FaEye className="text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-900">Document Viewer</h3>
            </div>
            <button
              onClick={() => setShowDocumentModal(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer text-xl"
            >
              <FaTimes />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-auto p-4">
            {isImage ? (
              <div className="flex justify-center min-h-full">
                <img 
                  src={documentUrl} 
                  alt="Document" 
                  className="max-w-full h-auto object-contain rounded-lg shadow-md cursor-zoom-in"
                  style={{ minHeight: '200px' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                  onClick={(e) => {
                    if (e.target.style.transform === 'scale(2)') {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.cursor = 'zoom-in';
                    } else {
                      e.target.style.transform = 'scale(2)';
                      e.target.style.cursor = 'zoom-out';
                    }
                  }}
                />
                <div className="hidden text-center py-8">
                  <p className="text-red-500 mb-4">Failed to load image</p>
                  <a 
                    href={documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Open in new tab
                  </a>
                </div>
              </div>
            ) : isPDF ? (
              <div className="h-full min-h-[500px]">
                <iframe 
                  src={documentUrl}
                  title="PDF Document"
                  className="w-full h-full border rounded-lg"
                  style={{ minHeight: '500px' }}
                  onError={() => {
                    console.error('Failed to load PDF in iframe');
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mb-6">
                  <FaEye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Preview Not Available</h4>
                  <p className="text-gray-600 mb-4">
                    This file type (.{fileExtension}) cannot be previewed in the browser.
                  </p>
                </div>
                <div className="space-y-3">
                  <a 
                    href={documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium mr-3"
                  >
                    <FaEye className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </a>
                  <a 
                    href={documentUrl} 
                    download
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                  >
                    Download Document
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Fixed */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center flex-shrink-0">
            <div className="text-sm text-gray-600 flex items-center space-x-4">
              <span>File type: {fileExtension.toUpperCase()}</span>
              {isImage && (
                <span className="text-xs text-gray-500">💡 Click image to zoom</span>
              )}
            </div>
            <div className="flex space-x-3">
              <a 
                href={documentUrl} 
                download
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
              >
                📥 Download
              </a>
              <a 
                href={documentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                🔗 Open in New Tab
              </a>
            </div>
          </div>
        </div>
      </div>
    );
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
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {serviceInfo.name} Details
                  </h3>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full border mt-1 ${statusColors[selectedService.status]}`}>
                    {selectedService.status}
                  </span>
                </div>
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
                <button 
                  onClick={() => handleViewDocument(selectedService.documentUrl)}
                  className="inline-flex items-center cursor-pointer px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium"
                >
                  <FaEye className="w-4 h-4 mr-2" />
                  View Document
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200">
            {selectedService.status === 'Completed' ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-2">
                  ✅ This service has been completed and billed.
                </p>
                <p className="text-sm text-gray-500">
                  No further actions are available.
                </p>
              </div>
            ) : selectedService.status === 'Declined' ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-3">
                  ❌ This service has been declined.
                </p>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setTimeout(() => {
                      handleDeleteService(
                        selectedService.serviceType, 
                        selectedService._id, 
                        serviceTypeMap[selectedService.serviceType].name, 
                        selectedService.userId?.name
                      );
                    }, 100);
                  }}
                  className="bg-red-100 text-red-800 border-red-200 px-4 py-2 cursor-pointer rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center space-x-2 mx-auto"
                >
                  <FaTrash />
                  <span>Delete Declined Service</span>
                </button>
              </div>
            ) : selectedService.status === 'Approved' ? (
              // Show only Complete & Bill button for approved services
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleStatusUpdateWithNotes('Completed')}
                  disabled={updating}
                  className="flex-1 min-w-48 bg-purple-600 text-white px-4 cursor-pointer py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {updating ? <FaSpinner className="animate-spin" /> : <FaFileInvoiceDollar />}
                  <span>Complete & Bill ₹{service.bill ? service.bill.amount.toLocaleString() : serviceInfo.amount.toLocaleString()}</span>
                </button>
                
                <button
                  onClick={() => handleStatusUpdateWithNotes('Declined')}
                  disabled={updating}
                  className="bg-red-100 text-red-800 border-red-200 px-4 cursor-pointer py-2 rounded-lg hover:bg-red-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {updating ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                  <span>Decline</span>
                </button>
              </div>
            ) : (
              // Show progress buttons for Pending/In Progress services
              <div className="flex flex-wrap gap-3">
                {selectedService.status === 'Pending' && (
                  <button
                    onClick={() => handleStatusUpdate('In Progress')}
                    disabled={updating}
                    className="flex-1 min-w-32 bg-blue-100 text-blue-800 border-blue-200 px-4 cursor-pointer py-2 rounded-lg hover:bg-blue-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {updating ? <FaSpinner className="animate-spin" /> : <FaClock />}
                    <span>Mark In Progress</span>
                  </button>
                )}
                
                <button
                  onClick={() => handleStatusUpdateWithNotes('Approved')}
                  disabled={updating}
                  className="flex-1 min-w-32 bg-green-100 text-green-800 border-green-200 px-4 cursor-pointer py-2 rounded-lg hover:bg-green-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {updating ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  <span>Approve</span>
                </button>
                
                <button
                  onClick={() => handleStatusUpdateWithNotes('Declined')}
                  disabled={updating}
                  className="flex-1 min-w-32 bg-red-100 text-red-800 border-red-200 px-4 cursor-pointer py-2 rounded-lg hover:bg-red-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {updating ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                  <span>Decline</span>
                </button>
              </div>
            )}
            
            {/* Workflow Info */}
            {/* <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 font-medium mb-1">Workflow:</p>
              <p className="text-xs text-blue-700">
                Pending → In Progress → Approved → <span className="font-semibold">Completed (Creates Bill)</span> | Declined
              </p>
              {selectedService.status === 'Approved' && (
                <p className="text-xs text-purple-700 mt-1 font-medium">
                  ⚡ Ready to complete! This will create a bill for the user.
                </p>
              )}
            </div> */}
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
  const completedCount = getAllServices().filter(s => s.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-[950px] mx-auto">
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
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              </div>
              <FaFileInvoiceDollar className="text-green-400 text-2xl" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-blue-600">{totalServices ? Math.round((completedCount / totalServices) * 100) : 0}%</p>
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
              <option value="Completed">Completed</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Amount</th>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          ₹{service.bill ? service.bill.amount.toLocaleString() : serviceInfo.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {service.bill ? 'Actual Bill Amount' : 'Standard Rate'}
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
                        <div className="flex items-center space-x-2">
                          {/* View/Edit button - disabled for Completed */}
                          {service.status === 'Completed' ? (
                            <button
                              onClick={() => handleViewService(service.serviceType, service._id)}
                              className="text-gray-600 hover:text-gray-800 cursor-pointer flex items-center space-x-1"
                            >
                              <FaEye />
                              <span>View Only</span>
                            </button>
                          ) : service.status === 'Declined' ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewService(service.serviceType, service._id)}
                                className="text-blue-600 hover:text-blue-900 cursor-pointer flex items-center space-x-1"
                              >
                                <FaEye />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => handleDeleteService(
                                  service.serviceType, 
                                  service._id, 
                                  serviceInfo.name, 
                                  service.userId?.name
                                )}
                                className="text-red-600 hover:text-red-900 cursor-pointer flex items-center space-x-1"
                                title="Delete declined service"
                              >
                                <FaTrash />
                                <span>Delete</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleViewService(service.serviceType, service._id)}
                              className="text-blue-600 hover:text-blue-900 cursor-pointer flex items-center space-x-1"
                            >
                              {service.status === 'Pending' ? <FaEye /> : <FaEdit />}
                              <span>{service.status === 'Pending' ? 'View Details' : 'Change Status'}</span>
                            </button>
                          )}
                        </div>
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
      {showDocumentModal && <DocumentModal />}
    </div>
  );
};

export default AdminServices;