import React, { useEffect, useState } from 'react';
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
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard
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
      trademark: 'Trademark'
    };
    return nameMap[serviceType] || 'Service';
  };

  const getStatusBadge = (service) => {
    // Use actual status field if available, otherwise fall back to date-based logic
    const status = service.status || 'Pending';
    
    // Check if there's an unpaid bill for any service status
    const hasUnpaidBill = service.bill && service.bill.status === 'Pending';
    
    // If there's an unpaid bill, override the display to show pending dues
    if (hasUnpaidBill) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending Dues - ₹{service.bill.amount.toLocaleString()}
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      </div>
    );
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
            <div key={`${service.serviceCategory}-${service._id}-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{getServiceIcon(service.serviceCategory)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                      <p className="text-gray-600">{service.details}</p>
                      <p className="text-sm text-gray-500">Service Type: {service.subType}</p>
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
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    Applied on {formatDate(service.createdAt)}
                  </div>
                  
                  <div className="flex space-x-2 items-center">
                    {/* Pay Now button for services with pending bills */}
                    {service.bill && service.bill.status === 'Pending' && (
                      <button
                        onClick={() => handlePayNow(service)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200 flex items-center space-x-2 text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                        title={`Pay pending bill of ₹${service.bill.amount.toLocaleString()}`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₹{service.bill.amount.toLocaleString()}</span>
                      </button>
                    )}
                    
                    {service.documentUrl && (
                      <>
                        <button
                          onClick={() => handleViewDocument(service.documentUrl)}
                          className="text-blue-600 hover:text-blue-800 p-2 cursor-pointer rounded-lg hover:bg-blue-50 transition-colors"
                          title="View document"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {/* <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = service.documentUrl;
                            link.download = `${service.title}-document`;
                            link.click();
                          }}
                          className="text-green-600 hover:text-green-800 p-2 cursor-pointer rounded-lg hover:bg-green-50 transition-colors"
                          title="Download document"
                        >
                          <Download className="w-5 h-5" />
                        </button> */}
                      </>
                    )}
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
    </div>
  );
};

export default MyServices;