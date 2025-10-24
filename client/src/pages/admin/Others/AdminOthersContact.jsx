import React, { useState, useEffect } from "react";
import {
  FiMail,
  FiUser,
  FiPhone,
  FiMessageCircle,
  FiCalendar,
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
  FiDownload,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";
import { FaLightbulb, FaQuestion } from "react-icons/fa";
import axios from "../../../utils/axios";
import Swal from "sweetalert2";

const AdminOthersContact = ({ setSidebarVisible }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    source: "",
    priority: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });
  const [stats, setStats] = useState({
    statusCounts: {},
    sourceStats: {},
  });
  const [bulkActions, setBulkActions] = useState({
    selectedIds: [],
    showBulkMenu: false,
  });

  useEffect(() => {
    fetchContacts();
  }, [filters, pagination.current]);

  // Hide sidebar when modal is open
  useEffect(() => {
    if (setSidebarVisible) {
      setSidebarVisible(!showModal);
    }
  }, [showModal, setSidebarVisible]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.current,
        limit: pagination.limit,
        ...filters,
      });

      const response = await axios.get(`/api/others-contact?${queryParams}`);

      if (response.data.success) {
        setContacts(response.data.data.contacts);
        setPagination(response.data.data.pagination);
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await axios.put(`/api/others-contact/${id}`, { status });
      if (response.data.success) {
        fetchContacts();
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePriorityUpdate = async (id, priority) => {
    try {
      const response = await axios.put(`/api/others-contact/${id}`, {
        priority,
      });
      if (response.data.success) {
        fetchContacts();
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  const handleResponse = async (id, adminResponse) => {
    try {
      const response = await axios.put(`/api/others-contact/${id}`, {
        adminResponse,
        status: "resolved",
        priority: "low",
      });
      if (response.data.success) {
        fetchContacts();
        setSelectedContact(response.data.data);
      }
    } catch (error) {
      console.error("Error sending response:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Contact Submission?',
      text: 'This action cannot be undone! The contact submission will be permanently removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      zIndex: 99999  // Higher than modal's z-[9999]
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/others-contact/${id}`);
        fetchContacts();
        
        // Close modal if the deleted contact was being viewed
        if (selectedContact && selectedContact._id === id) {
          setShowModal(false);
        }
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Contact submission has been deleted successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          zIndex: 99999
        });
      } catch (error) {
        console.error("Error deleting contact:", error);
        
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete contact submission. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          zIndex: 99999
        });
      }
    }
  };

  const handleBulkAction = async (action, value) => {
    try {
      const response = await axios.patch("/api/others-contact/bulk", {
        ids: bulkActions.selectedIds,
        action,
        status: action === "update-status" ? value : undefined,
        priority: action === "update-priority" ? value : undefined,
      });

      if (response.data.success) {
        fetchContacts();
        setBulkActions({ selectedIds: [], showBulkMenu: false });
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const ContactModal = () => {
    const [responseText, setResponseText] = useState("");

    return (
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen py-4 px-4">
          {/* Backdrop with blur effect */}
          <div
            className="fixed inset-0 bg-black/40 bg-opacity-75 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal content */}
          <div className="relative bg-white rounded-lg text-left shadow-xl transform transition-all max-w-2xl w-full mx-auto">
            <div className="bg-white px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                    <FiMail className="mr-2 text-blue-500" />
                    Contact Details
                  </h2>
                  <p className="text-gray-600">
                    Submitted on{" "}
                    {new Date(selectedContact.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer rounded-full p-2 transition-colors"
                  title="Close"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Name
                      </label>
                      <p className="text-gray-800 font-medium">
                        {selectedContact.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Email
                      </label>
                      <p className="text-gray-800">{selectedContact.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Phone
                      </label>
                      <p className="text-gray-800">
                        {selectedContact.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Source Page
                      </label>
                      <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {selectedContact.source.replace("-", " ")}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Status
                      </label>
                      <select
                        value={selectedContact.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            selectedContact._id,
                            e.target.value
                          )
                        }
                        className="ml-2 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Priority
                      </label>
                      <select
                        value={selectedContact.priority}
                        onChange={(e) =>
                          handlePriorityUpdate(
                            selectedContact._id,
                            e.target.value
                          )
                        }
                        className="ml-2 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Subject and Message */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Subject
                  </label>
                  <p className="text-gray-800 font-medium mt-1">
                    {selectedContact.subject}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Message
                  </label>
                  <p className="text-gray-800 mt-1 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>

                {/* Admin Response Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Admin Response
                  </h3>
                  {selectedContact.adminResponse ? (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {selectedContact.adminResponse}
                      </p>
                      <div className="mt-2 text-sm text-gray-600">
                        Responded by {selectedContact.respondedBy?.name || selectedContact.respondedByEmail || 'Admin'} on{" "}
                        {new Date(
                          selectedContact.respondedAt
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Write your response here..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-vertical"
                        rows="4"
                      />
                      <button
                        onClick={() => {
                          if (responseText.trim()) {
                            handleResponse(selectedContact._id, responseText);
                            setResponseText("");
                          }
                        }}
                        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-6 cursor-pointer py-2 rounded-lg transition-colors"
                      >
                        Send Response
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 cursor-pointer py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center mb-4">
              <FaQuestion className="text-3xl text-slate-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">
                User Contact Submissions
              </h1>
            </div>
           
            <p className="text-gray-600 mt-2">
              Manage contact submissions from legal and info pages
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchContacts}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 cursor-pointer py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-800">
                  {pagination.total}
                </p>
              </div>
              <FiUsers className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New</p>
                <p className="text-2xl font-bold text-blue-800">
                  {stats.statusCounts.new || 0}
                </p>
              </div>
              <FiMail className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {stats.statusCounts["in-progress"] || 0}
                </p>
              </div>
              <FiClock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-800">
                  {stats.statusCounts.resolved || 0}
                </p>
              </div>
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              value={filters.source}
              onChange={(e) =>
                setFilters({ ...filters, source: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Sources</option>
              <option value="cookie-policy">Cookie Policy</option>
              <option value="faq">FAQ</option>
              <option value="privacy-policy">Privacy Policy</option>
              <option value="sitemap">Sitemap</option>
              <option value="terms">Terms</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {bulkActions.selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <p className="text-blue-800 font-medium">
              {bulkActions.selectedIds.length} contact(s) selected
            </p>
            <div className="flex space-x-2">
              <select
                onChange={(e) => {
                  const [action, value] = e.target.value.split(":");
                  if (action && value) {
                    handleBulkAction(action, value);
                  }
                }}
                className="px-3 py-1 border border-blue-300 rounded-lg text-blue-800 bg-white"
              >
                <option value="">Bulk Actions</option>
                <option value="update-status:in-progress">
                  Mark as In Progress
                </option>
                <option value="update-status:resolved">Mark as Resolved</option>
                <option value="update-status:closed">Mark as Closed</option>
                <option value="update-priority:high">Set High Priority</option>
                <option value="update-priority:urgent">
                  Set Urgent Priority
                </option>
                <option value="delete:">Delete Selected</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading contacts...</span>
            </div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiMail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No contact submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        bulkActions.selectedIds.length === contacts.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBulkActions({
                            ...bulkActions,
                            selectedIds: contacts.map((c) => c._id),
                          });
                        } else {
                          setBulkActions({
                            ...bulkActions,
                            selectedIds: [],
                          });
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={bulkActions.selectedIds.includes(contact._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkActions({
                              ...bulkActions,
                              selectedIds: [
                                ...bulkActions.selectedIds,
                                contact._id,
                              ],
                            });
                          } else {
                            setBulkActions({
                              ...bulkActions,
                              selectedIds: bulkActions.selectedIds.filter(
                                (id) => id !== contact._id
                              ),
                            });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">
                          {contact.name}
                        </p>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-800 truncate max-w-xs">
                        {contact.subject}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {contact.source.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          contact.status
                        )}`}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                          contact.priority
                        )}`}
                      >
                        {contact.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer p-1 rounded hover:bg-blue-50"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="text-red-600 hover:text-red-800 transition-colors cursor-pointer p-1 rounded hover:bg-red-50"
                          title="Delete Contact"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(pagination.current - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.current * pagination.limit,
                pagination.total
              )}{" "}
              of {pagination.total} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    current: pagination.current - 1,
                  })
                }
                disabled={pagination.current === 1}
                className="px-3 py-1 border border-gray-300 cursor-pointer rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = i + Math.max(1, pagination.current - 2);
                if (page <= pagination.pages) {
                  return (
                    <button
                      key={page}
                      onClick={() =>
                        setPagination({ ...pagination, current: page })
                      }
                      className={`px-3 py-1 border border-gray-300 rounded-lg ${
                        page === pagination.current
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                return null;
              })}
              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    current: pagination.current + 1,
                  })
                }
                disabled={pagination.current === pagination.pages}
                className="px-3 py-1 cursor-pointer border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedContact && <ContactModal />}
    </div>
  );
};

export default AdminOthersContact;
