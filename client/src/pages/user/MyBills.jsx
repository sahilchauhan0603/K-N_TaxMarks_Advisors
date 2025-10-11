import React, { useState } from "react";
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
} from "lucide-react";

// MyBills Component - Comprehensive Billing Dashboard
const MyBills = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Sample billing data
  const sampleBills = [
    {
      id: "INV-2024-001",
      service: "ITR Filing - Individual",
      date: "2024-01-15",
      dueDate: "2024-01-30",
      amount: 2500,
      status: "Paid",
      paymentMethod: "UPI",
      description: "Annual Income Tax Return Filing for FY 2023-24",
    },
    {
      id: "INV-2024-002",
      service: "GST Registration",
      date: "2024-02-10",
      dueDate: "2024-02-25",
      amount: 5000,
      status: "Pending",
      paymentMethod: "Bank Transfer",
      description: "New GST Registration for Business",
    },
    {
      id: "INV-2024-003",
      service: "Trademark Registration",
      date: "2024-02-20",
      dueDate: "2024-03-05",
      amount: 8000,
      status: "Overdue",
      paymentMethod: "Credit Card",
      description: "Brand Trademark Registration Application",
    },
    {
      id: "INV-2024-004",
      service: "Business Advisory - Premium",
      date: "2024-03-01",
      dueDate: "2024-03-15",
      amount: 6000,
      status: "Paid",
      paymentMethod: "UPI",
      description: "Monthly Business Consultation Package",
    },
    {
      id: "INV-2024-005",
      service: "Tax Planning Consultation",
      date: "2024-03-10",
      dueDate: "2024-03-25",
      amount: 2000,
      status: "Pending",
      paymentMethod: "Cash",
      description: "Annual Tax Planning Strategy Session",
    },
  ];

  // Filter bills based on search and filters
  const filteredBills = sampleBills.filter((bill) => {
    const matchesSearch =
      bill.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || bill.status === statusFilter;

    const matchesDate =
      dateFilter === "All Time" ||
      (dateFilter === "This Month" &&
        new Date(bill.date).getMonth() === new Date().getMonth()) ||
      (dateFilter === "Last 3 Months" &&
        new Date(bill.date) >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBills = filteredBills.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);

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

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bills</h1>
            <p className="text-gray-600">
              Track and manage all your invoices and payment history.
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
            <CreditCard className="w-4 h-4" />
            <span>Download All</span>
          </button>
        </div>

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
              {sampleBills.filter((bill) => bill.status === status).length})
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
              setDateFilter("All Time");
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
              key={bill.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {bill.service}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        Invoice: {bill.id}
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
                        {new Date(bill.date).toLocaleDateString("en-IN")}
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
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                    View
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors">
                    Download
                  </button>
                  {bill.status === "Pending" && (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-medium text-sm transition-colors">
                      Pay Now
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

      
    </div>
  );
};

export default MyBills;
