import React, { useEffect, useState } from 'react';
import UserPageLoader from "./components/UserPageLoader";
import UserPageError from "./components/UserPageError";
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
  Info,
  User
} from 'lucide-react';

const MyServices = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [selectedServiceItem, setSelectedServiceItem] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchUserServices();
  }, []);

  const fetchUserServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/services/user-services');
      setServices(response.data.data);
    } catch (err) {
      console.error('Error fetching services:', err);
      if (err.response?.status === 404) {
        setError('Services API not found. Please ensure the server is running.');
      } else if (err.response?.status === 401) {
        setError('Please login to view your services.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch services');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (url) => {
    setDocumentUrl(url);
    setShowDocumentModal(true);
  };

  const handleServiceCardClick = (service) => {
    setSelectedServiceItem(service);
    setShowServiceModal(true);
  };

  const closeServiceModal = () => {
    setShowServiceModal(false);
    setSelectedServiceItem(null);
  };

  const handlePayNow = (service) => {
    // Navigate to bills page with bill ID for highlighting
    const billId = service.bill?._id;
    if (billId) {
      navigate(`/profile/bills?highlight=${billId}`);
    } else {
      navigate('/profile/bills');
    }
  };

  const getServiceIcon = (serviceType) => {
    const iconMap = {
      gst: '🧾',
      itr: '📊',
      business: '💼',
      tax: '💰',
      trademark: '®️'
    };
    return iconMap[serviceType] || '📋';
  };

  const getServiceName = (serviceType) => {
    const nameMap = {
      gst: 'GST Services',
      itr: 'ITR Services',
      business: 'Business Advisory',
      tax: 'Tax Planning',
      trademark: 'Trademark Services'
    };
    return nameMap[serviceType] || 'Service';
  };

  const getStatusBadge = (service) => {
    // Use actual status field if available, otherwise fall back to date-based logic
    const status = service.status || 'Pending';
    
    // Check if there's an unpaid bill
    const hasUnpaidBill = service.bill && service.bill.status === 'Pending';
    
    // Handle completed services with paid bills
    if (status === 'Completed' && service.bill && service.bill.status === 'Paid') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed - Paid
        </span>
      );
    }
    
    // Handle overdue bills
    if (hasUnpaidBill && isOverdue(service.bill)) {
      const overdueDays = getOverdueDays(service.bill.dueDate);
      const totalAmount = getTotalAmount(service.bill);
      const penaltyAmount = getPenaltyAmount(service.bill);
      const originalAmount = service.bill.originalAmount || service.bill.amount;
      
      return (
        <div className="flex flex-col items-end space-y-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue - ₹{totalAmount.toLocaleString()}
          </span>
          {penaltyAmount > 0 && (
            <span className="text-xs text-red-600 font-medium">
              +₹{penaltyAmount.toLocaleString()} penalty ({overdueDays} days overdue)
            </span>
          )}
          {originalAmount && originalAmount !== totalAmount && (
            <span className="text-xs text-gray-500">
              Original: ₹{originalAmount.toLocaleString()}
            </span>
          )}
        </div>
      );
    }
    
    // Handle regular pending bills
    if (hasUnpaidBill) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending Dues - ₹{getTotalAmount(service.bill).toLocaleString()}
        </span>
      );
    }
    
    const statusConfig = {
      'Pending': {
        className: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-3 h-3 mr-1" />,
        text: 'Pending'
      },
      'In Progress': {
        className: 'bg-blue-100 text-blue-800',
        icon: <RefreshCw className="w-3 h-3 mr-1" />,
        text: 'In Progress'
      },
      'Approved': {
        className: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
        text: 'Approved'
      },
      'Completed': {
        className: 'bg-purple-100 text-purple-800',
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
        text: 'Completed'
      },
      'Declined': {
        className: 'bg-red-100 text-red-800',
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
        text: 'Declined'
      }
    };

    const config = statusConfig[status] || statusConfig['Pending'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if a bill is overdue
  const isOverdue = (bill) => {
    if (!bill || !bill.dueDate) return false;
    return bill.status === 'Overdue' || (bill.status === 'Pending' && new Date(bill.dueDate) < new Date());
  };

  // Get penalty amount from backend (use actual penalty amount if available)
  const getPenaltyAmount = (bill) => {
    if (!bill) return 0;
    // Use backend calculated penalty amount if available
    return bill.penaltyAmount || 0;
  };

  // Get total amount (use backend calculated total if available)
  const getTotalAmount = (bill) => {
    if (!bill) return 0;
    // For overdue bills, use the backend calculated total amount
    // For pending bills, use the original amount
    return bill.amount || 0;
  };

  // Get overdue days
  const getOverdueDays = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = now - due;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getServiceDetails = (service, type) => {
    switch (type) {
      case 'gst':
        return {
          title: `GST ${service.serviceType}`,
          details: service.gstNumber || service.gstin || service.businessName || 'N/A',
          subType: service.serviceType
        };
      case 'itr':
        return {
          title: `ITR ${service.serviceType}`,
          details: service.pan || service.itrType || service.documentType || 'N/A',
          subType: service.serviceType
        };
      case 'business':
        return {
          title: `Business ${service.serviceType}`,
          details: service.businessType || service.companyName || 'Advisory Service',
          subType: service.serviceType
        };
      case 'tax':
        return {
          title: `Tax ${service.serviceType}`,
          details: service.planType || service.annualIncome || 'Planning Service',
          subType: service.serviceType
        };
      case 'trademark':
        return {
          title: `Trademark ${service.serviceType}`,
          details: service.trademarkName || service.applicantName || 'Application',
          subType: service.serviceType
        };
      default:
        return {
          title: 'Service',
          details: 'N/A',
          subType: 'Unknown'
        };
    }
  };

  const getAllServices = () => {
    if (!services) return [];
    
    const allServices = [];
    Object.keys(services).forEach(key => {
      if (key !== 'totalServices' && Array.isArray(services[key])) {
        services[key].forEach(service => {
          allServices.push({
            ...service,
            serviceCategory: key,
            ...getServiceDetails(service, key)
          });
        });
      }
    });
    
    return allServices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getFilteredServices = () => {
    if (selectedService === 'all') {
      return getAllServices();
    }
    return services[selectedService] ? services[selectedService].map(service => ({
      ...service,
      serviceCategory: selectedService,
      ...getServiceDetails(service, selectedService)
    })) : [];
  };

  // Pagination calculations for services
  const filteredServices = getFilteredServices();
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  // Reset to page 1 when service filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedService]);

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
              <Eye className="text-blue-500 w-5 h-5" />
              <h3 className="text-xl font-semibold text-gray-900">Document Viewer</h3>
            </div>
            <button
              onClick={() => setShowDocumentModal(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer text-xl p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
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
                  <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
                    <Eye className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </a>
                  {/* <a 
                    href={documentUrl} 
                    download
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Document
                  </a> */}
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
              {/* <a 
                href={documentUrl} 
                download
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </a> */}
              <a 
                href={documentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                <Eye className="w-4 h-4 mr-1" />
                Open in New Tab
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ServiceDetailsModal = () => {
    if (!showServiceModal || !selectedServiceItem) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4 z-50">
        <div className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Service Details</h2>
                <p className="text-sm text-gray-500">{getServiceName(selectedServiceItem.serviceCategory)}</p>
              </div>
              <button
                onClick={closeServiceModal}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-3 gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedServiceItem.title}</h3>
                  <p className="text-gray-600">{selectedServiceItem.details}</p>
                </div>
                <div className="shrink-0">{getStatusBadge(selectedServiceItem)}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Info className="w-5 h-5 text-gray-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Service Type</h4>
                  </div>
                  <p className="text-gray-700 text-transform: capitalize">{selectedServiceItem.serviceCategory || 'Not available'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Applied Date</h4>
                  </div>
                  <p className="text-gray-700">{formatDate(selectedServiceItem.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 text-gray-600 mr-2" />
                Customer Information
              </h4>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-green-700 font-medium mb-1">Name</p>
                    <p className="text-gray-900 font-semibold">{user?.name || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-medium mb-1">Email</p>
                    <p className="text-gray-900">{user?.email || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Service Notes</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">User Notes</p>
                  <p className="text-gray-800">{selectedServiceItem.notes || 'No notes added'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Admin Response</p>
                  <p className="text-gray-800">{selectedServiceItem.adminNotes || 'No admin response yet'}</p>
                </div>
              </div>
            </div>

            {selectedServiceItem.bill && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Billing Information</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-700 font-medium mb-1">Bill Status</p>
                      <p className="text-gray-900 font-semibold">{selectedServiceItem.bill.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium mb-1">Amount</p>
                      <p className="text-gray-900 font-semibold">₹{getTotalAmount(selectedServiceItem.bill).toLocaleString()}</p>
                    </div>
                    {selectedServiceItem.bill.dueDate && (
                      <div>
                        <p className="text-sm text-blue-700 font-medium mb-1">Due Date</p>
                        <p className="text-gray-900">{formatDate(selectedServiceItem.bill.dueDate)}</p>
                      </div>
                    )}
                    {selectedServiceItem.bill.billNumber && (
                      <div>
                        <p className="text-sm text-blue-700 font-medium mb-1">Invoice</p>
                        <p className="text-gray-900">{selectedServiceItem.bill.billNumber}</p>
                      </div>
                    )}
                    {selectedServiceItem.bill.paidAt && (
                      <div>
                        <p className="text-sm text-blue-700 font-medium mb-1">Payment Date</p>
                        <p className="text-gray-900">{formatDate(selectedServiceItem.bill.paidAt)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Document</h4>
              {selectedServiceItem.documentUrl ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-indigo-800 font-medium">Document attached</div>
                  <button
                    onClick={() => handleViewDocument(selectedServiceItem.documentUrl)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Preview Document
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-600">
                  No document attached for this service.
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              {(selectedServiceItem.bill && (selectedServiceItem.bill.status === 'Pending' || selectedServiceItem.bill.status === 'Overdue')) && (
                <button
                  onClick={() => {
                    closeServiceModal();
                    handlePayNow(selectedServiceItem);
                  }}
                  className={`${isOverdue(selectedServiceItem.bill)
                    ? 'bg-red-200 hover:bg-red-300'
                    : 'bg-blue-200 hover:bg-blue-300'
                  } text-gray-800 font-medium py-3 px-6 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2`}
                >
                  <CreditCard className="w-5 h-5" />
                  {isOverdue(selectedServiceItem.bill) ? 'Pay Overdue Bill' : 'Pay Bill'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <UserPageLoader />;
  }
  if (error) {
    return <UserPageError error={error} onRetry={fetchUserServices} />;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Services</h1>
            <p className="text-gray-600">Track and manage all your service applications and their status.</p>
          </div>
          <button
            onClick={fetchUserServices}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Service Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{services?.totalServices || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          {['gst', 'itr', 'business', 'tax', 'trademark'].map((serviceType) => (
            <div key={serviceType} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{getServiceName(serviceType)}</p>
                  <p className="text-xl font-bold text-gray-900">{services?.[serviceType]?.length || 0}</p>
                </div>
                <span className="text-2xl">{getServiceIcon(serviceType)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedService('all')}
            className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
              selectedService === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Services ({services?.totalServices || 0})
          </button>
          {['gst', 'itr', 'business', 'tax', 'trademark'].map((serviceType) => (
            <button
              key={serviceType}
              onClick={() => setSelectedService(serviceType)}
              className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
                selectedService === serviceType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getServiceName(serviceType)} ({services?.[serviceType]?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Services List */}
      {services?.totalServices === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-500 mb-6">You haven't applied for any services yet. Explore our services to get started!</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Explore Services
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedServices.map((service, index) => (
            <div
              key={`${service.serviceCategory}-${service._id}-${index}`}
              onClick={() => handleServiceCardClick(service)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-transparent hover:border-blue-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{getServiceIcon(service.serviceCategory)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                      <p className="text-gray-600">{service.details}</p>
                      <p className="text-sm text-gray-500">Service Type: {service.subType}</p>
                      {service.documentUrl && (
                        <div className="mt-1 inline-flex items-center text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-full">
                          Document attached
                        </div>
                      )}
                      {service.notes && (
                        <p className="text-sm text-gray-500 mt-1">Notes: {service.notes}</p>
                      )}
                      {service.adminNotes && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-md border-l-4 border-blue-400">
                          <p className="text-sm text-blue-800">
                            <span className="font-semibold">Admin Response:</span> {service.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(service)}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex flex-col text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Applied on {formatDate(service.createdAt)}
                    </div>
                    {service.bill?.status === 'Paid' && service.bill?.paidAt && (
                      <div className="mt-1 text-green-700 font-medium">
                        Paid on {formatDate(service.bill.paidAt)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 items-end">
                    {/* Overdue Warning */}
                    {service.bill && (service.bill.status === 'Pending' || service.bill.status === 'Overdue') && isOverdue(service.bill) && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-sm">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <div className="text-xs text-red-700">
                            <p className="font-semibold">Payment Overdue Warning!</p>
                            {getPenaltyAmount(service.bill) > 0 ? (
                              <p>A penalty of ₹{getPenaltyAmount(service.bill).toLocaleString()} has been added to your bill. Please pay immediately to avoid further charges.</p>
                            ) : (
                              <p>Your payment is overdue. Please pay immediately to avoid penalty charges that increase weekly.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 items-center">
                      {/* Pay Now button for services with pending or overdue bills */}
                      {service.bill && (service.bill.status === 'Pending' || service.bill.status === 'Overdue') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePayNow(service);
                          }}
                          className={`${isOverdue(service.bill) 
                            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 animate-pulse' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                          } text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200 flex items-center space-x-2 text-sm shadow-md hover:shadow-lg transform hover:scale-105`}
                          title={`Pay ${isOverdue(service.bill) ? 'overdue' : 'pending'} bill of ₹${getTotalAmount(service.bill).toLocaleString()}${isOverdue(service.bill) ? ' (includes penalty)' : ''}`}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>
                            {isOverdue(service.bill) ? 'Pay Overdue' : 'Pay'} ₹{getTotalAmount(service.bill).toLocaleString()}
                          </span>
                          {isOverdue(service.bill) && (
                            <AlertCircle className="w-3 h-3 animate-pulse" />
                          )}
                        </button>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredServices.length)} of{" "}
                  {filteredServices.length} services
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Document Modal */}
      {showDocumentModal && <DocumentModal />}

      {/* Service Details Modal */}
      {showServiceModal && <ServiceDetailsModal />}
    </div>
  );
};

export default MyServices;