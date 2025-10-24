import React, { useState, useEffect } from "react";
import {
  Receipt,
  Check,
  Clock,
  AlertCircle,
  CreditCard,
  TrendingUp,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Download,
  X,
  Calendar,
  User,
  FileText,
  DollarSign,
  Info,
} from "lucide-react";
import axios from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

// MyBills Component - Comprehensive Billing Dashboard
const MyBills = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [highlightedBillId, setHighlightedBillId] = useState(null);
  const itemsPerPage = 7;

  // Fetch user bills
  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/bills/user');
      setBills(response.data.bills);
      setStats(response.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Filter bills based on search and filters
  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || bill.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle URL parameters for bill highlighting
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const highlightBillId = urlParams.get('highlight');
    
    if (highlightBillId && bills.length > 0) {
      setHighlightedBillId(highlightBillId);
      
      // Find the bill in filtered results and navigate to correct page
      const billIndex = filteredBills.findIndex(bill => bill._id === highlightBillId);
      if (billIndex !== -1) {
        const targetPage = Math.floor(billIndex / itemsPerPage) + 1;
        if (targetPage !== currentPage) {
          setCurrentPage(targetPage);
        }
      }
      
      // Auto-scroll to highlighted bill after a short delay
      setTimeout(() => {
        const billElement = document.getElementById(`bill-${highlightBillId}`);
        if (billElement) {
          billElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 500);

      // Remove highlight after 8 seconds
      setTimeout(() => {
        setHighlightedBillId(null);
      }, 8000);
    }
  }, [location.search, bills, filteredBills, currentPage]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBills = filteredBills.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Calculate summary statistics
  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = filteredBills
    .filter((bill) => bill.status === "Paid")
    .reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = filteredBills
    .filter((bill) => bill.status === "Pending")
    .reduce((sum, bill) => sum + bill.amount, 0);
  const overdueAmount = filteredBills
    .filter((bill) => bill.status === "Overdue")
    .reduce((sum, bill) => sum + bill.amount, 0);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handlePayNow = async (bill) => {
    setPaymentLoading(true);
    try {
      // Create Razorpay order
      const response = await axios.post('/api/bills/create-payment-order', {
        billId: bill._id
      });

      const { order } = response.data;

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "K&N TaxMarks Advisors",
        description: `Payment for ${bill.serviceName}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post('/api/bills/verify-payment', {
              billId: bill._id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              setSuccessMessage('Payment successful! Your bill has been paid.');
              fetchBills(); // Refresh bills
            }
          } catch (error) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: "#3B82F6"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setError('Failed to initiate payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "UPI":
        return "📱";
      case "Credit Card":
        return "💳";
      case "Bank Transfer":
        return "🏦";
      case "Cash":
        return "💵";
      default:
        return "💰";
    }
  };

  // Handle bill card click to open modal
  const handleBillClick = (bill) => {
    setSelectedBill(bill);
    setShowBillModal(true);
  };

  // Close bill modal
  const closeBillModal = () => {
    setShowBillModal(false);
    setSelectedBill(null);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bills</h1>
            <p className="text-gray-600">
              Track and manage all your invoices and payment history.
            </p>
            {/* Highlight notification */}
            {highlightedBillId && (
              <div className="mt-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 animate-pulse">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Bill highlighted for payment - scroll down to see it!</span>
              </div>
            )}
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
            <CreditCard className="w-4 h-4" />
            <span>Download All</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <button 
              onClick={() => setError("")}
              className="float-right text-red-900 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
            <button 
              onClick={() => setSuccessMessage("")}
              className="float-right text-green-900 hover:text-green-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Bill Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bills</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredBills.length}
                </p>
              </div>
              <Receipt className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Amount
                </p>
                <p className="text-xl font-bold text-gray-900">
                  ₹{totalAmount.toLocaleString()}
                </p>
              </div>
              <span className="text-2xl">💰</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-xl font-bold text-gray-900">
                  ₹{paidAmount.toLocaleString()}
                </p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">
                  ₹{pendingAmount.toLocaleString()}
                </p>
              </div>
              <span className="text-2xl">⏳</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-xl font-bold text-gray-900">
                  ₹{overdueAmount.toLocaleString()}
                </p>
              </div>
              <span className="text-2xl">⚠️</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-xl font-bold text-gray-900">
                  {
                    filteredBills.filter(
                      (bill) =>
                        new Date(bill.date).getMonth() === new Date().getMonth()
                    ).length
                  }
                </p>
              </div>
              <span className="text-2xl">�</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      {/* Bill Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("All")}
            className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
              statusFilter === "All"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Bills ({filteredBills.length})
          </button>
          {["Paid", "Pending", "Overdue"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status} (
              {bills.filter((bill) => bill.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* Bills List */}
      {filteredBills.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Receipt className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No bills found
          </h3>
          <p className="text-gray-500 mb-6">
            You don't have any bills matching the selected filters.
          </p>
          <button
            onClick={() => {
              setStatusFilter("All");

              setSearchTerm("");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedBills.map((bill) => (
            <div
              key={bill._id}
              id={`bill-${bill._id}`}
              onClick={() => handleBillClick(bill)}
              className={`bg-white rounded-lg shadow p-6 hover:shadow-md transition-all duration-300 cursor-pointer ${
                highlightedBillId === bill._id 
                  ? 'border-2 border-red-500 shadow-red-100 shadow-xl bg-red-50/30' 
                  : 'border border-gray-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {bill.serviceName}
                        </h3>
                        {highlightedBillId === bill._id && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />
                            PAY NOW
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Invoice: {bill.billNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        {bill.description}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        bill.status
                      )}`}
                    >
                      {bill.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Amount</p>
                      <p className="text-sm font-semibold">
                        ₹{bill.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-sm">
                        {new Date(bill.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Due Date</p>
                      <p className="text-sm">
                        {new Date(bill.dueDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Payment Method
                      </p>
                      <div className="flex items-center gap-1">
                        <span>{getPaymentMethodIcon(bill.paymentMethod)}</span>
                        <span className="text-sm">{bill.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 lg:ml-6 flex gap-2">
                  {/* <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                    View
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors">
                    Download
                  </button> */}
                  {(bill.status === "Pending" || bill.status === "Overdue") && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePayNow(bill);
                      }}
                      disabled={paymentLoading}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded cursor-pointer font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {paymentLoading ? 'Processing...' : 'Pay Now'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredBills.length)} of{" "}
                  {filteredBills.length} results
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

      {/* Detailed Bill Modal */}
      {showBillModal && selectedBill && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Bill Details</h2>
                  <p className="text-sm text-gray-500">Invoice: {selectedBill.billNumber}</p>
                </div>
                <button
                  onClick={closeBillModal}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Service Information */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedBill.serviceName}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {selectedBill.description}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                      selectedBill.status
                    )}`}
                  >
                    {selectedBill.status}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-5 h-5 text-gray-600 mr-2" />
                  Customer Information
                </h4>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-700 font-medium mb-1">Name</p>
                      <p className="text-gray-900 font-semibold">
                        {selectedBill.userId?.name || user?.name || 'Not available'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700 font-medium mb-1">Email</p>
                      <p className="text-gray-900">
                        {selectedBill.userId?.email || user?.email || 'Not available'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700 font-medium mb-1">Phone</p>
                      <p className="text-gray-900">
                        {selectedBill.userId?.phone || user?.phone || 'Not available'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700 font-medium mb-1">Customer ID</p>
                      <p className="text-gray-900 font-mono text-sm">
                        {selectedBill.userId?._id || user?._id || 'Not available'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Amount */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Amount</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{selectedBill.amount.toLocaleString()}
                  </p>
                </div>

                {/* Status */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Info className="w-5 h-5 text-gray-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Payment Status</h4>
                  </div>
                  <p className="text-lg font-medium text-gray-700">
                    {selectedBill.status}
                  </p>
                </div>

                {/* Created Date */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Bill Date</h4>
                  </div>
                  <p className="text-lg text-gray-700">
                    {new Date(selectedBill.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </div>

                {/* Due Date */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Due Date</h4>
                  </div>
                  <p className="text-lg text-gray-700">
                    {new Date(selectedBill.dueDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              {selectedBill.paymentMethod && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Information</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getPaymentMethodIcon(selectedBill.paymentMethod)}</span>
                          <span className="font-medium text-gray-900">{selectedBill.paymentMethod}</span>
                        </div>
                      </div>
                      {selectedBill.paidAt && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Payment Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedBill.paidAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                      )}
                      {selectedBill.razorpayPaymentId && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600 mb-1">Payment ID</p>
                          <p className="font-mono text-sm bg-white p-2 rounded border">
                            {selectedBill.razorpayPaymentId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Service Details */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Service Details</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Service Type</p>
                      <p className="font-medium text-gray-900 capitalize">{selectedBill.serviceType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Service Name</p>
                      <p className="font-medium text-gray-900">{selectedBill.serviceName}</p>
                    </div>
                    {selectedBill.adminNotes && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Admin Notes</p>
                        <p className="text-gray-700 bg-white p-3 rounded border">
                          {selectedBill.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeBillModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg cursor-pointer transition-colors"
                >
                  Close
                </button>
                
                {(selectedBill.status === "Pending" || selectedBill.status === "Overdue") && (
                  <button
                    onClick={() => {
                      closeBillModal();
                      handlePayNow(selectedBill);
                    }}
                    disabled={paymentLoading}
                    className="flex-1 bg-green-200 text-gray-800 hover:bg-green-300 font-medium py-3 px-6 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    {paymentLoading ? 'Processing...' : 'Pay Now'}
                  </button>
                )}
                
                <button
                  onClick={() => {
                    // Handle download functionality
                    console.log('Download invoice for:', selectedBill.billNumber);
                  }}
                  className="flex-1 bg-blue-200 hover:bg-blue-300 text-gray-800 font-medium py-3 px-6 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default MyBills;
